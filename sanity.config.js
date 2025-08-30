import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

const config = defineConfig({
  name: "default",
  title: "Ecommerce Store",

  projectId: "sf1y08e8",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [
      {
        name: "product",
        title: "Product",
        type: "document",
        fields: [
          {
            name: "name",
            title: "Name",
            type: "string",
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
              source: "name",
              maxLength: 96,
            },
          },
          {
            name: "images",
            title: "Images",
            type: "array",
            of: [
              {
                type: "image",
                options: {
                  hotspot: true,
                },
              },
            ],
          },
          {
            name: "description",
            title: "Description",
            type: "text",
          },
          {
            name: "price",
            title: "Price",
            type: "number",
          },
          {
            name: "originalPrice",
            title: "Original Price",
            type: "number",
            description: "Original price before discount",
          },
          {
            name: "category",
            title: "Category",
            type: "reference",
            to: [{ type: "category" }],
          },
          {
            name: "inventoryCount",
            title: "Inventory Count",
            type: "number",
            initialValue: 0,
          },
          {
            name: "inStock",
            title: "In Stock",
            type: "boolean",
            initialValue: true,
          },
          {
            name: "featured",
            title: "Featured",
            type: "boolean",
            initialValue: false,
          },
        ],
      },
      {
        name: "category",
        title: "Category",
        type: "document",
        fields: [
          {
            name: "name",
            title: "Name",
            type: "string",
          },
          {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: {
              source: "name",
              maxLength: 96,
            },
          },
        ],
      },
    ],
  },
})

export default config
