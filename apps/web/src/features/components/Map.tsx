import { Heading, Map as MapComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Two maps read against one another, each keeping half of the room the card gives them. A map
    // is drawn to whatever room it is given, so putting the pair in a grid is what sizes them
    pair: "grid grid-cols-2 gap-[var(--stack-gap-normal)]",
};

// What the one example needing something in hand is drawn from. Every other map here is written
// as it stands, since a map is as wide as whatever it was put in and needs no class to say so
const pairSetup = `const pair = "grid grid-cols-2 gap-[var(--stack-gap-normal)]";`;

// The plainest map there is: nothing said, so it stands where it falls back to standing, with a
// pin on the address and the block around it.
//
// The page and the component it is about are both called Map, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Map, as an application importing
// it would
const defaultPreview = <MapComponent />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Map />`;

// Somewhere else, given the way an address is looked up rather than the way the map draws it. The
// map is named for what it shows, since a map is a region of the page rather than a picture on it
// and a region without a name is one a reader cannot tell from the next
const locationPreview = (
    <MapComponent latitude={51.4995} longitude={-0.1248} aria-label="Palace of Westminster" />
);

const locationCode = `<Map latitude={51.4995} longitude={-0.1248} aria-label="Palace of Westminster" />`;

// How far in the map is drawn, read as a pair so that one says what the other is. Each is given a
// height in pixels, which is the one measurement a map cannot work out for itself
const zoomPreview = (
    <div className={classes.pair}>
        <MapComponent zoom={12} height={280} aria-label="The city" />
        <MapComponent zoom={18} height={280} aria-label="The building" />
    </div>
);

const zoomCode = `<div className={pair}>
    <Map zoom={12} height={280} aria-label="The city" />
    <Map zoom={18} height={280} aria-label="The building" />
</div>`;

// The pin painted and lettered, for a map whose pins are being read against a list beside it. It
// is drawn into a picture rather than into the document, which is why what it is painted is said
// here rather than left to a stylesheet
const markerPreview = <MapComponent markerColor="#0969da" markerLabel="A" />;

const markerCode = `<Map markerColor="#0969da" markerLabel="A" />`;

// Every extra control at once. The ones a reader presses gather into a column of their own down the
// far corner, clear of the one the zoom keeps, in the order they were named; the scale line is read
// rather than pressed, so it keeps the foot of the map instead
const controlsPreview = (
    <MapComponent controls={["fullScreen", "search", "layers", "draw", "scaleLine"]} />
);

const controlsCode = `<Map controls={["fullScreen", "search", "layers", "draw", "scaleLine"]} />`;

// A popup naming wherever the map was clicked. It is held over the ground rather than over the
// page, so it travels with what it is naming as the map is dragged about.
//
// What it holds is given as a function rather than as elements, since until the popup has been
// opened there is nowhere to tell them about. The popup stands where it was asked for straight
// away and the address fills in once the geocoder answers, which is what the first line is for
const overlayPreview = (
    <MapComponent>
        <MapComponent.Overlay>
            {({ lonLat, address }) => (
                <Stack gap="condensed">
                    <Text weight="semibold">{address || "Looking that up…"}</Text>
                    <Text size="small">
                        {lonLat[1]?.toFixed(4)}, {lonLat[0]?.toFixed(4)}
                    </Text>
                </Stack>
            )}
        </MapComponent.Overlay>
    </MapComponent>
);

const overlayCode = `<Map>
    <Map.Overlay>
        {({ lonLat, address }) => (
            <Stack gap="condensed">
                <Text weight="semibold">{address || "Looking that up…"}</Text>
                <Text size="small">
                    {lonLat[1]?.toFixed(4)}, {lonLat[0]?.toFixed(4)}
                </Text>
            </Stack>
        )}
    </Map.Overlay>
</Map>`;

// Pins dropped by clicking rather than given a place. The map's own pin is turned off, since what
// is being shown is the ones the reader drops rather than the place the map stands at
const pinsPreview = (
    <MapComponent marker={false}>
        <MapComponent.Marker addOnClick removeOnClick />
    </MapComponent>
);

const pinsCode = `<Map marker={false}>
    <Map.Marker addOnClick removeOnClick />
