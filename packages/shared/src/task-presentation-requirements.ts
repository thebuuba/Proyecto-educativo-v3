import {foldedTaskText,taskClauseSpans} from './task-clause-spans'

export type TaskCondition = {
 id:string;property:string;values:string[];unit?:string;scope:string
 operator:'EXACT'|'MIN'|'MAX'|'RANGE'|'APPROX'
 relation:'REQUIRED'|'ALTERNATIVE'|'CONDITIONAL'|'OPTIONAL'|'NEGATED'
 origin:{start:number;end:number;text:string};exclusion?:string;condition?:string
}
export type TaskRequirementReport = {
 conditions:TaskCondition[]
 issues:{kind:'CONFLICT'|'AMBIGUOUS';conditionIds:string[];text:string}[]
}
const numeral='(?:\\d+(?:[.,]\\d+)?|un[oa]?|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciseis|diecisiete|dieciocho|diecinueve|veinte)'
const scopePattern=/\b(portada|titular(?:es)?|titulos?|subtitulos?|cuerpo|introduccion|desarrollo|conclusion|anexos?|imagenes?|tablas?|parrafos?)\b/g
const canonicalScope=(s:string)=>({titulo:'título',titulos:'título',titular:'titular',titulares:'titular',subtitulo:'subtítulo',subtitulos:'subtítulo',introduccion:'introducción',conclusion:'conclusión',imagenes:'imagen',imagen:'imagen',tablas:'tabla',parrafos:'párrafo',parrafo:'párrafo',anexos:'anexos'}[s]??s)
const instruction=/\b(?:cre|entreg|inclu|incorpor|utili|usen?|usar|lleva|debe|redact|escrib|presen|elabor|agreg|anad|colo|citen?|conserv|revis|evit|manten|mantend|manteng|organiza|justifi|seleccion)[a-z]*\b/
const countWords:Record<string,number>={un:1,una:1,uno:1,une:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,trece:13,catorce:14,quince:15,dieciseis:16,diecisiete:17,dieciocho:18,diecinueve:19,veinte:20,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10}
const numericValue=(s:string)=>countWords[s]??Number(s.replace(',','.'))

