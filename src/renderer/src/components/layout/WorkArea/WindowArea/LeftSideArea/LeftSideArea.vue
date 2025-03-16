<script setup>
import { computed } from 'vue'

const showArea = computed(() => {
  return false
})
defineExpose({
  showArea
})
</script>
<template>
  <div v-if="showArea" class="c-left-side-area" />
</template>

<style lang="scss" scoped>
.c-left-side-area {
  background-color: #19c;
  border-radius: 8px;
  height: 100%;
  overflow: hidden;
  width: 100%;
}
</style>
