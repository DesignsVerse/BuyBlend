"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Clock, DollarSign, User, RefreshCw } from "lucide-react"
import { AnalyticsDatabase } from "@/lib/database/analytics"

interface AbandonedCart {
  id: number
  session_id: string
  customer_type: "registered" | "guest"
  customer_email?: string
  customer_name?: string
  total_value: number
  item_count: number
  abandoned_at: string
  items: Array<{
    name: string
    price: number
    quantity: number
    total_price: number
  }>
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Less than 1 hour ago"
  if (diffInHours < 24) return `${diffInHours} hours ago`
  return `${Math.floor(diffInHours / 24)} days ago`
}

export default function AbandonedCartsPage() {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    total: 0,
    totalValue: 0,
    registered: 0,
    guest: 0,
  })

  const fetchAbandonedCarts = async () => {
    try {
      setLoading(true)
      const carts = await AnalyticsDatabase.getAbandonedCarts(50, 0)
      setAbandonedCarts(carts)

      // Calculate summary
      const totalValue = carts.reduce((sum: number, cart: any) => sum + Number.parseFloat(cart.total_value), 0)
      const registered = carts.filter((cart: any) => cart.customer_type === "registered").length
      const guest = carts.filter((cart: any) => cart.customer_type === "guest").length

      setSummary({
        total: carts.length,
        totalValue,
        registered,
        guest,
      })
    } catch (error) {
      console.error("Error fetching abandoned carts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbandonedCarts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Abandoned Carts</h1>
            <p className="text-muted-foreground">Loading abandoned cart data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Abandoned Carts</h1>
          <p className="text-muted-foreground">
            Track and recover abandoned shopping carts from both registered and guest users.
          </p>
        </div>
        <Button onClick={fetchAbandonedCarts} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Abandoned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Potential Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Registered Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.registered}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Guest Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.guest}</div>
          </CardContent>
        </Card>
      </div>

      {/* Abandoned Carts List */}
      <div className="space-y-4">
        {abandonedCarts.map((cart) => (
          <Card key={cart.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <CardTitle className="text-lg">
                      {cart.customer_email || `Guest User (${cart.session_id})`}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={cart.customer_type === "registered" ? "default" : "secondary"}>
                        {cart.customer_type === "registered" ? "Registered" : "Guest"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatTimeAgo(cart.abandoned_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${Number.parseFloat(cart.total_value.toString()).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{cart.item_count} items</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cart Items */}
                <div>
                  <h4 className="font-medium mb-2">Items in Cart:</h4>
                  <div className="space-y-2">
                    {cart.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>
                          {item.name} (x{item.quantity})
                        </span>
                        <span className="font-medium">
                          ${Number.parseFloat(item.total_price.toString()).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {cart.customer_email && (
                    <Button size="sm" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Send Recovery Email</span>
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Create Discount
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
