import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Globe, DEFAULT_GLOBE_MARKER_SIZE } from ".";
import type { GlobeProps } from "./Globe.types";

// What the surface asked of the WebGL context, in the order it asked, and what it was answered
type Call = { name: string; args: unknown[]; result?: unknown };

// The buffers a globe makes, in the order it makes them: the quad it draws the globe and the
// markers on, the steps along an arc, the markers, and the arcs
const MARKER_BUFFER = 2;

// jsdom has no WebGL, and a canvas asked for a context answers with nothing and a warning. What
// stands in for one here takes every call the surface makes and answers the few it reads an
// answer from, so a globe can be drawn and what it was drawn with read back off the calls. A
// uniform's location is answered with its name, which is what tells the calls setting one apart
const createContext = (calls: Call[]) =>
    new Proxy({} as WebGLRenderingContext, {
        get(_target, property) {
            if (typeof property !== "string") return undefined;

            // The constants are read as numbers, and which number does not matter here
            if (/^[A-Z][A-Z0-9_]*$/.test(property)) return 0;

            return (...args: unknown[]) => {
                const call: Call = { name: property, args };
                calls.push(call);

                switch (property) {
                    case "getShaderParameter":
                    case "getProgramParameter":
                        call.result = true;
                        break;
                    case "getAttribLocation":
                        call.result = 0;
                        break;
                    case "getUniformLocation":
                        call.result = { name: args[1] };
                        break;
                    case "getExtension":
                        call.result = null;
                        break;
                    default:
                        // Everything a globe holds on to is answered with something of its own, so
                        // that one buffer or program can be told from the next
                        call.result = {};
                }

                return call.result;
            };
        },
    });

const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalRequestAnimationFrame = window.requestAnimationFrame;
const originalCancelAnimationFrame = window.cancelAnimationFrame;
const originalPointerEvent = window.PointerEvent;

let calls: Call[];
let frames: Map<number, FrameRequestCallback>;
let nextFrameId: number;
let clock: number;

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

// How far round the globe is turned and how far it is tilted, as the shader was last told
const rotation = () => lastUniform("rotation") as [number, number] | undefined;

// What was last written into the buffer the markers are uploaded to. The buffers are told apart
// by which one was bound when the write happened, since a globe writes to four of them and the
// markers are only one
const lastBufferData = (bufferIndex: number) => {
    const buffers = calls.filter(({ name }) => name === "createBuffer").map(({ result }) => result);
    const buffer = buffers[bufferIndex];

    let bound: unknown;
    let data: Float32Array | undefined;

    for (const call of calls) {
        if (call.name === "bindBuffer") bound = call.args[1];
        if (call.name === "bufferData" && bound === buffer) data = call.args[1] as Float32Array;
    }

    return data;
};

// The size every marker is drawn at, read off the buffer they were uploaded in. Each marker takes
// eight numbers, of which the fourth is its size
const markerSizes = () => {
    const data = lastBufferData(MARKER_BUFFER);

    if (!data) return [];

    const sizes: number[] = [];
    for (let index = 3; index < data.length; index += 8) {
        // A shader is handed numbers a half the width of the ones written here, so what comes
        // back is read to the six places that survive the crossing rather than to the last bit
        sizes.push(Math.round(data[index]! * 1e6) / 1e6);
    }

    return sizes;
};

// The frames are stepped by hand rather than left to the browser's clock, so a test says how many
// go by and how long each of them took. The first frame after a globe is set going has no time
// behind it, so a globe is only seen to have moved from the second one on
const runFrames = (count: number, step = 100) => {
    act(() => {
        for (let index = 0; index < count; index++) {
            clock += step;

            const pending = [...frames.values()];
            frames.clear();

            for (const callback of pending) {
                callback(clock);
            }
        }
    });
};

const renderGlobe = (props: GlobeProps = {}) => render(<Globe {...props} />);

const globe = () => document.querySelector<HTMLElement>("[data-component='Globe']")!;

const surface = () => globe().querySelector<HTMLElement>(".globe-surface")!;

const canvas = () => globe().querySelector("canvas")!;

