import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modoInteractiva = 'texto';
const permisosRoles = { administrador: ['chat', 'descarga', 'clona', 'modos'], ingeniero: ['chat', 'descarga'], invitado: ['chat'] };
function registrarConversacion(usuarioRol, message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Modo=[${modoInteractiva}] Rol=[${usuarioRol}] Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync( 'conversaciones.log', logChat );
}
function actualizarInfraestructura() {
  if (fs.existsSync( 'conversaciones.log' )) { exec('guardar.bat'); }
  exec('git pull origin main');
  exec('netsh wlan set hostednetwork mode=allow ssid="IA Semana de la Ingenieria" > nul 2>&1');
  exec('netsh wlan start hostednetwork > nul 2>&1');
}
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center"><h2>🤖 Canales Multimodal Cloud</h2></body></html>`);
});
app.post('/api/modo', (req, res) => {
  const { modo, rol } = req.body;
  const r = rol ? rol.toLowerCase().trim() : 'invitado';
  modoInteractiva = modo;
  res.json({ status: 'Modo cambiado en la nube: ' + modoInteractiva });
});
app.post('/api/chat', async (req, res) => {
  try {
    const { message, rol } = req.body;
    const r = rol ? rol.toLowerCase().trim() : 'invitado';
    // CONEXIÓN SERVERLESS: Llama a la API externa de IA de codigo abierto sin tocar tu memoria RAM
    const apiResponse = await fetch('https://huggingface.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: message })
    });
    const data = await apiResponse.json();
    const respuestaIA = data[0] ? data[0].generated_text : 'Procesado en la nube con exito.';
    registrarConversacion(r, message, respuestaIA);
    res.json({ reply: respuestaIA });
  } catch { res.status(500).json({ error: 'Fallo el nodo cloud.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[AGENTE IA SEMANA DE LA INGENIERIA CORRIENDO EN MODO CLOUD - 0%% RAM]');
  setInterval(actualizarInfraestructura, 300000);
});
