"use client";
import { type ReactNode, useEffect, Suspense } from "react";

import { useZonosScript } from "lib/zonos/hooks/useZonosScript";

const ZonosLayoutSetupWrapper = ({ children }: { children: ReactNode }) => {
  const { scriptLoaded } = useZonosScript();

  useEffect(() => {
    if (!scriptLoaded) {
      return;
    }
    const getCartId = async () => {
      const yourServerUrl = "/api/zonos/get-cart-id";
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
          window.Zonos.openHelloDialog();
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
  }, [scriptLoaded]);

  return children;
};

export const ZonosLayoutSetup = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <ZonosLayoutSetupWrapper>{children}</ZonosLayoutSetupWrapper>
    </Suspense>
  );
};
