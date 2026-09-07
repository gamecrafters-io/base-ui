import * as React from "react";
import { Button, Globe as GlobeComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A globe is drawn to whatever room it is given, so the page gives it a column to stand in
    // rather than letting it run the width of the card
    frame: "w-[24rem] max-w-full",
    // Two globes read side by side, each keeping half of the same column
    pair: "grid grid-cols-2 gap-[var(--stack-gap-normal)] w-[24rem] max-w-full",
    // What a label held over a marker is dressed in. It stands clear of the surface on a ground of
    // its own, since the land beneath it is dotted rather than solid
    label:
        "px-[var(--base-size-4)] py-[var(--base-size-2)] rounded-[var(--border-radius-small)] " +
        "bg-[var(--overlay-background-color)] text-[var(--foreground-color-default)] " +
        "shadow-[var(--shadow-resting-small)] whitespace-nowrap " +
        "text-[length:var(--text-caption-size)] leading-[var(--text-caption-line-height)] " +
        "transition-opacity duration-medium",
    muted: "text-[var(--foreground-color-muted)]",
};

// Where the globe is pointed on this page, and what is dotted onto it. It is written once and read
// out into markers, labels and buttons, since a set of places is come by as a list rather than
// typed out one at a time
const cities = [
    { id: "sf", name: "San Francisco", location: [37.78, -122.44] as [number, number] },
    { id: "nyc", name: "New York", location: [40.71, -74.01] as [number, number] },
    { id: "london", name: "London", location: [51.51, -0.13] as [number, number] },
    { id: "tokyo", name: "Tokyo", location: [35.68, 139.65] as [number, number] },
    { id: "sydney", name: "Sydney", location: [-33.87, 151.21] as [number, number] },
];

