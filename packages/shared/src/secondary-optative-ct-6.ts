import type {OptativeScienceModule} from './secondary-optative-science'
/** Pedagogical adaptations; literal records and exclusions remain in source correspondences. */
export const optativeCtSix={
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
} satisfies OptativeScienceModule
