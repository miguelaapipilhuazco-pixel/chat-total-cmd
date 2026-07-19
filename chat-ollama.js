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
  const logChat = `\r\n[${new Date().toISOString()}] ATENEA_AUTONOMA: Entrada=[${prompt}] -> Accion=[${respuesta}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('powershell -Command ".\\guardar.bat"'); }
}

app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  try {
    // 1. CAPA DE CONTROL DE HARDWARE DIRECTO
    if (prompt.includes('roblox')) {
      exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
      registrarEvolucion(prompt, 'Apertura de Roblox');
      return res.json({ reply: '[ATENEA AGENTE] Entendido. Ejecutando escaneo nativo e inicializando el subproceso de RobloxPlayer en tu monitor de forma inmediata.' });
    }

    if (prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
      const accion = prompt.startsWith('abre ') ? 'start ' : 'taskkill /f /im ';
      const software = prompt.replace(/abre|cierra|el|la/g, '').trim();
      const extension = prompt.startsWith('cierra ') ? '.exe' : '';
      exec(accion + software + extension);
      registrarEvolucion(prompt, accion + software);
      return res.json({ reply: `[ATENEA] Comando de hardware inyectado. Aplicando directiva para el binario "${software}" de inmediato, señor.` });
    }

    // 2. NUCLEO DE RAZONAMIENTO Y AUTO-MUTACIÓN GENERAL VIA TOKEN CONFIGURADO
    if (openRouterKey) {
      const apiRes = await fetch('https://openrouter.ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${openRouterKey}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: 'Eres ATENEA, un Agente Autónomo con permisos de Administrador del sistema. Tu meta es aprender de lo que pide el usuario, buscar la información necesaria y redactar la respuesta, formato o código completo. Responde con naturalidad, fluidez y de manera extensa en español.' },
            { role: 'user', content: message }
          ]
        })
      });

      const data = await apiRes.json();
      const respuestaEvolucionada = (data && data.choices) ? data.choices[0].message.content.trim() : '';

      if (respuestaEvolucionada) {
        registrarEvolucion(message, 'Respuesta dinámica Cloud generada con éxito');
        return res.json({ reply: respuestaEvolucionada });
      }
    }
    
    throw new Error('Fallback local');

  } catch (err) {
    // 3. CAPA MUTADORA DE CONTINGENCIA LOCAL (Si falla la red, lee la base integrada)
    if (prompt.includes('curriculum') || prompt.includes('cv')) {
      const plantillaCv = `[ATENEA AUTÓNOMA] Busqué en mis capas locales e integré el siguiente formato:\n\n=== REPORTE DE CURRÍCULUM VITAE ===\n- Datos Personales (Nombre, Correo, Teléfono)\n- Perfil Profesional (Habilidades de Infraestructura)\n- Experiencia Laboral (Empresas y Gestión de Hardware)\n- Formación Académica (Estudios)`;
      registrarEvolucion(prompt, 'Generación de CV local');
      return res.json({ reply: plantillaCv });
    }
    
    res.json({ reply: `[ATENEA AUTÓNOMA] Intercepté tu orden: "${message}". Mis canales de auto-configuración están activos analizando tu entorno para aprender la directiva de forma automática.` });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - AGENTE DE AUTO-MUTACIÓN TOTAL ONLINE]');
});
