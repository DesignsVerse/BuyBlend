export const product = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },

    // Media (images + videos)
    {
      name: "media",
      title: "Media",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alt Text", type: "string" },
          ],
        },
        { type: "file", title: "Video" },
      ],
    },

    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    },

    // ✅ Highlights
    {
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Key features or selling points (bullet points)",
      validation: (Rule: any) => Rule.min(1),
    },

    // ✅ Style Tips
    {
      name: "styleTips",
      title: "Style Tips",
      type: "text",
      rows: 3,
      description: "Short tips on how to style or wear this product",
    },

    // Pricing
    {
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "compareAtPrice",
      title: "Compare at Price",
      type: "number",
      description: "Used for showing discount pricing",
      validation: (Rule: any) => Rule.min(0),
    },

    // Category & tags
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },

    // Inventory
    {
      name: "inventory",
      title: "Inventory Count",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    },

    // Variants
    {
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Variant Name", type: "string" },
            { name: "value", title: "Variant Value", type: "string" },
            { name: "price", title: "Variant Price", type: "number" },
            { name: "inventory", title: "Variant Inventory", type: "number" },
            {
              name: "image",
              title: "Variant Image",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
    },

    // SEO fields
    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title", type: "string" },
        { name: "metaDescription", title: "Meta Description", type: "text", rows: 2 },
      ],
    },
  ],

  preview: {
    select: {
      title: "name",
      media: "media.0",
      subtitle: "price",
    },
    prepare(selection: any) {
      const { title, media, subtitle } = selection
      return {
        title,
        media,
        subtitle: subtitle ? `$${subtitle}` : "No price set",
      }
    },
  },
}
