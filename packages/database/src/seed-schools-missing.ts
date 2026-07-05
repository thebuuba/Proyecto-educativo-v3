import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { prisma } from './index.js'

const CSV_URL = 'https://ministeriodeeducacion.gob.do/transparencia/file/descarga?fileNombre=8sq-centros-educativos-de-republica-dominicana-periodo-escolar-2023-2024.csv&fileExt=csv&fileName=RTz-8sq-centros-educativos-de-republica-dominicana-periodo-escolar-2023-2024csv.csv&category=conjunto-de-datos-abiertos&subcategory=1-centros-educativos'
const CSV_PATH = '/tmp/escuelas_dominicanas.csv'

function normalizeSector(sector: string): string {
  const s = sector.trim().toUpperCase()
  if (s === 'PÚBLICO' || s === 'PUBLICO') return 'public'
  return 'private'
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  console.log('Loading existing schools from DB...')
  const existing = await prisma.school.findMany({
    where: { status: 'ACTIVE' },
    select: { name: true, district: true },
  })
  const existingSet = new Set(existing.map(s => `${s.name}|${s.district ?? ''}`))
  console.log(`  ${existing.length} schools in DB`)

  const slugCounts = new Map<string, number>()
  for (const s of existing) {
    const slug = createSlug(s.name)
    slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1)
  }

  const fileStream = createReadStream(CSV_PATH, { encoding: 'latin1' })
  const rl = createInterface({ input: fileStream })
  let isFirst = true
  const toInsert: Array<{ name: string; slug: string; sector: string; district: string }> = []
  let lineCount = 0
  let missingCount = 0

  for await (const line of rl) {
    if (isFirst) { isFirst = false; continue }
    lineCount++
    const cols = line.split(';')
    if (cols.length < 5) continue
    const rawName = cols[2]?.trim() ?? ''
    const sector = cols[3]?.trim() ?? ''
    const district = cols[1]?.trim() ?? ''
    const name = rawName.replace(/^["\s]*\d+\s*-\s*/, '').replace(/^["\s]+|["\s]+$/g, '').trim()
    if (!name) continue

    const key = `${name}|${district}`
    if (existingSet.has(key)) continue
    if (toInsert.some(r => `${r.name}|${r.district}` === key)) continue

    let slug = createSlug(name)
    if (!slug) slug = 'escuela'
    const count = slugCounts.get(slug) ?? 0
    slugCounts.set(slug, count + 1)
    if (count > 0) slug = `${slug}-${count}`

    toInsert.push({ name, slug, sector: normalizeSector(sector), district })
    missingCount++
    if (lineCount % 1000 === 0) console.log(`  Processed ${lineCount} lines, ${missingCount} missing found`)
  }

  console.log(`Found ${missingCount} missing (name, district) pairs`)

  if (!missingCount) { console.log('Nothing to insert.'); return }

  const BATCH = 200
  let inserted = 0
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH)
    const placeholders = batch.map((_, idx) => `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`).join(', ')
    const params = batch.flatMap(r => [r.name, r.slug, r.sector, r.district])
    await prisma.$executeRawUnsafe(`
      INSERT INTO schools (name, slug, sector, district)
      VALUES ${placeholders}
      ON CONFLICT (slug) DO UPDATE SET district = EXCLUDED.district
    `, ...params)
    inserted += batch.length
    console.log(`  Inserted ${inserted}/${missingCount}`)
  }

  console.log(`Done. ${inserted} schools inserted.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
