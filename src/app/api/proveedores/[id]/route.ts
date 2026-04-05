import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { proveedorSchema } from '@/lib/validations'
import { getUserFromCookies } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromCookies()
    
    if (!user || user.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const { id } = await params
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: parseInt(id) },
      include: {
        pedidos: true,
      },
    })

    if (!proveedor) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(proveedor)
  } catch (error) {
    console.error('Get proveedor error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromCookies()
    
    if (!user || user.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    const validation = proveedorSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const proveedor = await prisma.proveedor.update({
      where: { id: parseInt(id) },
      data: validation.data,
    })

    return NextResponse.json(proveedor)
  } catch (error) {
    console.error('Update proveedor error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromCookies()
    
    if (!user || user.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const { id } = await params
    await prisma.proveedor.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ message: 'Proveedor eliminado' })
  } catch (error) {
    console.error('Delete proveedor error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
