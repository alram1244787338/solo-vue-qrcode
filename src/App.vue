<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <div class="app-container">
        <div class="layout-grid">
          <aside class="panel panel-left">
            <QrForm
              :text="qrOptions.text"
              :foreground="qrOptions.foreground"
              :background="qrOptions.background"
              :size="qrOptions.size"
              :ecLevel="qrOptions.ecLevel"
              :showLogo="qrOptions.showLogo"
              @update:options="handleOptionsUpdate"
            />
          </aside>

          <section class="panel panel-right">
            <QrPreview
              ref="previewRef"
              :text="qrOptions.text"
              :foreground="qrOptions.foreground"
              :background="qrOptions.background"
              :size="qrOptions.size"
              :ecLevel="qrOptions.ecLevel"
              :showLogo="qrOptions.showLogo"
            />
          </section>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import QrForm from '@/components/QrForm.vue'
import QrPreview from '@/components/QrPreview.vue'

const previewRef = ref(null)

const qrOptions = reactive({
  text: 'https://www.feishu.cn',
  foreground: '#000000',
  background: '#ffffff',
  size: 300,
  ecLevel: 'M',
  showLogo: false,
})

function handleOptionsUpdate(options) {
  Object.assign(qrOptions, options)
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: 32px 0;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-height: 480px;
}

@media (max-width: 960px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