// Every named marker and arc stands an anchor of its own beside the canvas, which is what an
// overlay is held over
const anchors = () => surface().querySelectorAll("div");

beforeEach(() => {
    calls = [];
    frames = new Map();
    nextFrameId = 1;
    clock = 0;

    const context = createContext(calls);

    HTMLCanvasElement.prototype.getContext = (() => context) as typeof originalGetContext;

    // The frames are held by the number they were asked for under, so that one the globe has
    // called off is not run anyway and a globe that has stopped can be told to have stopped
    window.requestAnimationFrame = (callback) => {
        const id = nextFrameId++;
        frames.set(id, callback);
        return id;
    };
    window.cancelAnimationFrame = (id) => {
        frames.delete(id);
    };

    vi.spyOn(performance, "now").mockImplementation(() => clock);

    // jsdom has no PointerEvent, and the plain event it falls back on carries none of the
    // readings a drag is worked out from
    window.PointerEvent = window.MouseEvent as unknown as typeof window.PointerEvent;
});

afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    window.PointerEvent = originalPointerEvent;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = "";

    // The anchors write which markers are in view into a stylesheet on the head, which a globe
    // that was never taken down leaves behind, so the head is cleared along with the body
    for (const style of document.head.querySelectorAll("style")) {
        style.remove();
    }
});

describe("Globe", () => {
    it("renders a div element", () => {
        renderGlobe();
        expect(globe().tagName).toBe("DIV");
    });

    it("tags the root element with a data-component attribute", () => {
        renderGlobe();
        expect(globe()).toHaveAttribute("data-component", "Globe");
    });

    it("draws the globe into a canvas inside a surface of its own", () => {
        renderGlobe();
        expect(surface()).toBeInTheDocument();
        expect(canvas()).toBeInTheDocument();
    });

    it("stands as a region, since a globe holds what is written over it", () => {
        renderGlobe();
        expect(screen.getByRole("region")).toBe(globe());
    });

    it("names the region, so that it can be found and skipped past", () => {
        renderGlobe();
        expect(globe()).toHaveAttribute("aria-label", "Globe");
    });

    it("lets a label given by the caller win over the one it falls back to", () => {
        renderGlobe({ "aria-label": "Where our readers are" });
        expect(globe()).toHaveAttribute("aria-label", "Where our readers are");
    });

    it("leaves the name to what it points at where it is labelled by another element", () => {
        render(
            <>
                <h2 id="heading">Where our readers are</h2>
                <Globe aria-labelledby="heading" />
            </>,
        );
        expect(globe()).toHaveAttribute("aria-labelledby", "heading");
        expect(globe()).not.toHaveAttribute("aria-label");
    });

    it("takes no focus, since a globe that cannot be turned has nothing to do with it", () => {
        renderGlobe();
        expect(globe()).not.toHaveAttribute("tabindex");
    });

    it("takes focus once it can be turned by hand", () => {
        renderGlobe({ interactive: true });
        expect(globe()).toHaveAttribute("tabindex", "0");
        expect(globe()).toHaveAttribute("data-interactive", "true");
    });

    it("hands the width it was given to the stylesheet, in pixels where it was a number", () => {
        renderGlobe({ size: 480 });
        expect(globe()).toHaveStyle({ "--globe-size": "480px" });
    });

    it("passes a width written out to the stylesheet as it was written", () => {
        renderGlobe({ size: "60%" });
        expect(globe()).toHaveStyle({ "--globe-size": "60%" });
    });

    it("leaves the width to the stylesheet where it was given none", () => {
        renderGlobe();
        expect(globe().getAttribute("style") ?? "").not.toContain("--globe-size");
    });

    it("keeps a style passed in alongside the width it sets", () => {
        renderGlobe({ size: 320, style: { opacity: 0.5 } });
        expect(globe()).toHaveStyle({ opacity: "0.5" });
        expect(globe()).toHaveStyle({ "--globe-size": "320px" });
    });

    it("merges a custom className onto the root element", () => {
        renderGlobe({ className: "custom" });
        expect(globe()).toHaveClass("globe", "custom");
    });

    it("passes extra props onto the root element", () => {
        renderGlobe({ "data-testid": "readers" } as GlobeProps);
        expect(globe()).toHaveAttribute("data-testid", "readers");
    });

    it("does not leak the drawing props onto the element", () => {
        renderGlobe({
            latitude: 37.78,
            longitude: -122.44,
            size: 320,
            markerSize: 0.03,
            spin: true,
            interactive: true,
            markers: [{ location: [37.78, -122.44] }],
        });
        expect(globe()).not.toHaveAttribute("latitude");
        expect(globe()).not.toHaveAttribute("longitude");
        expect(globe()).not.toHaveAttribute("size");
        expect(globe()).not.toHaveAttribute("markerSize");
        expect(globe()).not.toHaveAttribute("markers");
        expect(globe()).not.toHaveAttribute("spin");
        expect(globe()).not.toHaveAttribute("interactive");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Globe ref={ref} />);
        expect(ref.current).toBe(globe());
    });

    it("renders children inside the surface, so that they can be held over the markers", () => {
        renderGlobe({ children: <span data-testid="label">San Francisco</span> });
        expect(surface().querySelector("[data-testid='label']")).toBeInTheDocument();
    });
});

