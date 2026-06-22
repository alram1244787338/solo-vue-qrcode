<template>
  <div class="placeholder-block">
    <div class="placeholder-preview">
      <div class="qr-placeholder">
        <svg viewBox="0 0 100 100" class="qr-placeholder-svg">
          <rect width="100" height="100" fill="#ffffff" />
          <g fill="#0f172a">
            <rect x="10" y="10" width="25" height="25" />
            <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
            <rect x="18" y="18" width="9" height="9" />
            <rect x="65" y="10" width="25" height="25" />
            <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
            <rect x="73" y="18" width="9" height="9" />
            <rect x="10" y="65" width="25" height="25" />
            <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
            <rect x="18" y="73" width="9" height="9" />
            <rect x="40" y="10" width="5" height="5" />
            <rect x="50" y="10" width="5" height="5" />
            <rect x="55" y="20" width="5" height="5" />
            <rect x="45" y="25" width="5" height="5" />
            <rect x="40" y="40" width="5" height="5" />
            <rect x="50" y="40" width="5" height="5" />
            <rect x="55" y="45" width="5" height="5" />
            <rect x="60" y="50" width="5" height="5" />
            <rect x="45" y="55" width="5" height="5" />
            <rect x="55" y="60" width="5" height="5" />
            <rect x="40" y="65" width="5" height="5" />
            <rect x="50" y="70" width="5" height="5" />
            <rect x="60" y="75" width="5" height="5" />
            <rect x="70" y="50" width="5" height="5" />
            <rect x="80" y="45" width="5" height="5" />
            <rect x="75" y="55" width="5" height="5" />
            <rect x="85" y="60" width="5" height="5" />
            <rect x="70" y="65" width="5" height="5" />
            <rect x="80" y="75" width="5" height="5" />
            <rect x="75" y="85" width="5" height="5" />
            <rect x="85" y="85" width="5" height="5" />
          </g>
        </svg>
      </div>
    </div>
    <h3 class="placeholder-title">预览区域</h3>
    <p class="placeholder-desc">此处将展示生成的二维码</p>
    <div class="export-buttons">
      <span class="export-btn">导出 PNG</span>
      <span class="export-btn">导出 SVG</span>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.placeholder-block {
  height: 100%;
  min-height: 480px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.placeholder-preview {
  width: 240px;
  height: 240px;
  padding: 20px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
}

.qr-placeholder-svg {
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

.placeholder-title {
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 8px;
}

.placeholder-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.export-buttons {
  display: flex;
  gap: 12px;
}

.export-btn {
  padding: 10px 24px;
  font-size: 13px;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
}
</style>
