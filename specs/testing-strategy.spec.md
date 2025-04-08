# Testing Strategy Specification

## Overview

This document outlines the comprehensive testing strategy for the Zonos Commerce project, covering different testing types, methodologies, tools, and best practices.

## Testing Types

### Unit Testing

Unit tests will verify the functionality of individual units of code in isolation.

#### Implementation Status

As of the initial implementation, we have set up Vitest for testing pure functions that don't require DOM interaction. The current test suite includes:

- Utility functions in `lib/utils.ts`:
  - `createUrl` and `ensureStartsWith` 
  - `validateEnvironmentVariables` for environment variable validation
- Type guard functions in `lib/type-guards.ts`:
  - `isObject` for checking if a value is an object
  - `isShopifyError` for validating error types
- API configuration in `lib/zonos/api-config.ts`:
  - `getZonosApiEndpoint` for constructing API endpoints
  - `getZonosApiUrl` for platform-specific API base URLs
- Server Actions in `components/cart/actions.ts`:
  - `addItem` for adding items to the cart
  - `removeItem` for removing items from the cart
  - `updateItemQuantity` for updating item quantities
  - `redirectToCheckout` for redirecting to checkout
  - `createCartAndSetCookie` for creating a cart and setting cookies

Future implementations will include:
- React component testing with React Testing Library
- Form validation logic
- API client methods

#### What to Test
- Individual functions, methods, and classes
- UI components in isolation
- Utility functions
- API client methods
- Form validation logic

#### Tools
- **Vitest**: Primary test runner and assertion library for pure function testing (✅ Implemented)
- **React Testing Library**: For testing React components (🔄 Planned)
- **Testing Library User Event**: For simulating user interactions (🔄 Planned)

#### Example Unit Test

```typescript
// tests/unit/utils.test.ts (Implemented)
import { describe, it, expect } from 'vitest';
import { createUrl, ensureStartsWith } from '../../lib/utils';

describe('createUrl', () => {
  it('creates a URL with no parameters', () => {
    const params = new URLSearchParams();
    expect(createUrl('/path', params)).toBe('/path');
  });

  it('creates a URL with parameters', () => {
    const params = new URLSearchParams();
    params.set('key', 'value');
    expect(createUrl('/path', params)).toBe('/path?key=value');
  });
});

describe('ensureStartsWith', () => {
  it('returns the original string if it already starts with the prefix', () => {
    expect(ensureStartsWith('https://example.com', 'https://')).toBe('https://example.com');
  });

  it('adds the prefix to the string if it does not already start with it', () => {
    expect(ensureStartsWith('example.com', 'https://')).toBe('https://example.com');
  });
});
```

### Integration Testing

Integration tests will verify that different parts of the application work together as expected.

#### What to Test
- Component interactions
- API integrations
- Form submissions
- Data flow between components
- Routing and navigation

#### Tools
- **Vitest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking API requests

#### Example Integration Test

```typescript
// features/product/ProductDetail.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ProductDetail } from './ProductDetail';
import { mockProduct, mockDutyCalculation } from '@/mocks/data';

// Setup MSW server
const server = setupServer(
  rest.post('/api/zonos/hello', (req, res, ctx) => {
    return res(ctx.json(mockDutyCalculation));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductDetail integration', () => {
  it('loads and displays product information', async () => {
    render(<ProductDetail product={mockProduct} />);
    
    // Check product details are displayed
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    
    // Check duty calculation is loaded and displayed
    await waitFor(() => {
      expect(screen.getByText(/estimated duties & taxes/i)).toBeInTheDocument();
      expect(screen.getByText(`$${mockDutyCalculation.amount}`)).toBeInTheDocument();
    });
  });

  it('updates duty calculation when country changes', async () => {
    render(<ProductDetail product={mockProduct} />);
    
    // Set up a different response for a different country
    server.use(
      rest.post('/api/zonos/hello', (req, res, ctx) => {
        return res(ctx.json({
          ...mockDutyCalculation,
          amount: 30.75
        }));
      })
    );
    
    // Change country selection
    const countrySelect = screen.getByLabelText(/country/i);
    await userEvent.selectOptions(countrySelect, 'CA');
    
    // Check updated duty calculation is displayed
    await waitFor(() => {
      expect(screen.getByText('$30.75')).toBeInTheDocument();
    });
  });

  it('adds product to cart when Add to Cart button is clicked', async () => {
    const mockAddToCart = vi.fn();
    render(<ProductDetail product={mockProduct} onAddToCart={mockAddToCart} />);
    
    // Click Add to Cart button
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(addToCartButton);
    
    // Check if onAddToCart was called with correct arguments
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct.id, 1);
  });
});
```

### E2E Testing

End-to-end tests will verify the complete application workflow from a user's perspective.

#### What to Test
- Critical user flows (e.g., product browsing, checkout process)
- Cross-border checkout with Zonos integration
- User authentication
- Responsive design across different device sizes

#### Tools
- **Playwright**: E2E testing framework
- **Playwright Test**: Test runner for Playwright

