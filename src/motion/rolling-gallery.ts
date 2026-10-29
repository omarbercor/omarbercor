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
  const canvas = container?.querySelector('canvas.webgl-rolling') as HTMLCanvasElement | null;
  const marquee = container?.querySelector('.rolling-marquee') as HTMLElement | null;
  const marqueeInner = container?.querySelector('.rolling-marquee__inner') as HTMLElement | null;
  const itemLinks = gsap.utils.toArray<HTMLElement>(`${containerSelector} .rolling-item`);

  if (!container || !canvas || itemLinks.length === 0) return { destroy: () => {} };

  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
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
  let needsRender = true;
  let lastTop: number | null = null;
  let isSectionVisible = false;

  function resize() {
    viewport.width = canvas!.clientWidth;
    viewport.height = canvas!.clientHeight;
    renderer.setSize(viewport.width, viewport.height, false);
    camera.aspect = viewport.width / viewport.height;
    camera.fov = 2 * Math.atan(viewport.height / 2 / camera.position.z) * (180 / Math.PI);
    camera.updateProjectionMatrix();
    positionItems();
    needsRender = true;
  }

  function positionItems() {
    const itemWidth = itemLinks[0]?.offsetWidth || 480;
    const freeSpace = (window.innerWidth - itemWidth) / 2;
    const amplitude = Math.min(window.innerWidth * 0.18, freeSpace);
    itemLinks.forEach((item, i) => {
      const angle = i * 0.85;
      gsap.set(item, { x: Math.sin(angle) * amplitude });
    });
  }

  itemLinks.forEach((item) => {
    const imgUrl = item.getAttribute('data-image') || '';
    const texture = textureLoader.load(imgUrl, () => {
      material.uniforms.uImageSize.value.set(texture.image.width, texture.image.height);
      needsRender = true;
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
        uAngle: { value: gsap.utils.random(-0.35, 0.35) },
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

  // Trigger que acota canvas y marquesina estrictamente a la sección de proyectos
  const sectionBoundaryTrigger = ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    end: 'bottom 20%',
    onEnter: () => setVisibility(true),
    onLeave: () => setVisibility(false),
    onEnterBack: () => setVisibility(true),
    onLeaveBack: () => setVisibility(false),
  });
  triggers.push(sectionBoundaryTrigger);

  function setVisibility(active: boolean) {
    isSectionVisible = active;
    if (active) {
      canvas?.classList.add('is-active');
      marquee?.classList.add('is-active');
      needsRender = true;
    } else {
      canvas?.classList.remove('is-active');
      marquee?.classList.remove('is-active');
    }
  }

  function holdAtMiddle(progress: number, hold = 0.2) {
    const half = hold * 0.5;
    if (progress < 0.5 - half) return gsap.utils.mapRange(0, 0.5 - half, 0, 0.5, progress);
    if (progress > 0.5 + half) return gsap.utils.mapRange(0.5 + half, 1, 0.5, 1, progress);
    return 0.5;
  }

  planes.forEach((plane, i) => {
    const { uniforms } = plane.material;
    const trigger = ScrollTrigger.create({
      trigger: itemLinks[i],
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate(self) {
        needsRender = true;
        const t = holdAtMiddle(self.progress, 0.12);
        uniforms.uRoll.value = Math.cos(t * Math.PI);
      },
    });
    triggers.push(trigger);
  });

  if (marqueeInner) {
    const marqueeTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate(self) {
        gsap.set(marqueeInner, { xPercent: 5 - self.progress * 45 });
      },
    });
    triggers.push(marqueeTrigger);
  }

  function render() {
    if (!isSectionVisible) return;
    const top = itemLinks[0]?.getBoundingClientRect().top ?? 0;
    if (!needsRender && top === lastTop) return;
    needsRender = false;
    lastTop = top;

    planes.forEach((plane, i) => {
      const rect = itemLinks[i].getBoundingClientRect();
      plane.position.x = rect.left + rect.width / 2 - viewport.width / 2;
      plane.position.y = viewport.height / 2 - rect.top - rect.height / 2;
      plane.material.uniforms.uSize.value.set(rect.width, rect.height);
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
