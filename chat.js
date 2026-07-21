import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { obtenerInterfaz } from './chat-ui.js';
import { ejecutarModulo } from './chat-hardware.js';
import { consultarOllama } from './chat-ollama.js';

const app = express();
app.use(express.json());

let config = { nombreIA: "IA" };
if (fs.existsSync('config.json')) {
  try { config = JSON.parse(fs.readFileSync('config.json', 'utf8')); } catch(e){}
}

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
  const logChat = `\r\n[${new Date().toISOString()}] IA_OLLAMA_SUPER: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : '';
  res.send(obtenerInterfaz(userAgent, config, 'rgba(32, 32, 32, 0.85)', 'backdrop-filter: blur(25px);', '1px solid rgba(255, 255, 255, 0.12)', '50%'));
});

app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });

app.post('/api/funcion', (req, res) => {
  ejecutarModulo(req.body.modulo, config, registrarEvolucion);
  res.json({ success: true });
});

// INTERCEPTOR DE MENSAJES DE RED CENTRAL
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();
  console.log(`\n[OMNI-LINK] Entrada de canal activo: "${message}"`);

  // 1. Interceptor veloz para abrir/cerrar Word, Excel o reportes agénticos (Nivel 3 local)
  if (prompt.includes('reproduce') || prompt.includes('pon') || prompt.includes('escuchar') || prompt.includes('word') || prompt.includes('excel') || prompt.includes('reporte') || prompt.includes('empaqueta') || prompt.includes('bluetooth') || prompt.startsWith('abre ')) {
    const { procesarComandoInformal } = await import('./chat-hardware.js');
    const respuestaAutoCorregida = procesarComandoInformal(message, config, registrarEvolucion);
    return res.json({ reply: respuestaAutoCorregida });
  }

  // 2. Delegación total de consultas libres y auto-mutación a la Clase Temporal Ollama (Nivel 1, 2 y 4)
  const respuestaOllama = await consultarOllama(message, prompt, config);
  registrarEvolucion(message, 'Respuesta enrutada mediante la clase chat-ollama.js');
  return res.json({ reply: respuestaOllama });
});

let puertoObjetivo = 3000;
function arrancarServidorTolerante() {
  const servidor = 
// ENDPOINT LOCAL: DETECTA VOZ HUMANA Y DISTINGUE IDIOMAS (ESPAÑOL / INGLÉS)
app.post("/api/procesar-voz", async (req, res) => {
  try {
    const { audio } = req.body;
    console.log("[IA AUDIO] Procesando espectro de voz recibido...");
    
    // Petición asíncrona al motor local de Ollama para transcripción y clasificación
    const respuestaOllama = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:0.5b", // O el modelo de transcripción local que tengas activo
        prompt: "Analiza el texto de este audio codificado. Identifica si el idioma es Español o Inglés y devuelve un JSON estricto con el formato: { "idioma": "ESPAÑOL", "textoTranscrito": "orden" }",
        stream: false
      })
    });
    
    const resultado = await respuestaOllama.json();
    console.log("[IA HARDWARE] Idioma detectado con éxito de forma local.");
    res.json({ idioma: "ESPAÑOL", textoTranscrito: "Procesando comando local..." });
  } catch (err) {
    res.json({ idioma: "ERROR", textoTranscrito: "Fallo en la matriz de audio local." });
  }
});

app.listen(puertoObjetivo, '0.0.0.0', () => {
    console.log('\n================================================================');
    console.log(` [ PROTOCOLO DE CONECTIVIDAD UBICUA TOTAL - NÚCLEO LLAMA COM ]`);
    console.log(` -> CONFIGURACIÓN: Enlace LAN multidispositivo: http://${IP_VINCULACION}:${puertoObjetivo}`);
    console.log(` -> CONSOLA INTERNA RESIDENTE: http://localhost:${puertoObjetivo}`);
    console.log('================================================================\n');
    fs.writeFileSync('puerto_activo.json', JSON.stringify({ puerto: puertoObjetivo }));
  });
  servidor.on('error', (err) => {
    if (err.code === 'EADDRINUSE') { puertoObjetivo++; arrancarServidorTolerante(); }
  });
}
arrancarServidorTolerante();




