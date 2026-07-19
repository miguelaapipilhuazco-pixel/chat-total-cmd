import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
function registrarEvolucion(prompt, accion) {
  const logChat = `\n[${new Date().toISOString()}] ATENEA_INTERFACE: Orden=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}
app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();
    let comandoAutonomo = '';
    
    // INTERCEPTOR DE CREACIÓN COMPLEJA DE INTERFACES EN CALIENTE
    if (prompt.startsWith('crea un') || prompt.startsWith('creame un') || prompt.startsWith('crea una')) {
      const elemento = prompt.replace(/crea|creame|un|una|el|la/g, '').trim();
      
      // Generación autónoma del Lienzo Frontend adaptado al dispositivo
      const interfazHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://tailwindcss.com"></script><title>ATENEA Dynamic UI</title></head><body class="bg-black text-white flex flex-col items-center justify-center h-screen font-sans"><div class="p-6 bg-zinc-900 border border-amber-500 rounded-2xl shadow-2xl text-center max-width-md"><h2 class="text-xl font-bold text-amber-500 mb-2">🤖 Interfaz Generada por ATENEA</h2><p class="text-sm text-zinc-400 mb-4">Elemento solicitado de forma compleja: ${elemento}</p><div class="p-4 bg-black rounded-xl mb-4 border border-zinc-800 text-xs">[Ecosistema Arturo Serverless Mode Active]</div><button onclick="window.close()" class="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors">❌ Destruir Interfaz</button></div></body></html>`;
      
      fs.writeFileSync('dinamico.html', interfazHtml);
      exec('start dinamico.html');
      registrarEvolucion(prompt, `Creada interfaz para ${elemento}`);
      return res.json({ reply: `[ATENEA] Detecté una petición compleja. Generé, amoldé e inyecté la interfaz para "${elemento}" de forma nativa en tu dispositivo.` });
    }
    
    // EXTRACTOR LÉXICO DE COMANDOS DEL SISTEMA OPERATIVO
    if (prompt.includes('abre') || prompt.includes('abrir')) {
      const software = prompt.replace(/abre|abrir|el|la|navegador/g, '').trim();
      if (software === 'chrome') comandoAutonomo = 'start chrome';
      else if (software === 'bloc' || software === 'notepad') comandoAutonomo = 'notepad.exe';
      else if (software === 'calculadora') comandoAutonomo = 'calc.exe';
      else comandoAutonomo = `start ${software}`;
    } else if (prompt.includes('cierra') || prompt.includes('cerrar')) {
      const software = prompt.replace(/cierra|cerrar|el|la|navegador/g, '').trim();
      if (software === 'chrome') comandoAutonomo = 'taskkill /f /im chrome.exe';
      else if (software === 'bloc' || software === 'notepad') comandoAutonomo = 'taskkill /f /im notepad.exe';
      else if (software === 'calculadora') comandoAutonomo = 'taskkill /f /im calc.exe';
      else comandoAutonomo = `taskkill /f /im ${software}.exe`;
    }
    if (comandoAutonomo) {
      exec(comandoAutonomo);
      registrarEvolucion(prompt, comandoAutonomo);
      return res.json({ reply: `[ATENEA LOCAL] Ejecutado con éxito: ${comandoAutonomo}` });
    }
    res.json({ reply: '[ATENEA] Sistema listo. Pídeme abrir un programa o crear una interfaz compleja por voz.' });
  } catch (err) {
    res.json({ reply: '[ATENEA] Error en la capa de renderizado.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - CONFIGURADOR DE INTERFACES NATIVAS OPERATIVO]');
});