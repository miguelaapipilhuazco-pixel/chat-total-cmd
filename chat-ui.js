import path from 'path';

export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  let radioBordesDinamico = '50%';
  let colorOscuroNativo = 'rgba(32, 32, 32, 0.85)'; // Cristal oscuro esmerilado Windows 11
  let blurNativo = 'backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);';
  let bordeNativo = '1px solid rgba(255, 255, 255, 0.12)';
  
  // VECTOR MAESTRO DE MANOS INTEGRADO: Trazos lineales limpios en blanco translúcido
  let iconBraille = '&#x2817;&#x2803;'; 
  let iconSeñas = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 14H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"/>
    <path d="M22 14h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"/>
  </svg>`; 
  let iconTexto = 'Tᴛ'; 
  let iconVoz = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/></svg>`;

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
        transition: transform 0.2s ease, filter 0.2s, color 0.2s; 
        cursor: pointer; display: flex; items: center; justify-content: center; 
        border: none !important; background: transparent !important; box-shadow: none !important;
        width: 36px; height: 36px; color: rgba(255, 255, 255, 0.7) !important; 
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
      <div onclick="dispararFuncion('braille')" title="Braille" class="icon-btn" style="color: rgba(255, 255, 255, 0.7); font-size: 26px; font-weight: bold;">${iconBraille}</div>
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

