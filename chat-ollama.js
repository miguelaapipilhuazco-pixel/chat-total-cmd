import ollama from 'ollama';
import express from 'express';
import readline from 'readline';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modeloActual = 'llama3.2:1b';
const messages = [{ role: 'system', content: 'Agente IA central orquestador de descargas y herramientas Open Source.' }];
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
async function procesarComandos(text) {
  const prompt = text.toLowerCase().trim();
  if (prompt.startsWith( 'descarga ' )) {
    const modelo = text.split( ' ' ).pop();
    exec(`ollama pull ${modelo}`);
    return `Instalando el modelo [${modelo}] en segundo plano en la matriz de red.`;
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
    messages.push({ role: 'user', content: message });
    const response = await ollama.chat({ model: modeloActual, messages });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Fallo de comunicacion en el agente de red.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[AGENTE MULTI-IA ACTIVADO CON SOPORTE INALµMBRICO UNIVERSAL]'\);
  console.log('Con‚ctate por Wi-Fi o Bluetooth apuntando al puerto 3000\n' );
});
