import * as React from "react";
import { createGlobe, GLOBE_STATE_KEYS } from "./renderer";
import { GlobeContext } from "./GlobeContext";
import type { GlobeInstance, GlobeProps, GlobeState } from "./types";

// How many device pixels a globe is drawn at to the CSS pixel where it was not told. A screen can
// report three or four, and a globe drawn at that many costs the GPU more than the eye can tell,
// so the ratio is capped at two
const MAX_DEVICE_PIXEL_RATIO = 2;

const getDevicePixelRatio = () => Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);

// A globe, and the ground everything held over one stands on. The canvas fills the element the
// component renders, which is positioned so that an overlay written inside it is held against
// the anchors put there for the named markers and arcs.
//
// What the globe is built with is read once, when the canvas is first there: the pixel ratio and
// what the context is asked for cannot change once it stands. Everything else is handed on as it
// changes, and a globe given an `onRender` is drawn on every frame besides, told whatever the
// callback fills in. A globe given neither a width nor a height is as wide as whatever it was
// put in and as tall as it is wide, since a globe is round
function Globe({
    children,
    className,
    style,
    width,
    height,
    devicePixelRatio,
    context,
    onRender,
    ...state
}: GlobeProps) {
    const [globe, setGlobe] = React.useState<GlobeInstance>();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // The callback is read off a reference rather than closed over, so a caller passing a fresh
    // function on every render does not have the loop stopped and started again each time
    const onRenderRef = React.useRef(onRender);

    React.useEffect(() => {
        onRenderRef.current = onRender;
    }, [onRender]);

    React.useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;

        // The canvas is drawn at the size the element stands at rather than at a size passed
        // in, so a globe given its width in percent is still drawn a pixel to the pixel
        const instance = createGlobe(canvas, {
            ...state,
            width: root.clientWidth,
            height: root.clientHeight,
            devicePixelRatio: devicePixelRatio ?? getDevicePixelRatio(),
            context,
        });

        setGlobe(instance);

        return () => {
            instance.destroy();
            setGlobe(undefined);
        };
        // The globe is built once, against the canvas it draws into, with whatever the first
        // render passed. Everything it can be told afterwards is handed on by the effect below
    }, []);

    React.useEffect(() => {
        globe?.update(state);
        // Each option is watched on its own rather than as the object they arrive in, which is
        // a fresh one on every render. The list is the same length every time, which is all
        // React asks of it
    }, [globe, ...GLOBE_STATE_KEYS.map((key) => state[key])]);

    // The canvas is drawn again at whatever size the element comes to stand at, so a globe in a
    // column that narrows is not left stretched
    React.useEffect(() => {
        const root = rootRef.current;
        if (!globe || !root || typeof ResizeObserver === "undefined") return;

        const observer = new ResizeObserver(() => {
            globe.update({ width: root.clientWidth, height: root.clientHeight });
        });

        observer.observe(root);

        return () => observer.disconnect();
    }, [globe]);

    const animated = onRender !== undefined;

    React.useEffect(() => {
        if (!globe || !animated) return;

        let frame = 0;

        const render = () => {
            // The callback is handed an empty state to write on, and may hand one back instead
            const patch: GlobeState = {};
            const next = onRenderRef.current?.(patch);

            globe.update(next ?? patch);
            frame = requestAnimationFrame(render);
        };

        frame = requestAnimationFrame(render);

        return () => cancelAnimationFrame(frame);
    }, [globe, animated]);

    return (
        <GlobeContext.Provider value={globe}>
            <div
                ref={rootRef}
                className={className}
                style={{
                    position: "relative",
                    width: width ?? "100%",
                    height,
                    aspectRatio: height === undefined ? "1" : undefined,
                    ...style,
                }}
                data-component="Globe"
            >
                <canvas
                    ref={canvasRef}
                    style={{ display: "block", width: "100%", height: "100%" }}
                />
                {children}
            </div>
        </GlobeContext.Provider>
    );
}

Globe.displayName = "Globe";

export { Globe };
