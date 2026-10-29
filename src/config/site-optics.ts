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
  pointerAberration: {
    enabled: boolean;       // Aberración cromática controlada por puntero (estilo Thibaut Lefrançois)
    radius: number;         // Radio de alcance esférico alrededor del cursor (0.1 - 0.6)
    minStrength: number;    // Intensidad mínima cuando el cursor está estático (ej: 0.0 o sutil 0.005)
    maxStrength: number;    // Intensidad máxima alcanzable con movimiento rápido (ej: 0.06 - 0.12)
    velocitySensitivity: number; // Sensibilidad de reacción a la velocidad del ratón (ej: 1.5)
    velocityDecay: number;  // Fricción / amortiguación LERP para retornar a minStrength (ej: 0.08)
    smoothing: number;      // Factor de amortiguación LERP del puntero (0.05 - 0.25)
  };
}

export const SITE_OPTICS_CONFIG: OpticsConfig = {
  grain: {
    enabled: true,
    opacity: 0.11,
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
  pointerAberration: {
    enabled: true,
    radius: 0.32,
    minStrength: 0.0,       // 0% cuando está estático
    maxStrength: 0.075,     // 7.5% máximo a toda velocidad
    velocitySensitivity: 1.8,
    velocityDecay: 0.07,
    smoothing: 0.12,
  },
};
