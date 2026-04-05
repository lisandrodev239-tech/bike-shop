# BikeShop - Sistema de Venta y Reparación de Bicicletas

Aplicación web full-stack profesional para la gestión de una tienda de bicicletas con funcionalidades de venta online y sistema de reparaciones.

## 🚀 Características

### Cliente
- ✅ Registro e inicio de sesión
- ✅ Catálogo de productos con filtros y búsqueda
- ✅ Carrito de compras
- ✅ Proceso de compra con Mercado Pago
- ✅ Agenda de reparaciones
- ✅ Historial de compras y reparaciones
- ✅ Perfil de usuario

### Administrador
- ✅ Dashboard con estadísticas y gráficos
- ✅ Gestión de inventario (CRUD productos)
- ✅ Gestión de ventas
- ✅ Gestión de reparaciones
- ✅ Gestión de proveedores
- ✅ Notificaciones de stock bajo

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + React 19
- **Backend**: Node.js + Next.js API Routes
- **Base de datos**: SQLite
- **ORM**: Prisma
- **UI**: Tailwind CSS
- **Autenticación**: JWT + Cookies HttpOnly
- **Pagos**: Mercado Pago
- **Gráficos**: Recharts
- **Validación**: Zod

## 🔒 Seguridad

- Rate limiting configurado
- Protección contra SQL Injection (vía Prisma)
- Protección contra XSS
- Validación de inputs con Zod
- Headers de seguridad (X-Frame-Options, X-XSS-Protection, etc.)
- Contraseñas hasheadas con bcrypt

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   cd bike-shop
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Editá el archivo `.env` con tus credenciales:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="tu-secret-key-muy-larga-y-segura"
   MERCADO_PAGO_ACCESS_TOKEN="tu-token-de-mercado-pago"
   MERCADO_PAGO_PUBLIC_KEY="tu-public-key"
   NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY="tu-public-key"
   NODE_ENV="development"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Inicializar la base de datos**
   ```bash
   npm run db:push
   ```

5. **Poblar con datos de prueba**
   ```bash
   npm run db:seed
   ```

6. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```

7. **Abrir en el navegador**
   
   Visitá [http://localhost:3000](http://localhost:3000)

## 👤 Credenciales de Prueba

### Administrador
- **Email**: admin@bikeshop.com
- **Contraseña**: admin123

### Usuario
- **Email**: usuario@test.com
- **Contraseña**: user123

## 📁 Estructura del Proyecto

```
bike-shop/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Rutas de autenticación
│   │   │   ├── productos/   # CRUD de productos
│   │   │   ├── ventas/      # Gestión de ventas
│   │   │   ├── citareparacion/  # Citas de reparación
│   │   │   ├── proveedores/    # Proveedores
│   │   │   ├── dashboard/      # Dashboard admin
│   │   │   └── mercadopago/    # Integración pagos
│   │   ├── admin/           # Páginas admin
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   ├── productos/      # Catálogo de productos
│   │   ├── carrito/         # Carrito de compras
│   │   ├── perfil/         # Perfil de usuario
│   │   ├── reparaciones/    # Agendar reparaciones
│   │   └── page.tsx         # Página principal
│   ├── components/          # Componentes React
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilidades
│   │   ├── prisma.ts       # Cliente Prisma
│   │   ├── auth.ts         # Utilidades de auth
│   │   └── validations.ts  # Esquemas Zod
│   └── middleware.ts       # Middleware de seguridad
├── prisma/
│   ├── schema.prisma       # Schema de base de datos
│   └── seed.ts             # Script de seed
├── public/                 # Archivos estáticos
└── package.json
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Build
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción

# Base de datos
npm run db:push      # Sincronizar schema con DB
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Poblar con datos de prueba
npm run db:reset     # Resetear DB y repoblar
npm run setup        # Setup completo (push + seed)

# Linting
npm run lint         # Verificar código
```

## 💳 Integración con Mercado Pago

Para que los pagos funcionen correctamente:

1. Creá una cuenta en [Mercado Pago Developers](https://developers.mercadopago.com/)
2. Obtené tus credenciales de prueba o producción
3. Configurá las variables de entorno
4. En entorno de desarrollo, usá las credenciales de TEST
5. Configurá la URL de webhook en tu panel de Mercado Pago

## 📱 Responsive Design

La aplicación está optimizada para:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔮 Mejoras Futuras

- [ ] Implementar imágenes con upload real
- [ ] Agregar email de confirmación de pedido
- [ ] Sistema de reseñas y calificaciones
- [ ] Integración con más métodos de pago
- [ ] Panel de admin más completo
- [ ] App móvil (React Native)
- [ ] Chat de soporte en vivo
- [ ] Programa de fidelización

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad de ciclistas.

---

¡Disfrutá tu BikeShop! 🚲
