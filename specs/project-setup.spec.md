# Project Setup Specification

## Overview

This document outlines the setup process for the Zonos Commerce project, including dependencies, configuration, and initial project structure based on Next.js Commerce patterns.

## Dependencies

### Core Dependencies
- Next.js (latest version with App Router support)
- React (latest version)
- TypeScript (2025 version)

### Development Dependencies
- ESLint with Zonos standard configuration
- Vitest for unit testing
- TypeScript compiler
- Prettier for code formatting

## Project Structure

Following the Next.js Commerce pattern:

```
zonos-commerce/
├── .env.example         # Example environment variables
├── .eslintrc.js         # ESLint configuration
├── .gitignore           # Git ignore file
├── tsconfig.json        # TypeScript configuration
├── next.config.ts       # Next.js configuration
├── package.json         # Package dependencies
├── README.md            # Project documentation
├── public/              # Static assets
├── app/                 # Next.js App Router
│   ├── api/             # API routes
│   ├── (routes)/        # App routes and pages
│   ├── globals.css      # Global styles
│   └── layout.tsx       # Root layout component
├── components/          # React components
│   ├── cart/            # Cart-related components
│   ├── checkout/        # Checkout-related components
│   ├── product/         # Product-related components
│   ├── zonos/           # Zonos integration components
│   └── ui/              # Reusable UI components
├── lib/                 # Utility functions and shared code
│   ├── constants/       # Application constants
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── zonos/           # Zonos API integration
└── tests/               # Test files
```

## Configuration Files

### package.json

The package.json file should include the following:

```json
{
  "name": "zonos-commerce",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "tsc": "tsc"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "clsx": "latest",
    "tailwindcss": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "eslint-config-zonos": "latest",
    "typescript": "latest",
    "vitest": "latest",
    "prettier": "latest",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

### tsconfig.json

The tsconfig.json file should be configured according to Zonos's TypeScript standards with the following key features:

- Strict type checking enabled
- ESNext module system
- Path aliases for cleaner imports
- Integration with Next.js types

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### .eslintrc.js

ESLint should be configured to use Zonos's standard configuration:

```javascript
module.exports = {
  extends: ['zonos'],
  parserOptions: {
    project: './tsconfig.json'
  }
}
```

### next.config.ts

```typescript
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.example.com'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    serverActions: true
  }
};

export default nextConfig;
```

## Installation Process

1. **Fork the Repository**
   ```bash
   # First, fork the repository on GitHub to your own account
   # This allows you to make custom changes while still being able to pull updates
   ```

2. **Clone Your Forked Repository**
   ```bash
   git clone https://github.com/your-username/zonos-commerce.git
   cd zonos-commerce
   ```

3. **Set Up Upstream Remote**
   ```bash
   # Add the original repository as an upstream remote
   git remote add upstream https://github.com/zonos/commerce.git
   ```

4. Install dependencies using pnpm
   ```bash
   pnpm install
   ```

5. Configure ESLint with Zonos's standard configuration
6. Set up TypeScript configuration
7. Configure Vitest for unit testing
8. Initialize Git repository with appropriate .gitignore

## Keeping Your Fork Updated

To pull in updates from the main repository:

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes into your main branch
git checkout main
git merge upstream/main

# Resolve any merge conflicts and commit
```

## Environment Setup

### Environment Variables

Create a `.env.example` file with the following variables (based on Next.js Commerce approach):

```
# Zonos
ZONOS_API_KEY=your_api_key
NEXT_PUBLIC_ZONOS_ENVIRONMENT=sandbox
ZONOS_REVALIDATION_SECRET=your_revalidation_secret

# Deployment
DEPLOYMENT_PLATFORM=vercel|cloudflare

# General
COMPANY_NAME=Zonos Commerce
NEXT_PUBLIC_SITE_NAME=Zonos Commerce
```

For local development, create a `.env.local` file with your actual values.

### Environment Variable Validation

The project uses Zod for type-safe environment variable validation following the T3 stack approach:

1. **environment.server.ts**
   - Contains validation schemas for server-side environment variables
   - Used in server components, API routes, and server actions
   - Validates critical variables like API keys and secrets

2. **environment.client.ts**
   - Contains validation schemas for client-side environment variables (prefixed with `NEXT_PUBLIC_`)
   - Used in client components
   - Ensures type safety for environment variables used in the browser

This separation provides type safety, validation at runtime, and clear error messages when required environment variables are missing.

## Next Steps

After completing the project setup:

1. Implement the base application structure following Next.js App Router conventions
2. Configure routing with Next.js App Router
3. Integrate Zonos Elements
4. Begin implementing UI components 