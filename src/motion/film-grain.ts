import { SITE_OPTICS_CONFIG } from '@/config/site-optics';

/**
 * film-grain.ts
 * Generador de grano analógico cinematográfico (estilo 35mm).
 * Lee su configuración de SITE_OPTICS_CONFIG o recibe overrides puntuales.
 */
export function initFilmGrain(
  canvasId: string,
  options?: Partial<typeof SITE_OPTICS_CONFIG.grain>
): {
  destroy: () => void;
  setOpacity: (val: number) => void;
} {
  const config = { ...SITE_OPTICS_CONFIG.grain, ...options };
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas || !config.enabled) return { destroy: () => {}, setOpacity: () => {} };

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { destroy: () => {}, setOpacity: () => {} };

  canvas.style.opacity = config.opacity.toString();

  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = config.patternSize;
  patternCanvas.height = config.patternSize;
  const pCtx = patternCanvas.getContext('2d');
  if (!pCtx) return { destroy: () => {}, setOpacity: () => {} };

  const pData = pCtx.createImageData(config.patternSize, config.patternSize);
  const buf = new Uint32Array(pData.data.buffer);
  const alphaVal = config.noiseAlpha;

  function generateNoise() {
    for (let i = 0; i < buf.length; i++) {
      const n = (Math.random() * 255) | 0;
      buf[i] = (alphaVal << 24) | (n << 16) | (n << 8) | n;
    }
    pCtx!.putImageData(pData, 0, 0);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  let animId = 0;
  let lastTime = 0;
  const fpsInterval = 1000 / config.fps;

  function loop(time: number) {
    animId = requestAnimationFrame(loop);
    const delta = time - lastTime;
    if (delta > fpsInterval) {
      lastTime = time - (delta % fpsInterval);
      generateNoise();
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const pattern = ctx!.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx!.fillStyle = pattern;
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      }
    }
  }

  animId = requestAnimationFrame(loop);

  return {
    destroy: () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    },
    setOpacity: (val: number) => {
      if (canvas) canvas.style.opacity = Math.max(0, Math.min(1, val)).toString();
    },
  };
}
