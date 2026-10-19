import assert from 'node:assert/strict'
import {readdirSync,readFileSync,statSync} from 'node:fs'
import {test} from 'node:test'

test('los assets JavaScript compilados caben en el límite de precaché y figuran en el service worker',t=>{
 const assets=new URL('../../apps/frontend/dist/assets/',import.meta.url)
 const files=readdirSync(assets).filter(name=>name.endsWith('.js'))
 assert(files.length>0,'Compilar el frontend antes de esta comprobación')
 const sizes=files.map(name=>({name,bytes:statSync(new URL(name,assets)).size}))
 assert.deepEqual(sizes.filter(file=>file.bytes>2*1024*1024),[],'Un asset supera los 2 MiB de precaché; dividir sus módulos sin elevar el límite')
 const worker=readFileSync(new URL('../../apps/frontend/dist/sw.js',import.meta.url),'utf8')
 for(const name of files)assert(worker.includes('assets/'+name),'Asset ausente de la precaché: '+name)
 t.diagnostic(JSON.stringify({assets:files.length,largestBytes:Math.max(...sizes.map(file=>file.bytes)),maximumBytes:2*1024*1024,allPrecached:true}))
})
