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
  <div v-if="showArea" class="c-view-area">
    <ViewTopToolbar />
    <ViewContent />
    <ViewBottomToolbar />
  </div>
</template>

<style lang="scss" scoped>
.c-view-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
