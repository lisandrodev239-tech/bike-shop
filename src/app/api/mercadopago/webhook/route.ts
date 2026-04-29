import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EstadoVenta } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type === 'payment') {
      const paymentId = body.data.id

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      )

      const payment = await response.json()

      if (payment.status === 'approved') {
        const ventaId = parseInt(payment.external_reference)

        await prisma.venta.update({
          where: { id: ventaId },
          data: {
            estado: EstadoVenta.completada,
            mpPaymentId: paymentId.toString(),
            mpMerchantOrderId: payment.order?.id?.toString(),
          },
        })

        const venta = await prisma.venta.findUnique({
          where: { id: ventaId },
          include: { detalles: true },
        })

        if (venta) {
          for (const detalle of venta.detalles) {
            await prisma.producto.update({
              where: { id: detalle.productoId },
              data: {
                stock: {
                  decrement: detalle.cantidad,
                },
              },
            })
          }
        }
      } else if (payment.status === 'rejected') {
        const ventaId = parseInt(payment.external_reference)
        await prisma.venta.update({
          where: { id: ventaId },
          data: {
            estado: EstadoVenta.cancelada,
            mpPaymentId: paymentId.toString(),
          },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
