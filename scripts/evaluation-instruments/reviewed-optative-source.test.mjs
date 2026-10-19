import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {test} from 'node:test'
const script='scripts/evaluation-instruments/reviewed-common-source.mjs',matrix='docs/curriculum/cobertura-secundaria/optative-hlm-len-4-matriz.json'
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
