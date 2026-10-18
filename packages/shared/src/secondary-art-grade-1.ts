import type {ArtTopic} from './secondary-art'
/** Adaptaciones de AulaBase, MINERD2023 PDF330–331; no son rúbricas oficiales. */
export const artGradeOneTopics:ArtTopic[]=[
  {
    "id": "dimensions",
    "grade": 1,
    "label": "artes bidimensionales y tridimensionales",
    "match": "bidimensionales? y tridimensionales?|bidimensional(?:idad)?|dimensiones artisticas",
    "relation": "las diferencias entre superficie y volumen en los ejemplos artísticos dados, identificando la categoría y el lenguaje artístico por sus elementos observables",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "a02dd5a9-59b3-5963-bdc9-29459528aefc",
      "58dfdb4e-066d-58d7-8316-f80314582a50"
    ],
    "evidence": [
      {
        "id": "dimensional-choice",
        "title": "Superficie y volumen del producto",
        "success": "Organiza la superficie o el volumen en el producto solicitado de acuerdo con su categoría bidimensional o tridimensional y con las condiciones del ejercicio.",
        "partial": "El producto permite reconocer su categoría, pero una relación entre superficie y volumen queda sin resolver.",
        "error": "Confunde una imagen de volumen con una estructura que ocupa volumen cuando la consigna distingue esas categorías.",
        "sufficient": "El producto mantiene su categoría de superficie o volumen y las relaciones principales; una disposición secundaria queda sin precisar."
      }
    ]
  },
  {
    "id": "drawing",
    "grade": 1,
    "label": "dibujo con punto, línea y planos",
    "match": "dibuj[oas]|puntos? y lineas?|puntos?, lineas?|planos de color",
    "relation": "la función del punto, la línea, los planos y el volumen expresamente examinados en el dibujo dado, vinculando ejemplos y relaciones visuales sin imponer una apariencia realista",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "964fa3b7-6106-5456-b131-87f3c12091e0",
      "b024a412-d9ff-5268-b783-597639284fd4",
      "574cbb31-3937-5be1-8a0d-2bf5b79082c9"
    ],
    "evidence": [
      {
        "id": "visual-elements",
        "title": "Recursos del dibujo solicitados",
        "success": "Relaciona los puntos, líneas y planos expresamente pedidos en el dibujo con su organización visual, haciendo reconocibles sus funciones en la obra.",
        "partial": "Emplea los recursos pedidos, pero una relación visual queda desarticulada respecto de la organización elegida.",
        "error": "Los recursos no permiten reconocer las relaciones visuales solicitadas o falta uno expresamente pedido.",
        "sufficient": "Los recursos pedidos mantienen relaciones reconocibles en el dibujo; una decisión secundaria de organización queda poco clara."
      }
    ]
  },
  {
    "id": "three-dimensional",
    "grade": 1,
    "label": "figuras tridimensionales",
    "match": "figuras? tridimensionales?|figuras? en tres dimensiones|volumen y estabilidad",
    "relation": "las relaciones entre volumen, disposición y material de la figura tridimensional examinada, diferenciando sus partes y su ocupación del espacio",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "ad549a33-526e-59bf-bb17-1558dae907b2"
    ],
    "evidence": [
      {
        "id": "volume-structure",
        "title": "Volumen y estructura de la figura",
        "success": "Construye la figura con el material elegido entre las opciones disponibles, relacionando las partes y uniones para que el volumen previsto se mantenga en las condiciones dadas.",
        "partial": "La figura ocupa el volumen previsto, pero una unión o disposición de sus partes compromete su estabilidad.",
        "error": "Las partes no mantienen la estructura prevista o el producto no ocupa el volumen solicitado.",
        "sufficient": "La figura mantiene el volumen y la estabilidad previstos; una unión secundaria tiene una resolución imprecisa que no impide sostener la estructura."
      }
    ]
  },
  {
    "id": "stylization",
    "grade": 1,
    "label": "estilización de formas y figuras",
    "match": "estiliza[a-z]*|estilizacion|simplifica[a-z]* (?:sus|las) formas",
    "relation": "la simplificación de formas y conservación de rasgos reconocibles en la estilización examinada, diferenciándola de una copia literal",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "b3d4b4ed-7b8c-529c-ad16-e4186fe1b8af",
      "c1ffaca7-f6b9-548d-8a97-ecaff4344373"
    ],
    "evidence": [
      {
        "id": "formal-synthesis",
        "title": "Síntesis de las formas",
        "success": "Simplifica las formas y selecciona rasgos que mantienen reconocible la figura estilizada, relacionando las modificaciones con su intención visual.",
        "partial": "La figura sigue siendo reconocible, pero una simplificación no contribuye a la intención visual elegida.",
        "error": "Las modificaciones eliminan los rasgos necesarios para reconocer la figura sin una intención visual que lo explique.",
        "sufficient": "La figura y la intención de su estilización se reconocen; un rasgo secundario queda poco integrado en la simplificación."
      }
    ]
  },
  {
    "id": "light-shadow",
    "grade": 1,
    "label": "luces y sombras",
    "match": "luces y sombras|luz y sombra|claroscuro",
    "relation": "las relaciones entre luz, sombra y percepción del volumen en la imagen dada, señalando evidencias visuales y conservando la iluminación examinada",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "60ea6d6e-29c5-5e8c-957d-997d3d1096ea"
    ],
    "evidence": [
      {
        "id": "light-relations",
        "title": "Relaciones de luz, sombra y volumen",
        "success": "Organiza zonas de luz y sombra coherentes con la iluminación indicada para hacer reconocible el volumen en la representación solicitada.",
        "partial": "Las zonas permiten percibir volumen, pero una relación de iluminación resulta contradictoria.",
        "error": "Las luces y sombras no corresponden a la iluminación indicada y deshacen la relación de volumen solicitada.",
        "sufficient": "La iluminación permite reconocer el volumen; una zona secundaria deja una transición ambigua sin invertir la relación principal de luz y sombra."
      }
    ]
  },
  {
    "id": "color",
    "grade": 1,
    "label": "teoría del color y escala tonal",
    "match": "teoria del color|circulo cromatico|escala tonal|relaciones de color",
    "relation": "las relaciones cromáticas del modelo proporcionado y la diferencia entre color y claridad tonal, usando ejemplos concretos sin confundir pigmento y luz",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "06391674-89f1-50e9-b188-8bd1e2b1c42c",
      "eefb0aaa-3a6b-5314-89d1-7066c5469d5e"
    ],
    "evidence": [
      {
        "id": "color-wheel",
        "title": "Relaciones del círculo cromático",
        "success": "Organiza el círculo cromático según el modelo dado, manteniendo las relaciones entre los colores y las mezclas que se solicitan.",
        "partial": "El círculo conserva el modelo, pero una ubicación o mezcla altera una relación cromática.",
        "error": "La organización confunde las relaciones del modelo dado o sustituye ese modelo por otro incompatible.",
        "when": "circulo cromatico",
        "sufficient": "El círculo mantiene las relaciones cromáticas del modelo dado; un límite entre colores queda poco definido sin alterar su orden."
      },
      {
        "id": "tonal-scale",
        "title": "Gradación de la escala tonal",
        "success": "Construye una escala tonal con cambios de claridad reconocibles y ordenados, distinguiéndolos de cambios de color según el ejercicio.",
        "partial": "La escala mantiene el orden general, pero un paso no conserva la gradación de claridad prevista.",
        "error": "La escala no permite distinguir una gradación de claridad o la sustituye solo por colores diferentes.",
        "when": "escala tonal",
        "sufficient": "La escala conserva el orden de claridad; una transición resulta abrupta sin invertir la gradación."
      }
    ]
  },
  {
    "id": "composition",
    "grade": 1,
    "label": "composición visual",
    "match": "composicion visual|elementos de la composicion|organizacion visual",
    "relation": "la organización de los elementos de la composición visual y sus relaciones de posición, dirección, tamaño y espacio, según el propósito expresamente estudiado",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "21e4898d-844f-5061-b5bb-3fb966fa5579"
    ],
    "evidence": [
      {
        "id": "visual-organization",
        "title": "Relaciones de la composición",
        "success": "Organiza los elementos visuales en relaciones reconocibles de posición, dirección, tamaño y espacio que apoyan el propósito indicado.",
        "partial": "La organización permite reconocer el propósito, pero una relación entre elementos lo vuelve ambiguo.",
        "error": "La disposición de los elementos contradice el propósito indicado o impide reconocer sus relaciones.",
        "sufficient": "La disposición permite reconocer el propósito y las relaciones principales; una alineación secundaria queda imprecisa sin ocultar el sentido visual."
      }
    ]
  },
  {
    "id": "bodily-language",
    "grade": 1,
    "label": "lenguaje corporal escénico",
    "match": "lenguajes? corporales?|recursos corporales|gestos, palabras|generador de lenguajes|situacion ficticia de encuentro",
    "relation": "las funciones comunicativas de los gestos, palabras, acciones y movimientos del cuerpo en la situación escénica examinada, vinculándolos con el mensaje ficticio",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "6aa4df13-0c44-5e0f-8f55-716f4c400464",
      "9d0d7681-d393-58f3-acdb-d615338840cc",
      "af610258-3a55-56a2-9b0e-6e3b743f24bf",
      "eeadbeab-5aa2-554c-a9c7-7c75ef016737",
      "b9970112-9b13-5954-afaf-79b288e440b8",
      "df8ce3c2-cb2f-5964-8b7c-8dfaae419627"
    ],
    "evidence": [
      {
        "id": "bodily-message",
        "title": "Comunicación escénica del mensaje",
        "success": "Relaciona los gestos, palabras, acciones y movimientos expresamente pedidos para hacer reconocible el mensaje de la situación ficticia acordada.",
        "partial": "El mensaje se reconoce, pero una acción o recurso corporal no mantiene su relación con la situación.",
        "error": "Los recursos empleados expresan acciones incompatibles con la situación y no permiten reconocer el mensaje acordado.",
        "sufficient": "El mensaje ficticio se reconoce en las acciones y recursos corporales; un gesto secundario resulta ambiguo sin cambiar la situación representada."
      }
    ]
  },
  {
    "id": "dramatic-structure",
    "grade": 1,
    "label": "estructura dramática de una escena",
    "match": "estructura dramatica|escena breve de teatro|comp[oó]n una escena|composicion de escenas",
    "relation": "las relaciones entre espacio, personajes, tiempo y conflicto de la escena dada, señalando cómo cada elemento interviene en la acción",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "a2160b27-ff98-526f-982f-ca34753f3ce5",
      "e134f5f1-d418-56bc-9e96-af61b8e04b87"
    ],
    "evidence": [
      {
        "id": "scene-relations",
        "title": "Relaciones de la escena propuesta",
        "success": "Organiza el espacio, personajes, tiempo y conflicto de la escena de modo que sus acciones se relacionen y permitan seguir la situación ficticia propuesta.",
        "partial": "La situación se reconoce, pero una relación entre personaje, tiempo, espacio o conflicto queda sin resolver.",
        "error": "Los elementos de la escena se contradicen y no permiten seguir la situación propuesta.",
        "sufficient": "La escena permite seguir el conflicto y las acciones; una indicación secundaria de tiempo o espacio queda incompleta sin contradecir la situación."
      }
    ]
  },
  {
    "id": "character",
    "grade": 1,
    "label": "construcción de personajes",
    "match": "personaje ficticio|construccion de personajes|construye e interpreta un personaje",
    "relation": "las relaciones entre objetivo, acciones y recursos expresivos del personaje en la escena examinada, distinguiendo personaje e intérprete",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "6d8ddf76-22eb-5518-9935-c1fbda540715"
    ],
    "evidence": [
      {
        "id": "character-actions",
        "title": "Acciones y objetivo del personaje",
        "success": "Construye las acciones y recursos expresivos del personaje ficticio de manera coherente con su objetivo y con las condiciones de la escena dada.",
        "partial": "El objetivo del personaje se reconoce, pero una acción no se vincula con las condiciones de la escena.",
        "error": "Las acciones contradicen el objetivo o las condiciones del personaje y no permiten reconocer su función en la escena.",
        "sufficient": "El objetivo y las acciones del personaje se reconocen en la escena; un recurso expresivo secundario queda ambiguo sin contradecir su función.",
        "performance": {
          "title": "Acciones y objetivo del personaje",
          "success": "Interpreta el personaje ficticio mediante acciones y recursos expresivos coherentes con su objetivo y con las condiciones de la escena dada.",
          "sufficient": "El objetivo y las acciones del personaje se reconocen en la interpretación; un recurso expresivo secundario queda ambiguo sin contradecir su función.",
          "partial": "La interpretación permite reconocer el objetivo, pero una acción no se vincula con las condiciones del personaje en la escena.",
          "error": "Las acciones interpretadas contradicen el objetivo o las condiciones del personaje e impiden reconocer su función."
        }
      }
    ]
  },
  {
    "id": "choreography",
    "grade": 1,
    "label": "composición coreográfica",
    "match": "coreograf[a-z]*|patrones ritmicos|secuencia de danza|compongan una danza",
    "relation": "las relaciones entre patrones rítmicos, espacio, transiciones y movimientos en la secuencia de danza examinada, conservando las adaptaciones indicadas",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "019b7653-2fd5-553d-9d46-0089fce55f0a",
      "084924f7-4443-5ab8-b78e-c6bdd9bba088",
      "b2c699b6-f7ca-5943-b231-21dd90354017"
    ],
    "evidence": [
      {
        "id": "rhythmic-movement",
        "title": "Relaciones rítmicas y movimiento",
        "success": "Relaciona los patrones rítmicos y movimientos pedidos en la secuencia, conservando sus cambios y las adaptaciones expresamente acordadas.",
        "partial": "La secuencia se reconoce, pero un cambio de movimiento pierde su relación con el patrón rítmico.",
        "error": "Los movimientos no conservan los patrones de la secuencia ni sus adaptaciones acordadas.",
        "sufficient": "La secuencia conserva los patrones y adaptaciones acordados; una transición breve queda imprecisa sin perder la relación rítmica principal.",
        "plan": {
          "title": "Patrones rítmicos y movimiento propuestos",
          "success": "Propone y registra patrones rítmicos y movimientos relacionados en la secuencia de danza prevista, conservando sus cambios y las adaptaciones acordadas sin afirmar que ya se interpretó.",
          "sufficient": "La propuesta enlaza patrones y movimientos; una transición secundaria queda poco precisa sin perder la relación rítmica prevista.",
          "partial": "El registro propone movimientos pertinentes, pero un cambio no se relaciona con el patrón rítmico previsto.",
          "error": "El registro no permite relacionar los movimientos y patrones de la secuencia propuesta."
        },
        "performance": {
          "title": "Ejecución rítmica de la secuencia",
          "success": "Ejecuta los patrones rítmicos y movimientos de la secuencia dada, conservando sus cambios y las adaptaciones expresamente acordadas.",
          "sufficient": "La ejecución conserva los patrones y adaptaciones; una transición breve es imprecisa sin perder la relación rítmica principal.",
          "partial": "La secuencia ejecutada se reconoce, pero un cambio de movimiento pierde su relación con el patrón rítmico.",
          "error": "La ejecución no conserva los patrones de la secuencia ni sus adaptaciones acordadas."
        }
      },
      {
        "id": "choreographic-space",
        "title": "Diseño del espacio y transiciones",
        "success": "Relaciona recorridos, ubicaciones y transiciones con la secuencia coreográfica propuesta y con las posibilidades del espacio dado.",
        "partial": "El recorrido es reconocible, pero una transición no enlaza las ubicaciones previstas.",
        "error": "Los recorridos y ubicaciones son incompatibles con el espacio o no enlazan la secuencia propuesta.",
        "when": "diseno del espacio|transiciones|recorridos",
        "sufficient": "Los recorridos y transiciones enlazan la secuencia en el espacio dado; una referencia secundaria de ubicación queda poco precisa.",
        "plan": {
          "title": "Diseño espacial de la propuesta",
          "success": "Registra recorridos, ubicaciones y transiciones relacionados con la secuencia coreográfica prevista y con las posibilidades del espacio dado.",
          "sufficient": "El diseño enlaza las ubicaciones y transiciones previstas; una referencia espacial secundaria queda poco precisa.",
          "partial": "El diseño propone un recorrido reconocible, pero una transición no enlaza las ubicaciones previstas.",
          "error": "Los recorridos propuestos son incompatibles con el espacio o no enlazan la secuencia prevista."
        },
        "performance": {
          "title": "Recorridos y transiciones en la ejecución",
          "success": "Realiza los recorridos, ubicaciones y transiciones de la secuencia durante su ejecución, ajustándose al espacio y las adaptaciones indicadas.",
          "sufficient": "Los recorridos y transiciones enlazan la ejecución; una ubicación secundaria queda imprecisa sin romper la continuidad principal.",
          "partial": "La ejecución mantiene parte del recorrido, pero una transición no enlaza las ubicaciones previstas.",
          "error": "Los recorridos o transiciones realizados no corresponden al espacio o a la secuencia dada."
        }
      }
    ]
  },
  {
    "id": "dance-space",
    "grade": 1,
    "label": "espacio escénico de la danza",
    "match": "espacio fisico|espacio escenico de danza|espacio escenico para la danza|posibilidades del espacio",
    "relation": "las posibilidades del espacio físico para la danza, relacionando usos, recorridos y condiciones de los movimientos previstos sin suponer una ejecución realizada",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "88ce2e33-be2f-513c-8fed-a8d7ee180904",
      "bed3687c-2708-53fa-8afd-303782ebd534"
    ],
    "evidence": [
      {
        "id": "space-proposal",
        "title": "Uso escénico del espacio",
        "success": "Propone ubicaciones y recorridos compatibles con el espacio físico y con los movimientos previstos, haciendo reconocibles las condiciones de seguridad indicadas.",
        "partial": "La propuesta permite el movimiento previsto, pero un recorrido o ubicación deja una condición sin resolver.",
        "error": "Las ubicaciones o recorridos impiden los movimientos previstos o contradicen una condición de seguridad dada.",
        "sufficient": "Las ubicaciones y recorridos permiten los movimientos previstos; una indicación secundaria puede precisarse sin cambiar su compatibilidad con el espacio."
      }
    ]
  },
  {
    "id": "scenic-objects",
    "grade": 1,
    "label": "espacios y objetos escénicos",
    "match": "espacios y objetos|objetos en la representacion|funcion de los espacios",
    "relation": "la función de espacios y objetos en las acciones de la representación escénica dada, conservando su relación con la situación y los personajes",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "8eab9952-ef5e-580e-bccf-a3310f835fbc"
    ],
    "evidence": [
      {
        "id": "scenic-function",
        "title": "Función escénica de espacios y objetos",
        "success": "Dispone los espacios y objetos pedidos de modo que apoyen las acciones y relaciones de la escena propuesta.",
        "partial": "La función escénica se reconoce, pero un objeto o ubicación dificulta una acción prevista.",
        "error": "La disposición impide las acciones de la escena o atribuye a los objetos una función incompatible con la propuesta.",
        "sufficient": "Espacios y objetos apoyan las acciones principales; una relación secundaria queda poco clara sin impedir el desarrollo de la escena."
      }
    ]
  },
  {
    "id": "vocal-technique",
    "grade": 1,
    "label": "técnica vocal",
    "match": "tecnica vocal|emision (?:de la )?voz|emision vocal|articulacion y diccion|himno escolar|con la voz el himno|voz hablada y cantada",
    "relation": "la función de postura, respiración, articulación y dicción en la emisión vocal solicitada, distinguiendo recursos técnicos y función expresiva",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "b3fc01f9-7dae-5eab-a6d4-b50cc926d15c",
      "64728828-289e-57ba-82a7-f2542d63d4e5",
      "b9970112-9b13-5954-afaf-79b288e440b8"
    ],
    "evidence": [
      {
        "id": "vocal-breath",
        "title": "Respiración y emisión vocal",
        "success": "Coordina la respiración con las frases de la interpretación vocal pedida, utilizando una postura o adaptación que permita la emisión cuidada.",
        "partial": "Las frases son reconocibles, pero una interrupción de la respiración dificulta sostener la emisión prevista.",
        "error": "La respiración y emisión no permiten seguir las frases del fragmento solicitado.",
        "sufficient": "La respiración sostiene las frases del fragmento; una interrupción breve no altera la continuidad vocal principal."
      },
      {
        "id": "vocal-articulation",
        "title": "Articulación del texto interpretado",
        "success": "Articula las palabras del fragmento solicitado de forma que se reconozca su texto y su relación con las frases interpretadas.",
        "partial": "El texto se reconoce, pero una articulación vuelve ambiguo un fragmento.",
        "error": "La articulación impide reconocer el texto del fragmento solicitado.",
        "sufficient": "El texto del fragmento se reconoce; una palabra queda menos clara sin cambiar el sentido de la frase."
      }
    ]
  },
  {
    "id": "recorder",
    "grade": 1,
    "label": "técnica de flauta dulce",
    "match": "flauta dulce|emision instrumental|tecnica instrumental",
    "relation": "la función de respiración, entonación, postura y emisión en la técnica instrumental de flauta dulce examinada, vinculando cada recurso con el fragmento dado",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "d336b6f0-4ed8-5081-82e8-013595419c6a",
      "64728828-289e-57ba-82a7-f2542d63d4e5"
    ],
    "evidence": [
      {
        "id": "instrumental-emission",
        "title": "Respiración y emisión instrumental",
        "success": "Relaciona respiración, postura adaptada y emisión de aire con las frases del fragmento pedido en flauta dulce.",
        "partial": "El fragmento se reconoce, pero una interrupción del aire dificulta enlazar una frase.",
        "error": "La emisión de aire no permite reconocer las frases del fragmento solicitado.",
        "sufficient": "La emisión permite reconocer y enlazar las frases; una interrupción breve no deshace la continuidad principal del fragmento."
      },
      {
        "id": "instrumental-intonation",
        "title": "Entonación del fragmento instrumental",
        "success": "Conserva las alturas y relaciones melódicas del fragmento indicado mediante la técnica instrumental practicada.",
        "partial": "La melodía se reconoce, pero una altura altera una relación del fragmento.",
        "error": "Las alturas y relaciones producidas no permiten reconocer el fragmento solicitado.",
        "sufficient": "Las relaciones melódicas del fragmento se reconocen; una altura es imprecisa sin cambiar el contorno principal."
      }
    ]
  },
  {
    "id": "melody",
    "grade": 1,
    "label": "estructura y creación melódica",
    "match": "melodia|melodias|estructura melodica|motivos, frases|frases y semifrases",
    "relation": "las relaciones entre motivos, frases y semifrases de la melodía examinada, identificando ejemplos audibles y sus vínculos en la estructura",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "a4553bbf-4bfb-5bc7-b00c-31c990cfd15c",
      "6fad8717-b191-5c93-a81d-76350f51f9b2",
      "c1ffaca7-f6b9-548d-8a97-ecaff4344373"
    ],
    "evidence": [
      {
        "id": "melodic-relations",
        "title": "Organización de la melodía",
        "success": "Organiza los motivos y frases expresamente pedidos en una melodía reconocible, utilizando el medio elegido entre las opciones disponibles y relacionando sus partes.",
        "partial": "Las partes se reconocen, pero un enlace entre motivos o frases queda sin resolver.",
        "error": "La sucesión no permite reconocer las relaciones melódicas expresamente solicitadas.",
        "sufficient": "Los motivos y frases forman una melodía reconocible; un límite entre partes queda poco claro sin perder su relación principal."
      }
    ]
  },
  {
    "id": "craft",
    "grade": 1,
    "label": "artesanía y función cotidiana",
    "match": "artesania|artesanal|pieza artesanal",
    "relation": "las relaciones entre forma, material, función cotidiana y expresión cultural de la pieza artesanal examinada, ajustándose a la necesidad del caso",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "a103e393-8bd2-52c0-a735-f5a1ea485efb",
      "28709913-2c53-5c86-8cab-1ab0ea5ed719",
      "df8ce3c2-cb2f-5964-8b7c-8dfaae419627"
    ],
    "evidence": [
      {
        "id": "craft-function",
        "title": "Forma y función de la pieza artesanal",
        "success": "Relaciona forma, uniones y materiales disponibles de la pieza con la necesidad cotidiana indicada, haciendo reconocible su función.",
        "partial": "La pieza responde a la necesidad, pero una unión o elección formal dificulta parte de su función.",
        "error": "La estructura o forma de la pieza impide responder a la necesidad cotidiana indicada.",
        "sufficient": "La pieza responde a la necesidad dada con forma y uniones utilizables; una resolución secundaria queda imprecisa sin impedir su función."
      }
    ]
  },
  {
    "id": "textile",
    "grade": 1,
    "label": "diseño textil y de modas",
    "match": "textil|textiles|modas",
    "relation": "las relaciones entre forma, color, uniones y uso en el diseño textil o de modas examinado, distinguiendo función del producto y preferencias personales",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "067a2a1b-fe55-5f55-abf1-1f7a2949cf30",
      "0fd2c1fd-2833-5e48-9274-7e83b7391c74"
    ],
    "evidence": [
      {
        "id": "textile-function",
        "title": "Adaptación del diseño textil",
        "success": "Adapta la forma, color y uniones del textil a la función expresamente indicada, relacionando sus decisiones con las condiciones del uso dado.",
        "partial": "La adaptación responde al uso indicado, pero una decisión formal dificulta su función.",
        "error": "Las decisiones de forma o unión no permiten el uso previsto en el caso.",
        "sufficient": "La adaptación conserva la función del textil; una decisión secundaria de forma, color o unión puede precisarse sin impedir el uso previsto."
      }
    ]
  },
  {
    "id": "graphic-design",
    "grade": 1,
    "label": "diseño gráfico",
    "match": "diseno grafico|pieza grafica",
    "relation": "las relaciones entre texto, imagen, espacio y legibilidad en la comunicación de la pieza gráfica examinada, según el mensaje y destinatario dados",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "45a6484c-1d0f-586e-bbf5-9776d3af716e"
    ],
    "evidence": [
      {
        "id": "graphic-organization",
        "title": "Organización y legibilidad gráfica",
        "success": "Organiza los textos, imágenes y espacios expresamente pedidos para que el mensaje de la pieza gráfica pueda reconocerse según su destinatario y función.",
        "partial": "El mensaje se reconoce, pero una relación de tamaño o distribución dificulta su lectura.",
        "error": "La distribución impide reconocer el mensaje o atribuye a texto e imagen relaciones incompatibles con su función.",
        "sufficient": "El mensaje y la lectura de la pieza se mantienen; un espacio o tamaño secundario queda impreciso sin ocultar la relación principal."
      }
    ]
  },
  {
    "id": "design",
    "grade": 1,
    "label": "elementos de diseño",
    "match": "elementos de diseno|principios de diseno",
    "relation": "las relaciones entre forma, distribución y función de los elementos de diseño presentes en la pieza dada, usando ejemplos observables",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "0bb85add-1f43-5cbc-b518-050e62e4e464"
    ],
    "evidence": [
      {
        "id": "design-function",
        "title": "Relaciones del diseño",
        "success": "Relaciona los elementos formales del diseño con la distribución y función expresamente pedidas para el producto.",
        "partial": "Los elementos responden a la función, pero una relación de distribución queda sin resolver.",
        "error": "Las elecciones de forma y distribución impiden reconocer la función solicitada.",
        "sufficient": "Los elementos y su distribución apoyan la función pedida; una relación secundaria de organización puede precisarse sin cambiar esa función."
      }
    ]
  },
  {
    "id": "portfolio",
    "grade": 1,
    "label": "portafolio o informe creativo",
    "match": "portafolio|informe creativo",
    "relation": "las relaciones entre ejemplos, técnicas y terminología en las propuestas artísticas examinadas, distinguiendo el producto de presentación y la investigación previa",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "b836956d-9269-5d80-9ead-77660043ec94"
    ],
    "evidence": [
      {
        "id": "artistic-selection",
        "title": "Selección y organización de propuestas",
        "success": "Organiza ejemplos pertinentes de las propuestas dadas en el formato elegido y relaciona cada selección con sus técnicas y terminología artística.",
        "partial": "Los ejemplos son pertinentes, pero una selección no se vincula con su técnica o término artístico.",
        "error": "La organización atribuye a las propuestas técnicas ausentes o no permite reconocer el contenido artístico solicitado.",
        "sufficient": "Las selecciones se relacionan con las técnicas y términos pertinentes; una precisión secundaria de un ejemplo queda incompleta sin alterar su identificación."
      }
    ]
  },
  {
    "id": "diary-binding",
    "grade": 1,
    "label": "encuadernación de un diario artístico",
    "match": "encuaderna[a-z]*|encuadernacion|album para (?:usar|realizar)",
    "relation": "la relación entre diseño, encuadernación y uso de las páginas del álbum destinado al diario artístico, sin confundir soporte y contenido reflexivo",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "48a5c910-6bc8-5f1e-aed0-e770ad8262ac"
    ],
    "evidence": [
      {
        "id": "binding-function",
        "title": "Estructura utilizable del álbum",
        "success": "Diseña y une las páginas del álbum de modo que permanezcan sujetas y utilizables para el registro artístico previsto.",
        "partial": "El álbum puede usarse, pero una unión o disposición de páginas dificulta parte del registro.",
        "error": "Las páginas no se mantienen unidas o la estructura impide el uso previsto como diario.",
        "sufficient": "Las páginas permanecen unidas y utilizables; una apertura secundaria es menos cómoda sin impedir el registro previsto."
      }
    ]
  },
  {
    "id": "diary",
    "grade": 1,
    "label": "diario artístico reflexivo",
    "match": "diario artistico|diario reflexivo",
    "relation": "las decisiones y cambios del proceso artístico documentado, relacionando reflexiones sobre técnicas con ejemplos de trabajos del período indicado",
    "pdfPages": [
      330,
      331
    ],
    "sourceRecordIds": [
      "40634266-e0d5-5d7d-8044-60c6319ff58b",
      "407d3431-d4ae-5446-bfd8-9c71d7e40639"
    ],
    "evidence": [
      {
        "id": "process-reflection",
        "title": "Reflexión sobre el proceso artístico",
        "success": "Relaciona sus decisiones, aplicaciones de técnicas y cambios del proceso con ejemplos de los trabajos registrados durante el período pedido.",
        "partial": "La reflexión se vincula con trabajos concretos, pero un cambio o decisión no tiene un ejemplo reconocible.",
        "error": "El diario enumera actividades sin relacionar decisiones o cambios con ejemplos del proceso artístico.",
        "sufficient": "Las decisiones y cambios se vinculan con ejemplos de los trabajos; un detalle técnico secundario queda sin precisar."
      }
    ]
  },
  {
    "id": "signs-symbols",
    "grade": 1,
    "label": "signos y símbolos artísticos",
    "match": "signos y simbolos|signos, recursos|sentido comunicativo",
    "relation": "las relaciones entre signos, símbolos, contexto y sentido comunicativo en la producción artística dada, sustentando interpretaciones en elementos presentes",
    "pdfPages": [
      330
    ],
    "sourceRecordIds": [
      "8e5269c6-d2cd-59ce-8fb7-b2a3d7684ad3"
    ],
    "evidence": [
      {
        "id": "communicative-choice",
        "title": "Elección comunicativa de signos y símbolos",
        "success": "Relaciona los signos y símbolos elegidos en la producción con el mensaje ficticio acordado y con su contexto de interpretación.",
        "partial": "El mensaje se reconoce, pero una elección simbólica queda sin relación explicable con el contexto.",
        "error": "Los signos elegidos comunican relaciones incompatibles con el mensaje acordado sin una decisión expresiva que lo explique.",
        "sufficient": "El mensaje y las relaciones simbólicas se reconocen; una elección secundaria queda ambigua sin cambiar el sentido contextual principal."
      }
    ]
  },
  {
    "id": "genre-style",
    "grade": 1,
    "label": "géneros y estilos artísticos",
    "match": "generos y estilos|distintos generos|similitudes y diferencias en expresiones",
    "relation": "las semejanzas y diferencias observables entre los géneros y estilos de las expresiones dadas, justificándolas con sus recursos y contextos",
    "pdfPages": [
      331
    ],
    "sourceRecordIds": [
      "c68a16ee-4a8f-53ed-a4c6-4c7693a496a6"
    ],
    "evidence": [
      {
        "id": "style-decisions",
        "title": "Recursos de género y estilo",
        "success": "Relaciona los recursos del género o estilo expresamente pedido con las decisiones de la producción artística propuesta.",
        "partial": "El género o estilo se reconoce, pero una decisión no se vincula con sus recursos.",
        "error": "Los recursos empleados no permiten reconocer el género o estilo expresamente solicitado.",
        "sufficient": "El género o estilo pedido se reconoce en los recursos; una decisión secundaria queda menos integrada sin cambiar la organización principal."
      }
    ]
  },
  {
    "id": "appreciation",
    "grade": 1,
    "label": "valoración semiótica y estética",
    "match": "valora la obra|criterios semioticos|criterios esteticos|valoracion de obras",
    "relation": "la valoración de la obra mediante los criterios semióticos y estéticos dados, justificando interpretaciones con sus signos, recursos y contexto en lugar de imponer un gusto",
    "pdfPages": [
      331
    ],
    "sourceRecordIds": [
      "df0e348f-f677-5811-be30-8b6011dd7f7b",
      "889221f3-7b82-5baf-8871-68d809576375",
      "4429d0ac-76dd-5a16-a9fb-740b5ed05d17"
    ],
    "evidence": [
      {
        "id": "appreciation-evidence",
        "title": "Fundamento de la valoración artística",
        "success": "Relaciona una valoración de la obra con evidencias observables y los criterios semióticos o estéticos expresamente proporcionados.",
        "partial": "La valoración usa un criterio pertinente, pero una afirmación no se vincula con un elemento de la obra.",
        "error": "La valoración sustituye los criterios dados por una preferencia sin relación con los elementos de la obra.",
        "sufficient": "La valoración se apoya en los criterios y elementos pertinentes; una precisión secundaria de un ejemplo queda incompleta sin cambiar su fundamento."
      }
    ]
  },
  {
    "id": "cultural-influences",
    "grade": 1,
    "label": "influencias culturales en el arte nacional",
    "match": "influencias culturales|expresion artistica nacional",
    "relation": "las influencias culturales de las expresiones artísticas nacionales examinadas, sustentando relaciones con evidencias del material y reconociendo sus contextos sin jerarquizar culturas",
    "pdfPages": [
      331
    ],
    "sourceRecordIds": [
      "95289a7a-b5a1-515a-b915-9433ec6bca6d"
    ],
    "evidence": [
      {
        "id": "cultural-evidence",
        "title": "Relaciones culturales sustentadas",
        "success": "Sustenta las relaciones culturales de la propuesta artística con elementos y evidencias del material dado, conservando sus contextos.",
        "partial": "La relación cultural es pertinente, pero una afirmación no conserva evidencia o contexto.",
        "error": "Atribuye influencias sin respaldo en el material o confunde relación cultural con superioridad de una cultura.",
        "sufficient": "Las relaciones culturales principales tienen respaldo en el material; una conexión secundaria puede precisarse sin alterar el contexto."
      }
    ]
  },
  {
    "id": "art-technology",
    "grade": 1,
    "label": "recursos tecnológicos de la creación artística",
    "match": "recursos tecnologicos|herramienta digital",
    "relation": "la función de los recursos tecnológicos realmente utilizados en la producción artística y su relación con el mensaje y las decisiones del proceso",
    "pdfPages": [
      331
    ],
    "sourceRecordIds": [
      "77af8f8c-d881-55fc-8695-794fd731f683"
    ],
    "evidence": [
      {
        "id": "technological-function",
        "title": "Función expresiva del recurso tecnológico",
        "success": "Utiliza los recursos disponibles de la herramienta indicada de modo que apoyen la organización y el mensaje de la composición artística.",
        "partial": "El recurso apoya el mensaje, pero una elección técnica dificulta una relación expresiva.",
        "error": "El uso de la herramienta impide reconocer el mensaje o no cumple la función artística expresamente solicitada.",
        "sufficient": "El recurso tecnológico apoya la composición y su mensaje; un ajuste secundario queda impreciso sin cambiar la función expresiva principal."
      }
    ]
  },
  {
    "id": "environmental-art",
    "grade": 1,
    "label": "creación artística y cuidado de la salud y el ambiente",
    "match": "salud personal y ambiental|materiales del medio|facil acceso",
    "relation": "las relaciones entre los recursos artísticos, materiales accesibles y el mensaje de cuidado personal y ambiental examinado, diferenciando comunicación artística y demostración médica",
    "pdfPages": [
      331
    ],
    "sourceRecordIds": [
      "d56b33f6-1618-5d80-a694-7809b27bfa37",
      "1e6a34b2-5287-5eb8-a8c8-ebcc9fdd2d5e",
      "f8342032-3c40-5304-a863-4a0792dfb682"
    ],
    "evidence": [
      {
        "id": "environmental-message",
        "title": "Mensaje y uso de materiales disponibles",
        "success": "Relaciona los materiales disponibles y los recursos expresivos de la obra con el mensaje de cuidado personal y ambiental dado, sin atribuir al producto resultados ajenos a su función artística.",
        "partial": "El mensaje se reconoce, pero una elección material o expresiva no se vincula con su propósito.",
        "error": "Las decisiones expresivas contradicen el mensaje dado o le atribuyen resultados que la obra no puede demostrar.",
        "sufficient": "Materiales y recursos apoyan el mensaje de cuidado dado; una elección secundaria queda menos clara sin cambiar su sentido principal."
      }
    ]
  },
  {
    "id": "group-agreements",
    "grade": 1,
    "label": "acuerdos observables en la creación grupal",
    "match": "regularidad|acuerdos concretos|creacion artistica grupal|creaciones grupales",
    "relation": "las acciones observadas en el cumplimiento del rol y los acuerdos concretos durante la creación artística grupal, distinguiendo registros y juicios personales",
    "pdfPages": [
      331
    ],
    "sourceRecordIds": [
      "cb8593dd-fd3b-505d-9f5f-38bf9603d3b8"
    ],
    "evidence": [
      {
        "id": "observed-agreements",
        "title": "Cumplimiento observado de acuerdos",
        "success": "Realiza las acciones concretas de su rol y los acuerdos de creación grupal en las oportunidades registradas.",
        "partial": "Realiza algunas acciones acordadas de su rol, pero deja otras oportunidades registradas sin cumplir.",
        "error": "Las acciones registradas no corresponden a su rol ni a los acuerdos concretos del trabajo.",
        "sufficient": "Cumple las acciones concretas de su rol y los acuerdos en casi todas las oportunidades observadas de creación artística."
      }
    ]
  },
  {
    "id": "art-visit",
    "grade": 1,
    "label": "lenguajes de una manifestación artística",
    "match": "visita virtual|visita fisica|manifestacion artistica de la visita",
    "relation": "los lenguajes y recursos observables de la manifestación artística examinada en una visita o registro proporcionado, sustentando relaciones en ejemplos presentes",
    "pdfPages": [
      331
    ],
    "sourceRecordIds": [
      "252728d0-c2eb-51b6-bf30-5d82543620c8",
      "04e8f35a-b813-535b-a71a-c2f765dc2e93",
      "8d8947a1-7ddc-551a-b3de-1aa91ad1747d"
    ],
    "evidence": [
      {
        "id": "visit-evidence",
        "title": "Recursos observados en la manifestación",
        "success": "Selecciona ejemplos de los lenguajes y recursos presentes en la manifestación examinada y explica su función comunicativa.",
        "partial": "Los ejemplos están presentes, pero una explicación no se relaciona con su función artística.",
        "error": "Atribuye a la manifestación recursos ausentes o sustituye el análisis de la obra por datos de asistencia.",
        "sufficient": "Los ejemplos se vinculan con los lenguajes y funciones presentes; un detalle secundario queda sin precisar sin cambiar la interpretación principal."
      }
    ]
  }
]
