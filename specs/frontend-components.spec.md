# Frontend Components Specification

## Overview

This document outlines the frontend components for the Zonos Commerce project, including their structure, functionality, and design principles, based on Next.js Commerce patterns.

## Component Library Structure

The frontend components are organized following the Next.js Commerce pattern:

```
components/
├── cart/                 # Cart-related components
│   ├── add-to-cart.tsx
│   ├── cart-items.tsx
│   ├── cart-summary.tsx
│   └── cart.tsx
├── checkout/             # Checkout components
│   ├── checkout-form.tsx
│   └── shipping-address.tsx
├── layout/               # Layout components
│   ├── footer.tsx
│   ├── header.tsx
│   └── layout.tsx
├── product/              # Product components
│   ├── product-card.tsx
│   ├── product-gallery.tsx
│   ├── product-grid.tsx
│   └── product-details.tsx
├── search/               # Search components
│   ├── search-bar.tsx
│   └── search-results.tsx
├── ui/                   # UI components (similar to Vercel's implementation)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dropdown.tsx
│   └── modal.tsx
└── zonos/                # Zonos specific components
    ├── zonos-hello.tsx
    ├── zonos-checkout.tsx
    └── country-selector.tsx
```

## Client vs Server Components

Following Next.js Commerce patterns, components should be organized as:

- **Server Components (default)**: Data fetching, SEO content, static UI
- **Client Components (with 'use client')**: Interactive elements, forms, animations

## Key Component Specifications

### Layout Components

#### Header Component

```typescript
// components/layout/header.tsx
import Link from 'next/link';
import { Cart } from '@/components/cart';
import { CountrySelector } from '@/components/zonos/country-selector';
import { getMenu } from '@/lib/zonos';

export async function Header() {
  const menu = await getMenu();
  
  return (
    <header>
      {/* Header implementation */}
    </header>
  );
}
```

**Functionality**:
- Logo and navigation links
- Search functionality
- Cart icon with item count
- User authentication status
- Country selector (Zonos Hello integration)

#### Footer Component

```typescript
// components/layout/footer.tsx
export function Footer() {
  return (
    <footer>
      {/* Footer implementation */}
    </footer>
  );
}
```

**Functionality**:
- Navigation links
- Company information
- Social media links
- Newsletter subscription
- Legal links (privacy policy, terms of service)

### Product Components

#### ProductCard Component

```typescript
// components/product/product-card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { AddToCart } from '@/components/cart/add-to-cart';
import { ZonosHello } from '@/components/zonos/zonos-hello';
import { Product } from '@/lib/types';

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      {/* Product card implementation */}
      <ZonosHello product={product} />
      <AddToCart productId={product.id} />
    </div>
  );
}
```

**Functionality**:
- Display product image using Next.js Image component
- Show product name and price
- Rating display
- Add to cart functionality (Server Action)
- Quick view option
- Zonos Hello integration for international pricing

#### ProductDetails Component

```typescript
// components/product/product-details.tsx
import Image from 'next/image';
import { AddToCart } from '@/components/cart/add-to-cart';
import { ZonosHello } from '@/components/zonos/zonos-hello';
import { ProductGallery } from './product-gallery';
import { Product } from '@/lib/types';

export interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  return (
    <div className="product-details">
      {/* Product details implementation */}
    </div>
  );
}
```

**Functionality**:
- Multiple product images with gallery
- Product description and details
- Size and color selection (if applicable)
- Quantity selector
- Add to cart button (Server Action)
- Zonos Hello integration for duty and tax calculation
- Related products

### Cart Components

#### AddToCart Component

```typescript
// components/cart/add-to-cart.tsx
'use client';

import { useState } from 'react';
import { addToCart } from '@/app/actions';
import { Button } from '@/components/ui/button';

export function AddToCart({ productId }: { productId: string }) {
  const [isPending, startTransition] = useState(false);
  
  return (
    <form action={(formData) => {
      startTransition(true);
      addToCart(formData);
    }}>
      <input type="hidden" name="productId" value={productId} />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add to Cart'}
      </Button>
    </form>
  );
}
```

#### Cart Component

```typescript
// components/cart/cart.tsx
import { CartItems } from './cart-items';
import { CartSummary } from './cart-summary';
import { getCart } from '@/lib/zonos';

export async function Cart() {
  const cart = await getCart();
  
  return (
    <div className="cart">
      <CartItems items={cart.items} />
      <CartSummary cart={cart} />
    </div>
  );
}
```

**Functionality**:
- List of cart items
- Quantity adjustment (Server Actions)
- Remove item functionality (Server Actions)
- Cart subtotal calculation
- Proceed to checkout button
- Zonos integration for international shipping options

### Checkout Components

#### CheckoutForm Component

