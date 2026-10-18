import {englishGradeTwoGenres,gradeTwoGenreCriteria} from './secondary-english-grade-two-genres'
import type {Genre} from './secondary-english-grade-one-genres'
import type {ContextualTopicCriterion} from './secondary-topic-criteria'
const listen=new Set(['conversation','advertisement','notice','message','instructions','forecast','news','song','poem','description','biography','narrative'])
const read=new Set(['business-card','list','catalog','dictionary','invoice','advertisement','recipe','sign','notice','poster','message','email','instructions','cv','letter','form','news','schedule','agenda','menu','map','questionnaire','brochure','song','poem','comic','tourist-guide','description','biography','narrative'])
const oral=new Set(['conversation','monologue','song','recipe','message','news','presentation','argumentation','description','narrative'])
const write=new Set(['message','email','letter','cv','notice','poster','sign','form','recipe','instructions','questionnaire','biography','narrative','description'])
const added:Genre[]=[
 {id:'catalog',match:'catalogos?|catalogues?|catalogs?',title:'Información consultada del catálogo',data:'los elementos y la información solicitada del catálogo',production:'',error:'atribuye a un elemento información de otro del catálogo'},
 {id:'dictionary',match:'diccionarios?|dictionaries',title:'Entrada y significado del diccionario',data:'la entrada y el significado solicitados del diccionario',production:'',error:'atribuye a la palabra una acepción diferente de la consultada'},
 {id:'invoice',match:'facturas?|invoices?',title:'Datos consultados de la factura',data:'los datos solicitados de la factura y sus referentes',production:'',error:'atribuye los datos de la factura a otro producto o referente'},
 {id:'instructions',match:'textos? de instrucciones|instrucciones|instructions',title:'Pasos del texto de instrucciones',data:'las acciones de las instrucciones y su orden',production:'Comunica en inglés los pasos de las instrucciones en un orden que permite seguir la tarea indicada.',error:'cambia las acciones o su orden y altera las instrucciones',existingFunction:'instructions'},
 {id:'presentation',match:'presentacion(?:es)?|presentations?',title:'Ideas relacionadas en la presentación',data:'las ideas e información solicitadas en la presentación',production:'Relaciona en inglés las ideas e información de la presentación con un orden que permite seguir el asunto y su propósito.',error:'cambia el asunto o las relaciones entre las ideas de la presentación'},
 {id:'argumentation',match:'argumentacion(?:es)?|argumentations?',title:'Punto de vista y razones de la argumentación',data:'el punto de vista y las razones solicitadas de la argumentación',production:'Relaciona en inglés el punto de vista de la argumentación con las razones solicitadas para sustentarlo ante el interlocutor.',error:'las razones contradicen el punto de vista o no se relacionan con él'},
]
/** Lists independently checked in PDF158–159: oral reception12/written30,
 * oral production10/written14. AV remains an explicit requested product. */
export const englishGradeFourGenres=[...englishGradeTwoGenres,...added].map(g=>({...g,...(g.id==='email'?{match:'correos?(?: electronicos?)?|e mails?|emails?'}:{}),modes:[...(read.has(g.id)?['reading']:[]),...(listen.has(g.id)?['listening']:[]),...(oral.has(g.id)?['oral']:[]),...(write.has(g.id)?['writing']:[]),...(g.id==='conversation'?['interaction']:[]),...(g.id==='audiovisual'?['audiovisual']:[])],source:g.id==='audiovisual'?'EXPLICIT_TASK' as const:'CURRICULUM' as const}))
export function gradeFourGenreCriteria(text:string,mode:string,existing:ContextualTopicCriterion[]){
 const genres=englishGradeFourGenres.filter(g=>{
  if(g.id==='news'&&existing.some(c=>c.templateId==='ing-4-news'))return false
  if(['notice','advertisement'].includes(g.id)&&existing.some(c=>c.templateId==='ing-4-announcement'))return false
  if(g.id==='narrative'&&existing.some(c=>c.templateId==='ing-4-experience')&&!/personajes|narrador|estructura (?:de la )?narracion/.test(text))return false
  return true
 })
 const fields=[/\bemisor\b/.test(text)?'el emisor':'',/\bfecha\b/.test(text)?'la fecha':'',/\btotal\b/.test(text)?'el total':''].filter(Boolean).join(', ')
 return gradeTwoGenreCriteria(text,['analysis','comparison','research'].includes(mode)?'reading':mode,existing,'ing-4',genres.map(g=>g.id==='invoice'&&fields?{...g,data:fields+' de la factura y sus referentes'}:g))
}
