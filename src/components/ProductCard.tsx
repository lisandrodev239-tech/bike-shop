'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart } from 'lucide-react'

interface Producto {
  id: number
  nombre: string
  precio: number
  imagen?: string
  descripcion?: string
  marca?: string
  stock: number
}

export default function ProductCard({ producto }: { producto: Producto }) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen,
    })
  }

  return (
    <Link href={`/producto/${producto.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-6xl">🚲</div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 truncate">
            {producto.nombre}
          </h3>
          {producto.marca && (
            <p className="text-sm text-gray-500 mb-2">{producto.marca}</p>
          )}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {producto.descripcion || 'Sin descripción'}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ${producto.precio.toLocaleString('es-AR')}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                producto.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={producto.stock === 0}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Agregar al Carrito</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
