import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Heading } from "../heading";
import { ProgressBar } from "../progress-bar";
import { Stack } from "../stack";
import { Text } from "../text";
import { Globe } from ".";

const classes = {
    // A globe is drawn to whatever room it is given, so the stories give it a column to stand in
    // rather than letting it run the width of the canvas
    frame: "w-[32rem] max-w-full",
    // Two globes read side by side, each keeping half of the same column
    pair: "grid grid-cols-2 gap-[var(--stack-gap-normal)] w-[32rem] max-w-full",
    // What a label held over a marker is dressed in. It stands clear of the surface on a ground
    // of its own, since the land beneath it is dotted rather than solid
    label:
        "px-[var(--base-size-4)] py-[var(--base-size-2)] rounded-[var(--border-radius-small)] " +
        "bg-[var(--overlay-background-color)] text-[var(--foreground-color-default)] " +
        "shadow-[var(--shadow-resting-small)] whitespace-nowrap " +
        "text-[length:var(--text-caption-size)] leading-[var(--text-caption-line-height)] " +
        "transition-opacity duration-[var(--duration-medium)]",
    // The fade an overlay makes as what it is held over goes round the back. It belongs to
    // whatever carries the opacity the globe writes, which is the overlay rather than what is
    // dressed inside it
    fade: "transition-opacity duration-medium",
    // The mark standing over a region a network is served from, with the code it is known by
    // beneath it. The code is set in the monospaced stack, since it is read off as an identifier
    // rather than as a word
    edge: "flex flex-col items-center gap-[var(--base-size-2)] transition-opacity duration-medium",
    edgeMark: "text-[length:var(--base-size-12)] leading-none text-foreground-default",
    edgeLabel:
        "px-[var(--base-size-4)] rounded-[var(--border-radius-small)] " +
        "bg-[var(--overlay-background-color)] text-foreground-default whitespace-nowrap " +
        "shadow-[var(--shadow-resting-small)] font-[family-name:var(--font-stack-monospace)] " +
        "text-[length:var(--text-caption-size)] leading-[var(--text-caption-line-height)]",
    // A satellite is an emoji rather than a dressed label, so it asks for nothing but a size
    satellite: "text-[length:var(--base-size-24)] leading-none transition-opacity duration-medium",
    // The badge over somewhere on air: a dot beating beside the word, on the ground the library
    // gives anything standing for a state rather than for content
    live:
        "flex items-center gap-[var(--base-size-4)] px-[var(--base-size-6)] " +
        "py-[var(--base-size-2)] rounded-[var(--border-radius-small)] " +
        "bg-background-neutral-emphasis shadow-[var(--shadow-resting-small)] " +
        "whitespace-nowrap transition-opacity duration-medium",
    liveDot:
        "size-[var(--base-size-8)] rounded-[var(--border-radius-full)] bg-foreground-danger " +
        "motion-safe:animate-pulse",
    liveText:
        "font-semibold uppercase tracking-[0.1em] text-foreground-on-emphasis " +
        "text-[length:var(--text-caption-size)] leading-[var(--text-caption-line-height)]",
    // A region that is pressed rather than read. It carries none of the page's own chrome, since
    // what it has to look like is a marker's label rather than a button standing on the page
    region:
        "flex appearance-none flex-col items-center gap-[var(--base-size-2)] border-0 " +
        "px-[var(--base-size-6)] py-[var(--base-size-4)] rounded-[var(--border-radius-small)] " +
        "bg-background-neutral-emphasis text-foreground-on-emphasis cursor-pointer " +
        "shadow-[var(--shadow-resting-small)]",
    regionName:
        "font-semibold uppercase tracking-[0.08em] " +
        "text-[length:var(--text-caption-size)] leading-[var(--text-caption-line-height)]",
    regionUsers:
        "opacity-80 text-[length:var(--text-caption-size)] " +
        "leading-[var(--text-caption-line-height)]",
    // What is being read in a city, and which way that is going. The count leads, since it is
    // what the eye is after, and the trend follows it painted by which way it points
    readers:
        "flex items-baseline gap-[var(--base-size-4)] px-[var(--base-size-6)] " +
        "py-[var(--base-size-2)] rounded-[var(--border-radius-small)] " +
        "bg-[var(--overlay-background-color)] shadow-[var(--shadow-resting-small)] " +
        "whitespace-nowrap transition-opacity duration-medium",
    readersCount: "font-semibold text-foreground-default",
    readersTrend:
        "text-[length:var(--text-caption-size)] leading-[var(--text-caption-line-height)]",
    trendUp: "text-foreground-success",
    trendDown: "text-foreground-danger",
    // A signal going out from a place: two rings leaving the marker one after the other, and the
    // dot they leave from. The overlay is already positioned, so the rings are laid over it
    pulse: "size-[var(--base-size-40)] flex items-center justify-center transition-opacity duration-medium",
    pulseRing:
        "absolute inset-0 rounded-[var(--border-radius-full)] border-2 border-foreground-accent " +
        "motion-safe:animate-ping",
    pulseDot: "size-[var(--base-size-8)] rounded-[var(--border-radius-full)] bg-foreground-accent",
    // How much of the load a place is carrying, read off the library's own progress bar
    bar:
        "flex w-[var(--base-size-80)] flex-col items-center gap-[var(--base-size-2)] " +
        "px-[var(--base-size-6)] py-[var(--base-size-4)] rounded-[var(--border-radius-small)] " +
        "bg-[var(--overlay-background-color)] shadow-[var(--shadow-resting-small)] " +
        "transition-opacity duration-medium",
    barLabel:
        "uppercase tracking-[0.08em] text-foreground-default " +
        "text-[length:var(--text-caption-size)] leading-[var(--text-caption-line-height)]",
    barValue:
        "font-semibold text-foreground-default text-[length:var(--text-caption-size)] " +
        "leading-[var(--text-caption-line-height)]",
};

