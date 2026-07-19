import { app, BrowserWindow } from 'electron';
function createOverlayWindow () {
  const win = new BrowserWindow({
    width: 400, height: 400,
    transparent: true, frame: false,
    alwaysOnTop: true, resizable: false, hasShadow: false,
    webPreferences: { nodeIntegration: false }
  });
  win.loadURL('http://localhost:3000');
}
app.whenReady().then(createOverlayWindow);