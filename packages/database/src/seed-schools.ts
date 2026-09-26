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

type SchoolCsvRow = {
  name: string
  sector: string
  centerCode: string | null
  regionalCode: string | null
  regionalName: string | null
  district: string
  districtCode: string | null
  districtName: string | null
  lat: number | null
  lng: number | null
}

function splitCodeAndName(value: string) {
  const match = value.trim().match(/^(\d+)\s*-\s*(.+)$/)
  return match ? { code: match[1], name: match[2].trim() } : { code: null, name: value.trim() || null }
}

function parseCoordinate(value: string | undefined) {
  const normalized = value?.trim()
  if (!normalized) return null
  const coordinate = Number(normalized)
  return Number.isFinite(coordinate) ? coordinate : null
}

async function parseSchools(): Promise<SchoolCsvRow[]> {
  const schools = new Map<string, SchoolCsvRow>()
  const fileStream = createReadStream(CSV_PATH, { encoding: 'latin1' })
  const rl = createInterface({ input: fileStream })
  let isFirst = true

  for await (const line of rl) {
    if (isFirst) { isFirst = false; continue }
    const cols = line.split(';')
    if (cols.length < 5) continue
    const rawCenter = cols[2]?.trim() ?? ''
    const sector = cols[3]?.trim() ?? ''
    const district = cols[1]?.trim() ?? ''
    const regional = cols[0]?.trim() ?? ''
    const center = splitCodeAndName(rawCenter.replace(/^["\s]+|["\s]+$/g, ''))
    const regionalParts = splitCodeAndName(regional)
    const districtParts = splitCodeAndName(district)
    const name = center.name ?? ''
    if (!name) continue
    const key = center.code ?? `${name}:${district}`
    schools.set(key, {
      name,
      sector: normalizeSector(sector),
      centerCode: center.code,
      regionalCode: regionalParts.code,
      regionalName: regionalParts.name,
      district,
      districtCode: districtParts.code,
      districtName: districtParts.name,
      lat: parseCoordinate(cols[5]),
      lng: parseCoordinate(cols[6]),
    })
  }

  return [...schools.values()]
}

async function seedSchools() {
  if (!existsSync(CSV_PATH)) {
    console.log('Downloading CSV...')
    await downloadCsv()
  }

  console.log('Parsing CSV...')
  const schools = await parseSchools()
  console.log(`Found ${schools.length} unique schools`)

  const rows: Array<SchoolCsvRow & { slug: string }> = []
  const slugCounts = new Map<string, number>()

  for (const school of schools) {
    const { name } = school
    let slug = createSlug(name)
    if (!slug) slug = 'escuela'
    const count = slugCounts.get(slug) ?? 0
    slugCounts.set(slug, count + 1)
    if (count > 0) slug = `${slug}-${count}`
    rows.push({ ...school, slug })
  }

  console.log('Inserting schools in bulk...')
  const BATCH = 500
  let total = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const placeholders = batch
      .map((_, idx) => `($${idx * 11 + 1}, $${idx * 11 + 2}, $${idx * 11 + 3}, $${idx * 11 + 4}, $${idx * 11 + 5}, $${idx * 11 + 6}, $${idx * 11 + 7}, $${idx * 11 + 8}, $${idx * 11 + 9}, $${idx * 11 + 10}, $${idx * 11 + 11})`)
      .join(', ')
    const params = batch.flatMap((r) => [r.name, r.slug, r.sector, r.centerCode, r.district, r.regionalCode, r.regionalName, r.districtCode, r.districtName, r.lat, r.lng])

    await prisma.$executeRawUnsafe(`
      INSERT INTO schools (name, slug, sector, center_code, district, regional_code, regional_name, district_code, district_name, lat, lng)
      VALUES ${placeholders}
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name, sector = EXCLUDED.sector, center_code = EXCLUDED.center_code,
        district = EXCLUDED.district, regional_code = EXCLUDED.regional_code,
        regional_name = EXCLUDED.regional_name, district_code = EXCLUDED.district_code,
        district_name = EXCLUDED.district_name, lat = EXCLUDED.lat, lng = EXCLUDED.lng
    `, ...params)

    total += batch.length
    console.log(`  ${total}/${rows.length}`)
  }

  console.log(`Done. ${total} schools inserted.`)
}

seedSchools()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
