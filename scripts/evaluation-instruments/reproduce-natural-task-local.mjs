import {writeFileSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {localClient,context} from './language-local-client.mjs'
export const futureTitle='My Future Plans (Mis planes para el futuro).'
export const futureDescription='Los estudiantes elaborarán una presentación oral y escrita en inglés sobre sus planes y metas para el futuro, utilizando las estructuras gramaticales will y going to. Describirán sus aspiraciones académicas, profesionales y personales mediante oraciones sencillas y coherentes. Finalmente, compartirán sus presentaciones con sus compañeros, fortaleciendo sus habilidades de expresión oral, escritura y comunicación en inglés.'
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const {health,request}=await localClient()
 const input={sectionSubjectId:context.assignments.find(a=>a.grade===4&&a.code==='ING').id,activityTitle:futureTitle,description:futureDescription,maxScore:20,participationMode:'INDIVIDUAL'}
 const interpretation=await request('/evaluation-instruments/interpret',{sectionSubjectId:input.sectionSubjectId,activityTitle:input.activityTitle,description:input.description})
 const initial=await request('/evaluation-instruments/recommend',input)
 const candidates=await request('/evaluation-instruments/recommend',{...input,preferredInstrumentType:initial.instrumentType,includeAdditionalCandidates:true})
 writeFileSync('docs/curriculum/cobertura-secundaria/evidencias/consignas-antes-66.json',JSON.stringify({input,health,interpretation,initial,candidates},null,2)+'\n')
 console.log(JSON.stringify({health,interpretation,criteria:initial.criteria.map(c=>({id:c.templateId,title:c.title})),candidates:candidates.criteria.map(c=>c.templateId)},null,2))
}
