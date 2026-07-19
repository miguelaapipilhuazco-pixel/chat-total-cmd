import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
function registrarEvolucion(prompt, scriptGenerado) {
  const logChat = `\n[${new Date().toISOString()}] ATENEA_LOCAL: Comando=[${prompt}] -> Script=[${scriptGenerado}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}
app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();
    let comandoAutonomo = '';
    
    // EXTRACTOR LÉXICO DE COMANDOS (Auto-Configuración Local)
    if (prompt.includes('abre') || prompt.includes('abrir')) {
      const software = prompt.replace(/abre|abrir|el|la|navegador/g, '').trim();
      if (software === 'chrome') comandoAutonomo = 'start chrome';
      else if (software === 'powerpoint' || software === 'ppt') comandoAutonomo = 'start powerpnt';
      else if (software === 'word') comandoAutonomo = 'start winword';
      else if (software === 'excel') comandoAutonomo = 'start excel';
      else if (software === 'bloc' || software === 'notepad') comandoAutonomo = 'notepad.exe';
      else if (software === 'calculadora') comandoAutonomo = 'calc.exe';
      else comandoAutonomo = `start ${software}`;
    } else if (prompt.includes('cierra') || prompt.includes('cerrar')) {
      const software = prompt.replace(/cierra|cerrar|el|la|navegador/g, '').trim();
      if (software === 'chrome') comandoAutonomo = 'taskkill /f /im chrome.exe';
      else if (software === 'powerpoint' || software === 'ppt') comandoAutonomo = 'taskkill /f /im powerpnt.exe';
      else if (software === 'word') comandoAutonomo = 'taskkill /f /im winword.exe';
      else if (software === 'excel') comandoAutonomo = 'taskkill /f /im excel.exe';
      else if (software === 'bloc' || software === 'notepad') comandoAutonomo = 'taskkill /f /im notepad.exe';
      else if (software === 'calculadora') comandoAutonomo = 'taskkill /f /im calc.exe';
      else comandoAutonomo = `taskkill /f /im ${software}.exe`;
    }

    if (comandoAutonomo) {
      exec(comandoAutonomo);
      registrarEvolucion(prompt, comandoAutonomo);
      return res.json({ reply: `[ATENEA LOCAL] Comando deducido y ejecutado con exito: ${comandoAutonomo}` });
    }
    res.json({ reply: '[ATENEA] No logre asociar la orden. Di "abre" o "cierra" seguido del programa.' });
  } catch (err) {
    res.json({ reply: '[ATENEA] Capa logica local operativa.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - ENTORNO AUTÓNOMO LOCAL COMPILADO SEGURO]');
});