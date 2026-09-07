import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { Globe as GlobeSurface } from "../../lib/react-globe";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { readGlobeAppearance } from "./globeAppearance";
import { useReducedMotion } from "./useReducedMotion";
import type { GlobeState } from "../../lib/react-globe";
import type { GlobeArc, GlobeMarker, GlobeProps } from "./Globe.types";

const classes = {
    root: "globe",
    surface: "globe-surface",
};

// How large a marker is drawn where it does not say, as a share of the globe's radius
export const DEFAULT_GLOBE_MARKER_SIZE = 0.05;

// How fast a globe turns on its own, in radians a second. A whole turn takes about twenty
// seconds: slow enough to read what is coming round, quick enough to see that it is moving
export const DEFAULT_GLOBE_SPEED = 0.3;

// What a screen reader hears a globe called where the caller has not named it. A globe showing
// something in particular is better named for that, but a name is worth having either way: it is
// what the region is found by and skipped past
const DEFAULT_LABEL = "Globe";

// How far the globe can be tilted, in radians. Short of the pole, since a globe tilted onto its
// end reads as a mistake rather than as a view
const MAX_TILT = 1.2;

// How much of what is left to travel is covered in a second, as the rate of an exponential ease.
// It is written against the clock rather than against the frame, so a globe travels at the same
// speed on a screen drawing thirty frames a second as on one drawing a hundred and twenty
const TRAVEL_RATE = 4;

// Near enough to have arrived. Anything closer than this is a fraction of a pixel on the screen
const TRAVEL_EPSILON = 0.0001;

// The longest step the globe is moved on in one frame, in seconds. A tab that has been left in
// the background comes back with a great deal of time to account for, and a globe that spun
// through all of it would arrive somewhere the reader has no way of following it to
const MAX_FRAME_STEP = 0.1;

// How far the globe turns for a pixel of dragging, and for a press of an arrow key. Turning is
// less sensitive than tilting on purpose: a hand dragging across a globe wanders up and down far
// more than it means to
const DRAG_TURN = 0.004;
const DRAG_TILT = 0.0012;
const KEY_STEP = 0.2;

const NO_MARKERS: readonly GlobeMarker[] = [];
const NO_ARCS: readonly GlobeArc[] = [];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const clampTilt = (theta: number) => Math.min(Math.max(theta, -MAX_TILT), MAX_TILT);

// How far round the globe is turned for a place at this longitude to face the viewer. The globe
// is drawn with the far side of the world towards us before it is turned at all, which is why
// this runs the other way from the longitude it is given
const longitudeToPhi = (longitude: number) => -toRadians(longitude) - Math.PI / 2;

const latitudeToTheta = (latitude: number) => clampTilt(toRadians(latitude));

// The same angle reached the shorter way round. A globe is turned to a place rather than spun to
// it, so somewhere three quarters of a turn ahead is reached by turning a quarter of a turn back
const nearestAngle = (target: number, from: number) => {
    const turn = Math.PI * 2;

    return from + ((((target - from) % turn) + turn * 1.5) % turn) - Math.PI;
};

