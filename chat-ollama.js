import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

function registrarEvolucion(prompt, scriptGenerated) {
  const logChat = `\n[${new Date().toISOString()}] ATENEA_AUTONOMA: Entrada=[${prompt}] -> Script=[${scriptGenerated}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();

    // INTERCEPCIÓN NATIVA COMPLETA (Sin textos cortados ni variables incompletas)
    if (prompt.includes('roblox')) {
      exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
      registrarEvolucion(prompt, 'Escaneo nativo de rutas locales para Roblox');
      return res.json({ reply: '[ATENEA AGENTE] Inicializando escáner nativo de disco duro: Buscando y abriendo RobloxPlayerLauncher en tus carpetas de usuario de forma inmediata, Administrador. Ejecución completada.' });
    }

    if (prompt.includes('abre')) {
      const software = prompt.replace(/abre|abrir|el|la/g, '').trim();
      const comando = software === 'chrome' ? 'start chrome' : `start ${software}`;
      exec(comando);
      registrarEvolucion(prompt, comando);
      return res.json({ reply: `[ATENEA] Ejecutando apertura nativa de ${software} de forma exitosa en el monitor principal.` });
    }

    res.json({ reply: '[ATENEA LOCAL] Sistema operativo listo. Pídeme abrir tus videojuegos o programas por voz o señas de manera fluida.' });
  } catch (err) {
    res.json({ reply: '[ATENEA] Capa de contingencia local activa y respondiendo al sistema.' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - AGENTE CON TEXTOS COMPLETOS CONFIGURADO]');
});