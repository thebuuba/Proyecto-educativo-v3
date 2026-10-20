import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV137 } from './catalog-v137'
/** Exact138 payload checked against Development, including the reviewed MT financial, statistical and calculus metadata. */
export const evaluationCatalogV138={...evaluationCatalogV137,optativeMathModules:[
  {
    "id": "matematica-tecnologia-optativa-4",
    "grade": 4,
    "cycle": 2,
    "subjectCode": "OPT-MT-4",
    "subjectName": "Matemática Financiera y Tecnología",
    "optativeExitName": "Matemática y Tecnología",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "834bd0b4-6611-5ff2-b31d-11d663152e0f",
    "pdfPages": [
      491,
      492,
      493
    ],
    "policy": "REQUESTED_FINANCIAL_ACCOUNTING_ACTIONS_GIVEN_CONVENTIONS_FICTIONAL_DATA_V1",
    "topics": [
      {
        "id": "progressions",
        "grade": 4,
        "label": "progresiones",
        "match": "progresion(?:es)?",
        "relation": "la regla y el orden de los términos de la progresión indicada, según los datos dados",
        "representation": "representa únicamente progresiones con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          493
        ],
        "sourceRecordIds": [
          "03b86d8a-c3b3-5915-ad1e-fb223f8707e6",
          "2b386065-50e5-57c0-ac51-b3314c71ae8d",
          "f05dd609-cf6a-5161-97a0-30286f70d263",
          "762fbdcd-a23c-51bd-98e4-93cd8c5cc494",
          "0e773920-fab9-569a-9a0e-98c39fb83966"
        ],
        "priority": 2
      },
      {
        "id": "saving",
        "grade": 4,
        "label": "ahorro",
        "match": "ahorro|ahorrar",
        "relation": "el objetivo, plazo y recursos ficticios disponibles para el ahorro solicitado, sin exigir información privada",
        "representation": "representa únicamente ahorro con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          493
        ],
        "sourceRecordIds": [
          "318baa7e-00f9-50e2-8c41-6a67422191af",
          "46f5c52b-2dc6-5aff-a8a5-79352646b2a9",
          "b29669aa-2c75-5fc4-9487-53d624c48019"
        ],
        "priority": 1
      },
      {
        "id": "compound-interest",
        "grade": 4,
        "label": "interés compuesto",
        "match": "interes(?:es)? compuest(?:o|os)",
        "relation": "el capital, la tasa por período y el número de períodos dados, distinguiendo el interés generado del capital y del monto, sin suponer una tasa nominal o efectiva no indicada",
        "representation": "representa únicamente interés compuesto con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          493
        ],
        "sourceRecordIds": [
          "8138bab4-0cfc-5edb-adc7-73b93ff3c1ee",
          "9aff2842-7b19-5e33-ac3c-b182656321c8",
          "ff658d99-6359-5cc4-9629-c289dea53268",
          "d1b750ef-c6e6-55b1-bb9f-f465266c722d",
          "a6bc7ff0-8802-5b93-9bca-f9616ffa7a79"
        ],
        "priority": 2
      },
      {
        "id": "compound-amount",
        "grade": 4,
        "label": "monto compuesto",
        "match": "monto(?:s)? compuest(?:o|os)",
        "relation": "el monto compuesto solicitado y su relación con el capital, la tasa y los períodos dados, distinguiendo la cantidad final del interés generado",
        "representation": "representa únicamente monto compuesto con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "9409f52c-3bbc-5614-b0b2-c698c45803fa",
          "907b9b3c-a05f-5291-85bd-937c88cf770a",
          "f759f757-3cc4-533e-90ad-b1954c92582e",
          "6a863d5c-1034-5f71-b7f7-2d43df084c17",
          "e9018f8b-2657-5f51-bd87-4ef40733419f",
          "6112fad5-8a6e-5579-accb-bdc342324c03"
        ],
        "priority": 2
      },
      {
        "id": "discount",
        "grade": 4,
        "label": "descuento",
        "match": "descuentos?",
        "relation": "el valor descontado, la tasa, el plazo y la convención de descuento proporcionada, sin sustituirla por otra no indicada",
        "representation": "representa únicamente descuento con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491
        ],
        "sourceRecordIds": [
          "141bd282-2048-5637-8538-f099531141a2",
          "7cdc6fcb-cee8-5e0b-bdc6-a29c6fe536eb"
        ],
        "priority": 2
      },
      {
        "id": "loans",
        "grade": 4,
        "label": "préstamos",
        "match": "prestamos?",
        "relation": "el capital prestado, los cargos, los plazos y las condiciones ficticias proporcionadas, sin asumir condiciones de un producto financiero real",
        "representation": "representa únicamente préstamos con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          493
        ],
        "sourceRecordIds": [
          "e84aa8a7-e1b7-563a-a848-bbbfdcf6c060",
          "a7ad272c-dade-51fe-b937-cf2af8dac9bf",
          "46f5c52b-2dc6-5aff-a8a5-79352646b2a9",
          "afe0d1da-9d4e-5694-96ed-99d3a2662844",
          "36eb05c2-8be4-5655-85ab-6abba12d8df3"
        ],
        "priority": 1
      },
      {
        "id": "cards",
        "grade": 4,
        "label": "tarjetas de crédito",
        "match": "tarjetas? de credito",
        "relation": "los cargos, pagos, plazos y condiciones ficticias de las tarjetas de crédito dadas, distinguiendo el saldo y los cargos sin solicitar números de cuenta",
        "representation": "representa únicamente tarjetas de crédito con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          493
        ],
        "sourceRecordIds": [
          "356ed7aa-27e1-56a5-a693-22f290fb2ace",
          "55ca3a5a-172d-5ba2-8cf1-4816e4ceea6a",
          "46f5c52b-2dc6-5aff-a8a5-79352646b2a9",
          "a6bc7ff0-8802-5b93-9bca-f9616ffa7a79",
          "0fb3cd37-c80f-57e3-be81-775791b8d44e"
        ],
        "priority": 1
      },
      {
        "id": "declining-interest",
        "grade": 4,
        "label": "intereses sobre saldos insolutos",
        "match": "interes(?:es)? sobre (?:el |los )?saldos? insolutos?|saldos? insolutos?",
        "relation": "la tasa y el saldo insoluto de cada período dado, distinguiendo el interés del período de la amortización del capital y conservando la convención indicada",
        "representation": "representa únicamente intereses sobre saldos insolutos con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          493
        ],
        "sourceRecordIds": [
          "5e5dd577-203f-56b6-8610-8ff405fdefa8",
          "ff658d99-6359-5cc4-9629-c289dea53268",
          "d1b750ef-c6e6-55b1-bb9f-f465266c722d",
          "a7ad272c-dade-51fe-b937-cf2af8dac9bf",
          "643d2c95-4c29-52f9-861a-80dfb5ad59ab",
          "1f5b7e00-511a-57f7-921c-c3feeb3c22b9"
        ],
        "priority": 2
      },
      {
        "id": "amortization",
        "grade": 4,
        "label": "tabla de amortización",
        "match": "tablas? de amortizacion|amortizacion",
        "relation": "el período, la cuota, el interés, el capital amortizado y el saldo de cada fila, según la convención, los datos y el redondeo dados",
        "representation": "representa únicamente tabla de amortización con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          493
        ],
        "sourceRecordIds": [
          "74582de9-16be-541b-a04e-f603cd7f7548",
          "7754dc7b-abca-5310-ab1d-1aa6e339ba74",
          "f7ca0d83-18d4-572d-8ccb-ce436c4fa1da"
        ],
        "priority": 3
      },
      {
        "id": "present-value",
        "grade": 4,
        "label": "valor presente",
        "match": "valor(?:es)? presentes?",
        "relation": "el valor presente solicitado y su equivalencia en la fecha indicada con la tasa, los períodos y la convención dados, sin inventar valores faltantes",
        "representation": "representa únicamente valor presente con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "7b9d5f3b-c3f0-5c91-8c7b-2882a7ff3e97",
          "0645bab0-78c4-59bc-b53d-ad76eace1ab9",
          "f759f757-3cc4-533e-90ad-b1954c92582e",
          "6112fad5-8a6e-5579-accb-bdc342324c03",
          "2c05acbc-93b3-54a2-8036-65cd4afda0a3"
        ],
        "priority": 2
      },
      {
        "id": "future-value",
        "grade": 4,
        "label": "valor futuro",
        "match": "valor(?:es)? futuros?",
        "relation": "el valor futuro solicitado en la fecha indicada con la tasa, los períodos y la convención dados, sin inventar valores faltantes",
        "representation": "representa únicamente valor futuro con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "7b9d5f3b-c3f0-5c91-8c7b-2882a7ff3e97",
          "0645bab0-78c4-59bc-b53d-ad76eace1ab9",
          "f759f757-3cc4-533e-90ad-b1954c92582e",
          "6112fad5-8a6e-5579-accb-bdc342324c03",
          "2c05acbc-93b3-54a2-8036-65cd4afda0a3"
        ],
        "priority": 2
      },
      {
        "id": "annuities",
        "grade": 4,
        "label": "anualidades",
        "match": "anualidad(?:es)?",
        "relation": "los pagos, el monto y la renta que solicite la tarea de anualidades, conservando la tasa, el plazo y el momento de los pagos dados, sin asumir una anualidad vencida o anticipada no indicada",
        "representation": "representa únicamente anualidades con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "9e0ada14-6833-56e2-a998-c3b7954f547e",
          "907b9b3c-a05f-5291-85bd-937c88cf770a",
          "87e917f8-3847-51a9-bce8-78f3442ff605",
          "f759f757-3cc4-533e-90ad-b1954c92582e",
          "6a863d5c-1034-5f71-b7f7-2d43df084c17",
          "2c05acbc-93b3-54a2-8036-65cd4afda0a3"
        ],
        "priority": 2
      },
      {
        "id": "accounting-cycle",
        "grade": 4,
        "label": "ciclo contable",
        "match": "ciclo contable",
        "relation": "el orden, la finalidad y las relaciones entre las etapas del ciclo contable que se indiquen en el caso ficticio",
        "representation": "representa únicamente ciclo contable con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "61f6da1e-07f0-573e-9aa9-05a06f24b96f",
          "5f3cc134-cb99-5468-8e9b-1ddc78d09cb8",
          "00496db5-540d-5806-8979-1862604a210a"
        ],
        "priority": 2
      },
      {
        "id": "account-classification",
        "grade": 4,
        "label": "clasificación y origen de las cuentas",
        "match": "clasificacion de (?:las )?cuentas|origen de (?:las )?cuentas|origenes de (?:las )?cuentas|cuentas dadas",
        "relation": "la naturaleza y el origen de las cuentas proporcionadas y la clasificación solicitada en el caso ficticio",
        "representation": "representa únicamente clasificación y origen de las cuentas con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492
        ],
        "sourceRecordIds": [
          "b7e149d7-0408-5023-aadc-dc7dc65d0905",
          "afde0107-6816-5243-a7f6-4b777444a9d8",
          "13255055-5c8b-511c-b4bf-2a5b83806db6"
        ],
        "priority": 2
      },
      {
        "id": "assets",
        "grade": 4,
        "label": "activo",
        "match": "activos?",
        "relation": "los recursos y derechos del activo de la empresa ficticia según las transacciones dadas",
        "representation": "representa únicamente activo con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "5ab031a3-3e38-5c61-96a7-0fd8855f7d50",
          "96ffb06d-6a42-5e70-87a8-de7a74721079",
          "da8a6858-b583-5683-b94f-04770d343859"
        ],
        "priority": 2
      },
      {
        "id": "liabilities",
        "grade": 4,
        "label": "pasivo",
        "match": "pasivos?",
        "relation": "las obligaciones del pasivo de la empresa ficticia según las transacciones dadas",
        "representation": "representa únicamente pasivo con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "d87ba364-ff78-5159-a372-97883bd01407",
          "96ffb06d-6a42-5e70-87a8-de7a74721079",
          "da8a6858-b583-5683-b94f-04770d343859"
        ],
        "priority": 2
      },
      {
        "id": "equity",
        "grade": 4,
        "label": "capital contable",
        "match": "capital contable|capital de (?:la )?empresa|activo[^.;]*pasivo[^.;]*capital",
        "relation": "la participación del capital contable y su relación con el activo y el pasivo del caso ficticio, sin confundirlo con un capital invertido a interés",
        "representation": "representa únicamente capital contable con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "a7972766-2fe3-5bee-9dff-dc37186edadd",
          "96ffb06d-6a42-5e70-87a8-de7a74721079",
          "da8a6858-b583-5683-b94f-04770d343859"
        ],
        "priority": 2
      },
      {
        "id": "income-costs-expenses",
        "grade": 4,
        "label": "ingresos, costos y gastos",
        "match": "ingresos?[, y]+costos?|costos?[, y]+gastos?",
        "relation": "la naturaleza de los ingresos, costos y gastos dados, manteniendo sus diferencias según el caso ficticio",
        "representation": "representa únicamente ingresos, costos y gastos con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491
        ],
        "sourceRecordIds": [
          "5bbc0a11-d46e-5b21-9199-fd38fbabec51"
        ],
        "priority": 1
      },
      {
        "id": "debit-credit",
        "grade": 4,
        "label": "cuentas de débito y crédito",
        "match": "debitos?|creditos?",
        "relation": "el lado de débito o crédito de las cuentas proporcionadas según su naturaleza y las transacciones dadas",
        "representation": "representa únicamente cuentas de débito y crédito con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491
        ],
        "sourceRecordIds": [
          "626b76ec-aa3d-51b2-a369-22927aea9262"
        ],
        "priority": 1
      },
      {
        "id": "journal",
        "grade": 4,
        "label": "diario general",
        "match": "(?:libro (?:del )?)?diario(?: general)?",
        "relation": "la fecha, las cuentas, las contrapartidas y los importes de las transacciones ficticias dadas, conservando el equilibrio entre débitos y créditos y sus referencias",
        "representation": "representa únicamente diario general con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "12ae3f67-6496-51c9-913f-ff4771b77ae7",
          "0f67507e-c627-5f53-9202-117f97e64774",
          "edf8399a-1e62-5e36-a83b-7a56d29e7392"
        ],
        "priority": 3
      },
      {
        "id": "ledger",
        "grade": 4,
        "label": "mayor general",
        "match": "(?:libro (?:del )?)?mayor general",
        "relation": "los movimientos de cada cuenta, sus referencias y su saldo según los registros ficticios proporcionados, sin duplicar ni omitir transacciones",
        "representation": "representa únicamente mayor general con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "27a1004f-1602-5e7e-baae-f790c47c76bc",
          "0f67507e-c627-5f53-9202-117f97e64774",
          "edf8399a-1e62-5e36-a83b-7a56d29e7392"
        ],
        "priority": 3
      },
      {
        "id": "trial-balance",
        "grade": 4,
        "label": "balance de comprobación",
        "match": "balance de comprobacion|balanza de comprobacion",
        "relation": "los saldos de las cuentas proporcionadas y la igualdad de los totales de débito y crédito, contrastándolos con sus registros sin inventar una diferencia",
        "representation": "representa únicamente balance de comprobación con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "0d8f73ab-15b6-5a2d-93bd-aaeb6d44b3b5",
          "26181e70-9e1d-5466-9654-31f7128330b9",
          "4e9fb2ce-0118-5d70-a5fa-1437c866e43c"
        ],
        "priority": 3
      },
      {
        "id": "financial-statements",
        "grade": 4,
        "label": "estados financieros",
        "match": "estados financieros",
        "relation": "los estados financieros expresamente indicados por la pauta y la coherencia de sus cifras con los registros ficticios proporcionados, sin exigir otros productos",
        "representation": "representa únicamente estados financieros con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "2c9c1cff-b3a0-5076-b002-d4cff774f103",
          "b19da910-ca67-5471-9513-6104647546b1",
          "d5071340-4693-5abd-842d-22d81f48fcbd"
        ],
        "priority": 3
      },
      {
        "id": "income-statement",
        "grade": 4,
        "label": "estado de resultado",
        "match": "estado de resultados?|ganancia o perdida neta|rentabilidad",
        "relation": "los ingresos, costos, gastos y el resultado neto del período dado, distinguiendo una ganancia de una pérdida con los registros ficticios proporcionados",
        "representation": "representa únicamente estado de resultado con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "a127f158-0598-5508-b013-26fb7abbb48a",
          "ff00828e-75fa-5a12-9cb9-60ab4a7201fa",
          "9138a84d-4ba4-5d2b-879e-475884b9acda"
        ],
        "priority": 3
      },
      {
        "id": "financial-position",
        "grade": 4,
        "label": "estado de situación",
        "match": "estado de situacion|balance general|balanza general",
        "relation": "la posición financiera en la fecha indicada y la igualdad entre activo, pasivo y capital contable del caso ficticio, conservando las cuentas y valores dados",
        "representation": "representa únicamente estado de situación con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "b65f2825-1d93-5ebf-be4b-d639f5f15f8b",
          "c2a3afa3-9f1c-56c2-b028-7391a013981e",
          "03e47e3d-7b4f-5adb-bf61-31f5a9603ed5"
        ],
        "priority": 3
      },
      {
        "id": "budget",
        "grade": 4,
        "label": "presupuesto",
        "match": "presupuestos?",
        "relation": "los ingresos, gastos, beneficios si existen y las etapas indicadas para el presupuesto del personaje o familia ficticios, conservando el período y los recursos dados",
        "representation": "representa únicamente presupuesto con los datos y condiciones dados, conservando sus referencias y magnitudes",
        "pages": [
          491,
          492,
          493
        ],
        "sourceRecordIds": [
          "dfc7e90c-0140-5637-be36-ca5e20c751ef",
          "9712d910-5d64-5cb2-b569-ed43ded2387c",
          "f9b260b8-347c-5593-b5eb-aa50ec11465c"
        ],
        "priority": 3
      }
    ]
  },
  {
    "id": "estadistica-probabilidad-tecnologia-optativa-5",
    "grade": 5,
    "cycle": 2,
    "subjectCode": "OPT-MT-5",
    "subjectName": "Estadística Probabilidad y Tecnología",
    "optativeExitName": "Matemática y Tecnología",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "87268d19-5d32-5426-9396-21ae21fc5bbd",
    "pdfPages": [
      494,
      495
    ],
    "policy": "REQUESTED_STATISTICAL_PROBABILISTIC_EVIDENCE_GIVEN_DATA_ASSUMPTIONS_V1",
    "topics": [
      {
        "id": "statistics",
        "grade": 5,
        "label": "estadística descriptiva e inferencial",
        "match": "estadistic[ao]s?|naturaleza de la estadistica",
        "relation": "la diferencia entre describir los datos disponibles e inferir sobre una población bajo los supuestos del diseño dado",
        "representation": "representa estadística descriptiva e inferencial conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "6043f659-ffce-5982-b387-922a93c66ed4",
          "ac93dfb7-109b-5f09-aa4d-d60fd6570a79",
          "968562f9-8730-5c7c-ba0e-ccb8e52c1183",
          "ef03683a-3a97-5735-8a5d-a51c6ce16c3c",
          "3407f5c7-6b03-54c5-b697-e1886ab664b6"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "descriptive-methods",
        "grade": 5,
        "label": "métodos descriptivos",
        "match": "metodos? descriptivos?",
        "relation": "los métodos descriptivos solicitados y sus objetivos en los ejemplos dados",
        "representation": "representa métodos descriptivos conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "ac93dfb7-109b-5f09-aa4d-d60fd6570a79",
          "968562f9-8730-5c7c-ba0e-ccb8e52c1183",
          "ef03683a-3a97-5735-8a5d-a51c6ce16c3c"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "variables",
        "grade": 5,
        "label": "variables estadísticas",
        "match": "variables?(?: estadisticas?)?|tipos? de variables?",
        "relation": "la naturaleza de las variables estadísticas proporcionadas y las categorías pertinentes al caso",
        "representation": "representa variables estadísticas conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "546135e6-f06c-59d1-905b-9d199b7bbc72"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": [],
        "exclude": "variable aleatoria"
      },
      {
        "id": "population",
        "grade": 5,
        "label": "población",
        "match": "poblacion(?:es)?",
        "relation": "la población objetivo delimitada por el caso ficticio dado",
        "representation": "representa población conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "a46b86a0-0a7e-54ab-898b-14a7182e88e0"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "sample",
        "grade": 5,
        "label": "muestra",
        "match": "muestras?",
        "relation": "la muestra, la población objetivo y la justificación del diseño suministrado; no se exigen encuestas privadas",
        "representation": "representa muestra conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "a46b86a0-0a7e-54ab-898b-14a7182e88e0",
          "aeced235-479c-5371-be7d-7ae94e7e1f0c",
          "2c77e1bc-5d55-5f36-acd9-89e6c40db2dd"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": [],
        "exclude": "tamano de (?:la )?muestra"
      },
      {
        "id": "sample-size",
        "grade": 5,
        "label": "tamaño de la muestra",
        "match": "tamano (?:de (?:la )?muestra|muestral)",
        "relation": "la fórmula y todos los parámetros proporcionados para el tamaño de la muestra, sin fijar niveles de confianza ni márgenes de error no indicados",
        "representation": "representa tamaño de la muestra conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "a46b86a0-0a7e-54ab-898b-14a7182e88e0",
          "b32f6ef6-87b8-5a88-8c87-4152f9968a49",
          "eac979ec-ded3-543a-8bb0-b9e935eaae8f"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "organization",
        "grade": 5,
        "label": "organización de datos y métodos tabulares",
        "match": "organizacion de datos|metodos? tabulares?",
        "relation": "los valores, las categorías y el tamaño del conjunto de datos dado",
        "representation": "representa organización de datos y métodos tabulares conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "418690db-7b53-51a6-9559-236d229d06ef",
          "3c1b8e04-1d60-5f03-8af2-3dd23ad6dfaf"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "frequencies",
        "grade": 5,
        "label": "distribución de frecuencias",
        "match": "frecuencias?|distribucion de frecuencias",
        "relation": "las frecuencias, el tamaño del conjunto y las categorías de los datos proporcionados, sin alterar los valores originales",
        "representation": "representa distribución de frecuencias conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "34a906d9-c26c-5bc1-afe0-158466255c9b",
          "3c1b8e04-1d60-5f03-8af2-3dd23ad6dfaf",
          "63a4e8b1-b26e-55e9-b560-d9239c5bc079",
          "3b6b34e5-9e50-5d61-b091-3ea71c10ed01"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "charts",
        "grade": 5,
        "label": "gráficas estadísticas",
        "match": "grafic[ao]s?(?: estadistic[ao]s?)?",
        "relation": "las gráficas, los ejes, las escalas, las etiquetas y los valores proporcionados, distinguiendo la lectura de la construcción de otra gráfica",
        "representation": "representa gráficas estadísticas conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "9bf6b54c-c625-59b4-b705-c76d0750226e",
          "63a4e8b1-b26e-55e9-b560-d9239c5bc079",
          "b241cc36-8188-5202-b7ab-a93732e03e21",
          "3b6b34e5-9e50-5d61-b091-3ea71c10ed01",
          "c9109b26-2230-5f6d-822c-02aa2fc04110"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "parameters",
        "grade": 5,
        "label": "parámetros estadísticos",
        "match": "parametros? estadisticos?",
        "relation": "los parámetros estadísticos dados y su referencia a la población, distinguiéndolos de un estadístico muestral",
        "representation": "representa parámetros estadísticos conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "8e1b068d-5eae-5e5e-b10c-7e84bedb202c"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "central",
        "grade": 5,
        "label": "medidas de tendencia central",
        "match": "tendencia central",
        "relation": "la medida de tendencia central solicitada y su pertinencia para los datos, sin exigir otras medidas",
        "representation": "representa medidas de tendencia central conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b7fba731-aeb6-5466-bec3-32a5aca08167",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "arithmetic-mean",
        "grade": 5,
        "label": "media aritmética",
        "match": "media aritmetica",
        "relation": "el significado y el método indicado para media aritmética, con los datos dados y las condiciones de validez del método, sin agregar otras medidas",
        "representation": "representa media aritmética conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b7fba731-aeb6-5466-bec3-32a5aca08167",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e",
          "9e5fbcff-0a4e-5fac-a7ab-aeeef7cedd62"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "geometric-mean",
        "grade": 5,
        "label": "media geométrica",
        "match": "media geometrica",
        "relation": "el significado y el método indicado para media geométrica, con los datos dados y las condiciones de validez del método, sin agregar otras medidas",
        "representation": "representa media geométrica conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b7fba731-aeb6-5466-bec3-32a5aca08167",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "harmonic-mean",
        "grade": 5,
        "label": "media armónica",
        "match": "media armonica",
        "relation": "el significado y el método indicado para media armónica, con los datos dados y las condiciones de validez del método, sin agregar otras medidas",
        "representation": "representa media armónica conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b7fba731-aeb6-5466-bec3-32a5aca08167",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "median",
        "grade": 5,
        "label": "mediana",
        "match": "medianas?",
        "relation": "el significado y el método indicado para mediana, con los datos dados y las condiciones de validez del método, sin agregar otras medidas",
        "representation": "representa mediana conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b7fba731-aeb6-5466-bec3-32a5aca08167",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "mode",
        "grade": 5,
        "label": "moda",
        "match": "modas?",
        "relation": "el significado y el método indicado para moda, con los datos dados y las condiciones de validez del método, sin agregar otras medidas",
        "representation": "representa moda conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b7fba731-aeb6-5466-bec3-32a5aca08167",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "position",
        "grade": 5,
        "label": "medidas de posición",
        "match": "medidas? de posicion",
        "relation": "la posición solicitada en el conjunto ordenado y el método proporcionado",
        "representation": "representa medidas de posición conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "0c864b48-c3a5-5ad6-b0ed-99915abc8d50",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "quartiles",
        "grade": 5,
        "label": "cuartiles",
        "match": "cuartil(?:es)?",
        "relation": "la posición de cuartiles solicitada y el método de localización dado, sin exigir otra medida de posición",
        "representation": "representa cuartiles conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "0c864b48-c3a5-5ad6-b0ed-99915abc8d50",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "quintiles",
        "grade": 5,
        "label": "quintiles",
        "match": "quintil(?:es)?",
        "relation": "la posición de quintiles solicitada y el método de localización dado, sin exigir otra medida de posición",
        "representation": "representa quintiles conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "0c864b48-c3a5-5ad6-b0ed-99915abc8d50",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "percentiles",
        "grade": 5,
        "label": "percentiles",
        "match": "percentil(?:es)?",
        "relation": "la posición de percentiles solicitada y el método de localización dado, sin exigir otra medida de posición",
        "representation": "representa percentiles conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "0c864b48-c3a5-5ad6-b0ed-99915abc8d50",
          "cca9fb85-b10d-55f5-88c1-f9bb1bac2d93",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "dispersion",
        "grade": 5,
        "label": "medidas de dispersión",
        "match": "dispersion",
        "relation": "la dispersión solicitada de los datos y la convención proporcionada, sin imponer otra medida",
        "representation": "representa medidas de dispersión conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "92c41e67-e67c-5309-9ad8-1d1a116474f9",
          "e9093413-0a74-5b56-a036-2427bd407c1d",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "range",
        "grade": 5,
        "label": "rango",
        "match": "rango",
        "relation": "la diferencia entre el máximo y el mínimo del conjunto dado, sin agregar otras medidas no solicitadas",
        "representation": "representa rango conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "92c41e67-e67c-5309-9ad8-1d1a116474f9",
          "e9093413-0a74-5b56-a036-2427bd407c1d",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "population-variance",
        "grade": 5,
        "label": "varianza poblacional",
        "match": "varianza poblacional",
        "relation": "la varianza poblacional y su denominador según la convención proporcionada, sin agregar otras medidas no solicitadas",
        "representation": "representa varianza poblacional conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "92c41e67-e67c-5309-9ad8-1d1a116474f9",
          "e9093413-0a74-5b56-a036-2427bd407c1d",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "sample-variance",
        "grade": 5,
        "label": "varianza muestral",
        "match": "varianza muestral",
        "relation": "la varianza muestral y su denominador según la convención proporcionada, sin agregar otras medidas no solicitadas",
        "representation": "representa varianza muestral conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "92c41e67-e67c-5309-9ad8-1d1a116474f9",
          "e9093413-0a74-5b56-a036-2427bd407c1d",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "variance",
        "grade": 5,
        "label": "varianza",
        "match": "varianza(?! (?:poblacional|muestral))",
        "relation": "la varianza bajo la convención explícita dada, sin decidir por defecto entre población y muestra, sin agregar otras medidas no solicitadas",
        "representation": "representa varianza conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "92c41e67-e67c-5309-9ad8-1d1a116474f9",
          "e9093413-0a74-5b56-a036-2427bd407c1d",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "mean-deviation",
        "grade": 5,
        "label": "desviación media",
        "match": "desviacion media",
        "relation": "la desviación media respecto de la referencia indicada en el método dado, sin agregar otras medidas no solicitadas",
        "representation": "representa desviación media conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "92c41e67-e67c-5309-9ad8-1d1a116474f9",
          "e9093413-0a74-5b56-a036-2427bd407c1d",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "standard-deviation",
        "grade": 5,
        "label": "desviación estándar",
        "match": "desviacion (?:estandar|tipica)",
        "relation": "la desviación estándar bajo la convención proporcionada y sus unidades respecto de los datos, sin agregar otras medidas no solicitadas",
        "representation": "representa desviación estándar conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "92c41e67-e67c-5309-9ad8-1d1a116474f9",
          "e9093413-0a74-5b56-a036-2427bd407c1d",
          "feafabce-eec6-55a4-8fed-280b25548928",
          "3249a96d-c240-528f-a219-4fe081524a13",
          "d62ec3cd-41c9-5d10-be55-6c55ab73d78e"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "probability",
        "grade": 5,
        "label": "probabilidad",
        "match": "probabilidad(?:es)?",
        "relation": "la probabilidad del evento, los datos y los supuestos proporcionados, reconociendo la incertidumbre del caso; una probabilidad no constituye certeza",
        "representation": "representa probabilidad conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "85c359c0-d99f-5c08-bb5a-eebc336a0ec1",
          "928ea565-adf8-5778-9821-e04e7a4b9410",
          "b4820d22-4d1d-541f-90c0-1a56c390a110",
          "dbc420c4-1de4-5d0d-8ad7-1f087aa777c0",
          "779387ca-eb2a-5894-8a29-5b2bd6e15af7"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "theoretical-probability",
        "grade": 5,
        "label": "probabilidad teórica",
        "match": "probabilidad teorica|metodo teorico|modelo teorico",
        "relation": "la probabilidad teórica bajo el modelo y los supuestos dados, sin imponer equiprobabilidad cuando no está indicada",
        "representation": "representa probabilidad teórica conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "85c359c0-d99f-5c08-bb5a-eebc336a0ec1",
          "b4820d22-4d1d-541f-90c0-1a56c390a110",
          "1a061cc6-c675-5e6a-90e8-e2071df37bc7",
          "bd921971-7d00-57ad-b64d-bf4559dc3175",
          "fe97741f-c1f7-55c3-9493-6a7dcb78f9af"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "experimental-probability",
        "grade": 5,
        "label": "probabilidad experimental",
        "match": "probabilidad experimental",
        "relation": "las frecuencias del evento y el número de repeticiones dados, distinguiendo la estimación experimental de un valor teórico exacto",
        "representation": "representa probabilidad experimental conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "85c359c0-d99f-5c08-bb5a-eebc336a0ec1",
          "b4820d22-4d1d-541f-90c0-1a56c390a110",
          "ce29f37d-6680-5a07-b549-75934edc4362"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "sample-space",
        "grade": 5,
        "label": "eventos y espacio muestral",
        "match": "espacio muestral|eventos? simples?",
        "relation": "los eventos y el espacio muestral del experimento proporcionado",
        "representation": "representa eventos y espacio muestral conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "f90f3b9f-d5f4-587c-9f09-65bb548fcd8a",
          "6f8cd9cd-ce6c-5dc5-bf2b-41c08db97d7f",
          "779387ca-eb2a-5894-8a29-5b2bd6e15af7"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "dependence",
        "grade": 5,
        "label": "eventos dependientes e independientes",
        "match": "dependientes?|independientes?",
        "relation": "las condiciones de los eventos dependientes o independientes del experimento dado, sin asumir independencia por defecto",
        "representation": "representa eventos dependientes e independientes conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "dea0fb98-de4b-5c1c-b864-2dabd93cf06d",
          "682e98c5-6206-5d18-9a31-b72e17028db5",
          "7219676f-632b-5402-9160-1b040c07bced"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "compound-events",
        "grade": 5,
        "label": "eventos compuestos",
        "match": "eventos? (?:simples? (?:y |o ))?compuestos?",
        "relation": "los eventos simples o compuestos indicados y las condiciones del experimento dado",
        "representation": "representa eventos compuestos conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "8b4789e6-1bda-5755-b120-561106028e10",
          "6f8cd9cd-ce6c-5dc5-bf2b-41c08db97d7f",
          "779387ca-eb2a-5894-8a29-5b2bd6e15af7"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "conditional",
        "grade": 5,
        "label": "probabilidad condicional",
        "match": "probabilidad condicional|evento condicionante",
        "relation": "el evento condicionante y la probabilidad condicional con los datos dados, sin asumir independencia por defecto",
        "representation": "representa probabilidad condicional conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "79e55365-24b6-5d90-9a68-54ea5cebf966",
          "0165ed6e-bd7a-5ad9-9847-5910d5763f66"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "probability-distributions",
        "grade": 5,
        "label": "distribución de probabilidad",
        "match": "distribucion(?:es)? de probabilidad|distribucion (?:dada|indicada)",
        "relation": "la distribución de probabilidad y sus parámetros dados, conservando los supuestos y los límites del modelo proporcionado",
        "representation": "representa distribución de probabilidad conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "11f8f3d8-ebfe-58c1-91d9-0666153f9987",
          "f49139b3-2305-569e-aa1f-be7f9584a474",
          "1a061cc6-c675-5e6a-90e8-e2071df37bc7"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "expectation",
        "grade": 5,
        "label": "esperanza matemática",
        "match": "esperanza(?: matematica)?",
        "relation": "los valores y las probabilidades de la distribución dada y el significado de la esperanza matemática",
        "representation": "representa esperanza matemática conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "11f8f3d8-ebfe-58c1-91d9-0666153f9987"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "sampling",
        "grade": 5,
        "label": "muestreo aleatorio",
        "match": "muestreo(?: aleatorio)?|metodos? de muestreo",
        "relation": "el método de muestreo, la población objetivo, la aleatoriedad, la representatividad y el sesgo bajo el diseño dado",
        "representation": "representa muestreo aleatorio conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b32f6ef6-87b8-5a88-8c87-4152f9968a49",
          "293488a5-0f8c-51fa-b574-9006bc286293",
          "2c77e1bc-5d55-5f36-acd9-89e6c40db2dd",
          "55b88293-a0d0-5a51-bf2b-380e71c531ac"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "sampling-distributions",
        "grade": 5,
        "label": "distribuciones de muestreo",
        "match": "distribucion(?:es)? de muestreo",
        "relation": "las distribuciones de muestreo y sus supuestos dados, con límites de representatividad y posibles fuentes de sesgo",
        "representation": "representa distribuciones de muestreo conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "db0c8e1e-d8f5-57da-9128-5d16cc6fe510",
          "293488a5-0f8c-51fa-b574-9006bc286293"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "correlation",
        "grade": 5,
        "label": "correlación lineal simple",
        "match": "correlacion(?: lineal(?: simple)?)?",
        "relation": "la dirección y la intensidad de la asociación de los datos dados: la correlación no implica causalidad",
        "representation": "representa correlación lineal simple conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "1b180cfa-6f62-5d35-a16e-146ee45aadc9",
          "01751aac-e4e2-5d85-9c9e-15fd3baa7ecd",
          "bdd2ab45-5376-553c-9e22-a71bb08e0133"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "correlation-coefficient",
        "grade": 5,
        "label": "coeficiente de correlación lineal simple",
        "match": "coeficiente de correlacion",
        "relation": "el signo, la magnitud y los límites del coeficiente de correlación dado: la correlación no implica causalidad",
        "representation": "representa coeficiente de correlación lineal simple conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "82d7666e-9648-54ba-9b0d-84c9e8bd7f0f",
          "bdd2ab45-5376-553c-9e22-a71bb08e0133"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "regression",
        "grade": 5,
        "label": "regresión lineal simple",
        "match": "regresion(?: lineal(?: simple)?)?",
        "relation": "el modelo de regresión, los parámetros y el dominio proporcionados, sin atribuir causalidad ni extrapolar fuera de las condiciones dadas",
        "representation": "representa regresión lineal simple conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "1b180cfa-6f62-5d35-a16e-146ee45aadc9",
          "2870464f-8872-5d64-be31-d1cef29a418f",
          "0ce429d5-1386-543d-842f-02f25bb54dea"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "project",
        "grade": 5,
        "label": "proyecto estadístico",
        "match": "proyecto estadistico",
        "relation": "la pregunta del proyecto estadístico ficticio, los datos suministrados, el método y las conclusiones respaldadas, sin exigir encuestas personales",
        "representation": "representa proyecto estadístico conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "eb9be78d-639c-5694-a8a0-588991332c6d",
          "994daef7-99f3-5c99-ab62-dc9b16f5af65"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "results",
        "grade": 5,
        "label": "resultados estadísticos",
        "match": "resultados? estadisticos?|informe escrito (?:de )?resultados",
        "relation": "los resultados estadísticos y las conclusiones del trabajo proporcionado, relacionados con los datos y sus límites",
        "representation": "representa resultados estadísticos conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "eb9be78d-639c-5694-a8a0-588991332c6d",
          "3d5c7518-abe5-5608-b765-3503a22c9103",
          "994daef7-99f3-5c99-ab62-dc9b16f5af65"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "work-review",
        "grade": 5,
        "label": "fortalezas y mejoras del trabajo estadístico",
        "match": "fortalezas?|(?:puntos? de )?mejoras?",
        "relation": "una fortaleza y una mejora comprobable de la solución estadística concreta, sustentadas en sus procedimientos y resultados",
        "representation": "representa fortalezas y mejoras del trabajo estadístico conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b3cc92da-068b-5d73-baaa-500e23c1a7fe"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "simulation",
        "grade": 5,
        "label": "simulación del experimento aleatorio",
        "match": "simul(?:a|an|ar|e|en)|simulacion(?:es)?",
        "relation": "el protocolo, las repeticiones y las frecuencias del experimento aleatorio dado, distinguiendo variación muestral y resultado teórico",
        "representation": "representa simulación del experimento aleatorio conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "ce29f37d-6680-5a07-b549-75934edc4362",
          "bd921971-7d00-57ad-b64d-bf4559dc3175",
          "fe97741f-c1f7-55c3-9493-6a7dcb78f9af"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "random-variable",
        "grade": 5,
        "label": "variable aleatoria",
        "match": "variables? aleatorias?",
        "relation": "la variable aleatoria, sus posibles valores y el experimento dado",
        "representation": "representa variable aleatoria conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "49c95bf9-963a-5248-b0b0-c7269fd9b2a1"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "normal-model",
        "grade": 5,
        "label": "curva normal",
        "match": "curva normal|modelo normal|supuesto normal",
        "relation": "la curva normal y sus características bajo el supuesto normal explícito del modelo proporcionado; normalizar datos no prueba normalidad",
        "representation": "representa curva normal conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "b6ca419d-dae1-5fcc-81b0-88137780bae9"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "statistical-analysis",
        "grade": 5,
        "label": "análisis estadístico",
        "match": "analisis estadistico",
        "relation": "las conclusiones del análisis estadístico dado y los argumentos respaldados por sus datos, conservando los límites de la información disponible",
        "representation": "representa estadística descriptiva e inferencial conservando los datos, las escalas y las referencias indicadas",
        "pages": [
          494,
          495
        ],
        "sourceRecordIds": [
          "6043f659-ffce-5982-b387-922a93c66ed4",
          "3407f5c7-6b03-54c5-b697-e1886ab664b6"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      }
    ]
  },
  {
    "id": "trigonometria-calculo-diferencial-tecnologia-optativa-6",
    "grade": 6,
    "cycle": 2,
    "subjectCode": "OPT-MT-6",
    "subjectName": "Tigonometría, Cálculo Diferencial y Tecnología",
    "optativeExitName": "Matemática y Tecnología",
    "modalityCodes": [
      "academic",
      "general"
    ],
    "sourceScopeId": "09e061a8-e3e7-55d8-a7ce-c24364f19401",
    "pdfPages": [
      496,
      497
    ],
    "policy": "REQUESTED_POLAR_QUADRIC_VECTOR_EVIDENCE_GIVEN_DOMAINS_CONDITIONAL_CONTRIBUTIONS_V1",
    "topics": [
      {
        "id": "polar-coordinates",
        "grade": 6,
        "label": "coordenadas polares",
        "match": "coordenadas? polares?|sistema polar|representaciones? polares?",
        "relation": "el radio, el ángulo, las unidades y el dominio indicados del sistema polar, admitiendo representaciones equivalentes bajo las condiciones dadas",
        "representation": "representa los puntos o relaciones polares efectivamente solicitados, con sus referencias y dominios",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "ea2f9456-33dd-5dff-8475-8a1c80b298f4",
          "b71848dc-f857-5c5d-9795-47d67c29b7dd",
          "db9d1c3c-cde6-57c9-86f8-47c0005af7cc",
          "061e74dd-1aa4-5135-8b02-9ca12c7d2cf5",
          "7a2183a0-f8a3-5afb-a259-be466110370b",
          "ba6c9374-4acc-5015-96b5-649aaf8d72fc",
          "da38bd24-10db-5dcf-974c-93f95a0bdb56",
          "9e7f554c-8bc4-5024-bd0b-5274ffbd6230",
          "f927c34a-c28b-55bc-813f-0f2d2399203d",
          "beb8dbf9-0d1c-5e0c-8453-8fcadb6b9c2b",
          "061b43a6-c224-5047-88fa-f394f81bea4e",
          "4f7fa700-d959-5990-9cd0-e4730ffedcfc"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "polar-graph",
        "grade": 6,
        "label": "gráfica de la ecuación polar",
        "match": "grafic[ao]s?[^.;]*polar|ecuacion(?:es)? polar(?:es)?",
        "relation": "la ecuación polar y su gráfica según el intervalo y las unidades dados, distinguiendo interpretar una gráfica proporcionada de construir otra",
        "representation": "traza únicamente la gráfica solicitada de la ecuación polar, con intervalo angular, unidades y referencias indicados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "43cac993-35e8-5d55-b696-a03776944d1a",
          "25ff2813-c983-594e-8fcb-a115db24b58f"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "equation-conversion",
        "grade": 6,
        "label": "transformación de ecuaciones rectangulares y polares",
        "match": "(?:transform|convier|convert)\\w*[^.;]*ecuacion|ecuacion(?:es)? rectangular(?:es)?",
        "relation": "la equivalencia de la ecuación rectangular y su forma polar bajo las identidades y restricciones del dominio proporcionadas, sin omitir o introducir soluciones",
        "representation": "representa la misma ecuación en el sistema solicitado, conservando equivalencias y restricciones dadas",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "c39d1c64-563a-53e2-a633-4b775068eaeb",
          "25ff2813-c983-594e-8fcb-a115db24b58f",
          "bf97d83b-ac18-57b0-817b-feceef697d07"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "point-conversion",
        "grade": 6,
        "label": "conversión de un punto entre coordenadas rectangulares y polares",
        "match": "(?:convier|convert)\\w*[^.;]*punto|conversion de (?:un |el )?punto",
        "relation": "las coordenadas del punto dado y el intervalo angular indicado, distinguiendo representaciones equivalentes del mismo punto de una conversión de ecuaciones",
        "representation": "sitúa el punto solicitado con las coordenadas y referencias dadas",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "ea2f9456-33dd-5dff-8475-8a1c80b298f4"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "polar-circle",
        "grade": 6,
        "label": "circunferencia en coordenadas polares",
        "match": "circunferencias?",
        "relation": "la ecuación polar de la circunferencia y los parámetros dados, sin atribuirle propiedades de otras curvas",
        "representation": "traza la circunferencia polar solicitada según su ecuación y el intervalo dado",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "25a9d2fc-db72-5b75-998b-38da1487a574"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "polar-conic",
        "grade": 6,
        "label": "cónica en coordenadas polares",
        "match": "conicas?",
        "relation": "la cónica de la ecuación polar y los parámetros proporcionados, bajo el dominio y las condiciones dadas",
        "representation": "traza la cónica polar solicitada conservando su ecuación, sus parámetros y referencias",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "25a9d2fc-db72-5b75-998b-38da1487a574"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "polar-spiral",
        "grade": 6,
        "label": "espiral en coordenadas polares",
        "match": "espiral(?:es)?",
        "relation": "la relación entre radio y ángulo de la espiral polar dada y su intervalo de representación",
        "representation": "traza la espiral polar según la ecuación y el intervalo angular dados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "25a9d2fc-db72-5b75-998b-38da1487a574"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "quadric-surfaces",
        "grade": 6,
        "label": "superficies cuádricas",
        "match": "cuadric[ao]s?|superficies?",
        "relation": "la ecuación y las características de la superficie cuádrica proporcionada, distinguiendo el modelo tridimensional de una curva plana, sin convertir toda superficie en una cuádrica",
        "representation": "representa únicamente la superficie cuádrica solicitada con ejes, escalas y parámetros dados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "891e7e78-e9bb-5c88-8d03-b76b11f8652f",
          "92076807-d9ec-58b6-9d2d-7e7b7389e3c3",
          "fcf89811-9cab-5af8-bdfa-9cf3d71bc5bf",
          "113eadfd-3703-55ad-8f7e-3182fd0b6d5a",
          "b18418fb-10c1-5a04-8768-caae26b9e783",
          "e4d2c49f-2a33-5fe4-a6a2-fd2f9d8dbdd0",
          "bf97d83b-ac18-57b0-817b-feceef697d07",
          "da38bd24-10db-5dcf-974c-93f95a0bdb56",
          "9e7f554c-8bc4-5024-bd0b-5274ffbd6230",
          "054c4180-6217-5897-90ca-33f2d47599f0",
          "f927c34a-c28b-55bc-813f-0f2d2399203d",
          "beb8dbf9-0d1c-5e0c-8453-8fcadb6b9c2b",
          "061b43a6-c224-5047-88fa-f394f81bea4e",
          "29cabba5-5eb1-5cc4-ab09-f5badc2e3235",
          "4f7fa700-d959-5990-9cd0-e4730ffedcfc",
          "0b9667ef-5a35-5f33-9b55-4969828f0a66"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "paraboloid",
        "grade": 6,
        "label": "paraboloide",
        "match": "paraboloides?",
        "relation": "la ecuación, el eje y las secciones del paraboloide proporcionado, dentro del modelo tridimensional dado",
        "representation": "representa paraboloide con la ecuación, los ejes y las escalas proporcionados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "891e7e78-e9bb-5c88-8d03-b76b11f8652f",
          "92076807-d9ec-58b6-9d2d-7e7b7389e3c3",
          "fcf89811-9cab-5af8-bdfa-9cf3d71bc5bf",
          "113eadfd-3703-55ad-8f7e-3182fd0b6d5a",
          "b18418fb-10c1-5a04-8768-caae26b9e783",
          "e4d2c49f-2a33-5fe4-a6a2-fd2f9d8dbdd0"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "hyperboloid",
        "grade": 6,
        "label": "hiperboloide",
        "match": "hiperboloides?",
        "relation": "la ecuación y el caso de hiperboloide proporcionados, sin suponer una o dos hojas sin respaldo, dentro del modelo tridimensional dado",
        "representation": "representa hiperboloide con la ecuación, los ejes y las escalas proporcionados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "891e7e78-e9bb-5c88-8d03-b76b11f8652f",
          "92076807-d9ec-58b6-9d2d-7e7b7389e3c3",
          "fcf89811-9cab-5af8-bdfa-9cf3d71bc5bf",
          "113eadfd-3703-55ad-8f7e-3182fd0b6d5a",
          "b18418fb-10c1-5a04-8768-caae26b9e783",
          "e4d2c49f-2a33-5fe4-a6a2-fd2f9d8dbdd0"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "ellipsoid",
        "grade": 6,
        "label": "elipsoide",
        "match": "elipsoides?",
        "relation": "la ecuación, los ejes y los parámetros del elipsoide dados, dentro del modelo tridimensional dado",
        "representation": "representa elipsoide con la ecuación, los ejes y las escalas proporcionados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "891e7e78-e9bb-5c88-8d03-b76b11f8652f",
          "92076807-d9ec-58b6-9d2d-7e7b7389e3c3",
          "fcf89811-9cab-5af8-bdfa-9cf3d71bc5bf",
          "113eadfd-3703-55ad-8f7e-3182fd0b6d5a",
          "b18418fb-10c1-5a04-8768-caae26b9e783",
          "e4d2c49f-2a33-5fe4-a6a2-fd2f9d8dbdd0"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "vector-functions",
        "grade": 6,
        "label": "funciones vectoriales",
        "match": "funcion(?:es)? vectorial(?:es)?|modelo vectorial",
        "relation": "las componentes, el parámetro, el dominio y las unidades de la función vectorial dada, sin exigir su derivación cuando no está pedida",
        "representation": "representa la función vectorial solicitada mediante sus componentes y su dominio",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "bdbabda4-40e4-5518-b870-ca375b90a668",
          "46193abd-5d3e-521a-a1ad-47fa7224526f",
          "f927c34a-c28b-55bc-813f-0f2d2399203d",
          "beb8dbf9-0d1c-5e0c-8453-8fcadb6b9c2b",
          "061b43a6-c224-5047-88fa-f394f81bea4e",
          "29cabba5-5eb1-5cc4-ab09-f5badc2e3235",
          "4f7fa700-d959-5990-9cd0-e4730ffedcfc"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "vector-derivatives",
        "grade": 6,
        "label": "derivadas de funciones vectoriales",
        "match": "derivad[ao]s?[^.;]*vectorial(?:es)?|deriv(?:a|an|ar|e|en)[^.;]*vectorial(?:es)?",
        "relation": "la derivada por componentes de la función vectorial dada, su dominio de derivabilidad y las unidades pertinentes, sin añadir integración u otras operaciones",
        "representation": "representa únicamente la derivada vectorial cuando se solicita, con componentes y referencias dadas",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "828a4c01-0395-547b-b47c-4978e379715b",
          "5ee95c10-f20c-52bc-9f63-daa58c322a92",
          "47076277-02e1-5617-b3c4-aedf2415cfe4",
          "054c4180-6217-5897-90ca-33f2d47599f0",
          "0b9667ef-5a35-5f33-9b55-4969828f0a66"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "ruled-surface",
        "grade": 6,
        "label": "superficie reglada",
        "match": "superficies? regladas?",
        "relation": "la parametrización y las rectas generatrices de la superficie reglada proporcionada, sin afirmar que toda superficie cuádrica sea reglada",
        "representation": "modela la superficie reglada solicitada mediante la parametrización y las referencias dadas",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "fd82f6e0-246b-5d18-83db-4de2c0127ce0",
          "3862b781-a08b-5ad7-b179-89308827ef12"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "spheroid",
        "grade": 6,
        "label": "esferoide",
        "match": "esferoides?",
        "relation": "la ecuación, los semiejes y el eje de revolución del esferoide dados, distinguiendo los casos bajo sus condiciones explícitas",
        "representation": "modela el esferoide con los parámetros y el eje de revolución proporcionados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "8b80cd93-1a21-5da0-af1f-ca156228fca0"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      },
      {
        "id": "cardioid",
        "grade": 6,
        "label": "cardioide",
        "match": "cardio(?:ide|de)s?",
        "relation": "la ecuación polar y los parámetros dados de la cardioide como curva plana, sin convertirla en una superficie tridimensional",
        "representation": "modela la cardioide polar con la ecuación, el intervalo angular y las referencias proporcionados",
        "pages": [
          496,
          497
        ],
        "sourceRecordIds": [
          "d06db7da-8c58-567b-9011-28eafe718b34"
        ],
        "priority": 1,
        "originIsHistorical": false,
        "calculationTargets": []
      }
    ]
  }
],
version:"evaluation-2026.138"} as unknown as EvaluationCatalog
