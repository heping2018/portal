
import { createI18n } from 'vue-i18n';

// Function to load all locale messages from the locales directory
function loadLocaleMessages() {
  const locales = import.meta.glob('./locales/*.json', { eager: true });
  const messages = {};
  for (const path in locales) {
    // Extract locale from path (e.g., './locales/es.json' -> 'es')
    const locale = path.split('/').pop().replace('.json', '');
    if (locale) {
      // With eager: true on JSON files, the content is the default export.
      messages[locale] = locales[path]; 
    }
  }
  return messages;
}

// Determine the initial locale from localStorage or browser settings
const initialLocale = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'en';

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: initialLocale,
  fallbackLocale: 'en', // set fallback locale
  messages: loadLocaleMessages(),
  globalInjection: true
});

export default i18n;
