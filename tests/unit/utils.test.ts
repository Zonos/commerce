import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createUrl,
  ensureStartsWith,
  validateEnvironmentVariables,
} from "../../lib/utils";

describe("createUrl", () => {
  it("creates a URL with no parameters", () => {
    const params = new URLSearchParams();
    expect(createUrl("/path", params)).toBe("/path");
  });

  it("creates a URL with parameters", () => {
    const params = new URLSearchParams();
    params.set("key", "value");
    expect(createUrl("/path", params)).toBe("/path?key=value");
  });

  it("creates a URL with multiple parameters", () => {
    const params = new URLSearchParams();
    params.set("key1", "value1");
    params.set("key2", "value2");
    // Note: URLSearchParams sorts keys alphabetically
    expect(createUrl("/path", params)).toBe("/path?key1=value1&key2=value2");
  });

  it("works with a path that already has a trailing slash", () => {
    const params = new URLSearchParams();
    params.set("key", "value");
    expect(createUrl("/path/", params)).toBe("/path/?key=value");
  });
});

describe("ensureStartsWith", () => {
  it("returns the original string if it already starts with the prefix", () => {
    expect(ensureStartsWith("https://example.com", "https://")).toBe(
      "https://example.com",
    );
  });

  it("adds the prefix to the string if it does not already start with it", () => {
    expect(ensureStartsWith("example.com", "https://")).toBe(
      "https://example.com",
    );
  });

  it("works with empty strings", () => {
    expect(ensureStartsWith("", "prefix")).toBe("prefix");
  });

  it("works with empty prefixes", () => {
    expect(ensureStartsWith("string", "")).toBe("string");
  });
});

describe("validateEnvironmentVariables", () => {
  const originalEnv = process.env;
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Create a fresh copy of process.env before each test
    vi.resetModules();
    process.env = { ...originalEnv };
    // Mock console.error to prevent test output pollution
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original process.env after each test
    process.env = originalEnv;
    // Restore console.error
    console.error = originalConsoleError;
  });

  it("does not throw an error when all required environment variables are set", () => {
    process.env.SHOPIFY_STORE_DOMAIN = "test-store.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";

    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it("throws an error when SHOPIFY_STORE_DOMAIN is missing", () => {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";

    expect(() => validateEnvironmentVariables()).toThrow(
      /SHOPIFY_STORE_DOMAIN/,
    );
  });

  it("throws an error when SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing", () => {
    process.env.SHOPIFY_STORE_DOMAIN = "test-store.myshopify.com";
    delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    expect(() => validateEnvironmentVariables()).toThrow(
      /SHOPIFY_STOREFRONT_ACCESS_TOKEN/,
    );
  });

  it("throws an error when multiple required environment variables are missing", () => {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    expect(() => validateEnvironmentVariables()).toThrow(
      /SHOPIFY_STORE_DOMAIN[\s\S]*SHOPIFY_STOREFRONT_ACCESS_TOKEN/,
    );
  });

  it("throws an error when SHOPIFY_STORE_DOMAIN contains brackets", () => {
    process.env.SHOPIFY_STORE_DOMAIN = "[test-store].myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";

    expect(() => validateEnvironmentVariables()).toThrow(/brackets/);
  });
});