describe("Globe markers and arcs", () => {
    it("stands an anchor beside the canvas for every named marker", () => {
        renderGlobe({
            markers: [
                { id: "sf", location: [37.78, -122.44] },
                { id: "nyc", location: [40.71, -74.01] },
            ],
        });
        expect(anchors()).toHaveLength(2);
    });

    it("stands the anchors ahead of the overlays that are held over them", () => {
        // An overlay draws nothing in a browser that cannot hold one over an anchor, and jsdom
        // is one of those
        vi.stubGlobal("CSS", { supports: () => true });

        renderGlobe({
            markers: [{ id: "sf", location: [37.78, -122.44] }],
            children: <Globe.Overlay marker="sf">San Francisco</Globe.Overlay>,
        });

        const children = [...surface().children];
        const anchor = children.findIndex((child) =>
            child.getAttribute("style")?.includes("anchor-name"),
        );
        const overlay = children.findIndex(
            (child) => child.getAttribute("data-component") === "GlobeOverlay",
        );

        expect(anchor).toBeGreaterThanOrEqual(0);
        expect(overlay).toBeGreaterThan(anchor);
    });

    it("stands an anchor for a named arc as well as for the markers it runs between", () => {
        renderGlobe({
            markers: [{ id: "sf", location: [37.78, -122.44] }],
            arcs: [{ id: "sf-nyc", from: [37.78, -122.44], to: [40.71, -74.01] }],
        });
        expect(anchors()).toHaveLength(2);
    });

    it("draws a marker at the size the globe falls back to where it named none", () => {
        renderGlobe({ markers: [{ location: [37.78, -122.44] }] });
        expect(markerSizes()).toEqual([DEFAULT_GLOBE_MARKER_SIZE]);
    });

    it("draws every marker at the size the caller asked for them all to be drawn at", () => {
        renderGlobe({
            markerSize: 0.02,
            markers: [{ location: [37.78, -122.44] }, { location: [40.71, -74.01] }],
        });
        expect(markerSizes()).toEqual([0.02, 0.02]);
    });

    it("lets a marker that named a size of its own keep it", () => {
        renderGlobe({
            markerSize: 0.02,
            markers: [{ location: [37.78, -122.44], size: 0.08 }, { location: [40.71, -74.01] }],
        });
        expect(markerSizes()).toEqual([0.08, 0.02]);
    });
});

