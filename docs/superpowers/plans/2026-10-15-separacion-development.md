# Separación del entorno de desarrollo

Destino autorizado: AulaBase Development, `eolgunypmtgrsyrjzcld`. Producción `vqrptqffeezqacwtmlqq` queda fuera de todas las mutaciones. Continuar en el checkout y rama actuales; no merge, despliegue, reset ni copia desde producción.

- [x] Confirmar disponibilidad y registrar una base de comparación de las cuentas y datos existentes de Development.
- [x] Revisar las doce migraciones ausentes, sus dependencias, privilegios/RLS y backfills. Probarlas en una transacción que termine en rollback; aplicar cada archivo aprobado en su propia transacción junto con su versión original en `supabase_migrations.schema_migrations`.
- [x] Usar `app_backend_local`, previsto en la migración existente, con una credencial exclusiva de Development. Conservar las credenciales de los roles y cuentas existentes.
- [x] Añadir una comprobación de entorno con pruebas que rechacen producción, proyectos mezclados y claves ajenas. El arranque local debe usar las variables del archivo validado aunque el proceso padre tenga otras variables.
- [x] Respaldar solo los archivos locales ignorados y alinear PostgreSQL, Auth, Storage, Vite y el enlace local del CLI con Development. No cambiar ningún binding remoto.
- [x] Instalar únicamente los catálogos ya incluidos en esta versión cuando sean necesarios, sin copiar datos ni ampliar cobertura curricular.
- [x] Recompilar y verificar en localhost:8787 con una cuenta de prueba de Development: carga, detección, selección manual, guardado/reapertura e identidad exacta del instrumento al cambiar solo estrategia.
- [x] Ejecutar las cuatro comprobaciones de AGENTS.md, revisar el diff y actualizar README, documentación de despliegue e informe con evidencias sin secretos y estado real de Git.

La solicitud del usuario especifica destino, restricciones y pruebas; se ejecuta directamente. OpenCode/deepseek-worker no se encontró en los ejecutables consultados. No se crean implementaciones paralelas de las mismas operaciones remotas.

Resultado: verificaciones HTTP/DB y suites aprobadas; automatización visual bloqueada por la política de acceso del navegador. Evidencias, límites y pasos de prueba manual documentados en [el informe](../reports/2026-10-15-separacion-development.md). Cierre autorizado mediante commit y push normal a la rama actual, sin despliegue ni merge.