const CITIES = [
    { id: "sf", name: "San Francisco", location: [37.78, -122.44] as [number, number] },
    { id: "nyc", name: "New York", location: [40.71, -74.01] as [number, number] },
    { id: "london", name: "London", location: [51.51, -0.13] as [number, number] },
    { id: "tokyo", name: "Tokyo", location: [35.68, 139.65] as [number, number] },
    { id: "sydney", name: "Sydney", location: [-33.87, 151.21] as [number, number] },
];

const ROUTES = [
    {
        id: "sf-tokyo",
        name: "SFO → HND",
        from: [37.78, -122.44] as [number, number],
        to: [35.68, 139.65] as [number, number],
    },
    {
        id: "nyc-london",
        name: "JFK → LHR",
        from: [40.71, -74.01] as [number, number],
        to: [51.51, -0.13] as [number, number],
    },
];

// The regions a network is served from, named the way an edge network names them, and the
// traffic running between them
const EDGES = [
    { id: "edge-iad", location: [38.95, -77.45] as [number, number], region: "iad1" },
    { id: "edge-sfo", location: [37.62, -122.38] as [number, number], region: "sfo1" },
    { id: "edge-cdg", location: [49.01, 2.55] as [number, number], region: "cdg1" },
    { id: "edge-hnd", location: [35.55, 139.78] as [number, number], region: "hnd1" },
    { id: "edge-syd", location: [-33.95, 151.18] as [number, number], region: "syd1" },
    { id: "edge-gru", location: [-23.43, -46.47] as [number, number], region: "gru1" },
    { id: "edge-sin", location: [1.36, 103.99] as [number, number], region: "sin1" },
    { id: "edge-arn", location: [59.65, 17.93] as [number, number], region: "arn1" },
    { id: "edge-dub", location: [53.43, -6.25] as [number, number], region: "dub1" },
    { id: "edge-bom", location: [19.09, 72.87] as [number, number], region: "bom1" },
];

