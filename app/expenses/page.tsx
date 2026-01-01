import { createClient } from "@/lib/supabase/server"
import { ExpenseForm } from "@/components/expense-form"
import { RecentExpenses } from "@/components/recent-expenses"

export default async function ExpensesPage() {
  const supabase = await createClient()

  // Fetch recent expenses
  const { data: recentExpenses } = await supabase
    .from("expenses")
    .select("*")
    .order("expense_date", { ascending: false })
    .limit(15)

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-balance">Record Expense</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseForm />
        <RecentExpenses expenses={recentExpenses || []} />
      </div>
    </main>
  )
}
