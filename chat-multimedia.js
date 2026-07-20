export function obtenerPaneles() {
  return `<!-- MÓDULO 1: MINI INTERFAZ DE CHAT ADAPTATIVA -->
    <div id="modulo-chat" class="panel-multimedia h-[200px]" style="display: none;">
      <div class="panel-header">Canal de Texto Residente</div>
      <div id="chat-box" class="chat-box-area">
        <div class="chat-ia-text">[IA] Sistema en línea. Escribe una orden, Administrador...</div>
      </div>
      <div class="chat-input-row">
        <input id="chat-input" onkeydown="if(event.key==='Enter') enviarMensaje()" type="text" class="chat-field" placeholder="Enviar directiva..." />
        <button onclick="enviarMensaje()" class="chat-btn">✔</button>
      </div>
    </div>

    <!-- MÓDULO 2: RECUADRO CON AVATAR 3D DE ROBOT SIN GÉNERO -->
    <div id="modulo-camara" class="panel-multimedia h-[240px]" style="display: none;">
      <div class="panel-header">Inteligencia de Visión YOLOv11</div>
      <div class="avatar-stream-area relative overflow-hidden" style="height: 180px; position: relative;">
        <canvas id="avatar-3d-canvas" style="width: 100%; height: 100%; position: absolute; inset: 0; z-index: 10; background: transparent;"></canvas>
        <div style="position: absolute; bottom: 8px; left: 8px; right: 8px; background: rgba(15, 15, 15, 0.85); border: 1px solid rgba(255,255,255,0.06); padding: 8px; border-radius: 12px; z-index: 20; text-align: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
          <span id="avatar-status" style="font-size: 11px; color: #f59e0b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Modelo 3D Humanoide Activo</span>
          <p class="avatar-desc" style="font-size: 9px; color: #a1a1aa; margin: 4px 0 0 0; line-height: 1.3; font-weight: 500;">Traduciendo streams visuales y ejecutando señas cinemáticas en tiempo real.</p>
        </div>
      </div>
    </div>`;
}
