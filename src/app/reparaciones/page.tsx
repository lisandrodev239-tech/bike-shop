'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'
import { Wrench, Calendar, Clock, FileText } from 'lucide-react'

export default function ReparacionesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [citas, setCitas] = useState<any[]>([])
  const [loadingCitas, setLoadingCitas] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tipoBicicleta: '',
    descripcion: '',
    fecha: '',
    hora: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading])

  useEffect(() => {
    if (user) {
      fetchCitas()
    }
  }, [user])

  const fetchCitas = async () => {
    try {
      const res = await fetch('/api/citareparacion')
      const data = await res.json()
      setCitas(data)
    } catch (error) {
      console.error('Error fetching citas:', error)
    } finally {
      setLoadingCitas(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/citareparacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        showToast('Cita agendada exitosamente', 'success')
        setShowForm(false)
        setFormData({ tipoBicicleta: '', descripcion: '', fecha: '', hora: '' })
        fetchCitas()
      } else {
        const error = await res.json()
        showToast(error.error || 'Error al agendar', 'error')
      }
    } catch (error) {
      showToast('Error al agendar la cita', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en_proceso':
        return 'bg-blue-100 text-blue-800'
      case 'terminado':
        return 'bg-green-100 text-green-800'
      case 'entregado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoLabel = (estado: string) => {
    return estado.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Reparaciones</h1>
          <p className="text-gray-600">Agenda y seguí el estado de tus reparaciones</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Wrench className="w-5 h-5" />
          {showForm ? 'Cancelar' : 'Nueva Reparación'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Agendar Nueva Reparación</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Bicicleta
              </label>
              <input
                type="text"
                required
                value={formData.tipoBicicleta}
                onChange={(e) =>
                  setFormData({ ...formData, tipoBicicleta: e.target.value })
                }
                placeholder="Ej: Mountain Bike 26"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Problema
              </label>
              <textarea
                required
                rows={4}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Describí el problema que tiene tu bicicleta..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  required
                  value={formData.hora}
                  onChange={(e) =>
                    setFormData({ ...formData, hora: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Agendando...' : 'Agendar Reparación'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {loadingCitas ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : citas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tenés reparaciones agendadas
            </h3>
            <p className="text-gray-500 mb-6">
              Agendá una reparación para mantener tu bicicleta en óptimas condiciones
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Agendar Reparación
            </button>
          </div>
        ) : (
          citas.map((cita) => (
            <div
              key={cita.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{cita.tipoBicicleta}</h3>
                  <p className="text-gray-600 mt-1">{cita.descripcion}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getEstadoColor(
                    cita.estado
                  )}`}
                >
                  {getEstadoLabel(cita.estado)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(cita.fecha).toLocaleDateString('es-AR')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{cita.hora}</span>
                </div>
                {cita.costoEstimado && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Costo estimado: ${cita.costoEstimado}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
