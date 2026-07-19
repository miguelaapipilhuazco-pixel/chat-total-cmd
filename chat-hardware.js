import { exec } from 'child_process';
export function ejecutarModulo(modulo, config, registrar) {
  if (modulo === 'señas') {
    exec('powershell -Command "Start-Process -FilePath \x27roblox:\x27"');
    registrar('Click en Señas', 'Apertura nativa de Roblox');
  } else if (modulo === 'texto') {
    exec('start notepad.exe');
    registrar('Click en Texto', 'Lanzamiento de editor de Notas');
  } else if (modulo === 'voz') {
    exec('start cmd.exe');
    registrar('Click en Voz', 'Lanzamiento de Consola del sistema');
  } else if (modulo === 'braille') {
    exec('start https://github.com');
    registrar('Click en Braille', 'Acceso al Repositorio Remoto');
  }
}