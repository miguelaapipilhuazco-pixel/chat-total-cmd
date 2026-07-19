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

// INTERFAZ EN CÁPSULA VERTICAL CON CSS NATIVO LOCAL (INDEPENDIENTE DE INTERNET)
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uriel Dynamic Shell</title>
    <style>
      body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; -webkit-app-region: drag; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; }
      .icon-btn { -webkit-app-region: no-drag; transition: all 0.2s ease-in-out; cursor: grab; }
      .icon-btn:hover { transform: scale(1.1); filter: brightness(1.2); }
      .icon-btn:active { cursor: grabbing; }
      
      /* CÁPSULA VERTICAL DE TU INFOGRAFÍA */
      .capsula-widget {
        width: 160px; height: 230px;
        background-color: rgba(24, 24, 27, 0.95);
        border: 1px solid rgba(63, 63, 70, 0.7);
        border-radius: 40px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        color: #ffffff;
        display: flex; flex-direction: column; items: center; justify-content: space-between;
        padding: 16px; box-sizing: border-box;
      }
      .seccion-top { display: flex; flex-direction: column; items: center; text-align: center; margin-top: 4px; }
      .braille-dots { color: #f59e0b; font-size: 20px; font-weight: bold; letter-spacing: 2px; line-height: 1; }
      .label-sub { font-size: 9px; color: #a1a1aa; font-weight: bold; tracking-pattern: uppercase; letter-spacing: 1px; margin-top: 2px; text-transform: uppercase; }
      
      .seccion-middle { width: 100%; display: flex; flex-direction: row; items: center; justify-content: space-between; padding: 0 4px; box-sizing: border-box; }
      .col-item { display: flex; flex-direction: column; items: center; justify-content: center; text-align: center; width: 50px; }
      .icon-span { font-size: 18px; margin-bottom: 2px; }
      .label-mini { font-size: 7px; color: #a1a1aa; font-weight: bold; line-height: 1.1; }
      .text-tt { font-size: 18px; font-weight: 900; font-family: serif; color: #f4f4f5; }
      .btn-center { font-size: 12px; font-weight: 900; color: #71717a; padding: 0 4px; transition: color 0.2s; }
      .btn-center:hover { color: #f59e0b; }
      
      .seccion-bottom { display: flex; flex-direction: column; items: center; text-align: center; margin-bottom: 4px; }
      
      /* MODAL COMPACTO: LOGO REAL */
      .logo-circulo {
        width: 80px; height: 80px;
        background-color: rgba(9, 9, 11, 0.9);
        border: 2px solid rgba(245, 158, 11, 0.4);
        border-radius: 50%;
        display: flex; items: center; justify-content: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        overflow: hidden; padding: 10px; box-sizing: border-box;
      }
      .logo-img { width: 100%; height: 100%; object-fit: contain; pointer-events-none: true; }
    </style>
    <script>
      function mutarEstado(modo) {
        const extendido = document.getElementById('modo-extendido');
        const compacto = document.getElementById('modo-compacto');
        if(modo === 'cerrar') {
          extendid.style.setProperty('display', 'none', 'important');
          compacto.style.setProperty('display', 'flex', 'important');
        } else {
          extendid.style.setProperty('display', 'flex', 'important');
          compacto.style.setProperty('display', 'none', 'important');
        }
      }
    </script>
  </head>
  <body class="select-none">

    <!-- ESTADO 1: WIDGET VERTICAL EN CÁPSULA ESMERILADA NATIVA -->
    <div id="modo-extendido" class="capsula-widget" style="display: flex;">
      <!-- SUPERIOR: Braille -->
      <div class="seccion-top">
        <div class="braille-dots">&#x2817;&#x2803;</div>
        <span class="label-sub">Braille</span>
      </div>
      <!-- MEDIO: Señas - Flecha - Texto -->
      <div class="seccion-middle">
        <div class="col-item">
          <span class="icon-span icon-btn">🙌</span>
          <span class="label-mini">Lenguaje<br>de señas</span>
        </div>
        <div onclick="mutarEstado('cerrar')" class="icon-btn btn-center">&gt;</div>
        <div class="col-item">
          <span class="text-tt icon-btn">Tᴛ</span>
          <span class="label-mini">Texto</span>
        </div>
      </div>
      <!-- INFERIOR: Voz -->
      <div class="seccion-bottom">
        <span class="icon-span icon-btn">🎙️</span>
        <span class="label-sub">Voz</span>
      </div>
    </div>

    <!-- ESTADO 2: LOGOTIPO CIENTÍFICO DORADO REAL OFICIAL -->
    <div id="modo-compacto" style="display: none; width: 160px; height: 230px; align-items: center; justify-content: center;">
      <div onclick="mutarEstado('abrir')" title="IA" class="icon-btn logo-circulo">
        <img src="/logo.png" class="logo-img" />
      </div>
    </div>

  </body>
  </html>`);
});

app.get('/logo.png', (req, res) => { res.sendFile(path.resolve('logo.png')); });

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const prompt = message.toLowerCase().trim();
  try {
    if (prompt.includes('roblox')) { exec('start roblox://'); return res.json({ reply: `[IA] Abriendo Roblox.` }); }
    res.json({ reply: `[IA] Canales estables.` });
  } catch (err) { res.json({ reply: `[IA] Capa mutadora local activa.` }); }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[SISTEMA - WIDGET CON CSS NATIVO FIJADO]');
});
