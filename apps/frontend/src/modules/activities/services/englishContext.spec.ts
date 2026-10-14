import {it,expect} from 'vitest'
import {editableFallbackRecommendation} from './instrumentPreparation'
import {resolveFirstGradeEnglishTask,firstGradeEnglishCriteria} from '@aula/shared'
import fixtures from '../../../../../../data/evaluation-instruments/english-grade-one-context-contracts.json'
const context={level:'SECONDARY' as const,grade:1,subjectCode:'ING'}
for(const f of fixtures)for(const instrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const title of ['Actividad','Una obra artística'])it(`${f.id} ${instrumentType} ${title}`,()=>{
 const p=editableFallbackRecommendation({activityTitle:title,description:f.description,academicContext:context,instrumentType,maxScore:17.35,participationMode:'INDIVIDUAL'})
 for(const id of f.criteria)expect(p.criteria.some(c=>c.templateId===`ing-1-context-${id}`)).toBe(true)
 expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(1735)
})
for(const description of ['Redactarán una descripción en inglés sobre la salud.','Conversarán en inglés para expresar opiniones. No se evaluará la cortesía.','Escribirán sobre su motivación, ansiedad y personalidad en inglés.','Escribirán en inglés una opinión sobre la escuela. Recursos: guía para cuidar la salud.'])it(`no añade actitudes ausentes: ${description}`,()=>{
 const task=resolveFirstGradeEnglishTask('Actividad',description,context)
 expect(task?firstGradeEnglishCriteria(task).filter(c=>c.templateId.startsWith('ing-1-context-')):[]).toEqual([])
})
it('la equidad respeta únicamente las diferencias solicitadas',()=>{
 const p=editableFallbackRecommendation({activityTitle:'Actividad',description:fixtures[4].description,academicContext:context,instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL'})
 const c=p.criteria.find(c=>c.templateId==='ing-1-context-equitable-message')!
 expect(c.description).toContain('género, discapacidad')
 expect(c.description).not.toContain('posesiones')
})
it('pedir permiso no agrega condiciones ausentes',()=>{
 const p=editableFallbackRecommendation({activityTitle:'Actividad',description:'Conversarán en inglés para pedir permiso para usar pertenencias ajenas.',academicContext:context,instrumentType:'rubrica',maxScore:20,participationMode:'INDIVIDUAL'})
 expect(p.criteria.find(c=>c.templateId==='ing-1-context-property')!.progressionLevels!.join(' ')).not.toContain('condiciones')
})
it('el contexto común de primero no contamina otros grados ni optativas',()=>{
 for(const other of [{...context,grade:2},{...context,subjectCode:'FRA'},{...context,optativeExitName:'Humanidades'}])expect(resolveFirstGradeEnglishTask('Actividad',fixtures[0].description,other)).toBeNull()
})
