# Configuración y eliminación de valores fijos operativos

Base: rama `amplia-instrumentos-secundaria`, commit `891ccca847fa6f0b9ee1d03a7bcd89fd37c63254`.

## Año escolar

Cursos y Auth comparten `resolveSchoolYearDates`. El respaldo es 1 de agosto–30 de junio y cambia de curso en la fecha de inicio, no en enero. Se puede ajustar con `SCHOOL_YEAR_START_MONTH_DAY` y `SCHOOL_YEAR_END_MONTH_DAY` (MM-DD). Las fechas explícitas del centro prevalecen; esta corrección no reescribe años ya guardados. Se rechazan fechas inexistentes y rangos invertidos. Los períodos académicos existentes y los catálogos curriculares no se modifican.

## Alertas

`DASHBOARD_ATTENDANCE_MINIMUM` (80), `DASHBOARD_GRADE_MINIMUM` (70), `DASHBOARD_OBSERVATION_MINIMUM` (2) y `DASHBOARD_ATTENTION_LOOKBACK_DAYS` (30) controlan avisos. No son reglas de promoción escolar. `DASHBOARD_ATTENTION_PAGE_SIZE` (500) es el tamaño de cada lote, no un máximo de estudiantes: el recorrido continúa hasta terminar. `DASHBOARD_ATTENTION_DISPLAY_LIMIT` (4) limita solamente las tarjetas después de evaluar todas las matrículas. Se conserva el alcance por centro y docente.

Configurar las variables en el entorno del backend/Worker; no llevan prefijo VITE_. Sin sobrescrituras se mantienen los valores previos de avisos. Los valores fuera de rango se rechazan. No se ha añadido una pantalla de administración de estos umbrales.

## Sesión en equipos compartidos

“Recordar sesión en este equipo” es opcional y está desmarcado por defecto. Sin consentimiento los tokens permanecen en `sessionStorage`; con consentimiento usan `localStorage`. El verificador PKCE, que no es una sesión, usa almacenamiento local temporal con vencimiento de una hora para permitir que los enlaces de correo se abran en otra pestaña; se elimina al consumirlo, al vencer o al cerrar sesión. El servidor recibe la misma preferencia en sesión normal, login alternativo y onboarding. La cookie conserva HttpOnly, SameSite y la protección Secure existente. OAuth y los enlaces de verificación mantienen la elección durante el flujo. Cerrar sesión borra los tokens y la preferencia. Las sesiones antiguas persistidas sin una elección explícita dejan de restaurarse: puede ser necesario iniciar sesión una vez más.

## Administrador inicial

`pnpm db:seed` no crea usuarios ni centros por defecto. Para una instalación LOCAL se requiere `SEED_BOOTSTRAP_ADMIN=true`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (12 caracteres como mínimo), `SEED_ADMIN_NAME`, `SEED_SCHOOL_NAME`, `SEED_SCHOOL_SLUG` y las credenciales locales de Supabase. Tanto Supabase como PostgreSQL deben apuntar a loopback. Se rechaza producción incluso si los hosts son locales. No ejecutar contra túneles que reenvíen a producción.

Una identidad existente solo se acepta como repetición si ya es el administrador activo del mismo centro y corresponde al mismo usuario Auth. Nunca se promueve una cuenta existente ni se reasigna de centro. No se restablecen contraseñas. Para producción utilizar el flujo de registro/onboarding, no este seed de prueba.

## CSV

Los cuatro importadores aceptan `--csv <ruta>`. También admiten `SCHOOLS_CSV_PATH`; el importador `seed:school-defaults` usa `SCHOOL_DEFAULTS_CSV_PATH` por su formato de entrada específico. No dependen de `/tmp` ni de un archivo con un año fijo. Las rutas relativas se resuelven desde el directorio de ejecución. El archivo conserva el formato requerido por cada importador.

```bash
pnpm --filter @aula/database seed:schools --csv /ruta/centros.csv
pnpm --filter @aula/database seed:school-defaults --csv /ruta/configuracion-centros.csv
```

## Contratación y API

No hay integración de pagos activa. Las pantallas simuladas de contratación, estado de pago y suscripción están bloqueadas en producción y redirigen a información de planes. Solo `VITE_BILLING_PREVIEW_ENABLED=true` junto con el modo de desarrollo permite verlas. Los botones públicos llevan a registro o contacto cuando la simulación no está habilitada. No se presentan estados de la URL como pagos reales.

La API permanece en `/api/v1` del mismo origen, por diseño. Se retiró `VITE_API_URL` de la configuración de ejemplo: el cliente no la consumía. `VITE_API_PROXY_TARGET` configura exclusivamente el proxy local de Vite.

## Validación

Las pruebas añadidas cubren enero, el cambio de curso, fechas explícitas e inválidas, el estudiante 501, la selección de alertas entre lotes, los límites y permisos, la persistencia consentida y las rutas de simulación. No se introdujeron migraciones ni cambios en registros de Supabase. Los valores declarativos de infraestructura en Wrangler y los catálogos pedagógicos se conservan deliberadamente.
