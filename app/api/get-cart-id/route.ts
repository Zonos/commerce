import { createCartAndSetCookie } from 'components/cart/actions';
import { getCart } from 'lib/zonos';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const cart = await getCart();
  if (!cart) {
    const cartId = await createCartAndSetCookie();
    return NextResponse.json({ cartId });
  }
  return NextResponse.json({ cartId: cart.id });
}
