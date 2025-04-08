import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getZonosApiEndpoint,
  getZonosApiUrl,
} from "../../lib/zonos/api-config";

// Instead of mocking, we'll test the actual behavior
describe("getZonosApiEndpoint", () => {
  it("combines the base URL with the endpoint", () => {
    expect(getZonosApiEndpoint("test")).toBe(
      "https://route.elements.zonos.com/test",
    );
  });

  it("removes leading slash from endpoint if present", () => {
    expect(getZonosApiEndpoint("/test")).toBe(
      "https://route.elements.zonos.com/test",
    );
  });

  it("handles multiple segments in the endpoint", () => {
    expect(getZonosApiEndpoint("v1/api/test")).toBe(
      "https://route.elements.zonos.com/v1/api/test",
    );
  });

  it("handles endpoints with query parameters", () => {
    expect(getZonosApiEndpoint("test?param=value")).toBe(
      "https://route.elements.zonos.com/test?param=value",
    );
  });

  it("handles empty endpoint string", () => {
    expect(getZonosApiEndpoint("")).toBe("https://route.elements.zonos.com/");
  });
});

describe("getZonosApiUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Create a fresh copy of process.env before each test
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original process.env after each test
    process.env = originalEnv;
  });

  it("returns Vercel API URL when DEPLOYMENT_PLATFORM is 'vercel'", () => {
    process.env.DEPLOYMENT_PLATFORM = "vercel";
    expect(getZonosApiUrl()).toBe("https://route.js.zonos.com");
  });

  it("returns Cloudflare API URL when DEPLOYMENT_PLATFORM is 'cloudflare'", () => {
    process.env.DEPLOYMENT_PLATFORM = "cloudflare";
    expect(getZonosApiUrl()).toBe("https://route.elements.zonos.com");
  });

  it("handles case-insensitive deployment platform values", () => {
    process.env.DEPLOYMENT_PLATFORM = "VERCEL";
    expect(getZonosApiUrl()).toBe("https://route.js.zonos.com");

    process.env.DEPLOYMENT_PLATFORM = "CLOUDFLARE";
    expect(getZonosApiUrl()).toBe("https://route.elements.zonos.com");
  });

  it("returns default API URL when DEPLOYMENT_PLATFORM is not set", () => {
    delete process.env.DEPLOYMENT_PLATFORM;
    expect(getZonosApiUrl()).toBe("https://route.elements.zonos.com");
  });

  it("returns default API URL when DEPLOYMENT_PLATFORM is not recognized", () => {
    process.env.DEPLOYMENT_PLATFORM = "unknown";
    expect(getZonosApiUrl()).toBe("https://route.elements.zonos.com");
  });

  it("uses ZONOS_DEFAULT_URL when specified", () => {
    process.env.ZONOS_DEFAULT_URL = "https://custom.api.zonos.com";
    delete process.env.DEPLOYMENT_PLATFORM;
    expect(getZonosApiUrl()).toBe("https://custom.api.zonos.com");
  });
});
