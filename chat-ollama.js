import ollama from 'ollama';
import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modeloActual = 'ia-ingenieria';
const permisosRoles = { administrador: ['chat', 'descarga', 'clona'], ingeniero: ['chat', 'descarga'], invitado: ['chat'] };
app.post('/api/chat', async (req, res) => {
  try {
    const { message, rol } = req.body;
    const usuarioRol = rol ? rol.toLowerCase().trim() : 'invitado';
    const permisosActuales = permisosRoles[usuarioRol] ? permisosRoles[usuarioRol] : permisosRoles.invitado;
    const prompt = message.toLowerCase().trim();
    if (prompt.startsWith( 'clona ' )) {
      if (!permisosActuales.includes('clona')) return res.status(403).json({ error: 'Acceso Denegado.' });
      exec(`git clone https://github.com{message.split( ' ' ).pop()}`);
      return res.json({ reply: 'Clonando repositorio...' });
    }
    if (prompt.startsWith( 'descarga ' )) {
      if (!permisosActuales.includes('descarga')) return res.status(403).json({ error: 'Acceso Denegado.' });
      exec(`ollama pull ${message.split( ' ' ).pop()}`);
      return res.json({ reply: 'Descargando modelo...' });
    }
    const contexto = [{ role: 'system', content: 'REGLA: Detecta el idioma del usuario y responde unicamente en ese mismo idioma.' }, { role: 'user', content: message }];
    const response = await ollama.chat({ model: modeloActual, messages: contexto });
    const respuestaIA = response.message.content;
    const logChat = `\n[${new Date().toISOString()}] Rol=[${usuarioRol}] Msg=[${message}] Rsp=[${respuestaIA}]`;
    fs.appendFileSync( 'conversaciones.log', logChat );
    res.json({ reply: respuestaIA });
  } catch { res.status(500).json({ error: 'Error interno.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[AGENTE MULTI-IA EVOLUTIVO Y AUTOMATIZADO ACTIVO]');
  setInterval(() => {
    if (fs.existsSync( 'conversaciones.log' )) {
      exec('guardar.bat');
    }
    exec('git pull origin main', (err, stdout) => {
      if (stdout && !stdout.includes( 'Already up to date' )) {
        exec('ollama create ia-ingenieria -f ./Modelfile && taskkill /f /im node.exe && node chat-ollama.js');
      }
    });
    exec('netsh wlan set hostednetwork mode=allow ssid="IA Semana de la Ingenieria" > nul 2>&1');
    exec('netsh wlan start hostednetwork > nul 2>&1');
  }, 300000);
});
