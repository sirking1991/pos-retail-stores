import { createClient } from "@/lib/supabase/server"
import { InventoryList } from "@/components/inventory-list"

export default async function InventoryPage() {
  const supabase = await createClient()

  // Fetch all products with their current stock
  const { data: products } = await supabase.from("products").select("*").order("name", { ascending: true })

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-balance">Inventory Management</h1>
      <InventoryList products={products || []} />
    </main>
  )
}
