// The arcs, drawn as one ribbon per arc in a single instanced call. Each is a quadratic curve
// from one end, through a point raised above the middle of the two, to the other end, walked
// along in steps and widened either side of the curve on the canvas rather than in space, so a
// ribbon is as wide seen edge on as seen face on. The parts of a ribbon behind the globe and
// inside its outline are thrown away a pixel at a time.
//
// The vertex shader and the fragment shader share their varyings, so they are written together

export const ARC_VERTEX_SHADER = `
const float GLOBE_R = 0.8;

attribute vec2 aPosition;
attribute vec3 aArcFrom;
attribute vec3 aArcTo;
attribute float aArcHeight;
attribute float aArcWidth;
attribute vec3 aArcColor;
attribute float aHasColor;

uniform float phi;
uniform float theta;
uniform vec2 uResolution;
uniform float scale;
uniform vec2 offset;
uniform float markerElevation;

varying vec3 vArcColor;
varying float vHasColor;
varying float vDepth;
varying float vRadialDist;

mat3 rotate(float theta, float phi) {
  float cx = cos(theta);
  float cy = cos(phi);
  float sx = sin(theta);
  float sy = sin(phi);
  return mat3(
    cy, sy * sx, -sy * cx,
    0.0, cx, sx,
    sy, cy * -sx, cy * cx
  );
}

vec3 bezierPoint(vec3 p0, vec3 p1, vec3 p2, float t) {
  float u = 1.0 - t;
  return u * u * p0 + 2.0 * u * t * p1 + t * t * p2;
}

vec3 bezierTangent(vec3 p0, vec3 p1, vec3 p2, float t) {
  float u = 1.0 - t;
  return 2.0 * u * (p1 - p0) + 2.0 * t * (p2 - p1);
}

void main() {
  mat3 rot = rotate(theta, phi);

  float endpointR = GLOBE_R + markerElevation;
  vec3 from = aArcFrom * endpointR;
  vec3 to = aArcTo * endpointR;

  vec3 midSum = aArcFrom + aArcTo;
  float midLen = length(midSum);
  vec3 midDir = midLen > 0.001 ? midSum / midLen : vec3(0.0, 1.0, 0.0);
  vec3 mid = midDir * (GLOBE_R + aArcHeight);

  float t = aPosition.x;
  vec3 arcPoint = bezierPoint(from, mid, to, t);

  vec3 rotatedPoint = rot * arcPoint;

  vec3 rawTangent = bezierTangent(from, mid, to, t);
  vec3 rotatedTangent = rot * rawTangent;

  vec2 screenTangent = rotatedTangent.xy;
  float screenTangentLen = length(screenTangent);

  vec2 screenPerp = screenTangentLen > 0.001
    ? vec2(-screenTangent.y, screenTangent.x) / screenTangentLen
    : vec2(1.0, 0.0);

  float aspect = uResolution.x / uResolution.y;
  vec2 baseScreenPos = rotatedPoint.xy * vec2(1.0 / aspect, 1.0) * scale
    + offset * vec2(1.0, -1.0) * scale / uResolution;

  vec2 screenPos = baseScreenPos + screenPerp * aArcWidth * aPosition.y * scale;

  gl_Position = vec4(screenPos, 0.0, 1.0);

  vArcColor = aArcColor;
  vHasColor = aHasColor;
  vDepth = rotatedPoint.z;
  vRadialDist = length(rotatedPoint.xy);
}
`;

export const ARC_FRAGMENT_SHADER = `
precision highp float;

const float GLOBE_R = 0.8;

uniform vec3 arcColor;

varying vec3 vArcColor;
varying float vHasColor;
varying float vDepth;
varying float vRadialDist;

void main() {
  if (vDepth < 0.0 && vRadialDist < GLOBE_R) discard;

  vec3 col = vHasColor > 0.5 ? vArcColor : arcColor;
  gl_FragColor = vec4(col, 1.0);
}
`;
