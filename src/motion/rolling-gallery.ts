import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ROLLING_GALLERY_SHADERS } from './rolling-shaders';

gsap.registerPlugin(ScrollTrigger);

export function initRollingProjectsGallery(containerSelector = '#rolling-projects-section'): {
  destroy: () => void;
} {
  const container = document.querySelector(containerSelector) as HTMLElement | null;
  const pinStage = container?.querySelector('.rolling-pin-stage') as HTMLElement | null;
  const canvas = container?.querySelector('canvas.webgl-rolling') as HTMLCanvasElement | null;
  const track = container?.querySelector('.rolling-horizontal-track') as HTMLElement | null;
  const marqueeInner = container?.querySelector('.rolling-marquee__inner') as HTMLElement | null;
  const itemLinks = gsap.utils.toArray<HTMLElement>(`${containerSelector} .rolling-item`);

  if (!container || !pinStage || !canvas || !track || itemLinks.length === 0) {
    return { destroy: () => {} };
  }

  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tickerHandler = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerHandler);
  gsap.ticker.lagSmoothing(0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 10, 5000);
  camera.position.z = 1000;

  const textureLoader = new THREE.TextureLoader();
  const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);
  const planes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  const triggers: ScrollTrigger[] = [];

  const viewport = { width: 0, height: 0 };
  let isSectionActive = false;

  function resize() {
    viewport.width = pinStage!.clientWidth;
    viewport.height = pinStage!.clientHeight;
    renderer.setSize(viewport.width, viewport.height, false);
    camera.aspect = viewport.width / viewport.height;
    camera.fov = 2 * Math.atan(viewport.height / 2 / camera.position.z) * (180 / Math.PI);
    camera.updateProjectionMatrix();
  }

  itemLinks.forEach((item) => {
    const imgUrl = item.getAttribute('data-image') || '';
    const texture = textureLoader.load(imgUrl, () => {
      material.uniforms.uImageSize.value.set(texture.image.width, texture.image.height);
    });

    const material = new THREE.ShaderMaterial({
      vertexShader: ROLLING_GALLERY_SHADERS.vertexShader,
      fragmentShader: ROLLING_GALLERY_SHADERS.fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: { value: texture },
        uImageSize: { value: new THREE.Vector2(1, 1) },
        uSize: { value: new THREE.Vector2() },
        uRoll: { value: 0 },
        uAngle: { value: gsap.utils.random(-0.25, 0.25) },
        uRadius: { value: 50 },
      },
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.frustumCulled = false;
    scene.add(plane);
    planes.push(plane);
  });

  resize();
  window.addEventListener('resize', resize);

  // Distancia total de desplazamiento horizontal del carril
  const totalTrackScroll = () => Math.max(track.scrollWidth - window.innerWidth, 500);

  // Pin timeline maestro: clava el stage de 100dvh y traduce el scroll vertical a horizontal
  const horizontalTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => `+=${totalTrackScroll()}`,
      pin: pinStage,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        isSectionActive = self.isActive;
      },
    },
  });

  horizontalTl.to(track, {
    x: () => -totalTrackScroll(),
    ease: 'none',
  });

  if (marqueeInner) {
    horizontalTl.to(
      marqueeInner,
      {
        xPercent: -35,
        ease: 'none',
      },
      0
    );
  }

  triggers.push(horizontalTl.scrollTrigger!);

  function render() {
    if (!isSectionActive) return;

    const stageRect = pinStage!.getBoundingClientRect();

    planes.forEach((plane, i) => {
      const rect = itemLinks[i].getBoundingClientRect();

      // Posición relativa a la ventana / cámara WebGL
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      plane.position.x = cx - viewport.width / 2;
      plane.position.y = viewport.height / 2 - cy;
      plane.material.uniforms.uSize.value.set(rect.width, rect.height);

      // Física de curvado / enrollado de papel basada en posición horizontal respecto al centro de pantalla
      const screenCenterX = viewport.width / 2;
      const distFromCenter = (cx - screenCenterX) / (viewport.width * 0.55);
      const clampedDist = Math.max(-1, Math.min(1, distFromCenter));

      // Enrollado dinámico: plano y nítido en el centro, enrollado en los bordes
      const rollAmount = Math.sign(clampedDist) * Math.pow(Math.abs(clampedDist), 1.25);
      plane.material.uniforms.uRoll.value = rollAmount;
    });

    renderer.render(scene, camera);
  }

  gsap.ticker.add(render);

  return {
    destroy: () => {
      lenis.destroy();
      gsap.ticker.remove(tickerHandler);
      gsap.ticker.remove(render);
      window.removeEventListener('resize', resize);
      triggers.forEach((t) => t.kill());
      geometry.dispose();
      planes.forEach((p) => {
        p.material.dispose();
        (p.material.uniforms.uTexture.value as THREE.Texture | null)?.dispose();
      });
      renderer.dispose();
    },
  };
}
