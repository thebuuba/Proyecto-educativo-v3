export const withoutResources = (value:string) => value.replace(/(?:recursos?\s*:|(?:con apoyo de|como recurso|con la ayuda de)\s+)[^.;]*/gi, '')
const commonMisspellings:Record<string,string>={precentan:'presentan',escriven:'escriben',comapran:'comparan',letura:'lectura',utilisando:'utilizando'}
export const normalizedTask = (value:string) => withoutResources(value).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\b(?:precentan|escriven|comapran|letura|utilisando)\b/g,word=>commonMisspellings[word]).trim()
