<script setup>
import { computed } from 'vue'
import useDevice from '@/use/useDevice'

defineOptions({ name: 'ViewportSize' })
const device = useDevice()
// 解析宽高
const deviceSize = computed(() => device.getActiveDeviceSize())
</script>

<template>
  <div class="c-viewport-size">
    <Text :name="deviceSize.width" class="c-size-text" />
    <Svg class="c-size-icon" color="#737274" name="Multiply" />
    <Text :name="deviceSize.height" class="c-size-text" />
  </div>
</template>

<style lang="scss" scoped>
.c-viewport-size {
  display: flex;
  align-items: center;
  padding: 0 4px;

  .c-text {
    font-size: 12px;
    color: var(--ev-c-text);
  }
}
</style>