</Map>`;

// The map as it is reached for, drawn and written out one above the other. Where it stands comes
// first, since that is what a map is usually wanted for, then how far in and what marks the place,
// then what a reader can press, and last the two things a map is built out of rather than told
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A map given nothing stands at 2261 Market Street, San Francisco, close enough in to read the street off, with a pin on the address. It is as wide as whatever it was put in, the way anything else on the page is, and as tall as it falls back to, since a map is drawn to the room it is given and left to find a height the same way would be drawn to nothing at all. The zoom and the attribution are on every map, asked for or not. It is a region rather than a picture, since it can be moved about within: it takes focus, and the arrow keys pan it while plus and minus draw it in and out.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Somewhere else",
        description:
            "Where the map is pointed, written the way an address is looked up rather than the way the map draws it: degrees of latitude and longitude, which the component turns into the metres the projection measures in. The map is named for what it shows rather than left as “Map”, since it is a region a reader finds and skips past by name. A map already standing is moved rather than built again, so pointing one somewhere else eases the ground across instead of losing everything the reader has done to it and fetching every tile a second time.",
        preview: locationPreview,
        code: locationCode,
    },
    {
        name: "How far in it is drawn",
        description:
            "Each step up halves what is shown, so twelve holds a city and eighteen a building; sixteen, which a map falls back to, is a block and the streets around it. The height is given in pixels here — a number is read as pixels, and anything else is passed to CSS as it was written, so a map can be given a height in whatever units the page is laid out in.",
        setup: pairSetup,
        preview: zoomPreview,
        code: zoomCode,
    },
    {
        name: "The pin",
        description:
            "A pin is dropped where the map is pointed unless it is asked not to, since a map standing at an address is usually showing that address rather than the ground around it. It can be painted and lettered, for a map whose pins are being read against a list beside it. It is drawn into a picture rather than into the document, so it cannot be repainted from a stylesheet the way the rest of the map can, and it is held by its point rather than by its middle so that it stands on what it marks rather than covering it.",
        preview: markerPreview,
        code: markerCode,
    },
    {
        name: "The controls a reader presses",
        description:
            "Which of the extra controls are drawn, in the order they are named. The ones that are pressed gather into a column of their own down the far corner, clear of the one the zoom keeps, which is what stops a map carrying several of them from drawing them one on top of another and leaves no hole where one that was not asked for would have stood. The scale line is read rather than pressed, so it keeps the foot of the map instead. The search is put to Nominatim, the geocoder belonging to the same project the tiles are drawn from, so a map carries no key and reaches for nothing further.",
        preview: controlsPreview,
        code: controlsCode,
    },
    {
        name: "A popup naming where it was clicked",
        description:
            "The popup is held over the ground rather than over the page, so it travels with what it is naming as the map is dragged about. What it holds is given as a function rather than as elements, since until the popup has been opened there is nowhere to tell them about; it is called with where it was opened and what stands there. The popup opens on the click rather than on the answer to it, so it stands where it was asked for straight away and the address fills in once the geocoder answers.",
        preview: overlayPreview,
        code: overlayCode,
    },
    {
        name: "Dropping pins by clicking",
        description:
            "A click on empty ground drops another pin and a click on one already there takes it away. One click cannot do both, which is what keeps a pin from being dropped on the spot one was just taken from. Each pin dropped carries the character after the last, so a run of them can be told apart and read against a list beside the map. The map’s own pin is turned off here, since what is being shown is the pins the reader drops rather than the place the map stands at.",
        preview: pinsPreview,
        code: pinsCode,
    },
];

// What the pin is painted where it is not told otherwise. It is written as a value rather than
// taken from a stylesheet because the pin is drawn into a picture rather than into the document,
// and so is out of reach of anything that repaints the rest of the map
const DEFAULT_MARKER_COLOR = '"#257ECA"';

// Which of the extra controls a map can be asked to carry
const controls = ["draw", "fullScreen", "layers", "scaleLine", "search"];

// How wide and how tall the map stands, which are the same prop said twice over
const size = "number | string";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// The props the map takes, and then the two parts the examples build one out of. Everything else
// the map can be built from is named under children rather than given a table of its own: each is
// handed on from OpenLayers as the piece it already is, so what it takes is what OpenLayers takes
// and is written up there rather than said again here.
//
// Where the map stands comes first, since that is what a map is usually wanted for, and how much
// of the page it takes follows, being the one measurement it cannot settle for itself
const groups: ComponentPropGroup[] = [
    {
        name: "Map",
        props: [
            {
                name: "latitude",
                type: "number",
                default: "37.7649804",
                description:
                    "How far north the map is pointed, in degrees. Left out, it stands at 2261 Market Street, San Francisco: a map has to stand somewhere before it has been told where, and somewhere on a street reads as a map, where nought and nought falls in the middle of an ocean",
            },
            {
                name: "longitude",
                type: "number",
                default: "-122.4323829",
                description: "How far east the map is pointed, in degrees",
            },
            {
                name: "zoom",
                type: "number",
                default: "16",
                description:
                    "How far in the map is drawn. Each step up halves what is shown, so sixteen is a block and the streets around it, eighteen a building and twelve a city",
            },
            {
                name: "width",
                type: size,
                description:
                    "How wide the map stands. A number is read as pixels, and anything else is passed to CSS as it was written, so a map can be given a width in whatever units the page is laid out in. Left out, it is as wide as whatever it was put in, the way anything else on the page is, and a width wider than the room it has is brought down to fit rather than run past the edge",
            },
            {
                name: "height",
                type: size,
                default: '"24rem"',
                description:
                    "How tall the map stands, read the same way. This is the one measurement a map cannot work out for itself: it is drawn to the room it is given, and given none it would be drawn to nothing at all, so what it falls back to is tall enough to read a street off and short enough to stand in a column beside other content",
            },
            {
                name: "controls",
                type: "readonly MapControl[]",
                default: "[]",
                options: controls,
                description:
                    "Which of the extra controls are drawn, in the order they are named. The zoom, the rotation and the attribution are drawn on every map already, so they are not named here. The ones a reader presses gather into a column of their own down the far corner, clear of the one the zoom keeps; the scale line is read rather than pressed and keeps the foot of the map instead",
            },
            {
                name: "marker",
                type: "boolean",
                default: "true",
                description:
                    "Whether a pin is dropped where the map is pointed. A map standing at an address is usually showing that address rather than the ground around it, so one is dropped unless it is asked not to. Pointing the map somewhere else moves the pin rather than leaving a second one behind",
            },
            {
                name: "markerColor",
                type: "string",
                default: DEFAULT_MARKER_COLOR,
                description:
                    "What the pin is painted. It is drawn into a picture rather than into the document, so it cannot be repainted from a stylesheet the way the rest of the map can",
            },
            {
                name: "markerLabel",
                type: "string",
                description:
                    "The letter the pin carries, for a map whose pins are being read against a list beside it",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Anything further the map is built from, each attaching itself to the map around it, so where it is written among the rest does not matter beyond the order the controls are drawn in. All of it hangs off the component: the layers (Map.TileLayer, Map.ImageLayer, Map.VectorLayer, Map.GraticuleLayer, Map.HeatmapLayer, Map.WebGLTileLayer and Map.LayerGroup), the pins and the popups (Map.Marker, Map.Overlay), the controls (Map.AttributionControl, Map.DrawControl, Map.FullScreenControl, Map.LayersControl, Map.MousePositionControl, Map.OverviewMapControl, Map.ScaleLineControl, Map.SearchControl), the interactions (Map.DragRotateAndZoomInteraction, Map.LinkInteraction, Map.PointerInteraction, Map.SelectInteraction, Map.TranslateInteraction) and Map.View",
            },
            {
                name: "aria-label",
                type: "string",
                default: '"Map"',
                description:
                    "What the region is called. A map is moved about within rather than looked at, so it is a region of the page and carries a name to be found and skipped past by. One showing a single address is better named for that address, but a name is worth having either way",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The element that names the map, for one standing under a heading that already says what it shows. Given this, the map takes no name of its own, so there is nothing to fall out of step with the heading",
            },
            styling,
        ],
    },
    {
        name: "Map.Overlay",
        props: [
            {
                name: "children",
                type: "React.ReactNode | ((content: MapOverlayContent) => React.ReactNode)",
                description:
                    "What the popup holds. Given as a function it is called with where the popup was opened — in the projection the map draws in and in longitude and latitude — and what stands there, which is the only way to reach an address that is still being asked for when the popup opens. The address arrives after the rest and is empty until it does",
            },
        ],
    },
    {
        name: "Map.Marker",
        props: [
            {
                name: "lonLat",
                type: "Coordinate",
                description:
                    "Where the pin stands, as longitude and latitude in that order, which is the order the projection reads them in rather than the order an address is written in",
            },
            {
                name: "address",
                type: "string",
                description:
                    "Somewhere named rather than measured, looked up by a geocoder over the network, so the pin for one arrives a moment after the map does. Given a pair of coordinates as well, the pair is taken: it says where without having to ask anyone",
            },
            {
                name: "color",
                type: "string",
                default: DEFAULT_MARKER_COLOR,
                description: "What the pin is painted",
            },
            {
                name: "label",
                type: "string",
                default: '" "',
                description:
                    "The character the pin carries. A pin given a place carries it as written; pins dropped by clicking take the character after the last one instead, so what is given here is the one before the first of them",
            },
            {
                name: "addOnClick",
                type: "boolean",
                default: "false",
                description: "Whether clicking empty ground drops another pin there",
            },
            {
                name: "removeOnClick",
                type: "boolean",
                default: "false",
                description:
                    "Whether clicking a pin takes it away. A click landing on something takes it away and a click landing on nothing drops another, so one click never does both",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the map is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Map = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Map
            </Heading>
            <Text as="p" size="large">
                Ground drawn from OpenStreetMap tiles, standing wherever it is pointed. What a map
                is usually wanted for is one place — an address, a pin on it, and enough of what
                surrounds it to say where that is — so that much is settled by props and a map
                showing somewhere is written as one element rather than assembled. Everything else
                OpenLayers can draw is written as children: layers, overlays, further controls and
                interactions, each attaching itself to the map around it. They are handed on as the
                pieces they already are rather than dressed again, so each takes what OpenLayers
                takes, less whatever the map settles itself. The map is a region rather than a
                picture, since it can be moved about within: it takes focus, and the arrow keys pan
                it while plus and minus draw it in and out. Those keys are read off the map rather
                than off the page, so one that is not being looked at does not answer to what is
                being typed somewhere else.
            </Text>
        </Stack>
        <ComponentExamples component="Map" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Map;
