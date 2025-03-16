<script setup>
// import { computed } from 'vue'
import useCanvas from '@/use/useCanvas'
import { computed } from 'vue'
import { decimalToPercent } from '@/utils/tools'

const canvas = useCanvas()

const percent = computed(() => {
  return decimalToPercent(canvas.getters.zoom.value, 0)
})
</script>

<template>
  <div class="c-zoom">
    <Svg class="c-zoom-out g-button-plain" name="ZoomLess" @click="canvas.zoomOut" />
    <Text :name="percent" class="c-zoom-to g-text" />
    <Svg class="c-zoom-in g-button-plain" name="ZoomMore" @click="canvas.zoomIn" />
    <Svg
      class="c-zoom-center-view g-button-plain"
      name="CenterView"
      @click="canvas.setIframeToCenter"
    />
  </div>
</template>

<style lang="scss" scoped>
.c-zoom {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  //text-shadow: #000 0 0 1px;

  .c-zoom-to {
    font-size: 12px;
    width: 40px;
    text-align: center;
    color: #474747;
  }
}
</style>
