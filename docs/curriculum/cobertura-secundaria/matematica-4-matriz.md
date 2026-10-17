# Matemática común 4.º — matriz de cobertura

Fuente oficial: MINERD 2023, PDF 229, 230; impresa = PDF menos uno. SHA-256 `80b22b3adb3290bd251bde65c98b78b60f24845ab43b70c1f4e3294e0b6f6c58`.

Estado: pruebas automáticas y HTTP/DB; alcance visual en el informe del grado. El inventario de fuente no acredita por sí solo un instrumento pertinente. Consultar el informe del grado y los instrumentos completos.

| Tema / proveedor | PDF | Consignas y familias verificables |
|---|---|---|
| ángulos y medición / `angles` | 229 | Mide los ángulos indicados en la figura.<br>Construye los ángulos dados.<br>Clasifica los ángulos de la figura proporcionada.<br>Explica los errores de medición de ángulos dados. |
| rectas y postulados / `lines` | 229 | Construye rectas paralelas, perpendiculares y transversales.<br>Interpreta las relaciones de rectas de la figura dada.<br>Resuelve problemas de ángulos entre paralelas.<br>Justifica el postulado de rectas aplicado. |
| polígonos y diagonales / `polygons` | 229 | Calcula las diagonales del polígono regular dado.<br>Calcula los ángulos y perímetro de los polígonos dados.<br>Construye el polígono regular indicado.<br>Analiza los errores de las diagonales del polígono dibujado. |
| triángulos y propiedades / `triangles` | 229 | Resuelve problemas con ángulos interiores y exteriores de triángulos.<br>Explica la relación entre los lados y ángulos del triángulo.<br>Analiza los errores del teorema fundamental del triángulo aplicado. |
| congruencia y criterios LLL, LAL, ALA / `congruence` | 229 | Justifica la congruencia de los triángulos por LLL, LAL o ALA cuando corresponda.<br>Clasifica los casos de congruencia dados.<br>Representa un caso del criterio LAL con los datos dados.<br>Analiza los errores de la congruencia indicada. |
| teorema de Thales / `thales` | 229 | Aplica el teorema de Thales a los segmentos dados.<br>Explica por qué se aplica Thales a la figura dada.<br>Analiza los errores de las proporciones de Tales. |
| teorema de Menelao / `menelaus` | 229 | Aplica el teorema de Menelao a la configuración dada.<br>Explica las condiciones del teorema de Menelao.<br>Analiza los errores de Menelao en el caso proporcionado. |
| teorema de Ceva / `ceva` | 229 | Aplica el teorema de Ceva a la figura dada.<br>Explica las condiciones de concurrencia según Ceva.<br>Analiza los errores del teorema de Ceva aplicado. |
| circunferencia y elementos / `circumference` | 229 | Resuelve problemas sobre circunferencia con los datos dados.<br>Identifica los elementos de la circunferencia dada.<br>Explica las propiedades de las cuerdas indicadas.<br>Representa los radios y diámetros solicitados. |
| poliedros y volumen / `polyhedra` | 229 | Calcula el volumen de los poliedros dados.<br>Interpreta los datos de volumen de cuerpos proporcionados.<br>Investiga aplicaciones del volumen de cuerpos en el contexto indicado. |
| cuerpos truncados / `truncated` | 229 | Calcula el área y volumen del cuerpo truncado dado.<br>Modeliza la situación proporcionada con un cuerpo truncado.<br>Explica el procedimiento del volumen de cuerpos truncados sin calcular resultados. |
| transformaciones geométricas / `transformations` | 229 | Representa la traslación de la figura dada.<br>Clasifica las transformaciones geométricas indicadas.<br>Resuelve problemas del contexto con transformaciones geométricas.<br>Interpreta la rotación de la figura proporcionada. |
| sistemas de medida y conversiones / `units` | 230 | Convierte las unidades de medida indicadas.<br>Justifica las conversiones del sistema de medidas solicitado.<br>Analiza los errores de las conversiones dadas. |
| modelización de embalse / `reservoir` | 230 | Elabora un proyecto de diseño de embalse con las dimensiones y restricciones dadas.<br>Modeliza la capacidad del embalse con los datos disponibles.<br>Analiza las limitaciones del diseño de embalse proporcionado. |