#### Example E2E Test

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
  });

  test('complete checkout with domestic shipping', async ({ page }) => {
    // Add a product to cart
    await page.click('a:has-text("Product 1")');
    await page.click('button:has-text("Add to Cart")');
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    
    // Verify product is in cart
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    
    // Proceed to checkout
    await page.click('button:has-text("Proceed to Checkout")');
    
    // Fill checkout form
    await page.fill('#firstName', 'John');
    await page.fill('#lastName', 'Doe');
    await page.fill('#email', 'john.doe@example.com');
    await page.fill('#address', '123 Main St');
    await page.fill('#city', 'Anytown');
    await page.fill('#zipCode', '12345');
    
    // Select shipping method
    await page.click('input[name="shippingMethod"][value="standard"]');
    
    // Complete order
    await page.click('button:has-text("Complete Order")');
    
    // Verify order confirmation
    await expect(page.locator('h1:has-text("Order Confirmed")')).toBeVisible();
  });

  test('complete international checkout with Zonos', async ({ page }) => {
    // Add a product to cart
    await page.click('a:has-text("Product 1")');
    
    // Change country to international
    await page.selectOption('[data-testid="country-selector"]', 'CA');
    
    // Verify duty and tax information is displayed
    await expect(page.locator('text=Estimated Duties & Taxes')).toBeVisible();
    
    await page.click('button:has-text("Add to Cart")');
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    
    // Proceed to checkout
    await page.click('button:has-text("Proceed to Checkout")');
    
    // Verify Zonos Checkout is loaded
    await expect(page.locator('#zonos-checkout-container')).toBeVisible();
    
    // Complete checkout in Zonos (simplified for this example)
    // In a real test, we would interact with the Zonos iframe or mock it
    
    // Verify order confirmation
    await expect(page.locator('h1:has-text("Order Confirmed")')).toBeVisible();
  });
});
```

### Visual Regression Testing

Visual regression tests will verify that UI components and pages maintain their visual appearance.

#### What to Test
- UI components in different states
- Page layouts across different viewport sizes
- Dark mode/light mode transitions
- Loading states and animations

#### Tools
- **Playwright**: For capturing screenshots
- **Percy** or **Playwright's built-in visual comparison**: For visual comparison

### Accessibility Testing

Accessibility tests will verify that the application meets accessibility standards.

#### What to Test
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA attributes
- Focus management

#### Tools
- **axe-core**: For automated accessibility testing
- **@testing-library/jest-dom**: For additional accessibility assertions

#### Example Accessibility Test

```typescript
// components/ui/Button.a11y.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click Me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be focusable and have the correct tab index', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('should have appropriate ARIA attributes when loading', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});
```

## Testing Infrastructure

### Test Directory Structure

Current Implementation:
```
zonos-commerce/
├── tests/                           # Test directory (✅ Implemented)
│   ├── unit/                        # Unit tests for pure functions (✅ Implemented)
│   │   ├── utils.test.ts            # Tests for utility functions
│   │   │   ├── createUrl           # Tests URL creation
│   │   │   ├── ensureStartsWith    # Tests string prefix handling
│   │   │   └── validateEnvironmentVariables  # Tests env var validation
│   │   ├── type-guards.test.ts      # Tests for type guards
│   │   │   ├── isObject            # Tests object type checking
│   │   │   └── isShopifyError      # Tests error type validation
│   │   ├── zonos-api-config.test.ts # Tests for API configuration
│   │   │   ├── getZonosApiEndpoint # Tests API endpoint construction
│   │   │   └── getZonosApiUrl      # Tests platform-specific URL selection
│   │   └── cart-actions.test.ts     # Tests for cart server actions
│   │       ├── addItem             # Tests adding items to cart
│   │       ├── removeItem          # Tests removing items from cart
│   │       ├── updateItemQuantity  # Tests updating item quantities
│   │       ├── redirectToCheckout  # Tests checkout redirection
│   │       └── createCartAndSetCookie # Tests cart creation with cookies
│   └── README.md                    # Testing documentation
├── vitest.config.ts                 # Vitest configuration (✅ Implemented)
└── package.json                     # Updated with test scripts (✅ Implemented)
```

Planned Complete Structure (Future):
```
zonos-commerce/
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.test.tsx       # Component unit tests (🔄 Planned)
│   │       └── Button.a11y.test.tsx  # Accessibility tests (🔄 Planned)
│   ├── features/
│   │   └── checkout/
│   │       ├── CheckoutForm.tsx
│   │       └── CheckoutForm.test.tsx # Integration tests (🔄 Planned)
│   └── lib/
│       └── api/
│           ├── zonos-api.ts
│           └── zonos-api.test.ts     # API client tests (🔄 Planned)
├── tests/
│   ├── unit/                         # Unit tests for pure functions (✅ Implemented)
│   │   ├── utils.test.ts
│   │   ├── type-guards.test.ts
│   │   └── zonos-api-config.test.ts
│   ├── e2e/                          # E2E tests with Playwright (🔄 Planned)
│   │   ├── checkout.spec.ts
│   │   └── product-browsing.spec.ts
│   ├── mocks/                        # Mock data and services (🔄 Planned)
│   │   ├── handlers.ts
│   │   └── data.ts
│   └── utils/                        # Test utilities (🔄 Planned)
│       └── test-utils.tsx
├── vitest.config.ts                  # Vitest configuration (✅ Implemented)
└── playwright.config.ts              # Playwright configuration (🔄 Planned)
```

### Test Configuration

#### Vitest Configuration

```typescript
// vitest.config.ts (Implemented)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['node_modules', '.next', 'dist'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    },
  },
});
```

#### Playwright Configuration

```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' }
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'Safari',
      use: { browserName: 'webkit' }
    },
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true
      }
    }
  ]
};

