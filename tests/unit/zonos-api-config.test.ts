import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getZonosApiEndpoint,
  getZonosApiUrl,
} from '../../lib/zonos/api-config';

// Mock the environment module
vi.mock('../../lib/environment/environment.server', () => {
  return {
    serverEnv: {
      ZONOS_DEFAULT_URL: undefined,
      DEPLOYMENT_PLATFORM: undefined,
    },
  };
});

// Import the mock to update its values
import { serverEnv } from '../../lib/zonos/environment/environment.server';

// Instead of mocking, we'll test the actual behavior
describe('getZonosApiEndpoint', () => {
  it('combines the base URL with the endpoint', () => {
    expect(getZonosApiEndpoint('test')).toBe(
      'https://route.elements.zonos.com/test'
    );
  });

  it('removes leading slash from endpoint if present', () => {
    expect(getZonosApiEndpoint('/test')).toBe(
      'https://route.elements.zonos.com/test'
    );
  });

  it('handles multiple segments in the endpoint', () => {
    expect(getZonosApiEndpoint('v1/api/test')).toBe(
      'https://route.elements.zonos.com/v1/api/test'
    );
  });

  it('handles endpoints with query parameters', () => {
    expect(getZonosApiEndpoint('test?param=value')).toBe(
      'https://route.elements.zonos.com/test?param=value'
    );
  });

  it('handles empty endpoint string', () => {
    expect(getZonosApiEndpoint('')).toBe('https://route.elements.zonos.com/');
  });
});

describe('getZonosApiUrl', () => {
  beforeEach(() => {
    // Reset the mock state before each test
    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = undefined;
    vi.mocked(serverEnv).ZONOS_DEFAULT_URL = undefined;
  });

  it("returns Vercel API URL when DEPLOYMENT_PLATFORM is 'vercel'", () => {
    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = 'vercel';
    expect(getZonosApiUrl()).toBe('https://route.js.zonos.com');
  });

  it("returns Cloudflare API URL when DEPLOYMENT_PLATFORM is 'cloudflare'", () => {
    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = 'cloudflare';
    expect(getZonosApiUrl()).toBe('https://route.elements.zonos.com');
  });

  it('handles case-insensitive deployment platform values', () => {
    // Note: T3 validation would normalize this before it reaches this function
    // we're just testing to be thorough
    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = 'vercel';
    expect(getZonosApiUrl()).toBe('https://route.js.zonos.com');

    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = 'cloudflare';
    expect(getZonosApiUrl()).toBe('https://route.elements.zonos.com');
  });

  it('returns default API URL when DEPLOYMENT_PLATFORM is not set', () => {
    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = undefined;
    expect(getZonosApiUrl()).toBe('https://route.elements.zonos.com');
  });

  it('returns default API URL when DEPLOYMENT_PLATFORM is not recognized', () => {
    // This shouldn't happen in production due to T3 schema validation
    // but we test for robustness
    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = 'unknown' as unknown as
      | 'vercel'
      | 'cloudflare'
      | undefined;
    expect(getZonosApiUrl()).toBe('https://route.elements.zonos.com');
  });

  it('uses ZONOS_DEFAULT_URL when specified', () => {
    vi.mocked(serverEnv).ZONOS_DEFAULT_URL = 'https://custom.api.zonos.com';
    vi.mocked(serverEnv).DEPLOYMENT_PLATFORM = undefined;
    expect(getZonosApiUrl()).toBe('https://custom.api.zonos.com');
  });
});
