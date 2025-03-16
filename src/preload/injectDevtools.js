import { ipcRenderer } from 'electron'
import KeyboardJS from 'keyboardjs'
import { querySelectorDeep } from '../renderer/src/utils/shadowDom'

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

function clickSelectElement() {
  function listenerClassNameChange(targetElement, cb) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === 'class') {
          cb()
          console.log('类名发生变化！新类名：', targetElement.className)
          return
        }
      }
    })

    // 配置监听选项：监听 `attributes` 变化，专注 `class` 变化
    const config = { attributes: true, attributeFilter: ['class'] }

    // 开始监听
    if (targetElement) {
      observer.observe(targetElement, config)
    } else {
      console.log('目标元素未找到！')
    }
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const el = querySelectorDeep('.toolbar-button[aria-label^="Select an element"]')
        if (el) {
          observer.disconnect() // 发现后立即停止监听
          listenerClassNameChange(el, function () {
            ipcRenderer.invoke('devtools-click-select-element', {
              result: el.classList.contains('toolbar-state-on') ? 'ok' : 'fail'
            })
          })
          return
        }
      }
    }
  })

  // 监听整个 `document.body`，包括子元素的变化
  observer.observe(document.body, { childList: true, subtree: true })
}

export default {
  useKeyboard,
  clickSelectElement,
  querySelectorDeep
}
