import ollama from 'ollama';
import express from 'express';
import readline from 'readline';

const app = express();
app.use(express.json());

const messages = [{ role: 'system', content: 'Asistente Ollama local activo por interfaces inalámbricas.' }];
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function localPrompt() {
  rl.question('\x1b[36m>>> Local: \x1b[0m', async (input) => {
    if (input.toLowerCase() === 'salir') { rl.close(); process.exit(0); }
    messages.push({ role: 'user', content: input });
    try {
      const response = await ollama.chat({ model: 'llama3.2:1b', messages });
      console.log(`\n\x1b[32m>>> IA:\x1b[0m ${response.message.content}\n`);
      messages.push({ role: 'assistant', content: response.message.content });
    } catch { console.error('\nError al conectar con el motor local.\n'); }
    localPrompt();
  });
}

// Interceptor de red para Wi-Fi o Bluetooth mapeado
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    messages.push({ role: 'user', content: message });
    const response = await ollama.chat({ model: 'llama3.2:1b', messages });
    messages.push({ role: 'assistant', content: response.message.content });
    res.json({ reply: response.message.content });
  } catch {
    res.status(500).json({ error: 'Fallo de procesamiento en nodo Ollama.' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n\x1b[33m[OLLAMA NETWORK NODE ON PORT: 3000]\x1b[0m\n');
  localPrompt();
});
