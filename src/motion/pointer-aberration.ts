import * as THREE from 'three';
import { SITE_OPTICS_CONFIG } from '@/config/site-optics';

export interface PointerAberrationOptions {
  radius?: number;
  strength?: number;
  smoothing?: number;
  enabled?: boolean;
  targetElement?: HTMLElement | Window;
}

/**
 * Fragment GLSL snippet for Pointer-Driven Chromatic Aberration (Thibaut Lefrançois style).
 * Splits RGB channels radially from the mouse position within a defined radius.
 */
export const POINTER_ABERRATION_GLSL = /* glsl */ `
  vec3 applyPointerAberration(sampler2D tex, vec2 uv, vec2 screenCoord, vec2 resolution, vec2 mouse, float radius, float strength, float enabled) {
    if (enabled <= 0.0 || strength <= 0.0) {
      return texture2D(tex, uv).rgb;
    }
    vec2 screenUv = screenCoord / resolution;
    float aspect = resolution.x / resolution.y;
    vec2 diff = screenUv - mouse;
    diff.x *= aspect;

    float dist = length(diff);
    float mask = smoothstep(radius, 0.0, dist);
    vec2 dir = dist > 0.001 ? normalize(diff) : vec2(0.0);

    vec2 uvOffset = dir * strength * mask;
    uvOffset.x /= aspect;

    float r = texture2D(tex, uv + uvOffset).r;
    float g = texture2D(tex, uv).g;
    float b = texture2D(tex, uv - uvOffset).b;

    return vec3(r, g, b);
  }
`;

export function createPointerAberrationUniforms(overrides?: Partial<typeof SITE_OPTICS_CONFIG.pointerAberration>) {
  const cfg = { ...SITE_OPTICS_CONFIG.pointerAberration, ...overrides };
  return {
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uPointerRadius: { value: cfg.radius },
    uPointerStrength: { value: cfg.strength },
    uPointerEnabled: { value: cfg.enabled ? 1.0 : 0.0 },
  };
}

export class PointerAberrationController {
  private materials = new Set<THREE.ShaderMaterial>();
  private targetMouse = new THREE.Vector2(0.5, 0.5);
  private currentMouse = new THREE.Vector2(0.5, 0.5);
  private smoothing: number;
  private radius: number;
  private strength: number;
  private enabled: boolean;
  private targetElement: HTMLElement | Window;

  constructor(options?: PointerAberrationOptions) {
    const config = { ...SITE_OPTICS_CONFIG.pointerAberration, ...options };
    this.smoothing = config.smoothing ?? 0.12;
    this.radius = config.radius;
    this.strength = config.strength;
    this.enabled = config.enabled;
    this.targetElement = options?.targetElement ?? window;

    this.bindEvents();
  }

  private handlePointerMove = (e: MouseEvent | TouchEvent) => {
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    this.targetMouse.x = clientX / window.innerWidth;
    this.targetMouse.y = 1.0 - (clientY / window.innerHeight);
  };

  private bindEvents() {
    this.targetElement.addEventListener('mousemove', this.handlePointerMove as EventListener, { passive: true });
    this.targetElement.addEventListener('touchmove', this.handlePointerMove as EventListener, { passive: true });
  }

  addMaterial(material: THREE.ShaderMaterial) {
    this.materials.add(material);
    this.syncMaterialUniforms(material);
  }

  removeMaterial(material: THREE.ShaderMaterial) {
    this.materials.delete(material);
  }

  setStrength(strength: number) {
    this.strength = strength;
    this.materials.forEach((m) => {
      if (m.uniforms.uPointerStrength) m.uniforms.uPointerStrength.value = strength;
    });
  }

  setRadius(radius: number) {
    this.radius = radius;
    this.materials.forEach((m) => {
      if (m.uniforms.uPointerRadius) m.uniforms.uPointerRadius.value = radius;
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.materials.forEach((m) => {
      if (m.uniforms.uPointerEnabled) m.uniforms.uPointerEnabled.value = enabled ? 1.0 : 0.0;
    });
  }

  private syncMaterialUniforms(m: THREE.ShaderMaterial) {
    if (m.uniforms.uPointerRadius) m.uniforms.uPointerRadius.value = this.radius;
    if (m.uniforms.uPointerStrength) m.uniforms.uPointerStrength.value = this.strength;
    if (m.uniforms.uPointerEnabled) m.uniforms.uPointerEnabled.value = this.enabled ? 1.0 : 0.0;
  }

  update(resWidth = window.innerWidth, resHeight = window.innerHeight) {
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * this.smoothing;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * this.smoothing;

    this.materials.forEach((mat) => {
      if (mat.uniforms.uMouse) mat.uniforms.uMouse.value.copy(this.currentMouse);
      if (mat.uniforms.uResolution) mat.uniforms.uResolution.value.set(resWidth, resHeight);
    });
  }

  destroy() {
    this.targetElement.removeEventListener('mousemove', this.handlePointerMove as EventListener);
    this.targetElement.removeEventListener('touchmove', this.handlePointerMove as EventListener);
    this.materials.clear();
  }
}
