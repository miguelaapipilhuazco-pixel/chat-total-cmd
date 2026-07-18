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
    return `Descargando el modelo de IA: ${modelo} en segundo plano en la matriz virtual.`;
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
    const response = await ollama.chat({ model: modeloActual, messages: [{ role: 'user', content: message }]  tram });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Error de procesamiento en red.' }); }
});
// Escuchar en el puerto 0 fuerza a Windows/Android a asignar un puerto libre aleatorio de forma automatica
const server = app.listen(0, '0.0.0.0', () => {
  const puertoLibre = server.address().port;
  const ssdpServer = new Server({ location: 'http://localhost:' + puertoLibre + '/manifest.json' });
  ssdpServer.addUSN( 'upnp:rootdevice' );
  ssdpServer.start();
  console.log('\n[AGENTE MULTI-IA CENTRAL DESPLEGADO AUTOMµTICAMENTE]'\);
  console.log('Asignado puerto dinamico seguro: ' + puertoLibre);
  console.log('Emitiendo se¤al universal por Wi-Fi y Bluetooth...\n' );
});
