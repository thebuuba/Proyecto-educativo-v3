import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
const root='docs/curriculum/cobertura-secundaria/'
const inventory=JSON.parse(readFileSync(root+'inventario.json','utf8'))
const scope=inventory.scopes.find(s=>s.grade===1&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const subtopics=JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-subtopic-contracts.json','utf8'))
const explicit=[...JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-procedure-contracts.json','utf8')),...JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-completion-contracts.json','utf8'))]
// Reviewed source blocks in PDF reading order. A didactic condition is not imposed as a new evidence requirement.
const blocks=[
  [
    ['news-analysis','Intención, estructura, interrogantes e inferencias del texto escuchado.'],
    ['news-cast','Elección de hecho, datos, organización y expresión oral; marcadores y vocabulario cuando se solicitan.'],
    ['news-analysis','Anticipación y comprensión de datos. La modalidad de lectura es una condición didáctica, no una producción adicional.'],
    ['news-analysis','Continuación: inferencia de vocabulario y paráfrasis.'],
    ['news-writing','Composición periodística, información y destinatario; investigación, gramática y revisión según requisitos explícitos.'],
    ['news-writing','Edición/publicación solamente cuando se solicita; no se exige un medio específico ausente.'],
  ],[
    ['guide-analysis','Comprensión oral y anticipación a partir de indicios gráficos disponibles.'],
    ['guide-analysis','Continuación: recursos lingüísticos y paráfrasis; la cabecera de producción oral inicia el bloque siguiente.'],
    ['guide-presentation','Lugares, público, clasificación, información, representación gráfica solicitada y descripción topográfica.'],
    ['guide-presentation','Uso oral de sustantivos, grados del adjetivo, presente y conectores espaciales/temporales.'],
    ['guide-analysis','Intención, estructura y recursos lingüísticos; inferencias con indicios presentes.'],
    ['guide-analysis','Clasificación de lugares y reconstrucción con representación solicitada.'],
    ['guide-creation','Composición, recursos explícitos, gramática y puntuación; soportes alternativos conservados.'],
    ['guide-creation','Borrador, revisión y publicación cuando forman parte de la consigna.'],
  ],[
    ['reading-report-analysis','Comprensión del informe escuchado, anticipación, estructura e interpretación sustentada.'],
    ['reading-report-presentation','Resumen e interpretación oral del texto leído; patrones socioculturales cuando se solicitan.'],
    ['reading-report-analysis','Comprensión escrita y anticipación.'],
    ['reading-report-writing','Planificación, síntesis por operaciones, análisis, organización, recursos lingüísticos y puntuación.'],
    ['reading-report-writing','Versiones, corrección y publicación explícitas; corrección focal no exige reescribir todo el informe.'],
  ],[
    ['poster-analysis','Intención, recursos persuasivos, anticipación e interpretación/paráfrasis del mensaje.'],
    ['poster-creation','Destinatario, convocatoria, planificación textual/visual, imperativo y argumentos/recursos poéticos expresos.'],
    ['poster-creation','Organización de componentes gráficos presentes; no exige simultáneamente todas las alternativas.'],
  ],[
    ['detective-analysis|detective-narration','Bloque mixto: comprensión de elementos disponibles y narración oral; voces y expresión según la consigna.'],
    ['detective-narration','Continuación de producción oral: caracterización, lenguaje y recursos expresivos.'],
    ['detective-analysis','Comprensión escrita, indicios paratextuales, personajes/ambiente, conectores y paráfrasis.'],
    ['detective-writing','Planificación narrativa, trama/personajes/ambiente, recursos, revisión, ilustración y publicación solicitadas.'],
  ],[
    ['calligram-analysis','Intención, sentido, relación texto/figura y recursos poéticos presentes en el texto escuchado.'],
    ['calligram-analysis','Paráfrasis oral de lo comprendido; no equivale a recitar o escribir un poema.'],
    ['calligram-recitation|calligram-analysis','Bloque mixto: expresión de recursos en recitación y comprensión escrita de rima/ritmo/figuras.'],
    ['calligram-creation','Texto/figura, intención y recursos; borradores, revisión y publicación explícitas. El bloque de noticia al pie de PDF 74 no se atribuye al caligrama.'],
  ],
]
const groups=['news','guide','reading-report','poster','detective','calligram']
const reviewed=scope.topics.map((topic,index)=>{
  assert.equal(topic.procedures.length,blocks[index].length)
  const families=JSON.parse(readFileSync(`data/evaluation-instruments/${groups[index]}-grade-one-regressions.json`,'utf8'))
  const sourceSubtopics=topic.subtopics.map(s=>s.id)
  assert(sourceSubtopics.every(id=>subtopics.some(c=>c.source.id===id)))
  const procedures=topic.procedures.map((procedure,p)=>{
    const [caseIds,note]=blocks[index][p]
    assert(caseIds.split('|').every(id=>families.some(f=>f.id===id)))
    return {sourceId:procedure.id,pdfPage:procedure.pdfPage,coreCases:caseIds.split('|'),explicitCases:explicit.filter(c=>c.sourceId===procedure.id).map(c=>c.id??c.criterion),review:note}
  })
  return {topicId:topic.id,title:topic.title,subtopics:sourceSubtopics,families:families.map(f=>({case:f.id,activityType:f.expectedType??f.activityType})),procedures}
})
writeFileSync(root+'lengua-1-cotejo-fuente.json',JSON.stringify({sourceSha256:inventory.source.sha256,pdfPages:[69,70,71,72,73,74,75],scope:'Lengua Española común, primero; familias definidas, no interpretación universal de cualquier consigna.',topics:reviewed},null,2)+'\n')
console.log(JSON.stringify({topics:reviewed.length,subtopics:reviewed.reduce((n,t)=>n+t.subtopics.length,0),procedureBlocks:reviewed.reduce((n,t)=>n+t.procedures.length,0)}))
