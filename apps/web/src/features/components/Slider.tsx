import * as React from "react";
import { Heading, Slider as SliderComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A slider told to fill takes the width of whatever it stands in, so the page gives it a column
    // to fill rather than running it the whole width of the card
    preview: "w-full max-w-[24rem]",
    // The name of the field above the slider it names
    label: "text-[length:var(--text-body-size-medium)] font-semibold",
    // A name and the reading beside it, held to either end of the line above the slider
    row: "flex items-center justify-between",
    // Sliders standing up are laid out along the row they are read across, each with whatever
    // names it beneath
    faders: "flex flex-row items-end gap-[var(--base-size-24)]",
    fader: "flex flex-col items-center gap-[var(--base-size-8)]",
    // Gives a slider standing up more room than it starts out with, so that filling the height it
    // stands in shows as more than the height it already had
    tall: "flex h-[12rem]",
    muted: "text-[var(--foreground-color-muted)]",
};

// The plainest slider there is: a track, a thumb standing part of the way along it, and nothing
// said about the range, so it runs from nought to a hundred a step at a time. It keeps its own
// value, since nothing was handed one to hold.
//
// It is named rather than labelled here, since what the example is about is the control itself and
// a field to put it in would be the larger part of the listing.
//
// The page and the component it is about are both called Slider, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Slider, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <SliderComponent aria-label="Volume" defaultValue={50} />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Slider aria-label="Volume" defaultValue={50} />`;

