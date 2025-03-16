<script setup>
import useSimulator from '@/use/useSimulator'
import { computed, inject, onMounted, ref } from 'vue'
import useDevice from '@/use/useDevice'
import { getContextTag, setTagTitle } from '@/components/layout/HeaderArea/windowTabs/tabMenu'
import { querySelectorDeep } from '@/utils/shadowDom'
import deviceInfo from '@/components/base/Device/components/deviceInfo'
import AppleBar from '@/components/base/Simulator/components/AppleBar.vue'
import DeviceHeader from '@/components/base/Simulator/components/DeviceHeader.vue'

defineOptions({ name: 'Simulator' })
const device = useDevice()
const simulator = useSimulator()
const windowRef = ref()
const webviewRef = ref()
const injectWebview = window?.api?.preloadPath
const tag = getContextTag(inject('tagName'))

const deviceSize = computed(() => {
  const { width, height } = device.getActiveDeviceSize()
  //为了模拟器能通过margin：auto居中这里长宽需要减少一半
  return { width: `${width / 2}px`, height: `${height / 2}px` }
})

const screenSize = computed(() => {
  const { width, height } = device.getActiveScreenSize()
  return { width: `${width}px`, height: `${height}px` }
})

const deviceMask = computed(() => {
  return `url("#${device.getters.deviceInfo.id}")`
})

const deviceImg = computed(() => {
  return `url("${device.getActiveDeviceNormalImage()}")`
})

const isAboutBlank = computed(() => {
  return simulator.getWebviewUrl() === 'about:blank'
})

const bgColor = computed(() => {
  return isAboutBlank.value ? '#000' : '#fff'
})

const showDecoration = computed(() => {
  return !isAboutBlank.value && device.getActiveDeviceType() === 'Apple'
})

function domReady() {
  setTagTitle(webviewRef.value.getTitle(), tag)
  webviewRef.value.executeJavaScript(`
    window.api.injectWebview.useKeyboard()
    window.api.injectWebview.resetScreen()
    // const meta = document.createElement('meta');
    // meta.httpEquiv = "Content-Security-Policy";
    // meta.content = "default-src * 'unsafe-inline' 'unsafe-eval';";
    // document.head.appendChild(meta);
  `)
}

function didStopLoading() {
  simulator.setIsLoading(false)
}

function didFailLoad() {
  console.log('simulator', simulator)
  simulator.setError(true)
}

onMounted(() => {
  simulator.init(windowRef.value, {
    webviewRef: webviewRef.value
  })
})

const appleBarBottom = computed(function () {
  return `8px`
})
const deviceHeaderInfo = computed(function () {
  return device.getActiveDeviceHeaderInfo()
})

function setDeviceWhiteArea() {
  const ifame = querySelectorDeep(`iframe`, webviewRef.value.shadowRoot)
  const activeDeviceName = device.getActiveDeviceName()
  const [top, , bottom] = deviceInfo.get(activeDeviceName)['data-safe-area'].split(',')
  ifame.style.height = `calc(100% - ${top}px - ${bottom}px)`
  ifame.style.margin = `auto`
}

window?.electronApi?.ipcRenderer.on('set-device-white-area', function (event, url) {
  if (url === simulator.getWebviewUrl()) {
    setDeviceWhiteArea()
  }
})
const tagName = `id-${getContextTag(inject('tagName')).name}`
</script>

<template>
  <div ref="windowRef" class="c-simulator">
    <div class="c-simulator-device">
      <div class="c-simulator-screen">
        <DeviceHeader
          v-if="showDecoration"
          :device-name="device.getActiveDeviceName"
          :info="deviceHeaderInfo"
        />
        <webview
          :id="tagName"
          ref="webviewRef"
          :preload="injectWebview"
          :src="simulator.getWebviewUrl()"
          :useragent="device.getActiveUserAgent()"
          class="c-simulator-visual"
          nodeintegration
          @dom-ready="domReady"
          @did-stop-loading="didStopLoading"
        />
        <AppleBar v-if="showDecoration" :bottom="appleBarBottom" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 这里之所以看起写的很奇怪，是因为需要自适应画布大小, 保证模拟器在居中的位置
.c-simulator {
  width: v-bind('deviceSize.width');
  height: v-bind('deviceSize.height');
  display: flex;
  filter: drop-shadow(10px 10px 15px rgba(0, 0, 0, 0.5));
}

.c-simulator-device {
  pointer-events: none;
  position: absolute;
  top: 0%;
  bottom: 0;
  left: -50%;
  right: 0;
  width: 200%;
  height: 200%;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: v-bind(deviceImg);
  margin: auto;

  .c-simulator-screen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: v-bind('screenSize.width');
    height: v-bind('screenSize.height');
    clip-path: v-bind(deviceMask);

    .c-simulator-visual {
      width: 100%;
      height: 100%;
      pointer-events: auto;
    }
  }
}
</style>
