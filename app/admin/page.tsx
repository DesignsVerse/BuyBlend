import { KPICard } from "@/components/admin/kpi-card"
import { AnalyticsChart } from "@/components/admin/analytics-chart"
import { DollarSign, ShoppingCart, Users, AlertTriangle } from "lucide-react"

// Mock data - replace with real data from your database
const salesData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
]

const abandonedCartData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 8 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 10 },
  { name: "Fri", value: 18 },
  { name: "Sat", value: 22 },
  { name: "Sun", value: 14 },
]

const conversionData = [
  { name: "Week 1", value: 2.4 },
  { name: "Week 2", value: 2.8 },
  { name: "Week 3", value: 3.1 },
  { name: "Week 4", value: 2.9 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value="$45,231"
          change="+20.1% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value="1,234"
          change="+15.3% from last month"
          changeType="positive"
          icon={ShoppingCart}
        />
        <KPICard
          title="Active Customers"
          value="2,350"
          change="+5.2% from last month"
          changeType="positive"
          icon={Users}
        />
        <KPICard
          title="Abandoned Carts"
          value="89"
          change="-12.5% from last month"
          changeType="positive"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsChart title="Sales Overview" data={salesData} type="line" />
        <AnalyticsChart title="Abandoned Carts (Last 7 Days)" data={abandonedCartData} type="bar" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsChart title="Conversion Rate (%)" data={conversionData} type="line" />

        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New order #1234</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Cart abandoned by user@email.com</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Product "Wireless Headphones" low stock</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
