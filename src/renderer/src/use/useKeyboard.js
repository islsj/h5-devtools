// 定义画布默认数据
import { computed, reactive, ref } from 'vue'

const defaultKeyboardProps = function () {
  return {
    dragSimulator: {
      name: 'Meta',
      pressState: false
    }
  }
}
const props = ref(defaultKeyboardProps())

export default function () {
  const getters = computed(() => {
    return {
      dragSimulator: props.value.dragSimulator
    }
  })
  const { ipcRenderer } = window?.electronApi || {}

  function init() {
    acceptDragSimulatorKeyboardChannel()
  }

  function acceptDragSimulatorKeyboardChannel() {
    ipcRenderer?.on('drag-simulator-keyboard-channel', (event, res) => {
      const { key, type } = res
      if (key !== props.value.dragSimulator.name) return

      if (type.toLowerCase().includes('keydown')) {
        props.value.dragSimulator.pressState = true
      }
      if (type.toLowerCase().includes('keyup')) {
        props.value.dragSimulator.pressState = false
      }
    })
  }

  return reactive({
    getters,
    init
  })
}
