/**
 * Zonos Elements API Client
 *
 * Example client for making requests to Zonos Elements API
 * using the platform-specific configuration.
 */

import {
  zonosClient,
  type ZonosCartByIdQuery,
  type ZonosCartCreateInput,
  type ZonosCurrencyCode,
  type ZonosItemMeasurementInput,
} from "@zonos/typescript-sdk";
import { getProducts } from "lib/data-samples";

import { env } from "lib/zonos/environment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ZonosCart, ZonosCartItem } from "./types";

/**
 * This is the token to make requests to Zonos API, make sure to not expose it in client-side code.
 */
const CUSTOMER_GRAPH_TOKEN = env.CUSTOMER_GRAPH_TOKEN;

const reshapeCart = (
  cart: NonNullable<ZonosCartByIdQuery["cart"]>,
): ZonosCart => {
  const subtotalAmount = cart.items.reduce(
    (acc, item) => acc + item.amount * item.quantity,
    0,
  );
  const totalAmount =
    subtotalAmount +
    cart.adjustments.reduce((acc, adjustment) => acc + adjustment.amount, 0);
  const currencyCode = cart.items[0]?.currencyCode || "USD";
  const totalQuantity = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  return {
    organizationId: cart.organizationId,
    createdAt: cart.createdAt,
    expiresAt: cart.expiresAt,
    id: cart.id,
    adjustments: cart.adjustments,
    items: cart.items.map((item) => ({
      ...item,
      measurements:
        item.measurements?.flatMap((measurement) =>
          measurement
            ? {
                source: measurement.source,
                type: measurement.type,
                unitOfMeasure: measurement.unitOfMeasure,
                value: measurement.value,
              }
            : [],
        ) || [],
      // Exclude all null values from metadata and attributes
      metadata:
        item.metadata
          ?.map((metadata) => ({
            key: metadata?.key || "",
            value: metadata?.value || "",
          }))
          .filter((metadata) => metadata.key && metadata.value) || [],
      attributes:
        item.attributes
          ?.map((attribute) => ({
            key: attribute?.key || "",
            value: attribute?.value || "",
          }))
          .filter((attr) => attr.key && attr.value) || [],
    })),
    metadata: cart.metadata,
    totalQuantity,
    checkoutUrl: "#",
    cost: {
      totalAmount: {
        amount: totalAmount.toFixed(2),
        currencyCode: currencyCode,
      },
      subtotalAmount: {
        amount: subtotalAmount.toFixed(2),
        currencyCode: currencyCode,
      },
    },
  };
};

const buildCartCreateInput = (items: ZonosCartCreateInput["items"]) => {
  return items.map(
    (item) =>
      ({
        amount: item.amount,
        provinceOfOrigin: item.provinceOfOrigin || null,
        currencyCode: item.currencyCode,
        quantity: item.quantity,
        countryOfOrigin: item.countryOfOrigin || null,
        measurements:
          item.measurements?.flatMap((measurement) =>
            measurement
              ? ({
                  type: measurement.type,
                  unitOfMeasure: measurement.unitOfMeasure,
                  value: measurement.value,
                } satisfies ZonosItemMeasurementInput)
              : [],
          ) || [],
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        imageUrl: item.imageUrl,
        attributes: item.attributes,
        metadata: item.metadata,
        description: item.description,
      }) satisfies ZonosCartCreateInput["items"][number],
  );
};

