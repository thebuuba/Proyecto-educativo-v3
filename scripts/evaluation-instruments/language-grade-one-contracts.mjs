import {readFileSync,writeFileSync} from 'node:fs'

// Explicit bindings reviewed against PDF 69–74; official text is kept apart from tasks.
const topics=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8')).scopes.find(s=>s.grade===1&&s.subject==='Lengua Española'&&s.character==='COMMON').topics
const bindings=[
  ['news-structure','news-questions','news-feature-newsworthiness','news-feature-connectors','news-feature-indicative','news-feature-synonyms','news-feature-punctuation','news-feature-abbreviations','news-feature-paratext'],
  ['guide-structure','guide-structure','guide-feature-appearance','guide-feature-nouns','guide-feature-nouns','guide-feature-adjectives','guide-feature-persuasion','guide-feature-indicative','guide-feature-signs','guide-feature-signs','guide-feature-noun-group','guide-resources'],
  ['report-purpose','report-structure','report-summary','report-feature-summary','report-feature-adjectives','report-feature-indicative','report-feature-exemplification'],
  ['poster-purpose','poster-persuasion','poster-purpose','poster-feature-literary','poster-persuasion','poster-feature-imperative','poster-feature-connotation','poster-feature-prevention','poster-feature-periphrasis'],
  ['detective-structure','detective-characters','detective-narrator','detective-resources','detective-feature-actants','detective-feature-indicative','detective-feature-adverbs','detective-feature-adjectives','detective-feature-connectors'],
  ['calligram-relation','calligram-feature-typography','calligram-relation','calligram-intention','calligram-feature-free-verse','calligram-feature-literary','calligram-feature-nouns','calligram-feature-adjectives','calligram-feature-description'],
]
const contracts=topics.flatMap((topic,i)=>topic.subtopics.map((subtopic,j)=>({
  topicId:topic.id,topic:topic.title,source:subtopic,
  description:`Analiza ${topic.title.toLocaleLowerCase('es-DO')} atendiendo a ${subtopic.text.replace(/^•\s*/,'').replace(/\s+/g,' ')}. Sustenta las respuestas con evidencias disponibles.`,
  expectedCriterion:bindings[i][j],
})))
writeFileSync('data/evaluation-instruments/language-grade-one-subtopic-contracts.json',JSON.stringify(contracts,null,2)+'\n')
console.log(`Contratos curriculares: ${contracts.length}`)
