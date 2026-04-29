'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Package, Users, Wrench, Search, Eye } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface Venta {
  id: number
  clienteId: number
  cliente: {
    id: number
    nombre: string
    email: string
  }
  total: number
  estado: string
  fecha: string
  detalles: any[]
}

export default function AdminVentasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.rol !== 'admin') {
        router.push('/')
      } else {
        fetchVentas()
      }
    }
  }, [user, authLoading])

  const fetchVentas = async () => {
    try {
      const params = new URLSearchParams()
      if (fechaInicio) params.set('fechaInicio', fechaInicio)
      if (fechaFin) params.set('fechaFin', fechaFin)

      const res = await fetch(`/api/ventas?${params.toString()}`)
      const data = await res.json()
      setVentas(data.ventas || [])
    } catch (error) {
      console.error('Error fetching ventas:', error)
    } finally {
      setLoading(false)
    }
  }

  const ventasFiltradas = ventas.filter((v) => {
    if (!busqueda) return true
    const searchLower = busqueda.toLowerCase()
    return (
      v.cliente.nombre.toLowerCase().includes(searchLower) ||
      v.cliente.email.toLowerCase().includes(searchLower) ||
      v.id.toString().includes(searchLower)
    )
  })

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
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Ventas</h1>
            <p className="text-gray-600">Historial de ventas</p>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="date"
              placeholder="Fecha inicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              placeholder="Fecha fin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={fetchVentas}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Filtrar
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">#{venta.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{venta.cliente.nombre}</p>
                        <p className="text-sm text-gray-500">{venta.cliente.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ${venta.total.toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(venta.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(venta.estado)}`}>
                        {venta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => router.push(`/admin/ventas/${venta.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {ventasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron ventas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}
