import { generateSvgString } from './qrcode.js'
import { downloadFile, normalizeHex } from './common.js'

export function exportAsPng(canvas, filename = 'qrcode.png') {
  const dataUrl = canvas.toDataURL('image/png')
  downloadFile(dataUrl, filename)
}

export function exportAsSvg(text, options = {}, filename = 'qrcode.svg') {
  const normalizedOptions = {
    ...options,
    foreground: options.foreground ? normalizeHex(options.foreground) : '#000000',
    background: options.background ? normalizeHex(options.background) : '#ffffff',
  }
  const svgString = generateSvgString(text, normalizedOptions)
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const dataUrl = URL.createObjectURL(svgBlob)
  downloadFile(dataUrl, filename)
  setTimeout(() => URL.revokeObjectURL(dataUrl), 1000)
}
