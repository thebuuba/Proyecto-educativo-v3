import {useState} from 'react'
import {fireEvent,render,screen} from '@testing-library/react'
import {describe,it,expect} from 'vitest'
import {InstrumentPreview} from './InstrumentPreview'
import {blockAccents} from './editorPresentation'
import {competencyBlocks} from '@/modules/grading/utils/competencyGrades'

const initial={
 'lista-ponderada:meta:criteriaCount':'2','lista-ponderada:meta:scorePending':'false',
 'lista-ponderada:criterion:0':'Transporte','lista-ponderada:criterion:1':'Orientación',
 'lista-ponderada:indicator:0':'Nombra el medio indicado.','lista-ponderada:indicator:1':'Comunica la orientación indicada.',
 'lista-ponderada:points:0':'8.68','lista-ponderada:points:1':'8.67',
 'lista-ponderada:weight:0':'50','lista-ponderada:weight:1':'50',
}
describe('Puntos visibles al editar porcentajes',()=>{
 for(const pending of [false,true])it(`recalcula campos y conserva textos, pendiente=${pending}`,()=>{
  let latest:Record<string,string>={}
  function Form(){
   const [fields,setFields]=useState<Record<string,string>>({...initial,'lista-ponderada:meta:scorePending':String(pending),...(pending?{'lista-ponderada:points:0':'','lista-ponderada:points:1':''}:{})})
   latest=fields
   return <InstrumentPreview accent={blockAccents[0]} activityName="Actividad" block={competencyBlocks[0]} completed={false} fields={fields} instrumentType="lista-ponderada" maxScore={pending?0:17.35} onCompletedChange={()=>{}} onFieldsChange={setFields}/>
  }
  render(<Form/>)
  const weights=screen.getAllByPlaceholderText('0')
  fireEvent.change(weights[0],{target:{value:'60'}})
  fireEvent.change(weights[1],{target:{value:'40'}})
  expect(latest['lista-ponderada:points:0']).toBe(pending?'':'10.41')
  expect(latest['lista-ponderada:points:1']).toBe(pending?'':'6.94')
  expect(latest['lista-ponderada:indicator:0']).toBe(initial['lista-ponderada:indicator:0'])
  expect(latest['lista-ponderada:weight:0']).toBe('60')
  expect(latest['lista-ponderada:weight:1']).toBe('40')
  if(!pending){expect(screen.getByText('10.41 pts')).toBeVisible();expect(screen.getByText('6.94 pts')).toBeVisible()}
 })
})
