import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
let modeloOllama = 'llama3.2:latest';
function registrarConversacion(message, respuestaIA) {
  const logChat = `\n[${new Date().toISOString()}] Ecosistema=Arturo IA=ATENEA Msg=[${message}] Rsp=[${respuestaIA}]`;
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
    // INTERFAZ DIRECTA DE CONTROL PARA OLLAMA
    if (prompt.startsWith('ejecuta en ollama ') || prompt.startsWith('pregunta a ollama ')) {
      const consulta = message.substring(19);
      exec(`ollama run ${modeloOllama} "${consulta}"`, (err, stdout) => {
        if (err) return res.json({ reply: '[ATENEA] El motor local de Ollama esta apagado. Di "enciende ollama" para despertarlo.' });
        registrarConversacion(message, stdout.trim());
        return res.json({ reply: `[ATENEA via Ollama]: ${stdout.trim()}` });
      });
      return;
    }
    if (prompt === 'enciende ollama' || prompt === 'activar ollama') {
      exec('start ollama app');
      return res.json({ reply: '🧬 [ATENEA] Despertando el motor local de Ollama en segundo plano. Esperando inicializacion de capas...' });
    }
    if (prompt === 'apaga ollama' || prompt === 'liberar ram') {
      exec('taskkill /f /im ollama.exe');
      return res.json({ reply: '📉 [ATENEA] Motor de Ollama completamente apagado de la RAM. Ecosistema Arturo optimizado al 100%.' });
    }
    if (prompt.startsWith('cambia modelo a ')) {
      modeloOllama = prompt.substring(16).trim();
      return res.json({ reply: `✨ [ATENEA] Configuracion actualizada. Las consultas de Ollama ahora apuntaran al cerebro: ${modeloOllama}` });
    }
    // MAREADOR DINÁMICO DE PROGRAMAS NATIVOS
    if (prompt.startsWith('abre ')) {
      const programa = prompt.substring(5).replace(/[^a-z0-9]/g, '');
      let comandoEjecucion = programa;
      if (programa === 'powerpoint' || programa === 'ppt') comandoEjecucion = 'start powerpnt';
      else if (programa === 'word') comandoEjecucion = 'start winword';
      else if (programa === 'excel') comandoEjecucion = 'start excel';
      else if (programa === 'blocdenotas' || programa === 'bloc') comandoEjecucion = 'notepad.exe';
      else if (programa === 'calculadora') comandoEjecucion = 'calc.exe';
      else if (programa === 'chrome') comandoEjecucion = 'start chrome';
      else comandoEjecucion = `start ${programa}`;
      exec(comandoEjecucion);
      registrarConversacion(message, `Abriendo ${programa}`);
      return res.json({ reply: `[ATENEA] Entendido. Ejecutando la apertura de ${programa} de forma inmediata.` });
    }
    res.json({ reply: '✨ Hola, soy ATENEA. Estoy lista en segundo plano para abrir tus programas o controlar a Ollama cuando me lo pidas.' });
  } catch (err) {
    res.json({ reply: 'Ecosistema Arturo Operativo bajo el control de ATENEA.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ECOSISTEMA ARTURO - ATENEA CON INTERFAZ DE OLLAMA ACTIVA]');
  setInterval(actualizarInfraestructura, 300000);
});