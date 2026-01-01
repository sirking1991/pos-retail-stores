import { createClient } from "@/lib/supabase/server"
import { SalesForm } from "@/components/sales-form"
import { RecentSales } from "@/components/recent-sales"

export default async function SalesPage() {
  const supabase = await createClient()

  // Fetch products with available stock
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .gt("stock_quantity", 0)
    .order("name", { ascending: true })

  // Fetch recent sales (more to allow for grouping)
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
      products (name)
    `,
    )
    .order("sale_date", { ascending: false })
    .limit(50)

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-balance">Record Sale</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesForm products={products || []} />
        <RecentSales sales={recentSales || []} />
      </div>
    </main>
  )
}