const EDGE_ROUTES = [
    {
        id: "edge-iad-cdg",
        from: [38.95, -77.45] as [number, number],
        to: [49.01, 2.55] as [number, number],
    },
    {
        id: "edge-sfo-hnd",
        from: [37.62, -122.38] as [number, number],
        to: [35.55, 139.78] as [number, number],
    },
    {
        id: "edge-cdg-sin",
        from: [49.01, 2.55] as [number, number],
        to: [1.36, 103.99] as [number, number],
    },
    {
        id: "edge-iad-gru",
        from: [38.95, -77.45] as [number, number],
        to: [-23.43, -46.47] as [number, number],
    },
    {
        id: "edge-hnd-syd",
        from: [35.55, 139.78] as [number, number],
        to: [-33.95, 151.18] as [number, number],
    },
    {
        id: "edge-cdg-bom",
        from: [49.01, 2.55] as [number, number],
        to: [19.09, 72.87] as [number, number],
    },
];

// Somewhere overhead rather than somewhere on the ground, which is what markers held well off
// the surface stand for
const SATELLITES = [
    { id: "sat-1", location: [45, -120] as [number, number] },
    { id: "sat-2", location: [30, 45] as [number, number] },
    { id: "sat-3", location: [-15, 100] as [number, number] },
    { id: "sat-4", location: [60, -30] as [number, number] },
    { id: "sat-5", location: [-40, -60] as [number, number] },
    { id: "sat-6", location: [10, 150] as [number, number] },
    { id: "sat-7", location: [55, 80] as [number, number] },
    { id: "sat-8", location: [-25, 20] as [number, number] },
    { id: "sat-9", location: [70, 25] as [number, number] },
    { id: "sat-10", location: [-5, -75] as [number, number] },
    { id: "sat-11", location: [35, -95] as [number, number] },
    { id: "sat-12", location: [-50, 140] as [number, number] },
    { id: "sat-13", location: [20, -20] as [number, number] },
    { id: "sat-14", location: [50, 120] as [number, number] },
    { id: "sat-15", location: [-30, 70] as [number, number] },
    { id: "sat-16", location: [5, -150] as [number, number] },
];

// The places something is going out from live
const BROADCASTS = [
    { id: "live-sf", location: [37.78, -122.44] as [number, number] },
    { id: "live-nyc", location: [40.71, -74.01] as [number, number] },
    { id: "live-london", location: [51.51, -0.13] as [number, number] },
    { id: "live-paris", location: [48.86, 2.35] as [number, number] },
    { id: "live-tokyo", location: [35.68, 139.65] as [number, number] },
    { id: "live-sydney", location: [-33.87, 151.21] as [number, number] },
];

// The regions a service is run in, and how many are on it in each
const REGIONS = [
    { id: "region-hq", location: [37.78, -122.44] as [number, number], name: "HQ", users: 1420 },
    { id: "region-eu", location: [52.52, 13.41] as [number, number], name: "EU", users: 892 },
    { id: "region-asia", location: [35.68, 139.65] as [number, number], name: "Asia", users: 2103 },
    {
        id: "region-latam",
        location: [-23.55, -46.63] as [number, number],
        name: "LATAM",
        users: 567,
    },
    { id: "region-mena", location: [25.2, 55.27] as [number, number], name: "MENA", users: 734 },
    { id: "region-apac", location: [-33.87, 151.21] as [number, number], name: "APAC", users: 445 },
];

// How many were read in each city this hour, and which way that is going against the last
const READERS = [
    { id: "read-nyc", location: [40.71, -74.01] as [number, number], count: 847, trend: 12 },
    { id: "read-lon", location: [51.51, -0.13] as [number, number], count: 623, trend: -3 },
    { id: "read-tyo", location: [35.68, 139.65] as [number, number], count: 412, trend: 8 },
    { id: "read-par", location: [48.86, 2.35] as [number, number], count: 385, trend: 5 },
    { id: "read-syd", location: [-33.87, 151.21] as [number, number], count: 201, trend: 15 },
    { id: "read-ber", location: [52.52, 13.41] as [number, number], count: 178, trend: -1 },
];

