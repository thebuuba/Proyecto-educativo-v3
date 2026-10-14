# Corrección transversal de añadir y completar criterios

Ejecución directa con `executing-plans`, sin subagentes por instrucción del usuario.

**Objetivo:** propuestas pertinentes, mensajes claros al agotar candidatos y conservación del borrador en Lengua común1.º–6.º e Inglés común1.º, en los cuatro formatos.

**Base:** rama `amplia-instrumentos-secundaria`, commit `ff13520`, catálogo local `evaluation-2026.45`. Encargo: adjunto `babdf797-9193-4c9c-a10d-7abfc6401d36/Texto pegado.txt`.

## Trabajo y evidencia

- [x] Reproducir Inglés exacto y revisar borradores autorizados de Lengua; distinguir evidencia representativa del caso B desconocido.
- [x] Inventariar proveedores y candidatos usando los contratos existentes; comparar servicio y alternativa.
- [x] Escribir y observar pruebas fallidas de contenido ausente, agotamiento y mensajes/aplicación.
- [x] Corregir el flujo compartido del editor: agotamiento sin fila automática, opción manual explícita, completar sin alterar puntos ni contenido existente, respuestas obsoletas.
- [x] Conectar evidencias adicionales genuinas y autoradas, sin fragmentación ni requisitos inventados. Identidad estable y misma política en servicio/alternativa.
- [x] Verificar matriz de familias, cuatro formatos, puntos pendientes/20/17.35, identidad/manual/errores/respuestas tardías.
- [x] Versionar catálogo inmutable; comprobar runtime HTTP local y guardado/reapertura autenticados con snapshot.
- [x] Revisar diff; ejecutar comprobaciones pertinentes y builds exigidos; actualizar cierres, avance, continuación e informe con límites reales.
- [x] Commit español y push normal a la rama actual; confirmar hash/remoto/árbol.

## Restricciones

Sin nuevas asignaturas/grados, IA, dependencias, rediseño, reset, main ni producción. No editar migraciones ni snapshots históricos. Excluir secretos, cuentas locales, logs y temporales de Git.

## Decisiones de investigación

El editor actual aplica `appendInstrumentCriterion(null)` ante agotamiento. `matchingCatalogCriterion` sí admite fila sin nombre; el problema no puede atribuirse a esa condición sin revisar candidatos. El catálogo de Inglés devuelve el mismo conjunto en generación y adicionales. Lengua tiene proveedores específicos y composición; la falta de extras puede ser legítima cuando todas las evidencias ya están representadas.

## Evidencia y decisiones finales

Informe: `docs/curriculum/cobertura-secundaria/criterios-adicionales-informe.md`. Ruling: incluir los requisitos omitidos también en generación nueva; un conjunto inicial completo puede agotar la selección adicional y debe explicarlo. Ruling: el borrador local de guía se trata como evidencia autorizada, sin asumir que sea el caso B exacto. Ejecutar commit/push normal como paso final; el estado Git se confirma en la entrega.
