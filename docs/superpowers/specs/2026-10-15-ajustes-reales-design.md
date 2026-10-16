# Ajustes reales conservando el diseño de Polymet

Estado: propuesta para revisión del usuario. No implementada.

## Resultado solicitado

Conservar las cinco pantallas aprobadas y el fondo de AulaBase. Sustituir todos los datos personales, movimientos y resultados simulados por datos del usuario autenticado. Desarrollar también las funciones nuevas de la referencia; eliminarlas por falta de backend no satisface el alcance solicitado.

El usuario aprobó este alcance: «Desarrollar también las funciones nuevas de Polymet, además de conectar los servicios existentes».

## Enfoque propuesto

Integrar por funciones completas, usando el backend NestJS/Prisma y Supabase Auth existentes. Cada entrega conserva las tarjetas del diseño y resuelve lectura, escritura, permisos, errores y pruebas. Las funciones pendientes muestran su estado real durante el desarrollo; nunca muestran éxitos simulados.

Se consideraron dos alternativas: reemplazar las pantallas por los formularios antiguos, que perdería el diseño aprobado, y crear un backend paralelo para el prototipo, que duplicaría usuarios y pagos. Se recomienda extender los servicios actuales.

## Lo que ya existe y lo que falta

| Área | Servicio existente | Trabajo necesario |
| --- | --- | --- |
| Perfil | GET/PATCH `/profile`, identidad y roles autenticados | Campos adicionales, avatar, preferencias y métricas verificables |
| Seguridad | Supabase Auth, cambio/restablecimiento de contraseña, desafío TOTP y dispositivos de confianza | Alta/baja TOTP, sesiones revocables y eventos reales de acceso |
| Pagos | Resumen, checkout, portal, transferencias, cancelación y documentos | Integrar directamente en el diseño; ampliar operaciones del proveedor y saldo |
| Notificaciones | Avisos comerciales y notificaciones de tutores específicas | Preferencias personales, bandeja, eventos, distribución y suscripciones de canal |
| Privacidad | Permisos por escuela y usuario | Visibilidad aplicada en consultas, exportación y eliminación de cuenta |
| Comunidad y actividad | Cursos, matrícula, planificación y evaluación | Directorio, mensajes, rankings y progreso con reglas propias |
| Certificados | Reportes académicos | Emisión, verificación y revocación de certificados |

Los cursos de AulaBase son asignaciones académicas por escuela y año escolar. No se deben presentar como cursos comerciales comprados ni atribuirles horas de estudio que no se registran.

## Entrega 1: perfil y preferencias personales

Extender el módulo `profile`, manteniendo compatibles sus campos actuales. Añadir una relación única de ajustes por usuario con nombre público, biografía, fecha de nacimiento opcional, país, ciudad, nivel educativo, idioma, zona horaria e intereses. Nombre completo sigue siendo la identidad principal; no se divide automáticamente por espacios. Correo, roles, escuela, matrícula y fechas de alta provienen de sus fuentes actuales y no son editables como texto libre.

La carga inicial obtiene el perfil y sus ajustes. Guardar valida en el servidor, persiste en una transacción y devuelve la versión guardada. Descartar restaura la última respuesta confirmada. Si falla una petición se conserva el borrador. Cambiar de pantalla o recargar mantiene los datos guardados. El estado vacío usa campos vacíos y una invitación a completarlos.

Avatar: carga de imagen con tamaño y formato permitidos, nombre generado en servidor, propiedad vinculada al usuario y eliminación del archivo sustituido después de guardar correctamente. Reutilizar el almacenamiento configurado para el proyecto, con permisos y rutas propios para avatares.

Idioma y zona horaria se aplican al formato de fechas y números de las pantallas migradas. El selector de idioma solo ofrece traducciones disponibles; guardar un código no equivale a traducir la aplicación. El catálogo se amplía junto con traducciones reales.

Las tarjetas estadísticas usan consultas del usuario y su rol. Cursos asignados para docentes y matrículas para estudiantes; certificados emitidos y horas registradas se incorporan con los subsistemas correspondientes. No sustituir datos desconocidos por cantidades inventadas.

## Entrega 2: seguridad

