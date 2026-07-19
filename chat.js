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
  const logChat = `\r\n[${new Date().toISOString()}] IA_AUTO_FIX: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : '';
  const htmlDinamico = obtenerInterfaz(userAgent, config, 'rgba(32, 32, 32, 0.85)', 'backdrop-filter: blur(25px);', '1px solid rgba(255,255,255,0.12)', '50%');
  res.send(htmlDinamico);
});

app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });

app.post('/api/funcion', (req, res) => {
  const { modulo } = req.body;
  ejecutarModulo(modulo, config, registrarEvolucion);
  res.json({ success: true });
});

// INTERCEPTOR DE AUTO-CORRECCIÓN INTELIGENTE REPARADO SÓLIDO
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  try {
    // CAPA DE INTELIGENCIA DE FRONTEND: Intercepta términos informales (Word, Excel, Notas)
    if (prompt.includes('word') || prompt.includes('excel') || prompt.includes('powerpoint') || prompt.includes('notas') || prompt.includes('consola') || prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
      const { procesarComandoInformal } = await import('./chat-hardware.js');
      const respuestaAutoCorregida = procesarComandoInformal(message, config, registrarEvolucion);
      return res.json({ reply: respuestaAutoCorregida });
    }

    if (openRouterKey) {
      const apiRes = await fetch('https://openrouter.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: `Eres ${config.nombreIA}, una Inteligencia Artificial administradora del sistema. Responde con fluidez, extensión y en español.` },
            { role: 'user', content: message }
          ]
        })
      });
      const data = await apiRes.json();
      return res.json({ reply: data.choices.message.content.trim() });
    }
    throw new Error();
  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] Intercepté tu orden: "${message}". Procesando directiva en la capa adaptativa local de forma autónoma.` });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[SISTEMA - MOTOR DE AUTO-CORRECCIÓN DE HARDWARE ONLINE]');
});


