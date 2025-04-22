/**
 * Zonos Elements API Client
 *
 * Example client for making requests to Zonos Elements API
 * using the platform-specific configuration.
 */

import { getZonosApiEndpoint } from "./api-config";

// Define interfaces for the API parameters
interface ProductData {
  id: string;
  price: number;
  quantity: number;
  description: string;
  countryOfOrigin?: string;
  weight?: {
    value: number;
    unit: string;
  };
  [key: string]: unknown;
}

interface CheckoutRedirectUrls {
  success: string;
  cancel: string;
  webhook?: string;
}

interface OrderData {
  id: string;
  currency: string;
  items: Array<{
    id: string;
    price: number;
    quantity: number;
    description: string;
  }>;
  [key: string]: unknown;
}

/**
 * Example function to calculate duties and taxes using Zonos Hello API
 */
export async function calculateDutyAndTax(
  productData: ProductData,
  destinationCountry: string,
) {
  try {
    const endpoint = "hello/calculate";
    const apiUrl = getZonosApiEndpoint(endpoint);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZONOS_API_KEY}`,
      },
      body: JSON.stringify({
        products: [productData],
        destination: {
          country: destinationCountry,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calculating duty and tax:", error);
    throw error;
  }
}

/**
 * Example function to create a checkout session using Zonos Checkout API
 */
export async function createCheckoutSession(
  orderData: OrderData,
  redirectUrls: CheckoutRedirectUrls,
) {
  try {
    const endpoint = "checkout/sessions";
    const apiUrl = getZonosApiEndpoint(endpoint);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZONOS_API_KEY}`,
      },
      body: JSON.stringify({
        order: orderData,
        redirectUrls,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
