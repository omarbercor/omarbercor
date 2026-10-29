/**
 * site-optics.config.ts
 * Configuración global del sistema óptico del sitio (Single Source of Truth).
 * Permite gobernar desde un único punto:
 * - Grano analógico continuo (Film Grain 35mm)
 * - Óptica de lente y aberración cromática en imágenes WebGL
 * - Inercia, estela y desfase óptico dinámico al hacer scroll
 */

export interface OpticsConfig {
  grain: {
    enabled: boolean;
    opacity: number;        // Opacidad del canvas (ej: 0.06 = 6%)
    fps: number;            // Tasa de refresco cinematográfico (24 FPS)
    patternSize: number;    // Tamaño del buffer de ruido en memoria (256px)
    noiseAlpha: number;     // Densidad del grano en buffer (0-255)
  };
  lens: {
    enabled: boolean;
    strength: number;       // Intensidad estática del split cromático (ej: 0.25)
    edgeWidth: number;      // % de acotado periférico en cada flanco (ej: 0.10 = 10%)
    grainMix: number;       // Nivel de TV noise mezclado en el shader (ej: 0.06 = 6%)
    trail: {
      enabled: boolean;     // Desfase/estela dinámica reactiva al scroll
      distance: number;     // Magnitud/distancia máxima de la estela (ej: 0.45)
      speed: number;        // Velocidad de interpolación/fricción LERP (ej: 0.08)
    };
  };
}

export const SITE_OPTICS_CONFIG: OpticsConfig = {
  grain: {
    enabled: true,
    opacity: 0.06,
    fps: 24,
    patternSize: 256,
    noiseAlpha: 180,
  },
  lens: {
    enabled: true,
    strength: 0.25,
    edgeWidth: 0.10,
    grainMix: 0.06,
    trail: {
      enabled: true,
      distance: 0.45,
      speed: 0.08,
    },
  },
};
