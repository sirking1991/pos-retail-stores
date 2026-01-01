import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface Sale {
  id: string
  quantity: number
  selling_price: number
  total_amount: number
  customer_name: string | null
  payment_method: string
  sale_date: string
  products: { name: string } | null
}

interface RecentSalesProps {
  sales: Sale[]
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">No sales recorded yet</p>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <div key={sale.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{sale.products?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {sale.quantity} × {Number(sale.selling_price).toFixed(2)}
                    </p>
                    {sale.customer_name && (
                      <p className="text-sm text-muted-foreground">Customer: {sale.customer_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-primary">{Number(sale.total_amount).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{sale.payment_method.replace("_", " ")}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(sale.sale_date), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
