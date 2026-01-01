import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, AlertTriangle } from "lucide-react"

interface DashboardStatsProps {
  todaySales: number
  todayPurchases: number
  todayExpenses: number
  lowStockProducts: Array<{
    name: string
    stock_quantity: number
    reorder_level: number
  }>
}

export function DashboardStats({ todaySales, todayPurchases, todayExpenses, lowStockProducts }: DashboardStatsProps) {
  const todayProfit = todaySales - todayPurchases - todayExpenses

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Today's Sales</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{todaySales.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Today's Purchases</CardTitle>
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{todayPurchases.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Today's Expenses</CardTitle>
            <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">{todayExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "bg-gradient-to-br border-2",
            todayProfit >= 0
              ? "from-emerald-50 to-emerald-100 border-emerald-300 dark:from-emerald-950 dark:to-emerald-900"
              : "from-red-50 to-red-100 border-red-300 dark:from-red-950 dark:to-red-900",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Today's Profit</CardTitle>
            {todayProfit >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-3xl font-bold",
                todayProfit >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300",
              )}
            >
              {todayProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-6 w-6" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white dark:bg-amber-900/50 rounded-lg"
                >
                  <span className="font-medium text-base">{product.name}</span>
                  <span className="text-amber-700 dark:text-amber-300 font-semibold text-lg">
                    {product.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
