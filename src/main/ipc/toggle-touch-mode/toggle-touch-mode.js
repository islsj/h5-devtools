import createIpc from '../ipcHandler'
import { webContents } from 'electron'

const ipcMain = createIpc()
let container = null
export const options = {
  toggleSelectMode: 'mobile' // mobile pcs
}
export default function () {
  // 读取文件
  ipcMain.on(
    'toggle-touch-mode',
    function (resolve, reject, { targetContentsId, status: isTouchEnabled }) {
      // if (container?.isDestroyed()) return
      if (targetContentsId) {
        const curContainer = webContents.fromId(targetContentsId)
        if (curContainer) container = curContainer
      }
      if (options.toggleSelectMode === 'pc') isTouchEnabled = false
      container?.debugger.sendCommand('Emulation.setTouchEmulationEnabled', {
        enabled: isTouchEnabled,
        configuration: isTouchEnabled ? 'mobile' : undefined // 触摸模式用 'mobile'
      })
      container?.debugger.sendCommand('Emulation.setEmitTouchEventsForMouse', {
        enabled: isTouchEnabled
      })
      // resolve('ok')
    }
  )
}
