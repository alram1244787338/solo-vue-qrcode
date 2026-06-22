import { generateSvgString } from './qrcode'
import { downloadFile } from './common'

export function exportAsPng(canvas, filename = 'qrcode.png') {
  const dataUrl = canvas.toDataURL('image/png')
  downloadFile(dataUrl, filename)
}

export function exportAsSvg(text, options = {}, filename = 'qrcode.svg') {
  const svgString = generateSvgString(text, options)
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const dataUrl = URL.createObjectURL(svgBlob)
  downloadFile(dataUrl, filename)
  setTimeout(() => URL.revokeObjectURL(dataUrl), 1000)
}
