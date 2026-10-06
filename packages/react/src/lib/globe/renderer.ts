import { createAnchorManager } from "./anchor";
import { latLonTo3D, project, projectArcMidpoint } from "./projection";
import { ARC_FRAGMENT_SHADER, ARC_VERTEX_SHADER } from "./shaders/arc";
import { GLOBE_FRAGMENT_SHADER, GLOBE_VERTEX_SHADER } from "./shaders/globe";
import { MARKER_FRAGMENT_SHADER, MARKER_VERTEX_SHADER } from "./shaders/marker";
import { GLOBE_TEXTURE } from "./texture";
import { createProgram, getAttribLocations, getUniformLocations } from "./webgl";
import type { GlobeView } from "./projection";
import type { GlobeInstance, GlobeOptions, GlobeState } from "./types";

// What a globe is drawn with where it was told nothing. The land is dotted lightly on a white
// globe with a white glow, which reads as a globe on a light page; a dark page turns `dark` up
// and the colours down
export const DEFAULT_GLOBE_STATE: Required<Omit<GlobeState, "width" | "height">> = {
    phi: 0,
    theta: 0,
    markers: [],
    arcs: [],
    mapSamples: 10000,
    mapBrightness: 1,
    mapBaseBrightness: 0,
    baseColor: [1, 1, 1],
    markerColor: [1, 0.5, 0],
    glowColor: [1, 1, 1],
    arcColor: [0.3, 0.6, 1],
    arcWidth: 1,
    arcHeight: 0.2,
    markerElevation: 0.05,
    diffuse: 1,
    dark: 0,
    opacity: 1,
    offset: [0, 0],
    scale: 1,
};

// Everything a standing globe can be told, named once so that whatever watches for changes to
// them can watch each without naming them all again
export const GLOBE_STATE_KEYS = Object.keys(DEFAULT_GLOBE_STATE) as ReadonlyArray<
    keyof typeof DEFAULT_GLOBE_STATE
>;

// What the canvas is asked for. The globe is drawn over whatever is behind it, and every pass is
// drawn in order rather than sorted by depth, so neither a depth buffer nor a stencil is wanted
const DEFAULT_CONTEXT_ATTRIBUTES: WebGLContextAttributes = {
    alpha: true,
    stencil: false,
    antialias: true,
    depth: false,
    preserveDrawingBuffer: false,
};

// Two triangles covering the canvas, which the globe is drawn across and each marker is drawn on
const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
const QUAD_VERTEX_COUNT = 6;

// How many steps an arc is walked along in, and the vertices that takes: a pair either side of
// the curve at every step, drawn as one strip
const ARC_SEGMENTS = 32;
const ARC_VERTEX_COUNT = (ARC_SEGMENTS + 1) * 2;

// The width an arc is asked for is written against the globe's radius, where the shader widens
// a ribbon in clip space; this is what one unit of the one comes to in the other
const ARC_WIDTH_SCALE = 0.005;

// What each marker and each arc is handed to the shaders as, a float at a time: a marker is its
// position, its size, its colour and whether it has one; an arc is both ends, its height, its
// width, its colour and whether it has one
const MARKER_FLOATS = 8;
const ARC_FLOATS = 12;
const BYTES_PER_FLOAT = Float32Array.BYTES_PER_ELEMENT;

// The names the shaders read their inputs under
const GLOBE_UNIFORMS = [
    "uResolution",
    "rotation",
    "dots",
    "scale",
    "offset",
    "baseColor",
    "glowColor",
    "renderParams",
    "mapBaseBrightness",
    "uTexture",
] as const;

const MARKER_UNIFORMS = [
    "phi",
    "theta",
    "uResolution",
    "scale",
    "offset",
    "markerColor",
    "markerElevation",
] as const;

const MARKER_ATTRIBUTES = [
    "aPosition",
    "aMarkerPos",
    "aMarkerSize",
    "aMarkerColor",
    "aHasColor",
] as const;

const ARC_UNIFORMS = [
    "phi",
    "theta",
    "uResolution",
    "scale",
    "offset",
    "arcColor",
    "markerElevation",
] as const;

const ARC_ATTRIBUTES = [
    "aPosition",
    "aArcFrom",
    "aArcTo",
    "aArcHeight",
    "aArcWidth",
    "aArcColor",
    "aHasColor",
] as const;

// A globe that could not be built, which takes whatever it is told and draws nothing. A page
// without WebGL is left with an empty canvas rather than an error
const createInertGlobe = (): GlobeInstance => ({
    update: () => {},
    destroy: () => {},
});

