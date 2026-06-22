<template>
  <div class="placeholder-block">
    <div class="placeholder-icon">📝</div>
    <h3 class="placeholder-title">输入区域</h3>
    <p class="placeholder-desc">此处将放置二维码内容输入表单</p>
    <ul class="placeholder-list">
      <li>文本 / URL 输入</li>
      <li>前景色 / 背景色</li>
      <li>尺寸设置</li>
      <li>Logo 上传</li>
    </ul>
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

.placeholder-icon {
  font-size: 56px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.placeholder-title {
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 8px;
}

.placeholder-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 28px;
}

.placeholder-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.placeholder-list li {
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 10px 20px;
  background: var(--color-bg);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
}
</style>
