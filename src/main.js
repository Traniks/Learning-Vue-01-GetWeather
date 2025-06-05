import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createI18n } from 'vue-i18n'
import messages from './locales/lang.js'

const i18n = createI18n({
	locale: 'ru',
	fallbackLocale: 'en',
	messages,
})

createApp(App).use(i18n).mount('#app')