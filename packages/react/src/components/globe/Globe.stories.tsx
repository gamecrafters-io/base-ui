import type { StoryFn, Meta } from "@storybook/react-vite";
import { Globe } from ".";
import type { GlobeProps } from "./Globe.types";

const classes = {
    // A globe is drawn to whatever room it is given, so the stories give it a column to stand in
    // rather than letting it run the width of the canvas
    frame: "w-[32rem] max-w-full",
};

// The airports the routes below run between, which is what the markers stand for here
const AIRPORTS = [
    { id: "jfk", location: [40.64, -73.78] as [number, number] },
    { id: "lhr", location: [51.47, -0.46] as [number, number] },
    { id: "dxb", location: [25.25, 55.36] as [number, number] },
    { id: "nrt", location: [35.55, 139.78] as [number, number] },
    { id: "sfo", location: [37.62, -122.38] as [number, number] },
    { id: "sin", location: [1.36, 103.99] as [number, number] },
    { id: "syd", location: [-33.95, 151.18] as [number, number] },
    { id: "cdg", location: [48.86, 2.35] as [number, number] },
];

// The routes flown between them. Each is named, which is what would give it an anchor at its
// highest point for anything the page wanted to hold over it
const FLIGHTS = [
    {
        id: "jfk-lhr",
        from: [40.64, -73.78] as [number, number],
        to: [51.47, -0.46] as [number, number],
    },
    {
        id: "lhr-dxb",
        from: [51.47, -0.46] as [number, number],
        to: [25.25, 55.36] as [number, number],
    },
    {
        id: "nrt-sfo",
        from: [35.55, 139.78] as [number, number],
        to: [37.62, -122.38] as [number, number],
    },
    {
        id: "sin-syd",
        from: [1.36, 103.99] as [number, number],
        to: [-33.95, 151.18] as [number, number],
    },
    {
        id: "cdg-jfk",
        from: [48.86, 2.35] as [number, number],
        to: [40.64, -73.78] as [number, number],
    },
];

export default {
    title: "Components/Globe",
    component: Globe,
} as Meta<typeof Globe>;

export const Default: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe />
    </div>
);

// Traffic between airports: a marker at every one of them, and a route drawn between the pairs
// that are flown. The markers are drawn small, since what says where a route ends here is the arc
// rather than the dot beneath it
export const Playground: StoryFn<GlobeProps> = (args) => (
    <div className={classes.frame}>
        <Globe {...args} />
    </div>
);

Playground.args = {
    latitude: 37.78,
    longitude: -122.44,
    size: 512,
    markers: AIRPORTS,
    arcs: FLIGHTS,
    markerSize: 0.02,
    spin: true,
    // The rate the traffic is turned past at: a slow, steady turn taking a little over half a
    // minute to come round. It is written against the clock rather than against the frame, so it
    // is the same turn on a screen drawing thirty frames a second as on one drawing a hundred and
    // twenty
    speed: 0.18,
    interactive: true,
};

Playground.argTypes = {
    latitude: {
        control: {
            type: "number",
            min: -90,
            max: 90,
            step: 0.01,
        },
        description: "How far north the globe is pointed, in degrees",
    },
    longitude: {
        control: {
            type: "number",
            min: -180,
            max: 180,
            step: 0.01,
        },
        description: "How far east the globe is pointed, in degrees",
    },
    size: {
        control: {
            type: "number",
            min: 160,
            max: 800,
            step: 16,
        },
        description: "How wide the globe stands, in pixels",
    },
    markerSize: {
        control: {
            type: "number",
            min: 0.01,
            max: 0.15,
            step: 0.005,
        },
        description: "How large a marker is drawn where it does not say",
    },
    spin: {
        control: {
            type: "boolean",
        },
        description: "Whether the globe turns on its own",
    },
    speed: {
        control: {
            type: "number",
            min: 0.05,
            max: 2,
            step: 0.01,
        },
        description: "How fast a spinning globe turns, in radians a second",
    },
    interactive: {
        control: {
            type: "boolean",
        },
        description: "Whether the globe can be turned by hand",
    },
    markers: {
        table: {
            disable: true,
        },
    },
    arcs: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