// The three sizes, each named by the value that drew it. The size settles how thick the control
// stands as well as how big the track and the thumb are, so the three are read down rather than
// across: what is being compared is the weight of one against the next
const sizesPreview = (
    <Stack gap="normal" className={classes.preview}>
        <Stack gap="condensed">
            <label htmlFor="volume-small" className={classes.label}>
                small
            </label>
            <SliderComponent id="volume-small" size="small" defaultValue={50} block />
        </Stack>
        <Stack gap="condensed">
            <label htmlFor="volume-medium" className={classes.label}>
                medium
            </label>
            <SliderComponent id="volume-medium" defaultValue={50} block />
        </Stack>
        <Stack gap="condensed">
            <label htmlFor="volume-large" className={classes.label}>
                large
            </label>
            <SliderComponent id="volume-large" size="large" defaultValue={50} block />
        </Stack>
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    <Stack gap="condensed">
        <label htmlFor="volume-small">small</label>
        <Slider id="volume-small" size="small" defaultValue={50} block />
    </Stack>
    <Stack gap="condensed">
        <label htmlFor="volume-medium">medium</label>
        <Slider id="volume-medium" defaultValue={50} block />
    </Stack>
    <Stack gap="condensed">
        <label htmlFor="volume-large">large</label>
        <Slider id="volume-large" size="large" defaultValue={50} block />
    </Stack>
</Stack>`;

// One slider keeping the width it starts out with and one filling what it stands in, read one above
// the other, since the difference is only there against the other
const blockPreview = (
    <Stack gap="normal" className={classes.preview}>
        <SliderComponent aria-label="Keeps its own width" defaultValue={50} />
        <SliderComponent aria-label="Fills the width" defaultValue={50} block />
    </Stack>
);

const blockCode = `<Stack gap="normal">
    <Slider aria-label="Keeps its own width" defaultValue={50} />
    <Slider aria-label="Fills the width" defaultValue={50} block />
</Stack>`;

// A slider standing up, which is filled from the bottom the way a fader is rather than from the
// top the way a page is read
const verticalPreview = (
    <div className={classes.faders}>
        <div className={classes.fader}>
            <SliderComponent aria-label="Bass" orientation="vertical" defaultValue={40} />
            <Text size="small" className={classes.muted}>
                Bass
            </Text>
        </div>
        <div className={classes.fader}>
            <SliderComponent aria-label="Middle" orientation="vertical" defaultValue={60} />
            <Text size="small" className={classes.muted}>
                Middle
            </Text>
        </div>
        <div className={classes.fader}>
            <SliderComponent aria-label="Treble" orientation="vertical" defaultValue={75} />
            <Text size="small" className={classes.muted}>
                Treble
            </Text>
        </div>
    </div>
);

// The row the faders stand in is part of what is being shown rather than the page's own furniture,
// since a slider standing up is nearly always one of several. It is written out as the classes it
// stands for rather than as the name the page holds it under, since what is copied out of here has
// only itself to reach for
const verticalCode = `<div className="flex flex-row items-end gap-[var(--base-size-24)]">
    <div className="flex flex-col items-center gap-[var(--base-size-8)]">
        <Slider aria-label="Bass" orientation="vertical" defaultValue={40} />
        <Text size="small">Bass</Text>
    </div>
    <div className="flex flex-col items-center gap-[var(--base-size-8)]">
        <Slider aria-label="Middle" orientation="vertical" defaultValue={60} />
        <Text size="small">Middle</Text>
    </div>
    <div className="flex flex-col items-center gap-[var(--base-size-8)]">
        <Slider aria-label="Treble" orientation="vertical" defaultValue={75} />
        <Text size="small">Treble</Text>
    </div>
</div>`;

// A slider standing up keeping its own height beside one filling what it stands in, since filling
// means the height rather than the width once the slider is on its end
const verticalBlockPreview = (
    <div className={classes.faders}>
        <div className={classes.tall}>
            <SliderComponent
                aria-label="Keeps its own height"
                orientation="vertical"
                defaultValue={50}
            />
        </div>
        <div className={classes.tall}>
            <SliderComponent
                aria-label="Fills the height"
                orientation="vertical"
                defaultValue={50}
                block
            />
        </div>
    </div>
);

const verticalBlockCode = `<div className="flex flex-row items-end gap-[var(--base-size-24)]">
    <div className="flex h-[12rem]">
        <Slider aria-label="Keeps its own height" orientation="vertical" defaultValue={50} />
    </div>
    <div className="flex h-[12rem]">
        <Slider aria-label="Fills the height" orientation="vertical" defaultValue={50} block />
    </div>
</div>`;

// A range of its own, rather than the nought to a hundred a slider takes where it is told nothing
const rangePreview = (
    <Stack gap="condensed" className={classes.preview}>
        <label htmlFor="temperature" className={classes.label}>
            Temperature
        </label>
        <SliderComponent id="temperature" min={16} max={30} defaultValue={21} block />
    </Stack>
);

const rangeCode = `<Stack gap="condensed">
    <label htmlFor="temperature">Temperature</label>
    <Slider id="temperature" min={16} max={30} defaultValue={21} block />
</Stack>`;

// A value that only means anything at certain points along the range, so the slider moves between
// them rather than through everything in between
const stepPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <label htmlFor="rating" className={classes.label}>
            Rating
        </label>
        <SliderComponent id="rating" min={0} max={5} step={1} defaultValue={3} block />
    </Stack>
);

const stepCode = `<Stack gap="condensed">
    <label htmlFor="rating">Rating</label>
    <Slider id="rating" min={0} max={5} step={1} defaultValue={3} block />
</Stack>`;

// A slider that cannot be moved. It is faded rather than drained, so where it stands is still
// there to be read
const disabledPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <label htmlFor="volume-disabled" className={classes.label}>
            Volume
        </label>
        <SliderComponent id="volume-disabled" defaultValue={40} disabled block />
    </Stack>
);

const disabledCode = `<Stack gap="condensed">
    <label htmlFor="volume-disabled">Volume</label>
    <Slider id="volume-disabled" defaultValue={40} disabled block />
</Stack>`;

// The value held by whoever is drawing the slider rather than by the slider, which is what showing
// the reading beside it wants: the number over the track is the same one the slider is standing at
// rather than a second copy of it
const ControlledPreview = () => {
    const [value, setValue] = React.useState(40);

    return (
        <Stack gap="condensed" className={classes.preview}>
            <div className={classes.row}>
                <label htmlFor="controlled-volume" className={classes.label}>
                    Volume
                </label>
                <Text size="small" className={classes.muted}>
                    {value}%
                </Text>
            </div>
            <SliderComponent
                id="controlled-volume"
                value={value}
                onChange={setValue}
                aria-valuetext={`${value} per cent`}
                block
            />
        </Stack>
    );
};

const controlledSetup = `const [value, setValue] = React.useState(40);`;

const controlledCode = `<Stack gap="condensed">
    <div className="flex items-center justify-between">
        <label htmlFor="controlled-volume">Volume</label>
        <Text size="small">{value}%</Text>
    </div>
    <Slider
        id="controlled-volume"
        value={value}
        onChange={setValue}
        aria-valuetext={\`\${value} per cent\`}
        block
    />
</Stack>`;

// A range whose numbers stand for something else, where the figure a screen reader would otherwise
// read out says nothing at all
const ValueTextPreview = () => {
    const speeds = ["Slowest", "Slow", "Normal", "Fast", "Fastest"];
    const [value, setValue] = React.useState(2);

    return (
        <Stack gap="condensed" className={classes.preview}>
            <div className={classes.row}>
                <label htmlFor="speed" className={classes.label}>
                    Playback speed
                </label>
                <Text size="small" className={classes.muted}>
                    {speeds[value]}
                </Text>
            </div>
            <SliderComponent
                id="speed"
                min={0}
                max={speeds.length - 1}
                value={value}
                onChange={setValue}
                aria-valuetext={speeds[value]}
                block
            />
        </Stack>
    );
};

const valueTextSetup = `const speeds = ["Slowest", "Slow", "Normal", "Fast", "Fastest"];

const [value, setValue] = React.useState(2);`;

const valueTextCode = `<Stack gap="condensed">
    <div className="flex items-center justify-between">
        <label htmlFor="speed">Playback speed</label>
        <Text size="small">{speeds[value]}</Text>
    </div>
    <Slider
        id="speed"
        min={0}
        max={speeds.length - 1}
        value={value}
        onChange={setValue}
        aria-valuetext={speeds[value]}
        block
    />
</Stack>`;

// The slider as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then how it is drawn, then what range it runs over, then one that cannot be moved,
// and last who holds the value and what the value stands for
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A number picked out of a range by sliding along it. Nothing is said about the range, so it runs from nought to a hundred a step at a time, and nothing is handed the value to hold, so the slider keeps its own. Underneath it is the browser's own range input: the pointing, the dragging and the arrow keys are the browser's, and everything the library adds is how the thing is drawn.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "How thick the control stands, which settles the height of the track and the size of the thumb together. The three are read one above the other, since what is being compared is the weight of one against the next rather than any one of them on its own.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Filling the width",
        description:
            "A slider left to the width the browser gives it, and one filling whatever it stands in. A slider is nearly always one row of a field, so filling is what most of them want — the one that keeps its own width is for a control set among other things on a line.",
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Standing up",
        description:
            "A slider on its end, which is filled from the bottom the way a fader is rather than from the top the way a page is read. It is given a starting height, since nothing else would give it one, and a screen reader is told which way it runs. Several of them side by side is what this is for; one on its own is nearly always better lying down.",
        preview: verticalPreview,
        code: verticalCode,
    },
    {
        name: "Filling the height",
        description:
            "Filling means the height once the slider is on its end rather than the width, so a fader told to fill takes whatever it is put in. The two here are given the same room and only one of them takes it.",
        preview: verticalBlockPreview,
        code: verticalBlockCode,
    },
    {
        name: "Over a range of its own",
        description:
            "The lowest and the highest the slider goes. How far along the track the thumb stands is worked out from the range rather than from the number, so a slider running from sixteen to thirty is half filled at twenty-three and not at fifty.",
        preview: rangePreview,
        code: rangeCode,
    },
    {
        name: "Moving in steps",
        description:
            "How far the slider moves at a time, for a value that only means anything at certain points along the range. A rating out of five is five places rather than a hundred, and the arrow keys move between them a place at a time.",
        preview: stepPreview,
        code: stepCode,
    },
    {
        name: "Disabled",
        description:
            "A slider that cannot be moved. It is faded rather than drained of its colour: where it stands is the whole of what a slider says, and a track redrawn in grey would leave a reader working that out from the shape of the thumb alone.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "The value the caller holds",
        description:
            "The value held by whoever is drawing the slider rather than by the slider, which is what showing the reading beside it wants: the number over the track is the one the slider is standing at rather than a second copy of it. The slider hands the new value over first and the event after it, since the value is what a caller is nearly always after.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Saying what the value stands for",
        description:
            "A range whose numbers stand for something else — speeds, sizes, a scale of words — where the figure a screen reader would otherwise read out says nothing at all. What is written for the eye and what is said to a screen reader are the same thing in two forms rather than two different readings.",
        setup: valueTextSetup,
        preview: <ValueTextPreview />,
        code: valueTextCode,
    },
];