export async function addToCart({
  sku,
  quantity,
}: {
  sku: string;
  quantity: number;
}): Promise<ZonosCart> {
  const products = await getProducts({});
  const product = products.find((product) =>
    product.variants.some((variant) => variant.id === sku),
  );
  if (!product) {
    throw new Error("Product not found");
  }

  const variant = product.variants.find((variant) => variant.id === sku)!;

  const cart = await getCart();

  const foundItem = cart?.items.find((item) => item.sku === sku);

  // If the item already exists, update the quantity
  const addedItem: ZonosCartCreateInput["items"][number] = foundItem
    ? {
        ...foundItem,
        quantity: quantity + foundItem.quantity,
      }
    : {
        // If the item doesn't exist, add it
        quantity,
        countryOfOrigin: product.countryOfOrigin,
        provinceOfOrigin: product.provinceOfOrigin,
        measurements: product.measurements || [],
        amount: Number(variant.price.amount),
        currencyCode: variant.price.currencyCode as ZonosCurrencyCode,
        description: product.description || null,
        sku: variant.id,
        productId: product.id,
        imageUrl: product.featuredImage.url,
        name: product.title,
        attributes: variant.selectedOptions.map((option) => ({
          key: option.name,
          value: option.value,
        })),
        metadata: [
          {
            key: "handle",
            value: product.handle,
          },
        ],
      };
  // merge added item with existing items from the cart
  const newItemsState = [
    ...(cart?.items.filter((item) => item.sku !== sku) || []),
    addedItem,
  ];

  const res = await zonosClient.cartUpsert({
    credentialToken: CUSTOMER_GRAPH_TOKEN,
    variables: {
      input: {
        id: cart?.id,
        items: buildCartCreateInput(newItemsState),
        adjustments: cart?.adjustments || [],
        metadata: cart?.metadata || [],
      },
    },
  });

  if (!res.json?.cartUpsert) {
    throw new Error("Failed to create cart");
  }

  return reshapeCart(res.json.cartUpsert);
}

export async function removeFromCart({
  cart,
  itemIds,
}: {
  cart: ZonosCart;
  itemIds: string[];
}): Promise<ZonosCart> {
  // remove items from the cart items
  const newItemsState = cart.items.filter((item) => !itemIds.includes(item.id));

  const res = await zonosClient.cartUpsert({
    credentialToken: CUSTOMER_GRAPH_TOKEN,
    variables: {
      input: {
        id: cart.id,
        items: buildCartCreateInput(newItemsState),
        adjustments: cart.adjustments,
        metadata: cart.metadata,
      },
    },
  });

  if (!res.json?.cartUpsert) {
    throw new Error("Failed to delete cart items");
  }

  const cookieStore = await cookies();
  cookieStore.set("cartId", res.json.cartUpsert.id);

  return reshapeCart(res.json.cartUpsert);
}

export async function updateCart({
  cart,
  newUpdateItems,
}: {
  cart: ZonosCart;
  newUpdateItems: ZonosCartItem[];
}): Promise<ZonosCart> {
  // merge new update items with the existing cart items, remove duplicates
  const newItems: ZonosCartCreateInput["items"] = [
    ...cart.items.filter(
      (item) => !newUpdateItems.some((newItem) => newItem.id === item.id),
    ),
    ...newUpdateItems,
  ];

  const res = await zonosClient.cartUpsert({
    credentialToken: CUSTOMER_GRAPH_TOKEN,
    variables: {
      input: {
        id: cart.id,
        items: buildCartCreateInput(newItems),
        adjustments: cart.adjustments,
        metadata: cart.metadata,
      },
    },
  });

  if (!res.json?.cartUpsert) {
    throw new Error("Failed to update cart");
  }

  return reshapeCart(res.json.cartUpsert);
}

export async function renewCartIfExpired(cart: ZonosCart): Promise<ZonosCart> {
  // Still valid, return the cart
  if (!cart.expiresAt || new Date(cart.expiresAt) > new Date()) {
    return reshapeCart(cart);
  }

  const res = await zonosClient.cartUpsert({
    credentialToken: CUSTOMER_GRAPH_TOKEN,
    variables: {
      input: {
        id: cart.id,
        items: buildCartCreateInput(cart.items),
        adjustments: cart.adjustments,
        metadata: cart.metadata,
      },
    },
  });

  if (!res.json?.cartUpsert) {
    throw new Error(res.errors?.join(", ") || "Failed to renew cart");
  }

  return reshapeCart(res.json.cartUpsert);
}

export async function getCart(): Promise<ZonosCart | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await zonosClient.cartById({
    credentialToken: CUSTOMER_GRAPH_TOKEN,
    variables: {
      id: cartId,
    },
  });

  if (!res.json?.cart) {
    return undefined;
  }

  return reshapeCart(res.json.cart);
}

// This is largely irrelevant at this time. We will implement this when we hook up Zonos catalog.
// This is called from `app/api/zonos/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(): Promise<NextResponse> {
  // We can implement revalidation logic later, for now we just return a 200.
  return NextResponse.json({ status: 200 });
}
