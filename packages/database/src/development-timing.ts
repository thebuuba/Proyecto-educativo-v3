import {Pool,Client} from 'pg'

export type DatabaseTiming=(stage:string,start:number,end:number,failed:boolean,rows?:number)=>void

/** Diagnostic wrappers preserve pg's callback/promise overloads; SQL and arguments never leave the driver. */
function observeMethod(target:object,key:'connect'|'query',stage:string,observe:DatabaseTiming){
 const original=Reflect.get(target,key) as (...args:unknown[])=>unknown
 Reflect.set(target,key,function(this:unknown,...args:unknown[]){
  const start=performance.now();let finished=false
  const finish=(failed:boolean)=>{if(!finished){finished=true;observe(stage,start,performance.now(),failed)}}
  const last=args.at(-1)
  if(typeof last==='function')args[args.length-1]=function(this:unknown,error:unknown,...rest:unknown[]){finish(Boolean(error));return Reflect.apply(last,this,[error,...rest])}
  try{
   const result=Reflect.apply(original,this,args)
   if(result&&typeof Reflect.get(Object(result),'then')==='function')return (result as Promise<unknown>).then(value=>{finish(false);return value},error=>{finish(true);throw error})
   return result
  }catch(error){finish(true);throw error}
 })
}

export function timedDevelopmentPool(config:ConstructorParameters<typeof Pool>[0],observe:DatabaseTiming){
 // pg constructs the client with this class; connect includes DNS/TCP/TLS/auth, not server SQL.
 class TimedClient extends Client{
  constructor(...args:ConstructorParameters<typeof Client>){super(...args);observeMethod(this,'connect','db.connect',observe);observeMethod(this,'query','db.sql',observe)}
 }
 const pool=new Pool({...config,Client:TimedClient})
 observeMethod(pool,'connect','db.acquire',observe)
 return pool
}
