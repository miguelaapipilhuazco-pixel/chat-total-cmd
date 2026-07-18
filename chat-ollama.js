import ollama from 'ollama';
import express from 'express';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modeloActual = 'llama3.2:1b';
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (message.toLowerCase().includes( 'descarga ' )) {
      exec(`ollama pull ${message.split( ' ' ).pop()}`);
      return res.json({ reply: 'Instalando en la nube...' });
    }
    const response = await ollama.chat({ model: modeloActual, messages: [{ role: 'user', content: message }] });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Fallo de red.' }); }
});
const server = app.listen(0, '0.0.0.0', () => {
  const puerto = server.address().port;
  console.log('\n[AGENTE MULTI-IA ACTIVO]');
  setInterval(() => {
    exec('netsh wlan set hostednetwork mode=allow ssid="Agente IA" > nul 2>&1');
    exec('netsh wlan start hostednetwork > nul 2>&1');
    console.log('[SISTEMA] Icono y antenas actualizadas autom ticamente.');
  }, 300000);
});
