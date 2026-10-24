import {AsyncLocalStorage} from 'node:async_hooks'
import {randomUUID} from 'node:crypto'

type Span={stage:string;startMs:number;ms:number;failed:boolean;rows?:number}
type Trace={id:string;route:string;cold:boolean;started:number;spans:Span[]}
const timing=new AsyncLocalStorage<Trace>()

export function recordDevelopmentTiming(stage:string,start:number,end:number,failed=false,rows?:number){
 const trace=timing.getStore()
 if(trace)trace.spans.push({stage,startMs:Math.round((start-trace.started)*100)/100,ms:Math.round((end-start)*100)/100,failed,...rows===undefined?{}:{rows}})
}
export async function timeDevelopmentStage<T>(stage:string,operation:()=>PromiseLike<T>):Promise<T>{
 if(!timing.getStore())return operation()
 const start=performance.now();let failed=false
 try{return await operation()}catch(error){failed=true;throw error}
 finally{recordDevelopmentTiming(stage,start,performance.now(),failed)}
}
export function timeDevelopmentSync<T>(stage:string,operation:()=>T):T{
 const start=performance.now();let failed=false
 try{return operation()}catch(error){failed=true;throw error}finally{recordDevelopmentTiming(stage,start,performance.now(),failed)}
}
export function developmentTimingAllowed(url:string){
 const parsed=new URL(url)
 return process.env.AULABASE_DEV_TIMING==='true'&&['localhost','127.0.0.1'].includes(parsed.hostname)
  &&process.env.SUPABASE_URL==='https://eolgunypmtgrsyrjzcld.supabase.co'
}
export async function withDevelopmentRequestTiming(request:Request,cold:boolean,operation:()=>Promise<Response>){
 if(!developmentTimingAllowed(request.url))return operation()
 const path=new URL(request.url).pathname
 const route=/^\/api\/v1\/evaluation-instruments\/(interpret|recommend)$/.test(path)?path:
  ['/api/v1/activities','/api/v1/activities/center','/api/v1/auth/login'].includes(path)?path:null
 if(!route)return operation()
 const trace:Trace={id:randomUUID(),route:request.method+' '+route,cold,started:performance.now(),spans:[]}
 return timing.run(trace,async()=>{
  let status=500
  try{
   const response=await operation();status=response.status
   const headers=new Headers(response.headers)
   headers.set('X-AulaBase-Development-Request',trace.id)
   headers.set('Server-Timing',`local-total;dur=${(performance.now()-trace.started).toFixed(2)}`)
   return new Response(response.body,{status:response.status,statusText:response.statusText,headers})
  }finally{console.info(JSON.stringify({kind:'development-request-timing',id:trace.id,route:trace.route,cold,status,totalMs:Math.round((performance.now()-trace.started)*100)/100,spans:trace.spans}))}
 })
}
