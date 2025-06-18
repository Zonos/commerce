# Zonos Commerce

A high-performance, server-rendered Next.js App Router e-commerce application with integrated Zonos Elements for cross-border commerce.

## Overview

Zonos Commerce is a feature-rich e-commerce application built on the framework of [Next.js Commerce](https://github.com/vercel/commerce) that integrates with Zonos Elements to provide seamless cross-border shopping experiences. The platform leverages Zonos Hello for accurate duty and tax calculations and Zonos Checkout for international checkout processing.

For detailed technical specifications and architecture, please refer to [SPECS.md](./SPECS.md).

## Sample Data

The project comes with sample data for demonstration purposes. These files are located in:
- `/lib/data-samples/samples/products.ts` - Sample product data
- `/lib/data-samples/samples/collections.ts` - Sample collection data
- `/lib/data-samples/samples/pages.ts` - Sample page content
- `/lib/data-samples/samples/menu.ts` - Sample menu structure

For production use, you should replace these sample files with your actual data by modifying these files or implementing custom data fetching logic.

## Zonos Integration Structure

This project contains three primary Zonos-specific directories that should **not be modified** as they contain critical integration code:

1. **`app/api/zonos/`** - Server API routes for Zonos communication
2. **`components/zonos/`** - UI components that integrate with Zonos Elements
3. **`lib/zonos/`** - Core functions, types, and utilities for Zonos integration

**Exception:** The `lib/zonos/constants.ts` file is designed to be customized. This is where you configure your element selectors, URL paths, and other options for Zonos Elements initialization.

```typescript
// Example configuration in lib/zonos/constants.ts
export const ZONOS_CONFIG: ZonosConfig = {
  PLACE_ORDER_BUTTON: '#your-checkout-button',
  PRODUCT_ADD_TO_CART: '.your-add-to-cart-class',
  // Additional selectors...
};
```

The `ZonosConfig` type is defined in `lib/zonos/constants.ts` and provides proper typing for all available configuration options. This typed interface ensures you're using valid configuration properties for Zonos Elements.

Anything not in a `zonos` folder may be freely modified, added to, or removed from the project. You have complete freedom to create, update, and delete any file that is not inside a `zonos` directory, including all UI components. The current implementation serves as a reference example of integrating Zonos with an e-commerce site.

## Customization and Updates

We recommend merchants **fork this repository** rather than using it directly. By forking the repository:

1. You can make your own customizations and changes to fit your specific business needs
2. You can easily pull in upstream changes when Zonos Commerce is updated with new features or dependencies
3. You maintain full control over your codebase while benefiting from continuous improvements

### How to Fork and Stay Updated

1. Use GitHub's fork button to create your own copy of the repository
2. Clone your forked repository to your local machine:
   ```
   git clone https://github.com/YOUR-USERNAME/commerce.git
   ```
3. Add the original repository as an upstream remote:
   ```
   git remote add upstream https://github.com/zonos/commerce.git
   ```
4. When you want to pull in updates:
   ```
   git fetch upstream
   git merge upstream/main
   ```

## Core Zonos Functions

The following functions provide the foundation for Zonos integration:

### Cart Management

- **`createCart()`**: Creates an empty cart in Zonos
  ```typescript
  const newCart = await createCart();
  ```

- **`getCart()`**: Retrieves the current cart from cookies
  ```typescript
  const currentCart = await getCart();
  ```

- **`addToCart({ sku, quantity })`**: Adds a product to the cart
  ```typescript
  const updatedCart = await addToCart({ sku: 'product123', quantity: 1 });
  ```

- **`removeFromCart(itemIds)`**: Removes items from the cart
  ```typescript
  const updatedCart = await removeFromCart(['item-id-1', 'item-id-2']);
  ```

- **`updateCart({ cart, newUpdateItems })`**: Updates existing items in the cart
  ```typescript
  const updatedCart = await updateCart({ 
    cart: currentCart, 
    newUpdateItems: [/* updated items */] 
  });
  ```

### API Communication

- **`zonosFetch({ endpoint, method, body })`**: Core function for making authenticated requests to Zonos API
  ```typescript
  const response = await zonosFetch({
    endpoint: '/api/commerce/cart/create',
    method: 'POST',
    body: { /* request data */ }
  });
  ```

- **`revalidate()`**: Handles cache invalidation for updated content
  ```typescript
  // Used in webhook handlers to refresh data
  await revalidate();
  ```
  **Note:** The `revalidate()` function is currently a placeholder and does not yet provide full functionality. It will be implemented in future updates.

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
   - `VERCEL_PROJECT_PRODUCTION_URL`: Your production domain name (without protocol) used for generating absolute URLs

The `CUSTOMER_GRAPH_TOKEN` is a required server-side variable used for authenticated API requests to Zonos services. This token is used in the `zonosFetch` function to make authenticated requests to Zonos API endpoints, particularly for cart operations and checkout processing.

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

## Development Instructions

### Running the Development Server

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at http://localhost:3000.

### Building for Production

```bash
# Create a production build
pnpm build

# Start the production server
pnpm start
```

## Testing

This project uses Vitest for unit testing. Some unit tests have already been implemented, and there are plans to expand testing with Storybook (component testing) and Playwright (integration/E2E testing) in the future.

### Current Testing Implementation

The current test suite includes:
- Unit tests for utility functions in `lib/utils.ts`
- Tests for API configuration in `lib/zonos/api-config.ts`
- Tests for server actions in `components/cart/actions.ts`
- Tests for API client functions in `lib/zonos`
- Tests for environment variable validation

### Testing Structure

- `tests/unit/`: Contains unit tests for pure functions
- Future component testing will be done with Storybook
- Future integration and E2E testing will be done with Playwright

### Running Tests

```bash
# Run all tests once
pnpm test
# or
pnpm dlx vitest run

# Run tests in watch mode (during development)
pnpm run test:watch
# or
pnpm dlx vitest
```

### Writing Tests

When writing unit tests:

1. Focus on testing pure functions that don't require DOM interactions
2. Name test files with the `.test.ts` or `.test.tsx` extension
3. Place tests in a directory structure that mirrors the source code
4. Use the Vitest `describe`, `it`, and `expect` functions

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../path/to/source';

describe('myFunction', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

For more details on testing, see the [tests/README.md](./tests/README.md) file.

## Deployment

This project can be deployed on either Vercel or Cloudflare. The deployment process is optimized based on the platform you choose through the `DEPLOYMENT_PLATFORM` environment variable.

### Vercel Deployment

1. Fork this repository to your GitHub account
2. Create a new project in Vercel and connect it to your forked repository
3. Configure the required environment variables
4. Deploy the project

Vercel will automatically build and deploy your application. Each commit to the main branch will trigger a new production deployment, and pull requests will create preview deployments.

### Cloudflare Deployment

1. Fork this repository to your GitHub account
2. Create a new project in Cloudflare Pages and connect it to your forked repository
3. Configure the build settings:
   - Build command: `pnpm run build`
   - Output directory: `.next`
4. Configure the required environment variables
5. Deploy the project

For detailed deployment configurations and strategies, refer to the [deployment specification](./specs/deployment.spec.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
