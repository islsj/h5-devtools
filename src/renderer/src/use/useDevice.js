import { computed, inject, reactive, ref, watch } from 'vue'
import { capitalize } from 'lodash-es'
import { getContextTag } from '@/components/layout/HeaderArea/windowTabs/tabMenu'
import deviceInfo from '@/components/base/Device/components/deviceInfo'

// 定义仿真器默认数据
const defaultDeviceProps = function () {
  return {
    deviceInfo: deviceInfo.get('iphone-13-mini'),
    androidList: [],
    appleList: [],
    deviceList: []
  }
}

const deviceMap = new WeakMap()

const tinyImages = import.meta.glob('@/components/base/Device/img/tiny/*.png', { eager: true })
const normalImages = import.meta.glob('@/components/base/Device/img/normal/*.png', { eager: true })

export default function () {
  const props = ref(getActiveProps())

  function getActiveProps() {
    const activeTag = getContextTag(inject('tagName'))
    if (!deviceMap.has(activeTag)) {
      deviceMap.set(activeTag, defaultDeviceProps())
    }
    return deviceMap.get(activeTag)
  }

  // 计算属性 - 可以根据需要获取布局的相关信息
  const getters = computed(() => ({
    deviceInfo: props.value.deviceInfo,
    androidList: props.value.androidList,
    appleList: props.value.appleList
  }))

  watch(
    () => props.value.deviceInfo,
    function () {
      window.electronApi?.ipcRenderer.invoke('device-info', {
        activeDeviceName: getActiveDeviceName()
      })
    },
    {
      immediate: true
    }
  )

  function getActiveUserAgent() {
    return props.value.deviceInfo['data-user-agent']
  }

  function getActiveDeviceSize() {
    const info = props.value.deviceInfo
    const [width, height] = info['data-device-size'].split('x')
    return { width, height }
  }

  function getActiveScreenSize() {
    const info = props.value.deviceInfo
    const [width, height] = info['data-screen-size'].split('x')
    return { width, height }
  }

  function getActiveDeviceName() {
    const info = props.value.deviceInfo
    return info.id.replace(/-mask/g, '')
  }

  function getActiveDeviceTinyImage() {
    const name = getActiveDeviceName()
    return tinyImages[`/src/components/base/Device/img/tiny/${name}-tiny.png`]?.default || ''
  }

  function getActiveDeviceNormalImage() {
    const name = getActiveDeviceName()
    return normalImages[`/src/components/base/Device/img/normal/${name}.png`]?.default || ''
  }

  function getActiveDeviceHeaderInfo() {
    const info = props.value.deviceInfo
    return info['data-device-header-info']
  }

  function getActiveDeviceType() {
    const info = props.value.deviceInfo
    return capitalize(info.class.replace(/deviceinfo-/g, ''))
  }

  function getDeviceName(el) {
    return el.id.replace(/-mask/g, '')
  }

  function getDeviceTinyImage(el) {
    const name = getDeviceName(el)
    return tinyImages[`/src/components/base/Device/img/tiny/${name}-tiny.png`]?.default || ''
  }

  function getDeviceNormalImage(el) {
    const name = getDeviceName(el)
    return normalImages[`/src/components/base/Device/img/normal/${name}.png`]?.default || ''
  }

  function getDeviceType(el) {
    return capitalize(el.class.replace(/deviceinfo-/g, ''))
  }

  function setDeviceInfo(el) {
    props.value.deviceInfo = el
  }

  function setAndroidList(list) {
    props.value.androidList = list
  }

  function setAppleList(list) {
    props.value.appleList = list
  }

  // 方法 - 更新面板大小
  const updateDevice = {
    deviceInfo: (el) => setDeviceInfo(el),
    androidList: (list) => setAndroidList(list),
    appleList: (list) => setAppleList(list)
  }

  // 保存布局到 localStorage
  function saveLayout() {
    // const layout = layoutState.value
    // cache('local').setItem('layout-data', layout)
  }

  // 从 localStorage 加载布局
  function loadLayout() {
    // const savedLayout = localStorage.getItem('editorLayout')
    // if (savedLayout) {
    //   const { activeMode, panel } = JSON.parse(savedLayout)
    //   const layoutSizes = [
    //     LEFT_LAYOUT_SIZE,
    //     RIGHT_LAYOUT_SIZE,
    //     VIEW_LAYOUT_SIZE,
    //     WORK_VIEW_LAYOUT_SIZE
    //   ]
    //
    //   layoutSizes.forEach((position) => {
    //     setPanelSize(position, panel[`${activeMode}_${position}`] || getPanelSize(position))
    //   })
    // }
  }

  // 自动保存布局
  // watch(layoutState, saveLayout, { deep: true })

  return reactive({
    getters,
    getActiveUserAgent,
    getActiveDeviceSize,
    getActiveScreenSize,
    getActiveDeviceName,
    getActiveDeviceTinyImage,
    getActiveDeviceNormalImage,
    getActiveDeviceType,
    getActiveDeviceHeaderInfo,
    getDeviceName,
    getDeviceTinyImage,
    getDeviceNormalImage,
    getDeviceType,
    updateDevice,
    saveLayout,
    loadLayout
  })
}
