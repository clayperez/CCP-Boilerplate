//////////
// MAIN //
//////////
/// SIMPLE MENU BAR APP BOILERPLATE
'use strict';
const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')
const url = require('url')
const resourcesDir = path.join(__dirname, './resources')
let tray = undefined
let win = undefined

app.on('ready', () => {
	console.log(resourcesDir)
  let icon = nativeImage.createFromPath(path.join(resourcesDir,'App Icon22@2x.png'))
  tray = new Tray(icon)
  tray.on('click', function(event) { toggleWindow() });
  win = new BrowserWindow({ width: 250, height: 250, show: false, frame: false, resizable: false, })
  win.setMenu(null);
  win.loadURL(url.format({ pathname: path.join(__dirname, 'index.html'), protocol: 'file:', slashes: true }))
  win.on('blur', () => { if(!win.webContents.isDevToolsOpened()) { win.hide() } })
})

const toggleWindow = () => {
  if (win.isVisible()) {
    win.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = win.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }

  win.setPosition(x, y, false)
  win.show()
  win.focus()
}

ipcMain.on('show-window', () => { showWindow() })
ipcMain.on('show-devtools', () => { win.openDevTools({mode: 'detach'}) })

app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit() } })

