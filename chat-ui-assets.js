export function obtenerScriptsMultimedia() {
  return `<script>
    let recognition;
    
    function iniciarMicrofono() {
      if (!('webkitSpeechRecognition' in window)) return;
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'es-MX';
      recognition.onresult = async (event) => {
        const vozTexto = event.results[0][0].transcript;
        document.getElementById('chat-input').value = vozTexto;
        enviarMensaje();
        if(window.animarAvatarSeñas) window.animarAvatarSeñas();
      };
      recognition.start();
    }

    // INYECTOR MAESTRO REPARADO: Dibuja al Robot e inicializa los Huesos Cinemáticos en milisegundos
    function inicializarAvatar3D() {
      const canvas = document.getElementById('avatar-3d-canvas');
      if(!canvas || window.THREE) return;
      
      const script = document.createElement('script');
      script.src = 'https://cloudflare.com';
      script.onload = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Estética Cromada Sin Género (Gris Metalizado Pulido)
        const materialRobot = new THREE.MeshPhongMaterial({ color: 0x9ca3af, emmissive: 0x111111, specular: 0xffffff, shininess: 100 });
        const enjambreHuesos = new THREE.Group();
        
        const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), materialRobot);
        cabeza.position.y = 1.1; enjambreHuesos.add(cabeza);
        
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.22, 1.3, 32), materialRobot);
        torso.position.y = 0.1; enjambreHuesos.add(torso);
        
        // Articulaciones mecánicas funcionales para el lenguaje de señas
        const hombroHz = new THREE.Group(); hombroHz.position.set(-0.55, 0.5, 0);
        const brazoIzq = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6), materialRobot);
        brazoIzq.position.y = -0.3; hombroHz.add(brazoIzq); enjambreHuesos.add(hombroHz);
        
        const hombroDr = new THREE.Group(); hombroDr.position.set(0.55, 0.5, 0);
        const brazoDer = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6), materialRobot);
        brazoDer.position.y = -0.3; hombroDr.add(brazoDer); enjambreHuesos.add(hombroDr);
        
        scene.add(enjambreHuesos);
        
        // Puntos de Iluminación de Alta Fidelidad constantes
        const luzPunta = new THREE.DirectionalLight(0xffffff, 1.5); luzPunta.position.set(1, 3, 2); scene.add(luzPunta);
        const luzRelleno = new THREE.AmbientLight(0x666666); scene.add(luzRelleno);
        
        camera.position.z = 3.2; camera.position.y = 0.4;
        
        function animate() {
          requestAnimationFrame(animate);
          enjambreHuesos.rotation.y = Math.sin(Date.now() * 0.001) * 0.06;
          hombroHz.rotation.z = Math.sin(Date.now() * 0.001) * 0.03 - 0.1;
          hombroDr.rotation.z = -Math.sin(Date.now() * 0.001) * 0.03 + 0.1;
          renderer.render(scene, camera);
        }
        animate();
        
        window.animarAvatarSeñas = () => {
          const statusText = document.getElementById('avatar-status');
          if(statusText) statusText.innerText = 'Robot: Traduciendo señas...';
          let timeStep = 0;
          const motorIntervalo = setInterval(() => {
            hombroHz.rotation.x = Math.sin(timeStep) * 1.2;
            hombroDr.rotation.x = Math.cos(timeStep) * 1.2;
            hombroDr.rotation.y = Math.sin(timeStep) * 0.7;
            timeStep += 0.4;
            if(timeStep > 12) {
              clearInterval(motorIntervalo);
              hombroHz.rotation.set(0,0,0); hombroDr.rotation.set(0,0,0);
              if(statusText) statusText.innerText = 'Modelo 3D Humanoide Activo';
            }
          }, 50);
        };
      };
      document.head.appendChild(script);
    }
  </script>`;
}