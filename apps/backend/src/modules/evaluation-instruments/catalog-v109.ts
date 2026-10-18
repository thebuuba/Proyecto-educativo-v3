import type { EvaluationCatalog } from './catalog-current'
import { evaluationCatalogV108 } from './catalog-v108'
/** Exact109payload checked against Development; prior modules stay inherited. */
export const evaluationCatalogV109={...evaluationCatalogV108,version:'evaluation-2026.109',artCommonModules:[...evaluationCatalogV108.artCommonModules!,{
  "id": "educacion-artistica-comun-4",
  "grade": 4,
  "topics": [
    {
      "id": "regional-visual-art",
      "grade": 4,
      "label": "artes visuales latinoamericanas y caribeñas",
      "match": "obras visuales cariben[a-z]*|artes visuales latinoamerican[a-z]*",
      "relation": "las relaciones entre recursos estéticos, contexto documentado y aportes de las obras visuales caribeñas o latinoamericanas examinadas",
      "pdfPages": [
        341,
        343
      ],
      "sourceRecordIds": [
        "20c6966b-45f6-53c1-b0fa-f55bbf531639",
        "22bfd01b-751d-533e-963c-fb3c39f23b19"
      ],
      "evidence": [
        {
          "id": "visual-context",
          "title": "Recursos y contexto de los referentes",
          "success": "Relaciona las decisiones visuales de la propuesta con rasgos identificables del referente regional expresamente dado y su contexto documentado.",
          "sufficient": "El referente y su contexto se reconocen; una decisión visual secundaria queda poco precisada.",
          "partial": "La propuesta presenta rasgos del referente, pero una relación con el contexto queda sin sustento.",
          "error": "Las decisiones visuales contradicen los datos del referente o no permiten reconocer su relación con el contexto solicitado."
        }
      ]
    },
    {
      "id": "visual-syncretism",
      "grade": 4,
      "label": "sincretismo cultural en las artes visuales y aplicadas",
      "match": "sincretismo.*(?:visual|aplicad)|integre.*dos referentes culturales|integra elementos de dos culturas",
      "relation": "las relaciones entre elementos culturales identificables y su integración en las decisiones expresivas de la obra visual o aplicada examinada, sin inferir identidad privada",
      "pdfPages": [
        341,
        343
      ],
      "sourceRecordIds": [
        "1e37cab4-d14d-59c5-8d08-3b16c31eaa4b",
        "e1d9b5fa-7b11-5c27-98ff-888386507852",
        "6a7bcd5f-c9a8-5177-8335-d7c3f8067cf1",
        "74d06854-c82d-5076-98f5-fd9ef3c71114"
      ],
      "evidence": [
        {
          "id": "cultural-integration",
          "title": "Integración de los referentes culturales",
          "success": "Integra elementos identificables de los referentes culturales dados mediante relaciones expresivas reconocibles en la obra elegida, sin limitarse a yuxtaponerlos ni exigir adhesión cultural.",
          "sufficient": "La integración de referentes se reconoce; una relación expresiva secundaria queda poco definida.",
          "partial": "La obra presenta elementos de ambos referentes, pero una relación entre ellos no contribuye a la integración solicitada.",
          "error": "Los elementos utilizados contradicen los referentes dados o no presentan una relación reconocible entre ellos.",
          "when": "^(?!.*explica)"
        },
        {
          "id": "explained-integration",
          "when": "explica",
          "title": "Integración y explicación de referentes",
          "success": "Integra elementos identificables de los referentes culturales dados y explica cómo sus relaciones contribuyen al sentido expresivo de la obra elegida, sin exigir adhesión cultural.",
          "sufficient": "La integración y su explicación se reconocen; una relación expresiva secundaria queda poco precisada.",
          "partial": "La obra integra elementos pertinentes, pero una relación no se sustenta en la explicación de las decisiones.",
          "error": "Los elementos o su explicación contradicen los referentes dados o no permiten reconocer la integración solicitada."
        }
      ]
    },
    {
      "id": "modern-social-art",
      "grade": 4,
      "label": "obras modernas y aspectos sociales",
      "match": "obra moderna|artistas modernos|aspectos sociales.*obra",
      "relation": "las relaciones entre decisiones visuales, aspectos sociales representados y contexto documentado de la obra moderna examinada, diferenciando evidencia y supuestos sobre el público",
      "pdfPages": [
        341,
        343
      ],
      "sourceRecordIds": [
        "224628e0-f843-5d5c-8253-68a55bb2265d",
        "405f9a92-cafe-5bec-934a-3e5885bb5971"
      ],
      "evidence": [
        {
          "id": "social-resources",
          "title": "Recursos visuales y contenido social",
          "success": "Relaciona los recursos visuales elegidos con el contenido social ficticio expresamente acordado y con los referentes modernos dados.",
          "sufficient": "El contenido social y los referentes se reconocen; una elección visual secundaria queda poco definida.",
          "partial": "La propuesta contiene recursos pertinentes, pero una relación con el contenido social o el referente queda sin resolver.",
          "error": "Las decisiones visuales contradicen el caso dado o no permiten reconocer el contenido social solicitado."
        }
      ]
    },
    {
      "id": "color-social-message",
      "grade": 4,
      "label": "color como discurso social",
      "match": "color|discurso social",
      "relation": "las relaciones entre uso del color, recursos visibles y sentido social de la obra dominicana o caribeña examinada, apoyándose en los datos contextuales dados",
      "pdfPages": [
        341
      ],
      "sourceRecordIds": [
        "5b884eea-e44d-532b-b020-3b1e9b428fb2",
        "b8f4814d-62f7-5746-8b1f-11030d856687"
      ],
      "evidence": [
        {
          "id": "color-message",
          "title": "Color y sentido social",
          "success": "Relaciona las elecciones de color con el mensaje ficticio expresamente acordado, haciendo reconocible su función visual con los recursos disponibles.",
          "sufficient": "El mensaje se reconoce en las relaciones de color; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "La propuesta utiliza colores pertinentes, pero una relación cromática no contribuye al mensaje pedido.",
          "error": "Las relaciones de color contradicen el sentido acordado o no permiten reconocer su función comunicativa."
        }
      ]
    },
    {
      "id": "dominican-artists",
      "grade": 4,
      "label": "arte y artistas dominicanos",
      "match": "artistas dominicanos|arte y artistas",
      "relation": "las relaciones entre componentes culturales, obras y representantes dominicanos expresamente examinados según las fuentes dadas, sin exigir biografías completas",
      "pdfPages": [
        341,
        343
      ],
      "sourceRecordIds": [
        "d9fafa10-466c-5cc2-b504-939f2e9a89b3",
        "0d05a3d6-bcc0-5eae-b439-82ae135edd48",
        "8f26dec2-e4f9-517e-bd2c-72c62179ce9d"
      ],
      "evidence": [
        {
          "id": "cultural-work-links",
          "title": "Componentes culturales y obras",
          "success": "Expone relaciones entre componentes culturales y evidencias de las obras dadas, identificando sus representantes según las fuentes sin atribuir identidades privadas.",
          "sufficient": "Las relaciones principales y sus representantes se reconocen; un vínculo secundario queda poco precisado.",
          "partial": "Identifica componentes pertinentes, pero una relación con la obra o el representante queda sin evidencia.",
          "error": "Atribuye a las obras componentes o representantes incompatibles con las fuentes dadas."
        }
      ]
    },
    {
      "id": "cultural-references",
      "grade": 4,
      "label": "referentes culturales visuales y audiovisuales",
      "match": "referentes culturales.*(?:visual|audiovisual)|lenguajes visuales y audiovisuales",
      "relation": "las relaciones entre referentes culturales documentados y recursos de los lenguajes visuales o audiovisuales de las obras dominicanas y caribeñas examinadas",
      "pdfPages": [
        341
      ],
      "sourceRecordIds": [
        "4ff76197-d2f1-5548-a974-3ac0190ca2e9"
      ],
      "evidence": [
        {
          "id": "reference-language",
          "title": "Referentes y decisiones del medio",
          "success": "Relaciona las decisiones del medio elegido con rasgos identificables del referente cultural expresamente dado, sin exigir otro lenguaje artístico.",
          "sufficient": "El referente y el medio se relacionan; una decisión secundaria queda poco definida.",
          "partial": "Se reconoce un rasgo del referente, pero una decisión del medio no se vincula con él.",
          "error": "Las decisiones del medio contradicen el referente o impiden reconocer la relación cultural solicitada."
        }
      ]
    },
    {
      "id": "artistic-recreation",
      "grade": 4,
      "label": "apropiación y recreación visual de referentes",
      "match": "recreacion visual|apropiacion|figuras emblematicas",
      "relation": "las relaciones entre temas, imágenes o técnicas del referente dado y decisiones de transformación de la recreación examinada, distinguiendo apropiación y copia literal",
      "pdfPages": [
        341,
        343
      ],
      "sourceRecordIds": [
        "255cc1c7-2b0f-5085-b16c-3a9032442466",
        "dc114356-3c35-54d4-8801-f11cdb26c6a8"
      ],
      "evidence": [
        {
          "id": "reference-transformation",
          "title": "Referente y transformación visual",
          "success": "Relaciona rasgos identificables del tema o imagen elegidos con decisiones de transformación mediante la técnica disponible acordada, diferenciando recreación y copia literal.",
          "sufficient": "El referente y la transformación se reconocen; una elección técnica secundaria queda poco definida.",
          "partial": "Se reconocen rasgos del referente, pero una decisión técnica no contribuye a la transformación pedida.",
          "error": "La propuesta copia sin transformación lo que debía recrear o sus decisiones no guardan relación reconocible con el referente solicitado."
        }
      ]
    },
    {
      "id": "palos-congos-salves",
      "grade": 4,
      "label": "palos, atabales, congos y salves",
      "match": "palos|atabales|congos|salves",
      "relation": "las relaciones entre recursos sonoros, movimientos y referentes comunitarios, regionales o nacionales de la manifestación dominicana expresamente examinada, sin exigir prácticas religiosas",
      "pdfPages": [
        341
      ],
      "sourceRecordIds": [
        "6307cf81-a0d4-5cb9-a8e3-7e3fbff1b8ad",
        "85275728-ef5e-5799-8e1c-43e15b11a1b3"
      ],
      "evidence": [
        {
          "id": "traditional-sequence",
          "title": "Pulso, secuencia y referente elegido",
          "success": "Relaciona pulso, secuencia y movimientos adaptados del fragmento elegido con rasgos del referente dado, sin exigir todas las manifestaciones ni adhesión religiosa.",
          "sufficient": "La secuencia y el referente se reconocen; una transición secundaria pierde precisión sin romper la organización principal.",
          "partial": "Se reconoce parte de la secuencia, pero una relación entre pulso y movimiento dificulta seguir el fragmento.",
          "error": "Los movimientos o el pulso no permiten reconocer la secuencia expresamente trabajada.",
          "plan": {
            "title": "Plan de secuencia y referente elegido",
            "success": "Planifica la relación entre pulso, secuencia y movimientos adaptados del fragmento elegido y los recursos disponibles, sin exigir su representación ya realizada.",
            "sufficient": "El plan relaciona secuencia y recursos; una transición secundaria queda poco precisada.",
            "partial": "El plan identifica movimientos pertinentes, pero una relación con el pulso o los recursos queda sin resolver.",
            "error": "Las decisiones del plan contradicen el referente o impiden realizar la secuencia prevista."
          }
        }
      ]
    },
    {
      "id": "caribbean-dramaturgy",
      "grade": 4,
      "label": "dramaturgia dominicana y caribeña",
      "match": "dramaturgia dominicana|dramaturgia.*caribena",
      "relation": "las relaciones entre acciones, personajes y elementos culturales del fragmento de dramaturgia dominicana o caribeña examinado, usando evidencias del texto y la escena",
      "pdfPages": [
        341
      ],
      "sourceRecordIds": [
        "0beee178-33ce-56c9-b3c5-16c37a6f146a",
        "95d8875f-7630-56e2-92db-adc71d0ebfb4"
      ],
      "evidence": [
        {
          "id": "dramatic-cultural-action",
          "title": "Acciones y elementos culturales de la escena",
          "success": "Relaciona acciones, personajes y recursos del fragmento representado con los elementos culturales identificables del guion dado, adaptándolos a las condiciones disponibles.",
          "sufficient": "La acción y sus elementos culturales se reconocen; una decisión escénica secundaria queda poco definida.",
          "partial": "Se reconocen acciones del fragmento, pero una relación con el personaje o elemento cultural queda sin resolver.",
          "error": "Las acciones o los recursos contradicen el guion o no permiten reconocer la escena expresamente trabajada."
        }
      ]
    },
    {
      "id": "scene-context",
      "grade": 4,
      "label": "escena dominicana y caribeña en su contexto",
      "match": "(?:grupos|cultores|tecnicas).*teatro y danza|contexto historico.*teatro",
      "relation": "las relaciones entre grupos, técnicas o cultores escénicos expresamente examinados y evidencias de su contexto histórico dominicano o caribeño",
      "pdfPages": [
        341,
        343
      ],
      "sourceRecordIds": [
        "c76336f2-44a4-56e6-a65a-74cc99775685",
        "c7d0fbea-580f-5c3a-a036-198622aeffed"
      ],
      "evidence": [
        {
          "id": "scenic-source-context",
          "title": "Propuestas escénicas, contexto y fuentes",
          "success": "Relaciona las propuestas de los grupos, técnicas o cultores asignados con evidencias identificables de las fuentes y su contexto histórico, distinguiendo información e interpretación.",
          "sufficient": "Las propuestas y su contexto se sostienen en fuentes; una relación secundaria queda poco precisada.",
          "partial": "Presenta datos pertinentes, pero una relación entre propuesta y contexto no se vincula con su fuente.",
          "error": "Atribuye a los representantes propuestas o contextos incompatibles con las fuentes utilizadas."
        }
      ]
    },
    {
      "id": "popular-dance",
      "grade": 4,
      "label": "danzas populares dominicanas y caribeñas",
      "match": "danz[a-z]* populares|baile[a-z]* populares|(?:danza|baile|desplazamientos|movimientos).*merengue|merengue.*(?:movimientos|desplazamientos|pasos)",
      "relation": "las relaciones entre pulso, secuencia, organización espacial y contexto de la danza popular expresamente examinada, sin exigir todo el repertorio ni una apariencia corporal",
      "pdfPages": [
        341
      ],
      "sourceRecordIds": [
        "6c6a2316-e88f-5124-a7d3-33f8e8f2dae1",
        "3b63eeef-5aa8-5021-8960-baca59d19444"
      ],
      "evidence": [
        {
          "id": "popular-dance-sequence",
          "title": "Pulso y secuencia de la danza elegida",
          "success": "Relaciona el pulso del fragmento con la secuencia y los desplazamientos adaptados acordados de la danza elegida, sin exigir interpretar otros géneros.",
          "sufficient": "La secuencia y el pulso se reconocen; una transición secundaria pierde precisión sin romper la organización principal.",
          "partial": "Se reconocen movimientos pertinentes, pero una relación de pulso o espacio dificulta seguir parte de la secuencia.",
          "error": "Los movimientos o desplazamientos no permiten reconocer la secuencia acordada en relación con el fragmento musical.",
          "plan": {
            "title": "Plan de secuencia y espacio de la danza",
            "success": "Planifica la secuencia y los desplazamientos adaptados de la danza elegida en relación con el pulso y los recursos dados, sin exigir ejecución.",
            "sufficient": "El plan relaciona pulso, secuencia y espacio; una transición secundaria queda poco precisada.",
            "partial": "El plan presenta movimientos pertinentes, pero una relación de pulso o espacio queda sin resolver.",
            "error": "Las decisiones del plan impiden seguir la secuencia prevista con las condiciones dadas."
          }
        }
      ]
    },
    {
      "id": "theatrical-comedy",
      "grade": 4,
      "label": "montaje de comedias teatrales",
      "match": "comedia[a-z]* teatr|montaje de la comedia|montaje.*comedia",
      "relation": "las relaciones entre acciones, ritmo escénico y sentido cómico del fragmento teatral examinado, diferenciando recursos de la ficción y juicios sobre personas reales",
      "pdfPages": [
        341
      ],
      "sourceRecordIds": [
        "3b63eeef-5aa8-5021-8960-baca59d19444"
      ],
      "evidence": [
        {
          "id": "comic-stage-action",
          "title": "Acciones y ritmo de la comedia",
          "success": "Relaciona acciones, entradas y recursos escénicos disponibles con el ritmo y el sentido cómico del fragmento ficticio acordado, sin ridiculizar identidades reales.",
          "sufficient": "La acción y el sentido cómico se reconocen; una entrada secundaria queda poco precisa sin romper la escena.",
          "partial": "Se reconocen acciones pertinentes, pero una relación de entrada o ritmo dificulta seguir el fragmento.",
          "error": "Las acciones o entradas no permiten reconocer el sentido de la comedia acordada o contradicen las condiciones expresas de la ficción.",
          "plan": {
            "title": "Plan de acciones y entradas de la comedia",
            "success": "Planifica acciones, entradas y recursos de la comedia ficticia de modo coherente con el sentido cómico del fragmento y las condiciones disponibles, sin exigir representación ya realizada.",
            "sufficient": "El plan relaciona acciones y entradas; un recurso secundario queda poco precisado.",
            "partial": "El plan identifica acciones, pero una relación de entrada o recurso queda sin resolver.",
            "error": "Las acciones o entradas previstas contradicen el guion o impiden realizar la comedia solicitada."
          }
        }
      ]
    },
    {
      "id": "origin-dance",
      "grade": 4,
      "label": "danzas de pueblos originarios de América Latina",
      "match": "danza[a-z]* originari[a-z]*|danza[a-z]*.*pueblos originarios",
      "relation": "las relaciones entre pulso, movimientos y organización de la danza originaria latinoamericana examinada, usando el referente dado sin exigir ceremonias o adhesión religiosa",
      "pdfPages": [
        342,
        341
      ],
      "sourceRecordIds": [
        "43dddff5-2096-5d44-b9c8-9e871d2a8a19",
        "5ec11eba-006e-5e0e-b2db-9e198bf39879"
      ],
      "evidence": [
        {
          "id": "adapted-origin-sequence",
          "title": "Secuencia adaptada y referente de la danza",
          "success": "Explora y relaciona los movimientos adaptados y la organización espacial acordados con el pulso y el referente proporcionados, sin exigir la reproducción de ceremonias.",
          "sufficient": "La secuencia adaptada y el referente se reconocen; una transición secundaria pierde precisión.",
          "partial": "Se reconocen movimientos del referente, pero una relación de pulso o espacio no permite seguir parte de la secuencia.",
          "error": "Los movimientos no presentan una relación reconocible con la secuencia y el referente expresamente trabajados."
        }
      ]
    },
    {
      "id": "popular-performance",
      "grade": 4,
      "label": "interpretación popular vocal o instrumental",
      "match": "(?:interpreta|interpretacion).*(?:vocal[a-z]*|instrumental|flauta|percusion|ritmo popular)",
      "relation": "las relaciones entre recursos del medio vocal o instrumental elegido y ritmo, fraseo o melodía del fragmento popular dominicano o caribeño examinado",
      "pdfPages": [
        341
      ],
      "sourceRecordIds": [
        "48ecc915-efbd-5232-940a-eb43eb28cb4c"
      ],
      "evidence": [
        {
          "id": "vocal-popular-fragment",
          "title": "Ritmo, fraseo y sentido vocal",
          "success": "Relaciona ritmo y fraseo del fragmento vocal elegido con el modelo y el sentido expresivo acordados, utilizando adaptaciones sin exigir instrumentos adicionales.",
          "sufficient": "El fragmento y su sentido se reconocen; una entrada o frase secundaria pierde precisión sin romper la organización principal.",
          "partial": "La voz permite reconocer parte del fragmento, pero una relación entre ritmo y fraseo dificulta seguir su sentido.",
          "error": "La organización vocal no permite reconocer el fragmento expresamente trabajado.",
          "when": "vocal|voz|canta"
        },
        {
          "id": "instrumental-popular-fragment",
          "title": "Ritmo y melodía instrumental",
          "success": "Relaciona ritmo, melodía y entradas del fragmento instrumental con el modelo dado mediante el instrumento elegido, sin exigir canto o instrumentos adicionales.",
          "sufficient": "El fragmento y las relaciones principales se reconocen; una entrada secundaria pierde precisión.",
          "partial": "Se reconoce parte del fragmento, pero una relación de ritmo, melodía o entrada queda sin resolver.",
          "error": "La ejecución no presenta una relación reconocible con el fragmento instrumental expresamente acordado.",
          "when": "flauta|melodia"
        },
        {
          "id": "percussion-pattern",
          "title": "Pulso y entradas de la percusión",
          "success": "Relaciona el pulso y las entradas del patrón pedido con el modelo mediante la percusión disponible elegida y sus adaptaciones, sin exigir otros medios.",
          "sufficient": "El patrón y sus entradas se reconocen; una entrada secundaria pierde precisión sin romper la organización principal.",
          "partial": "Se reconoce parte del patrón, pero una entrada no se relaciona con el pulso acordado.",
          "error": "La ejecución no permite reconocer el patrón de percusión expresamente trabajado.",
          "when": "percusion"
        },
        {
          "id": "chosen-instrumental-medium",
          "title": "Patrón sonoro del medio elegido",
          "success": "Relaciona los recursos del medio elegido con el patrón sonoro expresamente pedido del modelo popular dado, sin exigir otros medios o componentes no solicitados.",
          "sufficient": "El patrón se reconoce; una relación sonora secundaria pierde precisión sin cambiar el sentido principal.",
          "partial": "Se reconoce parte del patrón, pero una decisión del medio elegido no se vincula con el modelo.",
          "error": "Los recursos utilizados no permiten reconocer el patrón expresamente pedido del modelo.",
          "when": "^(?!.*(?:vocal|voz|canta|flauta|percusion|melodia))"
        }
      ]
    },
    {
      "id": "popular-music",
      "grade": 4,
      "label": "música popular dominicana y caribeña",
      "match": "musica popular dominicana|musica popular.*caribena",
      "relation": "las relaciones entre rasgos sonoros y contexto documentado de los fragmentos populares dominicanos o caribeños examinados, sin exigir preferencias personales",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "0fef135f-399a-5edf-807b-cda0ba393d11",
        "0aec4cc5-b7ff-5abd-ad21-09168a1c550e"
      ],
      "evidence": [
        {
          "id": "popular-sonic-context",
          "title": "Recursos y referente musical popular",
          "success": "Relaciona recursos sonoros del medio elegido con rasgos del referente popular dado y su contexto expresamente trabajado.",
          "sufficient": "El referente y sus recursos se reconocen; una relación secundaria queda poco definida.",
          "partial": "Se reconocen recursos pertinentes, pero una relación con el referente queda sin resolver.",
          "error": "Los recursos utilizados contradicen el referente dado o no permiten reconocer la relación solicitada."
        }
      ]
    },
    {
      "id": "latin-music-context",
      "grade": 4,
      "label": "música latinoamericana, géneros y representantes",
      "match": "(?:generos|compositores|interpretes).*latinoamerican[a-z]*",
      "relation": "las relaciones entre géneros, formas, compositores e intérpretes latinoamericanos expresamente examinados según evidencias de los fragmentos y fuentes dados",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "e3b157d4-220d-544a-8e5c-a6da3fcb90b9"
      ],
      "evidence": [
        {
          "id": "latin-music-relations",
          "title": "Formas y representantes del referente",
          "success": "Relaciona rasgos musicales y datos de los representantes expresamente asignados con evidencias identificables de los ejemplos y sus fuentes.",
          "sufficient": "Las relaciones centrales y sus evidencias se reconocen; un dato secundario queda poco precisado.",
          "partial": "Presenta datos pertinentes, pero una relación entre forma y representante no se vincula con los ejemplos.",
          "error": "Los datos atribuidos a formas o representantes contradicen las fuentes dadas."
        }
      ]
    },
    {
      "id": "dominican-music",
      "grade": 4,
      "label": "géneros, compositores e intérpretes dominicanos",
      "match": "fragmento musical dominicano|musica dominicana|genero.*autoria.*interpretacion",
      "relation": "las relaciones entre género, autoría e interpretación del fragmento dominicano examinado, diferenciando rasgos sonoros y datos documentados",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "2897f612-e6fb-5664-a4d0-b406a04879b8"
      ],
      "evidence": [
        {
          "id": "dominican-music-relations",
          "title": "Género, autoría e interpretación",
          "success": "Relaciona los rasgos del fragmento dominicano con datos identificables de género, autoría e interpretación de las fuentes dadas.",
          "sufficient": "Las relaciones centrales se sostienen en fuentes; un dato secundario queda poco precisado.",
          "partial": "Reconoce un rasgo del fragmento, pero una atribución no se vincula con la fuente.",
          "error": "Las atribuciones o relaciones contradicen los datos del fragmento y sus fuentes."
        }
      ]
    },
    {
      "id": "musical-research",
      "grade": 4,
      "label": "investigación del patrimonio musical",
      "match": "(?:investiga[a-z]*|analiza[a-z]*).*(?:obras? musicales? patrimonial[a-z]*|patrimonio.*musical)|patrimonio musical",
      "relation": "las relaciones entre recursos, contexto y aportes documentados de las obras musicales patrimoniales examinadas, distinguiendo patrimonio material e inmaterial cuando se solicite",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "003f1f01-81bb-5e8e-8d59-6f7476d51481",
        "63d47851-65c9-5540-96dc-b30ad5299f36"
      ],
      "evidence": [
        {
          "id": "musical-heritage-sources",
          "title": "Obras patrimoniales, contexto y fuentes",
          "success": "Relaciona recursos y aportes de las obras musicales asignadas con evidencias identificables de las fuentes y su contexto, diferenciando información e interpretación sin exigir visitas.",
          "sufficient": "Las obras y sus aportes se sostienen en fuentes; una relación secundaria de contexto queda poco precisada.",
          "partial": "Presenta información pertinente, pero una relación entre recurso, contexto y aporte no se vincula con la evidencia.",
          "error": "Las afirmaciones contradicen las fuentes o no permiten reconocer los aportes musicales expresamente investigados."
        }
      ]
    },
    {
      "id": "song-from-analysis",
      "grade": 4,
      "label": "creación de canciones desde melodías y ritmos",
      "match": "crea[a-z]*.*cancion|creacion de canciones",
      "relation": "las relaciones entre análisis de melodías o ritmos dados y decisiones de transformación de la canción examinada, sin reducir creación a copia literal",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "a235c69b-9444-5f12-867a-6824fe5ba77d"
      ],
      "evidence": [
        {
          "id": "melody-rhythm-transformation",
          "title": "Referente sonoro y transformación de la canción",
          "success": "Relaciona rasgos identificables de la melodía y el ritmo analizados con decisiones de transformación de la canción para comunicar el mensaje o intención ficticia acordados.",
          "sufficient": "El referente transformado y el mensaje se reconocen; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "Se reconoce parte del referente, pero una decisión sonora no contribuye a la transformación o al mensaje pedido.",
          "error": "La canción copia sin transformación lo que debía recrear o sus decisiones no permiten reconocer la relación con el referente y la intención acordados.",
          "when": "^(?=.*melodia)(?=.*ritmo)"
        },
        {
          "id": "melody-transformation",
          "title": "Referente sonoro y transformación de la canción",
          "success": "Relaciona rasgos identificables de la melodía analizada con decisiones de transformación de la canción para comunicar el mensaje o intención ficticia acordados.",
          "sufficient": "El referente transformado y el mensaje se reconocen; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "Se reconoce parte del referente, pero una decisión sonora no contribuye a la transformación o al mensaje pedido.",
          "error": "La canción copia sin transformación lo que debía recrear o sus decisiones no permiten reconocer la relación con el referente y la intención acordados.",
          "when": "^(?=.*melodia)(?!.*ritmo)"
        },
        {
          "id": "rhythm-transformation",
          "title": "Referente sonoro y transformación de la canción",
          "success": "Relaciona rasgos identificables del ritmo analizado con decisiones de transformación de la canción para comunicar el mensaje o intención ficticia acordados.",
          "sufficient": "El referente transformado y el mensaje se reconocen; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "Se reconoce parte del referente, pero una decisión sonora no contribuye a la transformación o al mensaje pedido.",
          "error": "La canción copia sin transformación lo que debía recrear o sus decisiones no permiten reconocer la relación con el referente y la intención acordados.",
          "when": "^(?=.*ritmo)(?!.*melodia)"
        },
        {
          "id": "song-transformation",
          "title": "Referente sonoro y transformación de la canción",
          "success": "Relaciona rasgos identificables de la melodía o ritmo analizados con decisiones de transformación de la canción para comunicar el mensaje o intención ficticia acordados.",
          "sufficient": "El referente transformado y el mensaje se reconocen; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "Se reconoce parte del referente, pero una decisión sonora no contribuye a la transformación o al mensaje pedido.",
          "error": "La canción copia sin transformación lo que debía recrear o sus decisiones no permiten reconocer la relación con el referente y la intención acordados.",
          "when": "^(?!.*(?:melodia|ritmo))"
        }
      ]
    },
    {
      "id": "latin-rhythm-reproduction",
      "grade": 4,
      "label": "reproducción de ritmos o melodías latinoamericanas",
      "match": "reproduce[a-z]*.*(?:ritmo|melodia)|reproduccion.*(?:ritmo|melodia)",
      "relation": "las relaciones entre modelo, secuencia y medio elegido en la reproducción rítmica o melódica latinoamericana expresamente examinada",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "0d77519a-df6d-57db-be08-56d5e54d1c61"
      ],
      "evidence": [
        {
          "id": "rhythm-sequence",
          "title": "Pulso y secuencia rítmica",
          "success": "Reproduce el pulso y la secuencia rítmica acordados del modelo latinoamericano mediante el medio elegido y sus adaptaciones, sin exigir todos los medios.",
          "sufficient": "El pulso y la secuencia se reconocen; una entrada secundaria pierde precisión sin romper la organización principal.",
          "partial": "Se reconoce parte de la secuencia, pero una entrada o relación con el pulso queda sin resolver.",
          "error": "La reproducción no permite reconocer la secuencia rítmica expresamente acordada.",
          "when": "ritmo|ritmica|pulso"
        },
        {
          "id": "melody-sequence",
          "title": "Secuencia melódica del modelo",
          "success": "Reproduce las relaciones melódicas expresamente acordadas del modelo mediante el medio elegido y sus adaptaciones, sin exigir instrumentos adicionales.",
          "sufficient": "La melodía se reconoce; una relación secundaria pierde precisión sin cambiar su sentido principal.",
          "partial": "Se reconoce parte de la melodía, pero una relación entre sonidos dificulta seguir la secuencia.",
          "error": "La reproducción no permite reconocer las relaciones melódicas expresamente trabajadas.",
          "when": "melodia|melodic"
        }
      ]
    },
    {
      "id": "cultural-dialogue-creation",
      "grade": 4,
      "label": "diálogo entre referentes dominicanos y caribeños",
      "match": "dialogue.*referente|dialogo entre referentes|referentes.*dominicano y caribeno",
      "relation": "las relaciones entre recursos de los referentes dominicanos y caribeños dados y su diálogo expresivo en la propuesta examinada, sin inferir identidad o adhesión cultural",
      "pdfPages": [
        342,
        343
      ],
      "sourceRecordIds": [
        "b6ae20f6-e32b-5992-adf5-dc68b3f7f2e4",
        "b14d03bf-62c7-55fd-8bc0-534840d18794",
        "f90df072-0dc2-5b90-b300-65f09288dcb4"
      ],
      "evidence": [
        {
          "id": "reference-dialogue",
          "title": "Relación expresiva entre referentes",
          "success": "Relaciona recursos identificables de los referentes dominicano y caribeño dados para que su diálogo contribuya al mensaje ficticio acordado, sin exigir adhesión cultural.",
          "sufficient": "Los referentes y el mensaje se reconocen; una relación expresiva secundaria queda poco definida.",
          "partial": "Se reconocen recursos de ambos referentes, pero una relación entre ellos no contribuye al diálogo pedido.",
          "error": "Las decisiones contradicen los referentes o no permiten reconocer una relación expresiva entre ellos."
        }
      ]
    },
    {
      "id": "craft-accessory",
      "grade": 4,
      "label": "accesorios artesanales de uso personal",
      "match": "accesorio artesanal|accesorios artesanales",
      "relation": "las relaciones entre forma, material, función y condiciones de uso del accesorio artesanal expresamente examinado, sin exigir compra o uso personal real",
      "pdfPages": [
        342,
        343
      ],
      "sourceRecordIds": [
        "349f3d60-314a-5d37-931a-33eab6f647cf",
        "5104d7d3-99a3-58ac-8bc3-b809e62097b9"
      ],
      "evidence": [
        {
          "id": "accessory-use",
          "title": "Forma, material y función del accesorio",
          "success": "Relaciona forma, material seguro disponible y acabado expresamente pedido con la función del accesorio elegido en el uso ficticio dado.",
          "sufficient": "El uso y las relaciones principales se reconocen; un detalle secundario de forma o acabado queda poco definido.",
          "partial": "El accesorio presenta elementos pertinentes, pero una relación entre forma, material y uso queda sin resolver.",
          "error": "Las decisiones contradicen las condiciones dadas o impiden reconocer la función del accesorio expresamente solicitado."
        }
      ]
    },
    {
      "id": "craft-market-plan",
      "grade": 4,
      "label": "muestras y mercados artesanales",
      "match": "muestra.*artesanal|mercado.*artesanal|muestra.*producto artesanal",
      "relation": "las relaciones entre producto, público, promoción y recursos de la muestra o mercado artesanal expresamente examinado",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "0d0b4f25-4328-5d13-aa82-5f6014ea6b54"
      ],
      "evidence": [
        {
          "id": "craft-presentation",
          "title": "Producto, público y promoción",
          "success": "Relaciona la presentación del producto artesanal con el público, recursos y condiciones de la muestra expresamente acordada, distinguiendo simulación y venta real.",
          "sufficient": "La presentación y su público se reconocen; un recurso secundario queda poco definido.",
          "partial": "El producto se identifica, pero una relación entre presentación y público queda sin resolver.",
          "error": "La presentación contradice las condiciones dadas o no permite reconocer la promoción solicitada.",
          "plan": {
            "title": "Plan de muestra y promoción artesanal",
            "success": "Planifica presentación, público, recursos y promoción del producto artesanal dado de modo coherente con las condiciones de la muestra escolar simulada, sin exigir venta ni publicación real.",
            "sufficient": "El plan relaciona producto, público y recursos; una condición secundaria queda poco precisada.",
            "partial": "El plan identifica el producto, pero una relación entre presentación, público o recursos queda sin resolver.",
            "error": "Las decisiones del plan contradicen las condiciones de simulación o impiden realizar la muestra prevista."
          }
        }
      ]
    },
    {
      "id": "serial-production",
      "grade": 4,
      "label": "producción artesanal en serie",
      "match": "produccion en serie",
      "relation": "las relaciones entre modelo, secuencia de tareas, recursos y condiciones de repetición del proceso artesanal examinado",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "202a12ef-d166-5042-8aca-e497fe234005"
      ],
      "evidence": [
        {
          "id": "repeatable-process",
          "title": "Modelo y proceso de repetición",
          "success": "Relaciona el modelo, la secuencia de tareas y los recursos disponibles para mantener las condiciones de repetición expresamente acordadas en la serie solicitada.",
          "sufficient": "El modelo y la secuencia se reconocen; una tarea secundaria queda poco definida sin impedir la repetición principal.",
          "partial": "La propuesta presenta un modelo, pero una relación de secuencia o recurso queda sin resolver.",
          "error": "Las decisiones contradicen las condiciones dadas o impiden reconocer un proceso de repetición del modelo.",
          "plan": {
            "title": "Plan de modelo y repetición",
            "success": "Propone un modelo, una secuencia y condiciones de repetición coherentes con los recursos disponibles para la producción en serie prevista, sin exigir la fabricación ya realizada.",
            "sufficient": "El plan relaciona modelo y secuencia; una condición secundaria de repetición queda poco precisada.",
            "partial": "El plan identifica el modelo, pero una relación de recurso o secuencia queda sin resolver.",
            "error": "Las decisiones del plan impiden repetir el modelo con las condiciones dadas."
          }
        }
      ]
    },
    {
      "id": "cultural-industries",
      "grade": 4,
      "label": "industrias culturales",
      "match": "industria[a-z]* cultural[a-z]*",
      "relation": "las relaciones entre creación, producción, circulación y público de la industria cultural examinada, usando datos proporcionados sin exigir abrir un negocio",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "66dce3ce-b4e3-5cd9-9c27-a06a1804a921"
      ],
      "evidence": [
        {
          "id": "cultural-circuit",
          "title": "Creación, circulación y público",
          "success": "Relaciona decisiones de creación y producción con circulación y público del caso ficticio de industria cultural expresamente dado.",
          "sufficient": "Las relaciones principales del circuito se reconocen; una condición secundaria queda poco precisada.",
          "partial": "Identifica partes pertinentes, pero una relación de producción, circulación o público no se sustenta en el caso.",
          "error": "Las relaciones propuestas contradicen los datos o no permiten reconocer el circuito cultural examinado."
        }
      ]
    },
    {
      "id": "safe-craft-technique",
      "grade": 4,
      "label": "técnicas artesanales y función del modelo",
      "match": "joyeria|floral|ceramica|muebleria|talabarteria|pirograbado|grabado",
      "relation": "las relaciones entre material, técnica segura, forma y función de la artesanía expresamente examinada, distinguiendo modelo y objeto definitivo",
      "pdfPages": [
        342
      ],
      "sourceRecordIds": [
        "ae8ec20f-d30c-56cb-b2ab-1d2245fe71a7"
      ],
      "evidence": [
        {
          "id": "ceramic-form",
          "title": "Forma, uniones y función de la cerámica",
          "success": "Relaciona la forma y las uniones del modelo de cerámica con el material seguro disponible y la función expresamente pedidos, sin exigir cocción ni otros productos.",
          "sufficient": "La función y las uniones principales se reconocen; un detalle secundario queda poco definido.",
          "partial": "Se reconoce la forma solicitada, pero una unión o relación con la función queda sin resolver.",
          "error": "Las decisiones de forma o unión contradicen el modelo dado o impiden reconocer la función pedida.",
          "when": "ceramica"
        },
        {
          "id": "jewelry-use",
          "title": "Forma, cierres y uso de la joyería",
          "success": "Relaciona la forma y los cierres del modelo de joyería con el material seguro disponible y las condiciones de uso ficticio dadas, sin exigir metales preciosos.",
          "sufficient": "La forma y el uso se reconocen; un detalle secundario de cierre queda poco definido sin impedir la función prevista.",
          "partial": "Se reconoce parte del modelo, pero una relación entre forma, cierre y uso queda sin resolver.",
          "error": "La forma o los cierres contradicen las condiciones dadas o impiden reconocer el uso del modelo solicitado.",
          "when": "joyeria"
        },
        {
          "id": "floral-support",
          "title": "Distribución y sostén de la composición floral",
          "success": "Relaciona la distribución y el sostén de los elementos simulados de la composición floral con el propósito y las condiciones expresamente dados.",
          "sufficient": "La composición y su propósito se reconocen; un detalle secundario de distribución queda poco definido.",
          "partial": "Se reconocen elementos pertinentes, pero una relación de distribución o sostén no contribuye al propósito pedido.",
          "error": "La distribución o el sostén no permiten reconocer la composición y el propósito expresamente trabajados.",
          "when": "floral"
        },
        {
          "id": "furniture-structure",
          "title": "Estructura y función representada del mueble",
          "success": "Relaciona estructura y uniones de la maqueta de mueblería con la función representada del mueble dado mediante los materiales ligeros disponibles, sin exigir un objeto de uso real.",
          "sufficient": "La estructura y la función representada se reconocen; una unión secundaria queda poco definida.",
          "partial": "Se reconoce parte de la estructura, pero una relación de unión o función queda sin resolver.",
          "error": "Las decisiones de estructura o unión contradicen el modelo dado o impiden reconocer la función representada.",
          "when": "muebleria"
        },
        {
          "id": "leatherwork-pattern",
          "title": "Patrón, uniones y uso del prototipo",
          "success": "Relaciona el patrón y las uniones del prototipo de talabartería con el uso ficticio dado mediante el material alternativo seguro acordado, sin exigir cuero real.",
          "sufficient": "El patrón y el uso se reconocen; una unión secundaria queda poco definida.",
          "partial": "Se reconoce parte del patrón, pero una unión no se relaciona con el uso expresamente pedido.",
          "error": "Las decisiones de patrón o unión contradicen las condiciones dadas o impiden reconocer el uso previsto del prototipo.",
          "when": "talabarteria"
        },
        {
          "id": "pyrography-design",
          "title": "Trazo, contraste y soporte de la simulación",
          "success": "Relaciona trazo, contraste y soporte elegidos con el motivo de la simulación de pirograbado expresamente dado mediante el dibujo o medio seguro acordado.",
          "sufficient": "El motivo y sus relaciones visuales se reconocen; un detalle secundario de trazo queda poco definido.",
          "partial": "Se reconoce parte del motivo, pero una relación de trazo o contraste queda sin resolver.",
          "error": "Las decisiones visuales contradicen el motivo dado o no permiten reconocer la simulación expresamente solicitada.",
          "when": "pirograbado|grabado"
        },
        {
          "id": "craft-technique-function",
          "title": "Técnica, forma y función elegidas",
          "success": "Relaciona las decisiones de forma y unión del modelo o producto artesanal elegido con la técnica segura, el material disponible y la función expresamente pedidos, sin exigir otras ramas artesanales.",
          "sufficient": "La función y las relaciones principales se reconocen; una unión o detalle secundario queda poco definido.",
          "partial": "Se reconocen decisiones pertinentes, pero una relación entre forma, unión o función queda sin resolver.",
          "error": "Las decisiones contradicen las condiciones dadas o impiden reconocer la función artesanal solicitada.",
          "when": "^(?!.*(?:joyeria|floral|ceramica|muebleria|talabarteria|pirograbado|grabado))"
        }
      ]
    },
    {
      "id": "costumbrista-art",
      "grade": 4,
      "label": "arte costumbrista dominicano y caribeño",
      "match": "costumbrista",
      "relation": "las relaciones entre rasgos representados, recursos visuales y contexto documentado del arte costumbrista dominicano o caribeño examinado, sin inventar costumbres privadas",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "89f94310-4367-5a85-8704-7db8f00b53a0"
      ],
      "evidence": [
        {
          "id": "costumbrista-evidence",
          "title": "Rasgos y evidencia del costumbrismo",
          "success": "Relaciona rasgos costumbristas identificables con recursos y datos contextuales de los ejemplos proporcionados, sin atribuir costumbres a personas reales sin evidencia.",
          "sufficient": "Los rasgos y su contexto se reconocen; una relación secundaria queda poco precisada.",
          "partial": "Identifica un rasgo pertinente, pero una relación con la obra o su contexto queda sin evidencia.",
          "error": "Las atribuciones contradicen los ejemplos o sustituyen evidencias por estereotipos sobre personas."
        }
      ]
    },
    {
      "id": "popular-art-contrast",
      "grade": 4,
      "label": "arte popular dominicano y caribeño",
      "match": "arte popular",
      "relation": "las similitudes y diferencias de recursos, contexto y sentido de las manifestaciones de arte popular dominicano y caribeño examinadas, usando evidencias sin calificar gustos",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "c8c2f28f-4fa2-539d-a72c-69156d79b719",
        "f7af1069-fa17-5286-bc8d-759fefdbc94d"
      ],
      "evidence": [
        {
          "id": "popular-art-relations",
          "title": "Relaciones entre manifestaciones populares",
          "success": "Sostiene similitudes y diferencias entre las manifestaciones expresamente dadas mediante rasgos y evidencias identificables de sus recursos y contexto.",
          "sufficient": "El contraste principal se sostiene en ejemplos; una relación secundaria queda poco precisada.",
          "partial": "Presenta rasgos pertinentes, pero una similitud o diferencia no se vincula con los ejemplos.",
          "error": "Las similitudes o diferencias atribuidas contradicen los ejemplos o se sustituyen evidencias por juicios de gusto."
        }
      ]
    },
    {
      "id": "collective-creation-plan",
      "grade": 4,
      "label": "coordinación de creación artística colectiva",
      "match": "creacion artistica colectiva|proyectos artisticos de creacion colectiva|roles.*creacion colectiva",
      "relation": "las relaciones entre roles, acuerdos, recursos y secuencia de tareas de la creación artística colectiva expresamente examinada, sin inferir personalidad",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "0fbb1c5a-df7d-535f-a5fa-4dd56e8cba50"
      ],
      "evidence": [
        {
          "id": "collective-actions",
          "title": "Roles, acuerdos y secuencia de creación",
          "success": "Relaciona las acciones observables de los roles y acuerdos con la secuencia y los recursos expresamente dados para la creación artística colectiva.",
          "sufficient": "Las acciones y acuerdos principales se relacionan con la creación; una coordinación secundaria queda poco definida.",
          "partial": "Se reconocen acciones pertinentes, pero una relación de rol o secuencia queda sin resolver.",
          "error": "Las acciones contradicen los acuerdos dados o impiden reconocer la coordinación solicitada.",
          "plan": {
            "title": "Plan de coordinación artística colectiva",
            "success": "Planifica roles, acuerdos, recursos y secuencia de tareas coherentes con la creación artística colectiva del caso dado, sin exigir ejecución observada.",
            "sufficient": "El plan relaciona roles y tareas; un acuerdo secundario queda poco precisado.",
            "partial": "El plan identifica roles, pero una relación de tarea, acuerdo o recurso queda sin resolver.",
            "error": "La distribución de roles o tareas contradice las condiciones del caso o impide realizar la creación prevista."
          }
        }
      ]
    },
    {
      "id": "public-art",
      "grade": 4,
      "label": "arte público y sus implicaciones",
      "match": "arte publico",
      "relation": "las relaciones entre obra, espacio, acceso y público en el arte público examinado y sus implicaciones documentadas, sin exigir una intervención real",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "54e498a7-8dbb-5599-b6ea-3f8b63d5e763"
      ],
      "evidence": [
        {
          "id": "public-work-space",
          "title": "Obra, espacio y público",
          "success": "Relaciona los recursos y condiciones de la obra propuesta con el espacio y el público del caso dado, respetando los límites expresos de la simulación.",
          "sufficient": "La obra y su público se reconocen; una condición secundaria del espacio queda poco definida.",
          "partial": "Se reconocen elementos pertinentes, pero una relación entre obra, espacio y público queda sin resolver.",
          "error": "Las decisiones contradicen las condiciones del caso o no permiten reconocer la función pública solicitada."
        }
      ]
    },
    {
      "id": "environment-art-project",
      "grade": 4,
      "label": "resignificación artística para ambiente y salud",
      "match": "proyecto.*(?:resignifi|cuidado ambiental)|resignifi.*(?:ambiente|salud)",
      "relation": "las relaciones entre referente artístico dado, decisiones de resignificación y mensaje ambiental o de cuidado de la propuesta examinada, distinguiendo intención y efectos demostrados",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "463e4c86-ac14-50f1-aefd-4d6b545c8524"
      ],
      "evidence": [
        {
          "id": "environment-resignification",
          "title": "Referente y sentido del cuidado ambiental",
          "success": "Resignifica rasgos identificables de la obra dada mediante recursos y acciones coherentes con el mensaje ambiental o de cuidado expresamente acordado, sin prometer efectos terapéuticos.",
          "sufficient": "El referente y el mensaje se reconocen; una decisión expresiva secundaria queda poco definida.",
          "partial": "Se reconoce parte del referente, pero una decisión no contribuye al mensaje de cuidado pedido.",
          "error": "Las decisiones contradicen el referente o no permiten reconocer el mensaje expresamente trabajado.",
          "plan": {
            "title": "Plan de resignificación y cuidado",
            "success": "Planifica la resignificación de rasgos identificables de la obra dada mediante recursos y acciones previstos coherentes con el mensaje ambiental o de cuidado acordado, sin exigir ejecución ni resultados de salud.",
            "sufficient": "El plan relaciona referente, recursos y mensaje; una acción secundaria queda poco precisada.",
            "partial": "El plan identifica el referente, pero una relación con las acciones o el mensaje queda sin resolver.",
            "error": "Las acciones previstas contradicen el referente o no permiten reconocer el mensaje de cuidado solicitado."
          }
        }
      ]
    },
    {
      "id": "social-art-proposal",
      "grade": 4,
      "label": "propuestas artísticas de contenido social elegido",
      "match": "propuesta artistica.*(?:idea ambiental|ideas politicas|contenido social)",
      "relation": "las relaciones entre recursos artísticos y el mensaje social ficticio expresamente elegido en la propuesta examinada, sin exigir todas las problemáticas ni una postura predeterminada",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "6f646678-325f-5396-bbd4-2c7494357b12"
      ],
      "evidence": [
        {
          "id": "chosen-social-message",
          "title": "Recursos y mensaje social elegido",
          "success": "Relaciona los recursos expresivos elegidos con el mensaje social ficticio expresamente acordado para que su sentido sea reconocible, sin exigir otros temas ni experiencias privadas.",
          "sufficient": "El mensaje y los recursos se relacionan; una elección secundaria deja una ambigüedad sin cambiar el sentido principal.",
          "partial": "Se reconoce parte del mensaje, pero un recurso expresivo no contribuye al sentido acordado.",
          "error": "Los recursos no permiten reconocer el mensaje solicitado o contradicen las condiciones del caso ficticio."
        }
      ]
    },
    {
      "id": "rhythm-coordination",
      "grade": 4,
      "label": "coordinación rítmica adaptada",
      "match": "registra.*frecuencia.*pulso|coordinacion psicomotriz|frecuencia.*coordina",
      "relation": "las relaciones observables entre pulso, secuencia y adaptaciones acordadas de la producción artística, sin evaluar apariencia corporal ni diagnósticos",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "5afafbf7-9697-5e8d-bf9c-1e48c4fd63c2"
      ],
      "evidence": [
        {
          "id": "observed-rhythm",
          "title": "Coordinación del pulso y la secuencia adaptada",
          "success": "Coordina el pulso y la secuencia adaptada expresamente acordados en todas las oportunidades observadas.",
          "sufficient": "Coordina el pulso y la secuencia adaptada en casi todas las oportunidades observadas.",
          "partial": "Coordina el pulso y la secuencia adaptada en algunas oportunidades observadas.",
          "error": "Coordina el pulso y la secuencia adaptada en pocas oportunidades observadas.",
          "absent": "No coordina el pulso y la secuencia adaptada en las oportunidades observadas."
        }
      ]
    },
    {
      "id": "school-art-exhibition",
      "grade": 4,
      "label": "presentación en muestras y festivales escolares",
      "match": "presenta.*muestra escolar|festival.*arte escolar",
      "relation": "las relaciones entre obra, recursos expresivos y propósito de su presentación en la muestra o festival escolar expresamente examinado, sin exigir otro producto o evento externo",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "88718414-d991-5ca7-968a-3be73cd20a40"
      ],
      "evidence": [
        {
          "id": "work-presentation",
          "title": "Obra y propósito de presentación",
          "success": "Relaciona los recursos de presentación de la obra existente con el propósito y las condiciones de la muestra escolar acordados, sin exigir crear otra obra.",
          "sufficient": "La obra y su propósito se reconocen; un recurso secundario de presentación queda poco definido.",
          "partial": "La obra se presenta, pero una relación entre recurso y propósito queda sin resolver.",
          "error": "Los recursos utilizados contradicen las condiciones dadas o impiden reconocer el propósito de presentación solicitado."
        }
      ]
    },
    {
      "id": "heritage-form-content",
      "grade": 4,
      "label": "forma y contenido del patrimonio artístico",
      "match": "obra patrimonial|patrimonio artistico dominicano|patrimonio.*forma.*contenido",
      "relation": "las relaciones entre forma, contenido y aportes documentados de la obra patrimonial dominicana o caribeña examinada, sin exigir admiración personal",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "46114729-0ff6-503e-87dd-6b1b1601c12e"
      ],
      "evidence": [
        {
          "id": "heritage-argument",
          "title": "Aportes sustentados en forma y contenido",
          "success": "Sostiene el aporte atribuido a la obra patrimonial dada mediante razones y evidencias identificables de su forma, contenido y fuentes, sin exigir admiración o adhesión cultural.",
          "sufficient": "El aporte principal se sostiene en rasgos y fuentes; una relación secundaria queda poco precisada.",
          "partial": "Presenta una razón pertinente, pero una relación de forma, contenido o aporte no se vincula con su evidencia.",
          "error": "Los aportes atribuidos contradicen las fuentes o sustituyen evidencias por juicios de admiración personal."
        }
      ]
    },
    {
      "id": "artistic-instrument",
      "grade": 4,
      "label": "construcción de instrumentos sonoros para la obra",
      "match": "crea[a-z]*.*instrumento sonoro|construccion de instrumentos sonoros",
      "relation": "las relaciones entre materiales seguros, uniones, producción de sonido y función del instrumento sencillo expresamente examinado en la obra ficticia dada",
      "pdfPages": [
        343
      ],
      "sourceRecordIds": [
        "5104d7d3-99a3-58ac-8bc3-b809e62097b9"
      ],
      "evidence": [
        {
          "id": "instrument-sound-function",
          "title": "Construcción, sonido y función del instrumento",
          "success": "Relaciona materiales seguros y uniones con la producción de sonido y la función del instrumento sencillo expresamente requerido en la obra ficticia dada.",
          "sufficient": "El sonido y su función se reconocen; una unión secundaria queda poco definida sin impedir el uso previsto.",
          "partial": "Se reconoce parte del funcionamiento, pero una unión o decisión material no se relaciona con el sonido pedido.",
          "error": "Las decisiones materiales o uniones impiden reconocer el funcionamiento sonoro expresamente solicitado."
        }
      ]
    },
    {
      "id": "art-exponents-research",
      "grade": 4,
      "label": "investigación de exponentes del arte y su contexto",
      "match": "exponentes.*arte dominicano|investiga.*artistas dominicanos",
      "relation": "las relaciones entre propuestas de los exponentes dominicanos o caribeños expresamente examinados, evidencias de las fuentes y su contexto histórico o actualidad",
      "pdfPages": [
        343,
        341
      ],
      "sourceRecordIds": [
        "c7d0fbea-580f-5c3a-a036-198622aeffed",
        "20c6966b-45f6-53c1-b0fa-f55bbf531639"
      ],
      "evidence": [
        {
          "id": "proposals-context-sources",
          "title": "Propuestas artísticas, contexto y fuentes",
          "success": "Relaciona las propuestas de los exponentes asignados con evidencias identificables de las fuentes y el contexto histórico o actual expresamente pedido, sin exigir entrevistas ni historias privadas.",
          "sufficient": "Las propuestas y su contexto se sostienen en fuentes; una relación secundaria queda poco precisada.",
          "partial": "Presenta datos pertinentes, pero una relación entre propuesta y contexto no se vincula con su fuente.",
          "error": "Las atribuciones o relaciones de contexto contradicen las fuentes o no permiten reconocer las propuestas investigadas.",
          "when": "^(?!.*(?:historico.*actualidad|actualidad.*historico))"
        },
        {
          "id": "historical-current-proposals",
          "title": "Propuestas artísticas y contextos",
          "success": "Relaciona las propuestas de los exponentes asignados con evidencias identificables de las fuentes y el contexto histórico y la actualidad expresamente pedidos, sin exigir entrevistas ni historias privadas.",
          "sufficient": "Las propuestas y su contexto se sostienen en fuentes; una relación secundaria queda poco precisada.",
          "partial": "Presenta datos pertinentes, pero una relación entre propuesta y contexto no se vincula con su fuente.",
          "error": "Las atribuciones o relaciones de contexto contradicen las fuentes o no permiten reconocer las propuestas investigadas.",
          "when": "historico.*actualidad|actualidad.*historico"
        }
      ]
    }
  ],
  "policy": "REQUESTED_ARTISTIC_EVIDENCE_V1"
}]} as unknown as EvaluationCatalog
