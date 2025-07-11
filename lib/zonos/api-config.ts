/**
 * Zonos Elements API Configuration
 *
 * Selects the appropriate API URL based on the deployment platform
 * with fallback logic.
 */
import { serverEnv } from "./environment/environment.server";

const DEFAULT_FALLBACK_URL = "https://route.elements.zonos.com";

/**
 * Get the appropriate Zonos Elements API URL based on the deployment platform
 * with fallback logic.
 */
export function getZonosApiUrl(): string {
  // First check if there's a custom default URL specified
  if (serverEnv.ZONOS_DEFAULT_URL) {
    return serverEnv.ZONOS_DEFAULT_URL;
  }

  // Default fallback
  return DEFAULT_FALLBACK_URL;
}

/**
 * Get the API URL for a specific endpoint
 */
export function getZonosApiEndpoint(endpoint: string): string {
  const baseUrl = getZonosApiUrl();
  // Ensure we don't have double slashes when joining paths
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;
  return `${baseUrl}/${normalizedEndpoint}`;
}
