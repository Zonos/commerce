"use client";

import type { Product, ProductVariant } from "lib/data-samples/types";
import type { CurrencyCode } from "lib/zonos/api/baseTypes";
import type { ZonosCart, ZonosCartItem } from "lib/zonos/types";
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

type UpdateType = "plus" | "minus" | "delete";

type ZonosCartAction =
  | {
      type: "UPDATE_ITEM";
      payload: {
        variant: { id?: string; quantity: number };
        updateType: UpdateType;
      };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

type CartContextType = {
  cartPromise: Promise<ZonosCart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function updateCartItem(
  item: ZonosCartItem,
  updateType: UpdateType,
): ZonosCartItem | null {
  if (updateType === "delete") return null;

  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity === 0) return null;

  return {
    ...item,
    quantity: newQuantity,
  };
}

function createOrUpdateCartItem(
  existingItem: ZonosCartItem | undefined,
  variant: ProductVariant,
  product: Product,
): ZonosCartItem {
  const quantity = existingItem ? existingItem.quantity + 1 : 1;

  return {
    currencyCode: variant.price.currencyCode as CurrencyCode,
    quantity,
    id: existingItem?.id ?? "",
    restriction: existingItem?.restriction || undefined,
    amount: Number(variant.price.amount),
    attributes: variant.selectedOptions.map((option) => ({
      key: option.name,
      value: option.value,
    })),
    description: existingItem?.description ?? product.description,
    imageUrl: existingItem?.imageUrl ?? product.featuredImage.url,
    name: existingItem?.name ?? product.title,
    sku: variant.id,
    productId: product.id,
    metadata: existingItem?.metadata || [
      {
        key: "handle",
        value: product.handle,
      },
    ],
  };
}

function updateCartTotals(
  items: ZonosCartItem[],
): Pick<ZonosCart, "totalQuantity" | "cost"> {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);
  const currencyCode = items[0]?.currencyCode || "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
    },
  };
}

function createEmptyCart(): ZonosCart {
  return {
    id: "",
    items: [],
    metadata: [],
    adjustments: [],
    totalQuantity: 0,
    checkoutUrl: "#",
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

function cartReducer(
  state: ZonosCart | undefined,
  action: ZonosCartAction,
): ZonosCart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { variant, updateType } = action.payload;
      const updatedItems = currentCart.items
        .map((item) =>
          item.sku === variant.id ? updateCartItem(item, updateType) : item,
        )
        .filter(Boolean) as ZonosCartItem[];

      if (updatedItems.length === 0) {
        return {
          ...currentCart,
          items: [],
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedItems),
        items: updatedItems,
      };
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.items.find(
        (item) => item.sku === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
      );

      const updatedItems = existingItem
        ? currentCart.items.map((item) =>
            item.sku === variant.id ? updatedItem : item,
          )
        : [...currentCart.items, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedItems),
        items: updatedItems,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<ZonosCart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const initialCart = use(context.cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer,
  );

  return useMemo(() => {
    // Define functions inside useMemo to avoid recreating them on each render
    const updateCartItem = (
      variant: { id?: string; quantity: number },
      updateType: UpdateType,
    ) => {
      updateOptimisticCart({
        type: "UPDATE_ITEM",
        payload: { variant, updateType },
      });
    };

    const addCartItem = (variant: ProductVariant, product: Product) => {
      updateOptimisticCart({ type: "ADD_ITEM", payload: { variant, product } });
    };

    const removeCartItem = (sku: string) => {
      updateOptimisticCart({
        type: "UPDATE_ITEM",
        payload: { variant: { id: sku, quantity: 0 }, updateType: "delete" },
      });
    };

    return {
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
      removeCartItem,
    };
  }, [optimisticCart, updateOptimisticCart]);
}
