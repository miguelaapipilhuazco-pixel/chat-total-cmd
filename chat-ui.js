import path from 'path';
import { obtenerPaneles } from './chat-multimedia.js';

export function obtenerInterfaz(userAgent, config, colorFondo, efectoBlur, estiloBorder, radioBordes) {
  let colorOscuroNativo = 'rgba(32, 32, 32, 0.85)'; // Cristal oscuro esmerilado Windows 11
  let blurNativo = 'backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);';
  let bordeNativo = '1px solid rgba(255, 255, 255, 0.12)';
  
  let iconBraille = '&#x2817;&#x2803;'; 
  let iconSeñas = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="3" y="11" width="2.5" height="5" rx="1.2"/><rect x="6.5" y="5" width="2.3" height="10" rx="1.1"/><rect x="10" y="3" width="2.2" height="12" rx="1.1"/><rect x="13.5" y="4.5" width="2.3" height="10.5" rx="1.1"/><rect x="17" y="7" width="2.4" height="8" rx="1.2"/><path d="M3.3 14.5c0 0-.3 4.5 4.7 5.5h6c4 0 5-4.5 5-5.5v-2H3.3v2z"/></svg>`; 
  let iconTexto = 'Tᴛ'; 
  let iconVoz = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="9" y="2" width="6" height="12" rx="3" ry="3"/><path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-4.08A7 7 0 0 0 19 10z"/></svg>`;

  const panelesHijo = obtenerPaneles();

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IA Cruz Multimedia</title>
    <script src="https://tailwindcss.com"></script>
    <style>
      body { background: transparent !important; margin: 0; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; width: 100vw; height: 100vh; display: flex; flex-direction: column; items: center; justify-content: flex-start; padding-top: 20px; }
      
      .capsula-cruz {
        -webkit-app-region: drag !important; width: 112px; height: 112px;
        background-color: ${colorOscuroNativo} !important; ${blurNativo} border: ${bordeNativo}; border-radius: 50%;
        display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);
        align-items: center; justify-items: center; padding: 4px; box-sizing: border-box; cursor: move; box-shadow: none !important;
      }
      .icon-wrapper { position: relative; display: flex; align-items: center; justify-content: center; }
      .icon-btn { -webkit-app-region: no-drag !important; transition: transform 0.2s ease; cursor: pointer; display: flex; items: center; justify-content: center; border: none !important; background: transparent !important; box-shadow: none !important; filter: none !important; width: 30px; height: 36px; fill: rgba(255, 255, 255, 0.7) !important; color: rgba(255, 255, 255, 0.7) !important; }
      .icon-btn:hover { transform: scale(1.15); fill: rgba(255, 255, 255, 1) !important; color: rgba(255, 255, 255, 1) !important; }
      .punto-ico { font-size: 26px; color: rgba(255, 255, 255, 0.5); line-height: 1; -webkit-app-region: no-drag !important; cursor: pointer; display: flex; items: center; justify-content: center; width: 20px; height: 20px; margin-top: -6px; }
      
      /* ESTILOS DE INTERFAZ MULTIMEDIA COMPACTA LOCAL */
      .panel-multimedia { display: none; -webkit-app-region: no-drag !important; width: 260px; background-color: ${colorOscuroNativo}; ${blurNativo} border: ${bordeNativo}; border-radius: 20px; padding: 12px; color: white; margin-top: 14px; box-sizing: border-box; flex-direction: column; gap: 8px; }
      .panel-header { font-size: 10px; uppercase: true; font-weight: bold; tracking-pattern: uppercase; letter-spacing: 1px; color: #a1a1aa; border-bottom: 1px solid #27272a; padding-bottom: 4px; text-transform: uppercase; }
      .chat-box-area { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; max-height: 110px; }
      .chat-ia-text { font-size: 12px; font-family: monospace; color: #a1a1aa; }
      .chat-user-text { font-size: 12px; color: #f59e0b; text-align: right; font-weight: 500; }
      .chat-input-row { display: flex; gap: 4px; border-top: 1px solid #27272a; padding-top: 6px; }
      .chat-field { flex: 1; bg-color: #09090b; background: rgba(9,9,11,0.6); border: 1px solid #27272a; border-radius: 8px; padding: 4px 8px; font-size: 12px; color: white; outline: none; }
      .chat-btn { background: #27272a; border-radius: 8px; color: white; border: none; padding: 4px 10px; font-size: 12px; cursor: pointer; font-weight: bold; }
      .avatar-stream-area { flex: 1; background: rgba(9,9,11,0.8); border-radius: 12px; border: 1px solid rgba(39,39,42,0.5); display: flex; flex-direction: column; items: center; justify-content: center; padding: 8px; text-align: center; gap: 4px; }
      .avatar-mesh { font-size: 24px; }
      .avatar-title { font-size: 11px; color: #f59e0b; font-weight: bold; }
      .avatar-desc { font-size: 9px; color: #a1a1aa; margin: 0; line-height: 1.2; padding: 0 8px; }
      
      .active-mic { animation: pulse-red 1.5s infinite; color: #ef4444 !important; }
      @keyframes pulse-red { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; color: #f87171; } 100% { transform: scale(1); opacity: 0.5; } }
    </style>
    <script>
      function alternarModulo(modulo) {
        const chat = document.getElementById('modulo-chat');
        const camara = document.getElementById('modulo-camara');
        const punto = document.getElementById('punto-central');
        
        chat.style.display = 'none';
        camara.style.display = 'none';
        punto.classList.remove('active-mic');
        punto.innerText = '•';

        if(modulo === 'texto') chat.style.display = 'flex';
        else if(modulo === 'señas') camara.style.display = 'flex';
        else if(modulo === 'voz') { punto.classList.add('active-mic'); punto.innerText = '🎙'; }
      }

      async function enviarMensaje() {
        const input = document.getElementById('chat-input');
        const box = document.getElementById('chat-box');
        if(!input.value.trim()) return;
        
        box.innerHTML += '<div class=\"chat-user-text\">Tú: ' + input.value + '</div>';
        const promor = input.value;
        input.value = '';

        try {
          const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:promor}) });
          const data = await res.json();
          box.innerHTML += '<div class=\"chat-ia-text\" style=\"color:#e4e4e7; margin-top:3px;\">IA: ' + data.reply + '</div>';
          box.scrollTop = box.scrollHeight;
        } catch(e){}
      }
    </script>
  </head>
  <body>
    
    <div class="capsula-cruz">
      <div></div>
      <div class="icon-wrapper"><div onclick=\"dispararFuncion(\x27braille\x27)\" class="icon-btn" style="font-size: 24px; font-weight: bold;">${iconBraille}</div></div>
      <div></div>
      <div class="icon-wrapper"><div onclick="alternarModulo('señas')" class="icon-btn">${iconSeñas}</div></div>
      <div class="icon-wrapper"><div id="punto-central" class="punto-ico icon-btn">•</div></div>
      <div class="icon-wrapper"><div onclick="alternarModulo('texto')" class="icon-btn" style="font-size: 20px; font-weight: bold; font-family: 'Times New Roman', serif; line-height: 1;">${iconTexto}</div></div>
      <div></div>
      <div class="icon-wrapper"><div onclick="alternarModulo('voz')" class="icon-btn">${iconVoz}</div></div>
      <div></div>
    </div>

    ${panelesHijo}

  </body>
  </html>`;
}
