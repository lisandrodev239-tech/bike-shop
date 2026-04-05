import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
})

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
    const { ventaId } = body

    if (!ventaId) {
      return NextResponse.json(
        { error: 'ID de venta requerido' },
        { status: 400 }
      )
    }

    const venta = await prisma.venta.findUnique({
      where: { id: ventaId },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    })

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      )
    }

    if (venta.clienteId !== user.userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const preference = new Preference(client)

    const preferenceData = {
      items: venta.detalles.map((detalle) => ({
        id: detalle.productoId.toString(),
        title: detalle.producto.nombre,
        quantity: detalle.cantidad,
        unit_price: detalle.precio,
        currency_id: 'ARS',
      })),
      payer: {
        name: venta.cliente.nombre,
        email: venta.cliente.email,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pago-exitoso`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pago-fallido`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pago-pendiente`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/mercadopago/webhook`,
      external_reference: ventaId.toString(),
      auto_return: 'approved',
    }

    const result = await preference.create({ body: preferenceData })

    await prisma.venta.update({
      where: { id: ventaId },
      data: {
        mpPreferenceId: result.id,
      },
    })

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
    })
  } catch (error) {
    console.error('Create preference error:', error)
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 }
    )
  }
}
