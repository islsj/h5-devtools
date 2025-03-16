import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import createMainWindow from './windows/mainWindow'
import registerIpc from './ipc'
import registerProtocol from './protocol'
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  VUEJS_DEVTOOLS
} from 'electron-devtools-installer'

function installDevtoolsExtends() {
  installExtension([VUEJS_DEVTOOLS, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
    .then((ext) => console.log(`Added Extension:  ${ext.name}`))
    .catch((err) => console.log('An error occurred: ', err))
}

app.on('ready', async () => {
  // 为 Windows 设置应用的用户模型 ID
  // 设置 Windows 应用的用户模型 ID。对于 Windows 系统，用户模型 ID 是通知和任务栏功能正常工作的必要条件。
  // 如果不设置，在 Windows 上可能会遇到无法显示通知或任务栏图标行为异常的问题。
  electronApp.setAppUserModelId('com.editor.h5.cube')

  // const proxyServerInfo = await proxyServer.start()

  // 主题
  // 亮蓝baseline-default  暗灰baseline-grayscale
  // nativeTheme.themeSource = 'dark'
  // 插件
  installDevtoolsExtends()
  // 创建主窗口
  createMainWindow()
  // 通信
  registerIpc()
  // 协议
  registerProtocol()
})

// 在开发模式下默认通过 F12 打开或关闭开发者工具，
// 在生产模式下忽略 CommandOrControl + R。
// 参考：https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window)
})

app.on('activate', () => {
  //在macOS上，当出现以下情况时，通常会在应用程序中重新创建窗口
  //单击dock图标后，没有其他打开的窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.on('window-all-closed', () => {
  app.quit()
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})
