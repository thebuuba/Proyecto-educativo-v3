# Punto de avance: capacidad de instrumentos (.42)

La ampliación curricular queda detenida por instrucción del usuario el14/10/2026. Este bloque conserva una corrección compartida y sus pruebas; **no cierra Inglés común de1.º ni su comprobación visual del límite de20 criterios**.

## Causa confirmada y alcance

Una consigna de reconocimiento de31 estructuras gramaticales de Inglés1 generaba31 criterios específicos. El servicio aplicaba `.slice(0,20)` a los criterios seleccionados y descartaba11 requisitos; la alternativa local entregaba31 filas, superando el límite del editor. [Respuesta previa y criterios originales](evidencias/criterios-capacidad-antes.json). No era falta de datos ni un fallo de suma de puntos.

El flujo compartido conserva el límite existente de20: comprueba la capacidad antes de construir la propuesta, devuelve400 explicativo cuando la consigna no cabe y pide dividir o acotar requisitos. El editor conserva el instrumento y las ediciones anteriores, también si el servicio falla y la alternativa excede el límite. No se amplía la interfaz ni se oculta el recorte. La comprobación afecta a los proveedores autorales compartidos, no a estos títulos concretos.

## Cambios conservados

- `packages/shared/src/instrument-definition.ts`: error y comprobación de capacidad.
- `packages/shared/src/secondary-topic-recommendation.ts`: mismo límite en propuestas locales autorales.
- `apps/backend/src/modules/evaluation-instruments/recommendation-engine.ts` y `evaluation-instruments.service.ts`: elimina el truncamiento y comunica400.
- `apps/frontend/src/modules/activities/components/editor/ActivityCreationView.tsx`: informa sin sustituir la propuesta anterior ni anunciar una alternativa válida inexistente.
- Catálogo actual `.42` y archivo congelado `catalog-v41.ts`; se preservan versiones anteriores.
- Regresiones backend/frontend, fixture y comprobador HTTP, evidencias de servicio/históricos y documentos de cierre.

## Verificación realizada

| Comprobación | Evidencia y resultado |
|---|---|
| Backend completo reciente |6.300 pruebas/63 archivos,14/10/2026 02:34 local; se reutiliza |
| Frontend completo reciente |11.225/107,02:36–02:37 local; se reutiliza |
| Pruebas específicas de cierre |33 backend (capacidad y servicio) y siete frontend (capacidad y protección de ediciones),04:29 local; aprobadas |
| Backend build |Compilación al recuperar `pnpm dev:local`,04:16 local; aprobada |
| Frontend build y Cloudflare |Verificados02:36 local; Cloudflare dry-run, sin despliegue; reutilizados |
| Servicio local autenticado |[Ocho rechazos de31 y ocho propuestas de20 criterios](evidencias/criterios-capacidad-servicio.json); cuatro instrumentos ×20/17.35, suma exacta |
| Históricos |[102 snapshots preservados](evidencias/lengua-historicos-evaluation-2026.42.json):28 de referencia y74 instrumentos completos |
| Diff |Revisión de código, pruebas, catálogos y callers; `git diff --check` sin errores |

Los logs se conservan localmente y no se incluyen en el commit. La suite backend completa precedió el ajuste de sintaxis del constructor de error; la recompilación y las pruebas específicas posteriores comprueban ese estado final. El cierre añade documentación y no modifica implementación. Se reutilizan las comprobaciones recientes conforme a la instrucción del usuario, sin repetir suites completas.

## Verificación visual pendiente y cobertura parcial

Chrome recuperó la sesión ficticia local y el borrador «QA capacidad · copia temporal», con el total20 y su descriptor editado. Se abrió «Generar nuevo instrumento»; la observación final fue el diálogo «¿Reemplazar el instrumento editado?». **No se confirmó la sustitución ni se observó el400 en la interfaz.** Las pruebas automáticas del componente protegen ese caso, pero no sustituyen la comprobación visual solicitada. El borrador queda para retomar, sin modificar la actividad histórica de origen.

Después de esa comprobación faltan la revisión final de Inglés1, el cotejo explícito de17 registros de actitudes/valores y21 indicadores de logro, y los recorridos finales con actualización de matriz. No se califica motivación, ansiedad ni personalidad por convertir condiciones curriculares en criterios. No se inicia Inglés2 ni otra asignatura durante este cierre.

## Git y entorno

Rama `amplia-instrumentos-secundaria`, repositorio `https://github.com/thebuuba/Proyecto-educativo-v3.git`. Último commit previo confirmado publicado: `6a07b05285b55485afd3a87dd81b443a3341445a`. La evidencia .42 ejecutó esa base con cambios (`dirty: true`), API3000/frontend5173/Supabase54321 locales. El hash del nuevo punto de avance se entrega tras commit/push; no se atribuye a ejecuciones previas.

Credenciales, `.env`, cuentas locales, logs y temporales quedan excluidos y conservados localmente. Sin force push, main, despliegue, migraciones, reset, IA, rediseño o reescritura de snapshots. El trabajo se detiene en este punto hasta nueva instrucción.
