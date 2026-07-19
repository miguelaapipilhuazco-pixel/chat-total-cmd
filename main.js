import { app, BrowserWindow } from 'electron';

function createOverlayWindow () {
  const win = new BrowserWindow({
    width: 300,                  // Ampliado a 300 para dar espacio libre horizontal
    height: 300,                 // Ampliado a 300 para evitar recortes en el Braille y Tooltips
    transparent: true,           // Mantiene la transparencia cristalina del fondo
    frame: false,                 // Elimina barras blancas y títulos rígidos de Windows
    alwaysOnTop: true,            // Obliga al widget a flotar por encima de Roblox y juegos
    resizable: false,             // Bloquea deformaciones en el hardware visual
    hasShadow: false,
    webPreferences: { nodeIntegration: false }
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createOverlayWindow);