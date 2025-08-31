import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

import { schemaTypes } from "./sanity/schemaTypes"   // 👈 make sure this points to the folder where index.ts exports [product, category]

export default defineConfig({
  name: "default",
  title: "Ecommerce Store",

  projectId: "sf1y08e8",
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,   // 👈 now your external schema files are used
  },
})
