<script setup>
import { computed, ref } from 'vue'

// eslint-disable-next-line vue/no-reserved-component-names
defineOptions({ name: 'Svg' })

const svgRef = ref()
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#474747'
  },
  size: {
    type: Number,
    default: 14
  }
})
const icons = import.meta.glob('/src/assets/icons/*.svg', { eager: true })

const getSvgUrl = () => {
  return icons[`/src/assets/icons/${props.name}.svg`]?.default || ''
}
const maskImage = computed(() => {
  return `url("${getSvgUrl()}")`
})

const modifyColor = () => {
  const svgObject = svgRef.value
  const svgDoc = svgObject.contentDocument // 获取 SVG 文档
  if (svgDoc) {
    const paths = svgDoc.querySelectorAll('path') // 选择要修改的路径
    paths.forEach((path) => {
      path.setAttribute('fill', '#19c') // 可选：修改填充颜色
    })
  }
}
</script>

<template>
  <div class="c-svg">
    <img ref="svgRef" :src="getSvgUrl()" class="c-svg-icon" @load="modifyColor" />
  </div>
</template>

<style lang="scss" scoped>
._after {
  content: '';
  background-color: v-bind(color); /* 遮罩住的部分颜色 */
  mask-image: v-bind(maskImage);
  mask-position: center;
  mask-repeat: no-repeat;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}

.c-svg:not(.g-button)::after {
  @extend ._after;
}

.g-button:active,
.g-button-icon:active {
  .c-svg::after {
    @extend ._after;
  }

  &.c-svg::after {
    @extend ._after;
  }
}

.c-svg {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.c-svg-icon {
  pointer-events: none;
  max-width: 100%;
  height: auto;
  position: relative;
  font-size: v-bind(size);
}
</style>
