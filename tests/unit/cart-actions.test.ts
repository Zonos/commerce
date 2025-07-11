import {
  zonosClient,
  type ZonosCartUpsertInput,
  type ZonosCurrencyCode,
} from "@zonos/typescript-sdk";
import {
  addItem,
  removeItem,
  updateItemQuantity,
} from "components/cart/actions";
import { getProducts } from "lib/data-samples";
import { addToCart, getCart, removeFromCart, updateCart } from "lib/zonos";
import type { ZonosCart } from "lib/zonos/types";
import type { productStubs } from "tests/unit/mocks/_products";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock all the dependencies before imports
vi.mock("lib/zonos", async () => ({
  addToCart: vi.fn(),
  getCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateCart: vi.fn(),
}));

// Mock the SDK client
vi.mock("@zonos/typescript-sdk", () => ({
  zonosClient: {
    cartUpsert: vi.fn(),
    cartById: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

const mockCookies = {
  get: vi.fn(),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => mockCookies),
}));

vi.mock("lib/zonos/environment", () => ({
  env: {
    CUSTOMER_GRAPH_TOKEN: "test-token",
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("lib/data-samples", () => ({
  getProducts: vi.fn(),
}));

// Helper function to create a cart item with all required properties
const createMockCartItem = ({
  id,
  sku,
  quantity,
}: {
  id: string;
  sku: string;
  quantity: number;
}): ZonosCart["items"][number] => ({
  id,
  sku,
  restriction: null,
  quantity,
  amount: 10.0,
  attributes: [{ key: "color", value: "blue" }],
  currencyCode: "USD" as ZonosCurrencyCode,
  description: "Test product",
  imageUrl: "https://example.com/image.jpg",
  metadata: [{ key: "handle", value: "classic-t-shirt" }],
  name: "Test Product",
  productId: "prod-123",
  measurements: [],
  provinceOfOrigin: null,
  countryOfOrigin: null,
});

const createMockCartItemInput = ({
  sku,
  quantity,
}: {
  sku: string;
  quantity: number;
}): ZonosCartUpsertInput["items"][number] => ({
  sku,
  quantity,
  amount: 10.0,
  attributes: [{ key: "color", value: "blue" }],
  currencyCode: "USD",
  description: "Test product",
  imageUrl: "https://example.com/image.jpg",
  metadata: [{ key: "handle", value: "classic-t-shirt" }],
  name: "Test Product",
  productId: "prod-123",
  measurements: [],
  provinceOfOrigin: null,
  countryOfOrigin: null,
});

const createMockProduct = ({
  sku,
}: {
  sku: string;
}): (typeof productStubs)[0] => {
  const cartItem = createMockCartItemInput({ sku, quantity: 0 });
  return {
    availableForSale: true,
    title: cartItem.name || "",
    description: cartItem.description || "",
    descriptionHtml: cartItem.description || "",
    options: [],
    priceRange: {
      maxVariantPrice: {
        amount: cartItem.amount.toString(),
        currencyCode: cartItem.currencyCode,
      },
      minVariantPrice: {
        amount: cartItem.amount.toString(),
        currencyCode: cartItem.currencyCode,
      },
    },
    variants: [
      {
        id: sku,
        title: "S / Black",
        availableForSale: true,
        selectedOptions:
          cartItem.attributes?.map((attribute) => ({
            name: attribute?.key || "",
            value: attribute?.value || "",
          })) || [],
        price: {
          amount: cartItem.amount.toString(),
          currencyCode: cartItem.currencyCode,
        },
        product: {
          id: cartItem.productId || "",
          handle: "classic-t-shirt",
          title: cartItem.name || "",
          featuredImage: {
            url: cartItem.imageUrl || "",
            altText: cartItem.name || "",
            width: 600,
            height: 800,
          },
        },
      },
    ],
    featuredImage: {
      url: cartItem.imageUrl || "",
      altText: cartItem.name || "",
      width: 600,
      height: 800,
    },
    images: [],
    updatedAt: new Date().toISOString(),
    handle: "classic-t-shirt",
    seo: {
      title: cartItem.name || "",
      description: cartItem.description || "",
    },
    tags: [],
    id: cartItem.productId || "",
  };
};

// Helper function to create a mock cart
const createMockCart = (
  items: ReturnType<typeof createMockCartItem>[] = [],
): ZonosCart => ({
  id: "test-cart-id",
  organizationId: "org-1",
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
  items,
  adjustments: [],
  metadata: [],
  totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
  checkoutUrl: "#",
  cost: {
    totalAmount: { amount: "10.00", currencyCode: "USD" as ZonosCurrencyCode },
    subtotalAmount: {
      amount: "10.00",
      currencyCode: "USD" as ZonosCurrencyCode,
    },
  },
});

describe("Cart Actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock getProducts to return the mock products
    vi.mocked(getProducts).mockResolvedValue([
      createMockProduct({ sku: "variant-1-1" }),
      createMockProduct({ sku: "variant-1-2" }),
    ]);
  });

  describe("addItem", () => {
    it("should add item to cart when cart is empty", async () => {
      const mockCart = createMockCart();
      vi.mocked(addToCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .addToCart,
      );
      vi.mocked(zonosClient.cartUpsert).mockResolvedValue({
        errors: [],
        json: {
          cartUpsert: mockCart,
        },
      });

      const result = await addItem(null, { sku: "variant-1-1", quantity: 1 });

      expect(addToCart).toHaveBeenCalledWith({
        sku: "variant-1-1",
        quantity: 1,
      });
      expect(
        zonosClient.cartUpsert,
        "should call cartUpsert with the current state of the cart items",
      ).toHaveBeenCalledWith({
        credentialToken: expect.any(String),
        variables: {
          input: {
            items: [
              createMockCartItemInput({ sku: "variant-1-1", quantity: 1 }),
            ],
            adjustments: mockCart.adjustments,
            metadata: mockCart.metadata || [],
          },
        },
      });
      expect(result, "should return the cart id").toEqual(mockCart.id);
    });

    it("should increment item quantity when item already exists in cart", async () => {
      const mockCart = createMockCart([
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 1 }),
      ]);
      const expectedCart = createMockCart([
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 2 }),
      ]);
      vi.mocked(addToCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .addToCart,
      );
      // Mock cookies from next/headers and return the mock cart id
      vi.mocked(mockCookies.get).mockReturnValue({
        value: mockCart.id,
        name: "cartId",
      });

      vi.mocked(zonosClient.cartUpsert).mockResolvedValue({
        errors: [],
        json: {
          cartUpsert: expectedCart,
        },
      });

      vi.mocked(zonosClient.cartById).mockResolvedValue({
        errors: [],
        json: {
          cart: mockCart,
        },
      });

      const result = await addItem(null, { sku: "variant-1-1", quantity: 1 });

      expect(addToCart).toHaveBeenCalledWith({
        sku: "variant-1-1",
        quantity: 1,
      });
      expect(
        zonosClient.cartUpsert,
        "should call cartUpsert with the current state of the cart items",
      ).toHaveBeenCalledWith({
        credentialToken: expect.any(String),
        variables: {
          input: {
            id: mockCart.id,
            items: [
              createMockCartItemInput({ sku: "variant-1-1", quantity: 2 }),
            ],
            adjustments: mockCart.adjustments,
            metadata: mockCart.metadata || [],
          },
        },
      });
      expect(result, "should return the cart id").toEqual(mockCart.id);
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
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 1 }),
        createMockCartItem({ id: "item-2", sku: "variant-1-2", quantity: 1 }),
      ]);
      const expectedCart = createMockCart([
        createMockCartItem({ id: "item-2", sku: "variant-1-2", quantity: 1 }),
      ]);

      vi.mocked(getCart).mockResolvedValue(mockCart);

      vi.mocked(removeFromCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .removeFromCart,
      );
      vi.mocked(zonosClient.cartById).mockResolvedValue({
        errors: [],
        json: {
          cart: mockCart,
        },
      });

      vi.mocked(zonosClient.cartUpsert).mockResolvedValue({
        errors: [],
        json: {
          cartUpsert: expectedCart,
        },
      });

      const cartId = await removeItem(null, "item-1");

      expect(removeFromCart).toHaveBeenCalledWith({
        cart: mockCart,
        itemIds: ["item-1"],
      });

      expect(
        zonosClient.cartUpsert,
        "should call cartUpsert with the current state of the cart items (with items list after removing the item)",
      ).toHaveBeenCalledWith({
        credentialToken: expect.any(String),
        variables: {
          input: {
            id: mockCart.id,
            items: [
              createMockCartItemInput({ sku: "variant-1-2", quantity: 1 }),
            ],
            adjustments: mockCart.adjustments,
            metadata: mockCart.metadata || [],
          },
        },
      });
      expect(cartId).toBe(mockCart.id);
    });

    it("should return error if cart is not found", async () => {
      vi.mocked(getCart).mockResolvedValue(undefined);

      const result = await removeItem(null, "item-1");

      expect(removeFromCart).not.toHaveBeenCalled();
      expect(result).toBe("Error fetching cart");
    });

    it("should return error if item is not found in cart", async () => {
      const mockCart = createMockCart([
        createMockCartItem({ id: "item-2", sku: "variant-1-2", quantity: 1 }),
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
    it("should increase item quantity if item already exists in cart", async () => {
      const mockCart = createMockCart([
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 1 }),
      ]);

      const expectedCart = createMockCart([
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 2 }),
      ]);

      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(zonosClient.cartById).mockResolvedValue({
        errors: [],
        json: {
          cart: mockCart,
        },
      });
      vi.mocked(updateCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .updateCart,
      );
      vi.mocked(removeFromCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .removeFromCart,
      );
      vi.mocked(addToCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .addToCart,
      );

      vi.mocked(zonosClient.cartUpsert).mockResolvedValue({
        errors: [],
        json: {
          cartUpsert: expectedCart,
        },
      });

      const result = await updateItemQuantity(null, {
        sku: "variant-1-1",
        quantity: 2,
      });

      // Get the item from the mock cart
      const lineItem = mockCart.items.find(
        (item) => item.sku === "variant-1-1",
      );

      expect(updateCart).toHaveBeenCalledWith({
        cart: mockCart,
        newUpdateItems: [
          {
            ...lineItem,
            quantity: 2,
          },
        ],
      });
      expect(zonosClient.cartUpsert).toHaveBeenCalledWith({
        credentialToken: expect.any(String),
        variables: {
          input: {
            id: mockCart.id,
            items: [
              createMockCartItemInput({ sku: "variant-1-1", quantity: 2 }),
            ],
            adjustments: mockCart.adjustments,
            metadata: mockCart.metadata,
          },
        },
      });
      expect(result).toBe(mockCart.id);
    });

    it("should remove item if quantity is 0", async () => {
      const mockCart = createMockCart([
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 1 }),
        createMockCartItem({ id: "item-2", sku: "variant-1-2", quantity: 1 }),
      ]);
      const expectedCart = createMockCart([
        createMockCartItem({ id: "item-2", sku: "variant-1-2", quantity: 1 }),
      ]);
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(removeFromCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .removeFromCart,
      );
      vi.mocked(zonosClient.cartUpsert).mockResolvedValue({
        errors: [],
        json: {
          cartUpsert: expectedCart,
        },
      });

      const result = await updateItemQuantity(null, {
        sku: "variant-1-1",
        quantity: 0,
      });

      expect(removeFromCart).toHaveBeenCalledWith({
        cart: mockCart,
        itemIds: ["item-1"],
      });
      expect(zonosClient.cartUpsert).toHaveBeenCalledWith({
        credentialToken: expect.any(String),
        variables: {
          input: {
            id: mockCart.id,
            items: [
              createMockCartItemInput({ sku: "variant-1-2", quantity: 1 }),
            ],
            adjustments: mockCart.adjustments,
            metadata: mockCart.metadata || [],
          },
        },
      });
      expect(result).toBe(mockCart.id);
    });

    it("should add item if it doesn't exist in cart (this should not happen as this is to adjust the quantity of existing items, but we handle it just in case)", async () => {
      const mockCart = createMockCart();
      const expectedCart = createMockCart([
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 1 }),
      ]);
      // Mock cookies from next/headers and return the mock cart id
      vi.mocked(mockCookies.get).mockReturnValue({
        value: mockCart.id,
        name: "cartId",
      });
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(addToCart).mockImplementation(
        (await vi.importActual<typeof import("lib/zonos")>("lib/zonos"))
          .addToCart,
      );
      vi.mocked(zonosClient.cartById).mockResolvedValue({
        errors: [],
        json: {
          cart: mockCart,
        },
      });

      vi.mocked(zonosClient.cartUpsert).mockResolvedValue({
        errors: [],
        json: {
          cartUpsert: expectedCart,
        },
      });

      const result = await updateItemQuantity(null, {
        sku: "variant-1-1",
        quantity: 1,
      });

      expect(addToCart).toHaveBeenCalledWith({
        sku: "variant-1-1",
        quantity: 1,
      });
      expect(zonosClient.cartUpsert).toHaveBeenCalledWith({
        credentialToken: expect.any(String),
        variables: {
          input: {
            id: mockCart.id,
            items: [
              createMockCartItemInput({ sku: "variant-1-1", quantity: 1 }),
            ],
            adjustments: mockCart.adjustments,
            metadata: mockCart.metadata || [],
          },
        },
      });
      expect(result).toBe(mockCart.id);
    });

    it("should return an error if updateCart throws", async () => {
      const mockCart = createMockCart([
        createMockCartItem({ id: "item-1", sku: "variant-1-1", quantity: 1 }),
      ]);
      // Mock cookies from next/headers and return the mock cart id
      vi.mocked(mockCookies.get).mockReturnValue({
        value: mockCart.id,
        name: "cartId",
      });
      vi.mocked(getCart).mockResolvedValue(mockCart);
      vi.mocked(updateCart).mockRejectedValue(new Error("API error"));

      const result = await updateItemQuantity(null, {
        sku: "variant-1-1",
        quantity: 2,
      });

      expect(updateCart).toHaveBeenCalled();
      expect(result).toBe("Error updating item quantity");
    });
  });
});
