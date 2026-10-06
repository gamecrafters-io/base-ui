import type * as React from "react";

// Somewhere on the globe, as degrees of latitude and then longitude. North of the equator and
// east of Greenwich are positive, which is the order and the sign an atlas gives them in
export type GlobeLocation = [latitude: number, longitude: number];

// A colour as red, green and blue, each between nought and one, which is how a shader reads one
// rather than how a stylesheet writes one
export type GlobeColor = [red: number, green: number, blue: number];

// A dot standing somewhere on the globe. Naming one is what gives it an anchor, so that an
// element of the page can be held over it and told whether it is in view
export type GlobeMarker = {
    location: GlobeLocation;
    // How large the dot is drawn, as a fraction of the globe's radius. Somewhere between 0.01
    // and 0.1 reads as a dot rather than as a disc
    size: number;
    // What the dot is painted where it is not to be painted like the rest
    color?: GlobeColor;
    id?: string;
};

// A curve drawn between two places, rising off the surface between them. Naming one gives it an
// anchor at its highest point, the way naming a marker gives one at the marker
export type GlobeArc = {
    from: GlobeLocation;
    to: GlobeLocation;
    color?: GlobeColor;
    id?: string;
};

// Everything a globe can be told once it is standing, and told again as often as wanted. Whatever
// is left out of an update keeps what it had, so a globe being turned is told only its angle
export type GlobeState = {
    // How large the canvas is, in CSS pixels. Both have to be given for either to take
    width?: number;
    height?: number;
    // How far round the globe is turned, and how far it is tilted towards the viewer, in radians
    phi?: number;
    theta?: number;
    markers?: readonly GlobeMarker[];
    arcs?: readonly GlobeArc[];
    // How many dots the land is drawn from. More reads as finer, at the GPU's cost; somewhere
    // between eight and forty thousand is usual
    mapSamples?: number;
    // How bright the dots on land are drawn, and how bright the sea between them is drawn
    mapBrightness?: number;
    mapBaseBrightness?: number;
    baseColor?: GlobeColor;
    markerColor?: GlobeColor;
    // What the halo around the globe is drawn in
    glowColor?: GlobeColor;
    arcColor?: GlobeColor;
    // How thick an arc is drawn, and how high it rises off the surface between its ends, as a
    // fraction of the globe's radius
    arcWidth?: number;
    arcHeight?: number;
    // How far the markers, and the ends of the arcs, stand off the surface
    markerElevation?: number;
    // How sharply the light falls off towards the edge of the globe
    diffuse?: number;
    // How far the land is drawn dark on light rather than light on dark: nought for a light
    // globe, one for a dark one
    dark?: number;
    opacity?: number;
    // Where the globe stands on the canvas, in CSS pixels from the middle, and how large it is
    // drawn against it
    offset?: [x: number, y: number];
    scale?: number;
};

// What a globe is built with: the state it starts in, and what cannot be changed once it stands
export type GlobeOptions = GlobeState & {
    width: number;
    height: number;
    // How many device pixels the canvas is given to the CSS pixel. One unless told otherwise
    devicePixelRatio?: number;
    // What the WebGL context is asked for, over the top of what a globe asks for itself
    context?: WebGLContextAttributes;
};

// A standing globe: what it is told, and how it is taken down
export type GlobeInstance = {
    update: (state: GlobeState) => void;
    destroy: () => void;
};

// Called on every frame of a turning globe with an empty state to fill in. Whatever it writes on
// the state, or hands back, is what the globe is told for that frame
export type GlobeRenderCallback = (state: GlobeState) => GlobeState | void;

// Where somewhere on the globe falls on the canvas, as fractions of its width and height from
// the top left, and whether it can be seen from where the globe is being looked at
export type GlobeProjection = {
    x: number;
    y: number;
    visible: boolean;
};

// The canvas is sized to the element the component renders, so its size is not open to being
// passed in as a number of pixels; what is passed is how large that element stands on the page
export type GlobeProps = Omit<GlobeOptions, "width" | "height"> & {
    width?: number | string;
    height?: number | string;
    onRender?: GlobeRenderCallback;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

// An overlay is held over a marker or over an arc, named by its id, and never over both
export type GlobeOverlayProps = React.ComponentPropsWithoutRef<"div"> &
    ({ marker: string; arc?: never } | { arc: string; marker?: never });
