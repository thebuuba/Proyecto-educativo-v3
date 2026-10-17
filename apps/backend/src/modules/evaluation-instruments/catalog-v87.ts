import { evaluationCatalogV86 } from './catalog-v86'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.87",
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
    },
    {
      "id": "ciencias-naturaleza-comun-2",
      "grade": 2,
      "topics": [
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "bioelements",
          "label": "bioelementos y moléculas de la materia viva",
          "match": "bioelement\\w*|moleculas? (?:de la materia viva|constituyentes)|elementos y moleculas|materia viva",
          "relation": "la relación de los elementos o moléculas solicitados con la composición y las funciones de la materia viva",
          "exclude": "niveles de organizacion|organizacion de la materia"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "organization",
          "label": "niveles de organización de la materia viva",
          "match": "niveles? de organizacion|organizacion de la materia viva",
          "relation": "la relación entre los niveles de organización solicitados, distinguiendo sus componentes y su integración"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "cells",
          "label": "organización celular",
          "match": "celul\\w*|eucariot\\w*|procariot\\w*|organel\\w*|organul\\w*",
          "relation": "la organización y las relaciones entre las estructuras y funciones del tipo celular solicitado",
          "exclude": "mitosis|division celular"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "mitosis",
          "label": "división celular por mitosis",
          "match": "mitosis|division celular",
          "relation": "la secuencia de la mitosis y la distribución de la información genética en las células resultantes según el modelo estudiado"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "tissues",
          "label": "tejidos, órganos y sistemas",
          "match": "tejidos?|organos?|sistemas? de organos",
          "relation": "la relación entre la organización de tejidos, órganos o sistemas solicitados y sus funciones",
          "exclude": "organel|organul|organos reproductores|aparatos reproductores"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "photosynthesis",
          "label": "fotosíntesis",
          "match": "fotosintesis",
          "relation": "la transformación de materia y energía durante la fotosíntesis, según las condiciones y evidencias solicitadas"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "metabolism",
          "label": "metabolismo y enzimas",
          "match": "metabolismo|enzimas?|reacciones enzimaticas",
          "relation": "la función catalítica de las enzimas y su relación con las reacciones metabólicas examinadas"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "denaturation",
          "label": "temperatura y desnaturalización en procesos biológicos",
          "match": "desnaturalizacion|calor y temperatura",
          "relation": "el efecto de las condiciones térmicas estudiadas sobre la estructura y función de las moléculas biológicas"
        },
        {
          "grade": 2,
          "pages": [
            296
          ],
          "id": "biomechanics",
          "label": "principios físicos de sistemas biológicos",
          "match": "corazon|vision|brazo|contraccion muscular|palanca",
          "relation": "el principio físico solicitado y su relación con la función del corazón, la visión o el sistema de palancas examinado"
        },
        {
          "grade": 2,
          "pages": [
            296,
            297
          ],
          "id": "genes",
          "label": "genes, genotipo, fenotipo y mutaciones",
          "match": "genes?|genotip\\w*|fenotip\\w*|mutacion\\w*|genetica",
          "relation": "la relación entre información genética, características observables y variación, sin asumir que toda mutación determina una enfermedad",
          "exclude": "ingenieria genetica"
        },
        {
          "grade": 2,
          "pages": [
            296,
            297
          ],
          "id": "nucleic-acids",
          "label": "ADN y ARN",
          "match": "adn|arn|desoxirribonucleico|ribonucleico|doble helice",
          "relation": "la estructura y función del ácido nucleico solicitado, distinguiendo almacenamiento de información y participación en su expresión cuando se comparan"
        },
        {
          "grade": 2,
          "pages": [
            297
          ],
          "id": "mendel",
          "label": "herencia mendeliana y árboles genealógicos",
          "match": "mendel\\w*|arbol genealogico|dominantes?|recesivos?",
          "relation": "las relaciones de herencia definidas por el problema o árbol proporcionado, sin extender un modelo mendeliano simple a todos los rasgos humanos"
        },
        {
          "grade": 2,
          "pages": [
            296,
            297
          ],
          "id": "hereditary-disease",
          "label": "enfermedades y síndromes hereditarios",
          "match": "enfermedad\\w* hereditari\\w*|sindromes? genetic\\w*",
          "relation": "la relación entre herencia y el síndrome o enfermedad del caso ficticio o fuente, sin inferir diagnósticos personales"
        },
        {
          "grade": 2,
          "pages": [
            297
          ],
          "id": "genetic-engineering",
          "label": "ingeniería genética y genoma humano",
          "match": "ingenieria genetica|genoma humano",
          "relation": "la modificación o estudio de información genética y la aplicación indicada en medicina o agricultura, distinguiendo posibilidades, evidencia y límites"
        },
        {
          "grade": 2,
          "pages": [
            296,
            297
          ],
          "id": "reproduction",
          "label": "reproducción sexual y asexual",
          "match": "reproduccion|biparticion|fision|esporulacion|gametogenesis",
          "relation": "las características del mecanismo reproductivo solicitado y la participación o ausencia de gametos cuando se comparan modalidades"
        },
        {
          "grade": 2,
          "pages": [
            296,
            297
          ],
          "id": "reproductive-system",
          "label": "aparatos reproductores y hormonas sexuales",
          "match": "(?:aparatos?|organos?) reproductores?|hormonas? sexuales?|accion de las hormonas",
          "relation": "la relación entre estructuras, funciones o cambios biológicos y las hormonas o aparatos reproductores solicitados"
        },
        {
          "grade": 2,
          "pages": [
            297
          ],
          "id": "pregnancy",
          "label": "ciclo menstrual, fecundación, embarazo y parto",
          "match": "ciclo menstrual|fecundacion|embarazo|parto",
          "relation": "la secuencia o relación biológica solicitada y las consecuencias examinadas con fuentes o casos ficticios, sin inferir información personal"
        },
        {
          "grade": 2,
          "pages": [
            297
          ],
          "id": "evolution",
          "label": "evolución y adaptación",
          "match": "evolucion|darwin|lamarck|seleccion natural|adaptacion|fosil\\w*|diversidad de los seres vivos.*(?:tiempo|generacion)",
          "relation": "las evidencias de cambio de las poblaciones a través de generaciones y las explicaciones históricas solicitadas, sin atribuir cambios heredables a una necesidad del individuo"
        },
        {
          "grade": 2,
          "pages": [
            297
          ],
          "id": "metamorphosis",
          "label": "metamorfosis",
          "match": "metamorfosis",
          "relation": "la secuencia de cambios del organismo durante su desarrollo, sin confundirla con evolución de una población"
        },
        {
          "grade": 2,
          "pages": [
            298
          ],
          "id": "biodiversity",
          "label": "biodiversidad, dominios y reinos",
          "match": "diversidad biologica|biodiversidad|dominios?|reinos?",
          "relation": "las características biológicas que sustentan la biodiversidad o la clasificación de los organismos solicitados"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "ecosystems",
          "label": "ecosistemas y sucesión ecológica",
          "match": "ecosistemas?|sucesion ecologica|ecologia",
          "relation": "la relación entre componentes e interacciones del ecosistema solicitado y sus cambios cuando se estudia sucesión"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "food-energy",
          "label": "flujo de energía y cadenas alimenticias",
          "match": "flujo de energia|cadena alimenticia|cadena alimentaria",
          "relation": "la dirección de la transferencia de energía entre los organismos y las relaciones alimentarias solicitadas"
        },
        {
          "grade": 2,
          "pages": [
            298
          ],
          "id": "biotechnology",
          "label": "biotecnología, acuacultura, viveros y huertos",
          "match": "biotecnolog\\w*|acuacultura|viveros?|huertos?|invernaderos?",
          "relation": "la aplicación biológica solicitada y su relación con la producción o conservación, reconociendo condiciones y límites de la propuesta"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "natural-resources",
          "label": "recursos naturales y desarrollo sostenible",
          "match": "recursos naturales|desarrollo sostenible|parques nacionales|situacion ambiental",
          "relation": "la relación entre el recurso natural, su uso y la conservación o sostenibilidad en el caso dominicano solicitado"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "pollution",
          "label": "contaminación y manejo de residuos",
          "match": "contaminacion|contaminantes|reducir|reusar|reciclar",
          "relation": "la relación entre fuentes, medio afectado y consecuencias de la contaminación o las medidas de manejo de residuos solicitadas"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "climate",
          "label": "clima, calentamiento global y cambio climático",
          "match": "clima|calentamiento global|cambio climatico",
          "relation": "la relación entre las condiciones climáticas o su cambio y los efectos sobre los seres vivos examinados"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "immunity",
          "label": "sistema inmunológico",
          "match": "inmunolog\\w*|inmunitari\\w*|autoinmun\\w*|asma|alergias?",
          "relation": "la función de defensa y la alteración inmunitaria del caso ficticio solicitado, sin equiparar alergia, autoinmunidad y deficiencia inmunitaria"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "nutrition",
          "label": "nutrición, alimentos y enfermedades metabólicas",
          "match": "nutricion|alimentos?|alimentari\\w*|metabolic\\w*|vitaminic\\w*|diabetes|obesidad|intolerancia",
          "relation": "la relación entre alimentación, necesidades del organismo y las alteraciones del caso o fuente, sin diagnosticar personas ni prescribir tratamientos"
        },
        {
          "grade": 2,
          "pages": [
            298
          ],
          "id": "infection",
          "label": "enfermedades infecciosas",
          "match": "virus|bacterias?|hongos?|infeccios\\w*",
          "relation": "la relación entre el agente señalado y la enfermedad o prevención estudiada, sin equiparar virus, bacterias y hongos"
        },
        {
          "grade": 2,
          "pages": [
            297,
            298
          ],
          "id": "hygiene",
          "label": "higiene y prevención de enfermedades",
          "match": "higiene|prevencion (?:de enfermedades|y tratamiento)",
          "relation": "la relación de las medidas de higiene solicitadas con la prevención indicada en las fuentes o el caso, sin añadir prescripciones personales"
        }
      ],
      "policy": "REQUESTED_SCIENTIFIC_ACTIONS_V1"
    }
  ]
}
export const evaluationCatalogV87 = { ...evaluationCatalogV86, ...frozen }
