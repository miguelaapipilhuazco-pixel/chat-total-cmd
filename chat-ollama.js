import ollama from 'ollama';
import express from 'express';
import { Server } from 'node-ssdp';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modeloActual = 'llama3.2:1b';
async function procesarComandos(text) {
  const prompt = text.toLowerCase().trim();
  if (prompt.startsWith( 'descarga ' )) {
    const modelo = text.split( ' ' ).pop();
    exec(`ollama pull ${modelo}`);
    return `Descargando el modelo de IA: ${modelo} en segundo plano de la matriz.`;
  }
  if (prompt.startsWith( 'clona ' )) {
    const repo = text.split( ' ' ).pop();
    exec(`git clone https://github.com{repo}`);
    return `Clonando la herramienta Open Source: ${repo}`;
  }
  return null;
}
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const cmd = await procesarComandos(message);
    if (cmd) return res.json({ reply: cmd });
    const response = await ollama.chat({ model: modeloActual, messages: [{ role: 'user', content: message }] });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Fallo de comunicacion en el agente de red.' }); }
});
const ssdpServer = new Server({ location: 'http://localhost:3000/manifest.json' });
ssdpServer.addUSN( 'upnp:rootdevice' );
app.listen(3000, '0.0.0.0', () => {
  ssdpServer.start();
  console.log('\n[AGENTE MULTI-IA UNIVERSAL ACTIVADO SOBRE UPnP/WI-FI]'\);
  console.log('Pintando icono de red interactivo en el panel de control del sistema...\n' );
});
