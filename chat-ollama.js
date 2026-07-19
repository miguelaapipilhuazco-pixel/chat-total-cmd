import fs from 'fs';
import { exec } from 'child_process';
export async function consultarOllama(message, prompt, config) {
  try {
    console.log('[OLLAMA CORE] Procesando directiva evolutiva en puerto 11434...');
    const res = await fetch('http://127.0.0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          { role: 'system', content: 'Eres el motor de auto-mutacion de Uriel. Si el usuario te pide cambiar el codigo, la interfaz, o inyectar logica, devuelve exclusivamente el codigo JavaScript o HTML limpio dentro de bloques markdown de codigo. Si es una duda normal, responde con total empatia, calidez humana y un español comprensible para novatos, sin tecnicismos.' },
          { role: 'user', content: message }
        ],
        stream: false
      })
    });
    const data = await res.json();
    if (data && data.message && data.message.content) {
      const txt = data.message.content.trim();
      if (prompt.includes('modif') || prompt.includes('cambia') || prompt.includes('actualiz') || prompt.includes('interfaz')) {
        const match = txt.match(/```javascript([\s\S]*?)```/) || txt.match(/```js([\s\S]*?)```/) || txt.match(/```html([\s\S]*?)```/);
        const codigoLimpio = match ? match[1].trim() : txt.trim();
        if (codigoLimpio) {
          let archivoDestino = prompt.includes('interfaz') || prompt.includes('diseño') ? 'chat-ui.js' : 'chat.js';
          fs.appendFileSync(archivoDestino, `\n\n// MUTACIÓN GENERADA POR OLLAMA:\n${codigoLimpio}\n`);
          setTimeout(() => { exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js'); }, 1000);
          return `[${config.nombreIA}] [Ollama Auto-Mutación] He analizado tu directiva de forma humana, reescribí físicamente el archivo "${archivoDestino}" y ejecuté un Hot-Reload en la memoria RAM.`;
        }
      }
      return txt;
    }
    throw new Error();
  } catch (e) {
    return `[${config.nombreIA}] Hola Administrador. Te escucho bien de forma local. Recuerda encender Ollama en Windows para liberar mi maximo razonamiento humano y agéntico.`;
  }
}