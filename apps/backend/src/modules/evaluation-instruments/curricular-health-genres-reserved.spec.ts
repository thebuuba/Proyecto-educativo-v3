import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {resolveFirstGradeHealthGenre} from '@aula/shared'
import {recommend} from './recommendation-engine'
const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-salud-reservado-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
describe('Géneros de salud1: reserva sintética no ciega, expectativas previas',()=>{
 for(const f of formats)for(const c of bank.cases)it(`${c.id}/${f}: límites, objeto y medio`,()=>{
  const p=recommend({activityTitle:c.title,description:c.description,maxScore:20,participationMode:'INDIVIDUAL',preferredInstrumentType:f},bank.context,null,[],'UNMAPPED',null),t=JSON.stringify(p.criteria)
  switch(c.id){
   case'LEN1-SAL-R01':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/Corrige (?:solo )?el hábitat/);expect(t).toMatch(/conserva.*nombre.*rasgos.*fuente/i);expect(t).not.toMatch(/Los tres datos|Corrige el nombre|otro que no|ilustraciones/);break
   case'LEN1-SAL-R02':expect(t).toMatch(/índice/);expect(t).toMatch(/manuscrit|cuaderno/);expect(t).not.toMatch(/digital|Internet/);break
   case'LEN1-SAL-R03':expect(p.activityType).toBe('COMPARISON');expect(t).toMatch(/cantidades/);expect(t).not.toMatch(/acciones|procedimiento|imperativo|verbos/);break
   case'LEN1-SAL-R04':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/pasos|procedimiento/);expect(t).toMatch(/orden/);expect(t).not.toMatch(/Presenta los ingredientes|ingredientes con las cantidades|título|higiene/);break
   case'LEN1-SAL-R05':expect(p.activityType).toBe('ANALYSIS');expect(p.criteria).toHaveLength(1);expect(t).toMatch(/analogía.*semejanza/);expect(t).toMatch(/expresión|fragmento/);expect(t).not.toMatch(/hecho|ejemplo|contraargumento|conclusión/);break
   case'LEN1-SAL-R06':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/conclusión/);expect(t).toMatch(/conserva.*postura.*datos.*desarrollo/i);expect(t).not.toMatch(/recomendación|contraargumento/);break
   case'LEN1-SAL-R07':expect(t).toMatch(/índice/);expect(t).toMatch(/localiz|buscar/);expect(t).toMatch(/acciones|pasos/);expect(t).not.toMatch(/Organiza las entradas|separar los materiales|materiales del aula|versión digital/);break
   case'LEN1-SAL-R08':expect(p.activityType).toBe('POSTER_ANALYSIS');expect(t).toMatch(/persuas|convenc/);expect(t).toMatch(/imagen|visual/);expect(t).not.toMatch(/receta|ingredientes|cantidades/);break
  }
 })
 for(const context of [{...bank.context,grade:2},{...bank.context,subjectCode:'FRA'},{...bank.context,level:'PRIMARY'},{...bank.context,optativeExitName:'Humanidades'}])it(`no traslada géneros a ${JSON.stringify(context)}`,()=>{
  expect(resolveFirstGradeHealthGenre(bank.cases[0].title,bank.cases[0].description,context)).toBeNull()
 })
})
