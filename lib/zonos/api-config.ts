/**
 * Zonos Elements API Configuration
 *
 * Selects the appropriate API URL based on the deployment platform
 * with fallback logic.
 */

// Type declaration for Node.js process in environments that may not have it
declare const process: {
  env: {
    DEPLOYMENT_PLATFORM?: string;
    ZONOS_DEFAULT_URL?: string;
  };
};

const VERCEL_ZONOS_API_URL = 'https://route.js.zonos.com';
const CLOUDFLARE_ZONOS_API_URL = 'https://route.elements.zonos.com';
const DEFAULT_FALLBACK_URL = 'https://route.elements.zonos.com';

/**
 * Get the appropriate Zonos Elements API URL based on the deployment platform
 * with fallback logic.
 */
export function getZonosApiUrl(): string {
  // Get the deployment platform from environment variable
  const deploymentPlatform = process.env.DEPLOYMENT_PLATFORM?.toLowerCase();

  // First check if there's a custom default URL specified
  if (process.env.ZONOS_DEFAULT_URL) {
    return process.env.ZONOS_DEFAULT_URL;
  }

  // Select URL based on platform with fallback
  if (deploymentPlatform === 'vercel') {
    return VERCEL_ZONOS_API_URL;
  } else if (deploymentPlatform === 'cloudflare') {
    return CLOUDFLARE_ZONOS_API_URL;
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
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint.substring(1)
    : endpoint;
  return `${baseUrl}/${normalizedEndpoint}`;
}
