import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';
const app = express();
app.use(express.json());
let modoInteractiva = 'texto';
const hf = new HfInference('hf_AWTmByYqRXRXbVZnYmptWnRYYmNxWGJQWHB2Wn');
const permisosRoles = { administrador: ['chat', 'descarga', 'clona', 'modos'], ingeniero: ['chat', 'descarga'], invitado: ['chat'] };
function registrarConversacion(usuarioRol, message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Modo=[${modoInteractiva}] Rol=[${usuarioRol}] Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync('conversaciones.log', logChat);
}
function actualizarInfraestructura() {
  if (fs.existsSync('conversaciones.log')) { exec('guardar.bat'); }
  exec('git pull origin main');
  exec('netsh wlan set hostednetwork mode=allow ssid="IA Semana de la Ingenieria" > nul 2>&1');
  exec('netsh wlan start hostednetwork > nul 2>&1');
}
// INTERFAZ DE ICONO FLOTANTE MINIMALISTA COMPACTO
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>IA Flotante</title><style> body{background:#111;color:#fff;font-family:sans-serif;} #ia-widget{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;} #ia-btn{width:50px;height:50px;background:#d4af37;border:none;border-radius:50%;font-size:24px;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;} #ia-btn:active{transform:scale(0.95);} #ia-menu{display:none;background:rgba(20,20,20,0.95);border:1px solid #d4af37;padding:8px;border-radius:12px;margin-bottom:10px;box-shadow:0 4px 15px rgba(0,0,0,0.7);width:140px;} .menu-item{width:100%;background:none;border:none;color:#fff;padding:8px;text-align:left;font-size:13px;cursor:pointer;border-radius:6px;display:flex;align-items:center;gap:8px;} .menu-item:hover{background:rgba(212,175,55,0.2);}</style></head><body><div id="ia-widget"><div id="ia-menu"><button class="menu-item" onclick="setModo('texto')">⌨️ Texto</button><button class="menu-item" onclick="setModo('microfono')">🎙️ Microfono</button><button class="menu-item" onclick="setModo('senas')">🖐️ Señas Int.</button></div><button id="ia-btn" onclick="toggleMenu()">⚛️</button></div><script>function toggleMenu(){const m=document.getElementById('ia-menu');m.style.display=m.style.display==='block'?'none':'block';} function setModo(m){fetch('/api/modo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modo:m})}); toggleMenu();}</script></body></html>`);
});
app.post('/api/modo', (req, res) => {
  const { modo } = req.body;
  modoInteractiva = modo;
  res.json({ status: 'Modo cambiado: ' + modoInteractiva });
});
app.post('/api/chat', async (req, res) => {
  try {
    const { message, rol } = req.body;
    const r = rol ? rol.toLowerCase().trim() : 'invitado';
    const out = await hf.textGeneration({ model: 'Qwen/Qwen2.5-7B-Instruct', inputs: 'Responde brevemente en el mismo idioma del usuario: ' + message });
    const respuestaIA = (out && out.generated_text) ? out.generated_text : 'Procesado.';
    registrarConversacion(r, message, respuestaIA);
    res.json({ reply: respuestaIA });
  } catch (err) {
    res.status(500).json({ error: 'Error cloud.' });
  }
});
function iniciarServidor(puerto) {
  const server = app.listen(puerto, '0.0.0.0', () => {
    console.log(`\n[AGENTE MULTI-IA ACTIVO - PUERTO: ${puerto}]`);
    setInterval(actualizarInfraestructura, 300000);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') iniciarServidor(puerto + 1);
  });
}
iniciarServidor(3000);