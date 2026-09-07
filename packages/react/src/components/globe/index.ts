import { GlobeOverlay } from "../../lib/react-globe";
import GlobeBase from "./Globe";

// What can be held over a globe, hung off the globe itself, since what it is written inside is
// the only place it does anything. It is handed on from the surface rather than wrapped again:
// it is already the piece it says it is, and a globe that re-dressed it would be a second
// library rather than a way into this one
export const Globe = Object.assign(GlobeBase, {
    Overlay: GlobeOverlay,
});

export { GlobeOverlay };
export { DEFAULT_GLOBE_MARKER_SIZE, DEFAULT_GLOBE_SPEED } from "./Globe";
export { useGlobe } from "../../lib/react-globe";
export * from "./Globe.types";
