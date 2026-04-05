'use client'

import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePagar = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para continuar', 'warning')
      router.push('/login')
      return
    }

    if (items.length === 0) {
      showToast('El carrito está vacío', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productos: items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
          })),
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      const venta = await res.json()

      const prefRes = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventaId: venta.id }),
      })

      if (!prefRes.ok) {
        throw new Error('Error al crear preferencia de pago')
      }

      const { initPoint } = await prefRes.json()
      
      clearCart()
      window.location.href = initPoint
    } catch (error: any) {
      showToast(error.message || 'Error al procesar el pago', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8">
          Agregá productos para comenzar tu compra
        </p>
        <Link
          href="/productos"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Ver Productos
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {items.map((item) => (
                <div
                  key={item.productoId}
                  className="flex items-center gap-4 py-4 border-b last:border-b-0"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🚲
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.nombre}</h3>
                    <p className="text-blue-600 font-bold">
                      ${item.precio.toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                    </p>
                    <button
                      onClick={() => removeItem(item.productoId)}
                      className="text-red-500 hover:text-red-700 transition mt-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-semibold text-green-600">Gratis</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <button
              onClick={handlePagar}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Procesando...' : 'Proceder al Pago'}
            </button>

            {!user && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Necesitás{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  iniciar sesión
                </Link>{' '}
                para continuar
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
