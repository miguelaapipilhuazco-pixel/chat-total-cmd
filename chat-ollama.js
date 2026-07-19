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
// ARCHIVOS DE CONFIGURACIÓN PWA PARA INSTALACIÓN EN EL DISPOSITIVO
app.get('/manifest.json', (req, res) => {
  res.json({ name: "IA Semana de la Ingenieria", short_name: "IA Ingenieria", start_url: "/", display: "standalone", background_color: "#000000", theme_color: "#d4af37", icons: [{ src: "https://flaticon.com", sizes: "512x512", type: "image/png" }] });
});
app.get('/sw.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.send('self.addEventListener("fetch", function(e) { e.respondWith(fetch(e.request)); });
');
});
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>IA Multi-OS</title><link rel="manifest" href="/manifest.json"><script type="module" src="https://jsdelivr.net"></script><script nomodule src="https://jsdelivr.net"></script><link rel="stylesheet" href="https://jsdelivr.net"/><style>body{background:#000;--ion-background-color:#000;color:#fff;} #ia-fab{position:fixed;bottom:15px;right:15px;z-index:9999;} ion-fab-button{--background:#d4af37;--color:#000;box-shadow:0 4px 12px rgba(0,0,0,0.5);} #chat-box{padding:20px;text-align:center;margin-top:40vh;font-size:18px;color:#d4af37;font-weight:bold;}</style></head><body><ion-app><ion-content><div id="chat-box">Presiona el micrófono y habla...</div><div id="ia-fab"><ion-fab><ion-fab-button><ion-icon name="hardware-chip-outline">⚛️</ion-icon></ion-fab-button><ion-fab-list side="top"><button onclick="activarMicrofono()" style="background:none;border:none;font-size:24px;margin:8px;cursor:pointer;" title="Hablar">🎙️</button><button onclick="alert('Modo Señas Activo')" style="background:none;border:none;font-size:24px;margin:8px;cursor:pointer;" title="Señas">🖐️</button></ion-fab-list></ion-fab></div></ion-content></ion-app><script>if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js');} const box = document.getElementById('chat-box'); function activarMicrofono(){ const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if(!Recognition){ box.innerText='Tu navegador no soporta entrada de voz.'; return; } const rec = new Recognition(); rec.lang='es-MX'; box.innerText='🎙️ Escuchando tu voz...'; rec.start(); rec.onresult=(e)=>{ const texto=e.results[0].transcript; box.innerText='Procesando en la nube: '+texto; fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:texto,rol:'administrador'})}).then(r=>r.json()).then(d=>box.innerText=d.reply); }; rec.onerror=()=>box.innerText='Error al capturar audio.'; }</script></body></html>`);
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
    console.log(`\n[AGENTE IA INSTALABLE CONFIGURADO EN EL PUERTO: ${puerto}]`);
    setInterval(actualizarInfraestructura, 300000);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') iniciarServidor(puerto + 1);
  });
}
iniciarServidor(3000);