Cambiar contraseña mediante Supabase Auth con verificación reciente, validación y resultado real. El restablecimiento por correo reutiliza el flujo existente. Alta TOTP: crear factor, mostrar QR/secreto únicamente durante el alta, verificar código y confirmar el factor con Supabase. Desactivar exige verificación reciente. El backend aplica la garantía de autenticación correspondiente; un interruptor local no activa MFA.

Los dispositivos de confianza existentes se muestran como tales. Añadir registro de sesión revocable para los accesos de AulaBase y comprobar su vigencia en la estrategia JWT, incluyendo revocación de otras sesiones y compatibilidad controlada con tokens anteriores. Revocar confianza y cerrar una sesión son operaciones distintas. Cerrar todas las sesiones requiere nueva autenticación y limpia cookies y sesión Supabase.

Registrar eventos de acceso y cambios sensibles desde el servidor. Mostrar navegador, sistema y fecha observados. La ubicación se omite cuando no existe una fuente verificada. La tarjeta de seguridad deriva su estado de verificaciones reales y explica qué está pendiente.

## Entrega 3: pagos en el diseño aprobado

Consumir `BillingOverview` y las operaciones de `billingService` desde las tarjetas recuperadas. El precio, moneda, período, acceso, documentos y suscripción provienen del servidor. Mostrar únicamente precios habilitados; los planes Básico/Pro/Premium y el descuento anual de la muestra no son ofertas de AulaBase.

Checkout conserva aceptación explícita de condiciones y renovación. Gestionar métodos de pago utiliza el portal del proveedor; nunca almacenar números de tarjeta ni inventar sus últimos dígitos. Cancelar, reactivar, pausar y cambiar de plan deben comprobar la capacidad del proveedor y reflejar su estado confirmado. La pausa tendrá fechas explícitas y acceso coherente con el período pagado. Los recibos existentes se identifican como documentos comerciales, sin atribuirles una naturaleza fiscal no implementada.

Saldo nuevo propuesto: crédito de cuenta, no transferible entre usuarios, con moneda explícita y libro de movimientos inmutable. Recargas acreditadas solo tras confirmación del proveedor o revisión de transferencia; débitos y reversiones transaccionales e idempotentes. El saldo se usa exclusivamente en cobros gestionados por AulaBase. No prometer que descontará una renovación externa si esa integración aún no está implementada. Los reembolsos solo aparecen tras un evento real del proveedor o una operación administrativa auditada.

Configurar ofertas nuevas o habilitar producción es independiente de desarrollar y probar el flujo; las pruebas monetarias se realizan en sandbox.

## Entrega 4: notificaciones

Crear preferencias por categoría/canal, bandeja personal y registros de entrega. Conectar productores reales: eventos de cuenta y pagos, publicación de calificaciones y eventos académicos disponibles. Las categorías de foros y mensajes se conectan al crear esos subsistemas; no generan avisos ficticios.

Procesamiento persistente con clave de deduplicación, reintentos limitados y estado por entrega. El mismo proceso debe poder ejecutarse en NestJS y en el despliegue Cloudflare mediante invocación programada, sin depender de temporizadores en memoria. Horas de silencio y resúmenes se calculan con la zona horaria del usuario. Los avisos transaccionales obligatorios se distinguen de comunicaciones opcionales.

Correo usa un transporte configurado; web push exige permiso del navegador y suscripción real; SMS exige teléfono verificado y proveedor configurado. La interfaz informa las capacidades disponibles. El botón de prueba crea un envío rastreable y diferencia aceptación, entrega y error. No afirma que se envió un SMS por haber guardado una preferencia.

## Entrega 5: privacidad y datos

Persistir visibilidad y permisos y aplicarlos en cada consulta que comparte información. La visibilidad pública se refiere al perfil permitido por el usuario; no publica matrícula, notas, teléfono, nacimiento ni datos de terceros. Directorio y progreso respetan escuela, curso, rol y consentimiento. Los valores iniciales son restrictivos y no se interpretan como consentimiento previo.

Exportación autenticada de los datos propios, con archivo descargable y fecha real de generación. Excluir secretos, sesiones y datos ajenos aunque el usuario sea docente o administrador. Usar descarga directa cuando permita evitar un proceso innecesario; para volúmenes grandes, trabajo persistente y enlace privado con caducidad. La extensión y el texto deben describir el archivo realmente generado.

