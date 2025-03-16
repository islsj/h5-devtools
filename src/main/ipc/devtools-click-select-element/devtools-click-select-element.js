import createIpc from '../ipcHandler'
import { options } from '../toggle-touch-mode/toggle-touch-mode'

const ipcMain = createIpc()
export default function () {
  ipcMain.on('devtools-click-select-element', function (resolve, reject, { result }) {
    if (result === 'ok') {
      options.toggleSelectMode = 'pc'
    } else {
      options.toggleSelectMode = 'mobile'
    }

    resolve('ok')
  })
}
