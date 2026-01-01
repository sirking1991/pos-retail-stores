import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard-stats"
import { Navigation } from "@/components/navigation"

export default async function Page() {
  const supabase = await createClient()

  // Get today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  // Fetch today's sales
  const { data: todaySales } = await supabase.from("sales").select("total_amount").gte("sale_date", todayISO)

  const todaySalesTotal = todaySales?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0

  // Fetch today's purchases
  const { data: todayPurchases } = await supabase
    .from("purchases")
    .select("total_amount")
    .gte("purchase_date", todayISO)

  const todayPurchasesTotal = todayPurchases?.reduce((sum, purchase) => sum + Number(purchase.total_amount), 0) || 0

  // Fetch today's expenses
  const { data: todayExpenses } = await supabase.from("expenses").select("amount").gte("expense_date", todayISO)

  const todayExpensesTotal = todayExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0

  const { data: allProducts } = await supabase
    .from("products")
    .select("name, stock_quantity, reorder_level")
    .order("stock_quantity", { ascending: true })

  // Filter products where stock_quantity is less than or equal to reorder_level
  const lowStockProducts =
    allProducts?.filter((product) => product.stock_quantity <= product.reorder_level).slice(0, 5) || []

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-balance">Dashboard</h1>
        <DashboardStats
          todaySales={todaySalesTotal}
          todayPurchases={todayPurchasesTotal}
          todayExpenses={todayExpensesTotal}
          lowStockProducts={lowStockProducts}
        />
      </main>
    </div>
  )
}
