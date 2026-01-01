import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface Purchase {
  id: string
  quantity: number
  cost_price: number
  total_amount: number
  supplier: string | null
  purchase_date: string
  products: { name: string } | null
}

interface RecentPurchasesProps {
  purchases: Purchase[]
}

interface GroupedOrder {
  purchase_date: string
  supplier: string | null
  items: Purchase[]
  total: number
}

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  // Group purchases by purchase_date and supplier
  const groupedOrders = purchases.reduce((acc, purchase) => {
    // Create a unique key for grouping: timestamp (rounded to second) and supplier
    const purchaseDate = new Date(purchase.purchase_date)
    // Round to nearest second for grouping (items purchased together should have very close timestamps)
    const roundedDate = new Date(Math.floor(purchaseDate.getTime() / 1000) * 1000)
    const key = `${roundedDate.toISOString()}_${purchase.supplier || "null"}`

    if (!acc[key]) {
      acc[key] = {
        purchase_date: purchase.purchase_date,
        supplier: purchase.supplier,
        items: [],
        total: 0,
      }
    }

    acc[key].items.push(purchase)
    acc[key].total += Number(purchase.total_amount)

    return acc
  }, {} as Record<string, GroupedOrder>)

  // Convert to array and sort by purchase_date (most recent first)
  const orders = Object.values(groupedOrders).sort(
    (a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime(),
  )

  // Limit to 10 most recent orders
  const recentOrders = orders.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Recent Purchases</CardTitle>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">No purchases recorded yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order, orderIndex) => (
              <div key={`${order.purchase_date}_${order.supplier}_${orderIndex}`} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.purchase_date), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {order.supplier && (
                      <p className="text-xs text-muted-foreground">Supplier: {order.supplier}</p>
                    )}
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      {order.items.map((item, itemIndex) => (
                        <p key={`${item.id}_${itemIndex}`}>
                          {item.products?.name} - Qty: {item.quantity} × {Number(item.cost_price).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">{Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
