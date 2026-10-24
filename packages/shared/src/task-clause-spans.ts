/** Clause boundaries are punctuation, except a point between digits. Commas are never rewritten. */
export function* taskClauseSpans(text:string):Generator<{text:string;start:number}>{
 let start=0
 for(let i=0;i<=text.length;i++){
  const end=i===text.length||/[;\n]/.test(text[i])||(text[i]==='.'&&!(/\d/.test(text[i-1]??'')&&/\d/.test(text[i+1]??'')))
  if(end){if(i>start)yield{text:text.slice(start,i),start};start=i+1}
 }
}

export function* taskClauseMatches(text:string,pattern:RegExp):Generator<RegExpExecArray>{
 for(const clause of taskClauseSpans(text)){
  const regex=new RegExp(pattern.source,pattern.flags.replace('g',''))
  const match=regex.exec(clause.text)
  if(match){match.index+=clause.start;yield match}
 }
}

/** Mapping is needed when a teacher pastes decomposed accents or supplementary characters. */
export function foldedTaskText(original:string){
 let text='',offset=0
 const starts:number[]=[],ends:number[]=[]
 for(const character of original){
  const folded=character.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase()
  if(!folded&&ends.length)ends[ends.length-1]=offset+character.length
  for(let i=0;i<folded.length;i++){starts.push(offset);ends.push(offset+character.length)}
  text+=folded;offset+=character.length
 }
 return{text,span:(start:number,end:number)=>({start:starts[start]??original.length,end:ends[end-1]??original.length})}
}
