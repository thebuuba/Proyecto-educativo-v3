import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const readSource = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8')

function contrastRatio(first: string, second: string): number {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2])
  }

  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

describe('paleta visual de AulaBase', () => {
  it('carga la capa semántica después de los estilos base', () => {
    const main = readSource('./main.tsx')
    const baseImport = main.indexOf("import './index.css'")
    const semanticImport = main.indexOf("import './semantic-palette.css'")

    expect(baseImport).toBeGreaterThanOrEqual(0)
    expect(semanticImport).toBeGreaterThan(baseImport)
  })

  it('declara la paleta aprobada, blanco y texto neutral', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()
    const approvedColors = [
      '#3CB7E2',
      '#66D64F',
      '#F6886F',
      '#F9C46B',
      '#E3E3E3',
      '#FFFFFF',
      '#2F3542',
    ]
    const declaredHexColors = [...new Set(css.match(/#[0-9A-F]{6}/g) ?? [])].sort()

    expect(declaredHexColors).toEqual([...approvedColors].sort())
  })

  it('asigna cada color a un rol semántico estable', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()

    expect(css).toContain('--PALETTE-BLUE: #3CB7E2;')
    expect(css).toContain('--PALETTE-GREEN: #66D64F;')
    expect(css).toContain('--PALETTE-CORAL: #F6886F;')
    expect(css).toContain('--PALETTE-GOLD: #F9C46B;')
    expect(css).toContain('--PALETTE-GRAY: #E3E3E3;')
    expect(css).toContain('--PALETTE-WHITE: #FFFFFF;')
    expect(css).toContain('--PALETTE-TEXT: #2F3542;')

    expect(css).toContain('--PRIMARY: VAR(--PALETTE-BLUE);')
    expect(css).toContain('--TERTIARY: VAR(--PALETTE-GREEN);')
    expect(css).toContain('--SECONDARY: VAR(--PALETTE-CORAL);')
    expect(css).toContain('--DESTRUCTIVE: VAR(--PALETTE-CORAL);')
    expect(css).toContain('--WARNING: VAR(--PALETTE-GOLD);')
    expect(css).toContain('--CARD: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--FOREGROUND: VAR(--PALETTE-TEXT);')
    expect(css).toContain('--BORDER: VAR(--PALETTE-GRAY);')
  })

  it('mantiene las tarjetas y la navegación sobre superficies blancas', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()

    expect(css).toContain('--SURFACE: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--CARD: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--SIDEBAR: VAR(--PALETTE-WHITE);')
    expect(css).toContain('--BG-SURFACE: VAR(--PALETTE-WHITE);')
  })

  it('usa texto oscuro legible sobre todos los colores principales', () => {
    const text = '#2F3542'

    expect(contrastRatio('#3CB7E2', text)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#66D64F', text)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#F6886F', text)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#F9C46B', text)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#E3E3E3', text)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#FFFFFF', text)).toBeGreaterThanOrEqual(4.5)
  })
})
