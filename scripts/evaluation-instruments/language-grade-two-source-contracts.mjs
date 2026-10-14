import {readFileSync,writeFileSync} from 'node:fs'
import assert from 'node:assert/strict'
const scope=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/inventario.json','utf8')).scopes.find(s=>s.grade===2&&s.subject.startsWith('Lengua')&&s.character==='COMMON')
const bindings=[
 ['news-analysis-structure','news-analysis-questions','news-feature-newsworthiness','news-feature-newsworthiness','news-feature-complex-sentences','news-feature-paratext','news-feature-synonyms','news-feature-indicative','news-feature-paragraphs'],
 ['organization','feature-appearance','feature-nouns','feature-indicative','feature-signs','feature-spatial-connectors','feature-adjectives','feature-vocabulary','feature-persuasion','graphics','feature-auxiliary-signs'],
 ['problem-solution','problem-solution','feature-indicative','feature-questions','feature-paragraphs','ideas','feature-adjectives','feature-agreement','feature-demonstratives','feature-connectors','feature-comparatives'],
 ['structure','summary','paragraphs','structure','paragraphs','feature-indicative','summary'],
 ['conflict','feature-authorship','feature-authorship','characters','feature-indicative','feature-subjunctive','feature-literary','feature-adjectives','feature-dialogue'],
 ['verse','verse','feature-literary','feature-interjections'],
]
const ids=['noticia','guia-turistica','articulo-expositivo','informe-de-lectura','cuento-amor-amistad','decima-espinela']
const contracts=scope.topics.flatMap((topic,index)=>{
 assert.equal(topic.subtopics.length,bindings[index].length)
 return topic.subtopics.map((source,i)=>({topicId:topic.id,topic:topic.title,source,
 description:`Analizarán ${topic.title.replace(/\s+/g,' ').toLowerCase()} atendiendo a ${source.text.replace(/^•\s*/,'').replace(/\s+/g,' ')}. Sustentarán sus respuestas con ejemplos disponibles.`,
 criterion:index===0?bindings[index][i]:`len-2-${ids[index]}-${bindings[index][i]}`,
 }))
})
writeFileSync('data/evaluation-instruments/language-grade-two-subtopic-contracts.json',JSON.stringify(contracts,null,2)+'\n')
console.log(JSON.stringify({subtopics:contracts.length,procedureBlocks:scope.topics.reduce((n,t)=>n+t.procedures.length,0)}))
