import * as React from "react";
import {
    FloatingPanel as FloatingPanelComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import type { FloatingPanelPoint, FloatingPanelResizeAxis } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // What opens the panel draws nothing of its own: it is the panel's opener rather than a button
    // of the library's, so that whatever is already on the page can be the thing that opens it.
    // The examples give it the library's button classes, which is what an application putting a
    // plain button there would do
    trigger: "button button-default",
};

// What a panel is usually given: every corner can be taken hold of, and the edges between them are
// left out. Each trigger is a stop on the way past the panel, which is why they are rendered one at
// a time rather than all eight being drawn for the caller
const corners: FloatingPanelResizeAxis[] = ["nw", "ne", "sw", "se"];

const edges: FloatingPanelResizeAxis[] = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];

// The panel every example but the first two puts up. It is written once and rendered inside each
// root rather than copied out, since what the examples are about is what the root was told rather
// than what the panel holds.
//
// The page and the component it is about are both called FloatingPanel, so the component is brought
// in under a name saying which of the two it is. The listings beneath say FloatingPanel, as an
// application importing it would
const panel = (
    <FloatingPanelComponent.Positioner>
        <FloatingPanelComponent.Content>
            <FloatingPanelComponent.DragTrigger>
                <FloatingPanelComponent.Header>
                    <FloatingPanelComponent.Title>Layers</FloatingPanelComponent.Title>
                    <FloatingPanelComponent.Control>
                        <FloatingPanelComponent.StageTrigger stage="minimized" />
                        <FloatingPanelComponent.StageTrigger stage="maximized" />
                        <FloatingPanelComponent.CloseTrigger />
                    </FloatingPanelComponent.Control>
                </FloatingPanelComponent.Header>
            </FloatingPanelComponent.DragTrigger>
            <FloatingPanelComponent.Body>
                Drag the header to move the panel, and a corner to resize it.
            </FloatingPanelComponent.Body>
            {corners.map((axis) => (
                <FloatingPanelComponent.ResizeTrigger key={axis} axis={axis} />
            ))}
        </FloatingPanelComponent.Content>
    </FloatingPanelComponent.Positioner>
);

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const triggerSetup = `const trigger = "button button-default";`;

const cornersSetup = `const corners = ["nw", "ne", "sw", "se"];`;

const panelSetup = `${cornersSetup}

const panel = (
    <FloatingPanel.Positioner>
        <FloatingPanel.Content>
            <FloatingPanel.DragTrigger>
                <FloatingPanel.Header>
                    <FloatingPanel.Title>Layers</FloatingPanel.Title>
                    <FloatingPanel.Control>
                        <FloatingPanel.StageTrigger stage="minimized" />
                        <FloatingPanel.StageTrigger stage="maximized" />
                        <FloatingPanel.CloseTrigger />
                    </FloatingPanel.Control>
                </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body>
                Drag the header to move the panel, and a corner to resize it.
            </FloatingPanel.Body>
            {corners.map((axis) => (
                <FloatingPanel.ResizeTrigger key={axis} axis={axis} />
            ))}
        </FloatingPanel.Content>
    </FloatingPanel.Positioner>
);`;

// What a panel opened from a button has to have in hand
const panelTriggerSetup = `${triggerSetup}

${panelSetup}`;

