import ollama from 'ollama';
import express from 'express';
import readline from 'readline';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

let modeloActual = 'llama3.2:1b';
const messages = [{ role: 'system', content: 'Eres un sistema operativo IA central capaz de autogestionarse.' }];
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// MANIFIESTO NATIVO: Le indica a Android que este chat es una aplicación instalable
app.get('/manifest.json', (req, res) => {
  res.json({
    "name": "Control de IA",
    "short_name": "IA Control",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#000000",
    "theme_color": "#a8c7fa",
    "icons": [
      {
        "src": "https://flaticon.com",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ]
  });
});

// SERVICE WORKER: Requerido por Android para habilitar los iconos de escritorio y notificaciones fijas
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    self.addEventListener('install', (e) => { self.skipWaiting(); });
    self.addEventListener('activate', (e) => { e.waitUntil(clients.claim()); });
    self.addEventListener('fetch', (e) => { e.respondWith(fetch(e.request)); });
  `);
});

// INTERFAZ VISUAL: Panel de Control Inteligente con Botón de Instalación
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IA Panel Control</title>
        <link rel="manifest" href="/manifest.json">
        <style>
            body { font-family: sans-serif; background: #000; color: #fff; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; }
            .panel { width: 100%; max-width: 360px; background: #121212; border-radius: 28px; padding: 20px; box-sizing: border-box; text-align: center; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
            .tile { background: #232323; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 12px; color: #fff; text-align: left; }
            .tile.active { background: #a8c7fa; color: #041e49; }
            #btn-instalar { width: 100%; background: #fff; color: #000; border: none; padding: 14px; border-radius: 20px; font-weight: bold; margin-bottom: 15px; display: none; cursor: pointer; }
            #chat-box { background: #1e1e1e; border-radius: 16px; padding: 12px; height: 180px; overflow-y: auto; font-size: 13px; display: flex; flex-direction: column; gap: 8px; text-align: left; }
            .msg { padding: 8px 12px; border-radius: 12px; max-width: 85%; width: fit-content; }
            .user { background: #a8c7fa; color: #041e49; align-self: flex-end; }
            .bot { background: #333; color: #fff; align-self: flex-start; }
            .input-area { display: flex; gap: 8px; margin-top: 10px; }
            input { flex: 1; background: #2d2d2d; border: none; padding: 12px; border-radius: 20px; color: #fff; outline: none; }
            button.send { background: #a8c7fa; border: none; padding: 0 16px; border-radius: 20px; color: #041e49; font-weight: bold; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="panel">
            <button id="btn-instalar">📥 INSTALAR EN MIS ICONOS</button>
            <div class="grid">
                <div class="tile active"><span style="font-size:20px">🤖</span><div><b>Multi-IA</b><br>Listo</div></div>
                <div class="tile active"><span style="font-size:20px">📡</span><div><b>Puerto</b><br>3000</div></div>
            </div>
            <div id="chat-box"><div class="msg bot">Escribe "descarga gemma:2b" o cambia de modelo con "cambia a gemma:2b"</div></div>
            <div class="input-area">
                <input type="text" id="user-in" placeholder="Escribe a la IA...">
                <button class="send" onclick="enviar()">Enviar</button>
            </div>
        </div>

        <script>
            // Registrar el Service Worker de fondo
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
            }

            // Detectar si el teléfono permite la instalación directa del icono
            let eventoInstalacion;
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                eventoInstalacion = e;
                document.getElementById('btn-instalar').style.display = 'block';
            });

            document.getElementById('btn-instalar').addEventListener('click', async () => {
                if (eventoInstalacion) {
                    eventoInstalacion.prompt();
                    const { outcome } = await eventoInstalacion.userChoice;
                    if (outcome === 'accepted') {
                        document.getElementById('btn-instalar').style.display = 'none';
                    }
                }
            });

            async function enviar() {
                const input = document.getElementById('user-in');
                const box = document.getElementById('chat-box');
                const text = input.value.trim();
                if(!text) return;

                box.innerHTML += '<div class="msg user">' + text + '</div>';
                input.value = '';
                box.scrollTop = box.scrollHeight;

                try {
                    const res = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({message: text})
                    });
                    const data = await res.json();
                    box.innerHTML += '<div class="msg bot">' + (data.reply || data.error) + '</div>';
                } catch {
                    box.innerHTML += '<div class="msg bot">Error de conexión.</div>';
                }
                box.scrollTop = box.scrollHeight;
            }
        </script>
    </body>
    </html>
  `);
});

async function evaluarComandosSistema(text) {
  const prompt = text.toLowerCase().trim();
  if (prompt.startsWith('cambia a ') || prompt.startsWith('usa la ia ')) {
    const nuevoModelo = text.split(' ').pop();
    modeloActual = nuevoModelo;
    return `Cerebro actualizado. Procesando solicitudes con el modelo: ${nuevoModelo}.`;
  }
  if (prompt.includes('descarga') && (prompt.includes('gemma') || prompt.includes('phi') || prompt.includes('mistral') || prompt.includes('llama'))) {
    const modeloADescargar = text.split(' ').pop();
    exec(`ollama pull ${modeloADescargar}`);
    return `Descargando el modelo de IA: ${modeloADescargar} en segundo plano.`;
  }
  return null;
}

async function startLocalPrompt() {
  rl.question(`\x1b[35m>>> [IA: ${modeloActual}]: \x1b[0m`, async (input) => {
    if (input.toLowerCase() === 'salir') { rl.close(); process.exit(0); }
    const comandoProcesado = await evaluarComandosSistema(input);
    if (comandoProcesado) {
      console.log(`\n\x1b[32m>>> Sistema:\x1b[0m ${comandoProcesado}\n`);
      startLocalPrompt();
      return;
    }
    messages.push({ role: 'user', content: input });
    try {
      const response = await ollama.chat({ model: modeloActual, messages });
      console.log(`\n\x1b[32m>>> IA:\x1b[0m ${response.message.content}\n`);
      messages.push({ role: 'assistant', content: response.message.content });
    } catch {
      console.error(`\nError: Ejecuta 'descarga ${modeloActual}' primero.\n`);
    }
    startLocalPrompt();
  });
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const comandoProcesado = await evaluarComandosSistema(message);
    if (comandoProcesado) return res.json({ reply: comandoProcesado });
    messages.push({ role: 'user', content: message });
    const response = await ollama.chat({ model: modeloActual, messages });
    res.json({ reply: response.message.content });
  } catch { res.status(500).json({ error: 'Error del modelo actual.' }); }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n\x1b[32m[NÚCLEO INSTALABLE MULTI-IA DESPLEGADO EN EL PUERTO 3000]\x1b[0m\n');
  startLocalPrompt();
});
