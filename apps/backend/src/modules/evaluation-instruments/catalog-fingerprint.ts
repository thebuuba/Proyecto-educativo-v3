import { createHash } from 'node:crypto'

/** PostgreSQL 17 JSONB text for the reviewed catalog's JSON values and safe integer weights. */
export function catalogFingerprint(catalog: unknown): string {
  const render = (value: unknown): string => {
    if (Array.isArray(value)) return `[${value.map(render).join(', ')}]`
    if (value !== null && typeof value === 'object') {
      // JSONB sorts keys by UTF-8 byte length, then binary order; independent of locale.
      const entries = Object.entries(value).map(([key, item]) => ({ key, item, bytes: Buffer.from(key, 'utf8') }))
        .sort((a, b) => a.bytes.length - b.bytes.length || Buffer.compare(a.bytes, b.bytes))
      return `{${entries.map(({ key, item }) => `${JSON.stringify(key)}: ${render(item)}`).join(', ')}}`
    }
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
      throw new Error('La huella del catálogo requiere cada número como entero seguro; revisar la representación antes de publicar decimales.')
    }
    return JSON.stringify(value)
  }
  // Match the installer's JSON serialization of optional fields before rendering JSONB.
  return createHash('sha256').update(render(JSON.parse(JSON.stringify(catalog))), 'utf8').digest('hex')
}
