export const productStubs = [
  {
    id: "product-1",
    handle: "classic-t-shirt",
    availableForSale: true,
    title: "Classic T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear.",
    descriptionHtml: "<p>Comfortable cotton t-shirt for everyday wear.</p>",
    options: [
      {
        id: "option-1-1",
        name: "Size",
        values: ["S", "M", "L", "XL"],
      },
      {
        id: "option-1-2",
        name: "Color",
        values: ["Black", "White", "Blue"],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "29.99",
        currencyCode: "USD",
      },
      minVariantPrice: {
        amount: "29.99",
        currencyCode: "USD",
      },
    },
    variants: [
      {
        id: "variant-1-1",
        title: "S / Black",
        availableForSale: true,
        selectedOptions: [
          {
            name: "Size",
            value: "S",
          },
          {
            name: "Color",
            value: "Black",
          },
        ],
        price: {
          amount: "29.99",
          currencyCode: "USD",
        },
        product: {
          id: "product-1",
          handle: "classic-t-shirt",
          title: "Classic T-Shirt",
          featuredImage: {
            url: "https://placehold.co/600x800/png?text=T-Shirt-Black",
            altText: "Classic Black T-Shirt",
            width: 600,
            height: 800,
          },
        },
      },
      {
        id: "variant-1-2",
        title: "M / Black",
        availableForSale: true,
        selectedOptions: [
          {
            name: "Size",
            value: "M",
          },
          {
            name: "Color",
            value: "Black",
          },
        ],
        price: {
          amount: "29.99",
          currencyCode: "USD",
        },
        product: {
          id: "product-1",
          handle: "classic-t-shirt",
          title: "Classic T-Shirt",
          featuredImage: {
            url: "https://placehold.co/600x800/png?text=T-Shirt-Black",
            altText: "Classic Black T-Shirt",
            width: 600,
            height: 800,
          },
        },
      },
    ],
    featuredImage: {
      url: "https://placehold.co/600x800/png?text=T-Shirt-Black",
      altText: "Classic Black T-Shirt",
      width: 600,
      height: 800,
    },
    images: [
      {
        url: "https://placehold.co/600x800/png?text=T-Shirt-Black",
        altText: "Classic Black T-Shirt",
        width: 600,
        height: 800,
      },
      {
        url: "https://placehold.co/600x800/png?text=T-Shirt-White",
        altText: "Classic White T-Shirt",
        width: 600,
        height: 800,
      },
      {
        url: "https://placehold.co/600x800/png?text=T-Shirt-Blue",
        altText: "Classic Blue T-Shirt",
        width: 600,
        height: 800,
      },
    ],
    seo: {
      title: "Classic T-Shirt - Your Brand",
      description:
        "Comfortable cotton t-shirt for everyday wear. Available in multiple colors and sizes.",
    },
    tags: ["apparel", "tshirt", "cotton"],
    updatedAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "product-2",
    handle: "premium-hoodie",
    availableForSale: true,
    title: "Premium Hoodie",
    description: "Warm premium hoodie for cold days.",
    descriptionHtml:
      "<p>Warm premium hoodie for cold days.</p><p>Features a kangaroo pocket and adjustable hood.</p>",
    options: [
      {
        id: "option-2-1",
        name: "Size",
        values: ["S", "M", "L", "XL"],
      },
      {
        id: "option-2-2",
        name: "Color",
        values: ["Grey", "Navy", "Black"],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "59.99",
        currencyCode: "USD",
      },
      minVariantPrice: {
        amount: "59.99",
        currencyCode: "USD",
      },
    },
    variants: [
      {
        id: "variant-2-1",
        title: "S / Grey",
        availableForSale: true,
        selectedOptions: [
          {
            name: "Size",
            value: "S",
          },
          {
            name: "Color",
            value: "Grey",
          },
        ],
        price: {
          amount: "59.99",
          currencyCode: "USD",
        },
        product: {
          id: "product-2",
          handle: "premium-hoodie",
          title: "Premium Hoodie",
          featuredImage: {
            url: "https://placehold.co/600x800/png?text=Hoodie-Grey",
            altText: "Grey Premium Hoodie",
            width: 600,
            height: 800,
          },
        },
      },
    ],
    featuredImage: {
      url: "https://placehold.co/600x800/png?text=Hoodie-Grey",
      altText: "Grey Premium Hoodie",
      width: 600,
      height: 800,
    },
    images: [
      {
        url: "https://placehold.co/600x800/png?text=Hoodie-Grey",
        altText: "Grey Premium Hoodie",
        width: 600,
        height: 800,
      },
    ],
    seo: {
      title: "Premium Hoodie - Your Brand",
      description:
        "Warm premium hoodie with kangaroo pocket and adjustable hood.",
    },
    tags: ["apparel", "hoodie", "winter"],
    updatedAt: "2023-05-15T00:00:00Z",
  },
  {
    id: "product-3",
    handle: "running-shoes",
    availableForSale: true,
    title: "Running Shoes",
    description: "Lightweight running shoes with cushioned soles.",
    descriptionHtml:
      "<p>Lightweight running shoes with cushioned soles. Perfect for everyday runs.</p>",
    options: [
      {
        id: "option-3-1",
        name: "Size",
        values: ["7", "8", "9", "10", "11", "12"],
      },
      {
        id: "option-3-2",
        name: "Color",
        values: ["Black/White", "Blue/Grey", "Red/Black"],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "120.00",
        currencyCode: "USD",
      },
      minVariantPrice: {
        amount: "120.00",
        currencyCode: "USD",
      },
    },
    variants: [
      {
        id: "variant-3-1",
        title: "9 / Black/White",
        availableForSale: true,
        selectedOptions: [
          {
            name: "Size",
            value: "9",
          },
          {
            name: "Color",
            value: "Black/White",
          },
        ],
        price: {
          amount: "120.00",
          currencyCode: "USD",
        },
        product: {
          id: "product-3",
          handle: "running-shoes",
          title: "Running Shoes",
          featuredImage: {
            url: "https://placehold.co/600x400/png?text=Running-Shoes",
            altText: "Black and White Running Shoes",
            width: 600,
            height: 400,
          },
        },
      },
    ],
    featuredImage: {
      url: "https://placehold.co/600x400/png?text=Running-Shoes",
      altText: "Black and White Running Shoes",
      width: 600,
      height: 400,
    },
    images: [
      {
        url: "https://placehold.co/600x400/png?text=Running-Shoes",
        altText: "Black and White Running Shoes",
        width: 600,
        height: 400,
      },
      {
        url: "https://placehold.co/600x400/png?text=Running-Shoes-Blue",
        altText: "Blue and Grey Running Shoes",
        width: 600,
        height: 400,
      },
      {
        url: "https://placehold.co/600x400/png?text=Running-Shoes-Red",
        altText: "Red and Black Running Shoes",
        width: 600,
        height: 400,
      },
    ],
    seo: {
      title: "Running Shoes - Your Brand",
      description:
        "Lightweight running shoes with cushioned soles. Perfect for everyday runs.",
    },
    tags: ["footwear", "running", "sports"],
    updatedAt: "2023-04-20T00:00:00Z",
  },
  {
    id: "product-4",
    handle: "backpack",
    availableForSale: true,
    title: "Adventure Backpack",
    description: "Durable backpack with multiple compartments.",
    descriptionHtml:
      "<p>Durable backpack with multiple compartments. Perfect for hiking or daily commute.</p>",
    options: [
      {
        id: "option-4-1",
        name: "Color",
        values: ["Black", "Green", "Blue"],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "79.95",
        currencyCode: "USD",
      },
      minVariantPrice: {
        amount: "79.95",
        currencyCode: "USD",
      },
    },
    variants: [
      {
        id: "variant-4-1",
        title: "Black",
        availableForSale: true,
        selectedOptions: [
          {
            name: "Color",
            value: "Black",
          },
        ],
        price: {
          amount: "79.95",
          currencyCode: "USD",
        },
        product: {
          id: "product-4",
          handle: "backpack",
          title: "Adventure Backpack",
          featuredImage: {
            url: "https://placehold.co/600x600/png?text=Backpack-Black",
            altText: "Black Adventure Backpack",
            width: 600,
            height: 600,
          },
        },
      },
    ],
    featuredImage: {
      url: "https://placehold.co/600x600/png?text=Backpack-Black",
      altText: "Black Adventure Backpack",
      width: 600,
      height: 600,
    },
    images: [
      {
        url: "https://placehold.co/600x600/png?text=Backpack-Black",
        altText: "Black Adventure Backpack",
        width: 600,
        height: 600,
      },
      {
        url: "https://placehold.co/600x600/png?text=Backpack-Green",
        altText: "Green Adventure Backpack",
        width: 600,
        height: 600,
      },
      {
        url: "https://placehold.co/600x600/png?text=Backpack-Blue",
        altText: "Blue Adventure Backpack",
        width: 600,
        height: 600,
      },
    ],
    seo: {
      title: "Adventure Backpack - Your Brand",
      description:
        "Durable backpack with multiple compartments. Perfect for hiking or daily commute.",
    },
    tags: ["accessories", "backpack", "outdoor"],
    updatedAt: "2023-03-10T00:00:00Z",
  },
  {
    id: "product-5",
    handle: "water-bottle",
    availableForSale: true,
    title: "Insulated Water Bottle",
    description: "Double-walled insulated water bottle.",
    descriptionHtml:
      "<p>Double-walled insulated water bottle. Keeps beverages hot or cold for hours.</p>",
    options: [
      {
        id: "option-5-1",
        name: "Size",
        values: ["16oz", "24oz", "32oz"],
      },
      {
        id: "option-5-2",
        name: "Color",
        values: ["Silver", "Black", "White"],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "34.99",
        currencyCode: "USD",
      },
      minVariantPrice: {
        amount: "24.99",
        currencyCode: "USD",
      },
    },
    variants: [
      {
        id: "variant-5-1",
        title: "24oz / Silver",
        availableForSale: true,
        selectedOptions: [
          {
            name: "Size",
            value: "24oz",
          },
          {
            name: "Color",
            value: "Silver",
          },
        ],
        price: {
          amount: "29.99",
          currencyCode: "USD",
        },
        product: {
          id: "product-5",
          handle: "water-bottle",
          title: "Insulated Water Bottle",
          featuredImage: {
            url: "https://placehold.co/600x900/png?text=Water-Bottle",
            altText: "Silver Insulated Water Bottle",
            width: 600,
            height: 900,
          },
        },
      },
    ],
    featuredImage: {
      url: "https://placehold.co/600x900/png?text=Water-Bottle",
      altText: "Silver Insulated Water Bottle",
      width: 600,
      height: 900,
    },
    images: [
      {
        url: "https://placehold.co/600x900/png?text=Water-Bottle",
        altText: "Silver Insulated Water Bottle",
        width: 600,
        height: 900,
      },
      {
        url: "https://placehold.co/600x900/png?text=Water-Bottle-Black",
        altText: "Black Insulated Water Bottle",
        width: 600,
        height: 900,
      },
      {
        url: "https://placehold.co/600x900/png?text=Water-Bottle-White",
        altText: "White Insulated Water Bottle",
        width: 600,
        height: 900,
      },
    ],
    seo: {
      title: "Insulated Water Bottle - Your Brand",
      description:
        "Double-walled insulated water bottle. Keeps beverages hot or cold for hours.",
    },
    tags: ["accessories", "hydration", "outdoor"],
    updatedAt: "2023-02-15T00:00:00Z",
  },
];
