import { type NextRequest, NextResponse } from "next/server"
import { AnalyticsDatabase } from "@/lib/database/analytics"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, userId, items, total, abandonedAt, userAgent, url } = body

    // Save to database
    const cartId = await AnalyticsDatabase.saveAbandonedCart({
      sessionId,
      userId,
      customerType: userId ? "registered" : "guest",
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalValue: total,
      abandonedAt,
      userAgent,
      pageUrl: url,
    })

    console.log("[v0] Cart Abandonment Saved to Database:", {
      cartId,
      sessionId,
      userId: userId || "guest",
      itemCount: items.length,
      total,
    })

    return NextResponse.json({
      success: true,
      message: "Cart abandonment tracked successfully",
      id: cartId,
    })
  } catch (error) {
    console.error("Error tracking cart abandonment:", error)
    return NextResponse.json({ error: "Failed to track cart abandonment" }, { status: 500 })
  }
}
