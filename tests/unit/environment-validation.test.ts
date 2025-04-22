import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { parseBooleanEnv } from "../../lib/utils/parseBooleanEnv";

describe("parseBooleanEnv", () => {
  it("returns true for 'true'", () => {
    expect(parseBooleanEnv("true")).toBe(true);
  });

  it("returns true for '1'", () => {
    expect(parseBooleanEnv("1")).toBe(true);
  });

  it("returns false for 'false'", () => {
    expect(parseBooleanEnv("false")).toBe(false);
  });

  it("returns false for '0'", () => {
    expect(parseBooleanEnv("0")).toBe(false);
  });

  it("returns false for any other string", () => {
    expect(parseBooleanEnv("yes")).toBe(false);
    expect(parseBooleanEnv("no")).toBe(false);
    expect(parseBooleanEnv("random")).toBe(false);
  });

  it("returns undefined for undefined", () => {
    expect(parseBooleanEnv(undefined)).toBe(undefined);
  });
});

describe("Environment validation", () => {
  const originalEnv = process.env;
  const originalConsoleError = console.error;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    console.error = vi.fn();

    // Set up minimal environment for successful validation
    process.env.CUSTOMER_GRAPH_TOKEN = "test-token";
    process.env.ZONOS_REVALIDATION_SECRET = "test-secret";
    process.env.NEXT_PUBLIC_ZONOS_API_KEY = "test-api-key";
    process.env.NEXT_PUBLIC_ZONOS_STORE_ID = "1234";
    process.env.NEXT_PUBLIC_ZONOS_CDN_URL = "https://example.com";
    process.env.NEXT_PUBLIC_SITE_NAME = "Test Site";
    process.env.NEXT_PUBLIC_COMPANY_NAME = "Test Company";
    process.env.NEXT_PUBLIC_ZONOS_ENVIRONMENT = "sandbox";

    // Force validation in test
    process.env.NEXT_PUBLIC_VALIDATE_ENV = "true";
  });

  afterEach(() => {
    process.env = originalEnv;
    console.error = originalConsoleError;
  });

  // Helper function to import environment module and catch any errors
  async function importEnv(): Promise<typeof import("../../lib/environment")> {
    // Always use a dynamic import to ensure fresh module evaluation
    return await import("../../lib/environment");
  }

  it("validates environment variables without throwing when valid", async () => {
    await expect(importEnv()).resolves.not.toThrow();
  });

  it("verifies required environment variables are present", async () => {
    // We'll check that the environment variables are present with expected values
    const env = await importEnv();
    expect(env.serverEnv.CUSTOMER_GRAPH_TOKEN).toBe("test-token");
    expect(env.serverEnv.ZONOS_REVALIDATION_SECRET).toBe("test-secret");
    expect(env.clientEnv.NEXT_PUBLIC_ZONOS_API_KEY).toBe("test-api-key");
    expect(env.clientEnv.NEXT_PUBLIC_ZONOS_STORE_ID).toBe("1234");
    expect(env.clientEnv.NEXT_PUBLIC_ZONOS_CDN_URL).toBe("https://example.com");
    expect(env.clientEnv.NEXT_PUBLIC_SITE_NAME).toBe("Test Site");
  });

  it("throws when URL is invalid", async () => {
    process.env.NEXT_PUBLIC_ZONOS_CDN_URL = "not-a-url";
    await expect(importEnv()).rejects.toThrow();
    expect(console.error).toHaveBeenCalled();
  });

  it("throws when URL has a trailing slash", async () => {
    process.env.NEXT_PUBLIC_ZONOS_CDN_URL = "https://example.com/";
    await expect(importEnv()).rejects.toThrow();
    expect(console.error).toHaveBeenCalled();
  });

  it("accepts valid deployment platform values", async () => {
    process.env.DEPLOYMENT_PLATFORM = "vercel";
    await expect(importEnv()).resolves.not.toThrow();

    process.env.DEPLOYMENT_PLATFORM = "cloudflare";
    await expect(importEnv()).resolves.not.toThrow();
  });

  it("throws when deployment platform has invalid value", async () => {
    process.env.DEPLOYMENT_PLATFORM = "invalid-platform";
    await expect(importEnv()).rejects.toThrow();
    expect(console.error).toHaveBeenCalled();
  });
});
