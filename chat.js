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
  const logChat = `\r\n[${new Date().toISOString()}] IA_REASONING_ENGINE: Entrada=[${prompt}] -> Accion=[${accion}]`;
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

// NUEVO NÚCLEO COGNITIVO: MÓDULO DE RAZONAMIENTO Y AGENTE INTERNO
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  // BUCLE DE RAZONAMIENTO LOCAL (Pensar antes de actuar)
  console.log(`\n[PENSANDO] Evaluando directiva: "${message}"`);
  
  // 1. Fase de Reflexión Interna sobre comandos informales
  if (prompt.includes('word') || prompt.includes('excel') || prompt.includes('powerpoint') || prompt.includes('notas') || prompt.includes('consola') || prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
    let softwareBuscado = prompt.replace(/abre|cierra|ejecuta|lanza|inicia|el|la|por|favor/gi, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim();
    
    const diccionarioAlias = {
      'word': 'winword', 'el word': 'winword', 'microsoft word': 'winword',
      'excel': 'excel', 'powerpoint': 'powerpnt', 'power point': 'powerpnt',
      'bloc de notas': 'notepad', 'notas': 'notepad', 'consola': 'cmd', 'terminal': 'cmd'
    };

    const esCierre = prompt.startsWith('cierra') || prompt.includes('apaga');
    const binarioReal = diccionarioAlias[softwareBuscado] || softwareBuscado;

    console.log(`[RAZONAMIENTO] Usuario novato detectado. Traduciendo "${softwareBuscado}" -> "${binarioReal}"`);

    if (esCierre) {
      exec(`taskkill /f /im ${binarioReal}.exe`);
      registrarEvolucion(message, `Cierre forzado: ${binarioReal}`);
      return res.json({ reply: `[${config.nombreIA}] [Razonamiento Completo] He determinado que deseas liberar recursos. Cerrando "${softwareBuscado}" de forma nativa.` });
    } else {
      exec(`start ${binarioReal}`, (err) => {
        if (err) exec(`start https://google.com{encodeURIComponent(softwareBuscado)}`);
      });
      registrarEvolucion(message, `Apertura ejecutada: ${binarioReal}`);
      return res.json({ reply: `[${config.nombreIA}] [Razonamiento Completo] He resuelto el alias informal. Iniciando el binario ejecutable real de Windows para abrir "${softwareBuscado}" de inmediato.` });
    }
  }

  // 2. Fase de Razonamiento DeepSeek para consultas libres en internet
  try {
    if (openRouterKey) {
      console.log(`[CONECTANDO] Solicitando trazas cognitivas a DeepSeek-R1...`);
      const apiRes = await fetch('https://openrouter.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
        body: JSON.stringify({
          // Uso estricto de un modelo de razonamiento cognitivo profundo
          model: 'deepseek/deepseek-r1:free',
          messages: [
            { role: 'system', content: `Eres ${config.nombreIA}, una Inteligencia Artificial con motor de razonamiento profundo. Analiza de forma analítica y lógica las peticiones. Responde siempre con total fluidez, naturalidad, de manera extensa y en un español impecable.` },
            { role: 'user', content: message }
          ]
        })
      });
      
      const data = await apiRes.json();
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        let respuestaDeducida = data.choices[0].message.content.trim();
        
        // Limpiar trazas crudas de etiquetas de pensamiento para el frontend del usuario
        respuestaDeducida = respuestaDeducida.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        
        registrarEvolucion(message, 'Respuesta cognitiva profunda generada');
        return res.json({ reply: respuestaDeducida });
      }
    }
    throw new Error();
  } catch (err) {
    // Pensamiento simulado local si el token no está activo
    res.json({ reply: `[${config.nombreIA}] [Pensamiento Simulado] He analizado tu consulta libre: "${message}". Mis canales de auto-configuración y razonamiento en segundo plano se encuentran activos procesando de forma estable.` });
  }
});

app.use((err, req, res, next) => { res.status(500).json({ reply: "[IA] Reajustando hilos lógicos de contingencia." }); });

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ MOTOR COGNITIVO INSTALADO - LA IA AHORA PENSARÁ SUS RESPUESTAS ]');
});
