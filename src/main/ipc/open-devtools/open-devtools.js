import createIpc from '../ipcHandler'
import { webContents } from 'electron'

const ipcMain = createIpc()

export default function () {
  ipcMain.on('open-devtools', (resolve, reject, { targetContentsId, devtoolsContentsId }) => {
    const target = webContents.fromId(targetContentsId)
    const devtools = webContents.fromId(devtoolsContentsId)
    target.debugger.attach('1.3')
    target.setDevToolsWebContents(devtools)
    target.openDevTools()
    resolve('ok')
  })
}
