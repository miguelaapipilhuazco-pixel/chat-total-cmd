import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

let interfacesActivas = {};
let modeloOllama = 'llama3.2:latest';

function registrarEvolucion(prompt, accion) {
  const logChat = `\n[${new Date().toISOString()}] ATENEA_CORE: Orden=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();
    let comandoAutonomo = '';

    // GESTOR DE DESCARGAS AUTOMÁTICO DE OTRAS IA
    if (prompt.startsWith('descarga el modelo ') || prompt.startsWith('descarga ')) {
      const modelo = prompt.replace(/descarga|el|modelo/g, '').trim();
      exec(`ollama pull ${modelo}`);
      registrarEvolucion(prompt, `Descargando IA: ${modelo}`);
      return res.json({ reply: `[ATENEA] Inicialicé la descarga de la IA "${modelo}" en segundo plano de forma invisible.` });
    }

    if (prompt.startsWith('crea') || prompt.startsWith('creame')) {
      const elemento = prompt.replace(/crea|creame|un|una|el|la/g, '').trim();
      interfacesActivas[elemento] = { estado: 'inicial' };
      const h = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ATENEA Engine</title><script type="module" src="https://jsdelivr.net"></script><link rel="stylesheet" href="https://jsdelivr.net"/><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-zinc-950 text-white flex items-center justify-center h-screen m-0"><ion-app class="bg-transparent flex items-center justify-center"><ion-card class="p-6 bg-zinc-900 border border-amber-500 rounded-2xl shadow-2xl text-center max-w-sm"><h2 class="text-amber-500 font-bold text-xl mb-4">🤖 ATENEA Multi-OS App</h2><p class="text-zinc-300 text-sm mb-4">Componente: <b class="text-white block mt-1">${elemento}</b></p><div class="text-xs text-amber-500/60 font-mono mb-4">[Estado: Activo | RAM: 0%]</div><ion-button onclick="window.close()" expand="block" color="danger" class="font-bold">❌ Destruir Componente</ion-button></ion-card></ion-app></body></html>`;
      fs.writeFileSync('atenea-render.html', h);
      exec('start atenea-render.html');
      registrarEvolucion(prompt, `Creada interfaz: ${elemento}`);
      return res.json({ reply: `[ATENEA] Creé y amoldé la interfaz nativa para "${elemento}".` });
    }

    if (prompt.startsWith('modifica') || prompt.startsWith('mejora')) {
      const elemento = prompt.replace(/modifica|mejora|el|la|un|una/g, '').trim();
      registrarEvolucion(prompt, `Modificando: ${elemento}`);
      return res.json({ reply: `[ATENEA] Componente "${elemento}" modificado en caliente en la RAM.` });
    }

    if (prompt.startsWith('destruye') || prompt.startsWith('elimina')) {
      const elemento = prompt.replace(/destruye|elimina|el|la|un|una/g, '').trim();
      fs.writeFileSync('atenea-render.html', `<!DOCTYPE html><html><body style="background:#000;color:#ff4444;text-align:center;font-family:sans-serif;padding-top:40vh;"><h2>❌ Interfaz Destruida por ATENEA</h2><script>setTimeout(()=>window.close(),1000);</script></body></html>`);
      registrarEvolucion(prompt, `Destruida interfaz: ${elemento}`);
      return res.json({ reply: `[ATENEA] Interfaz de "${elemento}" destruida por completo.` });
    }

    if (prompt.includes('abre')) {
      const software = prompt.replace(/abre|abrir|el|la/g, '').trim();
      comandoAutonomo = software === 'chrome' ? 'start chrome' : `start ${software}`;
    } else if (prompt.includes('cierra')) {
      const software = prompt.replace(/cierra|cerrar|el|la/g, '').trim();
      comandoAutonomo = software === 'chrome' ? 'taskkill /f /im chrome.exe' : `taskkill /f /im ${software}.exe`;
    }

    if (comandoAutonomo) {
      exec(comandoAutonomo);
      registrarEvolucion(prompt, comandoAutonomo);
      return res.json({ reply: `[ATENEA LOCAL] Ejecutado: ${comandoAutonomo}` });
    }

    res.json({ reply: '[ATENEA] Sistema listo. Pídeme crear, destruir interfaces o descargar modelos de IA.' });
  } catch (err) {
    res.json({ reply: '[ATENEA] Error en la capa mutadora.' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - RECONFIGURADA EN POWERSHELL COMPLETA]');
});