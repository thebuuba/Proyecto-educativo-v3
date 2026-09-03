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

  it('declara exactamente los cinco colores aprobados', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()
    const approvedColors = ['#8A00D4', '#D527B7', '#F782C2', '#F9C46B', '#E3E3E3']
    const declaredHexColors = [...new Set(css.match(/#[0-9A-F]{6}/g) ?? [])].sort()

    expect(declaredHexColors).toEqual([...approvedColors].sort())
  })

  it('asigna los cinco colores a una jerarquía consistente', () => {
    const css = readSource('./semantic-palette.css').toUpperCase()

    expect(css).toContain('--PALETTE-PURPLE: #8A00D4;')
    expect(css).toContain('--PALETTE-FUCHSIA: #D527B7;')
    expect(css).toContain('--PALETTE-PINK: #F782C2;')
    expect(css).toContain('--PALETTE-GOLD: #F9C46B;')
    expect(css).toContain('--PALETTE-GRAY: #E3E3E3;')
    expect(css).toContain('--PRIMARY: VAR(--PALETTE-PURPLE);')
    expect(css).toContain('--BACKGROUND: VAR(--PALETTE-GRAY);')
    expect(css).toContain('--FOREGROUND: VAR(--PALETTE-PURPLE);')
    expect(css).toContain('--BORDER: VAR(--PALETTE-PINK);')
    expect(css).toContain('--WARNING: VAR(--PALETTE-GOLD);')
  })

  it('mantiene el contraste principal entre morado y gris', () => {
    expect(contrastRatio('#8A00D4', '#E3E3E3')).toBeGreaterThanOrEqual(4.5)
  })
})
