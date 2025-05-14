'use client';
import { type ReactNode, Suspense, useEffect } from 'react';
import { ZONOS_CONFIG } from '../../lib/zonos/constants';
import { clientEnv } from '../../lib/zonos/environment/environment.client';

const ZonosLayoutSetupWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const getCartId = async () => {
      const response = await fetch('/api/zonos/get-cart-id');
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
        placeOrderButtonSelector: ZONOS_CONFIG.PLACE_ORDER_BUTTON,
      },
      storeId: parseInt(clientEnv.NEXT_PUBLIC_ZONOS_STORE_ID, 10),
      zonosApiKey: clientEnv.NEXT_PUBLIC_ZONOS_API_KEY,
      helloSettings: {
        onInitSuccess: async () => {
          window.Zonos.openHelloDialog();
        },
        productAddToCartElementSelector: ZONOS_CONFIG.PRODUCT_ADD_TO_CART,
        productDescriptionElementSelector: ZONOS_CONFIG.PRODUCT_DESCRIPTION,
        productDetailUrlPattern: ZONOS_CONFIG.PRODUCT_DETAIL,
        productListUrlPattern: ZONOS_CONFIG.PRODUCT_LIST,
        productTitleElementSelector: ZONOS_CONFIG.PRODUCT_TITLE,
        showForCountries: ZONOS_CONFIG.SHOW_FOR_COUNTRIES,
        currencyElementSelector: ZONOS_CONFIG.PRODUCT_PRICE,
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
