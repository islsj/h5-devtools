<script setup>
import { ref } from 'vue'

const PopoverRef = ref()

function click() {
  PopoverRef.value.showPopover(false)
}
</script>

<template>
  <div class="c-window-Menu">
    <Popover ref="PopoverRef">
      <template #trigger>
        <Svg class="g-button-plain pointer" color="#ffffff" name="GuiTabMenuHl" />
      </template>
      <template #panel>
        <div class="c-menu-list pointer">
          <div class="c-menu-item" @click="click">
            <Svg class="c-menu-icon" color="#366ceb" name="Plugin" />
            <div class="c-menu-text">插件</div>
            <Svg class="c-menu-arrow-icon" color="#446be3" name="ArrowLeft" />
          </div>
          <div class="c-menu-item" @click="click">
            <Svg class="c-menu-icon" color="#366ceb" name="Setting" />
            <div class="c-menu-text">设置</div>
            <Svg class="c-menu-arrow-icon" color="#446be3" name="ArrowLeft" />
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<style lang="scss" scoped>
.c-window-Menu {
  flex-shrink: 0;
  -webkit-app-region: no-drag; /* 可拖动区域 */
}

.c-menu-list {
  padding: 4px;
  background-color: #ffffff;
  border-radius: 4px;
  overflow: hidden;

  .c-menu-item {
    display: flex;
    align-items: center;
    width: 200px;
    height: 40px;

    &:hover {
      background-color: #f2f2f2;
      border-radius: 4px;
      overflow: hidden;
    }

    .c-menu-icon {
      flex-shrink: 0;
      background-color: #f4f4f6;
      padding: 6px;
      border-radius: 4px;
      overflow: hidden;
      margin-left: 8px;
    }

    .c-menu-text {
      flex-grow: 1;
      margin-left: 8px;
    }

    .c-menu-arrow-icon {
      flex-shrink: 0;
      padding: 6px;
      border-radius: 4px;
      overflow: hidden;
      margin-left: 8px;
    }
  }
}
</style>
