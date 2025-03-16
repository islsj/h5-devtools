<script setup>
import { computed } from 'vue'

const showArea = computed(() => {
  return true
})
defineExpose({
  showArea
})
</script>
<template>
  <div v-if="showArea" class="c-right-side-area">
    <DevTools />
  </div>
</template>

<style lang="scss" scoped>
.c-right-side-area {
  background-color: var(--ev-c-background-canvas);
  border-radius: 8px;
  height: 100%;
  overflow: hidden;
  width: 100%;
}
</style>