describe("Globe pointing", () => {
    // The globes here are told not to turn on their own. What is being read off them is where
    // they were pointed, and a globe turning on its own is never done travelling to anywhere
    //
    // The globe is drawn with the far side of the world towards the viewer before it is turned,
    // so facing a place means turning back through its longitude and tilting through its latitude
    const facing = (latitude: number, longitude: number) => [
        -(longitude * Math.PI) / 180 - Math.PI / 2,
        (latitude * Math.PI) / 180,
    ];

    // How far apart two angles face, however many whole turns apart they are written
    const sameAngle = (a: number, b: number) =>
        Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

    it("faces the place it was given from the first frame, without travelling to it", () => {
        renderGlobe({ latitude: 37.78, longitude: -122.44, spin: false });

        const [phi, theta] = rotation()!;
        const [expectedPhi, expectedTheta] = facing(37.78, -122.44);
        expect(phi).toBeCloseTo(expectedPhi, 6);
        expect(theta).toBeCloseTo(expectedTheta, 6);
        expect(frames.size).toBe(0);
    });

    it("stands unturned where it was given nowhere to face", () => {
        renderGlobe({ spin: false });
        expect(rotation()).toEqual([0, 0]);
    });

    it("travels to somewhere new rather than jumping to it", () => {
        const { rerender } = renderGlobe({ latitude: 37.78, longitude: -122.44, spin: false });
        const [startPhi] = rotation()!;

        rerender(<Globe latitude={35.68} longitude={139.65} spin={false} />);

        // The first frame is where the clock is started, so the globe is under way on the second
        runFrames(2);
        const [midPhi] = rotation()!;
        const [endPhi, endTheta] = facing(35.68, 139.65);
        expect(sameAngle(midPhi, startPhi)).toBeGreaterThan(0.01);
        expect(sameAngle(midPhi, endPhi)).toBeGreaterThan(0.01);

        runFrames(60);
        const [phi, theta] = rotation()!;
        expect(sameAngle(phi, endPhi)).toBeLessThan(0.001);
        expect(theta).toBeCloseTo(endTheta, 4);
    });

    it("takes the shorter way round rather than the long way about", () => {
        const { rerender } = renderGlobe({ longitude: 170, spin: false });
        const [startPhi] = rotation()!;

        rerender(<Globe longitude={-170} spin={false} />);
        runFrames(60);

        // Twenty degrees apart across the date line, and three hundred and forty the other way
        expect(Math.abs(rotation()![0] - startPhi)).toBeLessThan(Math.PI / 4);
    });

    it("stops drawing once it has arrived", () => {
        const { rerender } = renderGlobe({ latitude: 37.78, longitude: -122.44, spin: false });

        rerender(<Globe latitude={35.68} longitude={139.65} spin={false} />);
        runFrames(60);

        expect(frames.size).toBe(0);
    });

    it("tilts no further than short of the pole", () => {
        renderGlobe({ latitude: 89, longitude: 0, spin: false });
        expect(rotation()![1]).toBeCloseTo(1.2, 6);
    });
});

