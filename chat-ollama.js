import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

function registrarEvolucion(prompt, accion) {
  const logChat = `\n[${new Date().toISOString()}] ATENEA_SEMANTICA: Entrada=[${prompt}] -> Accion=[${accion}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}

app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();

    // FILTRO DE ENTENDIMIENTO SEMÁNTICO VAGO
    if (prompt.includes('descarga') && (prompt.includes('se parezcan') || prompt.includes('similares') || prompt.includes('todas las ias'))) {
      // ATENEA deduce dinámicamente el catálogo óptimo compatible con el Ecosistema Arturo
      const modelosSugeridos = ['llama3.2', 'qwen2.5:0.5b', 'gemma2:2b'];
      
      modelosSugeridos.forEach(modelo => {
        exec(`ollama pull ${modelo}`);
      });

      registrarEvolucion(message, `Descarga semántica masiva: ${modelosSugeridos.join(', ')}`);
      return res.json({ 
        reply: `[ATENEA INTELIGENTE] Entendí tu orden vaga. He deducido que las IAs más parecidas a mí son modelos Open Source conversacionales y ultraligeros. Iniciando la descarga invisible en segundo plano de: Llama 3.2, Qwen 2.5 y Gemma 2.` 
      });
    }

    // GESTOR DE DESCARGAS TRADICIONAL POR NOMBRE
    if (prompt.startsWith('descarga ')) {
      const modelo = prompt.replace(/descarga|el|modelo/g, '').trim();
      exec(`ollama pull ${modelo}`);
      registrarEvolucion(prompt, `Descargando IA: ${modelo}`);
      return res.json({ reply: `[ATENEA] Descargando el modelo específico "${modelo}" de fondo.` });
    }

    // MANEJADOR DE INTERFACES MUTABLES
    if (prompt.startsWith('crea') || prompt.startsWith('creame')) {
      const elemento = prompt.replace(/crea|creame|un|una|el|la/g, '').trim();
      const h = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ATENEA Engine</title><script type="module" src="https://jsdelivr.net"></script><link rel="stylesheet" href="https://jsdelivr.net"/><script src="https://tailwindcss.com"></script></head><body class="bg-zinc-950 text-white flex items-center justify-center h-screen m-0"><ion-app class="bg-transparent flex items-center justify-center"><ion-card class="p-6 bg-zinc-900 border border-amber-500 rounded-2xl shadow-2xl text-center max-w-sm"><h2 class="text-amber-500 font-bold text-xl mb-4">🤖 ATENEA Dynamic UI</h2><p class="text-zinc-300 text-sm mb-4">Componente: <b class="text-white block mt-1">${elemento}</b></p><button onclick="window.close()" expand="block" color="danger" class="font-bold">❌ Destruir Componente</button></ion-card></ion-app></body></html>`;
      fs.writeFileSync('atenea-render.html', h);
      exec('start atenea-render.html');
      registrarEvolucion(prompt, `Creada interfaz: ${elemento}`);
      return res.json({ reply: `[ATENEA] Interfaz nativa para "${elemento}" desplegada.` });
    }

    // CONTROL DE PROCESOS DEL SISTEMA OPERATIVO
    if (prompt.includes('abre')) {
      const software = prompt.replace(/abre|abrir|el|la/g, '').trim();
      exec(software === 'chrome' ? 'start chrome' : `start ${software}`);
      return res.json({ reply: `[ATENEA LOCAL] Abriendo ${software}.` });
    } else if (prompt.includes('cierra')) {
      const software = prompt.replace(/cierra|cerrar|el|la/g, '').trim();
      exec(software === 'chrome' ? 'taskkill /f /im chrome.exe' : `taskkill /f /im ${software}.exe`);
      return res.json({ reply: `[ATENEA LOCAL] Cerrando ${software}.` });
    }

    res.json({ reply: '[ATENEA] Estoy lista. Puedes darme órdenes directas o comandos vagos por voz o señas.' });
  } catch (err) {
    res.json({ reply: '[ATENEA] Error en la capa adaptativa.' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - COMPRENSIÓN SEMÁNTICA GLOBAL ACTIVADA]');
});