import { describe, expect, it } from 'vitest'
import { receiptContentType } from './billing-receipts'
describe('private transfer receipt validation', () => {
  it('rejects a declared PDF containing executable or HTML content', () => {
    expect(() => receiptContentType(Buffer.from('<html>not a PDF</html>'), 'application/pdf')).toThrow()
  })
  it('accepts a matching PDF and PNG but rejects a mismatched declared type', () => {
    expect(receiptContentType(Buffer.from('%PDF-1.7\nsynthetic'), 'application/pdf')).toBe('application/pdf')
    expect(receiptContentType(Buffer.from([137,80,78,71,13,10,26,10,0]), 'image/png')).toBe('image/png')
    expect(() => receiptContentType(Buffer.from('%PDF-1.7\nsynthetic'), 'image/png')).toThrow()
  })
  it('rejects empty and oversized content', () => {
    expect(() => receiptContentType(Buffer.alloc(0), 'application/pdf')).toThrow()
    expect(() => receiptContentType(Buffer.alloc(10485761), 'application/pdf')).toThrow()
  })
})
