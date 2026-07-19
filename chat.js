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
app.get('/', (req, res) => {
  const htmlOrbital = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Uriel Interface</title><script src="https://tailwindcss.com"></script><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; -webkit-app-region: drag; } .icon-button { -webkit-app-region: no-drag; transition: all 0.2s ease-in-out; cursor: grab; } .icon-button:hover { transform: scale(1.15); } .icon-button:active { cursor: grabbing; }</style><script>function mutarEstado(modo) { const extendido = document.getElementById('modo-extendido'); const compacto = document.getElementById('modo-compacto'); if(modo==='cerrar'){ extendido.classList.add('hidden'); compacto.classList.remove('hidden'); }else{ extendido.classList.remove('hidden'); compacto.classList.add('hidden'); } }</script></head><body class="w-screen h-screen flex items-center justify-center bg-transparent select-none"><div id="modo-extendido" class="relative w-64 h-64 flex items-center justify-center bg-transparent"><div title="Braille" class="icon-button absolute top-0 w-14 h-14 bg-zinc-950/90 text-amber-500 border-2 border-amber-500/40 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl">&#x2803;</div><div title="Inserción de Texto" class="icon-button absolute right-0 w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">⌨️</div><div title="Receptor de Voz" class="icon-button absolute bottom-0 w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🎙️</div><div title="Lenguaje de Señas" class="icon-button absolute left-0 w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🖐️</div><div onclick="mutarEstado('cerrar')" title="Cerrar Asistente" class="icon-button w-14 h-14 bg-red-950/80 text-white border border-red-700/40 rounded-full flex items-center justify-center text-sm font-bold shadow-2xl z-10">❌</div></div><div id="modo-compacto" class="hidden relative w-64 h-64 flex items-center justify-center bg-transparent"><div onclick="mutarEstado('abrir')" title="Ecosistema Arturo" class="icon-button w-16 h-16 bg-amber-500 text-black border-4 border-zinc-950 rounded-full flex items-center justify-center text-2xl font-extrabold shadow-2xl shadow-amber-500/30 animate-pulse">A</div></div></body></html>`;
  res.send(htmlOrbital);
});
app.post('/api/chat', async (req, res) => { res.json({ success: true }); });
app.listen(3000, '0.0.0.0', () => {});