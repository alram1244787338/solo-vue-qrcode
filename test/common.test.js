import { describe, it, expect } from './runner.js'
import {
  normalizeHex,
  hexToRgb,
  rgbToHex,
  isLightColor,
  clamp,
  validateQrContent,
} from '../src/utils/common.js'

describe('normalizeHex', () => {
  it('6 位标准格式原样返回（小写）', () => {
    expect(normalizeHex('#ff0000')).toBe('#ff0000')
  })

  it('大写自动转小写', () => {
    expect(normalizeHex('#FF0000')).toBe('#ff0000')
    expect(normalizeHex('#3A7BFF')).toBe('#3a7bff')
  })

  it('3 位短格式展开为 6 位', () => {
    expect(normalizeHex('#369')).toBe('#336699')
    expect(normalizeHex('#f00')).toBe('#ff0000')
    expect(normalizeHex('#fff')).toBe('#ffffff')
  })

  it('8 位带透明度的格式丢弃透明度', () => {
    expect(normalizeHex('#ff000080')).toBe('#ff0000')
  })

  it('不带 # 号的自动补全', () => {
    expect(normalizeHex('ff0000')).toBe('#ff0000')
    expect(normalizeHex('f00')).toBe('#ff0000')
  })

  it('非法值降级为 #000000', () => {
    expect(normalizeHex('')).toBe('#000000')
    expect(normalizeHex('zzz')).toBe('#000000')
    expect(normalizeHex('red')).toBe('#000000')
  })
})

describe('hexToRgb', () => {
  it('6 位十六进制转 RGB', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 })
    expect(hexToRgb('#336699')).toEqual({ r: 51, g: 102, b: 153 })
  })

  it('3 位十六进制自动展开转 RGB', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
    expect(hexToRgb('#369')).toEqual({ r: 51, g: 102, b: 153 })
  })

  it('不带 # 号也能解析', () => {
    expect(hexToRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('rgbToHex', () => {
  it('RGB 值转十六进制', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00')
    expect(rgbToHex(51, 102, 153)).toBe('#336699')
  })

  it('自动钳位到 0-255', () => {
    expect(rgbToHex(-10, 300, 128)).toBe('#00ff80')
  })
})

describe('isLightColor', () => {
  it('白色是亮色', () => {
    expect(isLightColor('#ffffff')).toBe(true)
  })

  it('黑色是暗色', () => {
    expect(isLightColor('#000000')).toBe(false)
  })
})

describe('clamp', () => {
  it('值在范围内保持不变', () => {
    expect(clamp(50, 0, 100)).toBe(50)
  })

  it('低于最小值返回最小值', () => {
    expect(clamp(-10, 0, 100)).toBe(0)
  })

  it('高于最大值返回最大值', () => {
    expect(clamp(200, 0, 100)).toBe(100)
  })
})

describe('validateQrContent', () => {
  it('空字符串无效', () => {
    const result = validateQrContent('')
    expect(result.valid).toBe(false)
    expect(result.message).toBe('请输入内容')
  })

  it('正常英文文本有效', () => {
    const result = validateQrContent('Hello World')
    expect(result.valid).toBe(true)
    expect(result.byteLength).toBe(11)
  })

  it('中文每个占 3 字节', () => {
    const result = validateQrContent('你好')
    expect(result.byteLength).toBe(6)
  })

  it('2953 字节刚好通过', () => {
    const text = 'a'.repeat(2953)
    const result = validateQrContent(text)
    expect(result.valid).toBe(true)
  })

  it('2954 字节超长', () => {
    const text = 'a'.repeat(2954)
    const result = validateQrContent(text)
    expect(result.valid).toBe(false)
    expect(result.message).toBe('内容过长，无法生成二维码')
  })
})
