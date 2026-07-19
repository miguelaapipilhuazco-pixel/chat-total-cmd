import { app, BrowserWindow, session } from 'electron';
function createOverlayWindow () {
  const win = new BrowserWindow({
    width: 400, height: 500,
    transparent: true, frame: false,
    alwaysOnTop: true, resizable: false, hasShadow: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  // PASARELA DE CIBERSEGURIDAD: Bypass automático para permitir micrófonos y cámaras en caliente
  session.defaultSession.setPermissionCheckHandler((wb, p) => true);
  session.defaultSession.setPermissionRequestHandler((wb, p, cb) => cb(true));
  win.loadURL('http://localhost:3000');
}
app.whenReady().then(createOverlayWindow);