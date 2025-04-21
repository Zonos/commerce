import { z } from 'zod';

import { parseBooleanEnv } from '../utils/parseBooleanEnv';

export const inProdEnvironment = process.env.NODE_ENV === 'production';
export const inTestEnvironment = process.env.NODE_ENV === 'test';
export const isClientSide = typeof window !== 'undefined';
export const inVercel = !!process.env.VERCEL;
export const inCiOutsideVercel = !!process.env.CI && !inVercel;

// Skip validation in test environments unless explicitly requested
export const skipEnvValidation =
  (inTestEnvironment || inCiOutsideVercel) &&
  !parseBooleanEnv(process.env.NEXT_PUBLIC_VALIDATE_ENV);

// Common schema definitions
export const schemaUrl = z
  .string()
  .url()
  .refine((val) => !val.endsWith('/'), {
    message: 'URLs cannot have a trailing slash',
  });

// Deployment platform validation
export const deploymentPlatformSchema = z
  .enum(['vercel', 'cloudflare'])
  .optional();

// Environment validation schema
export const environmentSchema = z
  .enum(['sandbox', 'production'])
  .default('sandbox');
