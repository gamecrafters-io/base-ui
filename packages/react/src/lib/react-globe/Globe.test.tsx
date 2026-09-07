import * as React from "react";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import {
    arcAnchorName,
    arcVisibilityVariable,
    createGlobe,
    DEFAULT_GLOBE_STATE,
    Globe,
    GlobeOverlay,
    latLonTo3D,
    markerAnchorName,
    markerVisibilityVariable,
    useGlobe,
} from ".";
import { createAnchorManager } from "./anchor";
import { project, projectArcMidpoint } from "./projection";
import type { GlobeInstance, GlobeProps } from ".";
import type { GlobeView } from "./projection";

// What the renderer asked of the context, in the order it asked
type Call = { name: string; args: unknown[] };

// jsdom has no WebGL, and a canvas asked for a context answers with nothing and a warning. What
// stands in for one here takes every call the renderer makes and answers the few it reads an
// answer from, so that a globe can be built and what it is told read back off the calls. A
// uniform's location is answered with its name, which is what tells the calls setting one apart
const createContext = (calls: Call[]) =>
    new Proxy({} as WebGLRenderingContext, {
        get(_target, property) {
            if (typeof property !== "string") return undefined;

            // The constants are read as numbers, and which number does not matter here
            if (/^[A-Z][A-Z0-9_]*$/.test(property)) return 0;

            return (...args: unknown[]) => {
                calls.push({ name: property, args });

                switch (property) {
                    case "getShaderParameter":
                    case "getProgramParameter":
                        return true;
                    case "getAttribLocation":
                        return 0;
                    case "getUniformLocation":
                        return { name: args[1] };
                    case "getExtension":
                        return null;
                    default:
                        return {};
                }
            };
        },
    });

const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalCancelAnimationFrame = window.cancelAnimationFrame;
const originalResizeObserver = window.ResizeObserver;

let calls: Call[];
let frames: FrameRequestCallback[];

const named = (name: string) => calls.filter((call) => call.name === name);

// The last value a uniform was set to, read off the last call that named it
const lastUniform = (uniformName: string) => {
    const call = [...calls]
        .reverse()
        .find(
            ({ name, args }) =>
                name.startsWith("uniform") && (args[0] as { name: string }).name === uniformName,
        );

    return call?.args.slice(1);
};

// The frames are stepped by hand rather than left to jsdom's clock, so a test says how many go by
const nextFrame = () => {
    for (const callback of frames.splice(0)) {
        callback(0);
    }
};

// The view a globe stands in before it is turned: the Americas face the viewer, on a square
// canvas drawn a pixel to the pixel
const view: GlobeView = {
    phi: 0,
    theta: 0,
    width: 100,
    height: 100,
    devicePixelRatio: 1,
    scale: 1,
    offset: [0, 0],
    markerElevation: 0,
    arcHeight: 0.2,
};

// A globe stands inside an element of its own, which is what the anchors are put in
const createCanvas = () => {
    const container = document.createElement("div");
    const canvas = document.createElement("canvas");

    container.append(canvas);
    document.body.append(container);

    return { container, canvas };
};

let instance: GlobeInstance | undefined;

function CaptureGlobe() {
    instance = useGlobe();

    return null;
}

const renderGlobe = (props: GlobeProps = {}) =>
    render(
        <Globe {...props}>
            <CaptureGlobe />
            {props.children}
        </Globe>,
    );

const root = () => document.querySelector<HTMLElement>("[data-component='Globe']")!;

const canvas = () => root().querySelector("canvas")!;

const overlay = () => document.querySelector<HTMLElement>("[data-component='GlobeOverlay']");

beforeEach(() => {
    calls = [];
    frames = [];
    instance = undefined;

    const context = createContext(calls);

    HTMLCanvasElement.prototype.getContext = (() => context) as typeof originalGetContext;
    window.requestAnimationFrame = (callback) => frames.push(callback);
    window.cancelAnimationFrame = () => {};
});

afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    window.ResizeObserver = originalResizeObserver;
    vi.unstubAllGlobals();
    document.body.innerHTML = "";

    // The anchors write which markers are in view into a stylesheet on the head, which a globe
    // that was never taken down leaves behind, so the head is cleared along with the body
    for (const style of document.head.querySelectorAll("style")) {
        style.remove();
    }
});

// jsdom has no ResizeObserver, and the globe watches the element it stands in so that the canvas
// is drawn again at whatever size the element comes to. What stands in for one here hands back
// the means of saying the element has been resized, and the size it is to be read as
const stubResizeObserver = () => {
    let resize: () => void = () => {};

    window.ResizeObserver = class {
        constructor(callback: ResizeObserverCallback) {
            resize = () => callback([], this as unknown as ResizeObserver);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof ResizeObserver;

    return (width: number, height: number) => {
        Object.defineProperty(root(), "clientWidth", { value: width, configurable: true });
        Object.defineProperty(root(), "clientHeight", { value: height, configurable: true });
        act(() => resize());
    };
};

describe("latLonTo3D", () => {
    it("puts the meridian on the right, where east reads on a map", () => {
        const [x, y, z] = latLonTo3D([0, 0]);
        expect(x).toBeCloseTo(1);
        expect(y).toBeCloseTo(0);
        expect(z).toBeCloseTo(0);
    });

    it("puts the north pole at the top", () => {
        const [x, y, z] = latLonTo3D([90, 0]);
        expect(x).toBeCloseTo(0);
        expect(y).toBeCloseTo(1);
        expect(z).toBeCloseTo(0);
    });

    it("faces the Americas towards the viewer", () => {
        const [x, y, z] = latLonTo3D([0, -90]);
        expect(x).toBeCloseTo(0);
        expect(y).toBeCloseTo(0);
        expect(z).toBeCloseTo(1);
    });
});

describe("project", () => {
    it("puts a place facing the viewer in the middle of the canvas", () => {
        const position = project([0, -90], view);
        expect(position.x).toBeCloseTo(0.5);
        expect(position.y).toBeCloseTo(0.5);
        expect(position.visible).toBe(true);
    });

    it("puts the meridian towards the right edge of the globe", () => {
        const position = project([0, 0], view);
        expect(position.x).toBeCloseTo(0.9);
        expect(position.y).toBeCloseTo(0.5);
    });

    it("puts the north pole towards the top", () => {
        const position = project([90, 0], view);
        expect(position.x).toBeCloseTo(0.5);
        expect(position.y).toBeCloseTo(0.1);
    });

    it("says a place round the back of the globe cannot be seen", () => {
        expect(project([0, 90], view).visible).toBe(false);
    });

    it("brings a place round the back into view once the globe is turned to it", () => {
        expect(project([0, 90], { ...view, phi: Math.PI }).visible).toBe(true);
    });

    it("moves a place across the canvas with the offset", () => {
        const position = project([0, -90], { ...view, offset: [50, 0] });
        expect(position.x).toBeCloseTo(0.75);
    });
});

describe("projectArcMidpoint", () => {
    it("stands the top of an arc between its two ends", () => {
        const position = projectArcMidpoint({ from: [0, -100], to: [0, -80] }, view);
        expect(position?.x).toBeCloseTo(0.5);
        expect(position?.y).toBeCloseTo(0.5);
        expect(position?.visible).toBe(true);
    });

    it("has no top to find for an arc between opposite ends", () => {
        expect(projectArcMidpoint({ from: [0, 0], to: [0, 180] }, view)).toBeNull();
    });
});

describe("createAnchorManager", () => {
    it("puts an anchor in the container for every named marker, where the marker falls", () => {
        const container = document.createElement("div");
        const anchors = createAnchorManager(container);

        anchors.updateMarkers([{ id: "sf", location: [37.78, -122.44], size: 0.03 }], () => ({
            x: 0.25,
            y: 0.75,
            visible: true,
        }));

        expect(container.children).toHaveLength(1);
        expect(container.firstElementChild).toHaveStyle({ left: "25%", top: "75%" });
    });

    it("puts the anchor ahead of whatever is held over it", () => {
        const container = document.createElement("div");
        const overlay = document.createElement("span");
        container.append(overlay);

        const anchors = createAnchorManager(container);

        anchors.updateMarkers([{ id: "sf", location: [37.78, -122.44], size: 0.03 }], () => ({
            x: 0.25,
            y: 0.75,
            visible: true,
        }));

        // An anchor laid out after the element reading it is not one that element can be held
        // over at all, so the order is what makes the anchoring work rather than a detail of it
        expect(container.firstElementChild).not.toBe(overlay);
        expect(container.lastElementChild).toBe(overlay);
    });

    it("gives a marker without a name no anchor", () => {
        const container = document.createElement("div");
        const anchors = createAnchorManager(container);

        anchors.updateMarkers([{ location: [37.78, -122.44], size: 0.03 }], () => ({
            x: 0.25,
            y: 0.75,
            visible: true,
        }));

        expect(container.children).toHaveLength(0);
    });

    it("says on the root which markers are in view", () => {
        const anchors = createAnchorManager(document.createElement("div"));
        const style = () => document.head.querySelector("style")?.textContent ?? "";

        anchors.updateMarkers([{ id: "sf", location: [37.78, -122.44], size: 0.03 }], () => ({
            x: 0.5,
            y: 0.5,
            visible: true,
        }));
        anchors.applyVisibility();
        expect(style()).toContain(`${markerVisibilityVariable("sf")}:N`);

        anchors.updateMarkers([{ id: "sf", location: [37.78, -122.44], size: 0.03 }], () => ({
            x: 0.5,
            y: 0.5,
            visible: false,
        }));
        anchors.applyVisibility();
        expect(style()).not.toContain(markerVisibilityVariable("sf"));
    });

    it("takes the anchor of a marker that has gone back down", () => {
        const container = document.createElement("div");
        const anchors = createAnchorManager(container);
        const position = { x: 0.5, y: 0.5, visible: true };

        anchors.updateMarkers(
            [{ id: "sf", location: [37.78, -122.44], size: 0.03 }],
            () => position,
        );
        anchors.updateMarkers([], () => position);

        expect(container.children).toHaveLength(0);
    });

    it("anchors an arc at its top under a name of its own", () => {
        const container = document.createElement("div");
        const anchors = createAnchorManager(container);

        anchors.updateArcs([{ id: "sf-nyc", from: [37.78, -122.44], to: [40.71, -74.01] }], () => ({
            x: 0.4,
            y: 0.3,
            visible: true,
        }));
        anchors.applyVisibility();

        expect(container.children).toHaveLength(1);
        expect(container.firstElementChild).toHaveStyle({ left: "40%", top: "30%" });
        expect(document.head.querySelector("style")?.textContent).toContain(
            `${arcVisibilityVariable("sf-nyc")}:N`,
        );
    });

    it("leaves an arc with no top to stand on without an anchor", () => {
        const container = document.createElement("div");
        const anchors = createAnchorManager(container);

        anchors.updateArcs([{ id: "far", from: [0, 0], to: [0, 180] }], () => null);

        expect(container.children).toHaveLength(0);
    });

    it("takes everything down on remove", () => {
        const container = document.createElement("div");
        const anchors = createAnchorManager(container);

        anchors.updateMarkers([{ id: "sf", location: [37.78, -122.44], size: 0.03 }], () => ({
            x: 0.5,
            y: 0.5,
            visible: true,
        }));
        anchors.applyVisibility();
        anchors.remove();

        expect(container.children).toHaveLength(0);
        expect(document.head.querySelector("style")).toBeNull();
    });

    it("names the anchors and the variables after the ids they were given", () => {
        expect(markerAnchorName("sf")).toBe("--globe-sf");
        expect(arcAnchorName("sf-nyc")).toBe("--globe-arc-sf-nyc");
        expect(markerVisibilityVariable("sf")).toBe("--globe-visible-sf");
        expect(arcVisibilityVariable("sf-nyc")).toBe("--globe-visible-arc-sf-nyc");
    });
});

describe("createGlobe", () => {
    it("sizes the canvas to what it was given, at the pixel ratio", () => {
        const { canvas } = createCanvas();
        createGlobe(canvas, { width: 100, height: 50, devicePixelRatio: 2 });

        expect(canvas.width).toBe(200);
        expect(canvas.height).toBe(100);
    });

    it("draws the globe once when it is built, and once more for everything it is told", () => {
        const { canvas } = createCanvas();
        const globe = createGlobe(canvas, { width: 100, height: 100 });
        expect(named("drawArrays")).toHaveLength(1);

        globe.update({ phi: 1 });
        expect(named("drawArrays")).toHaveLength(2);
    });

    it("hands the shaders the angle it was turned to", () => {
        const { canvas } = createCanvas();
        const globe = createGlobe(canvas, { width: 100, height: 100, phi: 1, theta: 0.5 });
        expect(lastUniform("rotation")).toEqual([1, 0.5]);

        globe.update({ theta: 0.25 });
        expect(lastUniform("rotation")).toEqual([1, 0.25]);
    });

    it("draws what it was told nothing about the way the defaults say", () => {
        const { canvas } = createCanvas();
        createGlobe(canvas, { width: 100, height: 100 });

        expect(lastUniform("dots")).toEqual([DEFAULT_GLOBE_STATE.mapSamples]);
        expect(lastUniform("baseColor")).toEqual([DEFAULT_GLOBE_STATE.baseColor]);
    });

    it("leaves the defaults as they were", () => {
        const { canvas } = createCanvas();
        createGlobe(canvas, { width: 100, height: 100, phi: 1, markers: [] });

        expect(DEFAULT_GLOBE_STATE.phi).toBe(0);
    });

    it("draws every marker in one call", () => {
        const { canvas } = createCanvas();
        createGlobe(canvas, {
            width: 100,
            height: 100,
            markers: [
                { location: [37.78, -122.44], size: 0.03 },
                { location: [40.71, -74.01], size: 0.03 },
            ],
        });

        const [draw] = named("drawArraysInstanced");
        expect(draw.args[3]).toBe(2);
    });

    it("draws no markers where there are none", () => {
        const { canvas } = createCanvas();
        createGlobe(canvas, { width: 100, height: 100 });

        expect(named("drawArraysInstanced")).toHaveLength(0);
    });

    it("uploads the arcs again when the height they are drawn at changes", () => {
        const { canvas } = createCanvas();
        const globe = createGlobe(canvas, {
            width: 100,
            height: 100,
            arcs: [{ from: [37.78, -122.44], to: [40.71, -74.01] }],
        });
        const uploads = named("bufferData").length;

        globe.update({ phi: 1 });
        expect(named("bufferData")).toHaveLength(uploads);

        globe.update({ arcHeight: 0.3 });
        expect(named("bufferData")).toHaveLength(uploads + 1);
    });

    it("draws the canvas again at a new size", () => {
        const { canvas } = createCanvas();
        const globe = createGlobe(canvas, { width: 100, height: 100, devicePixelRatio: 2 });

        globe.update({ width: 50, height: 50 });
        expect(canvas.width).toBe(100);
        expect(lastUniform("uResolution")).toEqual([100, 100]);
    });

    it("puts an anchor beside the canvas for every named marker", () => {
        const { container, canvas } = createCanvas();
        const globe = createGlobe(canvas, {
            width: 100,
            height: 100,
            markers: [{ id: "sf", location: [37.78, -122.44], size: 0.03 }],
        });

        expect(container.querySelectorAll("div")).toHaveLength(1);

        globe.update({ markers: [] });
        expect(container.querySelectorAll("div")).toHaveLength(0);
    });

    it("takes everything down on destroy, and draws nothing more", () => {
        const { container, canvas } = createCanvas();
        const globe = createGlobe(canvas, {
            width: 100,
            height: 100,
            markers: [{ id: "sf", location: [37.78, -122.44], size: 0.03 }],
        });

        globe.destroy();
        expect(container.querySelectorAll("div")).toHaveLength(0);
        expect(document.head.querySelector("style")).toBeNull();
        expect(named("deleteProgram").length).toBeGreaterThan(0);

        const draws = named("drawArrays").length;
        globe.update({ phi: 1 });
        expect(named("drawArrays")).toHaveLength(draws);
    });

    it("stands as an empty canvas where there is no WebGL", () => {
        HTMLCanvasElement.prototype.getContext = (() => null) as typeof originalGetContext;

        const { canvas } = createCanvas();
        const globe = createGlobe(canvas, { width: 100, height: 100 });

        expect(() => globe.update({ phi: 1 })).not.toThrow();
        expect(() => globe.destroy()).not.toThrow();
        expect(named("drawArrays")).toHaveLength(0);
    });
});

describe("Globe", () => {
    it("renders a div element with the canvas inside it", () => {
        renderGlobe();
        expect(root().tagName).toBe("DIV");
        expect(canvas()).toBeInTheDocument();
    });

    it("tags the root element with a data-component attribute", () => {
        renderGlobe();
        expect(root()).toHaveAttribute("data-component", "Globe");
    });

    it("positions the root, so that an overlay inside it is held against the anchors", () => {
        renderGlobe();
        expect(root()).toHaveStyle({ position: "relative" });
    });

    it("is as wide as whatever it was put in where it was given no width", () => {
        renderGlobe();
        expect(root()).toHaveStyle({ width: "100%" });
    });

    it("takes the width and the height it was given, in pixels where they were numbers", () => {
        renderGlobe({ width: 640, height: 480 });
        expect(root()).toHaveStyle({ width: "640px", height: "480px" });
    });

    it("passes a width written out as it was written", () => {
        renderGlobe({ width: "50%" });
        expect(root()).toHaveStyle({ width: "50%" });
    });

    it("keeps a style passed in alongside the ones it sets", () => {
        renderGlobe({ style: { opacity: 0.5 } });
        expect(root()).toHaveStyle({ opacity: "0.5", position: "relative" });
    });

    it("passes a custom className onto the root element", () => {
        renderGlobe({ className: "custom" });
        expect(root()).toHaveClass("custom");
    });

    it("renders children inside the root, over the canvas", () => {
        renderGlobe({ children: <span data-testid="label">San Francisco</span> });
        expect(root().querySelector("[data-testid='label']")).toBeInTheDocument();
    });

    it("puts the globe within reach of its children once it is built", () => {
        renderGlobe();
        expect(instance).toBeDefined();
    });

    it("builds the globe with what it was first given", () => {
        renderGlobe({ phi: 1, theta: 0.5 });
        expect(lastUniform("rotation")).toEqual([1, 0.5]);
    });

    it("draws at the pixel ratio it was given", () => {
        const resizeTo = stubResizeObserver();

        renderGlobe({ devicePixelRatio: 3 });
        resizeTo(100, 100);

        expect(canvas().width).toBe(300);
        expect(canvas().height).toBe(300);
    });

    it("tells the globe what changes rather than building another one", () => {
        const { rerender } = renderGlobe({ phi: 1 });
        const built = named("createProgram").length;

        rerender(
            <Globe phi={2} theta={0.5}>
                <CaptureGlobe />
            </Globe>,
        );
        expect(lastUniform("rotation")).toEqual([2, 0.5]);
        expect(named("createProgram")).toHaveLength(built);
    });

    it("draws on every frame where it was given something to draw with", () => {
        const onRender = vi.fn((state: { phi?: number }) => {
            state.phi = 2;
        });

        renderGlobe({ onRender });
        expect(onRender).not.toHaveBeenCalled();

        act(() => nextFrame());
        expect(onRender).toHaveBeenCalledTimes(1);
        expect(lastUniform("rotation")).toEqual([2, 0]);

        act(() => nextFrame());
        expect(onRender).toHaveBeenCalledTimes(2);
    });

    it("takes what the callback hands back as readily as what it writes", () => {
        renderGlobe({ onRender: () => ({ phi: 3 }) });

        act(() => nextFrame());
        expect(lastUniform("rotation")).toEqual([3, 0]);
    });

    it("draws nothing between frames where it was given nothing to draw with", () => {
        renderGlobe();
        expect(frames).toHaveLength(0);
    });

    it("draws the canvas again at whatever size the element comes to stand at", () => {
        const resizeTo = stubResizeObserver();

        renderGlobe({ devicePixelRatio: 1 });
        resizeTo(300, 200);

        expect(canvas().width).toBe(300);
        expect(canvas().height).toBe(200);
        expect(lastUniform("uResolution")).toEqual([300, 200]);
    });

    it("takes the globe down on unmount, and draws no more frames", () => {
        const { unmount } = renderGlobe({ onRender: () => {} });
        const draws = named("drawArrays").length;

        unmount();
        expect(named("deleteProgram").length).toBeGreaterThan(0);

        nextFrame();
        expect(named("drawArrays")).toHaveLength(draws);
    });
});

describe("GlobeOverlay", () => {
    it("draws nothing in a browser without anchor positioning", () => {
        render(<GlobeOverlay marker="sf">San Francisco</GlobeOverlay>);
        expect(overlay()).toBeNull();
    });

    describe("in a browser with anchor positioning", () => {
        beforeEach(() => {
            vi.stubGlobal("CSS", { supports: () => true });
        });

        it("renders a div element holding its children", () => {
            render(<GlobeOverlay marker="sf">San Francisco</GlobeOverlay>);
            expect(overlay()?.tagName).toBe("DIV");
            expect(overlay()).toHaveTextContent("San Francisco");
        });

        it("tags the element with a data-component attribute", () => {
            render(<GlobeOverlay marker="sf">San Francisco</GlobeOverlay>);
            expect(overlay()).toHaveAttribute("data-component", "GlobeOverlay");
        });

        // Whether the overlay is in view is read off a variable through `var()`, which jsdom
        // cannot parse into a style, so only the anchor it is held against is checked here
        it("is held over the marker it was given", () => {
            render(<GlobeOverlay marker="sf">San Francisco</GlobeOverlay>);
            expect(overlay()).toHaveStyle({ position: "absolute" });
            expect(overlay()?.getAttribute("style")).toContain(markerAnchorName("sf"));
        });

        it("is held over the arc it was given", () => {
            render(<GlobeOverlay arc="sf-nyc">Flight</GlobeOverlay>);
            expect(overlay()?.getAttribute("style")).toContain(arcAnchorName("sf-nyc"));
        });

        it("lets the pointer through, unless told otherwise", () => {
            render(<GlobeOverlay marker="sf">San Francisco</GlobeOverlay>);
            expect(overlay()).toHaveStyle({ pointerEvents: "none" });
        });

        it("keeps a style passed in over the ones it sets", () => {
            render(
                <GlobeOverlay marker="sf" style={{ pointerEvents: "auto" }}>
                    San Francisco
                </GlobeOverlay>,
            );
            expect(overlay()).toHaveStyle({ pointerEvents: "auto" });
        });

        it("passes a custom className and extra props onto the element", () => {
            render(
                <GlobeOverlay marker="sf" className="custom" data-testid="label">
                    San Francisco
                </GlobeOverlay>,
            );
            expect(overlay()).toHaveClass("custom");
            expect(overlay()).toHaveAttribute("data-testid", "label");
        });
    });
});
