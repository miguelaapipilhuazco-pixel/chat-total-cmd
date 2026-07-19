import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';
const app = express();
app.use(express.json());
let modoInteractiva = 'texto';
const hf = new HfInference('hf_AWTmByYqRXRXbVZnYmptWnRYYmNxWGJQWHB2Wn');
function registrarConversacion(message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Modo=[${modoInteractiva}] Rol=[administrador] Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync('conversaciones.log', logChat);
}
function actualizarInfraestructura() {
  if (fs.existsSync('conversaciones.log')) { exec('guardar.bat'); }
  exec('git pull origin main');
  exec('netsh wlan set hostednetwork mode=allow ssid="IA Semana de la Ingenieria" > nul 2>&1');
  exec('netsh wlan start hostednetwork > nul 2>&1');
}
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>IA Administrador</title><script type="module" src="https://jsdelivr.net"></script><script nomodule src="https://jsdelivr.net"></script><link rel="stylesheet" href="https://jsdelivr.net"/><style>body{background:#000;--ion-background-color:#000;color:#fff;} #ia-fab{position:fixed;bottom:15px;right:15px;z-index:9999;} ion-fab-button{--background:#d4af37;--color:#000;} #chat-box{padding:20px;text-align:center;margin-top:40vh;font-size:18px;color:#d4af37;font-weight:bold;}</style></head><body><ion-app><ion-content><div id="chat-box">[MODO ADMINISTRADOR ACTIVO] Presiona el micrófono...</div><div id="ia-fab"><ion-fab><ion-fab-button><ion-icon name="hardware-chip-outline">⚛️</ion-icon></ion-fab-button><ion-fab-list side="top"><button onclick="activarMicrofono()" style="background:none;border:none;font-size:24px;margin:8px;cursor:pointer;" title="Hablar">🎙️</button></ion-fab-list></ion-fab></div></ion-content></ion-app><script>const box = document.getElementById('chat-box'); function activarMicrofono(){
 const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 if(!Recognition){ box.innerText='Navegador no compatible.'; return; }
 const rec = new Recognition(); rec.lang='es-MX'; box.innerText='🎙️ Escuchando canal Administrador...'; rec.start();
 rec.onresult=(e)=>{
   const texto=e.results[0][0].transcript;
   box.innerText='Procesando en clúster...';
   fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:texto,rol:'administrador'})}).then(r=>r.json()).then(d=>box.innerText=d.reply);
 };
}</script></body></html>`);
});
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const out = await hf.textGeneration({ model: 'Qwen/Qwen2.5-7B-Instruct', inputs: 'Responde brevemente en español: ' + message });
    const respuestaIA = (out && out.generated_text) ? out.generated_text : 'Procesado.';
    registrarConversacion(message, respuestaIA);
    res.json({ reply: respuestaIA });
  } catch (err) {
    res.status(500).json({ error: 'Error cloud.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[COMPILACIÓN DE ADMINISTRADOR DESPLEGADA]');
  setInterval(actualizarInfraestructura, 300000);
});