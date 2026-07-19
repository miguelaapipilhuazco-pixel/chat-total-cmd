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
      return res.json({ reply: 'Descargando recurso Open Source...' });
    }
    const response = await ollama.chat({ model: modeloActual, messages: [{ role: 'user', content: message }] });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Fallo de red.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[AGENTE IA SEMANA DE LA INGENIERIA OPERATIVO EN EL PUERTO 3000]');
  setInterval(() => {
    exec('netsh wlan set hostednetwork mode=allow ssid="IA Semana de la Ingenieria" > nul 2>&1');
    exec('netsh wlan start hostednetwork > nul 2>&1');
  }, 300000);
});
