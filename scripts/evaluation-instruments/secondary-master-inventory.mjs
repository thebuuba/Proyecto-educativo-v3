import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'

const directory='docs/curriculum/cobertura-secundaria/'
const prior=JSON.parse(readFileSync(directory+'inventario.json','utf8'))
const previousMaster=existsSync(directory+'secundaria-inventario-maestro.json')?JSON.parse(readFileSync(directory+'secundaria-inventario-maestro.json','utf8')):null
const records=readFileSync('data/curriculum/secondary-2023.jsonl','utf8').trim().split('\n').map(JSON.parse)
const hash=createHash('sha256').update(readFileSync('apps/frontend/public/docs/adecuacion-curricular-nivel-secundario-2023.pdf')).digest('hex')
assert.equal(hash,prior.source.sha256)
const scopes=records.filter(r=>r.kind==='scope'&&Number.isInteger(r.grade))
assert.equal(scopes.length,72)
assert.equal(new Set(scopes.map(s=>s.id)).size,72)
const science=JSON.parse(readFileSync(directory+'ciencias-naturaleza-matriz.json','utf8'))
const implemented=new Map([
 ['Lengua Española',{module:'secondary-language-topics.ts',report:'lengua-comun-1-6-informe-final.md'}],
 ['Inglés',{module:'secondary-english.ts',report:'ingles-2-6-informe-consolidado.md'}],
 ['Francés',{module:'secondary-french.ts',report:'frances-continuacion.md'}],
 ['Matemática',{module:'secondary-math-common.ts',report:'matematica-continuacion.md'}],
 ['Ciencias de la Naturaleza',{module:'secondary-science-common.ts',report:'ciencias-naturaleza-matriz.json'}],
])
const socials=new Map([1,2,3,4,5,6].filter(grade=>existsSync(directory+`sociales-${grade}-matriz.json`)).map(grade=>[grade,JSON.parse(readFileSync(directory+`sociales-${grade}-matriz.json`,'utf8'))]))
const arts=new Map([1,2,3,4,5,6].filter(grade=>existsSync(directory+`artistica-${grade}-matriz.json`)).map(grade=>[grade,JSON.parse(readFileSync(directory+`artistica-${grade}-matriz.json`,'utf8'))]))
const physicals=new Map([1,2,3,4,5,6].filter(grade=>existsSync(directory+`physical-${grade}-matriz.json`)).map(grade=>[grade,JSON.parse(readFileSync(directory+`physical-${grade}-matriz.json`,'utf8'))]))
const fhrs=new Map([1,2,3,4,5,6].filter(grade=>existsSync(directory+`fhr-${grade}-matriz.json`)).map(grade=>[grade,JSON.parse(readFileSync(directory+`fhr-${grade}-matriz.json`,'utf8'))]))
const optatives=['optative-hlm-len-4','optative-hlm-len-5','optative-hlm-len-6','optative-hlm-ing-4','optative-hlm-ing-5','optative-hlm-ing-6','optative-hcs-len-4','optative-hcs-len-5'].map(name=>({name,matrix:JSON.parse(readFileSync(directory+name+'-matriz.json','utf8'))}))
const result={source:prior.source,counts:{sourceScopes:records.filter(r=>r.kind==='scope').length,nonGradeHeaders:17,gradeScopes:72,commonGradeScopes:54,optativeGradeScopes:18},policy:'INVENTORY_IS_NOT_VERIFIED_COVERAGE',reviewedGeneralPdfPages:[48,49,55],reviewedOptativeAssignmentPdfPages:[427,461,490,498],scopes:scopes.map(s=>{
 const old=prior.scopes.find(p=>p.id===s.id);assert(old)
 const common=!s.optativeExitName,implementation=common&&s.subjectName==='Ciencias Sociales'&&socials.has(s.grade)?{module:'secondary-social.ts',report:`sociales-${s.grade}-matriz.json`}:common&&s.subjectName==='Educación Artística'&&arts.has(s.grade)?{module:'secondary-art.ts',report:`artistica-${s.grade}-matriz.json`}:common&&s.subjectName==='Educación Física'&&physicals.has(s.grade)?{module:'secondary-physical.ts',report:`physical-${s.grade}-matriz.json`}:common&&s.subjectName==='Formación Integral Humana y Religiosa'&&fhrs.has(s.grade)?{module:'secondary-fhr.ts',report:`fhr-${s.grade}-matriz.json`}:common?implemented.get(s.subjectName):null
 const verification=common&&s.subjectName==='Ciencias de la Naturaleza'?science.grades.find(g=>g.grade===s.grade):common&&s.subjectName==='Ciencias Sociales'?socials.get(s.grade):common&&s.subjectName==='Educación Artística'?arts.get(s.grade):common&&s.subjectName==='Educación Física'?physicals.get(s.grade):common&&s.subjectName==='Formación Integral Humana y Religiosa'?fhrs.get(s.grade):null
 return{id:s.id,grade:s.grade,cycle:s.cycle,area:s.areaName,subject:s.subjectName,character:common?'COMMON':'OPTATIVE',modality:s.modalityName??'COMMON_COMPONENT',exit:s.optativeExitName??null,pdfPages:old.pdfPages,printedPages:old.pdfPages.map(p=>p-1),status:verification?.status??(implementation?'IMPLEMENTED_WITH_EXISTING_EVIDENCE':'PENDING'),provider:implementation?`packages/shared/src/${implementation.module}`:null,evidence:implementation?directory+implementation.report:null,currentRunVerification:verification?'MATRIX_AND_FROZEN_RELEASE_RECHECKED':'NOT_RETESTED',nonApplicable:common?[]:[1,2,3],notes:common&&s.grade>=4?'El componente común no acredita módulos laborales de Técnico-Profesional ni menciones de Artes.':null}
 }),externalSourcesPending:[{component:'Menciones Técnico-Profesionales',status:'OFFICIAL_DESIGNS_TO_LOCATE',reason:'El PDF 2023 remite a diseños propios (PDF55); no inventariados como optativas académicas.'},{component:'Menciones de la modalidad Artes',status:'OFFICIAL_DESIGNS_TO_LOCATE',reason:'Música, Artes Visuales, Artes Escénicas y Artes Aplicadas no equivalen a Educación Artística común.'}]}
