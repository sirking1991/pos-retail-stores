import { createClient } from "@/lib/supabase/server"
import { SalesForm } from "@/components/sales-form"
import { RecentSales } from "@/components/recent-sales"
import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SalesPage() {
  const session = await getAuthSession()

  if (!session.isLoggedIn || !session.storeId) {
    redirect("/login")
  }

  const supabase = await createClient()

  // Fetch products with available stock for this store
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", session.storeId)
    .gt("stock_quantity", 0)
    .order("name", { ascending: true })

  // Fetch recent sales for this store
  const { data: recentSales } = await supabase
    .from("sales")
    .select(
      `
      id,
      quantity,
      selling_price,
      total_amount,
      customer_name,
      payment_method,
      sale_date,
      products!inner(name)
    `,
    )
    .eq("store_id", session.storeId)
    .order("sale_date", { ascending: false })
    .limit(50)

  // Map the join result because Supabase returns an array for relationships by default in some configurations
  const formattedSales = (recentSales || []).map(sale => ({
    ...sale,
    products: Array.isArray(sale.products) ? sale.products[0] : sale.products
  }))

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-balance">Record Sale</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesForm products={products || []} storeId={session.storeId} />
        <RecentSales sales={formattedSales as any[] || []} />
      </div>
    </main>
  )
}
