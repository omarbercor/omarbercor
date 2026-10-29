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
  const track = container?.querySelector('.rolling-items-track') as HTMLElement | null;
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
  const angles = [-0.18, 0.16, -0.14, 0.18, -0.15];

  function resize() {
    viewport.width = pinStage!.clientWidth;
    viewport.height = pinStage!.clientHeight;
    renderer.setSize(viewport.width, viewport.height, false);
    camera.aspect = viewport.width / viewport.height;
    camera.fov = 2 * Math.atan(viewport.height / 2 / camera.position.z) * (180 / Math.PI);
    camera.updateProjectionMatrix();
    positionItems();
  }

  function positionItems() {
    const itemWidth = itemLinks[0]?.offsetWidth || 480;
    const freeSpace = (window.innerWidth - itemWidth) / 2;
    const amplitude = Math.min(window.innerWidth * 0.14, Math.max(freeSpace * 0.6, 0));
    itemLinks.forEach((item, i) => {
      const angle = i * 0.8;
      gsap.set(item, { x: Math.sin(angle) * amplitude });
    });
  }

  itemLinks.forEach((item, i) => {
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
        uAngle: { value: angles[i % angles.length] },
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

  // Distancia total de desplazamiento vertical del carril para que pase hasta el último proyecto
  const totalVerticalScroll = () => Math.max(track.scrollHeight - window.innerHeight, window.innerHeight * 2.5);

  // Timeline maestro con Pinning: clava el escenario al llegar a top 0
  const pinTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      pin: pinStage,
      start: 'top top',
      end: () => `+=${totalVerticalScroll()}`,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // 1. Las imágenes se desplazan verticalmente a lo largo del scroll
  pinTimeline.to(
    track,
    {
      y: () => -totalVerticalScroll(),
      ease: 'none',
    },
    0
  );

  // 2. La marquesina se desplaza horizontalmente sobre las fotos
  if (marqueeInner) {
    pinTimeline.fromTo(
      marqueeInner,
      { x: '8vw' },
      { xPercent: -50, ease: 'none' },
      0
    );
  }

  triggers.push(pinTimeline.scrollTrigger!);

  // Mantiene plano y nítido el objeto al cruzar el centro
  function holdAtMiddle(progress: number, hold = 0.22) {
    const half = hold * 0.5;
    if (progress < 0.5 - half) return gsap.utils.mapRange(0, 0.5 - half, 0, 0.5, progress);
    if (progress > 0.5 + half) return gsap.utils.mapRange(0.5 + half, 1, 0.5, 1, progress);
    return 0.5;
  }

  function render() {
    const rect = container!.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    planes.forEach((plane, i) => {
      const itemRect = itemLinks[i].getBoundingClientRect();
      const cx = itemRect.left + itemRect.width / 2;
      const cy = itemRect.top + itemRect.height / 2;

      plane.position.x = cx - viewport.width / 2;
      plane.position.y = viewport.height / 2 - cy;
      plane.material.uniforms.uSize.value.set(itemRect.width, itemRect.height);

      // Física de curvado al entrar por abajo, aplanado en el centro y enrollado al salir por arriba
      const reach = itemRect.height * 0.5 + 40;
      const startY = viewport.height + reach;
      const endY = -reach;
      const rawProgress = gsap.utils.clamp(0, 1, gsap.utils.mapRange(startY, endY, 0, 1, cy));
      const t = holdAtMiddle(rawProgress, 0.22);

      plane.material.uniforms.uRoll.value = Math.cos(t * Math.PI);
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
