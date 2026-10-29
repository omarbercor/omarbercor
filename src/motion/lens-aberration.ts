import * as THREE from 'three';
import { SITE_OPTICS_CONFIG } from '@/config/site-optics';

/**
 * lens-aberration.ts
 * Galería de imágenes a pantalla completa con aberración cromática y estela confinadas al 10% exterior.
 */
export function initLensAberrationGallery(
  canvasId: string,
  imageSrcs: string[],
  options?: Partial<typeof SITE_OPTICS_CONFIG.lens>
): {
  destroy: () => void;
  setStrength: (val: number) => void;
  setGrainStrength: (val: number) => void;
  setEdgeWidth: (val: number) => void;
  setTrailDistance: (val: number) => void;
  setTrailSpeed: (val: number) => void;
} {
  const config = { ...SITE_OPTICS_CONFIG.lens, ...options };
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) {
    return {
      destroy: () => {}, setStrength: () => {}, setGrainStrength: () => {},
      setEdgeWidth: () => {}, setTrailDistance: () => {}, setTrailSpeed: () => {}
    };
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const textureLoader = new THREE.TextureLoader();
  const loadedTextures = imageSrcs.map((src) => textureLoader.load(src));

  let trailDistance = config.trail.distance;
  let trailSpeed = config.trail.speed;

  const uniforms = {
    uTex0: { value: loadedTextures[0] || null },
    uTex1: { value: loadedTextures[1] || null },
    uTex2: { value: loadedTextures[2] || null },
    uAberrationStrength: { value: config.enabled ? config.strength : 0.0 },
    uEdgeWidth: { value: config.edgeWidth },
    uGrainStrength: { value: config.grainMix },
    uScrollVelocity: { value: 0.0 },
    uTime: { value: 0.0 },
  };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTex0;
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float uAberrationStrength;
    uniform float uEdgeWidth;
    uniform float uGrainStrength;
    uniform float uScrollVelocity;
    uniform float uTime;
    varying vec2 vUv;

    float tvNoise(vec2 p, float ta, float tb) {
      return fract(sin(p.x * ta + p.y * tb) * 5678.0);
    }

    void main() {
      float colIndex = floor(vUv.x * 3.0);
      vec2 colUv = vec2(fract(vUv.x * 3.0), vUv.y);

      // Cota del 10% en cada borde
      float leftEdge = smoothstep(uEdgeWidth, 0.0, vUv.x);
      float rightEdge = smoothstep(1.0 - uEdgeWidth, 1.0, vUv.x);
      float edgeFactor = max(leftEdge, rightEdge);
      
      // Desfase horizontal en bordes
      float edgeOffset = (-leftEdge + rightEdge) * uAberrationStrength * 0.035;
      
      // Estela vertical estrictamente multiplicada por edgeFactor (en el 80% central es exactamente 0.0)
      float scrollLag = uScrollVelocity * 0.035 * edgeFactor;

      vec2 uvR = vec2(clamp(colUv.x + edgeOffset, 0.0001, 0.9999), clamp(colUv.y - scrollLag, 0.0001, 0.9999));
      vec2 uvG = colUv;
      vec2 uvB = vec2(clamp(colUv.x - edgeOffset, 0.0001, 0.9999), clamp(colUv.y + scrollLag, 0.0001, 0.9999));

      vec3 color = vec3(0.0);

      if (colIndex < 0.5) {
        color.r = texture2D(uTex0, uvR).r;
        color.g = texture2D(uTex0, uvG).g;
        color.b = texture2D(uTex0, uvB).b;
      } else if (colIndex < 1.5) {
        // Columna central (80% central): 100% pura y nítida
        color.r = texture2D(uTex1, uvR).r;
        color.g = texture2D(uTex1, uvG).g;
        color.b = texture2D(uTex1, uvB).b;
      } else {
        color.r = texture2D(uTex2, uvR).r;
        color.g = texture2D(uTex2, uvG).g;
        color.b = texture2D(uTex2, uvB).b;
      }

      if (uGrainStrength > 0.001) {
        float t = uTime * 2.4;
        float noiseVal = tvNoise(vUv * 600.0, t * 0.6543, t * 0.1234);
        color += (noiseVal - 0.5) * uGrainStrength;
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  scene.add(quad);

  let lastScrollY = window.scrollY;
  let targetVelocity = 0;
  let currentVelocity = 0;
  let scrollTimeout = 0;

  function onScroll() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    lastScrollY = currentY;
    targetVelocity = Math.max(-1.5, Math.min(1.5, (delta / 12) * trailDistance));
    
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
      targetVelocity = 0;
    }, 45);
  }

  function resize() {
    if (!canvas) return;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize);
  resize();

  let animId = 0;
  const startTime = performance.now();

  function render() {
    animId = requestAnimationFrame(render);
    currentVelocity += (targetVelocity - currentVelocity) * trailSpeed;
    uniforms.uScrollVelocity.value = currentVelocity;
    uniforms.uTime.value = (performance.now() - startTime) * 0.001;
    renderer.render(scene, camera);
  }
  render();

  return {
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      window.clearTimeout(scrollTimeout);
      quad.geometry.dispose();
      mat.dispose();
      loadedTextures.forEach((t) => t.dispose());
      renderer.dispose();
    },
    setStrength: (val: number) => { uniforms.uAberrationStrength.value = val; },
    setGrainStrength: (val: number) => { uniforms.uGrainStrength.value = val; },
    setEdgeWidth: (val: number) => { uniforms.uEdgeWidth.value = val; },
    setTrailDistance: (val: number) => { trailDistance = val; },
    setTrailSpeed: (val: number) => { trailSpeed = val; },
  };
}
