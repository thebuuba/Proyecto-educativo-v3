# Aula Base: implementación de suscripciones y pagos en Codex

## Estado de este documento

Este archivo es el encargo de implementación acordado con el propietario. Su creación NO significa que se haya iniciado una tarea de Codex, implementado funcionalidad, ejecutado pruebas ni activado cobros. El commit inicial contiene solamente esta documentación. Codex debe leer el repositorio y ejecutar el plan, no limitarse a redactarlo de nuevo.

- Repositorio: `thebuuba/Proyecto-educativo-v3` (Aula Base / proyecto educativo 3).
- Rama de trabajo ya creada: `feat/suscripciones-pagos-20261015`.
- Base: `main`, comprobada el 15 de octubre de 2026 en `dfdee49835e35071c811f14216ea71b6c9bbf636`.
- Commit base: `Fusiona todas las ramas en main (#57)`.
- No trabajar en Inversiones Willians Marte ni reutilizar sus credenciales, base de datos o configuración.
- Ejecución solicitada por el usuario: Codex, en su experiencia de trabajo de ChatGPT.

## Instrucción de ejecución

Continúa en esta rama, después de leer `AGENTS.md` y las instrucciones aplicables a cada carpeta. Obtén el estado remoto antes de trabajar y comprueba la ascendencia respecto de la base indicada. No sobrescribas trabajo concurrente, no hagas force push y no crees otra rama que sustituya esta sin necesidad. Si `main` avanzó, examina sus cambios y coordina una integración no destructiva; no reinicies esta rama ni pierdas commits.

Implementa el plan por entregas revisables. Empieza con modelo comercial, reglas centrales de acceso, permisos y cortesías; continúa con transferencias, pasarela, interfaz, soporte y pruebas. Utiliza commits pequeños en español. El propietario pidió una nueva rama para esta implementación completa: conserva esa rama y no mezcles refactorizaciones generales o cambios visuales ajenos. Si una fase depende de credenciales o decisiones comerciales pendientes, completa y prueba las partes independientes y documenta el bloqueo concreto. No inventes resultados, integraciones aprobadas o envíos de mensajes.

Al terminar una entrega, registra archivos cambiados, migraciones nuevas, comandos ejecutados, resultados, limitaciones y pasos pendientes. Puedes abrir un PR en borrador con evidencia y lista de verificación; no fusionarlo ni declarar listo para producción sin superar las condiciones de lanzamiento.

## Alcance comercial acordado

| Elemento | Alcance de la primera versión |
| --- | --- |
| Plan | Docente Completo, todas las funciones docentes existentes que correspondan al rol. |
| Titular | Un docente individual, vinculado a `AppUser.id`; no al centro completo ni solo al correo. |
| Periodicidad | Mensual; preparar el modelo para futuros planes, pero no publicar anualidades o planes de centros todavía. |
| Pago automático | Una sola pasarela inicial. Paddle es candidata, pendiente de aprobación del negocio y cuenta receptora. |
| Alternativa local | Transferencia a una cuenta dominicana, con confirmación administrativa del ingreso bancario. |
| Prueba | Propuesta inicial de 14 días sin tarjeta, gestionada por Aula Base y configurable en el servidor. |
| Gracia | Propuesta inicial de 7 días para renovaciones fallidas de clientes que ya pagaban, no para una primera contratación fallida. |
| Cortesías | Temporales o sin vencimiento, concedidas por administración comercial, auditadas y separadas de ingresos. |
| Cancelación | Detener la renovación y conservar la cobertura ya contratada según el estado confirmado. |
| Precio y moneda | Pendientes; no inventar importes reales ni asumir que valores de demostración están aprobados. |
| Soporte | Canal operativo, casos identificables y acceso incluso cuando vence la suscripción. |

Las duraciones de prueba y gracia son propuestas configurables, no condiciones públicas aprobadas. La cuenta Pana NO se considera verificada para liquidaciones. No asumir elegibilidad de Stripe, Paddle, AZUL, DOP, cuentas bancarias ni requisitos fiscales: verificar documentación oficial actual antes de cerrar cada integración. No implementar tres pasarelas simultáneamente.

## Límites de seguridad y lanzamiento

