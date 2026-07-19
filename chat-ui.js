import path from 'path';

export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  // CONFIGURACIÓN POLIMÓRFICA DE COLORES NATIVOS SEGÚN EL DISPOSITIVO
  let radioBordesDinamico = '50%';
  let colorOscuroNativo = 'rgba(32, 32, 32, 0.85)'; // Color oscuro Mica oficial de Windows 11
  let blurNativo = 'backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);';
  let bordeNativo = '1px solid rgba(255, 255, 255, 0.12)';
  
  // SÍMBOLOS DINÁMICOS ADAPTADOS A CADA DISPOSITIVO (INFOGRAFÍA REAL)
  let iconBraille = '&#x2817;&#x2803;'; 
  let iconSeñas = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 10a2 2 0 0 1 2 2v4H7a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2zm12 0a2 2 0 0 1 1 2v2a2 2 0 0 1-2 2h-1v-4a2 2 0 0 1 2-2zm-6-6a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z"/></svg>'; 
  let iconTexto = 'Tᴛ'; 
  let iconVoz = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 9a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V20a1 1 0 0 0 2 0v-2.08A7 7 0 0 0 19 11z"/></svg>';

  if (userAgent.includes('android') || userAgent.includes('watch')) {
    radioBordesDinamico = '50%'; 
    colorOscuroNativo = 'rgba(10, 10, 10, 0.98)'; 
    blurNativo = ''; 
    bordeNativo = '1px solid rgba(255, 255, 255, 0.05)';
    iconBraille = '⠇⠃'; 
    iconTexto = '⌨';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('macintosh')) {
    radioBordesDinamico = '30px'; 
    colorOscuroNativo = 'rgba(28, 28, 30, 0.85)'; 
    blurNativo = 'backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);'; 
    bordeNativo = 'none';
  }

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IA Cruz Dynamic</title>
    <style>
      body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; }
      
      /* ESTADO 1: CAPSULA EN CRUZ ULTRA-COMPACTA */
      .capsula-cruz {
        -webkit-app-region: drag; 
        width: 150px; height: 150px;
        background-color: ${colorOscuroNativo} !important;
        ${blurNativo}
        border: ${bordeNativo};
        border-radius: 50%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        align-items: center; justify-items: center; 
        padding: 12px; box-sizing: border-box; cursor: move;
      }
      
      /* ESTADO 2: CONTENEDOR COMPACTO DEL LOGOTIPO CON EL MISMO COLOR OSCURO FIJADO */
      .capsula-compacta {
        -webkit-app-region: drag; 
        width: 150px; height: 150px;
        display: none; align-items: center; justify-content: center; 
        background: transparent !important; cursor: move;
      }
      
      .icon-btn { 
        -webkit-app-region: no-drag !important; 
        transition: transform 0.2s ease, filter 0.2s, color 0.2s; 
        cursor: pointer; display: flex; items: center; justify-content: center; 
        border: none !important; background: transparent !important; 
        width: 36px; height: 36px; 
        fill: rgba(255, 255, 255, 0.7); color: rgba(255, 255, 255, 0.7) !important; 
      }
      .icon-btn:hover { transform: scale(1.15); filter: brightness(1.4) !important; }
      .icon-btn:active { transform: scale(0.92); }
      
      .punto-ico { 
        font-size: 28px; color: rgba(255, 255, 255, 0.5); line-height: 1; 
        -webkit-app-region: no-drag; cursor: pointer; display: flex; 
        items: center; justify-content: center; width: 24px; height: 24px; 
      }
      .punto-ico:hover { color: rgba(255, 255, 255, 0.9); }
      
      .logo-circulo { 
        -webkit-app-region: no-drag !important; 
        width: 90px; height: 90px; 
        background-color: ${colorOscuroNativo} !important; 
        ${blurNativo} 
        border: ${bordeNativo}; 
        border-radius: 50%; display: flex; items: center; justify-content: center; 
        box-shadow: 0 15px 20px rgba(0,0,0,0.4); overflow: hidden; padding: 10px; box-sizing: border-box; 
      }
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
      <div onclick="dispararFuncion('braille')" title="Braille" class="icon-btn" style="color: rgba(255, 255, 255, 0.7); font-size: 26px; font-weight: bold; font-family: system-ui, sans-serif;">${iconBraille}</div>
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
