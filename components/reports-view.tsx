"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface ReportsViewProps {
  salesData: {
    today: number
    week: number
    month: number
  }
  purchasesData: {
    today: number
    week: number
    month: number
  }
  expensesData: {
    today: number
    week: number
    month: number
  }
  fastMoving: Array<{
    name: string
    totalQuantity: number
    salesCount: number
  }>
  slowMoving: Array<{
    name: string
    totalQuantity: number
    salesCount: number
  }>
}

export function ReportsView({ salesData, purchasesData, expensesData, fastMoving, slowMoving }: ReportsViewProps) {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today")

  const sales = salesData[period]
  const purchases = purchasesData[period]
  const expenses = expensesData[period]
  const profit = sales - purchases - expenses

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as "today" | "week" | "month")} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14">
          <TabsTrigger value="today" className="text-base">
            Today
          </TabsTrigger>
          <TabsTrigger value="week" className="text-base">
            This Week
          </TabsTrigger>
          <TabsTrigger value="month" className="text-base">
            This Month
          </TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-6 mt-6">
          {/* Financial Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{sales.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{purchases.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{expenses.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br ${profit >= 0 ? "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900" : "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"}`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {profit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  Net Profit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-3xl font-bold ${profit >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}
                >
                  {profit.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Fast Moving Products */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-green-800 dark:text-green-200">
              <TrendingUp className="h-6 w-6" />
              Fast Moving Products
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardHeader>
          <CardContent>
            {fastMoving.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sales data available</p>
            ) : (
              <div className="space-y-3">
                {fastMoving.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white dark:bg-green-900/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-base">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.salesCount} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{product.totalQuantity}</p>
                      <p className="text-xs text-muted-foreground">units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slow Moving Products */}
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-red-800 dark:text-red-200">
              <TrendingDown className="h-6 w-6" />
              Slow Moving Products
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </CardHeader>
          <CardContent>
            {slowMoving.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sales data available</p>
            ) : (
              <div className="space-y-3">
                {slowMoving.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white dark:bg-red-900/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-base">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.salesCount} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">{product.totalQuantity}</p>
                      <p className="text-xs text-muted-foreground">units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
