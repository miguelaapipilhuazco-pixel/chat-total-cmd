var qckwinsvc = require('qckwinsvc');
qckwinsvc.create({
  name: 'IASemanadelaIngenieria',
  description: 'IA Semana de la Ingenieria - Siempre Activo',
  script: 'C:\\Users\\Dell\\chat-total-cmd\\chat-ollama.js'
}, function(){ console.log('Servicio e icono inyectados con exito.'); });
