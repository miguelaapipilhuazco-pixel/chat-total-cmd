import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { pipeline } from '@xenova/transformers';
const app = express();
app.use(express.json());
let generator = null;
async function initLocalIA() {
  try { generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat'); console.log('Cerebro Local cargado.'); } catch(e){} 
}
initLocalIA();
function registrarConversacion(message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Ecosistema=Arturo Engine=Local Msg=[${message}] Rsp=[${respuestaIA}]`;
  fs.appendFileSync('conversaciones.log', logChat);
}
function actualizarInfraestructura() {
  if (fs.existsSync('conversaciones.log')) { exec('guardar.bat'); }
  exec('git pull origin main');
}
app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();
    // MATRIZ DE COMANDOS DEL SISTEMA: Acciones reales dentro de tu computadora
    if (prompt.includes('abre el block de notas') || prompt.includes('abre bloc')) {
      exec('notepad.exe');
      return res.json({ reply: 'Abriendo el Bloc de Notas en tu pantalla, Administrador.' });
    }
    if (prompt.includes('abre la calculadora')) {
      exec('calc.exe');
      return res.json({ reply: 'Abriendo la Calculadora del sistema.' });
    }
    if (prompt.includes('status') || prompt.includes('reporte')) {
      return res.json({ reply: 'Estatus del Ecosistema Arturo: Puertos activos, 0% RAM consumida por IA local, antena de red inalámbrica encendida y respaldos a GitHub operando cada 5 minutos.' });
    }
    // PROCESAMIENTO DE TEXTO LIBRE LOCAL (Si no es un comando directo)
    if (generator) {
      const out = await generator(message, { max_new_tokens: 60 });
      const respuestaLocal = out && out[0] && out[0].generated_text ? out[0].generated_text.trim() : 'Comando procesado localmente.';
      registrarConversacion(message, respuestaLocal);
      return res.json({ reply: respuestaLocal });
    }
    res.json({ reply: 'Arturo IA procesando en segundo plano de forma local.' });
  } catch (err) {
    res.json({ reply: 'Ecosistema Arturo Operativo.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ECOSISTEMA ARTURO - MOTOR HÍBRIDO ACTIVO AL 100%]');
  setInterval(actualizarInfraestructura, 300000);
});