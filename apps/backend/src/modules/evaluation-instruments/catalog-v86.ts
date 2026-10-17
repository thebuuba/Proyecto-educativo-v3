import { evaluationCatalogV85 } from './catalog-v85'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.86",
  "scienceCommonModules": [
    {
      "id": "ciencias-naturaleza-comun-1",
      "grade": 1,
      "topics": [
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "density",
          "label": "masa, volumen y densidad",
          "match": "densidad|masa y volumen",
          "relation": "la densidad como relación entre masa y volumen de la muestra, sin confundir masa con peso"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "earth-structure",
          "label": "estructura interna de la Tierra",
          "match": "estructura interna|capas (?:internas |de la tierra)|nucleo terrestre|manto terrestre",
          "relation": "las capas internas solicitadas de la Tierra y las propiedades físicas o químicas que las distinguen"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "hydrosphere",
          "label": "hidrosfera",
          "match": "hidrosfera",
          "relation": "la distribución del agua de la hidrosfera y las propiedades indicadas en la actividad"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "atmosphere",
          "label": "atmósfera",
          "match": "atmosfera|atmosferic\\w*",
          "relation": "las capas o propiedades atmosféricas solicitadas y su relación con el fenómeno estudiado"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "formation",
          "label": "formación y evolución de la Tierra",
          "match": "formacion (?:del planeta|de la tierra)|evolucion del planeta",
          "relation": "la secuencia de formación o evolución terrestre solicitada y las evidencias disponibles"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "tectonics",
          "label": "deriva continental y placas tectónicas",
          "match": "deriva continental|placas? tectonic\\w*|movimiento de la corteza",
          "relation": "el movimiento de placas y la relación de sus límites con las evidencias geológicas examinadas"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "earth-motions",
          "label": "movimientos de la Tierra",
          "match": "rotacion|traslacion|movimientos? (?:de la tierra|lineal|rotacional)",
          "relation": "el movimiento terrestre solicitado y su efecto, distinguiendo rotación y traslación cuando se comparan"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "forces",
          "label": "fuerzas que afectan la Tierra",
          "match": "fuerzas?|coriolis|friccion|gravitacion\\w*|boyante",
          "relation": "la interacción que origina la fuerza solicitada, su dirección y su efecto en la situación terrestre estudiada"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "fossils",
          "label": "seres vivos y fósiles",
          "match": "fosil\\w*|seres vivos|evolucion de las especies",
          "relation": "las características de los fósiles o seres vivos solicitados como evidencias de cambios a través del tiempo"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "rocks",
          "label": "rocas, minerales y ciclo de las rocas",
          "match": "rocas?|minerales?",
          "relation": "las propiedades que permiten reconocer rocas o minerales y las transformaciones del ciclo de las rocas cuando se solicitan"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "magma",
          "label": "magma",
          "match": "magma",
          "relation": "el magma como material rocoso fundido y su relación con los procesos geológicos solicitados"
        },
        {
          "grade": 1,
          "pages": [
            293,
            294
          ],
          "id": "soil",
          "label": "suelo",
          "match": "suelo",
          "relation": "las características del suelo solicitadas y su relación con los procesos o cambios observados",
          "exclude": "erosion|contaminacion"
        },
        {
          "grade": 1,
          "pages": [
            293,
            294
          ],
          "id": "erosion",
          "label": "erosión y deforestación",
          "match": "erosion\\w*|deforestacion",
          "relation": "la remoción o transporte de materiales y el efecto de los agentes o de la pérdida de cobertura vegetal indicados"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "water-cycle",
          "label": "ciclo del agua",
          "match": "ciclo (?:del agua|hidrologico)",
          "relation": "los cambios de estado y desplazamientos del agua solicitados, conservando la continuidad del ciclo"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "water",
          "label": "agua",
          "match": "agua",
          "relation": "las propiedades o distribución del agua solicitadas y su relación con la situación estudiada",
          "exclude": "ciclo|contaminacion|filtro"
        },
        {
          "grade": 1,
          "pages": [
            293
          ],
          "id": "air",
          "label": "aire",
          "match": "aire",
          "relation": "las propiedades del aire solicitadas y las evidencias disponibles para describirlas",
          "exclude": "contaminacion|atmosfer|humedad|higrometro"
        },
        {
          "grade": 1,
          "pages": [
            293,
            294
          ],
          "id": "volcanoes",
          "label": "volcanes y erupciones",
          "match": "volcan\\w*|erupcion\\w*|hot spots|plumas",
          "relation": "la relación del magma y los procesos volcánicos con las formas, tipos o efectos pedidos",
          "facets": [
            {
              "id": "formation",
              "match": "forman|formacion",
              "label": "formación de los volcanes",
              "relation": "el ascenso de magma y su relación con la formación del volcán estudiado"
            },
            {
              "id": "parts",
              "match": "partes|estructura",
              "label": "partes de los volcanes",
              "relation": "las partes solicitadas del volcán y la conexión que permite el desplazamiento del magma"
            },
            {
              "id": "eruptions",
              "match": "tipos de erupciones|diferentes.*erupciones",
              "label": "tipos de erupciones volcánicas",
              "relation": "las características que diferencian los tipos de erupciones solicitados"
            },
            {
              "id": "risks",
              "match": "riesgos|poblaciones",
              "label": "riesgos volcánicos",
              "relation": "la relación entre el fenómeno volcánico y la exposición de las poblaciones cercanas indicadas"
            }
          ]
        },
        {
          "grade": 1,
          "pages": [
            293,
            294
          ],
          "id": "earthquakes",
          "label": "sismos, ondas y fallas",
          "match": "sismos?|terremotos?|fallas? geologic\\w*|fallas|ondas sismicas",
          "relation": "el origen del sismo y la propagación de sus ondas, distinguiendo magnitud y efectos cuando la consigna los incluye"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "winds",
          "label": "vientos",
          "match": "vientos?",
          "relation": "el movimiento del aire y las diferencias de presión o condiciones disponibles que permiten explicarlo"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "weather",
          "label": "tiempo y clima",
          "match": "tiempo y clima|tiempo atmosferico|(?:el nino|la nina)",
          "relation": "las condiciones atmosféricas y su escala temporal, distinguiendo tiempo y clima o el fenómeno indicado"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "acid-rain",
          "label": "lluvia ácida",
          "match": "lluvia acida",
          "relation": "la relación entre contaminantes atmosféricos, precipitación y efectos de la lluvia ácida"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "storms",
          "label": "tormentas y ciclones tropicales",
          "match": "tormentas?|ciclon\\w*|huracan\\w*",
          "relation": "las condiciones y características de la tormenta o ciclón solicitado y sus efectos o riesgos documentados"
        },
        {
          "grade": 1,
          "pages": [
            293,
            294
          ],
          "id": "pollution",
          "label": "contaminación del suelo, agua o aire",
          "match": "contaminacion|contaminantes",
          "relation": "la relación entre la fuente contaminante, el medio afectado y las evidencias del efecto solicitado"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "energy",
          "label": "energía renovable, no renovable y eficiencia",
          "match": "energia|eficiencia energetic\\w*",
          "relation": "el origen de la energía estudiada, su carácter renovable o no renovable y la eficiencia cuando se solicita"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "radiation",
          "label": "radiación y salud",
          "match": "radiacion\\w*",
          "relation": "el tipo de radiación y la relación con la exposición o efecto en la salud especificados, sin generalizar riesgos entre tipos"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "climate-change",
          "label": "calentamiento global y cambio climático",
          "match": "calentamiento global|cambio climatico",
          "relation": "la relación entre calentamiento global y cambio climático, distinguiendo causas, evidencias y efectos solicitados"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "hygrometer",
          "label": "higrómetro y humedad del aire",
          "match": "higrometro|humedad del aire",
          "relation": "la relación entre la respuesta observable del higrómetro y la humedad que permite estimar, con sus limitaciones"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "water-filter",
          "label": "filtro de agua",
          "match": "filtro (?:de|para|del)|filtracion",
          "relation": "la separación de partículas por el filtro solicitado y sus limitaciones: filtrar no garantiza potabilidad"
        },
        {
          "grade": 1,
          "pages": [
            294
          ],
          "id": "solar-system",
          "label": "sistema solar",
          "match": "sistema solar",
          "relation": "la organización o relación de los cuerpos del sistema solar solicitados, reconociendo los límites de la representación"
        }
      ],
      "policy": "REQUESTED_SCIENTIFIC_ACTIONS_V1"
    }
  ]
}
export const evaluationCatalogV86 = { ...evaluationCatalogV85, ...frozen }
