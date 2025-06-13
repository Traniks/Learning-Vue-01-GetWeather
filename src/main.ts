import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createI18n } from 'vue-i18n'
import messages from './locales/lang.ts'
import { createPinia } from 'pinia'

const i18n = createI18n({
	locale: 'ru',
	fallbackLocale: 'en',
	messages,
})

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.mount('#app')