```typescript
// components/checkout/checkout-form.tsx
'use client';

import { useState } from 'react';
import { submitCheckout } from '@/app/actions';
import { ShippingAddressForm } from './shipping-address-form';
import { Button } from '@/components/ui/button';

export function CheckoutForm() {
  const [step, setStep] = useState('shipping');
  
  return (
    <form action={submitCheckout}>
      {/* Checkout form implementation */}
    </form>
  );
}
```

**Functionality**:
- Multi-step checkout process
- Customer information form
- Shipping address form
- Shipping method selection
- Payment method selection
- Order summary
- Integration with Zonos Checkout for international orders

### Zonos Components

#### ZonosHello Component

```typescript
// components/zonos/zonos-hello.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCountry } from '@/lib/hooks/use-country';
import { calculateDuty } from '@/lib/zonos/client';
import type { Product } from '@/lib/types';

export interface ZonosHelloProps {
  product: Product;
}

export function ZonosHello({ product }: ZonosHelloProps) {
  const { selectedCountry } = useCountry();
  const [dutyAndTax, setDutyAndTax] = useState(null);
  
  useEffect(() => {
    if (selectedCountry) {
      calculateDuty(product, selectedCountry).then(setDutyAndTax);
    }
  }, [product, selectedCountry]);
  
  if (!dutyAndTax) return null;
  
  return (
    <div className="zonos-hello">
      {/* Duty & Tax display */}
    </div>
  );
}
```

**Functionality**:
- Display duty and tax information
- Country-specific pricing
- Integration with Zonos Hello API

#### ZonosCheckout Component

```typescript
// components/zonos/zonos-checkout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/lib/zonos/client';

export function ZonosCheckout({ order }: { order: any }) {
  const router = useRouter();
  
  useEffect(() => {
    createCheckoutSession(order).then((session) => {
      if (session?.redirectUrl) {
        window.location.href = session.redirectUrl;
      }
    });
  }, [order]);
  
  return (
    <div className="zonos-checkout-loading">
      Preparing your checkout...
    </div>
  );
}
```

**Functionality**:
- Integration with Zonos Checkout
- International checkout flow
- Order completion handling
- Error handling for failed checkouts

### UI Components

The UI component library will include reusable, accessible components that follow consistent design patterns, similar to Next.js Commerce:

#### Button Component

```typescript
// components/ui/button.tsx
'use client';

import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'button',
        `button-${variant}`,
        `button-${size}`,
        fullWidth && 'w-full',
        isLoading && 'button-loading',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Input Component

```typescript
// components/ui/input.tsx
'use client';

import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <div className="form-control">
      <label htmlFor={props.id}>{label}</label>
      <input
        className={clsx(
          'input',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-error">{error}</p>
      ) : helperText ? (
        <p className="text-helper">{helperText}</p>
      ) : null}
    </div>
  );
}
```

## Server Actions

Following Next.js Commerce pattern, Server Actions will be used for form handling:

```typescript
// app/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createZonosClient } from '@/lib/zonos';

export async function addToCart(formData: FormData) {
  const productId = formData.get('productId') as string;
  const quantity = Number(formData.get('quantity') || 1);
  
  // Cart handling logic
  
  revalidatePath('/cart');
  revalidatePath('/');
}

export async function removeFromCart(formData: FormData) {
  const itemId = formData.get('itemId') as string;
  
  // Remove item logic
  
  revalidatePath('/cart');
}

export async function submitCheckout(formData: FormData) {
  // Process checkout
  
  redirect('/thank-you');
}
```

## Responsive Design

All components will be designed with a mobile-first approach, ensuring they work well on a variety of device sizes:

- **Mobile** (320px - 767px)
- **Tablet** (768px - 1023px)
- **Desktop** (1024px and above)

Media queries and responsive design patterns will be used to ensure components adapt appropriately to different screen sizes.

## Accessibility

All components will adhere to WCAG 2.1 AA standards, including:

- Proper semantic HTML elements
- ARIA labels and roles where appropriate
- Keyboard navigation support
- Focus management
- Sufficient color contrast
- Screen reader compatibility

## Performance Considerations

Components will be optimized for performance following Next.js Commerce patterns:

- Server Components for static content
- Client Components only when interactivity is needed
- Lazy loading for components not visible in the initial viewport
- Proper use of useMemo and useCallback to prevent unnecessary renders
- Image optimization with Next.js Image component
- Code splitting for large component trees
- Platform-specific optimizations based on the `DEPLOYMENT_PLATFORM` environment variable to reduce latency on either Vercel or Cloudflare

## State Management

Components will use a combination of:

- Local component state with useState and useReducer
- React Context for shared state across component trees
- Server Components for data that can be rendered on the server
- Server Actions for form submissions and data mutations

## Testing Strategy

Components will be tested using:

- Unit tests for component logic with Vitest
- Component tests with React Testing Library
- Visual regression tests for UI components
- Accessibility tests with tools like axe-core

## Component Documentation

Components will be documented with:

- TypeScript interface definitions
- Usage examples
- Variant demonstrations
- Accessibility guidelines 