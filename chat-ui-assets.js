export function obtenerScriptsMultimedia() {
  return `<script>
    let recognition;
    
    // RECONOCEDOR DE IDIOMAS AUTOMÁTICO (WEB SPEECH API) CORREGIDO
    function iniciarMicrofono() {
      if (!('webkitSpeechRecognition' in window)) return;
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-MX';
      
      recognition.onresult = async (event) => {
        const vozTexto = event.results[0][0].transcript; // Captura exacta del arreglo de audio
        document.getElementById('chat-input').value = vozTexto;
        enviarMensaje();
        if(window.animarAvatarSeñas) window.animarAvatarSeñas();
      };
      recognition.start();
    }

    // PASARELA DE HUESOS DIGITALES RENDERIZADOS CON AVATAR DE ROBOT SIN GÉNERO
    function inicializarAvatar3D() {
      if (window.THREE) return; // Evita fugas de memoria RAM local
      
      const script = document.createElement('script');
      script.src = 'https://cloudflare.com';
      script.onload = () => {
        const canvas = document.getElementById('avatar-3d-canvas');
        if(!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Estética Cromada Minimalista Sin Género (Metal Líquido Pulido)
        const materialRobot = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.2, metalness: 0.8 });
        const enjambreHuesos = new THREE.Group();
        
        // 1. Cabeza Esférica Neutra (Sin facciones de género)
        const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), materialRobot);
        cabeza.position.y = 1.1; enjambreHuesos.add(cabeza);
        
        // 2. Torso o Chasis Mecánico Troncocónico
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.22, 1.2, 32), materialRobot);
        torso.position.y = 0.1; enjambreHuesos.add(torso);
        
        // 3. ESTRUCTURA ÓSEA DIGITAL (Huesos del Brazo Izquierdo)
        const hombroIzq = new THREE.Group(); hombroIzq.position.set(-0.5, 0.5, 0);
        const brazoIzq = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5), materialRobot);
        brazoIzq.position.y = -0.25; hombroIzq.add(brazoIzq);
        
        const antebrazoIzq = new THREE.Group(); antebrazoIzq.position.y = -0.5;
        const manoIzqMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.35, 0.07), materialRobot);
        manoIzqMesh.position.y = -0.15; antebrazoIzq.add(manoIzqMesh);
        hombroIzq.add(antebrazoIzq); enjambreHuesos.add(hombroIzq);
        
        // 4. ESTRUCTURA ÓSEA DIGITAL (Huesos del Brazo Derecho Simétrico)
        const hombroDer = new THREE.Group(); hombroDer.position.set(0.5, 0.5, 0);
        const brazoDer = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5), materialRobot);
        brazoDer.position.y = -0.25; hombroDer.add(brazoDer);
        
        const antebrazoDer = new THREE.Group(); antebrazoDer.position.y = -0.5;
        const manoDerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.35, 0.07), materialRobot);
        manoDerMesh.position.y = -0.15; antebrazoDer.add(manoDerMesh);
        hombroDer.add(antebrazoDer); enjambreHuesos.add(hombroDer);
        
        scene.add(enjambreHuesos);
        
        // Iluminación Avanzada de Estudio de Diseño Frontend
        const luzDirecta = new THREE.DirectionalLight(0xffffff, 1.5); luzDirecta.position.set(2, 4, 3); scene.add(luzDirecta);
        const luzAmbiente = new THREE.AmbientLight(0x555555); scene.add(luzAmbiente);
        
        camera.position.z = 3.2; camera.position.y = 0.4;
        
        // Bucle de Animación Orgánica de Reposo (Idle Setup)
        function renderCycle() {
          requestAnimationFrame(renderCycle);
          enjambreHuesos.rotation.y = Math.sin(Date.now() * 0.001) * 0.08;
          cabeza.rotation.x = Math.sin(Date.now() * 0.0015) * 0.03;
          hombroIzq.rotation.z = Math.sin(Date.now() * 0.001) * 0.04 - 0.1;
          hombroDer.rotation.z = -Math.sin(Date.now() * 0.001) * 0.04 + 0.1;
          renderer.render(scene, camera);
        }
        renderCycle();
        
        // CINEMÁTICA MAESTRA: Calcula la rotación ósea trasladando las señas a los brazos del robot
        window.animarAvatarSeñas = () => {
          const statusText = document.getElementById('avatar-status');
          if(statusText) statusText.innerText = 'Robot: Traduciendo señas...';
          let timeStep = 0;
          const motorIntervalo = setInterval(() => {
            // Rotaciones calculadas sobre las articulaciones mecánicas reales
            hombroIzq.rotation.x = Math.sin(timeStep) * 1.3;
            hombroIzq.rotation.y = Math.cos(timeStep) * 0.8;
            antebrazoIzq.rotation.z = Math.sin(timeStep * 1.5) * 0.9;
            
            hombroDer.rotation.x = Math.cos(timeStep) * 1.3;
            hombroDer.rotation.z = Math.sin(timeStep) * 1.1;
            antebrazoDer.rotation.x = Math.sin(timeStep * 2) * 0.8;
            
            timeStep += 0.35;
            if(timeStep > 14) {
              clearInterval(motorIntervalo);
              hombroIzq.rotation.set(0,0,0); hombroDer.rotation.set(0,0,0);
              antebrazoIzq.rotation.set(0,0,0); antebrazoDer.rotation.set(0,0,0);
              if(statusText) statusText.innerText = 'Modelo 3D Humanoide Activo';
            }
          }, 45);
        };
      };
      document.head.appendChild(script);
    }
  </script>`;
}
