import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { HfInference } from '@huggingface/inference';
import { obtenerInterfaz } from './chat-ui.js';
import { ejecutarModulo } from './chat-hardware.js';

const app = express();
app.use(express.json());

let config = { nombreIA: "IA" };
if (fs.existsSync('config.json')) {
  try { config = JSON.parse(fs.readFileSync('config.json', 'utf8')); } catch(e){}
}

// TOKEN COGNITIVO UNIVERSAL (Usa OpenRouter o HuggingFace Serverless de Código Abierto)
let tokenClave = process.env.OPENROUTER_KEY || "hf_token_de_respaldo_si_usas_huggingface";
const hf = new HfInference(tokenClave.startsWith('hf_') ? tokenClave : '');

function obtenerIPLocal() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}
const IP_VINCULACION = obtenerIPLocal();

function registrarEvolucion(prompt, accion) {
  const logChat = `\r\n[${new Date().toISOString()}] IA_5_LEVELS: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : '';
  res.send(obtenerInterfaz(userAgent, config, 'rgba(32, 32, 32, 0.85)', 'backdrop-filter: blur(25px);', '1px solid rgba(255,255,255,0.12)', '50%'));
});

app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });

app.post('/api/funcion', (req, res) => {
  ejecutarModulo(req.body.modulo, config, registrarEvolucion);
  res.json({ success: true });
});

// MOTOR DE INTELIGENCIA DE 5 NIVELS EVOLUTIVOS INTEGRADO
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();
  console.log(`\n[OMNI-LINK] Payload interceptado: "${message}"`);

  try {
    // === NIVEL 3 Y 5: AGENTES Y ORGANIZACIÓN (Mapeo Informal Local) ===
    if (prompt.includes('word') || prompt.includes('excel') || prompt.includes('reporte') || prompt.includes('empaqueta') || prompt.includes('bluetooth') || prompt.startsWith('abre ')) {
      const { procesarComandoInformal } = await import('./chat-hardware.js');
      const respuestaAutoCorregida = procesarComandoInformal(message, config, registrarEvolucion);
      return res.json({ reply: respuestaAutoCorregida });
    }

    // === NIVEL 4: INNOVACIÓN / AUTO-MUTACIÓN DE CÓDIGO FUENTE EN CALIENTE ===
    if (prompt.includes('modifícate') || prompt.includes('cambia tu código') || prompt.includes('actualízate') || prompt.includes('inyecta')) {
      let urlApi = tokenClave.startsWith('sk-') ? 'https://openrouter.ai' : '';
      if (urlApi) {
        const apiRes = await fetch(urlApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenClave}` },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [
              { role: 'system', content: 'Eres un programador experto en Node.js. Devuelve exclusivamente codigo JavaScript valido dentro de bloques markdown.' },
              { role: 'user', content: `Genera una mejora de codigo para chat.js basada en: ${message}` }
            ]
          })
        });
        const data = await apiRes.json();
        let codigoGenerado = data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/gi, "");
        const match = codigoGenerado.match(/```javascript([\s\S]*?)```/) || codigoGenerado.match(/```js([\s\S]*?)```/);
        const codigoLimpio = match ? match[1].trim() : codigoGenerado.trim();

        if (codigoLimpio) {
          fs.appendFileSync('chat.js', `\n\n// EVOLUCIÓN INYECTADA:\n${codigoLimpio}\n`);
          setTimeout(() => { exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js'); }, 1500);
          return res.json({ reply: `[${config.nombreIA}] [Nivel 4: Auto-Mutación] Código fuente reescrito físicamente. Reiniciando hilos en la memoria RAM...` });
        }
      }
    }

    // === NIVEL 1 Y 2: CHAT INTERACTIVO Y RAZONAMIENTO COGNITIVO CLOUD ===
    if (tokenClave.startsWith('sk-')) {
      // Inferencia por OpenRouter (DeepSeek / Llama Inteligente CoT)
      const apiRes = await fetch('https://openrouter.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenClave}` },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: `Eres ${config.nombreIA}, una IA con razonamiento profundo en español. Responde de forma muy natural, fluida y extensa respetando el frontend plano del dispositivo.` },
            { role: 'user', content: message }
          ]
        })
      });
      const data = await apiRes.json();
      if (data && data.choices && data.choices[0].message) {
        return res.json({ reply: data.choices[0].message.content.trim() });
      }
    } else {
      // Inferencia de Nivel 1 Serverless por Hugging Face de Código Abierto (Qwen/Llama)
      const out = await hf.chatCompletion({
        model: 'Qwen/Qwen2.5-72B-Instruct',
        messages: [{ role: 'user', content: message }],
        max_tokens: 250
      });
      if (out && out.choices && out.choices[0].message) {
        return res.json({ reply: out.choices[0].message.content.trim() });
      }
    }

    throw new Error();
  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] [Capa Local Estabilizada] Intercepté tu consulta: "${message}". Esperando enlace de tokens remotos para inicializar el razonamiento en la nube.` });
  }
});

let puertoObjetivo = 3000;
function arrancarServidorTolerante() {
  const servidor = app.listen(puertoObjetivo, '0.0.0.0', () => {
    console.log(`\n [ CONFIGURACIÓN: Servidor de Enjambre activo en el puerto :${puertoObjetivo} ]`);
    console.log(` -> Enlace LAN multidispositivo: http://${IP_VINCULACION}:${puertoObjetivo}\n`);
    fs.writeFileSync('puerto_activo.json', JSON.stringify({ puerto: puertoObjetivo }));
  });
  servidor.on('error', (err) => {
    if (err.code === 'EADDRINUSE') { puertoObjetivo++; arrancarServidorTolerante(); }
  });
}
arrancarServidorTolerante();