- No modificar `main`, fusionar PRs, desplegar a producción, activar cobros reales, ejecutar pagos o contratar servicios de pago.
- No ejecutar migraciones ni consultas de escritura sobre Supabase compartido/producción. Preparar y probar migraciones en una base local o entorno de pruebas aislado, con datos sintéticos.
- No crear cuentas comerciales, aceptar términos legales, registrar tarjetas, aprobar proveedores o introducir cuentas bancarias en nombre del usuario.
- No publicar precios, moneda, impuestos, reembolsos o plazos de retención inventados. No asumir automáticamente el ITBIS de un archivo de ejemplo ni presentar un recibo del proveedor como comprobante fiscal dominicano.
- Nuevas contrataciones y aplicación del bloqueo comercial deben estar desactivadas por defecto mediante controles explícitos del servidor. Con el módulo desactivado, conservar el acceso previo legítimo y todas las restricciones de seguridad existentes.
- Separar flags para contratar, procesar eventos y aplicar acceso. Desactivar la contratación no debe interrumpir la recepción de eventos legítimos ni confundirse con cancelar renovaciones en el proveedor.
- Solo entornos sandbox para la integración de tarjeta. No utilizar secretos reales en pruebas ni copiar datos académicos a proveedores o agentes externos.
- `.env.example` solo con placeholders. Ningún secreto en frontend, variables `VITE_*`, commits, registros, capturas o mensajes.
- Un usuario suspendido por seguridad no recupera acceso por pagar o recibir cortesía.
- La falta de pago no borra automáticamente datos académicos ni altera roles escolares.

## Revisión inicial y normas del repositorio

No basar los cambios solamente en descripciones previas del chat. Inspeccionar la implementación real de autenticación, incorporación inicial, roles, acceso directo a Supabase, almacenamiento, servidor, Prisma, componentes comerciales, configuración, soporte y despliegue Cloudflare.

Seguir las reglas leídas en `AGENTS.md`:

- Usar pnpm; no añadir lockfiles de npm o yarn.
- No editar migraciones antiguas. Crear migraciones nuevas con la CLI de Supabase y verificar sus comandos/versión, sin inventar nombres de archivo manualmente.
- Mantener alineados `supabase/migrations/`, `packages/database/prisma/schema.prisma` y `apps/frontend/src/types/database.types.ts`.
- Cada nueva tabla de aplicación requiere permisos explícitos para `app_backend` y su política RLS adecuada; no conceder acceso general por conveniencia.
- Evitar dependencias nuevas cuando la biblioteca estándar o paquetes existentes resuelvan el problema.
- Antes de crear UI, leer `apps/frontend/DESIGN_SYSTEM.md`; reutilizar componentes y tokens semánticos existentes, sin rediseñar globalmente la aplicación.
- Respetar otras instrucciones aplicables y revisar siempre cambios generados por agentes auxiliares. La ejecución principal solicitada es Codex.

Antes de implementar APIs de Supabase y la pasarela, consultar documentación oficial y cambios incompatibles actuales. No cambiar versiones globales del proyecto como trabajo accesorio.

## Entrega 1: modelo comercial y configuración

Diseñar, adaptar al esquema real e implementar los siguientes conceptos (nombres definitivos según convenciones del repositorio):

1. Planes, precios versionados, moneda, periodicidad y funciones incluidas.
2. Cuenta comercial del docente y relación inequívoca con cliente externo.
3. Suscripción y estado original del proveedor, separados del acceso efectivo local.
4. Pagos, facturas/documentos comerciales y períodos de servicio cubiertos.
5. Solicitudes de transferencia y verificación del movimiento recibido.
6. Prueba gratuita única por cuenta y concesiones de cortesía.
7. Registro de eventos externos, procesamiento/reintentos y auditoría comercial.
8. Casos de soporte y bandeja persistente de comunicaciones cuando corresponda.

Usar importes enteros en unidades monetarias menores o el tipo decimal exacto correspondiente; nunca cálculos monetarios con coma flotante. Incorporar restricciones, índices, claves externas, unicidad e idempotencia en la base, no solo en JavaScript. Tiempos de cobertura con límites explícitos y reloj del servidor. Precios e identificadores de proveedor autorizados por servidor; el navegador no decide cuánto cobrar ni a quién acreditar.

No usar `schoolId` como sustituto de titular comercial. Comprobar la relación real entre `AppUser.id`, `authUserId` y `auth.uid()` antes de escribir políticas. No confiar en metadatos editables por el usuario para autorizar operaciones.

Aceptación: dos docentes del mismo centro tienen cobertura distinta, sin filtraciones de información ni elevación de permisos. Modelo preparado para más planes sin publicar opciones futuras.

## Entrega 2: registro, prueba y contratación

