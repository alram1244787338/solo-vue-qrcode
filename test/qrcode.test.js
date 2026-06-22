import { describe, it, expect } from './runner.js'
import { generateQrMatrix, generateSvgString } from '../src/utils/qrcode.js'

describe('generateQrMatrix', () => {
  describe('矩阵尺寸', () => {
    it('短文本生成版本 1（21x21）', () => {
      const matrix = generateQrMatrix('Hi', { ecLevel: 'L' })
      expect(matrix.length).toBe(21)
    })

    it('内容增多尺寸增大', () => {
      const short = generateQrMatrix('Hi', { ecLevel: 'L' })
      const long = generateQrMatrix('a'.repeat(100), { ecLevel: 'L' })
      expect(long.length).toBeGreaterThan(short.length)
    })

    it('矩阵是正方形', () => {
      const matrix = generateQrMatrix('test')
      expect(matrix.length).toBe(matrix[0].length)
    })
  })

  describe('定位图案', () => {
    const matrix = generateQrMatrix('test')

    it('左上角有定位图案外框', () => {
      expect(matrix[0][0]).toBe(true)
      expect(matrix[0][6]).toBe(true)
      expect(matrix[6][0]).toBe(true)
      expect(matrix[6][6]).toBe(true)
    })

    it('右上角有定位图案', () => {
      const size = matrix.length
      expect(matrix[0][size - 1]).toBe(true)
      expect(matrix[0][size - 7]).toBe(true)
    })

    it('左下角有定位图案', () => {
      const size = matrix.length
      expect(matrix[size - 1][0]).toBe(true)
      expect(matrix[size - 7][0]).toBe(true)
    })
  })

  describe('纠错等级', () => {
    it('四个等级都能生成有效矩阵', () => {
      const levels = ['L', 'M', 'Q', 'H']
      for (const level of levels) {
        const matrix = generateQrMatrix('test', { ecLevel: level })
        expect(matrix.length).toBeGreaterThanOrEqual(21)
        expect(matrix.length).toBeLessThanOrEqual(177)
      }
    })
  })

  describe('内容变化矩阵变化', () => {
    it('相同内容生成相同矩阵', () => {
      const a = generateQrMatrix('Hello')
      const b = generateQrMatrix('Hello')
      let same = true
      for (let r = 0; r < a.length; r++) {
        for (let c = 0; c < a[0].length; c++) {
          if (a[r][c] !== b[r][c]) same = false
        }
      }
      expect(same).toBe(true)
    })
  })
})

describe('generateSvgString', () => {
  it('返回有效 SVG 字符串', () => {
    const svg = generateSvgString('test')
    expect(svg).toMatch(/^<svg/)
    expect(svg).toMatch(/<\/svg>$/)
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
  })

  it('背景色正确', () => {
    const svg = generateSvgString('test', { background: '#ff0000', foreground: '#00ff00' })
    expect(svg).toContain('fill="#ff0000"')
    expect(svg).toContain('fill="#00ff00"')
  })

  it('颜色自动规范化为 6 位小写', () => {
    const svg = generateSvgString('test', { foreground: '#F00', background: '0f0' })
    expect(svg).toContain('fill="#ff0000"')
    expect(svg).toContain('fill="#00ff00"')
  })

  it('包含多个矩形模块', () => {
    const svg = generateSvgString('Hello World')
    const matches = svg.match(/<rect/g)
    expect(matches.length).toBeGreaterThan(50)
  })
})
