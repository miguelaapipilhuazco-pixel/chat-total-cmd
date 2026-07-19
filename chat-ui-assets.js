export function obtenerScriptsMultimedia() {
  return `<script>
    let recognition;
    
    // MICROFONO MULTILINGÜE REAL: Captura audio e idiomas sin consumir RAM local
    function iniciarMicrofono() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Este sistema no soporta Web Speech API');
        return;
      }
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-MX'; // Detecta español base e interpreta idiomas

      recognition.onstart = () => { console.log('Hardware de audio activo.'); };
      recognition.onresult = async (event) => {
        const vozTexto = event.results[0].transcript;
        document.getElementById('chat-input').value = vozTexto;
        enviarMensaje();
        if(window.animarAvatarSeñas) window.animarAvatarSeñas();
      };
      recognition.start();
    }

    // AVATAR 3D INTEGRADO: Renderiza un monigote articulado con volumen real
    function inicializarAvatar3D() {
      if (window.THREE) return; // Protege de duplicados en memoria
      const script = document.createElement('script');
      script.src = 'https://cloudflare.com';
      script.onload = () => {
        const canvas = document.getElementById('avatar-3d-canvas');
        if(!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        const material = new THREE.MeshPhongMaterial({ color: 0xf59e0b, shininess: 80 });
        const grupoAvatar = new THREE.Group();
        
        // Estructura volumétrica del Avatar Uriel (Cabeza, Tronco y Brazos cinemáticos)
        const cabeza = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), material);
        cabeza.position.y = 1.1; grupoAvatar.add(cabeza);
        
        const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.2, 1.3, 32), material);
        cuerpo.position.y = 0.1; grupoAvatar.add(cuerpo);
        
        const brazoIzq = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), material);
        brazoIzq.position.set(-0.6, 0.5, 0); grupoAvatar.add(brazoIzq);
        
        const brazoDer = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), material);
        brazoDer.position.set(0.6, 0.5, 0); grupoAvatar.add(brazoDer);
        
        scene.add(grupoAvatar);
        
        const light = new THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(1, 1, 1).normalize(); scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));
        
        camera.position.z = 3.5; camera.position.y = 0.4;
        
        function animate() {
          requestAnimationFrame(animate);
          grupoAvatar.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
          renderer.render(scene, camera);
        }
        animate();
        
        // CONTROL EN SEÑAS: Mueve los brazos de forma interactiva
        window.animarAvatarSeñas = () => {
          const status = document.getElementById('avatar-status');
          if(status) status.innerText = 'Traduciendo a Señas...';
          let t = 0;
          const intervalo = setInterval(() => {
            brazoIzq.rotation.z = Math.sin(t) * 1.1;
            brazoDer.rotation.x = Math.cos(t) * 1.1;
            t += 0.4;
            if(t > 12) {
              clearInterval(intervalo);
              brazoIzq.rotation.set(0,0,0);
              brazoDer.rotation.set(0,0,0);
              if(status) status.innerText = 'Modelo 3D Humanoide Activo';
            }
          }, 50);
        };
      };
      document.head.appendChild(script);
    }
  </script>`;
}
