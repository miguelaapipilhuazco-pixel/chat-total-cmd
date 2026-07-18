import ollama from 'ollama';
import express from 'express';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modeloActual = 'llama3.2:1b';
async function evaluarDescargas(text) {
  const prompt = text.toLowerCase().trim();
  if (prompt.startsWith( 'descarga ' )) {
    const modelo = text.split( ' ' ).pop();
    exec(`ollama pull ${modelo}`);
    return `Iniciando instalacion remota de: ${modelo} en la matriz local.`;
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
    const cmd = await evaluarDescargas(message);
    if (cmd) return res.json({ reply: cmd });
    const response = await ollama.chat({ model: modeloActual, messages: [{ role: 'user', content: message }] });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Error de procesamiento en red.' }); }
});
// El puerto 0 asigna una ruta dinamica libre de forma automatica ante el sistema operativo
const server = app.listen(0, '0.0.0.0', () => {
  const puertoAsignado = server.address().port;
  console.log('\n[AGENTE MULTI-IA INCORPORADO DE FORMA AUTOMµTICA EN TU RED]');
  console.log('Puerto seguro asignado din micamente: ' + puertoAsignado);
  // Forzar al sistema operativo a registrar el adaptador virtual inalambrico
});
