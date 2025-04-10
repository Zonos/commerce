import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addItem,
  createCartAndSetCookie,
  redirectToCheckout,
  removeItem,
  updateItemQuantity,
} from "../../components/cart/actions";
import { TAGS } from "../../lib/constants";
import type { CurrencyCode } from "../../lib/zonos/api/baseTypes";
import type { ZonosCart } from "../../lib/zonos/types";

// Mock all the dependencies before imports
vi.mock("lib/zonos", () => ({
  addToCart: vi.fn(),
  createCart: vi.fn(),
  getCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateCart: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Now import the mocked functions
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/zonos";

// Helper function to create a cart item with all required properties
const createMockCartItem = (id: string, sku: string, quantity: number) => ({
  id,
  sku,
  quantity,
  amount: 10.0,
  attributes: [{ key: "color", value: "blue" }],
  currencyCode: "USD" as CurrencyCode,
  description: "Test product",
  imageUrl: "https://example.com/image.jpg",
  metadata: [{ key: "source", value: "test" }],
  name: "Test Product",
  productId: "prod-123",
  restriction: undefined,
});

// Helper function to create a mock cart
const createMockCart = (
  items: ReturnType<typeof createMockCartItem>[] = [],
): ZonosCart => ({
  id: "test-cart-id",
  items,
  adjustments: [],
  metadata: [],
  totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
  checkoutUrl: "#",
  cost: {
    totalAmount: { amount: "10.00", currencyCode: "USD" as CurrencyCode },
    subtotalAmount: { amount: "10.00", currencyCode: "USD" as CurrencyCode },
  },
});

describe("Cart Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addItem", () => {
    it("should add an item to the cart", async () => {
      // Mock implementation
      vi.mocked(addToCart).mockResolvedValueOnce({} as ZonosCart);

      // Call the action
      const result = await addItem({}, { sku: "test-sku", quantity: 1 });

      // Verify the action called the correct dependencies
      expect(addToCart).toHaveBeenCalledWith({
        sku: "test-sku",
        quantity: 1,
      });
      expect(revalidateTag).toHaveBeenCalledWith(TAGS.cart);
      expect(result).toBeUndefined();
    });

    it("should return an error if sku is missing", async () => {
      // Call the action without a sku
      const result = await addItem({}, { quantity: 1 });

      // Verify it returns an error and doesn't call dependencies
      expect(result).toBe("Error adding item to cart");
      expect(addToCart).not.toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("should return an error if addToCart throws", async () => {
      // Mock addToCart to throw an error
      vi.mocked(addToCart).mockRejectedValueOnce(new Error("API error"));

      // Call the action
      const result = await addItem({}, { sku: "test-sku", quantity: 1 });

      // Verify error handling
      expect(result).toBe("Error adding item to cart");
      expect(addToCart).toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the cart", async () => {
      // Mock cart data
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);
      vi.mocked(removeFromCart).mockResolvedValueOnce({} as ZonosCart);

      // Call the action
      const result = await removeItem({}, "item-1");

      // Verify the correct dependencies were called
      expect(getCart).toHaveBeenCalled();
      expect(removeFromCart).toHaveBeenCalledWith(["item-1"]);
      expect(revalidateTag).toHaveBeenCalledWith(TAGS.cart);
      expect(result).toBeUndefined();
    });

    it("should return an error if getCart fails", async () => {
      // Mock getCart to return null
      vi.mocked(getCart).mockResolvedValueOnce(undefined);

      // Call the action
      const result = await removeItem({}, "item-1");

      // Verify error handling
      expect(result).toBe("Error fetching cart");
      expect(removeFromCart).not.toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("should return an error if item is not found", async () => {
      // Mock cart data without the target item
      const mockCart = createMockCart([
        createMockCartItem("item-2", "other-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);

      // Call the action
      const result = await removeItem({}, "item-1");

      // Verify error handling
      expect(result).toBe("Item not found in cart");
      expect(removeFromCart).not.toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("should return an error if removeFromCart throws", async () => {
      // Mock cart data
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);
      vi.mocked(removeFromCart).mockRejectedValueOnce(new Error("API error"));

      // Call the action
      const result = await removeItem({}, "item-1");

      // Verify error handling
      expect(result).toBe("Error removing item from cart");
      expect(removeFromCart).toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });

  describe("updateItemQuantity", () => {
    it("should update quantity when item exists and quantity > 0", async () => {
      // Mock cart data
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);
      vi.mocked(updateCart).mockResolvedValueOnce({} as ZonosCart);

      // Call the action
      const result = await updateItemQuantity(
        {},
        { sku: "test-sku", quantity: 2 },
      );

      // Verify the correct dependencies were called
      expect(getCart).toHaveBeenCalled();
      expect(updateCart).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalledWith(TAGS.cart);
      expect(result).toBeUndefined();
    });

    it("should remove item when quantity is 0", async () => {
      // Mock cart data
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);
      vi.mocked(removeFromCart).mockResolvedValueOnce({} as ZonosCart);

      // Call the action
      const result = await updateItemQuantity(
        {},
        { sku: "test-sku", quantity: 0 },
      );

      // Verify the correct dependencies were called
      expect(getCart).toHaveBeenCalled();
      expect(removeFromCart).toHaveBeenCalledWith(["item-1"]);
      expect(revalidateTag).toHaveBeenCalledWith(TAGS.cart);
      expect(result).toBeUndefined();
    });

    it("should add item when it doesn't exist and quantity > 0", async () => {
      // Mock cart data without the target item
      const mockCart = createMockCart([
        createMockCartItem("item-2", "other-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);
      vi.mocked(addToCart).mockResolvedValueOnce({} as ZonosCart);

      // Call the action
      const result = await updateItemQuantity(
        {},
        { sku: "test-sku", quantity: 3 },
      );

      // Verify the correct dependencies were called
      expect(getCart).toHaveBeenCalled();
      expect(addToCart).toHaveBeenCalledWith({
        sku: "test-sku",
        quantity: 3,
      });
      expect(revalidateTag).toHaveBeenCalledWith(TAGS.cart);
      expect(result).toBeUndefined();
    });

    it("should return an error if getCart fails", async () => {
      // Mock getCart to return null
      vi.mocked(getCart).mockResolvedValueOnce(undefined);

      // Call the action
      const result = await updateItemQuantity(
        {},
        { sku: "test-sku", quantity: 2 },
      );

      // Verify error handling
      expect(result).toBe("Error fetching cart");
      expect(updateCart).not.toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("should return an error if updateCart throws", async () => {
      // Mock cart data
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);
      vi.mocked(updateCart).mockRejectedValueOnce(new Error("API error"));

      // Call the action
      const result = await updateItemQuantity(
        {},
        { sku: "test-sku", quantity: 2 },
      );

      // Verify error handling
      expect(result).toBe("Error updating item quantity");
      expect(updateCart).toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });

  describe("redirectToCheckout", () => {
    it("should redirect to checkout page", async () => {
      // Mock getCart
      const mockCart = createMockCart();
      vi.mocked(getCart).mockResolvedValueOnce(mockCart);

      // Call the action
      await redirectToCheckout();

      // Verify redirect was called
      expect(getCart).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/checkout");
    });
  });

  describe("createCartAndSetCookie", () => {
    it("should create a cart and set cookie", async () => {
      // Mock createCart
      vi.mocked(createCart).mockResolvedValueOnce({
        id: "new-cart-id",
      } as ZonosCart);

      // Mock cookie operations
      const mockSet = vi.fn();
      vi.mocked(cookies).mockReturnValue({
        get: vi.fn(),
        set: mockSet,
      } as unknown as ReturnType<typeof cookies>);

      // Call the action
      const result = await createCartAndSetCookie();

      // Verify the correct dependencies were called
      expect(createCart).toHaveBeenCalled();
      expect(cookies).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith("cartId", "new-cart-id");
      expect(result).toBe("new-cart-id");
    });
  });
});
