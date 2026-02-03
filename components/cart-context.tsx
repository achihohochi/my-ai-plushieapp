"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface CartItem extends Product {
  quantity: number
  cartItemId?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product) => Promise<void>
  removeItem: (id: number) => Promise<void>
  updateQuantity: (id: number, quantity: number) => Promise<void>
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  totalItems: number
  totalPrice: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load cart from API on mount
  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch('/api/cart')
        const data = await res.json()
        if (data.success) {
          setItems(data.data)
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const addItem = async (product: Product) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })

      const data = await res.json()

      if (data.success) {
        // Update local state
        setItems((prev) => {
          const existing = prev.find((item) => item.id === product.id)
          if (existing) {
            return prev.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          }
          return [...prev, data.data]
        })
        setIsOpen(true)
      } else {
        alert(data.error || 'Failed to add item to cart')
      }
    } catch (error) {
      console.error('Failed to add item:', error)
      alert('Failed to add item to cart')
    }
  }

  const removeItem = async (id: number) => {
    const item = items.find((i) => i.id === id)
    if (!item?.cartItemId) return

    try {
      const res = await fetch(`/api/cart/${item.cartItemId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      } else {
        alert(data.error || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
      alert('Failed to remove item')
    }
  }

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id)
      return
    }

    const item = items.find((i) => i.id === id)
    if (!item?.cartItemId) return

    try {
      const res = await fetch(`/api/cart/${item.cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })

      const data = await res.json()

      if (data.success) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
      } else {
        alert(data.error || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
      alert('Failed to update quantity')
    }
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
