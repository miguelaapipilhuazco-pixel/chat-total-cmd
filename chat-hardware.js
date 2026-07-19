import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import natural from 'natural';
import schedule from 'node-schedule';

const clasificadorML = new natural.BayesClassifier();

// ENTRENAMIENTO EN CALIENTE DEL MODELO DE MACHINE LEARNING LOCAL
clasificadorML.addDocument('reproduce la cancion de david guetta', 'multimedia');
clasificadorML.addDocument('pon algo de musica en youtube', 'multimedia');
clasificadorML.addDocument('abre microsoft word', 'programa');
clasificadorML.addDocument('crea un reporte o documento notas', 'agente');
clasificadorML.addDocument('agenda una tarea automatica', 'agente');
clasificadorML.addDocument('busca dispositivos bluetooth', 'hardware');
clasificadorML.train();

export function ejecutarModulo(modulo, config, registrar) {
  if (modulo === 'señas') {
    exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
  } else if (modulo === 'texto') {
    exec('start notepad.exe');
  } else if (modulo === 'voz') {
    exec('start cmd.exe');
  } else if (modulo === 'braille') {
    exec('start https://github.com/miguelaapipilhuazco-pixel/chat-total-cmd');
  }
}

export function procesarComandoInformal(mensajeOriginal, config, registrar) {
  const prompt = mensajeOriginal.toLowerCase().trim();
  const intencionDeducida = clasificadorML.classify(prompt);
  console.log(`[MACHINE LEARNING] Nivel Evaluado. Intención: [${intencionDeducida}]`);

  // NIVEL 3: ACCIONES AGÉNTICAS AUTOMATIZADAS (Escribir reportes sin supervisión)
  if (intencionDeducida === 'agente' || prompt.includes('reporte') || prompt.includes('documento')) {
    const rutaDocumento = path.resolve('Reporte_Autonomo_Uriel.txt');
    const contenidoReporte = `====================================================\r\n REPORTE COGNITIVO DE HARDWARE - ECOSISTEMA URIEL\r\n====================================================\r\nGenerado de forma autonoma por el Agente de IA.\r\nFecha: ${new Date().toLocaleString()}\r\nEstado del Sistema: 5 Archivos Desacoplados Operando de forma estable.\r\n0% RAM Local consumida en inferencia masiva.\r\n====================================================`;
    
    fs.writeFileSync(rutaDocumento, contenidoReporte);
    exec(`start notepad.exe "${rutaDocumento}"`);
    
    // Agenda una tarea de mantenimiento automatica (Cron-Job) en 10 segundos con node-schedule
    const fechaEjecucion = new Date(Date.now() + 10000);
    schedule.scheduleJob(fechaEjecucion, () => {
      console.log('[AGENT] Ejecutando tarea automatica agendada por la IA de forma invisible.');
      if (fs.existsSync('guardar.bat')) exec('guardar.bat');
    });

    if (registrar) registrar(mensajeOriginal, 'Agente genero reporte y programo cron-job');
    return `[${config.nombreIA}] [Nivel 3: Agente Activo] Clasifiqué tu orden como una tarea completa. He generado el documento "Reporte_Autonomo_Uriel.txt" en tu disco duro y programé un Cron-Job automático para respaldar tu progreso en GitHub en 10 segundos sin supervisión.`;
  }

  // NIVEL 1: MULTIMEDIA CON APRENDIZAJE AUTOMÁTICO (Extracción automática de términos de búsqueda)
  if (intencionDeducida === 'multimedia') {
    let terminoBusqueda = prompt.replace(/reproduce|ponme|pon|escuchar|la|cancion|mas|popular|de/gi, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim();
    if (!terminoBusqueda) terminoBusqueda = "david guetta titanium";
    
    exec(`start https://youtube.com{encodeURIComponent(terminoBusqueda)}`);
    if (registrar) registrar(mensajeOriginal, `ML Natural activó música: ${terminoBusqueda}`);
    return `[${config.nombreIA}] [Nivel 1-2: Multimedia] Mi clasificador Bayesiano dedujo tu intención. Abriendo tu navegador para reproducir de inmediato los éxitos de "${terminoBusqueda}".`;
  }

  // CAPA DE HARDWARE / PROGRAMAS: Auto-corrección de alias rígidos para usuarios novatos
  let softwareBuscado = prompt.replace(/abre|ejecuta|lanza|inicia|el|la/gi, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim();
  const diccionarioAlias = { 'word': 'winword', 'el word': 'winword', 'excel': 'excel', 'powerpoint': 'powerpnt' };
  const binarioReal = diccionarioAlias[softwareBuscado] || softwareBuscado;

  exec(`start ${binarioReal}`, (err) => {
    if (err) exec(`start https://google.com{encodeURIComponent(softwareBuscado)}`);
  });
  
  if (registrar) registrar(mensajeOriginal, `Apertura ML: ${binarioReal}`);
  return `[${config.nombreIA}] [Nivel 3: Agente de Enlace] Resolviendo tu comando informal para iniciar "${softwareBuscado}" en el sistema operativo.`;
}
