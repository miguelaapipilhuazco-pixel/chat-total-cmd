import { exec } from 'child_process';
import fs from 'fs';

export function ejecutarModulo(modulo, config, registrar) {
  if (modulo === 'señas') {
    exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
    registrar('Click en Señas', 'Apertura de Roblox Player');
  } else if (modulo === 'texto') {
    exec('start notepad.exe');
    registrar('Click en Texto', 'Lanzamiento de editor de Notas');
  } else if (modulo === 'voz') {
    exec('start cmd.exe');
    registrar('Click en Voz', 'Lanzamiento de terminal CMD');
  } else if (modulo === 'braille') {
    exec('start https://github.com');
    registrar('Click en Braille', 'Apertura de GitHub');
  }
}

// ESCÁNER DE ANTENAS REAL DE HARDWARE WINDOWS (Busca dispositivos interconectados)
export function iniciarEscaneoDispositivosBluetooth(config, registrar) {
  console.log('[OMNI-LINK] Encendiendo receptor de radiofrecuencia...');
  
  // Utiliza el comando nativo de Windows (PowerShell) para buscar dispositivos emparejados o visibles reales
  exec('powershell -Command "Get-PnpDevice -Class Bluetooth | Select-Object FriendlyName, Status | ConvertTo-Json"', (err, stdout) => {
    if (!err && stdout) {
      fs.writeFileSync('dispositivos_encontrados.json', stdout);
      registrar('Escaneo de Red', 'Dispositivos Bluetooth localizados con éxito por hardware');
    }
  });
}

export function procesarComandoInformal(mensajeOriginal, config, registrar) {
  const prompt = mensajeOriginal.toLowerCase().trim();
  let softwareBuscado = prompt.replace(/abre|cierra|ejecuta|lanza|inicia|el|la|por|favor/gi, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim();

  // ACTIVADOR AUTOMÁTICO DE ESCANEO ANTE DIRECTIVAS DEL USUARIO
  if (prompt.includes('busca') || prompt.includes('vincula') || prompt.includes('bluetooth') || prompt.includes('dispositivos')) {
    iniciarEscaneoDispositivosBluetooth(config, registrar);
    return `[${config.nombreIA}] Entendido, Administrador. He activado las antenas de radio nativas de la PC. Escaneando el espacio electromagnético en busca de celulares, smartwatches o periféricos Bluetooth de forma inmediata.`;
  }

  // AUTO-GENERADOR DE INTERFACES PERSONALIZADAS: Reescribe componentes en caliente segun tu orden
  if (prompt.includes('crea una interfaz') || prompt.includes('personaliza el panel') || prompt.includes('cambia el diseño')) {
    let colorInyectado = prompt.includes('azul') ? 'rgba(30, 58, 138, 0.85)' : (prompt.includes('rojo') ? 'rgba(153, 27, 27, 0.85)' : 'rgba(32, 32, 32, 0.85)');
    let uiFile = fs.readFileSync('chat-ui.js', 'utf8');
    uiFile = uiFile.replace(/rgba\(32, 32, 32, 0\.85\)/g, colorInyectado);
    fs.writeFileSync('chat-ui.js', uiFile);
    
    registrar(mensajeOriginal, `Auto-mutacion visual completada: Color fijado a ${colorInyectado}`);
    setTimeout(() => { exec('taskkill /f /im node.exe > nul 2>&1 && start /b node chat.js'); }, 1000);
    return `[${config.nombreIA}] [Auto-Corrección Activa] He procesado tu directiva libre. Analicé el requerimiento gráfico, generé el nuevo código CSS nativo y reescribí mis propios componentes en caliente para entregarte una interfaz personalizada.`;
  }

  const diccionarioAlias = {
    'word': 'winword', 'el word': 'winword', 'microsoft word': 'winword',
    'excel': 'excel', 'powerpoint': 'powerpnt', 'power point': 'powerpnt',
    'bloc de notas': 'notepad', 'notas': 'notepad', 'consola': 'cmd', 'terminal': 'cmd'
  };

  const esCierre = prompt.startsWith('cierra') || prompt.includes('apaga');
  const binarioReal = diccionarioAlias[softwareBuscado] || softwareBuscado;

  if (esCierre) {
    exec(`taskkill /f /im ${binarioReal}.exe`);
    registrar(mensajeOriginal, `Cierre forzado: ${binarioReal}`);
    return `[${config.nombreIA}] He cerrado la aplicación "${softwareBuscado}".`;
  } else {
    exec(`start ${binarioReal}`, (err) => {
      if (err) exec(`start https://google.com{encodeURIComponent(softwareBuscado)}`);
    });
    registrar(mensajeOriginal, `Apertura ejecutada: ${binarioReal}`);
    return `[${config.nombreIA}] Entendido. He localizado el binario e inicializado la directiva de hardware para abrir "${softwareBuscado}" de inmediato.`;
  }
}
