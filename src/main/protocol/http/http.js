import { net, protocol } from 'electron'
import deviceInfo from '../../../renderer/src/components/base/Device/components/deviceInfo'
import { activeDevice } from '../../ipc/device-info/device-info'
import { mainWindow } from '../../windows/mainWindow'

function viewportFitMode(metaTag) {
  const regex = /viewport-fit=([\w-]+)/
  return (metaTag.match(regex) || [])[1]
}

function insetSafeAreaInset(text) {
  if (!deviceInfo.get(activeDevice.name)) return text
  const [top, , bottom] = deviceInfo.get(activeDevice.name)['data-safe-area'].split(',')
  const styleTag = `<style>:root {--safe-area-inset-top: ${top}px;--safe-area-inset-bottom: ${bottom}px;}</style>`
  return text.replace(/<\/head>/i, `${styleTag}<\/head>`)
}

function replaceSafeAreaInset(text) {
  if (!deviceInfo.get(activeDevice.name)) return text
  return text
    .replace(
      /env\(safe-area-inset-top\)|constant\(safe-area-inset-top\)/g,
      'var(--safe-area-inset-top)'
    )
    .replace(
      /env\(safe-area-inset-bottom\)|constant\(safe-area-inset-bottom\)/g,
      'var(--safe-area-inset-bottom)'
    )
}

async function hitContentType(req, response) {
  const types = ['html', 'css', 'javascript']
  const contentType = response.headers.get('content-type')
  if (contentType && types.some((t) => contentType.includes(t))) {
    let result = await response.text()
    const match = viewportFitMode(result)
    switch (match) {
      case 'auto':
        break
      case 'cover':
        result = insetSafeAreaInset(result)
        break
      case 'contain':
        mainWindow.webContents.send('set-device-white-area', req.url)
        break
      default:
        break
    }
    result = replaceSafeAreaInset(result)
    return new Response(result, {
      headers: { 'Content-Type': `${response.headers.get('content-type')}` }
    })
  } else {
    return response
  }
}

let list = new Set()
export default function () {
  protocol.handle('http', async (req) => {
    list.add(req.url)
    const response = await net.fetch(req, { bypassCustomProtocolHandlers: true })
    list.delete(req.url)

    return hitContentType(req, response)
  })
}
