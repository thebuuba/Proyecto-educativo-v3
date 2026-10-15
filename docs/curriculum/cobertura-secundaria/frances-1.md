# Francés común — 1.º de secundaria

## Estado del bloque

Proveedor conectado en código y catálogo `evaluation-2026.70`, instalado solo en AulaBase Development (`eolgunypmtgrsyrjzcld`). Verificado mediante automatización y HTTP/DB autenticados; recorrido QA visual pendiente por falta de navegador aislado. Rama: `amplia-instrumentos-secundaria`.

## Fuente y alcance real

MINERD 2023, PDF 181–184 / impresas 180–183, ámbito común `ce0c7661-2119-5679-8fed-8e4507b92e17`; [inventario visual](frances-inventario.md) y [registros oficiales](frances-matriz.json). La adaptación de AulaBase separa seis funciones: saludo/despedida, comunicación en aula, identificación personal, descripción de personas/objetos, ubicación y rutinas. No exige todas a la vez ni califica motivación, personalidad o creencias.

El proveedor separa recepción leída/escuchada, producción oral/escrita e interacción oral/escrita. En una consigna mixta conserva las acciones reconocidas; en una alternativa reconocida exige una sola ruta. Los datos personales explícitos se separan en cotejo. Las otras tres estructuras conservan una dimensión de identificación, con progresión o cumplimiento parcial según formato. Se añaden comprensibilidad y relación de turnos cuando la modalidad lo requiere.

Contenido adicional condicionado: nueve familias gramaticales (concordancia, artículos, presente, imperativo, posesivos, pronombres, preposiciones, presentativos y conectores), catorce campos léxicos, cinco familias de géneros (formulario, tarjeta, mensaje/correo, aviso/cartel, poema/rima/canción) y revisión explícita del borrador. El género no obliga a incluir todos los rasgos del currículo. El reconocimiento de una familia no significa reconocer todas sus formulaciones posibles.

## Patrones reconocidos y límites

- Español: lee/lean/leerán, escucha/escucharán, escribe/escriban, redacta, presenta/presentarán, describe, conversa/dialoga, identifica/localiza, completa/utiliza y las formas cubiertas por sus raíces. Incluye «en parejas», «oralmente», «por escrito», «luego/después» y títulos neutrales o incompatibles.
- Francés: lisez/lire/lisent, écoutez/écouter/écoutent, écrivez/écrire/écrivent, rédigez/rédiger, présentez/présenter/présentent, décrivez/décrire/décrivent, échangez/échanger/échangent; par deux, oralement, par écrit, puis/ensuite. El contenido reconoce vocablos curriculares delimitados, como nom/âge/nationalité, routine/activités quotidiennes, salutations, localisation, caractéristiques physiques y nombres de las familias gramaticales/léxicas documentadas en el código.
- Texto mixto: la misma normalización admite instrucciones españolas con términos franceses y viceversa. Conserva apóstrofos, normaliza mayúsculas/acentos para detección y conserva una redacción correcta en los instrumentos generados.
- Negación: excluye cláusulas reconocidas con no/sin y ne…pas/jamais/sans + acciones enumeradas. Alternativas: o/ou antes de una acción reconocida, y oral o escrito; y/et conserva ambas modalidades obligatorias. No es un analizador universal de subordinadas, ironía o negación implícita.
- Los ejemplos entre comillas y las listas «Ejemplo(s): / Exemple(s): / Recursos: / Ressources:» no activan contenido. Los nombres propios no son instrucciones. Una descripción no vacía gobierna sobre el título.
- Entrega: reglas compartidas en español y vocabulario francés acotado para páginas, frases, párrafos, ejemplos, interlineado, fuente y portada; números un/une–dix y cifras, au moins/au plus. Detecta límites incompatibles. No se declara cobertura universal de requisitos de entrega ni de alternativas numéricas complejas.
- Recomendación: recepción discreta propone cotejo; desempeño multidimensional propone rúbrica. Propósitos explícitos de frecuencia/grado, comprobación o pesos pueden recomendar escala, cotejo o ponderada. La elección manual tiene prioridad. La estrategia se sugiere solo con evidencia; una presentación breve sin estrategia reconocible queda pendiente.

## Mecánicas conservadas