Proveedor compartido: `packages/shared/src/secondary-math-grade-4.ts`, conectado en servicio, alternativa local y sugerencias. Las relaciones matemáticas, registros de fuente vinculados y estado individual están en [la matriz estructurada](matematica-matriz.json). [Instrumentos completos](matematica-4-instrumentos.json).

## Conceptos y procedimientos literales

- PDF 229 / CONCEPT / `7987a1e8-a03f-57b0-bc2c-848e7bde1d9c`: Geometría:
- PDF 229 / CONCEPT / `499198f3-f167-5bba-b57c-e7ad30c2b82f`: • Ángulos, sistemas de medidas, Postulados, Congruencia, Paralelismo, perpendicularidad, Polígonos, Diagonales, Ángulos internos y externos, Perímetro, Triángulos, propiedades, Congruencia, Ángulos interiores y exteriores, Relación entre los lados y ángulos de un triángulo, Postulados (LLL, LAL y ALA), Circunferencia, propiedades y elementos, y sus tipos: y volumen de poliedros y de cuerpos truncados. Transformaciones geométricas.
- PDF 229 / PROCEDURE / `66ee3339-58a9-5e54-a158-f10702be496a`: • Construcción y medición de ángulos: Uso de transportadores, escuadras y compás físicos y virtuales (Proyecto Gauss) para construir ángulos.
- PDF 229 / PROCEDURE / `67aeb41e-59ad-53d0-8979-e72fccb927a4`: • Construcción e interpretación de rectas paralelas, perpendiculares y transversales.
- PDF 229 / PROCEDURE / `2ee58282-abc6-5c58-a019-aa49de52c255`: • Aplicación de postulados de las rectas en situaciones del contexto.
- PDF 229 / PROCEDURE / `d8fd4bea-52b8-5124-8888-50ce0f19eeee`: • Resolución de problemas que impliquen rectas y ángulos.
- PDF 229 / PROCEDURE / `c146fa68-5072-5113-b89f-fef41119cf2b`: • Construcción y Cálculo de los elementos y diagonales de los polígonos regulares.
- PDF 229 / PROCEDURE / `65bf9c6f-ee92-5fb2-9a3f-851d93d71689`: • Cálculo de ángulos y perímetro de polígonos.
- PDF 229 / PROCEDURE / `26692ec9-3c5a-508b-a706-bd72f8b83853`: • Determinación de polígonos regulares.
- PDF 229 / PROCEDURE / `8d0c7e5b-045b-5583-838d-25f269079a0b`: • Resolución de problemas de la vida cotidiana que impliquen polígonos. -Aplicaciones: teorema fundamental de los triángulos para ángulos interiores y para ángulos exteriores.
- PDF 229 / PROCEDURE / `0d24f2c6-09c2-5e1d-9425-fcffd98b2076`: • Aplicación de postulados (LLL, LAL y ALA) Teoremas Thales, Menelao, Ceva,).
- PDF 229 / PROCEDURE / `d415935e-d33e-5c18-8250-235b69dff762`: • Resolución de problemas sobre la circunferencia.
- PDF 229 / PROCEDURE / `6a5eb05a-d4b1-5528-80c0-1ee4445cb0f6`: • Aplicación de los conceptos de circunferencia en situaciones de la vida cotidiana.
- PDF 229 / PROCEDURE / `9f743857-8ebc-5674-9a49-3c093292dfd6`: • Identificación y clasificación de las transformaciones geométricas en situaciones de la vida diaria.
- PDF 229 / PROCEDURE / `4c06da6b-7b98-5697-aa57-02ce7416c09e`: • Cálculo de volumen de poliedros y cuerpos truncados.
- PDF 229 / PROCEDURE / `b9d2b28c-ee7c-56c8-a8b9-685635eeff0d`: • Resolución de problemas del contexto que se modelen a partir de las transformaciones geométricas.

## Exclusiones y pendientes

- Geometría:: encabezado taxonómico, no desempeño independiente.

El informe del grado distingue los recorridos visuales realizados de los pendientes; no se borran cachés ni borradores. Los criterios evalúan solo acciones solicitadas, sin estética, rapidez o actitudes personales añadidas.
