import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin({
      include: [
        'src/preload/index2.js'   // 第一个预渲染脚本
        // 'src/preload/injectWebview.js'    // 第二个预渲染脚本
      ]
    })]
  },
  renderer: {
    base: '/ztoH5Editor/',  // 设置基础路径为 /ztoH5Editor
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src'),
        '@main': resolve(__dirname, 'src/main'),
        '@img': resolve(__dirname, 'src/renderer/src/assets/images'),
        '@icon': resolve(__dirname, 'src/renderer/src/assets/icons'),
        '@styles': resolve(__dirname, 'src/renderer/src/styles'),
        '@resources': resolve(__dirname, 'resources')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or 'modern'
          additionalData: `@use '@styles/main.scss' as *;`
        }
      }
    },
    plugins: [vue(), vueJsx()]
  }
})
