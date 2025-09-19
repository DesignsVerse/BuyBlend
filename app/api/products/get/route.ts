import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

// POST { ids: string[] }
export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    const productIds: string[] = Array.isArray(ids) ? ids.filter(Boolean) : [];
    if (productIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const query = `*[_type == "product" && _id in $ids]{
      _id,
      name,
      "slug": slug.current,
      "image": coalesce(media[0].asset->url, "")
    }`;
    const products = await client.fetch(query, { ids: productIds }, { cache: "no-store" });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("/api/products/get error", error);
    return NextResponse.json({ products: [], error: error?.message ?? "failed" }, { status: 500 });
  }
}



