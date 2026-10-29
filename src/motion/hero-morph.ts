import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PhotoMetrics {
  deltaX: number;
  deltaY: number;
  startW: number;
  startH: number;
  targetW: number;
  targetH: number;
}

function measurePhotoDelta(startMount: HTMLElement, targetSlot: HTMLElement): PhotoMetrics {
  const startRect = startMount.getBoundingClientRect();
  const targetRect = targetSlot.getBoundingClientRect();
  const startCenterX = startRect.left + window.scrollX + startRect.width / 2;
  const startCenterY = startRect.top + window.scrollY + startRect.height / 2;
  const targetCenterX = targetRect.left + window.scrollX + targetRect.width / 2;
  const targetCenterY = targetRect.top + window.scrollY + targetRect.height / 2;

  return {
    deltaX: targetCenterX - startCenterX,
    deltaY: targetCenterY - startCenterY,
    startW: startRect.width,
    startH: startRect.height,
    targetW: targetRect.width,
    targetH: targetRect.height,
  };
}

export function initHeroEntrance(): void {
  gsap
    .timeline()
    .from('#traveling-photo', { scale: 0.88, duration: 1.05, ease: 'power3.out' })
    .from('#traveling-photo-inner', { scale: 1.18, rotation: -8, duration: 1.2, ease: 'power2.out' }, '<')
    .from('#traveling-photo-img', { scale: 1.08, duration: 1.35, ease: 'power1.out' }, '<')
    .from('#name-line-1', { y: 28, duration: 0.75, ease: 'power4.out' }, '-=0.95')
    .from('#name-line-2', { y: 28, duration: 0.75, ease: 'power4.out' }, '-=0.65')
    .from('#hero-statement', { y: 16, opacity: 0.01, duration: 0.65, ease: 'power3.out' }, '-=0.45');
}

export function initHeroPhotoMorph(): void {
  const photo = document.getElementById('traveling-photo');
  const startMount = document.getElementById('hero-photo-mount');
  const targetSlot = document.getElementById('about-photo-slot');
  if (!photo || !startMount || !targetSlot) return;

  const getMetrics = () => measurePhotoDelta(startMount, targetSlot);
  const morphTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      endTrigger: '#about',
      end: 'top center',
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  });

  morphTl.to(
    photo,
    {
      x: () => getMetrics().deltaX * 0.7,
      y: () => getMetrics().deltaY * 0.7,
      width: () => getMetrics().startW,
      height: () => getMetrics().startH,
      borderRadius: '50%',
      ease: 'power1.out',
      duration: 0.7,
    },
    0
  );

  morphTl.to(
    photo,
    {
      x: () => getMetrics().deltaX,
      y: () => getMetrics().deltaY,
      width: () => getMetrics().targetW,
      height: () => getMetrics().targetH,
      borderRadius: '24px',
      boxShadow: '0 0 0 0px rgba(250, 247, 243, 0), 0 20px 40px rgba(18, 18, 20, 0.12)',
      ease: 'power3.inOut',
      duration: 0.3,
    },
    0.7
  );

  const imgEl = document.getElementById('traveling-photo-img');
  if (imgEl) {
    morphTl.to(imgEl, { filter: 'grayscale(100%) contrast(108%)', ease: 'power2.inOut', duration: 0.3 }, 0.7);
  }

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export function initAboutReveal(): void {
  gsap.from('#triptych-col-left', {
    scrollTrigger: { trigger: '#about', start: 'top 75%' },
    x: -30,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  });

  gsap.from('#triptych-col-right', {
    scrollTrigger: { trigger: '#about', start: 'top 75%' },
    x: 30,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    delay: 0.1,
  });
}

