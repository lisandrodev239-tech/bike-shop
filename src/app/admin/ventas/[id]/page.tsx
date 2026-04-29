'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Package, Users, Wrench } from 'lucide-react'

interface VentaDetalle {
  id: number
  clienteId: number
  cliente: {
    id: number
    nombre: string
    email: string
    telefono: string | null
  }
  total: number
  estado: string
  fecha: string
  mpPaymentId: string | null
  detalles: {
    id: number
    cantidad: number
    precio: number
    producto: {
      id: number
      nombre: string
      imagen: string | null
    }
  }[]
}

export default function AdminVentaDetallePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [venta, setVenta] = useState<VentaDetalle | null>(null)
  const [loading, setLoading] = useState(true)

  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const ventaId = params.get('id') || window?.location?.pathname?.split('/').pop()

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.rol !== 'admin') {
        router.push('/')
      } else {
        fetchVenta()
      }
    }
  }, [user, authLoading])

  const fetchVenta = async () => {
    try {
      const pathParts = window.location.pathname.split('/')
      const id = pathParts[pathParts.length - 1]
      const res = await fetch(`/api/ventas?clienteId=${id}`)
      const data = await res.json()
      
      if (data.ventas && data.ventas.length > 0) {
        const ventaEncontrada = data.ventas.find((v: any) => v.id.toString() === id)
        if (ventaEncontrada) {
          setVenta(ventaEncontrada)
        }
      }
    } catch (error) {
      console.error('Error fetching venta:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800'
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'cancelada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!venta) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Venta no encontrada</h2>
          <Link href="/admin/ventas" className="text-blue-600 hover:underline mt-4 inline-block">
            Volver al listado
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <Link
              href="/admin"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link
              href="/admin/productos"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Package className="w-5 h-5 mr-3" />
              Productos
            </Link>
            <Link
              href="/admin/ventas"
              className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600"
            >
              <Users className="w-5 h-5 mr-3" />
              Ventas
            </Link>
            <Link
              href="/admin/reparaciones"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Wrench className="w-5 h-5 mr-3" />
              Reparaciones
            </Link>
            <Link
              href="/admin/proveedores"
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Users className="w-5 h-5 mr-3" />
              Proveedores
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <Link
              href="/admin/ventas"
              className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al listado
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              Venta #{venta.id}
            </h1>
            <p className="text-gray-600">
              {new Date(venta.fecha).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Productos</h2>
                <div className="space-y-4">
                  {venta.detalles.map((detalle) => (
                    <div key={detalle.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {detalle.producto.imagen ? (
                          <img
                            src={detalle.producto.imagen}
                            alt={detalle.producto.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            🚲
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{detalle.producto.nombre}</p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {detalle.cantidad} x ${detalle.precio.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <p className="font-bold text-blue-600">
                        ${(detalle.cantidad * detalle.precio).toLocaleString('es-AR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Información de Venta</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(venta.estado)}`}>
                      {venta.estado}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-2xl text-blue-600">
                      ${venta.total.toLocaleString('es-AR')}
                    </span>
                  </div>
                  {venta.mpPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">MP Payment ID</span>
                      <span className="text-sm font-mono">{venta.mpPaymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Cliente</h2>
                <div className="space-y-2">
                  <p className="font-semibold">{venta.cliente.nombre}</p>
                  <p className="text-sm text-gray-600">{venta.cliente.email}</p>
                  {venta.cliente.telefono && (
                    <p className="text-sm text-gray-600">{venta.cliente.telefono}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