Reutilizar registro, verificación de correo e incorporación inicial existentes. Iniciar una prueba sin tarjeta desde una operación autenticada e idempotente. Validar elegibilidad y mantener una única fecha de finalización que no dependa del reloj del dispositivo. Cambiar correo, cerrar sesión, reintentar o abrir otra pestaña no reinicia la prueba.

Gestionar la prueba de esta primera versión en Aula Base. No asumir que una función de pruebas sin tarjeta de un proveedor está disponible para la cuenta. Mostrar días restantes, condiciones y siguiente acción. No cobrar al terminar sin autorización.

Antes de una contratación anticipada, aclarar que activar el plan de pago ahora termina la etapa gratuita e inicia un cobro/período pagado; conservar la alternativa de continuar la prueba. No reducir días silenciosamente ni crear una segunda suscripción. Registrar la aceptación de condiciones y autorización según los requisitos verificados del proveedor.

Cuentas existentes de desarrollo: transición explícita de pruebas/cortesías sin convertirlas en suscriptores pagados ni bloquearlas por sorpresa.

Aceptación: el vencimiento funciona en servidor, las condiciones son inequívocas y no existe acceso pagado concedido por parámetros de URL o localStorage.

## Entrega 3: acceso central y administración comercial

Construir una única evaluación de acceso efectivo: suspensión de seguridad, período pagado, prueba, gracia aplicable y cortesía. Mantener razones y fechas trazables. La gracia empieza una sola vez por renovación elegible; eventos repetidos no la reinician.

Proteger operaciones en servidor y revisar rutas alternativas: Data API de Supabase, RLS, vistas, RPC, Storage, exportaciones, descargas y tareas. No limitarse a ocultar botones. Evitar que un usuario modifique su cobertura, importe, propiedad o permiso comercial directamente.

Definir explícitamente operaciones permitidas al vencer: inicio de sesión, configuración, pagos, soporte, consulta/recuperación/exportación aprobada. No borrar datos por impago. Preservar aislamiento escolar y todos los permisos existentes.

Crear autorización comercial explícita, separada de administrador/director de centro. No otorgarla a todos los administradores escolares. Cortesías con plan, titular, inicio, fin opcional, motivo, creador y revocación auditada. No registrar cortesía como pago o factura cobrada.

Conceder cortesía a un cliente con cobros activos requiere advertencia y manejo explícito de renovación; retirar o vencer cortesía nunca crea un cobro no autorizado.

Aceptación: las llamadas directas y las distintas vías de datos respetan el mismo acceso. Un maestro no concede cortesías ni consulta facturas ajenas.

## Entrega 4: transferencias locales en RD

Solicitudes con referencia interna, importe/moneda confirmados por servidor, datos bancarios reales configurados administrativamente y condiciones de vigencia. Sin configuración válida, no ofrecer instrucciones bancarias ficticias como operativas.

El docente reporta referencia y comprobante; la solicitud queda pendiente. El comprobante es evidencia para revisar, no prueba suficiente para acreditar. Solo administración comercial confirma el ingreso recibido en el banco, registrando identificador del movimiento, importe, fecha, motivo y responsable.

Aprobar solicitud, registrar pago y conceder período debe ser atómico e idempotente, con bloqueos/restricciones para aprobaciones concurrentes. Un movimiento bancario no paga dos solicitudes aunque los usuarios o archivos sean distintos. Documentar los identificadores que permiten conciliación y revisión de duplicados.

Manejar rechazo, datos insuficientes, importes diferentes, pagos tardíos, referencia reutilizada y reversión con auditoría; no aprobar excepciones automáticamente. Un pago anticipado añade cobertura sin perder días. Definir regla de mes calendario, zona horaria y ancla para los días 29/30/31; no sumar siempre 30 días.

Comprobantes en almacenamiento privado, con tipos/tamaño permitidos y validación; no aceptar rutas o URLs arbitrarias como archivos de otro usuario. Acceso solo del titular y revisores comerciales autorizados, sin enlaces públicos permanentes.

La transferencia es manual y no autoriza débito mensual. No integrarse con banca en línea, leer correos bancarios, aprobar ingresos automáticamente o prometer conciliación automática sin un servicio bancario autorizado y verificado.

Aceptación: doble clic y dos administradores no duplican cobertura; ningún comprobante activa por sí solo el plan.

## Entrega 5: proveedor automático y eventos

Crear un adaptador del proveedor dentro del módulo de facturación. El resto de la aplicación consulta el estado interno, no SDKs distribuidos por módulos académicos. Implementar solamente el candidato inicial habilitado en sandbox; no construir tres integraciones. Cambiar de proveedor después no debe describirse como migración automática de suscripciones o tarjetas.

