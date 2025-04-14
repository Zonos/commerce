import "@zonos/elements";
import type {
  CartByIdPayload,
  CartByIdResponse,
  CartCreatePayload,
  CartCreateResponse,
  CartResponse,
  CartUpdatePayload,
  CartUpdateResponse,
  CurrencyCode,
} from "lib/zonos/api/baseTypes";

export type ZonosCart = CartResponse & {
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: CurrencyCode;
    };
    totalAmount: {
      amount: string;
      currencyCode: CurrencyCode;
    };
  };
  checkoutUrl: string;
};

export type ZonosCartItem = CartResponse["items"][number];
export type ZonosCartCreateOperation = {
  payload: CartCreatePayload;
  endpoint: "/api/commerce/cart/create";
  data: CartCreateResponse;
  method: "POST";
};

export type ZonosCartUpdateOperation = {
  payload: CartUpdatePayload;
  endpoint: "/api/commerce/cart/update";
  data: CartUpdateResponse;
  method: "PUT";
};

export type ZonosCartByIdOperation = {
  payload: CartByIdPayload;
  endpoint: "/api/commerce/cart/{id}";
  data: CartByIdResponse;
  method: "GET";
};
