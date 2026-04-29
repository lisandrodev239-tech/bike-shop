import { z } from 'zod'

export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  precio: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  stockMinimo: z.number().int().min(1, 'El stock mínimo debe ser positivo').default(5),
  categoria: z.enum(['bicicletas', 'accesorios', 'partes', 'herramientas']),
  marca: z.string().optional(),
  imagen: z.string().optional(),
  estado: z.enum(['activo', 'inactivo']).default('activo'),
})

export const citaSchema = z.object({
  tipoBicicleta: z.string().min(1, 'El tipo de bicicleta es requerido'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  fecha: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'La fecha debe ser futura',
  }),
  hora: z.string().min(1, 'La hora es requerida'),
  costoEstimado: z.number().optional(),
})

export const updateCitaSchema = z.object({
  estado: z.enum(['pendiente', 'en_proceso', 'terminado', 'entregado']),
  costoEstimado: z.number().optional(),
})

export const ventaSchema = z.object({
  clienteId: z.number().int().positive(),
  total: z.number().positive(),
  estado: z.enum(['pendiente', 'completada', 'cancelada']).default('pendiente'),
})

export const proveedorSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProductoInput = z.infer<typeof productoSchema>
export type CitaInput = z.infer<typeof citaSchema>
export type ProveedorInput = z.infer<typeof proveedorSchema>
