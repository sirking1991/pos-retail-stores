import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard-stats"
import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getAuthSession()

  if (!session.isLoggedIn || !session.storeId) {
    redirect("/login")
  }

  const supabase = await createClient()

  // Get today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  // Fetch today's sales for this store
  const { data: todaySales } = await supabase
    .from("sales")
    .select("total_amount")
    .eq("store_id", session.storeId)
    .gte("sale_date", todayISO)

  const todaySalesTotal = todaySales?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0

  // Fetch today's purchases for this store
  const { data: todayPurchases } = await supabase
    .from("purchases")
    .select("total_amount")
    .eq("store_id", session.storeId)
    .gte("purchase_date", todayISO)

  const todayPurchasesTotal = todayPurchases?.reduce((sum, purchase) => sum + Number(purchase.total_amount), 0) || 0

  // Fetch today's expenses for this store
  const { data: todayExpenses } = await supabase
    .from("expenses")
    .select("amount")
    .eq("store_id", session.storeId)
    .gte("expense_date", todayISO)

  const todayExpensesTotal = todayExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0

  const { data: allProducts } = await supabase
    .from("products")
    .select("name, stock_quantity, reorder_level")
    .eq("store_id", session.storeId)
    .order("stock_quantity", { ascending: true })

  // Filter products where stock_quantity is less than or equal to reorder_level
  const lowStockProducts =
    allProducts?.filter((product) => product.stock_quantity <= product.reorder_level).slice(0, 5) || []

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-balance">Dashboard</h1>
      <DashboardStats
        todaySales={todaySalesTotal}
        todayPurchases={todayPurchasesTotal}
        todayExpenses={todayExpensesTotal}
        lowStockProducts={lowStockProducts}
      />
    </main>
  )
}
