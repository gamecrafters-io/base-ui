/**
 * React Globe library
 *
 * A dotted globe drawn with WebGL onto a canvas, with markers and arcs standing on it and any
 * element of the page held over them. The globe is drawn once for every state it is told, so a
 * still globe costs nothing after it is drawn and a turning one is drawn as often as the caller
 * says.
 *
 *     <Globe
 *         markers={[{ id: "sf", location: [37.78, -122.44], size: 0.03 }]}
 *         onRender={(state) => {
 *             state.phi = phi += 0.005;
 *         }}
 *     >
 *         <GlobeOverlay marker="sf">San Francisco</GlobeOverlay>
 *     </Globe>
 *
 * The overlays are held in place by CSS anchor positioning: every named marker and arc has an
 * anchor called `--globe-{id}` or `--globe-arc-{id}` moved under it on every frame, and a
 * variable called `--globe-visible-{id}` or `--globe-visible-arc-{id}` that is set while it is
 * in view and unset while it is round the back.
 *
 * Ported from cobe (MIT).
 */

export { createGlobe, DEFAULT_GLOBE_STATE, GLOBE_STATE_KEYS } from "./renderer";
export { Globe } from "./Globe";
export { GlobeContext } from "./GlobeContext";
export { useGlobe } from "./useGlobe";
export { GlobeOverlay } from "./GlobeOverlay";

export { latLonTo3D, GLOBE_RADIUS } from "./projection";
export {
    arcAnchorName,
    arcVisibilityVariable,
    markerAnchorName,
    markerVisibilityVariable,
    supportsAnchorPositioning,
} from "./anchor";

export type {
    GlobeArc,
    GlobeColor,
    GlobeInstance,
    GlobeLocation,
    GlobeMarker,
    GlobeOptions,
    GlobeOverlayProps,
    GlobeProjection,
    GlobeProps,
    GlobeRenderCallback,
    GlobeState,
} from "./types";
