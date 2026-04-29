import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bikeshop.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@bikeshop.com',
      password: adminPassword,
      rol: 'admin',
      telefono: '+54 11 1234-5678',
      direccion: 'Calle Admin 123',
    },
  })

  const usuario = await prisma.user.upsert({
    where: { email: 'usuario@test.com' },
    update: {},
    create: {
      nombre: 'Juan Pérez',
      email: 'usuario@test.com',
      password: userPassword,
      rol: 'cliente',
      telefono: '+54 11 9876-5432',
      direccion: 'Calle Usuario 456',
    },
  })

  console.log('Users created:', { admin: admin.email, usuario: usuario.email })

    const productos = [
      {
        nombre: 'Mountain Bike RTX 3000',
        descripcion: 'Bicicleta de montaña con cuadro de aluminio, suspensión delantera y cambios Shimano',
        precio: 850000,
        stock: 5,
        stockMinimo: 3,
        categoria: 'bicicletas',
        marca: 'RTX',
        imagen: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Bicicleta Urbana City Pro',
        descripcion: 'Bicicleta urbana ideal para desplazamiento diario, con portaequipaje y guardabarros',
        precio: 420000,
        stock: 8,
        stockMinimo: 3,
        categoria: 'bicicletas',
        marca: 'CityPro',
        imagen: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Bicicleta de Ruta Carbon X',
        descripcion: 'Bicicleta de ruta profesional con cuadro de carbono, ultra liviana',
        precio: 1500000,
        stock: 3,
        stockMinimo: 2,
        categoria: 'bicicletas',
        marca: 'CarbonX',
        imagen: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Casco Pro Rider',
        descripcion: 'Casco de bicicleta certificado, con sistema de ventilación',
        precio: 35000,
        stock: 25,
        stockMinimo: 10,
        categoria: 'accesorios',
        marca: 'ProRider',
        imagen: 'https://images.unsplash.com/photo-1557803175-2f8c4dfb6d9f?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Luces LED Delantera y Trasera',
        descripcion: 'Kit de luces LED recargables por USB, alta visibilidad',
        precio: 12000,
        stock: 40,
        stockMinimo: 15,
        categoria: 'accesorios',
        marca: 'BrightRide',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Guantes Ciclismo Performance',
        descripcion: 'Guantes acolchados para mayor confort en largas distancias',
        precio: 8500,
        stock: 30,
        stockMinimo: 10,
        categoria: 'accesorios',
        marca: 'CyclePro',
        imagen: 'https://images.unsplash.com/photo-1591085686350-798c0fbfaa7f?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Neumático Mountain Bike 26x2.1',
        descripcion: 'Cubierta de alta resistencia para terreno mixto',
        precio: 18000,
        stock: 15,
        stockMinimo: 5,
        categoria: 'partes',
        marca: 'Maxxis',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Pastillas de Freno Hidráulico',
        descripcion: 'Pastillas de freno de alto rendimiento para sistemas hidráulicos',
        precio: 9500,
        stock: 20,
        stockMinimo: 8,
        categoria: 'partes',
        marca: 'StopTech',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Kit de Herramientas 16 en 1',
        descripcion: 'Kit completo de herramientas para mantenimiento básico',
        precio: 22000,
        stock: 12,
        stockMinimo: 5,
        categoria: 'herramientas',
        marca: 'ToolMaster',
        imagen: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Bomba de Aire Portátil',
        descripcion: 'Bomba de aire compacta con medidor de presión',
        precio: 15000,
        stock: 18,
        stockMinimo: 5,
        categoria: 'herramientas',
        marca: 'AirFlow',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Sistema de Cambios Shimano Deore',
        descripcion: 'Sistema de cambios de 10 velocidades para MTB',
        precio: 85000,
        stock: 4,
        stockMinimo: 2,
        categoria: 'partes',
        marca: 'Shimano',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        estado: 'activo',
      },
      {
        nombre: 'Asiento Ergonómico Gel',
        descripcion: 'Asiento de gel con diseño ergonómico para máximo confort',
        precio: 28000,
        stock: 10,
        stockMinimo: 3,
        categoria: 'partes',
        marca: 'ComfortRide',
        imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        estado: 'activo',
      },
    ]

  for (const producto of productos) {
    await prisma.producto.upsert({
      where: { id: producto.nombre.length },
      update: producto,
      create: producto,
    })
  }

  console.log(`Created ${productos.length} productos`)

  const proveedores = [
    {
      nombre: 'Distribuidora RTX Argentina',
      contacto: 'Carlos García',
      telefono: '+54 11 4567-8901',
      email: 'ventas@rtxdistr.com',
    },
    {
      nombre: 'Shimano Latin America',
      contacto: 'María López',
      telefono: '+54 11 3456-7890',
      email: 'info@shimano-la.com',
    },
    {
      nombre: 'Accesorios Pro China',
      contacto: 'Wei Chen',
      telefono: '+86 21 1234-5678',
      email: 'export@proacc-cn.com',
    },
  ]

  for (const proveedor of proveedores) {
    await prisma.proveedor.create({
      data: proveedor,
    })
  }

  console.log(`Created ${proveedores.length} proveedores`)

  const servicios = [
    {
      nombre: 'Tune-up Básico',
      costo: 15000,
      descripcion: 'Ajuste de cambios y frenos, lubricación de cadena',
    },
    {
      nombre: 'Tune-up Completo',
      costo: 30000,
      descripcion: 'Tune-up básico + centrado de ruedas + revisión completa',
    },
    {
      nombre: 'Cambio de Cubiertas',
      costo: 8000,
      descripcion: 'Instalación de nuevas cubiertas (precio por unidad)',
    },
    {
      nombre: 'Ajuste de Frenos',
      costo: 5000,
      descripcion: 'Ajuste y purga de sistema de frenos',
    },
    {
      nombre: 'Cambio de Cadena',
      costo: 6000,
      descripcion: 'Reemplazo de cadena con lubricación',
    },
  ]

  for (const servicio of servicios) {
    await prisma.servicio.create({
      data: servicio,
    })
  }

  console.log(`Created ${servicios.length} servicios`)

  console.log('Seed completed successfully!')
  console.log('\nTest credentials:')
  console.log('Admin: admin@bikeshop.com / admin123')
  console.log('User: usuario@test.com / user123')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
