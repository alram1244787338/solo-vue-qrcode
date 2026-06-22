<template>
  <header class="app-header">
    <div class="header-container">
      <div class="brand">
        <div class="brand-logo">QR</div>
        <div class="brand-text">
          <h1 class="brand-title">二维码生成器</h1>
          <p class="brand-subtitle">QR Code Generator</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), #7c3aed);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.brand-title {
  font-size: 18px;
  color: var(--color-text);
}

.brand-subtitle {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}
</style>
