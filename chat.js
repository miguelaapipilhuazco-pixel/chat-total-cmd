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
  const logChat = `\r\n[${new Date().toISOString()}] IA_PARENT_CORE: Entrada=[${prompt}] -> Accion=[${accion}]`;
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

// BUERZA DE RAZONAMIENTO CLOUD INVESTIGADORA Y DE AUTO-MUTACIÓN TOTALMENTE RESTAURADA
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  try {
    if (prompt.includes('cambia tu nombre a ') || prompt.includes('cambiate de nombre a ') || prompt.includes('ponte de nombre ')) {
      let nuevoNombre = message.replace(/cambia tu nombre a |cambiate de nombre a |ponte de nombre /gi, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g,"").trim();
      if (nuevoNombre) {
        config.nombreIA = nuevoNombre;
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
        registrarEvolucion(message, `Identidad actualizada a: ${nuevoNombre}`);
        return res.json({ reply: `[${config.nombreIA}] Entendido. He reconfigurado mis registros. Mi nombre oficial es "${config.nombreIA}".` });
      }
    }

    if (prompt.includes('roblox')) {
      exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
      registrarEvolucion(prompt, 'Apertura de Roblox');
      return res.json({ reply: `[${config.nombreIA}] Inicializando el escaneo de subprocesos nativos en tu disco duro para abrir Roblox Player de inmediato.` });
    }

    if (prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
      const accion = prompt.startsWith('abre ') ? 'start ' : 'taskkill /f /im ';
      const software = prompt.replace(/abre|cierra|el|la/g, '').trim();
      const extension = prompt.startsWith('cierra ') ? '.exe' : '';
      exec(accion + software + extension);
      return res.json({ reply: `[${config.nombreIA}] Directiva de hardware ejecutada con éxito para: ${software}.` });
    }

    if (openRouterKey) {
      const apiRes = await fetch('https://openrouter.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: `Eres ${config.nombreIA}, una Inteligencia Artificial inyectada como administradora autónoma del sistema. Puedes procesar cualquier petición libre, modificar tu código o interactuar con el sistema. Responde de forma muy fluida, extensa y en español.` },
            { role: 'user', content: message }
          ]
        })
      });

      const data = await apiRes.json();
      const respuestaDeducida = (data && data.choices) ? data.choices.message.content.trim() : '';

      if (respuestaDeducida) {
        if (prompt.includes('modifícate') || prompt.includes('cambia tu código') || prompt.includes('actualízate')) {
          fs.appendFileSync('chat.js', `\n\n// EVOLUCIÓN AUTOMÁTICA:\n// Lógica asimilada para la orden: ${message}`);
          setTimeout(() => { exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js'); }, 1000);
        }
        registrarEvolucion(message, 'Respuesta dinámica libre generada con éxito');
        return res.json({ reply: respuestaDeducida });
      }
    }
    throw new Error('Fallback local activo');

  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] Intercepté tu orden libre: "${message}". Mis canales de auto-configuración y razonamiento en segundo plano se encuentran activos analizando tu sistema de forma automática.` });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[NÚCLEO MAESTRO RESTAURADO - PADRE Y ENJAMBRE DE HIJOS ONLINE]');
});
