import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { obtenerInterfaz } from './chat-ui.js';
import { ejecutarModulo } from './chat-hardware.js';
const app = express();
app.use(express.json());
let config = { nombreIA: "IA" };
if (fs.existsSync('config.json')) {
  try { config = JSON.parse(fs.readFileSync('config.json', 'utf8')); } catch(e){}
}
let openRouterKey = process.env.OPENROUTER_KEY || '';
function registrarEvolucion(prompt, accion) {
  const logChat = `\n[${new Date().toISOString()}] IA_PARENT: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : '';
  const htmlDinamico = obtenerInterfaz(userAgent, config, 'rgba(32, 32, 32, 0.85)', 'backdrop-filter: blur(25px);', '1px solid rgba(255,255,255,0.12)', '40px');
  res.send(htmlDinamico);
});
app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });
app.post('/api/funcion', (req, res) => {
  const { modulo } = req.body;
  ejecutarModulo(modulo, config, registrarEvolucion);
  res.json({ success: true });
});
app.post('/api/chat', async (req, res) => {
  const { message } = req.body; const prompt = message.toLowerCase().trim();
  try {
    if (prompt.includes('modifícate') || prompt.includes('cambia tu código') || prompt.includes('actualízate')) {
      if (openRouterKey) {
        const apiRes = await fetch('https://openrouter.ai', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
          body: JSON.stringify({ model: 'meta-llama/llama-3.2-3b-instruct:free', messages: [{ role: 'system', content: 'Eres el motor de auto-evolucion. Modifica chat.js.' }, { role: 'user', content: message }] })
        });
        const data = await apiRes.json();
        fs.appendFileSync('chat.js', `\n\n// MUTACIÓN:\n// ${message}`);
        setTimeout(() => { exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js'); }, 1000);
        return res.json({ reply: `[${config.nombreIA}] Código fuente reescrito físicamente en el Padre de forma autónoma.` });
      }
    }
    res.json({ reply: `[${config.nombreIA}] Canales estables.` });
  } catch (err) { res.json({ reply: `[${config.nombreIA}] Contingencia activa.` }); }
});
app.listen(3000, '0.0.0.0', () => {});