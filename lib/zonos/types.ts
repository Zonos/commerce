import "@zonos/elements";
import type {
  ZonosCartCreateInput,
  ZonosCurrencyCode,
} from "@zonos/typescript-sdk";
import type { CartResponse } from "lib/zonos/api/baseTypes";

export type ZonosCart = CartResponse & {
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: ZonosCurrencyCode;
    };
    totalAmount: {
      amount: string;
      currencyCode: ZonosCurrencyCode;
    };
  };
  checkoutUrl: string;
};

export type ZonosCartItem = CartResponse["items"][number];

export type ZonosCartCreateItem = ZonosCartCreateInput["items"][number];
