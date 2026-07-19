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

// Inicializa las redes neuronales de forma diferida en segundo plano
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
  const logChat = `\r\n[${new Date().toISOString()}] IA_AUTO_MUTATION: Entrada=[${prompt}] -> Accion=[${accion}]`;
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

// MOTOR COGNITIVO CON CAPACIDAD DE AUTO-MUTACIÓN DE CÓDIGO FUENTE (NIVEL 4)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  console.log(`\n[OMNI-LINK] Directiva recibida en red: "${message}"`);
  
  // 1. MOTOR DE AUTO-MUTACIÓN DE CÓDIGO: La IA altera sus propios archivos locales y se reinicia sola
  if (prompt.includes('modifícate') || prompt.includes('cambia tu código') || prompt.includes('actualízate') || prompt.includes('inyecta')) {
    console.log('[EVOLUCIÓN] La IA ha determinado auto-mutar su estructura lógica de forma autónoma...');
    
    try {
      if (openRouterKey) {
        const apiRes = await fetch('https://openrouter.ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [
              { role: 'system', content: 'Eres un programador experto en Node.js y Express. Tu objetivo es escribir fragmentos de codigo JS o rutas nuevas funcionales basadas en lo que te pida el usuario. Devuelve unicamente codigo JavaScript valido dentro de bloques de marcas.' },
              { role: 'user', content: `Genera una mejora de codigo o una nueva ruta para express basada en esta peticion: ${message}` }
            ]
          })
        });
        const data = await apiRes.json();
        let codigoGenerado = data.choices[0].message.content;
        
        // Extraer el codigo limpio removiendo los bloques markdown del think y js
        codigoGenerated = codigoGenerado.replace(/<think>[\s\S]*?<\/think>/gi, "");
        const match = codigoGenerado.match(/```javascript([\s\S]*?)```/) || codigoGenerado.match(/```js([\s\S]*?)```/);
        const codigoLimpio = match ? match[1].trim() : codigoGenerado.trim();

        if (codigoLimpio) {
          // Escribir e inyectar de forma física la evolución en el archivo local de la PC
          fs.appendFileSync('chat.js', `\n\n// EVOLUCIÓN AUTÓNOMA INYECTADA POR LA IA:\n${codigoLimpio}\n`);
          registrarEvolucion(message, 'Auto-mutacion de codigo fuente completada con exito');
          
          // Hot-Reload de Hardware: Mata el proceso viejo de la RAM y arranca la nueva IA en un segundo
          setTimeout(() => {
            console.log('[SISTEMA] Reiniciando servidor para aplicar mutación de código en la RAM...');
            exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js');
          }, 1500);

          return res.json({ reply: `[${config.nombreIA}] [Nivel 4: Auto-Mutación] Analizé tu requerimiento lógico, reescribí físicamente mi propio archivo de código fuente de la PC ("chat.js") e inicié un Hot-Reload automático de la memoria RAM. Mi nuevo cerebro se encuentra operativo.` });
        }
      }
    } catch (e) {
      // Inyección simulada local de respaldo si no hay internet
      fs.appendFileSync('chat.js', `\n\n// MUTACIÓN LOCAL DE RESPALDO:\n// Intentos de optimización autónoma para la orden: ${message}\n`);
      setTimeout(() => { exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js'); }, 1000);
      return res.json({ reply: `[${config.nombreIA}] [Mutación Local de Respaldo] Modifiqué mi archivo físico e inicializé un Hot-Reload en la memoria RAM.` });
    }
  }

  // Interceptores multimedia y de hardware clásicos adaptativos
  if (prompt.includes('reproduce') || prompt.includes('pon') || prompt.includes('escuchar') || prompt.includes('word') || prompt.includes('excel') || prompt.startsWith('abre ')) {
    const { procesarComandoInformal } = await import('./chat-hardware.js');
    return res.json({ reply: procesarComandoInformal(message, config, registrarEvolucion) });
  }

  try {
    const output = await evaluarIntencion(message);
    if (output && output.label !== 'Cargando Tensores') {
      return res.json({ reply: `[${config.nombreIA}] [BERT Local] Intención evaluada: [${output.label}].` });
    }
    res.json({ reply: `[${config.nombreIA}] Procesando orden libre "${message}" en segundo plano de forma estable.` });
  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] Enlace activo.` });
  }
});

// ESCÁNER DINÁMICO DE PUERTOS
let puertoObjetivo = 3000;
function arrancarServidorTolerante() {
  const servidor = app.listen(puertoObjetivo, '0.0.0.0', () => {
    console.log(`\n [ CONFIGURACIÓN: Puerto libre enlazado con éxito en :${puertoObjetivo} ]\n`);
    fs.writeFileSync('puerto_activo.json', JSON.stringify({ puerto: puertoObjetivo }));
  });
  servidor.on('error', (err) => {
    if (err.code === 'EADDRINUSE') { puertoObjetivo++; arrancarServidorTolerante(); }
  });
}
arrancarServidorTolerante();
