// utils/fetchProducts.ts
import { client, queries } from "@/lib/sanity/client"

export async function fetchSelectedProducts() {
  const selectedSlugs = [
    "classic-gold-drop-pendant",
    "silver-petal-pearl-pendant",
    "lavender-loop-hoops",
    "golden-monarch-studs",
    "midnight-butterfly-pearl-drops",
   
  ]

  const query = `*[_type == "product" && slug.current in $slugs]{
    _id,
    name,
    slug,
    price,
    originalPrice,
    description,
    media[]{
      _key,
      _type,
      asset,
      alt
    }
  }`

  return await client.fetch(query, { slugs: selectedSlugs })
}
