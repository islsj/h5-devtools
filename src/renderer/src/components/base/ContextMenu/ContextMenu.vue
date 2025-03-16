<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  menuList: {
    type: Array
  }
})

const PopoverRef = ref()
const x = ref(0)
const y = ref(0)
const curItem = ref(null)

function contextmenu(e) {
  x.value = e.clientX
  y.value = e.clientY
  PopoverRef.value.showPopover(true)
}

function handleClickOutside() {
  if (curItem.value?.disable) return
  PopoverRef.value.showPopover(false)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})

function mousedown(item) {
  curItem.value = item
}

function click(item) {
  if (item.value?.disable) return
  item.click()
}
</script>

<template>
  <div class="c-context-menu" @contextmenu="contextmenu">
    <slot />
  </div>
  <Popover ref="PopoverRef" :x="x" :y="y" placement="bottom-start" trigger="manual">
    <template #panel>
      <div class="c-context-menu-list">
        <template v-for="item in props.menuList" :key="item.id">
          <div
            v-if="item.type === 'item'"
            :class="{ 'l-disable': item.disable }"
            class="c-context-menu-item pointer"
            @click="click(item)"
            @mousedown="mousedown(item)"
          >
            <div class="c-context-menu-text">{{ item.title }}</div>
          </div>
          <div v-if="item.type === 'line'" class="c-line" />
        </template>
      </div>
    </template>
  </Popover>
</template>

<style lang="scss" scoped>
.c-context-menu {
  -webkit-app-region: no-drag;
}

.c-context-menu-list {
  padding: 4px;
  background: rgba(255, 255, 255, 1); /* 半透明背景 */
  border-radius: 4px;
  overflow: hidden;
  -webkit-app-region: no-drag;

  .c-context-menu-item {
    display: flex;
    align-items: center;
    width: 200px;
    height: 26px;

    &.l-disable {
      color: #b6c1cb;
    }

    &:not(.l-disable):hover {
      background-color: #366ceb;
      border-radius: 4px;
      overflow: hidden;
      color: #ffffff;
    }

    .c-context-menu-text {
      font-size: 12px;
      margin: 0 8px;
    }
  }

  .c-line {
    border-bottom: 1px solid #cccbd0;
    margin: 4px 8px;
  }
}
</style>
