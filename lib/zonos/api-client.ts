/**
 * Zonos Elements API Client
 *
 * Example client for making requests to Zonos Elements API
 * using the platform-specific configuration.
 */

import { getZonosApiEndpoint } from "./api-config";

/**
 * Example function to calculate duties and taxes using Zonos Hello API
 */
export async function calculateDutyAndTax(
  productData: any,
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
export async function createCheckoutSession(orderData: any, redirectUrls: any) {
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
