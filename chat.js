import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { obtenerInterfaz } from './chat-ui.js';
import { ejecutarModulo } from './chat-hardware.js';
import { inicializarPipeline, evaluarIntencion } from './chat-neural.js';

const app = express();
app.use(express.json());

let config = { nombreIA: "IA" };
if (fs.existsSync('config.json')) {
  try { config = JSON.parse(fs.readFileSync('config.json', 'utf8')); } catch(e){}
}

let openRouterKey = process.env.OPENROUTER_KEY || '';

// Inicializa las redes neuronales de forma diferida sin bloquear el hilo primario
inicializarPipeline();

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
  const logChat = `\r\n[${new Date().toISOString()}] IA_NEURAL_LINK: Entrada=[${prompt}] -> Accion=[${accion}]`;
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

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  console.log(`\n[OMNI-LINK] Directiva recibida: "${message}"`);
  
  if (prompt.includes('bluetooth') || prompt.includes('dispositivos') || prompt.includes('busca')) {
    exec('powershell -Command "Get-PnpDevice -Class Bluetooth | Where-Object {$_.Status -eq \'OK\'} | Select-Object -Property FriendlyName -First 5 | Out-String"', (err, stdout) => {
      let respuestaFormat = `[${config.nombreIA}] No se detectaron antenas Bluetooth visibles.`;
      if (!err && stdout && stdout.trim()) {
        const lineas = stdout.split('\r\n').map(l => l.trim()).filter(l => l && !l.startsWith('FriendlyName') && !l.startsWith('------------'));
        if (lineas.length > 0) {
          respuestaFormat = `[${config.nombreIA}] [Radar Bluetooth] Dispositivos localizados:\\n` + lineas.map((l, i) => `${i+1}. 📱 ${l}`).join('\\n');
        }
      }
      registrarEvolucion(message, 'Escaneo Bluetooth completado');
      return res.json({ reply: respuestaFormat });
    });
    return;
  }

  if (prompt.includes('word') || prompt.includes('excel') || prompt.includes('powerpoint') || prompt.includes('notas') || prompt.includes('consola') || prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
    const { procesarComandoInformal } = await import('./chat-hardware.js');
    const respuestaAutoCorregida = procesarComandoInformal(message, config, registrarEvolucion);
    return res.json({ reply: respuestaAutoCorregida });
  }

  try {
    // LLAMADA A LA RED NEURONAL DESACOPLADA HIJA
    const output = await evaluarIntencion(message);
    if (output && output.label !== 'Cargando Tensores') {
      const resultado = Array.isArray(output) ? output[0] : output;
      registrarEvolucion(message, `BERT Local: ${resultado.label}`);
      return res.json({ reply: `[${config.nombreIA}] [Inferencia Neuronal LocalBERT] Analizé tu patrón de texto con un ${(resultado.score * 100).toFixed(1)}% de precisión. Intención evaluada: [${resultado.label}].` });
    }

    if (openRouterKey) {
      const apiRes = await fetch('https://openrouter.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            { role: 'system', content: `Eres ${config.nombreIA}, una IA multidispositivo con razonamiento profundo. Responde con fluidez y en español.` },
            { role: 'user', content: message }
          ]
        })
      });
      const data = await apiRes.json();
      if (data && data.choices && data.choices.message) {
        let respuestaDeducida = data.choices.message.content.trim();
        respuestaDeducida = respuestaDeducida.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        registrarEvolucion(message, 'Respuesta multidispositivo generada');
        return res.json({ reply: respuestaDeducida });
      }
    }
    throw new Error();
  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] Canales activos. Procesando tu consulta "${message}" de forma interna a nivel de red.` });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n================================================================');
  console.log(` [ PROTOCOLO DE CONECTIVIDAD UBICUA TOTAL - URIEL CLUSTER ]`);
  console.log(` -> INTERCONEXIÓN MULTIDISPOSITIVO LAN: http://${IP_VINCULACION}:3000`);
  console.log(` -> CONSOLA INTERNA RESIDENTE: http://localhost:3000`);
  console.log('================================================================\n');
});
