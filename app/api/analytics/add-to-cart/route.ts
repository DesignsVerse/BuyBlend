import { type NextRequest, NextResponse } from "next/server"
import { AnalyticsDatabase } from "@/lib/database/analytics"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productName, price, timestamp, sessionId, userId } = body

    // Save to database
    const eventId = await AnalyticsDatabase.saveAddToCartEvent({
      sessionId,
      userId,
      productId,
      productName,
      price,
      quantity: 1,
      timestamp,
    })

    console.log("[v0] Add to Cart Event Saved:", {
      eventId,
      productId,
      productName,
      price,
    })

    return NextResponse.json({
      success: true,
      message: "Add to cart event tracked successfully",
      id: eventId,
    })
  } catch (error) {
    console.error("Error tracking add to cart event:", error)
    return NextResponse.json({ error: "Failed to track add to cart event" }, { status: 500 })
  }
}
