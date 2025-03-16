<script setup>
import { computed, onMounted, ref } from 'vue'
import { getElementAll, getElementAttributes } from '@/utils/element'
import useCanvas from '@/use/useCanvas'
import useDevice from '@/use/useDevice'
import useSimulator from '@/use/useSimulator'
import deviceInfo from '@/components/base/Device/components/deviceInfo'

const device = useDevice()
const simulator = useSimulator()
const canvas = useCanvas()

const deviceProps = computed(() => device.getters)
const PopoverRef = ref()

function click(el) {
  PopoverRef.value.showPopover(false)
  const deviceName = device.getDeviceName(el)
  const info = deviceInfo.get(deviceName)
  console.log('deviceName', deviceName)
  console.log('info', info)
  device.updateDevice.deviceInfo(info)
  simulator.getters.webviewRef.setUserAgent(device.getActiveUserAgent())
  simulator.getters.webviewRef.reload()
  canvas.setIframeToCenter()
}

onMounted(function () {
  // 安卓
  const androidlist = getElementAll('.deviceinfo-android').map(getElementAttributes)
  device.updateDevice.androidList(androidlist)
  // 苹果
  const appleList = getElementAll('.deviceinfo-apple').map(getElementAttributes)
  device.updateDevice.appleList(appleList)
})
</script>

<template>
  <Popover ref="PopoverRef" placement="top-start">
    <template #trigger>
      <div class="c-device pointer">
        <Svg :name="device.getActiveDeviceType()" class="c-device-icon" color="#737274" />
        <div class="c-device-text g-text-ellipsis">{{ device.getActiveDeviceName() }}</div>
        <Svg
          class="c-device-icon"
          color="#737274"
          name="Collapse"
          style="transform: translateY(1px)"
        />
      </div>
    </template>
    <template #panel>
      <div class="c-menu-list">
        <div class="c-menu-device-title">
          <Svg class="c-menu-device-title-icon" name="Android" />
          <div class="c-menu-device-title-text">安卓手机</div>
        </div>
        <div class="c-menu-device-list">
          <div
            v-for="item in deviceProps.androidList"
            :key="item.id"
            :class="{ 'l-active': deviceProps.deviceInfo.id === item.id }"
            class="c-menu-device-item"
            @click="click(item)"
          >
            <img :src="device.getDeviceTinyImage(item)" class="c-menu-device-img" />
            <div class="c-menu-device-text">
              {{ device.getDeviceName(item).replace(/-+/g, ' ') }}
            </div>
          </div>
        </div>
        <div class="c-menu-empty" />
        <div class="c-menu-device-title">
          <Svg class="c-menu-device-title-icon" name="Apple" />
          <div class="c-menu-device-title-text">苹果手机</div>
        </div>
        <div class="c-menu-device-list">
          <div
            v-for="item in deviceProps.appleList"
            :key="item.id"
            :class="{ 'l-active': deviceProps.deviceInfo.id === item.id }"
            class="c-menu-device-item"
            @click="click(item)"
          >
            <img :src="device.getDeviceTinyImage(item)" class="c-menu-device-img" />
            <div class="c-menu-device-text">
              {{ device.getDeviceName(item).replace(/-+/g, ' ') }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </Popover>
</template>

<style lang="scss" scoped>
.c-device {
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 4px;

  &:hover {
    background-color: #eceded;
  }

  .c-device-text {
    margin-left: 2px;
  }

  .c-device-icon {
    flex-shrink: 0;
  }
}

.c-menu-list {
  padding: 12px;
  background-color: #ffffff;
  border-radius: 4px;
  overflow: hidden;

  .c-menu-device-title {
    display: flex;
    align-items: center;

    .c-menu-device-title-text {
      margin-left: 4px;
      font-size: 12px;
    }
  }

  .c-menu-empty {
    margin-top: 16px;
  }

  .c-menu-device-list {
    margin-top: 4px;
    display: grid;
    grid-template-columns: repeat(5, 75px); /* 5列，均分 */
    gap: 6px; /* 设置列间和行间间距 */
    width: 400px; /* 设置容器宽度 */
    .c-menu-device-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid #ced3dc;
      border-radius: 4px;
      width: 76px;
      height: 70px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: var(--ev-c-background-tools);
      }

      &.l-active {
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 4px;
        border: 1px solid var(--ev-c-theme);
      }

      .c-menu-device-img {
        //width: 26px;
        height: 26px;
      }

      .c-menu-device-text {
        margin-top: 2px;
        font-size: 12px;
        line-height: 12px;
        text-align: center;
        height: 24px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
