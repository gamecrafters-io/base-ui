import * as React from "react";
import {
    arcAnchorName,
    arcVisibilityVariable,
    markerAnchorName,
    markerVisibilityVariable,
    supportsAnchorPositioning,
} from "./anchor";
import type { GlobeOverlayProps } from "./types";

// An element held over a marker, or over the top of an arc, moving with the globe as it turns
// and fading out as what it is held over goes round the back.
//
// It is held there by CSS anchor positioning rather than by React: the globe moves an anchor for
// every named marker on every frame, and the overlay is positioned against the anchor's name, so
// nothing is rendered as the globe turns. It stands with its foot on the marker and reads
// whether the marker is in view off a variable the globe writes, which is what fades it out; a
// transition on the opacity is what fades it out slowly. The pointer passes through it, so an
// overlay that has faded out does not stand in the way of dragging the globe; one meant to be
// pressed says so with `pointer-events: auto`.
//
// A browser without anchor positioning would draw every overlay in the corner of the globe, so
// in one of those none is drawn at all
function GlobeOverlay({ marker, arc, className, style, children, ...rest }: GlobeOverlayProps) {
    if (!supportsAnchorPositioning()) return null;

    const anchorName = marker !== undefined ? markerAnchorName(marker) : arcAnchorName(arc);
    const visibility =
        marker !== undefined ? markerVisibilityVariable(marker) : arcVisibilityVariable(arc);

    return (
        <div
            className={className}
            style={{
                position: "absolute",
                positionAnchor: anchorName,
                bottom: "anchor(top)",
                left: "anchor(center)",
                translate: "-50% 0",
                opacity: `var(${visibility}, 0)`,
                pointerEvents: "none",
                ...style,
            }}
            data-component="GlobeOverlay"
            {...rest}
        >
            {children}
        </div>
    );
}

GlobeOverlay.displayName = "GlobeOverlay";

export { GlobeOverlay };
