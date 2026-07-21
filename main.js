import { app, BrowserWindow, session } from 'electron';
function createOverlayWindow () {
  const win = new BrowserWindow({
    width: 320, height: 420,
    transparent: true, frame: false,
    alwaysOnTop: true, resizable: false, hasShadow: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  session.defaultSession.setPermissionCheckHandler(() => true);
  session.defaultSession.setPermissionRequestHandler((wb, p, cb) => cb(true));
  win.loadURL('http://localhost:7860');
}
app.whenReady().then(createOverlayWindow);