import gsap from 'gsap';

function calculateTapeTravel(tapeTrack: HTMLElement): number {
  const cards = tapeTrack.querySelectorAll<HTMLElement>('.tape-card');
  if (cards.length < 2) return tapeTrack.scrollWidth - window.innerWidth;

  const first = cards[0];
  const last = cards[cards.length - 1];
  const totalCardsSpan = last.offsetLeft + last.offsetWidth - first.offsetLeft;
  const firstCardLeftInViewport = first.getBoundingClientRect().left;
  const availableViewportSpace = window.innerWidth - 2 * firstCardLeftInViewport;

  return Math.max(0, totalCardsSpan - availableViewportSpace);
}

export function initManifestoReveal(): void {
  const manifestoText = document.getElementById('manifesto-text');
  const manifestoSection = document.getElementById('manifesto');
  if (!manifestoText || !manifestoSection) return;

  const rawContent = manifestoText.textContent || '';
  const words = rawContent.trim().split(/\s+/);
  manifestoText.innerHTML = words
    .map((word) => `<span class="manifesto-word">${word}</span>`)
    .join(' ');

  const wordSpans = manifestoText.querySelectorAll('.manifesto-word');
  const manifestoTl = gsap.timeline({
    scrollTrigger: {
      trigger: manifestoSection,
      start: 'center center',
      end: '+=600',
      pin: true,
      scrub: 0.4,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  manifestoTl.to(wordSpans, {
    color: '#121214',
    stagger: 0.05,
    ease: 'none',
  });
}

export function initSkillsTapePin(): void {
  const skillsSection = document.getElementById('skills-section');
  const cautionTape = document.getElementById('caution-tape');
  const skillsTitle = document.getElementById('skills-monument-title');
  const tapeTrack = document.getElementById('tape-track');
  if (!skillsSection || !cautionTape || !skillsTitle || !tapeTrack) return;

  const skillsPinTl = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection,
      start: 'center center',
      end: '+=2200',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  skillsPinTl.fromTo(
    cautionTape,
    { y: '50vh' },
    { y: '0vh', ease: 'power2.out', duration: 0.15 },
    0
  );

  skillsPinTl.to(
    tapeTrack,
    {
      x: () => -calculateTapeTravel(tapeTrack),
      ease: 'none',
      duration: 0.85,
    },
    0.15
  );
}