// The panel as it is put together: a button that opens it, the box that says where it stands, and
// the surface that fills it. The header is what it is dragged by, so it is wrapped in the trigger
// that takes hold of it, and the corners are what it is resized by, so one is rendered at each of
// them.
//
// Nothing is drawn until the button is pressed, since a panel floats above the whole page and a
// page of examples that all opened at once would be a stack of them over everything else.
//
// The Stack that holds the button to the start of the card is the page's own furniture, as the card
// around it is, so the listing beneath is of the panel alone. The card lays what it is handed out in
// a column, and a column stretches what it holds the whole way across unless it is told otherwise
const defaultPreview = (
    <Stack align="start">
        <FloatingPanelComponent defaultPosition={{ x: 480, y: 160 }}>
            <FloatingPanelComponent.Trigger className={classes.trigger}>
                Open the panel
            </FloatingPanelComponent.Trigger>
            <FloatingPanelComponent.Positioner>
                <FloatingPanelComponent.Content>
                    <FloatingPanelComponent.DragTrigger>
                        <FloatingPanelComponent.Header>
                            <FloatingPanelComponent.Title>Layers</FloatingPanelComponent.Title>
                            <FloatingPanelComponent.Control>
                                <FloatingPanelComponent.StageTrigger stage="minimized" />
                                <FloatingPanelComponent.StageTrigger stage="maximized" />
                                <FloatingPanelComponent.CloseTrigger />
                            </FloatingPanelComponent.Control>
                        </FloatingPanelComponent.Header>
                    </FloatingPanelComponent.DragTrigger>
                    <FloatingPanelComponent.Body>
                        Drag the header to move the panel, and a corner to resize it.
                    </FloatingPanelComponent.Body>
                    {corners.map((axis) => (
                        <FloatingPanelComponent.ResizeTrigger key={axis} axis={axis} />
                    ))}
                </FloatingPanelComponent.Content>
            </FloatingPanelComponent.Positioner>
        </FloatingPanelComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<FloatingPanel defaultPosition={{ x: 480, y: 160 }}>
    <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
    <FloatingPanel.Positioner>
        <FloatingPanel.Content>
            <FloatingPanel.DragTrigger>
                <FloatingPanel.Header>
                    <FloatingPanel.Title>Layers</FloatingPanel.Title>
                    <FloatingPanel.Control>
                        <FloatingPanel.StageTrigger stage="minimized" />
                        <FloatingPanel.StageTrigger stage="maximized" />
                        <FloatingPanel.CloseTrigger />
                    </FloatingPanel.Control>
                </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body>
                Drag the header to move the panel, and a corner to resize it.
            </FloatingPanel.Body>
            {corners.map((axis) => (
                <FloatingPanel.ResizeTrigger key={axis} axis={axis} />
            ))}
        </FloatingPanel.Content>
    </FloatingPanel.Positioner>
</FloatingPanel>`;

// Every side and corner taken hold of rather than the four corners alone. Which of them a panel
// answers to is settled by which triggers were rendered, so a panel that should only grow sideways
// leaves the rest out and one given none of them cannot be resized at all
const everyEdgePreview = (
    <Stack align="start">
        <FloatingPanelComponent defaultPosition={{ x: 520, y: 200 }}>
            <FloatingPanelComponent.Trigger className={classes.trigger}>
                Open the panel
            </FloatingPanelComponent.Trigger>
            <FloatingPanelComponent.Positioner>
                <FloatingPanelComponent.Content>
                    <FloatingPanelComponent.DragTrigger>
                        <FloatingPanelComponent.Header>
                            <FloatingPanelComponent.Title>Layers</FloatingPanelComponent.Title>
                            <FloatingPanelComponent.Control>
                                <FloatingPanelComponent.StageTrigger stage="minimized" />
                                <FloatingPanelComponent.StageTrigger stage="maximized" />
                                <FloatingPanelComponent.CloseTrigger />
                            </FloatingPanelComponent.Control>
                        </FloatingPanelComponent.Header>
                    </FloatingPanelComponent.DragTrigger>
                    <FloatingPanelComponent.Body>
                        Every side and corner can be taken hold of.
                    </FloatingPanelComponent.Body>
                    {edges.map((axis) => (
                        <FloatingPanelComponent.ResizeTrigger key={axis} axis={axis} />
                    ))}
                </FloatingPanelComponent.Content>
            </FloatingPanelComponent.Positioner>
        </FloatingPanelComponent>
    </Stack>
);

const everyEdgeSetup = `${triggerSetup}

const edges = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];`;

const everyEdgeCode = `<FloatingPanel defaultPosition={{ x: 520, y: 200 }}>
    <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
    <FloatingPanel.Positioner>
        <FloatingPanel.Content>
            <FloatingPanel.DragTrigger>
                <FloatingPanel.Header>
                    <FloatingPanel.Title>Layers</FloatingPanel.Title>
                    <FloatingPanel.Control>
                        <FloatingPanel.StageTrigger stage="minimized" />
                        <FloatingPanel.StageTrigger stage="maximized" />
                        <FloatingPanel.CloseTrigger />
                    </FloatingPanel.Control>
                </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body>Every side and corner can be taken hold of.</FloatingPanel.Body>
            {edges.map((axis) => (
                <FloatingPanel.ResizeTrigger key={axis} axis={axis} />
            ))}
        </FloatingPanel.Content>
    </FloatingPanel.Positioner>
