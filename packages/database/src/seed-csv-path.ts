import { resolve } from 'node:path'

/** Ruta explícita y portable; --csv tiene prioridad sobre la variable indicada. */
export function seedCsvPath(variable = 'SCHOOLS_CSV_PATH', env: Record<string, string | undefined> = process.env, argv = process.argv.slice(2)) {
  const args = argv[0] === '--' ? argv.slice(1) : argv
  if (args.length && (args.length !== 2 || args[0] !== '--csv')) throw new Error('Uso: --csv <ruta-del-archivo>')
  const value = (args[1] ?? env[variable])?.trim()
  if (!value || value.startsWith('--')) throw new Error(`Indica --csv <ruta> o configura ${variable}.`)
  return resolve(value)
}
