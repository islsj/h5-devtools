import { computed, inject, reactive, ref } from 'vue'
import CustomEventManager from '@/utils/emitter'
import { cache } from '@/utils/tools'
import { getContextTag } from '@/components/layout/HeaderArea/windowTabs/tabMenu'

const signal = new CustomEventManager()
const whiteList = ['about:blank']
// 定义webview默认数据
const defaultHistoryUrlProps = function () {
  return {
    urls: cache('local').getItem('history-url') || []
  }
}
const simulatorMap = new WeakMap()

export default function () {
  const props = ref(getActiveProps())

  function getActiveProps() {
    const activeTag = getContextTag(inject('tagName'))
    if (!simulatorMap.has(activeTag)) {
      simulatorMap.set(activeTag, defaultHistoryUrlProps())
    }
    return simulatorMap.get(activeTag)
  }

  const getters = computed(() => {
    return {
      urls: props.value.urls
    }
  })

  function init(windowRef, config = {}) {}

  function cacheHistoryUrl(webviewUrl) {
    if (whiteList.includes(webviewUrl)) return
    const list = [...props.value.urls]
    list.unshift(webviewUrl)
    props.value.urls = [...new Set(list)]
    cache('local').setItem('history-url', props.value.urls)
  }

  function removeHistoryUrl(curUrl) {
    const list = props.value.urls
    const idx = list.findIndex((url) => url === curUrl)
    list.splice(idx, 1)
    cache('local').setItem('history-url', list)
  }

  return reactive({
    getters,
    init,
    cacheHistoryUrl,
    removeHistoryUrl,
    whiteList
  })
}
