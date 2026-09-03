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
  it('declara los colores base como tokens globales', () => {
    const css = readSource('./index.css').toUpperCase()
    const approvedColors = [
      '#FFFFFF',
      '#F8F8F6',
      '#252321',
      '#68635F',
      '#236A96',
      '#DDF1FA',
      '#7B3F8C',
      '#FFF3C4',
      '#CDD944',
      '#F6E6FA',
      '#25A8D8',
    ]

    approvedColors.forEach((color) => expect(css).toContain(color))
  })

  it('usa el azul aprobado como principal con texto cálido legible', () => {
    const css = readSource('./index.css').toUpperCase()

    expect(css).toContain('--PRIMARY: VAR(--PALETTE-BLUE);')
    expect(css).toContain('--PRIMARY-FOREGROUND: VAR(--ON-PRIMARY);')
    expect(css).toContain('--ACCENT: VAR(--SECONDARY);')
    expect(css).toContain('--ACCENT-FOREGROUND: VAR(--ON-SECONDARY);')
    expect(css).toContain('--BACKGROUND: VAR(--PALETTE-SURFACE);')
    expect(css).toContain('--FOREGROUND: VAR(--ON-BACKGROUND);')
  })

  it('define roles Material y colores on para cada contenedor', () => {
    const css = readSource('./index.css').toUpperCase()

    expect(css).toContain('--ON-PRIMARY: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--PRIMARY-CONTAINER: VAR(--PALETTE-BLUE-LIGHT);')
    expect(css).toContain('--ON-PRIMARY-CONTAINER: VAR(--PALETTE-INK);')
    expect(css).toContain('--SECONDARY: VAR(--PALETTE-PLUM);')
    expect(css).toContain('--SECONDARY-CONTAINER: VAR(--PALETTE-LAVENDER-LIGHT);')
    expect(css).toContain('--ON-SECONDARY-CONTAINER: VAR(--PALETTE-INK);')
    expect(css).toContain('--TERTIARY-CONTAINER: VAR(--PALETTE-GREEN-CREAM);')
    expect(css).toContain('--ON-TERTIARY-CONTAINER: VAR(--PALETTE-INK);')
    expect(css).toContain('--WARNING-CONTAINER: VAR(--PALETTE-YELLOW-CREAM);')
    expect(css).toContain('--ON-WARNING-CONTAINER: VAR(--PALETTE-INK);')
    expect(css).toContain('--SURFACE: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--ON-SURFACE: VAR(--PALETTE-INK);')
  })

  it('elimina del frontend los azules anteriores y los tonos de marca no aprobados', () => {
    const allSources = frontendSources().join('\n').toLowerCase()

    expect(allSources).not.toMatch(/#1e3d8f|#1e4f8f|#1f4e95/)
    expect(allSources).not.toMatch(/#216b9f|#7053a6|#8a6a00|#66702a|#8c3fa4|#b94b11/)
  })

  it('mantiene contraste AA en acciones y textos', () => {
    expect(contrastRatio('#236A96', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#1F5D84', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#7B3F8C', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#68635F', '#F8F8F6')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#252321', '#DDF1FA')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#252321', '#F6E6FA')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#252321', '#F1F3C4')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#252321', '#FFF3C4')).toBeGreaterThanOrEqual(4.5)
  })
})
