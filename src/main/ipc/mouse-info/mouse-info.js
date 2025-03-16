import { screen } from 'electron'
import { mainWindow } from '../../windows/mainWindow'

function getMousePositionInWindow(targetWindow) {
  const cursorPos = screen.getCursorScreenPoint() // 获取鼠标在屏幕的全局坐标
  const windowBounds = targetWindow?.getBounds() // 获取窗口的边界信息

  const x = cursorPos.x - windowBounds.x // 相对于窗口左上角的 X 坐标
  const y = cursorPos.y - windowBounds.y // 相对于窗口左上角的 Y 坐标

  return { x, y }
}

export default function () {
  // 计时器
  let timer = -1
  mainWindow.on('close', () => {
    clearTimeout(timer)
    timer = null
    console.log('窗口即将关闭！')
  })

  function createTimer() {
    timer = setTimeout(function () {
      if (timer === null) return null
      if (mainWindow.isFocused()) {
        const info = getMousePositionInWindow(mainWindow)
        mainWindow.webContents.send('mouse-info', info)
      }
      createTimer()
    }, 40)
  }

  createTimer()
}
