# Educación Física de 2.º: plan de implementación

> Ejecución individual con executing-plans y TDD. El usuario autorizó continuar entre grados y exige mantener esta rama, sin subagentes ni pushes.

Objetivo: conectar y verificar instrumentos pertinentes para los contenidos comunes reales de 2.º de secundaria, utilizando el proveedor y los cuatro formatos existentes. No modificar producción, desplegar, mezclar con main, cambiar cuentas o integraciones, ni ampliar primaria.

Base: commit `be2121b47b425948d92cb9bcdc7967bac27761e1`, cierre representativo de EFI de 1.º. El catálogo 112 se congeló una sola vez y se cotejó por lectura PostgreSQL con Development antes de preparar el siguiente; no sobrescribirlo.

Fuente: páginas PDF 362–364, impresas 361–363, MINERD 2023. SHA-256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`. Ámbito `bea155fb-1eef-52dd-80a2-e86992f1f72b`: 19 conceptos, seis filas de procedimientos con acciones numeradas agrupadas, 10 actitudes, 21 indicadores y 14 competencias. Las tres páginas ya se renderizaron a 1800 px y se leyeron visualmente completas; no repetir sin cambio de fuente.

La extracción conserva agrupadas muchas acciones en `ec0f5e0b`, `a6d8a048`, `6f30a124` y `bf5dee58`. Sus encabezados internos no justifican excluir la fila con desempeños. Los procedimientos 5/6 repiten orientación bajo dos rótulos: conservar el literal sin duplicar criterios. Son diez conceptos y cinco filas de procedimientos útiles; nueve encabezados conceptuales y uno procedimental no son desempeños independientes.

Arquitectura: añadir metadata de grado en `secondary-physical-grade-2.ts`, extender el registro de `secondary-physical.ts` y mantener el formateador compartido. El catálogo 113 debe conservar todo el payload 112 excepto el segundo módulo físico y la versión. Interpretación, backend y alternativa local deben resolver la misma consigna; no nuevas dependencias, UI, tipos pedagógicos ni esquema.

- [x] Crear contratos rojos por capacidad, campismo, atletismo/adaptación/paralimpismo, ajedrez, béisbol/softbol/béisbol 5 y artes marciales adaptadas. Probar título incompatible, descripción breve/desarrollada, acciones independientes, negaciones, alternativas, propósito, grado y cuatro formatos con 20/17,35 puntos y puntos pendientes.
- [x] Conectar evidencias específicas y corregir solo las carencias de reconocimiento demostradas. La misma materia cambia según análisis, comparación, plan, ejecución, registro, historia o verificación. Recursos e implementos se limitan a lo pedido.
- [x] Generar correspondencias y exclusiones, luego leer todos los instrumentos completos, sus progresiones y puntuaciones. Registrar huellas solo después de leer y corregir con regresiones. Distinguir ejemplos representativos de toda variante curricular.
- [x] Actualizar fuente, matriz, notas e inventario sin dar por completos otros grados. Mantener todos los instrumentos anteriores exactos, incluidos los 540 de EFI de 1.º.
- [x] Detener únicamente el Worker propio verificado antes de construir dist. Ejecutar backend test/build, frontend build, cloudflare:build, frontend afectado y lint. No generar Prisma mientras un instalador o script Prisma tenga cargada su DLL en Windows.
- [x] Publicar la fuente e instalar el catálogo solo en Development, con idempotencia y preservación de historia. No repetir publicaciones ni muestras ya guardadas. Probar 12 muestras HTTP y el recorrido personal real, distinguiendo cualquier limitación.
- [x] Revisar diff, secretos y UTF-8; actualizar informe y continuación; commit español local. Push pendiente. Continuar después con 3.º sin preguntas rutinarias.

Condiciones: los tiempos, distancias y técnicas del documento son referencias curriculares, no prescripciones automáticas. Campismo y prácticas motrices utilizan condiciones, adaptaciones y supervisión ya proporcionadas; no se generan excursiones o maniobras peligrosas. Primeros auxilios, dieta, gasto energético, hidratación y pulsaciones se trabajan con fichas/protocolos dados o casos ficticios; no diagnósticos, dosis, datos privados ni orientación médica nueva. No se califica capacidad natural, cuerpo, discapacidad, fe, identidad, emociones o personalidad. «Deportes optativos» dentro de EFI no designa salidas académicas.
