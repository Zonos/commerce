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
    vi.resetAllMocks();
  });

  describe("addItem", () => {
    it("should add item to cart", async () => {
      const mockCart = createMockCart();
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(addToCart).mockResolvedValue(mockCart);

      const result = await addItem(null, { sku: "test-sku", quantity: 1 });

      expect(addToCart).toHaveBeenCalledWith({
        sku: "test-sku",
        quantity: 1,
      });
      expect(result).toBeNull();
    });

    it("should return error if sku is missing", async () => {
      const result = await addItem(null, { quantity: 1 });

      expect(addToCart).not.toHaveBeenCalled();
      expect(result).toBe("Error adding item to cart");
    });

    it("should handle error from addToCart", async () => {
      vi.mocked(addToCart).mockRejectedValue(new Error("API error"));

      const result = await addItem(null, { sku: "test-sku", quantity: 1 });

      expect(addToCart).toHaveBeenCalledWith({
        sku: "test-sku",
        quantity: 1,
      });
      expect(result).toBe("Error adding item to cart");
    });
  });

  describe("removeItem", () => {
    it("should remove item from cart", async () => {
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(removeFromCart).mockResolvedValue(mockCart);

      const result = await removeItem(null, "item-1");

      expect(removeFromCart).toHaveBeenCalledWith(["item-1"]);
      expect(result).toBeNull();
    });

    it("should return error if cart is not found", async () => {
      vi.mocked(getCart).mockResolvedValue(undefined);

      const result = await removeItem(null, "item-1");

      expect(removeFromCart).not.toHaveBeenCalled();
      expect(result).toBe("Error fetching cart");
    });

    it("should return error if item is not found in cart", async () => {
      const mockCart = createMockCart([
        createMockCartItem("item-2", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValue(mockCart);

      const result = await removeItem(null, "item-1");

      expect(removeFromCart).not.toHaveBeenCalled();
      expect(result).toBe("Item not found in cart");
    });

    it("should handle error from getCart", async () => {
      vi.mocked(getCart).mockRejectedValue(new Error("API error"));

      const result = await removeItem(null, "item-1");

      expect(removeFromCart).not.toHaveBeenCalled();
      expect(result).toBe("Error removing item from cart");
    });
  });

  describe("updateItemQuantity", () => {
    it("should update item quantity", async () => {
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(updateCart).mockResolvedValue(mockCart);

      const result = await updateItemQuantity(null, {
        sku: "test-sku",
        quantity: 2,
      });

      // Get the item from the mock cart
      const lineItem = mockCart.items.find((item) => item.sku === "test-sku");

      expect(updateCart).toHaveBeenCalledWith({
        cart: mockCart,
        newUpdateItems: [
          {
            ...lineItem,
            quantity: 2,
          },
        ],
      });
      expect(result).toBeNull();
    });

    it("should remove item if quantity is 0", async () => {
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(removeFromCart).mockResolvedValue(mockCart);

      const result = await updateItemQuantity(null, {
        sku: "test-sku",
        quantity: 0,
      });

      expect(removeFromCart).toHaveBeenCalledWith(["item-1"]);
      expect(result).toBeNull();
    });

    it("should add item if it doesn't exist in cart", async () => {
      const mockCart = createMockCart();
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(addToCart).mockResolvedValue(mockCart);

      const result = await updateItemQuantity(null, {
        sku: "test-sku",
        quantity: 1,
      });

      expect(addToCart).toHaveBeenCalledWith({
        sku: "test-sku",
        quantity: 1,
      });
      expect(result).toBeNull();
    });

    it("should return an error if updateCart throws", async () => {
      const mockCart = createMockCart([
        createMockCartItem("item-1", "test-sku", 1),
      ]);
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(updateCart).mockRejectedValue(new Error("API error"));

      const result = await updateItemQuantity(null, {
        sku: "test-sku",
        quantity: 2,
      });

      expect(updateCart).toHaveBeenCalled();
      expect(result).toBe("Error updating item quantity");
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
