import { TAGS } from "lib/constants";
import { collectionStubs } from "lib/data-samples/samples/collections";
import { menuStubs } from "lib/data-samples/samples/menu";
import { pageStubs } from "lib/data-samples/samples/pages";
import { productStubs } from "lib/data-samples/samples/products";
import type { Collection, Menu, Page, Product } from "lib/data-samples/types";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { NextResponse } from "next/server";

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const collection = collectionStubs.find(
    (collection) => collection.handle === handle,
  );

  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  // Find the collection
  const foundCollection = collectionStubs.find((c) => c.handle === collection);

  if (!foundCollection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  // Get the product IDs from the collection
  const productIds = foundCollection.products || [];

  // Filter products based on the collection's product IDs
  let filteredProducts = productStubs.filter((product) =>
    productIds.includes(product.id),
  );

  // Sort products based on sortKey if provided
  if (sortKey) {
    filteredProducts.sort((a, b) => {
      // Handle different sort keys
      switch (sortKey) {
        case "PRICE":
          return (
            parseFloat(a.priceRange.maxVariantPrice.amount) -
            parseFloat(b.priceRange.maxVariantPrice.amount)
          );
        case "CREATED_AT":
        case "UPDATED_AT":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        case "BEST_SELLING":
          // For stub data, we'll use a random value as a proxy for best selling
          return Math.random() - 0.5;
        case "RELEVANCE":
          // For manual sorting, we'll use the product ID as a proxy
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });
  }

  // Reverse the order if requested
  if (reverse) {
    filteredProducts.reverse();
  }

  return filteredProducts;
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...collectionStubs
      .map((collection) => ({
        ...collection,
        path: `/search/${collection.handle}`,
      }))
      .filter((collection) => !collection.handle.startsWith("hidden")),
  ];

  return collections;
}

export async function getMenu(
  handle: "next-js-frontend-header-menu" | "next-js-frontend-footer-menu",
): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const menu = menuStubs[handle];

  return menu;
}

export async function getPage(handle: string): Promise<Page> {
  const page = pageStubs.find((page) => page.handle === handle);

  if (!page) {
    throw new Error(`Page with handle "${handle}" not found`);
  }

  return page;
}

export async function getPages(): Promise<Page[]> {
  return pageStubs;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const product = productStubs.find((product) => product.handle === handle);

  return product;
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  // Find the current product
  const currentProduct = productStubs.find(
    (product) => product.id === productId,
  );

  if (!currentProduct) {
    return [];
  }

  // Filter out the current product
  const otherProducts = productStubs.filter(
    (product) => product.id !== productId,
  );

  // For recommendations, we'll use a simple algorithm:
  // 1. First, try to find products with matching tags
  // 2. Then, try to find products in the same price range
  // 3. Finally, add any remaining products up to a limit

  const matchingTags = currentProduct.tags || [];
  const currentPrice = parseFloat(
    currentProduct.priceRange.minVariantPrice.amount,
  );
  const priceRange = 20; // $20 price range for similar products

  // Find products with matching tags
  const tagMatches = otherProducts.filter((product) =>
    (product.tags || []).some((tag) => matchingTags.includes(tag)),
  );

  // Find products in similar price range
  const priceMatches = otherProducts.filter((product) => {
    const productPrice = parseFloat(product.priceRange.minVariantPrice.amount);
    return Math.abs(productPrice - currentPrice) <= priceRange;
  });

  // Combine and deduplicate recommendations
  const recommendations = [...new Set([...tagMatches, ...priceMatches])];

  // If we don't have enough recommendations, add more products
  if (recommendations.length < 4) {
    const remainingProducts = otherProducts.filter(
      (product) => !recommendations.some((rec) => rec.id === product.id),
    );
    recommendations.push(...remainingProducts);
  }

  // Limit to 4 recommendations
  return recommendations.slice(0, 4);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  // Filter products based on query if provided
  let filteredProducts = productStubs;
  if (query) {
    const searchQuery = query.toLowerCase();
    filteredProducts = productStubs.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery)),
    );
  }

  // Sort products based on sortKey if provided
  if (sortKey) {
    filteredProducts.sort((a, b) => {
      // Handle different sort keys
      switch (sortKey) {
        case "PRICE":
          return (
            parseFloat(a.priceRange.maxVariantPrice.amount) -
            parseFloat(b.priceRange.maxVariantPrice.amount)
          );
        case "CREATED_AT":
        case "UPDATED_AT":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        case "BEST_SELLING":
          // For stub data, we'll use a random value as a proxy for best selling
          return Math.random() - 0.5;
        case "RELEVANCE":
          // For manual sorting, we'll use the product ID as a proxy
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });
  }

  // Reverse the order if requested
  if (reverse) {
    filteredProducts.reverse();
  }

  // Return the filtered and sorted products
  return filteredProducts;
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(): Promise<NextResponse> {
  return NextResponse.json({ status: 200 });
}
