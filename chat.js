import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

let config = { nombreIA: "IA" };
if (fs.existsSync('config.json')) {
  try { config = JSON.parse(fs.readFileSync('config.json', 'utf8')); } catch(e){}
}

let openRouterKey = process.env.OPENROUTER_KEY || '';

function registrarEvolucion(prompt, accion) {
  const logChat = `\r\n[${new Date().toISOString()}] IA_INFOGRAFIA: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

// INTERFAZ FIEL A TU MAPA VISUAL MULTIPLATAFORMA
app.get('/', (req, res) => {
  const htmlUrielFiel = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uriel Dynamic Shell</title>
    <script src="https://tailwindcss.com"></script>
    <style>
      body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; -webkit-app-region: drag; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; }
      .icon-btn { -webkit-app-region: no-drag; transition: all 0.2s ease-in-out; cursor: grab; }
      .icon-btn:hover { transform: scale(1.1); filter: brightness(1.2); }
      .icon-btn:active { cursor: grabbing; }
    </style>
    <script>
      function mutarEstado(modo) {
        const extendido = document.getElementById('modo-extendido');
        const compacto = document.getElementById('modo-compacto');
        if(modo === 'cerrar') {
          extendido.style.setProperty('display', 'none', 'important');
          compacto.style.setProperty('display', 'flex', 'important');
        } else {
          extendido.style.setProperty('display', 'flex', 'important');
          compacto.style.setProperty('display', 'none', 'important');
        }
      }
    </script>
  </head>
  <body class="bg-transparent select-none w-full h-full flex items-center justify-center p-0 m-0">

    <!-- WIDGET VERTICAL EN CÁPSULA ESMERILADA DE TU INFOGRAFÍA -->
    <div id="modo-extendido" class="w-[170px] h-[240px] bg-neutral-900/90 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-4 flex flex-col items-center justify-between shadow-2xl text-white select-none" style="display: flex;">
      
      <!-- SUPERIOR: Módulo Braille -->
      <div class="flex flex-col items-center justify-center text-center mt-1 w-full">
        <div class="text-amber-500 text-lg font-bold tracking-widest leading-none mb-0.5">&#x2817;&#x2803;</div>
        <span class="text-[9px] text-zinc-400 font-bold tracking-wider uppercase">Braille</span>
      </div>

      <!-- MEDIO: Matriz Horizontal Balanceada (Señas - Flecha - Texto) -->
      <div class="w-full flex flex-row items-center justify-between px-1">
        <!-- IZQUIERDA: Lenguaje de Señas -->
        <div class="flex flex-col items-center justify-center text-center w-14">
          <span class="text-amber-400 text-base font-bold icon-btn mb-0.5">🙌</span>
          <span class="text-[7px] text-zinc-400 font-bold leading-none tracking-tighter">Lenguaje<br>de señas</span>
        </div>

        <!-- CENTRO: Conmutador de Estado -->
        <div onclick="mutarEstado('cerrar')" class="icon-btn text-zinc-500 text-xs font-black px-1 hover:text-amber-500 cursor-pointer z-10 transition-colors">&gt;</div>

        <!-- DERECHA: Texto TT -->
        <div class="flex flex-col items-center justify-center text-center w-14">
          <span class="text-zinc-100 text-base font-extrabold font-serif icon-btn tracking-tighter mb-0.5">Tᴛ</span>
          <span class="text-[8px] text-zinc-400 font-bold leading-none uppercase">Texto</span>
        </div>
      </div>

      <!-- INFERIOR: Receptor de Voz -->
      <div class="flex flex-col items-center justify-center text-center mb-1 w-full">
        <span class="text-amber-500 text-base font-bold icon-btn mb-0.5">🎙️</span>
        <span class="text-[9px] text-zinc-400 font-bold tracking-wider uppercase">Voz</span>
      </div>

    </div>

    <!-- MODO COMPACTO: Logotipo Científico Dorado Sin Bordes Recortados -->
    <div id="modo-compacto" class="w-[170px] h-[240px] items-center justify-center bg-transparent" style="display: none;">
      <div onclick="mutarEstado('abrir')" title="IA" class="icon-btn w-20 h-20 bg-zinc-950/90 border-2 border-amber-500/30 rounded-full flex items-center justify-center shadow-2xl overflow-hidden p-2 backdrop-blur-md animate-pulse">
        <img src="/logo.png" class="w-full h-full object-contain pointer-events-none" />
      </div>
    </div>

  </body>
  </html>`;
  res.send(htmlUrielFiel);
});

app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });

// EL CEREBRO ADAPTATIVO CONECTADO A LA RED GLOBAL
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();
  try {
    if (prompt.includes('roblox')) {
      exec('start roblox://');
      return res.json({ reply: `[IA] Abriendo el juego.` });
    }
    // Conector Cloud libre para responder cualquier cosa que pida el usuario
    if (openRouterKey) {
      const apiRes = await fetch('https://openrouter.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openRouterKey}` },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: 'Eres IA, la administradora autónoma del sistema. Responde de forma muy fluida y en español.' },
            { role: 'user', content: message }
          ]
        })
      });
      const data = await apiRes.json();
      return res.json({ reply: data.choices[0].message.content.trim() });
    }
    res.json({ reply: `[IA] Canales estables de infraestructura.` });
  } catch (err) {
    res.json({ reply: `[IA] Capa mutadora de contingencia activa.` });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[SISTEMA - WIDGET DE INFRAESTRUCTURA INTEGRADO]');
});
