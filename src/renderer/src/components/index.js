// 组件自动化全局注册
export default {
  install(app) {
    // 组件自动化全局注册
    const importComponents = import.meta.glob('./**/*.vue', { eager: true })
    // 注册组件
    for (const [path, module] of Object.entries(importComponents)) {
      const folderName = path.split('/').slice(-2, -1)[0]
      const fileName = path.split('/').pop().replace('.vue', '')

      // 检查文件夹名和文件名是否一致  组件和组件附带的icon组件
      if (folderName === fileName || folderName + 'Icon' === fileName) {
        app.component(fileName, module.default || module)
      }
    }
  }
}
