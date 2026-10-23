import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {describe,it,expect} from 'vitest'
import {recommend} from './recommendation-engine'

const bank=JSON.parse(readFileSync(resolve(process.cwd(),'../../data/evaluation-instruments/curricular-audit/len1-salud-generos-v1.json'),'utf8'))
const formats=['rubrica','lista-cotejo','escala','lista-ponderada'] as const
describe('Lengua1: géneros del indicador de salud75; expectativas anteriores a ejecución',()=>{
 for(const f of formats)for(const c of bank.cases)it(`${c.id}/${f}: respeta el producto y su alcance específico`,()=>{
  const input={activityTitle:c.title,description:c.description,maxScore:17.35,participationMode:'INDIVIDUAL' as const,preferredInstrumentType:f}
  const p=recommend(input,bank.context,null,[],'UNMAPPED',null),t=JSON.stringify(p.criteria)
  switch(c.id.replace('LEN1-SAL-','')){
   case'CAT01':expect(p.activityType).toBe('WRITTEN_PRODUCTION');expect(t).toMatch(/flora.*fauna/i);expect(t).toMatch(/entradas|fichas/);expect(t).toMatch(/clasific|organiz/);expect(t).not.toMatch(/nombre científico|publicación|ilustraciones/);break
   case'CAT02':for(const word of ['nombre','rasgos','hábitat','fuente','conservación','índice'])expect(t).toContain(word);expect(t).not.toMatch(/subir|Internet|nombre científico|dibuja/);break
   case'CAT03':expect(p.activityType).toBe('COMPARISON');expect(t).toMatch(/clasific/);expect(t).toMatch(/nombres.*hábitats|hábitats.*nombres/);expect(t).toMatch(/localiz|consult/);expect(t).not.toMatch(/más bonito|crea otro/);break
   case'CAT04':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/nombre.*hábitat.*fuente/);expect(t).toMatch(/conserva.*entradas.*orden.*ilustraciones/i);break
   case'REC01':expect(t).toMatch(/ingredientes/);expect(t).toMatch(/procedimiento|pasos/);expect(t).toMatch(/ficha/);expect(t).not.toMatch(/calorías|nutrientes|fotograf|degust/);break
   case'REC02':expect(t).toMatch(/ingredientes.*cantidades/);expect(t).toMatch(/pasos.*orden|orden.*pasos/);expect(t).toMatch(/ingrediente.*paso/);expect(t).toMatch(/higiene.*ficha/);expect(t).not.toMatch(/calorías|nutrientes|sabor|promete/);break
   case'REC03':expect(p.activityType).toBe('COMPARISON');expect(t).toMatch(/cantidades/);expect(t).toMatch(/orden.*acciones|acciones.*orden/);expect(t).toMatch(/seguir.*receta|procedimiento original/);expect(t).not.toMatch(/sabor|prepara alimentos/);break
   case'REC04':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/imperativo/);expect(t).toMatch(/conserva.*ingredientes.*cantidades.*orden/i);expect(t).not.toMatch(/publicación|nutrientes/);break
   case'OPI01':expect(t).toMatch(/postura/);expect(t).toMatch(/razones/);expect(t).not.toMatch(/contraargumento|analogía|encuesta|publicación/);break
   case'OPI02':for(const word of ['postura','hecho','ejemplo','analogía','contraargumento','respuesta','conclusión','recomendación','fuente'])expect(t).toContain(word);expect(t).toMatch(/sin.*descalific|sin.*insult|respetuos/);expect(p.criteria.some(r=>r.templateId.startsWith('delivery-format'))).toBe(false);break
   case'OPI03':expect(p.activityType).toBe('ANALYSIS');for(const word of ['postura','hecho','ejemplo','analogía','contraargumento','conclusión'])expect(t).toContain(word);expect(t).toMatch(/presentes|fragmentos/);expect(t).not.toMatch(/Escribe un artículo|Redacta un artículo/);break
   case'OPI04':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/contraargumento.*respuesta/);expect(t).toMatch(/conserva.*postura.*datos.*conclusión/i);expect(t).toMatch(/sin.*insult|sin.*burl|sin.*descalific/);break
   case'INS01':expect(t).toMatch(/acciones/);expect(t).toMatch(/orden/);expect(t).toMatch(/ficha/);expect(t).not.toMatch(/fotograf|investig|tiempo fijo|destreza/);break
   case'INS02':expect(t).toMatch(/propósito/);expect(t).toMatch(/materiales.*ficha|ficha.*materiales/);expect(t).toMatch(/orden/);expect(t).toMatch(/ambigüedad/);expect(t).not.toMatch(/Ejecuta la|Limpia|destreza física/);break
   case'INS03':expect(p.activityType).toBe('ANALYSIS');expect(t).toMatch(/ambigüedad/);expect(t).toMatch(/orden/);expect(t).toMatch(/conserva.*acciones.*condiciones/i);expect(t).not.toMatch(/Ejecuta|publicación/);break
   case'INS04':expect(p.criteria).toHaveLength(1);expect(t).toMatch(/puntuación.*numeración|numeración.*puntuación/);expect(t).toMatch(/conserva.*acciones.*condiciones.*materiales.*orden/i);expect(t).not.toMatch(/investigación|publicación/);break
  }
  if(c.id==='LEN1-SAL-REC02'){
   expect(t).toMatch(/título/)
   expect(p.criteria.find(r=>/Ingredientes/.test(r.title)||r.templateId==='len1-health-recipe-ingredients')?.progressionLevels?.[2]).toMatch(/título/)
  }
  if(c.id==='LEN1-SAL-OPI02'||c.id==='LEN1-SAL-OPI03'){
   expect(t).toMatch(/ejemplo.*concret/);expect(t).toMatch(/analogía.*semejanza/)
  }
  expect(p.totalScoreUnits).toBe(1735);expect(p.criteria.length).toBeLessThanOrEqual(20)
 })
})
