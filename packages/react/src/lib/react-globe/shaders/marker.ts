// The markers, drawn as one quad per marker in a single instanced call. The quad is put where its
// marker stands once the globe has been turned, and a marker that has gone round the back is
// thrown off the canvas rather than drawn through the globe. The quad is then trimmed to a disc
// a pixel at a time.
//
// The vertex shader and the fragment shader share their varyings, so they are written together

export const MARKER_VERTEX_SHADER = `
attribute vec2 aPosition;
attribute vec3 aMarkerPos;
attribute float aMarkerSize;
attribute vec3 aMarkerColor;
attribute float aHasColor;

uniform float phi;
uniform float theta;
uniform vec2 uResolution;
uniform float scale;
uniform vec2 offset;
uniform float markerElevation;

varying vec2 vUV;
varying vec3 vMarkerColor;
varying float vHasColor;

void main() {
  float cx = cos(theta), sx = sin(theta);
  float cy = cos(phi), sy = sin(phi);
  vec3 p = aMarkerPos * (0.8 + markerElevation);
  vec3 rp = vec3(
    cy * p.x + sy * p.z,
    sy * sx * p.x + cx * p.y - cy * sx * p.z,
    -sy * cx * p.x + sx * p.y + cy * cx * p.z
  );

  if (rp.z < 0.0 && length(rp.xy) < 0.8) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    return;
  }

  float ia = uResolution.y / uResolution.x;
  vec2 pos = (rp.xy + aPosition * aMarkerSize * 2.0) * vec2(ia, 1.0) * scale
    + offset * vec2(1.0, -1.0) * scale / uResolution;
  gl_Position = vec4(pos, 0.0, 1.0);

  vUV = aPosition;
  vMarkerColor = aMarkerColor;
  vHasColor = aHasColor;
}
`;

export const MARKER_FRAGMENT_SHADER = `
precision highp float;

uniform vec3 markerColor;

varying vec2 vUV;
varying vec3 vMarkerColor;
varying float vHasColor;

void main() {
  if (length(vUV) > 0.25) discard;
  vec3 col = vHasColor > 0.5 ? vMarkerColor : markerColor;
  gl_FragColor = vec4(col, 1.0);
}
`;
