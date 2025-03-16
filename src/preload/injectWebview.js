import { ipcRenderer } from 'electron'
import KeyboardJS from 'keyboardjs'
import deviceInfo from '../renderer/src/components/base/Device/components/deviceInfo.js'

function useKeyboard() {
  KeyboardJS.bind(
    'command',
    ({ key, type }) => {
      if (key === 'Meta') {
        ipcRenderer.invoke('webview-input-event', { key, type })
        console.log(`按下 ${key} 键`)
      }
    },
    ({ key, type }) => {
      if (key === 'Meta') {
        console.log(`释放 ${key} 键`)
        ipcRenderer.invoke('webview-input-event', { key, type })
      }
    }
  )
}

function resetScreen() {
  setTimeout(() => {
    const [width, height] = deviceInfo.get('xiaomi-11i')['data-screen-size'].split('x')
    console.log('window.screen', width, height)
    Object.defineProperty(window.screen, 'width', {
      get() {
        return Number(300) // 返回 _age 的值
      }
    })
    Object.defineProperty(window.screen, 'height', {
      get() {
        return Number(400) // 返回 _age 的值
      }
    })
  }, 3000)
}

export default {
  useKeyboard,
  resetScreen
}
