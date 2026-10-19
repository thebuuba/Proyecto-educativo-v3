import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {test} from 'node:test'
import {readFileSync} from 'node:fs'
const script='scripts/evaluation-instruments/reviewed-common-source.mjs',matrix='docs/curriculum/cobertura-secundaria/optative-hlm-len-4-matriz.json'
test('Inglés HLM sexto conserva193registros,46exclusiones e indicadores críticos explícitos',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hlm-ing-6-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HLM-ING-6','6',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HLM_ING_6_V1');assert.equal(manifest.elements,193);assert.equal(manifest.excludedFromAssessment,46)
 assert.deepEqual(manifest.metadata.grades,[6]);assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Lenguas Modernas'])
 const matrix=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hlm-ing-six-contracts.json','utf8')),ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 assert.equal(matrix.criticalIndicators.length,21)
 for(const r of matrix.criticalIndicators){assert(r.caseIds.length&&r.adaptation);assert.equal(matrix.officialRecords.find(e=>e.id===r.id)?.type,'ACHIEVEMENT_INDICATOR')}
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 for(const args of [['OPT-HLM-ING-6','5',path,'--optative'],['OPT-HLM-ING-5','5',path,'--optative'],['OPT-HLM-ING-6','6',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})
test('Inglés HLM quinto conserva205registros,56exclusiones y sus indicadores literarios explícitos',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hlm-ing-5-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HLM-ING-5','5',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HLM_ING_5_V1');assert.equal(manifest.elements,205);assert.equal(manifest.excludedFromAssessment,56)
 assert.deepEqual(manifest.metadata.grades,[5]);assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Lenguas Modernas'])
 const matrix=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hlm-ing-five-contracts.json','utf8')),ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 assert.equal(matrix.literaryIndicators.length,21)
 for(const r of matrix.literaryIndicators){assert(r.caseIds.length&&r.adaptation);assert.equal(matrix.officialRecords.find(e=>e.id===r.id)?.type,'ACHIEVEMENT_INDICATOR')}
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 for(const args of [['OPT-HLM-ING-5','4',path,'--optative'],['OPT-HLM-ING-6','6',path,'--optative'],['OPT-HLM-ING-5','5',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})

test('Inglés HLM cuarto conserva188 registros y46 exclusiones en su ámbito propio',()=>{
 const matrix='docs/curriculum/cobertura-secundaria/optative-hlm-ing-4-matriz.json'
 const run=spawnSync(process.execPath,[script,'OPT-HLM-ING-4','4',matrix,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr)
 const m=JSON.parse(run.stdout)
 assert.equal(m.project,'eolgunypmtgrsyrjzcld')
 assert.equal(m.code,'MINERD_SECUNDARIA_2023_OPT_HLM_ING_4_V1')
 assert.equal(m.elements,188);assert.equal(m.excludedFromAssessment,46)
 assert.equal(m.metadata.commonOnly,false)
 assert.deepEqual(m.metadata.grades,[4])
 assert.deepEqual(m.metadata.optativeExitNames,['Humanidades y Lenguas Modernas'])
 for(const args of [['OPT-HLM-ING-4','5',matrix,'--optative'],['OPT-HLM-ING-5','5',matrix,'--optative'],['OPT-HLM-ING-4','4',matrix]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})

test('todas las consignas inglesas seleccionan únicamente anclas adaptables de su fuente',()=>{
 const fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hlm-ing-four-contracts.json','utf8'))
 const matrix=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/optative-hlm-ing-4-matriz.json','utf8'))
 const ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
})
test('las consignas de sexto seleccionan contenidos evaluables y no encabezados excluidos',()=>{
 const fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hlm-len-six-contracts.json','utf8'))
 const matrix=JSON.parse(readFileSync('docs/curriculum/cobertura-secundaria/optative-hlm-len-6-matriz.json','utf8'))
 const ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id+' selecciona un encabezado o disposición excluidos')}
})
test('el manifiesto optativo conserva salida y modalidad, sin conectar la base',()=>{
 const run=spawnSync(process.execPath,[script,'OPT-HLM-LEN-4','4',matrix,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr)
 const m=JSON.parse(run.stdout)
 assert.equal(m.project,'eolgunypmtgrsyrjzcld')
 assert.equal(m.code,'MINERD_SECUNDARIA_2023_OPT_HLM_LEN_4_V1')
 assert.equal(m.metadata.commonOnly,false)
 assert.deepEqual(m.metadata.optativeExitNames,['Humanidades y Lenguas Modernas'])
 assert.deepEqual(m.metadata.modalityCodes,['academic','general'])
 assert.equal(m.elements,115)
 assert.equal(m.excludedFromAssessment,40)
})
test('un código optativo requiere selección explícita; no se publica como fuente común',()=>{
 const run=spawnSync(process.execPath,[script,'OPT-HLM-LEN-4','4',matrix],{encoding:'utf8'})
 assert.notEqual(run.status,0)
})
test('quinto HLM conserva su ámbito independiente de102registros y23exclusiones',()=>{
 const run=spawnSync(process.execPath,[script,'OPT-HLM-LEN-5','5','docs/curriculum/cobertura-secundaria/optative-hlm-len-5-matriz.json','--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr)
 const m=JSON.parse(run.stdout)
 assert.equal(m.project,'eolgunypmtgrsyrjzcld')
 assert.equal(m.code,'MINERD_SECUNDARIA_2023_OPT_HLM_LEN_5_V1')
 assert.equal(m.metadata.commonOnly,false)
 assert.deepEqual(m.metadata.optativeExitNames,['Humanidades y Lenguas Modernas'])
 assert.deepEqual(m.metadata.grades,[5])
 assert.equal(m.elements,102)
 assert.equal(m.excludedFromAssessment,23)
})
test('sexto HLM conserva los cuatro géneros de162registros y34exclusiones',()=>{
 const run=spawnSync(process.execPath,[script,'OPT-HLM-LEN-6','6','docs/curriculum/cobertura-secundaria/optative-hlm-len-6-matriz.json','--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr)
 const m=JSON.parse(run.stdout)
 assert.equal(m.project,'eolgunypmtgrsyrjzcld')
 assert.equal(m.code,'MINERD_SECUNDARIA_2023_OPT_HLM_LEN_6_V1')
 assert.equal(m.metadata.commonOnly,false)
 assert.deepEqual(m.metadata.optativeExitNames,['Humanidades y Lenguas Modernas'])
 assert.deepEqual(m.metadata.grades,[6])
 assert.equal(m.elements,162);assert.equal(m.excludedFromAssessment,34)
})
