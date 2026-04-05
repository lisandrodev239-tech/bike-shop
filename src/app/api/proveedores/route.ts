import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { proveedorSchema } from '@/lib/validations'
import { getUserFromCookies } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies()
    
    if (!user || user.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const proveedores = await prisma.proveedor.findMany({
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json(proveedores)
  } catch (error) {
    console.error('Get proveedores error:', error)
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
    
    const validation = proveedorSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const proveedor = await prisma.proveedor.create({
      data: validation.data,
    })

    return NextResponse.json(proveedor, { status: 201 })
  } catch (error) {
    console.error('Create proveedor error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
