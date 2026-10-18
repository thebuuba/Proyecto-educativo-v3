import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV97} from './catalog-v97'
/** Exact98 payload, checked against the installed Development release. */
export const evaluationCatalogV98={...evaluationCatalogV97,version:'evaluation-2026.98',socialCommonModules:[
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
  }
]} as unknown as EvaluationCatalog
