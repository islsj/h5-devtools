import useSimulator from '@/use/useSimulator'
import { computed, inject, reactive, ref, watchEffect } from 'vue'
import Gesto from 'gesto'
import { calc } from '@/utils/calc'
import { clamp } from 'lodash-es'
import { adjustWithStep, toFixedPrecision } from '@/utils/tools'
import { getContextTag } from '@/components/layout/HeaderArea/windowTabs/tabMenu'
import useDevice from '@/use/useDevice'
import useKeyboard from '@/use/useKeyboard'

// 定义画布默认数据
const defaultCanvasProps = function () {
  return {
    canvasRef: null,
    zoom: {
      value: 1,
      minValue: 0.5,
      maxValue: 1
    },
    bindKey: {
      name: null,
      pressState: false
    },
    config: {
      onChange: null
    },
    canvasXY: {
      x: 0,
      y: 0
    }
  }
}
const canvasMap = new WeakMap()

export default function () {
  const simulator = useSimulator()
  const device = useDevice()
  const keyboard = useKeyboard()
  const props = ref(getActiveProps())

  function getActiveProps() {
    const activeTag = getContextTag(inject('tagName'))
    if (!canvasMap.has(activeTag)) {
      canvasMap.set(activeTag, defaultCanvasProps())
    }
    return canvasMap.get(activeTag)
  }

  const getters = computed(() => {
    return {
      canvasRef: props.value.canvasRef,
      zoom: props.value.zoom,
      bindKey: props.value.bindKey,
      config: props.value.config,
      canvasXY: props.value.canvasXY
    }
  })

  function init(canvasRef, config = {}) {
    props.value.canvasRef = canvasRef
    props.value.bindKey.name ??= Reflect.get(config, 'bindKey')
    Object.assign(props.value.config, config)

    enableDrag()
    setIframeToCenter()
    // setBindKey()
    watchEffect(function () {
      const zoom = props.value.zoom
      const { x, y } = props.value.canvasXY
      if (typeof props.value.config?.onChange === 'function') {
        props.value.config?.onChange({ zoom, x, y })
      }
      simulator.getters.windowRef.style.transform = `translate(${-x}px,${-y}px) scale(${zoom.value}) `
    })
  }

  // 绑定按键

  // 启用画布托拽
  const enableDrag = () => {
    new Gesto(props.value.canvasRef)
      .on('dragStart', () => {
        if (!keyboard.getters.dragSimulator.pressState) return false
      })
      .on('drag', (e) => {
        const { deltaX, deltaY } = e
        // 按住键盘触发
        if (keyboard.getters.dragSimulator.pressState) {
          props.value.canvasXY.x -= deltaX
          props.value.canvasXY.y -= deltaY
        }
      })
  }

  function setIframeToCenter() {
    function calcScale(canvasWidth, canvasHeight, deviceWidth, deviceHeight) {
      const maxHeight = canvasHeight - canvasHeight / 10 // 最大允许高度
      const maxWidth = canvasWidth - canvasWidth / 10 // 最大允许宽度
      const heightRatio = maxHeight / deviceHeight // 计算根据高度缩放的比例
      const widthRatio = maxWidth / deviceWidth // 计算根据宽度缩放的比例
      const result = Math.min(heightRatio, widthRatio) // 选择最小的比例，确保同时满足宽度和高度的要求
      return Math.max(props.value.zoom.minValue, toFixedPrecision(result))
    }

    const { width, height } = props.value.canvasRef.getBoundingClientRect()
    const { width: w, height: h } = device.getActiveDeviceSize()

    props.value.zoom.value = calcScale(width, height, w, h)
    props.value.canvasXY.x = 0
    props.value.canvasXY.y = 0
  }

  function zoomOut() {
    const zoom = props.value.zoom
    zoom.value = adjustWithStep(zoom.value, 0.05, '-')
  }

  function zoomIn() {
    const zoom = props.value.zoom
    zoom.value = adjustWithStep(zoom.value, 0.05, '+')
  }

  function wheelZoom({ deltaY }) {
    const sensitivity = 0.0002 // 滚轮灵敏度
    if (deltaY > 0 || deltaY < 0) {
      const zoom = props.value.zoom
      const z = calc(-deltaY).multiply(sensitivity).add(zoom.value).result()
      zoom.value = clamp(z, 0.5, 1.5) // 限制缩放范围
    }
  }

  return reactive({
    getters,
    init,
    zoomOut,
    zoomIn,
    wheelZoom,
    setIframeToCenter
  })
}
