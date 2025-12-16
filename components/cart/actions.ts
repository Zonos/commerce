"use server";

import { TAGS } from "lib/constants";
import { addToCart, getCart, removeFromCart, updateCart } from "lib/zonos";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Define types for server actions
export type ActionState = string | void | null;
type CartItemPayload = {
  sku?: string;
  quantity: number;
};

export async function addItem(
  prevState: ActionState | null,
  payload: CartItemPayload,
): Promise<ActionState> {
  const { sku, quantity } = payload;
  if (!sku) {
    return "Error adding item to cart";
  }

  try {
    const cartResult = await addToCart({
      sku,
      quantity,
    });

    const cookieStore = await cookies();
    cookieStore.set("cartId", cartResult?.id);

    revalidateTag(TAGS.cart, "seconds");
  } catch {
    return "Error adding item to cart";
  }
}

export async function removeItem(
  prevState: ActionState | null,
  id: string,
): Promise<ActionState> {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.items.find((line) => line.id === id);

    if (lineItem && lineItem.id) {
      const cartResult = await removeFromCart({ cart, itemIds: [lineItem.id] });

      // Set the cartId to the cookie
      const cookieStore = await cookies();
      cookieStore.set("cartId", cartResult.id);

      revalidateTag(TAGS.cart, "seconds");
    } else {
      return "Item not found in cart";
    }
  } catch {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: ActionState | null,
  payload: {
    sku: string;
    quantity: number;
  },
): Promise<ActionState> {
  const { sku, quantity } = payload;
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.items.find((line) => line.sku === sku);

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        const cartResult = await removeFromCart({
          cart,
          itemIds: [lineItem.id],
        });

        // Set the cartId to the cookie
        const cookieStore = await cookies();
        cookieStore.set("cartId", cartResult.id);
      } else {
        const cartResult = await updateCart({
          cart,
          newUpdateItems: [
            {
              ...lineItem, // Spread all properties from lineItem
              quantity, // Override quantity with the new value
            },
          ],
        });
        const cookieStore = await cookies();
        cookieStore.set("cartId", cartResult.id);
      }
    } else if (quantity > 0) {
      const cartResult = await addToCart({
        // If the item doesn't exist in the cart and quantity > 0, add it
        sku,
        quantity,
      });

      // Set the cartId to the cookie
      const cookieStore = await cookies();
      cookieStore.set("cartId", cartResult.id);
    }

    revalidateTag(TAGS.cart, "seconds");
  } catch (error) {
    console.error(error);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  redirect("/checkout");
}

export async function retrieveCartAndSetCookie() {
  const cart = await getCart();

  const cookieStore = await cookies();
  if (cart?.id) {
    cookieStore.set("cartId", cart.id);
  }
  return cart?.id;
}
