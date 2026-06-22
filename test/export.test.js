import { describe, it, expect } from './runner.js'
import { exportAsPng, exportAsSvg } from '../src/utils/export.js'
import { generateSvgString } from '../src/utils/qrcode.js'

function setupMock() {
  global.Blob = function (data, options) {
    return { data, type: options?.type }
  }
  global.URL = {
    createObjectURL() {
      return 'blob:test-1'
    },
    revokeObjectURL() {},
  }
}

function teardownMock() {
  delete global.Blob
  delete global.URL
}

describe('exportAsSvg 颜色规范化', () => {
  it('3 位前景色会被规范化为 6 位', () => {
    const svg = generateSvgString('test', { foreground: '#f00' })
    expect(svg).toContain('fill="#ff0000"')
  })

  it('3 位背景色会被规范化为 6 位', () => {
    const svg = generateSvgString('test', { background: '#0f0' })
    expect(svg).toContain('fill="#00ff00"')
  })

  it('大写颜色会被转小写', () => {
    const svg = generateSvgString('test', { foreground: '#FF00FF' })
    expect(svg).toContain('fill="#ff00ff"')
  })

  it('带透明度的颜色会丢弃透明度', () => {
    const svg = generateSvgString('test', { foreground: '#ff000080' })
    expect(svg).toContain('fill="#ff0000"')
  })
})

describe('导出函数存在性', () => {
  it('exportAsPng 是函数', () => {
    expect(typeof exportAsPng).toBe('function')
  })

  it('exportAsSvg 是函数', () => {
    expect(typeof exportAsSvg).toBe('function')
  })
})

describe('SVG 导出数据验证', () => {
  it('生成的 SVG 包含正确数量的模块', () => {
    const svg = generateSvgString('Hello World', { ecLevel: 'M' })
    const rectCount = (svg.match(/<rect/g) || []).length
    expect(rectCount).toBeGreaterThan(100)
    expect(rectCount).toBeLessThan(1000)
  })

  it('相同内容生成相同 SVG', () => {
    const svg1 = generateSvgString('test')
    const svg2 = generateSvgString('test')
    expect(svg1).toBe(svg2)
  })

  it('尺寸参数正确反映在 viewBox 中', () => {
    const svg = generateSvgString('test', { size: 256 })
    expect(svg).toContain('viewBox="0 0 256 256"')
  })
})

describe('Blob 和 URL mock 环境测试', () => {
  it('Blob 构造函数可被 mock 调用', () => {
    setupMock()
    try {
      const svg = generateSvgString('test')
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      expect(blob.type).toBe('image/svg+xml;charset=utf-8')
      expect(blob.data[0]).toBe(svg)
    } finally {
      teardownMock()
    }
  })
})
