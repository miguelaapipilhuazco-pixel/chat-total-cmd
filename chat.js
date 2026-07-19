import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

function registrarEvolucion(prompt, accion) {
  const logChat = `\n[${new Date().toISOString()}] ATENEA_RENAME: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('powershell -Command ".\\guardar.bat"'); }
}

app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();

  try {
    // INTERCEPTOR DE CAMBIO DE NOMBRE DEL ARCHIVO EN CALIENTE
    if (prompt.includes('cambiale de nombre a chat.js') || prompt.includes('renombra a chat.js')) {
      const rutaActual = 'chat-ollama.js';
      const rutaNueva = 'chat.js';
      
      // Registrar la evolución en los logs antes de mutar el nombre del archivo
      registrarEvolucion(message, `Renombrando nucleo de ${rutaActual} a ${rutaNueva}`);
      
      // Mutación física del nombre del archivo en el disco duro de la PC
      setTimeout(() => {
        fs.renameSync(rutaActual, rutaNueva);
        // Forzar reinicio automático invisible con el nuevo nombre
        exec('powershell -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue; Start-Process node -ArgumentList chat.js -WindowStyle Hidden"');
      }, 500);

      return res.json({ reply: '[ATENEA MUTADORA] Entendido, señor. He interceptado la directiva de infraestructura. Modifiqué mis capas lógicas, renombré de forma física mi archivo central "chat-ollama.js" a "chat.js" en tu disco duro y reconfiguré el arranque automático en segundo plano.' });
    }

    // CONTROL DE JUEGOS Y HARDWARE DIRECTO
    if (prompt.includes('roblox')) {
      exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
      return res.json({ reply: '[ATENEA AGENTE] Inicializando el escáner del sistema para abrir RobloxPlayerLauncher de forma inmediata.' });
    }

    if (prompt.startsWith('abre ') || prompt.startsWith('cierra ')) {
      const accion = prompt.startsWith('abre ') ? 'start ' : 'taskkill /f /im ';
      const software = prompt.replace(/abre|cierra|el|la/g, '').trim();
      const extension = prompt.startsWith('cierra ') ? '.exe' : '';
      exec(accion + software + extension);
      return res.json({ reply: `[ATENEA] Comando ejecutado con éxito para el binario "${software}".` });
    }

    res.json({ reply: '[ATENEA] Sistema listo de fondo en el puerto 3000. Esperando tus comandos de infraestructura, señor.' });

  } catch (err) {
    res.json({ reply: '[ATENEA] Error en la capa de reconfiguración de archivos.' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - MOTOR DE MUTACIÓN DE ARCHIVOS OPERATIVO]');
});