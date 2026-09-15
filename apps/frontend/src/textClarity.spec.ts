import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

const indexCss = readFileSync('src/index.css', 'utf8')
const buttonSource = readFileSync('src/components/ui/Button.tsx', 'utf8')
const gradingBookSource = readFileSync('src/modules/grading/components/GradingBook.tsx', 'utf8')

describe('claridad del texto durante interacciones', () => {
  it('no desenfoca ni escala paneles completos', () => {
    expect(indexCss).not.toMatch(/filter:\s*blur\(/)
    expect(indexCss).not.toContain('scale(1.006)')
    expect(indexCss).not.toContain('scale(0.992)')
  })

  it('mantiene estable el texto del botón compartido', () => {
    expect(buttonSource).not.toMatch(/active:scale-/)
    expect(buttonSource).not.toContain('transform,filter')
  })

  it('no escala las copias con texto durante el arrastre', () => {
    expect(gradingBookSource).not.toMatch(/transform:\s*'scale\(/)
  })
})
