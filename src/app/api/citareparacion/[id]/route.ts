import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateCitaSchema } from '@/lib/validations'
import { getUserFromCookies } from '@/lib/auth'
import { EstadoReparacion } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cita = await prisma.citaReparacion.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        servicios: {
          include: {
            producto: true,
            servicio: true,
          },
        },
      },
    })

    if (!cita) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(cita)
  } catch (error) {
    console.error('Get cita error:', error)
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
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    const validation = updateCitaSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const cita = await prisma.citaReparacion.update({
      where: { id: parseInt(id) },
      data: validation.data,
    })

    return NextResponse.json(cita)
  } catch (error) {
    console.error('Update cita error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
