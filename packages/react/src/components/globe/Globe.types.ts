import type * as React from "react";
import type {
    GlobeArc as GlobeSurfaceArc,
    GlobeMarker as GlobeSurfaceMarker,
} from "../../lib/react-globe";

export type { GlobeColor, GlobeLocation, GlobeOverlayProps } from "../../lib/react-globe";

// A dot standing somewhere on the globe. It is the surface's own marker but for the size, which
// the globe fills in from `markerSize` wherever a marker does not name one, so a caller placing a
// row of them says where each one is and nothing else.
//
// Naming a marker is what gives it an anchor, which is what an overlay is held over
export type GlobeMarker = Omit<GlobeSurfaceMarker, "size"> & {
    size?: number;
};

// A curve drawn between two places, rising off the surface between them. Naming one gives it an
// anchor at its highest point, the way naming a marker gives one at the marker
export type GlobeArc = GlobeSurfaceArc;

export type GlobeProps = React.ComponentPropsWithoutRef<"div"> & {
    // Where the globe is pointed, written the way an address is looked up rather than the way the
    // globe draws it: degrees of latitude and longitude, which the component turns into the angles
    // it is turned and tilted by. Left out, the globe faces the Americas, which is where it stands
    // before it has been turned at all
    latitude?: number;
    longitude?: number;
    // How wide the globe stands. A number is read as pixels, and anything else is passed to CSS as
    // it was written, so a globe can be given a size in whatever units the page is laid out in.
    //
    // Only the width is settled, since a globe is round: how tall it stands follows from it
    size?: number | string;
    markers?: readonly GlobeMarker[];
    arcs?: readonly GlobeArc[];
    // How large a marker is drawn where it does not say, as a share of the globe's radius.
    // Somewhere around a twentieth reads as a dot on the surface rather than a disc over it
    markerSize?: number;
    // Whether the globe turns on its own, and how fast in radians a second. It does by default,
    // since a globe standing still reads as a picture of one rather than as somewhere that can be
    // turned about. A reader who has asked for less movement is left with a globe standing still,
    // which is the same globe without the turning
    spin?: boolean;
    speed?: number;
    // Whether the globe can be turned by hand. One that can takes focus, so that it can be turned
    // from the keyboard as well as dragged
    interactive?: boolean;
    // Anything held over the globe: labels, tooltips, whatever a marker is worth naming with. Each
    // is written as `Globe.Overlay` and says which marker or arc it belongs to, so where it is
    // written among the rest does not matter
    children?: React.ReactNode;
    className?: string;
};
