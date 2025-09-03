import { defineField, defineType } from "sanity"

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
  defineField({
    name: "media",
    title: "Media",
    type: "array",
    of: [
      { type: "image", options: { hotspot: true } },
      { type: "file", title: "Video" }
    ],
  }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Key features or selling points of the product (bullet points)",
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "styleTips",
      title: "Style Tips",
      type: "text",
      rows: 3,
      description: "Short tips on how to style or wear this product",
    }),

      defineField({
      name: "type",
      title: "type",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "originalPrice",
      title: "Original Price",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "inventory",
      title: "Inventory Count",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
  ],
})
