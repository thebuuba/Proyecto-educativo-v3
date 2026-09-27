import { createHash } from 'node:crypto'

export function searchText(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export function stableUuid(...parts) {
  const bytes = createHash('sha256').update(parts.join('\u001f')).digest().subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function pageItems(content) {
  return content.items
    .filter((item) => item.str?.trim())
    .map((item) => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
      height: Math.abs(item.transform[3]),
    }))
}

function joinFragments(fragments) {
  let text = ''
  let right = null
  for (const fragment of [...fragments].sort((a, b) => a.x - b.x)) {
    if (text && fragment.x - right > 1.5 && !text.endsWith(' ')) text += ' '
    text += fragment.text
    right = fragment.x + fragment.width
  }
  return text.trim()
}

export function linesIn(items, { left = 0, right = Infinity, top = Infinity, bottom = 0 } = {}) {
  const lines = []
  const selected = items
    .filter((item) => item.x >= left && item.x < right && item.y < top && item.y > bottom)
    .sort((a, b) => b.y - a.y || a.x - b.x)
  for (const item of selected) {
    let line = lines.find((candidate) => Math.abs(candidate.y - item.y) <= 0.8)
    if (!line) {
      line = { y: item.y, fragments: [] }
      lines.push(line)
    }
    line.fragments.push(item)
  }
  return lines
    .sort((a, b) => b.y - a.y)
    .map((line) => ({
      ...line,
      text: joinFragments(line.fragments),
      x: Math.min(...line.fragments.map((fragment) => fragment.x)),
      right: Math.max(...line.fragments.map((fragment) => fragment.x + fragment.width)),
    }))
}

export function blocksIn(items, region, { removeHeaders = [] } = {}) {
  const lines = linesIn(items, region).filter(
    (line) =>
      line.text && !removeHeaders.some((header) => searchText(line.text) === searchText(header)),
  )
  if (!lines.length) return []
  const gaps = lines
    .slice(1)
    .map((line, index) => lines[index].y - line.y)
    .filter((gap) => gap > 3 && gap < 25)
  const baseline = gaps.sort((a, b) => a - b)[Math.floor(gaps.length / 2)] || 12
  const result = []
  let current = null
  for (const line of lines) {
    const bullet = /^\s*(?:[•●▪]|[-–])(?:\s|(?=\p{L})|$)/u.test(line.text)
    const gap = current ? current.lastY - line.y : 0
    const cellBoundary =
      current &&
      (items.rules || []).some(
        (rule) =>
          rule.axis === 'h' &&
          rule.at > line.y &&
          rule.at < current.lastY &&
          rule.from <= line.x + 1 &&
          rule.to >= line.right - 1,
      )
    if (!current || bullet || cellBoundary || gap > baseline * 1.55) {
      current = { lines: [], fragments: [], lastY: line.y }
      result.push(current)
    }
    current.lines.push(line.text)
    current.fragments.push(...line.fragments)
    current.lastY = line.y
  }
  return result
    .map((block) => ({
      originalText: block.lines.join('\n'),
      boundingBox: {
        x0: Math.min(...block.fragments.map((item) => item.x)),
        y0: Math.min(...block.fragments.map((item) => item.y)),
        x1: Math.max(...block.fragments.map((item) => item.x + item.width)),
        y1: Math.max(...block.fragments.map((item) => item.y + item.height)),
      },
    }))
    .filter((block) => searchText(cleanText(block.originalText)).length > 0)
}

export function heading(items, pattern, { top = Infinity, bottom = 0 } = {}) {
  return items.find((item) => item.y < top && item.y > bottom && pattern.test(item.text.trim()))
}

export function cleanText(text) {
  return text
    .replace(/^\s*[•●▪–-]\s*/u, '')
    .replace(/\s+/g, ' ')
    .trim()
}
