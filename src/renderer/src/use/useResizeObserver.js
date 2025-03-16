import { onBeforeUnmount, onMounted, ref } from 'vue'

export default ({ targetRef, options, callback }) => {
  const observer = ref()

  onMounted(() => {
    if (!targetRef.value) return

    // 创建 MutationObserver 实例
    observer.value = new ResizeObserver(callback)

    // 配置观察器
    observer.value.observe(targetRef.value, options)
  })

  onBeforeUnmount(() => {
    observer.value.disconnect()
  })
}
