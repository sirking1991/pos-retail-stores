"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Plus, Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Product {
  id: string
  name: string
  cost_price: number
  stock_quantity: number
}

interface PurchaseFormProps {
  products: Product[]
  storeId: string
}

interface CartItem {
  product: Product
  quantity: number
  cost_price: number
}

export function PurchaseForm({ products, storeId }: PurchaseFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [supplier, setSupplier] = useState("")
  const [notes, setNotes] = useState("")

  const [cart, setCart] = useState<CartItem[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState("1")
  const [costPrice, setCostPrice] = useState("")

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    setCostPrice(product.cost_price.toString())
    setQuantity("1")
  }

  const handleAddToCart = () => {
    if (!selectedProduct || !quantity || !costPrice) return

    const newItem: CartItem = {
      product: selectedProduct,
      quantity: Number(quantity),
      cost_price: Number(costPrice),
    }

    setCart([...cart, newItem])

    // Reset modal state
    setSelectedProduct(null)
    setQuantity("1")
    setCostPrice("")
    setSearchQuery("")
    setShowProductModal(false)
  }

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.cost_price, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      const purchases = cart.map((item) => ({
        store_id: storeId,
        product_id: item.product.id,
        quantity: item.quantity,
        cost_price: item.cost_price,
        total_amount: item.quantity * item.cost_price,
        supplier: supplier || null,
        notes: notes || null,
      }))

      const { error } = await supabase.from("purchases").insert(purchases)

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)

      // Reset form
      setCart([])
      setSupplier("")
      setNotes("")

      router.refresh()
    } catch (error) {
      console.error("Error recording purchase:", error)
      alert("Failed to record purchase. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">New Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="supplier" className="text-lg">
                Supplier Name
              </Label>
              <Input
                id="supplier"
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="h-14 text-lg"
                placeholder="Enter supplier name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-lg">
                Notes (Optional)
              </Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-14 text-lg"
                placeholder="Additional notes"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-14 text-lg bg-transparent"
              onClick={() => setShowProductModal(true)}
            >
              <Plus className="mr-2 h-6 w-6" />
              Add Item
            </Button>

            {cart.length > 0 && (
              <div className="space-y-3">
                <Label className="text-lg">Items</Label>
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-lg">{item.product.name}</p>
                      <p className="text-base text-muted-foreground">
                        {item.quantity} × {item.cost_price.toFixed(2)} = {(item.quantity * item.cost_price).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromCart(index)}
                      className="h-10 w-10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="pt-4 border-t space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium">Total Amount:</span>
                  <span className="text-3xl font-bold text-primary">{totalAmount.toFixed(2)}</span>
                </div>
                <Button type="submit" className="w-full h-14 text-xl" disabled={isLoading || showSuccess}>
                  {showSuccess ? (
                    <>
                      <Check className="mr-2 h-6 w-6" />
                      Purchase Recorded!
                    </>
                  ) : isLoading ? (
                    "Recording..."
                  ) : (
                    "Record Purchase"
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Select Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedProduct ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 text-lg pl-10"
                  />
                </div>
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectProduct(product)}
                      className="w-full p-4 text-left border rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-medium text-lg">{product.name}</p>
                      <p className="text-base text-muted-foreground">
                        Current Cost: {product.cost_price.toFixed(2)} | Stock: {product.stock_quantity}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-xl">{selectedProduct.name}</p>
                  <p className="text-lg text-muted-foreground">
                    Current Cost: {selectedProduct.cost_price.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modal-quantity" className="text-lg">
                    Quantity
                  </Label>
                  <Input
                    id="modal-quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-14 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modal-cost-price" className="text-lg">
                    Cost Price (per unit)
                  </Label>
                  <Input
                    id="modal-cost-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="h-14 text-lg"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Subtotal:</span>
                    <span className="text-2xl font-bold text-primary">
                      {(Number(quantity) * Number(costPrice)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(null)
                        setQuantity("1")
                        setCostPrice("")
                      }}
                      className="flex-1 h-12 text-lg"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!quantity || !costPrice || Number(quantity) < 1}
                      className="flex-1 h-12 text-lg"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
