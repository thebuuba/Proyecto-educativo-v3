import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const readSource = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')

const sourceRoot = join(process.cwd(), 'src')

function frontendSources(): string[] {
  return readdirSync(sourceRoot, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(css|ts|tsx)$/.test(entry.name) && entry.name !== 'themePalette.spec.ts')
    .map((entry) => readFileSync(`${entry.parentPath}/${entry.name}`, 'utf8'))
}

function contrastRatio(first: string, second: string): number {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2])
  }

  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

describe('paleta visual accesible de AulaBase', () => {
  it('carga la capa semántica después de los estilos base', () => {
    const main = readSource('./main.tsx')
    const baseImport = main.indexOf("import './index.css'")
    const semanticImport = main.indexOf("import './semantic-palette.css'")

    expect(baseImport).toBeGreaterThanOrEqual(0)
    expect(semanticImport).toBeGreaterThan(baseImport)
  })

  it('declara una paleta principal contenida y profesional', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()
    const approvedColors = [
      '#FFFFFF',
      '#F7F8FA',
      '#F1F4F8',
      '#172033',
      '#667085',
      '#3B5CCC',
      '#304CAC',
      '#EBF0FF',
      '#7867C6',
      '#F0EDFF',
      '#37805E',
      '#EAF6EF',
      '#A66517',
      '#FFF5DC',
      '#C2414B',
      '#FDECEF',
    ]

    approvedColors.forEach((color) => expect(css).toContain(color))
  })

  it('asigna cada color a un rol semántico estable', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()

    expect(css).toContain('--PRIMARY: #3B5CCC;')
    expect(css).toContain('--PRIMARY-VARIANT: #304CAC;')
    expect(css).toContain('--PRIMARY-CONTAINER: #EBF0FF;')
    expect(css).toContain('--SECONDARY: #7867C6;')
    expect(css).toContain('--SECONDARY-CONTAINER: #F0EDFF;')
    expect(css).toContain('--TERTIARY: #37805E;')
    expect(css).toContain('--TERTIARY-CONTAINER: #EAF6EF;')
    expect(css).toContain('--WARNING: #A66517;')
    expect(css).toContain('--WARNING-CONTAINER: #FFF5DC;')
    expect(css).toContain('--DESTRUCTIVE: #C2414B;')
    expect(css).toContain('--BACKGROUND: #F7F8FA;')
    expect(css).toContain('--CARD: #FFFFFF;')
    expect(css).toContain('--FOREGROUND: #172033;')
    expect(css).toContain('--BORDER: #E4E7EC;')
  })

  it('mantiene la navegación en neutrales y reserva el azul para selección', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()

    expect(css).toContain('--SIDEBAR: #FFFFFF;')
    expect(css).toContain('--SIDEBAR-FOREGROUND: #667085;')
    expect(css).toContain('--SIDEBAR-PRIMARY: #3B5CCC;')
    expect(css).toContain('--SIDEBAR-ACCENT: #EBF0FF;')
    expect(css).toContain('--SIDEBAR-ACCENT-FOREGROUND: #304CAC;')
  })

  it('conserva el frontend libre de los tonos históricos descartados', () => {
    const allSources = frontendSources().join('\n').toLowerCase()

    expect(allSources).not.toMatch(/#1e3d8f|#1e4f8f|#1f4e95/)
    expect(allSources).not.toMatch(/#216b9f|#7053a6|#8a6a00|#66702a|#8c3fa4|#b94b11/)
  })

  it('mantiene contraste AA en acciones, estados y textos', () => {
    expect(contrastRatio('#3B5CCC', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#304CAC', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#7867C6', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#667085', '#F7F8FA')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#172033', '#EBF0FF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#172033', '#F0EDFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#172033', '#EAF6EF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#172033', '#FFF5DC')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#37805E', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#A66517', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#C2414B', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#B8C6FF', '#263552')).toBeGreaterThanOrEqual(4.5)
  })
})
