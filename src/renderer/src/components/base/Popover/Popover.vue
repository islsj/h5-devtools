<script setup>
import { ref } from 'vue'

defineOptions({ name: 'Popover' })
const props = defineProps({
  trigger: {
    type: String,
    default: 'click'
  },
  x: {
    type: Number
  },
  y: {
    type: Number
  },
  placement: {
    type: String,
    default: 'bottom-end'
  }
})
const popoverRef = ref()

function showPopover(status) {
  popoverRef.value?.setShow(status)
}

const closePopover = () => {
  popoverRef.value?.setShow(false)
}
defineExpose({
  showPopover,
  closePopover
})
</script>

<template>
  <n-popover
    ref="popoverRef"
    :placement="props.placement"
    :show-arrow="false"
    :trigger="props.trigger"
    :x="props.x"
    :y="props.y"
    class="c-popover"
  >
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
    <slot name="panel"></slot>
  </n-popover>
</template>

<style lang="scss">
.c-popover {
  padding: 0 !important;
  background-color: transparent !important;
}
</style>
