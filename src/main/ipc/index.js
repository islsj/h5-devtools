export default function () {
  // 组件自动化注册ipc
  const importComponents = import.meta.glob('./**/*.js', { eager: true })
  // 注册组件
  for (const [path, module] of Object.entries(importComponents)) {
    const folderName = path.split('/').slice(-2, -1)[0]
    const fileName = path.split('/').pop().replace('.js', '')

    // 检查文件夹名和文件名是否一致  组件和组件附带的icon组件
    if (folderName === fileName) {
      ;(module.default || module)()
    }
  }
}
