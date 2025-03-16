import createIpc from '../ipcHandler'

const ipcMain = createIpc()
export default function () {
  ipcMain.on('reload-page', function (resolve, reject, { pathname }) {
    resolve('ok')
  })
}
