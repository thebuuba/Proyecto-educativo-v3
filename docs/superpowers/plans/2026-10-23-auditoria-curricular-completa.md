# Auditoría curricular completa: plan de ejecución directa

> Ejecución directa con executing-plans. No utilizar subagentes, por instrucción expresa del docente. Continuar después de cada bloque sin confirmaciones rutinarias.

**Objetivo:** agotar los contenidos oficiales de los ámbitos autorizados, completando ausencias y demostrando pertinencia de sus cuatro instrumentos.

**Arquitectura:** conservar motor determinista compartido, catálogo versionado y rutas reales. Matriz desde la fuente oficial, banco con expectativas anteriores a ejecución y evidencia completa por caso. El inventario de proveedores sirve para contraste, nunca para limitar el currículo.

**Tecnología:** pnpm, TypeScript compartido, Vitest, scripts Node existentes de extracción PDF y comparación histórica.

**Especificación:** ../specs/2026-10-23-auditoria-curricular-completa.md y encargo2026-10-22.

## Secuencia por asignatura/grado

- [x] Confirmar rama y procesos; conservar154 y evidencias previas. No reejecutar instaladores ni creadores terminados.
- [x] Recuperar PDF oficial; exigir identidad SHA256 con la fuente existente.
- [x] Leer malla completa de Lengua1, páginas69–75, y límite de entrada68; verificar continuaciones por contenido.
- [ ] Registrar temas/subtemas, procedimientos, actitudes e indicadores de Lengua1 con referencias; distinguir duplicados y taxonomía.
- [ ] Fijar banco de noticia y huella antes de llamar al motor; vincular cada requisito/subtema.
- [ ] Generar seis casos × cuatro formatos; leer instrumentos completos y registrar omisiones, añadidos, duplicados, agrupaciones y progresiones. No aprobar por generación o suma.
- [ ] Reproducir fallos en pruebas; corregir componente compartido o completar contenido faltante. Conservar catálogo154 antes de alterar reglas/payload.
- [ ] Verificar paridad/ediciones/puntuación, pruebas focales, builds y gates requeridos al cerrar código. No repetir suites completas sin causa.
- [ ] Medir HTTP/DB y navegador representativos; reconciliar IDs y comparar referencias antes/después de nuevas escrituras. Sesión personal pendiente no bloquea la auditoría local.
- [ ] Guardar commit local y continuar guía, informe, afiche, cuento y caligrama, incluyendo cada subtema y los reservados.
- [ ] Comparar toda Lengua1 con la fuente y señalar bloqueos; seguir Inglés1 y restantes asignaturas según orden oficial, después grado2 hasta6, optativas y módulos autorizados en sus grados.

## Riesgos y comprobaciones transversales

Continuaciones de página con distinto encabezado; descripción editada y título antiguo; alternativas/negaciones; subtemas compuestos y taxonómicos; gramática pedida frente a gramática impuesta; recuperaciones lentas de versiones; criterios manuales y agotamiento. Toda discrepancia mantiene su expectativa original y exige evidencia posterior propia. Revisión de cada descriptor, no solo de títulos.
