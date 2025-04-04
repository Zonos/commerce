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

3. Create a `.env.local` file in the root directory with the following variables:

   - **NEXT_PUBLIC_ZONOS_API_KEY**: Your Zonos API key for organization verification and client-side initialization
   - **CUSTOMER_GRAPH_TOKEN**: Secret token used for all server-side API calls (both REST and GraphQL) to Zonos Elements
   - **NEXT_PUBLIC_ZONOS_ENVIRONMENT**: Set to "sandbox" or "production"
   - **ZONOS_REVALIDATION_SECRET**: Secret used for cache invalidation
   - **DEPLOYMENT_PLATFORM**: Set to "vercel" or "cloudflare" based on deployment platform
   - **COMPANY_NAME** and **SITE_NAME**: Your store information

The `CUSTOMER_GRAPH_TOKEN` is a secret API token that must never be exposed client-side. It is retrieved from the Zonos Dashboard under Settings > API Access and is used for all server-side API communications with Zonos Graph.

The `NEXT_PUBLIC_ZONOS_API_KEY` is an organization key used for client-side initialization of Zonos Elements. It allows verification of organization access to the graph and checks for allowed domains in the Zonos Elements API. This key is designed to be safely included in client-side code.

The `DEPLOYMENT_PLATFORM` environment variable determines which platform-specific optimizations to use:
- Set to `vercel` for Vercel deployments
- Set to `cloudflare` for Cloudflare Pages deployments

4. The project uses Zod for environment variable validation with separate server and client environments:
   - `environment.server.ts` - Server-side environment variables validation
   - `environment.client.ts` - Client-side environment variables validation (prefixed with `NEXT_PUBLIC_`)

   This ensures type safety and validation for all environment variables across the application.

5. Start the development server and open the application in your browser

## Development

### Project Structure

The project follows a standard Next.js App Router structure with specialized directories for different components and functionality:
- App router configuration in the `app` directory
- Components organized by functionality in the `components` directory
- Utility functions and shared code in the `lib` directory
- Static assets in the `public` directory
- Project specifications in the `specs` directory
- Tests in the `tests` directory

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code quality issues
- `pnpm test` - Run Vitest tests
- `pnpm tsc` - Run TypeScript type checking

## Deployment

The application is optimized for deployment on both Vercel and Cloudflare:

- Connect your GitHub repository for continuous deployment
- Both platforms provide automatic deployments:
  - Production deployments from the main branch
  - Preview deployments for feature branches and pull requests

The `DEPLOYMENT_PLATFORM` environment variable determines which platform-specific optimizations to use:
- Set to `vercel` for Vercel deployments
- Set to `cloudflare` for Cloudflare Pages deployments

For detailed deployment instructions, see the [deployment specification](./specs/deployment.spec.md).

## Documentation

Detailed documentation is available in the `specs` directory:

- [Project Setup](./specs/project-setup.spec.md)
- [Architecture](./specs/architecture.spec.md)
- [Zonos Elements Integration](./specs/zonos-elements-integration.spec.md)
- [Frontend Components](./specs/frontend-components.spec.md)
- [API Integration](./specs/api-integration.spec.md)
- [Testing Strategy](./specs/testing-strategy.spec.md)
- [Deployment](./specs/deployment.spec.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 