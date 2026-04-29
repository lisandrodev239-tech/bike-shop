import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'
import { EstadoVenta, EstadoReparacion, EstadoProducto } from '@prisma/client'

export async function GET() {
  try {
    const user = await getUserFromCookies()
    
    if (!user || user.rol !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const manana = new Date(hoy)
    manana.setDate(manana.getDate() + 1)

    const [
      totalVentas,
      ventasHoy,
      productosMasVendidos,
      productosBajoStock,
      citasPendientes,
      reparacionesEnProceso,
      ventasPorMes,
      ingresosMensuales,
      reparacionesPorEstado,
    ] = await Promise.all([
      prisma.venta.aggregate({
        where: { estado: EstadoVenta.completada },
        _sum: { total: true },
        _count: true,
      }),
      prisma.venta.aggregate({
        where: {
          estado: EstadoVenta.completada,
          fecha: {
            gte: hoy,
            lt: manana,
          },
        },
        _sum: { total: true },
        _count: true,
      }),
      prisma.detalleVenta.groupBy({
        by: ['productoId'],
        _sum: { cantidad: true },
        orderBy: { _sum: { cantidad: 'desc' } },
        take: 5,
      }),
      prisma.producto.findMany({
        where: {
          stock: { lte: 5 },
          estado: EstadoProducto.activo,
        },
        orderBy: { stock: 'asc' },
        take: 5,
      }),
      prisma.citaReparacion.count({
        where: { estado: EstadoReparacion.pendiente },
      }),
      prisma.citaReparacion.count({
        where: { estado: EstadoReparacion.en_proceso },
      }),
      prisma.venta.findMany({
        where: { estado: EstadoVenta.completada },
        select: {
          fecha: true,
          total: true,
        },
      }),
      prisma.venta.aggregate({
        where: { estado: EstadoVenta.completada },
        _sum: { total: true },
      }),
      prisma.citaReparacion.groupBy({
        by: ['estado'],
        _count: true,
      }),
    ])

    const productosVendidosInfo = await Promise.all(
      productosMasVendidos.map(async (item) => {
        const producto = await prisma.producto.findUnique({
          where: { id: item.productoId },
          select: { nombre: true, imagen: true, precio: true },
        })
        return {
          productoId: item.productoId,
          nombre: producto?.nombre || 'Desconocido',
          imagen: producto?.imagen || '',
          precio: producto?.precio || 0,
          cantidadVendida: item._sum.cantidad || 0,
        }
      })
    )

    const ventasPorMesAgrupado = ventasPorMes.reduce((acc, venta) => {
      const mes = venta.fecha.toISOString().substring(0, 7)
      if (!acc[mes]) {
        acc[mes] = 0
      }
      acc[mes] += venta.total
      return acc
    }, {} as Record<string, number>)

    const graficaVentas = Object.entries(ventasPorMesAgrupado).map(([mes, total]) => ({
      mes,
      total,
    }))

    const graficaReparaciones = reparacionesPorEstado.reduce((acc, item) => {
      acc[item.estado] = item._count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      totalVentas: totalVentas._sum.total || 0,
      cantidadVentas: totalVentas._count,
      ventasHoy: ventasHoy._sum.total || 0,
      cantidadVentasHoy: ventasHoy._count,
      productosMasVendidos: productosVendidosInfo,
      productosBajoStock,
      citasPendientes,
      reparacionesEnProceso,
      ingresosMensuales: ingresosMensuales._sum.total || 0,
      graficaVentas,
      graficaReparaciones,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
