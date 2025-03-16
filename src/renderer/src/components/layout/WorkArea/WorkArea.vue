<script lang="jsx" setup>
import { getActiveTag, getTabNames } from '@/components/layout/HeaderArea/windowTabs/tabMenu'
import DeviceInfo from '@/components/base/Device/components/DeviceInfo.vue'
</script>

<template>
  <view class="c-work-area">
    <DeviceInfo />
    <WindowArea
      v-for="name in getTabNames"
      :key="name"
      :class="{ 'c-hidden': getActiveTag.name !== name }"
      :data-getActiveTag-name="getActiveTag.name"
      :data-name="name"
      :tag-name="name"
    />
  </view>
</template>

<style lang="scss" scoped>
.c-work-area {
  position: relative;
  flex-grow: 1;

  .c-hidden {
    pointer-events: none;
    visibility: hidden;
  }
}
</style>
