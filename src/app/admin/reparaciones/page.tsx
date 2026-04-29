'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Package, Users, Wrench, Search, Edit } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface Cita {
  id: number
  cliente: {
    id: number
    nombre: string
    email: string
    telefono: string
  }
  tipoBicicleta: string
  descripcion: string
  fecha: string
  hora: string
  estado: string
  costoEstimado: number | null
}

export default function AdminReparacionesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCita, setEditingCita] = useState<Cita | null>(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.rol !== 'admin') {
        router.push('/')
      } else {
        fetchCitas()
      }
    }
  }, [user, authLoading])

  const fetchCitas = async () => {
    try {
      const res = await fetch('/api/citareparacion')
      const data = await res.json()
      setCitas(data || [])
    } catch (error) {
      console.error('Error fetching citas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/citareparacion/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (res.ok) {
        showToast('Estado actualizado', 'success')
        fetchCitas()
      } else {
        showToast('Error al actualizar', 'error')
      }
    } catch (error) {
      showToast('Error al actualizar', 'error')
    }
  }

  const citasFiltradas = citas.filter((c) =>
    c.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'en_proceso': return 'bg-blue-100 text-blue-800'
      case 'terminado': return 'bg-green-100 text-green-800'
      case 'entregado': return 'bg-purple-100 text-purple-800'
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
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Users className="w-5 h-5 mr-3" />
              Ventas
            </Link>
            <Link
              href="/admin/reparaciones"
              className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600"
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
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Reparaciones</h1>
            <p className="text-gray-600">Citas y reparaciones</p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citasFiltradas.map((cita) => (
              <div key={cita.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(cita.estado)}`}>
                    {cita.estado.replace('_', ' ')}
                  </span>
                  <select
                    value={cita.estado}
                    onChange={(e) => handleUpdateEstado(cita.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="terminado">Terminado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="font-semibold text-lg">{cita.cliente.nombre}</p>
                  <p className="text-sm text-gray-500">{cita.cliente.telefono}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Bicicleta:</strong> {cita.tipoBicicleta}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString('es-AR')} - {cita.hora}
                  </p>
                  {cita.costoEstimado && (
                    <p className="text-sm font-semibold text-blue-600">
                      Costo estimado: ${cita.costoEstimado.toLocaleString('es-AR')}
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {cita.descripcion}
                </p>
              </div>
            ))}
            {citasFiltradas.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No se encontraron citas
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