// Four places whose signal is being watched, each starting a moment after the last so that they
// do not all beat as one
const PULSES = [
    { id: "pulse-london", location: [51.51, -0.13] as [number, number], delay: 0 },
    { id: "pulse-nyc", location: [40.71, -74.01] as [number, number], delay: 0.5 },
    { id: "pulse-tokyo", location: [35.68, 139.65] as [number, number], delay: 1 },
    { id: "pulse-sydney", location: [-33.87, 151.21] as [number, number], delay: 1.5 },
];

// How much of the load each place is carrying, as a share of all of it
const SHARES = [
    { id: "share-nyc", location: [40.71, -74.01] as [number, number], name: "NYC", value: 85 },
    { id: "share-lon", location: [51.51, -0.13] as [number, number], name: "London", value: 62 },
    { id: "share-tyo", location: [35.68, 139.65] as [number, number], name: "Tokyo", value: 94 },
    { id: "share-sin", location: [1.35, 103.82] as [number, number], name: "Singapore", value: 78 },
];

export default {
    title: "Components/Globe/Features",
};

// A Globe On Its Own. Given nowhere to face it sets off from the far side of the world towards
// the reader, and given no width it is as wide as whatever it was put in
export const Default: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe />
    </div>
);

// Facing Somewhere, given the way an address is looked up rather than the way the globe draws it
export const APlace: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe latitude={35.68} longitude={139.65} aria-label="Tokyo" />
    </div>
);

// Dots Standing On The Surface. A marker says where it is and nothing else, and the globe draws
// them all at the same size unless one of them says otherwise
export const Markers: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={CITIES} aria-label="Where our readers are" />
    </div>
);

// One Marker Picked Out From The Rest, by giving it a size and a colour of its own. A colour is
// three numbers between nought and one, since it is handed to a shader rather than to the page
export const AMarkerOfItsOwn: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe
            markers={[
                ...CITIES.filter((city) => city.id !== "tokyo"),
                { id: "tokyo", location: [35.68, 139.65], size: 0.09, color: [1, 0.35, 0.2] },
            ]}
            aria-label="Where our readers are"
        />
    </div>
);

// Curves Drawn Between Places, rising off the surface between their two ends and hidden where
// they pass round the back
export const Arcs: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={CITIES} arcs={ROUTES} aria-label="Our routes" />
    </div>
);

