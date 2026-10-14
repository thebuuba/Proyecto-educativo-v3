export const withoutResources = (value:string) => value.replace(/(?:recursos?\s*:|(?:con apoyo de|como recurso|con la ayuda de)\s+)[^.;]*/gi, '')
export const normalizedTask = (value:string) => withoutResources(value).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
