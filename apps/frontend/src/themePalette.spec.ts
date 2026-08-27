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
      '#F5F5F7',
      '#1D1D1F',
      '#5F6368',
      '#0A66C2',
      '#EAF3FC',
      '#5856D6',
    ]

    approvedColors.forEach((color) => expect(css).toContain(color))
  })

  it('usa el azul aprobado como principal con texto cálido legible', () => {
    const css = readSource('./index.css').toUpperCase()

    expect(css).toContain('--PRIMARY: VAR(--PALETTE-BLUE);')
    expect(css).toContain('--PRIMARY-FOREGROUND: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--ACCENT: VAR(--PALETTE-INDIGO);')
    expect(css).toContain('--ACCENT-FOREGROUND: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--BACKGROUND: VAR(--PALETTE-SURFACE);')
    expect(css).toContain('--FOREGROUND: VAR(--PALETTE-INK);')
  })

  it('elimina del frontend los azules anteriores y los tonos de marca no aprobados', () => {
    const allSources = frontendSources().join('\n').toLowerCase()

    expect(allSources).not.toMatch(/#1e3d8f|#1e4f8f|#1f4e95/)
    expect(allSources).not.toMatch(/#216b9f|#7053a6|#8a6a00|#66702a|#8c3fa4|#b94b11/)
  })

  it('mantiene contraste AA en acciones y textos', () => {
    expect(contrastRatio('#0A66C2', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#0857A6', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#5856D6', '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#5F6368', '#F5F5F7')).toBeGreaterThanOrEqual(4.5)
  })
})
