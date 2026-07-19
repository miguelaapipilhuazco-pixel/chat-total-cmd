import { app, BrowserWindow, screen } from 'electron';
let win;
app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  win = new BrowserWindow({
    width: 60,
    height: 60,
    x: width - 80,
    y: height - 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: { nodeIntegration: true }
  });
  win.loadURL('http://localhost:3000');
});