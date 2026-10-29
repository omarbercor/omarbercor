import * as THREE from 'three';

/**
 * transmission-hero.ts
 * Implementación de TransmissionMaterial en Three.js para la "O" de cristal.
 * Refracta y distorsiona ópticamente el texto y fondo situados detrás del cristal.
 */
export function initTransmissionHero(canvasId: string): () => void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 6.2;

  // Render target offscreen para capturar lo que está detrás del cristal
  const renderTarget = new THREE.WebGLRenderTarget(
    canvas.clientWidth * renderer.getPixelRatio(),
    canvas.clientHeight * renderer.getPixelRatio(),
    { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
  );

  // 1. Textura del fondo con tipografía Gloock y el título
  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = 1600;
  bgCanvas.height = 1600;
  const bgCtx = bgCanvas.getContext('2d')!;

  function drawBackground() {
    bgCtx.fillStyle = '#FAF7F3';
    bgCtx.fillRect(0, 0, 1600, 1600);

    // Decoración editorial / líneas de retícula tenue
    bgCtx.strokeStyle = 'rgba(18, 18, 20, 0.08)';
    bgCtx.lineWidth = 2;
    bgCtx.strokeRect(100, 100, 1400, 1400);

    // Titular monumental
    bgCtx.fillStyle = '#121214';
    bgCtx.font = '900 135px "Gloock", serif';
    bgCtx.textAlign = 'center';
    bgCtx.fillText('OMAR BERMÚDEZ', 800, 720);

    // Puesto / Rol
    bgCtx.fillStyle = '#F15D49';
    bgCtx.font = '700 36px "Inter", sans-serif';
    bgCtx.letterSpacing = '6px';
    bgCtx.fillText('FRONT-END LEAD & CREATIVE TECHNOLOGIST', 800, 840);

    // Acento editorial tenue inferior
    bgCtx.fillStyle = '#5C5C66';
    bgCtx.font = '400 28px "Inter", sans-serif';
    bgCtx.letterSpacing = '2px';
    bgCtx.fillText('MUSEUM EDITORIAL • 60 FPS • THREE.JS', 800, 940);
  }

  // Esperar a que Gloock esté lista para dibujar el canvas
  if (document.fonts) {
    document.fonts.ready.then(drawBackground);
  } else {
    drawBackground();
  }

  const bgTexture = new THREE.CanvasTexture(bgCanvas);
  const bgGeo = new THREE.PlaneGeometry(6.4, 6.4);
  const bgMat = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeo, bgMat);
  bgMesh.position.z = -0.8;
  scene.add(bgMesh);

  // 2. Escultura 3D de la "O" de cristal
  const glassGeo = new THREE.TorusGeometry(1.4, 0.48, 64, 128);

  const glassMat = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: renderTarget.texture },
      uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      uIor: { value: 1.48 },
      uChromaticAberration: { value: 0.045 },
      uThickness: { value: 0.28 },
      uFresnelPower: { value: 2.8 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vEye;
      varying vec2 vUv;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 eyePos = modelViewMatrix * vec4(position, 1.0);
        vEye = normalize(eyePos.xyz);
        vUv = uv;
        gl_Position = projectionMatrix * eyePos;
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uResolution;
      uniform float uIor;
      uniform float uChromaticAberration;
      uniform float uThickness;
      uniform float uFresnelPower;

      varying vec3 vNormal;
      varying vec3 vEye;
      varying vec2 vUv;

      void main() {
        vec2 screenUv = gl_FragCoord.xy / uResolution;

        // Refracción física óptica de Snell
        vec3 refr = refract(vEye, vNormal, 1.0 / uIor);

        // Dispersión cromática RGB por longitud de onda
        vec2 uvR = screenUv + refr.xy * uThickness * (1.0 + uChromaticAberration * 2.0);
        vec2 uvG = screenUv + refr.xy * uThickness;
        vec2 uvB = screenUv + refr.xy * uThickness * (1.0 - uChromaticAberration * 2.0);

        float r = texture2D(uTexture, uvR).r;
        float g = texture2D(uTexture, uvG).g;
        float b = texture2D(uTexture, uvB).b;
        vec3 refractedColor = vec3(r, g, b);

        // Reflejo Fresnel de borde de cristal
        float fresnel = pow(1.0 - max(dot(-vEye, vNormal), 0.0), uFresnelPower);

        // Especular de luz de estudio
        vec3 lightDir = normalize(vec3(0.6, 1.0, 1.2));
        vec3 halfVec = normalize(lightDir - vEye);
        float spec = pow(max(dot(vNormal, halfVec), 0.0), 32.0);

        vec3 glassFinal = mix(refractedColor, vec3(0.98, 0.98, 1.0), fresnel * 0.45) + spec * 0.6;
        gl_FragColor = vec4(glassFinal, 1.0);
      }
    `,
  });

  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.z = 0.5;
  scene.add(glassMesh);

  // 3. Interacción con Mouse e inercia LERP
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  function onMouseMove(e: MouseEvent) {
    const rect = canvas!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    targetRotY = x * 0.65;
    targetRotX = -y * 0.45;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  let animId = 0;
  const startTime = performance.now();

  function animate(now: number) {
    animId = requestAnimationFrame(animate);
    const elapsed = (now - startTime) * 0.001;

    // LERP suave de inercia
    mouseX += (targetRotX - mouseX) * 0.08;
    mouseY += (targetRotY - mouseY) * 0.08;

    // Movimiento orgánico flotante
    glassMesh.rotation.x = mouseX + Math.sin(elapsed * 0.8) * 0.06;
    glassMesh.rotation.y = mouseY + Math.cos(elapsed * 0.6) * 0.08;

    // Paso 1: Ocultar el cristal y renderizar el fondo a la textura offscreen
    glassMesh.visible = false;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    // Paso 2: Mostrar el cristal y renderizar la escena completa a la pantalla
    glassMesh.visible = true;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  animate();

  function resize() {
    if (!canvas) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    const pr = renderer.getPixelRatio();
    renderTarget.setSize(width * pr, height * pr);
    glassMat.uniforms.uResolution.value.set(width, height);
  }

  window.addEventListener('resize', resize);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', resize);
    glassGeo.dispose();
    glassMat.dispose();
    bgGeo.dispose();
    bgMat.dispose();
    bgTexture.dispose();
    renderTarget.dispose();
    renderer.dispose();
  };
}
