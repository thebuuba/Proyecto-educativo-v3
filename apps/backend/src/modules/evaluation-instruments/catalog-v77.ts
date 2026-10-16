import { evaluationCatalogV76 } from './catalog-v76'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.77",
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
            217,
            218
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
            217,
            218
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
            217,
            218
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
            217,
            218
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
            217,
            218
          ]
        },
        {
          "id": "compound-interest",
          "grade": 1,
          "label": "interés compuesto",
          "match": "interes compuesto",
          "relation": "la capitalización y la correspondencia entre tasa y período en el interés compuesto",
          "representation": "representa la evolución solicitada del capital con su capitalización",
          "pages": [
            217,
            218
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
            217,
            218
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
            217,
            218
          ]
        },
        {
          "id": "lines",
          "grade": 1,
          "label": "rectas paralelas y perpendiculares",
          "match": "rectas?|paralelas?|perpendiculares?",
          "relation": "las relaciones de paralelismo o perpendicularidad solicitadas entre las rectas",
          "representation": "construye las rectas solicitadas manteniendo la relación geométrica indicada",
          "pages": [
            217,
            218
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
            217,
            218
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
          "match": "prismas?|cubo|aristas?|vertices",
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
            217,
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
            217,
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
            217,
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
            217,
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
            217,
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
            217,
            218
          ],
          "exclude": "media|mediana|moda|tendencia central"
        },
        {
          "id": "central",
          "grade": 1,
          "label": "medidas de tendencia central",
          "match": "media|mediana|moda|tendencia central",
          "relation": "el significado y la forma de determinar la medida de tendencia central solicitada con los datos dados",
          "representation": "representa las medidas de tendencia central pedidas sin confundirlas entre sí",
          "pages": [
            217,
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
            217,
            218
          ]
        }
      ],
      "policy": "REQUESTED_MATH_ACTIONS_CONTENT_CONDITIONS_ALTERNATIVES_V1"
    }
  ]
}
export const evaluationCatalogV77 = { ...evaluationCatalogV76, ...frozen }
