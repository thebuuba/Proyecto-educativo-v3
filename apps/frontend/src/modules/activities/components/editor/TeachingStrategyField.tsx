import {useId,useRef,useState} from 'react'
import {Button} from '@/components/ui/Button'
import {Input} from '@/components/ui/Input'
import {ChevronDown} from 'lucide-react'
import {teachingStrategies,teachingStrategyAllowed,resolveTeachingStrategy,normalizeTeachingStrategyText,type TeachingStrategyContext} from '@aula/shared'
import type {ActivityDraft} from './editorModel'

/** Searchable pedagogical selector built from the existing form controls. */
export function TeachingStrategyField({draft,context,onChange}:{draft:ActivityDraft;context:TeachingStrategyContext;onChange:(draft:ActivityDraft)=>void}) {
  const id=useId(),field=useRef<HTMLDivElement>(null)
  const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[active,setActive]=useState(-1)
  const entries=teachingStrategies.filter(s=>teachingStrategyAllowed(s.id,context)&&
    normalizeTeachingStrategyText([s.name,...s.aliases].join(' ')).includes(normalizeTeachingStrategyText(query)))
  const options=[...(!query?[{id:'AUTO',name:'Seleccionar automáticamente'}]:[]),...entries]
  function close(){setOpen(false);setQuery('');setActive(-1);field.current?.querySelector<HTMLButtonElement>('[role="combobox"]')?.focus()}
  function choose(value:string){onChange({...draft,teachingStrategyId:value==='AUTO'?draft.teachingStrategyId:value,teachingStrategyOrigin:value==='AUTO'?'AUTO':'MANUAL'});close()}
  return <div ref={field} className="relative space-y-1.5 text-sm font-bold" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node)){setOpen(false);setQuery('');setActive(-1)}}}>
    <label id={`${id}-label`}>Estrategia de enseñanza y aprendizaje</label>
    <Button type="button" variant="outline" role="combobox" aria-labelledby={`${id}-label`} aria-controls={`${id}-options`} aria-expanded={open} aria-haspopup="listbox"
      className="min-h-11 h-auto w-full justify-between gap-2 text-left font-medium" onClick={()=>{setOpen(!open);setQuery('');setActive(-1)}}
      onKeyDown={e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();setOpen(true);setActive(-1)}}}>
      <span className="min-w-0 flex-1 whitespace-normal text-left">{resolveTeachingStrategy(draft.teachingStrategyId??'')?.name??'Sin estrategia'}</span><ChevronDown className="size-4 shrink-0" aria-hidden="true"/>
    </Button>
    {open?<div className="absolute z-40 mt-1 w-full rounded-xl border border-border bg-card p-2 shadow-lg">
      <Input autoFocus type="search" role="searchbox" aria-label="Buscar estrategia" value={query} aria-controls={`${id}-options`} aria-activedescendant={active>=0?`${id}-option-${active}`:undefined}
        placeholder="Buscar estrategia" onChange={e=>{setQuery(e.target.value);setActive(-1)}}
        onKeyDown={e=>{
          if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}
          if(e.key==='Tab'){setOpen(false);setQuery('');setActive(-1)}
          if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){
            e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?options.length-1:e.key==='ArrowDown'?Math.min(active+1,options.length-1):Math.max(active-1,0)
            setActive(next);document.getElementById(`${id}-option-${next}`)?.scrollIntoView?.({block:'nearest'})
          }
          if(e.key==='Enter'){e.preventDefault();if(active>=0&&options[active])choose(options[active].id)}
        }}/>
      <div id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`} className="mt-1 max-h-64 overflow-y-auto">
        {options.map((option,index)=><button key={option.id} id={`${id}-option-${index}`} type="button" role="option" tabIndex={-1}
          aria-selected={option.id==='AUTO'?draft.teachingStrategyOrigin==='AUTO':draft.teachingStrategyOrigin!=='AUTO'&&draft.teachingStrategyId===option.id}
          className={`min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-ring ${active===index?'bg-muted':''}`}
          onMouseDown={e=>e.preventDefault()} onClick={()=>choose(option.id)}>{option.name}</button>)}
        {!options.length?<p className="px-3 py-2 text-sm font-normal text-muted-foreground">Sin resultados</p>:null}
      </div>
    </div>:null}
  </div>
}
