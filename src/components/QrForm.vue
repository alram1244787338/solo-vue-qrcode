<template>
  <div class="form-container">
    <div class="form-header">
      <h2 class="form-title">输入内容</h2>
      <p class="form-desc">输入文本或 URL 生成二维码</p>
    </div>

    <div class="form-group">
      <label class="form-label">文本 / URL</label>
      <textarea
        v-model="localText"
        @input="emitUpdate"
        class="form-input form-textarea"
        placeholder="请输入要生成二维码的内容..."
        rows="4"
      ></textarea>
      <p class="form-hint">
        已输入 <span :class="{ 'text-danger': text.length > 500 }">{{ text.length }}</span> / 2953 字符
      </p>
    </div>

    <div class="form-row">
      <div class="form-group form-group-half">
        <label class="form-label">前景色</label>
        <div class="color-input-wrapper">
          <input
            type="color"
            v-model="localForeground"
            @input="emitUpdate"
            class="form-color-input"
          />
          <input
            type="text"
            v-model="localForeground"
            @input="emitUpdate"
            class="form-color-text"
            maxlength="7"
          />
        </div>
      </div>

      <div class="form-group form-group-half">
        <label class="form-label">背景色</label>
        <div class="color-input-wrapper">
          <input
            type="color"
            v-model="localBackground"
            @input="emitUpdate"
            class="form-color-input"
          />
          <input
            type="text"
            v-model="localBackground"
            @input="emitUpdate"
            class="form-color-text"
            maxlength="7"
          />
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">
        尺寸: <span class="size-value">{{ size }} px</span>
      </label>
      <input
        type="range"
        v-model.number="localSize"
        @input="emitUpdate"
        class="form-range"
        min="200"
        max="600"
        step="10"
      />
      <div class="range-scale">
        <span>200</span>
        <span>300</span>
        <span>400</span>
        <span>500</span>
        <span>600</span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">纠错等级</label>
      <div class="ec-levels">
        <button
          v-for="level in ecLevels"
          :key="level.value"
          @click="localEcLevel = level.value; emitUpdate()"
          :class="['ec-btn', { active: localEcLevel === level.value }]"
          type="button"
        >
          {{ level.label }}
          <span class="ec-desc">{{ level.desc }}</span>
        </button>
      </div>
    </div>

    <div class="form-group">
      <div class="switch-row">
        <label class="form-label">显示 Logo</label>
        <button
          type="button"
          @click="localShowLogo = !localShowLogo; emitUpdate()"
          :class="['switch-btn', { on: localShowLogo }]"
          :disabled="true"
        >
          <span class="switch-track">
            <span class="switch-thumb"></span>
          </span>
        </button>
      </div>
      <p class="form-hint form-hint-muted">
        Logo 上传功能将在下一版本开放
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  foreground: { type: String, default: '#000000' },
  background: { type: String, default: '#ffffff' },
  size: { type: Number, default: 300 },
  ecLevel: { type: String, default: 'M' },
  showLogo: { type: Boolean, default: false },
})

const emit = defineEmits(['update:options'])

const localText = ref(props.text)
const localForeground = ref(props.foreground)
const localBackground = ref(props.background)
const localSize = ref(props.size)
const localEcLevel = ref(props.ecLevel)
const localShowLogo = ref(props.showLogo)

const ecLevels = [
  { value: 'L', label: 'L', desc: '7%' },
  { value: 'M', label: 'M', desc: '15%' },
  { value: 'Q', label: 'Q', desc: '25%' },
  { value: 'H', label: 'H', desc: '30%' },
]

function emitUpdate() {
  emit('update:options', {
    text: localText.value,
    foreground: localForeground.value,
    background: localBackground.value,
    size: localSize.value,
    ecLevel: localEcLevel.value,
    showLogo: localShowLogo.value,
  })
}

watch(
  () => [props.text, props.foreground, props.background, props.size, props.ecLevel, props.showLogo],
  ([t, f, b, s, e, l]) => {
    localText.value = t
    localForeground.value = f
    localBackground.value = b
    localSize.value = s
    localEcLevel.value = e
    localShowLogo.value = l
  }
)
</script>

<style scoped>
.form-container {
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-header {
  margin-bottom: 8px;
}

.form-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.form-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  resize: vertical;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background: var(--color-surface);
}

.form-textarea {
  min-height: 96px;
  line-height: 1.5;
}

.form-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

.form-hint-muted {
  color: var(--color-text-muted);
  font-style: italic;
}

.text-danger {
  color: var(--color-warning);
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group-half {
  flex: 1;
}

.color-input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-color-input {
  width: 48px;
  height: 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 2px;
  cursor: pointer;
  background: var(--color-surface);
}

.form-color-text {
  flex: 1;
  padding: 10px 12px;
  font-size: 13px;
  font-family: 'SF Mono', 'Menlo', monospace;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  text-transform: uppercase;
}

.form-color-text:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background: var(--color-surface);
}

.size-value {
  color: var(--color-primary);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.form-range {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-border);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.form-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
  transition: transform 0.15s;
}

.form-range::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.form-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.4);
}

.range-scale {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 0 2px;
}

.ec-levels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ec-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.ec-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.ec-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.ec-desc {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.8;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: not-allowed;
  opacity: 0.6;
}

.switch-track {
  display: block;
  width: 44px;
  height: 24px;
  background: var(--color-border);
  border-radius: 12px;
  position: relative;
  transition: background 0.2s;
}

.switch-btn.on .switch-track {
  background: var(--color-primary);
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-btn.on .switch-thumb {
  transform: translateX(20px);
}
</style>
