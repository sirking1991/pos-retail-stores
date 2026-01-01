import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { ReportsView } from "@/components/reports-view"
import { startOfDay, startOfWeek, startOfMonth, subDays } from "date-fns"

export default async function ReportsPage() {
  const supabase = await createClient()

  // Calculate date ranges
  const now = new Date()
  const todayStart = startOfDay(now).toISOString()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString()
  const monthStart = startOfMonth(now).toISOString()
  const last7DaysStart = startOfDay(subDays(now, 6)).toISOString()
  const last30DaysStart = startOfDay(subDays(now, 29)).toISOString()

  // Fetch sales data
  const { data: todaySales } = await supabase.from("sales").select("total_amount").gte("sale_date", todayStart)

  const { data: weekSales } = await supabase.from("sales").select("total_amount").gte("sale_date", weekStart)

  const { data: monthSales } = await supabase.from("sales").select("total_amount").gte("sale_date", monthStart)

  // Fetch purchases data
  const { data: todayPurchases } = await supabase
    .from("purchases")
    .select("total_amount")
    .gte("purchase_date", todayStart)

  const { data: weekPurchases } = await supabase
    .from("purchases")
    .select("total_amount")
    .gte("purchase_date", weekStart)

  const { data: monthPurchases } = await supabase
    .from("purchases")
    .select("total_amount")
    .gte("purchase_date", monthStart)

  // Fetch expenses data
  const { data: todayExpenses } = await supabase.from("expenses").select("amount").gte("expense_date", todayStart)

  const { data: weekExpenses } = await supabase.from("expenses").select("amount").gte("expense_date", weekStart)

  const { data: monthExpenses } = await supabase.from("expenses").select("amount").gte("expense_date", monthStart)

  // Fetch product performance (last 30 days)
  const { data: productSales } = await supabase
    .from("sales")
    .select("product_id, quantity, products(name)")
    .gte("sale_date", last30DaysStart)

  // Calculate totals
  const salesData = {
    today: todaySales?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0,
    week: weekSales?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0,
    month: monthSales?.reduce((sum, s) => sum + Number(s.total_amount), 0) || 0,
  }

  const purchasesData = {
    today: todayPurchases?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0,
    week: weekPurchases?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0,
    month: monthPurchases?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0,
  }

  const expensesData = {
    today: todayExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0,
    week: weekExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0,
    month: monthExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0,
  }

  // Calculate product performance
  const productPerformanceMap = new Map<string, { name: string; totalQuantity: number; salesCount: number }>()

  productSales?.forEach((sale: { product_id: string; quantity: number; products: { name: string } | null }) => {
    const current = productPerformanceMap.get(sale.product_id) || {
      name: sale.products?.name || "Unknown",
      totalQuantity: 0,
      salesCount: 0,
    }
    current.totalQuantity += sale.quantity
    current.salesCount += 1
    productPerformanceMap.set(sale.product_id, current)
  })

  const productPerformance = Array.from(productPerformanceMap.values()).sort(
    (a, b) => b.totalQuantity - a.totalQuantity,
  )

  const fastMoving = productPerformance.slice(0, 10)
  const slowMoving = productPerformance.slice(-10).reverse()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-balance">Reports & Analytics</h1>
        <ReportsView
          salesData={salesData}
          purchasesData={purchasesData}
          expensesData={expensesData}
          fastMoving={fastMoving}
          slowMoving={slowMoving}
        />
      </main>
    </div>
  )
}
