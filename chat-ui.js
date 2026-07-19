import path from 'path';
export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  let radioBordesDinamico = '50%';
  let colorOscuroNativo = 'rgba(32, 32, 32, 0.85)';
  let blurNativo = 'backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);';
  let bordeNativo = '1px solid rgba(255, 255, 255, 0.12)';
  let iconBraille = '&#x2817;&#x2803;';
  let iconSeñas = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="3" y="11" width="2.5" height="5" rx="1.2"/><rect x="6.5" y="5" width="2.3" height="10" rx="1.1"/><rect x="10" y="3" width="2.2" height="12" rx="1.1"/><rect x="13.5" y="4.5" width="2.3" height="10.5" rx="1.1"/><rect x="17" y="7" width="2.4" height="8" rx="1.2"/><path d="M3.3 14.5c0 0-.3 4.5 4.7 5.5h6c4 0 5-4.5 5-5.5v-2H3.3v2z"/></svg>`;
  let iconTexto = 'Tᴛ';
  let iconVoz = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="9" y="2" width="6" height="12" rx="3" ry="3"/><path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-4.08A7 7 0 0 0 19 10z"/></svg>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>IA UI</title><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; width: 100vw; height: 100vh; display: flex; flex-direction: column; items: center; justify-content: center; }
  .manija-top { -webkit-app-region: drag !important; width: 60px; height: 12px; background: rgba(255,255,255,0.15); border-radius: 6px; margin-bottom: 6px; cursor: move; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
  .manija-top:hover { background: rgba(255,255,255,0.3); }
  .capsula-cruz { width: 145px; height: 145px; background-color: ${colorOscuroNativo} !important; ${blurNativo} border: ${bordeNativo}; border-radius: 50%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); align-items: center; justify-items: center; padding: 12px; box-sizing: border-box; }
  .capsula-compacta { display: none; align-items: center; justify-content: center; background: transparent !important; }
  .icon-wrapper { position: relative; display: flex; align-items: center; justify-content: center; }
  .icon-btn { -webkit-app-region: no-drag !important; transition: transform 0.2s ease; cursor: pointer; display: flex; items: center; justify-content: center; border: none !important; background: transparent !important; width: 36px; height: 36px; fill: rgba(255, 255, 255, 0.7) !important; color: rgba(255, 255, 255, 0.7) !important; }
  .icon-btn:hover { transform: scale(1.15); filter: brightness(1.4) !important; }
  .icon-wrapper .tooltip-text { visibility: hidden; background-color: rgba(20, 20, 20, 0.95); color: rgba(255, 255, 255, 0.9); text-align: center; border-radius: 8px; padding: 4px 8px; position: absolute; z-index: 100; bottom: 130%; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 600; white-space: nowrap; opacity: 0; transition: opacity 0.15s; border: 1px solid rgba(255,255,255,0.08); pointer-events: none; }
  .icon-wrapper:hover .tooltip-text { visibility: visible; opacity: 1; }
  .punto-ico { font-size: 28px; color: rgba(255, 255, 255, 0.5); line-height: 1; cursor: pointer; display: flex; items: center; justify-content: center; width: 24px; height: 24px; margin-top: -6px; }
  .punto-ico:hover { color: rgba(255, 255, 255, 0.9); }
  .logo-circulo { -webkit-app-region: no-drag !important; width: 68px; height: 68px; background-color: ${colorOscuroNativo} !important; ${blurNativo} border: ${bordeNativo}; border-radius: 50%; display: flex; items: center; justify-content: center; box-shadow: 0 15px 20px rgba(0,0,0,0.4); overflow: hidden; padding: 8px; box-sizing: border-box; cursor: pointer; }
  .logo-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
  </style><script>function mutar(m){ const e=document.getElementById('modo-ext'); const c=document.getElementById('modo-com'); if(m==='cerrar'){ e.style.setProperty('display','none','important'); c.style.setProperty('display','flex','important'); }else{ e.style.setProperty('display','grid','important'); c.style.setProperty('display','none','important'); } } async function dispararFuncion(m){ try{ await fetch('/api/funcion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modulo:m})}); }catch(e){} }</script></head><body>
  
  <!-- MANIJA SUPERIOR UNIFICADA DE ARRASTRE -->
  <div class="manija-top" title="Arrastrar Widget"></div>
  
  <div id="modo-ext" class="capsula-cruz" style="display: grid;">
    <div></div>
    <div class="icon-wrapper"><div onclick="dispararFuncion('braille')" class="icon-btn" style="font-size:26px; font-weight:bold;">${iconBraille}</div><span class="tooltip-text">Braille</span></div>
    <div></div>
    <div class="icon-wrapper"><div onclick="dispararFuncion('señas')" class="icon-btn">${iconSeñas}</div><span class="tooltip-text">Lenguaje de Señas</span></div>
    <div class="icon-wrapper"><div onclick="mutar('cerrar')" class="punto-ico icon-btn">•</div><span class="tooltip-text">Compactar</span></div>
    <div class="icon-wrapper"><div onclick="dispararFuncion('texto')" class="icon-btn" style="font-size:22px; font-weight:bold; font-family:'Times New Roman',serif; line-height:1;">${iconTexto}</div><span class="tooltip-text">Texto</span></div>
    <div></div>
    <div class="icon-wrapper"><div onclick="dispararFuncion('voz')" class="icon-btn">${iconVoz}</div><span class="tooltip-text">Voz</span></div>
    <div></div>
  </div>
  <div id="modo-com" class="capsula-compacta"><div class="icon-wrapper"><div onclick="mutar('abrir')" class="logo-circulo"><img src="/logo.png" class="logo-img" /></div><span class="tooltip-text">Clic: Abrir Menú</span></div></div>
  </body></html>`;
}