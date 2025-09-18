import { NextResponse } from "next/server"
import { client } from "@/lib/sanity/client"

// GROQ: search products by name, description, tags, and category name
const searchQuery = `
  *[_type == "product" && (
    name match $q ||
    description match $q ||
    defined(tags) && count(tags[@ match $q]) > 0 ||
    defined(category->name) && category->name match $q
  )][0...10]{
    _id,
    name,
    slug,
    price,
    originalPrice,
    description,
    "image": coalesce(media[0].asset->url, ""),
    category->{ _id, name, slug }
  }
`

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get("q") || "").trim()

    if (!q) {
      return NextResponse.json({ products: [] })
    }

    // Sanity match uses wildcards; add * around terms for partials
    const wildcard = `*${q}*`
    const products = await client.fetch(searchQuery, { q: wildcard }, { cache: "no-store" })
    return NextResponse.json({ products })
  } catch (err) {
    console.error("Search API error", err)
    return NextResponse.json({ products: [], error: "Search failed" }, { status: 500 })
  }
}


