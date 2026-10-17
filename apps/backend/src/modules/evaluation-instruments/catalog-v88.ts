import { evaluationCatalogV87 } from './catalog-v87'
/** Frozen payload; do not reference mutable providers in historical releases. */
const frozen = {
  "version": "evaluation-2026.88",
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
    }
  ]
}
export const evaluationCatalogV88 = { ...evaluationCatalogV87, ...frozen }
