import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV100} from './catalog-v100'
/** Exact101 payload checked against installed Development; all earlier modules remain inherited. */
export const evaluationCatalogV101={...evaluationCatalogV100,version:'evaluation-2026.101',socialCommonModules:[
  {
    "id": "ciencias-sociales-comun-1",
    "grade": 1,
    "topics": [
      {
        "id": "geography",
        "grade": 1,
        "label": "estudio de la geografía",
        "match": "geografia|geografic[a-z]*|ciencias auxiliares",
        "relation": "el espacio geográfico y las relaciones entre actividades humanas y medio, distinguiendo las ramas solicitadas",
        "pages": [
          244
        ]
      },
      {
        "id": "earth",
        "grade": 1,
        "label": "la Tierra en el sistema solar",
        "match": "sistema solar|origen (?:del planeta|de la tierra)|movimientos de la tierra|nuevos planetas",
        "relation": "la ubicación de la Tierra y los movimientos o modelos explicativos efectivamente estudiados",
        "pages": [
          244,
          245
        ]
      },
      {
        "id": "cartography",
        "grade": 1,
        "label": "mapas y planos",
        "match": "mapas?|planos?|cartografia|cartografic[a-z]*|representaciones de la tierra",
        "relation": "la representación del espacio mediante los elementos cartográficos solicitados y la diferencia de propósito entre mapa y plano",
        "pages": [
          244,
          245
        ]
      },
      {
        "id": "orientation",
        "grade": 1,
        "label": "orientación geográfica",
        "match": "puntos cardinales|rosa de los vientos|meridianos?|paralelos?|greenwich|coordenadas|medidas de posicion",
        "relation": "la orientación y posición de los lugares con las referencias cardinales o coordenadas indicadas",
        "pages": [
          244,
          245
        ]
      },
      {
        "id": "scale",
        "grade": 1,
        "label": "escalas cartográficas",
        "match": "escalas?|mercator",
        "relation": "la relación de escala entre distancias representadas y reales; la proyección de Mercator y la escala son conceptos distintos",
        "pages": [
          244,
          245
        ]
      },
      {
        "id": "gps",
        "grade": 1,
        "label": "posicionamiento global",
        "match": "gps|posicionamiento global",
        "relation": "el uso de referencias de posición para ubicar lugares y reconocer los límites de la herramienta indicada",
        "pages": [
          245
        ]
      },
      {
        "id": "colonial-expansion",
        "grade": 1,
        "label": "expansión colonial europea",
        "match": "expansion colonial(?:ista)?|expansion europea|territorios conquistados|continentes colonizados",
        "relation": "los procesos de ocupación colonial, sus actores, espacios y períodos, diferenciando las condiciones de las sociedades implicadas",
        "pages": [
          245
        ]
      },
      {
        "id": "colonial-domination",
        "grade": 1,
        "label": "colonialismo y esclavitud",
        "match": "colonialismo|esclavitud|esclaviz[a-z]*|prejuicio (?:racial|de color)|explotacion (?:colonial|humana)|modelo colonial",
        "relation": "las relaciones de dominación y explotación colonial y las respuestas de las poblaciones sometidas, sin justificar la deshumanización",
        "pages": [
          245,
          246
        ]
      },
      {
        "id": "triangular-trade",
        "grade": 1,
        "label": "comercio triangular",
        "match": "comercio triangular|capitalismo|rutas comerciales",
        "relation": "la circulación entre regiones de personas esclavizadas y mercancías y su relación con la economía colonial, sin equiparar personas con bienes",
        "pages": [
          245
        ]
      },
      {
        "id": "colonial-caribbean",
        "grade": 1,
        "label": "colonización del Caribe",
        "match": "antillas|colonizacion (?:del caribe|en el caribe)|expansion.*caribe",
        "relation": "las trayectorias coloniales de las islas solicitadas del Caribe en sus espacios y períodos",
        "pages": [
          245
        ]
      },
      {
        "id": "santo-domingo-colony",
        "grade": 1,
        "label": "colonia de Santo Domingo",
        "match": "colonizacion.*santo domingo|colonia de santo domingo|colonia espanola|produccion agricola|plantaciones|libertos?|campesinado|encomiendas?|hato ganadero|bucaneros|filibusteros|corsarios|engages|pirateria|devastaciones|despoblacion.*banda norte|siglo (?:xvi|xvii).*santo domingo|santo domingo.*siglos? (?:xvi|xvii)",
        "relation": "las relaciones entre producción, trabajo, población y poder en Santo Domingo durante el período colonial solicitado",
        "pages": [
          245,
          246
        ]
      },
      {
        "id": "island-division",
        "grade": 1,
        "label": "división colonial de la isla",
        "match": "division.*isla|dos colonias|saint.domingu",
        "relation": "la formación de dos colonias en la isla y sus diferencias de administración y ocupación territorial en el siglo XVIII",
        "pages": [
          246
        ]
      },
      {
        "id": "french-revolution",
        "grade": 1,
        "label": "Revolución Francesa",
        "match": "revolucion francesa",
        "relation": "los cambios políticos y sociales de la Revolución Francesa, sus actores y la difusión de sus ideas en el contexto solicitado",
        "pages": [
          246
        ]
      },
      {
        "id": "bourgeois-revolutions",
        "grade": 1,
        "label": "revoluciones burguesas",
        "match": "revoluciones burguesas",
        "relation": "las transformaciones políticas y sociales de las revoluciones burguesas en los siglos XVIII y XIX y los límites de sus resultados",
        "pages": [
          246
        ]
      },
      {
        "id": "feudal-states",
        "grade": 1,
        "label": "feudalismo y Estados nacionales",
        "match": "feudal[a-z]*|estados.?nacion|estados nacionales",
        "relation": "el declive del sistema feudal y los procesos de formación de Estados nacionales, sin presentar una trayectoria única para todas las sociedades",
        "pages": [
          246
        ]
      },
      {
        "id": "political-currents",
        "grade": 1,
        "label": "liberalismo y conservadurismo",
        "match": "liberalismo|conservadurismo",
        "relation": "los principios, diferencias y contexto de las corrientes liberales y conservadoras estudiadas en Europa",
        "pages": [
          246
        ]
      },
      {
        "id": "industrialization",
        "grade": 1,
        "label": "Segunda Revolución Industrial",
        "match": "segunda revolucion industrial|industrializacion",
        "relation": "los cambios tecnológicos, económicos y sociales de la industrialización y sus efectos diferenciados en el período solicitado",
        "pages": [
          246
        ]
      },
      {
        "id": "labor-movement",
        "grade": 1,
        "label": "movimiento obrero",
        "match": "movimientos? obreros?|luchas obreras",
        "relation": "las condiciones de trabajo, demandas y formas de organización del movimiento obrero en el contexto estudiado",
        "pages": [
          246
        ]
      },
      {
        "id": "women-rights",
        "grade": 1,
        "label": "derechos de las mujeres",
        "match": "derechos de las mujeres|luchas de las mujeres",
        "relation": "las demandas, obstáculos y cambios históricos de los derechos de las mujeres, diferenciando reconocimiento legal y ejercicio efectivo",
        "pages": [
          246
        ]
      },
      {
        "id": "independence",
        "grade": 1,
        "label": "independencias latinoamericanas",
        "match": "independentis[a-z]*|independencias?.*america latina",
        "relation": "las causas, actores y transformaciones de las independencias latinoamericanas en los casos solicitados",
        "pages": [
          246
        ]
      },
      {
        "id": "nationalism",
        "grade": 1,
        "label": "nación y nacionalismo",
        "match": "nacionalismo|nacionalistas?|austrohungaro|austro.hungaro",
        "relation": "las formas y etapas del nacionalismo y su relación con los Estados y poblaciones del caso, distinguiendo nación, Estado e imperio",
        "pages": [
          246
        ]
      },
      {
        "id": "culture",
        "grade": 1,
        "label": "identidad cultural e interculturalidad",
        "match": "identidad cultural|interculturalidad|aculturacion|transculturacion",
        "relation": "las relaciones entre culturas y los procesos de identidad y cambio cultural, sin jerarquizar culturas ni exigir adhesión personal",
        "pages": [
          246
        ]
      },
      {
        "id": "human-rights",
        "grade": 1,
        "label": "derechos humanos",
        "match": "derechos humanos",
        "relation": "el alcance de los derechos humanos y su aplicación a las situaciones examinadas, distinguiendo hechos, normas y argumentos",
        "pages": [
          246,
          247
        ]
      },
      {
        "id": "constitution",
        "grade": 1,
        "label": "Constitución dominicana",
        "match": "constitucion|derechos y deberes|soberania nacional|poderes del estado|voto",
        "relation": "la organización del Estado dominicano, derechos, deberes o funciones solicitados y su fundamento constitucional, sin exigir una preferencia política",
        "pages": [
          247
        ]
      },
      {
        "id": "peace",
        "grade": 1,
        "label": "diálogo y cultura de paz",
        "match": "cultura de paz|solucion.*conflicto|conflictos? (?:escolar|social)|soluciones? dialogadas?|situaciones conflictivas|alternativas de soluciones|convivencia|dialogo|decisiones consensuadas",
        "relation": "la identificación de un conflicto y de alternativas dialogadas que atiendan los derechos de las partes, sin calificar la personalidad",
        "pages": [
          247
        ]
      },
      {
        "id": "national-symbols",
        "grade": 1,
        "label": "símbolos patrios",
        "match": "simbolos patrios|bandera|escudo|himno nacional",
        "relation": "el origen, significado y contexto histórico de los símbolos solicitados, sin evaluar sentimientos patrióticos privados",
        "pages": [
          247
        ]
      },
      {
        "id": "road-safety",
        "grade": 1,
        "label": "educación vial",
        "match": "educacion vial|seguridad vial|problemas viales|transito|peatones|ciclistas",
        "relation": "las reglas y decisiones de seguridad vial aplicables a los roles y situaciones indicados",
        "pages": [
          247
        ]
      },
      {
        "id": "taxes",
        "grade": 1,
        "label": "educación tributaria",
        "match": "educacion tributaria|impuestos|pago.*tribut",
        "relation": "la relación entre impuestos, financiación de servicios públicos y responsabilidad del Estado, diferenciando obligaciones y uso de recursos",
        "pages": [
          247
        ]
      },
      {
        "id": "environment",
        "grade": 1,
        "label": "impacto social de problemas ambientales",
        "match": "calentamiento global|contaminacion|recursos naturales|reciclaje",
        "relation": "las causas o repercusiones sociales de los problemas ambientales solicitados y las acciones pertinentes al caso",
        "pages": [
          247
        ]
      },
      {
        "id": "personal-safety",
        "grade": 1,
        "label": "prevención de riesgos a la integridad física",
        "match": "integridad fisica",
        "relation": "los riesgos a la integridad física de las personas en el caso indicado y las decisiones de prevención, sin pedir experiencias privadas",
        "pages": [
          247
        ]
      },
      {
        "id": "digital-safety",
        "grade": 1,
        "label": "protección personal en medios digitales",
        "match": "redes sociales|medios digitales|seguridad digital",
        "relation": "los riesgos de exposición de información en medios digitales y las medidas de protección aplicables al caso ficticio, sin divulgar datos o cuentas propias",
        "pages": [
          247
        ]
      },
      {
        "id": "dependency",
        "grade": 1,
        "label": "teoría de la dependencia",
        "match": "teoria de la dependencia",
        "relation": "los argumentos de la teoría de la dependencia y sus implicaciones para interpretar la realidad latinoamericana, contrastándolos con el caso sin presentarlos como explicación única",
        "pages": [
          248
        ],
        "sourceRecordType": "ACHIEVEMENT_INDICATOR"
      },
      {
        "id": "thirteen-colonies",
        "grade": 1,
        "label": "independencia de las trece colonias",
        "match": "(?:trece|13) colonias",
        "relation": "la influencia histórica de la independencia de las trece colonias de Norteamérica en los cambios políticos, económicos y sociales de los casos solicitados",
        "pages": [
          248
        ],
        "sourceRecordType": "ACHIEVEMENT_INDICATOR"
      }
    ],
    "policy": "REQUESTED_SOCIAL_EVIDENCE_V4"
  },
  {
    "id": "ciencias-sociales-comun-2",
    "grade": 2,
    "topics": [
      {
        "id": "geomorphology",
        "grade": 2,
        "label": "geomorfología",
        "match": "geomorfolog[a-z]*",
        "relation": "el campo de la geomorfología y el estudio de las formas terrestres, distinguiendo descripción del relieve y explicación de su formación",
        "pages": [
          249
        ]
      },
      {
        "id": "tectonics",
        "grade": 2,
        "label": "placas tectónicas",
        "match": "placas tectonicas|tectonica de placas",
        "relation": "las relaciones entre placas, su movimiento y los procesos geológicos examinados, sin atribuirles fenómenos meteorológicos",
        "pages": [
          249
        ]
      },
      {
        "id": "relief",
        "grade": 2,
        "label": "estructura geológica y relieve",
        "match": "estructura geologica|unidades de relieve|formas de relieve|relieve de los continentes|relieve.*santo domingo",
        "relation": "las formas de relieve y su estructura o formación en los continentes o la isla expresamente indicados",
        "pages": [
          249
        ]
      },
      {
        "id": "geological-faults",
        "grade": 2,
        "label": "fallas geológicas",
        "match": "fallas geologicas",
        "relation": "las características y la distribución de las fallas geológicas expresamente examinadas, distinguiendo su descripción y explicación geológica",
        "pages": [
          249
        ]
      },
      {
        "id": "seismic",
        "grade": 2,
        "label": "movimientos sísmicos",
        "match": "movimientos? sismicos?|sismos?|terremotos?|maremotos?|tsunamis?",
        "relation": "las causas y efectos de los movimientos sísmicos solicitados, diferenciando el fenómeno y sus consecuencias según el caso",
        "pages": [
          249
        ]
      },
      {
        "id": "volcanism",
        "grade": 2,
        "label": "zonas volcánicas",
        "match": "volcanic[a-z]*|volcanes|erupciones",
        "relation": "la localización o actividad volcánica expresamente estudiada y sus relaciones con el contexto geográfico",
        "pages": [
          249,
          250
        ]
      },
      {
        "id": "climate",
        "grade": 2,
        "label": "clima y factores geográficos",
        "match": "clima|climas|climatic[a-z]*|climogramas?",
        "relation": "las relaciones entre tipos o elementos del clima y los factores geográficos del lugar indicado",
        "pages": [
          249,
          250
        ]
      },
      {
        "id": "weather-instruments",
        "grade": 2,
        "label": "registros meteorológicos",
        "match": "meteorologic[a-z]*|termometros?|pluviometros?|higrometros?|anemometros?|veletas?",
        "relation": "las magnitudes, unidades y referencias de los registros meteorológicos proporcionados, distinguiendo los instrumentos que las obtienen",
        "pages": [
          249
        ]
      },
      {
        "id": "water",
        "grade": 2,
        "label": "aguas y cuerpos hídricos",
        "match": "oceanos?|mares|lagunas?|lagos?|rios|cuerpos hidricos",
        "relation": "las características y relaciones de los cuerpos de agua expresamente indicados en su contexto geográfico",
        "pages": [
          249
        ]
      },
      {
        "id": "atmospheric-hazards",
        "grade": 2,
        "label": "huracanes e inundaciones",
        "match": "huracanes?|inundaciones|fenomenos atmosfericos",
        "relation": "los procesos atmosféricos o hidrológicos del fenómeno solicitado y sus efectos en el caso geográfico, sin confundirlos con mecanismos tectónicos",
        "pages": [
          250
        ]
      },
      {
        "id": "disaster-risk",
        "grade": 2,
        "label": "riesgo y prevención de desastres",
        "match": "desastres?|fenomenos naturales|mapas? de emergencia|planes? preventivos?|plan preventivo|prevencion de danos|acciones? preventivas?",
        "relation": "las relaciones entre el fenómeno, la exposición, las condiciones del caso y la prevención expresamente estudiada",
        "pages": [
          249,
          250
        ]
      },
      {
        "id": "historical-sources",
        "grade": 2,
        "label": "importancia de las fuentes históricas",
        "match": "fuentes historicas",
        "relation": "la aportación de las fuentes históricas al conocimiento de los fenómenos estudiados, distinguiendo testimonios e interpretaciones posteriores",
        "pages": [
          249
        ]
      },
      {
        "id": "demographic-rates",
        "grade": 2,
        "label": "tasas demográficas",
        "match": "tasas demograficas|fecundidad|natalidad|mortalidad|esperanza de vida",
        "relation": "el significado, valores, unidades y variación temporal de las tasas demográficas solicitadas, sin extrapolarlas a personas concretas",
        "pages": [
          250
        ]
      },
      {
        "id": "population-structure",
        "grade": 2,
        "label": "estructura y dinámica de la población",
        "match": "piramides? de edades|piramides? poblacionales|dinamica de la poblacion|crecimiento poblacional|crecimiento de la poblacion|estructura de la poblacion",
        "relation": "las diferencias de estructura o crecimiento de la población representadas en los datos, distinguiendo observación e interpretación",
        "pages": [
          250
        ]
      },
      {
        "id": "census",
        "grade": 2,
        "label": "censos de población",
        "match": "censos?|datos censales",
        "relation": "las características y el alcance de los datos censales proporcionados para describir la población y sus cambios",
        "pages": [
          250
        ]
      },
      {
        "id": "migration",
        "grade": 2,
        "label": "migraciones humanas",
        "match": "migracion[a-z]*|migratori[a-z]*",
        "relation": "los tipos, causas, rutas o características migratorias expresamente solicitados en el caso proporcionado",
        "pages": [
          250
        ]
      },
      {
        "id": "human-impact",
        "grade": 2,
        "label": "acción humana y calentamiento global",
        "match": "accion humana|calentamiento global|cambio climatico",
        "relation": "las relaciones entre las acciones humanas expresamente examinadas y sus efectos ambientales y sociales, distinguiendo evidencias y explicaciones",
        "pages": [
          250
        ]
      },
      {
        "id": "imperialism",
        "grade": 2,
        "label": "imperialismo y poder mundial",
        "match": "imperialismo|grandes potencias|poder financiero|expansion imperialista|complejo financiero",
        "relation": "las relaciones de poder político, económico o ideológico del imperialismo en los espacios y períodos examinados",
        "pages": [
          250
        ]
      },
      {
        "id": "transport-canals",
        "grade": 2,
        "label": "canales de Suez y Panamá",
        "match": "canal(?:es)? de suez|canal(?:es)? de panama|suez y panama|transporte maritimo",
        "relation": "las relaciones entre los canales y los cambios de rutas, transporte e intercambios en los períodos examinados",
        "pages": [
          250
        ]
      },
      {
        "id": "first-world-war",
        "grade": 2,
        "label": "Primera Guerra Mundial",
        "match": "primera guerra mundial",
        "relation": "las causas, actores, transformaciones o consecuencias expresamente examinados de la Primera Guerra Mundial, diferenciando antecedentes, desarrollo y posguerra",
        "pages": [
          250,
          251
        ]
      },
      {
        "id": "russian-revolution",
        "grade": 2,
        "label": "Revolución rusa",
        "match": "revolucion rusa",
        "relation": "las condiciones, actores y cambios de la Revolución rusa solicitados, diferenciando hechos, explicaciones y valoraciones",
        "pages": [
          250
        ]
      },
      {
        "id": "us-economic-rise",
        "grade": 2,
        "label": "afianzamiento económico de Estados Unidos",
        "match": "afianzamiento economico|auge economico de estados unidos|estados unidos y canada",
        "relation": "el afianzamiento económico estadounidense y las relaciones con producción, guerra e intercambios en el período examinado",
        "pages": [
          250,
          251
        ]
      },
      {
        "id": "great-depression",
        "grade": 2,
        "label": "crisis de 1929",
        "match": "crisis (?:de |del )?1929|gran depresion",
        "relation": "los factores, efectos y alcance de la crisis de 1929 en los casos examinados, sin confundir antecedente y consecuencia",
        "pages": [
          250
        ]
      },
      {
        "id": "fascism",
        "grade": 2,
        "label": "fascismo en Europa",
        "match": "fascismo|fascistas?",
        "relation": "los factores de surgimiento, características y derrota del fascismo estudiados, con sustento histórico y sin exigir adhesión a posturas",
        "pages": [
          250
        ]
      },
      {
        "id": "war-dominican-economy",
        "grade": 2,
        "label": "guerra y economía dominicana",
        "match": "guerra mundial[^.;]*economia dominicana|guerra mundial[^.;]*sistema economico[^.;]*dominicana|primera guerra mundial[^.;]*republica dominicana|explotacion bananera|explotacion agricola|explotaciones mineras",
        "relation": "las relaciones entre la guerra, los intercambios y las actividades económicas dominicanas o regionales expresamente solicitadas",
        "pages": [
          251
        ]
      },
      {
        "id": "north-south",
        "grade": 2,
        "label": "Norte y Sur e indicadores de desarrollo",
        "match": "norte y sur|paises del norte|paises del sur|pueblos del norte|pueblos del sur|paises desarrollados|paises subdesarrollados|centro.?periferia|idh|indice de desarrollo humano|indicadores economicos del desarrollo",
        "relation": "las diferencias económicas, sociales y políticas entre los casos del Norte y Sur o los indicadores de desarrollo solicitados, sin equiparar ingreso, desarrollo y bienestar",
        "pages": [
          250,
          251
        ]
      },
      {
        "id": "antillanism",
        "grade": 2,
        "label": "antillanismo y antiimperialismo",
        "match": "antillanismo|antiimperialismo|antimperialismo|independencia[^.;]*paises caribenos|soberania[^.;]*paises caribenos",
        "relation": "los argumentos y contextos del antillanismo y antiimperialismo caribeños examinados, diferenciando autores y sus respuestas al expansionismo",
        "pages": [
          251
        ]
      },
      {
        "id": "dominican-society",
        "grade": 2,
        "label": "sociedad y economía dominicanas del siglo XIX y comienzos del XX",
        "match": "sociedad dominicana|economia dominicana|capitalismo dependiente|modernidad|urbanizacion|republica.*1900|gobiernos[^.;]*republica dominicana|dictaduras[^.;]*republica dominicana",
        "relation": "las relaciones entre cambios económicos, sociales, políticos o culturales dominicanos en el período expresamente solicitado",
        "pages": [
          251
        ]
      },
      {
        "id": "dominican-state",
        "grade": 2,
        "label": "formación del Estado dominicano",
        "match": "formacion del estado dominicano|origen del estado dominicano|acontecimientos.*primera mitad del siglo xix",
        "relation": "los procesos históricos que dieron origen al Estado dominicano y sus relaciones en el período señalado",
        "pages": [
          251
        ]
      },
      {
        "id": "democracy",
        "grade": 2,
        "label": "democracia y Estado de derecho",
        "match": "democracia|democratic[a-z]*|estado de derecho|constitucion dominicana|sistemas autoritarios",
        "relation": "las características del Estado de derecho y de las prácticas democráticas examinadas, distinguiendo normas, instituciones y aplicación al caso",
        "pages": [
          251,
          252
        ]
      },
      {
        "id": "human-rights",
        "grade": 2,
        "label": "derechos fundamentales",
        "match": "derechos humanos|derechos fundamentales|valores humanos",
        "relation": "el alcance de los derechos fundamentales y su aplicación a los casos proporcionados, diferenciando hechos y normas sin calificar convicciones privadas",
        "pages": [
          252
        ]
      },
      {
        "id": "peace",
        "grade": 2,
        "label": "diálogo y cultura de paz",
        "match": "cultura de paz|conflictos? (?:escolar|social|economic|politic|cultural|espacial)[a-z]*|solucion.*conflicto|solucion dialogada|procedimientos dialogicos|soluciones participativas",
        "relation": "las alternativas dialogadas y participativas que atienden las condiciones del conflicto y los derechos de las partes",
        "pages": [
          252
        ]
      },
      {
        "id": "national-symbols",
        "grade": 2,
        "label": "símbolos patrios",
        "match": "simbolos patrios|bandera|escudo|himno",
        "relation": "el significado, historia y representación de los símbolos expresamente estudiados, sin calificar sentimientos patrióticos privados",
        "pages": [
          252
        ]
      },
      {
        "id": "road-safety",
        "grade": 2,
        "label": "seguridad vial",
        "match": "seguridad vial|educacion vial|accidentes de transito",
        "relation": "las características, datos o factores de seguridad vial solicitados y las relaciones respaldadas por las fuentes del caso",
        "pages": [
          251,
          252
        ]
      },
      {
        "id": "taxes",
        "grade": 2,
        "label": "educación tributaria",
        "match": "educacion tributaria|impuestos|tributari[a-z]*",
        "relation": "las relaciones entre obligaciones tributarias, recursos públicos y servicios examinados, diferenciando normas y argumentos del caso",
        "pages": [
          251,
          252
        ]
      },
      {
        "id": "environmental-agreements",
        "grade": 2,
        "label": "medidas y derechos ambientales",
        "match": "derechos ambientales|proteccion ambiental|proteccion al medioambiente|medidas.*naciones unidas|naciones unidas.*proteccion|protocolos internacionales|legislaciones.*planeta",
        "relation": "los objetivos, alcances y límites de las medidas o acuerdos ambientales proporcionados y su relación con el problema examinado",
        "pages": [
          250,
          252
        ]
      },
      {
        "id": "pollution",
        "grade": 2,
        "label": "impacto social de la contaminación",
        "match": "contaminacion ambiental|contaminacion.*dominicana",
        "relation": "las causas y consecuencias sociales de la contaminación solicitadas, con referencia a la población y al espacio examinados",
        "pages": [
          252
        ]
      },
      {
        "id": "modern-postmodern",
        "grade": 2,
        "label": "cultura moderna y postmoderna",
        "match": "cultura moderna|postmoderna|posmoderna",
        "relation": "las características estudiadas de la cultura moderna y postmoderna y las diferencias sustentadas en las fuentes proporcionadas",
        "pages": [
          253
        ],
        "sourceRecordType": "ACHIEVEMENT_INDICATOR"
      },
      {
        "id": "decolonization",
        "grade": 2,
        "label": "neocolonialismo y descolonización",
        "match": "neocolonialismo|descolonizacion",
        "relation": "los cambios históricos y espaciales expresamente examinados del neocolonialismo y la descolonización, situándolos en sus contextos",
        "pages": [
          253
        ],
        "sourceRecordType": "ACHIEVEMENT_INDICATOR"
      }
    ],
    "policy": "REQUESTED_SOCIAL_EVIDENCE_V2"
  },
  {
    "id": "ciencias-sociales-comun-3",
    "grade": 3,
    "topics": [
      {
        "id": "american-geology",
        "grade": 3,
        "label": "origen geológico de América y teorías tectónicas",
        "match": "origen geologico|origen del continente americano|teorias geologicas|teorias tectonicas|placas tectonicas|movimientos sismicos",
        "relation": "los fundamentos y evidencias de las teorías geológicas solicitadas sobre el origen de América y los procesos tectónicos examinados",
        "pages": [
          254
        ]
      },
      {
        "id": "american-relief",
        "grade": 3,
        "label": "relieve, fallas y fosas tectónicas de América",
        "match": "relieve|fallas geologicas|fosas tectonicas",
        "relation": "las unidades del relieve, fallas o fosas tectónicas expresamente indicadas de América y sus características y referencias espaciales",
        "pages": [
          254
        ]
      },
      {
        "id": "american-water",
        "grade": 3,
        "label": "cuencas hidrográficas, ríos y lagos de América",
        "match": "cuencas hidrograficas|rios y lagos|rios de america|lagos de america",
        "relation": "las características y relaciones espaciales de las cuencas, ríos y lagos de América expresamente solicitados",
        "pages": [
          254
        ]
      },
      {
        "id": "american-climate",
        "grade": 3,
        "label": "clima y vegetación de América",
        "match": "clima|climatic[a-z]*|vegetacion",
        "relation": "la variación del clima y la vegetación en las regiones americanas expresamente examinadas y las relaciones respaldadas por sus datos",
        "pages": [
          254
        ]
      },
      {
        "id": "geography-fields",
        "grade": 3,
        "label": "campos de la geografía física, humana y económica de América",
        "match": "geografia fisica|geografia humana|geografia economica|geografia de america",
        "relation": "el objeto y los conceptos o ramas expresamente solicitados de la geografía física, humana y económica de América, sin confundir sus campos de estudio",
        "pages": [
          254
        ]
      },
      {
        "id": "american-peopling",
        "grade": 3,
        "label": "poblamiento histórico de América",
        "match": "poblamiento de america|antecedentes historicos del poblamiento",
        "relation": "los antecedentes y procesos históricos del poblamiento de América solicitados, diferenciando hechos e hipótesis",
        "pages": [
          255
        ]
      },
      {
        "id": "population-structure",
        "grade": 3,
        "label": "crecimiento y dinámica poblacional de América",
        "match": "crecimiento poblacional|evolucion demografica|dinamica de la poblacion|expansion demografica",
        "relation": "los procesos de crecimiento o dinámica de la población americana solicitados y sus relaciones espaciales y temporales",
        "pages": [
          255
        ]
      },
      {
        "id": "urban-rural",
        "grade": 3,
        "label": "ordenamiento urbano y rural de la población americana",
        "match": "zonas urbanas y rurales|ordenamiento poblacional|crecimiento urbano|transformacion espacial|ciudades",
        "relation": "las formas de ordenamiento poblacional o los efectos del crecimiento urbano expresamente examinados, con sus contextos espaciales y socioambientales",
        "pages": [
          255
        ]
      },
      {
        "id": "production-models",
        "grade": 3,
        "label": "modelos productivos de América",
        "match": "modelos productivos|modelos de produccion",
        "relation": "las características y relaciones de los modelos productivos americanos solicitados, con referencia a sus espacios, períodos y fuentes",
        "pages": [
          255
        ]
      },
      {
        "id": "economic-activities",
        "grade": 3,
        "label": "actividades económicas de América",
        "match": "actividades economicas",
        "relation": "las actividades económicas americanas indicadas y sus relaciones con los recursos, espacios y contextos examinados",
        "pages": [
          255
        ]
      },
      {
        "id": "industrial-impact",
        "grade": 3,
        "label": "crecimiento industrial y naturaleza",
        "match": "crecimiento industrial|avance industrial",
        "relation": "los efectos del crecimiento industrial en la naturaleza en los casos y períodos indicados, distinguiendo evidencias de inferencias",
        "pages": [
          255
        ]
      },
      {
        "id": "pollution",
        "grade": 3,
        "label": "contaminación ambiental en América",
        "match": "contaminacion",
        "relation": "los planteamientos, causas o consecuencias de la contaminación ambiental solicitados y su respaldo en los casos y fuentes examinados",
        "pages": [
          255
        ]
      },
      {
        "id": "natural-resources",
        "grade": 3,
        "label": "recursos naturales de América y República Dominicana",
        "match": "recursos naturales",
        "relation": "las consecuencias socioambientales y económicas del uso o explotación de los recursos naturales en los espacios indicados y las alternativas expresamente solicitadas",
        "pages": [
          255,
          256
        ]
      },
      {
        "id": "prehispanic-societies",
        "grade": 3,
        "label": "sociedades prehispánicas de América",
        "match": "prehispanic[a-z]*",
        "relation": "las características o teorías solicitadas sobre las sociedades prehispánicas de América y las evidencias de sus contextos, sin jerarquías culturales personales",
        "pages": [
          255
        ]
      },
      {
        "id": "colonial-societies",
        "grade": 3,
        "label": "sociedades coloniales de la América hispana",
        "match": "sociedades coloniales|america hispana|america hispanita",
        "relation": "las relaciones y características de las sociedades coloniales de la América hispana expresamente examinadas, situadas en su contexto histórico",
        "pages": [
          255
        ]
      },
      {
        "id": "brazil",
        "grade": 3,
        "label": "formación y desarrollo de Brasil",
        "match": "formacion.*brasil|desarrollo de brasil",
        "relation": "los procesos de formación y desarrollo de Brasil solicitados y sus relaciones con los hechos y contextos del período indicado",
        "pages": [
          255
        ]
      },
      {
        "id": "social-theories",
        "grade": 3,
        "label": "corrientes sociales de pensamiento",
        "match": "planteamientos liberales|positivis[a-z]*|marxist[a-z]*|teoria critica|teorias sociales",
        "relation": "los planteamientos de las corrientes sociales de pensamiento expresamente examinadas, diferenciando sus autores y contextos",
        "pages": [
          254
        ]
      },
      {
        "id": "us-expansion",
        "grade": 3,
        "label": "expansionismo y hegemonía estadounidense en América",
        "match": "expansionismo estadounidense|hegemonia estadounidense|expansion y hegemonia estadounidense",
        "relation": "las políticas y relaciones de expansión o hegemonía estadounidense en América y el Caribe durante el período expresamente solicitado, distinguiendo hechos y perspectivas",
        "pages": [
          255
        ]
      },
      {
        "id": "big-stick",
        "grade": 3,
        "label": "política del Gran Garrote",
        "match": "gran garrote|politica del garrote",
        "relation": "los mecanismos, contextos e implicaciones de la política del Gran Garrote examinados en las fuentes y los países indicados",
        "pages": [
          255
        ]
      },
      {
        "id": "monroe-destiny",
        "grade": 3,
        "label": "Doctrina Monroe y Destino Manifiesto",
        "match": "doctrina monroe|destino manifiesto",
        "relation": "los fundamentos y usos de las doctrinas expresamente solicitadas en los contextos históricos indicados, sin atribuir su origen a una aplicación posterior",
        "pages": [
          255
        ]
      },
      {
        "id": "spanish-empire-end",
        "grade": 3,
        "label": "fin del imperio español y guerra hispano-cubano-estadounidense",
        "match": "fin del imperio espanol|guerra hispano|hispano.?cubana",
        "relation": "los hechos y relaciones del fin del imperio español en las Antillas o de la guerra expresamente solicitados, conservando sus actores, espacios y períodos",
        "pages": [
          255
        ]
      },
      {
        "id": "puerto-rico-transfer",
        "grade": 3,
        "label": "traspaso colonial de Puerto Rico a Estados Unidos",
        "match": "traspaso colonial|puerto rico a estados unidos",
        "relation": "el traspaso colonial de Puerto Rico a Estados Unidos y sus implicaciones indicadas en las fuentes, conservando el contexto histórico",
        "pages": [
          255
        ]
      },
      {
        "id": "us-interventions",
        "grade": 3,
        "label": "intervenciones estadounidenses en el Caribe y Centroamérica",
        "match": "intervenciones.*estados unidos|intervenciones militares|intervenciones estadounidenses",
        "relation": "las intervenciones estadounidenses expresamente indicadas en el Caribe o Centroamérica y sus características y contextos, sin incorporar otros casos",
        "pages": [
          255,
          256
        ]
      },
      {
        "id": "occupation-resistance",
        "grade": 3,
        "label": "resistencias a las ocupaciones militares",
        "match": "resistencias?|cacoismo|gavilleros|sandino|farabundo marti|movimiento nacionalista de puerto rico",
        "relation": "los movimientos de resistencia expresamente solicitados y sus implicaciones en los espacios, períodos y fuentes del caso, sin exigir adhesión política",
        "pages": [
          256
        ]
      },
      {
        "id": "mexican-revolution",
        "grade": 3,
        "label": "Revolución mexicana",
        "match": "revolucion mexicana|madero|pancho villa|emiliano zapata|plan(?:es)? de ayala|san luis de potosi",
        "relation": "los procesos, actores o programas de la Revolución mexicana expresamente solicitados y sus relaciones en el período estudiado",
        "pages": [
          255
        ]
      },
      {
        "id": "panama-canal-separation",
        "grade": 3,
        "label": "Canal de Panamá y separación de Colombia",
        "match": "canal de panama|separacion de panama|panama de colombia",
        "relation": "las implicaciones solicitadas de la construcción del Canal de Panamá o de la separación de Panamá de Colombia, diferenciando hechos y explicaciones provisionales",
        "pages": [
          255
        ]
      },
      {
        "id": "dollar-diplomacy",
        "grade": 3,
        "label": "diplomacia del dólar",
        "match": "diplomacia del dolar",
        "relation": "los mecanismos e implicaciones de la diplomacia del dólar en los casos históricos indicados, sustentando interpretaciones con sus evidencias",
        "pages": [
          255
        ]
      },
      {
        "id": "great-depression",
        "grade": 3,
        "label": "crisis de 1929 y sus contextos americanos",
        "match": "crisis (?:de )?1929|crisis mundial de 1929|gran depresion|danza de los millones",
        "relation": "la crisis de 1929, su extensión a la década de 1930 o los procesos económicos anteriores expresamente solicitados, sin confundir correlación con causalidad comprobada",
        "pages": [
          255
        ]
      },
      {
        "id": "spanish-civil-war",
        "grade": 3,
        "label": "Guerra Civil Española e impacto en América Latina",
        "match": "guerra civil espanola",
        "relation": "los procesos y el impacto en América Latina de la Guerra Civil Española examinados en las fuentes y períodos indicados",
        "pages": [
          256
        ]
      },
      {
        "id": "world-war-two",
        "grade": 3,
        "label": "Segunda Guerra Mundial",
        "match": "segunda guerra mundial",
        "relation": "los antecedentes, acontecimientos, actores o transformaciones expresamente solicitados de la Segunda Guerra Mundial, diferenciando el período de guerra y la posguerra",
        "pages": [
          256
        ]
      },
      {
        "id": "world-war-two-economy",
        "grade": 3,
        "label": "crisis y déficit económico durante la Segunda Guerra Mundial",
        "match": "crisis economica.*segunda guerra mundial|deficit economico",
        "relation": "el significado y las relaciones de la crisis y el déficit económicos solicitados durante la Segunda Guerra Mundial, situándolos en los países y períodos examinados",
        "pages": [
          256
        ]
      },
      {
        "id": "dictatorships",
        "grade": 3,
        "label": "dictaduras y autoritarismo en Iberoamérica y el Caribe",
        "match": "dictaduras?|autoritarismo|caudillismos?",
        "relation": "las características, causas o consecuencias de las dictaduras y formas autoritarias expresamente examinadas de Iberoamérica y el Caribe, sin exigir adhesión a dirigentes",
        "pages": [
          256
        ]
      },
      {
        "id": "populism",
        "grade": 3,
        "label": "populismo en Brasil y Argentina",
        "match": "populismo|getulio vargas|juan domingo peron",
        "relation": "las características y contextos de los populismos estudiados en Brasil o Argentina, diferenciando sus casos y las afirmaciones de las fuentes",
        "pages": [
          256
        ]
      },
      {
        "id": "postwar-hegemony",
        "grade": 3,
        "label": "hegemonía estadounidense de posguerra",
        "match": "fin de la segunda guerra mundial[^.;]*hegemonia|hegemonia (?:estadounidense|de estados unidos)[^.;]*(?:posguerra|segunda guerra mundial)",
        "relation": "el fin de la Segunda Guerra Mundial y la hegemonía estadounidense de posguerra expresamente examinados, diferenciando hechos y explicaciones de sus contextos",
        "pages": [
          256
        ]
      },
      {
        "id": "postwar-changes",
        "grade": 3,
        "label": "cambios económicos y sociales de 1945 a 1960",
        "match": "1945[^.;]*1960|cambios de posguerra",
        "relation": "los cambios económicos y sociales expresamente indicados entre 1945 y 1960 y sus relaciones temporales y contextuales",
        "pages": [
          256
        ]
      },
      {
        "id": "cuban-revolution",
        "grade": 3,
        "label": "Revolución cubana y repercusiones",
        "match": "revolucion cubana",
        "relation": "las repercusiones de la Revolución cubana solicitadas en Latinoamérica o República Dominicana, diferenciando hechos y perspectivas de sus fuentes",
        "pages": [
          256
        ]
      },
      {
        "id": "dominican-war-coldwar",
        "grade": 3,
        "label": "Segunda Guerra Mundial y Guerra Fría en República Dominicana",
        "match": "(?:segunda guerra mundial|guerra fria)[^.;]*republica dominicana|economia dominicana[^.;]*segunda guerra mundial|medidas[^.;]*trujillo",
        "relation": "el impacto en República Dominicana de los procesos bélicos o de Guerra Fría expresamente examinados y sus condiciones económicas, políticas o sociales indicadas",
        "pages": [
          256
        ]
      },
      {
        "id": "coldwar-end",
        "grade": 3,
        "label": "fin de la Guerra Fría y caída del socialismo",
        "match": "fin de la guerra fria|final de la guerra fria|caida del socialismo",
        "relation": "los factores y procesos del fin de la Guerra Fría o la caída del socialismo expresamente solicitados, distinguiendo los contextos y evitando adhesiones ideológicas",
        "pages": [
          256
        ]
      },
      {
        "id": "coldwar-latin-america",
        "grade": 3,
        "label": "Guerra Fría en América Latina",
        "match": "guerra fria",
        "relation": "las repercusiones de la Guerra Fría en los países y contextos latinoamericanos expresamente solicitados, diferenciando hechos y perspectivas",
        "pages": [
          256
        ]
      },
      {
        "id": "human-rights",
        "grade": 3,
        "label": "Declaración Universal y derechos humanos",
        "match": "derechos humanos|declaracion universal|derechos fundamentales",
        "relation": "el significado, contexto y alcance de los derechos humanos expresamente examinados, diferenciando hechos, normas e interpretaciones",
        "pages": [
          256
        ]
      },
      {
        "id": "governance-democracy",
        "grade": 3,
        "label": "gobernanza, desarrollo y democracia",
        "match": "gobernanza|desarrollo economico|democracia|estado de derecho|constitucion",
        "relation": "las relaciones entre gobernanza, desarrollo económico o democracia expresamente solicitadas en los casos y textos, sin valorar preferencias partidarias",
        "pages": [
          256
        ]
      },
      {
        "id": "national-symbols",
        "grade": 3,
        "label": "símbolos patrios",
        "match": "simbolos patrios|bandera|escudo|himno",
        "relation": "la historia, significado o rasgos de los símbolos patrios expresamente solicitados en su contexto cultural, sin calificar sentimientos personales",
        "pages": [
          256
        ]
      },
      {
        "id": "peace",
        "grade": 3,
        "label": "conflictos, valores y cultura de paz",
        "match": "conflictos?|valores humanos|valores sociales|cultura de paz",
        "relation": "los conflictos y alternativas dialogadas expresamente examinados en los casos, relacionando hechos, derechos y condiciones sin indagar creencias o vivencias privadas",
        "pages": [
          256
        ]
      },
      {
        "id": "violence-prevention",
        "grade": 3,
        "label": "prevención estatal de violencia y narcotráfico",
        "match": "violencia|narcotrafico|organismos del estado",
        "relation": "las funciones de los organismos estatales indicados en las fuentes para prevenir violencia y narcotráfico y su alcance en el caso ficticio, sin investigar personas o delitos reales",
        "pages": [
          256
        ]
      },
      {
        "id": "road-safety",
        "grade": 3,
        "label": "educación vial y normas de tránsito",
        "match": "educacion vial|seguridad vial|transito|normas de transito",
        "relation": "los principios y normas de educación vial expresamente solicitados y su significado y alcance en el caso o mensaje educativo estudiado",
        "pages": [
          256
        ]
      },
      {
        "id": "taxes",
        "grade": 3,
        "label": "presupuesto y uso de los impuestos",
        "match": "presupuesto nacional|impuestos|educacion tributaria",
        "relation": "el presupuesto, la función de los impuestos y su relación con los servicios públicos expresamente examinados, sin calcular obligaciones personales",
        "pages": [
          256
        ]
      }
    ],
    "policy": "REQUESTED_SOCIAL_EVIDENCE_V1"
  }
]} as unknown as EvaluationCatalog
