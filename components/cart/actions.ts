"use server";

import { TAGS } from "lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/zonos";
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
    await addToCart({
      sku,
      quantity,
    });
    revalidateTag(TAGS.cart);
    return null;
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
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
      return null;
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
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart({
          cart,
          newUpdateItems: [
            {
              ...lineItem, // Spread all properties from lineItem
              quantity, // Override quantity with the new value
            },
          ],
        });
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart({
        sku,
        quantity,
      });
    }

    revalidateTag(TAGS.cart);
    return null;
  } catch (error) {
    console.error(error);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  // Just ensure cart exists before redirecting
  await getCart();
  redirect("/checkout");
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  const cookieStore = await cookies();
  cookieStore.set("cartId", cart.id!);
  return cart.id;
}
