import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV103} from './catalog-v103'
/** Exact 104 payload checked against Development; previous modules remain inherited. */
export const evaluationCatalogV104={...evaluationCatalogV103,version:'evaluation-2026.104',socialCommonModules:[...evaluationCatalogV103.socialCommonModules!,{
  "id": "ciencias-sociales-comun-6",
  "grade": 6,
  "topics": [
    {
      "id": "dominican-position",
      "grade": 6,
      "label": "posición, ubicación y extensión de República Dominicana",
      "match": "posicion geografica|ubicacion.*republica dominicana|area.*republica dominicana|superficie.*republica dominicana",
      "relation": "la posición, ubicación, límites o extensión de República Dominicana expresamente solicitados y sus ventajas o desventajas examinadas, sin confundir el país con toda la isla",
      "pages": [
        276
      ]
    },
    {
      "id": "dominican-boundaries",
      "grade": 6,
      "label": "fronteras marítimas, costeras y territoriales dominicanas",
      "match": "fronteras maritimas|fronteras costeras|fronteras territoriales",
      "relation": "las fronteras dominicanas solicitadas y su relación con los mapas o documentos examinados, distinguiendo verificación de información y resolución de controversias reales",
      "pages": [
        276
      ]
    },
    {
      "id": "political-administration",
      "grade": 6,
      "label": "división política y administrativa dominicana",
      "match": "division politica|division administrativa|regiones, provincias y municipios",
      "relation": "las regiones, provincias o municipios dominicanos expresamente examinados y sus relaciones administrativas o de desarrollo, sin imponer todas las divisiones del país",
      "pages": [
        276
      ]
    },
    {
      "id": "mountains-climate-soils",
      "grade": 6,
      "label": "montañas, clima y suelos dominicanos",
      "match": "montanas|sistemas montanosos|diversificacion climatica|variacion de suelos|variacion de los suelos|variantes climaticas|zonas ecologicas",
      "relation": "los sistemas montañosos, climas o suelos dominicanos expresamente solicitados y sus relaciones espaciales, distinguiendo datos e inferencias sin imponer otros territorios",
      "pages": [
        276
      ]
    },
    {
      "id": "valleys-plains",
      "grade": 6,
      "label": "valles, llanuras y regiones especiales dominicanas",
      "match": "valles|llanuras|regiones especiales",
      "relation": "los valles, llanuras o regiones dominicanas solicitados y las relaciones del territorio expresamente examinadas con sus referencias espaciales",
      "pages": [
        276
      ]
    },
    {
      "id": "coastal-relief",
      "grade": 6,
      "label": "relieve costero dominicano",
      "match": "relieve costero|playas|bahias|ensenadas",
      "relation": "las formas del relieve costero dominicano solicitadas, sus características y relaciones con los datos o mapas del ejercicio",
      "pages": [
        276
      ]
    },
    {
      "id": "coastal-marine-ecosystems",
      "grade": 6,
      "label": "ecosistemas costeros y marinos dominicanos",
      "match": "ecosistemas costeros|ecosistemas marinos",
      "relation": "los ecosistemas costeros o marinos dominicanos expresamente solicitados y las relaciones con usos, biodiversidad o conservación examinadas, sin inventar mediciones",
      "pages": [
        276
      ]
    },
    {
      "id": "agroforestry-systems",
      "grade": 6,
      "label": "sistemas agroforestales dominicanos",
      "match": "agroforestal[a-z]*",
      "relation": "las características, clasificación, funciones o ventajas de los sistemas agroforestales expresamente solicitados y sus condiciones de implementación en los casos dados",
      "pages": [
        276
      ]
    },
    {
      "id": "protected-areas-system",
      "grade": 6,
      "label": "Sistema Nacional de Áreas Protegidas",
      "match": "sistema.*areas protegidas|ley 64[- ]?00|defensa de las areas protegidas",
      "relation": "el alcance y las limitaciones del sistema de áreas protegidas examinados en el material, conservando sus evidencias sin afirmar eficacia universal ni vigencia legal actual",
      "pages": [
        276,
        277
      ]
    },
    {
      "id": "protected-areas-law",
      "grade": 6,
      "label": "normativa sectorial de áreas protegidas del material",
      "match": "ley 202[- ]?04|normativa sectorial.*areas protegidas",
      "relation": "el significado y alcance de las disposiciones sectoriales sobre áreas protegidas expresamente proporcionadas, sin inventar obligaciones, sanciones o vigencia",
      "pages": [
        276
      ]
    },
    {
      "id": "renewable-energy-norms",
      "grade": 6,
      "label": "referencia curricular sobre energías renovables",
      "match": "energias renovables|ley 67[- ]?00",
      "relation": "las disposiciones sobre energías renovables expresamente dadas, conservando la referencia curricular y distinguiendo texto e interpretación sin certificar vigencia ni corregir silenciosamente el literal",
      "pages": [
        276,
        277
      ]
    },
    {
      "id": "environmental-project",
      "grade": 6,
      "label": "proyecto de protección ambiental",
      "match": "proyecto.*proteccion ambiental|actividad.*medio ambiente|actividades.*medio ambiente|proyecto.*deterioro ambiental|proyecto.*cambio climatico",
      "relation": "el propósito, acciones y condiciones del proyecto ambiental solicitado, diferenciando planificación de ejecución y conservando el alcance del caso",
      "pages": [
        277,
        279
      ]
    },
    {
      "id": "hydrographic-basins",
      "grade": 6,
      "label": "cuencas hidrográficas dominicanas",
      "match": "cuencas hidrograficas|recursos hidricos",
      "relation": "las cuencas o recursos hídricos dominicanos solicitados y sus referencias espaciales o usos examinados, sin inventar caudales",
      "pages": [
        277
      ]
    },
    {
      "id": "marine-fluvial-runoff",
      "grade": 6,
      "label": "aguas marinas, formas fluviales y escorrentía dominicanas",
      "match": "aguas marinas|formas fluviales|escorrentia",
      "relation": "las características de aguas marinas, formas fluviales o escorrentía dominicanas expresamente solicitadas y sus relaciones con los espacios del ejercicio",
      "pages": [
        277
      ]
    },
    {
      "id": "aquifer-system",
      "grade": 6,
      "label": "sistema acuífero dominicano",
      "match": "acuifero|aguas superficiales|aguas subterraneas",
      "relation": "la evolución y relaciones del sistema acuífero dominicano solicitado, distinguiendo aguas superficiales y subterráneas cuando corresponda sin inventar mediciones",
      "pages": [
        277
      ]
    },
    {
      "id": "drought-agriculture",
      "grade": 6,
      "label": "sequía y sistemas agrícolas dominicanos",
      "match": "sequia.*agricol|sequias.*agricol",
      "relation": "los efectos de la sequía sobre los sistemas agrícolas expresamente examinados y sus condiciones, con respaldo en los datos del material",
      "pages": [
        277
      ]
    },
    {
      "id": "digital-repositories",
      "grade": 6,
      "label": "repositorios geográficos e históricos del ejercicio",
      "match": "repositorios|registros.*archivo general|eme[- ]eme|revista clio",
      "relation": "la selección y uso de información de los registros de repositorios solicitados, conservando procedencia, fecha y pertinencia sin exigir otros sitios",
      "pages": [
        277,
        278
      ]
    },
    {
      "id": "national-official-sources",
      "grade": 6,
      "label": "fuentes oficiales nacionales del ejercicio",
      "match": "fuentes oficiales nacionales|fuentes oficiales.*nacional|oficina nacional de estadisticas",
      "relation": "la procedencia y alcance de las fuentes oficiales nacionales solicitadas y su pertinencia para la consulta, sin tratar su carácter oficial como garantía automática",
      "pages": [
        277
      ]
    },
    {
      "id": "international-official-sources",
      "grade": 6,
      "label": "fuentes de organismos internacionales del ejercicio",
      "match": "organismos internacionales|banco mundial|fondo monetario internacional|banco interamericano|naciones unidas",
      "relation": "la selección de información de los organismos internacionales expresamente solicitados, conservando fechas, unidades y límites de comparabilidad",
      "pages": [
        277
      ]
    },
    {
      "id": "population-problems",
      "grade": 6,
      "label": "desempleo, hacinamiento y marginalidad del caso",
      "match": "desempleo|hacinamiento|marginalidad",
      "relation": "los problemas de población expresamente examinados y sus condiciones y evidencias, sin atribuir rasgos morales o recopilar vivencias privadas",
      "pages": [
        277
      ]
    },
    {
      "id": "water-access",
      "grade": 6,
      "label": "acceso y distribución del agua",
      "match": "acceso al agua|distribucion desigual|acopio y riego",
      "relation": "las condiciones de acceso, distribución o uso del agua expresamente examinadas y sus relaciones con el problema del caso, sin imponer todos los factores ni inventar mediciones",
      "pages": [
        277,
        279
      ]
    },
    {
      "id": "source-similarity-review",
      "grade": 6,
      "label": "atribuciones del informe antiplagio proporcionado",
      "match": "antiplagio|antiplagios",
      "relation": "las coincidencias y atribuciones del informe proporcionado, distinguiendo semejanza textual, autoría y veracidad sin convertir un porcentaje en prueba suficiente",
      "pages": [
        277
      ]
    },
    {
      "id": "natural-resource-research",
      "grade": 6,
      "label": "recursos agrícolas, ganaderos, forestales y mineros dominicanos",
      "match": "recursos agricolas|recursos ganaderos|recursos forestales|recursos mineros",
      "relation": "los hallazgos documentales sobre los recursos dominicanos expresamente solicitados, conservando procedencia, espacios y límites de sus evidencias",
      "pages": [
        277
      ]
    },
    {
      "id": "agrochemical-impact",
      "grade": 6,
      "label": "agroquímicos e impactos del caso",
      "match": "agroquimic[a-z]*",
      "relation": "los impactos de los agroquímicos expresamente examinados mediante los datos del caso, distinguiendo relaciones respaldadas e inferencias sin inventar mediciones o diagnósticos",
      "pages": [
        277,
        279
      ]
    },
    {
      "id": "forestry-mining-impact",
      "grade": 6,
      "label": "actividad forestal y minera e impactos del caso",
      "match": "actividad forestal|actividades forestales|actividad minera|actividades mineras|explotacion forestal|explotacion minera",
      "relation": "la importancia y riesgos de las actividades forestales o mineras expresamente examinadas, con respaldo en el material sin emitir diagnósticos sanitarios",
      "pages": [
        277,
        279
      ]
    },
    {
      "id": "demographic-rates",
      "grade": 6,
      "label": "tasas de natalidad y mortalidad",
      "match": "tasas? de natalidad|tasas? de mortalidad|formulas.*poblacion|nacimientos, defunciones",
      "relation": "las tasas demográficas solicitadas, sus fórmulas, bases, unidades y significado en el período de los datos, sin confundir conteos y tasas",
      "pages": [
        277
      ]
    },
    {
      "id": "demographic-evolution",
      "grade": 6,
      "label": "evolución demográfica dominicana desde 1950",
      "match": "evolucion demografica|crecimiento demografico|poblacion dominicana desde 1950",
      "relation": "los cambios demográficos dominicanos expresamente solicitados, conservando fechas, fuentes y magnitudes sin inventar una actualización",
      "pages": [
        277
      ]
    },
    {
      "id": "urban-rural-growth",
      "grade": 6,
      "label": "crecimiento urbano y rural dominicano",
      "match": "crecimiento poblacional.*urbano|crecimiento urbano|poblacion urbana|exodo|campo a la ciudad",
      "relation": "los cambios urbanos o rurales y sus relaciones con los movimientos y condiciones del caso, sin culpar a quienes migran ni inferir vivencias familiares",
      "pages": [
        277
      ]
    },
    {
      "id": "population-pyramid",
      "grade": 6,
      "label": "pirámide poblacional dominicana",
      "match": "piramide poblacional|piramide demografica",
      "relation": "la distribución por edades y categorías de la pirámide poblacional solicitada con sus escalas, porcentajes y fecha, sin deducir tasas exactas o pronósticos de su forma",
      "pages": [
        277
      ]
    },
    {
      "id": "migration-movements",
      "grade": 6,
      "label": "migraciones dominicanas y mundiales del caso",
      "match": "emigracion|inmigracion|movimientos.*migracion|movimientos de poblacion|situacion migratoria",
      "relation": "los flujos migratorios y condiciones expresamente examinados, conservando espacios, períodos, fuentes y derechos sin generalizar conductas por nacionalidad",
      "pages": [
        277,
        278
      ]
    },
    {
      "id": "migration-norms",
      "grade": 6,
      "label": "disposiciones migratorias proporcionadas",
      "match": "disposiciones migratorias|normativas.*migratori|normas migratorias|politicas migratorias",
      "relation": "el significado y alcance de las disposiciones migratorias expresamente dadas, distinguiendo texto e interpretación sin determinar la situación legal de personas reales",
      "pages": [
        277
      ]
    },
    {
      "id": "agricultural-systems",
      "grade": 6,
      "label": "conucos, agropecuaria extensiva y agricultura intensiva",
      "match": "conucos|agropecuaria extensiva|agricultura intensiva",
      "relation": "las características de los sistemas agropecuarios solicitados y sus diferencias sustentadas mediante dimensiones comunes, sin jerarquizar a productores o inventar rendimientos",
      "pages": [
        277
      ]
    },
    {
      "id": "economic-sectors",
      "grade": 6,
      "label": "sectores económicos primario, secundario y terciario",
      "match": "sectores economicos|sectores primario|sector primario|primarias, secundarias y terciarias",
      "relation": "las actividades, funciones e impactos de los sectores económicos expresamente examinados y sus relaciones con los datos del material",
      "pages": [
        277,
        278
      ]
    },
    {
      "id": "transport-production-trade",
      "grade": 6,
      "label": "transporte, producción e intercambios dominicanos",
      "match": "transporte nacional|medios de transporte|sistema de produccion local|intercambios comerciales",
      "relation": "los medios de transporte, producción o intercambios dominicanos solicitados y sus relaciones con los espacios y períodos del ejercicio",
      "pages": [
        277
      ]
    },
    {
      "id": "export-products",
      "grade": 6,
      "label": "productos de exportación dominicanos",
      "match": "productos de exportacion|exportaciones dominicanas",
      "relation": "los productos de exportación dominicanos expresamente indicados y sus características o relaciones examinadas, sin inventar cifras o mercados actuales",
      "pages": [
        277
      ]
    },
    {
      "id": "border-markets",
      "grade": 6,
      "label": "mercados fronterizos dominicanos",
      "match": "mercados fronterizos",
      "relation": "los aportes, condiciones o desventajas de los mercados fronterizos expresamente examinados con respaldo en las fuentes, sin generalizar riesgos por nacionalidad",
      "pages": [
        277
      ]
    },
    {
      "id": "modern-dominican-trade",
      "grade": 6,
      "label": "comercio dominicano de finales del XX e inicios del XXI",
      "match": "comercio dominicano|comercio de la republica dominicana",
      "relation": "los intercambios comerciales dominicanos expresamente solicitados en sus fechas y espacios, diferenciando datos e interpretación sin inventar una actualización",
      "pages": [
        277
      ]
    },
    {
      "id": "economic-policy-sovereignty",
      "grade": 6,
      "label": "política económica, desarrollo y soberanía",
      "match": "politica economica, desarrollo|politica economica.*soberania",
      "relation": "las relaciones entre política económica, desarrollo o soberanía expresamente examinadas en el caso, sin imponer una preferencia política",
      "pages": [
        277
      ]
    },
    {
      "id": "cooperatives",
      "grade": 6,
      "label": "cooperativismo",
      "match": "cooperativismo|cooperativas",
      "relation": "las normas, funciones y relaciones del cooperativismo expresamente solicitadas en los documentos del ejercicio, sin recomendar productos financieros",
      "pages": [
        277
      ]
    },
    {
      "id": "insurance-reinsurance",
      "grade": 6,
      "label": "seguros y reaseguros",
      "match": "seguros y reaseguros|seguros|reaseguros",
      "relation": "las características y funciones de seguros o reaseguros expresamente examinadas, conservando las condiciones del material sin recomendar contratos reales",
      "pages": [
        277
      ]
    },
    {
      "id": "pension-system",
      "grade": 6,
      "label": "sistema de pensiones del ejercicio",
      "match": "pensiones|sistema de pension",
      "relation": "las normas y funciones del sistema de pensiones expresamente proporcionadas, distinguiendo el análisis del ejercicio de decisiones financieras personales",
      "pages": [
        277
      ]
    },
    {
      "id": "national-products",
      "grade": 6,
      "label": "Producto Nacional Bruto y Neto",
      "match": "producto nacional bruto y neto|producto nacional neto",
      "relation": "las definiciones y magnitudes del Producto Nacional Bruto o Neto expresamente solicitadas, conservando unidades y períodos sin sustituir Nacional por Interior",
      "pages": [
        277
      ]
    },
    {
      "id": "supply-demand",
      "grade": 6,
      "label": "oferta y demanda",
      "match": "oferta y demanda",
      "relation": "las relaciones de oferta y demanda expresamente examinadas y sus supuestos, datos y efectos del caso sin inventar precios actuales o recomendaciones de inversión",
      "pages": [
        277
      ]
    },
    {
      "id": "public-external-sector",
      "grade": 6,
      "label": "sector público y sector externo",
      "match": "sector publico|sector externo",
      "relation": "las funciones y relaciones del sector público o externo expresamente examinadas, conservando los datos y períodos del material",
      "pages": [
        277
      ]
    },
    {
      "id": "international-debt",
      "grade": 6,
      "label": "deuda pública, soberana y privada internacional",
      "match": "deuda publica|deuda soberana|deuda privada",
      "relation": "las categorías y relaciones de deuda expresamente solicitadas con sus definiciones y alcance del material, sin recomendar operaciones financieras",
      "pages": [
        277
      ]
    },
    {
      "id": "development-underdevelopment",
      "grade": 6,
      "label": "teorías de desarrollo y subdesarrollo",
      "match": "desarrollo y subdesarrollo|economias desarrolladas|economias subdesarrolladas",
      "relation": "los planteamientos y condiciones de desarrollo o subdesarrollo expresamente examinados, distinguiendo argumentos y evidencias sin jerarquizar culturas o exigir adhesión",
      "pages": [
        277,
        278
      ]
    },
    {
      "id": "border-agricultural-production",
      "grade": 6,
      "label": "producción agrícola de provincias fronterizas",
      "match": "produccion agricola.*fronterizas|producciones agricolas.*fronterizas",
      "relation": "las producciones agrícolas de las provincias fronterizas dominicanas expresamente examinadas y sus impactos en el caso local, sin inventar rendimientos",
      "pages": [
        278
      ]
    },
    {
      "id": "sugar-sector",
      "grade": 6,
      "label": "sector azucarero dominicano en el siglo XX",
      "match": "sector azucarero|azucar.*siglo xx",
      "relation": "los hechos y relaciones del sector azucarero expresamente solicitados en el siglo XX, conservando sus actores, espacios y evidencias",
      "pages": [
        278
      ]
    },
    {
      "id": "social-survey-methods",
      "grade": 6,
      "label": "entrevistas, encuestas y sondeos de investigación social",
      "match": "entrevista|encuesta|sondeo",
      "relation": "las decisiones de método, preguntas, participantes ficticios y registro de una entrevista, encuesta o sondeo solicitado, sin exigir las tres técnicas ni recolectar datos privados",
      "pages": [
        278
      ]
    },
    {
      "id": "risk-zones",
      "grade": 6,
      "label": "riesgo y vulnerabilidad ante fenómenos naturales",
      "match": "zonas de riesgo|zonas de vulnerabilidad|fenomeno natural|fenomenos naturales",
      "relation": "las zonas, peligros y condiciones de exposición o vulnerabilidad expresamente indicadas con sus referencias espaciales, sin predecir desastres o indagar ubicaciones personales",
      "pages": [
        278
      ]
    },
    {
      "id": "occupation-1916-1924",
      "grade": 6,
      "label": "ocupación estadounidense de 1916–1924",
      "match": "ocupacion estadounidense|ocupacion de 1916|ocupacion militar estadounidense|1916[-–]1924",
      "relation": "los acontecimientos, condiciones e impactos de la ocupación de 1916–1924 expresamente examinados, conservando sus evidencias y límites temporales",
      "pages": [
        277,
        278
      ]
    },
    {
      "id": "vasquez-government",
      "grade": 6,
      "label": "gobierno de Horacio Vásquez, 1924–1930",
      "match": "horacio vasquez|1924[-–]1930",
      "relation": "las características y cambios del gobierno de Horacio Vásquez expresamente solicitados, con sus fechas, actores y evidencias sin imponer períodos posteriores",
      "pages": [
        278
      ]
    },
    {
      "id": "political-crisis-1928",
      "grade": 6,
      "label": "crisis política dominicana de 1928",
      "match": "crisis politica.*1928",
      "relation": "las condiciones y acontecimientos de la crisis política de 1928 expresamente examinados, distinguiéndolos de otras crisis o períodos",
      "pages": [
        278
      ]
    },
    {
      "id": "economic-crisis-1929",
      "grade": 6,
      "label": "efectos dominicanos de la crisis de 1929",
      "match": "crisis de 1929|crisis del 29|crisis economica mundial de 1929",
      "relation": "los efectos dominicanos de la crisis de 1929 expresamente solicitados y sus relaciones con condiciones y hechos del caso",
      "pages": [
        278
      ]
    },
    {
      "id": "trujillo-dictatorship",
      "grade": 6,
      "label": "dictadura de Trujillo, 1930–1961",
      "match": "dictadura de trujillo|regimen de trujillo|dictadura de rafael",
      "relation": "los hechos, medidas y relaciones de la dictadura de Trujillo expresamente examinados, conservando sus actores, fechas y evidencias sin imponer todo el período",
      "pages": [
        278
      ]
    },
    {
      "id": "trujillo-monopoly",
      "grade": 6,
      "label": "monopolio trujillista y expansión agroindustrial",
      "match": "monopolio trujillista|expansion agroindustrial",
      "relation": "las características y relaciones del monopolio trujillista o expansión agroindustrial expresamente examinadas con respaldo en los documentos y condiciones del caso",
      "pages": [
        278
      ]
    },
    {
      "id": "propaganda-disinformation",
      "grade": 6,
      "label": "propaganda, desinformación y opinión pública",
      "match": "propaganda politica|desinformacion|control de la opinion publica",
      "relation": "las estrategias y efectos de propaganda, desinformación o control de la opinión pública expresamente examinados, distinguiendo mensajes, evidencias e inferencias",
      "pages": [
        278
      ]
    },
    {
      "id": "state-violence-1937",
      "grade": 6,
      "label": "violencia estatal y genocidio de 1937",
      "match": "genocidio de 1937|violencia militar|violencia paramilitar",
      "relation": "los hechos, actores y condiciones de la violencia estatal expresamente examinada, conservando evidencias sin recrear violencia ni atribuir culpa a nacionalidades actuales",
      "pages": [
        278
      ]
    },
    {
      "id": "cultural-religious-policy",
      "grade": 6,
      "label": "política cultural y religiosa del régimen",
      "match": "hispanismo|catolicismo|politica cultural|iglesia y religiosidad",
      "relation": "las políticas culturales o religiosas del régimen expresamente examinadas con sus contextos y evidencias, sin evaluar fe o creencias privadas del estudiante",
      "pages": [
        278
      ]
    },
    {
      "id": "trujillo-foreign-policy",
      "grade": 6,
      "label": "política internacional de Trujillo",
      "match": "politica internacional de trujillo|politica internacional.*guerra fria",
      "relation": "las decisiones y relaciones de política internacional de Trujillo expresamente examinadas en el Caribe o Latinoamérica, conservando actores, períodos y límites de las evidencias",
      "pages": [
        278
      ]
    },
    {
      "id": "trujillo-interim-governments",
      "grade": 6,
      "label": "gobiernos interinos de la época trujillista",
      "match": "gobiernos interinos|gobierno interino|troncoso",
      "relation": "las características y decisiones de los gobiernos interinos expresamente solicitados, conservando fechas y atribuciones sin tratar a sus actores como intercambiables",
      "pages": [
        278
      ]
    },
    {
      "id": "dictatorship-resistance",
      "grade": 6,
      "label": "luchas y resistencia a la dictadura",
      "match": "resistencia.*dictadura|lucha.*dictadura|luchas.*dictadura",
      "relation": "las formas de lucha o resistencia expresamente solicitadas y sus actores y condiciones, diferenciando hechos históricos de recursos de representación",
      "pages": [
        278
      ]
    },
    {
      "id": "regime-duration",
      "grade": 6,
      "label": "factores de duración del régimen",
      "match": "duracion del regimen|larga duracion|factores.*duracion",
      "relation": "los factores de duración del régimen expresamente examinados y su respaldo contextual, sin convertir duración en aprobación moral o atribuir causas ausentes",
      "pages": [
        278
      ]
    },
    {
      "id": "dictatorship-end",
      "grade": 6,
      "label": "crisis y final del régimen en 1961",
      "match": "crisis del regimen|final de la dictadura|final en 1961|muerte de trujillo|ajusticiamiento",
      "relation": "las condiciones y acontecimientos del final del régimen en 1961 expresamente solicitados, distinguiendo factores, decisiones y efectos posteriores",
      "pages": [
        278
      ]
    },
    {
      "id": "democratic-struggles",
      "grade": 6,
      "label": "luchas democráticas y movimientos sociales de 1961–1963",
      "match": "luchas democraticas|movimientos sociales|14 de junio|manolo tavares|manolo tabares",
      "relation": "los aportes, actores y condiciones de los movimientos o luchas democráticas expresamente examinados, conservando períodos y evidencias sin presuponer unanimidad",
      "pages": [
        278
      ]
    },
    {
      "id": "trujillismo-legacy",
      "grade": 6,
      "label": "remanentes del trujillismo en el caso",
      "match": "remanentes del trujillismo|trujillismo",
      "relation": "las interpretaciones de los remanentes del trujillismo expresamente planteadas en el caso y sus evidencias, sin juzgar preferencias o atribuir hechos a personas reales",
      "pages": [
        278
      ]
    },
    {
      "id": "political-parties",
      "grade": 6,
      "label": "partidos políticos dominicanos de los registros",
      "match": "partidos politicos",
      "relation": "los partidos políticos expresamente incluidos en los registros del ejercicio y sus nombres, períodos o relaciones solicitados, sin inventar una lista actual",
      "pages": [
        278
      ]
    },
    {
      "id": "bosch-government",
      "grade": 6,
      "label": "gobierno de Bosch y Constitución de 1963",
      "match": "gobierno de bosch|gobierno de juan.*bosch|constitucion de 1963",
      "relation": "las características y disposiciones del gobierno de Bosch o Constitución de 1963 expresamente examinadas, conservando texto y contexto sin atribuir vigencia actual",
      "pages": [
        278
      ]
    },
    {
      "id": "coup-1963",
      "grade": 6,
      "label": "golpe de Estado a Bosch",
      "match": "golpe a bosch|golpe de estado.*bosch|golpe de estado de 1963|golpe de estado",
      "relation": "los acontecimientos y condiciones del golpe a Bosch expresamente solicitados y sus relaciones con los hechos del material, sin inventar una causa única",
      "pages": [
        278
      ]
    },
    {
      "id": "triumvirate",
      "grade": 6,
      "label": "Triunvirato dominicano",
      "match": "triunvirato",
      "relation": "las características, decisiones o condiciones del Triunvirato expresamente examinadas y sus relaciones en el período dado",
      "pages": [
        278
      ]
    },
    {
      "id": "april-revolution-1965",
      "grade": 6,
      "label": "Revolución de Abril e intervención de 1965",
      "match": "revolucion de abril|guerra de abril|abril de 1965|intervencion de 1965|invasion.*1965|constitucionalistas de abril",
      "relation": "los hechos, sectores e impactos de Abril de 1965 expresamente examinados, diferenciando evidencia histórica, interpretación y escenificación",
      "pages": [
        278
      ]
    },
    {
      "id": "national-reconstruction-government",
      "grade": 6,
      "label": "Gobierno de Reconstrucción Nacional",
      "match": "reconstruccion nacional",
      "relation": "las características y procesos del Gobierno de Reconstrucción Nacional expresamente examinados, conservando sus actores y período sin confundirlo con otro gobierno",
      "pages": [
        278
      ]
    },
    {
      "id": "political-economic-changes-1966-2004",
      "grade": 6,
      "label": "cambios dominicanos de 1966–2004",
      "match": "cambios politicos y economicos.*1966|1966[-–]2004",
      "relation": "los cambios políticos o económicos dominicanos expresamente solicitados entre 1966 y 2004 y sus relaciones sustentadas en las fuentes",
      "pages": [
        278
      ]
    },
    {
      "id": "godoy-government",
      "grade": 6,
      "label": "gobierno de Godoy",
      "match": "gobierno de godoy|gobierno del gobierno de godoy|garcia godo|gobierno de hector rafael",
      "relation": "los procesos del gobierno de Godoy expresamente solicitados en los textos del ejercicio, conservando las atribuciones y registrando la inconsistencia nominal de la fuente sin corregirla silenciosamente",
      "pages": [
        278
      ]
    },
    {
      "id": "balaguer-twelve-years",
      "grade": 6,
      "label": "doce años de Balaguer, 1966–1978",
      "match": "doce anos|12 anos|balaguer.*1966|llegada de balaguer|balaguer al poder",
      "relation": "las características, condiciones o procesos de los doce años de Balaguer expresamente solicitados, con sus evidencias y sin imponer todas las dimensiones del período",
      "pages": [
        278
      ]
    },
    {
      "id": "political-alternation-1978",
      "grade": 6,
      "label": "alternabilidad política desde 1978",
      "match": "alternabilidad|alternancia|proceso politico.*1978",
      "relation": "los procesos de alternabilidad política expresamente examinados desde 1978, distinguiendo continuidades, cambios y condiciones respaldadas por el material",
      "pages": [
        279
      ]
    },
    {
      "id": "guzman-government",
      "grade": 6,
      "label": "gobierno de Antonio Guzmán, 1978–1982",
      "match": "guzman",
      "relation": "las características y decisiones del gobierno de Guzmán expresamente solicitadas, conservando su período y evidencias sin ampliar a gobiernos no pedidos",
      "pages": [
        279
      ]
    },
    {
      "id": "jorge-blanco-government",
      "grade": 6,
      "label": "gobierno de Jorge Blanco, 1982–1986",
      "match": "jorge blanco",
      "relation": "las características y decisiones del gobierno de Jorge Blanco expresamente examinadas con sus condiciones, fechas y evidencias",
      "pages": [
        279
      ]
    },
    {
      "id": "majluta-government",
      "grade": 6,
      "label": "gobierno de Jacobo Majluta, 1986",
      "match": "majluta",
      "relation": "las características y procesos del gobierno de Majluta expresamente solicitados, conservando su período y respaldo en los textos",
      "pages": [
        279
      ]
    },
    {
      "id": "global-context-1989",
      "grade": 6,
      "label": "cambios políticos y económicos del contexto de 1989",
      "match": "bloque sovietico|contexto.*1989|politica estadounidense",
      "relation": "las relaciones de los cambios de política estadounidense o del bloque soviético expresamente examinados con los hechos dominicanos del material, sin extender automáticamente el análisis a toda la Guerra Fría",
      "pages": [
        279
      ]
    },
    {
      "id": "environmental-degradation",
      "grade": 6,
      "label": "deterioro ambiental global y dominicano",
      "match": "deterioro ambiental|problemas globales.*ambientales|problemas globales.*medio ambiente|deforestacion|sobreexplotacion|desperdicio|contaminacion",
      "relation": "los problemas y condiciones de deterioro ambiental expresamente examinados y sus relaciones con datos y espacios del caso, sin inventar mediciones o efectos",
      "pages": [
        277,
        279
      ]
    },
    {
      "id": "party-governments-2000-2010",
      "grade": 6,
      "label": "gobiernos del PRD, PRSC y PLD de 2000–2010",
      "match": "prd|prsc|pld|gobiernos.*2000[-–]2010",
      "relation": "las características y relaciones de los gobiernos expresamente incluidos en el material de 2000–2010, conservando fechas y atribuciones sin inventar gobiernos o juzgar preferencias partidarias",
      "pages": [
        279
      ]
    },
    {
      "id": "governments-since-1978",
      "grade": 6,
      "label": "gobiernos dominicanos desde 1978 del material",
      "match": "gobiernos surgidos|gobiernos.*desde 1978|gobiernos dominicanos de 1978",
      "relation": "las decisiones, condiciones y valoraciones de los gobiernos dominicanos expresamente incluidos desde 1978 en el material, conservando su fecha y alcance sin inventar una actualización",
      "pages": [
        279
      ]
    },
    {
      "id": "society-twenty-first-century",
      "grade": 6,
      "label": "sociedad dominicana del siglo XXI",
      "match": "sociedad dominicana.*siglo xxi|sociedad del siglo xxi|avances heredados|temas pendientes",
      "relation": "las dimensiones económicas, políticas, sociales o culturales de la sociedad dominicana del siglo XXI expresamente examinadas y sus relaciones con los datos y fecha del material",
      "pages": [
        279
      ]
    },
    {
      "id": "constitutional-changes-1963-2010",
      "grade": 6,
      "label": "cambios constitucionales dominicanos de 1963–2010",
      "match": "cambios.*constitucion|constituciones dominicanas.*1963|constituciones.*1963[-–]2010",
      "relation": "las disposiciones y cambios constitucionales dominicanos expresamente proporcionados de 1963–2010, conservando dimensiones comunes, texto y contexto sin inventar vigencia",
      "pages": [
        279
      ]
    },
    {
      "id": "national-project-solutions",
      "grade": 6,
      "label": "proyectos de solución a problemas nacionales e internacionales",
      "match": "proyecto de solucion|proyectos de solucion|proyecto.*problema nacional|proyecto.*problema internacional|problema nacional o internacional",
      "relation": "el propósito, acciones y condiciones del proyecto de solución expresamente solicitado, distinguiendo planificación y ejecución sin inventar contactos o recursos",
      "pages": [
        279
      ]
    },
    {
      "id": "national-identity",
      "grade": 6,
      "label": "contexto histórico de identidad dominicana",
      "match": "identidad dominicana|reflexiones.*identidad|pensamiento dominicano",
      "relation": "los contextos, autores y argumentos sobre identidad dominicana expresamente examinados, sin evaluar identidad privada, fe o adhesión patriótica",
      "pages": [
        279
      ]
    },
    {
      "id": "national-symbols",
      "grade": 6,
      "label": "historia y significado de símbolos patrios",
      "match": "simbolos patrios|emblemas nacionales",
      "relation": "la historia, significado o aportes de las figuras de los símbolos expresamente examinados con respaldo en el material, sin exigir adhesión patriótica",
      "pages": [
        279
      ]
    },
    {
      "id": "sovereignty-identity-creation",
      "grade": 6,
      "label": "creación sobre soberanía e identidad nacional",
      "match": "poema|cancion|composicion literaria",
      "relation": "el sentido de la creación expresamente elegida sobre soberanía o identidad y sus decisiones de lenguaje, sin exigir todas las formas, talento avanzado o sentimientos privados",
      "pages": [
        279
      ]
    },
    {
      "id": "duarte-constitutional-project",
      "grade": 6,
      "label": "proyecto de nación y Constitución de Duarte",
      "match": "proyecto.*duarte|duarte.*proyecto",
      "relation": "las propuestas y relaciones del proyecto de nación o constitucional de Duarte expresamente examinadas, conservando los documentos y su contexto sin inventar vigencia",
      "pages": [
        279
      ]
    },
    {
      "id": "nation-project-ideologies",
      "grade": 6,
      "label": "proyecto de nación entre liberalismo y conservadurismo",
      "match": "proyecto de nacion entre liberalismo y conservadurismo|proyecto de nacion.*liberalismo",
      "relation": "los planteamientos liberales y conservadores del proyecto de nación expresamente examinados, conservando sus argumentos y condiciones históricas sin imponer adhesión política",
      "pages": [
        278
      ]
    },
    {
      "id": "economic-theories",
      "grade": 6,
      "label": "teorías económicas e incidencia social",
      "match": "teorias economicas",
      "relation": "los supuestos, propuestas y relaciones de incidencia social de las teorías económicas expresamente examinadas, conservando evidencias y condiciones sin exigir adhesión",
      "pages": [
        278
      ]
    },
    {
      "id": "bosch-democratic-project",
      "grade": 6,
      "label": "proyecto liberal democrático de Bosch",
      "match": "proyecto liberal democratico|proyecto.*bosch",
      "relation": "los planteamientos del proyecto liberal democrático de Bosch expresamente examinados y sus relaciones con el caso, sin sustituirlos por toda la actuación de su gobierno",
      "pages": [
        278,
        279
      ]
    },
    {
      "id": "conservative-neoliberalism",
      "grade": 6,
      "label": "neoliberalismo conservador",
      "match": "neoliberalismo conservador",
      "relation": "los planteamientos, supuestos y relaciones del neoliberalismo conservador expresamente examinados en los textos y casos dados, sin exigir adhesión o inventar efectos actuales",
      "pages": [
        279
      ]
    },
    {
      "id": "democracy-national-project",
      "grade": 6,
      "label": "proyecto nacional y Estado democrático",
      "match": "proyecto nacional|estado democratico|democracia como forma de vida",
      "relation": "las relaciones entre proyecto nacional, Estado democrático y prácticas de vida social expresamente examinadas, con respaldo en el caso sin juzgar moralidad o preferencias privadas",
      "pages": [
        279
      ]
    },
    {
      "id": "democratic-government-simulation",
      "grade": 6,
      "label": "funciones democráticas de gobierno nacional o local",
      "match": "funciones democraticas|rol de gobierno|acciones.*funciones.*gobierno",
      "relation": "las acciones y funciones del rol de gobierno nacional o local solicitado, conservando competencias, reglas y límites del caso sin exigir ambos niveles",
      "pages": [
        279
      ]
    },
    {
      "id": "equality-diversity-inclusion",
      "grade": 6,
      "label": "igualdad, diversidad, inclusión y exclusión",
      "match": "igualdad|diversidad|inclusion|exclusion",
      "relation": "las situaciones de igualdad, diversidad, inclusión o exclusión expresamente dadas y sus evidencias, sin indagar experiencias privadas o generalizar rasgos de grupos",
      "pages": [
        279
      ]
    },
    {
      "id": "democratic-practices",
      "grade": 6,
      "label": "prácticas democráticas y no democráticas",
      "match": "practicas democraticas|practicas no democraticas",
      "relation": "las características de las prácticas democráticas o no democráticas expresamente examinadas y las razones respaldadas por criterios y hechos del caso",
      "pages": [
        279
      ]
    },
    {
      "id": "legal-social-projects",
      "grade": 6,
      "label": "ordenamientos jurídicos y proyectos sociales",
      "match": "ordenamiento juridico|ordenamientos juridicos|norma y aspiracion",
      "relation": "las diferencias y relaciones entre disposiciones jurídicas y proyectos sociales expresamente proporcionados, conservando texto, propósito y contexto sin inventar obligaciones",
      "pages": [
        279
      ]
    },
    {
      "id": "conflict-solutions",
      "grade": 6,
      "label": "propuestas de solución de conflictos",
      "match": "solucion de conflictos|soluciones.*conflicto|conflicto ficticio",
      "relation": "las necesidades, derechos y alternativas de solución del conflicto expresamente dado y sus condiciones, sin imponer acuerdo ni revelar vivencias privadas",
      "pages": [
        279
      ]
    },
    {
      "id": "universal-values",
      "grade": 6,
      "label": "valores universales y convivencia",
      "match": "valores universales|valores humanos",
      "relation": "las relaciones de los valores expresamente examinados con decisiones, derechos y convivencia del caso, sin calificar fe, sentimientos o supuesta moralidad",
      "pages": [
        279
      ]
    },
    {
      "id": "road-safety",
      "grade": 6,
      "label": "educación y riesgos viales",
      "match": "educacion vial|normas viales|riesgos viales|transito real|concienciacion vial",
      "relation": "las normas, riesgos o acciones viales expresamente solicitados en el caso ficticio, distinguiendo planificación, simulación y actuación real sin recopilar datos de víctimas",
      "pages": [
        279
      ]
    },
    {
      "id": "tax-education",
      "grade": 6,
      "label": "educación y normas tributarias del ejercicio",
      "match": "educacion tributaria|normas tributarias|normativas tributarias|normas viales y tributarias",
      "relation": "el significado y las acciones educativas sobre normas tributarias expresamente dadas, sin calcular impuestos personales o inventar obligaciones vigentes",
      "pages": [
        279
      ]
    },
    {
      "id": "social-family-violence",
      "grade": 6,
      "label": "violencia social e intrafamiliar en casos proporcionados",
      "match": "violencia social|violencia intrafamiliar|violencia familiar",
      "relation": "los hechos, condiciones, derechos o propuestas frente a violencia social o intrafamiliar expresamente examinados en situaciones ficticias, sin indagar experiencias privadas ni culpar a víctimas",
      "pages": [
        279
      ]
    },
    {
      "id": "historical-sequence",
      "grade": 6,
      "label": "secuencia de la historia dominicana desde 1916",
      "match": "linea de tiempo.*desde 1916|acontecimientos dominicanos desde 1916|secuencia de la historia dominicana",
      "relation": "los acontecimientos dominicanos expresamente incluidos desde 1916 hasta la fecha del material, conservando secuencia, simultaneidad y referencias sin imponer todos los hechos o gobiernos actuales",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "historian-comparison",
      "grade": 6,
      "label": "comparación de textos de historiadores",
      "match": "textos de historiadores|compara.*historiadores",
      "relation": "las afirmaciones, interpretaciones y evidencias de los historiadores expresamente proporcionados mediante dimensiones comunes y sus contextos, sin imponer todos los períodos o una interpretación",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "historical-evolution-since-1961",
      "grade": 6,
      "label": "evolución dominicana desde 1961",
      "match": "evolucion dominicana desde 1961|evolucion.*desde 1961",
      "relation": "los cambios y continuidades dominicanos desde 1961 expresamente examinados hasta la fecha de los materiales, conservando sus evidencias sociales, políticas o económicas sin inventar una actualización",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "national-accounts-comparison",
      "grade": 6,
      "label": "comparación de Producto Nacional Bruto y Producto Interior Neto",
      "match": "producto interior neto|producto nacional bruto y producto interior",
      "relation": "las definiciones y magnitudes de Producto Nacional Bruto y Producto Interior Neto expresamente examinadas con sus unidades y períodos, sin confundir Interior y Nacional o inventar datos",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "growth-development-analysis",
      "grade": 6,
      "label": "crecimiento poblacional, económico y desarrollo desde 1950",
      "match": "crecimiento poblacional y economico|crecimiento demografico y economico|variantes de desarrollo",
      "relation": "las implicaciones del crecimiento poblacional y económico y las variantes de desarrollo expresamente examinadas desde 1950 hasta la fecha del material, con respaldo en datos y sin imponer una teoría",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "migration-solutions",
      "grade": 6,
      "label": "síntesis de estudios y propuestas migratorias",
      "match": "estudios migratorios|datos.*encuestas.*migrator|soluciones.*problema migratorio|soluciones.*condiciones.*migrat",
      "relation": "la síntesis de datos de estudios migratorios proporcionados y las propuestas solicitadas, conservando procedencia y límites sin recolectar datos privados ni discriminar nacionalidades",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "nation-projects-comparison",
      "grade": 6,
      "label": "comparación de proyectos constitucionales liberales y conservadores",
      "match": "compara.*proyecto constitucional|compara.*proyectos liberales|proyectos estatales democraticos",
      "relation": "las propuestas de los proyectos constitucionales liberales o conservadores expresamente proporcionados y sus relaciones históricas mediante dimensiones comunes, sin inventar vigencia o exigir adhesión",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "civic-campaign",
      "grade": 6,
      "label": "campaña escolar de derechos, normas y símbolos",
      "match": "campana escolar.*derechos|campana.*normas constitucionales|campana.*simbolos patrios",
      "relation": "el mensaje, acciones y recursos de la campaña escolar simulada expresamente solicitada para sus destinatarios y temas dados, sin imponer todos los temas o contactos reales",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    },
    {
      "id": "dialogue-negotiation",
      "grade": 6,
      "label": "diálogo constructivo y negociación colaborativa",
      "match": "dialogo constructivo|negociacion colaborativa",
      "relation": "las razones, necesidades y alternativas del diálogo o negociación expresamente solicitados, conservando lo comunicado por las partes y registrando resultados sin imponer consenso o vivencias privadas",
      "pages": [
        280
      ],
      "sourceRecordType": "ACHIEVEMENT_INDICATOR"
    }
  ],
  "policy": "REQUESTED_SOCIAL_EVIDENCE_V1"
}]} as unknown as EvaluationCatalog
