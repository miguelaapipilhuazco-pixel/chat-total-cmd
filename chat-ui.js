import path from 'path';
export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  if (userAgent.includes('android') || userAgent.includes('watch')) {
    radioBordes = '50px'; colorFondo = 'rgba(10, 10, 10, 0.98)'; efectoBlur = ''; estiloBorder = 'none';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    radioBordes = '30px'; colorFondo = 'rgba(28, 28, 30, 0.85)'; efectoBlur = 'backdrop-filter: blur(20px);'; estiloBorder = 'none';
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>IA Cruz UI</title><script src="https://tailwindcss.com"></script><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; }
  .capsula-cruz {
    -webkit-app-region: drag; width: 150px; height: 150px;
    background-color: ${colorFondo};
    ${efectoBlur}
    border: ${estiloBorder};
    border-radius: 50%; /* Transformado en un circulo/capsula simetrica compacta */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    display: grid; grid-cols-3: repeat(3, minmax(0, 1fr)); grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);
    align-items: center; justify-items: center; padding: 10px; box-sizing: border-box; cursor: move;
  }
  .icon-btn { -webkit-app-region: no-drag !important; transition: transform 0.2s, filter 0.2s; cursor: pointer; display: flex; items: center; justify-content: center; border: none !important; background: transparent !important; width: 36px; height: 36px; fill: rgba(255, 255, 255, 0.7); color: rgba(255, 255, 255, 0.7) !important; }
  .icon-btn:hover { transform: scale(1.12); filter: brightness(1.4) !important; }
  .icon-btn:active { transform: scale(0.92); }
  .punto-ico { font-size: 24px; color: rgba(255, 255, 255, 0.4); line-height: 1; -webkit-app-region: no-drag; cursor: pointer; transition: color 0.2s; }
  .punto-ico:hover { color: rgba(255, 255, 255, 0.9); }
  .logo-circulo { -webkit-app-region: no-drag !important; width: 85px; height: 85px; background-color: ${colorFondo}; ${efectoBlur} border: ${estiloBorder}; border-radius: 50%; display: flex; items: center; justify-content: center; box-shadow: 0 15px 20px rgba(0,0,0,0.4); overflow: hidden; padding: 10px; box-sizing: border-box; }
  .logo-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
  </style><script>function mutar(m){ const e=document.getElementById('modo-ext'); const c=document.getElementById('modo-com'); if(m==='cerrar'){ e.style.setProperty('display','none','important'); c.style.setProperty('display','flex','important'); }else{ e.style.setProperty('display','flex','important'); c.style.setProperty('display','none','important'); } } async function dispararFuncion(m){ try{ await fetch('/api/funcion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modulo:m})}); }catch(e){} }</script></head><body>
  
  <!-- MATRIZ EN CRUZ ULTRA-COMPACTA DE 3X3 CON ALINEACIÓN SIMÉTRICA -->
  <div id="modo-ext" class="capsula-cruz" style="display: grid;">
    <div></div>
    <!-- ARRIBA: Braille Vectorial -->
    <div onclick="dispararFuncion('braille')" title="Braille" class="icon-btn"><svg viewBox="0 0 24 24" width="28" height="28"><circle cx="8" cy="6" r="1.8"/><circle cx="16" cy="6" r="1.8"/><circle cx="8" cy="12" r="1.8"/><circle cx="16" cy="12" r="1.8"/><circle cx="8" cy="18" r="1.8"/></svg></div>
    <div></div>
    
    <!-- IZQUIERDA: Manos Unidas de Señas Simplificadas -->
    <div onclick="dispararFuncion('señas')" title="Lenguaje de Señas" class="icon-btn"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 10a2 2 0 0 1 2 2v4H7a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2zm12 0a2 2 0 0 1 1 2v2a2 2 0 0 1-2 2h-1v-4a2 2 0 0 1 2-2zm-6-6a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z"/></svg></div>
    <!-- CENTRO: Conmutador de Estado (Punto Minimalista) -->
    <div onclick="mutar('cerrar')" class="punto-ico icon-btn">•</div>
    <!-- DERECHA: Texto TT Serif -->
    <div onclick="dispararFuncion('texto')" title="Texto" class="icon-btn" style="font-size:22px; font-weight:bold; font-family:'Times New Roman',serif; line-height:1;">Tᴛ</div>
    
    <div></div>
    <!-- ABAJO: Micrófono de Voz Vectorial -->
    <div onclick="dispararFuncion('voz')" title="Voz" class="icon-btn"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 9a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20a1 1 0 0 0 2 0v-2.08A7 7 0 0 0 19 11z"/></svg></div>
    <div></div>
  </div>
  
  <div id="modo-com" style="display: none; width: 150px; height: 150px; align-items: center; justify-content: center;">
    <div onclick="mutar('abrir')" class="icon-btn logo-circulo"><img src="/logo.png" class="logo-img" /></div>
  </div>
  </body></html>`;
}