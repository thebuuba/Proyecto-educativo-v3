import {it,expect} from 'vitest'
import {recommend} from './recommendation-engine'
import fixtures from '../../../../../data/evaluation-instruments/english-grade-one-context-contracts.json'
it('pedir permiso no añade condiciones de uso que no se proporcionaron',()=>{
 const p=recommend({activityTitle:'Actividad',description:'Conversarán en inglés para pedir permiso para usar pertenencias ajenas.',maxScore:20,participationMode:'INDIVIDUAL'},{level:'SECONDARY',grade:1,subjectCode:'ING'},null,[],'UNMAPPED',null)
 const row=p.criteria.find(c=>c.templateId==='ing-1-context-property')!
 expect(row.progressionLevels!.join(' ')).not.toContain('condiciones')
 expect(row.description).not.toContain('acordado')
})
it('la interacción escrita conserva el mensaje y la respuesta al interlocutor',()=>{
 const p=recommend({activityTitle:'Actividad',description:'Intercambiarán mensajes escritos en inglés expresando opiniones y respondiendo al interlocutor.',maxScore:20,participationMode:'INDIVIDUAL'},{level:'SECONDARY',grade:1,subjectCode:'ING'},null,[],'UNMAPPED',null)
 expect(p.activityType).toBe('WRITTEN_PRODUCTION')
 expect(p.criteria.some(c=>c.templateId==='ing-1-interaction'&&c.description.includes('escrito'))).toBe(true)
 expect(p.criteria.some(c=>c.templateId==='ing-1-written')).toBe(true)
})
for(const fixture of fixtures)for(const preferredInstrumentType of ['rubrica','lista-cotejo','escala','lista-ponderada'] as const)for(const maxScore of [20,17.35])it(`${fixture.id} ${preferredInstrumentType} ${maxScore}`,()=>{
 const p=recommend({activityTitle:'Actividad',description:fixture.description,maxScore,participationMode:'INDIVIDUAL',preferredInstrumentType},{level:'SECONDARY',grade:1,subjectCode:'ING'},null,[],'UNMAPPED',null)
 for(const id of fixture.criteria)expect(p.criteria.some(c=>c.templateId===`ing-1-context-${id}`)).toBe(true)
 expect(p.criteria.reduce((n,c)=>n+c.maxScoreUnits,0)).toBe(Math.round(maxScore*100))
 expect(p.criteria.every(c=>c.progressionLevels?.length===5)).toBe(true)
})