for(const row of result.scopes)if(row.subject==='Ciencias Sociales'&&socials.has(row.grade)&&row.character==='COMMON')row.currentRunVerification=socials.get(row.grade).verification.httpDb
for(const row of result.scopes)if(row.subject==='Educación Artística'&&arts.has(row.grade)&&row.character==='COMMON')row.currentRunVerification=arts.get(row.grade).verification.httpDb
for(const row of result.scopes)if(row.subject==='Educación Física'&&physicals.has(row.grade)&&row.character==='COMMON')row.currentRunVerification=physicals.get(row.grade).verification.httpDb
for(const row of result.scopes)if(row.subject==='Formación Integral Humana y Religiosa'&&fhrs.has(row.grade)&&row.character==='COMMON')row.currentRunVerification=fhrs.get(row.grade).verification.httpDb
for(const {name,matrix} of optatives){
 assert.equal(matrix.source.sha256,hash)
 const row=result.scopes.find(s=>s.id===matrix.scopeId)
 assert(row);assert.equal(row.character,'OPTATIVE');assert.equal(row.grade,matrix.grade);assert.equal(row.exit,matrix.optativeExitName);assert.equal(row.subject,matrix.subjectName)
 Object.assign(row,{status:matrix.status,provider:matrix.provider,evidence:directory+name+'-matriz.json',currentRunVerification:matrix.verification.httpDb,notes:previousMaster?.scopes.find(s=>s.id===row.id)?.notes??row.notes})
}
const complementary=JSON.parse(readFileSync(directory+'fuentes-complementarias.json','utf8'))
const optativeSourceReview=JSON.parse(readFileSync(directory+'optativas-fuentes-revisadas.json','utf8'))
assert.equal(optativeSourceReview.sourceSha256,hash)
assert.equal(optativeSourceReview.scopes.length,18)
assert(optativeSourceReview.scopes.every(s=>result.scopes.some(r=>r.character==='OPTATIVE'&&r.id===s.scopeId&&r.grade===s.grade&&r.exit===s.optativeExitName)))
result.reviewedOptativeScopeIds=optativeSourceReview.scopes.map(s=>s.scopeId)
result.optativeSourceReview=directory+'optativas-fuentes-revisadas.json'
result.externalSourcesPending[0].status=complementary.technicalProfessional.status
result.externalSourcesPending[1].status=complementary.arts.status
result.complementarySources=directory+'fuentes-complementarias.json'
writeFileSync(directory+'secundaria-inventario-maestro.json',JSON.stringify(result,null,2)+'\n')
const lines=['# Inventario maestro de secundaria','',`Fuente: MINERD 2023, SHA-256 ${hash}.`, '', 'Se distinguen 72 ámbitos por grado (54 comunes y 18 optativos académicos). Los otros 17 scopes de la extracción son encabezados sin grado; no son asignaturas pendientes. La presencia común se cotejó en las tablas PDF48–49 y el límite de las modalidades en PDF55. Las tablas de asignación optativa PDF427,461,490,498 se leyeron visualmente completas y confirman los 18 ámbitos de 4.º–6.º. Esto no acredita implementación ni lectura completa de sus mallas; los nombres iguales en salidas distintas mantienen ámbitos separados.','', '| Asignatura | Grado | Carácter / salida | PDF | Estado |','|---|---:|---|---|---|',...result.scopes.map(s=>`| ${s.subject} | ${s.grade} | ${s.exit??'Común'} | ${s.pdfPages.join(', ')} | ${s.status} |`),'','No se promete cobertura universal: las áreas implementadas conservan los límites y muestras de sus informes. Las fuentes oficiales complementarias de Técnico-Profesional y Artes se localizaron y constan en fuentes-complementarias.json; su revisión y cobertura siguen pendientes. No se duplican como optativas las áreas comunes.','']
writeFileSync(directory+'secundaria-inventario-maestro.md',lines.join('\n')+'\nLas18 mallas optativas académicas se leyeron visualmente completas; páginas, conteos y huellas constan en [optativas-fuentes-revisadas.json](optativas-fuentes-revisadas.json). La lectura de fuente se registra separadamente de la implementación y la verificación de instrumentos de cada ámbito.\n')
console.log(JSON.stringify({sourceHashVerified:true,...result.counts,scopesWritten:result.scopes.length}))
