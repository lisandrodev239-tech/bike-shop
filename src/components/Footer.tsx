import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BikeShop</h3>
            <p className="text-gray-400">
              Tu tienda de confianza para bicicletas, accesorios y reparaciones de calidad.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-400 hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/bicicletas" className="text-gray-400 hover:text-white transition">
                  Bicicletas
                </Link>
              </li>
              <li>
                <Link href="/reparaciones" className="text-gray-400 hover:text-white transition">
                  Reparaciones
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Calle Principal 123, Ciudad</li>
              <li>📞 +54 11 1234-5678</li>
              <li>✉️ info@bikeshop.com</li>
              <li>⏰ Lun-Vie: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BikeShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
