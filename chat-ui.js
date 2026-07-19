import path from 'path';
export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  let iconBraille = '&#x2817;&#x2803;'; let iconSeñas = '🙌'; let iconTexto = 'Tᴛ'; let iconVoz = '🎙';
  if (userAgent.includes('android') || userAgent.includes('watch')) {
    radioBordes = '50px'; colorFondo = 'rgba(10, 10, 10, 0.98)'; efectoBlur = ''; estiloBorder = 'none';
    iconBraille = '⠇⠃'; iconSeñas = '🫱'; iconTexto = '⌨'; iconVoz = '🎧';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    radioBordes = '30px'; colorFondo = 'rgba(28, 28, 30, 0.9)'; efectoBlur = 'backdrop-filter: blur(20px);'; estiloBorder = 'none';
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>IA PolyOS</title><script src="https://tailwindcss.com"></script><style>body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, sans-serif; width: 100vw; height: 100vh; display: flex; items: center; justify-content: center; } .capsula-extendida { -webkit-app-region: drag; width: 140px; height: 210px; background-color: ${colorFondo}; ${efectoBlur} border: ${estiloBorder}; border-radius: ${radioBordes}; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); display: flex; flex-direction: column; items: center; justify-content: space-between; padding: 20px 12px; box-sizing: border-box; cursor: move; } .capsula-compacta { -webkit-app-region: drag; width: 140px; height: 210px; display: none; align-items: center; justify-content: center; background: transparent; cursor: move; } .icon-btn { -webkit-app-region: no-drag !important; transition: transform 0.2s ease, filter 0.2s, color 0.2s; cursor: pointer; display: flex; items: center; justify-content: center; border: none !important; background: transparent !important; box-shadow: none !important; }
  
  /* RENDERS DE ALTA CALIDAD UNIFICADOS (Estilo Fotorrealista Volumetrico) */
  .icon-btn:hover { transform: scale(1.18); }
  .icon-btn:active { transform: scale(0.92); }

  .middle-row { width: 100%; display: flex; flex-direction: row; items: center; justify-content: space-between; padding: 0 4px; box-sizing: border-box; }
  
  /* REGLAS CROMÁTICAS: Estado reposo traslucido y seleccion con destello e iluminacion de alta definicion */
  .braille-ico { color: rgba(255, 255, 255, 0.65) !important; font-size: 34px; font-weight: bold; line-height: 1; height: 34px; text-shadow: 0 2px 4px rgba(0,0,0,0.4); }
  .braille-ico:hover { color: #fbbf24 !important; filter: drop-shadow(0 0 12px rgba(251,191,36,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }

  .senas-ico { font-size: 28px; width: 36px; height: 36px; filter: brightness(0) invert(1) opacity(0.65) drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }
  .senas-ico:hover { filter: none !important; filter: drop-shadow(0 0 12px rgba(245,158,11,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)) !important; }

  .texto-ico { font-size: 28px; font-weight: 900; font-family: 'Times New Roman', serif; color: rgba(255, 255, 255, 0.65) !important; letter-spacing: -2px; width: 36px; height: 36px; text-shadow: 0 2px 4px rgba(0,0,0,0.4); }
  .texto-ico:hover { color: #f59e0b !important; filter: drop-shadow(0 0 12px rgba(245,158,11,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }

  .flecha-ico { font-size: 15px; font-weight: 900; color: rgba(255, 255, 255, 0.3); width: 20px; height: 20px; text-align: center; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
  .flecha-ico:hover { color: #fbbf24; filter: drop-shadow(0 0 5px rgba(251,191,36,0.8)); }
  
  /* MICROFONO FOTORREALISTA BASELINE */
  .voz-ico { font-size: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
  .voz-ico:hover { transform: scale(1.18); filter: drop-shadow(0 0 12px rgba(251,191,36,0.7)) drop-shadow(0 2px 4px rgba(0,0,0,0.5)) !important; }

  .logo-circulo { -webkit-app-region: no-drag !important; width: 85px; height: 85px; background-color: ${colorFondo}; ${efectoBlur} border: ${estiloBorder}; border-radius: 50%; display: flex; items: center; justify-content: center; box-shadow: 0 15px 20px rgba(0,0,0,0.4); overflow: hidden; padding: 10px; box-sizing: border-box; }
  .logo-img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
  </style><script>function mutar(m){ const e=document.getElementById('modo-ext'); const c=document.getElementById('modo-com'); if(m==='cerrar'){ e.style.setProperty('display','none','important'); c.style.setProperty('display','flex','important'); }else{ e.style.setProperty('display','flex','important'); c.style.setProperty('display','none','important'); } } async function dispararFuncion(m){ try{ await fetch('/api/funcion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({modulo:m})}); }catch(e){} }</script></head><body><div id="modo-ext" class="capsula-extendida"><div onclick="dispararFuncion('braille')" title="Braille" class="braille-ico icon-btn">${iconBraille}</div><div class="middle-row"><div onclick="dispararFuncion('señas')" title="Lenguaje de Señas" class="senas-ico icon-btn">${iconSeñas}</div><div onclick="mutar('cerrar')" class="flecha-ico icon-btn">&gt;</div><div onclick="dispararFuncion('texto')" title="Texto" class="texto-ico icon-btn">${iconTexto}</div></div><div onclick="dispararFuncion('voz')" title="Voz" class="voz-ico icon-btn">${iconVoz}</div></div><div id="modo-com" class="capsula-compacta"><div onclick="mutar('abrir')" class="icon-btn logo-circulo"><img src="/logo.png" class="logo-img" /></div></div></body></html>`;
}