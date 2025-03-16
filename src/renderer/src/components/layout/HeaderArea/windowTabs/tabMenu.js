import { computed, reactive, ref } from 'vue'
import { cache, generateUUID } from '@/utils/tools'

export const tabLeftClickIdx = ref(-1)
export const tabRightClickIdx = ref(-1)
export const tabList = reactive([])
export const newTagTitle = ''

export const getTabNames = computed(function () {
  return tabList.map(({ name }) => name)
})

export const getActiveTag = computed(function () {
  return tabList[tabLeftClickIdx.value]
})

export function getContextTag(name) {
  return tabList.find((item) => item.name === name)
}

function clickRightAddTag() {
  tabList.splice(tabRightClickIdx.value + 1, 0, {
    title: `${newTagTitle}`,
    name: generateUUID(),
    webview: null
  })
  if (tabRightClickIdx.value < tabLeftClickIdx.value) {
    tabLeftClickIdx.value++
  }
}

function clickResetTag() {
  clickCloseTag()
  clickRightAddTag()
}

function clickMuteTag() {
  const tag = tabList[tabRightClickIdx.value]
  tag.isAudioMuted = !tag.webview.isAudioMuted()
  tag.webview.setAudioMuted(tag.isAudioMuted)
}

function clickCloseTag() {
  tabList.splice(tabRightClickIdx.value, 1)
  if (tabRightClickIdx.value < tabLeftClickIdx.value || tabRightClickIdx.value === tabList.length) {
    tabLeftClickIdx.value--
  }
}

function clickCloseRightTag() {
  tabList.splice(tabRightClickIdx.value + 1)
  tabLeftClickIdx.value = tabRightClickIdx.value
}

function clickCloseOtherTag() {
  tabList.splice(0, tabRightClickIdx.value)
  tabList.splice(1)
  tabLeftClickIdx.value = 0
}

function clickFixedTag() {
  const cachedTagList = cache('local').getItem('windowFixedTabs') || []
  const result = [...cachedTagList, tabList[tabRightClickIdx.value]]
  cache('local').setItem('windowFixedTabs', result)
}

export function setTagTitle(title, tag) {
  tag.title = title
}

export const tabMenu = reactive([
  {
    type: 'item',
    title: '在右侧新建标签页',
    click: clickRightAddTag
  },
  {
    type: 'line'
  },
  // {
  //   type: 'item',
  //   title: '重置标签页',
  //   click: clickResetTag
  // },
  {
    type: 'item',
    title: computed(function () {
      const tag = tabList[tabRightClickIdx.value]
      return tag.isAudioMuted || tag.webview?.isAudioMuted() ? '取消静音标签页' : '静音标签页'
    }),
    disable: computed(function () {
      const tag = tabList[tabRightClickIdx.value]
      return !tag.webview
    }),
    click: clickMuteTag
  },
  // {
  //   type: 'item',
  //   title: computed(function () {
  //     const curTab = tabList[tabRightClickIdx.value]
  //     const windowFixedTabs = cache('local').getItem('windowFixedTabs') || []
  //     const windowFixedTabNames = windowFixedTabs.map(({ name }) => name)
  //     const isFixedTag = windowFixedTabNames.includes(curTab.name)
  //     return isFixedTag ? '取消固定标签页' : '固定标签页'
  //   }),
  //   click: clickFixedTag
  // },
  {
    type: 'line'
  },
  {
    type: 'item',
    title: '关闭标签页',
    click: clickCloseTag
  },
  {
    type: 'item',
    title: '关闭右侧标签页',
    click: clickCloseRightTag
  },
  {
    type: 'item',
    title: '关闭其他标签页',
    click: clickCloseOtherTag
  }
])
