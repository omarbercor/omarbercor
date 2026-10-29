export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  specialty: string;
  description: string;
  tags: string[];
  defaultOpen?: boolean;
}

export interface BrandLogo {
  name: string;
  src: string;
}

export const experienceItems: ExperienceItem[] = [
  {
    period: '2020 — PRESENTE',
    role: 'Front-End Developer',
    company: 'Jellyfish',
    specialty: 'High-Traffic Portals, CRO & Adobe Target',
    description:
      'Desarrollo front-end y colaboración estrecha con equipos de diseño UI/UX para implementar interfaces interactivas de alta complejidad. Administración técnica de ecosistemas de contenido masivo (Walmart México) y gestión de infraestructura en Google Cloud Platform (GCP). Ejecución especializada en estrategias de Optimización de Conversión (CRO), configurando, implementando y validando pruebas A/B de alto impacto mediante Adobe Target.',
    tags: [
      'GCP',
      'Adobe Target (CRO)',
      'A/B Testing',
      'Next.js',
      'WordPress Enterprise',
      'Tailwind CSS',
      'UI/UX Collaboration',
      'Core Web Vitals',
    ],
    defaultOpen: true,
  },
  {
    period: '2017 — 2019',
    role: 'Production Lead & Creative Front-End',
    company: 'Pachuco Digital',
    specialty: 'Rich Media, Interactive Campaigns & Infrastructure',
    description:
      'Liderazgo del equipo de producción digital para Coca-Cola México, asegurando la viabilidad técnica de campañas masivas. Responsable de la arquitectura web y administración de servidores dedicados para lanzamientos regionales de alto tráfico. Desarrollo de piezas rich media interactivas, animaciones complejas en Canvas/GSAP a 60 FPS y plataformas con dinámicas en tiempo real optimizadas para dispositivos móviles.',
    tags: [
      'GSAP',
      'HTML5 Canvas',
      'Linux Dedicated Servers',
      'Rich Media Standards',
      'Team Leadership',
      'Real-time Interactions',
    ],
  },
  {
    period: '2018 — 2019',
    role: 'Front-End Developer',
    company: 'Jumpfactor Marketing (Canadá)',
    specialty: 'Cross-Border Web Development',
    description:
      'Desarrollo front-end y optimización de interfaces web orientadas a mercados internacionales, implementando buenas prácticas de código modular y adaptabilidad multidispositivo.',
    tags: ['JavaScript', 'Responsive Design', 'Cross-Browser Optimization', 'Agile Workflows'],
  },
  {
    period: '2013 — 2016',
    role: 'Senior Web Developer & Digital Creative',
    company: 'Noir Digital',
    specialty: 'High-Traffic Publishing & Brand Experiences',
    description:
      "Diseño web y desarrollo para marcas premium como L'Oréal, con enfoque en estética visual y usabilidad. Reingeniería técnica y optimización de plataformas editoriales de tráfico masivo (Lifeboxset), implementando estrategias de SEO técnico y velocidad de carga para soportar millones de visitas.",
    tags: [
      'WordPress Hardening',
      'SEO Técnico',
      'High Traffic',
      'MySQL Optimization',
      'JavaScript',
      "L'Oréal Campaigns",
    ],
  },
  {
    period: '2011 — 2013',
    role: 'Digital Art Director & Creative Technologist',
    company: 'Wunderman (Blue Hive)',
    specialty: 'Automotive Digital Assets & Interactive Campaigns',
    description:
      'Dirección de arte digital y maquetación front-end orientada a campañas interactivas para Ford México dentro del equipo integrado Blue Hive. Diseño y animación de activos digitales de alto rendimiento, incluyendo aplicaciones móviles y Rich Media. Reconocido con el galardón Bronce Mobile para Ford México.',
    tags: ['UI/UX Direction', 'HTML5 / Rich Media', 'Mobile First', 'Bronce Mobile Award', 'Design Systems'],
  },
  {
    period: '2011',
    role: 'Director de Arte Digital',
    company: 'Apernet',
    specialty: 'Massive Events & Festival Web Architecture',
    description:
      'Dirección de arte web y mobile enfocada en las plataformas digitales de los festivales y eventos musicales más importantes de México (incluyendo Corona Capital, Plaza Condesa y diversos eventos masivos para OCESA). Arquitectura visual y técnica de sitios diseñados para soportar picos repentinos y masivos de tráfico durante la venta de boletos y coberturas en vivo.',
    tags: ['High Concurrency Traffic', 'Festival Platforms', 'Web/Mobile Art Direction', 'OCESA Events', 'UI/UX'],
  },
  {
    period: '2006 — 2011',
    role: 'Digital Art Director',
    company: 'Grey Group México',
    specialty: 'Integrated Campaigns & Brand Strategy',
    description:
      'Dirección de arte digital y conceptualización estratégica para marcas globales y nacionales como SEAT México, UNITEC, Gerber, Diageo y Hasbro. Establecimiento de estándares gráficos y de experiencia de usuario para campañas integradas en medios digitales y tradicionales.',
    tags: ['Digital Art Director', 'SEAT México Campaigns', 'Integrated Campaigns', 'Brand Strategy'],
  },
];

export const brandLogos: BrandLogo[] = [
  { name: 'Coca-Cola', src: '/logos/brands/coca-cola.svg' },
  { name: 'Ford', src: '/logos/brands/ford.svg' },
  { name: 'Samsung', src: '/logos/brands/samsung.svg' },
  { name: 'Lincoln', src: '/logos/brands/lincoln.svg' },
  { name: 'SEAT', src: '/logos/brands/seat.svg' },
  { name: 'Johnnie Walker', src: '/logos/brands/johnnie-walker.svg' },
  { name: 'Walmart', src: '/logos/brands/walmart.svg' },
];

