/**
 * 规范化十六进制颜色为 6 位格式（#RRGGBB）
 * 支持 3 位短格式（#RGB → #RRGGBB）、8 位半透明（#RRGGBBAA → #RRGGBB）
 * @param {string} hex - 十六进制颜色
 * @returns {string}
 */
export function normalizeHex(hex) {
  let h = hex.trim().toLowerCase()
  if (!h.startsWith('#')) h = '#' + h
  h = h.replace(/[^#0-9a-f]/g, '')

  if (/^#[0-9a-f]{3}$/.test(h)) {
    h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
  }
  if (/^#[0-9a-f]{8}$/.test(h)) {
    h = h.slice(0, 7)
  }
  if (/^#[0-9a-f]{4}$/.test(h)) {
    h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
  }

  return /^#[0-9a-f]{6}$/.test(h) ? h : '#000000'
}

/**
 * 十六进制颜色转 RGB
 * @param {string} hex - 十六进制颜色，支持 #ff0000、#f00、#ff000080 等格式
 * @returns {{r: number, g: number, b: number}}
 */
export function hexToRgb(hex) {
  const normalized = normalizeHex(hex)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

/**
 * RGB 转十六进制颜色
 * @param {number} r - 红色 0-255
 * @param {number} g - 绿色 0-255
 * @param {number} b - 蓝色 0-255
 * @returns {string}
 */
export function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

/**
 * 检查颜色是否为亮色（用于自动决定对比色）
 * @param {string} hex - 十六进制颜色
 * @returns {boolean}
 */
export function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128
}

/**
 * 限制数值在范围内
 * @param {number} value - 输入值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function utf8ByteLength(str) {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    if (c < 0x80) len += 1
    else if (c < 0x800) len += 2
    else if (c < 0xd800 || c >= 0xe000) len += 3
    else {
      i++
      len += 4
    }
  }
  return len
}

/**
 * 验证二维码内容
 * @param {string} text - 输入文本
 * @returns {{valid: boolean, message: string, byteLength: number}
 */
export function validateQrContent(text) {
  if (!text || text.trim().length === 0) {
    return { valid: false, message: '请输入内容', byteLength: 0 }
  }
  const byteLength = utf8ByteLength(text)
  if (byteLength > 2953) {
    return { valid: false, message: '内容过长，无法生成二维码', byteLength }
  }
  return { valid: true, message: '', byteLength }
}

/**
 * 下载文件
 * @param {string} dataUrl - 数据 URL
 * @param {string} filename - 文件名
 */
export function downloadFile(dataUrl, filename) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
