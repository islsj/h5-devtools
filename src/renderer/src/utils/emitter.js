class CustomEventManager {
  constructor() {
    this.eventTarget = document.createDocumentFragment() // 使用 DocumentFragment 作为事件目标
  }

  // 创建自定义事件
  createEvent(eventName, detail = {}) {
    return new CustomEvent(eventName, { detail })
  }

  // 监听自定义事件
  on(eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback)
  }

  // 监听自定义事件（仅触发一次）
  once(eventName, callback) {
    const onceCallback = (event) => {
      callback(event)
      this.off(eventName, onceCallback)
    }
    this.on(eventName, onceCallback)
  }

  // 触发自定义事件
  emit(eventName, detail = {}) {
    const event = this.createEvent(eventName, detail)
    this.eventTarget.dispatchEvent(event)
  }

  // 解绑自定义事件
  off(eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback)
  }
}

export default CustomEventManager
