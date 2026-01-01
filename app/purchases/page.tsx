import { createClient } from "@/lib/supabase/server"
import { PurchaseForm } from "@/components/purchase-form"
import { RecentPurchases } from "@/components/recent-purchases"
import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function PurchasesPage() {
  const session = await getAuthSession()

  if (!session.isLoggedIn || !session.storeId) {
    redirect("/login")
  }

  const supabase = await createClient()

  // Fetch all products for this store
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", session.storeId)
    .order("name", { ascending: true })

  // Fetch recent purchases for this store
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
      products!inner(name)
    `,
    )
    .eq("store_id", session.storeId)
    .order("purchase_date", { ascending: false })
    .limit(50)

  // Format join results
  const formattedPurchases = (recentPurchases || []).map(purchase => ({
    ...purchase,
    products: Array.isArray(purchase.products) ? purchase.products[0] : purchase.products
  }))

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-balance">Record Purchase</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <PurchaseForm products={products || []} storeId={session.storeId} />
        <RecentPurchases purchases={formattedPurchases as any[] || []} />
      </div>
    </main>
  )
}
