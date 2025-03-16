import { BrowserWindow, shell } from 'electron'
import icon from '../../../resources/icon.png'
import { is } from '@electron-toolkit/utils'
import { join } from 'node:path'
// 远程调试
process.env.EMP_REMOTE_DEBUGGING_PORT = '9238'
export let mainWindow = null

function createMainWindow() {
  // nativeTheme.themeSource = 'light' // 'light' 或 'system'
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    titleBarStyle: 'hiddenInset', // 隐藏标题栏
    type: 'textured',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      allowRunningInsecureContent: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false
    }
  })
  mainWindow.setMinimumSize(800, 600)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    //   // 比如把 X-Frame-Options 和 frame-ancestors 都干掉
    //   const responseHeaders = { ...details.responseHeaders }
    //   delete responseHeaders['X-Frame-Options']
    //   delete responseHeaders['content-security-policy']
    //
    //   callback({
    //     cancel: false,
    //     responseHeaders
    //   })
    // })
  })
  mainWindow.webContents.on('blur', (event, input) => {})

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // mainWindow.webContents.openDevTools()
    mainWindow.webContents.session.clearCache()
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export default createMainWindow
