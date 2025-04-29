# Zonos Elements Integration Specification

## Overview

This document outlines the integration of Zonos Elements, specifically Zonos Hello and Zonos Checkout, into the Zonos Commerce application.

## Zonos Elements

Zonos Elements are a set of pre-built UI components and APIs that enable cross-border commerce functionality, including:

- **Zonos Hello**: Provides accurate duty and tax calculations at the product level
- **Zonos Checkout**: Handles international checkout process, including payment processing, compliance, and shipping

## Integration Requirements

### API Keys and Environment

1. **NEXT_PUBLIC_ZONOS_API_KEY**: Organization key used for client-side initialization of Zonos Elements. This key allows verification of organization access to the graph and checking for allowed domains in the Zonos Elements API. It is designed to be safely included in client-side code.

2. **CUSTOMER_GRAPH_TOKEN**: Secret token used for all server-side API calls (both REST and GraphQL). This token provides secure access to the Zonos Graph API and must never be exposed client-side. Retrieved from Zonos Dashboard (Settings > API Access).

3. **Environment Configuration**:
   - Sandbox environment for development and testing
   - Production environment for live transactions

### Zonos Hello Integration

#### Implementation

1. **Script Installation**: Include the Zonos Hello script tag with merchant ID in the application.

2. **Client-Side Implementation**:
   - Integration with the product display pages
   - Country selector implementation
   - Duty and tax display near product pricing

3. **Product Data Requirements**:
   - Product price
   - Product weight
   - Harmonized System (HS) code
   - Country of origin
   - Product category

4. **API Integration**: Implement API calls to calculate duties and taxes, using the GraphQL token for authentication.

### Zonos Checkout Integration

#### Implementation

1. **Script Installation**: Include the Zonos Checkout script tag with merchant ID in the application.

2. **Checkout Flow**:
   - Integration with cart page
   - Redirection to Zonos Checkout when international shipping is selected
   - Order confirmation and tracking

3. **Order Data Requirements**:
   - Cart items (products, quantities, prices)
   - Customer information
   - Shipping address
   - Selected shipping method

4. **API Integration**: Implement API calls to create checkout sessions, using the GraphQL token for authentication.

## React Component Integration

### Zonos Hello Component

Create a client-side component that:
- Accepts product data and country code as props
- Uses React hooks to manage state and side effects
- Initializes Zonos Hello with product data and destination
- Displays calculated duties and taxes
- Handles loading states appropriately

### Zonos Checkout Component

Create a client-side component that:
- Accepts order data and callback functions as props
- Initializes Zonos Checkout with order data
- Sets up callback handlers for completion and cancellation
- Provides a container for the Zonos Checkout UI

## Server-Side Integration

### GraphQL API Integration

Implement a utility function for executing GraphQL queries that:
- Accepts query string and variables
- Sends request to Zonos GraphQL API with proper authentication
- Handles errors appropriately
- Returns typed response data

Example functionalities include:
- Fetching customer orders
- Retrieving product data
- Executing complex queries

### API Route Handlers

Create API route handlers for client-side API access that:
- Accept and validate request data
- Forward requests to Zonos APIs with proper authentication
- Handle errors gracefully
- Return appropriate responses

## Webhook Integration

### Order Status Updates

Set up webhooks to receive order status updates that:
- Verify webhook signatures for security
- Process different event types (order completed, cancelled, etc.)
- Update application state based on event data
- Return appropriate responses to webhook calls

## Testing Strategy

### Integration Testing

1. **Test Environments**:
   - Testing against Zonos Sandbox environment
   - Mock API responses for unit tests

2. **Test Cases**:
   - Duty calculation for different countries
   - Checkout flow for various order scenarios
   - Error handling for API failures
   - Webhook processing

## Implementation Plan

1. Set up API keys and environments
2. Implement Zonos Hello on product pages
3. Integrate Zonos Checkout with cart
4. Set up server-side API routes
5. Configure webhooks for order updates
6. Implement error handling and fallbacks
7. Test integration in sandbox environment
8. Configure platform-specific optimizations based on `DEPLOYMENT_PLATFORM`
9. Move to production when ready