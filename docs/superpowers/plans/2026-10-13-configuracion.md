# Configuración general de AulaBase

> Para la implementación: usar subagent-driven-development con tareas independientes y revisión final.

**Objetivo:** reunir la configuración real del centro, calendario, usuarios, cuenta, interfaz y módulos con el diseño compartido de AulaBase.

**Arquitectura:** ampliar la página existente `/configuracion` con navegación por categorías. Reutilizar las API actuales y sus permisos; las preferencias de interfaz se guardan en este navegador. `/perfil` conserva el acceso personal para todos los roles.

**Stack:** React, TypeScript, Tailwind, componentes semánticos existentes y pnpm.

**Referencia:** `apps/frontend/DESIGN_SYSTEM.md` y petición del usuario: configuración «de todo».

## Restricciones

- Paleta semántica, superficies blancas, controles redondos y margen exterior del layout.
- Sin dependencias ni migraciones nuevas; cada control debe guardar o ejecutar una función real.
- Preservar los permisos de las API y de las rutas actuales.
- Mantener los valores existentes, incluidos códigos de oferta no conocidos y jornadas múltiples.
- El coordinador integra, verifica y hace los commits; los implementadores trabajan en archivos separados.

## Tareas

- [x] Centro y panel principal: identidad, logo, jornada, modalidad, oferta y estado de documentos oficiales; categorías y accesos a módulos.
- [x] Calendario: creación, edición y activación de años, con validación de fechas y errores; creación, edición y borrado confirmado de períodos.
- [x] Preferencias: menú lateral y reducción de movimiento persistentes y sincronizadas con el layout; acceso desde perfil y configuración.
- [x] Usuarios: consultar y editar nombre/avatar mediante las API existentes; correo, estado y roles son informativos; estados de carga/error/vacío.
- [x] Integración de accesos a ajustes ya existentes en Inicio y Evaluación.
- [x] Revisión, pruebas completas, builds obligatorios, comprobación visual en escritorio/móvil y commit.

## Foco de revisión

- Datos que llegan después del primer render y recargas que no deben borrar ediciones sin aviso.
- Fechas ISO, rangos invertidos y año activo distinto del seleccionado.
- Errores de red y doble envío de formularios.
- Preferencias entre pestañas y restricción de movimiento del sistema operativo.
- Hashes antiguos de configuración, navegación de teclado y ancho móvil de 375 px.

## Registro

- Los siete cambios previos quedaron en `1f68adb` antes de empezar esta característica.
- La configuración usa los contratos REST actuales; no se crean controles para opciones sin soporte operativo.
- Se corrigió el guardado personal mediante PATCH /profile y CurrentUser.id: la ruta administrativa /users/:id no admite teléfono ni acceso de docentes.
- La revisión final corrigió la secuencia sugerida de períodos: usa el máximo más uno y considera los cambios guardados antes de que termine la recarga.
- Revisión visual en escritorio y 375 px: campos redondos, navegación legible y sin desbordamiento horizontal. El acceso de Inicio abre su editor de widgets.
- ESLint de los archivos frontend modificados: cero errores; tres avisos de hooks ya existentes.
- `pnpm cloudflare:build` ejecutado: bloqueado por EPERM al regenerar la DLL de Prisma, que está en uso por el backend local. No se detiene el servidor ni se despliega.
- Verificación final: `pnpm --filter backend test` (234 pruebas), `pnpm --filter backend build`, `pnpm --filter frontend test --maxWorkers=2 --testTimeout=30000` (393 pruebas) y `pnpm --filter frontend build` terminan correctamente; diff sin errores de espacios.
