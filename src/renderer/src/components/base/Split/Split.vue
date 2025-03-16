<script setup>
import SplitItem from './components/SplitItem.vue'
import { computed, ref, useSlots } from 'vue'
import useSplit from '@/use/useSplit'

defineOptions({ name: 'Split' })
const refs = [] // 用于存储所有的refs

// 设置动态ref
const setRef = (el) => {
  if (el) refs.push(ref(el)) // 将每个元素的ref保存在数组中
}

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})
const flexDirection = ref(props.config.direction === 'vertical' ? 'column' : 'row')

const slots = useSlots()
const slotContent = computed(() => {
  if (slots.default) {
    return slots.default().filter((item) => item.shapeFlag !== 8)
  }
  return []
})
const split = useSplit()
split.init(refs, props.config)
</script>

<template>
  <div class="c-split">
    <SplitItem
      v-for="(node, index) in slotContent"
      :key="index"
      :ref="(el) => setRef(el)"
      :data-sizes="props.config.sizes[index]"
    >
      <component :is="node" />
    </SplitItem>
  </div>
</template>
<style lang="scss">
//布局分割线
.gutter {
  position: relative;

  &.gutter-horizontal {
    cursor: col-resize;

    &::before {
      background-color: var(--ev-c-theme);
      height: 60px;
      width: 2px;
    }
  }

  &.gutter-vertical {
    cursor: row-resize;

    &::before {
      background-color: var(--ev-c-theme);
      height: 2px;
      width: 60px;
    }
  }

  &::before {
    border-radius: 4px;
    bottom: 0;
    content: '';
    left: 0;
    margin: auto;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  &:hover::before {
    opacity: 1;
  }
}
</style>
<style lang="scss" scoped>
.c-split {
  display: flex;
  flex-direction: v-bind(flexDirection);
  flex-grow: 1;
}
</style>
