import '@/assets/sass/app.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Viewer from './Viewer.vue'

const pinia = createPinia()
const app = createApp(Viewer)

app.use(pinia)

app.mount('#app')
