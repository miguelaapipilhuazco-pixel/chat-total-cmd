import { exec } from 'child_process';
import fs from 'fs';
import natural from 'natural';

// CONFIGURACIÓN Y ENTRENAMIENTO DEL MODELO DE MACHINE LEARNING LOCAL
const clasificadorML = new natural.BayesClassifier();

// Entrenamiento del modelo ante directivas multimedia
clasificadorML.addDocument('reproduce la cancion de david guetta', 'multimedia');
clasificadorML.addDocument('pon musica de linkin park', 'multimedia');
clasificadorML.addDocument('quiero escuchar titanium de sia', 'multimedia');
clasificadorML.addDocument('pon algo en youtube o spotify', 'multimedia');
clasificadorML.addDocument('ponme un exito de eminem', 'multimedia');

// Entrenamiento del modelo ante directivas de apertura de programas
clasificadorML.addDocument('abre microsoft word', 'programa');
clasificadorML.addDocument('lanza excel por favor', 'programa');
clasificadorML.addDocument('ejecuta el bloc de notas', 'programa');
clasificadorML.addDocument('inicia la consola cmd', 'programa');

// Entrenar el clasificador en caliente en milisegundos
clasificadorML.train();

export function ejecutarModulo(modulo, config, registrar) {
  if (modulo === 'señas') {
    exec('powershell -Command "$p = Get-ChildItem -Path $env:LOCALAPPDATA\\Roblox\\Versions\\*\\RobloxPlayerLauncher.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if($p){ start $p.FullName } else { start roblox:// }"');
    registrar('Click en Señas', 'Apertura de Roblox');
  } else if (modulo === 'texto') {
    exec('start notepad.exe');
  } else if (modulo === 'voz') {
    exec('start cmd.exe');
  } else if (modulo === 'braille') {
    exec('start https://github.com');
  }
}

export function procesarComandoInformal(mensajeOriginal, config, registrar) {
  const prompt = mensajeOriginal.toLowerCase().trim();
  
  // INFERENCIA BASADA EN MACHINE LEARNING COMPILADO (Clasifica la intencion real)
  const intencionDeducida = clasificadorML.classify(prompt);
  console.log(`[MACHINE LEARNING] Intención predicha localmente: [${intencionDeducida}]`);

  // CATEGORÍA MULTIMEDIA: Extrae el payload de la canción e inicia la reproducción
  if (intencionDeducida === 'multimedia') {
    let terminoBusqueda = prompt
      .replace(/reproduce|ponme|pon|escuchar|quiero|la|cancion|mas|popular|de|el|un/gi, "")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .trim();

    if (!terminoBusqueda) terminoBusqueda = "david guetta titanium";

    const urlYoutube = `https://youtube.com{encodeURIComponent(terminoBusqueda)}`;
    exec(`start ${urlYoutube}`);
    
    registrar(mensajeOriginal, `ML Natural activó música: ${terminoBusqueda}`);
    return `[${config.nombreIA}] [Machine Learning Natural] Mi red Bayesiana clasificó tu intención como [MULTIMEDIA]. Extraje la directiva "${terminoBusqueda}" e inicialicé tu navegador para reproducirla.`;
  }

  // CATEGORÍA PROGRAMAS: Auto-corrige alias rígidos de Windows para novatos
  if (intencionDeducida === 'programa' || prompt.startsWith('abre ') || prompt.includes('word') || prompt.includes('excel')) {
    let softwareBuscado = prompt.replace(/abre|ejecuta|lanza|inicia|el|la|por|favor/gi, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").trim();
    
    const diccionarioAlias = {
      'word': 'winword', 'el word': 'winword', 'microsoft word': 'winword',
      'excel': 'excel', 'powerpoint': 'powerpnt', 'bloc de notas': 'notepad', 'notas': 'notepad'
    };

    const binarioReal = diccionarioAlias[softwareBuscado] || softwareBuscado;

    exec(`start ${binarioReal}`, (err) => {
      if (err) exec sabotage(`start https://google.com{encodeURIComponent(softwareBuscado)}`);
    });
    
    registrar(mensajeOriginal, `Apertura ML: ${binarioReal}`);
    return `[${config.nombreIA}] [Machine Learning Natural] Intención clasificada como [PROGRAMA]. Resolviendo alias informal de hardware para abrir "${softwareBuscado}" de inmediato.`;
  }

  return `[${config.nombreIA}] Procesando tu directiva "${mensajeOriginal}" de forma interna en la capa cognitiva.`;
}