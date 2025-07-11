import type {
  ZonosCartAdjustmentType,
  ZonosCountryCode,
  ZonosCurrencyCode,
  ZonosItemMeasurementType,
  ZonosItemType,
  ZonosItemUnitOfMeasure,
  ZonosItemValueSource,
  ZonosMode,
  ZonosRestrictedItemAction,
} from "@zonos/typescript-sdk";

export type CartByIdPayload = {
  id: string;
};

export type CartResponse = {
  id: string;
  organizationId: string;
  createdAt: string;
  expiresAt: string | null;
  adjustments: {
    amount: number;
    currencyCode: ZonosCurrencyCode;
    description: string | null;
    productId: string | null;
    sku: string | null;
    type: ZonosCartAdjustmentType;
  }[];
  items: {
    id: string;
    amount: number;
    currencyCode: ZonosCurrencyCode;
    description: string | null;
    productId: string;
    sku: string | null;
    name: string | null;
    imageUrl: string | null;
    quantity: number;
    measurements: ItemMeasurement[];
    provinceOfOrigin: string | null;
    countryOfOrigin: ZonosCountryCode | null;
    restriction: {
      reason: string;
      action: ZonosRestrictedItemAction;
    } | null;
    attributes: {
      key: string;
      value: string;
    }[];
    metadata: {
      key: string;
      value: string;
    }[];
  }[];
  metadata: {
    key: string;
    value: string;
  }[];
};

export type CartByIdResponse = CartResponse;

export type CartCreateResponse = CartResponse;

export type CartUpdateResponse = CartResponse;

export type ItemAttribute = {
  key: string;
  value: string | null;
};

export type ItemMetadata = {
  key: string;
  value: string | null;
};

export type ItemMeasurement = {
  source: ZonosItemValueSource;
  type: ZonosItemMeasurementType;
  unitOfMeasure: ZonosItemUnitOfMeasure;
  value: number;
};

export type ProductResponse = {
  amount: number | null;
  /** Other `CatalogItem` attributes. */
  attributes: Array<ItemAttribute>;
  /** The marketing name associated with an item. */
  brand: string | null;
  /** The `CatalogItem` location. */
  catalogItemUrl: string | null;
  /** The categories that describes the `CatalogItem` */
  categories: Array<string>;
  /** Where a CatalogItem is manufactured. */
  countryOfOrigin: ZonosCountryCode | null;
  /** When this `CatalogItem` was created. */
  createdAt: string;
  /** The currency that the amount of this `CatalogItem` is in. */
  currencyCode: ZonosCurrencyCode | null;
  /** The `CatalogItem` full description. */
  description: string | null;
  /** The ID of the `CatalogItem`. */
  id: string;
  /** The url of an image. */
  imageUrl: string | null;
  /** The item's key that is used to identify the catalog item. */
  itemKey: string;
  /** Determines whether or not an item can be physically shipped. */
  itemType: ZonosItemType;
  /** The `CatalogItem` material composition. */
  material: string | null;
  /** A `CatalogItem` physical measurements. */
  measurements: Array<ItemMeasurement>;
  /** Other `CatalogItem` details ie: vendor_id. */
  metadata: Array<ItemMetadata>;
  /** Whether this `Item` was created in live or test mode. */
  mode: ZonosMode;
  /** The primary name of a `CatalogItem`. */
  name: string | null;
  /** Product ID of the `CatalogItem`. */
  productId: string | null;
  /** Optional administrative area where this item originates. Required by some countries. */
  provinceOfOrigin: string | null;
  /** A list of restricted country code */
  restrictedCountries: Array<ZonosCountryCode>;
  /** The suggested retail amount */
  retailAmount: number | null;
  /** SKU of this `CatalogItem`. */
  sku: string | null;
};

export type ProductsResponse = Array<ProductResponse>;
