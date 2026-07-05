# Frontend — React SPA

## Estructura

```
apps/frontend/src/
├── main.tsx                     # Punto de entrada (BrowserRouter + AuthProvider + ErrorBoundary)
├── App.tsx                      # Definición de rutas (públicas + protegidas con layout)
├── index.css                    # Tailwind CSS v4 + tema personalizado
│
├── components/
│   ├── ui/                      # 18 componentes reutilizables (Button, Modal, Table, etc.)
│   ├── common/                  # AppBrand
│   └── navigation/              # Header (barra superior), Sidebar (panel lateral)
│
├── layouts/
│   └── AppLayout.tsx            # Layout principal: Sidebar + Header + <Outlet />
│
├── routes/
│   └── appRoutes.ts             # Definiciones de rutas con iconos, etiquetas y RBAC
│
├── modules/                     # Módulos funcionales (cada uno autocontenido)
│   ├── auth/                    # Login, Register, AuthProvider, RequireAuth
│   ├── dashboard/               # Panel principal
│   ├── students/                # Gestión de estudiantes
│   ├── subjects/                # Asignaturas
│   ├── attendance/              # Asistencia
│   ├── grading/         # Calificaciones
│   ├── schedule/                # Horario
│   ├── planning/                # Planificación
│   ├── courses/         # Cursos y secciones
│   ├── competency-matrix/                  # Matriz de competencias
│   ├── reports/                 # Reportes
│   ├── school-administration/                # Configuración
│   └── profile/                 # Perfil
│
├── hooks/                       # Hooks globales
│   ├── useActiveModule.ts       # Módulo activo según la ruta actual
│   ├── useDebouncedSearch.ts    # Búsqueda con debounce
│   └── useFocusTrap.ts          # Trampa de foco para modales
│
├── services/
│   ├── apiClient.ts             # Cliente HTTP con fetch nativo + manejo de JWT
│   └── schoolYearService.ts     # Servicio de año escolar
│
├── utils/
│   ├── cn.ts                    # Unión de clases CSS
│   ├── cedula.ts                # Validación y formato de cédula dominicana
│   └── helpers.ts               # Utilidades varias
│
├── types/
│   ├── domain.ts                # Interfaces de dominio (Student, Teacher, Enrollment, etc.)
│   └── database.types.ts        # Tipos generados de la base de datos (Supabase)
│
└── constants/
    └── index.ts                 # Constantes del sistema (umbrales, defaults)
```

## Patrón por módulo

Cada módulo frontend sigue la misma estructura:

```
modules/<nombre>/
├── types/          # Interfaces TypeScript específicas del módulo
├── services/       # Funciones que llaman a la API
├── hooks/          # Lógica de estado y efectos
├── components/     # Componentes visuales
└── pages/          # Páginas (componentes de ruta)
```

### Flujo de datos

```
Page → Hook → Service → apiClient → Backend API
```

## Estilo

- **Framework:** Tailwind CSS v4
- **Tema:** Paleta cálida y terrosa: fondos crema (#faf6f0), azul oscuro primario (#1a1f3a), coral (#ff8b6b)
- **Soporte:** Light/dark mode via clase `.dark`
- **Íconos:** Lucide React
