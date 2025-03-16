import createIpc from '../ipcHandler'
import { mainWindow } from '../../windows/mainWindow'

const ipcMain = createIpc()

// 拖拽模拟器事件
function dargSimulatorKeyboardEvent() {
  // input-event是系统事件,接收来自主视图的型号
  mainWindow.webContents.on('input-event', (event, input) => {
    const { isAutoRepeat, key } = input
    if (isAutoRepeat || !key) return
    mainWindow.webContents.send('drag-simulator-keyboard-channel', input)
  })
  // keyboard-event是自定义事件，接收来webview的型号
  ipcMain.on('webview-input-event', function (resolve, reject, e) {
    mainWindow.webContents.send('drag-simulator-keyboard-channel', e)
  })
}

export default function () {
  dargSimulatorKeyboardEvent()
}
