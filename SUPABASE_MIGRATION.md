# Migración a Supabase - Instrucciones

## Cuando obtengas las credenciales de Supabase:

### 1. Resetear contraseña de BD (recomendado)
En: https://supabase.com/dashboard/project/odsepwlhvstyyhlmbpus/settings/database
- Click "Reset database password"
- Usar contraseña SIN caracteres especiales: `BikeShop2026`

### 2. Obtener Connection String
En el dashboard principal: https://supabase.com/dashboard/project/odsepwlhvstyyhlmbpus
- Click en botón "Connect" (arriba a la derecha)
- Seleccionar "Prisma" como ORM
- Copiar la URI que aparece

### 3. Obtener API Keys
En: https://supabase.com/dashboard/project/odsepwlhvstyyhlmbpus/settings/api
- Copiar "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
- Copiar "anon" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copiar "service_role" key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Actualizar `.env`
```
DATABASE_URL="[LA-URI-DE-CONEXION-DEL-PASO-2]"
NEXT_PUBLIC_SUPABASE_URL="https://odsepwlhvstyyhlmbpus.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[TU-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[TU-SERVICE-ROLE-KEY]"
JWT_SECRET="bike-shop-super-secret-2026"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

### 5. Cambiar Prisma a PostgreSQL
En `prisma/schema.prisma`, línea 5-7:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 6. Ejecutar migración
```bash
npx prisma migrate dev --name init_supabase
npm run db:seed
```

### 7. Crear bucket en Supabase
- Ir a Storage en el dashboard
- Crear bucket: `product-images`
- Marcar como "Public bucket"

### 8. Probar
```bash
npm run dev
```

## Diferencias entre SQLite y Supabase:
- **SQLite**: Funciona AHORA, datos se guardan en `dev.db` local
- **Supabase**: Base de datos en la nube, accesible desde cualquier dispositivo, incluye Storage para imágenes

## Estado actual del proyecto:
✅ Sistema 100% funcional con SQLite
⏳️ Pendiente: Migración a Supabase (cuando tengas credenciales)
