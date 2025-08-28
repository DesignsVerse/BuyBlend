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
    {
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    },
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
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "inventory",
      title: "Inventory Count",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
    {
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Variant Name",
              type: "string",
            },
            {
              name: "value",
              title: "Variant Value",
              type: "string",
            },
            {
              name: "price",
              title: "Variant Price",
              type: "number",
            },
            {
              name: "inventory",
              title: "Variant Inventory",
              type: "number",
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
      subtitle: "price",
    },
    prepare(selection: any) {
      const { title, media, subtitle } = selection
      return {
        title,
        media,
        subtitle: `$${subtitle}`,
      }
    },
  },
}
