# Francés común: alcance autorizado y diseño

Encargo del 15/10/2026, adjunto `d2d4353c-ff04-4737-bb10-eb95459fd213`. El usuario autoriza ejecución autónoma, sin confirmaciones rutinarias y **sin subagentes**, hasta cerrar los grados aplicables o encontrar un límite real. Se trabaja en la rama actual `amplia-instrumentos-secundaria`.

## Resultado buscado

Cerrar primero la recuperación de Development. Después inventariar visualmente el currículo oficial de Francés común y conectar proveedores deterministas por grado, en orden. Cada bloque debe distinguir inventario, implementación y verificación. Los criterios de AulaBase son adaptaciones evaluativas; el texto del MINERD se conserva aparte con sus páginas e identificadores.

Se requieren funciones comunicativas, gramática, léxico, géneros, modalidades, estrategias y condiciones observables propias de Francés. No basta traducir Inglés, devolver HTTP 200 ni sumar puntos. La descripción determina la acción principal; el título solo ayuda cuando no contradice la consigna. Comprensión, producción e interacción, oral y escrita, se distinguen. Las acciones obligatorias se conservan; alternativas, negaciones y requisitos de entrega se tratan expresamente. Se documenta el reconocimiento real de español, francés y texto mixto, sin prometer comprensión universal ni interpretar nombres y ejemplos como órdenes.

## Arquitectura decidida para este encargo

Se reutilizan los formatos compartidos de `editableAuthoredRecommendation` y las reglas existentes de puntuación y edición. Un resolvedor específico de Francés consume un contexto académico común `FRA`, el título y la descripción y entrega acciones, evidencias y selección sugerida. Cada grado aporta datos y reglas propios, con trazabilidad al PDF. El resolvedor se usa tanto en el servicio como en la alternativa local; no se duplica el contenido entre frontend y backend.

Las conexiones son `evaluation-instruments.service.ts`, `recommendation-engine.ts`, `activityDefaultSuggestions.ts`, `automaticInstrumentType.ts` e `instrumentPreparation.ts`. El selector existente de estrategia se conserva; se amplía su detección únicamente cuando una consigna francesa aporta evidencia suficiente. No se rediseña el creador.

Cada nuevo bloque conectado recibe un release evaluativo nuevo. Los releases anteriores y los snapshots existentes son inmutables. La instalación del catálogo se limita explícitamente a AulaBase Development y debe ser idempotente. No se requiere ni autoriza un esquema remoto nuevo.

## Criterios de aceptación

- Cuatro formatos con redacción propia: progresión en rúbrica, evidencia verificable en cotejo, grados/frecuencia pertinentes en escala y componentes/pesos/cumplimiento parcial en ponderada.
- Puntos pendientes inicialmente; asignación inmediata y totales exactos de 20 y 17.35; sin valor predeterminado de 20 en el editor.
- Se conservan elecciones explícitas, textos y pesos manuales, identidad de criterios, protección frente a respuestas obsoletas y opciones conservar/adaptar/cancelar.
- Añadir criterios compatibles sin duplicados ni relleno; completar solo campos vacíos; agotamiento visible y persistente; límite de 20 sin truncamiento silencioso.
- Cambiar solo la estrategia conserva el instrumento exactamente, también después de guardar y reabrir.
- Por grado: consigna breve y desarrollada, título neutral e incompatible, recepción/producción/interacción, oral/escrito/mixto, alternativas/negaciones, selección automática/manual, los cuatro formatos y ambos totales.
- Pruebas separadas: automatizadas; HTTP y base de datos autenticados en localhost; navegador real. Los bloqueos de navegador se registran sin atribuir prueba visual a otro tipo de evidencia.
- Datos y cuentas QA ficticios e identificables. No modificar datos previos ni copiar usuarios de producción.

## Límites

Solo Francés común. Sin optativas, otras asignaturas nuevas, producción, despliegues, merge con main, resets, borrados de datos previos, force push, nuevas dependencias, servicios de pago ni IA en la aplicación. Se preservan Lengua Española, Inglés e instrumentos históricos. Commits y pushes normales en español por bloques coherentes y verificados.

La continuidad se registra en `docs/curriculum/cobertura-secundaria/frances-continuacion.md`; cada cierre contiene catálogo, rama, evidencia, pendientes y siguiente acción. La revisión final será propia por prohibición expresa de subagentes.
