import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { prisma } from './index.js'

const CSV_PATH = '/tmp/escuelas_2024.csv'

function mapNivel(nivel: string): string | null {
  if (nivel === '1-Inicial') return null
  if (nivel === '2-Primario') return 'primary'
  if (nivel === '3-Secundario') return 'secondary'
  if (nivel === 'Educ. de Adultos') return 'adultos'
  return null
}

function mapTanda(tanda: string): string | null {
  switch (tanda) {
    case 'Matutina': return 'morning'
    case 'Vespertina': return 'afternoon'
    case 'Nocturna': return 'night'
    case 'Jornada Extendida': return 'extended'
    case 'Sabatina': return 'morning'
    case 'Semipresencial': return 'multiple'
    case 'Dominical': return null
    default: return null
  }
}

function mapModalidad(modalidad: string): string | null {
  switch (modalidad) {
    case 'No aplica': return 'regular'
    case 'Académica': return 'regular'
    case 'Técnico Profesional': return 'other'
    case 'Artes': return 'other'
    default: return null
  }
}

function escapeLiteral(val: string): string {
  return "'" + val.replace(/'/g, "''") + "'"
}

function toPgArray(arr: string[]): string {
  if (arr.length === 0) return "'{}'::text[]"
  const escaped = arr.map((s) => "'" + s.replace(/'/g, "''") + "'").join(',')
  return `ARRAY[${escaped}]::text[]`
}

async function main() {
  const schoolData = new Map<string, { niveles: Set<string>; tandas: Set<string>; modalidades: Set<string> }>()

  const fileStream = createReadStream(CSV_PATH, { encoding: 'latin1' })
  const rl = createInterface({ input: fileStream })
  let lineCount = 0

  for await (const line of rl) {
    lineCount++
    if (lineCount <= 2) continue
    const cols = line.split(';')
    if (cols.length < 9) continue
    const rawName = cols[4]?.trim() ?? ''
    const name = rawName.replace(/^["\s]*\d+\s*-\s*/, '').replace(/^["\s]+|["\s]+$/g, '').trim()
    if (!name) continue
    const nivelRaw = cols[6]?.trim() ?? ''
    const tandaRaw = cols[5]?.trim() ?? ''
    const modalidadRaw = cols[7]?.trim() ?? ''

    if (!schoolData.has(name)) {
      schoolData.set(name, { niveles: new Set(), tandas: new Set(), modalidades: new Set() })
    }
    const entry = schoolData.get(name)!
    const nivel = mapNivel(nivelRaw)
    const tanda = mapTanda(tandaRaw)
    const modalidad = mapModalidad(modalidadRaw)
    if (nivel) entry.niveles.add(nivel)
    if (tanda) entry.tandas.add(tanda)
    if (modalidad) entry.modalidades.add(modalidad)
    if (lineCount % 5000 === 0) console.log(`  Parsed ${lineCount} lines...`)
  }

  console.log(`Parsed ${lineCount} lines, ${schoolData.size} unique schools`)

  const entries = [...schoolData.entries()]
  const BATCH = 200
  let updated = 0

  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH)
    const whenClauses = batch.map(
      ([name, d]) =>
        `WHEN ${escapeLiteral(name)} THEN ${toPgArray([...d.niveles])}`
    ).join(' ')
    const whenClausesT = batch.map(
      ([name, d]) =>
        `WHEN ${escapeLiteral(name)} THEN ${toPgArray([...d.tandas])}`
    ).join(' ')
    const whenClausesM = batch.map(
      ([name, d]) =>
        `WHEN ${escapeLiteral(name)} THEN ${toPgArray([...d.modalidades])}`
    ).join(' ')

    const nameList = batch.map(([name]) => escapeLiteral(name)).join(', ')

    await prisma.$executeRawUnsafe(`
      UPDATE schools
      SET niveles = CASE name ${whenClauses} ELSE niveles END,
          tandas = CASE name ${whenClausesT} ELSE tandas END,
          modalidades = CASE name ${whenClausesM} ELSE modalidades END
      WHERE name IN (${nameList}) AND status = 'active'
    `)

    updated += batch.length
    if (updated % 1000 === 0 || updated === entries.length) {
      console.log(`  Updated ${updated}/${entries.length} schools`)
    }
  }

  console.log(`Done. ${updated} schools updated with onboarding defaults.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
