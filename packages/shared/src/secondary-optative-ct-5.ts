import type {OptativeScienceModule} from './secondary-optative-science'
/** Pedagogical adaptations; literal records and exclusions remain in source correspondences. */
export const optativeCtFive={
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
} satisfies OptativeScienceModule
