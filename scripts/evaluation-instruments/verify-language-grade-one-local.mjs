import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {localClient,context,fingerprint} from './language-local-client.mjs'

const {request,health}=await localClient()
assert.equal(health.development.catalogVersion,'evaluation-2026.20')
const assignment=context.assignments.find(row=>row.grade===1&&row.code==='LEN')
const groups=['news','guide','reading-report','poster','detective','calligram']
const families=groups.flatMap(group=>JSON.parse(readFileSync(`data/evaluation-instruments/${group}-grade-one-regressions.json`,'utf8')).map(row=>({
  ...row,group,expectedType:row.expectedType??row.activityType,
  description:row.description+(/PRESENTATION|EXPLANATION/.test(row.expectedType??row.activityType)?' La exposición será oral.':''),
})))
families.push(...[
  ['news','RESEARCH','Investiga los datos de una noticia y documenta sus fuentes.'],
  ['guide','RESEARCH','Investiga los lugares de una guía turística y comprueba sus datos.'],
  ['poster','REPORT','Redacta un informe sobre un afiche, analiza su contenido y formula una conclusión.'],
  ['detective','REPORT','Redacta un informe sobre un cuento policíaco, analiza al narrador y formula una conclusión.'],
  ['calligram','REPORT','Redacta un informe sobre un caligrama, analiza su figura y formula una conclusión.'],
].map(([group,expectedType,description])=>({id:`${group}-${expectedType.toLowerCase()}`,group,expectedType,description,templatePrefix:group==='reading-report'?'report-':`${group}-`,activityTitle:'Trabajo de clase'})))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada']
const summaries=[],examples=[]
const check=proposal=>{
  assert.equal(proposal.catalogVersion,'evaluation-2026.20')
  assert.equal(proposal.curriculumVersionId,context.versionId)
  assert(proposal.curriculumScopeId)
  assert.equal(proposal.internalTrace.mappingStatus,'RESOLVED')
  assert.equal(proposal.criteria.reduce((n,c)=>n+c.maxScoreUnits,0),proposal.totalScoreUnits)
  for(const criterion of proposal.criteria) {
    assert(criterion.title.trim()&&criterion.description.trim())
    assert(!criterion.templateId.startsWith('task-'))
    assert(!/No aporta evidencia suficiente para valorar/.test(JSON.stringify(criterion)))
  }
}
for(const fixture of families) {
  for(const maxScore of fixture===families[0]?[15,20,17.35]:[17.35]) for(const preferredInstrumentType of formats) {
    const results=await Promise.all([fixture.activityTitle,'Actividad de clase','El ciclo del agua'].map(activityTitle=>request('/evaluation-instruments/recommend',{
      sectionSubjectId:assignment.id,activityTitle,description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType,
    })))
    for(const proposal of results) {
      check(proposal)
      assert.equal(proposal.activityType,fixture.expectedType,fixture.id)
      assert.equal(proposal.instrumentType,preferredInstrumentType)
      assert.equal(proposal.totalScoreUnits,Math.round(maxScore*100))
      assert(proposal.criteria.every(c=>c.templateId.startsWith(fixture.templatePrefix)),fixture.id)
      assert.deepEqual(proposal.criteria,results[0].criteria,'The title must not substitute the description')
    }
    summaries.push({case:fixture.id,format:preferredInstrumentType,maxScore,titles:3,criteria:results[0].criteria.map(c=>c.templateId),hash:fingerprint(results[0].criteria)})
    if(maxScore===17.35&&!examples.some(e=>e.group===fixture.group&&e.format===preferredInstrumentType)) examples.push({group:fixture.group,format:preferredInstrumentType,description:fixture.description,proposal:results[0]})
  }
  console.log(`Familia verificada: ${fixture.id}`)
}
const subtopics=JSON.parse(readFileSync('data/evaluation-instruments/language-grade-one-subtopic-contracts.json','utf8'))
for(const subtopic of subtopics) {
  for(const preferredInstrumentType of formats) {
    const proposal=await request('/evaluation-instruments/recommend',{sectionSubjectId:assignment.id,activityTitle:'Actividad',description:subtopic.description,maxScore:17.35,participationMode:'INDIVIDUAL',preferredInstrumentType})
    check(proposal)
    assert(proposal.criteria.some(c=>c.templateId===subtopic.expectedCriterion),subtopic.description)
    summaries.push({subtopicId:subtopic.source.id,format:preferredInstrumentType,criteria:proposal.criteria.map(c=>c.templateId),hash:fingerprint(proposal.criteria)})
  }
}
const automatic=[]
for(const [purpose,expected] of [
  ['Se valorará la calidad de la interpretación en varias dimensiones.','rubrica'],
  ['Se verificará la presencia o ausencia de titular, entrada y cuerpo.','lista-cotejo'],
  ['Se registrará la regularidad de las identificaciones durante las lecturas.','escala'],
  ['Se asignarán pesos entre los componentes verificables.','lista-ponderada'],
]) {
  const input={sectionSubjectId:assignment.id,activityTitle:'La noticia',description:`Analizarán una noticia. ${purpose}`,participationMode:'INDIVIDUAL'}
  const {participationMode,...interpretInput}=input
  const interpreted=await request('/evaluation-instruments/interpret',interpretInput)
  const proposal=await request('/evaluation-instruments/recommend',{...input,maxScore:20})
  assert.equal(interpreted.suggestedInstrumentType,expected)
  assert.equal(proposal.instrumentType,expected)
  automatic.push({purpose,expected,interpreted,proposal})
}
const root='docs/curriculum/cobertura-secundaria/evidencias/'
writeFileSync(root+'lengua-1-servicio-normal.json',JSON.stringify({verifiedAt:new Date().toISOString(),health,sectionSubjectId:assignment.id,families:families.map(f=>({id:f.id,description:f.description,activityType:f.expectedType})),subtopicCount:subtopics.length,requests:summaries.reduce((n,r)=>n+(r.titles??1),0)+8,summaries,automatic},null,2)+'\n')
writeFileSync(root+'lengua-1-instrumentos-completos.json',JSON.stringify(examples,null,2)+'\n')
console.log(JSON.stringify({families:families.length,subtopics:subtopics.length,formats:4,totals:[15,20,17.35],normalService:true}))
