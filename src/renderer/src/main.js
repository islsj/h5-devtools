import '@/styles/reset.scss'
import '@/styles/base.scss'

import { createApp } from 'vue'
import App from './App.vue'
import naiveUI from 'naive-ui'
import customComponents from '@/components'
import useKeyboard from '@/use/useKeyboard'

const app = createApp(App)
app.config.compilerOptions.isCustomElement = (tag) => tag === 'webview'
useKeyboard().init()
// use
app.use(naiveUI)
app.use(customComponents)

// 阻止默认的右键菜单显示
document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})

// 挂载
app.mount('#app')
