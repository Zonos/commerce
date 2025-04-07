"use client";
import { type ReactNode, useEffect } from "react";

import { Zonos } from "@zonos/elements";

export const ZonosLayoutSetup = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Initialize Zonos into `window` API.
    window.Zonos = Zonos;

    const getCartId = async () => {
      const yourServerUrl = "http://localhost:3000/api/get-cart-id";
      const response = await fetch(yourServerUrl);
      const json = await response.json();
      return json;
    };

    // Initialize Zonos
    void window.Zonos.init({
      checkoutSettings: {
        createCartId: getCartId,
        placeOrderButtonSelector: "#checkout-button",
      },
      storeId: 7744, // Contact support for this information.
      zonosApiKey: "credential_live_7a128f4e-f192-4232-8992-94dd09eb4437", // Contact support for this information
      helloSettings: {
        onInitSuccess: async () => {
          Zonos.openHelloDialog();
        },
        productAddToCartElementSelector: ".add-to-cart",
        productDescriptionElementSelector: ".product-description",
        productDetailUrlPattern: "/products/.*$",
        productListUrlPattern: "/products",
        productTitleElementSelector: ".product-title",
        showForCountries: "ALL",
        currencyElementSelector: ".product-price",
      },
    });
  }, []);

  return children;
};
