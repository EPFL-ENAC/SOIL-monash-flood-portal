import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import { LocalStorageKey } from '@/utils/localStorage'
import { createI18n } from 'vue-i18n'
import { en as vuetifyEn, fr as vuetifyFr } from 'vuetify/locale'

import './assets/main.css'

const app = createApp(App)

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem(LocalStorageKey.Locale) ?? 'en',
  fallbackLocale: 'en',
  messages: {
    en: { $vuetify: vuetifyEn, ...en },
    fr: { $vuetify: vuetifyFr, ...fr }
  }
})

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')
