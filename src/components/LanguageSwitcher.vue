<template>
  <div class="language-switcher">
    <button @click="toggleDropdown" class="switcher-button">
      <svg xmlns="http://www.w3.org/2000/svg" class="switcher-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m4 16l4-4m0 0l-4-4m4 4H3" />
      </svg>
      <span>{{ currentLanguage.name }}</span>
    </button>
    <div v-if="isOpen" class="switcher-dropdown">
      <ul>
        <li v-for="lang in languages" :key="lang.code">
          <a @click.prevent="switchLanguage(lang.code)" href="#" class="dropdown-item">{{ lang.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const isOpen = ref(false);

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
];

const currentLanguage = computed(() => languages.find(lang => lang.code === locale.value) || languages[0]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const switchLanguage = (langCode) => {
  locale.value = langCode;
  localStorage.setItem('lang', langCode); // Keep this to persist between sessions
  isOpen.value = false;
};

</script>

<style scoped>
.language-switcher {
  position: relative;
}

.switcher-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: 1px solid transparent;
  color: #c0c0c0;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0.5rem;
  border-radius: 6px;
}

.switcher-button:hover {
  color: #ffffff;
}

.switcher-icon {
  height: 20px;
  width: 20px;
}

.switcher-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: #001529;
  border: 1px solid rgba(0, 195, 255, 0.2);
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
  min-width: 120px;
  overflow: hidden;
}

.switcher-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #c0c0c0;
  transition: background-color 0.3s, color 0.3s;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: rgba(0, 195, 255, 0.1);
  color: #ffffff;
}
</style>
