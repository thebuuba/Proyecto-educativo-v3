import type {OptativeSocialModule} from './secondary-optative-social'

/** Adaptaciones MINERD2023 PDF488–489; textos/casos dados yacciones observables, sin calificar adhesiones privadas. */
export const optativeHcsSocSix:OptativeSocialModule={
  "id": "optativa-hcs-soc-6",
  "grade": 6,
  "subjectCode": "OPT-HCS-SOC-6",
  "subjectName": "Ciudadanía y Democracia Participativa",
  "optativeExitName": "Humanidades y Ciencias Sociales",
  "modalityCodes": [
    "academic",
    "general"
  ],
  "sourceScopeId": "ec62cee2-b76d-5582-8cf1-7762b9e5b4fd",
  "pdfPages": [
    488,
    489
  ],
  "topics": [
    {
      "id": "democracy",
      "grade": 6,
      "label": "la democracia y la participación",
      "match": "democracia|democratic",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "96638a16-5f68-548a-ad63-ad97e569aba8",
        "e603f417-d806-5cd6-a68f-bff26b2ed3bc",
        "e0acbdb1-1cba-5077-9691-45441b18ab9d",
        "b777f8f3-141d-5664-b815-2fe776a39b26",
        "23c7aa84-f3f8-5bdc-bd3f-1407c030f6c7",
        "0e089477-125f-58ae-872a-ab6737437372"
      ],
      "pages": [
        488
      ],
      "priority": 1,
      "facets": [
        {
          "label": "la democracia",
          "match": "\\bdemocracia\\b"
        },
        {
          "label": "la participación",
          "match": "\\bparticipacion\\b"
        },
        {
          "label": "la salida democrática del caso",
          "match": "salida democratica"
        }
      ]
    },
    {
      "id": "citizenship",
      "grade": 6,
      "label": "la ciudadanía",
      "match": "ciudadania",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "11519de1-4c35-57b9-95bc-a0e3a33edbac",
        "ca7aea8c-9b5a-5948-a91b-ef8129da7348",
        "2592b369-00df-5015-a633-90237232b73b",
        "6f6ac9db-5c75-5838-9243-540f0a705b5a"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 1
    },
    {
      "id": "reliable-sources",
      "grade": 6,
      "label": "las fuentes confiables sobre Constitución, derechos humanos o inmigrantes solicitadas",
      "match": "confiabilidad|fuentes confiables|fuentes.*confiab",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "9f999b36-1a61-50ed-bf35-256db0375252",
        "b777f8f3-141d-5664-b815-2fe776a39b26",
        "6acb2171-4ddd-55e9-b59e-55dd9bc9ded4",
        "667f0a4e-352b-581a-b5ba-da99b1e46735"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 60
    },
    {
      "id": "civic-participation",
      "grade": 6,
      "label": "la participación y los principios cívicos",
      "match": "participacion civica|principios civicos|funcion civica",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "daa9b9e5-bb84-53e9-bb68-4e00f9d8cf04",
        "42fba15a-0755-5047-bee3-3d5964438101"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "la participación cívica",
          "match": "participacion civica|participacion y los principios civicos"
        },
        {
          "label": "los principios cívicos de los casos dados",
          "match": "principios civicos"
        }
      ]
    },
    {
      "id": "democracy-types",
      "grade": 6,
      "label": "la democracia participativa y la democracia representativa",
      "match": "democracia (?:representativa|participativa)",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "e633dc5f-3f0d-53f0-94e5-edc789de2460",
        "2c74dd25-7c62-5015-8868-b44428db8553"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "la democracia participativa",
          "match": "democracia participativa"
        },
        {
          "label": "la democracia representativa",
          "match": "democracia representativa"
        }
      ]
    },
    {
      "id": "democratic-values",
      "grade": 6,
      "label": "los valores y actuaciones democráticas solicitados",
      "match": "valores democraticos|actitudes democraticas|actitudes no democraticas|autoritarias|decision democratica|valores y actuaciones democraticas",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "c344cbe9-6b37-5a3f-9abd-848c0b38705c",
        "e23fc18c-95f2-5f3a-ace9-0ee28a9c2e4a",
        "56b309cf-ab78-5454-81b7-62ae324eabb9"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "los valores democráticos del caso",
          "match": "valores democraticos"
        },
        {
          "label": "las actitudes democráticas y autoritarias de los casos dados",
          "match": "actitudes democraticas.*autoritarias"
        },
        {
          "label": "las actitudes no democráticas de los personajes",
          "match": "actitudes no democraticas"
        },
        {
          "label": "la decisión democrática de la simulación",
          "match": "decision democratica"
        }
      ]
    },
    {
      "id": "democratic-state",
      "grade": 6,
      "label": "el Estado democrático y de derecho",
      "match": "estado democratico|estado de derecho",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "6d760447-8273-5f67-907e-726c2a9cd8ae"
      ],
      "pages": [
        488
      ],
      "priority": 50
    },
    {
      "id": "rights-duties",
      "grade": 6,
      "label": "los derechos y los deberes",
      "match": "derechos y (?:los )?deberes",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "4dd54cdb-c05e-5ab7-a823-38efc422c651",
        "37840259-bdf9-5213-9612-00d3cca1a3be",
        "0501b7a4-0224-5166-846b-69268e9069de",
        "084fcf4c-02ee-589d-8611-274ad87dd343"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50
    },
    {
      "id": "constitutional-rights",
      "grade": 6,
      "label": "los derechos fundamentales y la Constitución dominicana",
      "match": "constitucion|derechos fundamentales",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "cd3d493c-e4d5-577e-b93c-bad97482265f",
        "2c829ce2-9b78-588b-9113-bbd190d145d7",
        "4d878415-a12e-578f-b5cd-6f7121defcd8",
        "237561c5-17ed-50aa-b1c8-45266e9a4d2a",
        "6f17d0d7-15c5-55cc-9645-15601bebe338",
        "667f0a4e-352b-581a-b5ba-da99b1e46735",
        "6cb829b1-0c45-5a4b-90ba-6fab239a687e"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 10,
      "facets": [
        {
          "label": "la Constitución dominicana",
          "match": "constitucion"
        },
        {
          "label": "los derechos fundamentales",
          "match": "derechos fundamentales"
        }
      ]
    },
    {
      "id": "state-powers",
      "grade": 6,
      "label": "los poderes del Estado",
      "match": "poderes del estado",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "563b3b5b-220f-57ec-8a2a-1293f5499766",
        "59060daa-7708-5a16-b435-f10f0f9ef2f4"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50
    },
    {
      "id": "human-rights",
      "grade": 6,
      "label": "los derechos humanos",
      "match": "derechos humanos",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "d30ccbe4-7f72-59b2-9cdc-4801693e6358",
        "7e7b44a8-bc1f-51a3-ab93-39a10e6435d8",
        "5d0e8a72-fca6-5bfe-93cd-d9e5c8b3f1f5",
        "4ab686f9-8a7c-5981-8801-93c6eca78b70",
        "e9f028b3-3731-5ee7-87f3-1c3863a6bcb8",
        "b49819d0-54b9-57dd-841d-43c9854cbb76"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 10
    },
    {
      "id": "equal-rights",
      "grade": 6,
      "label": "la igualdad y el respeto a los derechos humanos",
      "match": "igualdad|respeto a los derechos humanos",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "24a12dfc-06d6-5b8f-af89-2fc375bf8731",
        "df253a47-eaa4-5bc6-a482-778f2fbee63e"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "la igualdad de derechos",
          "match": "igualdad"
        },
        {
          "label": "el respeto a los derechos humanos",
          "match": "respeto a los derechos humanos"
        }
      ]
    },
    {
      "id": "democratic-citizenship",
      "grade": 6,
      "label": "la ciudadanía democrática y responsable",
      "match": "ciudadania democratica|ciudadania responsable",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "ca7aea8c-9b5a-5948-a91b-ef8129da7348",
        "6f6ac9db-5c75-5838-9243-540f0a705b5a"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50
    },
    {
      "id": "global-citizenship",
      "grade": 6,
      "label": "la ciudadanía global",
      "match": "ciudadania global",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "d6412626-f907-5c3a-8d4f-662f5ceae153",
        "0cb8b84c-e080-537b-adfd-17689b905877"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50
    },
    {
      "id": "intercultural-convivence",
      "grade": 6,
      "label": "la convivencia, diversidad cultural, multiculturalidad e interculturalidad",
      "match": "diversidad cultural|multicultur|intercultur|distintas culturas",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "85eba0a8-af4f-5d55-94d8-da0951b1c9e8",
        "79ae9d8a-3f95-5c93-9345-dd9427f0b819",
        "5c728b10-2f64-5a9b-96dd-5258770d18b8"
      ],
      "pages": [
        488
      ],
      "priority": 50,
      "facets": [
        {
          "label": "la convivencia",
          "match": "convivencia"
        },
        {
          "label": "la diversidad cultural",
          "match": "diversidad cultural"
        },
        {
          "label": "la multiculturalidad",
          "match": "multicultur"
        },
        {
          "label": "la interculturalidad",
          "match": "intercultur"
        },
        {
          "label": "la convivencia entre distintas culturas",
          "match": "distintas culturas"
        }
      ]
    },
    {
      "id": "migration",
      "grade": 6,
      "label": "la inmigración y los derechos de los inmigrantes",
      "match": "inmigra|migracion",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "79ae9d8a-3f95-5c93-9345-dd9427f0b819",
        "2592b369-00df-5015-a633-90237232b73b",
        "08413b5a-bc74-577d-9c06-339f4bcd2414",
        "b49819d0-54b9-57dd-841d-43c9854cbb76",
        "7258925a-76ab-5afa-9ce1-6c97561c8694"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "la inmigración",
          "match": "\\binmigracion\\b"
        },
        {
          "label": "los inmigrantes del conjunto ficticio",
          "match": "inmigrantes"
        },
        {
          "label": "la migración",
          "match": "\\bmigracion\\b"
        }
      ]
    },
    {
      "id": "environment",
      "grade": 6,
      "label": "el cuidado del medioambiente y del entorno",
      "match": "medioambiente|medio natural|entorno|limpieza",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "74bcec61-e726-5551-8b7a-b537843db1be",
        "7b0ad5dd-a5e8-507c-9bb6-5f12bfc10a62",
        "f0790a9e-5c43-59d6-a7d1-f31c0000f082",
        "5b6321f5-fa9e-52ae-a288-47a5afc2c612",
        "2520c219-9003-58d9-8f57-c1c96a1e97b1",
        "0be1a47a-b4ff-5bfa-9ec3-3c63c9ef7405",
        "a333707c-47a4-50cf-84a4-a83b687b662c",
        "1354f61c-26e5-517a-9d20-f796164e3cb7",
        "a800c527-974b-54f3-8e80-2654a761b83e"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 10,
      "facets": [
        {
          "label": "el cuidado del medioambiente",
          "match": "medioambiente"
        },
        {
          "label": "el cuidado del entorno",
          "match": "entorno|limpieza"
        },
        {
          "label": "el cuidado del medio natural y social",
          "match": "medio natural"
        }
      ]
    },
    {
      "id": "pollution",
      "grade": 6,
      "label": "la contaminación y los residuos sólidos solicitados",
      "match": "contaminacion|residuos solidos",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "7b0ad5dd-a5e8-507c-9bb6-5f12bfc10a62",
        "6acb2171-4ddd-55e9-b59e-55dd9bc9ded4",
        "ccd1304b-6619-5561-b70c-d386b9ce960f"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "la contaminación y sus efectos en la salud según los datos dados",
          "match": "contaminacion.*salud"
        },
        {
          "label": "la contaminación y los residuos sólidos",
          "match": "contaminacion.*residuos solidos"
        }
      ]
    },
    {
      "id": "peace",
      "grade": 6,
      "label": "la convivencia y la cultura de paz",
      "match": "convivencia|cultura de paz",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "0f583cc3-0933-5558-9cbc-72fa06b9ec7c",
        "5c728b10-2f64-5a9b-96dd-5258770d18b8",
        "b78f069c-1ab3-5b99-b3d9-2ebab6aa9527",
        "10d6f1c2-e087-5f3e-b05b-5bce0a51e2cf"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 10,
      "facets": [
        {
          "label": "la cultura de paz",
          "match": "cultura de paz"
        },
        {
          "label": "la convivencia",
          "match": "convivencia(?! vial)"
        }
      ]
    },
    {
      "id": "road-education",
      "grade": 6,
      "label": "la educación y la convivencia vial",
      "match": "vial",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "d35e9bed-cdaf-52b7-87eb-7aa2674200b9",
        "b78f069c-1ab3-5b99-b3d9-2ebab6aa9527",
        "8375ce1e-88ef-5419-8268-d75153281aa0"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "la educación vial",
          "match": "educacion vial|educacion y la convivencia vial"
        },
        {
          "label": "la convivencia vial",
          "match": "convivencia vial"
        }
      ]
    },
    {
      "id": "electoral-system",
      "grade": 6,
      "label": "el sistema y los procedimientos electorales solicitados",
      "match": "electoral|electorales",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "3c4ad8cf-899f-5a63-8718-69fab961b9a8",
        "a8ae2099-71b4-5e88-a9ae-44e7ccbe5765"
      ],
      "pages": [
        488,
        489
      ],
      "priority": 50,
      "facets": [
        {
          "label": "el procedimiento electoral de la simulación escolar",
          "match": "simulacion.*electoral|proceso electoral escolar"
        },
        {
          "label": "las fortalezas y debilidades del sistema electoral dominicano",
          "match": "sistema electoral dominicano"
        }
      ]
    },
    {
      "id": "women-rights",
      "grade": 6,
      "label": "los derechos de la mujer",
      "match": "derechos de la mujer",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "5b0e2fc4-b1bf-5530-8ee7-e0a5cd33ca7c"
      ],
      "pages": [
        489
      ],
      "priority": 50
    },
    {
      "id": "national-symbols",
      "grade": 6,
      "label": "la bandera y el himno nacional en el contexto dado",
      "match": "bandera|himno nacional",
      "relation": "las características y relaciones expresamente solicitadas de {target} en los materiales o casos proporcionados",
      "sourceRecordIds": [
        "08d7b730-d448-5697-873a-a15d749f37a3"
      ],
      "pages": [
        489
      ],
      "priority": 50
    }
  ],
  "evidence": {
    "interpretation": {
      "title": "Comprensión de {label}",
      "weight": 3,
      "levels": [
        "Explica las relaciones expresamente solicitadas de {label} con información pertinente del material dado, diferenciando información e interpretación.",
        "Explica las relaciones centrales de {label} con información del material; una relación secundaria queda poco desarrollada.",
        "Reconoce información pertinente de {label}, pero una relación central queda sin explicar o sin apoyo en el material.",
        "La explicación de {label} contradice una relación central del material o se apoya en afirmaciones ajenas al caso.",
        "No presenta una explicación reconocible de {label} basada en el material dado."
      ]
    },
    "identification": {
      "title": "Identificación de {label}",
      "weight": 2,
      "levels": [
        "Identifica los elementos solicitados de {label} y vincula cada uno con la evidencia o condición correspondiente del caso dado.",
        "Identifica los elementos centrales de {label} con respaldo; una correspondencia secundaria queda incompleta.",
        "Identifica algunos elementos de {label}, pero omite o confunde una correspondencia central con el caso.",
        "Las identificaciones de {label} contradicen las condiciones dadas y no permiten reconocer los elementos solicitados.",
        "No identifica elementos pertinentes de {label} en el caso dado."
      ]
    },
    "comparison": {
      "title": "Comparación de {label}",
      "weight": 3,
      "levels": [
        "Contrasta las formas o actuaciones solicitadas de {label} utilizando el mismo aspecto de comparación y evidencias de los casos dados.",
        "Contrasta las diferencias centrales de {label} sobre un mismo aspecto; una evidencia secundaria queda incompleta.",
        "Describe las opciones de {label}, pero no mantiene el aspecto común de comparación o deja sin respaldo una diferencia central.",
        "Confunde las opciones de {label} o atribuye diferencias incompatibles con los casos dados.",
        "No presenta una comparación reconocible de {label}."
      ]
    },
    "document-analysis": {
      "title": "Análisis de disposiciones sobre {label}",
      "weight": 3,
      "levels": [
        "Distingue lo que establecen los artículos dados sobre {label} y relaciona sus disposiciones con las evidencias y condiciones del caso, sin atribuirles alcances que el texto no respalda.",
        "Relaciona las disposiciones centrales sobre {label} con el caso; una condición secundaria queda sin desarrollar.",
        "Reconoce disposiciones sobre {label}, pero una relación central con el caso queda sin respaldo o confunde texto e interpretación.",
        "Atribuye al texto una disposición central sobre {label} que no contiene o la aplica a condiciones incompatibles.",
        "No presenta un análisis reconocible de los artículos dados sobre {label}."
      ]
    },
    "source-selection": {
      "title": "Selección de fuentes sobre {label}",
      "weight": 2,
      "levels": [
        "Selecciona entre los materiales dados las fuentes pertinentes y confiables para la pregunta sobre {label}, respetando las condiciones de selección solicitadas.",
        "Selecciona las fuentes centrales pertinentes y confiables sobre {label}; una selección secundaria queda incompleta.",
        "Incluye alguna fuente pertinente sobre {label}, pero omite una central o incorpora otra que no responde a la pregunta.",
        "La selección sobre {label} se apoya principalmente en materiales ajenos a la pregunta o sin las condiciones de confiabilidad dadas.",
        "No presenta una selección reconocible de fuentes pertinentes sobre {label}."
      ]
    },
    "source-credibility": {
      "title": "Justificación de la confiabilidad sobre {label}",
      "weight": 2,
      "levels": [
        "Justifica la selección de fuentes sobre {label} con la autoría, procedencia o respaldo verificable que muestran los materiales dados y relaciona esa evidencia con su confiabilidad.",
        "Justifica la confiabilidad de las fuentes centrales sobre {label} con respaldo verificable; una justificación secundaria queda incompleta.",
        "Menciona autoría o procedencia sobre {label}, pero no explica su relación con la confiabilidad de una fuente central.",
        "Justifica las fuentes sobre {label} solo por preferencias o por respaldo que los materiales no muestran.",
        "No presenta una justificación reconocible de la confiabilidad de las fuentes sobre {label}."
      ]
    },
    "attribution": {
      "title": "Atribución de informaciones sobre {label}",
      "weight": 2,
      "levels": [
        "Vincula las informaciones utilizadas sobre {label} con sus fuentes identificables y aplica {style} de forma que se distingue la información tomada del aporte propio.",
        "Atribuye las informaciones centrales sobre {label} y sigue {style}; falta un dato secundario sin impedir identificar la fuente.",
        "Atribuye parte de las informaciones sobre {label}, pero una fuente central no es identificable o mezcla información tomada y aporte propio.",
        "La atribución sobre {label} remite a fuentes ajenas a las informaciones utilizadas o incumple las referencias centrales de {style}.",
        "No presenta atribución reconocible de las informaciones utilizadas sobre {label}."
      ]
    },
    "research": {
      "title": "Indagación sobre {label}",
      "weight": 3,
      "levels": [
        "Responde la pregunta sobre {label} mediante los materiales y registros dados, relaciona los hallazgos con las evidencias y delimita lo que esas evidencias permiten concluir.",
        "Relaciona los hallazgos centrales de {label} con la pregunta y las evidencias; una delimitación secundaria queda incompleta.",
        "Recoge información sobre {label}, pero una conclusión central no se vincula con la pregunta o sus evidencias.",
        "Presenta conclusiones sobre {label} contrarias a los registros dados o sin evidencia pertinente.",
        "No presenta hallazgos reconocibles de la indagación solicitada sobre {label}."
      ]
    },
    "data-record": {
      "title": "Registro de informaciones sobre {label}",
      "weight": 2,
      "levels": [
        "Registra las informaciones solicitadas de {label} conservando valores, categorías y procedencia del conjunto dado, sin convertir inferencias en datos observados.",
        "Conserva los datos centrales de {label} y su procedencia; falta una referencia secundaria sin alterar su significado.",
        "Registra parte de la información de {label}, pero una omisión o cambio central impide relacionarla con su procedencia.",
        "Altera valores o categorías centrales de {label} o presenta inferencias sin distinguirlas de los datos dados.",
        "No presenta un registro reconocible de las informaciones solicitadas de {label}."
      ]
    },
    "research-plan": {
      "title": "Propuesta de investigación sobre {label}",
      "weight": 3,
      "levels": [
        "Articula la pregunta sobre {label}, las fuentes o registros dados, los pasos y el producto previstos de modo que permitirían responderla; distingue planificación y resultados aún no obtenidos.",
        "La pregunta, fuentes y pasos centrales de {label} son coherentes; un componente secundario previsto queda poco desarrollado.",
        "Incluye componentes de investigación sobre {label}, pero un paso central o una fuente no responde a la pregunta.",
        "La pregunta y los pasos propuestos sobre {label} son incompatibles o presentan resultados supuestos como ya obtenidos.",
        "No presenta una propuesta reconocible de investigación sobre {label}."
      ]
    },
    "project-steps": {
      "title": "Selección de pasos sobre {label}",
      "weight": 2,
      "levels": [
        "Selecciona y ordena únicamente los pasos solicitados sobre {label} de acuerdo con su finalidad y dependencias en las opciones dadas.",
        "Selecciona los pasos centrales sobre {label} en orden coherente; una relación secundaria queda incompleta.",
        "Selecciona algunos pasos pertinentes sobre {label}, pero omite uno central o altera una dependencia necesaria.",
        "La selección u orden de pasos sobre {label} impide atender la finalidad dada.",
        "No presenta una selección reconocible de pasos sobre {label}."
      ]
    },
    "revision": {
      "title": "Corrección acotada de {label}",
      "weight": 2,
      "levels": [
        "Corrige únicamente {target} en el texto dado sobre {label}, atendiendo las observaciones y conservando los apartados no señalados.",
        "Corrige el problema central de {target} sobre {label}; queda un ajuste secundario sin modificar apartados ajenos.",
        "Corrige parte de {target} sobre {label}, pero deja una observación central sin resolver o cambia un apartado no solicitado.",
        "Los cambios sobre {label} no resuelven el problema central de {target} o sustituyen el texto por otro ajeno.",
        "No presenta una corrección reconocible de {target} sobre {label}."
      ]
    },
    "draft": {
      "title": "Borrador solicitado sobre {label}",
      "weight": 2,
      "levels": [
        "Redacta el borrador sobre {label} con las secciones y correcciones expresamente indicadas en la pauta, conservando la coherencia entre sus componentes y su carácter de propuesta.",
        "El borrador de {label} incorpora los componentes centrales de la pauta; un ajuste secundario queda incompleto.",
        "El borrador de {label} incluye parte de la pauta, pero omite o desvincula un componente central.",
        "El borrador de {label} contradice las correcciones o componentes centrales indicados en la pauta.",
        "No presenta un borrador reconocible sobre {label} según la pauta dada."
      ]
    },
    "newspaper": {
      "title": "Periódico escolar sobre {label}",
      "weight": 3,
      "levels": [
        "Organiza el problema dado de {label} en secciones y artículos coherentes, diferencia información y opinión y utiliza las evidencias proporcionadas sin presentar hechos ficticios como noticias reales.",
        "Las secciones y artículos centrales de {label} atienden el problema con evidencias; una conexión secundaria queda incompleta.",
        "Incluye secciones o artículos de {label}, pero falta una relación central con el problema o confunde información y opinión.",
        "Los artículos sobre {label} contradicen el material dado o su organización impide reconocer el problema abordado.",
        "No presenta un periódico escolar reconocible sobre {label}."
      ]
    },
    "newspaper-structure": {
      "title": "Estructura elegida del periódico sobre {label}",
      "weight": 2,
      "levels": [
        "Selecciona las secciones y su organización para el periódico sobre {label} y justifica cómo atienden el propósito dado, sin sustituir esta decisión por artículos completos.",
        "La estructura de {label} atiende el propósito central y su justificación; una relación secundaria queda incompleta.",
        "Selecciona secciones sobre {label}, pero una decisión central no responde al propósito o queda sin justificación.",
        "La estructura elegida sobre {label} es incompatible con el propósito o no permite reconocer las secciones solicitadas.",
        "No presenta una estructura reconocible del periódico sobre {label}."
      ]
    },
    "article": {
      "title": "Artículo sobre {label}",
      "weight": 3,
      "levels": [
        "El artículo de {label} expone el aporte solicitado relacionándolo con las evidencias dadas, con organización que permite seguir el contenido y sin inventar hechos.",
        "El artículo de {label} presenta el contenido central respaldado y organizado; una conexión secundaria queda incompleta.",
        "El artículo incluye información pertinente de {label}, pero omite un componente central o deja una afirmación central sin respaldo.",
        "El artículo sobre {label} contradice las evidencias centrales o desvincula la información de su propósito.",
        "No presenta un artículo reconocible sobre {label}."
      ]
    },
    "memory": {
      "title": "Memoria sobre {label}",
      "weight": 3,
      "levels": [
        "La memoria de {label} reconstruye las actuaciones solicitadas y su secuencia a partir de las fuentes dadas, con organización que permite seguir el contenido y sin inventar hechos.",
        "La memoria de {label} presenta el contenido central respaldado y organizado; una conexión secundaria queda incompleta.",
        "La memoria incluye información pertinente de {label}, pero omite un componente central o deja una afirmación central sin respaldo.",
        "La memoria sobre {label} contradice las evidencias centrales o desvincula la información de su propósito.",
        "No presenta una memoria reconocible sobre {label}."
      ]
    },
    "report": {
      "title": "Informe sobre {label}",
      "weight": 3,
      "levels": [
        "El informe de {label} sintetiza las funciones o informaciones solicitadas distinguiendo las evidencias dadas de las inferencias, con organización que permite seguir el contenido y sin inventar hechos.",
        "El informe de {label} presenta el contenido central respaldado y organizado; una conexión secundaria queda incompleta.",
        "El informe incluye información pertinente de {label}, pero omite un componente central o deja una afirmación central sin respaldo.",
        "El informe sobre {label} contradice las evidencias centrales o desvincula la información de su propósito.",
        "No presenta un informe reconocible sobre {label}."
      ]
    },
    "thesis": {
      "title": "Tesis sobre {label}",
      "weight": 3,
      "levels": [
        "Formula una tesis precisa sobre {label} que responde al problema solicitado y se mantiene como eje del ensayo.",
        "La tesis de {label} responde al problema y orienta el ensayo; una delimitación secundaria queda imprecisa.",
        "Presenta una postura sobre {label}, pero no delimita el problema central o no la mantiene en el desarrollo.",
        "La postura sobre {label} es incompatible con el problema solicitado o se contradice en el ensayo.",
        "No presenta una tesis reconocible sobre {label}."
      ]
    },
    "reason": {
      "title": "Razones sobre {label}",
      "weight": 3,
      "levels": [
        "Sostiene la posición sobre {label} con razones pertinentes y evidencias del caso o textos dados, explicando cómo la respaldan sin calificar adhesiones personales.",
        "Sostiene la posición central de {label} con razones y evidencias; un vínculo secundario queda poco desarrollado.",
        "Expresa razones sobre {label}, pero una afirmación central carece de respaldo o de relación con la posición.",
        "Las razones sobre {label} contradicen las evidencias centrales o solo apelan a preferencias sin relación con el caso.",
        "No presenta razones reconocibles que sustenten la posición sobre {label}."
      ]
    },
    "organization": {
      "title": "Organización del ensayo sobre {label}",
      "weight": 2,
      "levels": [
        "Organiza planteamiento, desarrollo y cierre del ensayo de {label} de modo que puede seguirse la relación entre tesis, razones y conclusión.",
        "La secuencia del ensayo de {label} permite seguir tesis y razones; una transición secundaria queda incompleta.",
        "El ensayo de {label} tiene partes reconocibles, pero una ruptura central impide seguir el razonamiento.",
        "La organización del ensayo de {label} desvincula la conclusión de la tesis y las razones.",
        "No presenta una organización reconocible del ensayo sobre {label}."
      ]
    },
    "response": {
      "title": "Respuesta en el intercambio sobre {label}",
      "weight": 2,
      "levels": [
        "Responde a las intervenciones u objeciones sobre {label} atendiendo su contenido y relacionando la respuesta con evidencias o razones del caso dado.",
        "Atiende las intervenciones centrales de {label} con razones pertinentes; una conexión secundaria queda incompleta.",
        "Responde parcialmente sobre {label}, pero evita una objeción central o no relaciona su respuesta con el caso.",
        "La respuesta de {label} no atiende la intervención o atribuye al interlocutor una afirmación que no hizo.",
        "No presenta una respuesta reconocible a las intervenciones sobre {label}."
      ]
    },
    "oral": {
      "title": "Comunicación oral de {label}",
      "weight": 2,
      "levels": [
        "Comunica oralmente la explicación solicitada de {label} en una secuencia comprensible y con referencias identificables a los materiales dados.",
        "La exposición oral de {label} permite seguir las ideas centrales; una transición secundaria dificulta el seguimiento.",
        "Comunica ideas pertinentes de {label}, pero una ruptura central de secuencia o referencia impide seguir la explicación.",
        "La exposición de {label} desvincula las ideas centrales o no permite comprender la explicación solicitada.",
        "No presenta una comunicación oral reconocible sobre {label}."
      ]
    },
    "proposal": {
      "title": "Propuesta pertinente sobre {label}",
      "weight": 3,
      "levels": [
        "Propone una respuesta al problema dado de {label}, precisa las acciones previstas solicitadas y justifica cómo atienden sus condiciones sin presentar la ejecución como realizada.",
        "La respuesta propuesta de {label} y las acciones centrales atienden el problema; una justificación secundaria queda incompleta.",
        "Propone acciones sobre {label}, pero una acción central no responde al problema o queda sin justificación.",
        "La propuesta de {label} contradice las condiciones centrales del problema o afirma resultados sin sustento.",
        "No presenta una propuesta reconocible sobre {label}."
      ]
    },
    "project-plan": {
      "title": "Proyecto de {label}",
      "weight": 3,
      "levels": [
        "Relaciona el problema de {label} con acciones, responsables y una forma de comprobar resultados previstos según la pauta dada, distinguiendo planificación y ejecución.",
        "Los componentes centrales del proyecto de {label} son coherentes; una relación secundaria de la planificación queda incompleta.",
        "Incluye componentes de proyecto sobre {label}, pero desvincula una acción o comprobación central del problema.",
        "El proyecto de {label} propone acciones incompatibles con el problema o presenta resultados supuestos como obtenidos.",
        "No presenta un proyecto reconocible sobre {label}."
      ]
    },
    "campaign-plan": {
      "title": "Campaña prevista sobre {label}",
      "weight": 3,
      "levels": [
        "Articula propósito, destinatarios, mensaje y acciones previstas de la campaña ficticia sobre {label} para atender el problema dado, sin exigir ejecución externa.",
        "Los componentes centrales de la campaña de {label} son coherentes; una relación secundaria queda poco desarrollada.",
        "Incluye componentes de campaña de {label}, pero el mensaje o una acción central no responde al propósito y destinatarios.",
        "La campaña de {label} contradice el problema dado o no permite relacionar mensaje, propósito y destinatarios.",
        "No presenta una campaña prevista reconocible sobre {label}."
      ]
    },
    "campaign-message": {
      "title": "Mensaje de campaña sobre {label}",
      "weight": 2,
      "levels": [
        "Redacta el mensaje solicitado de {label} con información pertinente y comprensible para los destinatarios dados, conservando el alcance del encargo sin añadir un plan completo.",
        "El mensaje de {label} comunica la idea central a los destinatarios; una precisión secundaria queda incompleta.",
        "El mensaje de {label} incluye información pertinente, pero una parte central resulta confusa para los destinatarios.",
        "El mensaje de {label} contradice el material dado o no responde a los destinatarios y propósito.",
        "No presenta un mensaje reconocible de campaña sobre {label}."
      ]
    },
    "brochure": {
      "title": "Brochure sobre {label}",
      "weight": 3,
      "levels": [
        "Organiza información y recomendaciones pertinentes de {label} en un brochure legible para los destinatarios dados, relacionando sus mensajes con los textos y el propósito solicitado.",
        "El brochure de {label} comunica información y recomendaciones centrales con organización legible; una conexión secundaria queda incompleta.",
        "Incluye información de {label}, pero una recomendación central carece de respaldo o la organización dificulta reconocer el mensaje.",
        "El brochure de {label} contradice información central de los textos o no permite reconocer las recomendaciones solicitadas.",
        "No presenta un brochure reconocible sobre {label}."
      ]
    },
    "organizer": {
      "title": "Organizador elegido sobre {label}",
      "weight": 3,
      "levels": [
        "Distingue en el cuadro sinóptico u organizador elegido las actuaciones solicitadas de {label}, utilizando categorías y relaciones respaldadas por los casos dados, sin exigir los dos formatos.",
        "El organizador distingue las categorías y relaciones centrales de {label}; una relación secundaria queda incompleta.",
        "El organizador incluye actuaciones de {label}, pero omite o confunde una categoría o relación central.",
        "Las categorías o relaciones centrales del organizador de {label} contradicen los casos dados.",
        "No presenta un organizador reconocible sobre {label}."
      ]
    },
    "electoral-procedure": {
      "title": "Procedimiento electoral simulado sobre {label}",
      "weight": 3,
      "levels": [
        "Ejecuta los pasos establecidos del proceso electoral ficticio de {label} y registra la decisión según las reglas dadas, sin calificar la opción elegida o el resultado ganador.",
        "Ejecuta y registra los pasos centrales del proceso electoral de {label}; omite un paso secundario sin cambiar la decisión registrada.",
        "Ejecuta parte del proceso electoral de {label}, pero omite un paso central o el registro no permite comprobar la regla aplicada.",
        "La actuación de {label} altera una regla central del proceso dado o registra una decisión distinta de la obtenida.",
        "No presenta una ejecución reconocible del procedimiento electoral simulado sobre {label}."
      ]
    },
    "decision-procedure": {
      "title": "Decisión democrática simulada sobre {label}",
      "weight": 3,
      "levels": [
        "Aplica el método y los turnos dados en la simulación de {label} y registra la decisión acordada según ese procedimiento, sin evaluar preferencias privadas.",
        "Aplica el método y los turnos centrales de {label}; una omisión secundaria no altera la decisión registrada.",
        "Aplica parte del procedimiento de {label}, pero omite un turno o paso central necesario para verificar la decisión.",
        "La actuación de {label} sustituye el método acordado o registra una decisión incompatible con el procedimiento dado.",
        "No presenta una aplicación reconocible del procedimiento de decisión sobre {label}."
      ]
    },
    "role-contribution": {
      "title": "Contribución del rol sobre {label}",
      "weight": 2,
      "levels": [
        "Realiza la contribución concreta de su rol acordado en la simulación de {label} según la pauta dada y la coordina con el momento previsto del procedimiento.",
        "Realiza la contribución central del rol de {label}; un ajuste secundario de coordinación queda incompleto.",
        "Realiza parte de la contribución del rol de {label}, pero omite una acción central prevista en la pauta.",
        "La contribución del rol de {label} es incompatible con la acción o el momento acordados en el procedimiento.",
        "No presenta una contribución reconocible del rol acordado sobre {label}."
      ]
    },
    "ritual-procedure": {
      "title": "Procedimiento ritual expresamente solicitado",
      "weight": 2,
      "levels": [
        "Ejecuta la secuencia y los roles dados para el izado de la bandera y la escucha del himno en la simulación, atendiendo únicamente las acciones observables de la pauta.",
        "Ejecuta las acciones centrales del procedimiento dado de bandera e himno; una omisión secundaria no altera la secuencia.",
        "Ejecuta parte de la secuencia de bandera e himno, pero omite un paso o rol central de la pauta.",
        "La actuación sobre bandera e himno contradice el orden o los roles centrales del procedimiento dado.",
        "No presenta una ejecución reconocible del procedimiento dado de bandera e himno."
      ]
    },
    "frequency": {
      "title": "Registro de frecuencia en la simulación de {label}",
      "weight": 2,
      "levels": [
        "Registra la frecuencia del cumplimiento observable de los turnos dados de {label}, conservando las ocasiones y categorías previstas en la pauta.",
        "Registra las ocasiones centrales del cumplimiento de turnos de {label}; falta una anotación secundaria sin alterar el patrón observado.",
        "Registra algunas ocasiones de {label}, pero una omisión central impide establecer la frecuencia pedida.",
        "El registro de {label} confunde las categorías u ocasiones y no representa la frecuencia observada.",
        "No presenta un registro reconocible de frecuencia sobre {label}."
      ]
    },
    "reliability-analysis": {
      "title": "Análisis de la confiabilidad de las páginas dadas",
      "weight": 3,
      "levels": [
        "Explica la confiabilidad de las páginas solicitadas relacionando autoría, procedencia y respaldo verificable con la información y el propósito dados.",
        "Relaciona la confiabilidad central de las páginas con autoría, procedencia o respaldo; una relación secundaria queda incompleta.",
        "Reconoce procedencia o respaldo de las páginas, pero no explica su relación con una conclusión central de confiabilidad.",
        "La conclusión de confiabilidad contradice la procedencia o el respaldo de las páginas dadas.",
        "No presenta un análisis reconocible de la confiabilidad de las páginas dadas."
      ]
    }
  }
}
