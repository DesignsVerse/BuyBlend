import { AnalyticsChart } from "@/components/admin/analytics-chart"
import { KPICard } from "@/components/admin/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Eye, MousePointer } from "lucide-react"

// Mock analytics data
const revenueData = [
  { name: "Jan", value: 4000, orders: 120 },
  { name: "Feb", value: 3000, orders: 98 },
  { name: "Mar", value: 5000, orders: 142 },
  { name: "Apr", value: 4500, orders: 128 },
  { name: "May", value: 6000, orders: 165 },
  { name: "Jun", value: 5500, orders: 158 },
]

const trafficData = [
  { name: "Mon", value: 1200, conversions: 24 },
  { name: "Tue", value: 1100, conversions: 22 },
  { name: "Wed", value: 1400, conversions: 28 },
  { name: "Thu", value: 1300, conversions: 26 },
  { name: "Fri", value: 1600, conversions: 32 },
  { name: "Sat", value: 1800, conversions: 36 },
  { name: "Sun", value: 1500, conversions: 30 },
]

const topProducts = [
  { name: "Wireless Headphones", sales: 145, revenue: 14500 },
  { name: "Smart Watch", sales: 89, revenue: 26700 },
  { name: "Phone Case", sales: 234, revenue: 5850 },
  { name: "Laptop Stand", sales: 67, revenue: 5360 },
  { name: "Bluetooth Speaker", sales: 123, revenue: 9840 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into your store's performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Conversion Rate"
          value="3.2%"
          change="+0.4% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <KPICard
          title="Avg. Order Value"
          value="$87.50"
          change="+$5.20 from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <KPICard title="Page Views" value="24,567" change="+12.3% from last month" changeType="positive" icon={Eye} />
        <KPICard
          title="Click-through Rate"
          value="2.8%"
          change="-0.2% from last month"
          changeType="negative"
          icon={MousePointer}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsChart title="Revenue & Orders" data={revenueData} type="line" dataKey="value" />
        <AnalyticsChart title="Website Traffic" data={trafficData} type="bar" dataKey="value" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">New Customers</span>
                <span className="text-sm font-bold">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Returning Customers</span>
                <span className="text-sm font-bold">1,456</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Lifetime Value</span>
                <span className="text-sm font-bold">$245.60</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg. Session Duration</span>
                <span className="text-sm font-bold">4m 32s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bounce Rate</span>
                <span className="text-sm font-bold">34.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
