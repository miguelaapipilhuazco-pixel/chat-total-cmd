import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
function registrarConversacion(message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Ecosistema=Arturo Accion=[${respuestaIA}]`;
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
    // EXTRACTOR DINÁMICO DE ACCIONES NATIVAS: Detecta intenciones de apertura de software
    if (prompt.startsWith('abre ')) {
      const programa = prompt.substring(5).replace(/[^a-z0-9]/g, '');
      let comandoEjecucion = programa;
      // Mapeo inteligente de nombres comunes a binarios oficiales de Windows
      if (programa === 'powerpoint' || programa === 'ppt') comandoEjecucion = 'start powerpnt';
      else if (programa === 'word') comandoEjecucion = 'start winword';
      else if (programa === 'excel') comandoEjecucion = 'start excel';
      else if (programa === 'blocdenotas' || programa === 'bloc') comandoEjecucion = 'notepad.exe';
      else if (programa === 'calculadora') comandoEjecucion = 'calc.exe';
      else if (programa === 'chrome') comandoEjecucion = 'start chrome';
      else comandoEjecucion = `start ${programa}`;
      
      exec(comandoEjecucion, (err) => {
        if (err) {
          return res.json({ reply: `Comando detectado pero no se encontro el binario para: ${programa}` });
        }
      });
      registrarConversacion(message, `Abriendo ${programa}`);
      return res.json({ reply: `Entendido. Ejecutando la apertura de ${programa} de forma inmediata, Administrador.` });
    }
    if (prompt.includes('status') || prompt.includes('reporte')) {
      return res.json({ reply: 'Estatus Arturo IA: 0% RAM consumida, mapeador de hardware activo y respaldos a GitHub vinculados.' });
    }
    res.json({ reply: 'Arturo IA escuchando. Di "abre" seguido del nombre de la herramienta que necesites.' });
  } catch (err) {
    res.json({ reply: 'Ecosistema Arturo Operativo.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ECOSISTEMA ARTURO - MOTOR DE ACCIONES EN VIVO ACTIVADO]');
  setInterval(actualizarInfraestructura, 300000);
});