Se reutilizan los adaptadores del editor. No se añade otro campo de estrategia ni se cambia el diseño vertical. Se verifican puntuación pendiente, repartos de 20/17.35, completar solo vacíos, contenido manual, adición compatible sin duplicado, agotamiento del conjunto y tope de 20. Las regresiones existentes cubren cambio de formato, conservar/adaptar/cancelar y respuestas obsoletas. La evidencia HTTP/DB confirma por separado persistencia, contexto, identidades y conservación exacta al cambiar estrategia.

## Evidencia disponible y pendiente

- Automatización: suite backend completa final 36.968 pruebas / 95 archivos; frontend 37.576 / 123. Focalizadas francesas finales: backend 128, frontend 103. El build inicial del frontend detectó `modalityCode` ausente en un contexto de prueba; se corrigió y la focalizada y compilación se repitieron. Regresiones nuevas impiden confundir «el presente» con una presentación oral o el encabezado «Consigna» con comunicación de aula; los datos personales mantienen identidades estables al variar los campos solicitados.
- Compilaciones: backend, frontend y `pnpm cloudflare:build` aprobados; este último termina en `--dry-run: exiting now`, sin despliegue. Advertencia existente por tamaño de chunks.
- Catálogo: instalación `CREATED`, segunda ejecución `UNCHANGED`; los dos releases preexistentes conservaron su contenido y `.69` coincide con la copia congelada. No se ejecutó ninguna migración nueva.
- HTTP/DB: 12 interpretaciones y 24 recomendaciones (todos los casos y ambos totales, formatos rotados), con igualdad de contenido servicio/alternativa local. Cuatro actividades ficticias guardadas, editadas y reabiertas, una por formato: `f13347ef-b431-4a25-bb54-f6b7708a7c4e`, `fc035779-5e05-4458-881c-92c6285252c8`, `25e29170-fea7-40c0-b9d2-5edd6b6db83d`, `1499ed9e-cab4-49c2-940c-0820c230a3c7`. Comprobados texto y pesos manuales, centro/asignatura QA, IDs de instrumento/snapshot y conservación exacta al cambiar SIMULATION automática por CASE_STUDY manual. Una ejecución anterior sufrió desconexión SQL/DNS y se descartó; no había creado actividades. No se reintenta una escritura de resultado incierto.
- Entorno servido final: entry `/assets/index-1Rd3evFh.js`, hashes HTTP iguales a los archivos compilados; `/sw.js` también coincide. PostgreSQL `app_backend_local` sin BYPASSRLS, Auth y Storage responden en Development. La caché y el registro de service worker del navegador personal no se inspeccionan mediante esta prueba HTTP.
- Tras el último build se repitieron cuatro recomendaciones de dos consignas y se reabrieron las cuatro actividades existentes: hashes del instrumento sin cambios, estrategia manual conservada. No se crearon duplicados para esta revalidación.
- Navegador: Chrome disponible con la sesión personal; el navegador aislado solicitado para QA no está disponible. No se cierra esa sesión ni se modifica su borrador. Recorrido QA visual pendiente; no se sustituye por pruebas HTTP ni jsdom.

## Prueba manual pendiente

En una sesión de navegador separada, abrir `http://localhost:8787` y acceder con la cuenta QA Development ya existente (credenciales locales ignoradas, no incluidas aquí). Seleccionar `1.º secundaria QA Francés Development / QA Francés / Francés`. Crear una actividad usando la consigna de los [cuatro ejemplos completos](frances-1-ejemplos.md), comprobar estrategia automática y seleccionar otra manualmente. Verificar el instrumento con puntuación inicialmente vacía; asignar 20 y luego 17.35, editar un texto/peso, guardar y reabrir. Repetir para los cuatro formatos y comprobar que cambiar únicamente la estrategia conserva exactamente el instrumento. Al agotar los candidatos, comprobar el aviso persistente. No borrar almacenamiento ni borradores existentes.

## Archivos y reproducción

Contenido y detección: `packages/shared/src/secondary-french*.ts`; conexiones del motor/servicio y sugerencias/preparación del frontend; escala y estrategia compartidas con ramas acotadas a Francés. Release histórico `catalog-v69.ts`, actual `.70`; contratos `french-grade-1-contracts.json`, pruebas backend/frontend y scripts `french-development.mjs`, `run-french-http.mjs`, `verify-development-runtime.mjs`, `french-examples.mjs`. Los scripts restringen el destino a Development y el centro QA existente; no imprimen credenciales.
