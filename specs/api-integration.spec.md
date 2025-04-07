# API Integration Specification

## Overview

This document outlines the API integration strategy for the Zonos Commerce project, focusing on the integration with Zonos Elements Serverless APIs and any additional APIs required for the e-commerce functionality, following the patterns established in Next.js Commerce.

## API Endpoints

The following Zonos Elements API endpoints will be integrated:

### Zonos Elements API

| Endpoint | Description | Method |
|----------|-------------|--------|
| `/api/commerce/cart/create` | Create a new cart | POST |
| `/api/commerce/cart/update` | Update an existing cart | PUT |
| `/api/commerce/cart/{id}` | Retrieve cart details by ID | GET |
| `/hello/calculate` | Calculate duty and tax for products | POST |
| `/checkout/sessions` | Create a checkout session | POST |

## Authentication

All Zonos Elements API requests will be authenticated using the CUSTOMER_GRAPH_TOKEN, which can be retrieved from the Zonos Dashboard.

The `CUSTOMER_GRAPH_TOKEN` is a secret API token that must never be exposed client-side and must only be used in server-side operations. This token provides secure access to the Zonos Graph API and is used for all server-side API calls.

For the upcoming Zonos Checkout integration, a separate public API key (`NEXT_PUBLIC_ZONOS_API_KEY`) will be used. This organization key is designed for client-side usage and allows verification of organization access to the graph and checking for allowed domains in the Zonos Elements API. Unlike the `CUSTOMER_GRAPH_TOKEN`, this key can safely be included in client-side code.

## Type Definitions

The integration defines TypeScript interfaces for all key data structures:

### Cart Types

- **ZonosCart**: Extends `CartResponse` with additional derived fields:
  - `totalQuantity`: Total number of items in the cart
  - `cost`: Object containing computed totals
    - `subtotalAmount`: Pre-tax/shipping cart subtotal
    - `totalAmount`: Total cart amount including adjustments
  - `checkoutUrl`: URL for checkout

- **ZonosCartItem**: Represents a single item in the cart with properties like:
  - `amount`: Price per unit
  - `currencyCode`: Currency for the price
  - `description`: Item description
  - `id`: Unique identifier
  - `imageUrl`: URL for item image
  - `name`: Item name
  - `productId`: Associated product ID
  - `quantity`: Number of items
  - `sku`: Stock Keeping Unit
  - `attributes`: Array of key-value pairs for item options
  - `metadata`: Additional item metadata

### Operation Types

- **ZonosCartCreateOperation**: Type for cart creation API requests
  - `payload`: Cart creation payload with items and adjustments
  - `endpoint`: "/api/commerce/cart/create"
  - `method`: "POST"

- **ZonosCartUpdateOperation**: Type for cart update API requests
  - `payload`: Cart update payload with ID, items to add/remove
  - `endpoint`: "/api/commerce/cart/update"
  - `method`: "PUT"

- **ZonosCartByIdOperation**: Type for fetching cart data
  - `payload`: Cart ID payload
  - `endpoint`: "/api/commerce/cart/{id}"
  - `method`: "GET"

### Enumeration Types

- **CartAdjustmentType**: Types of cart adjustments ("CART_TOTAL", "ITEM", "ORDER_TOTAL", "PROMO_CODE", "SHIPPING")
- **CountryCode**: ISO country codes for shipping and product origin
- **CurrencyCode**: ISO currency codes for pricing
- **ItemType**: Types of items ("BUNDLE", "DIGITAL_GOOD", "PHYSICAL_GOOD", etc.)
- **ItemMeasurementType**: Measurement types for products
- **ItemUnitOfMeasure**: Units for product measurements

### Base Types

- **ProductResponse**: Complete product information including pricing, metadata, and attributes
- **CartResponse**: Base cart response from the API
- **CartCreateResponse**: Response for cart creation
- **CartByIdResponse**: Response when fetching cart by ID
- **CartUpdateResponse**: Response after updating a cart

## Server Actions (TBD)

Following Next.js Commerce patterns, we'll use Server Actions for data mutations:

These actions will use the Zonos client library for API communication and will handle cache invalidation through revalidatePath.

## Data Fetching in React Server Components

Next.js Commerce takes advantage of React Server Components for data fetching:

- Product pages will use server components to fetch product data
- Metadata generation will use product information for SEO optimizations
- Related products will be fetched based on category
- Edge runtime will be utilized where appropriate for improved performance

## API Routes (TBD)

For client-side API access and webhooks, we'll implement Next.js API routes:

These routes will validate inputs, handle errors appropriately, and return properly structured responses.

## Cache Invalidation

Following Next.js Commerce patterns, we'll implement comprehensive cache revalidation strategies:

- **Dedicated API route** for controlled cache invalidation
  - Authenticated using a secret key
  - Support for invalidating specific tags
  - Integration with webhooks for automatic invalidation

- **Tag-based invalidation** using `revalidateTag`
  - Define clear cache tags for different data types (products, collections, cart)
  - Selectively invalidate data by tag when backend changes occur

- **Path-based invalidation** using `revalidatePath`
  - Automatically invalidate affected routes after mutations
  - Server actions (like `addToCart`, `removeFromCart`) will handle appropriate path invalidation

- **Caching mechanisms**
  - Server Components caching for expensive data fetching operations
  - Route handlers with cache options
  - Data fetching operations with appropriate cache settings

- **Automatic invalidation triggers**
  - After mutations via server actions
  - Through webhooks when external data changes
  - On-demand through API routes for manual control

These approaches ensure data remains fresh while maximizing performance benefits of caching.

## Error Handling

The API integration will implement robust error handling:

- Custom error classes for different error types
- Consistent error handling patterns across all operations
- Proper error propagation and logging
- User-friendly error messages

## Testing Strategy

The API integration will be tested comprehensively:

### Unit Testing

- Individual operation functions will be tested in isolation
- Mocking of fetch calls to simulate API responses
- Testing of success and error scenarios
- Verification of proper error handling