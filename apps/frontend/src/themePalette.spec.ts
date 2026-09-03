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

  it('declara la opción A de azul petróleo, salvia y crema', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()
    const approvedColors = [
      '#FFFFFF',
      '#F7F9F8',
      '#F0F4F2',
      '#1F2933',
      '#657278',
      '#256F7B',
      '#1E5963',
      '#E5F2F3',
      '#6F927D',
      '#52745F',
      '#EAF2ED',
      '#D49A52',
      '#FBF3E7',
      '#B5474D',
      '#FAECEC',
    ]

    approvedColors.forEach((color) => expect(css).toContain(color))
  })

  it('asigna cada color a un rol semántico estable', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()

    expect(css).toContain('--PRIMARY: #256F7B;')
    expect(css).toContain('--PRIMARY-VARIANT: #1E5963;')
    expect(css).toContain('--PRIMARY-CONTAINER: #E5F2F3;')
    expect(css).toContain('--SECONDARY: #52745F;')
    expect(css).toContain('--SECONDARY-CONTAINER: #EAF2ED;')
    expect(css).toContain('--TERTIARY: #3F7A5F;')
    expect(css).toContain('--WARNING: #9A641F;')
    expect(css).toContain('--WARNING-CONTAINER: #FBF3E7;')
    expect(css).toContain('--DESTRUCTIVE: #B5474D;')
    expect(css).toContain('--BACKGROUND: #F7F9F8;')
    expect(css).toContain('--CARD: #FFFFFF;')
    expect(css).toContain('--FOREGROUND: #1F2933;')
    expect(css).toContain('--BORDER: #DFE6E3;')
  })

  it('mantiene la navegación clara y usa petróleo para selección', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()

    expect(css).toContain('--SIDEBAR: #FFFFFF;')
    expect(css).toContain('--SIDEBAR-FOREGROUND: #657278;')
    expect(css).toContain('--SIDEBAR-PRIMARY: #256F7B;')
    expect(css).toContain('--SIDEBAR-ACCENT: #E5F2F3;')
    expect(css).toContain('--SIDEBAR-ACCENT-FOREGROUND: #1E5963;')
  })

  it('conserva el frontend libre de los tonos históricos descartados', () => {
    const allSources = frontendSources().join('\n').toLowerCase()

    expect(allSources).not.toMatch(/#1e3d8f|#1e4f8f|#1f4e95/)
    expect(allSources).not.toMatch(/#216b9f|#7053a6|#8a6a00|#66702a|#8c3fa4|#b94b11/)
  })

  it('mantiene contraste AA en acciones, estados y textos', () => {
    expect(contrastRatio('#256F7B', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#1E5963', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#52745F', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#657278', '#F7F9F8')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#1F2933', '#E5F2F3')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#1F2933', '#EAF2ED')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#1F2933', '#FBF3E7')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#3F7A5F', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#9A641F', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#B5474D', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#D6E9DF', '#214E55')).toBeGreaterThanOrEqual(4.5)
  })
})
