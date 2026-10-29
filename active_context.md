> Last Updated: 2026-10-29 | Version: 2.9 | Fase: Sincronización 1:1 Foto Vertical y Título Horizontal en Galería

# Active Context — RAM y Memoria Persistente del Proyecto

> [!IMPORTANT]
> **REGLA PARA EL AGENTE IA**: Este archivo (`active_context.md` en la raíz del workspace) es la memoria viva (RAM) del proyecto.
> 1. Léelo **al inicio** de cada sesión antes de ejecutar cualquier tarea.
> 2. Actualízalo **al cierre** de cada tarea o sprint (`< 150` líneas, sin historial muerto).

---

## 🗓️ Última Actualización

- **Fecha**: 2026-10-29
- **Sesión**: Sincronización matemática geométrica entre fotos y marquesina en [`/homev2`](file:///o:/Desarrollo/omarbercor/src/pages/homev2.astro):
  1. **Alineación de centros**: En el punto exacto en que la foto de un proyecto alcanza el centro vertical de la pantalla (`cy === viewport.height / 2`), el título de ese mismo proyecto en la marquesina coincide exactamente en el centro horizontal (`cx === viewport.width / 2`).
  2. **Interpolación continua por tramos**: Cálculo dinámico de `syncPoints` que mapea `track.y` con `marqueeInner.x` en cada frame, garantizando transición suave e impecable en ambos sentidos del scroll (bajada y subida).
  3. **Marquesina continua sin vacíos**: Estructura de tres juegos (clones previo/posterior y set principal `is-main`) para mantener el cruce tipográfico sin espacios en blanco en pantallas ultra anchas.
- **Estado**: 🟢 Estable (`36 page(s) built in 1.98s`, 0 errores, dev activo en `http://localhost:4321/homev2`).

---

## 🎯 Objetivo del Sprint Actual

Secuencia maestra actualizada con Omar:
1. ✅ **Sprint Modular (`1B`)**: Completado al 100% (`93/93` archivos fuente en `src/` bajo `< 200` líneas + Content Collections con Zod).
2. ✅ **Sprint Rendimiento, CWV & Activos (`1A` sin SEO/GEO)**: Completado al 100% (fuentes `.woff2` locales, LCP inmediato, pipeline AVIF/WebP, localización de Unsplash y limpieza de activos/dependencias).
3. ⏳ **Sprint Experiencia Awwwards, Motion 60 FPS, Accesibilidad & Visual QA (`2 y 3` — Siguiente foco inmediato)**:
   - Física magnética LERP real (`gsap.quickTo`) sobre `[data-magnetic]`, integración de **Lenis** + `gsap.ticker`, `gsap.matchMedia()` + `gsap.context()`, animaciones GPU-only.
   - Accesibilidad y responsive fino: `prefers-reduced-motion`, `:focus-visible`, ARIA completo en tabs/acordeón/split-text, `100vh` → `100dvh`, `@media (hover: hover)` y ajuste seguro de `375px` en `.name-line`.
   - Curaduría integral de `Lab` (traducción coherente al español `<html lang="es">`, retiro/corrección de enlaces `#demo-*` rotos y portadas propias en vez de foto de retrato) + suite **Playwright**.
4. **Sprint Final — SEO Técnico & GEO (`llms.txt`)**: Configurar `site` definitivo, `@astrojs/sitemap`, `SEOHead.astro` (canonical, OpenGraph absoluto, Twitter Cards, JSON-LD) y `public/robots.txt` + `public/llms.txt`.

---

## ✅ Completado en Esta Sesión

1. **Bloque Hero en blanco de 90dvh**: Desacoplado el hero para proceder por bloques independientes de usabilidad.
2. **Aberración óptica con cota del 10%**: `smoothstep(0.10, 0.0, vUv.x)` a la izquierda y `smoothstep(0.90, 1.0, vUv.x)` a la derecha con intensidad base `0.60`.
3. **Efecto de lente integral**: Filtros SVG en el DOM y tiras periféricas de `10vw` que refractan elementos y tipografía en los bordes.
4. **Textura de Grano 35mm auténtica**: Elevada la opacidad a 20% y añadido TV Noise orgánico tomado del código fuente de *WebGLProgressiveBlur*.
5. **Curaduría Unsplash**: Fotografías editoriales de arquitectura cyberpunk, escultura 3D de Milad Fakurian y retrato con lente de cámara.

---

## 🏗️ Estado del Sistema y Componentes Clave

| Módulo / Ruta | Estado | Notas |
| :--- | :--- | :--- |
| **Laboratorio V2 (`/homev2`)** | 🟢 Bloques Modulares | Hero 90dvh + Lente 10% (0.6 default) + Grano 35mm (20% default) + Unsplash. |
| **Home V1 (`/`) & Rutas Base** | 🟢 Estable | Intacto y funcional; 0 interferencias con `/homev2`. |
| **Código & Estilos (`src/`)** | 🟢 100% Modular | Todos los módulos bajo `< 200` líneas; 0 warnings en build. |
| **Fuentes & Media** | 🟢 Optimizado CWV | Gloock WOFF2 y media de Unsplash servidas localmente sin peticiones externas. |
| **SEO Técnico & GEO** | ⏸️ Al final | Diferido al cierre del roadmap por indicación expresa del usuario. |

---

## 🔧 Deuda Técnica Activa

| ID | Descripción | Ubicación | Impacto / Riesgo | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| `[DEBT-006]` | Brecha Awwwards/A11y: `[data-magnetic]` sin LERP, falta Lenis/`gsap.matchMedia()`, `100vh` → `100dvh`, `375px` `.name-line`, 0 `prefers-reduced-motion`, 0 `:focus-visible`, ARIA en tabs/acordeón/split-text. | `src/styles/`, `src/motion/`, `src/components/home/` | Atacar ahora en **Sprint Experiencia & QA**. | Alta |
| `[DEBT-007]` | Contenido `lab/` en inglés dentro de `<html lang="es">`, links `#demo-*` rotos y retrato como cover de experimentos + falta suite Playwright. | `src/content/lab/*.json`, `src/pages/lab/[slug].astro` | Atacar ahora en **Sprint Experiencia & QA**. | Alta |
| `[DEBT-005]` | Infraestructura SEO & GEO: `site`, `@astrojs/sitemap`, `SEOHead.astro`, canonical, OG absoluto, JSON-LD, `robots.txt` y `llms.txt`. | `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `public/` | **Pospuesto al final del proyecto**. | Baja (Diferido) |

---

## 📋 Próximas Acciones

1. Iniciar **Sprint Experiencia Awwwards, Accesibilidad & Visual QA**:
   - **Bloque A (Motion 60 FPS & A11y)**: Magnetismo LERP (`[data-magnetic]`), Lenis + `gsap.matchMedia()` / `gsap.context()`, `prefers-reduced-motion`, `:focus-visible`, ARIA completo, `100dvh`, `@media (hover: hover)` y ajuste responsive `375px`.
   - **Bloque B (Curaduría `Lab` & Playwright)**: Español unificado en `src/content/lab/*.json`, saneamiento de enlaces `#demo-*` y portadas de `Lab`, y smoke tests automatizados con Playwright (`375px`, `768px`, `1440px`).
2. Cerrar al final con el **Sprint de SEO Técnico & GEO (`llms.txt`)**.
