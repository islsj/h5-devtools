<script setup>
import { watch } from 'vue'
import {
  newTagTitle,
  tabLeftClickIdx,
  tabList,
  tabMenu,
  tabRightClickIdx
} from '@/components/layout/HeaderArea/windowTabs/tabMenu'
import { generateUUID } from '@/utils/tools'

watch(
  tabList,
  function (nVal) {
    if (nVal.length < 1) {
      clickAdd()
    }
  },
  {
    immediate: true
  }
)

function clickClose(idx) {
  tabList.splice(idx, 1)
  if (idx < tabLeftClickIdx.value || idx === tabList.length) {
    tabLeftClickIdx.value--
  }
}

function clickAdd() {
  tabLeftClickIdx.value = tabLeftClickIdx.value + 1
  tabList.splice(tabLeftClickIdx.value, 0, {
    title: `${newTagTitle}`,
    name: generateUUID(),
    webview: null
  })
}
</script>

<template>
  <div class="c-window-tabs">
    <ContextMenu :menu-list="tabMenu">
      <div class="c-window-tabs-list">
        <n-button
          v-for="(item, idx) in tabList"
          :key="item.name"
          :class="{ 'l-active': tabLeftClickIdx === idx }"
          :quaternary="tabLeftClickIdx !== idx"
          class="c-tag"
          color="#ffffff"
          icon-placement="right"
          size="small"
          @click="tabLeftClickIdx = idx"
          @contextmenu="tabRightClickIdx = idx"
        >
          {{ item.title }}
          <template #icon>
            <Svg
              v-if="!item.fixed"
              :color="tabLeftClickIdx === idx ? '#1b1b15' : '#ffffff'"
              class="g-button-plain pointer"
              name="GuiClose"
              @click.stop="clickClose(idx)"
            />
          </template>
        </n-button>
      </div>
    </ContextMenu>
    <Svg class="g-button-plain pointer c-add-btn" color="#ffffff" name="Add" @click="clickAdd" />
  </div>
</template>

<style lang="scss" scoped>
.c-window-tabs {
  flex-grow: 1;
  margin-left: 80px;
  display: flex;
  align-items: center;

  .c-window-tabs-list {
    max-width: calc(100vw - 80px - 44px);
    overflow-x: scroll;
    display: flex;
    align-items: center;

    .c-tag {
      font-size: 12px;
      font-weight: 900 !important;
      color: #ffffff;
      width: 150px;
      min-width: 75px;
      display: flex;
      justify-content: space-between;
      flex-shrink: 1;

      :deep(.n-button__content) {
        @extend .g-text-ellipsis;
        display: block;
      }

      & + button {
        margin-left: 8px;
      }

      &.l-active {
        color: #1b1b15;
        box-shadow: // 主阴影
          0px 4px 6px rgba(0, 0, 0, 0.1),
          // 细腻阴影
          0px 1px 3px rgba(0, 0, 0, 0.05);
      }
    }
  }

  .c-add-btn {
    -webkit-app-region: no-drag;
  }
}
</style>
