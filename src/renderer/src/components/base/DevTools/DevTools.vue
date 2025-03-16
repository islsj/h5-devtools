<script setup>
import { ref } from 'vue'
import useSimulator from '@/use/useSimulator'
import { emittedOnce } from '@/utils/tools'

defineOptions({ name: 'DevTools' })

const devtoolsRef = ref()
const simulator = useSimulator()
const isLoading = ref(true)
const devtoolsView = ref('')
const injectWebview = window?.api?.preloadPath

function didFinishLoad() {
  isLoading.value = false
}

simulator.signal.once('init', async function () {
  const browserView = simulator.getters.webviewRef
  const devtoolsView = devtoolsRef.value

  await emittedOnce(browserView, 'dom-ready')
  devtoolsView.src = `devtools://devtools/bundled/devtools_app.html`

  await emittedOnce(devtoolsView, 'dom-ready')
  await window.electronApi?.ipcRenderer.invoke('open-devtools', {
    targetContentsId: browserView.getWebContentsId(),
    devtoolsContentsId: devtoolsView.getWebContentsId()
  })
  console.log('~~ 🚀🚀 ~~', '准备就绪！！！')
})

function domReady() {
  devtoolsRef.value.executeJavaScript(`
    window.api.injectDevtools.clickSelectElement()
    window.api.injectDevtools.useKeyboard()
  `)
}
</script>

<template>
  <n-spin :show="isLoading" class="c-dev-tools" content-class="c-loading">
    <Transition name="fade">
      <webview
        v-show="!isLoading"
        ref="devtoolsRef"
        :preload="injectWebview"
        :src="devtoolsView"
        allowpopups
        class="c-devtools"
        nodeintegration
        websecurity="false"
        @dom-ready="domReady"
        @did-finish-load="didFinishLoad"
      />
    </Transition>
  </n-spin>
</template>

<style lang="scss" scoped>
.c-dev-tools {
  height: 100%;
  pointer-events: none;

  :deep(.c-loading) {
    height: 100%;

    .c-devtools {
      pointer-events: auto;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
