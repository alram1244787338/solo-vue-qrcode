<template>
  <div class="preview-container">
    <div class="preview-header">
      <h2 class="preview-title">二维码预览</h2>
      <p class="preview-desc">实时预览，扫码可访问</p>
    </div>

    <div class="preview-wrapper" :style="{ background: background }">
      <canvas
        ref="canvasRef"
        class="qr-canvas"
        :style="{ display: hasContent ? 'block' : 'none' }"
      ></canvas>
      <div v-if="!hasContent" class="empty-state">
        <div class="empty-icon">📷</div>
        <p class="empty-text">请在左侧输入内容</p>
      </div>
    </div>

    <div v-if="hasContent" class="export-section">
      <button
        @click="handleExportPng"
        class="export-btn export-btn-primary"
        type="button"
      >
        <span class="btn-icon">⬇️</span>
        导出 PNG
      </button>
      <button
        @click="handleExportSvg"
        class="export-btn export-btn-secondary"
        type="button"
      >
        <span class="btn-icon">📄</span>
        导出 SVG
      </button>
    </div>

    <div v-if="hasContent" class="info-panel">
      <div class="info-item">
        <span class="info-label">尺寸</span>
        <span class="info-value">{{ canvasSize }} × {{ canvasSize }} px</span>
      </div>
      <div class="info-item">
        <span class="info-label">纠错等级</span>
        <span class="info-value">Level {{ ecLevel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { drawQrToCanvas } from '@/utils/qrcode'
import { exportAsPng, exportAsSvg } from '@/utils/export'
import { validateQrContent } from '@/utils/common'

const props = defineProps({
  text: { type: String, default: '' },
  foreground: { type: String, default: '#000000' },
  background: { type: String, default: '#ffffff' },
  size: { type: Number, default: 300 },
  ecLevel: { type: String, default: 'M' },
  showLogo: { type: Boolean, default: false },
})

const canvasRef = ref(null)
const canvasSize = ref(0)

const hasContent = computed(() => {
  return validateQrContent(props.text).valid
})

function renderQr() {
  if (!canvasRef.value) return
  if (!hasContent.value) return

  try {
    const result = drawQrToCanvas(canvasRef.value, props.text, {
      size: props.size,
      foreground: props.foreground,
      background: props.background,
      margin: 4,
      ecLevel: props.ecLevel,
    })
    canvasSize.value = result.actualSize
  } catch (e) {
    console.error('QR render error:', e)
  }
}

function handleExportPng() {
  if (!canvasRef.value) return
  exportAsPng(canvasRef.value, `qrcode-${Date.now()}.png`)
}

function handleExportSvg() {
  exportAsSvg(
    props.text,
    {
      size: props.size,
      foreground: props.foreground,
      background: props.background,
      margin: 4,
      ecLevel: props.ecLevel,
    },
    `qrcode-${Date.now()}.svg`
  )
}

watch(
  () => [props.text, props.foreground, props.background, props.size, props.ecLevel],
  async () => {
    await nextTick()
    renderQr()
  },
  { immediate: true }
)

defineExpose({
  getCanvas: () => canvasRef.value,
})
</script>

<style scoped>
.preview-container {
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-header {
  margin-bottom: 8px;
}

.preview-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.preview-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.preview-wrapper {
  flex: 1;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 24px;
  transition: background 0.2s;
}

.qr-canvas {
  max-width: 100%;
  max-height: 360px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-sm);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 64px;
  opacity: 0.4;
}

.empty-text {
  font-size: 14px;
}

.export-section {
  display: flex;
  gap: 12px;
}

.export-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  transition: all 0.2s;
}

.export-btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.export-btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.export-btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border);
}

.export-btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(79, 70, 229, 0.04);
}

.btn-icon {
  font-size: 16px;
}

.info-panel {
  display: flex;
  gap: 24px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}
</style>
