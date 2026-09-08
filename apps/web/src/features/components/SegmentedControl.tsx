import * as React from "react";
import { CodeRegular, EyeRegular, PeopleRegular } from "@gamecrafters/base-ui-icons";
import {
    Heading,
    SegmentedControl as SegmentedControlComponent,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A control told to fill what holds it has to be given something to fill, and across the whole
    // of the card it would run the width of the page. It is given a column instead
    preview: "w-[20rem]",
    // A tooltip stands below what it names, so the row is given room under it rather than letting
    // one come out over the edge of the card
    room: "pb-[var(--base-size-24)]",
};

// The plainest control there is: three segments, the first of them the one the row starts on. The
// row says nothing on its own — it is a list of buttons rather than a thing with a name — so it is
// named outright.
//
// The stack around it is the page's own furniture: the row takes only the room it needs, and a
// card laid out down a column would pull it out to the width of the page, which is what a row told
// to fill its container looks like. It is set against the start instead, and left out of the
// listing along with everything else the page puts around what it is showing.
//
// The page and the component it is about are both called SegmentedControl, so the component is
// brought in under a name saying which of the two it is. The listing beneath says SegmentedControl,
// as an application importing it would
const defaultPreview = (
    <Stack align="start">
        <SegmentedControlComponent aria-label="File view">
            <SegmentedControlComponent.Button defaultSelected>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Raw</SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Blame</SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
</SegmentedControl>`;

// A mark before each label, which is also what is left of a segment where the row is told to drop
// its labels
const visualsPreview = (
    <Stack align="start">
        <SegmentedControlComponent aria-label="File view">
            <SegmentedControlComponent.Button defaultSelected leadingVisual={EyeRegular}>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button leadingVisual={CodeRegular}>
                Raw
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button leadingVisual={PeopleRegular}>
                Blame
            </SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const visualsCode = `<SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
        Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={CodeRegular}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={PeopleRegular}>Blame</SegmentedControl.Button>
</SegmentedControl>`;

// A count after each label, for a row whose segments each stand for a number of things
const countsPreview = (
    <Stack align="start">
        <SegmentedControlComponent aria-label="Issues by label">
            <SegmentedControlComponent.Button defaultSelected count={5}>
                Feature
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button count={3}>Bug</SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button count={10}>
                Good first issue
            </SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const countsCode = `<SegmentedControl aria-label="Issues by label">
    <SegmentedControl.Button defaultSelected count={5}>
        Feature
    </SegmentedControl.Button>
    <SegmentedControl.Button count={3}>Bug</SegmentedControl.Button>
    <SegmentedControl.Button count={10}>Good first issue</SegmentedControl.Button>
</SegmentedControl>`;

// Segments carrying a mark and nothing else, each named by the tooltip it brings up. The row is
// given room under it, since a tooltip stands below what it names and would otherwise come out
// over the edge of the card
const iconPreview = (
    <Stack align="start" className={classes.room}>
        <SegmentedControlComponent aria-label="File view">
            <SegmentedControlComponent.IconButton
                defaultSelected
                aria-label="Preview"
                icon={EyeRegular}
            />
            <SegmentedControlComponent.IconButton aria-label="Raw" icon={CodeRegular} />
            <SegmentedControlComponent.IconButton aria-label="Blame" icon={PeopleRegular} />
        </SegmentedControlComponent>
    </Stack>
);

const iconCode = `<SegmentedControl aria-label="File view">
    <SegmentedControl.IconButton defaultSelected aria-label="Preview" icon={EyeRegular} />
    <SegmentedControl.IconButton aria-label="Raw" icon={CodeRegular} />
    <SegmentedControl.IconButton aria-label="Blame" icon={PeopleRegular} />
</SegmentedControl>`;

// A segment that cannot be picked. It stays in the tab order rather than going quiet, so a reader
// can still reach it and be told what it is
const disabledPreview = (
    <Stack align="start">
        <SegmentedControlComponent aria-label="File view">
            <SegmentedControlComponent.Button defaultSelected>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Raw</SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button disabled>Blame</SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const disabledCode = `<SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button disabled>Blame</SegmentedControl.Button>
</SegmentedControl>`;

// The two sizes the row comes in, drawn together since a size is read against the other rather
// than on its own
const sizesPreview = (
    <Stack gap="normal" align="start">
        <SegmentedControlComponent aria-label="File view, small" size="small">
            <SegmentedControlComponent.Button defaultSelected>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Raw</SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Blame</SegmentedControlComponent.Button>
        </SegmentedControlComponent>
        <SegmentedControlComponent aria-label="File view, medium">
            <SegmentedControlComponent.Button defaultSelected>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Raw</SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Blame</SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const sizesCode = `<Stack gap="normal" align="start">
    <SegmentedControl aria-label="File view, small" size="small">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
    <SegmentedControl aria-label="File view, medium">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
</Stack>`;

// The row drawn to the width of whatever holds it, with the room shared evenly between the
// segments. The column it is given to fill is the page's own furniture: across the whole of the
// card the row would run the width of the page, which shows nothing a wide row does not
const fullWidthPreview = (
    <Stack className={classes.preview}>
        <SegmentedControlComponent aria-label="File view" fullWidth>
            <SegmentedControlComponent.Button defaultSelected>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Raw</SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Blame</SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const fullWidthCode = `<SegmentedControl aria-label="File view" fullWidth>
    <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
</SegmentedControl>`;

// The labels dropped where the viewport is narrow, which leaves the marks to stand for the
// segments. It is read off the viewport rather than off whatever holds the row, so the window has
// to be brought in for it to be seen
const hideLabelsPreview = (
    <Stack align="start">
        <SegmentedControlComponent
            aria-label="File view"
            variant={{ narrow: "hideLabels", regular: "default" }}
        >
            <SegmentedControlComponent.Button defaultSelected leadingVisual={EyeRegular}>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button leadingVisual={CodeRegular}>
                Raw
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button leadingVisual={PeopleRegular}>
                Blame
            </SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const hideLabelsCode = `<SegmentedControl
    aria-label="File view"
    variant={{ narrow: "hideLabels", regular: "default" }}
>
    <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
        Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={CodeRegular}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={PeopleRegular}>Blame</SegmentedControl.Button>
</SegmentedControl>`;

// The whole row given up where the viewport is narrow, and a menu offering the same segments drawn
// in its place. The row is put away rather than taken apart, so what the menu offers is read off
// the segments themselves and nothing has to be written twice
const dropdownPreview = (
    <Stack align="start">
        <SegmentedControlComponent
            aria-label="File view"
            variant={{ narrow: "dropdown", regular: "default" }}
        >
            <SegmentedControlComponent.Button defaultSelected leadingVisual={EyeRegular}>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button leadingVisual={CodeRegular}>
                Raw
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button leadingVisual={PeopleRegular}>
                Blame
            </SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const dropdownCode = `<SegmentedControl
    aria-label="File view"
    variant={{ narrow: "dropdown", regular: "default" }}
>
    <SegmentedControl.Button defaultSelected leadingVisual={EyeRegular}>
        Preview
    </SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={CodeRegular}>Raw</SegmentedControl.Button>
    <SegmentedControl.Button leadingVisual={PeopleRegular}>Blame</SegmentedControl.Button>
</SegmentedControl>`;

// Where the caller keeps hold of which segment the row is resting on. The row is told which of
// them that is rather than keeping it, and says which was pressed by the place it stands in the
// row.
//
// What the caller does with the answer is the reason for holding it at all, so it is put to use
// beside the row rather than only stored. The state is the caller's, which makes this a component
// of its own rather than an element the page holds ready
const ControlledPreview = () => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const views = ["Preview", "Raw", "Blame"];

    return (
        <Stack gap="condensed" align="start">
            <SegmentedControlComponent aria-label="File view" onChange={setSelectedIndex}>
                {views.map((view, index) => (
                    <SegmentedControlComponent.Button key={view} selected={index === selectedIndex}>
                        {view}
                    </SegmentedControlComponent.Button>
                ))}
            </SegmentedControlComponent>
            <Text size="small">Showing {views[selectedIndex]}</Text>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. The row is told where it stands
// rather than keeping it, so the state is the caller's and is got ready here
const controlledSetup = `const [selectedIndex, setSelectedIndex] = React.useState(0);

const views = ["Preview", "Raw", "Blame"];`;

const controlledCode = `<Stack gap="condensed" align="start">
    <SegmentedControl aria-label="File view" onChange={setSelectedIndex}>
        {views.map((view, index) => (
            <SegmentedControl.Button key={view} selected={index === selectedIndex}>
                {view}
            </SegmentedControl.Button>
        ))}
    </SegmentedControl>
    <Text size="small">Showing {views[selectedIndex]}</Text>
</Stack>`;

// The row named by words already on the page rather than by a name of its own, with a second line
// saying more about it. Both are pointed at by id, since neither of them holds the row
const namedPreview = (
    <Stack gap="normal" align="start">
        <Stack gap="condensed">
            <Text id="file-view-label" weight="semibold">
                File view
            </Text>
            <Text id="file-view-caption" size="small">
                Change the way the file is shown
            </Text>
        </Stack>
        <SegmentedControlComponent
            aria-labelledby="file-view-label"
            aria-describedby="file-view-caption"
        >
            <SegmentedControlComponent.Button defaultSelected>
                Preview
            </SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Raw</SegmentedControlComponent.Button>
            <SegmentedControlComponent.Button>Blame</SegmentedControlComponent.Button>
        </SegmentedControlComponent>
    </Stack>
);

const namedCode = `<Stack gap="normal" align="start">
    <Stack gap="condensed">
        <Text id="file-view-label" weight="semibold">
            File view
        </Text>
        <Text id="file-view-caption" size="small">
            Change the way the file is shown
        </Text>
    </Stack>
    <SegmentedControl
        aria-labelledby="file-view-label"
        aria-describedby="file-view-caption"
    >
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
    </SegmentedControl>
</Stack>`;

// The control as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what a segment can carry, then how the row is drawn, then what it falls back to
// where there is no room for it, and last who is holding the answer and how the row is named
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A row of segments, the first of them the one it starts on. Each segment is a button that reports whether it is the one being shown, so a reader hears which of them the row is resting on rather than having to work it out from the colour. The label is laid out at the weight it takes once it is picked, so the row does not shift as the reader moves along it.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A mark before each label",
        description:
            "Which the segment carries the way a button does. It is also what a segment is left with where the row is told to drop its labels, so a row that might ever have to do that is given marks whether or not it is narrow yet.",
        preview: visualsPreview,
        code: visualsCode,
    },
    {
        name: "Counts",
        description:
            "A count after the label, for a row whose segments each stand for a number of things. It is drawn as a counter rather than written into the label, so the number is set apart from the words and the row still reads as a row of names.",
        preview: countsPreview,
        code: countsCode,
    },
    {
        name: "Marks on their own",
        description:
            "Segments carrying a mark and nothing else, for a row standing where there is no room for words. A mark says nothing by itself, so each of these is named, and the name is read from the tooltip it brings up rather than from the button — which is what lets the same words serve the reader who points at it and the reader who arrives by keyboard. A segment given something more to say carries that in the tooltip instead and keeps the name on the button.",
        preview: iconPreview,
        code: iconCode,
    },
    {
        name: "A segment that cannot be picked",
        description:
            "It says so rather than going quiet: it is left in the tab order and marked unavailable, so a reader can still reach it and be told what it is instead of finding a gap in the row. It is not picked however it is reached — by pointer, by keyboard, or from the menu the row falls back to.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Sizes",
        description:
            "The two the row comes in. Small is for a row standing beside other controls of that size; medium is the size the track is already drawn at.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Filling its container",
        description:
            "The room shared evenly between the segments, in place of the row taking only what it needs. An icon segment gives up the square it otherwise keeps to and takes its share along with the rest. The column around it here is the page's own, since across the whole of the card a full-width row shows nothing a wide one does not. It can also be given one viewport range at a time, for a row that fills a narrow screen and takes its own width from there up.",
        preview: fullWidthPreview,
        code: fullWidthCode,
    },
    {
        name: "Dropping the labels where there is no room",
        description:
            "The marks left to stand for the segments, which is the narrower of the two ways out of a tight space. The label is still there to be read — it is not drawn rather than not given — so nothing is lost to a screen reader. This is read off the viewport rather than off whatever holds the row, so the window has to be brought under 768px for it to be seen.",
        preview: hideLabelsPreview,
        code: hideLabelsCode,
    },
    {
        name: "Giving way to a menu where there is no room",
        description:
            "The whole row put away and a menu drawn in its place, offering the same segments in a list. What the menu shows is read off the segments themselves — their labels, their marks, and which of them cannot be picked — so none of it is written twice. The button says which segment the row is resting on, and adds the name the row was given so it is not left as another menu among several. Like the labels, this is read off the viewport, so the window has to be brought under 768px for it to be seen.",
        preview: dropdownPreview,
        code: dropdownCode,
    },
    {
        name: "Where the caller keeps hold of it",
        description:
            "The row shows what it is told rather than what was pressed, and reports the press either way. A segment is named by where it stands in the row rather than by a value of its own, so what comes back is the index, and anything else on the screen can be moved by the same answer.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Named from the page",
        description:
            "A row of segments says nothing on its own, so it has to be named. Where the words are already on the page they are pointed at rather than written a second time, and a second line saying more about the row is pointed at alongside them. One of a name and a pointer to one has to be given, and the two are refused together.",
        preview: namedPreview,
        code: namedCode,
    },
];

// A visual is handed over as the component to draw, or as an element already built
const visual = "React.ElementType | React.ReactElement | null";

// What the mark an icon segment carries is handed over as. There is no null among them, as there is
// wherever a visual is one thing a segment lays out among several, since the mark is the whole of
// what an icon segment carries
const icon = "React.ElementType | React.ReactElement";

// How much room the segments are given
const size = '"small" | "medium"';

// Whether the row fills what holds it, said outright or one viewport range at a time
const fullWidth = "boolean | ResponsiveValue<boolean>";

// What the row falls back to where there is no room to draw it in full. A fallback is only ever a
// way out of a tight space, so it is given per viewport range rather than outright, and the one
// value it takes on its own is the row as it stands
const variant = '"default" | ResponsiveValue<SegmentedControlVariant>';

// Where the tooltip stands in relation to the segment it names, written as a compass point
const tooltipDirection = '"nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What both kinds of segment take, whichever of them the row was written with. They are the same
// props saying the same thing under either, so they are named once here and reached for by both
const selected = {
    name: "selected",
    type: "boolean",
    description:
        "Whether this is the segment the row is resting on, where the caller keeps hold of that. The row is told which of them it is rather than working it out, and keeps the answer up to date through its own onChange",
};

const defaultSelected = {
    name: "defaultSelected",
    type: "boolean",
    default: "false",
    description:
        "Picks the segment on the first render, for a row that keeps its own state. With nothing said about it under any segment the row starts on the first of them",
};

const segmentDisabled = {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
        "Reads as unavailable while staying in the tab order, so a reader can still reach the segment and be told what it is. It is not picked however it is reached, the row's own onChange included",
};

const segmentProps = {
    name: "...button props",
    type: 'React.ComponentPropsWithoutRef<"button">',
    description:
        "It is a button underneath, so it takes what one takes: onClick, id, name, and the rest. What the row does with a press is added to onClick rather than put in its place, so a segment can be told about its own press as well",
};

// Every prop the row takes, and then the two kinds of segment it is written with.
//
// How the row is named comes first, since a row of segments says nothing without it, then how it is
// drawn, then what it falls back to where there is no room, and last what it is underneath
const groups: ComponentPropGroup[] = [
    {
        name: "SegmentedControl",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the row in words, where there are none on the page to point at. One of this and aria-labelledby has to be given, and the two are refused together. Where the row gives way to a menu the name is carried into the button as well, so it is not left as another menu among several",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the row by whatever on the page already says what it is, in place of aria-label",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How much room the segments are given. Small is for a row standing beside other controls of that size; medium is the size the track is already drawn at",
            },
            {
                name: "fullWidth",
                type: fullWidth,
                default: "false",
                description:
                    "Fills the width of whatever holds it, with the room shared evenly between the segments and an icon segment giving up the square it otherwise keeps to. It can be given one viewport range at a time, for a row that fills a narrow screen and takes its own width from there up",
            },
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "What the row falls back to where there is no room to draw it in full: hideLabels leaves the marks to stand for the segments, and dropdown puts the row away and draws a menu offering the same segments in its place. It is read off the viewport rather than off whatever holds the row, and is given per range, since a fallback is only ever a way out of a tight space",
            },
            {
                name: "onChange",
                type: "(selectedIndex: number) => void",
                description:
                    "Called with where in the row the segment that was picked stands. A row that is given one of these and no defaultSelected under any of its segments is one the caller is holding the state of, and shows what it is told rather than what was pressed",
            },
            styling,
            {
                name: "...ul props",
                type: 'Omit<React.ComponentPropsWithoutRef<"ul">, "onChange" | "aria-label" | "aria-labelledby">',
                description:
                    "The row is a list underneath, so it takes what one takes: id, aria-describedby, and the rest. The three taken out are the row's own — the name because it is one of two, and the change because it reports an index rather than an event",
            },
        ],
    },
    {
        name: "SegmentedControl.Button",
        props: [
            {
                name: "children",
                type: "string",
                required: true,
                description:
                    "The label the segment carries. It is words rather than anything drawn, since the menu the row falls back to shows the same label in its place and has nowhere to put more than that",
            },
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "The mark before the label, handed over as the component to draw or as an element already built. It is what the segment is left with where the row drops its labels, and what the menu shows beside the label where the row gives way to one",
            },
            {
                name: "count",
                type: "number | string",
                description:
                    "A count after the label, drawn as a counter rather than written into the label",
            },
            selected,
            defaultSelected,
            segmentDisabled,
            styling,
            segmentProps,
        ],
    },
    {
        name: "SegmentedControl.IconButton",
        props: [
            {
                name: "aria-label",
                type: "string",
                required: true,
                description:
                    "What the segment is called. It carries a mark rather than words, so it has to be named, and with nothing else to say about it the name is read from the tooltip in place of being read from the button",
            },
            {
                name: "icon",
                type: icon,
                required: true,
                description:
                    "The mark drawn in place of a label. It is handed over as the icon itself rather than as an element built from it, so the segment draws it at the size and in the colour it is being drawn at",
            },
            {
                name: "description",
                type: "string",
                description:
                    "Says more about the segment than its name does. Where there is one the tooltip carries it and the segment keeps the name on the button, so the two are read one after the other rather than one instead of the other",
            },
            {
                name: "tooltipDirection",
                type: tooltipDirection,
                default: '"s"',
                description:
                    "Where the tooltip stands in relation to the segment. It stands below by default, which is clear of the row above it",
            },
            selected,
            defaultSelected,
            segmentDisabled,
            styling,
            segmentProps,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the control is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const SegmentedControl = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                SegmentedControl
            </Heading>
            <Text as="p" size="large">
                A row of segments, one of which is the one being shown. It is for a handful of
                choices that are all worth seeing at once and are each named in a word or two —
                which way to draw a file, which range to read a chart over — where a menu would hide
                what there is to choose from behind a press. Underneath it is a list of buttons,
                each of which reports whether it is the one being pressed, so what a reader hears is
                a row and the segment the row is resting on. Where there is no room to draw it in
                full it either drops its labels down to the marks or gives way to a menu offering
                the same segments, both of which are read off the viewport and given one range at a
                time.
            </Text>
        </Stack>
        <ComponentExamples component="SegmentedControl" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default SegmentedControl;
