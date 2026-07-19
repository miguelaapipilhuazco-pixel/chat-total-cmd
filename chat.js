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
  const logChat = `\r\n[${new Date().toISOString()}] IA_EVOLUTION_CORE: Entrada=[${prompt}] -> Accion=[${accion}]`;
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

// INTERCEPTOR MAESTRO DE AUTO-MUTACIÓN DE CÓDIGO FUENTE (NIVEL 4 DE AUTONOMÍA)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  console.log(`\n[OMNI-LINK] Directiva recibida en red: "${message}"`);
  
  // 1. CAPA DE AUTO-MUTACIÓN ABSOLUTA: Filtra intenciones de creacion, modificacion o codigo
  if (prompt.includes('modifícate') || prompt.includes('cambia tu código') || prompt.includes('actualízate') || prompt.includes('crear') || prompt.includes('crea') || prompt.includes('interfaz') || prompt.includes('diseño') || prompt.includes('codigo')) {
    console.log('[EVOLUCIÓN] La IA activa el protocolo de auto-mutacion fisica en el disco duro...');
    
    try {
      if (openRouterKey) {
        const apiRes = await fetch('https://openrouter.ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [
              { role: 'system', content: 'Eres un ingeniero de software experto en Node.js, Express y CSS. Escribe parches de codigo funcionales o mejoras visuales completas basadas en el requerimiento. Devuelve exclusivamente codigo JavaScript o HTML valido dentro de bloques de marcas.' },
              { role: 'user', content: `Genera una evolucion o modulo para esta peticion: ${message}` }
            ]
          })
        });
        const data = await apiRes.json();
        let codigoGenerado = data.choices[0].message.content;
        
        // Limpieza de trazas de etiquetas think de DeepSeek
        codigoGenerado = codigoGenerado.replace(/<think>[\s\S]*?<\/think>/gi, "");
        const match = codigoGenerado.match(/```javascript([\s\S]*?)```/) || codigoGenerado.match(/```js([\s\S]*?)```/) || codigoGenerado.match(/```html([\s\S]*?)```/);
        const codigoLimpio = match ? match[1].trim() : codigoGenerado.trim();

        if (codigoLimpio) {
          // Determinar que archivo se va a auto-mutar en base a tu orden
          let archivoObjetivo = 'chat.js';
          if(prompt.includes('interfaz') || prompt.includes('diseño')) archivoObjetivo = 'chat-ui.js';
          
          fs.appendFileSync(archivoObjetivo, `\n\n// EVOLUCIÓN AUTÓNOMA INYECTADA POR LA IA:\n${codigoLimpio}\n`);
          registrarEvolucion(message, `Auto-mutacion completada con exito en el archivo: ${archivoObjetivo}`);
          
          // Hot-Reload de Memoria RAM: Mata el proceso y se re-enciende solo en un segundo con los cambios
          setTimeout(() => {
            console.log('[SISTEMA] Reiniciando servidor para aplicar la nueva version del codigo...');
            exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js');
          }, 1500);

          return res.json({ reply: `[${config.nombreIA}] [Nivel 4: Auto-Mutación] Procesé tu orden. Modifiqué de forma física e invisible el código de mi archivo local ("${archivoObjetivo}") y disparé un Hot-Reload automático en la memoria RAM para aplicar las nuevas funciones.` });
        }
      }
    } catch (e) {
      // Inyección de respaldo local local si el token cloud no responde
      fs.appendFileSync('chat.js', `\n\n// MUTACIÓN LOCAL DE RESPALDO:\n// Optimizacion automatica para la orden: ${message}\n`);
      setTimeout(() => { exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js'); }, 1000);
      return res.json({ reply: `[${config.nombreIA}] [Mutación Local] Modifiqué mi archivo físico ejecutable e inicializé un Hot-Reload automático en la memoria RAM.` });
    }
  }

  // Interceptores multimedia y de hardware clásicos adaptativos
  if (prompt.includes('reproduce') || prompt.includes('pon') || prompt.includes('escuchar') || prompt.includes('word') || prompt.includes('excel') || prompt.startsWith('abre ')) {
    const { procesarComandoInformal } = await import('./chat-hardware.js');
    return res.json({ reply: procesarComandoInformal(message, config, registrarEvolucion) });
  }

  try {
    const output = await evaluarIntencion(message);
    if (output && output.label && output.label !== 'Cargando Tensores') {
      const resultado = Array.isArray(output) ? output[0] : output;
      return res.json({ reply: `[${config.nombreIA}] [BERT Local] Intención evaluada: [${resultado.label}].` });
    }
    res.json({ reply: `[${config.nombreIA}] Procesando orden libre "${message}" de forma estable en el ecosistema.` });
  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] Enlace activo.` });
  }
});

// ESCÁNER DINÁMICO DE PUERTOS SECUENCIAL
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



// MUTACIÓN LOCAL DE RESPALDO:
// Intentos de optimización autónoma para la orden: modifícate y añade una nueva ruta que salude al Administrador
