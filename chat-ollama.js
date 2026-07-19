import ollama from 'ollama';
import express from 'express';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modeloActual = 'llama3.2:latest';
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();
    if (prompt.startsWith( 'usa el modelo ' )) {
      modeloActual = message.split( ' ' ).pop();
      return res.json({ reply: 'Cerebro de la IA actualizado a: ' + modeloActual });
    }
    if (prompt.startsWith( 'descarga ' )) {
      exec(`ollama pull ${message.split( ' ' ).pop()}`);
      return res.json({ reply: 'Instalando componente en segundo plano...' });
    }
    // DIRECTIVA DE IDIOMA DINÁMICO: Fuerza al modelo de Ollama a responder en el mismo idioma del usuario
    const contexto = [
      { role: 'system', content: 'REGLA MANDATORIA: Debes detectar el idioma del usuario y responder ÚNICAMENTE en ese mismo idioma. Si te hablan en español, responde al 100%% en español fluido.' },
      { role: 'user', content: message }
    ];
    const response = await ollama.chat({ model: modeloActual, messages: contexto });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Fallo de comunicacion con el motor local.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[AGENTE IA SEMANA DE LA INGENIERIA RECONFIGURADO - IDIOMA DINÁMICO]');
  setInterval(() => {
    exec('netsh wlan set hostednetwork mode=allow ssid="IA Semana de la Ingenieria" > nul 2>&1');
    exec('netsh wlan start hostednetwork > nul 2>&1');
  }, 300000);
});
