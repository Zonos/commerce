import "@zonos/elements";
import { ShowForCountries } from "@zonos/elements";

type ZonosConfig = {
  PLACE_ORDER_BUTTON: string;
  PRODUCT_ADD_TO_CART: string;
  PRODUCT_DESCRIPTION: string;
  PRODUCT_TITLE: string;
  PRODUCT_PRICE: string;
  PRODUCT_DETAIL: string;
  PRODUCT_LIST: string;
  SHOW_FOR_COUNTRIES: ShowForCountries;
};

// Consolidated Zonos configuration object with proper typing
export const ZONOS_CONFIG: ZonosConfig = {
  PLACE_ORDER_BUTTON: "#checkout-button",
  PRODUCT_ADD_TO_CART: ".add-to-cart",
  PRODUCT_DESCRIPTION: ".product-description",
  PRODUCT_TITLE: ".product-title",
  PRODUCT_PRICE: ".product-price",
  PRODUCT_DETAIL: "/products/.*$",
  PRODUCT_LIST: "/products",
  // ALL, ONLY_SHIPPABLE, CountryCode[]
  SHOW_FOR_COUNTRIES: "ALL",
};
