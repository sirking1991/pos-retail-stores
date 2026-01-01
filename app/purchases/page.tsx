import { createClient } from "@/lib/supabase/server"
import { PurchaseForm } from "@/components/purchase-form"
import { RecentPurchases } from "@/components/recent-purchases"

export default async function PurchasesPage() {
  const supabase = await createClient()

  // Fetch all products
  const { data: products } = await supabase.from("products").select("*").order("name", { ascending: true })

  // Fetch recent purchases (more to allow for grouping)
  const { data: recentPurchases } = await supabase
    .from("purchases")
    .select(
      `
      id,
      quantity,
      cost_price,
      total_amount,
      supplier,
      purchase_date,
      products (name)
    `,
    )
    .order("purchase_date", { ascending: false })
    .limit(50)

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-balance">Record Purchase</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <PurchaseForm products={products || []} />
        <RecentPurchases purchases={recentPurchases || []} />
      </div>
    </main>
  )
}
