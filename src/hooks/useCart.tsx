'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productoId: number) => void
  updateQuantity: (productoId: number, cantidad: number) => void
  clearCart: () => void
  total: number
  cantidad: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productoId === item.productoId)
      if (existing) {
        return prev.map((i) =>
          i.productoId === item.productoId
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (productoId: number) => {
    setItems((prev) => prev.filter((i) => i.productoId !== productoId))
  }

  const updateQuantity = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeItem(productoId)
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productoId === productoId ? { ...i, cantidad } : i
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  )

  const cantidad = items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, cantidad }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
