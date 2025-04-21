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
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    // Create a fresh copy of process.env before each test
    vi.resetModules();
    process.env = { ...originalEnv };
    // Mock console.warn to prevent test output pollution
    console.warn = vi.fn();
  });

  afterEach(() => {
    // Restore original process.env after each test
    process.env = originalEnv;
    // Restore console.warn
    console.warn = originalConsoleWarn;
  });

  it("does not throw an error when all required environment variables are set", () => {
    process.env.CUSTOMER_GRAPH_TOKEN = "test-token";
    process.env.SITE_NAME = "Test Store";

    expect(() => validateEnvironmentVariables()).not.toThrow();
  });

  it("throws an error when CUSTOMER_GRAPH_TOKEN is missing", () => {
    delete process.env.CUSTOMER_GRAPH_TOKEN;
    process.env.SITE_NAME = "Test Store";

    expect(() => validateEnvironmentVariables()).toThrow(
      /CUSTOMER_GRAPH_TOKEN/,
    );
  });

  it("throws an error when SITE_NAME is missing", () => {
    process.env.CUSTOMER_GRAPH_TOKEN = "test-token";
    delete process.env.SITE_NAME;

    expect(() => validateEnvironmentVariables()).toThrow(/SITE_NAME/);
  });

  it("throws an error when multiple required environment variables are missing", () => {
    delete process.env.CUSTOMER_GRAPH_TOKEN;
    delete process.env.SITE_NAME;

    expect(() => validateEnvironmentVariables()).toThrow(
      /CUSTOMER_GRAPH_TOKEN[\s\S]*SITE_NAME/,
    );
  });

  it("warns when DEPLOYMENT_PLATFORM has an invalid value", () => {
    process.env.CUSTOMER_GRAPH_TOKEN = "test-token";
    process.env.SITE_NAME = "Test Store";
    process.env.DEPLOYMENT_PLATFORM = "invalid";

    validateEnvironmentVariables();

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'DEPLOYMENT_PLATFORM value "invalid" is not recognized',
      ),
    );
  });

  it("does not warn when DEPLOYMENT_PLATFORM has a valid value", () => {
    process.env.CUSTOMER_GRAPH_TOKEN = "test-token";
    process.env.SITE_NAME = "Test Store";
    process.env.DEPLOYMENT_PLATFORM = "vercel";

    validateEnvironmentVariables();

    expect(console.warn).not.toHaveBeenCalled();
  });
});
