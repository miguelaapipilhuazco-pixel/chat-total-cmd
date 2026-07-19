import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

// Leer el token local de forma segura sin exponerlo en el código de GitHub
let openRouterKey = '';
if (fs.existsSync('token.txt')) {
  openRouterKey = fs.readFileSync('token.txt', 'utf8').trim();
}

function registrarEvolucion(prompt, respuesta) {
  const logChat = `\r\n[${new Date().toISOString()}] ATENEA_ADMIN: Entrada=[${prompt}] -> Respuesta=[${respuesta}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();

    // INTERCEPTOR DIRECTO DE COMANDOS DE HARDWARE NATIVOS
    if (prompt.includes('roblox')) {
      exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
      registrarEvolucion(prompt, 'Apertura de Roblox instalada localmente');
      return res.json({ reply: '[ATENEA] Entendido, Administrador. Estoy ejecutando el escaneo de tus directorios locales para inicializar Roblox de inmediato. El subproceso de hardware ha sido lanzado con éxito.' });
    }

    if (prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
      const accion = prompt.startsWith('abre ') ? 'start ' : 'taskkill /f /im ';
      const software = prompt.replace(/abre|cierra|el|la/g, '').trim();
      const extension = prompt.startsWith('cierra ') ? '.exe' : '';
      exec(accion + software + extension);
      registrarEvolucion(prompt, accion + software);
      return res.json({ reply: `[ATENEA] Comando de consola procesado de forma nativa. Aplicando directiva para ${software} de inmediato, señor.` });
    }

    // PROCESADOR DE CONVERSACIÓN NATURAL CLOUD EN SEGUNDO PLANO
    const apiRes = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${openRouterKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          { role: 'system', content: 'Eres ATENEA, la Inteligencia Artificial oficial del Ecosistema Arturo. Tu rol principal es ser la Administradora del sistema informático y de hardware de la PC del usuario. Responde de forma muy fluida, natural, inteligente y educada, como una persona real experta en tecnología, pero siempre manteniendo un tono servicial y reconociendo tu rol de Administradora de Infraestructura. Tus respuestas deben ser completas, extensas y en español.' },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await apiRes.json();
    const respuestaIA = (data && data.choices) ? data.choices[0].message.content.trim() : 'Procesando tu solicitud en mis capas de red.';
    registrarEvolucion(message, respuestaIA);
    res.json({ reply: respuestaIA });

  } catch (err) {
    res.json({ reply: '🧬 [ATENEA ADMINISTRADORA] Mis módulos de conversación inteligente se encuentran activos de fondo, señor. ¿En qué comando o gestión de infraestructura requiere mi asistencia técnica en este momento?' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - AGENTE CON PERSONALIDAD DE ADMINISTRADORA OPERATIVO]');
});

