# Zonos Commerce

A high-performance, server-rendered Next.js App Router e-commerce application with integrated Zonos Elements for cross-border commerce.

## Overview

Zonos Commerce is a feature-rich e-commerce application built on the framework of [Next.js Commerce](https://github.com/vercel/commerce) that integrates with Zonos Elements to provide seamless cross-border shopping experiences. The platform leverages Zonos Hello for accurate duty and tax calculations and Zonos Checkout for international checkout processing.

For detailed technical specifications and architecture, please refer to [SPECS.md](./SPECS.md).

## Customization and Updates

We recommend merchants **fork this repository** rather than using it directly. By forking the repository:

1. You can make your own customizations and changes to fit your specific business needs
2. You can easily pull in upstream changes when Zonos Commerce is updated with new features or dependencies
3. You maintain full control over your codebase while benefiting from continuous improvements

To fork the repository, use GitHub's fork functionality, clone your forked repository, add the original repository as an upstream remote, and pull in updates when needed.

## Getting Started

### Prerequisites

- Node.js (version 18.x or later)
- pnpm (version 9.x or later)
- Zonos API key (obtain from the Zonos Dashboard)

### Installation

1. Clone the repository

2. Install dependencies using pnpm

3. Create a `.env.local` file in the root directory based on the `.env.example` template, which includes:

   **Required server-side variables:**
   - `CUSTOMER_GRAPH_TOKEN`: Secret token for server-side API calls to Zonos Elements
   - `NEXT_PUBLIC_SITE_NAME`: The name of your store
   - `ZONOS_REVALIDATION_SECRET`: Secret used for cache invalidation

   **Required client-side variables:**
   - `NEXT_PUBLIC_ZONOS_API_KEY`: Your Zonos API key for client-side initialization
   - `NEXT_PUBLIC_ZONOS_STORE_ID`: Your Zonos store ID
   - `NEXT_PUBLIC_ZONOS_CDN_URL`: URL to the Zonos Elements CDN
   - `NEXT_PUBLIC_SITE_NAME`: The name of your store for client-side display

   **Optional configuration variables:**
   - `DEPLOYMENT_PLATFORM`: Set to "vercel" or "cloudflare" based on deployment platform
   - `NEXT_PUBLIC_ZONOS_ENVIRONMENT`: Set to "sandbox" or "production"
   - `NEXT_PUBLIC_COMPANY_NAME`: Your company name for client-side display

The `CUSTOMER_GRAPH_TOKEN` is a secret API token that must never be exposed client-side. It is retrieved from the Zonos Dashboard under Settings > API Access and is used for all server-side API communications with Zonos Graph.

The `NEXT_PUBLIC_ZONOS_API_KEY` is an organization key used for client-side initialization of Zonos Elements. It allows verification of organization access to the graph and checks for allowed domains in the Zonos Elements API. This key is designed to be safely included in client-side code.

### Environment Variable Validation

The project uses Zod for robust environment variable validation with separate server and client environments:

- **Type Safety**: All environment variables are validated for type correctness at build time
- **Security**: Prevents accidental exposure of server-side variables to the client
- **Structure**: 
  - `lib/environment/environment.server.ts` - Server-side variables validation
  - `lib/environment/environment.client.ts` - Client-side variables validation (prefixed with `NEXT_PUBLIC_`)
  - `lib/environment/environment.base.ts` - Shared validation schemas and utilities

To use environment variables in your code:

```typescript
// Server-side code (API routes, server components)
import { serverEnv } from 'lib/environment/environment.server';
const token = serverEnv.CUSTOMER_GRAPH_TOKEN;

// Client-side code (hooks, client components)
import { clientEnv } from 'lib/environment/environment.client';
const apiKey = clientEnv.NEXT_PUBLIC_ZONOS_API_KEY;

// Anywhere (convenience export)
import { env } from 'lib/environment';
const siteName = env.NEXT_PUBLIC_SITE_NAME; // server-side context
const publicSiteName = env.NEXT_PUBLIC_SITE_NAME; // client-side context
```