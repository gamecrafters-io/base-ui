import type { GlobeColor, GlobeState } from "../../lib/react-globe";

// Everything about a globe that the stylesheet settles rather than the caller: what it is
// painted, how brightly the land is dotted, and how the light falls across it.
//
// They are read off the element as numbers rather than as CSS colours, since what is drawn is
// drawn by a shader and a shader is handed numbers. Reading them from the element rather than
// writing them in is what lets each theme give the globe a value of its own without anything
// here knowing which theme is standing, and what lets a caller repaint a globe from a stylesheet
// the way the rest of the library is repainted
const COLOR_PROPERTIES = {
    baseColor: "--globe-base-color",
    markerColor: "--globe-marker-color",
    glowColor: "--globe-glow-color",
    arcColor: "--globe-arc-color",
} as const;

const NUMBER_PROPERTIES = {
    mapSamples: "--globe-map-samples",
    mapBrightness: "--globe-map-brightness",
    mapBaseBrightness: "--globe-map-base-brightness",
    diffuse: "--globe-diffuse",
    dark: "--globe-dark",
    opacity: "--globe-opacity",
    markerElevation: "--globe-marker-elevation",
    arcHeight: "--globe-arc-height",
    arcWidth: "--globe-arc-width",
} as const;

// Three numbers between nought and one, written with spaces or commas between them, which is how
// a colour reaches a shader. Anything else is left alone rather than guessed at, so a property
// that was never given a value keeps the globe's own default instead of drawing it black
const readColor = (value: string): GlobeColor | undefined => {
    const parts = value
        .trim()
        .split(/[\s,]+/)
        .map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) return undefined;

    const [red, green, blue] = parts as [number, number, number];

    return [red, green, blue];
};

const readNumber = (value: string): number | undefined => {
    const number = Number(value.trim());

    return value.trim() === "" || Number.isNaN(number) ? undefined : number;
};

// What the stylesheet says the globe standing in this element is drawn like. Only the properties
// that were actually given a value are named in what comes back, so everything else falls to the
// defaults the globe carries
export const readGlobeAppearance = (element: HTMLElement): GlobeState => {
    const styles = getComputedStyle(element);
    const appearance: GlobeState = {};

    for (const key of Object.keys(COLOR_PROPERTIES) as Array<keyof typeof COLOR_PROPERTIES>) {
        const color = readColor(styles.getPropertyValue(COLOR_PROPERTIES[key]));

        if (color) {
            appearance[key] = color;
        }
    }

    for (const key of Object.keys(NUMBER_PROPERTIES) as Array<keyof typeof NUMBER_PROPERTIES>) {
        const number = readNumber(styles.getPropertyValue(NUMBER_PROPERTIES[key]));

        if (number !== undefined) {
            appearance[key] = number;
        }
    }

    return appearance;
};
