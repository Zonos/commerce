/**
 * Environment variable validation using Zod
 *
 * This module provides type-safe access to environment variables,
 * with separate validation for client and server environments.
 */

import { clientEnv } from "./environment.client";
import { serverEnv } from "./environment.server";

// Export base environment utilities
export * from "./environment.base";

// Export client and server environments
export { clientEnv } from "./environment.client";
export { serverEnv } from "./environment.server";

// Export environment as a convenience
export const env = {
  ...serverEnv,
  ...clientEnv,
};
