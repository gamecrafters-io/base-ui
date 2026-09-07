import type { StoryFn, Meta } from "@storybook/react-vite";
import { Globe } from ".";
import type { GlobeProps } from "./Globe.types";

const classes = {
    // A globe is drawn to whatever room it is given, so the stories give it a column to stand in
    // rather than letting it run the width of the canvas
    frame: "w-[32rem] max-w-full",
};

const MARKERS = [
    { id: "sf", location: [37.78, -122.44] as [number, number] },
    { id: "nyc", location: [40.71, -74.01] as [number, number] },
    { id: "london", location: [51.51, -0.13] as [number, number] },
    { id: "tokyo", location: [35.68, 139.65] as [number, number] },
];

const ARCS = [
    {
        id: "sf-tokyo",
        from: [37.78, -122.44] as [number, number],
        to: [35.68, 139.65] as [number, number],
    },
    {
        id: "nyc-london",
        from: [40.71, -74.01] as [number, number],
        to: [51.51, -0.13] as [number, number],
    },
];

export default {
    title: "Components/Globe",
    component: Globe,
} as Meta<typeof Globe>;

export const Default: StoryFn<typeof Globe> = () => (
    <div className={classes.frame}>
        <Globe markers={MARKERS} />
    </div>
);

export const Playground: StoryFn<GlobeProps> = (args) => (
    <div className={classes.frame}>
        <Globe {...args} />
    </div>
);

Playground.args = {
    latitude: 37.78,
    longitude: -122.44,
    size: 512,
    markers: MARKERS,
    arcs: ARCS,
    markerSize: 0.05,
    spin: true,
    speed: 0.3,
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
            step: 0.05,
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
