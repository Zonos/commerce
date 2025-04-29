import { describe, expect, it } from "vitest";
import { createUrl, ensureStartsWith } from "../../lib/utils";

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
