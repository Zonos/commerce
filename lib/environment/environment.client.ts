import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import {
  environmentSchema,
  schemaUrl,
  skipEnvValidation,
} from './environment.base';

/**
 * Client-side environment variables validation schema.
 * These variables must be prefixed with NEXT_PUBLIC_
 */
export const clientEnv = createEnv({
  skipValidation: skipEnvValidation,
  clientPrefix: 'NEXT_PUBLIC_',
  onInvalidAccess: (variable) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable on the client: ${variable}`
    );
  },
  onValidationError: (error) => {
    console.error(
      '❌ Invalid client environment variables:',
      error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables');
  },
  client: {
    // Zonos API variables
    NEXT_PUBLIC_ZONOS_API_KEY: z.string(),
    NEXT_PUBLIC_ZONOS_STORE_ID: z.string(),
    NEXT_PUBLIC_ZONOS_ENVIRONMENT: environmentSchema,
    NEXT_PUBLIC_ZONOS_CDN_URL: schemaUrl,

    // Site variables
    NEXT_PUBLIC_SITE_NAME: z.string(),
    NEXT_PUBLIC_COMPANY_NAME: z.string().optional(),
  },
  runtimeEnvStrict: {
    NEXT_PUBLIC_ZONOS_API_KEY: process.env.NEXT_PUBLIC_ZONOS_API_KEY,
    NEXT_PUBLIC_ZONOS_STORE_ID: process.env.NEXT_PUBLIC_ZONOS_STORE_ID,
    NEXT_PUBLIC_ZONOS_ENVIRONMENT: process.env.NEXT_PUBLIC_ZONOS_ENVIRONMENT,
    NEXT_PUBLIC_ZONOS_CDN_URL: process.env.NEXT_PUBLIC_ZONOS_CDN_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
  },
});
