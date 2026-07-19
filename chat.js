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
app.get('/', (req, res) => {
  const htmlGeometria = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Uriel Interface</title><script src="https://tailwindcss.com"></script><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; -webkit-app-region: drag; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; } .icon-button { -webkit-app-region: no-drag; transition: all 0.2s ease-in-out; cursor: grab; } .icon-button:hover { transform: scale(1.15); } .icon-button:active { cursor: grabbing; }</style><script>function mutarEstado(modo) { const extendido = document.getElementById('modo-extendido'); const compacto = document.getElementById('modo-compacto'); if(modo==='cerrar'){ extendido.style.display = 'none'; compacto.style.display = 'flex'; }else{ extendido.style.display = 'flex'; compacto.style.display = 'none'; } }</script></head><body class="bg-transparent select-none">

    <!-- MODO EXTENDIDO: Geometría de 4 extremos y un núcleo central -->
    <div id="modo-extendido" class="relative w-72 h-72 flex items-center justify-center bg-transparent">
      
      <!-- ARRIBA: Braille -->
      <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%);" title="Braille" class="icon-button w-14 h-14 bg-zinc-950/95 text-amber-500 border-2 border-amber-500/40 rounded-full flex items-center justify-center text-2xl font-bold shadow-2xl">&#x2803;</div>
      
      <!-- DERECHA: Inserción de Texto -->
      <div style="position: absolute; right: 0; top: 50%; transform: translateY(-50%);" title="Inserción de Texto" class="icon-button w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">⌨️</div>
      
      <!-- ABAJO: Receptor de Voz -->
      <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);" title="Receptor de Voz" class="icon-button w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🎙️</div>
      
      <!-- IZQUIERDA: Lenguaje de Señas YOLOv11 -->
      <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%);" title="Lenguaje de Señas" class="icon-button w-14 h-14 bg-zinc-950/90 text-white border-2 border-zinc-800 rounded-full flex items-center justify-center text-xl shadow-2xl">🖐️</div>
      
      <!-- NÚCLEO CENTRAL MUTABLE: Botón de Cierre -->
      <div onclick="mutarEstado('cerrar')" title="Cerrar Asistente" class="icon-button w-14 h-14 bg-red-950/80 text-white border border-red-700/40 rounded-full flex items-center justify-center text-sm font-bold shadow-2xl z-10">❌</div>
    </div>

    <!-- MODO COMPACTO: Logotipo Circular Amarillo oficial (Insignia A dorada pulsante) -->
    <div id="modo-compacto" style="display: none;" class="w-72 h-72 items-center justify-center bg-transparent">
      <div onclick="mutarEstado('abrir')" title="Ecosistema Arturo" class="icon-button w-16 h-16 bg-amber-500 text-black border-4 border-zinc-950 rounded-full flex items-center justify-center text-2xl font-extrabold shadow-2xl shadow-amber-500/40 animate-pulse">A</div>
    </div>

</body></html>`;
  res.send(htmlGeometria);
});
app.post('/api/chat', async (req, res) => { res.json({ success: true }); });
app.listen(3000, '0.0.0.0', () => {});