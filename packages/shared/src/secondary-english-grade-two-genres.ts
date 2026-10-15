import {englishGradeOneGenres,requestedEnglishGenres,englishGenreCriteria,type Genre} from './secondary-english-grade-one-genres'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
type ScopedGenre=Genre&{modes:string[];source:'CURRICULUM'|'EXPLICIT_TASK'}
const oral=new Set(['conversation','song','recipe','message','news','description','narrative','monologue'])
const written=new Set(['message','email','letter','cv','notice','poster','sign','form','questionnaire','narrative','description'])
/** PDF140: reception28, oral8, written11. AV comes from an explicit requested
 * product, not an invented curricular genre. Memes from first grade are excluded.
 */
export const englishGradeTwoGenres:ScopedGenre[]=[
 ...englishGradeOneGenres.filter(g=>!['meme','audiovisual'].includes(g.id)).map(g=>({...g,modes:['reading','listening',...(oral.has(g.id)?['oral','interaction']:[]),...(written.has(g.id)?['writing']:[])],source:'CURRICULUM' as const})),
 {id:'menu',match:'menus?|menus en ingles',title:'Información consultada del menú',data:'los productos y la información solicitada del menú',production:'',error:'atribuye a un producto información de otro elemento del menú',modes:['reading','listening'],source:'CURRICULUM'},
 {id:'monologue',match:'monologos?|monologues?',title:'Ideas del monólogo',data:'las ideas relacionadas con el asunto del monólogo',production:'Comunica en inglés las ideas del monólogo solicitado mediante oraciones básicas enlazadas que permiten seguir el asunto.',error:'las relaciones entre las ideas cambian el sentido del asunto comunicado',modes:['oral'],source:'CURRICULUM'},
 {...englishGradeOneGenres.find(g=>g.id==='audiovisual')!,modes:['audiovisual'],source:'EXPLICIT_TASK'},
]
export const requestedGradeTwoGenres=(text:string,mode?:string)=>requestedEnglishGenres(text,englishGradeTwoGenres.filter(g=>!mode||g.modes.includes(['analysis','comparison'].includes(mode)?'reading':mode)))
export function gradeTwoGenreCriteria(text:string,mode:string,existing:ContextualTopicCriterion[],scope='ing-2',genres=englishGradeTwoGenres){
 const selected=requestedEnglishGenres(text,genres.filter(g=>g.modes.includes(['analysis','comparison'].includes(mode)?'reading':mode))).map(g=>g.id==='menu'&&/\b(?:precios?|prices?)\b/.test(text)?{...g,data:/\bproductos?\b/.test(text)?'los productos y sus precios solicitados del menú':'los precios solicitados del menú',error:'atribuye a un producto el precio de otro elemento del menú'}:g)
 // Requested communicative content already carries the purpose of a message;
 // source documents do not become additional delivered products.
 const covered=selected.filter(g=>!(g.id==='email'&&existing.some(c=>/^ing-2-(?:plans|daily|wishes|advice|experience)$/.test(c.templateId))&&!/destinatario|estructura del correo/.test(text))
  &&!(g.id==='narrative'&&existing.some(c=>c.templateId==='ing-2-experience')&&!/personajes|narrador|estructura (?:de la )?narracion/.test(text)))
 const combined:Genre[]=[],consumed=new Set<string>()
 for(const g of covered){
  if(consumed.has(g.id))continue
  const match=text.match(new RegExp(`\\b(?:${g.match})\\b`))
  const start=(match?.index??-1)+(match?.[0].length??0)
  const next=covered.find(other=>other.id!==g.id&&!consumed.has(other.id)&&new RegExp(`^\\s+o\\s+(?:(?:un|una|el|la)\\s+)?(?:${other.match})\\b`).test(text.slice(start)))
  if(next){
   consumed.add(next.id)
   combined.push({...g,id:`${g.id}-or-${next.id}`,title:`${g.title} o ${next.title.toLowerCase()}`,data:'la información solicitada en el producto elegido',production:'Comunica en inglés la información solicitada en el producto elegido entre las alternativas indicadas, con un mensaje comprensible relacionado con el propósito de la tarea.',error:'la información cambia el propósito del producto elegido'})
  }else combined.push(g)
 }
 return englishGenreCriteria(text,['analysis','comparison'].includes(mode)?'reading':mode,existing,scope,combined,true)
}
