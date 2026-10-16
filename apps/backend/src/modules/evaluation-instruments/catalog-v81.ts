import { evaluationCatalogV80 } from './catalog-v80'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.81",
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
    }
  ]
}
export const evaluationCatalogV81 = { ...evaluationCatalogV80, ...frozen }
