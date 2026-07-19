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
  const userAgent = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : '';
  // SISTEMA POLIMÓRFICO DE COLOR: El color de fondo se adapta dinámicamente al color del sistema operativo
  let radioBordes = '40px';
  let colorFondo = 'rgba(32, 32, 32, 0.85)'; /* Windows 11 Mica default */
  let efectoBlur = 'backdrop-filter: blur(25px);-webkit-backdrop-filter: blur(25px);';
  let estiloBorder = '1px solid rgba(255, 255, 255, 0.12)';
  if (userAgent.includes('android') || userAgent.includes('linux')) {
    radioBordes = '50px'; colorFondo = 'rgba(10, 10, 10, 0.98)'; efectoBlur = ''; estiloBorder = '1px solid rgba(255, 255, 255, 0.05)';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    radioBordes = '30px'; colorFondo = 'rgba(28, 28, 30, 0.9)'; efectoBlur = 'backdrop-filter: blur(20px);-webkit-backdrop-filter: blur(20px);'; estiloBorder = '1px solid rgba(255, 255, 255, 0.1)';
  } else if (userAgent.includes('macintosh') || userAgent.includes('mac os')) {
    radioBordes = '35px'; colorFondo = 'rgba(40, 40, 40, 0.65)'; efectoBlur = 'backdrop-filter: blur(35px);-webkit-backdrop-filter: blur(35px);'; estiloBorder = '1px solid rgba(255, 255, 255, 0.2)';
  }
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Uriel PolyOS</title><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; -webkit-app-region: drag; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; } .icon-btn { -webkit-app-region: no-drag; transition: all 0.2s ease-in-out; cursor: grab; display: flex; items: center; justify-content: center; } .icon-btn:hover { transform: scale(1.15); filter: brightness(1.3); } .icon-btn:active { cursor: grabbing; }
  .capsula-compacta {
    width: 140px; height: 210px;
    background-color: ${colorFondo};
    ${efectoBlur}
    border: ${estiloBorder};
    border-radius: ${radioBordes};
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    display: flex; flex-direction: column; items: center; justify-content: space-between;
    padding: 20px 12px; box-sizing: border-box;
  }
  .middle-row { width: 100%; display: flex; flex-direction: row; items: center; justify-content: space-between; padding: 0 4px; box-sizing: border-box; }
  .braille-ico { color: #f59e0b; font-size: 32px; font-weight: bold; line-height: 1; height: 32px; }
  .señas-ico { font-size: 26px; width: 36px; height: 36px; }
  .texto-ico { font-size: 26px; font-weight: 900; font-family: serif; color: #f4f4f5; letter-spacing: -1px; width: 36px; height: 36px; }
  .flecha-ico { font-size: 14px; font-weight: 900; color: #71717a; transition: color 0.2s; width: 20px; height: 20px; }
  .flecha-ico:hover { color: #f59e0b; }
  .voz-ico { font-size: 26px; color: #f4f4f5; height: 36px; }
  .logo-circulo { width: 85px; height: 85px; background-color: ${colorFondo}; ${efectoBlur} border: ${estiloBorder}; border-radius: 50%; display: flex; items: center; justify-content: center; box-shadow: 0 15px 20px rgba(0,0,0,0.4); overflow: hidden; padding: 10px; box-sizing: border-box; }
  .logo-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
  </style><script>function mutar(m){ const e=document.getElementById('modo-ext'); const c=document.getElementById('modo-com'); if(m==='cerrar'){ e.style.setProperty('display','none','important'); c.style.setProperty('display','flex','important'); }else{ e.style.setProperty('display','flex','important'); c.style.setProperty('display','none','important'); } }</script></head><body>
  <div id="modo-ext" class="capsula-compacta" style="display: flex;">
    <div title="Braille" class="braille-ico icon-btn">&#x2817;&#x2803;</div>
    <div class="middle-row">
      <div title="Lenguaje de Señas" class="señas-ico icon-btn">🙌</div>
      <div onclick="mutar('cerrar')" class="flecha-ico icon-btn">&gt;</div>
      <div title="Texto" class="texto-ico icon-btn">Tᴛ</div>
    </div>
    <div title="Voz" class="voz-ico icon-btn">🎙️</div>
  </div>
  <div id="modo-com" style="display: none; width: 140px; height: 210px; align-items: center; justify-content: center;">
    <div onclick="mutar('abrir')" class="icon-btn logo-circulo"><img src="/logo.png" class="logo-img" /></div>
  </div>
  </body></html>`);
});
app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });
app.post('/api/chat', async (req, res) => { res.json({ success: true }); });
app.listen(3000, '0.0.0.0', () => {});