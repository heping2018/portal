<script setup>
import { useThemeStore } from '../stores/themeStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const themeStore = useThemeStore();
</script>

<template>
  <button 
    class="theme-toggle" 
    @click="themeStore.toggleTheme"
    :title="themeStore.theme === 'dark' ? t('theme.switch_to_light') : t('theme.switch_to_dark')"
  >
    <span v-if="themeStore.theme === 'dark'" class="icon-sun">☀</span>
    <span v-else class="icon-moon">☾</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--accent-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
}

.theme-toggle:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: #fff;
  transform: rotate(180deg);
}

.theme-toggle svg {
  transition: transform 0.3s ease;
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

[data-theme="dark"] .theme-toggle {
  color: #00c3ff;
}

[data-theme="dark"] .theme-toggle:hover {
  background: #00c3ff;
  color: #001529;
}

[data-theme="light"] .theme-toggle {
  color: #1565c0;
}

[data-theme="light"] .theme-toggle:hover {
  background: #1565c0;
  color: #fff;
}
</style>
