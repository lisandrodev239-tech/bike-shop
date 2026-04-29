'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Package, Users, Wrench, Plus, Edit, Trash2, Search } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface Proveedor {
  id: number
  nombre: string
  contacto: string | null
  telefono: string | null
  email: string | null
  pedidos?: any[]
}

export default function AdminProveedoresPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.rol !== 'admin') {
        router.push('/')
      } else {
        fetchProveedores()
      }
    }
  }, [user, authLoading])

  const fetchProveedores = async () => {
    try {
      const res = await fetch('/api/proveedores')
      const data = await res.json()
      setProveedores(data || [])
    } catch (error) {
      console.error('Error fetching proveedores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return

    try {
      const res = await fetch(`/api/proveedores/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Proveedor eliminado', 'success')
        fetchProveedores()
      } else {
        showToast('Error al eliminar', 'error')
      }
    } catch (error) {
      showToast('Error al eliminar', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      const url = editingProveedor
        ? `/api/proveedores/${editingProveedor.id}`
        : '/api/proveedores'
      const method = editingProveedor ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        showToast(
          editingProveedor ? 'Proveedor actualizado' : 'Proveedor creado',
          'success'
        )
        setShowModal(false)
        setEditingProveedor(null)
        fetchProveedores()
      } else {
        const error = await res.json()
        showToast(error.error || 'Error', 'error')
      }
    } catch (error) {
      showToast('Error al guardar', 'error')
    }
  }

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.contacto?.toLowerCase().includes(busqueda.toLowerCase())
  )

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
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              <Wrench className="w-5 h-5 mr-3" />
              Reparaciones
            </Link>
            <Link
              href="/admin/proveedores"
              className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600"
            >
              <Users className="w-5 h-5 mr-3" />
              Proveedores
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
              <p className="text-gray-600">Administra tus proveedores</p>
            </div>
            <button
              onClick={() => {
                setEditingProveedor(null)
                setShowModal(true)
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Proveedor
            </button>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar proveedores..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {proveedoresFiltrados.map((proveedor) => (
                  <tr key={proveedor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{proveedor.nombre}</td>
                    <td className="px-6 py-4">{proveedor.contacto || '-'}</td>
                    <td className="px-6 py-4">{proveedor.telefono || '-'}</td>
                    <td className="px-6 py-4">{proveedor.email || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditingProveedor(proveedor)
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proveedor.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {proveedoresFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron proveedores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-6">
                  {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      defaultValue={editingProveedor?.nombre}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                    <input
                      type="text"
                      name="contacto"
                      defaultValue={editingProveedor?.contacto || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      defaultValue={editingProveedor?.telefono || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingProveedor?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false)
                        setEditingProveedor(null)
                      }}
                      className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      {editingProveedor ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
