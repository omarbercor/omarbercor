export interface SkillItem {
  tag: string;
  name: string;
  description: string;
  iconSrc?: string;
  iconAlt?: string;
  inlineIcon?: 'metrics';
}

export const skills: SkillItem[] = [
  {
    tag: 'AI-FIRST ENGINEERING',
    name: 'AI Coding, Agents & LLM APIs',
    description: 'Google Antigravity, Ollama, n8n, workflows autónomos',
    iconSrc: '/logos/skills/gemini.svg',
    iconAlt: 'Gemini AI',
  },
  {
    tag: 'FRONTEND ARCHITECTURE',
    name: 'Modern React, Next.js & Astro',
    description: 'Arquitectura modular, Islands, TypeScript',
    iconSrc: '/logos/skills/astro.svg',
    iconAlt: 'Astro',
  },
  {
    tag: 'ENTERPRISE INFRASTRUCTURE',
    name: 'Linux Hardening, Docker & Proxmox',
    description: 'Virtualización, contenedores, servidores seguros',
    iconSrc: '/logos/skills/proxmox.svg',
    iconAlt: 'Proxmox',
  },
  {
    tag: 'CLOUD & HIGH TRAFFIC',
    name: 'Google Cloud Platform & CI/CD',
    description: 'Despliegues en producción, pipelines, balanceo y escala',
    iconSrc: '/logos/skills/google-cloud.svg',
    iconAlt: 'Google Cloud',
  },
  {
    tag: 'ENTERPRISE CMS & ECOMMERCE',
    name: 'Contentful, Acoustic, WP & Shopify',
    description: 'Ecosistemas headless, CMS corporativos y tiendas transaccionales',
    iconSrc: '/logos/skills/wordpress.svg',
    iconAlt: 'WordPress Enterprise',
  },
  {
    tag: 'PERFORMANCE & MEASUREMENT',
    name: 'Core Web Vitals & Data Layer',
    description: 'Auditorías de velocidad, instrumentación GTM/Adobe Launch, analítica limpia',
    inlineIcon: 'metrics',
  },
  {
    tag: 'COLLABORATIVE DEV & GOVERNANCE',
    name: 'GitHub Actions & Code Governance',
    description: 'Pipelines de automatización, code reviews y control de versiones',
    iconSrc: '/logos/skills/github.svg',
    iconAlt: 'GitHub',
  },
  {
    tag: 'INTERACTIVE & 3D WEB',
    name: 'Three.js, WebGL & GSAP',
    description: 'Experiencias inmersivas, micro-interacciones a 60 FPS y gráficos WebGL',
    iconSrc: '/logos/skills/gsap.svg',
    iconAlt: 'GSAP Greensock',
  },
  {
    tag: 'DESIGN TO CODE',
    name: 'UI/UX Sensibility & Design Tokens',
    description: 'Criterio visual de dirección de arte, Figma a producción sin fricción',
    iconSrc: '/logos/skills/figma.svg',
    iconAlt: 'Figma',
  },
  {
    tag: 'BACKEND & APIS',
    name: 'Laravel 11, PHP & REST / GraphQL',
    description: 'Arquitectura de servicios, bases de datos y consumo de APIs robustas',
    iconSrc: '/logos/skills/php.svg',
    iconAlt: 'PHP',
  },
];

