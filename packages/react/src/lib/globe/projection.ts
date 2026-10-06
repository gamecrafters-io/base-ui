import type { GlobeArc, GlobeLocation, GlobeProjection } from "./types";

// A point in the globe's own space, as x, y and z
export type GlobePosition = [x: number, y: number, z: number];

// How the globe is being looked at, which is what says where a place on it falls on the canvas
export type GlobeView = {
    phi: number;
    theta: number;
    // The canvas's own size, in device pixels rather than CSS pixels
    width: number;
    height: number;
    devicePixelRatio: number;
    scale: number;
    offset: [x: number, y: number];
    markerElevation: number;
    arcHeight: number;
};

// How far the globe reaches from the middle of the canvas, in a space where the shorter side
// runs from minus one to one. The room left over around it is what the glow is drawn in
export const GLOBE_RADIUS = 0.8;

// Two ends of an arc closer than this to opposite one another have no middle between them
const ARC_MIDPOINT_EPSILON = 0.001;

// Where a place stands on a sphere of radius one, with the north pole up the y axis. Longitude
// is measured from the far side of the globe, so that the Americas face the viewer before it is
// turned and east runs to the right the way it reads on a map
export function latLonTo3D([latitude, longitude]: GlobeLocation): GlobePosition {
    const latitudeRadians = (latitude * Math.PI) / 180;
    const longitudeRadians = (longitude * Math.PI) / 180 - Math.PI;
    const cosLatitude = Math.cos(latitudeRadians);

    return [
        -cosLatitude * Math.cos(longitudeRadians),
        Math.sin(latitudeRadians),
        cosLatitude * Math.sin(longitudeRadians),
    ];
}

// Where a point in the globe's space falls on the canvas once the globe has been turned and
// tilted. It is the same turn the shaders apply to the markers and the arcs, written out for the
// anchors: the rotation matrix times the point, taking the globe's space to the viewer's
export function applyRotation([x, y, z]: GlobePosition, view: GlobeView): GlobeProjection {
    const cosTheta = Math.cos(view.theta);
    const cosPhi = Math.cos(view.phi);
    const sinTheta = Math.sin(view.theta);
    const sinPhi = Math.sin(view.phi);
    const aspect = view.width / view.height;

    const rotatedX = cosPhi * x + sinPhi * z;
    const rotatedY = sinPhi * sinTheta * x + cosTheta * y - cosPhi * sinTheta * z;
    const rotatedZ = -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z;

    const { scale, devicePixelRatio } = view;
    const [offsetX, offsetY] = view.offset;

    // The offset is given in CSS pixels, and is read against the canvas's own pixels
    const shiftX = (offsetX * scale * devicePixelRatio) / view.width;
    const shiftY = (offsetY * scale * devicePixelRatio) / view.height;

    return {
        x: ((rotatedX / aspect) * scale + shiftX + 1) / 2,
        y: (-rotatedY * scale + shiftY + 1) / 2,
        // In front of the globe, or outside its outline: a point behind the globe but off to the
        // side of it is still there to be seen
        visible:
            rotatedZ >= 0 ||
            rotatedX * rotatedX + rotatedY * rotatedY >= GLOBE_RADIUS * GLOBE_RADIUS,
    };
}

// Where a place stands on the canvas, taken from where its marker is drawn, which stands off the
// surface by the marker elevation
export function project(location: GlobeLocation, view: GlobeView): GlobeProjection {
    const [x, y, z] = latLonTo3D(location);
    const radius = GLOBE_RADIUS + view.markerElevation;

    return applyRotation([x * radius, y * radius, z * radius], view);
}

// Where the top of an arc stands on the canvas. An arc is a quadratic curve through a point
// raised above the middle of its two ends, and its top is that curve half way along. Two ends
// opposite one another have no middle between them, so an arc between them has no top to find
export function projectArcMidpoint(arc: GlobeArc, view: GlobeView): GlobeProjection | null {
    const from = latLonTo3D(arc.from);
    const to = latLonTo3D(arc.to);
    const sum: GlobePosition = [from[0] + to[0], from[1] + to[1], from[2] + to[2]];
    const length = Math.hypot(...sum);

    if (length < ARC_MIDPOINT_EPSILON) return null;

    // The curve half way along is a quarter of each end and half of the raised point, and every
    // one of the three lies along the sum of the two ends
    const endRadius = GLOBE_RADIUS + view.markerElevation;
    const peakRadius = GLOBE_RADIUS + view.arcHeight + view.markerElevation;
    const factor = 0.25 * endRadius + (0.5 * peakRadius) / length;

    return applyRotation([sum[0] * factor, sum[1] * factor, sum[2] * factor], view);
}
