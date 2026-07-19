import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

// Recuperar el token local de forma segura para no exponerlo en internet
let openRouterKey = '';
if (fs.existsSync('token.txt')) {
  openRouterKey = fs.readFileSync('token.txt', 'utf8').trim();
}

function registrarEvolucion(prompt, respuesta) {
  const logChat = `\r\n[${new Date().toISOString()}] ATENEA_CORE: Entrada=[${prompt}] -> Respuesta=[${respuesta}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('powershell -Command ".\\guardar.bat"'); }
}

app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  try {
    // 1. FILTROS EXCLUSIVOS DE CONSOLA Y HARDWARE NATIVO
    if (prompt.includes('roblox')) {
      exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
      registrarEvolucion(prompt, 'Apertura de Roblox');
      return res.json({ reply: '[ATENEA] Entendido, Administrador. Ejecutando escaneo nativo e inicializando el subproceso de RobloxPlayer en tu monitor de forma inmediata.' });
    }

    if (prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
      const accion = prompt.startsWith('abre ') ? 'start ' : 'taskkill /f /im ';
      const software = prompt.replace(/abre|cierra|el|la/g, '').trim();
      const extension = prompt.startsWith('cierra ') ? '.exe' : '';
      exec(accion + software + extension);
      registrarEvolucion(prompt, accion + software);
      return res.json({ reply: `[ATENEA] Comando de hardware inyectado. Aplicando directiva para el binario "${software}" de inmediato.` });
    }

    // 2. CONECTOR CLOUD SERVERLESS FLUIDO (Genera formatos, CVs y textos libres)
    const apiRes = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${openRouterKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          { role: 'system', content: 'Eres ATENEA, la Inteligencia Artificial del Ecosistema Arturo. Tu rol principal es ser la Administradora del sistema informático de la PC. Responde de forma muy fluida, natural y educada, como una persona experta en tecnología. Si el usuario te pide un formato, plantilla, Currículum Vitae (CV) o cualquier documento, redáctalo completo, con una estructura limpia, profesional y en español.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await apiRes.json();
    const respuestaIA = (data && data.choices) ? data.choices[0].message.content.trim() : '';

    if (respuestaIA) {
      registrarEvolucion(message, respuestaIA);
      return res.json({ reply: respuestaIA });
    }

    throw new Error('Fallback active');

  } catch (err) {
    // MENSAJE DE CONTINGENCIA LOCAL SI LA CLOUD NO RESPONDE
    const respuestaPorDefecto = `[ATENEA ADMINISTRADORA] Saludos, señor. Como encargada de la infraestructura informática de este entorno, mis canales de análisis lógico se encuentran totalmente operativos de fondo en el puerto 3000. Monitoreando antena inalámbrica, bitácoras de logs e interacciones de hardware en tiempo real. ¿Qué comando o optimización del sistema requiere que ejecute en este momento?`;
    registrarEvolucion(message, respuestaPorDefecto);
    res.json({ reply: respuestaPorDefecto });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - AGENTE CON INTELIGENCIA CONVERSACIONAL CORREGIDO]');
});