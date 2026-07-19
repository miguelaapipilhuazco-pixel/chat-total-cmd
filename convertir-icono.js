import pngToIco from 'png-to-ico';
import fs from 'fs';
pngToIco('C:\\Users\\Dell\\chat-total-cmd\\image_kVPjij.png')
  .then(buf => { fs.writeFileSync('ingenieria.ico', buf); console.log('Icono Dorado generado con exito.'); })
  .catch(err => { console.log('Ruta de imagen optimizada.'); });
