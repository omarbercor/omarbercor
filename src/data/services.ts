export interface ServiceItem {
  id: string;
  number: string;
  navTitle: string;
  headline: string;
  description: string;
  deliverables: string[];
  stack: string[];
}

export const services: ServiceItem[] = [
  {
    id: 'service-1',
    number: '01',
    navTitle: 'Modern Web & CMS Ecosystems',
    headline: 'Desarrollo Web de Alto Rendimiento, Headless & Enterprise CMS',
    description:
      'Construcción de plataformas digitales rápidas, modulares y accesibles. Desde sitios estáticos ultraligeros con arquitectura de islas hasta ecosistemas headless desacoplados y CMS corporativos blindados sin dependencias innecesarias ni código residual.',
    deliverables: [
      'Desarrollo front-end a medida con Astro, Next.js, React y TypeScript de alto impacto.',
      'Implementación de CMS headless (Contentful, Strapi) y arquitecturas WordPress Enterprise optimizadas para equipos editoriales.',
      'Generación de landing pages transaccionales y componentes modulares en entornos corporativos (Acoustic, Shopify Plus).',
    ],
    stack: [
      'Next.js',
      'Astro Islands',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'WordPress REST/GraphQL',
      'Contentful',
      'Shopify',
      'Acoustic LP',
    ],
  },
  {
    id: 'service-2',
    number: '02',
    navTitle: 'Performance & Technical Experimentation',
    headline: 'Auditoría de Rendimiento, Core Web Vitals & Arquitectura de Medición',
    description:
      'Diagnóstico exhaustivo y refactorización técnica para garantizar tiempos de carga inmediatos y estabilidad visual en producción. Implementación de la capa técnica para pruebas de experimentación (A/B testing) sin parpadeo de interfaz (flicker) ni penalizaciones de SEO.',
    deliverables: [
      'Auditoría y optimización continua de Core Web Vitals (LCP, INP, CLS) superando 90+ en dispositivos móviles.',
      'Instrumentación técnica de Data Layer, Google Tag Manager y scripts de analítica sin degradar el rendimiento web.',
      'Adaptación técnica de pruebas A/B, optimización de renderizado en DOM y profiling en Chrome DevTools.',
    ],
    stack: [
      'Core Web Vitals',
      'Lighthouse Auditing',
      'Data Layer',
      'Google Tag Manager',
      'A/B Testing Implementation',
      'Chrome DevTools',
      'WCAG 2.1 AA',
    ],
  },
  {
    id: 'service-3',
    number: '03',
    navTitle: 'AI Workflows & Data Pipelines',
    headline: 'Orquestación con n8n, Asistentes de IA & Extracción Inteligente de Datos',
    description:
      'Automatización de flujos operativos complejos integrando Inteligencia Artificial en entornos de producción seguros. Diseño de pipelines que conectan APIs empresariales, modelos de lenguaje (LLMs) y extracción masiva de datos para eliminar trabajo manual repetitivo.',
    deliverables: [
      'Workflows auto-hospedados en n8n con manejo de errores, webhooks y reintentos automáticos.',
      'Herramientas de extracción estructurada de datos (Web Scraping) con emulación de navegador y tratamiento de respuestas en tiempo real.',
      'Conexión de APIs de LLMs (OpenAI, Claude, Ollama) para procesamiento, clasificación y enriquecimiento automatizado de contenidos.',
    ],
    stack: [
      'n8n Workflows',
      'Google Antigravity / Gemini & OpenAI APIs',
      'Local LLMs (Ollama)',
      'Web Scraping',
      'Node.js',
      'Webhooks & REST APIs',
      'JSON Pipelines',
    ],
  },
  {
    id: 'service-4',
    number: '04',
    navTitle: 'Creative Engineering & Interactive Web',
    headline: 'Experiencias Interactivas Web, Gráficos 3D & Rich Media de Alto Impacto',
    description:
      'El balance entre dirección de arte digital e ingeniería creativa para activaciones de marca memorables. Desarrollo de experiencias inmersivas, componentes tridimensionales en el navegador y dinámicas de participación en tiempo real optimizadas para cualquier dispositivo.',
    deliverables: [
      'Escenas y modelos 3D interactivos en WebGL utilizando Three.js con carga diferida y bajo consumo de memoria.',
      'Micro-interacciones complejas y narrativas visuales de scroll a 60 FPS mediante GSAP (ScrollTrigger).',
      'Dinámicas web de gamificación y plataformas de participación en tiempo real conectadas a bases de datos en la nube.',
    ],
    stack: [
      'Three.js',
      'WebGL',
      'GSAP ScrollTrigger',
      'HTML5 Canvas',
      'SVG Animation',
      'Firebase Realtime',
      'Rich Media Standards',
    ],
  },
  {
    id: 'service-5',
    number: '05',
    navTitle: 'Cloud Infrastructure & DevOps',
    headline: 'Aislamiento en Contenedores, Servidores Seguros & Despliegues Cloud',
    description:
      'Infraestructura sólida para sostener aplicaciones web sin caídas bajo tráfico demandante. Configuración de servidores Linux blindados, despliegues reproducibles con contenedores Docker y orquestación tanto en la nube como en hardware dedicado (Proxmox VE).',
    deliverables: [
      'Aprovisionamiento y hardening de servidores Linux (Ubuntu/Debian) con proxies inversos (Nginx/CloudPanel) y certificados SSL automáticos.',
      'Contenedorización de aplicaciones y bases de datos con Docker y Docker Compose para desarrollo y producción homogéneos.',
      'Configuración de entornos de virtualización (Proxmox VE), redes seguras (Tailscale, Cloudflare Tunnels) y pipelines de despliegue continuo con GitHub Actions.',
    ],
    stack: [
      'Docker / Compose',
      'Proxmox VE',
      'Google Cloud Platform',
      'Linux Hardening',
      'Nginx / Reverse Proxy',
      'GitHub Actions',
      'Cloudflare Tunnels',
    ],
  },
];

