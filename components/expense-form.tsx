"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"

const expenseCategories = [
  "Rent",
  "Utilities",
  "Salaries",
  "Transportation",
  "Marketing",
  "Maintenance",
  "Insurance",
  "Supplies",
  "Taxes",
  "Other",
]

export function ExpenseForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("expenses").insert({
        category,
        amount: Number(amount),
        description: description || null,
      })

      if (error) throw error

      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)

      // Reset form
      setCategory("")
      setAmount("")
      setDescription("")

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error recording expense:", error)
      alert("Failed to record expense. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-lg">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="h-14 text-lg">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-base py-3">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-14 text-lg"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-lg">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] text-lg"
              placeholder="What is this expense for?"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full h-14 text-xl" disabled={isLoading || showSuccess}>
              {showSuccess ? (
                <>
                  <Check className="mr-2 h-6 w-6" />
                  Expense Recorded!
                </>
              ) : isLoading ? (
                "Recording..."
              ) : (
                "Record Expense"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
