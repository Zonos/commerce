# Architecture Specification

## Overview

This document outlines the architecture for the Zonos Commerce project, detailing the application structure, data flow, and key design patterns, inspired by Next.js Commerce's architecture.

## Application Architecture

Zonos Commerce follows Next.js Commerce's modern frontend architecture based on Next.js with the App Router, using React Server Components (RSC) where appropriate.

### Key Architectural Patterns

1. **Server Components**: Leveraging Next.js React Server Components for improved performance and SEO
2. **Server Actions**: Using Next.js Server Actions for form handling and data mutations
3. **Streaming**: Implementing streaming with Suspense for improved UX
4. **Edge Runtime**: Utilizing Edge capabilities for global performance
5. **Client Components**: Using client-side React components for interactive elements
6. **API Layer**: Integrating with Zonos Elements Serverless APIs
7. **Static Site Generation (SSG)**: For content-focused pages
8. **Server-Side Rendering (SSR)**: For dynamic, personalized pages
9. **Incremental Static Regeneration (ISR)**: For data that changes infrequently

## Component Architecture

The application will use a component-based architecture with the following hierarchy:

```
Page -> Layout -> Sections -> Components -> Elements
```

- **Pages**: Next.js pages/routes with data fetching logic
- **Layouts**: Reusable layout components for consistent UI
- **Sections**: Major sections of a page (e.g., header, product grid, checkout form)
- **Components**: Reusable components with specific functionality
- **Elements**: Primitive UI elements like buttons, inputs, etc.

## Data Flow

1. **Server-side Data Flow**:
   - Data fetching in Server Components with React Server Components
   - Direct API calls to Zonos Elements Serverless APIs
   - Data passed down to client components as props

2. **Client-side Data Flow**:
   - Client state management for interactive UI elements
   - Form submissions handled by client components and Server Actions
   - API calls for user-triggered actions

## State Management

- **Server State**: Managed through React Server Components
- **Client State**: Managed using React's built-in hooks (useState, useReducer)
- **Server Actions**: For handling forms and data mutations
- **Shared State**: For complex state requirements that need to be shared across components

## API Integration

### Zonos Elements Checkout Integration

Follow the Zonos Elements Readme

## Performance Optimization

Following Next.js Commerce patterns:

1. **Code Splitting**: Automatic code splitting with Next.js
2. **Image Optimization**: Using Next.js Image component with next/image
3. **Route Prefetching**: Leveraging Next.js Link prefetching
4. **Partial Rendering**: Using React Suspense for partial page rendering
5. **Edge Caching**: Implementing edge caching strategies
6. **Bundle Size Optimization**: Monitoring and optimizing bundle sizes
7. **Lazy Loading**: Components and routes loaded lazily when needed
8. **Deployment Platform Optimization**: Using `DEPLOYMENT_PLATFORM` environment variable to optimize for specific hosting providers (Vercel or Cloudflare)

## Error Handling

1. **Global Error Boundary**: Capturing and handling errors gracefully
1. **API Error Handling**: Proper handling and display of API errors
1. **Fallback UI**: Providing fallback UI for error states

## Environment Variable Management

The architecture implements type-safe environment variable management using Zod validation, following the T3 stack approach:

1. **Separate Environment Files**:
   - `environment.server.ts`: Validates server-side environment variables
   - `environment.client.ts`: Validates client-side environment variables (prefixed with `NEXT_PUBLIC_`)

2. **Type Safety**: Provides TypeScript types for environment variables, enabling autocomplete and type checking

3. **Runtime Validation**: Validates environment variables at runtime to prevent issues in production

4. **Error Handling**: Provides clear error messages when required environment variables are missing

5. **Import Strategy**: Environment variables are imported from these modules rather than accessed directly with `process.env`

This approach ensures that environment variables are properly validated and typed throughout the application, reducing runtime errors and improving developer experience.

## Route Structure

Based on Next.js App Router architecture:

```
app/
├── layout.tsx                # Root layout with providers
├── page.tsx                  # Homepage
├── globals.css               # Global styles
├── favicon.ico               # Favicon
├── sitemap.ts                # Sitemap generation
├── robots.ts                 # Robots.txt configuration
├── not-found.tsx             # Custom 404 page
├── error.tsx                 # Error boundary
│
├── (shop)/                   # Shop group (shares layout)
│   ├── layout.tsx            # Shop layout
│   ├── products/
│   │   ├── page.tsx          # Products listing page
│   │   ├── loading.tsx       # Loading UI for products
│   │   └── [handle]/
│   │       ├── page.tsx      # Product detail page
│   │       └── loading.tsx   # Loading UI for product detail
│   ├── collections/
│   │   ├── page.tsx          # Collections listing page
│   │   └── [handle]/
│   │       └── page.tsx      # Collection detail page
│   ├── cart/
│   │   └── page.tsx          # Cart page
│   └── checkout/
│       └── page.tsx          # Checkout page with Zonos Elements
│
├── account/                  # Account section
│   ├── layout.tsx            # Account layout
│   ├── page.tsx              # Account overview
│   ├── orders/
│   │   ├── page.tsx          # Orders history
│   │   └── [id]/
│   │       └── page.tsx      # Order detail
│   ├── addresses/
│   │   └── page.tsx          # Saved addresses
│   └── settings/
│       └── page.tsx          # Account settings
│
├── api/                      # API routes
│   ├── revalidate/
│   │   └── route.ts          # Cache revalidation
│   ├── webhook/
│   │   └── route.ts          # Webhook handler
│   └── zonos/                # Zonos API routes
│       ├── hello/
│       │   └── route.ts      # Zonos Hello API
│       └── checkout/
│           └── route.ts      # Zonos Checkout API
│
└── lib/                      # Shared utilities
    ├── actions/              # Server actions
    │   ├── cart.ts           # Cart actions
    │   └── checkout.ts       # Checkout actions
    ├── constants.ts          # Global constants
    ├── utils.ts              # Utility functions
    └── environment/          # Environment configuration
        ├── environment.server.ts  # Server environment
        └── environment.client.ts  # Client environment
```

This route structure leverages Next.js App Router features including:
- Route groups with parentheses for organizational purposes
- Parallel routes for complex layouts
- Loading states with loading.tsx files
- Error boundaries with error.tsx files
- API routes using the route.ts convention
- Server Actions for data mutations

## Deployment Architecture

The application will be deployed using a modern CI/CD pipeline with automated testing and deployment processes, optimized for Vercel deployment as recommended by Next.js Commerce. 