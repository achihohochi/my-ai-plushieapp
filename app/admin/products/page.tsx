"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/components/admin-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  description: string | null
  price: string
  image_url: string
  stock_quantity: number
  status: string
}

export default function AdminProductsPage() {
  const { adminKey, isAuthenticated } = useAdmin()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts()
    }
  }, [isAuthenticated])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()

      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({
      name: product.name,
      description: product.description || '',
      image_url: product.image_url,
      price: product.price,
      stock_quantity: product.stock_quantity,
      status: product.status,
    })
    setMessage(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setMessage(null)
  }

  const handleSave = async (productId: number) => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || '',
        },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Product updated successfully' })
        setEditingId(null)
        setEditForm({})
        fetchProducts()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update product' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update product' })
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Products Management</h1>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isEditing = editingId === product.id

            return (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex gap-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{product.name}</CardTitle>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${product.id}`}>Product Name</Label>
                        <Input
                          id={`name-${product.id}`}
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Enter product name..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${product.id}`}>Description</Label>
                        <textarea
                          id={`description-${product.id}`}
                          className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                          value={editForm.description || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          placeholder="Enter product description..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`image-${product.id}`}>Image URL</Label>
                        <Input
                          id={`image-${product.id}`}
                          type="text"
                          value={editForm.image_url}
                          onChange={(e) =>
                            setEditForm({ ...editForm, image_url: e.target.value })
                          }
                          placeholder="/path/to/image.jpg"
                        />
                        {editForm.image_url && (
                          <img
                            src={editForm.image_url}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg mt-2"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.png'
                            }}
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`price-${product.id}`}>Price ($)</Label>
                        <Input
                          id={`price-${product.id}`}
                          type="number"
                          step="0.01"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`stock-${product.id}`}>Stock Quantity</Label>
                        <Input
                          id={`stock-${product.id}`}
                          type="number"
                          value={editForm.stock_quantity}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              stock_quantity: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`status-${product.id}`}>Status</Label>
                        <select
                          id={`status-${product.id}`}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(product.id)}
                          disabled={saving}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={saving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price:</span>
                        <span className="text-lg font-bold text-primary">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Stock:</span>
                        <span
                          className={`font-semibold ${
                            product.stock_quantity <= 5
                              ? 'text-red-600'
                              : 'text-foreground'
                          }`}
                        >
                          {product.stock_quantity} units
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>

                      <Button
                        onClick={() => handleEdit(product)}
                        className="w-full"
                        variant="outline"
                      >
                        Edit Product
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
