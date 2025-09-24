import { NextResponse } from "next/server";
import { client, queries } from "@/lib/sanity/client";

export async function GET() {
  try {
    const products = await client.fetch(queries.featuredProducts, {}, { cache: "no-store" });
    return NextResponse.json({ products: products || [] });
  } catch (error: any) {
    console.error("/api/products/featured error", error);
    return NextResponse.json({ products: [], error: error?.message ?? "failed" }, { status: 500 });
  }
}