// Labels Held Over The Markers. Each is written as `Globe.Overlay` and says which marker it
// belongs to, and the globe moves it as it turns: an overlay is held in place by the browser
// rather than drawn again on every frame, and fades out as what it names goes round the back
export const Labels: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={CITIES} aria-label="Where our readers are">
            {CITIES.map((city) => (
                <Globe.Overlay key={city.id} marker={city.id} className={classes.label}>
                    {city.name}
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// Labels Held Over The Arcs, which stand at the highest point of the curve rather than at either
// end of it
export const ArcLabels: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={CITIES} arcs={ROUTES} aria-label="Our routes">
            {ROUTES.map((route) => (
                <Globe.Overlay key={route.id} arc={route.id} className={classes.label}>
                    {route.name}
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// Standing Still. A globe turns on its own unless it is told not to, which is worth telling it
// where the page around it already has movement of its own. A reader who has asked for less
// movement is left with the globe standing still whether it was told to or not, which is the same
// globe without the turning
export const StandingStill: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={CITIES} spin={false} aria-label="Where our readers are" />
    </div>
);

// How Fast It Turns, in radians a second. A whole turn takes about twenty seconds where the
// speed is left out
export const Speed: StoryFn<typeof Globe> = () => (
    <div className={classes.pair}>
        <Globe speed={0.1} markers={CITIES} aria-label="Turning slowly" />
        <Globe speed={0.8} markers={CITIES} aria-label="Turning quickly" />
    </div>
);

// Turned By Hand. A globe that can be turned takes focus, so the arrow keys reach the far side of
// it as readily as dragging does
export const Interactive: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe interactive markers={CITIES} aria-label="Where our readers are">
            {CITIES.map((city) => (
                <Globe.Overlay key={city.id} marker={city.id} className={classes.label}>
                    {city.name}
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// Travelling From One Place To Another. Somewhere new is travelled to rather than jumped to,
// which is what says where the new place stands against the old one, and the globe takes the
// shorter way round to get there
export const Travelling: StoryFn<typeof Globe> = () => {
    const [city, setCity] = React.useState(CITIES[0]!);

    return (
        <Stack gap="normal" className={classes.frame}>
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                {CITIES.map((candidate) => (
                    <Button
                        key={candidate.id}
                        variant={candidate.id === city.id ? "primary" : "default"}
                        onClick={() => setCity(candidate)}
                    >
                        {candidate.name}
                    </Button>
                ))}
            </Stack>
            <Globe
                latitude={city.location[0]}
                longitude={city.location[1]}
                markers={CITIES}
                aria-label={city.name}
            >
                <Globe.Overlay marker={city.id} className={classes.label}>
                    {city.name}
                </Globe.Overlay>
            </Globe>
        </Stack>
    );
};

// How Wide The Globe Stands. A number is read as pixels; anything else is passed to CSS as it was
// written. Only the width is asked for, since a globe is round
export const Size: StoryFn<typeof Globe> = () => (
    <Stack direction="horizontal" gap="normal" align="center">
        <Globe size={96} markers={CITIES} aria-label="Small" />
        <Globe size={160} markers={CITIES} aria-label="Medium" />
        <Globe size={240} markers={CITIES} aria-label="Large" />
    </Stack>
);

// Repainted From The Stylesheet. Everything a globe is drawn from is a custom property, so it can
// be repainted without unpicking the classes it came with. They are numbers rather than colours
// because they are handed to a shader: three between nought and one for a colour, and one for
// anything measured
export const Repainted: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe
            markers={CITIES}
            aria-label="Where our readers are"
            style={
                {
                    "--globe-base-color": "0.13 0.15 0.2",
                    "--globe-glow-color": "0.35 0.2 0.5",
                    "--globe-marker-color": "1 0.55 0.2",
                    "--globe-dark": 1,
                    "--globe-map-brightness": 8,
                } as React.CSSProperties
            }
        />
    </div>
);

// Named By What Stands Above It. A globe is a region of the page, so it carries a name to be
// found and skipped past by. Where a heading already says what it shows, the globe is pointed at
// that heading rather than given a name of its own to fall out of step with
export const Named: StoryFn<typeof Globe> = () => (
    <Stack gap="condensed" className={classes.frame}>
        <Heading as="h2" size="small" id="readers">
            Where our readers are
        </Heading>
        <Text size="small">Every dot is a city we were read in this week.</Text>
        <Globe aria-labelledby="readers" markers={CITIES} />
    </Stack>
);

// An Edge Network. Every region a network is served from stands a mark of its own, with the code
// it is known by beneath it, and the traffic between them is drawn as arcs. The markers are drawn
// small on purpose: what says where a region is here is the mark held over it rather than the dot
export const CDN: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe
            markers={EDGES}
            arcs={EDGE_ROUTES}
            markerSize={0.012}
            aria-label="Where we are served from"
        >
            {EDGES.map((edge) => (
                <Globe.Overlay key={edge.id} marker={edge.id} className={classes.edge}>
                    <span className={classes.edgeMark} aria-hidden="true">
                        ▲
                    </span>
                    <span className={classes.edgeLabel}>{edge.region}</span>
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// Satellites Overhead. How far a marker stands off the surface is the stylesheet's to say, so a
// globe whose markers are in orbit rather than dotted onto the land is the same globe with one
// property set
export const Satellites: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe
            markers={SATELLITES}
            markerSize={0.03}
            aria-label="What is overhead"
            style={{ "--globe-marker-elevation": 0.15 } as React.CSSProperties}
        >
            {SATELLITES.map((satellite) => (
                <Globe.Overlay
                    key={satellite.id}
                    marker={satellite.id}
                    className={classes.satellite}
                >
                    🛰️
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// A Badge Over Somewhere On Air. The dot beats on its own, which is the page's movement rather
// than the reader's, so a reader who has asked for less is left with it standing still
export const LiveBadge: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={BROADCASTS} aria-label="Where we are on air">
            {BROADCASTS.map((broadcast) => (
                <Globe.Overlay key={broadcast.id} marker={broadcast.id} className={classes.live}>
                    <span className={classes.liveDot} aria-hidden="true" />
                    <span className={classes.liveText}>Live</span>
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// Markers Pressed Rather Than Read. An overlay lets the pointer through by default, so one meant
// to be pressed takes it back; what is pressed is a button rather than a label listening for a
// click, so it is reached from the keyboard as readily as from the hand
export const InteractiveMarkers: StoryFn<typeof Globe> = () => {
    const [open, setOpen] = React.useState<string>();

    return (
        <div className={classes.frame}>
            <Globe interactive markers={REGIONS} aria-label="Where the service runs">
                {REGIONS.map((region) => (
                    <Globe.Overlay
                        key={region.id}
                        marker={region.id}
                        className={classes.fade}
                        style={{ pointerEvents: "auto" }}
                    >
                        <button
                            type="button"
                            className={classes.region}
                            aria-expanded={open === region.id}
                            onClick={() =>
                                setOpen((current) =>
                                    current === region.id ? undefined : region.id,
                                )
                            }
                        >
                            <span className={classes.regionName}>{region.name}</span>
                            {open === region.id && (
                                <span className={classes.regionUsers}>
                                    {region.users.toLocaleString()} online
                                </span>
                            )}
                        </button>
                    </Globe.Overlay>
                ))}
            </Globe>
        </div>
    );
};

// What Is Being Read Right Now, held over the cities it is being read in. The markers are drawn
// larger than usual, since each of them is one reading rather than one place
export const Analytics: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={READERS} markerSize={0.04} aria-label="Where we are being read">
            {READERS.map((city) => (
                <Globe.Overlay key={city.id} marker={city.id} className={classes.readers}>
                    <span className={classes.readersCount}>{city.count}</span>
                    <span
                        className={`${classes.readersTrend} ${
                            city.trend >= 0 ? classes.trendUp : classes.trendDown
                        }`}
                    >
                        {city.trend >= 0 ? "↑" : "↓"} {Math.abs(city.trend)}%
                    </span>
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// A Signal Going Out From A Place. The rings leave the marker rather than standing above it, so
// the overlay is held over its middle instead: an overlay stands where it was positioned, and
// where it was positioned is open to being said again
export const Pulse: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={PULSES} aria-label="Where the signal is going out">
            {PULSES.map((place) => (
                <Globe.Overlay
                    key={place.id}
                    marker={place.id}
                    className={classes.pulse}
                    style={{ bottom: "anchor(center)", translate: "-50% 50%" }}
                >
                    <span
                        className={classes.pulseRing}
                        style={{ animationDelay: `${place.delay}s` }}
                        aria-hidden="true"
                    />
                    <span
                        className={classes.pulseRing}
                        style={{ animationDelay: `${place.delay + 0.5}s` }}
                        aria-hidden="true"
                    />
                    <span className={classes.pulseDot} aria-hidden="true" />
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);

// How The Load Is Spread, read off the library's own progress bar. What is held over a globe is
// the page's rather than the shader's, so anything the rest of the library draws can stand there
export const Bars: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={SHARES} aria-label="How the load is spread">
            {SHARES.map((share) => (
                <Globe.Overlay key={share.id} marker={share.id} className={classes.bar}>
                    <span className={classes.barLabel}>{share.name}</span>
                    <ProgressBar
                        progress={share.value}
                        size="small"
                        variant="accent"
                        className="w-full"
                        aria-label={`Share of the load carried in ${share.name}`}
                    />
                    <span className={classes.barValue}>{share.value}%</span>
                </Globe.Overlay>
            ))}
        </Globe>
    </div>
);
