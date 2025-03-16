import { computed, inject, onBeforeUnmount, reactive, ref } from 'vue'
import { getActiveTag, getContextTag } from '@/components/layout/HeaderArea/windowTabs/tabMenu'
import CustomEventManager from '@/utils/emitter'

const signal = new CustomEventManager()
// 定义webview默认数据
const defaultSimulatorProps = function () {
  return {
    windowRef: null,
    webviewRef: null,
    url: 'about:blank',
    errorUrl: 'about:blank',
    isLoading: false,
    isError: false,
    config: {}
  }
}
const simulatorMap = new WeakMap()

export default function () {
  const props = ref(getActiveProps())

  function getActiveProps() {
    const activeTag = getContextTag(inject('tagName'))
    if (!simulatorMap.has(activeTag)) {
      simulatorMap.set(activeTag, defaultSimulatorProps())
    }
    return simulatorMap.get(activeTag)
  }

  const getters = computed(() => {
    return {
      windowRef: props.value.windowRef,
      webviewRef: props.value.webviewRef,
      isLoading: props.value.isLoading,
      isError: props.value.isError,
      url: props.value.url,
      errorUrl: props.value.errorUrl
    }
  })

  function init(windowRef, config = {}) {
    getContextTag(inject('tagName')).webview = config.webviewRef
    props.value.windowRef = windowRef
    props.value.webviewRef = config.webviewRef
    Object.assign(props.value.config, config)
    signal.emit('init')
    autoToggleTouchMode()
  }

  function autoToggleTouchMode() {
    let isContinue = true
    onBeforeUnmount(function () {
      isContinue = false
    })

    function handleEvent(event, { x, y }) {
      if (isContinue) {
        window?.electronApi?.ipcRenderer.once('mouse-info', handleEvent)
      }
      const elements = document.elementsFromPoint(x, y)
      const excludeEl = elements.find((el) => {
        return el.matches('.n-popover') || el.matches('.n-auto-complete-menu')
      })
      if (excludeEl) {
        window?.electronApi?.ipcRenderer.invoke('toggle-touch-mode', {
          status: false
        })
      } else {
        const targetEl = elements.find((el) => el.matches(`#id-${getActiveTag.value.name}`))
        window?.electronApi?.ipcRenderer.invoke('toggle-touch-mode', {
          targetContentsId: targetEl?.getWebContentsId(),
          status: !!targetEl
        })
      }
    }

    window?.electronApi?.ipcRenderer.once('mouse-info', handleEvent)
  }

  function setUrl(url) {
    // 如果 URL 没有协议，默认添加 https://
    if (!/^https?:\/\//i.test(url) && url !== 'about:blank') {
      url = `http://${url}`
    }
    console.log('~~ 🐛🐛 ~~', 'url', url)
    props.value.isError = false
    props.value.url = url
  }

  function setError(status) {
    props.value.isError = status
  }

  function getWebviewUrl() {
    return props.value.isError ? props.value.errorUrl : props.value.url
  }

  function setIsLoading(status) {
    props.value.isLoading = status
  }

  function iframeForwardKeyEvent({ target }) {
    const iframeDocument = target.contentDocument || target.contentsimulator?.document

    function listener(e) {
      document.dispatchEvent(new KeyboardEvent(e.type, e)) // 将键盘事件转发到父级文档
    }

    // 给 iframe 文档添加事件监听器，捕获键盘事件并转发
    iframeDocument?.addEventListener('keydown', listener, true)
    iframeDocument?.addEventListener('keyup', listener, true)
  }

  return reactive({
    getters,
    init,
    signal,
    setUrl,
    setError,
    setIsLoading,
    getWebviewUrl
  })
}
