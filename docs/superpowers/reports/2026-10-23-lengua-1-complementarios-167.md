# Lengua Española de 1.º: publicación, intercambio y contraste de consignas

La candidata 167 corrige catorce actividades complementarias y dieciséis contrastes independientes: 120 instrumentos completos. Se conserva el banco original, sus expectativas y todas las capturas anteriores. Los 592 instrumentos previamente revisados siguen exactamente iguales. Esto no cierra Lengua de 1.º ni el encargo de los 82 contextos.

## Cambios y causas

- La fase pedida tiene prioridad: publicar una versión terminada, preparar una vista previa y escribir un primer borrador producen evidencias distintas. La publicación exige acceso efectivo; no vuelve a evaluar la creación del texto.
- La integridad distingue diferencias de transcripción de problemas de acceso. Los créditos se evalúan una sola vez. Se conserva el soporte solicitado y las alternativas admitidas.
- El intercambio ambiental distingue envío inicial, intervención efectivamente recibida y respuesta. No inventa fuentes ni mensajes recibidos. Las fases dependientes de una respuesta externa siguen pendientes, sin convertirse en incumplimiento.
- Resumir dos textos no exige una inferencia nueva. Cuando sí se pide inferir, el respaldo usa ambas fuentes. Declarar límites explícitos solo se exige donde lo solicita la consigna; una síntesis puede cerrar con conclusión sustentada **o** tensión abierta delimitada.
- La comparación histórica no incorpora automáticamente un recurso natural ni una declaración de incertidumbres. La perspectiva propia ficticia se diferencia de comprender la perspectiva ajena. Las consecuencias solo se exigen cuando se piden y no se valoran dos veces.
- La palabra «borrador» activaba una revisión entre versiones; al retirarla apareció otra fila general de «revisión final». Se corrigieron ambas causas mediante regresiones. «Borrador revisado y versión final» conserva su exigencia legítima. El caligrama sobre la calma mantiene ese tema explícito.
- El motor compartido y la preparación local usan las mismas reglas. El módulo se incluye en el chunk de reglas de Lengua ya separado para respetar el límite del precaché, sin ampliarlo ni desactivar el service worker.

Archivos principales: `secondary-language-grade-one-community.ts`, `secondary-language-grade-one-transversal.ts`, `language-feature-criteria.ts`, `secondary-calligram-grade-one-requirements.ts`, `curricular-community-independent.spec.ts`, catálogo actual y copia histórica 166, configuración de chunks de Vite, bancos, matriz y evidencias.

## Revisión real y sus límites

Participaron `/root/auditor_curricular`, `/root/disenador_pruebas` y `/root/revisor_pedagogico`, todos de solo lectura. El diseñador fijó las actividades antes de generar. El auditor identificó componentes oficiales concretos y evitó atribuir publicación a preparación, o intercambio interno a un registro conservado para la clase.

El revisor leyó 56 complementarios y 64 contrastes completos, sus selecciones y varias rondas corregidas. Sus reservas sobre límites, consecuencias y fases se incorporaron. La última ronda quedó bloqueada por un límite de uso de la herramienta; alcanzó a detectar la segunda fila de revisión de P03A. **No hay aceptación independiente de todas las variantes finales.** El coordinador leyó los 120 instrumentos finales, incluyendo títulos, descripciones, niveles y variantes de los cuatro formatos, además de las 30 selecciones. Esa lectura no se presenta como independiente.

El manifiesto `auditoria-curricular-len1-167-lectura120.json` enlaza capturas completas, huellas, requisitos por criterio y fuente mínima. Se corrige el estado documental `ORAL_PENDIENTE` del indicador de argumentación: TRA-ARG01 ya aportaba evidencia oral revisada. El indicador completo no se declara cerrado.

## Verificaciones locales

- Regresiones observadas fallando antes de corregir. Última suite focal: 185 pruebas en dos archivos.
- Backend completo: **98.076 pruebas en 239 archivos**, exit 0.
- Frontend focal: **123 pruebas en 7 archivos**, exit 0.
- Builds de backend, frontend y `pnpm cloudflare:build`: exit 0. Cloudflare terminó con `--dry-run: exiting now`; no despliegue.
- Lint de backend, frontend y shared: exit 0.
- Comparación de los 592 instrumentos anteriores: exacta, con paridad, puntos pendientes, edición manual y puntuaciones 20/17,35.
- Validación de los 120 nuevos: captura igual al código final, paridad servidor/local, máximo 20 criterios, puntuación inicialmente vacía y texto manual conservado al puntuar 20/17,35.

La primera suite general de 167 se interrumpió sin resultado final. Antes de repetirla se comprobó que no quedaba un proceso activo. La segunda ejecución completó los ocho gates secuencialmente. No se considera aprobada la ejecución interrumpida.

## Entorno y pendientes

Última evidencia remota confirmada al preparar este informe: Development `eolgunypmtgrsyrjzcld`, versión 166, 97 releases y 1.253 snapshots. Sus cuatro muestras HTTP/DB y las 15 referencias personales originales estaban verificadas. El Worker 166 se detuvo de forma controlada para compilar 167. Instalación, arranque y recorrido HTTP de 167 se documentarán después de ejecutarse; no se presuponen aquí.

La sesión personal del navegador y su caché/registro de service worker siguen pendientes. La última observación conservaba un login con error y assets antiguos; no se cambian credenciales, no se envían correos ni se borra almacenamiento. La prueba HTTP de QA no sustituye ese recorrido visual personal.

Quedan tres componentes de fuente con cuatro consignas ya fijadas, todavía sin generar: E01, intercambio ambiental dentro del aula; E02, publicación de una investigación sencilla identificable; E03/E04, instructivos con finalidad ambiental vinculada a sus acciones. Después deben conciliarse nuevamente todos los componentes de la malla. Los otros 81 contextos mantienen su auditoría integral pendiente; Inglés de 1.º tiene fuente preparada, no instrumentos nuevos aceptados.

Solo commits locales en `ampliacion-de-instrumentos-2`. Sin push, merge, despliegue, producción, cambios de cuentas, migraciones de esquema ni recaptura de referencias.
