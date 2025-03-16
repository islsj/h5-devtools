<script lang="jsx" setup>
import { ref, watch } from 'vue'
import useSimulator from '@/use/useSimulator'
import useHistoryUrl from '@/use/useHistoryUrl'

const simulator = useSimulator()
const historyUrl = useHistoryUrl()
const canGoBack = ref(false)
const canGoForward = ref(false)
const webviewUrl = ref(simulator.getters.url || '')
const hasSelect = ref(false)

simulator.signal.once('init', function () {
  const { webviewRef } = simulator.getters
  webviewRef?.addEventListener('did-navigate', function (e) {
    simulator.setIsLoading(true)
    webviewUrl.value = e.url
    updateBtnStyle()
  })
  webviewRef?.addEventListener('did-navigate-in-page', function (e) {
    simulator.setIsLoading(true)
    webviewUrl.value = e.url
    updateBtnStyle()
  })
})

watch(webviewUrl, function () {
  if (hasSelect.value) {
    hasSelect.value = false
    reload()
  }
})

function updateBtnStyle() {
  canGoBack.value = simulator.getters.webviewRef?.canGoBack() // 更新能否后退的状态
  canGoForward.value = simulator.getters.webviewRef?.canGoForward() // 更新能否后退的状态
}

function goBack() {
  simulator.getters.webviewRef.goBack()
}

function goForward() {
  simulator.getters.webviewRef.goForward()
}

function activeColor(isActive) {
  return isActive ? 'var(--ev-c-text)' : 'var(--ev-c-text-soft)'
}

function updateWebviewUrl() {
  simulator.setIsLoading(true)
  if (webviewUrl.value) {
    simulator.setUrl(webviewUrl.value)
    historyUrl.cacheHistoryUrl(webviewUrl.value)
  }
  webviewUrl.value = simulator.getters.url
}

function reload() {
  const curUrl = simulator.getters.webviewRef.getURL()
  const { pathname } = new URL(curUrl)
  window.electronApi?.ipcRenderer.invoke('reload-page', { pathname })
  simulator.getters.webviewRef.clearHistory()
  simulator.getters.webviewRef.reload()
  updateBtnStyle()
  updateWebviewUrl()
}

function select() {
  hasSelect.value = true
}

const renderLabel = (option) => {
  function click(e) {
    e.stopPropagation()
    historyUrl.removeHistoryUrl(option.label)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '30px'
      }}
    >
      <div style={{ 'flex-grow': 1 }} class="g-text-ellipsis ">
        {option.label}
      </div>
      <Svg
        style={{ 'flex-grow': 0 }}
        class="c-navigation-item g-button-plain"
        name="GuiClose"
        onClick={click}
      />
    </div>
  )
}
</script>

<template>
  <div ref="targetRef" class="c-navigation-wrap">
    <Svg
      :class="{ 'g-disable': !canGoBack }"
      :color="activeColor(canGoBack)"
      class="c-navigation-item g-button-plain"
      name="ArrowLeft"
      @click="goBack"
    />
    <Svg
      :class="{ 'g-disable': !canGoForward }"
      :color="activeColor(canGoForward)"
      class="c-navigation-item g-button-plain"
      name="ArrowRight"
      @click="goForward"
    />
    <n-spin
      :show="simulator.getters.isLoading"
      :stroke-width="15"
      class="c-loading-wrap"
      content-class="c-loading"
      size="small"
    >
      <Svg class="c-navigation-item g-button-plain" name="Reload" @click="reload" />
    </n-spin>
    <AutoComplete
      v-model:value.trim="webviewUrl"
      :input-props="{
        type: 'text'
      }"
      :menu-props="{
        style: {
          '--n-option-height': 'var(--n-height)'
        }
      }"
      :render-label="renderLabel"
      class="c-input-url"
      placeholder="请输入网址"
      size="tiny"
      @select="select"
      @keydown.enter="reload"
    />
  </div>
</template>

<style lang="scss" scoped>
.c-navigation-wrap {
  flex-grow: 1;
  display: flex;
  align-items: center;

  .c-navigation-item {
    flex-shrink: 0;
  }

  .c-input-url {
    min-width: 180px;
    flex-grow: 1;
    margin: 0 8px 0 6px;

    :deep(.v-vl-items) {
      min-height: var(--n-height);
    }
  }

  .c-loading-wrap {
    transition: 0.3s;
    transform: v-bind("simulator.getters.isLoading ? 'scale(0.5)' : 'scale(0.8)'");
    pointer-events: none;

    :deep(.c-loading) {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
