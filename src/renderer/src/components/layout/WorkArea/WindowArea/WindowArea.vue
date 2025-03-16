<script setup>
import useLayout from '@/use/useLayout'
import { provide, ref } from 'vue'
import { WORK_VIEW_LAYOUT_SIZE } from '@/configs/globals'
import { calc } from '@/utils/calc'
import { clamp } from 'lodash-es'

const layout = useLayout()
layout.loadLayout()

const props = defineProps({
  tagName: {
    type: String,
    required: true
  }
})
provide('tagName', props.tagName)

const viewAreaIdx = 1
const splitItemRefs = [] // 用于存储所有的refs
function setRef(el) {
  splitItemRefs.push(ref(el))
}

function calcSize() {
  const w = window.innerWidth
  const minSize = w * 0.2 < 200 ? 250 : w * 0.2
  const maxSize = window.innerWidth - minSize
  return {
    minSize,
    maxSize
  }
}

const MAX_SIZE = 100 // 100表示100%
const splitConfig = {
  sizes() {
    const MAX_RATIO = 1.5 // 比例
    const MIN_RATIO = 0.5 // 比例
    const sizes = layout.getPanelSize(WORK_VIEW_LAYOUT_SIZE)
    // 根据 splitItemRefs 是否显示区域计算 newSizes
    const newSizes = sizes.map((size, idx) => {
      // 如果是ViewArea组件 暂不分配尺寸
      if (idx === viewAreaIdx) return 0
      const max = calc(size).multiply(MAX_RATIO).result()
      const min = calc(size).multiply(MIN_RATIO).result()
      return splitItemRefs[idx]?.value?.showArea ? clamp(size, min, max) : 0
    })
    // 计算已分配的大小总和
    const sum = newSizes.reduce((s, n) => calc(s).add(n).result(), 0)
    // 将剩余大小给ViewArea组件
    newSizes[viewAreaIdx] = calc(MAX_SIZE).subtract(sum).result()
    // 过滤出显示区域的尺寸
    return newSizes.filter((_item, idx) => splitItemRefs[idx]?.value?.showArea)
  },
  minSize: () => calcSize().minSize,
  maxSize: () => calcSize().maxSize,
  snapOffset: 0,
  gutterSize: 4,
  onDragEnd(sizes) {
    const originSizes = layout.getOriginPanelSize(WORK_VIEW_LAYOUT_SIZE)
    const newSizes = []
    newSizes[0] = splitItemRefs[0].value.showArea ? sizes.shift() : 0
    if (splitItemRefs[viewAreaIdx].value.showArea) sizes.shift()
    newSizes[2] = splitItemRefs[2].value.showArea ? sizes.shift() : 0

    const sum = newSizes.reduce((s, n) => calc(s).add(n).result(), 0)
    newSizes[viewAreaIdx] = calc(MAX_SIZE).subtract(sum).result()

    layout.updatePanelSize.workViewSize(
      newSizes.map((size, idx) => (size === 0 ? originSizes[idx] : size))
    )
  }
}
</script>

<template>
  <Split :config="splitConfig" class="c-winodw-area">
    <LeftSideArea :ref="setRef" />
    <ViewArea :ref="setRef" />
    <RightSideArea :ref="setRef" />
  </Split>
</template>

<style lang="scss" scoped>
.c-winodw-area {
  border: 4px solid transparent;
  flex-grow: 1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
