import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';
import pkg from 'duck-duck-scrape';
const { Conversation } = pkg;
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
  const { modo } = req.body;
  modoInteractiva = modo;
  res.json({ status: 'Modo conmutado: ' + modoInteractiva });
});
app.post('/api/chat', async (req, res) => {
  try {
    const { message, rol } = req.body;
    const r = rol ? rol.toLowerCase().trim() : 'invitado';
    // LLAMADA CLOUD CORREGIDA: Invoca el modulo de IA de Meta de forma 100% anonima y libre sin usar RAM local
    const response = await Conversation.ask(message, 'llama');
    registrarConversacion(r, message, response);
    res.json({ reply: response });
  } catch { res.status(500).json({ error: 'Fallo el nodo cloud libre.' }); }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[AGENTE IA SEMANA DE LA INGENIERIA TOTALMENTE OPERATIVO - MODO CLOUD]');
  setInterval(actualizarInfraestructura, 300000);
});
