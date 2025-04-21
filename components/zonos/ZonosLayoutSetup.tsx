'use client';
import { type ReactNode, Suspense, useEffect } from 'react';
import { clientEnv } from '../../lib/environment/environment.client';

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
      storeId: parseInt(clientEnv.NEXT_PUBLIC_ZONOS_STORE_ID, 10),
      zonosApiKey: clientEnv.NEXT_PUBLIC_ZONOS_API_KEY,
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
