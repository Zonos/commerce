import { beforeEach, describe, expect, it, vi } from "vitest";
import { zonosFetch } from "../../lib/zonos";

// Mock the global fetch function
vi.stubGlobal("fetch", vi.fn());

// Mock the getZonosApiEndpoint function
vi.mock("../../lib/zonos/api-config", () => ({
  getZonosApiEndpoint: vi.fn(
    (endpoint) => `https://route.elements.zonos.com${endpoint}`,
  ),
}));

// Define CUSTOMER_GRAPH_TOKEN directly in process.env
process.env.CUSTOMER_GRAPH_TOKEN = "test-token";

describe("zonosFetch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Setup fetch mock to return a successful response
    vi.mocked(fetch).mockResolvedValue({
      text: vi.fn().mockResolvedValue(JSON.stringify({ success: true })),
    } as unknown as Response);
  });

  it("correctly handles path parameters in GET requests", async () => {
    // Define the endpoint with a path parameter
    const endpoint = "/api/commerce/cart/{id}";
    const body = { id: "test-cart-id" };

    // Call zonosFetch with explicit type parameters
    await zonosFetch<{
      endpoint: string;
      data: any;
      method: "GET";
      payload: typeof body;
    }>({
      endpoint,
      body,
      method: "GET",
      headers: {
        credentialToken: "test-token",
      },
    });

    // Check that fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = vi.mocked(fetch).mock.calls[0]!;
    console.log(fetchArgs);
    const fetchUrl = fetchArgs[0] as string;

    // Verify the URL has the path parameter replaced correctly
    expect(fetchUrl).toBe(
      "https://route.elements.zonos.com/api/commerce/cart/test-cart-id",
    );

    // Verify other aspects of the request
    const fetchOptions = fetchArgs[1] as RequestInit;
    expect(fetchOptions.method).toBe("GET");

    // Headers are handled by the code being tested
    expect(fetchOptions.headers).toHaveProperty(
      "Content-Type",
      "application/json",
    );
    expect(fetchOptions.headers).toHaveProperty(
      "credentialToken",
      "test-token",
    );
    expect(fetchOptions.body).toBeUndefined();
  });

  it("correctly adds query parameters for GET requests without path parameters", async () => {
    // Define an endpoint without path parameters
    const endpoint = "/api/commerce/products";
    const body = { limit: 10, page: 1 };

    // Call zonosFetch with explicit type parameters
    await zonosFetch<{
      endpoint: string;
      data: any;
      method: "GET";
      payload: typeof body;
    }>({
      endpoint,
      body,
      method: "GET",
    });

    // Check that fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = vi.mocked(fetch).mock.calls[0]!;
    const fetchUrl = fetchArgs[0] as string;

    // Verify the URL has the query parameters added correctly
    const url = new URL(fetchUrl);
    expect(url.pathname).toBe("/api/commerce/products");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("handles JSON body for POST requests", async () => {
    // Define the endpoint and body for a POST request
    const endpoint = "/api/commerce/cart/create";
    const body = { items: [], adjustments: [] };

    // Call zonosFetch with explicit type parameters
    await zonosFetch<{
      endpoint: string;
      data: any;
      method: "POST";
      payload: typeof body;
    }>({
      endpoint,
      body,
      method: "POST",
    });

    // Check that fetch was called with the correct options
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = vi.mocked(fetch).mock.calls[0]!;
    const fetchOptions = fetchArgs[1] as RequestInit;

    expect(fetchOptions.method).toBe("POST");
    expect(fetchOptions.body).toBe(JSON.stringify(body));
  });
});