Implementar contratación, correspondencia segura de cliente/usuario, portal autenticado, actualización del método, historial y cancelaciones conforme a documentación oficial. No aceptar customer/subscription IDs arbitrarios desde el navegador ni URLs de retorno abiertas. Validar plan, precio, entorno y titular de cada operación en servidor.

Conceder cobertura únicamente ante eventos/consultas fiables con transacción y relación verificadas. El retorno del checkout puede mostrar 'verificando', nunca éxito ficticio. Diferenciar intento, pago confirmado y período; una factura de importe cero no equivale a dinero recibido.

Verificar firma sobre bytes originales, proteger secreto y aplicar tolerancia/replay conforme al proveedor. Probar cuerpo original en NestJS/Node y Cloudflare Workers. Persistir evento duraderamente antes de confirmar recepción; deduplicar por ID y procesar con reintentos recuperables. No depender de tareas en memoria después de responder ni asumir eventos ordenados.

Aplicar idempotencia a operaciones remotas y creación de checkout, además de restricciones locales frente a carreras. Gestionar eventos desconocidos sin privilegios ni efectos arbitrarios. Reconciliación periódica recupera estados perdidos consultando el proveedor; NO genera los cobros mensuales. Separar eventos y claves de sandbox/producción.

No desactivar CSP globalmente para checkout ni quitar protecciones generales. Revisar límites del endpoint sin bloquear notificaciones legítimas; probar firmas inválidas y fallos parciales.

Aceptación: cerrar el navegador no impide acreditar; repetir o reordenar eventos no duplica mensualidades ni restaura estados antiguos.

## Entrega 6: renovaciones, fallos, cambios y reembolsos

Dejar al proveedor la programación de cobros automáticos. Guardar y mostrar sus fechas confirmadas; no calcular tarjeta como 'ahora + 30 días'. Renovación fallida de cliente previamente pagado puede activar la gracia configurada, con fecha persistente. Primera compra incompleta no recibe gracia ni cobertura pagada.

Cancelar renovación conserva cobertura válida y muestra fecha real. Distinguir cancelación programada, cancelación definitiva, reactivación permitida y nueva contratación. Distinguir cancelar, solicitar reembolso y eliminar cuenta; ningún reembolso real se ejecuta durante desarrollo.

Cambiar tarjeta a transferencia requiere confirmar fin de renovación y resolver facturas, cargos en curso y reintentos antes de completar el cambio. Cambiar transferencia a tarjeta debe respetar cobertura y comunicar primer cargo según política aprobada. Evitar doble cobro cerca del vencimiento y transiciones a medias, incluyendo fallos de red.

Un ingreso bancario externo no se marca ficticiamente como factura pagada en otra pasarela. Registrar devoluciones, reversiones y disputas con historial de importes y cobertura; definir revisión/política sin borrar datos académicos automáticamente.

Aceptación: cambio de método y cancelación son operaciones consistentes, auditadas y sin suscripciones duplicadas o renovaciones ocultas.

## Entrega 7: configuración, avisos, soporte y panel

En Configuración, construir 'Suscripción y pagos': plan, estado, modalidad, importe/moneda reales, cobertura, prueba, renovación/vencimiento, historial, pendientes y acciones disponibles. Reemplazar vistas de ejemplo por datos reales de servidor y estados vacíos/no configurados explícitos.

Diferenciar 'Se renovará automáticamente' de 'Debes realizar tu próxima transferencia'. Mostrar cancelación, actualización del método, reporte de transferencia, portal, soporte y cortesía según permisos y estado. Interfaz adaptable a móvil, accesible y conforme al sistema de diseño existente.

Avisos de fin de prueba, vencimiento manual, recepción/aprobación/rechazo, fallo de pago, gracia, cancelación y cortesía. Definir qué envía la aplicación y qué envía el proveedor; deduplicar, almacenar resultados y reintentar sin spam. Sin proveedor de correo configurado, no afirmar 'enviado'.

Soporte debe persistir un caso con número, categoría, estado, titular y referencia opcional de pago; confirmación verificable y permisos comerciales separados de acceso académico. No pedir número completo de tarjeta, CVV, contraseña o datos innecesarios de estudiantes. Preparar canal/correo configurable y las operaciones del administrador para atender casos.

