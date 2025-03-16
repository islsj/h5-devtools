<script setup>
import useCanvas from '@/use/useCanvas'
import { computed, nextTick, onMounted, ref } from 'vue'
import useKeyboard from '@/use/useKeyboard'

defineOptions({ name: 'Scene' })
const canvas = useCanvas()
const keyboard = useKeyboard()
const canvasRef = ref()
const windowRef = ref()

const padding = computed(() => {
  return `${0}px`
})
onMounted(async () => {
  await nextTick()
  canvas.init(canvasRef.value, {
    windowRef: windowRef.value.target,
    bindKey: 'command'
  })
})
</script>

<template>
  <div ref="canvasRef" class="c-scene" @wheel="canvas.wheelZoom">
    <Simulator ref="windowRef" class="c-scene-simulator" />
    <Mask :show="keyboard.getters.dragSimulator.pressState" />
  </div>
</template>

<style lang="scss" scoped>
.c-scene {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .c-scene-simulator {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    transform-origin: center center;
  }

  > * {
    margin: auto;
  }
}
</style>
