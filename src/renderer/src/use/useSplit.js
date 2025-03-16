import { computed, onMounted, reactive, ref, watch } from 'vue'
import SplitJs from 'split.js'
import { debounce, isFunction } from 'lodash-es'

const handleResizelist = []

function handleResize() {
  handleResizelist.forEach((fn) => fn())
}

const defaultSplitProps = function () {
  return {
    isDrag: 'end',
    refs: [],
    config: {}
  }
}
// 使用 Lodash 的 debounce 设置防抖时间为 200ms
window.addEventListener('resize', debounce(handleResize, 200))
const props = ref(defaultSplitProps())

// 导出一个默认函数，接收两个参数：refs（分割元素的引用数组）和 config（Split.js 的配置）
export default () => {
  const getters = computed(() => {
    return {
      isDrag: props.value.isDrag,
      refs: props.value.refs,
      config: props.value.config
    }
  })
  const splitInstance = ref() // 创建一个响应式变量，用于存储 Split.js 实例

  function init(refs, config) {
    props.value.refs = refs
    props.value.config = config
    handleResizelist.push(resetSplit)
    // 当组件挂载时调用 createSplit 方法
    onMounted(async () => {
      watchRef()
      createSplit()
    })
  }

  // 观察Ref变化
  function watchRef() {
    // 遍历每一个引用，以便对其进行监听
    props.value.refs.forEach((refVal) => {
      watch(
        () => refVal.value.target, // 监听当前 refVal 的变化
        (newValue, oldValue) => {
          // 当 refVal 改变时触发
          if (newValue !== oldValue) {
            // 确保值发生实际变化
            // 如果存在旧的 Split.js 实例，则先销毁它
            resetSplit()
          }
        }
      )
    })
  }

  // 创建 Split.js 实例的方法
  function createSplit() {
    const list = [] // 存放所有有效的目标元素

    // 遍历 refs，将每个引用中的 target 元素添加到 list 数组
    props.value.refs.forEach((refVal) => {
      if (refVal.value.target) list.push(refVal.value.target)
    })

    // 如果没有有效的目标元素，则不继续创建
    if (list.length < 2) return
    const config = props.value.config
    const sizes = isFunction(config.sizes) ? config.sizes() : config.sizes
    const minSize = isFunction(config.minSize) ? config.minSize() : config.minSize
    const maxSize = isFunction(config.maxSize) ? config.maxSize() : config.maxSize
    const onDragStart = (...args) => {
      props.value.isDrag = 'start'
      if (isFunction(config.onDragStart)) {
        config.onDragStart(...args)
      }
    }
    const onDragEnd = (...args) => {
      props.value.isDrag = 'end'
      if (isFunction(config.onDragEnd)) {
        config.onDragEnd(...args)
      }
    }
    console.log('%csizes', 'font-size:18px', minSize, maxSize)
    // 使用目标元素列表和配置创建 Split.js 实例，并赋值给 splitInstance
    splitInstance.value = SplitJs(list, {
      ...config,
      sizes,
      minSize,
      maxSize,
      onDragStart,
      onDragEnd
    })
  }

  function resetSplit() {
    splitInstance.value?.destroy()
    splitInstance.value = null
    createSplit()
  }

  return reactive({
    getters,
    init
  })
}
