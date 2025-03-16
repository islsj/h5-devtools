import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import injectDevtools from './injectDevtools'
import injectWebview from './injectWebview'

// Custom APIs for renderer
const api = {
  preloadPath: pathToFileURL(join(__dirname, '../preload/index.js')).href,
  injectDevtools: injectDevtools,
  injectWebview: injectWebview
}

//使用`contextBridge` API将Electron API暴露给
//仅当启用了上下文隔离时才渲染器，否则
//只需添加到DOM全局。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronApi', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electronApi = electronAPI
  window.api = api
}
