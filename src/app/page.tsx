'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

interface Producto {
  id: number
  nombre: string
  precio: number
  imagen?: string
  descripcion?: string
  marca?: string
  stock: number
}

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/productos?limite=4')
      .then(res => res.json())
      .then(data => {
        setProductos(data.productos || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Bicicletas de Calidad
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Encuentra la bicicleta perfecta para vos. Venta, accesorios y reparaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/productos"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Ver Catálogo
            </Link>
            <Link
              href="/reparaciones"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Agendar Reparación
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-gray-600 text-lg">
            Descubrí nuestra selección de las mejores bicicletas y accesorios
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No hay productos disponibles todavía
            </p>
            <p className="text-gray-400">
              Ejecutá <code className="bg-gray-100 px-2 py-1 rounded">npm run db:seed</code> para cargar datos de prueba
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/productos"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-6xl mb-4">🚲</div>
              <h3 className="text-2xl font-bold mb-4">Venta de Bicicletas</h3>
              <p className="text-gray-600">
                Amplia gama de bicicletas para todas las edades y disciplinas. Mountain bikes, rutas, urbanas y más.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-4">Reparaciones</h3>
              <p className="text-gray-600">
                Servicio técnico profesional para tu bicicleta. Tune-ups, cambios de piezas y mantenimiento general.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold mb-4">Accesorios</h3>
              <p className="text-gray-600">
                Cascos, luces, bags, herramientas y todo lo que necesitás para salir a pedalear.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Necesitás ayuda?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Nuestro equipo está listo para asesorarte y encontrar la mejor opción para vos.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Contactanos
          </Link>
        </div>
      </section>
    </div>
  )
}
