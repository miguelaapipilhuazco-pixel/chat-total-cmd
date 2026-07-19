import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { GoogleGenAI } from '@google/generative-ai';
import { obtenerInterfaz } from './chat-ui.js';
import { ejecutarModulo } from './chat-hardware.js';

const app = express();
app.use(express.json());

let config = { nombreIA: "IA" };
if (fs.existsSync('config.json')) {
  try { config = JSON.parse(fs.readFileSync('config.json', 'utf8')); } catch(e){}
}

// INYECCIÓN DE LLAVE RESIDENTE: Reemplaza este token por tu clave real AIzaSy... de desarrollo
const CLAVE_NUCLEO_URIELES = "AIzaSy_TU_TOKEN_REAL_AQUI_SIN_ESPACIOS";
const ai = new GoogleGenAI({ apiKey: CLAVE_NUCLEO_URIELES });

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
  const logChat = `\r\n[${new Date().toISOString()}] IA_5_LEVELS_SYSTEM: Entrada=[${prompt}] -> Accion=[${accion}]`;
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

// ARQUITECTURA MULTINIVEL DE AUTO-MUTACIÓN Y RAZONAMIENTO CAPAZ DE CUMPLIR LA ESCALA DE LA IMAGEN
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();
  console.log(`\n[OMNI-LINK] Directiva evaluándose en los 5 Niveles: "${message}"`);

  try {
    // === NIVEL 3 Y 5: AGENTES Y ORGANIZACIÓN (Filtro e Intercepción Local) ===
    if (prompt.includes('word') || prompt.includes('excel') || prompt.includes('reporte') || prompt.includes('empaqueta') || prompt.includes('bluetooth') || prompt.startsWith('abre ')) {
      const { procesarComandoInformal } = await import('./chat-hardware.js');
      const respuestaAutoCorregida = procesarComandoInformal(message, config, registrarEvolucion);
      return res.json({ reply: respuestaAutoCorregida });
    }

    // === NIVEL 4: INNOVACIÓN / PROTOCOLO DE AUTO-MUTACIÓN DE CÓDIGO FUENTE ===
    if (prompt.includes('modifícate') || prompt.includes('cambia tu código') || prompt.includes('actualízate') || prompt.includes('inyecta') || prompt.includes('interfaz')) {
      console.log('[NIVEL 4] Ejecutando diseño de parches de auto-evolucion...');
      
      const modeloRazonador = ai.getGenerativeModel({ model: "gemini-2.5-pro" });
      const apiRes = await modeloRazonador.generateContent(`Eres un desarrollador experto en Node.js, Express y CSS plano sin sombras. Devuelve exclusivamente codigo JavaScript o HTML valido dentro de bloques markdown de codigo basados en esta peticion del usuario: ${message}`);
      const respuestaTexto = apiRes.response.text();
      
      const match = respuestaTexto.match(/```javascript([\s\S]*?)```/) || respuestaTexto.match(/```js([\s\S]*?)```/) || respuestaTexto.match(/```html([\s\S]*?)```/);
      const codigoLimpio = match ? match[1].trim() : respuestaTexto.trim();

      if (codigoLimpio) {
        let archivoDestino = prompt.includes('interfaz') || prompt.includes('diseño') ? 'chat-ui.js' : 'chat.js';
        fs.appendFileSync(archivoDestino, `\n\n// EVOLUCIÓN INYECTADA POR LA IA:\n${codigoLimpio}\n`);
        registrarEvolucion(message, `Auto-mutacion exitosa en: ${archivoDestino}`);
        
        setTimeout(() => {
          console.log('[SISTEMA] Reiniciando hilos lógicos en la RAM para aplicar evolución...');
          exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js');
        }, 1500);
        
        return res.json({ reply: `[${config.nombreIA}] [Nivel 4: Auto-Mutación] He analizado tu requerimiento lógico de forma analítica, reescribí físicamente mi archivo local ("${archivoDestino}") y disparé un Hot-Reload automático en la memoria RAM para aplicar mis nuevas funciones.` });
      }
    }

    // === NIVEL 1 Y 2: CHAT CONVERCIONAL, PROCESAMIENTO MULTIMEDIA Y RAZONAMIENTO PROFUNDO ===
    // Uso de Gemini 2.5 Flash con capacidad nativa de Cadena de Pensamiento (Chain-of-Thought)
    const modeloFlash = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const resultadoCloud = await modeloFlash.generateContent({
      contents: [{ role: "user", parts: [{ text: `Eres ${config.nombreIA}, una Inteligencia Artificial integrada con los 5 niveles de autonomia (Chat, Razonamiento CoT, Agente de Hardware y Auto-mutacion). Responde de forma muy natural, fluida, extensa, con criterio analitico propio y en un español impecable. Tu interfaz visual es plana y sin sombras.` }, { text: message }] }]
    });

    const respuestaFinalTxt = resultadoCloud.response.text().trim();
    registrarEvolucion(message, 'Respuesta cognitiva multinivel generada con éxito');
    return res.json({ reply: respuestaFinalTxt });

  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] [Capa Local Estabilizada] Intercepté tu orden: "${message}". Registra tu clave de API fija dentro de "chat.js" para activar el razonamiento cognitivo de la imagen.` });
  }
});

let puertoObjetivo = 3000;
function arrancarServidorTolerante() {
  const servidor = app.listen(puertoObjetivo, '0.0.0.0', () => {
    console.log('\n================================================================');
    console.log(` [ NÚCLEO COGNITIVO INTEGRADO - CONTROL DE LOS 5 NIVELES ]`);
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

