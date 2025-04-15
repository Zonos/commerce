'use client';
import { type ReactNode, Suspense, useEffect } from 'react';

const ZonosLayoutSetupWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const getCartId = async () => {
      const yourServerUrl = '/api/zonos/get-cart-id';
      const response = await fetch(yourServerUrl);
      const json = await response.json();
      return json;
    };

    if (!window.Zonos) {
      return;
    }

    // Initialize Zonos
    void window.Zonos.init({
      checkoutSettings: {
        createCartId: getCartId,
        placeOrderButtonSelector: '#checkout-button',
      },
      storeId: 7744, // Contact support for this information.
      zonosApiKey: 'credential_live_7a128f4e-f192-4232-8992-94dd09eb4437', // Contact support for this information
      helloSettings: {
        onInitSuccess: async () => {
          window.Zonos.openHelloDialog();
        },
        productAddToCartElementSelector: '.add-to-cart',
        productDescriptionElementSelector: '.product-description',
        productDetailUrlPattern: '/products/.*$',
        productListUrlPattern: '/products',
        productTitleElementSelector: '.product-title',
        showForCountries: 'ALL',
        currencyElementSelector: '.product-price',
      },
    });
  }, []);

  return children;
};

export const ZonosLayoutSetup = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <ZonosLayoutSetupWrapper>{children}</ZonosLayoutSetupWrapper>
    </Suspense>
  );
};
