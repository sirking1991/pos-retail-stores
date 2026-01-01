import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface Expense {
  id: string
  category: string
  amount: number
  description: string | null
  expense_date: string
}

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">No expenses recorded yet</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{expense.category}</p>
                    {expense.description && <p className="text-sm text-muted-foreground">{expense.description}</p>}
                  </div>
                  <p className="font-bold text-xl text-orange-600">{Number(expense.amount).toFixed(2)}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(expense.expense_date), { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
