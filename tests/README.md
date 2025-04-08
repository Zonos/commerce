# Testing in @zonos/commerce

This project uses Vitest for unit testing.

## Testing Structure

- `tests/unit/`: Contains unit tests for pure functions
- Future component testing will be done with Storybook
- Future integration and E2E testing will be done with Playwright

## Running Tests

```bash
# Run all tests once
npm test
# or
npx vitest run

# Run tests in watch mode (during development)
npm run test:watch
# or
npx vitest

# Run tests with coverage report
npm run test:coverage
# or
npx vitest run --coverage
```

## Writing Unit Tests

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

## Configuration

The Vitest configuration is in `vitest.config.ts` at the root of the project. It's set up to:

- Run tests in a Node.js environment
- Exclude node_modules, .next, and dist directories
- Provide coverage reporting in text, JSON, and HTML formats

## Best Practices

- Test only the public API of your modules
- Write tests that are independent of each other
- Use descriptive test names that explain what's being tested
- Focus on behavior, not implementation details
- Keep tests simple and focused on a single assertion when possible 