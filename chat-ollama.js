import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';
const app = express();
app.use(express.json());
let modoInteractiva = 'texto';
const hf = new HfInference('hf_AWTmByYqRXRXbVZnYmptWnRYYmNxWGJQWHB2Wn');
function registrarConversacion(message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Ecosistema=Arturo Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync('conversaciones.log', logChat);
}
function actualizarInfraestructura() {
  if (fs.existsSync('conversaciones.log')) { exec('guardar.bat'); }
  exec('git pull origin main');
}
// INTERFAZ DE RENDERING PURO: El widget flota de forma inmersiva como un elemento nativo de la PWA
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Arturo Floating IA</title><script type="module" src="https://jsdelivr.net"></script><link rel="stylesheet" href="https://jsdelivr.net"/><style>body{background:transparent;margin:0;padding:0;overflow:hidden;} #ia-fab-widget{position:fixed;bottom:15px;right:15px;z-index:99999;} ion-fab-button{--background:#d4af37;--color:#000;box-shadow:0 4px 16px rgba(0,0,0,0.6);} #display-status{position:fixed;bottom:80px;right:15px;background:rgba(0,0,0,0.85);border:1px solid #d4af37;color:#fff;padding:12px;border-radius:10px;font-family:sans-serif;font-size:14px;max-width:240px;display:none;box-shadow:0 4px 12px rgba(0,0,0,0.5);}</style></head><body><ion-app><ion-content><div id="display-status"></div><div id="ia-fab-widget"><ion-fab><ion-fab-button><ion-icon name="hardware-chip-outline">⚛️</ion-icon></ion-fab-button><ion-fab-list side="top"><button onclick="dispararMicrofono()" style="background:none;border:none;font-size:26px;margin:6px;cursor:pointer;" title="Escuchar">🎙️</button><button onclick="document.getElementById('display-status').style.display='none'" style="background:none;border:none;font-size:26px;margin:6px;cursor:pointer;" title="Ocultar">❌</button></ion-fab-list></ion-fab></div></ion-content></ion-app><script>const status = document.getElementById('display-status'); function dispararMicrofono(){
 const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
 if(!Rec){ status.innerText='Falta permiso de hardware.'; status.style.display='block'; return; }
 const r = new Rec(); r.lang='es-MX'; status.innerText='🎙️ Arturo IA escuchando...'; status.style.display='block'; r.start();
 r.onresult=(e)=>{
   const t=e.results[0][0].transcript; status.innerText='Procesando orden...';
   fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t})}).then(res=>res.json()).then(d=>{ status.innerText=d.reply; });
 };
}</script></body></html>`);
});
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const out = await hf.textGeneration({ model: 'Qwen/Qwen2.5-7B-Instruct', inputs: 'Eres la IA integrada del Ecosistema Arturo. Responde de forma muy breve y ejecuta comandos en español para: ' + message });
    const respuestaIA = (out && out.generated_text) ? out.generated_text : 'Comando procesado en la infraestructura Arturo.';
    registrarConversacion(message, respuestaIA);
    res.json({ reply: respuestaIA });
  } catch { res.status(500).json({ error: 'Fallo el enlace distributed.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[IA INTEGRADA AL ECOSISTEMA ARTURO EN EJECUCIÓN INVISIBLE]');
  setInterval(actualizarInfraestructura, 300000);
});