export default config;
```

## Test Data Management

### Mock Data

Mock data will be used for consistent and predictable test scenarios:

```typescript
// tests/mocks/data.ts
export const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'This is a test product',
  imageUrl: '/images/test-product.jpg',
  weight: 1.5,
  hsCode: '8471.30.01',
  countryOfOrigin: 'US',
  category: 'electronics'
};

export const mockCart = {
  items: [
    {
      id: '1',
      productId: '1',
      name: 'Test Product',
      price: 99.99,
      quantity: 2,
      imageUrl: '/images/test-product.jpg'
    }
  ],
  subtotal: 199.98,
  shipping: 0,
  tax: 0,
  total: 199.98
};

export const mockDutyCalculation = {
  amount: 25.50,
  currency: 'USD',
  breakdown: {
    duties: 15.00,
    taxes: 8.50,
    fees: 2.00
  }
};
```

### Mock API Handlers

API mocking will provide consistent responses for tests:

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';
import { mockDutyCalculation, mockProduct, mockCart } from './data';

export const handlers = [
  // Product API
  rest.get('/api/products/:id', (req, res, ctx) => {
    return res(ctx.json(mockProduct));
  }),
  
  // Cart API
  rest.get('/api/cart', (req, res, ctx) => {
    return res(ctx.json(mockCart));
  }),
  
  // Zonos API
  rest.post('/api/zonos/hello', (req, res, ctx) => {
    return res(ctx.json(mockDutyCalculation));
  }),
  
  rest.post('/api/zonos/checkout', (req, res, ctx) => {
    return res(ctx.json({
      sessionId: 'test-session-123',
      redirectUrl: '/checkout/confirmation'
    }));
  })
];
```

## Testing Best Practices

### Component Testing Approach

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it
2. **Use data-testid attributes**: For elements that have no accessible name or role
3. **Test user interactions**: Ensure components respond correctly to user actions
4. **Test accessibility**: Verify components are accessible to all users

### API Testing Approach

1. **Test happy paths**: Verify API calls work correctly with valid inputs
2. **Test error handling**: Verify graceful handling of API errors
3. **Mock external dependencies**: Use MSW to mock API responses
4. **Test data transformations**: Verify data is correctly transformed for UI

### E2E Testing Approach

1. **Focus on critical user flows**: Test the most important user journeys
2. **Use explicit assertions**: Wait for elements to be visible/enabled before interacting
3. **Test across browsers**: Verify compatibility with different browsers
4. **Test responsive design**: Verify application works on different screen sizes

## Continuous Integration

### CI Pipeline

The testing strategy will be integrated into the CI pipeline:

1. **Linting**: Run ESLint to enforce code quality
2. **Unit Tests**: Run Vitest tests for pure functions (✅ Implemented)
3. **Component Tests**: Run React component tests (🔄 Planned)
4. **E2E Tests**: Run Playwright tests (🔄 Planned)
5. **Visual Regression Tests**: Run visual comparison tests (🔄 Planned)
6. **Coverage Reporting**: Generate and publish test coverage reports (✅ Implemented in configuration)

#### Current Implementation in package.json

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "prettier": "prettier --write --ignore-unknown .",
  "prettier:check": "prettier --check --ignore-unknown .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

#### GitHub Actions Workflow Example (Future Implementation)
// ... existing GitHub workflow example ...

## Test Documentation

Each test file should include:

1. **Clear descriptions**: Describe what is being tested
2. **Arrange-Act-Assert pattern**: Organize tests in a consistent pattern
3. **Comments**: Explain complex test scenarios
4. **Test coverage**: Aim for comprehensive coverage of component functionality

## Performance Testing

### Load Testing

For critical API endpoints, load testing will be performed to ensure they can handle expected traffic volumes.

#### Tools
- **k6**: For scripting and running load tests
- **Grafana**: For visualizing load test results

### Monitoring in Production

Performance monitoring will be set up in production to track:

1. **API response times**: Monitor latency of API calls
2. **Error rates**: Track frequency of API errors
3. **User interactions**: Monitor time to complete key user flows

## Testing Timeline

1. **Initial Setup**: Configure testing environment and tools
2. **Unit Tests**: Implement unit tests for core components and utilities
3. **Integration Tests**: Implement integration tests for key feature integrations
4. **E2E Tests**: Implement E2E tests for critical user flows
5. **Accessibility Tests**: Implement accessibility tests for all UI components
6. **Performance Tests**: Implement performance tests for critical API endpoints
7. **Ongoing Maintenance**: Update tests as new features are added 