export const ROLLING_GALLERY_SHADERS = {
  vertexShader: /* glsl */ `
    uniform vec2 uSize;
    uniform float uRoll;
    uniform float uAngle;
    uniform float uRadius;

    varying vec2 vUv;
    varying float vLight;

    void main() {
      vec3 pos = position * vec3(uSize, 1.0);
      vec3 facing = vec3(0.0, 0.0, 1.0);

      vec2 dir = vec2(sin(uAngle), -cos(uAngle)) * sign(uRoll);
      float extent = dot(abs(dir), uSize * 0.5);
      float edge = mix(extent, -extent, abs(uRoll));
      float dist = dot(pos.xy, dir) - edge;

      if (dist > 0.0) {
        float angle = dist / uRadius;
        float radius = uRadius - angle * 1.5;
        pos.xy += dir * (sin(angle) * radius - dist);
        pos.z = uRadius - cos(angle) * radius;
        facing = vec3(-dir * sin(angle), cos(angle));
      }

      vUv = uv;
      vLight = facing.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D uTexture;
    uniform vec2 uSize;
    uniform vec2 uImageSize;

    varying vec2 vUv;
    varying float vLight;

    void main() {
      vec2 ratio = vec2(
        min((uSize.x / uSize.y) / (uImageSize.x / uImageSize.y), 1.0),
        min((uSize.y / uSize.x) / (uImageSize.y / uImageSize.x), 1.0)
      );
      vec3 color = texture2D(uTexture, (vUv - 0.5) * ratio + 0.5).rgb;

      if (gl_FrontFacing) {
        color *= mix(0.35, 1.0, max(vLight, 0.0));
      } else {
        float gray = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(color, vec3(gray), 0.45) * mix(0.25, 0.65, max(-vLight, 0.0));
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