</FloatingPanel>`;

// How much of the panel is showing. It opens as its header alone here, so what the stage triggers
// do can be read rather than described: the same button both minimizes and restores, since one that
// would put the panel where it already is takes it back to the default instead.
//
// Neither of the other two stages is laid out from a rect the way the default one is — the header
// alone has no height to resize, and a maximized panel fills the room it was given — so the resize
// triggers are taken away at both of them and a maximized panel cannot be dragged either
const stagesPreview = (
    <Stack align="start">
        <FloatingPanelComponent defaultStage="minimized" defaultPosition={{ x: 560, y: 240 }}>
            <FloatingPanelComponent.Trigger className={classes.trigger}>
                Open the panel
            </FloatingPanelComponent.Trigger>
            {panel}
        </FloatingPanelComponent>
    </Stack>
);

const stagesCode = `<FloatingPanel defaultStage="minimized" defaultPosition={{ x: 560, y: 240 }}>
    <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
    {panel}
</FloatingPanel>`;

// Every step of a drag rounded to a multiple of the grid, so that panels put down beside one
// another line up rather than standing a pixel or two apart. It rounds what a resize comes to as
// well, so a panel dragged larger keeps to the same grid it is moved on
const gridPreview = (
    <Stack align="start">
        <FloatingPanelComponent gridSize={32} defaultPosition={{ x: 480, y: 192 }}>
            <FloatingPanelComponent.Trigger className={classes.trigger}>
                Open the panel
            </FloatingPanelComponent.Trigger>
            {panel}
        </FloatingPanelComponent>
    </Stack>
);

const gridCode = `<FloatingPanel gridSize={32} defaultPosition={{ x: 480, y: 192 }}>
    <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
    {panel}
</FloatingPanel>`;

// The shape the panel opened at held as it is resized. The edge that was taken hold of is the one
// that leads: a side dragged sideways settles the width and the height follows from it, and the
// other way about for a top or a bottom
const lockedAspectRatioPreview = (
    <Stack align="start">
        <FloatingPanelComponent
            lockAspectRatio
            defaultPosition={{ x: 600, y: 200 }}
            defaultSize={{ width: 320, height: 180 }}
        >
            <FloatingPanelComponent.Trigger className={classes.trigger}>
                Open the panel
            </FloatingPanelComponent.Trigger>
            {panel}
        </FloatingPanelComponent>
    </Stack>
);

const lockedAspectRatioCode = `<FloatingPanel
    lockAspectRatio
    defaultPosition={{ x: 600, y: 200 }}
    defaultSize={{ width: 320, height: 180 }}
>
    <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
    {panel}
</FloatingPanel>`;

// A panel that floats but stays where it was put. The header no longer offers the hand that says it
// can be carried, and the arrow keys no longer move it, while the corners still resize it
const notDraggablePreview = (
    <Stack align="start">
        <FloatingPanelComponent draggable={false} defaultPosition={{ x: 520, y: 280 }}>
            <FloatingPanelComponent.Trigger className={classes.trigger}>
                Open the panel
            </FloatingPanelComponent.Trigger>
            {panel}
        </FloatingPanelComponent>
    </Stack>
);

const notDraggableCode = `<FloatingPanel draggable={false} defaultPosition={{ x: 520, y: 280 }}>
    <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
    {panel}
</FloatingPanel>`;

// The panel left on the page with both gestures taken out of it, which is what a panel waiting on
// something else comes to. It is not the same as being closed: everything in it can still be read
// and reached, and the buttons in the header are drawn as unavailable rather than taken away
const disabledPreview = (
    <Stack align="start">
        <FloatingPanelComponent disabled defaultPosition={{ x: 640, y: 240 }}>
            <FloatingPanelComponent.Trigger className={classes.trigger}>
                Open the panel
            </FloatingPanelComponent.Trigger>
            {panel}
        </FloatingPanelComponent>
    </Stack>
);

const disabledCode = `<FloatingPanel disabled defaultPosition={{ x: 640, y: 240 }}>
    <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
    {panel}
