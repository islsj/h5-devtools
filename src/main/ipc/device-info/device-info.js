import createIpc from '../ipcHandler'

const ipcMain = createIpc()
export const activeDevice = {
  name: ''
}
export default function () {
  ipcMain.on('device-info', (resolve, reject, { activeDeviceName }) => {
    activeDevice.name = activeDeviceName
    resolve('ok')
  })
}
