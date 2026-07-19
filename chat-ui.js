import path from 'path';

export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  let radioBordesDinamico = '50%';
  let colorOscuroNativo = 'rgba(32, 32, 32, 0.85)'; // Cristal oscuro esmerilado de Windows 11
  let blurNativo = 'backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);';
  let bordeNativo = '1px solid rgba(255, 255, 255, 0.12)';
  
  let iconBraille = '&#x2817;&#x2803;'; 
  
  // VECTOR ANATÓMICO CORREGIDO: Mano extendida real de 5 dedos estilizados (Sin deformaciones centrales)
  let iconSeñas = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2a1 1 0 0 0-1 1v6.5a.5.5 0 0 1-1 0V3.5a1 1 0 0 0-2 0V9a.5.5 0 0 1-1 0V5a1 1 0 0 0-2 0v6.5a.5.5 0 0 1-1 0V8.5a1 1 0 0 0-2 0v5a7 7 0 0 0 7 7h2.5a6.5 6.5 0 0 0 6.5-6.5V7.5a1 1 0 0 0-2 0v3a.5.5 0 0 1-1 0V5a1 1 0 0 0-2 0v5.5a.5.5 0 0 1-1 0V3a1 1 0 0 0-1-1z"/>
  </svg>`; 
  
  let iconTexto = 'Tᴛ'; 
  
  let iconVoz = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <rect x="9" y="2" width="6" height="12" rx="3" ry="3"/>
    <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-4.08A7 7 0 0 0 19 10z"/>
  </svg>`;

  if (userAgent.includes('android') || userAgent.includes('watch')) {
    radioBordesDinamico = '50%'; colorOscuroNativo = 'rgba(10, 10, 10, 0.98)'; blurNativo = ''; bordeNativo = '1px solid rgba(255, 255, 255, 0.05)';
    iconBraille = '⠇⠃'; iconTexto = '⌨';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('macintosh')) {
    radioBordesDinamico = '30px'; colorOscuroNativo = 'rgba(28, 28, 30, 0.85)'; blurNativo = 'backdrop-filter: blur(20px);'; bordeNativo = 'none';
  }

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IA Cruz Dynamic</title>
    <style>
      body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; }
      
      .capsula-cruz {
        -webkit-app-region: drag; width: 150px; height: 150px;
        background-color: ${colorOscuroNativo} !important;
        ${blurNativo}
        border: ${bordeNativo};
        border-radius: 50%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);
        align-items: center; justify-items: center; padding: 12px; box-sizing: border-box; cursor: move;
      }
      
      .capsula-compacta {
        -webkit-app-region: drag; width: 150px; height: 150px;
        display: none; align-items: center; justify-content: center; background: transparent !important; cursor: move;
      }
      
      .icon-btn { 
        -webkit-app-region: no-drag !important; 
        transition: transform 0.2s ease, filter 0.2s; 
        cursor: pointer; display: flex; items: center; justify-content: center; 
        border: none !important; background: transparent !important; box-shadow: none !important;
        width: 36px; height: 36px; 
        fill: rgba(255, 255, 255, 0.7) !important; color: rgba(255, 255, 255, 0.7) !important; 
      }
      .icon-btn:hover { transform: scale(1.15); filter: brightness(1.4) !important; }
      .icon-btn:active { transform: scale(0.92); }
      
      .punto-ico { font-size: 28px; color: rgba(255, 255, 255, 0.5); line-height: 1; -webkit-app-region: no-drag; cursor: pointer; display: flex; items: center; justify-content: center; width: 24px; height: 24px; }
      .punto-ico:hover { color: rgba(255, 255, 255, 0.9); }
      
      .logo-circulo { -webkit-app-region: no-drag !important; width: 85px; height: 85px; background-color: ${colorOscuroNativo} !important; ${blurNativo} border: ${bordeNativo}; border-radius: 50%; display: flex; items: center; justify-content: center; box-shadow: 0 15px 20px rgba(0,0,0,0.4); overflow: hidden; padding: 10px; box-sizing: border-box; }
      .logo-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
    </style>
    <script>
      function mutar(m){
        const e = document.getElementById('modo-ext');
        const c = document.getElementById('modo-com');
        if(m === 'cerrar'){
          e.style.setProperty('display', 'none', 'important');
          c.style.display = 'flex';
          c.style.setProperty('display', 'flex', 'important');
        } else {
          e.style.setProperty('display', 'grid', 'important');
          c.style.setProperty('display', 'none', 'important');
        }
      }
      async function dispararFuncion(m){ 
        try{ await fetch('/api/funcion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modulo:m})}); }catch(e){} 
      }
    </script>
  </head>
  <body>
    <div id="modo-ext" class="capsula-cruz" style="display: grid;">
      <div></div>
      <div onclick="dispararFuncion('braille')" title="Braille" class="icon-btn" style="font-size: 26px; font-weight: bold;">${iconBraille}</div>
      <div></div>
      <div onclick="dispararFuncion('señas')" title="Lenguaje de Señas" class="icon-btn">${iconSeñas}</div>
      <div onclick="mutar('cerrar')" class="punto-ico icon-btn">•</div>
      <div onclick="dispararFuncion('texto')" title="Texto" class="icon-btn" style="font-size: 22px; font-weight: bold; font-family: 'Times New Roman', serif; line-height: 1;">${iconTexto}</div>
      <div></div>
      <div onclick="dispararFuncion('voz')" title="Voz" class="icon-btn">${iconVoz}</div>
      <div></div>
    </div>
    
    <div id="modo-com" class="capsula-compacta">
      <div onclick="mutar('abrir')" class="icon-btn logo-circulo">
        <img src="/logo.png" class="logo-img" />
      </div>
    </div>
  </body>
  </html>`;
}