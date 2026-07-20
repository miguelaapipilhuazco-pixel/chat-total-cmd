const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 380, height: 720,
    transparent: true, frame: false, alwaysOnTop: true, resizable: false, hasShadow: false,
    skipTaskbar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  win.loadURL('http://localhost:7860/');
});