import ollama from 'ollama';
import express from 'express';
import readline from 'readline';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

const messages = [{ 
  role: 'system', 
  content: 'Eres un sistema operativo IA. Si te piden descargar un modelo de IA o un repositorio de GitHub, confírmalo y ejecútalo.' 
}];
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// FUNCIÓN CLAVE: Fuerza a Android a renderizar la ventana de estado arriba mediante comandos del sistema
function renderizarMosaicoSistema() {
  const comandoAndroid = 'am start-activity -a android.intent.action.MAIN -n com.android.settings/.Settings\\$NOTIFICATION_HISTORY > /dev/null 2>&1';
  exec(comandoAndroid);
  
  // Imprime un aviso visual temporal nativo directo en la pantalla del móvil
  exec('am broadcast -a android.intent.action.FACTORY_TEST --es info "🤖 MODO IA LOCAL ACTIVADO" > /dev/null 2>&1');
}

async function procesarDescargaIA(text) {
  const prompt = text.toLowerCase();
  
  if (prompt.includes('descarga') && (prompt.includes('gemma') || prompt.includes('phi') || prompt.includes('mistral') || prompt.includes('llama'))) {
    const modelo = text.split(' ').pop();
    exec(`ollama pull ${modelo}`);
    return `Comando aceptado por consola. Descargando la IA: ${modelo} en segundo plano.`;
  }

  if (prompt.includes('descarga') && (prompt.includes('github') || prompt.includes('herramienta'))) {
    const repo = text.split(' ').pop();
    exec(`git clone https://github.com{repo} ~/chat-cmd/chat-total-cmd/${repo.split('/').pop()}`);
    return `Clonando repositorio Open Source [${repo}] directamente a tu memoria local por CMD.`;
  }

  return null;
}

async function localPrompt() {
  rl.question('\x1b[36m>>> Local: \x1b[0m', async (input) => {
    if (input.toLowerCase() === 'salir') { rl.close(); process.exit(0); }
    
    const interceptado = await procesarDescargaIA(input);
    if (interceptado) {
      console.log(`\n\x1b[32m>>> IA:\x1b[0m ${interceptado}\n`);
      localPrompt();
      return;
    }

    messages.push({ role: 'user', content: input });
    try {
      const response = await ollama.chat({ model: 'llama3.2:1b', messages });
      console.log(`\n\x1b[32m>>> IA:\x1b[0m ${response.message.content}\n`);
      messages.push({ role: 'assistant', content: response.message.content });
    } catch { console.error('\nError al conectar con Ollama.\n'); }
    localPrompt();
  });
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const interceptado = await procesarDescargaIA(message);
    if (interceptado) return res.json({ reply: interceptado });

    messages.push({ role: 'user', content: message });
    const response = await ollama.chat({ model: 'llama3.2:1b', messages });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Fallo de procesamiento.' }); }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n\x1b[32m[ENTORNO INTEGRADO FUNCIONAL EN EL PUERTO 3000]\x1b[0m\n');
  renderizarMosaicoSistema();
  localPrompt();
});
