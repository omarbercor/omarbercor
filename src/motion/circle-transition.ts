/**
 * circle-transition.ts
 * Transición de página en círculo expansivo (estilo Interlude de Codrops / Manoela Ilic).
 * Se expande desde las coordenadas exactas del clic (clientX, clientY) y revela la nueva página
 * mediante un orificio concéntrico que crece hasta salir del viewport.
 */
import { gsap } from 'gsap';

interface OriginCoords {
  x: number;
  y: number;
}

const DEFAULT_ORIGIN: OriginCoords = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
};

let currentOrigin: OriginCoords = { ...DEFAULT_ORIGIN };
let isTransitioning = false;

export function setTransitionOrigin(x: number, y: number) {
  currentOrigin = { x, y };
  try {
    sessionStorage.setItem('interlude_circle_origin', JSON.stringify(currentOrigin));
  } catch {}
}

export function getTransitionOrigin(): OriginCoords {
  try {
    const saved = sessionStorage.getItem('interlude_circle_origin');
    if (saved) return JSON.parse(saved);
  } catch {}
  return currentOrigin;
}

export function farthestCorner(x: number, y: number): number {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

function getOverlayElement(): HTMLElement | null {
  return document.getElementById('circle-transition-overlay');
}

export function playCircleLeave(origin?: OriginCoords): Promise<void> {
  const coords = origin ?? getTransitionOrigin();
  const overlay = getOverlayElement();
  if (!overlay) return Promise.resolve();

  isTransitioning = true;
  overlay.style.visibility = 'visible';
  overlay.style.pointerEvents = 'auto';
  overlay.style.removeProperty('mask-image');
  overlay.style.removeProperty('-webkit-mask-image');

  const maxRadius = farthestCorner(coords.x, coords.y) + 50;

  return new Promise((resolve) => {
    gsap.fromTo(
      overlay,
      {
        clipPath: `circle(0px at ${coords.x}px ${coords.y}px)`,
        opacity: 1,
      },
      {
        clipPath: `circle(${maxRadius}px at ${coords.x}px ${coords.y}px)`,
        duration: 0.72,
        ease: 'power3.inOut',
        onComplete: () => resolve(),
      }
    );
  });
}

export function playCircleEnter(origin?: OriginCoords): Promise<void> {
  const coords = origin ?? getTransitionOrigin();
  const overlay = getOverlayElement();
  if (!overlay) return Promise.resolve();

  const maxRadius = farthestCorner(coords.x, coords.y) + 50;
  const hole = { r: 0 };

  const updateMask = () => {
    const mask = `radial-gradient(circle at ${coords.x}px ${coords.y}px, transparent ${hole.r}px, #000 ${hole.r + 1}px)`;
    overlay.style.setProperty('mask-image', mask);
    overlay.style.setProperty('-webkit-mask-image', mask);
  };

  updateMask();

  return new Promise((resolve) => {
    gsap.fromTo(
      hole,
      { r: 0 },
      {
        r: maxRadius,
        duration: 0.68,
        ease: 'power3.out',
        onUpdate: updateMask,
        onComplete: () => {
          overlay.style.visibility = 'hidden';
          overlay.style.pointerEvents = 'none';
          overlay.style.removeProperty('mask-image');
          overlay.style.removeProperty('-webkit-mask-image');
          overlay.style.removeProperty('clip-path');
          isTransitioning = false;
          resolve();
        },
      }
    );
  });
}

/**
 * Inicializa los hooks de ciclo de vida con Astro ClientRouter
 */
export function initCircleTransitions() {
  if (typeof document === 'undefined') return;

  // Intercepta la preparación de navegación para expandir el círculo antes del swap
  document.addEventListener('astro:before-preparation', (e: any) => {
    const originalLoader = e.loader;
    e.loader = async () => {
      await playCircleLeave();
      await originalLoader();
    };
  });

  // Una vez que Astro intercambia el DOM y carga la nueva página, abre el círculo
  document.addEventListener('astro:page-load', () => {
    if (isTransitioning) {
      playCircleEnter();
    }
  });

  // Captura global de coordenadas en clics con data-transition="circle"
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('a[data-transition="circle"], .rolling-item');
    if (target) {
      setTransitionOrigin(e.clientX, e.clientY);
    }
  }, { capture: true });
}
