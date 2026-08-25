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

describe('paleta visual definitiva de AulaBase', () => {
  it('declara todos los colores aprobados como tokens globales', () => {
    const css = readSource('./index.css').toUpperCase()
    const approvedColors = [
      '#FFFFFF',
      '#F8F8F6',
      '#272320',
      '#6F6D6B',
      '#FCF3CC',
      '#F8E694',
      '#FFD64F',
      '#A9B452',
      '#CED25F',
      '#F1F1CC',
      '#E6E7A0',
      '#ECE9FC',
      '#DDD5F9',
      '#E6AEF7',
      '#F6E9FD',
      '#4AA2E3',
      '#7ED2FB',
      '#DDEEF9',
      '#F36C21',
    ]

    approvedColors.forEach((color) => expect(css).toContain(color))
  })

  it('usa el azul aprobado como principal con texto cálido legible', () => {
    const css = readSource('./index.css').toUpperCase()

    expect(css).toContain('--PRIMARY: VAR(--PALETTE-BLUE);')
    expect(css).toContain('--PRIMARY-FOREGROUND: VAR(--PALETTE-INK);')
    expect(css).toContain('--BACKGROUND: VAR(--PALETTE-SURFACE);')
    expect(css).toContain('--FOREGROUND: VAR(--PALETTE-INK);')
  })

  it('elimina del frontend los azules anteriores y los tonos de marca no aprobados', () => {
    const allSources = frontendSources().join('\n').toLowerCase()

    expect(allSources).not.toMatch(/#1e3d8f|#1e4f8f|#1f4e95/)
    expect(allSources).not.toMatch(/#216b9f|#7053a6|#8a6a00|#66702a|#8c3fa4|#b94b11/)
  })

  it('mantiene contraste AA en los botones principales y su estado hover', () => {
    expect(contrastRatio('#4AA2E3', '#272320')).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio('#7ED2FB', '#272320')).toBeGreaterThanOrEqual(4.5)
  })
})
