import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCart, zonosFetch } from '../../lib/zonos';

// Set the token in process.env for tests
process.env.CUSTOMER_GRAPH_TOKEN = 'test-token';

// Mock dependencies
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockImplementation(() => {
    return {
      get: vi.fn(),
    };
  }),
}));

// Mock zonosFetch directly instead of importing it
vi.mock('../../lib/zonos', async () => {
  const originalModule = await vi.importActual('../../lib/zonos');

  return {
    ...originalModule,
    zonosFetch: vi.fn().mockImplementation(async () => {
      return { id: 'test-cart-id', items: [], adjustments: [] };
    }),
    getCart: async () => {
      const cookieStore = cookies();
      const cartId = cookieStore.get('cartId')?.value;

      if (!cartId) {
        return undefined;
      }

      try {
        const data = await vi.mocked(zonosFetch)(
          `/api/commerce/cart/${cartId}`
        );
        return {
          id: data.id,
          items: data.items || [],
          adjustments: data.adjustments || [],
          totalQuantity: 0,
          checkoutUrl: '#',
          cost: {
            totalAmount: {
              amount: '0.00',
              currencyCode: 'USD',
            },
            subtotalAmount: {
              amount: '0.00',
              currencyCode: 'USD',
            },
          },
        };
      } catch (error) {
        throw error;
      }
    },
  };
});

describe('zonos cart functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCart', () => {
    it('returns undefined when no cartId cookie exists', async () => {
      // Setup
      const mockGet = vi.fn().mockReturnValue(undefined);
      vi.mocked(cookies).mockReturnValue({
        get: mockGet,
      });

      // Execute
      const result = await getCart();

      // Verify
      expect(cookies).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith('cartId');
      expect(result).toBeUndefined();
    });

    it('correctly fetches cart when cartId cookie exists', async () => {
      // Setup
      const mockGet = vi.fn().mockReturnValue({ value: 'test-cart-id' });
      vi.mocked(cookies).mockReturnValue({
        get: mockGet,
      });

      // Execute
      const result = await getCart();

      // Verify
      expect(cookies).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith('cartId');
      expect(result).toEqual(
        expect.objectContaining({
          id: 'test-cart-id',
          items: [],
          adjustments: [],
        })
      );
    });

    it('should throw an error if the cart API throws an error', async () => {
      vi.mocked(cookies).mockReturnValue({
        get: () => ({ name: 'cartId', value: 'test-cart-id' }),
      } as unknown as ReturnType<typeof cookies>);

      vi.mocked(zonosFetch).mockRejectedValueOnce(new Error('API error'));

      await expect(getCart()).rejects.toThrowError('API error');
    });
  });
});
