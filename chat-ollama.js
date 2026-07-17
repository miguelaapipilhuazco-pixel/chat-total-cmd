import ollama from 'ollama';
import express from 'express';
import readline from 'readline';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

// Modelo base por defecto al iniciar
let modeloActual = 'llama3.2:1b';
const messages = [{ role: 'system', content: 'Eres un sistema operativo IA central capaz de autogestionarse y descargar otras herramientas.' }];
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// PROCESADOR DE ORDENES AVANZADAS: Descargas y cambios de modelo
async function evaluarComandosSistema(text) {
  const prompt = text.toLowerCase().trim();

  // 1. Comando para cambiar de Inteligencia Artificial al vuelo
  if (prompt.startsWith('cambia a ') || prompt.startsWith('usa la ia ')) {
    const nuevoModelo = text.split(' ').pop();
    modeloActual = nuevoModelo;
    return `Cerebro actualizado. A partir de ahora procesaré tus peticiones utilizando el modelo: ${nuevoModelo}.`;
  }

  // 2. Comando para descargar cualquier IA que le pidas
  if (prompt.includes('descarga') && (prompt.includes('gemma') || prompt.includes('phi') || prompt.includes('mistral') || prompt.includes('llama') || prompt.includes('qwen'))) {
    const modeloADescargar = text.split(' ').pop();
    console.log(`\n[NÚCLEO SYSTEM] Iniciando descarga remota de: ${modeloADescargar}`);
    
    // Ejecuta el pull directo en el motor de Ollama
    exec(`ollama pull ${modeloADescargar}`, (err) => {
      if (err) console.error(`Error al descargar el modelo ${modeloADescargar}`);
      else console.log(`[NÚCLEO SYSTEM] Modelo ${modeloADescargar} listo para usar.`);
    });
    return `He interceptado tu orden. He comenzado la descarga en segundo plano de la IA [${modeloADescargar}]. Te avisaré cuando esté lista.`;
  }

  // 3. Comando para clonar herramientas Open Source desde cualquier link de GitHub
  if (prompt.includes('descarga github') || prompt.includes('clona herramienta')) {
    const urlRepo = text.split(' ').pop();
    const nombreCarpeta = urlRepo.split('/').pop();
    console.log(`\n[NÚCLEO SYSTEM] Clonando repositorio Open Source: ${urlRepo}`);
    
    exec(`git clone https://github.com{urlRepo} ~/chat-cmd/chat-total-cmd/${nombreCarpeta}`, (err) => {
      if (err) console.error(`Fallo al clonar repositorio de GitHub.`);
      else console.log(`[NÚCLEO SYSTEM] Herramienta Open Source guardada exitosamente.`);
    });
    return `Perfecto. Estoy descargando el repositorio Open Source "${urlRepo}" directamente en tu almacenamiento local.`;
  }

  return null;
}

// INTERFAZ DE CONSOLA LOCAL
async function startLocalPrompt() {
  rl.question(`\x1b[35m>>> [IA ACTUAL: ${modeloActual}]: \x1b[0m`, async (input) => {
    if (input.toLowerCase() === 'salir') { rl.close(); process.exit(0); }

    const comandoProcesado = await evaluarComandosSistema(input);
    if (comandoProcesado) {
      console.log(`\n\x1b[32m>>> Sistema:\x1b[0m ${comandoProcesado}\n`);
      startLocalPrompt();
      return;
    }

    messages.push({ role: 'user', content: input });
    try {
      // Consume dinámicamente el modelo que esté activo en ese instante
      const response = await ollama.chat({ model: modeloActual, messages });
      console.log(`\n\x1b[32m>>> IA:\x1b[0m ${response.message.content}\n`);
      messages.push({ role: 'assistant', content: response.message.content });
    } catch {
      console.error(`\nError: Asegúrate de haber descargado el modelo "${modeloActual}" ejecutando 'descarga ${modeloActual}'\n`);
    }
    startLocalPrompt();
  });
}

// ENDPOINT PARA LA APLICACIÓN MÓVIL (.APK)
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const comandoProcesado = await evaluarComandosSistema(message);
    if (comandoProcesado) return res.json({ reply: comandoProcesado });

    messages.push({ role: 'user', content: message });
    const response = await ollama.chat({ model: modeloActual, messages });
    messages.push({ role: 'assistant', content: response.message.content });
    res.json({ reply: response.message.content });
  } catch {
    res.status(500).json({ error: `El modelo ${modeloActual} no responde o no está descargado.` });
  }
});

// Levantar el servidor de red inalámbrico
app.listen(3000, '0.0.0.0', () => {
  console.log('\n\x1b[32m[NÚCLEO MULTI-IA DESPLEGADO EN EL PUERTO 3000]\x1b[0m\n');
  startLocalPrompt();
});
