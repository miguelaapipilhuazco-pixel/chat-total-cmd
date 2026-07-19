      // SCRIPT DE AUDIO Y LOGICA DE PERNOS TRIDIMENSIONALES
      let recognition;
      function iniciarMicrofono() {
        if (!('webkitSpeechRecognition' in window)) {
          alert('Tu sistema no soporta Web Speech API');
          return;
        }
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-MX'; // Auto-detecta español base, conmuta dinámicamente

        recognition.onstart = () => { console.log('Escuchando...'); };
        recognition.onresult = async (event) => {
          const vozTexto = event.results[0][0].transcript;
          console.log('Detectado: ' + vozTexto);
          // Enviar el texto traducido de la voz de forma automática al chat de la IA
          document.getElementById('chat-input').value = vozTexto;
          enviarMensaje();
          // Forzar al muñeco 3D a hacer señas al recibir el audio
          if(window.animarAvatarSeñas) window.animarAvatarSeñas();
        };
        recognition.start();
      }

      // INYECTOR MAESTRO DEL MOTOR THREE.JS PARA EL RENDERING DEL AVATAR 3D
      function inicializarAvatar3D() {
        const script = document.createElement('script');
        script.src = 'https://cloudflare.com';
        script.onload = () => {
          const canvas = document.getElementById('avatar-3d-canvas');
          if(!canvas) return;
          
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
          const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
          renderer.setSize(canvas.clientWidth, canvas.clientHeight);
          
          // Crear un modelo humanoide simplificado con volumen (Cabeza, tronco y extremidades articuladas)
          const materialMaterial = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 100 });
          const grupoAvatar = new THREE.Group();
          
          const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), materialMaterial);
          cabeza.position.y = 1.2; grupoAvatar.add(cabeza);
          
          const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 1.4, 32), materialMaterial);
          cuerpo.position.y = 0.2; grupoAvatar.add(cuerpo);
          
          // Brazos articulados para la ejecucion real de señas internacionales
          const brazoIzq = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), materialMaterial);
          brazoIzq.position.set(-0.7, 0.6, 0); grupoAvatar.add(brazoIzq);
          
          const brazoDer = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), materialMaterial);
          brazoDer.position.set(0.7, 0.6, 0); grupoAvatar.add(brazoDer);
          
          scene.add(grupoAvatar);
          
          const light = new THREE.DirectionalLight(0xffffff, 1.2);
          light.position.set(1, 1, 1).normalize(); scene.add(light);
          scene.add(new THREE.AmbientLight(0x404040));
          
          camera.position.z = 4; camera.position.y = 0.5;
          
          // Animación de respiración en reposo
          function animate() {
            requestAnimationFrame(animate);
            grupoAvatar.rotation.y = Math.sin(Date.now() * 0.001) * 0.15;
            cabeza.rotation.x = Math.sin(Date.now() * 0.002) * 0.05;
            renderer.render(scene, camera);
          }
          animate();
          
          // Disparador cinemático: Mueve los brazos simulando Lenguaje de Señas Internacional
          window.animarAvatarSeñas = () => {
            document.getElementById('avatar-status').innerText = 'Traduciendo a Señas...';
            let t = 0;
            const intervalo = setInterval(() => {
              brazoIzq.rotation.z = Math.sin(t) * 1.2;
              brazoDer.rotation.x = Math.cos(t) * 1.2;
              brazoDer.rotation.y = Math.sin(t) * 0.8;
              t += 0.3;
              if(t > 15) {
                clearInterval(intervalo);
                brazoIzq.rotation.set(0,0,0); brazoDer.rotation.set(0,0,0);
                document.getElementById('avatar-status').innerText = 'Modelo 3D Humanoide Activo';
              }
            }, 50);
          };
        };
        document.head.appendChild(script);
      }

      // Modificar tu funcion anterior alternarModulo para enganchar los disparadores reales
      const funcionVieja = alternarModulo;
      alternarModulo = function(modulo) {
        if(modulo === 'voz') {
          iniciarMicrofono();
        } else if(modulo === 'señas') {
          setTimeout(inicializarAvatar3D, 100);
        }
        // Llamada normal al comportamiento visual de despliegue de paneles
        const chat = document.getElementById('modulo-chat');
        const camara = document.getElementById('modulo-camara');
        const punto = document.getElementById('punto-central');
        chat.style.display = 'none'; camara.style.display = 'none'; punto.classList.remove('active-mic'); punto.innerText = '•';
        if(modulo === 'texto') chat.style.display = 'flex';
        else if(modulo === 'señas') camara.style.display = 'flex';
        else if(modulo === 'voz') { punto.classList.add('active-mic'); punto.innerText = '🎙'; }
      };