</FloatingPanel>`;

// Where the panel stands kept by the page rather than by the panel. It is reported on every step of
// the drag rather than once it is let go of, which is what a caller drawing something else from the
// position wants; a caller that would rather store where it landed is told that separately
const ControlledPreview = () => {
    const [position, setPosition] = React.useState<FloatingPanelPoint>({ x: 560, y: 200 });

    return (
        <Stack gap="condensed" align="start">
            <Text size="small">
                Standing at {Math.round(position.x)}, {Math.round(position.y)}
            </Text>
            <FloatingPanelComponent position={position} onPositionChange={setPosition}>
                <FloatingPanelComponent.Trigger className={classes.trigger}>
                    Open the panel
                </FloatingPanelComponent.Trigger>
                {panel}
            </FloatingPanelComponent>
        </Stack>
    );
};

const controlledSetup = `${panelTriggerSetup}

const [position, setPosition] = React.useState({ x: 560, y: 200 });`;

const controlledCode = `<Stack gap="condensed" align="start">
    <Text size="small">
        Standing at {Math.round(position.x)}, {Math.round(position.y)}
    </Text>
    <FloatingPanel position={position} onPositionChange={setPosition}>
        <FloatingPanel.Trigger className={trigger}>Open the panel</FloatingPanel.Trigger>
        {panel}
    </FloatingPanel>
