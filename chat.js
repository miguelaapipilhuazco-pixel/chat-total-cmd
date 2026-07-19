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
  const logChat = `\n[${new Date().toISOString()}] IA_EVOLUTION: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}
app.get('/', (req, res) => {
  const htmlIconosNativos = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Uriel Overlays</title><script src="https://tailwindcss.com"></script><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; -webkit-app-region: drag; } .icon-button { -webkit-app-region: no-drag; transition: transform 0.2s, box-shadow 0.2s; cursor: grab; } .icon-button:hover { transform: scale(1.18); filter: drop-shadow(0 10px 15px rgba(212,175,55,0.4)); } .icon-button:active { cursor: grabbing; }</style></head><body class="w-screen h-screen flex items-center justify-center bg-transparent select-none"><div class="flex flex-row items-center gap-6 p-4 bg-transparent"><div title="Braille" class="icon-button w-14 h-14 bg-zinc-950/90 text-amber-500 border-2 border-amber-500/40 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl">&#x2803;</div><div title="Lenguaje de Señas YOLOv11" class="icon-button w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🖐️</div><div title="Receptor de Voz" class="icon-button w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🎙️</div><div title="Inserción de Texto" class="icon-button w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">⌨️</div><div onclick="window.close()" title="Cerrar" class="icon-button w-10 h-10 bg-red-950/80 text-white border border-red-700/40 rounded-full flex items-center justify-center text-xs font-bold shadow-2xl">❌</div></div></body></html>`;
  res.send(htmlIconosNativos);
});
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();
  try {
    if (prompt.includes('roblox')) {
      exec('start roblox://');
      return res.json({ reply: `[${config.nombreIA}] Abriendo Roblox.` });
    }
    res.json({ reply: `[${config.nombreIA}] Sistema activo.` });
  } catch (err) {
    res.json({ reply: `[${config.nombreIA}] Capa mutadora activa.` });
  }
});
app.listen(3000, '0.0.0.0', () => {});