---
order: 12
title: "WebGL sin romper el navegador"
subtitle: "Cómo integrar escenas de Three.js y animaciones con GSAP en portales corporativos sin sacrificar los Core Web Vitals"
excerpt: "Optimización de memoria en WebGL, descarte de geometrías, renderizado bajo demanda (render on demand) y trucos para no penalizar el Interaction to Next Paint (INP)."
date: "Noviembre 2025"
readTime: "9 min lectura"
category: "Frontend & Diseño"
tags: ["WebGL","Three.js","GSAP","Core Web Vitals","Rendimiento"]
coverImage: "/images/writing/photo-1618005182384-a83a8bd57fbe.jpg"
---

Integrar gráficos 3D en la web suele ser un arma de doble filo: por un lado genera una primera impresión impactante; por el otro, con frecuencia satura la GPU móvil, bloquea el hilo principal de JavaScript y hunde las métricas de rendimiento en Google Search Console.

Sin embargo, crear experiencias ricas con **Three.js** y **GSAP** sin destruir los Core Web Vitals es perfectamente posible si se aplican reglas de ingeniería estrictas.

### 1. Deshazte del loop infinito incondicional
El error más común en Three.js es ejecutar `requestAnimationFrame` a 60 FPS de forma ininterrumpida, incluso cuando la escena está completamente estática o fuera de la vista del usuario.
- **Render on demand:** Renderiza frames únicamente cuando el usuario interactúa, mueve el scroll o una animación de GSAP actualiza activamente una propiedad.
- **IntersectionObserver:** Detén por completo el ciclo de la escena cuando el canvas no está visible en el viewport.

### 2. Gestión higiénica de recursos en la GPU
La GPU no tiene un recolector de basura automático como la memoria RAM del navegador. Si cambias de vista sin liberar los recursos:
```javascript
geometry.dispose();
material.dispose();
texture.dispose();
renderer.dispose();
```
Cada geometría, textura y material no liberado genera fugas de memoria (*memory leaks*) que eventualmente provocan que el navegador móvil cierre la pestaña por consumo excesivo.

### 3. Carga diferida y prioridad del LCP
El canvas 3D nunca debe competir con el Largest Contentful Paint (LCP) de la página. El titular tipográfico y la estructura semántica deben pintarse en milisegundos; los шейderes y mallas 3D se inicializan en segundo plano de manera progresiva.