// How thick the control stands
const size = '"small" | "medium" | "large"';

// Which way the slider runs
const orientation = '"horizontal" | "vertical"';

// Every prop the slider takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// The range comes first, since it is what the slider is picking out of, then who holds the value,
// then how it is drawn, and last what a screen reader is told
const groups: ComponentPropGroup[] = [
    {
        name: "Slider",
        props: [
            {
                name: "min",
                type: "number",
                default: "0",
                description:
                    "The lowest the slider goes. It is also where a slider starts out that was given no value of its own to start at",
            },
            {
                name: "max",
                type: "number",
                default: "100",
                description: "The highest the slider goes",
            },
            {
                name: "step",
                type: "number",
                default: "1",
                description:
                    "How far the slider moves at a time, for a value that only means anything at certain points along the range. It is what the arrow keys move by as well as what a drag settles on",
            },
            {
                name: "value",
                type: "number",
                description:
                    "Where the slider stands, where the caller keeps hold of the value. Handing this over is what makes the slider the caller's to move; leaving it out leaves it to move itself",
            },
            {
                name: "defaultValue",
                type: "number",
                description:
                    "Where the slider starts out, where it keeps hold of the value itself. Left out, it starts at the bottom of the range",
            },
            {
                name: "onChange",
                type: "(value: number, event: React.ChangeEvent<HTMLInputElement>) => void",
                description:
                    "Called with the value the slider has moved to, and with the event that moved it. The value comes first, since it is what a caller is nearly always after, and the event is there for the times the rest of it is wanted",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How thick the control stands, which settles the height of the track and the size of the thumb together, whichever way the slider runs",
            },
            {
                name: "orientation",
                type: orientation,
                default: '"horizontal"',
                description:
                    "Which way the slider runs. One standing up is filled from the bottom the way a fader is rather than from the top the way a page is read, is given a starting height since nothing else would give it one, and says which way it runs to a screen reader",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever the slider stands in, or the height of it where the slider runs vertically, rather than keeping the width the browser gives it",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the slider being moved. It is faded rather than drained of its colour, so where it stands can still be read off it",
            },
            {
                name: "aria-valuetext",
                type: "string",
                description:
                    "What the value stands for in words, for a range whose numbers say nothing on their own — speeds, sizes, a scale of words. Left out, a screen reader reads the number itself, which is right wherever the number is the reading",
            },
            {
                name: "className",
                type: "string",
                description: "Class name for custom styling",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the slider is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Slider = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Slider
            </Heading>
            <Text as="p" size="large">
                A number picked out of a range by sliding along it: a volume, a temperature, how far
                through something to start. It is the browser's own range input underneath, so the
                pointing, the dragging and the arrow keys are the browser's and everything the
                library adds is how the thing is drawn — which is what keeps it working the way
                every other slider a reader has met does.
            </Text>
            <Text as="p" size="large">
                The track is filled behind the thumb as one gradient rather than by a second element
                laid over it, so there is nothing to keep in step with where the slider stands. It
                runs from nought to a hundred a step at a time unless it is told otherwise, and it
                needs a name: a slider is not labelled by anything it draws, so either a field
                around it or a name on it has to say what the number is of.
            </Text>
        </Stack>
        <ComponentExamples component="Slider" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Slider;
