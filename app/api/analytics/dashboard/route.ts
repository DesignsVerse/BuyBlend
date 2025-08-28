import { type NextRequest, NextResponse } from "next/server"
import { AnalyticsDatabase } from "@/lib/database/analytics"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Get analytics summary and daily data
    const [summary, dailyData, abandonedCarts] = await Promise.all([
      AnalyticsDatabase.getAnalyticsSummary(days),
      AnalyticsDatabase.getDailyAnalytics(days),
      AnalyticsDatabase.getAbandonedCarts(10, 0), // Get latest 10 abandoned carts
    ])

    return NextResponse.json({
      success: true,
      data: {
        summary,
        dailyData,
        abandonedCarts,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
