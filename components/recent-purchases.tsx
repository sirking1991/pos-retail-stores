import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

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

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Recent Purchases</CardTitle>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">No purchases recorded yet</p>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{purchase.products?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {purchase.quantity} × {Number(purchase.cost_price).toFixed(2)}
                    </p>
                    {purchase.supplier && (
                      <p className="text-sm text-muted-foreground">Supplier: {purchase.supplier}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primary">{Number(purchase.total_amount).toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(purchase.purchase_date), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
