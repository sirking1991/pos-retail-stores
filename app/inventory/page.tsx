import { createClient } from "@/lib/supabase/server"
import { InventoryList } from "@/components/inventory-list"
import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function InventoryPage() {
  const session = await getAuthSession()

  if (!session.isLoggedIn || !session.storeId) {
    redirect("/login")
  }

  const supabase = await createClient()

  // Fetch all products with their current stock for this store
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", session.storeId)
    .order("name", { ascending: true })

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-balance">Inventory Management</h1>
      <InventoryList products={products || []} storeId={session.storeId} />
    </main>
  )
}
