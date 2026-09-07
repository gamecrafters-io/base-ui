import type { GlobeArc, GlobeLocation, GlobeMarker, GlobeProjection } from "./types";

// The names a marker's anchor and an arc's anchor are written under, and the variables that say
// whether each is in view. They are what an element held over a marker is positioned by, so they
// are written here once and read wherever one is positioned
export const markerAnchorName = (id: string) => `--globe-${id}`;

export const arcAnchorName = (id: string) => `--globe-arc-${id}`;

export const markerVisibilityVariable = (id: string) => `--globe-visible-${id}`;

export const arcVisibilityVariable = (id: string) => `--globe-visible-arc-${id}`;

// What a visibility variable is set to while its marker is in view. It is deliberately nothing an
// opacity or a filter can read: a property handed it is invalid at computed-value time and falls
// back to its initial value, which for opacity is fully shown, while the same property reading
// the variable through a fallback gets the fallback once the variable is gone. One variable
// thereby drives `opacity: var(--globe-visible-sf, 0)` and `filter: blur(var(--globe-visible-sf,
// 8px))` alike
const VISIBLE = "N";

// Whether the browser can hold an element over an anchor at all. Where it cannot, an element
// positioned by one stands wherever it was written instead
export const supportsAnchorPositioning = () =>
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("anchor-name", "--globe");

export type AnchorManager = {
    updateMarkers: (
        markers: readonly GlobeMarker[],
        project: (location: GlobeLocation) => GlobeProjection,
    ) => void;
    updateArcs: (
        arcs: readonly GlobeArc[],
        project: (arc: GlobeArc) => GlobeProjection | null,
    ) => void;
    applyVisibility: () => void;
    remove: () => void;
};

// The anchors standing over a globe: an element a pixel across for every named marker and arc,
// put where the marker falls on the canvas, and a stylesheet saying which of them are in view.
//
// They are moved by writing to their styles directly rather than through React, since they move
// on every frame of a turning globe and a render for each would cost more than the globe does.
// The container is what they are put in, so it has to be the element positioned over the canvas;
// given none, the variables are still written but there is nothing for them to be held over
export function createAnchorManager(container: HTMLElement | null): AnchorManager {
    const markerAnchors = new Map<string, HTMLElement>();
    const arcAnchors = new Map<string, HTMLElement>();
    const visibility = new Map<string, string>();

    // The variables are written on the root rather than on the container, so an element held
    // over a marker can read them from anywhere on the page
    const styleElement = document.createElement("style");
    document.head.append(styleElement);

    const updateAnchor = (
        anchors: Map<string, HTMLElement>,
        key: string,
        name: string,
        position: GlobeProjection,
    ) => {
        let anchor = anchors.get(key);

        if (!anchor) {
            anchor = document.createElement("div");
            anchor.style.cssText =
                "position:absolute;width:1px;height:1px;pointer-events:none;" +
                `anchor-name:${name}`;
            // An anchor is only one an element can be held over where it is laid out first, so
            // the anchors go to the front of the container rather than after it. Anything held
            // over a marker is written inside the globe, which puts it after the canvas and so
            // after everything put there before the canvas was
            container?.prepend(anchor);
            anchors.set(key, anchor);
        }

        anchor.style.left = `${position.x * 100}%`;
        anchor.style.top = `${position.y * 100}%`;
    };

    const setVisibility = (variable: string, visible: boolean) => {
        if (visible) {
            visibility.set(variable, VISIBLE);
        } else {
            visibility.delete(variable);
        }
    };

    // An anchor whose marker has gone is taken down, along with anything that said it was in view
    const removeInactive = (
        anchors: Map<string, HTMLElement>,
        active: Set<string>,
        variable: (id: string) => string,
    ) => {
        for (const [key, anchor] of anchors) {
            if (active.has(key)) continue;

            anchor.remove();
            anchors.delete(key);
            visibility.delete(variable(key));
        }
    };

    const updateMarkers: AnchorManager["updateMarkers"] = (markers, project) => {
        const active = new Set<string>();

        for (const marker of markers) {
            if (!marker.id) continue;

            const position = project(marker.location);

            active.add(marker.id);
            updateAnchor(markerAnchors, marker.id, markerAnchorName(marker.id), position);
            setVisibility(markerVisibilityVariable(marker.id), position.visible);
        }

        removeInactive(markerAnchors, active, markerVisibilityVariable);
    };

    const updateArcs: AnchorManager["updateArcs"] = (arcs, project) => {
        const active = new Set<string>();

        for (const arc of arcs) {
            if (!arc.id) continue;

            // An arc with no top to stand an anchor on is left as though it had no name
            const position = project(arc);
            if (!position) continue;

            active.add(arc.id);
            updateAnchor(arcAnchors, arc.id, arcAnchorName(arc.id), position);
            setVisibility(arcVisibilityVariable(arc.id), position.visible);
        }

        removeInactive(arcAnchors, active, arcVisibilityVariable);
    };

    const applyVisibility = () => {
        let variables = "";

        for (const [name, value] of visibility) {
            variables += `${name}:${value};`;
        }

        // Only rewrite the stylesheet when what it says has changed. Reassigning its text swaps
        // a document-level stylesheet, which invalidates style and layout for the whole page, and
        // doing that on every frame is expensive; when the markers in view are the ones that
        // were in view a frame ago, the write is skipped
        const next = `:root{${variables}}`;

        if (styleElement.textContent !== next) {
            styleElement.textContent = next;
        }
    };

    const remove = () => {
        for (const anchor of markerAnchors.values()) {
            anchor.remove();
        }

        for (const anchor of arcAnchors.values()) {
            anchor.remove();
        }

        markerAnchors.clear();
        arcAnchors.clear();
        visibility.clear();
        styleElement.remove();
    };

    return { updateMarkers, updateArcs, applyVisibility, remove };
}
