import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';
const app = express();
app.use(express.json());
const hf = new HfInference('hf_bYVpYmHPTYQfVvJpZtXmBnYxTWpRYkJXcHZXZg');
function registrarConversacion(message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Ecosistema=Arturo Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync('conversaciones.log', logChat);
}
function actualizarInfraestructura() {
  if (fs.existsSync('conversaciones.log')) { exec('guardar.bat'); }
  exec('git pull origin main');
}
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const out = await hf.textGeneration({
      model: 'meta-llama/Llama-3.2-3B-Instruct',
      inputs: `<|system|>
Eres la IA del Ecosistema Arturo. Responde brevemente en español.<|user|>
${message}<|assistant|>
`,
      parameters: { max_new_tokens: 150, return_full_text: false }
    });
    const respuestaIA = (out && out.generated_text) ? out.generated_text.trim() : 'Comando procesado con exito.';
    registrarConversacion(message, respuestaIA);
    res.json({ reply: respuestaIA });
  } catch (err) {
    res.status(500).json({ reply: 'Hola, soy Arturo IA. El cluster en la nube esta listo para recibir tus comandos por voz o senas.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ECOSISTEMA ARTURO - SERVIDOR OPERATIVO Y CONECTADO A LA NUBE]');
  setInterval(actualizarInfraestructura, 300000);
});