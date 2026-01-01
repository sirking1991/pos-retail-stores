"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, Search, Plus, Pencil } from "lucide-react"
import { ProductFormModal } from "@/components/product-form-modal"

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

interface InventoryListProps {
  products: Product[]
}

export function InventoryList({ products }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalValue = products.reduce((sum, product) => sum + Number(product.cost_price) * product.stock_quantity, 0)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">
              {products.filter((p) => p.stock_quantity <= p.reorder_level).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add Button */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-14 text-lg"
            />
          </div>
          <Button onClick={handleAddProduct} size="lg" className="w-full text-lg h-14">
            <Plus className="mr-2 h-5 w-5" />
            Add New Product
          </Button>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Products</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-lg">No products found</p>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock_quantity <= product.reorder_level
                const isOutOfStock = product.stock_quantity === 0
                const profit = Number(product.selling_price) - Number(product.cost_price)
                const profitMargin = ((profit / Number(product.selling_price)) * 100).toFixed(1)

                return (
                  <div key={product.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          {isOutOfStock && (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                          {isLowStock && !isOutOfStock && (
                            <Badge variant="outline" className="text-xs border-amber-500 text-amber-700">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm">
                          {product.sku && (
                            <span className="text-muted-foreground">
                              <strong>SKU:</strong> {product.sku}
                            </span>
                          )}
                          {product.category && (
                            <span className="text-muted-foreground">
                              <strong>Category:</strong> {product.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package
                          className={`h-8 w-8 ${isOutOfStock ? "text-red-500" : isLowStock ? "text-amber-500" : "text-green-500"}`}
                        />
                        <div className="text-right">
                          <p className="text-2xl font-bold">{product.stock_quantity}</p>
                          <p className="text-xs text-muted-foreground">in stock</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Cost Price</p>
                        <p className="text-base font-semibold">{Number(product.cost_price).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Selling Price</p>
                        <p className="text-base font-semibold text-green-600">
                          {Number(product.selling_price).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Profit/Unit</p>
                        <p className="text-base font-semibold text-blue-600">{profit.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Margin</p>
                        <p className="text-base font-semibold">{profitMargin}%</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-base bg-transparent"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Product
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      <ProductFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={editingProduct} />
    </div>
  )
}
