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

export async function addItem(
  prevState: any,
  payload: {
    sku?: string;
    quantity: number;
  },
) {
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
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, id: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.items.find((line) => line.id === id);

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    sku: string;
    quantity: number;
  },
) {
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
        await updateCart({ cart, newUpdateItems: [{ ...lineItem, quantity }] });
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart({
        sku,
        quantity,
      });
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect("/checkout");
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  const cookieStore = await cookies();
  cookieStore.set("cartId", cart.id!);
  console.log("createCartAndSetCookie", cart.id);
  return cart.id;
}
