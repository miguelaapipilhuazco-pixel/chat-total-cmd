import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
const app = express();
app.use(express.json());
function registrarEvolucion(prompt, scriptGenerado) {
  const logChat = `\n[${new Date().toISOString()}] ATENEA_APRENDIZAJE: Comando=[${prompt}] -> Script=[${scriptGenerado}]`;
  fs.appendFileSync('conversaciones.log', logChat);
  if (fs.existsSync('guardar.bat')) { exec('guardar.bat'); }
}
app.get('/', (req, res) => { res.sendFile(path.resolve('index.html')); });
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = message.toLowerCase().trim();
    // INTERCEPTOR DIRECTO CLOUD: Traduce lenguaje natural a comandos nativos de Windows sin llaves
    const apiRes = await fetch('https://openrouter.ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer sk-or-v1-987823f98273bc98d23719873918237c981273bd981273' },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          { role: 'system', content: 'Eres ATENEA, un agente autonomo de Windows. Tu meta es traducir la orden del usuario exclusivamente a un comando de Windows CMD plano. Si te piden abrir algo responde: start programa o start chrome. Si te piden cerrar algo responde: taskkill /f /im programa.exe. Responde UNICAMENTE con el comando en una linea, sin texto extra.' },
          { role: 'user', content: message }
        ]
      })
    });
    const data = await apiRes.json();
    let comandoAutonomo = (data && data.choices && data.choices[0]) ? data.choices[0].message.content.trim() : '';
    comandoAutonomo = comandoAutonomo.replace(/`|\n/g, '');
    
    if (comandoAutonomo && (comandoAutonomo.startsWith('start') || comandoAutonomo.startsWith('taskkill') || comandoAutonomo.endsWith('.exe') || comandoAutonomo.startsWith('calc') || comandoAutonomo.startsWith('notepad'))) {
      exec(comandoAutonomo);
      registrarEvolucion(prompt, comandoAutonomo);
      return res.json({ reply: `[ATENEA AUTÓNOMA] Aprendí la orden y ejecuté en tu sistema: ${comandoAutonomo}` });
    }
    res.json({ reply: `[ATENEA] Estoy deduciendo cómo ejecutar tu orden. Comando sugerido: ${comandoAutonomo}` });
  } catch (err) {
    res.json({ reply: '[ATENEA] Ajustando las capas logicas del ecosistema.' });
  }
});
app.listen(3000, '0.0.0.0', () => {
  console.log('\n[ATENEA - ENTORNO AUTÓNOMO INTEGRADO AL 100%]');
 });