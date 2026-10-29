# Omar Bermúdez — Portfolio & Technical Archive

Portafolio editorial, archivo de casos de estudio, laboratorio experimental (`Lab`) y bitácora técnica construido con **Astro 7**, **GSAP 3.15** y **Three.js**, gobernado bajo el estándar **[AI-Native Development Playbook v2](https://github.com/omarbercor/AI-Native-Development-Playbook)**.

## Estructura del Proyecto

```text
/
├── .agents/               # Reglas invariantes y skills especializados (AI Playbook v2)
├── .assets_temporales/    # Staging local (capturas, docs, logos crudos) — Ignorado en Git
├── public/                # Activos estáticos públicos servidos en raíz
├── src/                   # Código fuente modular (< 200 líneas por archivo)
│   ├── components/        # Componentes UI y bloques de sección
│   ├── data/              # Colecciones y esquemas tipados
│   ├── layouts/           # Layouts base y cabeceras SEO
│   ├── pages/             # Rutas de Astro (/, /work, /lab, /writing)
│   └── styles/            # Design tokens y hojas modulares
├── active_context.md      # Memoria persistente (RAM) del estado actual del proyecto
├── AGENTS.md              # Gobernanza global para agentes IA
└── astro.config.mjs       # Configuración de Astro 7
```

## Comandos de Desarrollo

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala dependencias del proyecto |
| `npm run dev` | Levanta servidor local en `http://localhost:4321` |
| `npm run build` | Compila el entregable estático de producción en `./dist/` |
| `npm run preview` | Previsualiza localmente el build de producción |