</Stack>`;

// The panel as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what it can be taken hold of by, then how much of it is showing, then what is done to
// the gestures themselves, and last where it stands once the page is holding that
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The panel as it is put together: a button that opens it, the box that says where it stands, and the surface that fills it. The header is what it is dragged by, so it is wrapped in the trigger that takes hold of it, and the corners are what it is resized by, so one is rendered at each of them. Nothing is drawn until the button is pressed, since a panel floats above the whole page.",
        setup: `${triggerSetup}\n${cornersSetup}`,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Resizing from every edge",
        description:
            "Every side and corner taken hold of rather than the four corners alone. Which of them a panel answers to is settled by which triggers were rendered, so a panel that should only grow sideways leaves the rest out and one given none of them cannot be resized at all. Each is a tab stop of its own and can be moved with the arrow keys, which is why all eight are not drawn for the caller.",
        setup: everyEdgeSetup,
        preview: everyEdgePreview,
        code: everyEdgeCode,
    },
    {
        name: "Stages",
        description:
            "How much of the panel is showing. It opens as its header alone here, so that what the stage triggers do can be read rather than described: the same button both minimizes and restores, since one that would put the panel where it already is takes it back to the default instead. Neither of the other two stages is laid out from a rect the way the default one is, so the resize triggers are taken away at both, and a maximized panel cannot be dragged either.",
        setup: panelTriggerSetup,
        preview: stagesPreview,
        code: stagesCode,
    },
    {
        name: "Snapped to a grid",
        description:
            "Every step of a drag rounded to a multiple of the grid, so that panels put down beside one another line up rather than standing a pixel or two apart. It rounds what a resize comes to as well, so a panel dragged larger keeps to the same grid it is moved on.",
        setup: panelTriggerSetup,
        preview: gridPreview,
        code: gridCode,
    },
    {
        name: "Locked aspect ratio",
        description:
            "The shape the panel opened at held as it is resized. The edge that was taken hold of is the one that leads: a side dragged sideways settles the width and the height follows from it, and the other way about for a top or a bottom.",
        setup: panelTriggerSetup,
        preview: lockedAspectRatioPreview,
        code: lockedAspectRatioCode,
    },
    {
        name: "Fixed in place",
        description:
            "A panel that floats but stays where it was put. The header no longer offers the hand that says it can be carried and the arrow keys no longer move it, while the corners still resize it. A panel that should neither move nor grow simply renders no resize triggers alongside this.",
        setup: panelTriggerSetup,
        preview: notDraggablePreview,
        code: notDraggableCode,
    },
    {
        name: "Disabled",
        description:
            "The panel left on the page with both gestures taken out of it, which is what one waiting on something else comes to. It is not the same as being closed: everything in it can still be read and reached, and the buttons in the header are drawn as unavailable rather than taken away.",
        setup: panelTriggerSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Held by the page",
        description:
            "Where the panel stands kept by the page rather than by the panel. It is reported on every step of the drag rather than once it is let go of, which is what a caller drawing something else from the position wants; a caller that would rather store only where it landed is told that separately.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// How much of the panel is showing
const stage = '"default" | "minimized" | "maximized"';

// Whether the panel is laid out against the viewport or against the nearest positioned ancestor
const strategy = '"fixed" | "absolute"';

// Which edge or corner a resize trigger takes hold of, named after the compass point it sits at
const resizeAxis = '"n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw"';

// Where the panel's top-left corner sits, and how large it is
const point = "{ x: number; y: number }";

const size = "{ width: number; height: number }";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them. The parts are drawn as different elements, so each is named with the one it
// falls back to rather than the prop being written out seven times over
const polymorphic = (element: string) => ({
    name: "as",
    type: "React.ElementType",
    default: `"${element}"`,
    description: "The element or component this is drawn as, in place of its default",
});

// Every prop the panel and its parts take, under the one that takes it. Whether it is showing comes
// first, then where it stands and how large it is, then how much of it is showing, then what the
// gestures are held to.
//
// Each of the four things the panel keeps can be held by the caller or left to the panel, so each
// is written as the three props that go together: the value, the one it starts at, and what is
// called as it changes
const groups: ComponentPropGroup[] = [
    {
        name: "FloatingPanel",
        props: [
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the panel is showing, for a caller keeping hold of that themselves. Left out, the panel keeps its own",
            },
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether the panel starts out showing, where it keeps its own state",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called whenever the panel opens or closes",
            },
            {
                name: "position",
                type: point,
                description:
                    "Where the panel's top-left corner sits, for a caller keeping hold of that themselves. It is read in whatever the panel is laid out against: the viewport for a fixed panel, and the nearest positioned ancestor for one laid out against an ancestor",
            },
            {
                name: "defaultPosition",
                type: point,
                default: "{ x: 24, y: 24 }",
                description:
                    "Where the panel opens, where it keeps hold of the position itself. Far enough in from the corner that it reads as sitting above the page rather than as part of its edge",
            },
            {
                name: "onPositionChange",
                type: `(position: ${point}) => void`,
                description:
                    "Called on every step of a drag, which is what a caller drawing something else from where the panel stands wants",
            },
            {
                name: "onPositionChangeEnd",
                type: `(position: ${point}) => void`,
                description:
                    "Called once the drag is let go of, for a caller that would rather store where the panel landed than every place it passed through",
            },
            {
                name: "size",
                type: size,
                description: "How large the panel is, for a caller keeping hold of that themselves",
            },
            {
                name: "defaultSize",
                type: size,
                default: "{ width: 320, height: 240 }",
                description:
                    "How large the panel opens: enough to hold something worth floating, and small enough to leave the page behind it readable",
            },
            {
                name: "onSizeChange",
                type: `(size: ${size}) => void`,
                description: "Called on every step of a resize",
            },
            {
                name: "onSizeChangeEnd",
                type: `(size: ${size}) => void`,
                description: "Called once the edge being dragged is let go of",
            },
            {
                name: "stage",
                type: stage,
                options: ["default", "minimized", "maximized"],
                description:
                    "How much of the panel is showing, for a caller keeping hold of that themselves: all of it, its header alone, or the whole of the room it was given",
            },
            {
                name: "defaultStage",
                type: stage,
                default: '"default"',
                options: ["default", "minimized", "maximized"],
                description: "Which stage the panel opens at, where it keeps its own",
            },
            {
                name: "onStageChange",
                type: `(stage: ${stage}) => void`,
                description: "Called whenever the panel is put into another stage",
            },
            {
                name: "minSize",
                type: size,
                default: "{ width: 200, height: 120 }",
                description:
                    "The smallest the panel can be dragged to. Below the default there is no room left for a header, so a panel dragged smaller would have nothing left to drag it back by",
            },
            {
                name: "maxSize",
                type: size,
                description:
                    "The largest the panel can be dragged to. It is read against the smallest rather than on its own, so a largest below the smallest still leaves a size the panel can take",
            },
            {
                name: "draggable",
                type: "boolean",
                default: "true",
                description:
                    "Whether the panel can be moved. A maximized panel is laid out from the room it was given rather than from a rect, so it cannot be dragged whatever this says",
            },
            {
                name: "resizable",
                type: "boolean",
                default: "true",
                description:
                    "Whether the panel can be resized, alongside which edges were given triggers. Neither a minimized panel nor a maximized one has a rect of its own to work on, so neither can be resized whatever this says",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the panel being moved or resized while leaving it on the page, so everything in it can still be read and reached",
            },
            {
                name: "closeOnEscape",
                type: "boolean",
                default: "true",
                description:
                    "Whether escape closes the panel. The press is taken as it is answered, so whatever the panel was opened from still stands",
            },
            {
                name: "lockAspectRatio",
                type: "boolean",
                default: "false",
                description:
                    "Holds the shape the panel started at as it is resized. The edge that was taken hold of leads: a side dragged sideways settles the width and the height follows from it",
            },
            {
                name: "allowOverflow",
                type: "boolean",
                default: "false",
                description:
                    "Lets the panel be dragged past the edges of its boundary rather than being held within them",
            },
            {
                name: "gridSize",
                type: "number",
                description:
                    "Rounds every step of a drag or a resize to a multiple of this, so that panels put down beside one another line up. Anything at or below nought leaves the value where it was",
            },
            {
                name: "strategy",
                type: strategy,
                default: '"fixed"',
                options: ["fixed", "absolute"],
                description:
                    "Whether the panel is laid out against the viewport or against the nearest positioned ancestor. A fixed panel is drawn outside the page's own tree, so nothing it stands in can clip it or bury it; one laid out against an ancestor stays where it was written, since that ancestor is the very thing it is measured against",
            },
            {
                name: "getBoundaryElement",
                type: "() => HTMLElement | null",
                description:
                    "The room the panel is kept within, which is the viewport where nothing is named. The room is measured in viewport coordinates, so it is read against the position of a fixed panel rather than that of one laid out against an ancestor",
            },
        ],
    },
    {
        name: "FloatingPanel.Trigger",
        props: [styling],
    },
    {
        name: "FloatingPanel.Positioner",
        props: [styling, polymorphic("div")],
    },
    {
        name: "FloatingPanel.Content",
        props: [styling, polymorphic("div")],
    },
    {
        name: "FloatingPanel.DragTrigger",
        props: [styling, polymorphic("div")],
    },
    {
        name: "FloatingPanel.Header",
        props: [styling, polymorphic("div")],
    },
    {
        name: "FloatingPanel.Title",
        props: [styling, polymorphic("h2")],
    },
    {
        name: "FloatingPanel.Control",
        props: [styling, polymorphic("div")],
    },
    {
        name: "FloatingPanel.Body",
        props: [styling, polymorphic("div")],
    },
    {
        name: "FloatingPanel.StageTrigger",
        props: [
            {
                name: "stage",
                type: stage,
                required: true,
                options: ["default", "minimized", "maximized"],
                description:
                    "Which stage pressing it puts the panel into. Pressing the one the panel is already at takes it back to the default instead, and the button says so in the icon it draws and the name it carries, so the same button both minimizes and restores",
            },
            styling,
        ],
    },
    {
        name: "FloatingPanel.CloseTrigger",
        props: [styling],
    },
    {
        name: "FloatingPanel.ResizeTrigger",
        props: [
            {
                name: "axis",
                type: resizeAxis,
                required: true,
                options: ["n", "e", "s", "w", "ne", "nw", "se", "sw"],
                description:
                    "Which edge or corner it takes hold of, named after the compass point it sits at. Each is drawn no wider than a border but answers to a pointer further out than that, so a reader does not have to land on the edge itself to take hold of it",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the panel is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const FloatingPanel = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                FloatingPanel
            </Heading>
            <Text as="p" size="large">
                A panel that floats above the page, is carried about by its header and resized by
                its edges: a palette of layers, a set of tools, a preview kept open beside the work
                it belongs to. It is a dialog rather than a region, but a non-modal one, since a
                floating panel is meant to be worked alongside rather than answered before anything
                else can happen. Which edges it can be taken hold of by is settled by which resize
                triggers are rendered rather than by a prop, so a panel given none of them cannot be
                resized at all. Every gesture can be made from the keyboard as well: the arrow keys
                move the panel while it holds focus, and each resize trigger is a tab stop that
                moves the edge it stands on.
            </Text>
        </Stack>
        <ComponentExamples component="FloatingPanel" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default FloatingPanel;
