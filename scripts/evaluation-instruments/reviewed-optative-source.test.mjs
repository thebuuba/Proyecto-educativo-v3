import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {test} from 'node:test'
import {readFileSync} from 'node:fs'
const script='scripts/evaluation-instruments/reviewed-common-source.mjs',matrix='docs/curriculum/cobertura-secundaria/optative-hlm-len-4-matriz.json'

test('Matemática Financiera MT4 conserva98registros,51anclas,21indicadores y12exclusiones',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-mt-4-matriz.json',run=spawnSync(process.execPath,[script,'OPT-MT-4','4',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr)
 const manifest=JSON.parse(run.stdout),m=JSON.parse(readFileSync(path,'utf8'))
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_MT_4_V1')
 assert.equal(manifest.elements,98);assert.equal(manifest.excludedFromAssessment,12)
 assert.deepEqual(manifest.metadata.optativeExitNames,['Matemática y Tecnología'])
 assert.equal(m.contents.length,51);assert.equal(m.criticalIndicators.length,21)
 assert.match(m.criticalIndicators.find(r=>r.literal.includes('balanza general')).literal,/balanza general/)
 const excluded=new Set(m.explicitExclusions.map(r=>r.id)),fixtures=JSON.parse(readFileSync('data/evaluation-instruments/optative-mt-four-contracts.json','utf8'))
 for(const task of fixtures.cases)for(const id of task.sourceRecordIds)assert(!excluded.has(id))
 for(const args of [['OPT-MT-4','5',path,'--optative'],['OPT-MT-5','5',path,'--optative'],['OPT-MT-4','4',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})

test('Ciudadanía y Democracia Participativa HCS sexto conserva97registros,47anclas y21indicadores',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hcs-soc-6-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HCS-SOC-6','6',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.elements,97);assert.equal(manifest.excludedFromAssessment,15)
 assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HCS_SOC_6_V1');assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Ciencias Sociales'])
 const m=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hcs-soc-six-contracts.json','utf8')),ids=new Set(m.officialRecords.map(r=>r.id)),excluded=new Set(m.explicitExclusions.map(r=>r.id))
 assert.equal(m.contents.length,47);assert.equal(m.criticalIndicators.length,21)
 for(const r of m.criticalIndicators)assert(r.caseIds.length&&r.adaptation)
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 const repeated=JSON.parse(readFileSync(path.replace('-matriz.json','-correspondencias.json'),'utf8')).classification.filter(r=>r.ordinal===37||r.ordinal===60);assert.equal(repeated.length,2);assert.equal(repeated[0].literal.replace(/\s+/g,' '),repeated[1].literal.replace(/\s+/g,' '));assert.notEqual(repeated[0].id,repeated[1].id)
 for(const args of [['OPT-HCS-SOC-6','5',path,'--optative'],['OPT-HCS-SOC-5','5',path,'--optative'],['OPT-HCS-SOC-6','6',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})

test('Geografía humana y demografía HCS quinto conserva136registros,81anclas y21indicadores en su ámbito',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hcs-soc-5-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HCS-SOC-5','5',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.elements,136);assert.equal(manifest.excludedFromAssessment,20)
 assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HCS_SOC_5_V1');assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Ciencias Sociales'])
 const m=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hcs-soc-five-contracts.json','utf8')),ids=new Set(m.officialRecords.map(r=>r.id)),excluded=new Set(m.explicitExclusions.map(r=>r.id))
 assert.equal(m.contents.length,81);assert.equal(m.criticalIndicators.length,21)
 assert.match(m.criticalIndicators.find(r=>r.literal.includes('Interno Neto')).literal,/Producto Interno Neto/)
 for(const r of m.criticalIndicators)assert(r.caseIds.length&&r.adaptation)
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 for(const args of [['OPT-HCS-SOC-5','4',path,'--optative'],['OPT-HCS-SOC-6','6',path,'--optative'],['OPT-HCS-SOC-5','5',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})

test('Filosofía HCS cuarto conserva113registros,59anclas y21indicadores sin aceptar matrices de otros grados',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hcs-soc-4-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HCS-SOC-4','4',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.elements,113);assert.equal(manifest.excludedFromAssessment,19)
 assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HCS_SOC_4_V1');assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Ciencias Sociales'])
 const matrix=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hcs-soc-four-contracts.json','utf8')),ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 assert.equal(matrix.contents.length,59);assert.equal(matrix.criticalIndicators.length,21)
 for(const r of matrix.criticalIndicators){assert(r.caseIds.length&&r.adaptation);assert.equal(matrix.officialRecords.find(e=>e.id===r.id)?.type,'ACHIEVEMENT_INDICATOR')}
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 for(const args of [['OPT-HCS-SOC-4','5',path,'--optative'],['OPT-HCS-SOC-5','5',path,'--optative'],['OPT-HCS-SOC-6','6',path,'--optative'],['OPT-HCS-SOC-4','4',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})
test('Textos científicos y profesionales HCS sexto conserva186registros y40exclusiones sin contaminar otras salidas',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hcs-len-6-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HCS-LEN-6','6',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.elements,186);assert.equal(manifest.excludedFromAssessment,40)
 assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HCS_LEN_6_V1');assert.deepEqual(manifest.metadata.grades,[6]);assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Ciencias Sociales'])
 const matrix=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hcs-len-six-contracts.json','utf8')),ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 assert.equal(matrix.contents.length,111);assert.equal(matrix.officialRecords.filter(r=>r.type==='ACHIEVEMENT_INDICATOR').length,21)
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 for(const args of [['OPT-HCS-LEN-6','5',path,'--optative'],['OPT-HLM-LEN-6','6',path,'--optative'],['OPT-HCS-LEN-6','6',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})
test('Literatura HCS quinto conserva98registros,20exclusiones y43anclas adaptables sin conectar sexto',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hcs-len-5-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HCS-LEN-5','5',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.elements,98);assert.equal(manifest.excludedFromAssessment,20)
 assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HCS_LEN_5_V1');assert.deepEqual(manifest.metadata.grades,[5]);assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Ciencias Sociales'])
 const matrix=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hcs-len-five-contracts.json','utf8')),ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 assert.equal(matrix.contents.length,43);assert.equal(matrix.officialRecords.filter(r=>r.type==='ACHIEVEMENT_INDICATOR').length,21)
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 for(const args of [['OPT-HCS-LEN-5','4',path,'--optative'],['OPT-HCS-LEN-6','6',path,'--optative'],['OPT-HLM-LEN-5','5',path,'--optative'],['OPT-HCS-LEN-5','5',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})
test('Literatura HCS cuarto conserva101registros y19exclusiones en su salida propia',()=>{
 const path='docs/curriculum/cobertura-secundaria/optative-hcs-len-4-matriz.json',run=spawnSync(process.execPath,[script,'OPT-HCS-LEN-4','4',path,'--optative'],{encoding:'utf8'})
 assert.equal(run.status,0,run.stderr);const manifest=JSON.parse(run.stdout)
 assert.equal(manifest.project,'eolgunypmtgrsyrjzcld');assert.equal(manifest.elements,101);assert.equal(manifest.excludedFromAssessment,19)
 assert.equal(manifest.code,'MINERD_SECUNDARIA_2023_OPT_HCS_LEN_4_V1');assert.deepEqual(manifest.metadata.optativeExitNames,['Humanidades y Ciencias Sociales'])
 const matrix=JSON.parse(readFileSync(path,'utf8')),fixture=JSON.parse(readFileSync('data/evaluation-instruments/optative-hcs-len-four-contracts.json','utf8')),ids=new Set(matrix.officialRecords.map(r=>r.id)),excluded=new Set(matrix.explicitExclusions.map(r=>r.id))
 assert.equal(matrix.contents.length,47);assert.equal(matrix.officialRecords.filter(r=>r.type==='ACHIEVEMENT_INDICATOR').length,21)
 for(const task of fixture.cases)for(const id of task.sourceRecordIds){assert(ids.has(id),task.id);assert(!excluded.has(id),task.id)}
 for(const args of [['OPT-HCS-LEN-4','5',path,'--optative'],['OPT-HLM-LEN-4','4',path,'--optative'],['OPT-HCS-LEN-4','4',path]])assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0)
})
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
