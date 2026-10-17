import { evaluationCatalogV82 } from './catalog-v82'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.83",
  "mathCommonModules": [
    {
      "id": "matematica-comun-1",
      "grade": 1,
      "subjectCode": "MAT",
      "topics": [
        {
          "id": "integers",
          "grade": 1,
          "label": "números enteros",
          "match": "enteros?",
          "relation": "el signo, el valor y las propiedades de las operaciones con enteros",
          "representation": "representa el valor y el orden de los enteros indicados",
          "pages": [
            217
          ]
        },
        {
          "id": "rationals",
          "grade": 1,
          "label": "números racionales",
          "match": "racionales?|fraccion\\w*",
          "relation": "la equivalencia y el valor de los números racionales en la operación solicitada",
          "representation": "representa los racionales indicados conservando su valor y orden",
          "pages": [
            217
          ],
          "exclude": "valor absoluto"
        },
        {
          "id": "absolute",
          "grade": 1,
          "label": "valor absoluto",
          "match": "valor absoluto",
          "relation": "la distancia al cero y su diferencia con el signo del número",
          "representation": "representa la distancia al cero correspondiente al valor absoluto solicitado",
          "pages": [
            217
          ]
        },
        {
          "id": "percent",
          "grade": 1,
          "label": "porcentajes",
          "match": "porcent\\w*|por ciento",
          "relation": "la relación entre la cantidad de referencia, la parte y el porcentaje",
          "representation": "representa la relación parte-total solicitada sin cambiar su base",
          "pages": [
            217
          ],
          "exclude": "impuest"
        },
        {
          "id": "simple-interest",
          "grade": 1,
          "label": "interés simple",
          "match": "interes simple|capital y monto",
          "relation": "la relación entre capital, tasa, tiempo e interés simple, usando los períodos indicados",
          "representation": "representa las cantidades y períodos solicitados de la situación de interés simple",
          "pages": [
            217
          ]
        },
        {
          "id": "compound-interest",
          "grade": 1,
          "label": "interés compuesto",
          "match": "interes compuesto|interes simple y compuesto",
          "relation": "la capitalización y la correspondencia entre tasa y período en el interés compuesto",
          "representation": "representa la evolución solicitada del capital con su capitalización",
          "pages": [
            217
          ]
        },
        {
          "id": "tax",
          "grade": 1,
          "label": "impuestos",
          "match": "impuest\\w*",
          "relation": "la base del impuesto, su tasa y el importe que corresponde a los datos dados",
          "representation": "representa la relación entre base, impuesto y total cuando se solicita",
          "pages": [
            217
          ]
        },
        {
          "id": "economy",
          "grade": 1,
          "label": "economía y acciones económicas",
          "match": "economia|economicas?|emprendimiento",
          "relation": "el significado de economía, sus áreas y la relación de los recursos con la acción económica estudiada",
          "representation": "organiza las áreas, recursos o acciones económicas solicitados sin confundir sus funciones",
          "pages": [
            217
          ]
        },
        {
          "id": "lines",
          "grade": 1,
          "label": "rectas y sus tipos",
          "match": "rectas?|paralelas?|perpendiculares?",
          "relation": "las propiedades que distinguen los tipos de rectas indicados y la relación geométrica solicitada",
          "representation": "construye las rectas solicitadas manteniendo la relación geométrica indicada",
          "pages": [
            217
          ],
          "exclude": "recta numerica"
        },
        {
          "id": "angles",
          "grade": 1,
          "label": "ángulos y bisectriz",
          "match": "angulos?|bisectriz|complemento|suplemento",
          "relation": "la medida y la relación de los ángulos solicitados, distinguiendo complemento, suplemento o bisectriz cuando corresponda",
          "representation": "representa los ángulos solicitados conservando sus medidas y relaciones",
          "pages": [
            217
          ],
          "exclude": "pitagor"
        },
        {
          "id": "pythagoras",
          "grade": 1,
          "label": "teorema de Pitágoras",
          "match": "pitagor\\w*",
          "relation": "la relación entre catetos e hipotenusa del triángulo rectángulo indicado",
          "representation": "representa la relación pitagórica solicitada identificando correctamente los lados",
          "pages": [
            217,
            218
          ]
        },
        {
          "id": "prisms",
          "grade": 1,
          "label": "prismas y cubo",
          "match": "prismas?|cubo",
          "relation": "las dimensiones y propiedades del prisma o cubo necesarias para la magnitud solicitada",
          "representation": "representa el prisma o cubo solicitado distinguiendo sus elementos y dimensiones",
          "pages": [
            217,
            218
          ]
        },
        {
          "id": "pyramids",
          "grade": 1,
          "label": "pirámides",
          "match": "piramid\\w*",
          "relation": "la relación de la base y altura de la pirámide con la magnitud solicitada",
          "representation": "representa la pirámide indicada distinguiendo base y altura",
          "pages": [
            217,
            218
          ]
        },
        {
          "id": "capacity",
          "grade": 1,
          "label": "capacidad y volumen interno",
          "match": "capacidad|litros?|mililitros?|recipientes?",
          "relation": "la capacidad como volumen interno y las equivalencias indicadas entre capacidad y volumen",
          "representation": "representa la capacidad o equivalencia solicitada sin confundir magnitudes",
          "pages": [
            218
          ]
        },
        {
          "id": "units",
          "grade": 1,
          "label": "unidades y sistemas de medida",
          "match": "unidades? (?:cubicas?|de medida)|sistema (?:metrico|ingles|internacional)|\\bmks\\b|\\bcgs\\b|metro cubico|decimetro cubico|centimetro cubico|milimetro cubico",
          "relation": "la magnitud, la unidad y el factor de equivalencia del sistema de medida solicitado",
          "representation": "organiza las equivalencias de unidades solicitadas manteniendo la magnitud",
          "pages": [
            217,
            218
          ]
        },
        {
          "id": "mass",
          "grade": 1,
          "label": "medidas de masa",
          "match": "toneladas?|gramos?|kilogramos?|medidas? de masa",
          "relation": "las equivalencias entre las unidades de masa indicadas",
          "representation": "representa las equivalencias de masa pedidas sin confundir la escala",
          "pages": [
            218
          ]
        },
        {
          "id": "time",
          "grade": 1,
          "label": "duración, horarios y cronogramas",
          "match": "cronogramas?|horarios?|duracion|unidades? de tiempo",
          "relation": "la duración y equivalencia de las unidades de tiempo indicadas, manteniendo la secuencia temporal",
          "representation": "organiza el horario o cronograma solicitado con los tiempos disponibles",
          "pages": [
            218
          ]
        },
        {
          "id": "temperature",
          "grade": 1,
          "label": "temperatura",
          "match": "temperatur\\w*|termometr\\w*",
          "relation": "la relación entre la escala del termómetro y la temperatura señalada",
          "representation": "representa la temperatura solicitada respetando la escala indicada",
          "pages": [
            218
          ]
        },
        {
          "id": "coordinates",
          "grade": 1,
          "label": "coordenadas cartesianas",
          "match": "coordenadas?|plano cartesiano|puntos? (?:dados|indicados|en el plano)",
          "relation": "el orden de las coordenadas y su posición respecto a los ejes del plano",
          "representation": "sitúa los puntos o figuras solicitados manteniendo el orden de sus coordenadas",
          "pages": [
            218
          ]
        },
        {
          "id": "statistics",
          "grade": 1,
          "label": "datos agrupados y gráficos estadísticos",
          "match": "datos agrupados|histogram\\w*|poligonos? de frecuencia|estadistic\\w*|tablas? de frecuencia",
          "relation": "la correspondencia entre los datos o intervalos y sus frecuencias",
          "representation": "construye el gráfico o tabla solicitado manteniendo los intervalos, frecuencias y etiquetas de los datos",
          "pages": [
            218
          ],
          "exclude": "^(?!.*(?:histogram|poligono|tabla)).*(?:media|mediana|moda|tendencia central)"
        },
        {
          "id": "central",
          "grade": 1,
          "label": "medidas de tendencia central",
          "match": "media|mediana|moda|tendencia central",
          "relation": "el significado y la forma de determinar la medida de tendencia central solicitada con los datos dados",
          "representation": "representa las medidas de tendencia central pedidas sin confundirlas entre sí",
          "pages": [
            218
          ]
        },
        {
          "id": "probability",
          "grade": 1,
          "label": "eventos simples y probabilidad",
          "match": "probabil\\w*|espacio muestral|eventos? simples?|experimento aleatorio",
          "relation": "la relación entre los resultados posibles y los favorables al evento simple indicado",
          "representation": "representa el espacio muestral o evento solicitado sin omitir ni repetir resultados",
          "pages": [
            218
          ]
        }
      ],
      "policy": "REQUESTED_MATH_ACTIONS_CONTENT_CONDITIONS_ALTERNATIVES_V1"
    },
    {
      "id": "matematica-comun-2",
      "grade": 2,
      "subjectCode": "MAT",
      "topics": [
        {
          "id": "reals",
          "grade": 2,
          "label": "números reales",
          "match": "reales?|irracionales?|potenciacion|radicacion",
          "relation": "el valor real, las propiedades de la operación y las condiciones de potencias o raíces solicitadas",
          "representation": "sitúa los reales pedidos conservando su orden y valor",
          "pages": [
            220
          ]
        },
        {
          "id": "patterns",
          "grade": 2,
          "label": "patrones numéricos",
          "match": "patron(?:es)? numericos?|secuencia numerica",
          "relation": "la regularidad que relaciona los términos dados y permite justificar su continuación",
          "representation": "representa la regularidad de la secuencia numérica sin alterar los términos dados",
          "pages": [
            220
          ]
        },
        {
          "id": "expressions",
          "grade": 2,
          "label": "expresiones algebraicas",
          "match": "expresiones? algebraicas?|lenguaje algebraico|terminos semejantes",
          "relation": "la equivalencia de expresiones, el significado de las variables y el orden de operaciones solicitado",
          "representation": "representa las cantidades y relaciones mediante las expresiones algebraicas solicitadas",
          "pages": [
            220
          ]
        },
        {
          "id": "linear-equations",
          "grade": 2,
          "label": "ecuaciones de primer grado",
          "match": "ecuacion(?:es)? (?:de )?(?:primer grado|lineal(?:es)?)",
          "relation": "la equivalencia de las ecuaciones y el valor de la incógnita que satisface la igualdad",
          "representation": "representa la ecuación lineal solicitada conservando su relación de igualdad",
          "pages": [
            220
          ],
          "exclude": "inecuacion"
        },
        {
          "id": "linear-inequalities",
          "grade": 2,
          "label": "inecuaciones de primer grado",
          "match": "inecuacion(?:es)? (?:de )?(?:primer grado|lineal(?:es)?)|desigualdad(?:es)? de primer grado",
          "relation": "las transformaciones equivalentes de la desigualdad y el conjunto solución, incluido el cambio de sentido cuando corresponde",
          "representation": "representa el conjunto solución de la desigualdad lineal solicitada",
          "pages": [
            220
          ]
        },
        {
          "id": "quadratics",
          "grade": 2,
          "label": "ecuaciones de segundo grado",
          "match": "ecuacion(?:es)? (?:de )?(?:segundo grado|cuadraticas?)",
          "relation": "la equivalencia de la ecuación cuadrática y las raíces que satisfacen la igualdad, según los datos disponibles",
          "representation": "representa la ecuación cuadrática pedida manteniendo sus soluciones y referencias",
          "pages": [
            220
          ],
          "exclude": "inecuacion"
        },
        {
          "id": "quadratic-inequalities",
          "grade": 2,
          "label": "inecuaciones de segundo grado",
          "match": "inecuacion(?:es)? (?:de )?(?:segundo grado|cuadraticas?)|desigualdad(?:es)? de segundo grado",
          "relation": "el signo de la expresión cuadrática y los intervalos que satisfacen la desigualdad solicitada",
          "representation": "representa los intervalos solución de la desigualdad cuadrática solicitada",
          "pages": [
            220
          ]
        },
        {
          "id": "planning",
          "grade": 2,
          "label": "planificación financiera",
          "match": "planificacion financiera|ahorro de recursos",
          "relation": "la relación entre recursos, metas, ahorro y actores de la planificación financiera indicada",
          "representation": "organiza los recursos y metas de la planificación financiera solicitada",
          "pages": [
            220
          ]
        },
        {
          "id": "compound",
          "grade": 2,
          "label": "interés compuesto y monto",
          "match": "interes compuesto|monto",
          "relation": "la capitalización y la correspondencia entre capital, tasa, período y monto de la situación financiera dada",
          "representation": "representa la evolución solicitada del monto según sus períodos de capitalización",
          "pages": [
            220
          ]
        },
        {
          "id": "geometry",
          "grade": 2,
          "label": "geometría plana y sus ramas",
          "match": "geometria|elementos basicos",
          "relation": "las propiedades de los elementos básicos o las ramas de geometría plana solicitadas",
          "representation": "representa los elementos geométricos solicitados respetando sus propiedades",
          "pages": [
            220
          ]
        },
        {
          "id": "coordinates",
          "grade": 2,
          "label": "plano cartesiano",
          "match": "plano cartesiano|coordenadas?|figuras geometricas",
          "relation": "el orden de coordenadas, la posición respecto a los ejes y las relaciones de la figura indicada",
          "representation": "sitúa las figuras o puntos indicados manteniendo el orden de sus coordenadas",
          "pages": [
            220
          ],
          "exclude": "distancia entre|longitud de un segmento"
        },
        {
          "id": "distance",
          "grade": 2,
          "label": "distancia entre puntos",
          "match": "distancia entre (?:dos )?puntos|longitud de un segmento",
          "relation": "la diferencia entre las coordenadas y su relación con la distancia o longitud solicitada",
          "representation": "representa el segmento entre los puntos indicados conservando sus extremos y longitud",
          "pages": [
            220
          ]
        },
        {
          "id": "heron",
          "grade": 2,
          "label": "fórmula de Herón",
          "match": "heron",
          "relation": "la relación del semiperímetro y las longitudes de los tres lados con el área del triángulo, comprobando su existencia",
          "representation": "representa el triángulo indicado distinguiendo los lados utilizados en la fórmula de Herón",
          "pages": [
            220
          ]
        },
        {
          "id": "triangle",
          "grade": 2,
          "label": "teorema fundamental del triángulo",
          "match": "teorema fundamental del triangulo",
          "relation": "la suma de las medidas de los ángulos interiores del triángulo y su justificación en el teorema solicitado",
          "representation": "representa las relaciones angulares del triángulo necesarias para el teorema solicitado",
          "pages": [
            220
          ]
        },
        {
          "id": "round-bodies",
          "grade": 2,
          "label": "cono, cilindro y esfera",
          "match": "cono|cilindro|esfera|cuerpos redondos",
          "relation": "la forma del cuerpo redondo, sus dimensiones y la magnitud solicitada, distinguiendo radio, diámetro y altura cuando correspondan",
          "representation": "representa el cuerpo o desarrollo plano solicitado conservando sus propiedades; no convierte la esfera en un desarrollo plano exacto",
          "pages": [
            220,
            221
          ]
        },
        {
          "id": "position",
          "grade": 2,
          "label": "medidas de posición",
          "match": "medidas? de posicion|deciles?|cuartiles?|quintiles?",
          "relation": "el orden de los datos y la posición o partición correspondiente al decil, cuartil o quintil solicitado",
          "representation": "representa la partición o posición indicada conservando el orden de los datos",
          "pages": [
            220,
            221
          ]
        },
        {
          "id": "statistics",
          "grade": 2,
          "label": "datos agrupados y gráficos",
          "match": "datos agrupados|estadistic\\w*|poligonos? de frecuencia|graficos? circulares?",
          "relation": "la correspondencia entre datos, intervalos, frecuencias y proporciones del gráfico o tabla solicitado",
          "representation": "construye el gráfico solicitado conservando frecuencias, intervalos o proporciones según su tipo",
          "pages": [
            220,
            221
          ],
          "exclude": "^(?!.*(?:grafico|poligono|tabla)).*(?:medidas? de posicion|cuartil|decil|quintil)"
        },
        {
          "id": "probability",
          "grade": 2,
          "label": "experimentos y eventos compuestos",
          "match": "probabil\\w*|eventos? compuestos?|experimentos? aleatorios?|diagramas? de arbol|numeros aleatorios",
          "relation": "el espacio de resultados y la relación entre eventos del experimento indicado, justificando dependencia o independencia solo cuando los datos lo permiten",
          "representation": "representa las ramas o resultados del experimento solicitado sin omitir ni duplicar posibilidades",
          "pages": [
            220,
            221
          ]
        }
      ],
      "policy": "REQUESTED_MATH_ACTIONS_CONTENT_CONDITIONS_ALTERNATIVES_V1"
    },
    {
      "id": "matematica-comun-3",
      "grade": 3,
      "subjectCode": "MAT",
      "topics": [
        {
          "id": "polynomials",
          "grade": 3,
          "label": "polinomios y operaciones",
          "match": "polinomios?|expresiones? algebraicas?",
          "relation": "el grado, términos, coeficientes y equivalencia de la operación solicitada con polinomios",
          "representation": "representa los términos y relaciones del polinomio indicado sin cambiar su valor",
          "pages": [
            222
          ],
          "exclude": "factoriz|raices|ceros|ruffini|descartes|factores de un polinomio|division sintetica"
        },
        {
          "id": "notable",
          "grade": 3,
          "label": "productos y cocientes notables",
          "match": "productos? notables?|cocientes? notables?|cuadrado de un binomio|cubo de un binomio|suma por la diferencia",
          "relation": "la equivalencia entre la forma desarrollada y la expresión notable solicitada, distinguiendo términos y signos",
          "representation": "representa las relaciones del producto o cociente notable pedido sin imponer un modelo no solicitado",
          "pages": [
            222
          ]
        },
        {
          "id": "factorization",
          "grade": 3,
          "label": "factorización",
          "match": "factoriz\\w*|factor comun|diferencia de cuadrados|trinomio|suma de cubos|diferencia de cubos|completando cuadrados",
          "relation": "la equivalencia entre el producto de factores y la expresión original, seleccionando un caso válido para la expresión dada",
          "representation": "representa los factores pedidos conservando el producto equivalente a la expresión original",
          "pages": [
            222
          ]
        },
        {
          "id": "logic",
          "grade": 3,
          "label": "conectivos lógicos y Venn-Euler",
          "match": "conectivos? logicos?|venn|euler|lenguaje algebraico",
          "relation": "el significado del conectivo o la relación entre los conjuntos solicitados y la conservación del significado al traducir",
          "representation": "representa los conjuntos o relaciones lógicas pedidos sin añadir regiones ni relaciones no indicadas",
          "pages": [
            222
          ]
        },
        {
          "id": "roots",
          "grade": 3,
          "label": "raíces y factores",
          "match": "raices|ceros de un polinomio|factores de un polinomio",
          "relation": "la relación entre una raíz, el cero del polinomio y el factor correspondiente al verificar la igualdad",
          "representation": "representa las raíces o factores indicados sin cambiar la equivalencia del polinomio",
          "pages": [
            222
          ],
          "exclude": "descartes|ceros racionales"
        },
        {
          "id": "rational-zeros",
          "grade": 3,
          "label": "teorema de los ceros racionales",
          "match": "ceros racionales",
          "relation": "la diferencia entre candidatos racionales obtenidos de los coeficientes y raíces comprobadas por sustitución",
          "representation": "organiza los candidatos racionales pedidos distinguiéndolos de los ceros verificados",
          "pages": [
            222
          ]
        },
        {
          "id": "descartes",
          "grade": 3,
          "label": "regla de los signos de Descartes",
          "match": "descartes",
          "relation": "los cambios de signo y las posibilidades de raíces reales según la regla, sin tratarlas como un recuento exacto garantizado",
          "representation": "organiza los signos y posibilidades de raíces que permite la regla solicitada",
          "pages": [
            222
          ]
        },
        {
          "id": "ruffini",
          "grade": 3,
          "label": "regla de Ruffini",
          "match": "ruffini|division sintetica",
          "relation": "la alineación de coeficientes, operaciones de división sintética y correspondencia de cociente y resto con la división original",
          "representation": "organiza los coeficientes y pasos de Ruffini conservando sus posiciones, incluidos los coeficientes nulos",
          "pages": [
            222
          ]
        },
        {
          "id": "equations",
          "grade": 3,
          "label": "ecuaciones de primer y segundo grado",
          "match": "ecuacion(?:es)? (?:de )?(?:primer(?: y segundo)?|segundo) grado|ecuacion(?:es)? cuadraticas?",
          "relation": "las transformaciones equivalentes de la ecuación y las soluciones que satisfacen la igualdad original",
          "representation": "representa la igualdad o soluciones solicitadas sin imponer un método único",
          "pages": [
            222
          ],
          "exclude": "inecuacion|sistema"
        },
        {
          "id": "linear",
          "grade": 3,
          "label": "ecuaciones e inecuaciones lineales",
          "match": "(?:in)?ecuacion(?:es)? lineal(?:es)?|coeficientes racionales e irracionales",
          "relation": "la equivalencia de las transformaciones y las soluciones de la igualdad o desigualdad lineal solicitada, distinguiendo el cambio de sentido cuando corresponde",
          "representation": "representa el conjunto solución pedido respetando las condiciones y coeficientes indicados",
          "pages": [
            222
          ],
          "exclude": "sistema"
        },
        {
          "id": "systems",
          "grade": 3,
          "label": "sistemas lineales de dos incógnitas",
          "match": "sistemas? de ecuacion(?:es)?|sistemas? lineal(?:es)?|dos incognitas",
          "relation": "las soluciones comunes a ambas ecuaciones y la equivalencia del método elegido, admitiendo métodos válidos y casos sin solución o con infinitas soluciones",
          "representation": "representa las ecuaciones o su intersección solo en el formato solicitado, distinguiendo los casos del sistema",
          "pages": [
            222
          ]
        },
        {
          "id": "functions",
          "grade": 3,
          "label": "funciones algebraicas, exponenciales y logarítmicas",
          "match": "funcion(?:es)?|dominio|rango de una funcion",
          "relation": "la correspondencia entre entradas y salidas y las restricciones del dominio y rango de la función indicada",
          "representation": "representa la función pedida conservando sus restricciones, entradas y salidas",
          "pages": [
            222
          ]
        },
        {
          "id": "absolute",
          "grade": 3,
          "label": "valor absoluto",
          "match": "valor absoluto",
          "relation": "el valor absoluto como distancia al cero y su diferencia respecto al signo del número real",
          "representation": "representa la distancia al cero solicitada sin confundir número y valor absoluto",
          "pages": [
            222
          ]
        },
        {
          "id": "statistics",
          "grade": 3,
          "label": "datos agrupados y frecuencias",
          "match": "estadistic\\w*|datos agrupados|tablas? de frecuencia|poligonos? de frecuencia",
          "relation": "la conservación de los datos, intervalos y frecuencias en la tabla o gráfico solicitado",
          "representation": "construye la tabla o gráfico pedido manteniendo intervalos y frecuencias de los datos proporcionados",
          "pages": [
            222
          ]
        },
        {
          "id": "dispersion",
          "grade": 3,
          "label": "medidas de dispersión",
          "match": "dispersion|desviacion tipica|desviacion media|varianza|rango de (?:los )?datos",
          "relation": "la variabilidad de los datos y la definición de la medida de dispersión solicitada, conservando la referencia y el divisor que corresponde al conjunto indicado",
          "representation": "representa la dispersión pedida conservando los datos y la medida elegida",
          "pages": [
            222
          ]
        },
        {
          "id": "probability",
          "grade": 3,
          "label": "diagramas de árbol y probabilidad",
          "match": "probabil\\w*|diagramas? de arbol",
          "relation": "el espacio de resultados y la correspondencia entre las ramas y las probabilidades permitidas por el experimento indicado",
          "representation": "construye el diagrama solicitado sin omitir ni duplicar resultados y conservando las probabilidades proporcionadas",
          "pages": [
            222
          ]
        }
      ],
      "policy": "REQUESTED_MATH_ACTIONS_CONTENT_CONDITIONS_ALTERNATIVES_V1"
    },
    {
      "id": "matematica-comun-4",
      "grade": 4,
      "subjectCode": "MAT",
      "topics": [
        {
          "id": "angles",
          "grade": 4,
          "label": "ángulos y medición",
          "match": "angulos?|transportador|escuadras?|compas",
          "relation": "la amplitud, escala y relaciones de los ángulos indicados, distinguiendo vértice y lados sin cambiar la medida solicitada",
          "representation": "construye los ángulos solicitados conservando amplitud, vértice y relaciones, sin imponer herramientas no pedidas",
          "pages": [
            229
          ],
          "exclude": "paralel|perpendicular|recta|triangulo|congruencia|poligono|circunferencia"
        },
        {
          "id": "lines",
          "grade": 4,
          "label": "rectas y postulados",
          "match": "rectas?|paralelismo|perpendicularidad|paralelas?|perpendiculares?|transversales?",
          "relation": "las condiciones de paralelismo, perpendicularidad o transversalidad y las relaciones angulares solicitadas",
          "representation": "construye las rectas pedidas conservando sus relaciones y referencias geométricas",
          "pages": [
            229
          ]
        },
        {
          "id": "polygons",
          "grade": 4,
          "label": "polígonos y diagonales",
          "match": "poligonos?|diagonales?",
          "relation": "el número de lados, regularidad, diagonales y relaciones de ángulos o perímetro del polígono solicitado",
          "representation": "representa los elementos o diagonales pedidos sin omitir ni duplicar segmentos",
          "pages": [
            229
          ]
        },
        {
          "id": "triangles",
          "grade": 4,
          "label": "triángulos y propiedades",
          "match": "triangulos?|teorema fundamental",
          "relation": "las relaciones entre lados, ángulos interiores y exteriores del triángulo solicitado y las condiciones de existencia",
          "representation": "representa el triángulo indicado respetando sus datos, lados y relaciones angulares",
          "pages": [
            229
          ],
          "exclude": "congruencia|lll|lal|ala|thales|tales|menelao|ceva"
        },
        {
          "id": "congruence",
          "grade": 4,
          "label": "congruencia y criterios LLL, LAL, ALA",
          "match": "congruencia|\\blll\\b|\\blal\\b|\\bala\\b",
          "relation": "la correspondencia de lados y ángulos y las condiciones suficientes del criterio de congruencia solicitado",
          "representation": "representa las figuras correspondientes conservando las medidas y la correspondencia del criterio indicado",
          "pages": [
            229
          ],
          "exclude": "transformacion"
        },
        {
          "id": "thales",
          "grade": 4,
          "label": "teorema de Thales",
          "match": "thales|tales",
          "relation": "la proporcionalidad de segmentos correspondiente a las rectas paralelas del caso indicado, verificando las hipótesis del teorema",
          "representation": "representa la configuración de Thales solicitada distinguiendo los segmentos correspondientes",
          "pages": [
            229
          ]
        },
        {
          "id": "menelaus",
          "grade": 4,
          "label": "teorema de Menelao",
          "match": "menelao",
          "relation": "la colinealidad y las razones de segmentos de la configuración indicada, manteniendo una convención coherente de signos",
          "representation": "representa la transversal y segmentos del caso de Menelao solicitado sin intercambiar correspondencias",
          "pages": [
            229
          ]
        },
        {
          "id": "ceva",
          "grade": 4,
          "label": "teorema de Ceva",
          "match": "ceva",
          "relation": "la concurrencia de las cevianas y las razones de segmentos de la configuración indicada, verificando las hipótesis del teorema",
          "representation": "representa las cevianas y sus segmentos correspondientes en el caso solicitado",
          "pages": [
            229
          ]
        },
        {
          "id": "circumference",
          "grade": 4,
          "label": "circunferencia y elementos",
          "match": "circunferencia|radios?|diametros?|cuerdas?|arcos?",
          "relation": "las relaciones entre centro, radio, diámetro, cuerdas o arcos que intervienen en lo solicitado, distinguiendo circunferencia y círculo",
          "representation": "representa la circunferencia y los elementos pedidos manteniendo sus relaciones geométricas",
          "pages": [
            229
          ]
        },
        {
          "id": "polyhedra",
          "grade": 4,
          "label": "poliedros y volumen",
          "match": "poliedros?|volumen de cuerpos",
          "relation": "las bases, alturas y descomposiciones válidas del poliedro necesarias para la magnitud solicitada",
          "representation": "representa el poliedro pedido distinguiendo sus dimensiones sin imponer una vista o material no solicitado",
          "pages": [
            229
          ],
          "exclude": "truncad"
        },
        {
          "id": "truncated",
          "grade": 4,
          "label": "cuerpos truncados",
          "match": "cuerpos? truncados?|troncos? de (?:cono|piramide)",
          "relation": "las bases, altura y relaciones del cuerpo truncado necesarias para el área o volumen solicitado, sin sustituirlo por el cuerpo completo",
          "representation": "representa el cuerpo truncado indicado identificando las bases y alturas pertinentes",
          "pages": [
            229
          ]
        },
        {
          "id": "transformations",
          "grade": 4,
          "label": "transformaciones geométricas",
          "match": "transformacion(?:es)? geometricas?|traslacion(?:es)?|rotacion(?:es)?|reflexion(?:es)?|simetrias?|homotecias?",
          "relation": "la correspondencia entre puntos originales e imágenes y las propiedades que conserva la transformación solicitada, distinguiendo congruencia y cambio de escala",
          "representation": "representa la imagen solicitada conservando la correspondencia, orientación o escala que define la transformación indicada",
          "pages": [
            229
          ]
        },
        {
          "id": "units",
          "grade": 4,
          "label": "sistemas de medida y conversiones",
          "match": "sistemas? de medidas?|conversion(?:es)?|unidades? de medida",
          "relation": "la magnitud, unidad y factor de equivalencia correspondiente al sistema de medida indicado",
          "representation": "organiza las equivalencias solicitadas conservando la magnitud y las unidades proporcionadas",
          "pages": [
            230
          ]
        },
        {
          "id": "reservoir",
          "grade": 4,
          "label": "modelización de embalse",
          "match": "embalses?",
          "relation": "la relación entre dimensiones, capacidad, recursos y restricciones proporcionados para atender la necesidad de abastecimiento indicada",
          "representation": "representa el diseño de embalse pedido con dimensiones y restricciones disponibles sin inventar datos técnicos",
          "pages": [
            230
          ]
        }
      ],
      "policy": "REQUESTED_MATH_ACTIONS_CONTENT_CONDITIONS_ALTERNATIVES_V1"
    },
    {
      "id": "matematica-comun-5",
      "grade": 5,
      "subjectCode": "MAT",
      "topics": [
        {
          "id": "line",
          "grade": 5,
          "label": "ecuación de la recta",
          "match": "rectas?|pendientes?",
          "relation": "la pendiente, intersecciones y formas equivalentes de la ecuación de la recta indicadas, distinguiendo rectas verticales cuando corresponda",
          "representation": "representa la recta pedida conservando la relación entre sus puntos, pendiente e intersecciones",
          "pages": [
            231
          ]
        },
        {
          "id": "circle",
          "grade": 5,
          "label": "circunferencia analítica",
          "match": "circunferencia",
          "relation": "el centro, radio y relación de distancias que definen la circunferencia de la consigna, vinculando sus elementos con su ecuación",
          "representation": "representa la circunferencia solicitada respetando centro, radio y ecuación",
          "pages": [
            231
          ]
        },
        {
          "id": "parabola",
          "grade": 5,
          "label": "parábola y elementos",
          "match": "parabolas?",
          "relation": "la equidistancia entre foco y directriz, vértice y orientación de la parábola indicada y su correspondencia con la ecuación",
          "representation": "representa la parábola indicada conservando vértice, orientación y elementos solicitados",
          "pages": [
            231
          ]
        },
        {
          "id": "ellipse",
          "grade": 5,
          "label": "elipse y elementos",
          "match": "elipses?",
          "relation": "la suma constante de distancias a los focos y las relaciones entre semiejes y focos de la elipse indicada, vinculadas a su ecuación",
          "representation": "representa la elipse pedida conservando centro, ejes y elementos solicitados",
          "pages": [
            231
          ]
        },
        {
          "id": "hyperbola",
          "grade": 5,
          "label": "hipérbola y elementos",
          "match": "hiperbolas?",
          "relation": "la diferencia absoluta constante de distancias a los focos y las relaciones entre ejes, focos y asíntotas de la hipérbola indicada",
          "representation": "representa la hipérbola conservando su orientación y los elementos solicitados",
          "pages": [
            231
          ]
        },
        {
          "id": "conics",
          "grade": 5,
          "label": "cónicas",
          "match": "conicas?",
          "relation": "las propiedades y elementos de cada cónica solicitada, distinguiendo las condiciones que caracterizan sus ecuaciones",
          "representation": "representa únicamente las cónicas pedidas con los datos y referencias disponibles",
          "pages": [
            231
          ]
        },
        {
          "id": "vectors",
          "grade": 5,
          "label": "vectores",
          "match": "vector(?:es)?|vectorial",
          "relation": "la magnitud, dirección, sentido y componentes pertinentes del vector indicado, respetando las condiciones de la operación solicitada",
          "representation": "representa el vector pedido conservando componentes, dirección y sentido según la notación solicitada",
          "pages": [
            231
          ]
        },
        {
          "id": "matrices",
          "grade": 5,
          "label": "matrices y operaciones",
          "match": "matri(?:z|ces)",
          "relation": "el orden, posiciones de las entradas y compatibilidad de dimensiones de las matrices indicadas, distinguiendo las condiciones de cada operación y el orden de los factores",
          "representation": "representa la matriz pedida respetando filas, columnas y posiciones de sus entradas",
          "pages": [
            231
          ],
          "exclude": "determinante|inversa"
        },
        {
          "id": "determinants",
          "grade": 5,
          "label": "determinantes",
          "match": "determinantes?",
          "relation": "la condición de matriz cuadrada, el orden y las relaciones del determinante solicitado, sin confundir determinante y matriz",
          "representation": "organiza la matriz cuadrada y los pasos de representación solicitados para su determinante",
          "pages": [
            231
          ]
        },
        {
          "id": "inverse",
          "grade": 5,
          "label": "matriz inversa",
          "match": "inversa(?:s)?",
          "relation": "la condición de matriz cuadrada no singular y la relación con la identidad que debe cumplir la inversa solicitada, reconociendo cuándo no existe",
          "representation": "representa la matriz inversa pedida manteniendo el orden y las entradas correspondientes",
          "pages": [
            231
          ]
        },
        {
          "id": "trig-history",
          "grade": 5,
          "label": "origen de la trigonometría",
          "match": "(?:origen|historia|desarrollo(?: historico)?) de la trigonometria",
          "relation": "el origen y desarrollo histórico de la trigonometría solicitados, relacionando las aportaciones con sus problemas matemáticos sin atribuciones inventadas",
          "representation": "organiza la secuencia histórica solicitada conservando las referencias disponibles",
          "pages": [
            231
          ]
        },
        {
          "id": "trig-functions",
          "grade": 5,
          "label": "funciones trigonométricas",
          "match": "funcion(?:es)? trigonometricas?|razones? trigonometricas?",
          "relation": "las razones o valores de las funciones trigonométricas y su dominio pertinente para los ángulos proporcionados, distinguiendo unidades angulares y valores no definidos",
          "representation": "representa las funciones trigonométricas pedidas respetando sus dominios y referencias angulares",
          "pages": [
            231
          ],
          "exclude": "notables?|especiales?|identidad"
        },
        {
          "id": "sine-law",
          "grade": 5,
          "label": "ley de los senos",
          "match": "ley (?:del seno|de los senos)",
          "relation": "la correspondencia entre lados y senos de ángulos opuestos, las condiciones del triángulo y la posible ambigüedad de los datos del caso solicitado",
          "representation": "representa el triángulo pedido distinguiendo lados y ángulos opuestos para la ley de los senos",
          "pages": [
            231
          ]
        },
        {
          "id": "cosine-law",
          "grade": 5,
          "label": "ley de los cosenos",
          "match": "ley (?:del coseno|de los cosenos)",
          "relation": "la relación entre el lado opuesto y el ángulo comprendido de la ley de los cosenos y la suficiencia de los datos proporcionados",
          "representation": "representa el triángulo pedido conservando el ángulo comprendido y sus lados correspondientes",
          "pages": [
            231
          ]
        },
        {
          "id": "right-triangles",
          "grade": 5,
          "label": "triángulos rectángulos",
          "match": "triangulos? rectangulos?",
          "relation": "la identificación de hipotenusa y catetos respecto del ángulo de referencia, la razón pertinente y las unidades de los datos del triángulo rectángulo",
          "representation": "representa el triángulo rectángulo solicitado manteniendo el ángulo recto y las correspondencias de lados",
          "pages": [
            231
          ],
          "exclude": "ley (?:del|de los)"
        },
        {
          "id": "oblique-triangles",
          "grade": 5,
          "label": "triángulos oblicuángulos",
          "match": "triangulos? oblicuangulos?",
          "relation": "las correspondencias de lados y ángulos y la suficiencia o ambigüedad de los datos del triángulo oblicuángulo, admitiendo métodos válidos",
          "representation": "representa el triángulo oblicuángulo pedido conservando las medidas y relaciones disponibles",
          "pages": [
            231
          ]
        },
        {
          "id": "notable-angles",
          "grade": 5,
          "label": "ángulos notables y especiales",
          "match": "angulos? notables?|angulos? especiales?",
          "relation": "las relaciones geométricas que justifican los valores trigonométricos de los ángulos notables o especiales pedidos, distinguiendo valores exactos y aproximados",
          "representation": "representa los ángulos notables pedidos conservando las referencias y relaciones geométricas",
          "pages": [
            231
          ]
        },
        {
          "id": "trig-graphs",
          "grade": 5,
          "label": "gráficas trigonométricas",
          "match": "sinusoides?|tangentoides?|grafica(?:s)? (?:del seno|del coseno|de la tangente)",
          "relation": "la amplitud, período y desplazamientos que correspondan a la función solicitada y su dominio, distinguiendo las asíntotas y discontinuidades de la tangente",
          "representation": "representa únicamente la gráfica trigonométrica solicitada conservando período, dominio, referencias y asíntotas cuando correspondan",
          "pages": [
            231
          ]
        },
        {
          "id": "identities",
          "grade": 5,
          "label": "identidades trigonométricas pitagóricas",
          "match": "identidad(?:es)? trigonometricas?(?: pitagoricas?)?|identidad(?:es)? pitagoricas?",
          "relation": "la equivalencia de las expresiones en su dominio común mediante identidades pitagóricas válidas, sin sustituir la demostración por un solo ejemplo numérico",
          "representation": "representa las relaciones solicitadas de las identidades pitagóricas conservando su dominio",
          "pages": [
            231
          ]
        }
      ],
      "policy": "REQUESTED_MATH_ACTIONS_CONTENT_CONDITIONS_ALTERNATIVES_V1"
    }
  ]
}
export const evaluationCatalogV83 = { ...evaluationCatalogV82, ...frozen }
