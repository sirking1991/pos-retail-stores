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
import { Check, Plus, X, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Product {
  id: string
  name: string
  selling_price: number
  stock_quantity: number
}

interface SalesFormProps {
  products: Product[]
}

interface CartItem {
  product: Product
  quantity: number
}

export function SalesForm({ products }: SalesFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null)
  const [modalQuantity, setModalQuantity] = useState("1")

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalAmount = cart.reduce((sum, item) => sum + item.product.selling_price * item.quantity, 0)

  const handleAddToCart = () => {
    if (!selectedProductForModal) return

    const quantity = Number(modalQuantity)
    if (quantity <= 0 || quantity > selectedProductForModal.stock_quantity) return

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item) => item.product.id === selectedProductForModal.id)

    if (existingItemIndex >= 0) {
      // Update quantity if already in cart
      const newCart = [...cart]
      newCart[existingItemIndex].quantity += quantity
      setCart(newCart)
    } else {
      // Add new item to cart
      setCart([...cart, { product: selectedProductForModal, quantity }])
    }

    // Reset modal
    setIsModalOpen(false)
    setSelectedProductForModal(null)
    setModalQuantity("1")
    setSearchTerm("")
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) return

    setIsLoading(true)
    const supabase = createClient()

    try {
      // Insert all cart items as separate sales records
      const salesData = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        selling_price: item.product.selling_price,
        total_amount: item.product.selling_price * item.quantity,
        customer_name: customerName || null,
        payment_method: paymentMethod,
      }))

      const { error } = await supabase.from("sales").insert(salesData)

      if (error) throw error

      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)

      // Reset form
      setCart([])
      setCustomerName("")
      setPaymentMethod("cash")

      // Refresh the page to update recent sales and dashboard
      router.refresh()
    } catch (error) {
      console.error("Error recording sale:", error)
      alert("Failed to record sale. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">New Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="customer" className="text-lg">
              Customer Name (Optional)
            </Label>
            <Input
              id="customer"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-14 text-lg"
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Items</Label>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 text-lg bg-transparent"
                  onClick={() => setSearchTerm("")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Search Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-14 text-lg pl-10"
                    />
                  </div>

                  {/* Product list */}
                  {!selectedProductForModal ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => setSelectedProductForModal(product)}
                          className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-lg">{product.name}</p>
                              <p className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</p>
                            </div>
                            <p className="text-lg font-bold text-primary">{product.selling_price.toFixed(2)}</p>
                          </div>
                        </button>
                      ))}
                      {filteredProducts.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No products found</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-accent/50">
                        <p className="font-medium text-lg">{selectedProductForModal.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Available: {selectedProductForModal.stock_quantity}
                        </p>
                        <p className="text-lg font-bold text-primary mt-2">
                          {selectedProductForModal.selling_price.toFixed(2)}
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
                          max={selectedProductForModal.stock_quantity}
                          value={modalQuantity}
                          onChange={(e) => setModalQuantity(e.target.value)}
                          className="h-14 text-lg"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedProductForModal(null)}
                          className="flex-1 h-12 text-lg"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddToCart}
                          className="flex-1 h-12 text-lg"
                          disabled={
                            Number(modalQuantity) <= 0 || Number(modalQuantity) > selectedProductForModal.stock_quantity
                          }
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {cart.length > 0 && (
            <div className="space-y-2 border rounded-lg p-4 bg-accent/20">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 bg-background rounded border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-base">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {item.product.selling_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg">{(item.quantity * item.product.selling_price).toFixed(2)}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="payment" className="text-lg">
                  Payment Method
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment" className="h-14 text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash" className="text-base py-3">
                      Cash
                    </SelectItem>
                    <SelectItem value="card" className="text-base py-3">
                      Card
                    </SelectItem>
                    <SelectItem value="bank_transfer" className="text-base py-3">
                      Bank Transfer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-medium">Total Amount:</span>
                  <span className="text-3xl font-bold text-primary">{totalAmount.toFixed(2)}</span>
                </div>
                <Button type="submit" className="w-full h-14 text-xl" disabled={isLoading || showSuccess}>
                  {showSuccess ? (
                    <>
                      <Check className="mr-2 h-6 w-6" />
                      Sale Recorded!
                    </>
                  ) : isLoading ? (
                    "Recording..."
                  ) : (
                    "Complete Sale"
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
