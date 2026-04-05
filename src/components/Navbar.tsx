'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cantidad } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold">
            BikeShop
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/productos" className="hover:text-blue-200 transition">
              Productos
            </Link>
            <Link href="/bicicletas" className="hover:text-blue-200 transition">
              Bicicletas
            </Link>
            <Link href="/accesorios" className="hover:text-blue-200 transition">
              Accesorios
            </Link>
            <Link href="/reparaciones" className="hover:text-blue-200 transition">
              Reparaciones
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/carrito" className="relative hover:text-blue-200 transition">
              <ShoppingCart className="w-6 h-6" />
              {cantidad > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cantidad}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-blue-200 transition">
                  <User className="w-6 h-6" />
                  <span className="hidden md:inline">{user.nombre}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    href="/perfil"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/mis-compras"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Mis Compras
                  </Link>
                  <Link
                    href="/mis-reparaciones"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Mis Reparaciones
                  </Link>
                  {user.rol === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-gray-100 font-semibold"
                    >
                      Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                Iniciar Sesión
              </Link>
            )}

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/productos" className="block py-2 hover:text-blue-200">
              Productos
            </Link>
            <Link href="/bicicletas" className="block py-2 hover:text-blue-200">
              Bicicletas
            </Link>
            <Link href="/accesorios" className="block py-2 hover:text-blue-200">
              Accesorios
            </Link>
            <Link href="/reparaciones" className="block py-2 hover:text-blue-200">
              Reparaciones
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
