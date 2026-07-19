import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';
const app = express();
app.use(express.json());
const hf = new HfInference('hf_AWTmByYqRXRXbVZnYmptWnRYYmNxWGJQWHB2Wn');
function registrarConversacion(message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Ecosistema=Arturo Engine=Capacitor Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync('conversaciones.log', logChat);
}
function actualizarInfraestructura() {
  if (fs.existsSync('conversaciones.log')) { exec('guardar.bat'); }
  exec('git pull origin main');
}
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});
// API DE CONTROL NATIVO: Intercepta las solicitudes de hardware del microfono y camara de Capacitor
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const out = await hf.textGeneration({ model: 'Qwen/Qwen2.5-7B-Instruct', inputs: 'Eres la IA del Ecosistema Arturo. Responde brevemente en español a: ' + message });
    const respuestaIA = (out && out.generated_text) ? out.generated_text : 'Comando procesado.';
    registrarConversacion(message, respuestaIA);
    res.json({ reply: respuestaIA });
  } catch { res.status(500).json({ error: 'Error de red cloud.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[SISTEMA ADAPTATIVO CAPACITOR CONECTADO AL VOLUMEN DE LA CÁMARA]');
  setInterval(actualizarInfraestructura, 300000);
});