/**
 * Zonos Elements API Client
 *
 * Example client for making requests to Zonos Elements API
 * using the platform-specific configuration.
 */

import { getProducts } from "lib/data-samples";
import { getZonosApiEndpoint } from "lib/zonos/api-config";
import type { CartResponse, CurrencyCode } from "lib/zonos/api/baseTypes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  type ZonosCart,
  type ZonosCartByIdOperation,
  type ZonosCartCreateOperation,
  type ZonosCartItem,
  type ZonosCartUpdateOperation,
} from "./types";

// Type declaration for Node.js process in environments that may not have it
declare const process: {
  env: {
    CUSTOMER_GRAPH_TOKEN?: string;
  };
};

/**
 * This is the token to make requests to Zonos API, make sure to not expose it in client-side code.
 */
const CUSTOMER_GRAPH_TOKEN = process.env.CUSTOMER_GRAPH_TOKEN!;

type ExtractPayload<T> = T extends { payload: object } ? T["payload"] : never;

export async function zonosFetch<
  T extends { endpoint: string; data: unknown; method: "GET" | "POST" | "PUT" },
>({
  endpoint,
  headers,
  method,
  body,
}: {
  endpoint: T["endpoint"];
  headers?: HeadersInit;
  method: T["method"];
  body: ExtractPayload<T>;
}): Promise<T["data"] | never> {
  try {
    const hasDynamicEndpoint = endpoint.toString().includes("{");
    let resolvedEndpoint = endpoint;

    // If the method is GET and the endpoint has dynamic parts, replace them with values from body
    if (method === "GET" && hasDynamicEndpoint && typeof body === "object") {
      Object.entries(body).forEach(([key, value]) => {
        if (resolvedEndpoint.includes(`{${key}}`)) {
          resolvedEndpoint = resolvedEndpoint.replace(`{${key}}`, value);
        }
      });
    }

    /**
     * getZonosApiEndpoint returns the correct API URL based on the deployment platform
     * with fallback logic.
     */
    const apiUrl = getZonosApiEndpoint(resolvedEndpoint);
    const formattedUrl = new URL(apiUrl);

    // Add remaining parameters as query params for GET requests
    if (method === "GET" && typeof body === "object") {
      Object.entries(body).forEach(([key, value]) => {
        // Skip the parameters used in path replacement
        if (!hasDynamicEndpoint || !endpoint.includes(`{${key}}`)) {
          formattedUrl.searchParams.set(key, value);
        }
      });
    }

    const result = await fetch(formattedUrl.toString(), {
      method,
      headers: {
        "Content-Type": "application/json",
        credentialToken: CUSTOMER_GRAPH_TOKEN,
        ...headers,
      },
      body: method === "GET" ? undefined : JSON.stringify(body),
    });
    const content = await result.text();

    const json = JSON.parse(content);

    if (json.errors) {
      throw json.errors;
    }

    return json;
  } catch (e) {
    throw e;
  }
}

const reshapeCart = (cart: CartResponse): ZonosCart => {
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
    ...cart,
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

export async function createCart(): Promise<ZonosCart> {
  const res = await zonosFetch<ZonosCartCreateOperation>({
    endpoint: "/api/commerce/cart/create",
    body: {
      items: [],
      adjustments: [],
    },
    method: "POST",
  });
  return reshapeCart(res);
}

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

  let cart = await getCart();

  if (!cart) {
    cart = await createCart();
  }

  const foundItem = cart.items.find((item) => item.sku === sku);

  // If the item already exists, update the quantity
  const addedItem = foundItem
    ? {
        ...foundItem,
        quantity: quantity + foundItem.quantity,
      }
    : {
        // If the item doesn't exist, add it
        quantity,
        amount: Number(variant.price.amount),
        currencyCode: variant.price.currencyCode as CurrencyCode,
        description: product.description,
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

  const itemsAdd: ZonosCartUpdateOperation["payload"]["itemsAdd"] = [
    // Exclude the item matching the sku
    ...cart.items.flatMap((item) =>
      item.sku !== sku
        ? {
            ...item,
            id: undefined,
          }
        : [],
    ),
    addedItem,
  ];

  const res = await zonosFetch<ZonosCartUpdateOperation>({
    endpoint: "/api/commerce/cart/update",
    body: {
      id: cart.id,
      itemsAdd,
      itemsRemove: cart.items.map((item) => item.id),
    },
    method: "PUT",
  });
  return reshapeCart(res);
}

export async function removeFromCart(itemIds: string[]): Promise<ZonosCart> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value!;
  const res = await zonosFetch<ZonosCartUpdateOperation>({
    endpoint: "/api/commerce/cart/update",
    body: {
      id: cartId,
      itemsRemove: itemIds,
    },
    method: "PUT",
  });

  return reshapeCart(res);
}

export async function updateCart({
  cart,
  newUpdateItems,
}: {
  cart: ZonosCart;
  newUpdateItems: ZonosCartItem[];
}): Promise<ZonosCart> {
  const res = await zonosFetch<ZonosCartUpdateOperation>({
    endpoint: "/api/commerce/cart/update",
    body: {
      id: cart.id,
      adjustments: cart.adjustments.map((adjustment) => ({
        ...adjustment,
        productId: adjustment.productId || undefined,
        description: adjustment.description || undefined,
        sku: adjustment.sku || undefined,
      })),
      itemsAdd: newUpdateItems.map((item) => ({
        ...item,
        id: undefined,
        description: item.description || undefined,
        sku: item.sku || undefined,
        productId: item.productId || undefined,
        imageUrl: item.imageUrl || undefined,
        name: item.name || undefined,
      })),
      itemsRemove: newUpdateItems.map((item) => item.id),
    },
    method: "PUT",
  });

  return reshapeCart(res);
}

export async function getCart(): Promise<ZonosCart | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await zonosFetch<ZonosCartByIdOperation>({
    endpoint: "/api/commerce/cart/{id}",
    body: {
      id: cartId,
    },
    method: "GET",
  });

  return reshapeCart(res);
}

// This is largely irrelevant at this time. We will implement this when we hook up Zonos catalog.
// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We can implement revalidation logic later, for now we just return a 200.
  return NextResponse.json({ status: 200 });
}
