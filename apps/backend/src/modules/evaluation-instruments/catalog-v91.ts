import { evaluationCatalogV90 } from './catalog-v90'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.91",
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
    },
    {
      "id": "ciencias-naturaleza-comun-3",
      "grade": 3,
      "topics": [
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "science-models",
          "label": "modelos, leyes, teorías y evidencias científicas",
          "match": "modelos,? (?:principios,? )?leyes|teorias cientificas|afirmacion sobre ciencias fisicas|naturaleza de la ciencia",
          "relation": "la función explicativa y los límites de los modelos, leyes o teorías solicitados y su contraste con evidencias verificables"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "measurement",
          "label": "medición, incertidumbre, estimación y unidades",
          "match": "medicion\\w*|incertidumbre|estimacion|unidades y estandares|patrones estandar|orden de magnitud",
          "relation": "la magnitud, el patrón o unidad y la resolución de la medición solicitada, distinguiendo valor medido, estimación e incertidumbre cuando correspondan"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "position",
          "label": "posición, desplazamiento y trayectoria",
          "match": "marco de referencia|posicion|desplazamiento|trayectoria|distancia y longitud",
          "relation": "el marco de referencia y la diferencia entre posición, cambio de posición y longitud de la trayectoria solicitados",
          "exclude": "trabajo mecanico"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "speed",
          "label": "velocidad y rapidez",
          "match": "velocidad|rapidez",
          "relation": "el cociente entre recorrido y tiempo para rapidez o entre desplazamiento y tiempo para velocidad media, atendiendo a la dirección cuando se solicita",
          "exclude": "aceleracion|sonido|luz|onda"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "acceleration",
          "label": "aceleración y cambio de velocidad",
          "match": "aceleracion|cambio de velocidad|cambio de rapidez",
          "relation": "el cambio de velocidad dividido por el intervalo de tiempo considerado, incluida la dirección cuando corresponda"
        },
        {
          "grade": 3,
          "pages": [
            300,
            301,
            303
          ],
          "id": "forces",
          "label": "fuerzas y dinámica",
          "match": "fuerzas?|dinamica|movimiento deportivo|fisica (?:a|en) los deportes",
          "relation": "la interacción que origina la fuerza solicitada y su relación con el cambio de movimiento o la situación examinada",
          "exclude": "presion|trabajo mecanico|empuje|pascal|arquimedes"
        },
        {
          "grade": 3,
          "pages": [
            300,
            301
          ],
          "id": "gravitation",
          "label": "gravitación y movimiento astronómico",
          "match": "gravitacion|gravedad(?:es)?|planetas|movimientos en el sistema solar|galaxias",
          "relation": "la interacción gravitatoria y su relación con el movimiento o los efectos de la gravedad examinados, sin confundir masa y peso"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "momentum",
          "label": "cantidad de movimiento y choques",
          "match": "cantidad de movimiento|choques?",
          "relation": "el producto de masa y velocidad y el intercambio de cantidad de movimiento en el sistema de choque delimitado"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "machines",
          "label": "estructuras, máquinas y poleas",
          "match": "estructuras,? maquinas|maquinas?|poleas?",
          "relation": "la disposición y función de los elementos de la máquina o polea solicitada y la transmisión de fuerza o movimiento según su diseño",
          "exclude": "cuerpo humano como maquina|dialisis"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "matter-mixtures",
          "label": "sustancias, mezclas y coloides",
          "match": "sustancias,? mezclas|mezclas?|coloides?|miscibles?|emulsiones?|detergentes?",
          "relation": "la composición y distribución de los componentes solicitados, distinguiendo sustancias y mezclas o las fases de los sistemas examinados",
          "exclude": "separacion|filtracion|decantacion|destilacion|cromatografia|luces|pigmentos"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "separation",
          "label": "separación de mezclas",
          "match": "separacion|filtracion|decantacion|evaporacion|destilacion|floculacion|cromatografia",
          "relation": "la propiedad física de los componentes que permite la separación solicitada, sin atribuir una transformación química por el solo hecho de separarlos"
        },
        {
          "grade": 3,
          "pages": [
            300
          ],
          "id": "physical-chemical-changes",
          "label": "cambios físicos y químicos",
          "match": "cambios? fisicos? y quimicos?|cambios? quimicos?",
          "relation": "la conservación o modificación de la composición de las sustancias y las evidencias que permiten distinguir el cambio solicitado",
          "exclude": "alimentos|farmacos"
        },
        {
          "grade": 3,
          "pages": [
            300,
            301
          ],
          "id": "mechanical-energy",
          "label": "energía cinética, potencial y trabajo mecánico",
          "match": "energia cinetica|energia potencial|trabajo mecanico|conservacion de energia",
          "relation": "la relación entre movimiento, posición, trabajo y transferencia o conservación de energía en el sistema delimitado y las condiciones del caso",
          "exclude": "circuitos?"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "thermal-energy",
          "label": "energía térmica",
          "match": "energia termica|transferencia termica",
          "relation": "la energía asociada al estado térmico y su transferencia en el sistema y las condiciones examinados"
        },
        {
          "grade": 3,
          "pages": [
            300,
            301
          ],
          "id": "solar-energy",
          "label": "energía y radiación solar",
          "match": "energia solar|radiacion solar|energia y radiacion (?:en el|del) sistema solar",
          "relation": "la procedencia solar de la energía y sus transferencias o transformaciones examinadas sin confundirlas con el movimiento orbital"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "matter-states",
          "label": "estados y cambios de estado de la materia",
          "match": "estados? de la materia|solidos,? liquidos y gases|cambios? de estado",
          "relation": "las propiedades o transiciones del estado de agregación solicitado, sin confundir un cambio de estado con una nueva sustancia",
          "exclude": "presion|densidad|gas ideal"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "pressure",
          "label": "presión",
          "match": "presion",
          "relation": "la fuerza normal por unidad de área y la transmisión o variación de presión examinada según el medio y las condiciones del caso",
          "exclude": "sanguinea|circulacion|gas ideal"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "density",
          "label": "densidad",
          "match": "densidad",
          "relation": "el cociente entre masa y volumen en las condiciones especificadas, sin confundir densidad con peso o cantidad de materia"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "fluids",
          "label": "empuje, Arquímedes, Pascal y vasos comunicantes",
          "match": "empuje|boyante|arquimedes|pascal|vasos comunicantes|objeto en un fluido",
          "relation": "la fuerza de empuje o transmisión de presión del fluido solicitada, distinguiendo las condiciones de aplicación de Arquímedes y Pascal"
        },
        {
          "grade": 3,
          "pages": [
            300,
            301
          ],
          "id": "material-properties",
          "label": "propiedades de materiales y dureza",
          "match": "propiedades (?:de la materia|fisicas|quimicas|mecanicas|opticas|termicas|electricas|magneticas)|dureza",
          "relation": "la propiedad observable o medible del material solicitado y el criterio consistente con que se compara o clasifica"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "temperature-heat",
          "label": "temperatura y calor",
          "match": "temperatura|calor",
          "relation": "la diferencia entre temperatura y energía transferida como calor en las condiciones examinadas",
          "exclude": "gas ideal|calorias"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "ideal-gas",
          "label": "gas ideal",
          "match": "gas ideal",
          "relation": "la relación entre presión, volumen, temperatura y cantidad de gas del modelo ideal, reconociendo las condiciones que permanecen constantes"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "surface-capillarity",
          "label": "tensión superficial y capilaridad",
          "match": "tension superficial|capilaridad",
          "relation": "la relación entre interacciones del líquido, superficie y contacto con el entorno que explica el fenómeno solicitado"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "osmosis",
          "label": "ósmosis",
          "match": "osmosis",
          "relation": "el movimiento neto de agua a través de una membrana selectiva según las condiciones del modelo, sin confundirlo con el transporte de cualquier soluto"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "body-energy",
          "label": "energía, metabolismo y termodinámica humana",
          "match": "atp|adenosin|calorias|metabolismo humano|termodinamica en el (?:ser|cuerpo) humano|cuerpo humano como maquina|energia del cuerpo|energia y el cuerpo",
          "relation": "las transformaciones y transferencias de energía del organismo solicitadas, distinguiendo energía química, trabajo y disipación sin tratar el cuerpo como un sistema perfectamente eficiente"
        },
        {
          "grade": 3,
          "pages": [
            301
          ],
          "id": "biophysical-systems",
          "label": "principios físicos de circulación y diálisis",
          "match": "circulacion|circulatorio|presion sanguinea|rinon artificial|dialisis|acumulacion de sangre|bombear la sangre|vasos sanguineos",
          "relation": "el principio físico y su relación con el transporte o intercambio del sistema biológico o modelo proporcionado, sin inferir diagnósticos personales"
        },
        {
          "grade": 3,
          "pages": [
            301,
            302
          ],
          "id": "atomic-models",
          "label": "modelos y partes del átomo",
          "match": "modelos? atomic\\w*|partes del atomo|estructura e interacciones en la materia",
          "relation": "la disposición y función de los componentes del modelo atómico solicitado y sus alcances o limitaciones según las evidencias estudiadas"
        },
        {
          "grade": 3,
          "pages": [
            301,
            302
          ],
          "id": "isotopes",
          "label": "masa atómica e isótopos",
          "match": "masa atomica|isotop\\w*",
          "relation": "la identidad del elemento y la diferencia de masa entre sus isótopos, o la media ponderada por abundancia cuando se solicita calcular la masa atómica"
        },
        {
          "grade": 3,
          "pages": [
            301,
            302
          ],
          "id": "periodic-table",
          "label": "tabla periódica y elementos",
          "match": "tabla periodica|propiedades periodicas|elementos quimicos",
          "relation": "la organización de los elementos y las propiedades periódicas o composición elemental solicitadas, utilizando las referencias de la tabla estudiada"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "chemical-bonds",
          "label": "enlaces químicos",
          "match": "enlaces?(?: quimicos)?",
          "relation": "las interacciones y distribución electrónica representadas en el tipo de enlace solicitado, distinguiendo el modelo y sus límites"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "chemical-reactions",
          "label": "reacciones químicas y estequiometría",
          "match": "reaccion\\w* quimic\\w*|estequiometria",
          "relation": "la transformación de reactivos en productos y las proporciones de la reacción indicada, conservando átomos y carga cuando corresponda al problema"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "enzymes",
          "label": "enzimas e interacciones químicas en seres vivos",
          "match": "enzimas?|enzimatic\\w*|interacciones quimicas en los seres vivos",
          "relation": "el papel catalítico de las enzimas o las interacciones químicas biológicas solicitadas, sin atribuir a un catalizador el cambio del balance global de la reacción"
        },
        {
          "grade": 3,
          "pages": [
            300,
            302
          ],
          "id": "solutions",
          "label": "soluciones, concentración y solubilidad",
          "match": "soluciones?|concentracion|solubilidad",
          "relation": "la proporción entre soluto y solución o el límite de disolución en las condiciones indicadas, distinguiendo concentración de solubilidad",
          "exclude": "resolucion de problemas|busqueda de soluciones|diseno.*soluciones"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "acids-ph",
          "label": "ácidos, bases, sales y pH",
          "match": "acidos?|bases y sales|ph|sustancias comunes",
          "relation": "las propiedades ácido-base o la interpretación del pH en las condiciones proporcionadas, sin confundir pH con cantidad total de sustancia"
        },
        {
          "grade": 3,
          "pages": [
            302,
            303
          ],
          "id": "waves",
          "label": "ondas y magnitudes ondulatorias",
          "match": "movimiento ondulatorio|ondas?|longitud de onda|amplitud|frecuencia|periodo",
          "relation": "la propagación de la perturbación y las relaciones entre longitud de onda, frecuencia, período o velocidad solicitadas, distinguiendo transporte de energía de transporte neto de materia",
          "exclude": "comunicacion|ondas sonoras|reflexion|refraccion|difraccion|interferencia|resonancia|estacionarias"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "wave-phenomena",
          "label": "reflexión, refracción, difracción, interferencia y resonancia",
          "match": "reflexion|refraccion|difraccion|interferencia|resonancia|estacionarias|direccion de la oscilacion",
          "relation": "el comportamiento ondulatorio solicitado y las condiciones de su interacción con medios, límites u otras ondas",
          "exclude": "colores|pigmentos|magnetica"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "sound",
          "label": "sonido, audición y ecolocalización",
          "match": "sonido|sonoras?|oido|audicion|ecolocalizacion|geolocalizacion|ultrasonido|sonar|radar|instrumentos musicales|timbre",
          "relation": "la producción, propagación o percepción del sonido y las características o aplicaciones solicitadas, distinguiendo frecuencia, intensidad y timbre cuando se comparan",
          "exclude": "sonografia"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "light-optics",
          "label": "luz, visión e instrumentos ópticos",
          "match": "luz|ojo|vision|espejos?|lentes?|dispositiv\\w* optic\\w*|instrumentos opticos|microscopio|telescopio|camara fotografica|polarizacion",
          "relation": "la propagación o interacción de la luz y la función del modelo visual o dispositivo óptico solicitado, sin valorar decoración ni realizar inferencias clínicas",
          "exclude": "colores|pigmentos|emision|absorcion|solar|velocidad de la luz"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "light-colors",
          "label": "colores, luces y pigmentos",
          "match": "colores|luces y pigmentos|color del|color de los|dispersion",
          "relation": "la interacción de la luz con las superficies o el medio y la mezcla aditiva o sustractiva solicitada, distinguiendo luz de pigmento"
        },
        {
          "grade": 3,
          "pages": [
            302
          ],
          "id": "radiation",
          "label": "espectro, emisión y aplicaciones de la radiación",
          "match": "radiacion|espectro electromagnetico|velocidad de la luz|rayos x|rayos gamma|resonancia magnetica|sonografia|tomografia|trazadores|incandescencia|fluorescencia|fosforescencia|laseres|emision|absorcion de luz",
          "relation": "la emisión, absorción o interacción de la radiación solicitada y los alcances de la aplicación descrita, distinguiendo radiación ionizante, no ionizante y ondas mecánicas cuando se comparan",
          "exclude": "solar"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "electric-charge",
          "label": "cargas y conductores eléctricos",
          "match": "cargas?|induccion|frotamiento|conductores?|no conductores",
          "relation": "la interacción o transferencia de carga y la respuesta de los materiales solicitados, distinguiendo electrización de creación de carga",
          "exclude": "conservacion de carga.*circuitos?"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "current-voltage",
          "label": "corriente, voltaje, pilas y baterías",
          "match": "corriente electrica|voltaje|pilas?|baterias?",
          "relation": "la diferencia entre flujo de carga y diferencia de potencial y su relación con los elementos o la relación eléctrica proporcionada"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "circuits",
          "label": "circuitos en serie y paralelo",
          "match": "circuitos?|sensores|dispositivos electricos",
          "relation": "las conexiones y relaciones de carga, corriente o energía solicitadas en el circuito dado, distinguiendo serie y paralelo cuando se comparan"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "bioelectricity",
          "label": "señales eléctricas del corazón y neuronas",
          "match": "neuronas?|potenciales? de accion|electrocardiogra\\w*|electrocardiograma|actividad electrica|fibrilacion|desfibrilador",
          "relation": "la conducción de señales o la actividad eléctrica representada del corazón o neuronas según el modelo proporcionado, sin inferir diagnósticos ni realizar intervenciones"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "environment",
          "label": "contaminación, clima y recursos naturales",
          "match": "contaminacion|calentamiento global|cambio climatico|recursos naturales|invernadero|pesticidas|combustibles fosiles",
          "relation": "la relación entre procesos físicos o químicos, evidencia ambiental y medidas justificadas en el caso solicitado, sin atribuir acciones de campo no realizadas"
        },
        {
          "grade": 3,
          "pages": [
            300,
            303
          ],
          "id": "food-medicines",
          "label": "conservación de alimentos y medicamentos",
          "match": "alimentos|medicamentos|farmacos",
          "relation": "los cambios, transferencias de energía o condiciones de conservación solicitados de alimentos o medicamentos según la fuente, sin prescribir tratamientos ni inventar prácticas",
          "exclude": "calorias|metabolismo humano"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "communication-technology",
          "label": "ciencias físicas y tecnología en salud o comunicación",
          "match": "tecnologia de la comunicacion|fisica,? quimica e ingenieria en salud|fisica,? la quimica y la ingenieria en la salud",
          "relation": "el principio físico o químico y las evidencias, alcances y límites de la aplicación tecnológica solicitada en comunicación o salud"
        },
        {
          "grade": 3,
          "pages": [
            300,
            303
          ],
          "id": "energy-conservation",
          "label": "transformaciones, conservación y uso eficiente de energía",
          "match": "energia y conservacion|cambios de (?:la )?energia|conservacion de (?:la )?energia|energia y su utilizacion|uso eficiente de energia",
          "relation": "las transferencias y transformaciones de energía del sistema solicitado y las medidas de uso eficiente justificadas con la evidencia disponible, sin confundir conservación con ausencia de disipación",
          "exclude": "cinetica|potencial|circuito|mecanico"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "electrical-safety",
          "label": "seguridad y riesgos eléctricos",
          "match": "seguridad y riesgos electricos|riesgos electricos|seguridad electrica",
          "relation": "la relación entre el riesgo eléctrico identificado y las precauciones indicadas en la fuente o caso, sin ejecutar situaciones peligrosas ni añadir componentes"
        },
        {
          "grade": 3,
          "pages": [
            303
          ],
          "id": "natural-motion",
          "label": "movimientos en fenómenos naturales",
          "match": "movimientos? en (?:los )?fenomenos naturales|movimiento del fenomeno natural",
          "relation": "los cambios de movimiento observables en el fenómeno natural solicitado y su interpretación mediante las condiciones y evidencias disponibles"
        }
      ],
      "policy": "REQUESTED_SCIENTIFIC_ACTIONS_V1"
    },
    {
      "id": "ciencias-naturaleza-comun-4",
      "grade": 4,
      "topics": [
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "body-systems",
          "label": "organización y sistemas del cuerpo humano",
          "match": "sistemas del cuerpo|biologia humana|enfermedades de los sistemas",
          "relation": "la integración de las estructuras y funciones de los sistemas humanos solicitados o su alteración en el modelo o caso ficticio, sin diagnosticar personas"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "cell-theory",
          "label": "microscopio y teoría celular",
          "match": "microscop\\w*|teoria celular",
          "relation": "las evidencias obtenidas mediante microscopía y su relación con la teoría celular, según las fuentes o imágenes estudiadas"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "cells",
          "label": "organización celular",
          "match": "celulas?|organizacion celular|procariot\\w*|eucariot\\w*|organel\\w*|organul\\w*|citoplasma|nucleo",
          "relation": "la organización y las relaciones entre las estructuras y funciones celulares solicitadas",
          "exclude": "teoria celular|microscop|madre|mitosis|meiosis|especializacion|gametogenesis|espermatogenesis|ovogenesis|celulas sexuales|respiracion celular|energia celular|membrana"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "membrane-transport",
          "label": "transporte de membrana",
          "match": "membrana|difusion|osmosis|transporte activo",
          "relation": "el intercambio de sustancias según el gradiente y la participación de energía en el transporte solicitado, sin confundir difusión, ósmosis y transporte activo"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "tissues",
          "label": "especialización celular, tejidos, órganos y sistemas",
          "match": "especializacion celular|tejidos?|sistemas? de organos",
          "relation": "la especialización de las células y la integración de los tejidos, órganos y sistemas solicitados en sus funciones"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "transplants",
          "label": "trasplantes de órganos",
          "match": "trasplantes?",
          "relation": "la relación entre la función del órgano, la compatibilidad y los límites o cuestiones bioéticas examinados en las fuentes, sin prescribir decisiones clínicas"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "cell-energy",
          "label": "energía celular, ATP y mitocondria",
          "match": "energia celular|atp|trifosfato|mitocondria",
          "relation": "la transferencia de energía mediante ATP y las funciones mitocondriales solicitadas, sin equiparar la molécula con energía en sí misma"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "cell-respiration",
          "label": "respiración celular y fermentación",
          "match": "respiracion celular|aerobic\\w*|anaerobic\\w*|fermentacion|proceso respiratorio",
          "relation": "la transformación de materia y transferencia de energía en la vía estudiada, distinguiendo respiración celular y fermentación sin confundirlas con ventilación pulmonar"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "photosynthesis",
          "label": "fotosíntesis, pigmentos y cloroplastos",
          "match": "fotosintesis|fotosintet\\w*|cloroplast\\w*|fase luminosa|fase oscura",
          "relation": "la transformación de materia y energía y las funciones de pigmentos, cloroplastos o fases solicitadas; la fase llamada oscura no exige oscuridad"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "cell-division",
          "label": "mitosis y meiosis",
          "match": "mitosis|meiosis",
          "relation": "la distribución cromosómica y las etapas de la división solicitada, distinguiendo conservación de dotación en mitosis y reducción en meiosis"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "stem-cells",
          "label": "células madre",
          "match": "celulas? madre",
          "relation": "la autorrenovación y diferenciación de las células madre y los alcances de la aplicación solicitada según las fuentes"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "gametogenesis",
          "label": "formación de gametos",
          "match": "gametogenesis|espermatogenesis|ovogenesis|celulas sexuales",
          "relation": "la formación y maduración de los gametos solicitados, relacionando división celular y diferenciación sin equiparar los dos procesos"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "mendel",
          "label": "segunda y tercera leyes de Mendel",
          "match": "mendel\\w*|punnett|probabilidad.*herencia",
          "relation": "la segregación y distribución de alelos en el modelo del problema, usando la independencia solo cuando sus condiciones se cumplen, sin convertir probabilidades en resultados individuales seguros"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "chromosomes",
          "label": "cromosomas y genes",
          "match": "cromosom\\w*|genes?|principios basicos de la genetica|herencia",
          "relation": "la localización de genes en cromosomas y su participación en la herencia según el modelo solicitado, sin tratar toda característica como determinada por un solo gen",
          "exclude": "mendel|punnett|probabilidad|alelos multiples|grupo sanguine|mutaci|ligad[oa]s? al sexo|enfermedad|desorden|herencia y medio ambiente|teoria moderna"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "nucleic-acids",
          "label": "ADN y ARN",
          "match": "adn|arn|desoxirribonucleico|ribonucleico",
          "relation": "las estructuras y funciones de los ácidos nucleicos solicitados en el almacenamiento o expresión de la información genética",
          "exclude": "replicacion|codigo genetico|produccion de proteinas|sintesis de proteinas|recombinante"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "genetic-expression",
          "label": "código genético, replicación y proteínas",
          "match": "codigo genetico|replicacion|produccion de proteinas|sintesis de proteinas",
          "relation": "la correspondencia de la información genética y su uso en el proceso solicitado, distinguiendo replicación del ADN y producción de proteínas"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "blood-groups",
          "label": "alelos múltiples y grupos sanguíneos",
          "match": "alelos multiples|grupos? sanguine\\w*",
          "relation": "el modelo de alelos múltiples o codominancia del sistema sanguíneo indicado, sin inferir compatibilidad transfusional o parentescos personales"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "genetic-variation",
          "label": "mutaciones, herencia humana y ambiente",
          "match": "mutacion\\w*|herencia humana|herencia en los humanos|herencia y medio ambiente|ligad[oa]s? al sexo|enfermedades? hereditari\\w*|desordenes? genetic\\w*",
          "relation": "la variación genética y la influencia del ambiente en el caso estudiado, sin afirmar que toda mutación causa enfermedad ni inferir diagnósticos o historias familiares personales"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "genetic-engineering",
          "label": "ingeniería genética y ADN recombinante",
          "match": "ingenieria genetica|adn recombinante",
          "relation": "la modificación o combinación de información genética de la aplicación examinada y sus alcances, límites y evidencias, sin exigir intervenciones biológicas"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "life-origin",
          "label": "origen de la vida y primeros organismos",
          "match": "origen de la vida|atmosfera primitiva|primeros organismos",
          "relation": "las hipótesis y evidencias estudiadas sobre condiciones primitivas y primeros organismos, distinguiendo reconstrucciones científicas de observaciones directas"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "evolution-evidence",
          "label": "pruebas de evolución y fósiles",
          "match": "pruebas? (?:de la evolucion|evolutivas?)|evidencias? evolutivas?|fosil\\w*|anatomia|embriologia|bioquimica comparada",
          "relation": "las evidencias comparativas o fósiles solicitadas y sus límites para inferir relaciones e historia evolutiva",
          "exclude": "eras? (?:y periodos )?geologic|periodos geologic"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "evolution-theories",
          "label": "teorías evolutivas y adaptación",
          "match": "evolucion|evolutiv\\w*|lamarck|darwin|seleccion natural|adaptacion|convergencia|divergencia",
          "relation": "los mecanismos evolutivos o explicaciones históricas solicitados y las evidencias que los sustentan, sin atribuir adaptación heredable a necesidades individuales",
          "exclude": "pruebas? (?:de la evolucion|evolutivas?)|evidencias? evolutivas?|fosil|anatomia|embriologia|bioquimica comparada"
        },
        {
          "grade": 4,
          "pages": [
            312
          ],
          "id": "geological-time",
          "label": "eras y periodos geológicos",
          "match": "eras? (?:y periodos )?geologic\\w*|periodos geologic\\w*",
          "relation": "la secuencia y escala temporal de los intervalos geológicos solicitados y su relación con las evidencias biológicas disponibles"
        },
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "reproductive-system",
          "label": "sistemas reproductores humanos",
          "match": "sistemas? reproductores?|organos reproductores?|reproductores? (?:masculino|femenino)",
          "relation": "la relación entre estructuras y funciones reproductoras del modelo humano solicitado, sin requerir información íntima personal"
        },
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "development",
          "label": "desarrollo, embarazo, nacimiento y lactancia",
          "match": "concepcion|nacimiento|embarazo|lactancia|desarrollo de una nueva vida|vida en pareja",
          "relation": "los procesos de desarrollo o cuidados sustentados por las fuentes del caso ficticio, sin valorar decisiones familiares ni solicitar experiencias personales"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "sexual-health",
          "label": "anticoncepción e infecciones de transmisión sexual",
          "match": "anticonceptiv\\w*|transmision sexual|vih|sida",
          "relation": "los mecanismos preventivos o de transmisión solicitados y los límites de la información proporcionada, sin diagnosticar ni exigir divulgación de conductas personales"
        },
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "skeletal",
          "label": "sistema esquelético y huesos",
          "match": "esquelet\\w*|huesos?|fracturas?",
          "relation": "la estructura, constitución y función de los huesos o la alteración del sistema esquelético examinados en el modelo o caso ficticio"
        },
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "muscular",
          "label": "sistema muscular",
          "match": "muscul\\w*",
          "relation": "la relación entre el tipo, estructura y función del músculo o la lesión descritos en el modelo o caso ficticio, sin prescribir ejercicios terapéuticos"
        },
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "digestive",
          "label": "digestión y sistema digestivo",
          "match": "digestiv\\w*|digestion|ulcera|gastroenteritis|colitis|apendicitis|gastritis|tipos de alimentos",
          "relation": "la transformación de alimentos y la función de las estructuras o alteraciones digestivas solicitadas en el modelo o caso ficticio, sin diagnosticar a personas",
          "exclude": "enzimas?"
        },
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "metabolism",
          "label": "metabolismo y enzimas",
          "match": "metabolismo|enzimas?",
          "relation": "las transformaciones metabólicas solicitadas y la función catalítica de las enzimas cuando corresponda, sin confundir catalizador con reactivo consumido"
        },
        {
          "grade": 4,
          "pages": [
            313
          ],
          "id": "circulatory",
          "label": "sistema circulatorio y sangre",
          "match": "circulator\\w*|circulacion|sangre|hipertension|soplo|infarto",
          "relation": "la relación entre las estructuras circulatorias, los componentes sanguíneos y el transporte solicitado o la alteración del caso ficticio, sin emitir diagnósticos"
        },
        {
          "grade": 4,
          "pages": [
            312,
            313
          ],
          "id": "respiratory",
          "label": "sistema respiratorio e intercambio gaseoso",
          "match": "sistema respiratorio|intercambio de gases|pulmon\\w*|asma|neumonia|histoplasmosis|tuberculosis",
          "relation": "el intercambio de gases y la función o alteración respiratoria solicitados, distinguiendo ventilación de respiración celular, sin prescribir tratamientos"
        },
        {
          "grade": 4,
          "pages": [
            314
          ],
          "id": "excretory",
          "label": "sistema excretor y orina",
          "match": "excretor\\w*|orina|cistitis|calculo renal",
          "relation": "la formación de orina y la función o alteración de las estructuras excretoras solicitadas en el modelo o caso ficticio, sin prescribir cuidados clínicos"
        },
        {
          "grade": 4,
          "pages": [
            314
          ],
          "id": "nervous-hormonal",
          "label": "sistemas nervioso y hormonal",
          "match": "nervioso|hormonal|impulso nervioso|meningitis",
          "relation": "la transmisión o regulación solicitada y las relaciones entre las estructuras nerviosas u hormonales del modelo o caso ficticio, sin diagnosticar"
        },
        {
          "grade": 4,
          "pages": [
            314
          ],
          "id": "immunity",
          "label": "inmunidad, anticuerpos y vacunas",
          "match": "inmun\\w*|anticuerpos?|vacunas?",
          "relation": "la respuesta de defensa solicitada y las relaciones entre anticuerpos, vacunación o memoria inmunitaria cuando correspondan, sin equiparar todos los tipos de inmunidad"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "prevention",
          "label": "higiene y prevención de enfermedades",
          "match": "higiene|prevencion de enfermedades|prevenir las enfermedades|agentes constantes|cuidado e higiene",
          "relation": "la relación entre el mecanismo preventivo, el agente o riesgo señalado y la evidencia de las fuentes, sin evaluar hábitos privados ni obediencia"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "ecosystems",
          "label": "ecosistemas y factores ambientales",
          "match": "ecosistema\\w*|ecologia|factores del ambiente|bioticos?|abioticos?",
          "relation": "las relaciones entre los componentes bióticos y abióticos del ecosistema solicitado y su funcionamiento, sin exigir observaciones de campo no realizadas"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "populations",
          "label": "poblaciones y comunidades",
          "match": "poblacion\\w*|comunidades?",
          "relation": "la estructura, variación o crecimiento de las poblaciones y su relación con las comunidades según los datos solicitados, sin equiparar población con comunidad"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "matter-cycles",
          "label": "ciclos de materia y biogeoquímicos",
          "match": "ciclo\\w* (?:de la materia|biogeoquimic\\w*)",
          "relation": "la circulación de materia entre los componentes del ciclo solicitado, distinguiendo reciclaje de materia y transferencia de energía"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "food-energy",
          "label": "flujo de energía y pirámides ecológicas",
          "match": "flujo de energia|piramide\\w* ecologic\\w*",
          "relation": "la transferencia de energía o la magnitud representada por la pirámide solicitada, distinguiendo energía, biomasa y número de organismos cuando corresponda"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "symbiosis",
          "label": "relaciones entre especies y simbiosis",
          "match": "relaciones entre especies|simbiot\\w*|simbiosis",
          "relation": "los efectos de la interacción sobre las especies participantes del caso, distinguiendo las modalidades examinadas sin atribuir intenciones humanas"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "resources",
          "label": "recursos naturales",
          "match": "recursos naturales",
          "relation": "la clasificación y relación entre el uso de recursos y su renovación o conservación según las condiciones del caso"
        },
        {
          "grade": 4,
          "pages": [
            314
          ],
          "id": "food-sustainability",
          "label": "producción, distribución y sostenibilidad de alimentos",
          "match": "produccion y distribucion|sostenibilidad de alimentos|produccion de alimentos",
          "relation": "las relaciones entre producción, distribución y sostenibilidad alimentaria del caso solicitado, distinguiendo acceso a alimentos y cantidad producida"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "pollution",
          "label": "contaminación ambiental",
          "match": "contaminacion|contaminantes",
          "relation": "la relación entre fuentes contaminantes, medio afectado y efectos sustentados por las evidencias del caso, sin exigir muestreos adicionales"
        },
        {
          "grade": 4,
          "pages": [
            313,
            314
          ],
          "id": "climate-biomes",
          "label": "zonas climáticas, biomas y cambio climático",
          "match": "zonas climaticas|biomas?|cambio climatico|equilibrio ecologico",
          "relation": "las condiciones climáticas, biomas o efectos del cambio climático solicitados y su relación con biodiversidad o equilibrio del sistema según las fuentes, sin inferir una tendencia de un dato aislado"
        },
        {
          "grade": 4,
          "pages": [
            314
          ],
          "id": "classification",
          "label": "biodiversidad y clasificación de organismos",
          "match": "clasificacion moderna|sistema binomial|linneo|biodiversidad|bacteria\\w*|arqueo\\w*|protista\\w*|hongos?|plantas?|animales?",
          "relation": "las características estructurales y funcionales o relaciones que sustentan la clasificación solicitada, distinguiendo nomenclatura binomial y categorías taxonómicas",
          "exclude": "celula animal|celula vegetal|celulas? madre|cambio climatico|equilibrio ecologico"
        },
        {
          "grade": 4,
          "pages": [
            314
          ],
          "id": "viruses",
          "label": "estructura y función de virus",
          "match": "virus",
          "relation": "la organización acelular y la dependencia de células hospedadoras de los virus examinados, sin equipararlos con bacterias"
        },
        {
          "grade": 4,
          "pages": [
            314
          ],
          "id": "school-research",
          "label": "investigación e innovación escolar",
          "match": "biotecnolog\\w*|innovacion escolar|investigacion escolar|salud de impacto",
          "relation": "la relación entre el problema delimitado, la evidencia y la propuesta de investigación o innovación escolar solicitada, sin atribuir implementaciones ni resultados no realizados"
        }
      ],
      "policy": "REQUESTED_SCIENTIFIC_ACTIONS_V1"
    },
    {
      "id": "ciencias-naturaleza-comun-5",
      "grade": 5,
      "topics": [
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "atomic-models",
          "label": "modelos atómicos",
          "match": "modelos? atomic\\w*|teoria atomica|particulas? subatomic\\w*",
          "relation": "las características y límites del modelo atómico solicitado y su correspondencia con las evidencias disponibles, sin presentar orbitales como órbitas clásicas"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "energy-levels",
          "label": "niveles y subniveles de energía",
          "match": "niveles? de energia|subniveles?",
          "relation": "la organización de estados de energía del átomo según el modelo solicitado, distinguiendo nivel, subnivel y orbital sin equiparar sus significados",
          "exclude": "bloques?"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "quantum-numbers",
          "label": "números cuánticos",
          "match": "numeros? cuantic\\w*",
          "relation": "los valores permitidos y las relaciones entre los números cuánticos solicitados, según el estado electrónico representado"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "pauli-hund",
          "label": "reglas de ocupación de orbitales",
          "match": "pauli|hund",
          "relation": "la ocupación de orbitales según la regla solicitada, distinguiendo exclusión de estados y distribución en orbitales degenerados sin exigir ambas reglas si solo se pide una"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "electron-configuration",
          "label": "configuración electrónica",
          "match": "configuracion\\w* electronic\\w*",
          "relation": "la distribución de electrones del átomo o ion indicado respetando capacidad y ocupación de los subniveles del modelo solicitado"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "periodic-position",
          "label": "posición en la tabla periódica",
          "match": "grupos? y periodos?|ubicacion.*tabla periodica|posicion.*tabla periodica",
          "relation": "la posición del elemento en el grupo y período indicados y las predicciones sustentadas por esa información, sin tratar una tendencia como regla sin excepciones"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "periodic-trends",
          "label": "propiedades periódicas",
          "match": "propiedades? periodic\\w*|radio atomic\\w*|electronegatividad|afinidad electronica|energia de ionizacion",
          "relation": "la tendencia de la propiedad periódica expresamente solicitada y sus condiciones, distinguiendo magnitud y sentido de variación según los datos disponibles"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "element-families",
          "label": "elementos químicos solicitados",
          "match": "no metales|metales|metaloides|gases nobles|hidrogeno|oxigeno|nitrogeno|carbono|fosforo|plomo|mercurio|hierro|calcio|magnesio|zinc|cobre|galio|silicio|germanio|arsenico|helio|neon|argon",
          "relation": "las propiedades, aplicaciones o efectos del elemento o grupo expresamente solicitado sustentados por las fuentes, sin exigir su obtención o manipulación",
          "exclude": "conductividad|semiconduct|compuestos de carbono|hibridacion|enlaces? (?:del|de) carbono|carbono en las estructuras"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "conductivity",
          "label": "conductividad de materiales",
          "match": "conductividad|conductores?|semiconductores?",
          "relation": "el comportamiento eléctrico o térmico solicitado según la estructura y condiciones de los materiales dados, sin equiparar conductividad eléctrica y térmica"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "periodic-blocks",
          "label": "bloques de la tabla periódica",
          "match": "bloques? (?:s|de la tabla)",
          "relation": "la correspondencia del bloque solicitado con el subnivel electrónico que se ocupa, distinguiendo bloques y grupos de la tabla"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "lewis-octet",
          "label": "estructuras de Lewis y regla del octeto",
          "match": "lewis|octeto",
          "relation": "la distribución de electrones de valencia y enlaces en la especie solicitada, reconociendo las excepciones al octeto pertinentes sin modificar su identidad química",
          "exclude": "resonan"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "resonance",
          "label": "resonancia química",
          "match": "resonantes?|resonancia",
          "relation": "las representaciones de una misma especie con distinta distribución electrónica, manteniendo conectividad y carga total sin presentarlas como moléculas que alternan",
          "exclude": "aromatic|benceno"
        },
        {
          "grade": 5,
          "pages": [
            316
          ],
          "id": "intramolecular-bonds",
          "label": "enlaces intramoleculares",
          "match": "intramoleculares?|enlaces? ionic\\w*|enlaces? covalent\\w*",
          "relation": "la distribución o transferencia electrónica del enlace solicitado y la relación entre sus partículas, sin confundirlo con fuerzas entre moléculas"
        },
        {
          "grade": 5,
          "pages": [
            316,
            317
          ],
          "id": "intermolecular-forces",
          "label": "fuerzas intermoleculares",
          "match": "intermoleculares?|puente de hidrogeno|van der waals",
          "relation": "la relación entre las interacciones entre partículas y el cambio físico solicitado, sin confundir ruptura de enlaces químicos con separación de moléculas"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "thermochemistry",
          "label": "termoquímica",
          "match": "termoquimic\\w*|exotermic\\w*|endotermic\\w*",
          "relation": "la transferencia de energía entre sistema y entorno en el proceso solicitado y el significado de liberación o absorción bajo las condiciones indicadas"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "enthalpy",
          "label": "entalpía de formación",
          "match": "entalpia",
          "relation": "la variación de entalpía del proceso especificado y su signo respecto al sistema delimitado, utilizando las condiciones y referencias dadas"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "gibbs-entropy",
          "label": "energía libre y entropía",
          "match": "gibbs|energia libre|entropia|termodinamica",
          "relation": "la relación termodinámica solicitada bajo las condiciones indicadas, distinguiendo espontaneidad de velocidad de reacción y el sistema de su entorno"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "gas-laws",
          "label": "gases ideales y reales",
          "match": "gas(?:es)? ideal\\w*|gas(?:es)? real\\w*|estado gaseoso|leyes? (?:de los|del|de) gases",
          "relation": "la relación entre presión, volumen, temperatura absoluta y cantidad de gas que corresponda al modelo dado, reconociendo sus condiciones de validez sin imponer magnitudes ausentes"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "reaction-types",
          "label": "tipos de reacciones químicas",
          "match": "tipos de reacciones|reacciones? de (?:analisis|sintesis|sustitucion|doble sustitucion)|sintesis y descomposicion|clasific\\w* las reacciones",
          "relation": "las transformaciones que distinguen la categoría de reacción solicitada según las especies de las ecuaciones dadas, sin sustituir evidencia por nombres memorizados"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "stoichiometry",
          "label": "estequiometría y balanceo de ecuaciones",
          "match": "estequiometr\\w*|balance(?:a|an|ar|e|en|o)\\s+(?:(?:la|las|una|de)\\s+)?(?:ecuacion|reaccion)|ecuacion\\w* quimic\\w*",
          "relation": "las proporciones de una ecuación balanceada y la conservación de átomos en la transformación solicitada, sin cambiar las fórmulas de las sustancias",
          "exclude": "reactivo limitante|reactivo en exceso"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "mass-conservation",
          "label": "conservación de la masa",
          "match": "conservacion de la masa|masas? antes y despues",
          "relation": "el balance de materia del sistema delimitado, distinguiendo transferencias con el entorno de una supuesta pérdida de materia"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "limiting-reactant",
          "label": "reactivo limitante y exceso",
          "match": "reactivo limitante|reactivo en exceso",
          "relation": "la comparación de cantidades según las proporciones estequiométricas de la reacción balanceada, identificando qué reactivo limita la transformación y el exceso cuando se solicite"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "equilibrium",
          "label": "equilibrio químico",
          "match": "le chatelier|equilibrio quimico|desplazamiento del equilibrio",
          "relation": "la respuesta del equilibrio dinámico al cambio de condiciones solicitado, sin equiparar igualdad de velocidades con igualdad de concentraciones"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "kinetics",
          "label": "cinética química",
          "match": "cinetica|velocidad de reaccion",
          "relation": "la relación entre el factor solicitado y la velocidad de reacción según las evidencias dadas, sin confundir velocidad, rendimiento de equilibrio y espontaneidad",
          "exclude": "energia de activacion|catalizador"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "activation-energy",
          "label": "energía de activación",
          "match": "energia\\w* de activacion",
          "relation": "la barrera energética de la vía de reacción representada, distinguiéndola de la variación energética entre reactivos y productos",
          "exclude": "catalizador"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "catalysis",
          "label": "catálisis",
          "match": "catalizador(?:es)?|catalisis",
          "relation": "la vía alternativa que permite el catalizador y su efecto sobre la velocidad, sin modificar la constante de equilibrio ni la diferencia energética entre reactivos y productos"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "hybridization",
          "label": "hibridación y orbitales moleculares",
          "match": "hibridacion|orbitales? moleculares?|\\bsp[123]?\\b",
          "relation": "la representación de orbitales y geometría del modelo solicitado, distinguiendo hibridación sp, sp2 y sp3 sin tratar el modelo como una trayectoria electrónica"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "carbon-bonds",
          "label": "enlaces sigma y pi",
          "match": "sigma|\\bpi\\b|enlaces? simples?|enlaces? dobles?|enlaces? triples?|enlaces? de los compuestos de carbono",
          "relation": "la combinación de enlaces sigma y pi del tipo de enlace solicitado, distinguiendo simple, doble y triple según el modelo estructural dado"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "organic-properties",
          "label": "propiedades de compuestos de carbono",
          "match": "diversidad.*compuestos de carbono|propiedades.*compuestos de carbono|compuestos? organic\\w*",
          "relation": "la relación entre la estructura y la propiedad del compuesto de carbono expresamente solicitado, sustentada por los datos o fuentes sin exigir síntesis química"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "functional-groups",
          "label": "grupos funcionales y mecanismos",
          "match": "grupos? funcionales|mecanismos? de reaccion",
          "relation": "la relación entre estructura, grupo funcional y mecanismo de reacción solicitado bajo las condiciones del modelo dado, sin generalizar un mecanismo a todos los sustratos",
          "exclude": "sn1|sn2|e1|e2|sustitucion nucleofilica|eliminacion|adicion electrofilica|aromatic"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "nucleophilic-substitution",
          "label": "sustitución nucleofílica",
          "match": "sn1|sn2|sustitucion nucleofilica",
          "relation": "los pasos y condiciones del mecanismo solicitado y su relación con sustrato, nucleófilo y grupo saliente del esquema dado, sin atribuir sustitución nucleofílica directa a un alcano sin grupo saliente"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "elimination",
          "label": "eliminación E1 y E2",
          "match": "\\be1\\b|\\be2\\b|eliminacion",
          "relation": "la formación del enlace múltiple y los pasos del mecanismo solicitado según sustrato y condiciones dados, distinguiendo eliminación y sustitución"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "electrophilic-addition",
          "label": "adición electrofílica",
          "match": "adicion electrofilica|\\bae\\b",
          "relation": "la transformación electrónica y formación de enlaces del mecanismo de adición solicitado en la estructura dada, sin generalizar un mecanismo a todo grupo funcional"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "aromatic-substitution",
          "label": "sustitución electrofílica aromática",
          "match": "sustitucion electrofilica aromatica|\\bsea\\b|sistema aromatico|especies de resonancia.*aromatic",
          "relation": "las etapas del esquema de sustitución aromática solicitado y las representaciones electrónicas pertinentes, distinguiendo resonancia de especies distintas o moléculas que alternan"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "lipids",
          "label": "lípidos",
          "match": "lipid\\w*",
          "relation": "las características químicas y evidencias que permiten reconocer el lípido solicitado, sin tratar a todos los lípidos como un único tipo de polímero"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "carbohydrates",
          "label": "carbohidratos",
          "match": "carbohidratos?|glucid\\w*",
          "relation": "las características estructurales y propiedades del carbohidrato solicitado según el modelo o evidencia dados"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "proteins",
          "label": "proteínas",
          "match": "proteinas?",
          "relation": "la relación entre composición, organización estructural y función de la proteína solicitada según la evidencia dada",
          "exclude": "enzim"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "nucleic-acids",
          "label": "ADN y ARN",
          "match": "adn|arn|acidos? nucleicos?",
          "relation": "la composición y organización química del ácido nucleico solicitado y su relación con la función descrita, distinguiendo ADN y ARN cuando se pida"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "enzymes",
          "label": "enzimas",
          "match": "enzimas?|enzimatic\\w*",
          "relation": "la acción catalítica de la enzima y las condiciones de la aplicación solicitada, sin atribuirle cambio del equilibrio de la reacción",
          "exclude": "inhib"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "enzyme-inhibitors",
          "label": "inhibición enzimática",
          "match": "inhibidores? enzimatic\\w*|inhibicion enzimatica",
          "relation": "la relación entre el inhibidor y la actividad enzimática según el modelo y condiciones dados, sin diagnosticar ni prescribir tratamientos"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "metabolic-pathways",
          "label": "rutas metabólicas",
          "match": "rutas? metabolic\\w*",
          "relation": "la secuencia de transformaciones y las relaciones entre sustratos, productos y regulación explícitamente representadas, sin añadir etapas o sustancias no solicitadas"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "earth-composition",
          "label": "composición química de la Tierra",
          "match": "capas de la tierra|composicion de corteza|corteza, manto|nucleo terrestre",
          "relation": "la composición de la capa terrestre solicitada y su relación con las evidencias del modelo, distinguiendo composición de estado físico o división mecánica"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "minerals-rocks",
          "label": "minerales y rocas",
          "match": "minerales?|rocas?",
          "relation": "las características y composición que permiten distinguir el mineral o roca solicitados, sin equiparar mineral y roca ni exigir recolección",
          "exclude": "datacion|edad radiometrica"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "dating",
          "label": "datación de rocas y fósiles",
          "match": "datacion|edad radiometrica",
          "relation": "la relación entre evidencia, modelo de datación y edad inferida en el caso dado, reconociendo condiciones y límites sin atribuir un método a cualquier muestra"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "greenhouse-gases",
          "label": "gases de efecto invernadero",
          "match": "efecto invernadero|\\bgei\\b",
          "relation": "la interacción radiativa de los gases solicitados y la relación entre emisiones y efectos sustentados por las fuentes, sin confundir efecto invernadero y destrucción del ozono"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "groundwater-pollution",
          "label": "contaminación y lixiviación de aguas subterráneas",
          "match": "lixiviacion|aguas? subterraneas?|agua subterranea|contaminacion",
          "relation": "el transporte de sustancias y las evidencias de contaminación del caso delimitado, sin exigir muestreo ni afirmar potabilidad sin datos suficientes",
          "exclude": "efecto invernadero|\\bgei\\b"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "hydrocarbon-deposits",
          "label": "yacimientos de hidrocarburos",
          "match": "yacimientos? de hidrocarburos",
          "relation": "la acumulación de hidrocarburos en las condiciones del modelo geológico solicitado, sin confundir roca generadora, reservorio y sello ni exigir extracción"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "element-origin",
          "label": "origen de los elementos",
          "match": "origen de los elementos|nucleosintesis",
          "relation": "los procesos de formación de núcleos y las evidencias de las fuentes astronómicas solicitadas, sin confundir formación nuclear y reacción química"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "nuclear-chemistry",
          "label": "química nuclear y sus aplicaciones",
          "match": "reacciones? nucleares?|medicina nuclear|radioactiv\\w*",
          "relation": "las transformaciones del núcleo y la aplicación examinada según las fuentes, distinguiéndolas de reacciones químicas sin exigir exposición, procedimientos clínicos ni manipulación radiactiva",
          "exclude": "datacion|edad radiometrica"
        },
        {
          "grade": 5,
          "pages": [
            317
          ],
          "id": "astrochemistry",
          "label": "composición química de cuerpos celestes",
          "match": "composicion quimica.*(?:planetas|estrellas|cuerpos celestes)|composicion de cuerpos celestes|datos espectrales",
          "relation": "las evidencias que sustentan la composición del cuerpo celeste solicitado y los límites de su interpretación, sin presentar inferencias espectrales como observaciones directas de su interior"
        },
        {
          "grade": 5,
          "pages": [
            318
          ],
          "id": "school-research",
          "label": "investigación escolar en química",
          "match": "investigacion (?:escolar sobre|en) quimica",
          "relation": "la relación entre problema delimitado, evidencia verificable y propuesta de investigación química solicitada, distinguiendo resultados propios y proporcionados sin inventar experimentos"
        }
      ],
      "policy": "REQUESTED_SCIENTIFIC_ACTIONS_V1"
    }
  ]
}
export const evaluationCatalogV91 = { ...evaluationCatalogV90, ...frozen }
