"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  description: string | null
  category: string | null
  sku: string | null
  cost_price: number
  selling_price: number
  stock_quantity: number
  reorder_level: number
}

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    sku: "",
    cost_price: "",
    selling_price: "",
    stock_quantity: "",
    reorder_level: "10",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        category: product.category || "",
        sku: product.sku || "",
        cost_price: product.cost_price.toString(),
        selling_price: product.selling_price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        reorder_level: product.reorder_level.toString(),
      })
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        sku: "",
        cost_price: "",
        selling_price: "",
        stock_quantity: "0",
        reorder_level: "10",
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const productData = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category || null,
        sku: formData.sku || null,
        cost_price: Number.parseFloat(formData.cost_price),
        selling_price: Number.parseFloat(formData.selling_price),
        stock_quantity: Number.parseInt(formData.stock_quantity),
        reorder_level: Number.parseInt(formData.reorder_level),
      }

      if (product) {
        // Update existing product
        const { error } = await supabase.from("products").update(productData).eq("id", product.id)

        if (error) throw error
      } else {
        // Insert new product
        const { error } = await supabase.from("products").insert([productData])

        if (error) throw error
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription className="text-base">
            {product ? "Update product information below" : "Enter product details below"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base">
              Product Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Engine Oil 10W-40"
              className="text-lg h-12 mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-base">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description (optional)"
              className="text-lg mt-1 min-h-20"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-base">
                Category
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Oil & Fluids"
                className="text-lg h-12 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sku" className="text-base">
                SKU
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., OIL-10W40"
                className="text-lg h-12 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost_price" className="text-base">
                Cost Price * ($)
              </Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                placeholder="0.00"
                className="text-lg h-12 mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="selling_price" className="text-base">
                Selling Price * ($)
              </Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                placeholder="0.00"
                className="text-lg h-12 mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock_quantity" className="text-base">
                Stock Quantity *
              </Label>
              <Input
                id="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                placeholder="0"
                className="text-lg h-12 mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="reorder_level" className="text-base">
                Low Stock Alert Level *
              </Label>
              <Input
                id="reorder_level"
                type="number"
                min="0"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                placeholder="10"
                className="text-lg h-12 mt-1"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              className="flex-1 text-base h-12 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" className="flex-1 text-base h-12" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
