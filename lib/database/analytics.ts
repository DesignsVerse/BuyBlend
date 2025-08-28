import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface AbandonedCartData {
  sessionId: string
  userId?: string
  customerType: "registered" | "guest"
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  totalValue: number
  abandonedAt: string
  userAgent?: string
  pageUrl?: string
}

export interface AddToCartData {
  sessionId?: string
  userId?: string
  productId: string
  productName: string
  price: number
  quantity?: number
  timestamp: string
}

export interface PageViewData {
  sessionId: string
  userId?: string
  pageUrl: string
  pageTitle?: string
  referrer?: string
  timestamp: string
  timeOnPage?: number
}

export class AnalyticsDatabase {
  // Save abandoned cart data
  static async saveAbandonedCart(data: AbandonedCartData) {
    try {
      // Insert abandoned cart record
      const [cart] = await sql`
        INSERT INTO abandoned_carts (
          session_id, user_id, customer_type, total_value, item_count,
          abandoned_at, user_agent, page_url
        ) VALUES (
          ${data.sessionId}, ${data.userId || null}, ${data.customerType},
          ${data.totalValue}, ${data.items.length}, ${data.abandonedAt},
          ${data.userAgent || null}, ${data.pageUrl || null}
        ) RETURNING id
      `

      // Insert cart items
      if (data.items.length > 0) {
        const itemsData = data.items.map((item) => [
          cart.id,
          item.id,
          item.name,
          item.price,
          item.quantity,
          item.price * item.quantity,
        ])

        await sql`
          INSERT INTO abandoned_cart_items (
            abandoned_cart_id, product_id, product_name, price, quantity, total_price
          ) VALUES ${sql(itemsData)}
        `
      }

      return cart.id
    } catch (error) {
      console.error("Error saving abandoned cart:", error)
      throw error
    }
  }

  // Save add to cart event
  static async saveAddToCartEvent(data: AddToCartData) {
    try {
      const [event] = await sql`
        INSERT INTO add_to_cart_events (
          session_id, user_id, product_id, product_name, price, quantity, timestamp
        ) VALUES (
          ${data.sessionId || null}, ${data.userId || null}, ${data.productId},
          ${data.productName}, ${data.price}, ${data.quantity || 1}, ${data.timestamp}
        ) RETURNING id
      `

      return event.id
    } catch (error) {
      console.error("Error saving add to cart event:", error)
      throw error
    }
  }

  // Save page view
  static async savePageView(data: PageViewData) {
    try {
      const [view] = await sql`
        INSERT INTO page_views (
          session_id, user_id, page_url, page_title, referrer, timestamp, time_on_page
        ) VALUES (
          ${data.sessionId}, ${data.userId || null}, ${data.pageUrl},
          ${data.pageTitle || null}, ${data.referrer || null}, ${data.timestamp},
          ${data.timeOnPage || null}
        ) RETURNING id
      `

      return view.id
    } catch (error) {
      console.error("Error saving page view:", error)
      throw error
    }
  }

  // Get abandoned carts for admin dashboard
  static async getAbandonedCarts(limit = 50, offset = 0) {
    try {
      const carts = await sql`
        SELECT 
          ac.*,
          u.email as customer_email,
          u.name as customer_name,
          json_agg(
            json_build_object(
              'name', aci.product_name,
              'price', aci.price,
              'quantity', aci.quantity,
              'total_price', aci.total_price
            )
          ) as items
        FROM abandoned_carts ac
        LEFT JOIN users u ON ac.user_id = u.id
        LEFT JOIN abandoned_cart_items aci ON ac.id = aci.abandoned_cart_id
        GROUP BY ac.id, u.email, u.name
        ORDER BY ac.abandoned_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      return carts
    } catch (error) {
      console.error("Error fetching abandoned carts:", error)
      throw error
    }
  }

  // Get analytics summary
  static async getAnalyticsSummary(days = 30) {
    try {
      const summary = await sql`
        SELECT 
          COUNT(DISTINCT ac.id) as total_abandoned_carts,
          SUM(ac.total_value) as total_abandoned_value,
          COUNT(DISTINCT CASE WHEN ac.customer_type = 'registered' THEN ac.id END) as registered_abandoned,
          COUNT(DISTINCT CASE WHEN ac.customer_type = 'guest' THEN ac.id END) as guest_abandoned,
          COUNT(DISTINCT ate.id) as total_add_to_cart_events,
          COUNT(DISTINCT pv.session_id) as unique_visitors,
          COUNT(pv.id) as total_page_views
        FROM abandoned_carts ac
        FULL OUTER JOIN add_to_cart_events ate ON DATE(ac.abandoned_at) = DATE(ate.timestamp)
        FULL OUTER JOIN page_views pv ON DATE(ac.abandoned_at) = DATE(pv.timestamp)
        WHERE ac.abandoned_at >= NOW() - INTERVAL '${days} days'
           OR ate.timestamp >= NOW() - INTERVAL '${days} days'
           OR pv.timestamp >= NOW() - INTERVAL '${days} days'
      `

      return summary[0] || {}
    } catch (error) {
      console.error("Error fetching analytics summary:", error)
      throw error
    }
  }

  // Get daily analytics data for charts
  static async getDailyAnalytics(days = 30) {
    try {
      const analytics = await sql`
        SELECT 
          date,
          total_revenue,
          total_orders,
          total_visitors,
          abandoned_carts,
          abandoned_cart_value,
          conversion_rate
        FROM daily_analytics
        WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY date ASC
      `

      return analytics
    } catch (error) {
      console.error("Error fetching daily analytics:", error)
      throw error
    }
  }

  // Update daily analytics (call this daily via cron job)
  static async updateDailyAnalytics(date?: string) {
    try {
      const targetDate = date || new Date().toISOString().split("T")[0]
      await sql`SELECT update_daily_analytics(${targetDate})`
      return true
    } catch (error) {
      console.error("Error updating daily analytics:", error)
      throw error
    }
  }
}
