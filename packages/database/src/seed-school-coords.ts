import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { prisma } from './index.js'

const CSV_PATH = '/tmp/escuelas_dominicanas.csv'

function esc(val: string): string {
  return val.replace(/'/g, "''")
}

async function main() {
  const coords = new Map<string, { lat: number; lng: number }>()

  const fileStream = createReadStream(CSV_PATH, { encoding: 'latin1' })
  const rl = createInterface({ input: fileStream })
  let isFirst = true
  let lineCount = 0

  for await (const line of rl) {
    if (isFirst) { isFirst = false; continue }
    lineCount++
    const cols = line.split(';')
    if (cols.length < 8) continue
    const district = cols[1]?.trim() ?? ''
    const rawName = cols[2]?.trim() ?? ''
    const name = rawName.replace(/^["\s]*\d+\s*-\s*/, '').replace(/^["\s]+|["\s]+$/g, '').trim()
    const lat = parseFloat(cols[5]?.trim().replace(',', '.') ?? '')
    const lng = parseFloat(cols[6]?.trim().replace(',', '.') ?? '')
    if (!name || isNaN(lat) || isNaN(lng)) continue
    const key = `${name}|${district}`
    if (!coords.has(key)) {
      coords.set(key, { lat, lng })
    }
    if (lineCount % 5000 === 0) console.log(`  Processed ${lineCount} lines`)
  }

  console.log(`Parsed ${coords.size} unique (name, district) pairs`)

  const entries = [...coords.entries()]
  const BATCH = 200
  let updated = 0

  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH)
    const values = batch.map(([key, c], idx) => {
      const [name, district] = key.split('|')
      const off = idx * 4
      return `($${off + 1}::text, $${off + 2}::text, $${off + 3}::double precision, $${off + 4}::double precision)`
    }).join(', ')
    const params = batch.flatMap(([key, c]) => {
      const [name, district] = key.split('|')
      return [name, district ?? '', c.lat, c.lng]
    })

    await prisma.$executeRawUnsafe(`
      UPDATE schools
      SET lat = v.lat, lng = v.lng
      FROM (VALUES ${values}) AS v(name, district, lat, lng)
      WHERE schools.name = v.name AND COALESCE(schools.district, '') = v.district
        AND schools.status = 'active'
    `, ...params)

    updated += batch.length
    if (updated % 1000 === 0 || updated === entries.length) {
      console.log(`  Updated ${updated}/${entries.length}`)
    }
  }

  console.log(`Done. ${updated} schools updated with coordinates.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