Eliminación: presentar impacto real, verificar identidad reciente y pedir confirmación explícita. Comprobar suscripción, saldo y responsabilidades institucionales antes de ejecutar. La operación debe ser reintentable y registrar su estado; no borrar registros escolares compartidos ni evidencias comerciales que deban conservarse. Resolver o informar los bloqueos antes de declarar la cuenta eliminada y revocar el acceso al finalizar.

Las opciones de analítica, personalización e investigación controlan los productores correspondientes. Retirar afirmaciones genéricas de cumplimiento legal copiadas de la plantilla que no describen una implementación comprobada.

## Entrega 6: funciones académicas y comunidad nuevas

Propuesta adaptada al dominio de AulaBase, pendiente de aprobación junto con este documento:

- Certificados de finalización emitidos por personal autorizado de la escuela, con beneficiario, curso/año, fecha, emisor, código verificable y revocación. No se emiten por contador ni se anuncian como certificaciones oficiales sin ese respaldo.
- Progreso basado en actividades y criterios de finalización explícitos. El tiempo de actividad solo se acumula cuando exista un registro verificable; no se infiere del tiempo que una pestaña permanece abierta.
- Rankings voluntarios dentro de un curso, basados en actividades completadas y con criterio visible. Participación desactivada por defecto; exclusión efectiva al retirar consentimiento. Sin clasificación pública de notas.
- Directorio limitado a la comunidad autorizada y mensajes con permisos por rol, bloqueo y notificaciones. Foros vinculados a un curso con autoría y moderación. Estado en línea derivado de presencia reciente y ocultable.

Estas funciones requieren sus propios contratos y especificaciones antes de implementar cada entrega; no convierten automáticamente AulaBase en un catálogo comercial de cursos.

## Persistencia, permisos y despliegue

Crear migraciones nuevas con `supabase migration new`, alineadas con Prisma y `database.types.ts`. Toda tabla de aplicación incorpora privilegios de `app_backend` y política RLS explícita. Los ajustes y movimientos se consultan por el usuario autenticado; los datos escolares incorporan además el límite de escuela y rol. El cliente no elige el propietario ni modifica roles, saldos o estados comerciales.

Reutilizar la autenticación y los componentes existentes. No añadir dependencias salvo necesidad demostrada. Mantener el diseño y fondo aprobados y los tokens semánticos de AulaBase. Los formularios distinguen carga, vacío, error, guardado pendiente y guardado confirmado; protegen el borrador ante errores y solicitudes repetidas.

## Verificación y aceptación

- Perfil: guardar y recargar; otro usuario no puede leer ni modificar sus ajustes; errores mantienen el borrador.
- Seguridad: factores reales, verificación requerida y tokens de sesiones revocadas rechazados por el backend.
- Pagos: precios del servidor, operaciones idempotentes, saldo sin doble acreditación y estados confirmados por el proveedor.
- Notificaciones: preferencias aplicadas en el envío, zona horaria correcta, ausencia de duplicados y errores de transporte visibles.
- Privacidad: consultas respetan opciones; exportación sin información de terceros; eliminación sin éxito aparente cuando hay bloqueos.
- Interfaz: comprobar las cinco pantallas en escritorio y móvil sin alterar la distribución aprobada ni el fondo.
- Ejecutar las pruebas específicas y los cuatro controles del proyecto: `pnpm --filter backend test`, `pnpm --filter backend build`, `pnpm --filter frontend build` y `pnpm cloudflare:build`.

La eliminación de la etiqueta de demostración se realiza cuando las pantallas dejen de consumir datos de ejemplo. Los catálogos válidos y textos de interfaz no se confunden con datos personales simulados.

## Orden y límites de esta propuesta

Orden recomendado: perfil → seguridad → pagos → notificaciones → privacidad → comunidad/certificados. Cada entrega queda operativa y revisable antes de comenzar la siguiente. El alcance global incluye las seis; esta propuesta no autoriza descartar las últimas.

El siguiente paso, tras revisar este documento, es el plan ejecutable de la primera entrega, con archivos, migración y pruebas concretas. Las decisiones propuestas sobre saldo, certificados y rankings deben validarse antes de implementar sus entregas.