describe("Globe spinning", () => {
    it("turns on its own without being asked to", () => {
        renderGlobe();
        expect(globe()).toHaveAttribute("data-spinning", "true");

        const [before] = rotation()!;
        runFrames(2);
        const [after] = rotation()!;
        expect(after).toBeGreaterThan(before);
    });

    it("turns at the speed it was given, in radians a second", () => {
        renderGlobe({ speed: 1 });

        // The first frame has no time behind it to have turned through
        runFrames(1);
        const [start] = rotation()!;
        runFrames(1, 100);
        const [end] = rotation()!;
        expect(end - start).toBeCloseTo(0.1, 2);
    });

    it("stands still where it was told not to turn", () => {
        renderGlobe({ spin: false });
        expect(globe()).not.toHaveAttribute("data-spinning");
    });

    it("is never drawn again where it was told not to turn", () => {
        renderGlobe({ spin: false });
        expect(frames.size).toBe(0);
    });

    it("stands still for a reader who has asked for less movement", () => {
        vi.stubGlobal("matchMedia", () => ({
            matches: true,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));

        renderGlobe({ spin: true });
        expect(globe()).not.toHaveAttribute("data-spinning");
        expect(frames.size).toBe(0);
    });
});

describe("Globe turning by hand", () => {
    // The globes whose turning is read off below are told to stand still, so that whatever they
    // were turned by is the hand rather than the clock
    const drag = (from: number, to: number) => {
        fireEvent.pointerDown(globe(), { button: 0, clientX: from, clientY: 0 });
        fireEvent.pointerMove(globe(), { clientX: to, clientY: 0 });
    };

    it("turns with the hand that is dragging it", () => {
        renderGlobe({ interactive: true, spin: false });
        const [before] = rotation()!;

        drag(0, 50);
        runFrames(1);

        expect(rotation()![0]).toBeGreaterThan(before);
    });

    it("turns the other way for a hand going the other way", () => {
        renderGlobe({ interactive: true, spin: false });
        const [before] = rotation()!;

        drag(0, -50);
        runFrames(1);

        expect(rotation()![0]).toBeLessThan(before);
    });

    it("leaves the globe where the hand let go of it", () => {
        renderGlobe({ interactive: true, spin: false });

        drag(0, 50);
        runFrames(1);
        const [turned] = rotation()!;

        fireEvent.pointerUp(globe(), { button: 0 });
        runFrames(5);

        expect(rotation()![0]).toBeCloseTo(turned, 6);
        expect(frames.size).toBe(0);
    });

    it("is not turned by a hand on a globe that cannot be turned", () => {
        renderGlobe({ spin: false });
        const [before] = rotation()!;

        drag(0, 50);
        runFrames(1);

        expect(rotation()![0]).toBeCloseTo(before, 6);
    });

    it("turns for the arrow keys, so that it can be reached without a pointer", () => {
        renderGlobe({ interactive: true, spin: false });
        const [before] = rotation()!;

        fireEvent.keyDown(globe(), { key: "ArrowRight" });
        runFrames(60);
        expect(rotation()![0]).toBeGreaterThan(before);

        const [turned] = rotation()!;
        fireEvent.keyDown(globe(), { key: "ArrowLeft" });
        runFrames(60);
        expect(rotation()![0]).toBeLessThan(turned);
    });

    it("tilts for the arrow keys that tilt it", () => {
        renderGlobe({ interactive: true });

        fireEvent.keyDown(globe(), { key: "ArrowDown" });
        runFrames(60);
        expect(rotation()![1]).toBeGreaterThan(0);
    });

    it("keeps the page from scrolling under an arrow key that turned the globe", () => {
        renderGlobe({ interactive: true });
        const event = fireEvent.keyDown(globe(), { key: "ArrowRight", cancelable: true });
        expect(event).toBe(false);
    });

    it("leaves a key it does nothing with to the page", () => {
        renderGlobe({ interactive: true });
        const event = fireEvent.keyDown(globe(), { key: "Tab", cancelable: true });
        expect(event).toBe(true);
    });

    it("still calls a handler the caller passed alongside its own", () => {
        const onKeyDown = vi.fn();
        const onPointerDown = vi.fn();
        renderGlobe({ interactive: true, onKeyDown, onPointerDown });

        fireEvent.keyDown(globe(), { key: "ArrowRight" });
        fireEvent.pointerDown(globe(), { button: 0, clientX: 0, clientY: 0 });

        expect(onKeyDown).toHaveBeenCalledTimes(1);
        expect(onPointerDown).toHaveBeenCalledTimes(1);
    });
});

describe("Globe appearance", () => {
    it("draws the globe the colour the stylesheet says", () => {
        renderGlobe({ style: { "--globe-base-color": "0.2 0.4 0.6" } as React.CSSProperties });
        expect(lastUniform("baseColor")).toEqual([[0.2, 0.4, 0.6]]);
    });

    it("takes a colour written with commas as readily as one written with spaces", () => {
        renderGlobe({
            markers: [{ location: [37.78, -122.44] }],
            style: { "--globe-marker-color": "1, 0, 0" } as React.CSSProperties,
        });
        expect(lastUniform("markerColor")).toEqual([[1, 0, 0]]);
    });

    it("draws the land as finely as the stylesheet says", () => {
        renderGlobe({ style: { "--globe-map-samples": "24000" } as React.CSSProperties });
        expect(lastUniform("dots")).toEqual([24000]);
    });

    it("keeps the globe's own defaults where the stylesheet says nothing", () => {
        renderGlobe();
        // jsdom lays down no stylesheet, so nothing is read and the surface draws as it would
        // have drawn without ever being told
        expect(lastUniform("baseColor")).toEqual([[1, 1, 1]]);
    });
});
