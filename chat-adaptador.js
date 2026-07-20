export function adaptarDispositivo(userAgent, config) {
  const esMovil = /android|iphone|ipad|iemobile|wpdesktop/i.test(userAgent);
  if (esMovil) {
    return `
      <!-- INTERFAZ POLIMÓRFICA ADAPTADA NATIVA PARA DISPOSITIVOS MÓVILES -->
      <div id="app-movil" style="width:100vw; height:100vh; background:#111; color:#fff; font-family:system-ui; padding:20px; box-sizing:border-box; display:flex; flex-direction:column;">
        <div style="font-weight:bold; padding-bottom:15px; border-bottom:1px solid #222; display:flex; justify-content:between;"><span>${config.nombreIA} Mobile</span><span style="color:#38bdf8;">&#9673; Cloud</span></div>
        <div id="chat" style="flex:1; overflow-y:auto; margin:15px 0; padding:10px;"></div>
        <div style="display:flex; gap:10px;">
          <input type="text" id="in" style="flex:1; background:#222; border:none; padding:12px; color:#fff; border-radius:8px; font-family:system-ui;" placeholder="Enviar comando agéntico...">
          <button onclick="send()" style="background:#4f46e5; border:none; color:#fff; padding:0 20px; border-radius:8px; font-family:system-ui;">Enviar</button>
        </div>
      </div>`;
  }
  return `
    <!-- INTERFAZ FLOTANTE INDEPENDIENTE NATIVA PARA ESCRITORIO PC -->
    <div id="app-pc" style="width:320px; height:420px; background:rgba(20,20,20,0.85); backdrop-filter:blur(25px); color:#fff; font-family:system-ui; border-radius:50%; border:1px solid rgba(255,255,255,0.08); box-shadow:none !important; display:flex; align-items:center; justify-content:center;">
      <div style="text-align:center; font-weight:bold; font-size:24px; letter-spacing:2px; color:#38bdf8; text-shadow:none;">&#9587;</div>
    </div>`;
}