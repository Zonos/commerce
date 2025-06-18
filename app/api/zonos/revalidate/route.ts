import { revalidate } from "lib/zonos";
import type { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  return revalidate();
}
