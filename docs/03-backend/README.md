# Backend — API NestJS

## Estructura

```
apps/backend/src/
├── main.ts                       # Punto de entrada (bootstrap NestJS)
├── app.module.ts                 # Módulo raíz (importa todos los módulos)
├── config/
│   └── jwt-secret.ts             # Carga del secreto JWT
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts   # @CurrentUser() — extrae usuario autenticado
│   │   └── roles.decorator.ts          # @Roles() — metadata de roles para RBAC
│   ├── filters/
│   │   └── all-exceptions.filter.ts    # Filtro global de excepciones
│   ├── guards/
│   │   └── roles.guard.ts              # Guard de roles (RBAC)
│   └── interceptors/
│       └── response.interceptor.ts     # Envuelve respuestas en { success, data }
└── modules/
    ├── auth/                     # Autenticación (register, login, JWT)
    ├── users/                    # Gestión de usuarios
    ├── students/                 # CRUD de estudiantes y matrículas
    ├── subjects/                 # Listado de asignaturas
    ├── attendance/               # Asistencia diaria y por clase
    ├── academic-grades/          # Calificaciones y recuperación pedagógica
    ├── schedule/                 # Horario escolar
    ├── planning/                 # Planificación didáctica
    ├── grades-sections/          # Gestión de grados, secciones y asignaturas
    ├── dashboard/                # Panel principal con estadísticas y tareas
    ├── reports/                  # Generación de reportes
    ├── settings/                 # Configuración de la escuela y años escolares
    └── profile/                  # Perfil personal del usuario
```

## Convenciones

- **Prefijo global:** `/api/v1`
- **Formato respuesta exitosa:** `{ success: true, data: <resultado> }`
- **Formato error:** `{ success: false, error: "<mensaje>", statusCode: <código> }`
- **Autenticación:** JWT via `Authorization: Bearer <token>`
- **Multi-tenant:** Toda operación recibe `schoolId` del token JWT
- **Validación:** class-validator con whitelist y transform automáticos

## Guards y decoradores

| Nombre | Tipo | Propósito |
|--------|------|-----------|
| `JwtAuthGuard` | Guard | Verifica token JWT válido |
| `RolesGuard` | Guard | Verifica roles del usuario |
| `@Roles('admin', 'director')` | Decorador | Define roles permitidos en un endpoint |
| `@CurrentUser()` | Decorador | Inyecta `AuthenticatedUser` en el handler |
