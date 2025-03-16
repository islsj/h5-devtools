<script setup>
import useResizeObserver from '@/use/useResizeObserver'
import { ref } from 'vue'

const isHide = ref(false)
const viewTopToolbar = ref()
useResizeObserver({
  targetRef: viewTopToolbar,
  callback: (entries) => {
    for (let entry of entries) {
      // 获取元素的新宽度
      const width = entry.contentRect.width
      isHide.value = width < 400
    }
  }
})
</script>

<template>
  <div ref="viewTopToolbar" class="c-view-top-toolbar">
    <Navigation />
    <Zoom :class="{ 'l-hide': isHide }" />
  </div>
</template>

<style lang="scss" scoped>
.c-view-top-toolbar {
  align-items: center;
  background-color: var(--ev-c-background-tools);
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-shrink: 0;
  height: 27px;
  z-index: 1;

  .l-hide {
    pointer-events: none;
    opacity: 0;
  }
}
</style>
