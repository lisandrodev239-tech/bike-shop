'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Wrench,
  TrendingUp,
  AlertCircle,
  Users,
  Clock,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface DashboardData {
  totalVentas: number
  cantidadVentas: number
  ventasHoy: number
  cantidadVentasHoy: number
  productosMasVendidos: any[]
  productosBajoStock: any[]
  citasPendientes: number
  reparacionesEnProceso: number
  ingresosMensuales: number
  graficaVentas: { mes: string; total: number }[]
  graficaReparaciones: Record<string, number>
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (user.rol !== 'admin') {
        router.push('/')
      } else {
        fetchDashboard()
      }
    }
  }, [user, authLoading])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      setData(data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.rol !== 'admin') {
    return null
  }

  const reparacionData = data?.graficaReparaciones
    ? Object.entries(data.graficaReparaciones).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    : []

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
              className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600"
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
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
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
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard - Bienvenido, {user.nombre}
            </h1>
            <p className="text-gray-600">Resumen de tu negocio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Ventas Totales</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${data?.totalVentas.toLocaleString('es-AR') || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Ventas de Hoy</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${data?.ventasHoy.toLocaleString('es-AR') || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Citas Pendientes</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {data?.citasPendientes || 0}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">En Proceso</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {data?.reparacionesEnProceso || 0}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Wrench className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Ventas por Mes</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.graficaVentas || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Reparaciones por Estado</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reparacionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reparacionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Productos Más Vendidos</h2>
                <Link
                  href="/admin/productos"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {data?.productosMasVendidos.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            🚲
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {item.cantidadVendida} vendidos
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-blue-600">
                      ${item.precio.toLocaleString('es-AR')}
                    </p>
                  </div>
                ))}
                {(!data?.productosMasVendidos || data.productosMasVendidos.length === 0) && (
                  <p className="text-gray-500 text-center py-4">
                    No hay datos de ventas todavía
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Stock Bajo</h2>
                <Link
                  href="/admin/productos"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Gestionar
                </Link>
              </div>
              <div className="space-y-4">
                {data?.productosBajoStock.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold">{producto.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {producto.marca || 'Sin marca'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        producto.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      Stock: {producto.stock}
                    </span>
                  </div>
                ))}
                {(!data?.productosBajoStock || data.productosBajoStock.length === 0) && (
                  <p className="text-gray-500 text-center py-4">
                    Todos los productos tienen stock adecuado
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
