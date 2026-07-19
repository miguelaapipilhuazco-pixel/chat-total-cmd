import path from 'path';
export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  if (userAgent.includes('android') || userAgent.includes('watch')) {
    radioBordes = '50px'; colorFondo = 'rgba(10, 10, 10, 0.98)'; efectoBlur = ''; estiloBorder = 'none';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    radioBordes = '30px'; colorFondo = 'rgba(28, 28, 30, 0.85)'; efectoBlur = 'backdrop-filter: blur(20px);'; estiloBorder = 'none';
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>IA PolyOS</title><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; } .capsula-extendida { -webkit-app-region: drag; width: 140px; height: 210px; background-color: ${colorFondo}; ${efectoBlur} border: ${estiloBorder}; border-radius: ${radioBordes}; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); display: flex; flex-direction: column; items: center; justify-content: space-between; padding: 22px 14px; box-sizing: border-box; cursor: move; } .capsula-compacta { -webkit-app-region: drag; width: 140px; height: 210px; display: none; align-items: center; justify-content: center; background: transparent; cursor: move; } .icon-btn { -webkit-app-region: no-drag !important; transition: transform 0.2s ease, filter 0.2s, color 0.2s; cursor: pointer; display: flex; items: center; justify-content: center; border: none !important; background: transparent !important; width: 36px; height: 36px; fill: rgba(255, 255, 255, 0.7); color: rgba(255, 255, 255, 0.7); }
  .icon-btn:hover { transform: scale(1.15); fill: #fbbf24 !important; color: #fbbf24 !important; filter: drop-shadow(0 0 8px rgba(251,191,36,0.6)); }
  .icon-btn:active { transform: scale(0.92); fill: #d97706 !important; color: #d97706 !important; }
  .middle-row { width: 100%; display: flex; flex-direction: row; items: center; justify-content: space-between; box-sizing: border-box; }
  .flecha-ico { font-size: 14px; font-weight: 900; color: rgba(255, 255, 255, 0.4); width: 20px; height: 20px; text-align: center; -webkit-app-region: no-drag; cursor: pointer; }
  .flecha-ico:hover { color: #fbbf24; }
  .logo-circulo { -webkit-app-region: no-drag !important; width: 85px; height: 85px; background-color: ${colorFondo}; ${efectoBlur} border: ${estiloBorder}; border-radius: 50%; display: flex; items: center; justify-content: center; box-shadow: 0 15px 20px rgba(0,0,0,0.4); overflow: hidden; padding: 10px; box-sizing: border-box; }
  .logo-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
  </style><script>function mutar(m){ const e=document.getElementById('modo-ext'); const c=document.getElementById('modo-com'); if(m==='cerrar'){ e.style.setProperty('display','none','important'); c.style.setProperty('display','flex','important'); }else{ e.style.setProperty('display','flex','important'); c.style.setProperty('display','none','important'); } } async function dispararFuncion(m){ try{ await fetch('/api/funcion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modulo:m})}); }catch(e){} }</script></head><body><div id="modo-ext" class="capsula-extendida">
  <!-- ICONO PROPIO 1: BRAILLE VECTORIAL -->
  <div onclick="dispararFuncion('braille')" title="Braille" class="icon-btn"><svg viewBox="0 0 24 24" width="32" height="32"><circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/></svg></div>
  <div class="middle-row">
    <!-- ICONO PROPIO 2: SEÑAS (MANO VECTORIAL PROPIA) -->
    <div onclick="dispararFuncion('señas')" title="Lenguaje de Señas" class="icon-btn"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 2a2 2 0 0 1 2 2v6h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1v2a2 2 0 0 1-2 2H9a4 4 0 0 1-4-4v-4a2 2 0 0 1 2-2h1V4a2 2 0 0 1 2-2h2z"/></svg></div>
    <div onclick="mutar('cerrar')" class="flecha-ico">&gt;</div>
    <!-- ICONO PROPIO 3: TEXTO (TT SERIF VECTORIAL PROPIO) -->
    <div onclick="dispararFuncion('texto')" title="Texto" class="icon-btn" style="font-size:24px; font-weight:bold; font-family:'Times New Roman',serif; line-height:1;">Tᴛ</div>
  </div>
  <!-- ICONO PROPIO 4: MICROFONO DE VOZ VECTORIAL PROPIO -->
  <div onclick="dispararFuncion('voz')" title="Voz" class="icon-btn"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 9a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20a1 1 0 0 0 2 0v-2.08A7 7 0 0 0 19 11z"/></svg></div>
</div>
<div id="modo-com" class="capsula-compacta"><div onclick="mutar('abrir')" class="icon-btn logo-circulo"><img src="/logo.png" class="logo-img" /></div></div></body></html>`;
}