import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'
import { EstadoVenta } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')
    const fechaInicio = searchParams.get('fechaInicio')
    const fechaFin = searchParams.get('fechaFin')
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '10')

    const where: any = {}

    if (user.rol !== 'admin') {
      where.clienteId = user.userId
    } else if (clienteId) {
      where.clienteId = parseInt(clienteId)
    }

    if (fechaInicio || fechaFin) {
      where.fecha = {}
      if (fechaInicio) where.fecha.gte = new Date(fechaInicio)
      if (fechaFin) where.fecha.lte = new Date(fechaFin)
    }

    const skip = (pagina - 1) * limite

    const [ventas, total] = await Promise.all([
      prisma.venta.findMany({
        where,
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          detalles: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  imagen: true,
                },
              },
            },
          },
        },
        orderBy: { fecha: 'desc' },
        skip,
        take: limite,
      }),
      prisma.venta.count({ where }),
    ])

    return NextResponse.json({
      ventas,
      paginacion: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    })
  } catch (error) {
    console.error('Get ventas error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookies()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productos } = body

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere una lista de productos' },
        { status: 400 }
      )
    }

    let total = 0
    const detallesConPrecio: any[] = []

    for (const item of productos) {
      const producto = await prisma.producto.findUnique({
        where: { id: item.productoId },
      })

      if (!producto) {
        return NextResponse.json(
          { error: `Producto ${item.productoId} no encontrado` },
          { status: 404 }
        )
      }

      if (producto.stock < item.cantidad) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${producto.nombre}` },
          { status: 400 }
        )
      }

      total += producto.precio * item.cantidad
      detallesConPrecio.push({
        productoId: producto.id,
        cantidad: item.cantidad,
        precio: producto.precio,
      })
    }

    const venta = await prisma.venta.create({
      data: {
        clienteId: user.userId,
        total,
        estado: EstadoVenta.pendiente,
        detalles: {
          create: detallesConPrecio,
        },
      },
      include: {
        detalles: true,
      },
    })

    return NextResponse.json(venta, { status: 201 })
  } catch (error) {
    console.error('Create venta error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
