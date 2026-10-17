# Integración de todas las ramas en main

Ejecución directa, sin subagentes. Solicitud: fusionar todas las ramas, resolver sus choques y verificar el resultado conservando los cambios.

## Límites y destino

- Publicar código en main está autorizado por el nuevo encargo.
- Se conserva el límite anterior de no modificar producción ni ejecutar migraciones remotas.
- Mantener ramas, cuentas, datos, secretos, borradores e históricos; sin reset, force push o borrados.
- Git fetch e inventario de 75 referencias: 72 ya incorporadas en origin/main; faltan únicamente instrumentos y suscripciones/pagos.
- Rama temporal de integración en el checkout existente para preservar las ramas originales y aprovechar las dependencias instaladas.
- El flujo Deploy Cloudflare despliega y migra producción después de CI exitoso en main. Resolver este efecto antes de publicar main; no lanzar despliegues.

## Pasos y evidencia

- [x] Guardar las referencias iniciales y comprobar árbol limpio, procesos y configuración de workflows.
- [x] Integrar suscripciones/pagos sin conflictos y conservar su historial.
- [x] Resolver los ocho conflictos textuales de instrumentos conservando mejoras de main y del creador.
- [x] Reproducir pérdida de catálogo original y colisión de releases; congelar linajes de main 46/47 y curricular 92. Instalar únicamente el catálogo 93 en Development mediante el mecanismo existente: CREATED y luego UNCHANGED; 25 releases anteriores y 121 snapshots conservados por huella.
- [x] Reproducir pérdida de progresiones de Inglés al aplicar escala; conservar progresión original y adaptar solo la presentación. 3.011 pruebas afectadas aprobadas.
- [x] Backend completo (45.526 pruebas), frontend completo (45.852), builds exigidos, Cloudflare dry-run y lint sin errores.
- [x] Revisar seguridad de ejemplos, secretos excluidos, invariantes de DB/migraciones e identidad de releases históricos. Sin migraciones remotas durante la integración.
- [x] Comprobar que todas las referencias iniciales están incluidas en los padres de la integración final; repetir comprobación de ascendencia tras publicar main.
- [x] Publicar la rama de integración y abrir PR #58 con CI normal.
- [ ] Aprobar CI remoto y fusionar mediante PR protegido. [skip ci] solo detiene GitHub Actions; Workers Builds y Vercel tienen automatizaciones independientes. Antes de fusionar, confirmar pausa de sus despliegues o autorización expresa del usuario para ese efecto. Sin alterar producción, workflows ni protecciones por cuenta propia. Confirmar hash y sincronización en la entrega.

Las huellas, logs y resultados de comandos se conservan privadamente en .wrangler/integration-2026-10-17; el informe final publica solo evidencia sin credenciales.
