---
order: 18
title: "Rich Media sin fricción"
subtitle: "Cómo entregar piezas interactivas complejas cumpliendo con restricciones absurdas de peso y compatibilidad móvil"
excerpt: "Micro-animaciones a 60 FPS con GSAP y Canvas, optimización extrema de assets vectoriales y cumplimiento estricto de especificaciones IAB para redes de anuncios globales."
date: "Mayo 2025"
readTime: "7 min lectura"
category: "Creatividad & Publicidad"
tags: ["Rich Media","GSAP","Animación Web","Optimización","HTML5"]
coverImage: "/images/writing/photo-1492691527719-9d1e07e534b4.jpg"
---

Pocos entornos exigen un nivel de optimización tan despiadado como el desarrollo de formatos Rich Media y piezas interactivas para redes publicitarias de alto calibre. En ese ecosistema, los límites son implacables: archivos finales con topes de 150KB a 300KB en la carga inicial, cero dependencias pesadas de terceros y garantía de 60 cuadros por segundo en cualquier teléfono inteligente.

### El arte de la economía de bytes
Para lograr impacto cinematográfico con un presupuesto de peso mínimo:
- **GSAP en su versión modular más compacta:** Emplear exclusivamente los núcleos de tweening sin plugins prescindibles.
- **Vectores SVG ultra-optimizados:** Limpieza manual de trazados, eliminación de decimales superfluos y reutilización de símbolos compartidos.
- **Sprite sheets y micro-texturas:** Agrupar múltiples estados gráficos en un único lienzo para minimizar las peticiones de red y la sobrecarga de decodificación.

### Carga bifásica (Polite Loading)
La técnica reina consiste en pintar inmediatamente un estado visual nítido y ligero que captura la atención del usuario mientras el navegador completa la carga de la página anfitriona; únicamente tras ese evento se solicitan los módulos interactivos pesados en segundo plano.
