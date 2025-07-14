import { getCart } from "lib/zonos";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const cart = await getCart();
  if (!cart) {
    return NextResponse.json({ cartId: null });
  }

  return NextResponse.json({ cartId: cart.id });
}