// Whatever the caller named is taken, and whatever was left out keeps what it had, so a globe
// can be told one thing at a time
function assignDefined<T extends object>(target: T, source: Partial<T>) {
    for (const key of Object.keys(source) as Array<keyof T>) {
        const value = source[key];

        if (value !== undefined) {
            target[key] = value as T[keyof T];
        }
    }
}

// A globe drawn onto a canvas, and what it is told from then on.
//
// It is drawn once for every state it is told rather than on a clock of its own, so a still globe
// costs nothing after it is drawn and a turning one is drawn as often as the caller says. The
// anchors for the named markers and arcs are put in the canvas's parent, which is therefore the
// element to position anything held over the globe against
export function createGlobe(canvas: HTMLCanvasElement, options: GlobeOptions): GlobeInstance {
    const { width, height, devicePixelRatio = 1, context, ...initial } = options;
    const contextAttributes = { ...DEFAULT_CONTEXT_ATTRIBUTES, ...context };

    // WebGL 2 draws the markers and the arcs in one call each on its own; WebGL 1 does the same
    // through an extension that every implementation still around carries
    const gl2 = canvas.getContext("webgl2", contextAttributes);
    const gl: WebGLRenderingContext | null = gl2 ?? canvas.getContext("webgl", contextAttributes);

    if (!gl) return createInertGlobe();

    const instancing = gl2 ? null : gl.getExtension("ANGLE_instanced_arrays");

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    const state = { ...DEFAULT_GLOBE_STATE };
    assignDefined(state, initial);

    const globeProgram = createProgram(gl, GLOBE_VERTEX_SHADER, GLOBE_FRAGMENT_SHADER);
    const markerProgram = createProgram(gl, MARKER_VERTEX_SHADER, MARKER_FRAGMENT_SHADER);
    const arcProgram = createProgram(gl, ARC_VERTEX_SHADER, ARC_FRAGMENT_SHADER);

    // The globe is the one pass there is no drawing without; markers and arcs that could not be
    // compiled are left off a globe that could
    if (!globeProgram) {
        gl.deleteProgram(markerProgram);
        gl.deleteProgram(arcProgram);
        return createInertGlobe();
    }

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    // Each step along an arc, as how far along it is and which side of the curve the vertex sits
    const arcVertices: number[] = [];

    for (let step = 0; step <= ARC_SEGMENTS; step++) {
        const t = step / ARC_SEGMENTS;
        arcVertices.push(t, -1, t, 1);
    }

    const arcSegmentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arcSegmentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arcVertices), gl.STATIC_DRAW);

    const markerInstanceBuffer = gl.createBuffer();
    const arcInstanceBuffer = gl.createBuffer();

    const globeUniforms = getUniformLocations(gl, globeProgram, GLOBE_UNIFORMS);
    const globePositionAttribute = gl.getAttribLocation(globeProgram, "aPosition");

    const markerUniforms = markerProgram
        ? getUniformLocations(gl, markerProgram, MARKER_UNIFORMS)
        : null;
    const markerAttributes = markerProgram
        ? getAttribLocations(gl, markerProgram, MARKER_ATTRIBUTES)
        : null;

    const arcUniforms = arcProgram ? getUniformLocations(gl, arcProgram, ARC_UNIFORMS) : null;
    const arcAttributes = arcProgram ? getAttribLocations(gl, arcProgram, ARC_ATTRIBUTES) : null;

    // The land map stands in as a single black pixel until the picture has been decoded, so the
    // globe is drawn straight away, as sea, and drawn again with the land as soon as it arrives
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGB,
        1,
        1,
        0,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const anchors = createAnchorManager(canvas.parentElement);

    let destroyed = false;

    // How the globe is being looked at right now, for the anchors to be placed by
    const getView = (): GlobeView => ({
        phi: state.phi,
        theta: state.theta,
        width: canvas.width,
        height: canvas.height,
        devicePixelRatio,
        scale: state.scale,
        offset: state.offset,
        markerElevation: state.markerElevation,
        arcHeight: state.arcHeight,
    });

    const uploadMarkers = () => {
        const data = new Float32Array(state.markers.length * MARKER_FLOATS);

        state.markers.forEach((marker, index) => {
            data.set(
                [
                    ...latLonTo3D(marker.location),
                    marker.size,
                    ...(marker.color ?? [0, 0, 0]),
                    marker.color ? 1 : 0,
                ],
                index * MARKER_FLOATS,
            );
        });

        gl.bindBuffer(gl.ARRAY_BUFFER, markerInstanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    };

    // The height and the width an arc is drawn at travel with the arc rather than as uniforms,
    // so the arcs are uploaded again whenever either changes and not only when the arcs do
    const uploadArcs = () => {
        const data = new Float32Array(state.arcs.length * ARC_FLOATS);

        state.arcs.forEach((arc, index) => {
            data.set(
                [
                    ...latLonTo3D(arc.from),
                    ...latLonTo3D(arc.to),
                    state.arcHeight + state.markerElevation,
                    state.arcWidth * ARC_WIDTH_SCALE,
                    ...(arc.color ?? [0, 0, 0]),
                    arc.color ? 1 : 0,
                ],
                index * ARC_FLOATS,
            );
        });

        gl.bindBuffer(gl.ARRAY_BUFFER, arcInstanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    };

    // Whether an attribute is read once per vertex, or once per marker or arc drawn
    const setDivisor = (location: number, divisor: number) => {
        if (gl2) {
            gl2.vertexAttribDivisor(location, divisor);
        } else if (instancing) {
            instancing.vertexAttribDivisorANGLE(location, divisor);
        }
    };

    // An attribute read once per vertex. The divisor is put back to nought each time, since the
    // same location may have been read per instance by whichever pass was drawn before this one
    const setupVertexAttribute = (location: number, size: number) => {
        if (location < 0) return;

        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
        setDivisor(location, 0);
    };

    // An attribute read once per instance, from the buffer bound when it is set up
    const setupInstancedAttribute = (
        location: number,
        size: number,
        stride: number,
        offset: number,
    ) => {
        if (location < 0) return;

        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
        setDivisor(location, 1);
    };

    // Without instancing of any kind, the vertices are drawn once per instance instead, which is
    // slow and reads every instance's attributes as the first's, but draws something
    const drawInstanced = (mode: GLenum, count: number, instances: number) => {
        if (gl2) {
            gl2.drawArraysInstanced(mode, 0, count, instances);
        } else if (instancing) {
            instancing.drawArraysInstancedANGLE(mode, 0, count, instances);
        } else {
            for (let instance = 0; instance < instances; instance++) {
                gl.drawArrays(mode, 0, count);
            }
        }
    };

    const render = () => {
        // The anchors are moved on the same frame the globe is drawn, so an element held over a
        // marker is never a frame behind it
        const view = getView();

        anchors.updateMarkers(state.markers, (location) => project(location, view));
        anchors.updateArcs(state.arcs, (arc) => projectArcMidpoint(arc, view));
        anchors.applyVisibility();

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // The globe, drawn first so that everything standing on it is drawn over it
        gl.useProgram(globeProgram);

        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        setupVertexAttribute(globePositionAttribute, 2);

        gl.uniform2f(globeUniforms.uResolution, canvas.width, canvas.height);
        gl.uniform2f(globeUniforms.rotation, state.phi, state.theta);
        gl.uniform1f(globeUniforms.dots, state.mapSamples);
        gl.uniform1f(globeUniforms.scale, state.scale);
        gl.uniform2f(
            globeUniforms.offset,
            state.offset[0] * devicePixelRatio,
            state.offset[1] * devicePixelRatio,
        );
        gl.uniform3fv(globeUniforms.baseColor, state.baseColor);
        gl.uniform3fv(globeUniforms.glowColor, state.glowColor);
        gl.uniform4f(
            globeUniforms.renderParams,
            state.mapBrightness,
            state.diffuse,
            state.dark,
            state.opacity,
        );
        gl.uniform1f(globeUniforms.mapBaseBrightness, state.mapBaseBrightness);
        gl.uniform1i(globeUniforms.uTexture, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.drawArrays(gl.TRIANGLES, 0, QUAD_VERTEX_COUNT);

        // The arcs, drawn before the markers so that a marker stands over the arcs meeting at it
        if (arcProgram && arcUniforms && arcAttributes && state.arcs.length > 0) {
            gl.useProgram(arcProgram);

            gl.bindBuffer(gl.ARRAY_BUFFER, arcSegmentBuffer);
            setupVertexAttribute(arcAttributes.aPosition, 2);

            const stride = ARC_FLOATS * BYTES_PER_FLOAT;

            gl.bindBuffer(gl.ARRAY_BUFFER, arcInstanceBuffer);
            setupInstancedAttribute(arcAttributes.aArcFrom, 3, stride, 0 * BYTES_PER_FLOAT);
            setupInstancedAttribute(arcAttributes.aArcTo, 3, stride, 3 * BYTES_PER_FLOAT);
            setupInstancedAttribute(arcAttributes.aArcHeight, 1, stride, 6 * BYTES_PER_FLOAT);
            setupInstancedAttribute(arcAttributes.aArcWidth, 1, stride, 7 * BYTES_PER_FLOAT);
            setupInstancedAttribute(arcAttributes.aArcColor, 3, stride, 8 * BYTES_PER_FLOAT);
            setupInstancedAttribute(arcAttributes.aHasColor, 1, stride, 11 * BYTES_PER_FLOAT);

            gl.uniform1f(arcUniforms.phi, state.phi);
            gl.uniform1f(arcUniforms.theta, state.theta);
            gl.uniform2f(arcUniforms.uResolution, canvas.width, canvas.height);
            gl.uniform1f(arcUniforms.scale, state.scale);
            gl.uniform2f(
                arcUniforms.offset,
                state.offset[0] * devicePixelRatio,
                state.offset[1] * devicePixelRatio,
            );
            gl.uniform3fv(arcUniforms.arcColor, state.arcColor);
            gl.uniform1f(arcUniforms.markerElevation, state.markerElevation);

            drawInstanced(gl.TRIANGLE_STRIP, ARC_VERTEX_COUNT, state.arcs.length);
        }

        // The markers
        if (markerProgram && markerUniforms && markerAttributes && state.markers.length > 0) {
            gl.useProgram(markerProgram);

            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            setupVertexAttribute(markerAttributes.aPosition, 2);

            const stride = MARKER_FLOATS * BYTES_PER_FLOAT;

            gl.bindBuffer(gl.ARRAY_BUFFER, markerInstanceBuffer);
            setupInstancedAttribute(markerAttributes.aMarkerPos, 3, stride, 0 * BYTES_PER_FLOAT);
            setupInstancedAttribute(markerAttributes.aMarkerSize, 1, stride, 3 * BYTES_PER_FLOAT);
            setupInstancedAttribute(markerAttributes.aMarkerColor, 3, stride, 4 * BYTES_PER_FLOAT);
            setupInstancedAttribute(markerAttributes.aHasColor, 1, stride, 7 * BYTES_PER_FLOAT);

            gl.uniform1f(markerUniforms.phi, state.phi);
            gl.uniform1f(markerUniforms.theta, state.theta);
            gl.uniform2f(markerUniforms.uResolution, canvas.width, canvas.height);
            gl.uniform1f(markerUniforms.scale, state.scale);
            gl.uniform2f(
                markerUniforms.offset,
                state.offset[0] * devicePixelRatio,
                state.offset[1] * devicePixelRatio,
            );
            gl.uniform3fv(markerUniforms.markerColor, state.markerColor);
            gl.uniform1f(markerUniforms.markerElevation, state.markerElevation);

            drawInstanced(gl.TRIANGLES, QUAD_VERTEX_COUNT, state.markers.length);
        }
    };

    const update = (patch: GlobeState) => {
        if (destroyed) return;

        const { width: nextWidth, height: nextHeight, ...changes } = patch;

        assignDefined(state, changes);

        if (changes.markers) {
            uploadMarkers();
        }

        if (
            changes.arcs ||
            changes.arcHeight !== undefined ||
            changes.arcWidth !== undefined ||
            changes.markerElevation !== undefined
        ) {
            uploadArcs();
        }

        if (nextWidth && nextHeight) {
            canvas.width = nextWidth * devicePixelRatio;
            canvas.height = nextHeight * devicePixelRatio;
        }

        render();
    };

    const destroy = () => {
        if (destroyed) return;

        destroyed = true;

        gl.deleteBuffer(quadBuffer);
        gl.deleteBuffer(arcSegmentBuffer);
        gl.deleteBuffer(markerInstanceBuffer);
        gl.deleteBuffer(arcInstanceBuffer);
        gl.deleteTexture(texture);
        gl.deleteProgram(globeProgram);
        gl.deleteProgram(markerProgram);
        gl.deleteProgram(arcProgram);

        anchors.remove();
    };

    const image = new Image();

    image.onload = () => {
        // A picture arriving after the globe was taken down has nothing left to be drawn on
        if (destroyed) return;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        // The map is read a dot at a time, so each dot is either land or sea rather than a blend
        // of whatever lies around it
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        update({});
    };

    image.src = GLOBE_TEXTURE;

    uploadMarkers();
    uploadArcs();
    render();

    return { update, destroy };
}
