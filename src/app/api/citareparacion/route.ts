import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { citaSchema, updateCitaSchema } from '@/lib/validations'
import { getUserFromCookies } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const where: any = {}
    
    if (user.rol !== 'admin') {
      where.clienteId = user.userId
    }

    const citas = await prisma.citaReparacion.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    })

    return NextResponse.json(citas)
  } catch (error) {
    console.error('Get citas error:', error)
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
    
    const validation = citaSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { tipoBicicleta, descripcion, fecha, hora, costoEstimado } = validation.data

    const cita = await prisma.citaReparacion.create({
      data: {
        clienteId: user.userId,
        tipoBicicleta,
        descripcion,
        fecha: new Date(fecha),
        hora,
        costoEstimado,
        estado: 'pendiente',
      },
    })

    return NextResponse.json(cita, { status: 201 })
  } catch (error) {
    console.error('Create cita error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
