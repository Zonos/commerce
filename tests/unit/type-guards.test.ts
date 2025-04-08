import { describe, expect, it } from "vitest";
import { isObject, isShopifyError } from "../../lib/type-guards";

describe("isObject", () => {
  it("returns true for plain objects", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: "value" })).toBe(true);
  });

  it("returns true for object instances", () => {
    expect(isObject(new Date())).toBe(true);
    expect(isObject(new RegExp(""))).toBe(true);
    expect(isObject(new Map())).toBe(true);
  });

  it("returns false for arrays", () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it("returns false for null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isObject(42)).toBe(false);
    expect(isObject("string")).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(Symbol("symbol"))).toBe(false);
  });

  it("returns false for functions", () => {
    expect(isObject(() => {})).toBe(false);
    expect(isObject(function () {})).toBe(false);
  });
});

describe("isShopifyError", () => {
  it("returns false for non-object values", () => {
    expect(isShopifyError(null)).toBe(false);
    expect(isShopifyError(undefined)).toBe(false);
    expect(isShopifyError(42)).toBe(false);
    expect(isShopifyError("error message")).toBe(false);
    expect(isShopifyError([])).toBe(false);
  });

  it("returns true for Error instances", () => {
    expect(isShopifyError(new Error("test error"))).toBe(true);
    expect(isShopifyError(new TypeError("type error"))).toBe(true);
  });

  it("returns true for objects with toString method returning [object Error]", () => {
    const errorLikeObject = {
      toString: () => "[object Error]",
      status: 404,
    };
    expect(isShopifyError(errorLikeObject)).toBe(true);
  });

  it("returns true for objects that inherit from Error", () => {
    class CustomError extends Error {
      status: number;

      constructor(message: string, status: number) {
        super(message);
        this.status = status;
      }
    }

    const customError = new CustomError("Custom error", 500);
    expect(isShopifyError(customError)).toBe(true);
  });

  it("returns false for objects that do not match the interface", () => {
    expect(isShopifyError({ foo: "bar" })).toBe(false);
    expect(isShopifyError({ status: 404 })).toBe(false); // missing message
    expect(isShopifyError({ message: "error" })).toBe(false); // message is not an Error, and missing status
  });
});
