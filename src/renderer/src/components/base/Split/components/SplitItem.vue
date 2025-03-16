<script setup>
import { computed, ref } from 'vue'
import useDomObserver from '@/use/useDomObserver'
import useSplit from '@/use/useSplit'

const widgetRef = ref()
const hasChild = ref(false)

const target = computed(() => {
  return hasChild.value ? widgetRef.value : null
})

useDomObserver({
  targetRef: widgetRef,
  options: { childList: true, subtree: false },
  callback: () => {
    hasChild.value = widgetRef.value.firstElementChild
  }
})
const split = useSplit()

defineExpose({ target })
</script>

<template>
  <div
    ref="widgetRef"
    :class="{ 'c-is-drag': split.getters.isDrag === 'start' }"
    class="c-split-item"
  >
    <slot ref="widgeSlot" />
  </div>
</template>

<style lang="scss" scoped>
.c-split-item {
  flex-grow: v-bind('hasChild ? 1 : 0');
  flex-basis: v-bind('hasChild ? "auto" : 0');

  &.c-is-drag {
    :deep(webview) {
      pointer-events: none !important;
    }

    :deep(iframe) {
      pointer-events: none !important;
    }
  }
}
</style>
