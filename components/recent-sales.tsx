import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

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

interface GroupedOrder {
  sale_date: string
  customer_name: string | null
  payment_method: string
  items: Sale[]
  total: number
}

export function RecentSales({ sales }: RecentSalesProps) {
  // Group sales by sale_date, customer_name, and payment_method
  const groupedOrders = sales.reduce((acc, sale) => {
    // Create a unique key for grouping: timestamp (rounded to second), customer, and payment method
    const saleDate = new Date(sale.sale_date)
    // Round to nearest second for grouping (items sold together should have very close timestamps)
    const roundedDate = new Date(Math.floor(saleDate.getTime() / 1000) * 1000)
    const key = `${roundedDate.toISOString()}_${sale.customer_name || "null"}_${sale.payment_method}`

    if (!acc[key]) {
      acc[key] = {
        sale_date: sale.sale_date,
        customer_name: sale.customer_name,
        payment_method: sale.payment_method,
        items: [],
        total: 0,
      }
    }

    acc[key].items.push(sale)
    acc[key].total += Number(sale.total_amount)

    return acc
  }, {} as Record<string, GroupedOrder>)

  // Convert to array and sort by sale_date (most recent first)
  const orders = Object.values(groupedOrders).sort(
    (a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime(),
  )

  // Limit to 10 most recent orders
  const recentOrders = orders.slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">No sales recorded yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order, orderIndex) => (
              <div key={`${order.sale_date}_${order.customer_name}_${order.payment_method}_${orderIndex}`} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.sale_date), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    {order.customer_name && (
                      <p className="text-xs text-muted-foreground">Customer: {order.customer_name}</p>
                    )}
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      {order.items.map((item, itemIndex) => (
                        <p key={`${item.id}_${itemIndex}`}>
                          {item.products?.name} - Qty: {item.quantity} × {Number(item.selling_price).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">{Number(order.total).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      {order.payment_method.replace("_", " ")}
                    </p>
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