Panel comercial: búsqueda/paginación, suscripciones, transferencias pendientes, cortesías, casos, eventos fallidos y auditoría. Métricas separan clientes de pago, pruebas y cortesías; ingresos agrupados por moneda y sin mezclar solicitudes con dinero recibido. Mostrar histórico de cambio y causa de acceso efectivo.

Aceptación: usuario con plan vencido puede pagar y pedir ayuda; formulario de soporte no finge envío; ninguna cifra de demostración se presenta como ingreso real.

## Entrega 8: validación y preparación de lanzamiento

Pruebas unitarias, integración y recorridos principales con reloj controlado y datos sintéticos. Incluir como mínimo:

- Dos docentes del mismo centro con derechos comerciales distintos.
- Prueba única, vencimiento y cambio de correo/reintentos.
- Suspensión prevalece sobre pago/cortesía y no hay elevación de rol escolar.
- Tablas, vistas, RPC y archivos bloquean lecturas/escrituras ajenas.
- Doble clic, dos pestañas, creación concurrente y pagos/eventos duplicados.
- Eventos fuera de orden, firma inválida, replay, caída del servidor y recuperación.
- Aprobación concurrente, mismo movimiento bancario y comprobantes ajenos.
- Cobertura anticipada, meses cortos, zona horaria y límites de período.
- Renovación fallida, primera compra fallida, gracia que no se reinicia y pago posterior.
- Cancelación/cambio de método junto al cobro, cortesía sobre suscripción activa y expiración de cortesía sin cargo.
- Reembolsos/disputas simulados, importes distintos y estados intermedios.
- Usuario vencido accede a configuración/soporte y los datos no se borran.
- Comprobantes privados, portal restringido, precios del servidor y ausencia de secretos en bundles/registros.
- Flags apagados preservan comportamiento previo legítimo; no impiden procesar eventos válidos cuando esa vía esté habilitada.

Ejecutar las comprobaciones requeridas por `AGENTS.md` (y pruebas nuevas pertinentes):

```sh
pnpm --filter backend test
pnpm --filter backend build
pnpm --filter frontend build
pnpm cloudflare:build
```

Probar migraciones, privilegios y RLS en la base aislada; revisar asesores de seguridad cuando estén disponibles. Registrar salida y código de retorno. Si falta un servicio, dependencia o credencial, indicar exactamente la parte no verificada; mocks no sustituyen una prueba real de integración ni autorizan producción.

Documentar instalación, variables sin secretos, eventos/endpoints, conciliación, rutina administrativa, migración de usuarios existentes, controles de lanzamiento y recuperación. Distinguir revertir código, detener nuevas contrataciones y cancelar renovaciones remotas; no borrar registros comerciales para 'reiniciar' el sistema.

## Pendientes que bloquean cobros reales, no la base técnica

1. Aprobación de la pasarela y cuenta receptora (Pana no confirmada).
2. Precio(s) y moneda(s) de cobro; cuenta dominicana y requisitos bancarios reales.
3. Condiciones finales de prueba/gracia, consentimiento, cancelación, reembolsos, retención y privacidad.
4. Tratamiento fiscal/contable, documentos de venta y textos legales revisados.
5. Correo/canal real de soporte, proveedor de comunicaciones y secretos del sandbox.
6. Pruebas integrales aprobadas y autorización expresa posterior para configurar producción, migraciones compartidas y cualquier transacción real de validación.

## Registro inicial de entregas

Todas las entregas de código están pendientes al crear este archivo. Actualizar únicamente con evidencia real, no con intenciones.

- [x] Confirmar `main` y crear rama de implementación.
- [x] Guardar el encargo para continuidad en Codex.
- [ ] Iniciar una tarea real de Codex y comprobar su entorno/repositorio.
- [ ] Revisar base actual y reproducir compilaciones/pruebas.
- [ ] Entrega 1: modelo/configuración.
- [ ] Entrega 2: registro/prueba.
- [ ] Entrega 3: acceso/administración/cortesías.
- [ ] Entrega 4: transferencias.
- [ ] Entrega 5: pasarela sandbox/eventos.
- [ ] Entrega 6: renovaciones/incidencias/cambios.
- [ ] Entrega 7: configuración/soporte/avisos/panel.
- [ ] Entrega 8: validación/documentación de operación.
- [ ] Revisar PR y resolver decisiones comerciales.
- [ ] Obtener autorización independiente para producción.

Preparación inicial: rama creada desde `dfdee49835e35071c811f14216ea71b6c9bbf636`; sin cambios de código, pruebas ejecutadas, tareas de Codex iniciadas, migraciones aplicadas ni pagos activados en este paso.
