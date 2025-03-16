import { ipcMain } from 'electron'

export const channels = {}

function createIpc(main) {
  return {
    // 注册事件
    on(channel, listener) {
      channels[channel] = function (event, args) {
        return new Promise((resolve, reject) => {
          listener(resolve, reject, args, event)
        })
      }
      ipcMain.handle(channel, channels[channel])
    },
    // 移除事件
    off(channel) {
      if (channels[channel]) {
        ipcMain.removeListener(channel, channels[channel])
        delete channels[channel]
      }
    },
    // 注册一次性事件
    once(channel, listener) {
      ipcMain.once(channel, listener)
    }
  }
}

export default createIpc
