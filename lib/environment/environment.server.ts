import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import {
  deploymentPlatformSchema,
  schemaUrl,
  skipEnvValidation,
} from "./environment.base";

/**
 * Server-side environment variables validation schema.
 * These variables are only available on the server side.
 */
export const serverEnv = createEnv({
  skipValidation: skipEnvValidation,
  server: {
    // Zonos API variables
    CUSTOMER_GRAPH_TOKEN: z.string(),
    ZONOS_DEFAULT_URL: schemaUrl.optional(),
    ZONOS_REVALIDATION_SECRET: z.string(),

    // Site information
    SITE_NAME: z.string(),

    // Deployment information
    DEPLOYMENT_PLATFORM: deploymentPlatformSchema,

    // Vercel information (automatically available in Vercel deployments)
    VERCEL_PROJECT_PRODUCTION_URL: z.string().url().optional(),
  },
  onValidationError: (error) => {
    console.error(
      "❌ Invalid server environment variables:",
      error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  },
  runtimeEnvStrict: {
    CUSTOMER_GRAPH_TOKEN: process.env.CUSTOMER_GRAPH_TOKEN,
    ZONOS_DEFAULT_URL: process.env.ZONOS_DEFAULT_URL,
    ZONOS_REVALIDATION_SECRET: process.env.ZONOS_REVALIDATION_SECRET,
    SITE_NAME: process.env.SITE_NAME,
    DEPLOYMENT_PLATFORM: process.env.DEPLOYMENT_PLATFORM,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  },
});
