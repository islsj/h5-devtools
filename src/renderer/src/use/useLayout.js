import { computed, ref, watch } from 'vue'
import {
  LEFT_LAYOUT_SIZE,
  RIGHT_LAYOUT_SIZE,
  VIEW_LAYOUT_SIZE,
  WORK_VIEW_LAYOUT_SIZE
} from '@/configs/globals'
import { cache } from '@/utils/tools'

// 定义面板默认位置
const defaultPanel = function () {
  return {
    WORK_VIEW_LAYOUT_SIZE: [70, 30, 70]
  }
}

const panel = ref(defaultPanel())

export default function () {
  // 计算属性 - 可以根据需要获取布局的相关信息
  const layoutState = computed(() => ({
    panel: panel.value
  }))

  const setPanelSize = (position, size) => {
    panel.value[position] = size
  }

  const getPanelSize = (position) => {
    return panel.value[position]
  }

  const getOriginPanelSize = (position) => {
    return defaultPanel()[position]
  }

  // 方法 - 更新面板大小
  const updatePanelSize = {
    leftSize: (size) => setPanelSize(LEFT_LAYOUT_SIZE, size),
    rightSize: (size) => setPanelSize(RIGHT_LAYOUT_SIZE, size),
    viewSize: (size) => setPanelSize(VIEW_LAYOUT_SIZE, size),
    workViewSize: (size) => setPanelSize(WORK_VIEW_LAYOUT_SIZE, size)
  }

  // 保存布局到 localStorage
  function saveLayout() {
    const layout = layoutState.value
    cache('local').setItem('layout-data', layout)
  }

  // 从 localStorage 加载布局
  function loadLayout() {
    const savedLayout = localStorage.getItem('editorLayout')
    if (savedLayout) {
      const { activeMode, panel } = JSON.parse(savedLayout)
      const layoutSizes = [
        LEFT_LAYOUT_SIZE,
        RIGHT_LAYOUT_SIZE,
        VIEW_LAYOUT_SIZE,
        WORK_VIEW_LAYOUT_SIZE
      ]

      layoutSizes.forEach((position) => {
        setPanelSize(position, panel[`${activeMode}_${position}`] || getPanelSize(position))
      })
    }
  }

  // 自动保存布局
  watch(layoutState, saveLayout, { deep: true })

  return {
    layoutState,
    updatePanelSize,
    saveLayout,
    loadLayout,
    getOriginPanelSize,
    getPanelSize
  }
}
