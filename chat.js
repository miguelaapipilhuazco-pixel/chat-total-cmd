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
  const logChat = `\n[${new Date().toISOString()}] IA_CORE_TOTAL: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}
app.get('/', (req, res) => {
  const htmlGridPuro = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>IA UI</title><script src="https://tailwindcss.com"></script><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; -webkit-app-region: drag; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; } .icon-button { -webkit-app-region: no-drag; transition: all 0.2s ease; cursor: grab; } .icon-button:hover { transform: scale(1.12); } .icon-button:active { cursor: grabbing; }</style><script>function mutarEstado(modo) { const extendido = document.getElementById('modo-extendido'); const compacto = document.getElementById('modo-compacto'); if(modo === 'cerrar') { extendido.style.setProperty('display', 'none', 'important'); compacto.style.setProperty('display', 'flex', 'important'); } else { extendido.style.setProperty('display', 'grid', 'important'); compacto.style.setProperty('display', 'none', 'important'); } }</script></head><body class="bg-transparent select-none w-full h-full flex items-center justify-center m-0 p-0"><div id="modo-extendido" class="grid grid-cols-3 grid-rows-3 gap-3 w-[240px] h-[240px] items-center justify-items-center bg-transparent" style="display: grid;"><div></div><div title="Braille" class="icon-button w-14 h-14 bg-zinc-950/95 text-amber-500 border-2 border-amber-500/40 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl">&#x2803;</div><div></div><div title="Lenguaje de Señas" class="icon-button w-14 h-14 bg-zinc-950/95 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🖐️</div><div onclick="mutarEstado('cerrar')" title="Cerrar Asistente" class="icon-button w-12 h-12 bg-red-950/80 text-white border border-red-700/40 rounded-full flex items-center justify-center text-sm font-bold shadow-2xl z-10 hover:bg-red-600">❌</div><div title="Inserción de Texto" class="icon-button w-14 h-14 bg-zinc-950/95 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">⌨️</div><div></div><div title="Receptor de Voz" class="icon-button w-14 h-14 bg-zinc-950/95 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🎙️</div><div></div></div><!-- EMBLEMA COMPLETAMENTE ADAPTADO AL TAMAÑO DE ICONO --><div id="modo-compacto" class="w-[240px] h-[240px] flex items-center justify-center bg-transparent" style="display: none;"><div onclick="mutarEstado('abrir')" title="${config.nombreIA}" class="icon-button w-24 h-24 bg-zinc-950/90 border-2 border-amber-500/40 rounded-full flex items-center justify-center shadow-2xl overflow-hidden p-2 backdrop-blur-md animate-pulse"><img src="/logo.png" class="max-w-full max-h-full object-contain pointer-events-none" /></div></div></body></html>`;
  res.send(htmlGridPuro);
});
app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();
  try {
    if (prompt.includes('roblox')) { exec('start roblox://'); return res.json({ reply: `[${config.nombreIA}] Abriendo Roblox.` }); }
    res.json({ reply: `[${config.nombreIA}] Canales estables.` });
  } catch (err) { res.json({ reply: `[${config.nombreIA}] Error.` }); }
});
app.listen(3000, '0.0.0.0', () => {});