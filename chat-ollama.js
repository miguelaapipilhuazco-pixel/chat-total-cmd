import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';
const app = express();
app.use(express.json());
let modoInteractiva = 'texto';
const hf = new HfInference('hf_AWTmByYqRXRXbVZnYmptWnRYYmNxWGJQWHB2Wn');
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
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h2>🤖 IA Semana de la Ingenieria - Servidor Activo</h2></body></html>`);
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
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[AGENTE IA SEMANA DE LA INGENIERIA TOTALMENTE OPERATIVO - MODO CLOUD]');
  setInterval(actualizarInfraestructura, 300000);
});