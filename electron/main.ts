// The built directory structure
//
// ├─┬ dist
// │ ├─┬ electron
// │ │ ├── main.js
// │ │ └── preload.js
// │ ├── index.html
// │ ├── ...other-static-files-from-public
// │
process.env.DIST = join(__dirname, '..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

import { join } from 'path'
import { app, BrowserWindow } from 'electron'

let win: BrowserWindow | null
// Here, you can also use other preload
const preload = join(__dirname, './preload.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const url = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: join(process.env.PUBLIC, 'logo.svg'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload,
    },
  })

  // win.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
  //   event.preventDefault()
  //   if (portList && portList.length > 0) {
  //     callback(portList[0].portId)
  //   } else {
  //     callback('') //Could not find any matching devices
  //   }
  // })

  // win.webContents.session.on('serial-port-added', (event, port) => {
  //   console.log('serial-port-added FIRED WITH', port)
  // })

  // win.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
  //   if (permission === 'serial' && details.securityOrigin === 'file:///') {
  //     return true
  //   }
  // })

  // win.webContents.session.setDevicePermissionHandler((details) => {
  //   if (details.deviceType === 'serial' && details.origin === 'file://') {
  //     return true
  //   }
  // })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (app.isPackaged) {
    win.loadFile(join(process.env.DIST, 'index.html'))
  } else {
    win.loadURL(url)
  }
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)
