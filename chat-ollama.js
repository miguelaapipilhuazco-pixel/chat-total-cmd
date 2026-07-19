import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';

const app = express();
app.use(express.json());

let modoInteractiva = 'texto';
const hf = new HfInference('hf_AWTmByYqRXRXbVZnYmptWnRYYmNxWGJQWHB2Wn');

function registrarConversacion(message, respuestaIA) {
  const logChat = `\r\n[${new Date().toISOString()}] Ecosistema=Arturo Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync('conversaciones.log', logChat);
}

function actualizarInfraestructura() {
  if (fs.existsSync('conversaciones.log')) { exec('guardar.bat'); }
  exec('git pull origin main');
}

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Arturo IA - Vision</title><script type="module" src="https://jsdelivr.net"></script><link rel="stylesheet" href="https://jsdelivr.net"/><script src="https://jsdelivr.net" crossorigin="anonymous"></script><script src="https://jsdelivr.net" crossorigin="anonymous"></script><style>body{background:#000;margin:0;padding:0;overflow:hidden;} #ia-fab-widget{position:fixed;bottom:15px;right:15px;z-index:99999;} ion-fab-button{--background:#d4af37;--color:#000;} #display-status{position:fixed;bottom:80px;right:15px;background:rgba(0,0,0,0.85);border:1px solid #d4af37;color:#fff;padding:12px;border-radius:10px;font-family:sans-serif;font-size:14px;max-width:240px;display:none;} #webcam{position:fixed;top:10px;left:10px;width:160px;height:120px;border-radius:8px;border:2px solid #d4af37;transform:scaleX(-1);display:none;}</style></head><body><ion-app><ion-content><video id="webcam" autoplay playsinline></video><div id="display-status"></div><div id=\"ia-fab-widget\"><ion-fab><ion-fab-button><ion-icon name=\"hardware-chip-outline\">⚛️</ion-icon></ion-fab-button><ion-fab-list side=\"top\"><button onclick=\"dispararMicrofono()\" style=\"background:none;border:none;font-size:26px;margin:6px;cursor:pointer;\" title=\"Voz\">🎙️</button><button onclick=\"activarCamaraSenas()\" style=\"background:none;border:none;font-size:26px;margin:6px;cursor:pointer;\" title=\"Señas\">🖐️</button></ion-fab-list></ion-fab></div></ion-content></ion-app><script>const status = document.getElementById('display-status'); const video = document.getElementById('webcam'); function activarCamaraSenas(){ status.innerText = '🖐️ Inicializando trackeo de senas...'; status.style.display = 'block'; video.style.display = 'block'; navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{ video.srcObject = stream; const hands = new Hands({locateFile:(file)=>\`https://jsdelivr.net\${file}\`}); hands.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:0.5,minTrackingConfidence:0.5}); hands.onResults((res)=>{ if(res.multiHandLandmarks && res.multiHandLandmarks.length > 0){ status.innerText = '⚛️ Mano detectada: Analizando coordenadas de los 21 puntos...'; } }); const camera = new Camera(video,{onFrame:async()=>{await hands.send({image:video});},width:160,height:120}); camera.start(); }); } function dispararMicrofono(){ const Rec = window.SpeechRecognition || window.webkitSpeechRecognition; if(!Rec) return; const r = new Rec(); r.lang='es-MX'; status.innerText='🎙️ Escuchando...'; status.style.display='block'; r.start(); r.onresult=(e)=>{ const t=e.results.transcript; status.innerText='Procesando...'; fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t})}).then(res=>res.json()).then(d=>{ status.innerText=d.reply; }); }; }</script></body></html>`);
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const out = await hf.textGeneration({ model: 'Qwen/Qwen2.5-7B-Instruct', inputs: 'Eres la IA del Ecosistema Arturo. Responde brevemente en español a: ' + message });
    const respuestaIA = (out && out.generated_text) ? out.generated_text : 'Comando procesado.';
    registrarConversacion(message, respuestaIA);
    res.json({ reply: respuestaIA });
  } catch (err) { res.status(500).json({ error: 'Error de red cloud.' }); }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ECOSISTEMA ARTURO - MULTIMODAL CON SOPORTE DE SEÑAS COMPILADO]');
});

});