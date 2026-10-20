import type {EvaluationCatalog} from './catalog-current'
import {evaluationCatalogV140} from './catalog-v140'
/** Exact141 payload verified against Development; Física y Computación metadata. */
export const evaluationCatalogV141={...evaluationCatalogV140,optativeScienceModules:[
  {
    "id": "biologia-computacion-optativa-4",
    "grade": 4,
    "cycle": 2,
    "subjectCode": "OPT-CT-4",
    "subjectName": "Biología y Computación",
    "optativeExitName": "Ciencias y Tecnología",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "5961a313-fc4c-5985-99bd-3e3bf539d5c1",
    "pdfPages": [
      499,
      500,
      501,
      502,
      503,
      504,
      505
    ],
    "policy": "REQUESTED_BIOLOGICAL_COMPUTATIONAL_ACTIONS_GIVEN_SOURCES_MODELS_PRIVACY_LIMITS_V1",
    "topics": [
      {
        "id": "health-system",
        "grade": 4,
        "label": "Sistema de salud y organización",
        "match": "sistema de salud y organizacion|sistema de salud|sector salud|seguridad social|salud ocupacional",
        "relation": "las funciones y relaciones de los servicios y actores del sistema de salud descrito en las fuentes, sin atribuir prestaciones o normas actuales ausentes",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "2d8d53c3-6d9c-5916-b291-fde065c7433f",
          "c3a26059-df60-5cd9-a5ec-4014f1f0b046",
          "aa3dbb50-92e5-5740-97e4-977e90464ed6",
          "ce868278-45ab-5250-84af-869025bb1d3f",
          "41e4bae5-bd74-5072-a20a-9f10fba65a89",
          "910ad9de-63bf-5d39-868a-0d5f052042d4"
        ]
      },
      {
        "id": "medicine-history",
        "grade": 4,
        "label": "Historia de la medicina",
        "match": "historia de la medicina|historia de la medicina|enfermedades en la antiguedad",
        "relation": "la secuencia y los cambios documentados de la medicina en su contexto histórico, distinguiendo las fuentes de las inferencias",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "6d952c51-ef3d-5a2b-9793-e639f5ddfe31",
          "5beafeb2-480b-551d-82d4-f3329bece4a5"
        ]
      },
      {
        "id": "epidemics",
        "grade": 4,
        "label": "Epidemias",
        "match": "epidemias|epidemias?",
        "relation": "la distribución temporal y poblacional del evento epidémico según los datos proporcionados, sin inferir causalidad de una asociación aislada",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "f2f693c5-a78e-5337-a3f6-7407679f1044"
        ]
      },
      {
        "id": "medical-specialties",
        "grade": 4,
        "label": "Especialidades médicas",
        "match": "especialidades medicas|especialidades? medicas?",
        "relation": "el campo de actuación de las especialidades indicadas y sus relaciones según la fuente proporcionada, sin derivar recomendaciones clínicas personales",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "0bb00065-be72-55f0-a68c-f95e18ce4ee0"
        ]
      },
      {
        "id": "disease-groups",
        "grade": 4,
        "label": "Enfermedades y sistemas afectados",
        "match": "enfermedades y sistemas afectados|enfermedad(?:es)?|fisiologia humana|mecanismos nervioso y endocrino",
        "relation": "las características y relaciones de los sistemas o enfermedades expresamente solicitados del caso ficticio y las fuentes dadas, sin convertir una descripción educativa en diagnóstico o tratamiento",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "ba18ee90-867b-59c5-9563-b6b5fcab3079",
          "eae8789d-a4f2-5ebc-8d19-03a09fa56187",
          "c24f8357-0f3a-5ba1-96fb-7604030c1065",
          "3b5c88a2-ba53-5fc8-ad7f-e0aa8d4a4a64",
          "aa78551a-1f6c-5042-9b39-d9bc3ae3f8d9",
          "6e48f959-b969-5b30-b756-a807a99c8c3b",
          "c8659c61-6f71-5574-8576-a1b17210317c",
          "74ac55d0-45aa-5213-b04e-a659d9863b3d"
        ]
      },
      {
        "id": "mental-health",
        "grade": 4,
        "label": "Trastornos mentales en fuentes y casos ficticios",
        "match": "trastornos mentales en fuentes y casos ficticios|trastornos? mentales?|esquizofrenia|depresion|bipolar|ansiedad|anorexia|bulimia",
        "relation": "las características descritas en las fuentes profesionales proporcionadas y los límites de un caso educativo, sin etiquetar ni diagnosticar a personas reales",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "45270feb-1f3f-57b8-a67e-b6e843e23166",
          "df265cb9-ccad-59b5-897e-3d70a61182c3",
          "8ee1d7de-63d5-5999-8dc9-d4312c9366df",
          "72598f9c-544d-54b1-9880-ef057fec601e",
          "31e0fac5-0f6b-59df-9bbf-474f3c5e4773"
        ]
      },
      {
        "id": "method-phases",
        "grade": 4,
        "label": "Acciones de indagación pedidas; sin P6 inventada",
        "match": "acciones de indagacion|fases? de indagacion|metodo cientifico",
        "relation": "la relación entre pregunta, hipótesis, variables, evidencia y conclusión en las fases proporcionadas, sin inventar una faseP6 no definida",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "fb950645-2f36-5dbf-a2dd-201f34ac1d36",
          "c0bc3a96-1109-53cb-b61f-0786b5f53474",
          "42f1c1d0-e660-54b3-89a2-4b64b82890f2",
          "bcc6bc0a-d827-56da-8fe0-a6869489022a",
          "7e091070-637f-5e22-8b96-fd26445e429f",
          "f39a2610-d03b-5aa7-a6b8-d1f61b30660f"
        ]
      },
      {
        "id": "lab-report-reading",
        "grade": 4,
        "label": "Lectura de análisis médicos ficticios y referencias dadas",
        "match": "lectura de analisis medicos ficticios y referencias dadas|hemograma|analisis medico|analisis medicos|coprologico|informe de laboratorio|composicion.*sangre",
        "relation": "los resultados, unidades y rangos del informe ficticio proporcionado, distinguiendo una comparación de referencias de un diagnóstico clínico y sin asumir rangos universales",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "c5552d9b-7899-5117-a6bf-42894cc8931d",
          "32965eab-a343-5e72-9631-26c80a89066e",
          "e81784b4-61d8-541a-9bfe-fdfb2aa3ee3d",
          "4075f2e0-9d51-5e8e-8957-abc1716e1127",
          "bc38b3b2-376e-542b-ac4a-e06754af1014"
        ]
      },
      {
        "id": "symptoms-prevention",
        "grade": 4,
        "label": "Síntomas y prevención en fichas profesionales dadas",
        "match": "sintomas y prevencion en fichas profesionales dadas|sintomas?.*prevencion",
        "relation": "la relación de las señales y medidas preventivas descritas en la ficha profesional del caso ficticio, sin establecer un diagnóstico ni prescribir medidas nuevas",
        "pages": [
          499
        ],
        "sourceRecordIds": [
          "e8d980fd-aad6-5d6a-aa92-bb9741bcfd32"
        ]
      },
      {
        "id": "molecular-cell-biology",
        "grade": 4,
        "label": "Biología molecular y celular",
        "match": "biologia molecular y celular|biologia molecular y celular",
        "relation": "la organización molecular y celular expresamente solicitada del modelo dado y sus relaciones, distinguiendo niveles de organización",
        "pages": [
          499,
          500
        ],
        "sourceRecordIds": [
          "36c5b156-1321-50a9-8192-b4cb03487998",
          "6499fb78-cfde-5204-bff2-73358d21ac20"
        ]
      },
      {
        "id": "biological-sequences",
        "grade": 4,
        "label": "Secuencias genómicas y proteómicas",
        "match": "secuencias genomicas y proteomicas|secuencias? (?:genetic[ao]s?|genomic[ao]s?|de adn|de protein)|datos genomicos|datos proteomicos|alineamiento",
        "relation": "los símbolos, posiciones y correspondencias de las secuencias o datos genómicos/proteómicos proporcionados, con sus referencias y límites; la similitud no garantiza identidad de función",
        "pages": [
          499,
          500,
          501
        ],
        "sourceRecordIds": [
          "2c92736c-f3b3-522b-a153-f4154a77c968",
          "aec3cd50-a7e5-5de6-b1f6-4d530345c04e",
          "3c756c86-6cf5-51dc-bcca-86b8bda072c3",
          "f7e0a123-9608-5e56-baa2-0fa0b8b060ed",
          "831acf52-22ea-5f0d-a350-d4028857c44d",
          "3fb06c2f-41f2-5787-b5b5-7e460c116169",
          "fa9feaa3-e2c0-589c-b36e-c47da32dba6c",
          "722a07be-fca5-54ce-9198-5c6aca19dbc1",
          "89378d54-f8f7-5336-a85c-77ea0f77a700",
          "fce05c2b-d6ea-5be8-966c-fd73a5dca16a"
        ]
      },
      {
        "id": "clinical-data-systems",
        "grade": 4,
        "label": "Sistemas y datos clínicos/epidemiológicos ficticios",
        "match": "sistemas y datos clinicos/epidemiologicos ficticios|sistemas? de informacion medica|datos clinicos|datos epidemiologicos",
        "relation": "las variables, procedencia y relaciones de los datos clínicos o epidemiológicos ficticios o agregados proporcionados, sin atribuir causalidad ni identidad personal",
        "pages": [
          499,
          500
        ],
        "sourceRecordIds": [
          "5f3808b6-090a-57fd-9d02-418c6769b3c4",
          "4e72185e-976e-5641-b6a7-1595d9edb023",
          "7e401e6a-a581-5385-bd55-7a4695d7c283"
        ]
      },
      {
        "id": "biological-data-storage",
        "grade": 4,
        "label": "Almacenamiento e integración de datos biológicos",
        "match": "almacenamiento e integracion de datos biologicos|almacenamiento.*datos biologicos|integracion.*datos biologicos|bases? de datos biologic[ao]s?",
        "relation": "la estructura, procedencia y compatibilidad de los registros biológicos dados, conservando identificadores, unidades y reglas de integración indicados",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "566bfe81-9b12-5ef5-a8ba-57b0a993dc7d",
          "2f47284d-35f6-5f31-90c1-157bd3fe6fdb"
        ]
      },
      {
        "id": "biological-models",
        "grade": 4,
        "label": "Modelado y simulación de sistemas biológicos",
        "match": "modelado y simulacion de sistemas biologicos|sistema biologico|sistemas biologicos|modelo biologico|modelos biologicos|simula.*fisiologia",
        "relation": "las entradas, parámetros, relaciones y salidas del sistema biológico del modelo dado, diferenciando simulación, predicción y evidencia empírica",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "168b67b9-7a8a-5ebd-ab26-8fa73d70b25c",
          "1d590222-a3ef-52b5-aeeb-03296af586d8",
          "6a5c5484-4e54-544b-a4d5-4bea4f090192",
          "d9667178-a460-530e-996b-bbedcbe86caf",
          "882a3e68-3a61-5ade-b732-f7b4695ec074"
        ]
      },
      {
        "id": "protein-structure",
        "grade": 4,
        "label": "Predicción de estructura y modelado molecular",
        "match": "prediccion de estructura y modelado molecular|estructuras? de proteinas?|modelado molecular|modelado por homologia|bioinformatica estructural",
        "relation": "la representación estructural y los supuestos del modelo molecular o de homología proporcionado, distinguiendo una predicción de una estructura validada",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "4bf38ee2-b0b7-51cf-8cfc-37c05168bb2b",
          "739bc79b-e022-5be8-aa42-40bf7ce3f177",
          "13e01157-116b-5edf-808e-9ca6ab7b0d29"
        ]
      },
      {
        "id": "genetic-variants",
        "grade": 4,
        "label": "Variantes genéticas y límites de inferencia",
        "match": "variantes geneticas y limites de inferencia|variantes? genetic[ao]s?|mutaciones?",
        "relation": "las diferencias entre las posiciones de las secuencias dadas y la evidencia asociada, sin inferir enfermedad o efecto funcional sin respaldo",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "33ece383-3950-53c4-b213-61a67a227218"
        ]
      },
      {
        "id": "gene-therapy",
        "grade": 4,
        "label": "Biotecnología y terapia génica como conceptos",
        "match": "biotecnologia y terapia genica como conceptos|terapia genica",
        "relation": "el mecanismo y los límites de la aplicación de terapia génica descrita en las fuentes, sin proponer intervenciones en personas",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "7c6ed9ca-5f9c-56f9-9830-9ead1fcac6e0"
        ]
      },
      {
        "id": "research-ethics",
        "grade": 4,
        "label": "Análisis concreto de ética/procedencia/privacidad",
        "match": "analisis concreto de etica/procedencia/privacidad|etica.*biologia computacional|procedencia.*privacidad|reglas de investigacion",
        "relation": "la procedencia, atribución, consentimiento o límites de uso que requiere el caso y las reglas proporcionadas, sin calificar la moralidad privada",
        "pages": [
          499,
          500,
          501
        ],
        "sourceRecordIds": [
          "70815c0c-b449-570c-97a8-cc1e609ebb5f",
          "02668f5b-af8f-54a0-bc6e-2719d68afbad",
          "6afbe4d7-9671-57a6-8e9a-79b624734753",
          "bc4683ed-83e7-5a1c-9182-2574cf72cc13",
          "6a6b961d-1aa1-5329-a89a-00bc1f762910",
          "22d830d8-cfce-55b8-b989-011fd03d1491"
        ]
      },
      {
        "id": "injury-poisoning",
        "grade": 4,
        "label": "Traumatismos, intoxicaciones y accidentes ficticios",
        "match": "traumatismos, intoxicaciones y accidentes ficticios|traumatismos?|intoxicacion|envenenamiento|accidentes? de transito|medicamentos",
        "relation": "las señales, factores y medidas descritos por la fuente profesional del escenario ficticio, sin manipular sustancias ni prescribir tratamientos",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "b62684ab-d1e6-52be-937b-f491593faae6",
          "cbf1f610-fb4d-58c6-9f50-801396237b00",
          "53af8c5e-a466-5968-b3b4-8ea4e02721b2",
          "2252db7a-7b04-5c74-88ca-00d278a0b8cd",
          "3d827cbe-492d-5ae0-9d92-d6275dfb8536"
        ]
      },
      {
        "id": "violence-prevention",
        "grade": 4,
        "label": "Prevención de violencia en casos ficticios",
        "match": "prevencion de violencia en casos ficticios|violencia|abuso|maltrato infantil|acoso escolar",
        "relation": "las acciones y relaciones del escenario ficticio y las medidas de protección descritas en la fuente dada, sin solicitar experiencias personales ni responsabilizar a víctimas",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "aa94017a-58aa-5568-b118-1e9e965649a5",
          "552f9ebc-769f-5555-b775-78480eaed2b1",
          "cc95dc71-c90e-5688-8e97-3e2d16cb8c64",
          "107b1c65-43e0-5aed-90c9-f7cfd4ab4059",
          "5ce60e28-260e-5f11-bc61-bd0d2961e3db",
          "66ba6ba3-cb0b-5c2b-928f-5ba73cd7b310"
        ]
      },
      {
        "id": "biotech-experiment-design",
        "grade": 4,
        "label": "Diseño experimental o simulación biotecnológica según consigna",
        "match": "diseno experimental o simulacion biotecnologica segun consigna|experimentos? de biotecnologia|experimento biologico|modelo educativo del experimento|plan del experimento",
        "relation": "la pregunta, variables, condiciones y evidencia previstas del diseño educativo o simulado solicitado, distinguiendo planificación de ejecución real",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "254eb057-c649-57d5-a15b-ae53603d09d8"
        ]
      },
      {
        "id": "biological-visualization",
        "grade": 4,
        "label": "Representación y análisis de datos biológicos",
        "match": "representacion y analisis de datos biologicos|representacion.*datos biologicos|visualizacion.*datos biologicos",
        "relation": "las variables, escalas, leyendas y relaciones de los datos biológicos proporcionados, sin inventar observaciones ni interpretar el gráfico como prueba causal",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "dcbfe83c-da87-5d91-8991-ec3f54eeed74",
          "596b1f34-bb2e-5ddb-83b2-dbcf8fa26eb8",
          "ef9f37a3-f805-5bfc-900f-813ccca4627c"
        ]
      },
      {
        "id": "biological-programming",
        "grade": 4,
        "label": "Programación y resolución de problemas biológicos",
        "match": "programacion y resolucion de problemas biologicos|programacion.*biologic[ao]s?|algoritmo.*biologic[ao]s?|programa.*biologic[ao]s?",
        "relation": "las entradas, pasos, decisiones y salidas del procedimiento computacional biológico indicado, con los datos y condiciones dados y sin exigir otra plataforma",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "6825f7d9-f49b-50d4-89ee-30147200269b",
          "be98aa78-c24a-5bf4-97c0-cc7f18a48793",
          "60e04df4-9348-5f86-97ce-653cd745cafd",
          "196037ff-a40d-5fa0-a448-c3c93f7a413f",
          "0a0a2247-7b97-5375-9317-2a3574910deb"
        ]
      },
      {
        "id": "blood-pressure-reading",
        "grade": 4,
        "label": "Lectura/simulación educativa de presión arterial",
        "match": "lectura/simulacion educativa de presion arterial|presion arterial",
        "relation": "los valores, unidades y condiciones del registro ficticio de presión arterial y la ficha proporcionada, sin diagnosticar ni medir a estudiantes",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "620e7b6b-37c4-547f-a144-949f69b77228"
        ]
      },
      {
        "id": "respiratory-sounds",
        "grade": 4,
        "label": "Interpretación de registro respiratorio proporcionado",
        "match": "interpretacion de registro respiratorio proporcionado|ruidos? respiratorios?|auscultacion|registro respiratorio",
        "relation": "las características del registro respiratorio educativo proporcionado y sus referencias, sin atribuir diagnóstico ni ejecutar auscultación en personas",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "415e4477-1275-5d57-866e-ebd3e7cdfebd"
        ]
      },
      {
        "id": "insulin-information",
        "grade": 4,
        "label": "Tipos y administración de insulina en ficha profesional; sin aplicación real",
        "match": "tipos y administracion de insulina en ficha profesional; sin aplicacion real|insulina",
        "relation": "los tipos y condiciones descritos en la ficha profesional de insulina proporcionada y sus límites, sin dosis inventadas ni administración real",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "debc5fef-1657-5645-b529-4f523c9f44b6"
        ]
      },
      {
        "id": "glucose-meter-model",
        "grade": 4,
        "label": "Modelo educativo o lectura ficticia de glucómetro",
        "match": "modelo educativo o lectura ficticia de glucometro|glucometro",
        "relation": "las partes y lecturas del modelo educativo o registro ficticio del glucómetro según la ficha dada, sin punción ni datos sanitarios personales",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "b43d7355-d186-53e5-86ae-98badf19220f"
        ]
      },
      {
        "id": "oral-rehydration-model",
        "grade": 4,
        "label": "Análisis del modelo o ficha proporcionada de suero oral",
        "match": "analisis del modelo o ficha proporcionada de suero oral|suero oral|sueros orales",
        "relation": "las cantidades y condiciones de la ficha profesional proporcionada de suero oral, como análisis educativo o modelo y sin inventar una fórmula clínica universal",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "139981d6-2a0b-552e-abf0-502f7dcdb183"
        ]
      },
      {
        "id": "wound-care-information",
        "grade": 4,
        "label": "Cuidado de heridas en caso educativo proporcionado",
        "match": "cuidado de heridas en caso educativo proporcionado|heridas?",
        "relation": "las acciones y precauciones de cuidado descritas en la ficha profesional del caso ficticio de herida, sin realizar procedimientos en personas",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "ba6276f5-45f1-5217-aae8-c9ba6c706675"
        ]
      },
      {
        "id": "vaccination-information",
        "grade": 4,
        "label": "Vacunación con fuente profesional dada",
        "match": "vacunacion con fuente profesional dada|vacunacion|vacunas?",
        "relation": "el mecanismo y las indicaciones educativas de la fuente de vacunación proporcionada, sin inventar un calendario o aplicar productos",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "e6d89d25-869c-5b85-bb5a-98979a189083"
        ]
      },
      {
        "id": "balanced-diet-model",
        "grade": 4,
        "label": "Dieta equilibrada ficticia bajo referencias dadas",
        "match": "dieta equilibrada ficticia bajo referencias dadas|dieta equilibrada|dieta saludable",
        "relation": "la relación de los alimentos, cantidades y condiciones del ejemplo ficticio con las referencias proporcionadas, sin dietas personales ni valoraciones de apariencia corporal",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "5cce500d-e5ae-5cbe-980d-56cc5b74af40"
        ]
      },
      {
        "id": "health-risk-prevention",
        "grade": 4,
        "label": "Riesgos y accidentes en escenarios dados",
        "match": "riesgos y accidentes en escenarios dados|riesgos?.*(?:equipos|materiales|higiene)|riesgos? de salud|prevencion de accidentes",
        "relation": "las condiciones y precauciones identificables del escenario educativo dado, distinguiendo riesgo, medida preventiva e incidente sin ejecutar acciones peligrosas",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "0370fd83-1e80-50ce-9ea8-475d384ec5d7",
          "d36f89fc-a8e9-581d-940c-a4e7a8cbde08"
        ]
      },
      {
        "id": "first-aid-simulation",
        "grade": 4,
        "label": "Primeros auxilios mediante análisis o simulación guiada",
        "match": "primeros auxilios mediante analisis o simulacion guiada|primeros auxilios|paciente con acv|paciente con iam",
        "relation": "las señales y acciones de la ficha profesional o simulación guiada proporcionada, reconociendo los límites del escenario educativo sin inventar tratamientos o procedimientos clínicos",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "6fd32c2e-ee25-51e1-a9c3-4e2f07411cbb",
          "326645eb-fb8c-5d85-bbd3-64a7e4c35f73",
          "08d21389-df9d-5978-81a8-e902f893c813",
          "ed2dc011-09a3-5974-9213-2de2dd3836ec"
        ]
      },
      {
        "id": "pregnancy-development",
        "grade": 4,
        "label": "Embarazo y desarrollo fetal en modelos/fuentes",
        "match": "embarazo y desarrollo fetal en modelos/fuentes|embarazo|desarrollo fetal",
        "relation": "las etapas y relaciones biológicas del modelo o fuente de embarazo y desarrollo fetal proporcionados, sin pedir información reproductiva personal",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "53217691-8f28-517a-8603-e38680192172",
          "8991a23b-54f8-5d02-9ea3-2f6cdc129339",
          "7c50906a-d9fb-5d32-8389-9f791ed7b668"
        ]
      },
      {
        "id": "abortion-evidence",
        "grade": 4,
        "label": "Argumentación con evidencia sobre aborto sin adhesión personal",
        "match": "argumentacion con evidencia sobre aborto sin adhesion personal|aborto",
        "relation": "las afirmaciones y evidencias de las fuentes proporcionadas sobre aborto, distinguiendo hechos, argumentos y límites sin exigir adhesión a una postura",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "f65b3d2b-e351-54cf-9b7d-f7ce749e3bc0"
        ]
      },
      {
        "id": "pregnancy-complications",
        "grade": 4,
        "label": "Complicaciones del embarazo descritas en fuentes",
        "match": "complicaciones del embarazo descritas en fuentes|hipertension en el embarazo|sepsis puerperal|malformaciones|anomalias cromosomicas",
        "relation": "las relaciones y límites descritos en las fuentes profesionales del caso ficticio, sin diagnosticar complicaciones ni proponer tratamientos",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "23802fc9-967f-5c49-9524-a81cd3f84d27",
          "3e144f17-5624-5faa-8f5e-6bab4c2439f3",
          "e4643eb4-e73d-5d60-a7fc-4a7e68a84325"
        ]
      },
      {
        "id": "donation-information",
        "grade": 4,
        "label": "Donación sin requerir participación ni datos privados",
        "match": "donacion sin requerir participacion ni datos privados|donacion|medula osea",
        "relation": "las características y condiciones de la donación descritas por las fuentes proporcionadas, sin exigir donar, revelar datos de salud o contactar servicios",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "2092103c-3755-5930-91c3-1ec12441c145",
          "56df65a8-2d04-59c3-8232-86871a53db38",
          "8b9412e0-1fec-5cd9-ba02-9bfcc995636a",
          "0cfb8205-570c-54d9-9a27-c13d96af1df3",
          "c3a65d48-f5f9-5cfe-a658-da900d303b28"
        ]
      },
      {
        "id": "biological-machine-learning",
        "grade": 4,
        "label": "Modelos de clasificación/predicción con datos proporcionados",
        "match": "modelos de clasificacion/prediccion con datos proporcionados|aprendizaje automatico|clasificacion.*dataset biologico",
        "relation": "las entradas, etiquetas de referencia, salidas y límites del algoritmo o modelo dado, diferenciando desempeño en la muestra de generalización a otros datos",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "a0ef8c36-59f7-5ddd-a9fb-559e102dc4fe",
          "41377fff-edb3-5e4b-83ff-abed457a0074"
        ]
      },
      {
        "id": "phylogenetic-tree",
        "grade": 4,
        "label": "Árbol filogenético y evidencia de secuencias",
        "match": "arbol filogenetico y evidencia de secuencias|arbol filogenetico|filogenia",
        "relation": "las relaciones de parentesco y ramificaciones inferidas de las secuencias y el método proporcionados, sin confundir proximidad gráfica con tiempo o certeza no indicados",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "63d886e5-60bd-503a-b858-698d3c31440d"
        ]
      },
      {
        "id": "protein-function-inference",
        "grade": 4,
        "label": "Predicción de función como inferencia limitada",
        "match": "prediccion de funcion como inferencia limitada|prediccion.*funcion|funcion de una proteina|funciones de secuencias",
        "relation": "la evidencia y los supuestos de la predicción funcional proporcionada o solicitada, distinguiendo similitud de secuencia, inferencia y validación de función",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "bf00d526-1800-52b5-9856-46f361072769"
        ]
      },
      {
        "id": "biological-networks",
        "grade": 4,
        "label": "Redes biológicas y dinámica",
        "match": "redes biologicas y dinamica|redes biologicas|biologia de sistemas",
        "relation": "los nodos, enlaces, direcciones y relaciones dinámicas del modelo de red proporcionado, sin convertir una conexión en causalidad no demostrada",
        "pages": [
          500,
          501
        ],
        "sourceRecordIds": [
          "9432b461-7744-5092-948e-56c64622f38b",
          "ed5cb4fe-d289-558e-a5ed-2246b8f36c10"
        ]
      },
      {
        "id": "scientific-communication",
        "grade": 4,
        "label": "Comunicación de resultados dados o propios según consigna",
        "match": "comunicacion de resultados dados o propios segun consigna|comunicacion de resultados|plan profesional|entrevista.*profesional|informe de.*fisiologia|proyecto de salud|investigacion de salud|propuesta de salud|proyecto educativo de salud",
        "relation": "la relación entre propósito, evidencia y conclusiones del trabajo o caso profesional proporcionado, atribuyendo su procedencia y delimitando lo que no demuestra",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "10abdc91-13d9-5218-a339-ad056d78a5ed"
        ]
      },
      {
        "id": "requested-ict",
        "grade": 4,
        "label": "TIC solo cuando la consigna lo requiere",
        "match": "tic solo cuando la consigna lo requiere|uso de tic|incorpora.*tic",
        "relation": "la función de la herramienta expresamente solicitada en el producto y la trazabilidad de sus datos o salidas, sin exigir dispositivos o programas adicionales",
        "pages": [
          500
        ],
        "sourceRecordIds": [
          "9d8c5f75-a85e-572f-b47f-4a5874b57952"
        ]
      },
      {
        "id": "drug-design-model",
        "grade": 4,
        "label": "Diseño de fármaco como modelo educativo",
        "match": "diseno de farmaco como modelo educativo|diseno de farmaco",
        "relation": "las relaciones y supuestos del modelo educativo de diseño de fármaco proporcionado, sin inferir eficacia clínica ni sintetizar, recetar o probar sustancias",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "aa70a4b2-50bf-5f2f-b4eb-1ab0040e5dca",
          "8a6a5c8a-2f21-5577-87a0-aa38b2154270"
        ]
      },
      {
        "id": "enzyme-ligand",
        "grade": 4,
        "label": "Interacción enzima/ligando",
        "match": "interaccion enzima/ligando|enzimas? y ligando|interaccion.*enzima",
        "relation": "las interacciones del modelo enzima-ligando proporcionado y las condiciones dadas, sin equiparar una afinidad simulada con eficacia en un organismo",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "00c8664b-5384-59b7-9b88-5842afe6941b",
          "039cee62-429f-5f7f-8c4b-951912fc946c"
        ]
      },
      {
        "id": "enzyme-inhibition",
        "grade": 4,
        "label": "Inhibición enzimática en modelos",
        "match": "inhibicion enzimatica en modelos|inhibicion enzimatica",
        "relation": "las variables y relaciones del modelo de inhibición enzimática dado y sus condiciones, limitando la explicación causal a la evidencia disponible",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "3d7326a7-20b6-5aa1-a866-20970e62b1ca",
          "bc415ecd-781a-5062-9301-b996c6f34d69"
        ]
      },
      {
        "id": "metabolic-pathways",
        "grade": 4,
        "label": "Rutas metabólicas y metabolismo de fármacos",
        "match": "rutas metabolicas y metabolismo de farmacos|rutas? metabolicas?|metabolismo de farmacos",
        "relation": "la secuencia de transformaciones y relaciones del esquema metabólico proporcionado, sin inferir dosis o efectos clínicos a partir de una ruta aislada",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "fdbeb13c-3c48-59bd-8fdb-cc9602c72b08",
          "5e9b024c-fb10-59c6-98f3-14553d5408ab",
          "730d523a-c1df-5d14-a17d-4b62bac5445b"
        ]
      },
      {
        "id": "molecular-docking",
        "grade": 4,
        "label": "Acoplamiento molecular e inferencias limitadas",
        "match": "acoplamiento molecular e inferencias limitadas|acoplamiento molecular",
        "relation": "las conformaciones, puntuaciones y supuestos del acoplamiento molecular proporcionado, distinguiendo una predicción de unión de validación experimental o clínica",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "0c3b75a8-2857-5b6c-b43c-e0eaf142359f",
          "8c42001f-42ef-55db-9946-e758c874ac74"
        ]
      },
      {
        "id": "green-technology",
        "grade": 4,
        "label": "Sostenibilidad y tecnología verde",
        "match": "sostenibilidad y tecnologia verde|sostenibilidad y tecnologia verde|plan de sostenibilidad|planes de sostenibilidad",
        "relation": "la relación de las decisiones propuestas con recursos, restricciones y criterios de sostenibilidad dados, sin atribuir beneficios no respaldados",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "2634a1bb-c5fc-58bc-bd40-fcba8133de30",
          "81bb443c-0f47-5309-b6e8-0a745622064c",
          "d3ad5d38-ab30-5b9a-8f6a-f75ad1c3f2a1",
          "f087baa2-3410-5f04-b979-3fb402de8c56"
        ]
      },
      {
        "id": "environmental-privacy",
        "grade": 4,
        "label": "Ética y privacidad ambiental",
        "match": "etica y privacidad ambiental|privacidad.*ambiental|etica.*ambiental",
        "relation": "las variables potencialmente identificables y las reglas de acceso, ubicación o atribución del caso ambiental ficticio, sin divulgar datos de personas o lugares privados",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "afd85adf-4336-5cd1-929e-67c66c1b9a31",
          "aec5bd33-fd66-5581-a6ae-d1256b6fd37b"
        ]
      },
      {
        "id": "emerging-environmental-technology",
        "grade": 4,
        "label": "Tecnologías emergentes ambientales",
        "match": "tecnologias emergentes ambientales|tecnologias? emergentes?.*ambiental|prototipo.*tecnologia ambiental|tecnologia del caso ambiental",
        "relation": "las entradas, salidas y condiciones de la tecnología ambiental del modelo dado y sus límites, sin exigir despliegue o compra de dispositivos",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "2cd1bd72-b523-5a3e-bd1f-aece0449ee19"
        ]
      },
      {
        "id": "pollution-sources",
        "grade": 4,
        "label": "Origen y fuentes de contaminación; naturaleza/origen separados",
        "match": "origen y fuentes de contaminacion; naturaleza/origen separados|origen.*contaminacion|fuentes? de contaminacion|contaminantes",
        "relation": "el origen o naturaleza de los contaminantes expresamente solicitados y su relación con las fuentes del caso, sin confundir ambas clasificaciones",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "22af5d2d-4222-503c-b112-7e290cfbe98b",
          "75b17498-adeb-51b9-9396-0d91a4ade35b",
          "462fc598-f26d-5467-b904-bd5dd1d9afa7",
          "09c9ee7c-ed34-565a-860d-3fbb75a3f755",
          "65079dac-dfdf-5662-b866-446666f1b604",
          "a48f6f58-6edc-5a2b-932e-e6a7ed26db72",
          "cdc3f37f-2002-584b-b7aa-df3562664a85",
          "c6b9e9cb-540f-5ead-a621-e7bd63b493ce"
        ]
      },
      {
        "id": "environmental-sensors",
        "grade": 4,
        "label": "Sensores y adquisición de datos proporcionados",
        "match": "sensores y adquisicion de datos proporcionados|sensores? ambientales?|sensor ambiental",
        "relation": "la variable, unidad, referencia y condiciones del sensor o registro ambiental proporcionado, distinguiendo una lectura de una inferencia sobre todo el ambiente",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "76f9955f-9b05-53b9-bc4d-34874a864416",
          "bf444c48-3001-5ca7-9eea-33b96c5ea271"
        ]
      },
      {
        "id": "environmental-monitoring",
        "grade": 4,
        "label": "Monitoreo y gestión ambiental",
        "match": "monitoreo y gestion ambiental|monitoreo ambiental|gestion de recursos",
        "relation": "la relación entre las variables registradas y las decisiones de seguimiento indicadas en el caso, con sus referencias y límites temporales",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "11a60343-0ee2-54d1-b3de-7905fa684a86"
        ]
      },
      {
        "id": "gis-maps",
        "grade": 4,
        "label": "SIG y mapas temáticos",
        "match": "sig y mapas tematicos|sig|sistema de informacion geografica|mapa tematico",
        "relation": "las capas, leyendas, escala y referencias espaciales del SIG dado y el criterio indicado de áreas críticas, sin inferir exactitud o coordenadas privadas ausentes",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "040cffe3-ffb8-52cd-8bad-6f67cd702033",
          "d1524d48-06b9-5538-b897-87f70382493b"
        ]
      },
      {
        "id": "environmental-impact-model",
        "grade": 4,
        "label": "Evaluación de impacto con software/datos dados",
        "match": "evaluacion de impacto con software/datos dados|impacto ambiental",
        "relation": "las variables, supuestos y resultados del modelo de impacto ambiental proporcionado, distinguiendo evaluación educativa de autorización o dictamen real",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "4e75e40d-a2fe-58fd-b2f4-0179445251f5"
        ]
      },
      {
        "id": "environmental-simulation",
        "grade": 4,
        "label": "Simulación ambiental",
        "match": "simulacion ambiental|sistema ambiental|simulacion ambiental",
        "relation": "las entradas, parámetros, condiciones y salidas del modelo ambiental dado, sin convertir sus resultados en una predicción garantizada del entorno real",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "bb99d0c5-f072-5ad7-a433-52aedfe63e1c"
        ]
      },
      {
        "id": "environmental-data",
        "grade": 4,
        "label": "Análisis y gestión de datos ambientales",
        "match": "analisis y gestion de datos ambientales|dataset ambiental|conjunto de datos ambiental|datos ambientales",
        "relation": "la procedencia, unidades, escalas y patrones respaldados por los datos ambientales dados, sin inventar registros ni atribuir causalidad a una tendencia aislada",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "c0955a89-2bae-50b0-8105-9d170125ac56",
          "e66a3afb-5d2e-5322-b0fc-9e004ecb9722"
        ]
      },
      {
        "id": "environmental-project",
        "grade": 4,
        "label": "Proyecto ambiental educativo según consigna",
        "match": "proyecto ambiental educativo segun consigna|proyecto ambiental computacional|medioambiente computacional|proyectos? de medioambiente",
        "relation": "la correspondencia entre propósito, datos, procedimiento y producto del proyecto ambiental educativo solicitado, distinguiendo acciones simuladas, dadas o realizadas",
        "pages": [
          501
        ],
        "sourceRecordIds": [
          "f15fb90f-849a-54e7-bb4a-612ba77d958c"
        ]
      },
      {
        "id": "soil-pollution",
        "grade": 4,
        "label": "Contaminación del suelo",
        "match": "contaminacion del suelo|contaminacion del suelo|contaminacion de suelo",
        "relation": "las fuentes, procesos y evidencias de contaminación del suelo del caso proporcionado, sin exigir contacto con muestras contaminadas",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "d1e8ff55-bb43-59f1-bcb4-dc9da588828a"
        ]
      },
      {
        "id": "water-pollution",
        "grade": 4,
        "label": "Contaminación del agua",
        "match": "contaminacion del agua|contaminacion del agua|contaminacion de agua",
        "relation": "las fuentes, variables y evidencias de contaminación del agua proporcionadas, sin equiparar apariencia con potabilidad ni solicitar exposición a muestras",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "626f6970-5367-5a8b-93f6-a394388975fa"
        ]
      },
      {
        "id": "air-pollution",
        "grade": 4,
        "label": "Contaminación del aire",
        "match": "contaminacion del aire|contaminacion del aire|contaminacion de aire",
        "relation": "las fuentes, variables y evidencias de contaminación del aire del caso dado y sus límites espaciales y temporales",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "e164d32d-02fb-5674-8365-9ed9711bf759"
        ]
      },
      {
        "id": "waste-management",
        "grade": 4,
        "label": "Residuos y manejo en modelos, sin manipulación peligrosa",
        "match": "residuos y manejo en modelos, sin manipulacion peligrosa|residuos",
        "relation": "la clasificación y las medidas de manejo del residuo expresamente indicado según la ficha dada, sin manipular residuos médicos, radiactivos o peligrosos",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "fddc704e-9db2-5c62-86ff-9d3d14efefb8",
          "065a47d7-c6f6-5112-bb30-1c0156f945e1",
          "4c389801-36c3-557a-8434-7db1c58455e0",
          "fda54726-7207-5c4d-81a3-2b22b1db89e5",
          "6b86c64b-2c7f-563d-baaa-85743a123db7",
          "7e13832c-1787-520e-90af-59d47ad8cfac",
          "0142980e-49b5-5f8f-8427-00456d870b46"
        ]
      },
      {
        "id": "environmental-conservation",
        "grade": 4,
        "label": "Conservación ambiental y biodiversidad",
        "match": "conservacion ambiental y biodiversidad|conservacion ambiental|biodiversidad|manejo forestal|recursos biologicos",
        "relation": "las relaciones entre especies, hábitats, amenazas y medidas de conservación de las fuentes proporcionadas, sin inventar intervenciones o valoraciones económicas actuales",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "2606b1cb-1697-5c3c-bee1-5a8db51f0e83",
          "4e3701cf-644e-5333-ba39-e7a1a60c5efc",
          "e622302c-951f-5f4f-91d4-975f482f1cdd",
          "98710c20-fbce-5eef-8fd2-1f2f42ccc38b"
        ]
      },
      {
        "id": "agricultural-systems",
        "grade": 4,
        "label": "Sistemas de cultivo y producción agrícola",
        "match": "sistemas de cultivo y produccion agricola|sistemas? de cultivo|produccion agricola|agricultura regional|producto agricola",
        "relation": "las variables y relaciones del sistema o producto agrícola educativo solicitado con los datos y restricciones dados, sin exigir cultivar o vender realmente",
        "pages": [
          502,
          503
        ],
        "sourceRecordIds": [
          "1f418c81-41df-5678-a3c3-2028a064da37",
          "8ba4b3bd-687b-5c51-9846-07c9f995af21",
          "a98af27d-19c2-592b-8553-c65b317edd96",
          "5388c9d0-cec4-5e15-a655-a647fabb07b1"
        ]
      },
      {
        "id": "marine-resources",
        "grade": 4,
        "label": "Recursos marinos",
        "match": "recursos marinos|recursos marinos",
        "relation": "las relaciones del recurso marino y las medidas de manejo descritas en las fuentes proporcionadas, sin inventar normas o capturas actuales",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "a31b19e4-76ac-52c9-b4ef-33a1a62775da"
        ]
      },
      {
        "id": "food-biotechnology",
        "grade": 4,
        "label": "Biotecnología alimentaria",
        "match": "biotecnologia alimentaria|biotecnologia alimentaria|biotecnologia.*alimentacion|fermentacion.*industrial",
        "relation": "los organismos, transformaciones y controles descritos en el proceso alimentario del modelo dado, sin exigir cultivos ni preparación de productos para consumo",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "1b422eee-dae6-5740-8899-7748e3fb7b04",
          "23a1eb91-d979-5de3-b2fe-0ec52f376d9e"
        ]
      },
      {
        "id": "natural-resources",
        "grade": 4,
        "label": "Recursos naturales",
        "match": "recursos naturales|recursos naturales",
        "relation": "las características y relaciones de uso de los recursos naturales expresamente solicitados en el caso, con los límites de la información proporcionada",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "3ebf69d0-aa89-5035-80e7-36c8c16c34f4"
        ]
      },
      {
        "id": "water-resources",
        "grade": 4,
        "label": "Recursos hídricos, ciclo, calidad y cuencas",
        "match": "recursos hidricos, ciclo, calidad y cuencas|recursos hidricos|ciclo del agua|calidad del agua|manejo de cuencas",
        "relation": "las transferencias y relaciones del recurso hídrico, ciclo o cuenca expresamente solicitados en el modelo dado, distinguiendo indicadores de calidad de potabilidad demostrada",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "ec716785-d617-5c9b-aaa7-a8ce28e8ee87",
          "abf9578d-712e-525d-9f6c-1f569b6a5f2f",
          "7cad7699-9ff0-5c21-9949-5f4df4e1c568",
          "882c56af-5f29-565a-b3db-eae94eb0a1c9",
          "f096bf66-7af9-5921-9048-75628c3b3294"
        ]
      },
      {
        "id": "mineral-resources",
        "grade": 4,
        "label": "Exploración y explotación minera distintas",
        "match": "exploracion y explotacion minera distintas|recursos geologicos|exploracion minera|explotacion minera|recursos mineros",
        "relation": "la diferencia entre localizar o estudiar yacimientos y extraer recursos, y las relaciones económicas o ambientales pedidas en las fuentes dadas",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "b90128c7-43cc-5690-be41-10bf3dd030bb",
          "e590935f-0ef9-5bb6-8aca-8172116e56d0",
          "8b23ef9b-65d7-5892-86ad-44cd724f0fb7",
          "cfd141fa-71c5-5eb6-be61-27f119ed29e9"
        ]
      },
      {
        "id": "atmosphere-climate",
        "grade": 4,
        "label": "Atmósfera, efecto invernadero y clima con facetas pedidas",
        "match": "atmosfera, efecto invernadero y clima con facetas pedidas|atmosfera|efecto invernadero|calentamiento global|cambio climatico|capa de ozono",
        "relation": "las variables y procesos atmosféricos expresamente solicitados y sus escalas temporales, distinguiendo efecto invernadero, cambio climático y ozono sin mezclarlos",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "6f8b9d01-6aa0-593f-ad67-7f6d3fc8c30b",
          "7013bc1f-8c2e-5573-8d54-ef123642e40c",
          "e4617663-71be-54d7-9231-93fc486fe4ab",
          "a25047cd-7a2f-50ae-bb4d-ba6edfb526e3",
          "979d3003-283e-5657-8eed-fba963cfacf1",
          "69e61649-dc72-5224-a7dd-4ce67d8aa866"
        ]
      },
      {
        "id": "energy-sustainability",
        "grade": 4,
        "label": "Fuentes de energía y eficiencia",
        "match": "fuentes de energia y eficiencia|energia no renovable|eficiencia energetica|fuentes de energia|consumo de energia",
        "relation": "las fuentes, transferencias y relaciones de consumo o eficiencia expresamente solicitadas con datos dados, sin inventar cifras actuales ni equiparar eficiencia con ausencia de impacto",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "bc7c5430-ab48-5096-8a04-00623b01d6f3",
          "89fde1fc-d3a2-5b26-98aa-a71f9f4d3bca",
          "d2e003a3-7875-5fdf-bcfe-5cab5b0a1185",
          "d99968ac-be12-547f-8159-8ea5d66cff77"
        ]
      },
      {
        "id": "natural-risk-models",
        "grade": 4,
        "label": "Riesgos naturales y respuesta en escenarios proporcionados",
        "match": "riesgos naturales y respuesta en escenarios proporcionados|huracanes?|deslizamientos?|inundaciones?|terremotos?|tsunamis?|riesgos? naturales?|sistema de emergencia",
        "relation": "la relación entre amenaza, exposición, vulnerabilidad y acciones indicadas del escenario proporcionado, sin atribuir predicción cierta ni ejecutar emergencias reales",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "33154dfb-ffe8-5256-82c0-3e2845024407",
          "bf0d7b8a-7eea-5a30-980f-f792ef75d508",
          "68b8db31-c159-5894-8215-7ed3d947b40b",
          "1299b324-a54a-5c81-80a6-7618ffca576b",
          "c4235289-8378-51c4-90bc-8e25b2f915f3",
          "ced38c67-b281-5eff-9bbc-655ac5c8f424",
          "1ad6cfa9-7a27-54bc-808a-202e4c4f8e0a",
          "f6f927f4-dc6f-53bb-ab5c-2911b47e59d3",
          "c902db71-2be3-5595-802a-7d9592e08187"
        ]
      },
      {
        "id": "environmental-legislation",
        "grade": 4,
        "label": "Análisis de texto legal ambiental proporcionado",
        "match": "analisis de texto legal ambiental proporcionado|legislacion ambiental|ley 64",
        "relation": "el objeto, disposiciones y límites del extracto legal ambiental proporcionado y su procedencia, sin atribuir vigencia consolidada o permisos actuales no verificados",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "9bc5a837-4146-5092-ad1b-55325780438d",
          "7d404587-906f-56b5-822e-e2b51227595c"
        ]
      },
      {
        "id": "climate-reports",
        "grade": 4,
        "label": "IPCC y comunicaciones nacionales dadas",
        "match": "ipcc y comunicaciones nacionales dadas|ipcc|comunicaciones nacionales|informes? climaticos?",
        "relation": "las afirmaciones, evidencia, escala y límites del informe climático proporcionado, distinguiendo resultados documentados de inferencias propias",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "1b5443fb-97e7-54ba-89c3-4060cc4a75cf",
          "8b626e2d-b116-5d24-a4a0-65955e202d66"
        ]
      },
      {
        "id": "biotechnology-history",
        "grade": 4,
        "label": "Biotecnología e historia",
        "match": "biotecnologia e historia|biotecnologia e historia|historia de la biotecnologia|desarrollo historico.*biotecnologia",
        "relation": "la secuencia y las relaciones de los procesos o aplicaciones biotecnológicas documentados en su contexto, sin atribuir causalidad histórica por mera sucesión",
        "pages": [
          502,
          503
        ],
        "sourceRecordIds": [
          "8be16661-21ba-567a-a4f3-718c29fa9d87",
          "2d2b3b0a-4318-59b2-b5dc-df73c37b43dd"
        ]
      },
      {
        "id": "pesticide-comparison",
        "grade": 4,
        "label": "Plaguicidas y alternativas en fuentes; sin aplicación real",
        "match": "plaguicidas y alternativas en fuentes; sin aplicacion real|plaguicidas?|pesticidas?",
        "relation": "los beneficios, riesgos y alternativas descritos en las fuentes para el caso dado, sin aplicar sustancias ni generalizar eficacia o inocuidad",
        "pages": [
          502
        ],
        "sourceRecordIds": [
          "b3467e56-e59e-5727-9d01-2e40a6a0c6b9"
        ]
      },
      {
        "id": "biotech-processes",
        "grade": 4,
        "label": "Procesos biotecnológicos y sus implicaciones",
        "match": "procesos biotecnologicos y sus implicaciones|procesos biotecnologicos|simulacion.*biotecnologic[ao]s?|modelo.*biotecnologic[ao]s?",
        "relation": "las entradas, transformaciones, salidas y supuestos del proceso biotecnológico educativo proporcionado o solicitado, sin atribuir producción real",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "3c9ebd7b-c2c5-58f9-8de5-67f6b852cd77",
          "7920ca3f-7689-5b2e-9d4c-fbfe7b2b75ed",
          "bae8be2e-ea13-59cf-a489-6843dd4f1282",
          "796425a6-9bf1-5f74-85be-61581dae5077",
          "bd1a3ffb-76c0-50d0-8720-ad944c5fe6fb",
          "2a97cefb-7c34-5d47-94c1-e0963525b94d",
          "5524a983-4bef-5bee-b26d-5982d703e8d5"
        ]
      },
      {
        "id": "cell-models",
        "grade": 4,
        "label": "Células animales/vegetales y modelos solicitados",
        "match": "celulas animales/vegetales y modelos solicitados|celulas? animales?|celulas? vegetales?|organo indicado|maqueta del organo",
        "relation": "las partes, funciones y relaciones del tipo celular u órgano expresamente solicitado en el modelo educativo, sin exigir estructuras o representaciones de otro tipo",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "5c19e224-242c-5e8e-9da3-53db6188bdb9"
        ]
      },
      {
        "id": "microorganism-models",
        "grade": 4,
        "label": "Microorganismos y aplicaciones en modelos seguros",
        "match": "microorganismos y aplicaciones en modelos seguros|microorganismos",
        "relation": "las características y transformaciones de los microorganismos del modelo o fuente dados y su aplicación descrita, sin aislamiento, modificación o cultivo peligroso",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "67ead2d2-fb3c-51a6-b44a-668261d8a354",
          "19131511-0090-5181-8a15-cea1e9e806f2"
        ]
      },
      {
        "id": "bioreactions",
        "grade": 4,
        "label": "Biorreacciones y actividad enzimática",
        "match": "biorreacciones y actividad enzimatica|biorreacciones?|biorreaciones|transformaciones? enzimaticas?|actividad enzimatica",
        "relation": "las transformaciones y condiciones de la biorreacción o actividad enzimática proporcionada, conservando las relaciones de materia y energía del modelo",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "6eadfd60-6dfd-58cc-a599-ecf0c586486c",
          "116b1275-c48b-581f-a98c-a7450079462a",
          "bad269ea-7201-5fcb-b686-4b47adc5cd16",
          "4d9008f0-df73-5a4c-af7d-7f3b2bffa802"
        ]
      },
      {
        "id": "microbial-growth-model",
        "grade": 4,
        "label": "Crecimiento microbiano/producto con datos proporcionados",
        "match": "crecimiento microbiano/producto con datos proporcionados|crecimiento microbiano|crecimiento y formacion de producto",
        "relation": "las variables, fases y condiciones del crecimiento y formación de producto según los datos o el modelo dados, sin exigir cultivo real",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "3b7d9c5c-bc2e-591e-9b5c-c2c2c96692aa",
          "08de4e42-4448-50a5-b48e-b14424321ed9"
        ]
      },
      {
        "id": "immobilized-biocatalysts",
        "grade": 4,
        "label": "Biocatalizadores y su inmovilización",
        "match": "biocatalizadores y su inmovilizacion|biocatalizadores|inmovilizacion",
        "relation": "las relaciones del biocatalizador y el método de inmovilización descritos en la fuente dada, sin imponer materiales o ensayos ausentes",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "149ef47b-51c9-54a9-a423-32b913c10a88"
        ]
      },
      {
        "id": "process-efficiency",
        "grade": 4,
        "label": "Eficiencia del proceso",
        "match": "eficiencia del proceso|eficiencia del proceso",
        "relation": "la relación de las entradas y salidas con la medida de eficiencia definida por los datos dados, sin inventar fórmula, rendimiento o balance ausentes",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "51834f12-ea0a-59a4-babe-c8c0c682b373"
        ]
      },
      {
        "id": "bioreactor-models",
        "grade": 4,
        "label": "Biorreactores sólidos/líquidos/fotobiorreactores según consigna",
        "match": "biorreactores solidos/liquidos/fotobiorreactores segun consigna|biorreactor|biorreactores|fotobiorreactor",
        "relation": "las fases, entradas, variables y controles del tipo de biorreactor expresamente solicitado, sin exigir construcción ni operación real",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "f7a95d26-c6be-5197-bbf8-c7258237b648",
          "12a1f2ef-49a7-5768-9b04-ab7a194beed2",
          "1741da91-58e6-5ef5-b720-7d5576a9074c"
        ]
      },
      {
        "id": "biotech-process-control",
        "grade": 4,
        "label": "Variables, monitoreo y control de procesos",
        "match": "variables, monitoreo y control de procesos|control de procesos|monitoreo de muestras|variables.*proceso",
        "relation": "la variable controlada, su referencia y las acciones de seguimiento del modelo proporcionado, distinguiendo medición, control y objetivo",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "98b0dfad-4e53-5643-8849-c2697d218656",
          "007dccf3-4994-5bd6-b174-1b34e1931b23",
          "3da723a6-ad5e-5147-b431-7d3f3f065abd",
          "357e7cac-3244-5f3b-81fa-43955aae5ce6",
          "cf361f1c-73e0-5956-9205-6c9fc4772122"
        ]
      },
      {
        "id": "biotech-separation",
        "grade": 4,
        "label": "Separación, concentración y purificación en modelos",
        "match": "separacion, concentracion y purificacion en modelos|separacion|concentracion y purificacion",
        "relation": "las propiedades y operaciones de separación expresamente solicitadas del modelo dado, distinguiendo concentración, pureza y recuperación sin añadir otras etapas",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "648db5e3-2361-551e-b692-b5b6275d1734",
          "926b88d9-ee57-5eaa-b868-89a3df7521b2",
          "1315514d-a469-5e90-807d-0a887e58adae"
        ]
      },
      {
        "id": "biotech-product-design",
        "grade": 4,
        "label": "Diseño/mejora de producto y proceso simulado",
        "match": "diseno/mejora de producto y proceso simulado|diseno.*producto|mejora.*producto",
        "relation": "la correspondencia entre necesidad, características, proceso y restricciones del producto biotecnológico ficticio, sin atribuir fabricación o eficacia real",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "0d83f97d-b68c-572f-ad43-fa95526b059c",
          "9691cf44-6b9d-537f-bdec-7dc84de1f6be",
          "28a13ac4-7d5c-5dd3-9ff5-db6cadfc14d8",
          "9aab8c41-3d57-5f41-a5cb-ddfc126770c9"
        ]
      },
      {
        "id": "biotech-market-model",
        "grade": 4,
        "label": "Distribución/comercialización y empresa simuladas",
        "match": "distribucion/comercializacion y empresa simuladas|empresa biotecnologica|empresa.*biotecnologica|comercializacion|distribucion.*biotecnologic[ao]s?",
        "relation": "la relación entre producto, recursos, proceso y decisiones del modelo de empresa o comercialización ficticios con datos dados, sin registrar empresas ni efectuar ventas",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "17ab6303-ef42-51bc-bf6e-6f3fb87f3690",
          "2a641b19-a610-59fa-97d6-781c9f625f8d",
          "61b7654b-1b1f-5990-b8f3-aa187c1c7585"
        ]
      },
      {
        "id": "bioremediation-model",
        "grade": 4,
        "label": "Tratamiento de aguas, biorremediación y OGM como modelos",
        "match": "tratamiento de aguas, biorremediacion y ogm como modelos|biorremediacion|aguas residuales|aguas contaminadas",
        "relation": "el mecanismo, variables y límites del modelo de tratamiento o biorremediación proporcionado, sin manipular aguas contaminadas ni liberar organismos",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "18fa06c7-ca52-5b00-a61b-37bd02e74ab6"
        ]
      },
      {
        "id": "animal-biotechnology",
        "grade": 4,
        "label": "Biotecnología animal y producto simulado",
        "match": "biotecnologia animal y producto simulado|biotecnologia animal|ganaderia|producto de ganaderia",
        "relation": "el mecanismo y las implicaciones de la aplicación biotecnológica animal descrita en las fuentes o modelo dados, sin experimentación animal ni producción real",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "f91e1439-cfbe-5782-a04f-430d572b2554"
        ]
      },
      {
        "id": "biotech-implications",
        "grade": 4,
        "label": "Implicaciones éticas, legales, económicas y sostenibilidad dadas",
        "match": "implicaciones eticas, legales, economicas y sostenibilidad dadas|implicaciones.*biotecnologic[ao]s?|aspectos eticos.*biotecnologic[ao]s?|afirmaciones de biotecnologia|implicaciones[^.;]*biotecnologic[ao]s?",
        "relation": "las afirmaciones científicas y las implicaciones éticas, económicas, legales o ambientales expresamente solicitadas con fuentes dadas, sin adhesión personal ni supuestos legales actuales",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "b4534ad4-d1af-5a10-b76b-44ec3977fb27",
          "e63212ab-7d6f-5aa8-8d94-47e6333cb34b",
          "da484a18-eddd-5ced-913c-207be54f2354"
        ]
      },
      {
        "id": "transgenic-organisms",
        "grade": 4,
        "label": "Animales y vegetales transgénicos con evidencia",
        "match": "animales y vegetales transgenicos con evidencia|transgenicos|organismos geneticamente modificados",
        "relation": "el cambio genético y sus evidencias o implicaciones expresamente solicitadas en las fuentes dadas, sin afirmar seguridad o daño universales ni exigir adhesión a una postura",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "249c30cf-3439-5971-b1ac-1e8e86708a80",
          "3405bd53-bda6-582a-b312-4dc8f12f0fcb"
        ]
      },
      {
        "id": "medical-biotechnology",
        "grade": 4,
        "label": "Aplicaciones médicas de la biotecnología",
        "match": "aplicaciones medicas de la biotecnologia|biotecnologia medica|aplicaciones biotecnologicas medicas|biotecnologia y medicina",
        "relation": "el mecanismo y las evidencias de la aplicación médica biotecnológica descrita en las fuentes proporcionadas, distinguiendo resultados de modelos, producción y eficacia clínica demostrada sin exigir aplicaciones alimentarias ni tratamientos reales",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "23a1eb91-d979-5de3-b2fe-0ec52f376d9e"
        ]
      },
      {
        "id": "plant-biotechnology",
        "grade": 4,
        "label": "Biotecnología vegetal",
        "match": "biotecnologia vegetal",
        "relation": "el proceso y las evidencias de la aplicación biotecnológica vegetal del modelo o investigación simulada proporcionados, distinguiendo resultados, supuestos e implicaciones sin exigir cultivos, liberación de organismos ni otra investigación",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "18fa06c7-ca52-5b00-a61b-37bd02e74ab6"
        ]
      },
      {
        "id": "biological-reasoning",
        "grade": 4,
        "label": "Relaciones biológicas en problemas proporcionados",
        "match": "relaciones biologicas en problemas proporcionados|neurobiologia|genetica[^.;]*seleccion natural|seleccion natural[^.;]*ecosistema",
        "relation": "las relaciones de genética, ecosistema o selección natural expresamente solicitadas en el problema biológico y el modelo proporcionados, justificando la solución con sus datos y condiciones sin imponer procedimientos ajenos a la consigna",
        "pages": [
          504
        ],
        "sourceRecordIds": [
          "1c607c65-facf-5ec3-9b09-abdd05025eef"
        ]
      },
      {
        "id": "environmental-biotechnology",
        "grade": 4,
        "label": "Biotecnología ambiental",
        "match": "biotecnologia ambiental|biotecnologia y medioambiente",
        "relation": "el proceso, evidencias e implicaciones de la aplicación biotecnológica ambiental del caso o modelo proporcionados, distinguiendo los resultados dados de las acciones realizadas sin exigir liberar organismos ni ejecutar otra intervención",
        "pages": [
          503
        ],
        "sourceRecordIds": [
          "18fa06c7-ca52-5b00-a61b-37bd02e74ab6"
        ]
      }
    ]
  },
  {
    "id": "quimica-computacion-optativa-5",
    "grade": 5,
    "cycle": 2,
    "subjectCode": "OPT-CT-5",
    "subjectName": "Química y Computación",
    "optativeExitName": "Ciencias y Tecnología",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "f39c0cd4-85d9-5aeb-a1d2-74763bf455a9",
    "pdfPages": [
      506,
      507,
      508,
      509,
      510
    ],
    "policy": "REQUESTED_CHEMICAL_COMPUTATIONAL_ACTIONS_GIVEN_DATA_MODELS_SAFETY_V1",
    "topics": [
      {
        "id": "food-ethics",
        "grade": 5,
        "label": "Decisiones éticas de etiquetado alimentario",
        "match": "etiquetado de alimentos|decision etica alimentaria",
        "relation": "la relación entre la información comunicada, sus evidencias y límites y los riesgos documentados del caso ficticio de etiquetado, sin ocultarlos ni calificar creencias personales",
        "pages": [
          509
        ],
        "sourceRecordIds": [
          "826e9f2e-48b1-507f-a290-63a570dc0b57"
        ]
      },
      {
        "id": "food-nutrients",
        "grade": 5,
        "label": "Nutrientes de los alimentos",
        "match": "nutrientes?|carbohidratos|proteinas|lipidos|vitaminas|suplementos",
        "relation": "la composición y función de los nutrientes expresamente pedidos según el modelo dado, sin inferir recomendaciones nutricionales personales ni eficacia terapéutica de suplementos",
        "pages": [
          506,
          507
        ],
        "sourceRecordIds": [
          "7b5ffa4e-11c1-59c5-8a63-cf7dacde848e",
          "e2d4d226-7d8a-59ca-b436-398c50d565b2",
          "01256f4b-31c6-5c2c-a6e8-ab55d41ad728"
        ]
      },
      {
        "id": "food-spices",
        "grade": 5,
        "label": "Especias y hierbas en alimentos",
        "match": "especias|hierbas (?:en|para) alimentos",
        "relation": "las propiedades y función de las especias o hierbas indicadas en la formulación alimentaria proporcionada, sin atribuirles eficacia terapéutica",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "bb57f3d2-c626-5d91-b66e-5922511c58ec"
        ]
      },
      {
        "id": "molecular-food",
        "grade": 5,
        "label": "Química molecular de alimentos",
        "match": "quimica molecular de alimentos|composicion molecular (?:de los |de )?alimentos|molecular de alimentos",
        "relation": "la relación entre composición molecular y propiedades del alimento representado en los datos o modelos proporcionados",
        "pages": [
          506,
          507
        ],
        "sourceRecordIds": [
          "4cf124bc-9288-5679-b3f5-28fbd76b82d8",
          "40500dc5-3faa-5d3c-a151-3636adccd419"
        ]
      },
      {
        "id": "food-chain",
        "grade": 5,
        "label": "Transporte, recepción y almacenamiento de alimentos",
        "match": "transporte de alimentos|recepcion de alimentos|almacenamiento de alimentos|transporte, recepcion y almacenamiento",
        "relation": "las condiciones de transporte, recepción o almacenamiento expresamente indicadas en el caso y su relación con la conservación del alimento, sin inventar temperaturas o plazos",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "f331b5e7-bb2c-56ce-b7a1-e4fca02dc5c9",
          "2f23c35d-8be2-57a9-9199-9748ecfefbde",
          "218c7502-cd45-5d9d-8fa8-b9880d116483"
        ]
      },
      {
        "id": "food-quality",
        "grade": 5,
        "label": "Calidad e inocuidad de alimentos",
        "match": "calidad (?:e |y )?inocuidad|inocuidad de alimentos|calidad de alimentos|caducidad|alimentos perecederos|alimentos enlatados|seguridad alimentaria",
        "relation": "los indicadores de calidad, inocuidad o caducidad del alimento y sus referencias proporcionadas, sin concluir seguridad de consumo solo por apariencia",
        "pages": [
          506,
          507
        ],
        "sourceRecordIds": [
          "077638c7-88b2-5c5e-ae96-cfa526a04fce",
          "e7b6b23a-fe44-576e-826a-08430e5f7196",
          "2ed10153-035b-5a04-9625-81b085c46d70",
          "e8fa4c2a-0ed5-5d13-9aee-f5618a28039a"
        ]
      },
      {
        "id": "food-drying",
        "grade": 5,
        "label": "Liofilización, desecación y concentración",
        "match": "liofilizacion|desecacion|concentracion de alimentos",
        "relation": "la transferencia de agua y las condiciones del método de conservación solicitado según el modelo proporcionado, sin exigir preparar ni consumir alimentos",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "6391f17d-121a-5c51-996d-ac14716c1e40"
        ]
      },
      {
        "id": "food-preservatives",
        "grade": 5,
        "label": "Conservación por aditivos",
        "match": "conservantes|conservacion por aditivos|salmuera|vinagre|aditivos alimentarios",
        "relation": "la función y las restricciones del conservante solicitado según la ficha alimentaria proporcionada, sin formular concentraciones seguras no documentadas",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "33d9f09e-616c-5826-b2cb-2e769262c08d"
        ]
      },
      {
        "id": "food-temperature",
        "grade": 5,
        "label": "Conservación por temperatura",
        "match": "conservacion por temperatura|congelacion|pasteurizacion|esterilizacion de alimentos",
        "relation": "los cambios térmicos y las condiciones del método solicitado en el modelo dado, sin afirmar inocuidad de un producto real ni exigir calentarlo",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "496c37e8-6358-57fa-96d4-77433336b5b0"
        ]
      },
      {
        "id": "food-ph",
        "grade": 5,
        "label": "Sal, azúcar, pH y otros métodos de conservación",
        "match": "conservacion por ph|conservacion por sal|conservacion por azucar|ahumado|curado de alimentos",
        "relation": "la variable química y su relación con la conservación en el modelo proporcionado, sin inferir parámetros seguros para preparar o consumir alimentos reales",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "c894f3a3-3df0-5c16-8dee-f7570252a915"
        ]
      },
      {
        "id": "scientific-method",
        "grade": 5,
        "label": "Etapas expresamente solicitadas del método científico",
        "match": "metodo cientifico|etapas del metodo|hipotesis de quimica|procedimiento cientifico",
        "relation": "solo las etapas del método científico expresamente solicitadas, relacionando pregunta, evidencia y conclusión del caso sin exigir completar un experimento ausente",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "46ecf324-ebed-5c15-959d-723cd1e84f9a",
          "8ebf3ae5-869e-5fa6-834a-98cca5080cdb",
          "a7b4fe92-dfd1-52d7-95e4-f05d5fc406a8",
          "444b86b4-b8f2-5143-8c7b-0514ae672e61",
          "f6b0981d-3f01-5f83-9e6c-7ff77af9381e",
          "ac8ffd81-1169-5691-b5c2-1783bb559957"
        ]
      },
      {
        "id": "food-design",
        "grade": 5,
        "label": "Diseño de alimentos con aditivos o conservantes",
        "match": "diseno de alimentos|disena[^.;]*alimento",
        "relation": "la correspondencia entre propósito, ingredientes y restricciones de la formulación simulada dada, diferenciando el diseño de un producto realmente preparado o validado",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "8cba4075-076e-5069-bfae-103f4fd25ce0"
        ]
      },
      {
        "id": "food-properties",
        "grade": 5,
        "label": "Propiedades de sustancias en alimentos",
        "match": "propiedades de sustancias en alimentos|propiedades de los alimentos",
        "relation": "las propiedades químicas y físicas de las sustancias alimentarias solicitadas y su relación con la evidencia proporcionada",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "b2133bc2-c571-53e7-8eeb-d351ba5f358f"
        ]
      },
      {
        "id": "food-biotechnology",
        "grade": 5,
        "label": "Biotecnología de alimentos",
        "match": "biotecnologia de alimentos|biotecnologica[^.;]*alimento",
        "relation": "el proceso biotecnológico y sus resultados descritos en las fuentes alimentarias proporcionadas, distinguiendo evidencia de inferencias y sin exigir cultivos",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "d18cb3a1-9805-5086-86b9-0c9aacf8b17b"
        ]
      },
      {
        "id": "food-fermentation",
        "grade": 5,
        "label": "Fermentación de alimentos",
        "match": "fermentacion de alimentos|fermentacion",
        "relation": "las transformaciones del modelo de fermentación y las variables o resultados dados, sin imponer preparación, cultivo ni consumo real",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "04199072-f132-5afb-8f57-8d066c53ef87"
        ]
      },
      {
        "id": "food-packaging",
        "grade": 5,
        "label": "Envases para alimentos",
        "match": "envases? (?:para |de )?alimentos|envasado|empaque de alimentos",
        "relation": "la relación entre las propiedades del envase solicitado, el alimento y las condiciones de conservación del caso, sin inventar pruebas de compatibilidad",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "b792fe81-3486-55ef-87c7-9e9525a226df"
        ]
      },
      {
        "id": "food-quality-tests",
        "grade": 5,
        "label": "Microorganismos y pruebas de calidad",
        "match": "pruebas de calidad de alimentos|microorganismos y pruebas de calidad",
        "relation": "los controles, resultados y referencias de las pruebas alimentarias proporcionadas, sin atribuir pruebas propias ni generalizar a seguridad de consumo",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "2eb63931-bc36-5a98-b68c-ef4ff84bf86d"
        ]
      },
      {
        "id": "food-tools",
        "grade": 5,
        "label": "Equipos y materiales de química de alimentos",
        "match": "equipos de quimica de alimentos|materiales de quimica de alimentos|instrumentos de quimica de alimentos",
        "relation": "la correspondencia entre la herramienta ilustrada, su función y el resultado que permite obtener según la ficha dada, sin exigir equipos reales",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "1595367e-ff74-5891-893b-a44fdd6f6c20"
        ]
      },
      {
        "id": "food-problems",
        "grade": 5,
        "label": "Problemas de producción de alimentos",
        "match": "produccion de alimentos|problema[^.;]*(?:conservacion|produccion)[^.;]*alimentos",
        "relation": "la relación entre datos, restricciones y solución del problema alimentario proporcionado, justificando qué evidencia permite comprobarla",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "b29dfb11-1c8c-5649-b7e7-638f07f8c310"
        ]
      },
      {
        "id": "food-regulations",
        "grade": 5,
        "label": "Regulaciones y normas sanitarias alimentarias",
        "match": "normas sanitarias alimentarias|regulaciones alimentarias|regulacion de alimentos|normas de alimentos",
        "relation": "las disposiciones del extracto alimentario dado y su aplicación al caso ficticio, sin afirmar vigencia o autorizaciones fuera de la fuente proporcionada",
        "pages": [
          506,
          507
        ],
        "sourceRecordIds": [
          "c43878dd-d8c1-5ae1-9389-deda957bc73f",
          "a00bc7db-fd0d-5984-8c43-4b9d7b999e53",
          "caddc620-d28e-5734-aa94-47042650ded2"
        ]
      },
      {
        "id": "food-infections",
        "grade": 5,
        "label": "Infecciones y enfermedades transmitidas por alimentos",
        "match": "contaminacion de alimentos|infecciones alimentarias|bacterias|virus|escherichia coli|listeria|salmonella|ameba|shigella|hepatitis a|norovirus",
        "relation": "las evidencias del agente y de la vía de contaminación expresamente solicitados en el expediente ficticio, distinguiendo prevención documentada de diagnóstico o cultivo real",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "e3a1e3c9-2cd0-540e-86f5-8c42a531259e",
          "c87c3780-30e2-59e2-80ec-bf8f90f33ed4",
          "9f1b7724-fcb7-5b20-81dd-1f64375c9ae0",
          "bcb544fb-c096-5619-9a60-37d66d367bf2"
        ]
      },
      {
        "id": "food-handling",
        "grade": 5,
        "label": "Manipulación y buenas prácticas alimentarias",
        "match": "manipulacion de alimentos|buenas practicas alimentarias|riesgos de frutas|riesgos de vegetales",
        "relation": "las prácticas y riesgos documentados de manipulación del alimento indicado, justificando las medidas dadas sin visitas, consumo ni pruebas reales",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "71368673-4b99-56ae-88a0-eb9ea74fbb99",
          "ddd7005c-bb1c-5a83-bf9f-28616edfae88",
          "d09745b5-80d1-5afe-bbf0-4bb4a812f8ae",
          "bba1653a-5fbe-560d-b611-d06ec74fd1e7"
        ]
      },
      {
        "id": "food-pesticides",
        "grade": 5,
        "label": "Plaguicidas y riesgos en alimentos",
        "match": "plaguicidas|pesticidas|fungicidas|herbicidas|insecticidas",
        "relation": "la presencia, función y riesgos del plaguicida solicitado según las fichas y resultados proporcionados, sin exigir aplicación ni inferir residuos no medidos",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "6540ee15-ee87-5eca-a5c5-57767e8f52d9"
        ]
      },
      {
        "id": "food-environment",
        "grade": 5,
        "label": "Reciclaje y cuidado ambiental alimentario",
        "match": "reciclaje alimentario|residuos alimentarios|ambiente alimentario",
        "relation": "la relación entre residuos y medidas de manejo del proceso alimentario ficticio proporcionado, sin imponer manipulación de residuos reales",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "2f8a3ad8-87d6-5261-bbda-b1f693110022",
          "104637de-1bd6-5609-a4f6-a40428655661"
        ]
      },
      {
        "id": "scientific-collaboration",
        "grade": 5,
        "label": "Contraste de ideas con evidencias observables",
        "match": "contraste de ideas|aportaciones del equipo|contribucion del equipo",
        "relation": "las aportaciones identificables y el uso de evidencias para resolver la discrepancia del trabajo científico solicitado, sin calificar interés o personalidad",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "239724f7-6f66-5673-8e1a-5e23f117ce77"
        ]
      },
      {
        "id": "scientific-communication",
        "grade": 5,
        "label": "Comunicación científica solicitada",
        "match": "comunicacion cientifica|lenguaje cientifico",
        "relation": "la correspondencia entre afirmaciones, representaciones y evidencias del contenido químico expresamente solicitado, sin exigir productos adicionales",
        "pages": [
          506
        ],
        "sourceRecordIds": [
          "cf37a0ce-3738-56d3-a102-f6a98600282c"
        ]
      },
      {
        "id": "pharmaceutical-chemistry",
        "grade": 5,
        "label": "Química farmacéutica y salud",
        "match": "quimica farmaceutica|caso farmaceutico|clases de medicamentos",
        "relation": "las relaciones químicas y sanitarias expresamente descritas en el expediente ficticio dado, sin recomendaciones clínicas ni identificación de pacientes",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "ca8e9f6b-f729-5b46-a76b-82ee9c5ae3c3",
          "6983ad3b-5341-51d0-91f0-8ed9240ce01c",
          "a6a7468c-4b71-5bc8-9df6-069cb6f3ca7b",
          "27e9b770-7455-5fee-9e9f-844a1697a8bf"
        ]
      },
      {
        "id": "pharmaceutical-synthesis",
        "grade": 5,
        "label": "Síntesis y caracterización molecular mediante modelos",
        "match": "sintesis y perfil molecular documentado|sintesis molecular|sintesis[^.;]*farmaceutic|sintesis[^.;]*compuesto|grupos funcionales|caracterizacion molecular",
        "relation": "los grupos funcionales, transformaciones y restricciones del modelo molecular proporcionado, distinguiendo su representación de síntesis o caracterización real de sustancias",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "a93eebd5-23d0-530f-8c55-743ecf3c2680",
          "409bfed4-11f2-524b-b4fd-61a1a5218e15",
          "0e2ecb4a-22d4-5840-b0bc-100bbdf00c37"
        ]
      },
      {
        "id": "drug-classification",
        "grade": 5,
        "label": "Clasificación, estructura y modo de acción de fármacos",
        "match": "clasificacion de farmacos|estructura y modo de accion|clasificacion de medicamentos",
        "relation": "la correspondencia entre clase, estructura y modo de acción del fármaco ficticio según las fichas dadas, sin inferir tratamientos para personas",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "349553ff-3d76-5228-923f-55ff5e3cab00"
        ]
      },
      {
        "id": "drug-interactions",
        "grade": 5,
        "label": "Interacciones de fármacos con el organismo",
        "match": "interacciones de farmacos|interaccion[^.;]*organismo",
        "relation": "las interacciones descritas en el modelo y las fuentes profesionales proporcionados, sin extrapolar a combinaciones o tratamientos personales",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "4f8710e3-f7b2-548d-b729-56c0ffe7ed03"
        ]
      },
      {
        "id": "drug-development",
        "grade": 5,
        "label": "Desarrollo preclínico y clínico de medicamentos",
        "match": "desarrollo[^.;]*(?:compuesto|farmaco|medicamento)|resultados preclinicos|resultados clinicos|ensayos clinicos",
        "relation": "las fases, controles y resultados documentados del desarrollo farmacéutico ficticio, distinguiendo evidencias preclínicas y clínicas y sus límites",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "46dcb01d-418e-5c29-b2b9-6592ae8c6953",
          "e8b7d594-964e-52e0-ab23-7af55b44320c"
        ]
      },
      {
        "id": "drug-sources",
        "grade": 5,
        "label": "Fuentes de compuestos farmacéuticos",
        "match": "fuentes de compuestos farmaceuticos|origen de farmacos|plantas y microorganismos",
        "relation": "la procedencia y características del compuesto descrito en las fuentes proporcionadas, sin inferir eficacia por su origen ni exigir extracción o cultivo",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "6e843916-54a8-5cc4-a64b-884c4b797f61"
        ]
      },
      {
        "id": "pharmacokinetics",
        "grade": 5,
        "label": "Farmacocinética y farmacodinámica",
        "match": "farmacocinetica|farmacodinamica|absorcion|distribucion, metabolismo|excrecion|adme",
        "relation": "los parámetros y relaciones de absorción, distribución, metabolismo, excreción o respuesta expresamente pedidos en el modelo dado, sin derivar dosis o tratamientos personales",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "b7f76427-ad71-588e-b29f-8b71e13fb220",
          "d6f04cc9-9b3b-5568-98c9-9788546fadf5"
        ]
      },
      {
        "id": "drug-mechanisms",
        "grade": 5,
        "label": "Mecanismos de acción y enfermedad",
        "match": "mecanismos? de accion de farmacos|mecanismos? de accion de medicamentos",
        "relation": "la relación entre el compuesto y el mecanismo descrito en el modelo de enfermedad dado, sin atribuir eficacia clínica no respaldada",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "04eab2d0-d065-5a71-a601-9604466f1e24"
        ]
      },
      {
        "id": "drug-adverse",
        "grade": 5,
        "label": "Reacciones adversas y prevención en casos documentales",
        "match": "reacciones adversas|efectos adversos",
        "relation": "los efectos y límites causales documentados en el expediente ficticio, justificando la prevención descrita por las fuentes profesionales sin indicar medicamentos",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "0e6e672e-1811-5285-b5cd-db5b5409e99a"
        ]
      },
      {
        "id": "drug-regulation",
        "grade": 5,
        "label": "Regulación, seguridad y eficacia farmacéutica",
        "match": "regulacion[^.;]*farmaceutic|seguridad y eficacia|seguridad del[^.;]*medicamento|extracto regulatorio",
        "relation": "los criterios de seguridad, eficacia y regulación de los extractos proporcionados aplicados al caso ficticio, sin afirmar autorización vigente ni recomendar uso",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "7517b89d-a33e-5a97-8992-c51344d61782",
          "59d544ff-6a2f-5ee4-86f4-e90660a251f7"
        ]
      },
      {
        "id": "drug-invitro",
        "grade": 5,
        "label": "Evaluación in vitro con resultados proporcionados",
        "match": "evaluacion in vitro|ensayo in vitro",
        "relation": "las condiciones, controles y resultados in vitro proporcionados o simulados y sus límites para inferir efectos en personas, sin realizar ensayos reales",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "506f4d0d-8b87-5277-ab51-6cda08075fc5"
        ]
      },
      {
        "id": "drug-report",
        "grade": 5,
        "label": "Informes farmacéuticos y resultados de laboratorio dados",
        "match": "informe[^.;]*farmaceutic|resultados de laboratorio farmaceutico",
        "relation": "la organización de procedimientos, resultados y límites del expediente farmacéutico dado, distinguiendo actuaciones propias de información proporcionada",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "fc519870-b780-55fe-8cd6-69f288e2f86d",
          "d92f938a-424b-51db-85c9-31432cd39e62"
        ]
      },
      {
        "id": "drug-labels",
        "grade": 5,
        "label": "Etiquetas y prospectos de medicamentos",
        "match": "etiqueta[^.;]*medicamento|prospectos?|etiqueta[^.;]*fictici",
        "relation": "la lectura de las secciones expresamente solicitadas de la etiqueta o prospecto ficticios según la fuente profesional proporcionada, sin recomendar dosis, tratamientos ni cambios de medicación",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "57d65ee6-e919-5616-8b83-ece8aef3e163",
          "34020500-ab26-5a58-b945-f50627bd34fb"
        ]
      },
      {
        "id": "drug-software",
        "grade": 5,
        "label": "Diseño molecular farmacéutico con software",
        "match": "modelado[^.;]*farmaceutic|software[^.;]*farmaco|molecula farmaceutica",
        "relation": "la relación entre restricciones estructurales, parámetros y propiedades del diseño farmacéutico simulado, sin atribuir validación clínica al modelo computacional",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "15d016c0-87ef-571f-a9de-e99fa3935454"
        ]
      },
      {
        "id": "drug-alternatives",
        "grade": 5,
        "label": "Lectura crítica de prácticas terapéuticas citadas",
        "match": "homeopatia|fitoterapia|naturopatia|terapias alternativas|practicas terapeuticas",
        "relation": "las afirmaciones y calidad de evidencia de las prácticas citadas en fuentes profesionales proporcionadas, sin atribuir eficacia o equivalencia clínica por tradición u origen natural",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "d849dd58-3c55-5318-9a42-79554c9e1b3b"
        ]
      },
      {
        "id": "first-aid-kit",
        "grade": 5,
        "label": "Botiquín y pautas profesionales proporcionadas",
        "match": "botiquin|primeros auxilios",
        "relation": "los componentes y pautas de la ficha profesional de botiquín proporcionada y su adecuación al caso simulado, sin administrar productos ni intervenir sobre personas",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "344fdd80-b0ad-50ed-9f5b-f1415f582667",
          "af0e3543-11a4-5930-b670-6b25e2b5ee51"
        ]
      },
      {
        "id": "computational-foundations",
        "grade": 5,
        "label": "Química teórica, experimental y modelos computacionales",
        "match": "quimica teorica|quimica experimental|modelo molecular|modelos computacionales|metodo de calculo",
        "relation": "la correspondencia entre representación molecular, supuestos teóricos, método de cálculo y evidencia experimental proporcionada, sin equiparar una predicción a validación empírica",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "564f6869-4694-5fe3-b4d2-23a329aff286",
          "2ccb3bc8-e399-5bd0-bede-68b4ec4cc462"
        ]
      },
      {
        "id": "molecular-mechanics",
        "grade": 5,
        "label": "Mecánica y dinámica molecular",
        "match": "mecanica molecular|dinamica molecular",
        "relation": "las variables, interacciones y supuestos del modelo de mecánica o dinámica molecular solicitado y sus límites según los datos dados",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "b35868d5-2ee1-5fb4-be8a-ef9fa65232b6"
        ]
      },
      {
        "id": "molecular-geometry",
        "grade": 5,
        "label": "Optimización geométrica y propiedades fisicoquímicas",
        "match": "optimizacion geometrica|propiedades fisicoquimicas",
        "relation": "la relación entre geometría, criterio de optimización y propiedad fisicoquímica expresamente solicitada bajo las condiciones del modelo dado",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "a1190a9a-ff74-5c06-b408-a739d6f4b608"
        ]
      },
      {
        "id": "electronic-structure",
        "grade": 5,
        "label": "Densidad electrónica y energías de enlace",
        "match": "densidad electronica|energias? de enlace|energias? de disociacion",
        "relation": "la distribución electrónica o la energía del enlace expresamente solicitado según el modelo y sus unidades, sin confundir energía de enlace con energía total ausente",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "56f5f26d-c81b-5951-9995-e71061abe776"
        ]
      },
      {
        "id": "structure-activity",
        "grade": 5,
        "label": "Relación estructura y actividad",
        "match": "relacion estructura.actividad|estructura y actividad",
        "relation": "la asociación documentada entre estructura y actividad en el conjunto de datos dado, diferenciando correlación de causalidad o eficacia clínica",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "ea74a25c-30b3-5cc8-bc1a-d48aa1606ff7"
        ]
      },
      {
        "id": "molecule-design",
        "grade": 5,
        "label": "Diseño y optimización de moléculas",
        "match": "disena[^.;]*molecula|diseno molecular|optimizacion de moleculas",
        "relation": "la correspondencia entre estructura, restricciones y propiedades objetivo de la molécula simulada, sin atribuir síntesis o validación experimental no realizadas",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "08c6d0c8-c15e-5d0f-8510-8f73ed8ea46a",
          "c9737127-ca31-5a7e-b157-3f4b726e1a9b"
        ]
      },
      {
        "id": "reaction-simulation",
        "grade": 5,
        "label": "Simulación de mecanismos de reacción",
        "match": "mecanismos? de reaccion|simulacion de reacciones",
        "relation": "la secuencia y las condiciones del mecanismo de reacción representado en la simulación proporcionada, distinguiendo salidas calculadas de resultados experimentales",
        "pages": [
          507,
          508
        ],
        "sourceRecordIds": [
          "60129d55-7d36-502d-99b1-6c6d2ab2b1f9",
          "e93ef938-8f0c-5566-9051-0c970d095b2b"
        ]
      },
      {
        "id": "chemical-programming",
        "grade": 5,
        "label": "Programación y scripts de química computacional",
        "match": "algoritmo[^.;]*molecular|programacion quimica|script[^.;]*quimic|programa[^.;]*propiedad molecular",
        "relation": "los pasos, entradas, decisiones y salidas del algoritmo químico expresamente pedido, comprobables con los casos proporcionados sin imponer nuevas dependencias",
        "pages": [
          507,
          508
        ],
        "sourceRecordIds": [
          "61060933-0f79-5c01-9c55-48761d44d6f7",
          "9c5e5782-ec0d-56f8-a792-c303058a3aec"
        ]
      },
      {
        "id": "computational-ethics",
        "grade": 5,
        "label": "Ética, privacidad e impactos computacionales",
        "match": "privacidad[^.;]*quimica|datos[^.;]*quimica computacional|etica[^.;]*computacional|impactos computacionales",
        "relation": "las decisiones verificables sobre privacidad, atribución y comunicación de límites del caso computacional ficticio, sin divulgar información personal ni calificar convicciones",
        "pages": [
          507,
          508
        ],
        "sourceRecordIds": [
          "dbafa21e-302a-50dd-a1b0-8ba448a7770b",
          "a5c8efaf-e88b-5309-a510-73e9ca626ddb"
        ]
      },
      {
        "id": "molecular-software",
        "grade": 5,
        "label": "Herramientas de modelado y simulación molecular",
        "match": "herramientas de modelado molecular|herramientas de simulacion molecular|software molecular",
        "relation": "la adecuación de las funciones y restricciones de las herramientas proporcionadas al problema químico solicitado, sin imponer instalación, compra ni servicios externos",
        "pages": [
          507,
          508
        ],
        "sourceRecordIds": [
          "dcf05684-7894-51a1-a0df-a0db7fe50094",
          "3ff1bfcb-64c3-5b1e-9fd7-6a2a44a358cc"
        ]
      },
      {
        "id": "molecular-calculation",
        "grade": 5,
        "label": "Cálculos de propiedades moleculares",
        "match": "calculo[^.;]*propiedades moleculares|calcula[^.;]*molecular",
        "relation": "la relación entre datos, método de cálculo, unidades y resultado molecular solicitado, comprobando coherencia con las referencias proporcionadas",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "bcfbf5d7-736c-5841-a5e4-37345368c142"
        ]
      },
      {
        "id": "simulation-results",
        "grade": 5,
        "label": "Análisis y presentación de resultados de simulación",
        "match": "resultados de simulacion molecular|resultados[^.;]*simulacion|parametros, resultados",
        "relation": "la relación entre entradas, parámetros, salidas e incertidumbre de la simulación dada, distinguiendo resultados calculados de observaciones empíricas",
        "pages": [
          507,
          508
        ],
        "sourceRecordIds": [
          "61c8c69d-4ced-5cf6-9127-a453fcb549cc",
          "c9c51882-338b-515e-a304-d51635111858"
        ]
      },
      {
        "id": "computational-debug",
        "grade": 5,
        "label": "Resolución de errores de química computacional",
        "match": "errores de quimica computacional|depura[^.;]*quimic|error[^.;]*simulacion",
        "relation": "la identificación del error y la comprobación de la corrección con los datos y casos de prueba proporcionados, sin atribuir salidas no obtenidas",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "53746a91-3357-53c2-ad45-e3190bd5d868"
        ]
      },
      {
        "id": "computational-project",
        "grade": 5,
        "label": "Proyecto computacional expresamente solicitado",
        "match": "proyecto de quimica computacional|proyecto computacional",
        "relation": "la relación entre propósito, modelo, procedimiento y resultados del proyecto computacional expresamente solicitado, sin exigir investigar o ejecutar otro si los resultados ya están dados",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "0a578b73-9d30-5f8c-a6fa-6014db4e2d10"
        ]
      },
      {
        "id": "given-safety",
        "grade": 5,
        "label": "Cumplimiento de reglas de seguridad proporcionadas",
        "match": "reglas de seguridad proporcionadas|reglas de seguridad dadas",
        "relation": "la aplicación verificable de las reglas proporcionadas al desempeño expresamente pedido, sin atribuir cumplimiento de acciones no observadas",
        "pages": [
          507
        ],
        "sourceRecordIds": [
          "44a8c29b-73ed-5746-b6b1-7b145e7383d8"
        ]
      },
      {
        "id": "textile-foundations",
        "grade": 5,
        "label": "Química de textiles y moda",
        "match": "quimica de textiles|quimica textil|quimica y moda",
        "relation": "la relación entre composición, proceso y uso textil descrita en las fuentes dadas, sin imponer fabricación o compra de materiales",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "4e63e829-4e34-56e3-a3ed-90308d6872ac",
          "1ac98d5b-8d47-59ae-8f1c-b9308ea2e4f0"
        ]
      },
      {
        "id": "textile-fibers",
        "grade": 5,
        "label": "Fibras, hilado, tejido y materiales",
        "match": "fibras textiles|hilado|tejido|materiales textiles",
        "relation": "las propiedades y estructura del material o fibra solicitados según las muestras ilustradas y datos proporcionados, sin exigir pruebas adicionales",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "7ac85079-04bd-5d5a-96b7-7a154c07f689",
          "e3433339-8cb4-5d3f-9582-dec1717c2175"
        ]
      },
      {
        "id": "textile-finishing",
        "grade": 5,
        "label": "Tintura y acabados textiles",
        "match": "tintura|acabado textil|acabados textiles|tenido",
        "relation": "la compatibilidad entre fibra, colorante, tratamiento y resultado expresamente solicitados según las fichas dadas, distinguiendo diseño simulado de aplicación real",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "a8c7600c-1386-5228-8dd9-84f36fe00f17",
          "c937c19a-9c79-5c60-959b-996cb0c528a7"
        ]
      },
      {
        "id": "textile-colorants",
        "grade": 5,
        "label": "Colorantes y pigmentos textiles",
        "match": "colorantes textiles|pigmentos textiles",
        "relation": "las propiedades y función del colorante o pigmento solicitado en el sistema textil del modelo dado, sin confundir pigmento con colorante soluble",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "974f440d-4068-5d01-8219-a713efd419b6"
        ]
      },
      {
        "id": "textile-agents",
        "grade": 5,
        "label": "Suavizantes, repelentes y retardantes textiles",
        "match": "suavizantes|repelentes al agua|retardantes de llama",
        "relation": "la función y compatibilidad del agente de acabado expresamente solicitado según las fichas proporcionadas, sin atribuir prestaciones no comprobadas",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "d1efac6f-0009-54ae-96ae-2747f56090a2"
        ]
      },
      {
        "id": "textile-cleaning",
        "grade": 5,
        "label": "Blanqueo y desengrasado textiles",
        "match": "blanqueo|desengrasado",
        "relation": "las transformaciones y restricciones del método de limpieza textil solicitado en el modelo dado, sin exigir manipulación real de sustancias",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "d1942465-e2b4-5941-9988-6d92e4143128"
        ]
      },
      {
        "id": "textile-safety",
        "grade": 5,
        "label": "Seguridad química textil mediante fichas dadas",
        "match": "seguridad quimica textil|riesgos[^.;]*textil|fichas de seguridad[^.;]*textil",
        "relation": "los riesgos y medidas preventivas de las fichas profesionales dadas relacionados con el proceso textil ficticio, sin manipulación peligrosa ni decisiones sanitarias personales",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "7705f83d-e423-5647-99ee-2c139e55c1b4",
          "a67fc178-7279-5c88-82cb-dd6836b8c958"
        ]
      },
      {
        "id": "textile-environment",
        "grade": 5,
        "label": "Impacto ambiental de procesos textiles",
        "match": "impacto ambiental[^.;]*textil|manejo ambiental[^.;]*textil|residuos[^.;]*textil",
        "relation": "la relación entre proceso, residuos e impactos descritos en las fuentes del caso textil ficticio y las medidas indicadas, sin intervenciones ambientales reales",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "16ec4a4a-f67e-589e-bbfe-a898722cb034"
        ]
      },
      {
        "id": "textile-innovation",
        "grade": 5,
        "label": "Impresión digital, ropa inteligente e innovaciones",
        "match": "impresion digital|ropa inteligente|innovaciones textiles|tecnologias textiles",
        "relation": "el funcionamiento, usos y límites de la innovación textil solicitada según las fuentes dadas, sin exigir compra o acceso a tecnología ausente",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "618de39f-ce9f-5bfd-88c9-f9261ee08e06",
          "7eee29e5-9426-5047-9701-140318803033"
        ]
      },
      {
        "id": "textile-tests",
        "grade": 5,
        "label": "Pruebas textiles y resultados proporcionados",
        "match": "pruebas[^.;]*textiles|pruebas de sustancias|resultados[^.;]*textiles",
        "relation": "la correspondencia entre prueba, control y resultado textil proporcionados, explicitando los límites de identificación de sustancias sin realizar ensayos químicos",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "d182ac92-09d0-5cce-a505-3f94cdb69dd4",
          "1c58bf22-45d5-556e-aac6-d1a167fb22ef"
        ]
      },
      {
        "id": "textile-concentrations",
        "grade": 5,
        "label": "Concentraciones de soluciones para textiles",
        "match": "concentracion[^.;]*textil|soluciones para textiles|soluciones textiles",
        "relation": "la relación entre cantidad, volumen o masa, unidades y concentración de la solución del problema textil dado, sin exigir preparación física de sustancias",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "4e5eb4cf-3e31-5381-a899-6bfc865edc6a"
        ]
      },
      {
        "id": "textile-tools",
        "grade": 5,
        "label": "Herramientas y equipos textiles solicitados",
        "match": "maquina de tenido|espectrofotometro|equipos textiles|herramientas textiles",
        "relation": "la función de la herramienta expresamente solicitada y su relación con el dato o resultado textil de las fichas dadas, sin imponer equipos físicos",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "38148333-956e-5e76-8249-a4060f43f77a"
        ]
      },
      {
        "id": "textile-report",
        "grade": 5,
        "label": "Informes de pruebas y procesos textiles",
        "match": "informe[^.;]*textil|informes de pruebas y procesos textiles",
        "relation": "la organización de condiciones, resultados y límites del proceso textil documentado, distinguiendo la información dada de procedimientos propios",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "306a2207-9fb4-56a0-aff1-8a2d485236f8"
        ]
      },
      {
        "id": "textile-garment",
        "grade": 5,
        "label": "Diseño simulado de prendas y tecnología",
        "match": "prenda[^.;]*tecnologia|diseno[^.;]*prenda|disena[^.;]*prenda",
        "relation": "la relación entre material, tecnología y función de la prenda representada en el diseño simulado según las restricciones dadas, sin exigir fabricación o venta",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "a2837903-a45c-598f-bd57-b655bc378e87"
        ]
      },
      {
        "id": "requested-technology",
        "grade": 5,
        "label": "Uso de tecnología expresamente solicitado",
        "match": "integracion tecnologica|uso de tecnologia solicitado",
        "relation": "el uso verificable de la función tecnológica expresamente requerida para el producto químico dado, sin imponer recursos o servicios adicionales",
        "pages": [
          508
        ],
        "sourceRecordIds": [
          "e5b3c152-3b5b-58d9-a388-a790a00d38d4"
        ]
      }
    ]
  },
  {
    "id": "fisica-computacion-optativa-6",
    "grade": 6,
    "cycle": 2,
    "subjectCode": "OPT-CT-6",
    "subjectName": "Física y Computación",
    "optativeExitName": "Ciencias y Tecnología",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "1941d633-9878-579b-9cc3-ae913a00dfda",
    "pdfPages": [
      511,
      512,
      513,
      514,
      515,
      516,
      517
    ],
    "policy": "REQUESTED_PHYSICAL_COMPUTATIONAL_ACTIONS_GIVEN_MODELS_NO_DEPLOYMENTS_V1",
    "topics": [
      {
        "id": "electronic-circuit",
        "grade": 6,
        "label": "Circuitos eléctricos y electrónicos",
        "match": "circuitos? (?:electricos?|electronicos?)|sistema electronico",
        "relation": "la correspondencia entre componentes, conexiones, entradas y salidas del circuito representado y las especificaciones dadas, sin exigir montaje físico ni conexión a la red",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "0b7472fe-da1b-528a-b9f8-6e4a08bd31c1",
          "f7da748f-295a-5c6f-8fac-c960d58979fe",
          "573c99e9-02be-5e4f-9d4c-a3e008dd0442"
        ]
      },
      {
        "id": "electric-magnetism",
        "grade": 6,
        "label": "Electricidad y magnetismo",
        "match": "electricidad y magnetismo|campo electrico|campo magnetico",
        "relation": "las relaciones entre cargas, corrientes y campos expresamente solicitadas según el modelo proporcionado",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "8b466997-6a37-5d56-bace-abf7281ab1bf"
        ]
      },
      {
        "id": "electronic-components",
        "grade": 6,
        "label": "Componentes electrónicos",
        "match": "componentes electronicos|resistencias|capacitores|inductores|diodos|transistores|circuitos integrados",
        "relation": "la función y conexión representada del componente electrónico solicitado según sus parámetros y ficha dada",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "1c9d41f5-de9a-5064-8f7b-51723c7e8c93"
        ]
      },
      {
        "id": "electronic-power",
        "grade": 6,
        "label": "Baterías y fuentes de alimentación",
        "match": "baterias|fuentes de alimentacion|fuentes de energia electrica",
        "relation": "la relación entre fuente, tensión suministrada y requisitos del circuito ficticio según la ficha dada, sin manipular baterías o instalaciones reales",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "7b8eafb2-6233-51da-87ac-504f2977d2a0"
        ]
      },
      {
        "id": "digital-systems",
        "grade": 6,
        "label": "Circuitos lógicos y sistemas digitales",
        "match": "circuitos logicos|sistemas digitales|sistema digital|micro controladores?",
        "relation": "la relación entre entradas, estados lógicos y salidas o instrucciones del sistema digital expresamente pedido",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "76dc2498-b69b-547d-a865-4ea5c72ec7a8",
          "54f4956a-62c7-5012-98c5-6601b9968dec"
        ]
      },
      {
        "id": "signal-communication",
        "grade": 6,
        "label": "Comunicación y transmisión de señales",
        "match": "comunicacion y transmision|transmision de senales|radio|television|telefonia movil",
        "relation": "la correspondencia entre señal, canal, receptor y resultado del sistema de comunicación documentado en las fichas proporcionadas",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "63f19aaf-2daf-51c8-90f4-3f5da8ecd969",
          "48c9a846-f9aa-5705-8808-ab414dda3fd2"
        ]
      },
      {
        "id": "electrical-measurement",
        "grade": 6,
        "label": "Instrumentación y parámetros eléctricos",
        "match": "instrumentacion|parametros electricos|mediciones electricas|medicion electrica|voltimetro|amperimetro|ohmetro|voltaje|corriente y resistencia",
        "relation": "la correspondencia entre magnitud, instrumento, conexión representada, lectura y unidad eléctricas solicitadas según las fichas dadas, sin medir circuitos reales",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "28aa9faf-dbb6-5a16-9ce9-24982aecf7bc",
          "2220ff47-d3f5-522a-8414-aa747f8d92f8"
        ]
      },
      {
        "id": "signal-control",
        "grade": 6,
        "label": "Procesamiento de señales y control",
        "match": "procesamiento de senales|sistemas? de control",
        "relation": "la relación entre señal de entrada, procesamiento, realimentación o salida expresamente solicitados en el diagrama de control dado",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "1136cf00-724f-5b32-8896-9e7678485ffa",
          "10437154-fc4d-5040-a40e-0acca7095137"
        ]
      },
      {
        "id": "circuit-simulation",
        "grade": 6,
        "label": "Diseño y simulación de circuitos",
        "match": "simulacion de circuitos|simula[^.;]*circuito|diseno y simulacion de circuitos",
        "relation": "la correspondencia entre esquema, parámetros, salidas y especificaciones del circuito en el recurso de simulación proporcionado",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "595143b0-9c97-5c91-9387-b5694e7e38c6",
          "245bc832-cef1-596b-ab24-096d58407c00"
        ]
      },
      {
        "id": "electrical-safety",
        "grade": 6,
        "label": "Ética y protección eléctrica mediante modelos",
        "match": "proteccion electrica|seguridad electrica|proteccion en sistemas electricos|seguridad[^.;]*(?:circuito|electronic)",
        "relation": "los riesgos y medidas de protección documentados en el plano o simulación dados, sin intervención en cableado o circuitos reales",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "639abc18-40ca-59b2-afc8-1db7462fc4ec",
          "5a36cc30-bf95-5275-b8d5-f56fcbc48d7b"
        ]
      },
      {
        "id": "scientific-phases",
        "grade": 6,
        "label": "Etapas científicas expresamente solicitadas",
        "match": "etapas cientificas|planteamiento de problema|formulacion de (?:preguntas|hipotesis)|metodo cientifico",
        "relation": "solo las etapas científicas solicitadas y su relación entre pregunta, procedimiento, evidencia y conclusión del caso, sin exigir completar etapas ausentes",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "0e57a6e4-144e-5a1a-a207-ac72acac6d11",
          "07da8b60-ae0c-5b45-a532-7d3a84ea8590",
          "c803979a-59a4-5528-8bc3-1c2f6a6f77f4",
          "cae70a38-6d47-5cf3-9485-8ccb2ce39279",
          "0f5f1872-6090-5bfe-a90c-18e410c8ebce"
        ]
      },
      {
        "id": "results-ethics",
        "grade": 6,
        "label": "Procedencia y límites de resultados comunicados",
        "match": "procedencia y limites|etica de los resultados|resultados acordes con la etica",
        "relation": "la atribución, procedencia y límites verificables de los resultados comunicados según el expediente dado, sin evaluar convicciones privadas",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "79d2c5a9-cdc9-53a1-9fd8-c02391b3cc9c"
        ]
      },
      {
        "id": "information-contrast",
        "grade": 6,
        "label": "Contraste crítico de información dada",
        "match": "(?:contraste critico|valoracion critica) de informacion|criticidad[^.;]*informacion",
        "relation": "la correspondencia entre afirmaciones, fuentes proporcionadas y límites de las conclusiones, sin exigir investigar fuentes nuevas",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "9acc9012-8676-5062-b0f2-a46345b1237b"
        ]
      },
      {
        "id": "requested-technology",
        "grade": 6,
        "label": "Uso tecnológico expresamente solicitado",
        "match": "uso tecnologico expresamente solicitado|tecnologia de la informacion y las comunicaciones",
        "relation": "la función del recurso tecnológico expresamente solicitado para el desempeño dado, sin exigir aplicaciones, cuentas o dispositivos adicionales",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "495e4a3b-4e0e-5c50-8f83-fb5144f3a0a4"
        ]
      },
      {
        "id": "home-electrical-model",
        "grade": 6,
        "label": "Instalaciones domésticas e inversores mediante planos y fichas dadas",
        "match": "instalaciones domesticas|instalaciones electricas|cableado|calibre del alambrado|conexion(?:es)? a tierra|inversores",
        "relation": "la correspondencia entre consumo, protección, calibre o conexión del plano doméstico solicitado y las referencias profesionales dadas, sin realizar instalaciones energizadas",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "fc5a9cef-2ccd-54cb-804a-38361238b7f8",
          "71c9c150-60f0-5279-a9df-100df20d8c9c",
          "dc5cfc15-3072-544a-b45a-6f1122da57e9"
        ]
      },
      {
        "id": "circuit-board-model",
        "grade": 6,
        "label": "Tarjetas de circuito impreso mediante modelos",
        "match": "tarjetas? de circuito impreso|circuitos impresos",
        "relation": "la correspondencia entre trazado, conexiones y restricciones del diseño de tarjeta dado, sin fabricar placas ni manipular productos químicos",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "4f119893-5e1a-5a4f-8d4d-b76a2be2b5fa"
        ]
      },
      {
        "id": "electronic-instrument-model",
        "grade": 6,
        "label": "Instrumentos y juguetes electrónicos",
        "match": "instrumentos y juguetes electronicos|juguete electronico",
        "relation": "la correspondencia entre función, componentes y salidas del instrumento o juguete electrónico representado según las restricciones dadas",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "289c2fe7-c8e8-5b7a-be52-80696f8ce0a4"
        ]
      },
      {
        "id": "rectifier-model",
        "grade": 6,
        "label": "Conversión de alterna a directa",
        "match": "alterna a directa|alterno en directo|rectificador|convertidores de voltaje",
        "relation": "la relación entre la entrada alterna, la rectificación y la salida directa representadas en el modelo, sin confundir regulación con rectificación",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "9c32d86e-2a08-5904-bac8-c39603ad93bb"
        ]
      },
      {
        "id": "transformer-model",
        "grade": 6,
        "label": "Transformadores mediante modelos",
        "match": "transformadores|transformador|elevadores reductores",
        "relation": "la relación entre devanados, tensión de entrada y salida y condiciones del modelo de transformador dado, sin construcción ni conexión física",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "4de4e7a0-9638-52f4-a6ef-ac714e7dacd0"
        ]
      },
      {
        "id": "voltage-regulator-model",
        "grade": 6,
        "label": "Tarjetas reguladoras de voltaje",
        "match": "reguladoras? de voltaje|regulador de voltaje",
        "relation": "la relación entre entrada, regulación y salida del modelo de tarjeta y las especificaciones dadas, sin exigir fabricar una tarjeta",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "b722bdb0-f9d1-575f-8364-21fdb4a20129"
        ]
      },
      {
        "id": "electronic-enterprise-model",
        "grade": 6,
        "label": "Producto, proceso y empresa electrónica simulados",
        "match": "empresa electronica|producto electronico|comercializacion de un producto",
        "relation": "la coherencia entre necesidad, producto, proceso o comercialización expresamente pedidos en el caso empresarial ficticio, sin fabricar, vender ni crear una empresa real",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "b722bdb0-f9d1-575f-8364-21fdb4a20129",
          "922e454d-58ec-5aee-b356-13914d034677",
          "194bc418-461b-536f-8048-395a0c2c6ea7",
          "24a65559-eb15-5865-bd31-c932ef2d1d65",
          "b62efa73-b38f-5c80-a1d7-866b1e774440",
          "75fd24d7-40dd-5259-89de-d32582996ffb"
        ]
      },
      {
        "id": "robot-introduction",
        "grade": 6,
        "label": "Robótica, aplicaciones y control de movimiento",
        "match": "introduccion a la robotica|aplicaciones de la robotica|control de movimiento",
        "relation": "la relación entre tarea, percepción, control y movimiento del robot representado en las fichas dadas",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "b455f7ab-0718-5ca3-909d-3912fc56c6a1"
        ]
      },
      {
        "id": "robot-configuration",
        "grade": 6,
        "label": "Configuración, ensamblaje y desmontaje de robots",
        "match": "configuracion[^.;]*robot|ensamblaje[^.;]*robot|desmontaje[^.;]*robot|kit",
        "relation": "la correspondencia entre componentes, conexiones y configuración del robot representado y la tarea dada, sin exigir adquirir un kit o ensamblar un robot físico",
        "pages": [
          511,
          512
        ],
        "sourceRecordIds": [
          "f1837b05-c79a-54e6-bf76-6944abde779c",
          "e5a0ba4e-04c0-5310-bb7e-fa6633c56da9",
          "0b53a162-195f-5070-abe0-d9c3288ecfb6"
        ]
      },
      {
        "id": "robot-coordinates",
        "grade": 6,
        "label": "Coordenadas y cinemática robótica",
        "match": "coordenadas|cinematica",
        "relation": "la correspondencia entre sistema de referencia, posición y movimiento robótico expresamente solicitados en el esquema dado",
        "pages": [
          511
        ],
        "sourceRecordIds": [
          "1079249d-6e04-501b-8ce0-f7f3988894ca"
        ]
      },
      {
        "id": "robot-movement",
        "grade": 6,
        "label": "Movimientos y tareas de robots",
        "match": "movimientos basicos|movimientos y tareas de robots|tareas para robots|tarea[^.;]*robot",
        "relation": "la secuencia de movimientos del robot representado y su adecuación a la tarea y restricciones dadas",
        "pages": [
          511,
          512
        ],
        "sourceRecordIds": [
          "7aaba363-dba5-51e8-acbb-0f3782c039c9",
          "f6e49cdd-f66d-5ea9-ab5d-f0d9fc6d6d48"
        ]
      },
      {
        "id": "robot-command-sequence",
        "grade": 6,
        "label": "Secuencias de comandos robóticos",
        "match": "secuencias? de comandos|comandos roboticos",
        "relation": "el orden y efecto de los comandos robóticos expresamente solicitados, comprobables con las entradas y salidas del caso dado",
        "pages": [
          511,
          512
        ],
        "sourceRecordIds": [
          "c905df2d-0728-5993-9174-f109535b2caf",
          "6fc4a3ea-6946-50d9-bc03-2d9d80b26956"
        ]
      },
      {
        "id": "robot-sensors",
        "grade": 6,
        "label": "Sensores y actuadores según tarea",
        "match": "sensores|actuadores|sonares|giroscopio|sensor de contacto|sensor de color",
        "relation": "la correspondencia entre magnitud detectada, señal de entrada o acción de salida y tarea del robot, distinguiendo sensor de actuador",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "774c3103-1bd9-5bed-bb1c-31e2d01fe7d8",
          "88b70477-7dc4-5aa9-9aae-9d13a1af5bab",
          "22152152-f194-5085-bd21-e9503e6139f5",
          "3748be13-b651-50eb-b4ff-c0cd399d5467",
          "a4e27dac-7a3d-56c0-a172-a30f1aa25098",
          "9386180b-6773-57b8-86c0-14cd29c913e4",
          "c36ed19d-e574-5fad-85d9-903240cb4f72"
        ]
      },
      {
        "id": "robot-controller",
        "grade": 6,
        "label": "Controladores y parámetros",
        "match": "controladores|controlador|ajuste de parametros",
        "relation": "la correspondencia entre entradas, instrucciones, parámetros de control y respuesta del robot simulado según las restricciones dadas",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "adb64e72-a2bb-5862-bf71-fe3194b88490",
          "37e84c98-a8dc-59e4-93a9-53e7c3cb09da"
        ]
      },
      {
        "id": "robot-flowchart",
        "grade": 6,
        "label": "Diagramas de flujo y pseudocódigo",
        "match": "diagramas? de flujo|pseudocodigo",
        "relation": "la secuencia, decisiones y repeticiones representadas en el diagrama o pseudocódigo pedido y su correspondencia con la tarea dada",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "bb537579-c8a1-586a-aba5-23e8bc84b863"
        ]
      },
      {
        "id": "robot-wait",
        "grade": 6,
        "label": "Comandos de espera",
        "match": "comandos de espera|comando de espera",
        "relation": "la condición o duración de espera solicitada y su efecto sobre la secuencia del robot simulado según los casos dados",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "1423a49d-58ad-5a82-bb56-7aac4fc42ef0"
        ]
      },
      {
        "id": "robot-control-structures",
        "grade": 6,
        "label": "Decisiones, selección y repetición",
        "match": "tomas de decisiones|estructuras de seleccion|estructuras de repeticion|decisiones, seleccion y repeticion",
        "relation": "las condiciones, ramas o repeticiones expresamente solicitadas y su efecto sobre las salidas del programa robótico del caso",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "b7ad0b68-6f2e-55b7-8b07-3d02ef47af4b",
          "11059b38-4ea6-5ac6-a18d-82eef1bd1c64",
          "46ce65f5-880b-579e-8ba6-0ca7c9d53826"
        ]
      },
      {
        "id": "robot-program-data",
        "grade": 6,
        "label": "Variables, funciones y arreglos robóticos",
        "match": "variables, funciones y arreglos roboticos|variables|funciones|arreglos",
        "relation": "la función y uso de la variable, función o arreglo expresamente solicitados en el programa de control robótico dado",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "584c8ab0-c6e2-570a-8c72-1035b05a130f",
          "45de2493-537b-593e-b4e3-cb41627b3be7",
          "ca766931-e6da-5220-80bd-a766c0a94513"
        ]
      },
      {
        "id": "robot-programming",
        "grade": 6,
        "label": "Programación de control robótico",
        "match": "programacion de control robotico|programacion de robots|programa[^.;]*robot|python o scratch",
        "relation": "la correspondencia entre entradas, secuencia de control y respuesta del robot simulado y los casos de prueba dados, sin imponer un lenguaje alternativo o robot físico",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "e18c2a22-8270-533b-8633-b06c829fbab1",
          "b644e70d-85dd-56ae-baf6-82616c875b9c",
          "9eab4200-3755-57ba-900e-a0715d5739d9"
        ]
      },
      {
        "id": "robot-types",
        "grade": 6,
        "label": "Tipos y clasificación de robots",
        "match": "tipos de robots|clasificacion de robots",
        "relation": "la correspondencia entre características, clasificación y aplicación del robot de la ficha proporcionada",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "cf6a849f-ff49-5f98-8fc7-c35fbc6585c1",
          "8fa793fb-2857-51a9-b838-a7278fcded1f"
        ]
      },
      {
        "id": "robot-vision",
        "grade": 6,
        "label": "Señales y visión artificial robótica",
        "match": "vision artificial robotica|vision artificial[^.;]*robot|robot[^.;]*vision artificial",
        "relation": "la relación entre imagen o señal, procesamiento y decisión del robot representado, distinguiendo los límites del modelo de suponer reconocimiento infalible",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "d51cf294-015e-558d-a8b0-0e42304ef888"
        ]
      },
      {
        "id": "robot-ai",
        "grade": 6,
        "label": "IA y aprendizaje automático robótico",
        "match": "aprendizaje automatico robotico|inteligencia artificial[^.;]*robot|robot[^.;]*aprendizaje automatico",
        "relation": "la relación entre entradas, aprendizaje o reglas y respuestas del modelo robótico proporcionado, sin exigir entrenar otro modelo ni usar servicios de pago",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "086e1364-76d8-57f2-bcf3-557930bd46eb"
        ]
      },
      {
        "id": "robot-ethics",
        "grade": 6,
        "label": "Seguridad, privacidad y ética robótica",
        "match": "etica robotica|privacidad[^.;]*robot|responsabilidad[^.;]*robot|seguridad[^.;]*robot",
        "relation": "las decisiones justificadas sobre privacidad, seguridad y responsabilidad del caso robótico ficticio y sus evidencias, sin captar datos personales",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "efcfff6d-4613-58e1-91c0-083cf2fa6b67"
        ]
      },
      {
        "id": "robot-design",
        "grade": 6,
        "label": "Diseño, componentes y piezas robóticas",
        "match": "diseno[^.;]*robot|piezas roboticas|pieza robotica|piezas para robots|componentes[^.;]*robot",
        "relation": "la correspondencia entre tarea, dimensiones, componentes o piezas expresamente solicitados y el plano robótico dado, sin fabricación o maquinaria obligatoria",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "7f2c2218-cc71-541b-b181-3f7ee430fa56",
          "81caea96-176c-5add-93a4-8d14b536bbfa",
          "ba264a18-34d9-5d74-9864-1b0ca46ba94e"
        ]
      },
      {
        "id": "robot-collaboration",
        "grade": 6,
        "label": "Robótica colaborativa, servicio y aportaciones",
        "match": "robotica colaborativa|robot colaborativo|robotico colaborativo|robotica de servicio|robot de servicio",
        "relation": "la coordinación de funciones del sistema robótico colaborativo o de servicio descrito y las aportaciones documentadas cuando se soliciten, sin calificar personalidad",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "04d63916-f8a1-5bb8-a045-b80b878e83cc",
          "28a2488d-4642-5db7-8738-1f1c306cff21"
        ]
      },
      {
        "id": "robot-diagnosis",
        "grade": 6,
        "label": "Diagnóstico y mantenimiento robótico",
        "match": "diagnostico[^.;]*robot|mantenimiento[^.;]*robot|fallo[^.;]*robot\\w*",
        "relation": "la identificación de la causa del fallo robótico y la comprobación de la corrección mediante los registros y casos proporcionados",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "efc764cf-a69f-5ea0-ad60-45f2b873bb4c"
        ]
      },
      {
        "id": "robot-simulation",
        "grade": 6,
        "label": "Simulación de robots",
        "match": "simulacion de robots|robot simulado|robotico simulado",
        "relation": "la correspondencia entre parámetros, movimiento y resultados del robot en el simulador dado, distinguiendo simulación de comportamiento físico real",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "e8f17ad1-bf35-5c90-b97d-c7a11986f906"
        ]
      },
      {
        "id": "robot-validation",
        "grade": 6,
        "label": "Pruebas de sistemas robóticos",
        "match": "pruebas de sistemas roboticos|validacion[^.;]*robot",
        "relation": "la correspondencia entre requisitos, entradas de prueba y respuestas del sistema robótico proporcionado, sin atribuir pruebas reales no realizadas",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "6258c03a-ae4c-59f4-9fb0-5c796e9fa5d2"
        ]
      },
      {
        "id": "engineering-problem",
        "grade": 6,
        "label": "Estrategias de solución de problemas de ingeniería",
        "match": "problemas de ingenieria|estrategias para solucionar problemas",
        "relation": "la relación entre problema, restricciones, solución y comprobación expresamente solicitados según el caso de ingeniería proporcionado",
        "pages": [
          512,
          513
        ],
        "sourceRecordIds": [
          "3b62f062-233f-5b6b-9331-2581d6f1a318",
          "9adea446-e316-5405-8e86-d72edf900f08"
        ]
      },
      {
        "id": "numerical-spreadsheet",
        "grade": 6,
        "label": "Hojas de cálculo para métodos numéricos",
        "match": "hojas de calculo|hoja de calculo",
        "relation": "la correspondencia entre celdas, fórmulas, referencias y resultados del cálculo solicitado en la hoja proporcionada, sin exigir un servicio o software de pago",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "266b97e8-c75e-5302-b9fb-c0b0c60e97d6"
        ]
      },
      {
        "id": "numerical-function",
        "grade": 6,
        "label": "Funciones, gráficas y características",
        "match": "funciones y graficas|graficas de funciones|asintotas|raices|intercepcion",
        "relation": "la correspondencia entre expresión, dominio, gráfica y característica de la función expresamente solicitada según las referencias dadas",
        "pages": [
          512
        ],
        "sourceRecordIds": [
          "2632c1cb-5e65-57f9-8d21-16f4b4d1c165",
          "bda5f2ac-6750-59d8-8f4f-3ce3ba525bf7"
        ]
      },
      {
        "id": "numerical-limit",
        "grade": 6,
        "label": "Límite y cálculo numérico",
        "match": "limite de una funcion|calculo numerico del limite|limite y calculo numerico",
        "relation": "la aproximación del valor de la función al punto solicitado a partir de la tabla o expresión dada, distinguiendo límite de valor puntual",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "0cc90f79-817a-5f0b-af2a-fac57c46daa4"
        ]
      },
      {
        "id": "numerical-derivative",
        "grade": 6,
        "label": "Derivada e interpretación geométrica",
        "match": "derivada e (?:interpretacion|lectura)|(?:interpretacion|lectura) geometrica de la derivada|concepto de derivada",
        "relation": "la relación entre razón de cambio, pendiente local y función dadas para la derivada solicitada, sin confundirla con un valor medio no pedido",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "9e118f60-10da-50db-8562-bd5576783f91"
        ]
      },
      {
        "id": "numerical-difference",
        "grade": 6,
        "label": "Diferencias hacia adelante, atrás y centrales",
        "match": "diferencias (?:hacia |adelante|centrales)|derivacion hacia|derivacion numerica",
        "relation": "la correspondencia entre puntos, paso y aproximación de la derivada mediante el método de diferencias solicitado, distinguiendo adelante, atrás y centrado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "fb5bc8de-56bc-547a-9a8b-f40e62b1cf46"
        ]
      },
      {
        "id": "numerical-second-derivative",
        "grade": 6,
        "label": "Segundas derivadas numéricas",
        "match": "segundas? derivadas?|segunda derivada",
        "relation": "la correspondencia entre valores, paso y aproximación de la segunda derivada solicitada, distinguiéndola de la primera derivada",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "d7c2d078-b5b1-5676-bc03-1ca5832b5e08"
        ]
      },
      {
        "id": "numerical-integration",
        "grade": 6,
        "label": "Integración numérica e interpretación geométrica",
        "match": "integracion numerica|trapecios?|simpson",
        "relation": "la correspondencia entre intervalo, paso, valores y aproximación de la integral mediante el método solicitado, distinguiendo trapecios de Simpson y sus condiciones dadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "a2f5dcb1-f53b-53c9-b893-4f2a56f0a567",
          "d8c07420-6078-5681-a06f-c4001f0d9795"
        ]
      },
      {
        "id": "computational-physics",
        "grade": 6,
        "label": "Física computacional, clásica y moderna",
        "match": "fisica computacional|fisica clasica y moderna",
        "relation": "la relación entre representación física, cálculo y evidencia del modelo computacional solicitado y sus supuestos según las fichas dadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "4b727ca9-dcd1-5f35-a5bf-d9645ec564db",
          "bbf7fc80-1efc-5714-aa8b-915a9eee4afa"
        ]
      },
      {
        "id": "physical-model",
        "grade": 6,
        "label": "Modelado y simulación de sistemas físicos",
        "match": "sistemas fisicos|simulacion fisica|modelado fisico|modelado y simulacion",
        "relation": "la correspondencia entre variables, parámetros, relaciones físicas y salidas de la representación solicitada, sin equiparar simulación con validación experimental",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "b7f6dee2-3343-5218-a75b-7eabbf27a211",
          "cc89b56e-c29f-5bd9-a3e2-dca2565769c7",
          "f0420a4a-bfbf-5e8b-a705-a9d588864a6c"
        ]
      },
      {
        "id": "physical-visualization",
        "grade": 6,
        "label": "Gráficas, animación y visualización física",
        "match": "visualizacion fisica|graficas, animacion|visualizacion y animacion de datos|visualizaciones",
        "relation": "la correspondencia entre datos físicos, variables representadas, ejes, unidades y resultado de la visualización expresamente solicitada",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "650ca724-f331-5adf-a358-00ff277e4626",
          "f075a898-b5a0-571b-bbab-abf192b94e9b"
        ]
      },
      {
        "id": "position-graph",
        "grade": 6,
        "label": "Posición, tiempo y funciones paramétricas",
        "match": "posicion[^.;]*tiempo|grafico de posicion|grafica posicion|funciones parametricas",
        "relation": "la relación entre posición, tiempo y sistema de referencia en la tabla, gráfica o función paramétrica dadas para el movimiento solicitado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "edc58206-3d3f-5c5f-919e-5233171612cc",
          "c7f2f063-d364-5bfd-b773-197b168d3b50",
          "cd23e4d0-e0a5-5a7f-b182-3a65d0b13bdb",
          "8ea007af-856f-5fa4-9b9e-898341d41f09"
        ]
      },
      {
        "id": "velocity-acceleration",
        "grade": 6,
        "label": "Velocidad y aceleración",
        "match": "velocidad y aceleracion|calculo de la velocidad",
        "relation": "la correspondencia entre variación de posición o velocidad, intervalo temporal y unidades de la velocidad o aceleración expresamente solicitadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "b4a42c24-4122-545c-919f-3c30472f2bc1"
        ]
      },
      {
        "id": "uniform-motion",
        "grade": 6,
        "label": "Movimiento con velocidad constante",
        "match": "velocidad constante|movimiento uniforme",
        "relation": "la relación entre posición, tiempo y velocidad constante del movimiento representado bajo las condiciones dadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "c1a29652-3355-546b-8b44-67002c088986"
        ]
      },
      {
        "id": "constant-acceleration",
        "grade": 6,
        "label": "Movimiento con aceleración constante",
        "match": "aceleracion constante",
        "relation": "la relación entre posición, velocidad, tiempo y aceleración constante del modelo de movimiento dado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "bac46bd2-ecac-5ac4-9011-8037c5f9f065"
        ]
      },
      {
        "id": "free-fall",
        "grade": 6,
        "label": "Caída libre mediante modelos",
        "match": "caida libre",
        "relation": "la relación entre gravedad, posición, velocidad y tiempo en el modelo de caída dado y sus supuestos, sin experimentos de altura",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "2b6545e9-d1f2-59da-9555-692983449a4f"
        ]
      },
      {
        "id": "air-drag",
        "grade": 6,
        "label": "Movimiento con resistencia del aire",
        "match": "resistencia del aire|fuerzas de arrastre|arrastre con el aire",
        "relation": "la relación entre velocidad, fuerza de arrastre y movimiento del modelo proporcionado, sin imponer un régimen o coeficiente no dado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "d5c59799-1626-5c0c-9e26-c3e8067785b5",
          "f1f310a5-799e-55bc-a61a-57d4afe05bf4"
        ]
      },
      {
        "id": "projectile-motion",
        "grade": 6,
        "label": "Movimiento parabólico",
        "match": "movimiento parabolico|tiro parabolico",
        "relation": "la relación entre componentes horizontal y vertical del movimiento, tiempo y condiciones iniciales del modelo proporcionado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "b04eb75f-7bc5-53fd-9c94-cfda27f6d3a9"
        ]
      },
      {
        "id": "oscillatory-motion",
        "grade": 6,
        "label": "Movimiento oscilatorio",
        "match": "movimiento oscilatorio|oscilaciones",
        "relation": "la relación entre posición, amplitud, periodo o fuerza restauradora expresamente solicitados en el modelo oscilatorio dado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "f9018efc-e6d5-5434-bcb1-5eee181cce0c",
          "446f9772-6cc0-55a0-b8da-c3bd354c0ac5"
        ]
      },
      {
        "id": "circular-motion",
        "grade": 6,
        "label": "Movimiento circular",
        "match": "movimiento circular",
        "relation": "la relación entre trayectoria, velocidad y aceleración dirigidas en el movimiento circular según las condiciones dadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "55ff3b95-a22c-56df-ac76-3b861569fe38"
        ]
      },
      {
        "id": "planet-motion",
        "grade": 6,
        "label": "Gravitación y movimiento de planetas",
        "match": "gravitacion|movimiento de planetas|movimiento planetario|modelo gravitatorio",
        "relation": "la relación entre masa, distancia, fuerza gravitatoria y movimiento orbital expresamente pedidos en el modelo planetario proporcionado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "e9cf874f-2d19-5572-9bea-baf58adf3baf",
          "446f9772-6cc0-55a0-b8da-c3bd354c0ac5"
        ]
      },
      {
        "id": "physics-trends",
        "grade": 6,
        "label": "Tendencias e impacto de física computacional",
        "match": "tendencias[^.;]*fisica|impacto de fisica computacional",
        "relation": "las aplicaciones, evidencias y límites documentados de la tendencia física solicitada y sus impactos según las fuentes dadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "f0b4dbd7-55ac-57cc-ac43-ef8d9adec92f"
        ]
      },
      {
        "id": "newton-optional",
        "grade": 6,
        "label": "Leyes de Newton cuando se solicitan",
        "match": "leyes de newton",
        "relation": "la relación entre fuerzas, masa y cambio de movimiento expresamente solicitados bajo las condiciones dadas, sin imponer leyes opcionales a otras tareas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "eb4b845f-6aa7-5b2c-8166-b4c318adcb6e"
        ]
      },
      {
        "id": "linear-momentum",
        "grade": 6,
        "label": "Momento lineal",
        "match": "momento lineal",
        "relation": "la relación entre masa, velocidad y momento lineal del sistema solicitado según las condiciones dadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "c1888b53-e255-53ea-8a16-67134bf81752"
        ]
      },
      {
        "id": "angular-momentum",
        "grade": 6,
        "label": "Momento angular",
        "match": "momento angular",
        "relation": "la relación entre posición, movimiento y momento angular del sistema solicitado respecto de la referencia dada",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "0e2be728-2a4f-5a7e-98d8-866c3d8b0b08"
        ]
      },
      {
        "id": "momentum-conservation",
        "grade": 6,
        "label": "Conservación de momentos",
        "match": "conservacion de (?:los )?momentos|conservacion[^.;]*momento",
        "relation": "la comparación del momento solicitado antes y después y las condiciones de conservación del sistema dado, sin imponer otro momento o energía no pedidos",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "96fe559b-5644-5489-a610-a126310a0208",
          "88ebc3dd-07f2-5644-ae5c-3edf0e85eb70"
        ]
      },
      {
        "id": "collision-model",
        "grade": 6,
        "label": "Colisiones",
        "match": "colisiones|choques",
        "relation": "la relación entre estados iniciales y finales, interacción y magnitudes expresamente solicitadas en el modelo de colisión proporcionado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "9aeb42c2-8f67-54d2-974f-53b4d3056867"
        ]
      },
      {
        "id": "energy-conservation",
        "grade": 6,
        "label": "Energía y su conservación",
        "match": "energia y su conservacion|conservacion de (?:la )?energia|energia mecanica",
        "relation": "la relación entre formas, transferencias y balance de energía del sistema solicitado según las condiciones dadas, distinguiendo conservación de ausencia de transformación",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "bd661237-9ee1-5574-a594-9f19f889b04b",
          "0f965195-cd95-5c79-a86b-1d7b7bc38d83",
          "88ebc3dd-07f2-5644-ae5c-3edf0e85eb70"
        ]
      },
      {
        "id": "physical-algorithm",
        "grade": 6,
        "label": "Algoritmos numéricos para problemas físicos",
        "match": "algoritmos? numericos?|algoritmos?[^.;]*fisic",
        "relation": "la correspondencia entre datos de entrada, pasos del método numérico solicitado y resultados físicos comprobables con los casos dados, sin imponer un algoritmo previo si se pide diseñarlo",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "eb37dc55-b502-57b2-b283-818cca4346d1",
          "0f00c0a0-919c-58d1-adb4-e588584bb97c"
        ]
      },
      {
        "id": "symbolic-optimization",
        "grade": 6,
        "label": "Cálculo simbólico y optimización",
        "match": "calculo simbolico|optimizacion numerica",
        "relation": "la correspondencia entre expresión o función objetivo, restricciones y resultado del cálculo simbólico u optimización solicitados según las referencias dadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "8288b273-1457-58fb-81b1-e340e21348bf"
        ]
      },
      {
        "id": "physical-data-analysis",
        "grade": 6,
        "label": "Análisis estadístico, datos y teoría física",
        "match": "analisis estadistico|datos experimentales|analisis de datos[^.;]*fisic",
        "relation": "la relación entre datos físicos proporcionados, tratamiento estadístico solicitado, incertidumbre y referencia teórica, sin atribuir mediciones nuevas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "229dbbed-94ff-5c8e-9a27-d9f942cccc40",
          "a2086c04-0ae5-5b7d-8dd4-842b56ccfe11",
          "3ca7bc76-0fbb-5120-a937-0ca69073583f"
        ]
      },
      {
        "id": "physical-oop",
        "grade": 6,
        "label": "Objetos y estructuras de datos en física",
        "match": "objetos y estructuras de datos en fisica|orientada a objetos[^.;]*fisic",
        "relation": "la correspondencia entre objetos, estados, operaciones y estructura de datos solicitados para el modelo físico dado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "dfc798e4-e7a4-5a81-b5f9-fc0fe30b42b1"
        ]
      },
      {
        "id": "physical-report",
        "grade": 6,
        "label": "Informes científicos digitales",
        "match": "informes? cientificos?|informe[^.;]*fisic",
        "relation": "la relación entre propósito, procedimiento documentado, resultados y límites del expediente físico dado en el informe solicitado, distinguiendo información proporcionada de actuaciones propias",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "de139f99-1378-5337-a764-0e2b6744a0df"
        ]
      },
      {
        "id": "physical-model-validation",
        "grade": 6,
        "label": "Validación de modelos y algoritmos físicos",
        "match": "validacion de modelos|validacion[^.;]*algoritmos|pruebas[^.;]*simulacion",
        "relation": "la comparación entre resultados del modelo o algoritmo físico solicitado y los datos de referencia dados, explicando diferencias y límites sin inventar umbrales",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "55625fbd-edd2-5e87-96c2-6c74c84ed443"
        ]
      },
      {
        "id": "physical-project",
        "grade": 6,
        "label": "Proyecto de física computacional",
        "match": "proyecto de fisica computacional|proyecto[^.;]*fisica computacional",
        "relation": "la coherencia entre problema, modelo, procedimiento y resultados del proyecto físico expresamente solicitado, sin exigir otro proyecto cuando el expediente ya está dado",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "16da026f-e2c8-5aed-bc16-51bbe5363334"
        ]
      },
      {
        "id": "physical-ethics",
        "grade": 6,
        "label": "Ética y responsabilidad en casos físicos",
        "match": "etica[^.;]*fisica|responsabilidad[^.;]*fisica",
        "relation": "las decisiones justificadas sobre atribución, límites y consecuencias del uso del modelo físico del caso dado, sin calificar convicciones privadas",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "fd3f4d78-4c5e-5b27-aafc-ff532e83df3b"
        ]
      },
      {
        "id": "physical-applications",
        "grade": 6,
        "label": "Aplicaciones físicas en salud, ambiente y astronomía",
        "match": "aplicaciones fisicas|fisica[^.;]*(?:salud|ambiental|astronomica|astronomia)",
        "relation": "la relación entre modelo computacional, evidencia y aplicación física expresamente solicitada en el caso ficticio, sin diagnóstico sanitario o intervención ambiental reales",
        "pages": [
          513
        ],
        "sourceRecordIds": [
          "ea2f2198-b67c-57e7-86a6-bd4428ada194"
        ]
      },
      {
        "id": "programming-basics",
        "grade": 6,
        "label": "Programación, variables y tipos de datos",
        "match": "programacion basica|programacion, variables y tipos|introduccion a la programacion|programa[^.;]*python|algoritmos simples",
        "relation": "la correspondencia entre entradas, variables, operaciones y salidas del programa solicitado y los casos dados, sin imponer un algoritmo previo o un lenguaje alternativo",
        "pages": [
          513,
          514
        ],
        "sourceRecordIds": [
          "972561fd-9147-5714-b937-ded4d9aa3a9c",
          "a5b84b03-1a31-5130-9b90-5c11ff7dcba6",
          "b3a421f0-eac9-5166-aeef-8d0715477e71",
          "551c7e17-e938-548a-919b-66d41c7a4d29"
        ]
      },
      {
        "id": "functions-objects",
        "grade": 6,
        "label": "Funciones, clases y programación orientada a objetos",
        "match": "funciones, clases|orientada a objetos|funciones y clases|modularizar",
        "relation": "la correspondencia entre parámetros, retorno, estado o responsabilidades de las funciones y clases expresamente solicitadas, sin exigir orientación a objetos si solo se pide una función",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "c7c8d123-f504-55f4-be6f-7cf9bec778b6",
          "a4f0cf88-9bf2-507e-b5ee-5197a7c2fe93"
        ]
      },
      {
        "id": "algorithms-data-structures",
        "grade": 6,
        "label": "Algoritmos y estructuras de datos",
        "match": "algoritmos y estructuras|estructuras de datos|estructuras y algoritmos",
        "relation": "la relación entre representación de datos, operaciones del algoritmo y restricciones de tiempo o memoria proporcionadas para el problema solicitado",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "41e0acd1-fe21-5c4b-8a00-1611c360cc66",
          "01771b41-2e60-5cad-a3de-2907cf495ef0"
        ]
      },
      {
        "id": "graphical-interface",
        "grade": 6,
        "label": "Interfaces gráficas según usuarios y tarea",
        "match": "interfaces? graficas?|interfaz de usuario|interfaz[^.;]*aplicacion",
        "relation": "la correspondencia entre tareas de los usuarios, etiquetas, controles y navegación solicitados y los requisitos de uso dados, sin imponer preferencias decorativas",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "64bf5773-9490-55ab-bf0d-21b4c7b740bd",
          "af546947-f7d2-5c9a-bdf3-00c4217e3829"
        ]
      },
      {
        "id": "programming-security",
        "grade": 6,
        "label": "Seguridad y ética de código propio o entorno ficticio",
        "match": "seguridad[^.;]*(?:programacion|codigo|aplicacion)|vulnerabilidad",
        "relation": "la relación entre entrada o operación vulnerable, riesgo documentado y corrección comprobable con los casos dados en código propio o ficticio, sin pruebas sobre sistemas ajenos",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "fc62278c-cf4b-5f01-9789-8150af4478fc"
        ]
      },
      {
        "id": "control-structures",
        "grade": 6,
        "label": "Selección y bucles de programación",
        "match": "seleccion y bucles|estructuras de control|bucles",
        "relation": "la correspondencia entre condición, ramas o repetición solicitados y las salidas del programa según los casos proporcionados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "b4585d2c-1332-53ee-b1fb-a1da02cff7a8"
        ]
      },
      {
        "id": "html-structure",
        "grade": 6,
        "label": "HTML, etiquetas y contenido textual",
        "match": "html|etiquetas basicas|contenido textual",
        "relation": "la estructura y semántica de las etiquetas o contenido HTML expresamente solicitados según los requisitos dados, sin atribuir a HTML comportamientos programados de JavaScript",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "57e326fb-fb08-51f7-97f5-228170b26ee3",
          "47c09c42-4150-5b6f-beb0-746255abf90f",
          "39a9f9f5-1a64-5edf-933e-a1e8238bfd91"
        ]
      },
      {
        "id": "html-rich-content",
        "grade": 6,
        "label": "Encabezados, listas, enlaces e imágenes",
        "match": "encabezados|listas, enlaces|enlaces e imagenes",
        "relation": "la correspondencia entre encabezado, lista, enlace o imagen solicitados y la organización del contenido proporcionado, sin exigir recursos no pedidos",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "45279e7d-d754-5f41-86ae-1fbc14b01a81"
        ]
      },
      {
        "id": "html-multimedia",
        "grade": 6,
        "label": "Tablas y multimedia",
        "match": "tablas y multimedia|contenido multimedia|tablas y elementos",
        "relation": "la correspondencia entre datos tabulares o recurso multimedia solicitados, estructura y uso del contenido dado",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "83ef7ffa-ab08-5e85-b06e-7ac7dfc2c712",
          "14702a2d-409b-5c59-b03b-c8af4de3b3e3"
        ]
      },
      {
        "id": "html-forms",
        "grade": 6,
        "label": "Formularios y controles",
        "match": "formularios?|controles html",
        "relation": "la correspondencia entre campos, etiquetas, controles y entradas del formulario solicitado con datos ficticios, sin recopilar información personal",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "b6d59aef-a96b-5f2e-bc05-a5a207e6b655"
        ]
      },
      {
        "id": "html-compatibility",
        "grade": 6,
        "label": "Validación y compatibilidad HTML",
        "match": "validacion y compatibilidad|compatibilidad html|validacion html",
        "relation": "la correspondencia entre marcado, validación y comportamiento documentado en los entornos dados, sin afirmar compatibilidad universal no comprobada",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "0584b379-d3e5-53c3-afbf-a5846dee08f1"
        ]
      },
      {
        "id": "web-dom",
        "grade": 6,
        "label": "Modelo de Objetos del Documento (DOM)",
        "match": "modelo de objetos del documento|dom",
        "relation": "la relación entre nodos del documento, selección o modificación expresamente solicitadas y el resultado de la página según el ejemplo dado",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "dbdf9773-e5c9-5364-9528-e3b0d2543d92"
        ]
      },
      {
        "id": "javascript-syntax",
        "grade": 6,
        "label": "Sintaxis JavaScript",
        "match": "sintaxis javascript|sintaxis basica",
        "relation": "la correspondencia entre la sintaxis JavaScript solicitada y su significado o ejecución según los casos dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "4092fb80-e688-5350-88db-9b477bd8011c"
        ]
      },
      {
        "id": "javascript-values",
        "grade": 6,
        "label": "Variables, referencias y valores primitivos",
        "match": "valores primitivos|tipos primitivos|valores por referencias|variables, referencias",
        "relation": "la distinción entre valores primitivos y objetos o referencias en los ejemplos JavaScript dados, sin afirmar que todo primitivo es un objeto",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "6a29e2ac-3727-5960-ab01-1d8e2a4c8a5e",
          "ec7b5e79-c926-562d-ba5c-dfe4bfd7c00c"
        ]
      },
      {
        "id": "javascript-types",
        "grade": 6,
        "label": "Valores lógicos, fechas, objetos y arreglos",
        "match": "valores logicos|fechas, objetos|objetos y arreglos|tipos de datos logicos",
        "relation": "la correspondencia entre tipo de valor, operación y resultado JavaScript expresamente solicitados en los ejemplos dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "2209db86-4ed2-5ef7-ad5c-757b9ba4e955"
        ]
      },
      {
        "id": "javascript-operators",
        "grade": 6,
        "label": "Operadores JavaScript",
        "match": "operadores javascript|operadores",
        "relation": "la correspondencia entre operandos, operador y resultado JavaScript solicitado según los valores y tipos proporcionados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "8a2f5fb1-b6df-56c4-87fb-d811e7c66a73"
        ]
      },
      {
        "id": "javascript-control",
        "grade": 6,
        "label": "Selección y bucles JavaScript",
        "match": "seleccion y bucles javascript|if|while|dowhile|for.in",
        "relation": "la condición, rama o repetición JavaScript expresamente solicitadas y su efecto en las salidas de los casos dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "219160f2-d003-5dbd-81c0-2b1519daf5cc"
        ]
      },
      {
        "id": "javascript-json-functions",
        "grade": 6,
        "label": "JSON y funciones JavaScript",
        "match": "json|funciones javascript",
        "relation": "la representación JSON o la función JavaScript expresamente solicitadas y su correspondencia con los datos, parámetros o retorno del caso dado, sin confundir JSON con código ejecutable",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "f2505680-8d95-5cd4-a9b0-079b09c5a800"
        ]
      },
      {
        "id": "web-bom",
        "grade": 6,
        "label": "Browser Object Model (BOM)",
        "match": "browser object model|bom",
        "relation": "la función de los objetos del navegador expresamente solicitados en el ejemplo dado, distinguiéndolos de los nodos del documento DOM",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "4793e514-7002-50f2-830c-5000ce87d28a"
        ]
      },
      {
        "id": "css-style",
        "grade": 6,
        "label": "Estilos y hojas CSS",
        "match": "css|hojas de estilos|estilos y hojas",
        "relation": "la correspondencia entre reglas de estilo, elementos y presentación o estados CSS solicitados según el ejemplo dado, sin atribuir estructura HTML o lógica JavaScript no pedidas",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "de7c3e15-2669-5f39-bbbf-607e3a4c896a",
          "f38a3924-cd51-5d29-b9fb-a32be758aca7",
          "93c69e3d-627a-577a-b01f-94df54897f41"
        ]
      },
      {
        "id": "css-selectors",
        "grade": 6,
        "label": "Selectores CSS",
        "match": "selectores css|selectores",
        "relation": "la correspondencia entre selector CSS, elementos alcanzados y regla solicitada según el documento dado",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "1c67b780-81f7-5cc3-8a0b-491fe443867f"
        ]
      },
      {
        "id": "css-properties",
        "grade": 6,
        "label": "Propiedades CSS",
        "match": "propiedades css|propiedades de los estilos",
        "relation": "la correspondencia entre propiedad, valor y efecto de estilo CSS expresamente solicitados según el ejemplo dado",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "91aa2f4b-814a-5333-bcbb-660caa2de193"
        ]
      },
      {
        "id": "css-cascade",
        "grade": 6,
        "label": "Orden de cascada CSS",
        "match": "cascada css|orden de cascada|prioridad de cascada",
        "relation": "la relación entre origen, importancia, especificidad u orden de las reglas CSS dadas que determina el estilo solicitado, sin reducir la cascada solo al orden final",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "a7afdd16-6aae-59fc-a6e9-070f35546a15"
        ]
      },
      {
        "id": "css-text",
        "grade": 6,
        "label": "Formato textual CSS",
        "match": "formato textual css|formato de texto",
        "relation": "la correspondencia entre propiedad tipográfica CSS y legibilidad o presentación textual solicitada según los requisitos dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "7b50cd1c-d4dd-519e-a343-4b092c51421e"
        ]
      },
      {
        "id": "css-box",
        "grade": 6,
        "label": "Modelo de caja CSS",
        "match": "modelo de caja",
        "relation": "la relación entre contenido, relleno, borde, margen y tamaño de la caja CSS según los valores y condiciones dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "e331e2c7-d897-5435-8c2c-f69f7d68f9e7"
        ]
      },
      {
        "id": "css-background",
        "grade": 6,
        "label": "Imágenes de fondo CSS",
        "match": "imagenes de fondo|imagenes de fondos",
        "relation": "la correspondencia entre imagen, repetición, posición o tamaño de fondo CSS expresamente solicitados y el resultado del ejemplo dado",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "842f90a4-92b9-5556-9d50-67b80c3617b2"
        ]
      },
      {
        "id": "mobile-frameworks",
        "grade": 6,
        "label": "Recursos para aplicaciones móviles",
        "match": "frameworks[^.;]*movil|recursos para aplicaciones moviles",
        "relation": "la adecuación de las funciones y restricciones del recurso móvil proporcionado a la tarea solicitada, sin imponer instalación, compra o un framework no pedido",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "46af9b36-ef1e-531d-8cee-352d02516898"
        ]
      },
      {
        "id": "mobile-specifics",
        "grade": 6,
        "label": "Particularidades móviles",
        "match": "particularidades moviles|particularidades[^.;]*movil|ios|android|prototipo movil",
        "relation": "la correspondencia entre interacción, pantalla, entradas y restricciones de la aplicación móvil solicitada en los entornos descritos, sin exigir dispositivos reales",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "e77c69b0-30df-534a-b79d-d54e7210ca4b"
        ]
      },
      {
        "id": "application-market-model",
        "grade": 6,
        "label": "Comercialización y distribución de aplicaciones simuladas",
        "match": "comercializacion[^.;]*aplicacion|distribucion[^.;]*aplicacion|tienda digital|comercializada",
        "relation": "la coherencia entre usuarios, propuesta, restricciones y distribución o comercialización solicitadas en el caso ficticio, sin publicar, vender ni crear cuentas reales",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "c22c0348-8dc5-5699-9061-ab686cb36b92",
          "cb75f2fb-cd08-572b-ae3d-9a5c2b911e68",
          "3d451b1c-08ca-599d-990f-1e077127099f",
          "36b6d29c-ca63-5a32-a8fc-ccf026412ff8"
        ]
      },
      {
        "id": "javascript-dynamic-page",
        "grade": 6,
        "label": "Comportamiento y datos con JavaScript",
        "match": "comportamiento y datos con javascript|pagina[^.;]*javascript|paginas[^.;]*javascript",
        "relation": "la correspondencia entre evento, operación sobre los datos o documento y respuesta de la página JavaScript solicitada según los casos dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "2fca2e19-83fc-56ee-8ef9-fa20c934d8d6"
        ]
      },
      {
        "id": "educational-web-application",
        "grade": 6,
        "label": "Aplicación educativa o lúdica",
        "match": "aplicacion educativa|aplicacion web educativa|aplicacion ludica|biblioteca",
        "relation": "la correspondencia entre propósito educativo o lúdico, tareas, entradas y salidas de la aplicación ficticia solicitada y los requisitos dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "d44e13f4-6cd4-5304-87a7-3859eb44c47c"
        ]
      },
      {
        "id": "automation-web-application",
        "grade": 6,
        "label": "Aplicación para automatizar tarea",
        "match": "automatizar|automatizacion de tarea",
        "relation": "la correspondencia entre pasos de la tarea, entradas, reglas y salidas de la automatización solicitada según los casos ficticios dados",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "3ce990e9-250f-5240-b8d2-103ce1bd5ecb"
        ]
      },
      {
        "id": "application-database",
        "grade": 6,
        "label": "Almacenamiento y acceso a base de datos ficticios",
        "match": "base de datos|bases de datos|almacenamiento y acceso",
        "relation": "la correspondencia entre información ficticia, estructura, operación de almacenamiento o acceso y resultado solicitado, sin conectar bases o credenciales reales",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "0e3f69f8-2bd4-54eb-b13f-d2b929709dd3"
        ]
      },
      {
        "id": "game-animation",
        "grade": 6,
        "label": "Juegos y animaciones según recurso de acceso",
        "match": "juegos y animaciones|unity|phaser",
        "relation": "la correspondencia entre estado, acciones, reglas y respuesta del juego o animación solicitados en el recurso dado, sin imponer herramientas alternativas",
        "pages": [
          514
        ],
        "sourceRecordIds": [
          "c9e2aed2-f595-59de-9596-4cb744cd675a"
        ]
      },
      {
        "id": "machine-learning",
        "grade": 6,
        "label": "Aprendizaje automático y redes neuronales",
        "match": "aprendizaje automatico|redes neuronales|preprocesamiento|limpieza de datos",
        "relation": "la relación entre datos ficticios de entrenamiento o prueba, modelo, predicción y límites de evaluación expresamente solicitados, sin confundir ajuste con prueba independiente",
        "pages": [
          514,
          515
        ],
        "sourceRecordIds": [
          "2d67232d-40e1-53ff-9242-93661437904f",
          "989c5b01-1493-59b1-b7cc-ec3db9af340b",
          "f144bf73-974d-5f11-9b1b-17a9532ead55",
          "907d5c27-19c8-5f30-97f7-4a68a8158f11",
          "b6c57f85-835f-5de2-8192-2ad14e9c4876",
          "339d9c61-6754-5de8-8c14-9f315861e0d5",
          "4a1128c3-6ba5-5202-9499-a3a1a224f7e4"
        ]
      },
      {
        "id": "deep-learning",
        "grade": 6,
        "label": "Aprendizaje profundo",
        "match": "aprendizaje profundo|deep learning",
        "relation": "la relación entre capas, representaciones, entrenamiento o resultados expresamente solicitados del modelo profundo proporcionado y sus límites",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "80d1402f-a8c0-52fc-a078-9befc91dc0dc",
          "9eca22e4-f8c7-5534-ad84-59764f3c0458"
        ]
      },
      {
        "id": "computer-vision",
        "grade": 6,
        "label": "Visión artificial y procesamiento de imágenes",
        "match": "vision artificial|procesamiento de imagenes",
        "relation": "la relación entre imágenes ficticias, procesamiento, salida y evaluación del modelo visual solicitado según los ejemplos dados",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "9f854a76-4efa-5d14-8906-bd352f9c53d1",
          "d8f5096b-b06d-5641-8ca5-225989aa1b79"
        ]
      },
      {
        "id": "natural-language-processing",
        "grade": 6,
        "label": "Procesamiento de lenguaje natural",
        "match": "procesamiento del lenguaje natural|procesamiento de lenguaje natural|nltk|spacy",
        "relation": "la relación entre texto ficticio, representación, operación lingüística y salida solicitada según el modelo o recurso proporcionado, sin nuevas dependencias ni servicios",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "78f65211-e2d8-5251-a7f0-0d72a3067f72",
          "aab4ee25-205c-5f94-9704-bfc02e2b65c4"
        ]
      },
      {
        "id": "search-optimization",
        "grade": 6,
        "label": "Búsqueda y optimización",
        "match": "busqueda y optimizacion",
        "relation": "la correspondencia entre estados o soluciones candidatas, criterio de búsqueda u objetivo y resultado del algoritmo solicitado bajo las restricciones dadas",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "554b0268-4100-57bd-a771-7a8d1cba8ea7",
          "cc195949-90dc-5853-af3b-a3173e80d381"
        ]
      },
      {
        "id": "expert-fuzzy-systems",
        "grade": 6,
        "label": "Sistemas expertos y lógica difusa",
        "match": "sistemas expertos|logica difusa",
        "relation": "la correspondencia entre reglas, entradas y conclusión o grado de pertenencia solicitados en el sistema dado, distinguiendo lógica difusa de una probabilidad no definida",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "ce817d84-96d4-5e39-9425-a93b9b340884",
          "eb243def-44ed-5364-b5fc-7c1bce8d5944"
        ]
      },
      {
        "id": "ai-ethics",
        "grade": 6,
        "label": "Ética, responsabilidad y futuro de IA",
        "match": "etica[^.;]*inteligencia artificial|responsabilidad[^.;]*inteligencia artificial|futuro de ia",
        "relation": "las decisiones justificadas sobre datos, atribución, límites e impactos del caso de IA proporcionado, sin calificar convicciones privadas ni usar datos personales",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "439e92d3-2470-5a6a-a65c-c954f07f4095",
          "c00e2eff-843d-5f12-b386-9ad3ff046bf9",
          "c602a07f-b073-531c-8166-88ea7c16ed1e"
        ]
      },
      {
        "id": "prompt-introduction",
        "grade": 6,
        "label": "Ingeniería de prompts y aplicaciones",
        "match": "ingenieria de prompts y aplicaciones|introduccion a la ingenieria de prompts",
        "relation": "la relación entre propósito, instrucciones, contexto y respuesta del prompt documentado en las fichas dadas, sin invocar servicios de IA",
        "pages": [
          514,
          515
        ],
        "sourceRecordIds": [
          "401dd3ed-d987-50b5-8ba5-f214dc5a0d1b",
          "6f1c56bc-dc80-5346-b3c6-d0d89490f31a"
        ]
      },
      {
        "id": "prompt-design",
        "grade": 6,
        "label": "Diseño, instrucciones y mejora de prompts",
        "match": "diseno[^.;]*prompts?|mejora[^.;]*prompts?|instrucciones[^.;]*prompts?|prompts?[^.;]*control",
        "relation": "la correspondencia entre tarea, instrucciones, restricciones y formato de salida del prompt solicitado, comprobable con las respuestas ficticias dadas sin servicios de IA",
        "pages": [
          512,
          513,
          515
        ],
        "sourceRecordIds": [
          "4da53da4-2adb-578b-8d0e-5fc6ac67867c",
          "4f52cabd-696d-5a24-9dee-9967af408e87",
          "b59b30e9-88ac-57d9-acea-b4138acbe8b7",
          "d901e015-36ef-5724-a2e3-bb86b4ce9941",
          "c9ab6a1a-97a7-5fcb-b3f4-2d72e78e32fc",
          "42a79019-2893-56b1-96f9-82bea132b936",
          "a933b467-a6f5-5462-9a87-b4fd9cb3a3bd",
          "49f7f9ac-3474-5c55-a555-0d20e1af39e0",
          "2758a9b2-1b13-51d6-9617-2588e8fc8c92"
        ]
      },
      {
        "id": "prompt-analysis",
        "grade": 6,
        "label": "Análisis de prompts para imágenes o control",
        "match": "analisis de prompts|prompt[^.;]*(?:imagenes|robot)",
        "relation": "la relación entre instrucciones del prompt, respuesta ficticia proporcionada y requisitos de imagen o control solicitados, sin generar imágenes o controlar robots reales",
        "pages": [
          512,
          513
        ],
        "sourceRecordIds": [
          "bbd7aeb3-7230-509f-8609-c7c99f1707b4",
          "d217bfde-b6d4-5346-846b-5515f09ff888"
        ]
      },
      {
        "id": "prompt-validation",
        "grade": 6,
        "label": "Pruebas y validación de prompts",
        "match": "validacion de prompts|pruebas[^.;]*prompts?|pruebas de los prompts",
        "relation": "la correspondencia entre requisito, caso de prueba y respuesta ficticia del prompt proporcionado, justificando límites sin atribuir pruebas no realizadas",
        "pages": [
          514,
          515
        ],
        "sourceRecordIds": [
          "6bd74757-2375-56a3-8d28-e155c7c2b525",
          "48feb47a-d1f5-53a3-aec2-5acf735d9dd8"
        ]
      },
      {
        "id": "prompt-data",
        "grade": 6,
        "label": "Adquisición de datos y prompts",
        "match": "adquisicion de datos y prompts",
        "relation": "la relación entre dato ficticio, procedencia, instrucción y uso solicitado en el prompt dado, sin recolectar datos personales",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "ddfdb2aa-2fb0-570e-b99b-db6f27cd0aa8"
        ]
      },
      {
        "id": "prompt-selection",
        "grade": 6,
        "label": "Tipos y elección de prompts",
        "match": "tipos y eleccion de prompts|tipos de prompts|eleccion de prompts",
        "relation": "la correspondencia entre necesidad, tipo de prompt y restricciones de la tarea según las fichas y ejemplos dados",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "91c4209e-9f6c-564b-97bd-2477f0d1f8cd",
          "e5e94b85-990a-55b9-a733-cb493846d0fc"
        ]
      },
      {
        "id": "prompt-security",
        "grade": 6,
        "label": "Seguridad y ética de prompts",
        "match": "seguridad[^.;]*prompts?|etica[^.;]*prompts?",
        "relation": "los riesgos y decisiones verificables sobre privacidad, instrucciones y límites del prompt ficticio proporcionado, sin divulgar información personal ni invocar servicios",
        "pages": [
          515
        ],
        "sourceRecordIds": [
          "71476c4b-c538-502a-b487-17e3535ab9df"
        ]
      },
      {
        "id": "signal-modulation",
        "grade": 6,
        "label": "Modulación, codificación y filtrado de señales",
        "match": "modulacion|codificacion|filtrado de senales",
        "relation": "la transformación expresamente solicitada de amplitud, frecuencia, representación o componentes de la señal según las fichas dadas, distinguiendo modulación, codificación y filtrado",
        "pages": [
          516
        ],
        "sourceRecordIds": [
          "54234111-dd4d-596b-b954-f4a9cd385fc0"
        ]
      },
      {
        "id": "complex-physical-model",
        "grade": 6,
        "label": "Dinámica molecular y sistemas físicos complejos",
        "match": "dinamica molecular|sistema fisico complejo|sistemas fisicos complejos",
        "relation": "la relación entre interacciones, escalas, supuestos y resultados del modelo físico complejo solicitado según las fichas dadas, sin exigir otra simulación",
        "pages": [
          517
        ],
        "sourceRecordIds": [
          "b9264125-20ed-5aae-99f0-b2b722e9035d"
        ]
      }
    ]
  }
],
version:"evaluation-2026.141"} as unknown as EvaluationCatalog
