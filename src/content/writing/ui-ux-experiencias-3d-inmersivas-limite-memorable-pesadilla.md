---
order: 13
title: "UI/UX en experiencias 3D inmersivas"
subtitle: "Dónde está la línea entre un sitio web interactivo memorable y una pesadilla de rendimiento en dispositivos móviles"
excerpt: "Criterios de usabilidad espacial, degradación elegante para dispositivos de gama baja y por qué la interactividad debe enriquecer la navegación, no obstaculizarla."
date: "Octubre 2025"
readTime: "8 min lectura"
category: "Frontend & Diseño"
tags: ["UI/UX","3D Web","Mobile First","Accesibilidad","Experiencias Inmersivas"]
coverImage: "/images/writing/photo-1633356122544-f134324a6cee.jpg"
---

Los sitios web premiados en portales de diseño interactivo frecuentemente sufren del mismo mal: lucen asombrosos en una computadora de escritorio con procesador de última generación y conexión de fibra óptica, pero se transforman en una experiencia frustrante e inoperable en un teléfono móvil con conexión irregular.

La verdadera innovación interactiva no consiste en presumir cuántos polígonos puedes dibujar en pantalla, sino en saber subordinar el impacto visual al objetivo del usuario.

### El principio de degradación elegante
Si un usuario entra a tu plataforma desde un dispositivo móvil:
- ¿Es indispensable que controle una cámara orbital con dos dedos, o es mucho más intuitivo que la pieza 3D responda al scroll natural o al giroscopio?
- Si el hardware detecta baja tasa de frames, el sistema debe reducir automáticamente la resolución del framebuffer (`setPixelRatio(1)`), simplificar shaders o incluso sustituir la escena por una imagen o video optimizado.

### La interactividad debe guiar, no secuestrar
El *scroll-jacking* agresivo y los controles 3D no estándar rompen los modelos mentales de navegación que los usuarios han desarrollado durante décadas. La experiencia 3D debe funcionar como una escenografía viva que reacciona con sutileza, dejando que los enlaces, la tipografía y los elementos de llamada a la acción (`CTA`) mantengan su accesibilidad, contraste y rapidez de respuesta intactos.