// A dotted globe, with markers standing on it, arcs drawn between them, and anything the page
// wants to say held over either.
//
//     <Globe latitude={37.78} longitude={-122.44} markers={[{ id: "sf", location: [37.78, -122.44] }]}>
//         <Globe.Overlay marker="sf">San Francisco</Globe.Overlay>
//     </Globe>
//
// What a globe is usually wanted for is one of two things: a place, or the traffic between
// places. That is what the props settle, so either is written as one element rather than
// assembled, and everything else the surface can be told is settled by the stylesheet.
//
// The colours and the light are read from custom properties rather than passed in, since a
// shader is handed numbers and a theme is written in tokens. That is what lets a globe be
// repainted the way the rest of the library is, and what lets it follow the theme around it
// without being told which one is standing.
//
// The globe is drawn once for every state it is told rather than on a clock of its own, so one
// that is standing still costs nothing after it has been drawn. It is only set going while there
// is something to see: while it is spinning, which it does unless it is told not to, while it is
// travelling to somewhere new, and while a hand is on it
function Globe(
    props: GlobeProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        latitude,
        longitude,
        size,
        markers = NO_MARKERS,
        arcs = NO_ARCS,
        markerSize = DEFAULT_GLOBE_MARKER_SIZE,
        spin = true,
        speed = DEFAULT_GLOBE_SPEED,
        interactive = false,
        className,
        style,
        children,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onKeyDown,
        ...rest
    } = props;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);

    const reducedMotion = useReducedMotion();

    // Where the globe is pointed, as the angles it is turned and tilted by
    const targetPhi = longitude === undefined ? 0 : longitudeToPhi(longitude);
    const targetTheta = latitude === undefined ? 0 : latitudeToTheta(latitude);

    // Where the globe stands now, and where it is heading. Both are kept in references rather
    // than in state: they change on every frame of a globe that is moving, and a render for each
    // of those would cost more than drawing the globe does
    const phiRef = React.useRef(targetPhi);
    const thetaRef = React.useRef(targetTheta);
    const targetPhiRef = React.useRef(targetPhi);
    const targetThetaRef = React.useRef(targetTheta);

    // Where the globe was built facing. It is read once, so that the surface is drawn pointing
    // the right way from the first frame and is left alone from then on: everything after this
    // is the loop's to say, and a prop handed in alongside it would fight the loop for the globe
    const initial = React.useRef({ phi: targetPhi, theta: targetTheta }).current;

    const [travelling, setTravelling] = React.useState(false);
    const [interacting, setInteracting] = React.useState(false);

    const pointerRef = React.useRef<{ id: number; x: number; y: number } | null>(null);
    const lastFrameRef = React.useRef(0);

    // What the stylesheet says the globe is drawn like. It is read off the element rather than
    // passed in, so it cannot be read until there is an element to read it from
    const [appearance, setAppearance] = React.useState<GlobeState>({});

    React.useEffect(() => {
        const element = rootRef.current;
        if (!element) return;

        const read = () => setAppearance(readGlobeAppearance(element));

        read();

        if (typeof MutationObserver === "undefined") return;

        // The tokens are scoped to `[data-theme]`, which is set on an element above the globe
        // rather than on the globe itself, so what is watched is the document for that one
        // attribute rather than the element the globe stands in
        const observer = new MutationObserver(read);

        observer.observe(element.ownerDocument.documentElement, {
            attributeFilter: ["data-theme"],
            subtree: true,
        });

        return () => observer.disconnect();
    }, []);

    // Somewhere new to point at is travelled to rather than jumped to, which is what says where
    // the new place stands against the old one. The first pass is where the globe was built
    // facing, so there is nothing to travel from and the references already agree
    React.useEffect(() => {
        if (targetPhiRef.current === targetPhi && targetThetaRef.current === targetTheta) return;

        targetPhiRef.current = nearestAngle(targetPhi, phiRef.current);
        targetThetaRef.current = targetTheta;
        setTravelling(true);
    }, [targetPhi, targetTheta]);

    const spinning = spin && !reducedMotion;
    const animated = spinning || travelling || interacting;

    // The clock is started when the globe is set going, so a globe that has been standing still
    // does not travel through all the time it stood still on the first frame after it moves again
    React.useEffect(() => {
        lastFrameRef.current = 0;
    }, [animated]);

    // Every frame of a globe that is moving: it is turned on by whatever set it going, eased
    // towards wherever it is heading, and told where it has got to
    const handleRender = (state: GlobeState) => {
        const now = performance.now();
        const elapsed = lastFrameRef.current
            ? Math.min((now - lastFrameRef.current) / 1000, MAX_FRAME_STEP)
            : 0;
        lastFrameRef.current = now;

        if (spinning) {
            // A globe turning on its own is not travelling anywhere, so where it is heading is
            // carried along with it rather than left behind for the ease to close
            targetPhiRef.current += speed * elapsed;
            phiRef.current += speed * elapsed;
        }

        const remainingPhi = targetPhiRef.current - phiRef.current;
        const remainingTheta = targetThetaRef.current - thetaRef.current;
        const covered = 1 - Math.exp(-TRAVEL_RATE * elapsed);

        phiRef.current += remainingPhi * covered;
        thetaRef.current += remainingTheta * covered;

        if (
            travelling &&
            Math.abs(remainingPhi) < TRAVEL_EPSILON &&
            Math.abs(remainingTheta) < TRAVEL_EPSILON
        ) {
            // The last fraction of the distance is closed rather than halved for ever, and the
            // globe is left standing still so that it stops being drawn
            phiRef.current = targetPhiRef.current;
            thetaRef.current = targetThetaRef.current;
            setTravelling(false);
        }

        state.phi = phiRef.current;
        state.theta = thetaRef.current;
    };

    // Turning the globe by hand. A drag moves it as the hand moves, so where it is heading is
    // moved with it; a key moves where it is heading and lets the globe travel there
    const dragBy = (phi: number, theta: number) => {
        targetPhiRef.current += phi;
        phiRef.current += phi;
        targetThetaRef.current = clampTilt(targetThetaRef.current + theta);
        thetaRef.current = clampTilt(thetaRef.current + theta);
    };

    const stepBy = (phi: number, theta: number) => {
        targetPhiRef.current += phi;
        targetThetaRef.current = clampTilt(targetThetaRef.current + theta);
        setTravelling(true);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);

        if (!interactive || event.defaultPrevented || event.button !== 0) return;

        pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        // The globe goes on being turned by a hand that has wandered off it, which is what keeps
        // a drag from being dropped half way round
        event.currentTarget.setPointerCapture?.(event.pointerId);
        setInteracting(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);

        const pointer = pointerRef.current;
        if (!pointer || pointer.id !== event.pointerId) return;

        // How far the hand has come since it was last seen rather than since it went down, so a
        // globe whose tilt has run up against its limit is not left with a drag to undo first
        dragBy((event.clientX - pointer.x) * DRAG_TURN, (event.clientY - pointer.y) * DRAG_TILT);

        pointer.x = event.clientX;
        pointer.y = event.clientY;
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.type === "pointercancel") {
            onPointerCancel?.(event);
        } else {
            onPointerUp?.(event);
        }

        const pointer = pointerRef.current;
        if (!pointer || pointer.id !== event.pointerId) return;

        event.currentTarget.releasePointerCapture?.(event.pointerId);
        pointerRef.current = null;
        setInteracting(false);
    };

    // The arrow keys turn the globe the way dragging does, so that a reader without a pointer
    // reaches the far side of it the same way and by the same amount
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (!interactive || event.defaultPrevented) return;

        switch (event.key) {
            case "ArrowLeft":
                stepBy(-KEY_STEP, 0);
                break;
            case "ArrowRight":
                stepBy(KEY_STEP, 0);
                break;
            case "ArrowUp":
                stepBy(0, -KEY_STEP);
                break;
            case "ArrowDown":
                stepBy(0, KEY_STEP);
                break;
            default:
                return;
        }

        // The page is not scrolled by an arrow key that has turned the globe instead
        event.preventDefault();
    };

    // The size a marker is drawn at is filled in here rather than by the caller, and the list is
    // only built again when it or the markers change: a fresh list on every render would have the
    // surface upload every marker again for a globe that has not changed
    const surfaceMarkers = React.useMemo(
        () => markers.map((marker) => ({ ...marker, size: marker.size ?? markerSize })),
        [markers, markerSize],
    );

    // A name given by the caller stands, whichever way it was given. Only where neither was is
    // the globe named for what it is, since a region without a name is one a reader cannot tell
    // from the next
    const label = ariaLabelledBy ? undefined : (ariaLabel ?? DEFAULT_LABEL);

    return (
        <div
            ref={mergedRef}
            // A globe holds what is written over it and can be turned about within, so it is a
            // region rather than a picture: a picture would take the labels standing on it out of
            // reach of the reader they were written for
            role="region"
            tabIndex={interactive ? 0 : undefined}
            aria-label={label}
            aria-labelledby={ariaLabelledBy}
            className={classNames(classes.root, className)}
            style={
                {
                    ...style,
                    // How much of the page the globe takes is the one thing the class cannot
                    // settle on its own, since it is the caller who says
                    "--globe-size": typeof size === "number" ? `${size}px` : size,
                } as React.CSSProperties
            }
            data-component="Globe"
            data-interactive={interactive || undefined}
            data-spinning={spinning || undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            {...rest}
        >
            <GlobeSurface
                className={classes.surface}
                // The surface fills the box the class above sized, rather than being given a size
                // of its own to disagree with it
                width="100%"
                height="100%"
                phi={initial.phi}
                theta={initial.theta}
                markers={surfaceMarkers}
                arcs={arcs}
                onRender={animated ? handleRender : undefined}
                {...appearance}
            >
                {children}
            </GlobeSurface>
        </div>
    );
}

Globe.displayName = "Globe";

export default fixedForwardRef(Globe);
