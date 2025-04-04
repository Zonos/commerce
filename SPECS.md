# Zonos Commerce Project Specifications

This document outlines the technical specifications for the Zonos Commerce project, a NextJS-based e-commerce solution integrated with Zonos Elements.

## Project Overview

Zonos Commerce is a modern e-commerce platform built with NextJS and TypeScript, inspired by [Next.js Commerce](https://github.com/vercel/commerce). The platform integrates Zonos Elements to provide seamless cross-border commerce functionality, including Zonos Hello and Zonos Checkout.

The project follows Next.js Commerce's high-performance architecture using React Server Components, Server Actions, `Suspense`, and other modern React patterns while adding Zonos-specific cross-border functionality.

## Technology Stack

- **Frontend Framework**: NextJS (latest version with App Router)
- **Language**: TypeScript (2025)
- **Styling**: Tailwind CSS
- **State Management**: React Server Components + Server Actions
- **Package Manager**: pnpm
- **Linting**: ESLint with Zonos's standard configuration
- **Testing**: Vitest
- **Integration**: Zonos Elements (Hello and Checkout)
- **Backend**: API endpoints from Zonos Elements Serverless environment
- **Architecture**: Server Components, Server Actions, Edge capabilities
- **Environment Variables**: Zod validation with separate server/client environments (T3 approach)
- **Deployment**: Optimized for both Vercel and Cloudflare with GitHub integration
- **CI/CD**: GitHub Actions for automated testing and deployment

## Features Specification

- Modern, responsive user interface
- Product catalog with faceted search
- Shopping cart and checkout functionality
- International pricing with duty and tax calculations
- Cross-border checkout with Zonos Elements
- User authentication and account management
- Order tracking and history

## Implementation Timeline

The implementation timeline and milestones will be defined after the initial specifications are reviewed and approved.

## Development Standards

This project adheres to Zonos's development standards for code quality, performance, and security. For specific guidelines, refer to the relevant specification documents in the `/specs` directory.

## Specification Documents

Detailed specifications for different components of the system can be found in the `/specs` directory:

- [Project Setup](./specs/project-setup.spec.md)
- [Architecture](./specs/architecture.spec.md)
- [Zonos Elements Integration](./specs/zonos-elements-integration.spec.md)
- [Frontend Components](./specs/frontend-components.spec.md)
- [API Integration](./specs/api-integration.spec.md)
- [Testing Strategy](./specs/testing-strategy.spec.md)
- [Deployment](./specs/deployment.spec.md) 