// The traffic drawn between them. Naming an arc is what gives it an anchor at its highest point,
// the way naming a marker gives one at the marker
const routes = [
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

// What the examples that read off the lists have to have in hand before they can be drawn. Each is
// written once and reached for by the example that needs it
const citiesSetup = `const cities = [
    { id: "sf", name: "San Francisco", location: [37.78, -122.44] },
    { id: "nyc", name: "New York", location: [40.71, -74.01] },
    { id: "london", name: "London", location: [51.51, -0.13] },
    { id: "tokyo", name: "Tokyo", location: [35.68, 139.65] },
    { id: "sydney", name: "Sydney", location: [-33.87, 151.21] },
];`;

const routesSetup = `const routes = [
    {
        id: "sf-tokyo",
        name: "SFO → HND",
        from: [37.78, -122.44],
        to: [35.68, 139.65],
    },
    {
        id: "nyc-london",
        name: "JFK → LHR",
        from: [40.71, -74.01],
        to: [51.51, -0.13],
    },
];`;

// The plainest globe there is: nothing said at all. Given nowhere to face it sets off from the far
// side of the world towards the reader, given no width it is as wide as whatever it was put in, and
// it turns on its own, since a globe standing still reads as a picture of one.
//
// The column it stands in is the page's own furniture, as the card around it is, so the listing
// beneath is of the globe alone.
//
// The page and the component it is about are both called Globe, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Globe, as an application
// importing it would
const defaultPreview = (
    <div className={classes.frame}>
        <GlobeComponent />
    </div>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Globe />`;

// Somewhere to face, given the way an address is looked up rather than the way the globe draws it
const placePreview = (
    <div className={classes.frame}>
        <GlobeComponent latitude={35.68} longitude={139.65} aria-label="Tokyo" />
    </div>
);

const placeCode = `<Globe latitude={35.68} longitude={139.65} aria-label="Tokyo" />`;

// Dots standing on the surface. A marker says where it is and nothing else, and the globe draws
// them all at the same size unless one of them says otherwise
const markersPreview = (
    <div className={classes.frame}>
        <GlobeComponent markers={cities} aria-label="Where our readers are" />
    </div>
);

const markersCode = `<Globe markers={cities} aria-label="Where our readers are" />`;

// Curves drawn between places, rising off the surface between their two ends and hidden where they
// pass round the back
const arcsPreview = (
    <div className={classes.frame}>
        <GlobeComponent markers={cities} arcs={routes} aria-label="Our routes" />
    </div>
);

const arcsCode = `<Globe markers={cities} arcs={routes} aria-label="Our routes" />`;

// Labels held over the markers. Each says which marker it belongs to, and the globe moves it as it
// turns: an overlay is held in place by the browser rather than drawn again on every frame
const labelsPreview = (
    <div className={classes.frame}>
        <GlobeComponent markers={cities} aria-label="Where our readers are">
            {cities.map((city) => (
                <GlobeComponent.Overlay key={city.id} marker={city.id} className={classes.label}>
                    {city.name}
                </GlobeComponent.Overlay>
            ))}
        </GlobeComponent>
    </div>
);

// The class the label is dressed in is written out as the classes it stands for rather than as the
// name the page holds it under, since what is copied out of here has only itself to reach for
const labelsCode = `<Globe markers={cities} aria-label="Where our readers are">
    {cities.map((city) => (
        <Globe.Overlay
            key={city.id}
            marker={city.id}
            className="px-[var(--base-size-4)] py-[var(--base-size-2)] rounded-[var(--border-radius-small)] bg-[var(--overlay-background-color)] shadow-[var(--shadow-resting-small)] whitespace-nowrap transition-opacity duration-medium"
        >
            {city.name}
        </Globe.Overlay>
    ))}
</Globe>`;

// Labels held over the arcs, which stand at the highest point of the curve rather than at either
// end of it
const arcLabelsPreview = (
    <div className={classes.frame}>
        <GlobeComponent markers={cities} arcs={routes} aria-label="Our routes">
            {routes.map((route) => (
                <GlobeComponent.Overlay key={route.id} arc={route.id} className={classes.label}>
                    {route.name}
                </GlobeComponent.Overlay>
            ))}
        </GlobeComponent>
    </div>
);

const arcLabelsCode = `<Globe markers={cities} arcs={routes} aria-label="Our routes">
    {routes.map((route) => (
        <Globe.Overlay
            key={route.id}
            arc={route.id}
            className="px-[var(--base-size-4)] py-[var(--base-size-2)] rounded-[var(--border-radius-small)] bg-[var(--overlay-background-color)] shadow-[var(--shadow-resting-small)] whitespace-nowrap transition-opacity duration-medium"
        >
            {route.name}
        </Globe.Overlay>
    ))}
</Globe>`;

// A globe told to stand still, for a page that already has movement of its own
const stillPreview = (
    <div className={classes.frame}>
        <GlobeComponent markers={cities} spin={false} aria-label="Where our readers are" />
    </div>
);

const stillCode = `<Globe markers={cities} spin={false} aria-label="Where our readers are" />`;

// How fast it turns, in radians a second, read as the one against the other
const speedPreview = (
    <div className={classes.pair}>
        <GlobeComponent speed={0.1} markers={cities} aria-label="Turning slowly" />
        <GlobeComponent speed={0.8} markers={cities} aria-label="Turning quickly" />
    </div>
);

const speedCode = `<div className="grid grid-cols-2 gap-[var(--stack-gap-normal)]">
    <Globe speed={0.1} markers={cities} aria-label="Turning slowly" />
    <Globe speed={0.8} markers={cities} aria-label="Turning quickly" />
</div>`;

// A globe that can be turned by hand. One that can takes focus, so the arrow keys reach the far
// side of it as readily as dragging does
const interactivePreview = (
    <div className={classes.frame}>
        <GlobeComponent interactive markers={cities} aria-label="Where our readers are">
            {cities.map((city) => (
                <GlobeComponent.Overlay key={city.id} marker={city.id} className={classes.label}>
                    {city.name}
                </GlobeComponent.Overlay>
            ))}
        </GlobeComponent>
    </div>
);

const interactiveCode = `<Globe interactive markers={cities} aria-label="Where our readers are">
    {cities.map((city) => (
        <Globe.Overlay key={city.id} marker={city.id} className="...">
            {city.name}
        </Globe.Overlay>
    ))}
</Globe>`;

// Somewhere new is travelled to rather than jumped to, which is what says where the new place
// stands against the old one, and the globe takes the shorter way round to get there
const TravellingPreview = () => {
    const [city, setCity] = React.useState(cities[0]!);

    return (
        <Stack gap="normal" className={classes.frame}>
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                {cities.map((candidate) => (
                    <Button
                        key={candidate.id}
                        size="small"
                        variant={candidate.id === city.id ? "primary" : "default"}
                        onClick={() => setCity(candidate)}
                    >
                        {candidate.name}
                    </Button>
                ))}
            </Stack>
            <GlobeComponent
                latitude={city.location[0]}
                longitude={city.location[1]}
                markers={cities}
                aria-label={city.name}
            >
                <GlobeComponent.Overlay marker={city.id} className={classes.label}>
                    {city.name}
                </GlobeComponent.Overlay>
            </GlobeComponent>
        </Stack>
    );
};

const travellingSetup = `${citiesSetup}

const [city, setCity] = React.useState(cities[0]);`;

const travellingCode = `<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        {cities.map((candidate) => (
            <Button
                key={candidate.id}
                size="small"
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
        markers={cities}
        aria-label={city.name}
    >
        <Globe.Overlay marker={city.id} className="...">
            {city.name}
        </Globe.Overlay>
    </Globe>
</Stack>`;

// How wide the globe stands. A number is read as pixels; anything else is passed to CSS as it was
// written. Only the width is asked for, since a globe is round
const sizePreview = (
    <Stack direction="horizontal" gap="normal" align="center">
        <GlobeComponent size={96} markers={cities} aria-label="Small" />
        <GlobeComponent size={144} markers={cities} aria-label="Medium" />
        <GlobeComponent size={192} markers={cities} aria-label="Large" />
    </Stack>
);

const sizeCode = `<Stack direction="horizontal" gap="normal" align="center">
    <Globe size={96} markers={cities} aria-label="Small" />
    <Globe size={144} markers={cities} aria-label="Medium" />
    <Globe size={192} markers={cities} aria-label="Large" />
</Stack>`;

// Everything a globe is drawn from is a custom property, so it can be repainted without unpicking
// the classes it came with. They are numbers rather than colours because they are handed to a
// shader: three between nought and one for a colour, and one for anything measured
const repaintedPreview = (
    <div className={classes.frame}>
        <GlobeComponent
            markers={cities}
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

const repaintedCode = `<Globe
    markers={cities}
    aria-label="Where our readers are"
    style={{
        "--globe-base-color": "0.13 0.15 0.2",
        "--globe-glow-color": "0.35 0.2 0.5",
        "--globe-marker-color": "1 0.55 0.2",
        "--globe-dark": 1,
        "--globe-map-brightness": 8,
    }}
/>`;

// A globe is a region of the page, so it carries a name to be found and skipped past by. Where a
// heading already says what it shows, the globe is pointed at that heading rather than given a name
// of its own to fall out of step with
const namedPreview = (
    <Stack gap="condensed" className={classes.frame}>
        <Heading as="h2" size="small" id="globe-readers">
            Where our readers are
        </Heading>
        <Text size="small" className={classes.muted}>
            Every dot is a city we were read in this week.
        </Text>
        <GlobeComponent aria-labelledby="globe-readers" markers={cities} />
    </Stack>
);

const namedCode = `<Stack gap="condensed">
    <Heading as="h2" size="small" id="globe-readers">
        Where our readers are
    </Heading>
    <Text size="small">Every dot is a city we were read in this week.</Text>
    <Globe aria-labelledby="globe-readers" markers={cities} />
</Stack>`;

// The globe as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what is dotted onto it, then what is held over it, then how it moves, then how wide
// it stands and what it is painted, and last what it is called
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A dotted globe with nothing said about it. Given nowhere to face it sets off from the far side of the world towards the reader; given no width it is as wide as whatever it was put in; and it turns on its own, since a globe standing still reads as a picture of one rather than as somewhere that can be turned about. A reader who has asked their system for less movement is left with it standing still.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Facing somewhere",
        description:
            "Where the globe is pointed, written the way an address is looked up rather than the way the globe draws it: degrees of latitude and longitude, which the component turns into the angles it is turned and tilted by. The tilt stops short of the pole, since a globe tilted onto its end reads as a mistake rather than as a view.",
        preview: placePreview,
        code: placeCode,
    },
    {
        name: "Markers",
        description:
            "Dots standing on the surface. A marker says where it is and nothing else, and they are all drawn at the same size unless one of them says otherwise. Naming a marker is what gives it an anchor, which is what anything held over it is held over — a marker that nothing is written over does not need a name.",
        setup: citiesSetup,
        preview: markersPreview,
        code: markersCode,
    },
    {
        name: "Arcs",
        description:
            "Curves drawn between two places, rising off the surface between their ends and hidden where they pass round the back. They are what traffic between places is drawn as: an arc says the two ends belong together, which a pair of dots does not.",
        setup: routesSetup,
        preview: arcsPreview,
        code: arcsCode,
    },
    {
        name: "Labels held over the markers",
        description:
            "Anything the page wants to say, held over a marker and moved with it as the globe turns. It is held in place by the browser rather than drawn again on every frame, and fades out as what it names goes round the back — so a label is ordinary content of the page, with the pointer passing through it unless it says otherwise. A browser that cannot hold an element over an anchor draws none of them rather than piling them in a corner.",
        setup: citiesSetup,
        preview: labelsPreview,
        code: labelsCode,
    },
    {
        name: "Labels held over the arcs",
        description:
            "The same thing held over an arc rather than a marker, which stands at the highest point of the curve rather than at either end of it. An overlay names a marker or an arc and never both.",
        setup: routesSetup,
        preview: arcLabelsPreview,
        code: arcLabelsCode,
    },
    {
        name: "Standing still",
        description:
            "A globe told not to turn, which is worth telling it where the page around it already has movement of its own. A globe that is standing still costs nothing after it has been drawn: it is only set going while there is something to see — while it is turning, while it is travelling somewhere new, and while a hand is on it.",
        setup: citiesSetup,
        preview: stillPreview,
        code: stillCode,
    },
    {
        name: "How fast it turns",
        description:
            "The rate a turning globe moves at, in radians a second. It is written against the clock rather than against the frame, so a globe turns at the same rate on a screen drawing thirty frames a second as on one drawing a hundred and twenty. Left alone, a whole turn takes about twenty seconds.",
        setup: citiesSetup,
        preview: speedPreview,
        code: speedCode,
    },
    {
        name: "Turned by hand",
        description:
            "A globe that can be dragged. One that can takes focus, so the arrow keys reach the far side of it as readily as dragging does, and it takes the dragging for itself — a hand travelling across a globe on a telephone is turning it rather than scrolling the page past it. Turning is less sensitive than tilting on purpose: a hand dragging across a globe wanders up and down far more than it means to.",
        setup: citiesSetup,
        preview: interactivePreview,
        code: interactiveCode,
    },
    {
        name: "Travelling from one place to another",
        description:
            "Somewhere new is travelled to rather than jumped to, which is what says where the new place stands against the old one, and the globe takes the shorter way round to get there — somewhere three quarters of a turn ahead is reached by turning a quarter of a turn back.",
        setup: travellingSetup,
        preview: <TravellingPreview />,
        code: travellingCode,
    },
    {
        name: "How wide it stands",
        description:
            "A number is read as pixels, and anything else is passed to CSS as it was written, so a globe can be given a width in whatever units the page is laid out in. Only the width is settled, since a globe is round, and one given more width than it has room for is brought down to fit rather than running past the edge.",
        setup: citiesSetup,
        preview: sizePreview,
        code: sizeCode,
    },
    {
        name: "Repainted from the stylesheet",
        description:
            "Everything a globe is drawn from is a custom property, so it can be repainted without unpicking the classes it came with. They are numbers rather than colours because they are handed to a shader: three between nought and one for a colour, and one for anything measured. That is also what lets a globe follow the theme around it without being told which one is standing — the two schemes are written out once in the stylesheet rather than passed in.",
        setup: citiesSetup,
        preview: repaintedPreview,
        code: repaintedCode,
    },
    {
        name: "Named by what stands above it",
        description:
            "A globe holds what is written over it and can be turned about within, so it is a region of the page rather than a picture — which means it carries a name to be found and skipped past by. Where a heading already says what it shows, the globe is pointed at that heading rather than given a name of its own to fall out of step with; given neither, it is called Globe, which is better than nothing but says little.",
        setup: citiesSetup,
        preview: namedPreview,
        code: namedCode,
    },
];

// Somewhere on the globe, as degrees of latitude and then longitude
const location = "[latitude: number, longitude: number]";

// A colour as it reaches a shader rather than as a stylesheet writes one
const color = "[red: number, green: number, blue: number]";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the globe and what is held over it take, and after them the shapes a marker and an arc
// are written in.
//
// Where the globe is pointed comes first, since it is what a globe is usually wanted for, then what
// is dotted onto it, then how it moves, and last what it is called
const groups: ComponentPropGroup[] = [
    {
        name: "Globe",
        props: [
            {
                name: "latitude",
                type: "number",
                description:
                    "How far north the globe is pointed, in degrees. Somewhere new is travelled to rather than jumped to, and the tilt stops short of the pole, since a globe tilted onto its end reads as a mistake rather than as a view",
            },
            {
                name: "longitude",
                type: "number",
                description:
                    "How far east the globe is pointed, in degrees. The globe takes the shorter way round to get there rather than spinning the long way about",
            },
            {
                name: "size",
                type: "number | string",
                description:
                    "How wide the globe stands. A number is read as pixels, and anything else is passed to CSS as it was written. Only the width is settled, since a globe is round; left out, it is as wide as whatever it was put in",
            },
            {
                name: "markers",
                type: "readonly GlobeMarker[]",
                description:
                    "The dots standing on the surface. Naming one is what gives it an anchor, which is what an overlay is held over",
            },
            {
                name: "arcs",
                type: "readonly GlobeArc[]",
                description:
                    "The curves drawn between places, rising off the surface between their ends. Naming one gives it an anchor at its highest point, the way naming a marker gives one at the marker",
            },
            {
                name: "markerSize",
                type: "number",
                default: "0.05",
                description:
                    "How large a marker is drawn where it does not say, as a share of the globe's radius. Somewhere around a twentieth reads as a dot on the surface rather than a disc over it",
            },
            {
                name: "spin",
                type: "boolean",
                default: "true",
                description:
                    "Whether the globe turns on its own. It does by default, since a globe standing still reads as a picture of one rather than as somewhere that can be turned about. A reader who has asked their system for less movement is left with it standing still whichever way this is set",
            },
            {
                name: "speed",
                type: "number",
                default: "0.3",
                description:
                    "How fast a turning globe moves, in radians a second. It is written against the clock rather than against the frame, so the turn is the same on a screen drawing thirty frames a second as on one drawing a hundred and twenty",
            },
            {
                name: "interactive",
                type: "boolean",
                default: "false",
                description:
                    "Whether the globe can be turned by hand. One that can takes focus, so it can be turned from the keyboard as well as dragged, and takes the dragging for itself rather than letting the page scroll past under the hand",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Anything held over the globe, written as Globe.Overlay. Each says which marker or arc it belongs to, so where it is written among the rest does not matter",
            },
            {
                name: "aria-label",
                type: "string",
                default: '"Globe"',
                description:
                    "What the region is called. A globe showing something in particular is better named for that, since the name is what the region is found by and skipped past",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The element the globe is named by, where a heading on the page already says what it shows. It wins over a name of the globe's own, which would only fall out of step with it",
            },
            styling,
        ],
    },
    {
        name: "Globe.Overlay",
        props: [
            {
                name: "marker",
                type: "string",
                description:
                    "The marker this is held over, named by its id. An overlay names a marker or an arc and never both",
            },
            {
                name: "arc",
                type: "string",
                description:
                    "The arc this is held over, named by its id. It stands at the highest point of the curve rather than at either end of it",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What is held there. It is ordinary content of the page rather than something drawn into the globe, so it can be anything React can draw",
            },
            styling,
        ],
    },
    {
        name: "GlobeMarker",
        props: [
            {
                name: "location",
                type: location,
                required: true,
                description:
                    "Where the marker stands, north of the equator and east of Greenwich being positive, which is the order and the sign an atlas gives them in",
            },
            {
                name: "size",
                type: "number",
                description:
                    "How large this one is drawn, as a share of the globe's radius. Left out, it takes the size the globe draws its markers at",
            },
            {
                name: "color",
                type: color,
                description:
                    "What this one is painted where it is not to be painted like the rest. Three numbers between nought and one, since it is handed to a shader rather than to the page",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Names the marker, which is what gives it an anchor for an overlay to be held over. One that nothing is written over does not need one",
            },
        ],
    },
    {
        name: "GlobeArc",
        props: [
            {
                name: "from",
                type: location,
                required: true,
                description: "Where the curve begins",
            },
            {
                name: "to",
                type: location,
                required: true,
                description: "Where it ends",
            },
            {
                name: "color",
                type: color,
                description: "What this one is painted where it is not to be painted like the rest",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Names the arc, which gives it an anchor at its highest point for an overlay to be held over",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the globe is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Globe = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Globe
            </Heading>
            <Text as="p" size="large">
                A dotted globe drawn with WebGL, with markers standing on it, arcs drawn between
                them, and anything the page wants to say held over either. What a globe is usually
                wanted for is one of two things — a place, or the traffic between places — so that
                is what the props settle, and either is written as one element rather than
                assembled.
            </Text>
            <Text as="p" size="large">
                Everything else is the stylesheet's. The colours and the light come through custom
                properties rather than props, since a shader is handed numbers and a theme is
                written in tokens: that is what lets a globe be repainted the way the rest of the
                library is, and what lets it follow the theme around it without being told which one
                is standing. The globe is drawn once for every state it is told rather than on a
                clock of its own, so it is only set going while there is something to see.
            </Text>
        </Stack>
        <ComponentExamples component="Globe" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Globe;