/** Bounded instruction grammar, not a Word-file validator. All offsets refer to the original description. */
export function extractTaskRequirements(description:string):TaskRequirementReport{
 const folded=foldedTaskText(description)
 let text=folded.text
 // Quotes/examples are input data, except explicitly named font/file values.
 for(const m of text.matchAll(/«[^»]*»|“[^”]*”|"[^"\n]*"/g)){
  if(/(?:fuente|letra|archivo)\s*(?::|llamad[oa])?\s*$/.test(text.slice(Math.max(0,m.index!-35),m.index)))continue
  text=text.slice(0,m.index)+' '.repeat(m[0].length)+text.slice(m.index!+m[0].length)
 }
 const conditions:TaskCondition[]=[],issues:TaskRequirementReport['issues']=[]
 // File extensions contain points that are not sentence boundaries.
 for(const m of text.matchAll(/\bnombre\s+del\s+archivo\s*(?::|sera|es)?\s*["«“]?([^\s"»”;,]+)(?:["»”])?/g)){
  const p=folded.span(m.index!,m.index!+m[0].length),v=folded.span(m.index!+m[0].indexOf(m[1]),m.index!+m[0].indexOf(m[1])+m[1].length)
  conditions.push({id:`task:${conditions.length+1}`,property:'filename',values:[description.slice(v.start,v.end).replace(/\.$/,'')],scope:'archivo',operator:'EXACT',relation:'REQUIRED',origin:{...p,text:description.slice(p.start,p.end)}})
 }
 for(const span of taskClauseSpans(text)){
  const clause=span.text
  if(!clause.trim()||/^\s*(?:como recurso|recursos?\s*:|(?:por )?ejemplo\b)/.test(clause))continue
  if(/\b(?:menciona\w*|dicen?|dijo|expreso|ejemplo de formato)\b/.test(clause)&&!instruction.test(clause.replace(/\b(?:dicen?|dijo|expreso)[\s\S]*/,'')))continue
  if(/\b(?:analic|analiz|le[ae]|compar|contrast|identifi)[a-z]*\b/.test(clause)&&/\b(?:proporcionad|dad)[a-z]*\b/.test(clause)&&!instruction.test(clause))continue
  const scopes=[...clause.matchAll(scopePattern)]
  const scopeAt=(index:number,end:number)=>{
   const following=clause.slice(end).split(',')[0].match(/(?:^\s*|\s+)(?:en|del?|para)\s+(?:el|la|los|las)?\s*(portada|titular|titulo|subtitulos?|cuerpo|introduccion|desarrollo|conclusion|anexos?)\b/)
   if(following)return canonicalScope(following[1])
   const prior=scopes.filter(s=>s.index!<=index).at(-1)
   if(!prior)return 'documento'
   const attachment=clause.slice(prior.index!+prior[0].length,index)
   return !attachment.trim()||/^\s*(?:en\b|de\b|con\b|sin\b|utiliz\w*\b|us[ae]\w*\b|ira\b|sera\b|tendra\w*\b|llevar\w*\b|organizad|justificad|centrad|alinead|tamano\b|color\b|negrita\b|cursiva\b)/.test(attachment)?canonicalScope(prior[1]):'documento'
  }
  const add=(property:string,m:{0:string;index?:number},values:string[],unit?:string,scope?:string,operator:TaskCondition['operator']='EXACT')=>{
   const index=m.index??0,end=index+m[0].length,before=clause.slice(0,index)
   const localBefore=before.split(/[,;]|\by\b(?=\s+(?:no|sin|pueden|podran|si)\b)/).at(-1)??before
   const prefix=clause.slice(0,end)
   const neg=/\b(?:sin(?!\s+contar)|no (?:(?:deben?|se)\s+)?(?:inclu\w*|entreg\w*|us\w*|utili\w*|requiere|llev\w*|exige|pide))\b/.test(localBefore)||/^\s*sin\b/.test(clause)
   const optional=/\b(?:opcional\w*|puedes?|pueden|podran|podras|si lo deseas|si quieren)\b/.test(prefix)||/\bopcional\w*\b/.test(clause.slice(end).split(',')[0])
   const conditional=/^\s*si\b/.test(clause)&&!/^\s*si lo deseas/.test(clause)
   const relation:TaskCondition['relation']=neg?'NEGATED':optional?'OPTIONAL':conditional?'CONDITIONAL':values.length>1&&/\bo\b/.test(m[0])?'ALTERNATIVE':'REQUIRED'
   const original=folded.span(span.start+index,span.start+end)
   const actualScope=scope??scopeAt(index,end)
   // An exact semantic duplicate is not a second scoring condition; keep the first origin.
   if(conditions.some(c=>c.property===property&&c.scope===actualScope&&c.unit===unit&&c.operator===operator&&c.relation===relation&&JSON.stringify(c.values)===JSON.stringify(values)))return
   conditions.push({id:`task:${conditions.length+1}`,property,values,unit,scope:actualScope,operator,relation,
    origin:{...original,text:description.slice(original.start,original.end)},
    ...(conditional||neg?{condition:description.slice(folded.span(span.start,span.start+clause.length).start,folded.span(span.start,span.start+clause.length).end).trim()}:{}),
    ...(property==='extent'&&/^p[aá]ginas?$/.test(unit??'')&&/sin contar\s+la\s+portada/.test(clause)?{exclusion:'sin contar la portada'}:{})})
  }
  const original=(start:number,end:number)=>{const p=folded.span(span.start+start,span.start+end);return description.slice(p.start,p.end)}
  // Formats can be unknown when explicitly introduced with “formato”; known product formats also work after “en”.
  for(const m of clause.matchAll(/\b(?:documento\s+de\s+|en\s+(?:formato\s+)?|formato\s+)(word|docx|pdf|odt|pptx|xlsx|csv|[a-z][a-z0-9+-]{1,10})(?:\s+o\s+(word|docx|pdf|odt|pptx|xlsx|csv|[a-z][a-z0-9+-]{1,10}))?\b/g)){
   if(!instruction.test(clause)&&!/^\s*(?:entrega|archivo|documento)\b/.test(clause))continue
   if(!['word','docx','pdf','odt','pptx','xlsx','csv'].includes(m[1])&&!/formato/.test(m[0]))continue
   add('file-format',m,[m[1],m[2]].filter(Boolean).map(v=>v==='word'?'Word':v.toUpperCase()),undefined,'documento')
   if(/^\s+o\s+(?:(?:un|una)\s+)?(?:presentacion|hoja|video|audio)/.test(clause.slice(m.index!+m[0].length))){
    const c=conditions.at(-1)!
    c.relation='CONDITIONAL';c.condition=original(0,clause.length)
   }
  }
  for(const m of clause.matchAll(/\b(?:entrega(?:ran|ran|r|n)?|entreguen|presentacion)\s+(digital|impresa|impreso)\b/g))add('submission',m,[m[1]],undefined,'documento')
  // Font names are dynamic after an explicit marker, bounded by the next formatting/value clause.
  for(const m of clause.matchAll(/\b(?:fuente|letra)\s+([a-z][a-z0-9 -]*?)(?=\s+(?:tamano|de\s+\d|\d)|[,;:]|$)/g)){
   if(/^(?:de|en|tamano|color)\b/.test(m[1]))continue
   const raw=original(m.index!+m[0].indexOf(m[1]),m.index!+m[0].length).trim()
   if(/\b(?:ni|redact|pertinente|informacion|bibliograf|proporcionad|historica|primaria|secundaria|documental)\w*\b/.test(m[1]))continue
   if(!/^[A-ZÁÉÍÓÚÑ]/.test(raw)&&!/^(?:arial|calibri|times new roman|aptos|garamond)$/.test(m[1])&&!/^\s+(?:de\s+)?\d/.test(clause.slice(m.index!+m[0].length)))continue
   if(/\b(?:consult|cit|seleccion|investig|analiz|examin|busc)[a-z]*\b/.test(clause)&&!/(?:tamano|puntos|interlineado|tipograf)/.test(clause))continue
   add('font',m,raw.split(/\s+o\s+/i))
   const size=clause.slice(m.index!+m[0].length).match(/^\s+(?:de\s+)?(\d+(?:[.,]\d+)?)(?:\s*(puntos?|pt))?\b/)
   if(size)add('font-size',{0:m[0]+size[0],index:m.index},[size[1]],size[2]??'pt')
  }
  for(const m of clause.matchAll(/\b(arial|calibri|times new roman|aptos|garamond)\b(?:\s+o\s+(arial|calibri|times new roman|aptos|garamond))?/g)){
   if(conditions.some(c=>c.property==='font'&&c.origin.start<=folded.span(span.start+m.index!,span.start+m.index!).start&&c.origin.end>=folded.span(span.start+m.index!+m[0].length,span.start+m.index!+m[0].length).end))continue
   add('font',m,original(m.index!,m.index!+m[0].length).split(/\s+o\s+/i))
  }
  for(const m of clause.matchAll(new RegExp(`\\b(?:tamano(?: de (?:letra|fuente))?|letra de)\\s*(?:de\\s*)?(${numeral})(?:\\s*(puntos?|pt))?\\b`,'g')))add('font-size',m,[m[1]],m[2]??'pt')
  for(const m of clause.matchAll(/\b(?:arial|calibri|times new roman|aptos|garamond)\s+(?:de\s+)?(\d+(?:[.,]\d+)?)(?:\s*(puntos?|pt))?\b/g))add('font-size',m,[m[1]],m[2]??'pt')
  for(const m of clause.matchAll(new RegExp(`\\b(titulo|titular|subtitulos?|cuerpo)\\s+(?:en|de(?: tamano)?|tamano)\\s+(${numeral})(?:\\s*(puntos?|pt))?\\b`,'g')))add('font-size',m,[m[2]],m[3]??'pt',canonicalScope(m[1]))
  for(const m of clause.matchAll(/\b(negrita|cursiva|subrayad[oa])\b/g))add('emphasis',m,[m[1]])
  for(const m of clause.matchAll(/\bcolor\s+([a-z]+(?:\s+(?:oscuro|claro))?|#[a-f0-9]{3,8})\b/g))add('color',m,[original(m.index!+m[0].indexOf(m[1]),m.index!+m[0].length)])
  for(const m of clause.matchAll(/\binterlineado\s*(?:de\s*)?(\d+(?:[.,]\d+)?|sencillo|simple|doble|triple)\b/g))add('line-spacing',m,[m[1]])
  for(const m of clause.matchAll(/\b(justificad[oa]|centrad[oa]|alinead[oa]\s+(?:a\s+)?(?:la\s+)?(?:izquierda|derecha))\b/g))add('alignment',m,[m[1]])
  for(const m of clause.matchAll(/\b(sangria|separacion entre parrafos|espaciado entre parrafos)\s*(?:de\s*)?(\d+(?:[.,]\d+)?)?\s*(cm|centimetros?|mm|milimetros?|pt|puntos?)?\b/g))add(m[1]==='sangria'?'indent':'paragraph-spacing',m,[m[2]??(/al comenzar los parrafos/.test(clause.slice(m.index!+m[0].length))?'al comenzar los párrafos':'solicitada')],m[3])
  for(const m of clause.matchAll(/\b(?:margenes?|margen)\s*((?:(?:superior|inferior|izquierdo|derecho)(?:\s+(?:e|y)\s+(?:superior|inferior|izquierdo|derecho))?\s*)?)(?:de\s*)?(\d+(?:[.,]\d+)?)\s*(cm|centimetros?|mm|milimetros?|pulgadas?)\b/g))add('margin',m,[m[2]],m[3],m[1].trim()?`margen ${m[1].trim()}`:'página')
  for(const m of clause.matchAll(/\b(?:papel|tamano de (?:papel|pagina))\s*(?:de\s*)?(a\d|carta|oficio|legal|letter)\b/g))add('paper-size',m,[original(m.index!+m[0].indexOf(m[1]),m.index!+m[0].length)],undefined,'página')
  for(const m of clause.matchAll(/\borientacion\s+(vertical|horizontal)\b/g))add('orientation',m,[m[1]],undefined,'página')
  for(const m of clause.matchAll(/\bnumeracion\b(?:\s+(?:de|las|paginas|en|la|parte|al|abajo|arriba|a|izquierda|derecha|centro|centrada|pie|superior|inferior))*/g))add('page-numbering',m,[m[0].replace(/^numeracion\s*/, '').trim()||'solicitada'],undefined,'página')
  for(const m of clause.matchAll(/\b(?:desde|comenzando (?:en|por)|a partir de)\s+(?:la\s+)?pagina\s+(\d+)\b/g))if(/numeracion/.test(clause))add('page-number-start',m,[m[1]],'página','página')
  const extent=new RegExp(`\\b(?:(entre)\\s+(${numeral})\\s+(?:y|a)\\s+(${numeral})|(minimo|maximo|al menos|como maximo|hasta|aproximadamente|alrededor de)\\s+(${numeral})|(${numeral}))\\s+(paginas?|palabras?|parrafos?|imagenes?|tablas?|graficos?|citas?|ejemplos?|oraciones?|fuentes?|apartados?|fragmentos?)\\b`,'g')
  const unitPattern='(?:paginas?|palabras?|parrafos?|ejemplos?|oraciones?|fuentes?)'
  for(const m of clause.matchAll(new RegExp(`\\b(minimo|maximo)\\s+(${numeral})(?:\\s+(${unitPattern}))?\\s+(?:y|e)\\s+(minimo|maximo)\\s+(${numeral})(?:\\s+(${unitPattern}))?\\b`,'g'))){
   if(Boolean(m[3])===Boolean(m[6]))continue
   const unit=m[3]??m[6],literal=original(m.index!+m[0].lastIndexOf(unit),m.index!+m[0].lastIndexOf(unit)+unit.length)
   const property=/pagina|palabra|parrafo/.test(unit)?'extent':'evidence-count'
   add(property,m,[m[2]],literal,undefined,m[1]==='minimo'?'MIN':'MAX')
   add(property,m,[m[5]],literal,undefined,m[4]==='minimo'?'MIN':'MAX')
  }
  for(const m of clause.matchAll(/\b(au moins|au plus)\s+(\d+|une?|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s+pages?\b/g))add('extent',m,[m[2]],'pages','documento',m[1]==='au moins'?'MIN':'MAX')
  for(const m of clause.matchAll(extent)){
   const bare=new RegExp(`^\\s*${numeral}\\s+(?:paginas?|palabras?|parrafos?|ejemplos?|oraciones?|fuentes?)(?:\\s+y\\s+${numeral}\\s+(?:paginas?|palabras?|parrafos?|ejemplos?|oraciones?|fuentes?))?\\s*$`).test(clause)
   if(!bare&&!instruction.test(clause)&&!/(?:cuerpo|introduccion|desarrollo|conclusion|maximo|minimo|entre)\b/.test(clause))continue
   if(/^\s+(?:proporcionad|dad)[a-z]*\b/.test(clause.slice(m.index!+m[0].length))&&!/inclu|incorpor|agreg/.test(clause.slice(0,m.index)))continue
   if(/\b(?:conserv\w*|manten\w*|manteng\w*)\s+(?:(?:las?|los?|otras?|otros?|mismas?|mismos?)\s+)*$/.test(clause.slice(0,m.index)))continue
   if(/oracion/.test(m[7])&&/\b(?:revis\w*|corrig\w*)\s+(?:(?:las?|los?)\s+)*$/.test(clause.slice(0,m.index)))continue
   if(/^fuente/.test(m[7])&&/^(?:un|una)$/.test(m[6]??'')&&/seleccion/.test(clause.slice(0,m.index))&&!/entreg|inclu|incorpor/.test(clause.slice(0,m.index)))continue
   const unit=m[7],property=/pagina|palabra|parrafo/.test(unit)?'extent':/imagen/.test(unit)?'images':/tabla/.test(unit)?'tables':/grafico/.test(unit)?'charts':/cita/.test(unit)?'citations':'evidence-count'
   const op=m[1]?'RANGE':/minimo|al menos/.test(m[4]??'')?'MIN':/maximo|hasta/.test(m[4]??'')?'MAX':m[4]?'APPROX':'EXACT'
   const literalUnit=original(m.index!+m[0].lastIndexOf(unit),m.index!+m[0].length)
   add(property,m,m[1]?[m[2],m[3]]:[m[5]??m[6]],literalUnit,undefined,op)
   if(['tables','charts','images'].includes(property)&&/\bo\s+(?:elabora|crea|presenta|incluye|entrega)/.test(clause)){
    const c=conditions.at(-1)!
    c.relation='CONDITIONAL';c.condition=original(0,clause.length)
   }
  }
  if(instruction.test(clause)||/\b(?:sin portada|con (?:una )?portada|secciones|apartados)/.test(clause)){
   for(const m of clause.matchAll(/\bdibujos?\b[^,;]*/g)){
    const location=clause.match(/\ben\s+(?:el|la)\s+(desarrollo|cuerpo|introduccion|conclusion|anexos?)\b/)
    add('drawing',m,[original(m.index!,m.index!+m[0].length).trim()],undefined,location?canonicalScope(location[1]):undefined)
   }
   for(const m of clause.matchAll(/\bpara que\s+(?:se\s+)?(?:utili\w*|us\w*|destin\w*)[^;]*/g))add('content-purpose',m,[original(m.index!,m.index!+m[0].length)],undefined,'contenido')
   for(const m of clause.matchAll(/\b(?:conserv\w*\s+(?:los?|las?)\s+(?:datos|cantidades)[^;]*|evit\w*\s+inventar\s+(?:datos|informacion))\b/g))add('fidelity',m,[original(m.index!,m.index!+m[0].length)],undefined,'contenido')
   for(const m of clause.matchAll(/\bincorpor\w*\s+la\s+declaracion\s+de\s+(?:la|el)\s+[^,;]+/g))add('citation',m,[`declaración fiel, entre comillas y atribuida: ${original(m.index!,m.index!+m[0].length)}`],undefined,'contenido')
   const explicitSections=clause.match(/\b(?:apartados|secciones)\s*(?::|de\b)?\s+([^;]+)/)
   if(explicitSections&&/^(?:introduccion|desarrollo|analisis|resultados|discusion|conclusion|anexos|referencias)\b/.test(explicitSections[1])){
    const start=explicitSections.index!+explicitSections[0].indexOf(explicitSections[1])
    const values=original(start,start+explicitSections[1].length).split(/\s*,\s*|\s+(?:y|o)\s+/i)
    add('section',explicitSections,values,undefined,'documento')
   }
   for(const m of clause.matchAll(/\b(portada|titular|titulo|subtitulos?|introduccion|desarrollo|conclusion|anexos|referencias|entrada|cuerpo)\b/g)){
    if(explicitSections&&conditions.some(c=>c.property==='section'&&c.origin.start===folded.span(span.start+explicitSections.index!,span.start+explicitSections.index!).start))continue
    // A scope mention alone ("título en 18") is not a separate structural deliverable.
    const before=clause.slice(0,m.index)
    if(/\b(?:en|del?)\s+(?:(?:el|la|los|las)\s+)?$/.test(before))continue
    if(!/\b(?:inclu\w*|incorpor\w*|con|sin|secciones|apartados|debe llevar)\b/.test(before))continue
    const direct=/\b(?:con|sin|inclu\w*|incorpor\w*)\s+(?:(?:un|una|el|la)\s+)?$/.test(before)
    if(/sin contar\s+(?:la\s+)?$/.test(before)||!direct&&/\b(?:citen?|estilo|formato|negrita|cursiva|interlineado|margen)\b/.test(before))continue
    const tail=clause.slice(m.index!+m[0].length).match(/^\s+que\s+resum[a-z]*\s+[^,;]*?(?=\s+y\s+(?:un|el)\b|$)/)
    add('section',m,[original(m.index!,m.index!+m[0].length+(tail?.[0].length??0))],undefined,'documento')
   }
   for(const m of clause.matchAll(/\b(?:pies? (?:de imagen|de foto)|respectivos pies|su pie)\b/g))add('captions',m,[original(m.index!,m.index!+m[0].length)],undefined,/desarrollo/.test(clause)?'desarrollo':/cuerpo/.test(clause)?'cuerpo':'imagen')
   for(const m of clause.matchAll(/\b(?:declaracion|cita directa|citas directas|citen\w* la informacion proporcionada|entre comillas|atribucion|atribuida|bibliografia|referencias bibliograficas)\b/g)){
    const property=/bibliografia|referencias bibliograficas/.test(m[0])?'bibliography':/atribuc|atribuid/.test(m[0])?'attribution':'citation'
    if(property==='citation'&&conditions.some(c=>c.property==='citation'&&c.origin.start<=span.start+m.index!&&c.origin.end>=span.start+m.index!+m[0].length))continue
    add(property,m,[original(m.index!,m.index!+m[0].length)],undefined,'contenido')
   }
   if(/\b(?:referencias|bibliografia|citas bibliograficas)\b/.test(clause))for(const m of clause.matchAll(/\bestilo\s+([a-z]+(?:\s+\d+(?:[.,]\d+)?)?)/g))add('reference-style',m,[original(m.index!+m[0].indexOf(m[1]),m.index!+m[0].length)],undefined,'referencias')
  }
 }
 for(let i=0;i<conditions.length;i++)for(const other of conditions.slice(i+1)){
  const c=conditions[i]
  if(c.property!==other.property||c.scope!==other.scope||c.unit!==other.unit)continue
  if(['OPTIONAL','CONDITIONAL','ALTERNATIVE'].includes(c.relation)||['OPTIONAL','CONDITIONAL','ALTERNATIVE'].includes(other.relation))continue
  if(c.relation==='NEGATED'&&other.relation==='NEGATED')continue
  const negated=c.relation==='NEGATED'||other.relation==='NEGATED'
  const different=JSON.stringify(c.values)!==JSON.stringify(other.values)
  const numeric=c.values.length===1&&other.values.length===1&&Number.isFinite(numericValue(c.values[0]))&&Number.isFinite(numericValue(other.values[0]))
  const conflict=negated?!different:c.property==='section'?false:
   c.operator==='EXACT'&&other.operator==='EXACT'&&different&& !['emphasis','citation','attribution'].includes(c.property)
   ||numeric&&((c.operator==='MIN'&&other.operator==='MAX'&&numericValue(c.values[0])>numericValue(other.values[0]))||(c.operator==='MAX'&&other.operator==='MIN'&&numericValue(c.values[0])<numericValue(other.values[0])))
  if(conflict)issues.push({kind:'CONFLICT',conditionIds:[c.id,other.id],text:`${c.origin.text} / ${other.origin.text}`})
 }
 for(const c of conditions){
  if(c.property!=='indent'&&c.values.some(v=>/^(?:indicado|solicitado|solicitada)$/.test(v)))issues.push({kind:'AMBIGUOUS',conditionIds:[c.id],text:c.origin.text})
  if(c.operator==='RANGE'&&c.values.length===2&&numericValue(c.values[0])>numericValue(c.values[1]))issues.push({kind:'CONFLICT',conditionIds:[c.id],text:c.origin.text})
 }
 return {conditions,issues}
}

export function taskConditionLabel(c:TaskCondition):string{
 const prefixes:Record<string,string>={'font':'fuente','font-size':'tamaño de letra','emphasis':'énfasis','color':'color','line-spacing':'interlineado','alignment':'alineación','indent':'sangría','paragraph-spacing':'separación entre párrafos','margin':'márgenes','paper-size':'papel','orientation':'orientación','page-numbering':'numeración','page-number-start':'numeración desde la página','file-format':'archivo','filename':'nombre del archivo','submission':'entrega','section':'incluye','images':'imágenes','tables':'tablas','charts':'gráficos','captions':'pies de imagen','citation':'cita','attribution':'atribución','bibliography':'bibliografía','reference-style':'estilo de referencias'}
 const operators={EXACT:'',MIN:'mínimo ',MAX:'máximo ',RANGE:'entre ',APPROX:'aproximadamente '}
 const value=c.operator==='RANGE'?c.values.join(' y '):c.values.join(c.relation==='ALTERNATIVE'?' o ':' y ')
 const property=c.property==='file-format'?'archivo en':c.unit&&['images','tables','charts','citations','evidence-count'].includes(c.property)?'':prefixes[c.property]??''
 const scoped=!['documento','contenido','archivo'].includes(c.scope)&&!(c.property==='extent'&&c.scope==='párrafo')?` en ${c.scope}`:''
 if(c.property==='captions')return `${/respectivos/i.test(value)?'cada imagen con su pie':value}${scoped}`
 const repeated=property&&property.toLowerCase()===value.toLowerCase()
 return `${c.relation==='NEGATED'?'sin obligación de ':''}${property}${property&&!repeated?' ':''}${operators[c.operator]}${repeated?'':value}${c.unit?' '+c.unit:''}${scoped}${c.exclusion?' '+c.exclusion:''}`
}
