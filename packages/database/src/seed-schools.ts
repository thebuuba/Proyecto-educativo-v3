import { createWriteStream, existsSync } from 'node:fs'
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

async function downloadCsv(): Promise<void> {
  const res = await fetch(CSV_URL)
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status}`)
  const reader = res.body.getReader()
  const writer = createWriteStream(CSV_PATH)
  const pump = async () => {
    while (true) {
      const { done, value } = await reader.read()
      if (done) { writer.close(); break }
      writer.write(Buffer.from(value))
    }
  }
  await pump()
}

async function parseSchools(): Promise<Map<string, { sector: string; district: string }>> {
  const schools = new Map<string, { sector: string; district: string }>()
  const fileStream = createReadStream(CSV_PATH, { encoding: 'latin1' })
  const rl = createInterface({ input: fileStream })
  let isFirst = true

  for await (const line of rl) {
    if (isFirst) { isFirst = false; continue }
    const cols = line.split(';')
    if (cols.length < 5) continue
    const rawName = cols[2]?.trim() ?? ''
    const sector = cols[3]?.trim() ?? ''
    const district = cols[1]?.trim() ?? ''
    const name = rawName.replace(/^["\s]*\d+\s*-\s*/, '').replace(/^["\s]+|["\s]+$/g, '').trim()
    if (!name) continue
    if (!schools.has(name)) {
      schools.set(name, { sector: normalizeSector(sector), district })
    }
  }

  return schools
}

async function seedSchools() {
  if (!existsSync(CSV_PATH)) {
    console.log('Downloading CSV...')
    await downloadCsv()
  }

  console.log('Parsing CSV...')
  const schools = await parseSchools()
  console.log(`Found ${schools.size} unique schools`)

  const rows: Array<{ name: string; slug: string; sector: string; district: string }> = []
  const slugCounts = new Map<string, number>()

  for (const [name, info] of schools) {
    let slug = createSlug(name)
    if (!slug) slug = 'escuela'
    const count = slugCounts.get(slug) ?? 0
    slugCounts.set(slug, count + 1)
    if (count > 0) slug = `${slug}-${count}`
    rows.push({ name, slug, sector: info.sector, district: info.district })
  }

  console.log('Inserting schools in bulk...')
  const BATCH = 500
  let total = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const placeholders = batch
      .map((_, idx) => `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`)
      .join(', ')
    const params = batch.flatMap((r) => [r.name, r.slug, r.sector, r.district])

    await prisma.$executeRawUnsafe(`
      INSERT INTO schools (name, slug, sector, district)
      VALUES ${placeholders}
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sector = EXCLUDED.sector, district = EXCLUDED.district
    `, ...params)

    total += batch.length
    console.log(`  ${total}/${rows.length}`)
  }

  console.log(`Done. ${total} schools inserted.`)
}

seedSchools()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
