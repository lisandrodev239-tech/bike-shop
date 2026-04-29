import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productoSchema } from '@/lib/validations'
import { getUserFromCookies } from '@/lib/auth'
import { Categoria, EstadoProducto } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria') as Categoria | null
    const busqueda = searchParams.get('busqueda')
    const minPrecio = searchParams.get('minPrecio')
    const maxPrecio = searchParams.get('maxPrecio')
    const ordenar = searchParams.get('ordenar') || 'nombre'
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const limite = parseInt(searchParams.get('limite') || '12')

    const where: any = { estado: EstadoProducto.activo }

    if (categoria && Object.values(Categoria).includes(categoria)) {
      where.categoria = categoria
    }

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
        { marca: { contains: busqueda, mode: 'insensitive' } },
      ]
    }

    if (minPrecio || maxPrecio) {
      where.precio = {}
      if (minPrecio) where.precio.gte = parseFloat(minPrecio)
      if (maxPrecio) where.precio.lte = parseFloat(maxPrecio)
    }

    const skip = (pagina - 1) * limite

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limite,
        orderBy: {
          [ordenar]: 'asc',
        },
      }),
      prisma.producto.count({ where }),
    ])

    return NextResponse.json({
      productos,
      paginacion: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    })
  } catch (error) {
    console.error('Get productos error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookies()
    
    if (!user || user.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    const validation = productoSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const producto = await prisma.producto.create({
      data: validation.data,
    })

    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    console.error('Create producto error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
