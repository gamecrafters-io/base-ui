import * as React from "react";
import {
    Button,
    Heading,
    ProgressBar as ProgressBarComponent,
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
    // A progress bar fills the room it is given, so the examples are held to a column rather than
    // run the width of the card, where a bar drawn several times wider than it is tall reads as a
    // rule across the page rather than as something filling up
    track: "w-full max-w-[24rem]",
    // A bar set in a line of words is only as wide as it was told to be, since there is nothing
    // for it to fill: the line it stands in is as long as the words are
    inlineTrack: "w-[6.25rem]",
    muted: "text-[var(--foreground-color-muted)]",
};

// Every colour a bar can be painted, in the order they are drawn. They are counted off a list
// rather than written out one by one, since what the example is about is the run of them read
// against one another
const variants = [
    "success",
    "accent",
    "attention",
    "severe",
    "danger",
    "done",
    "sponsors",
    "neutral",
] as const;

// What is taking up the disk, and how much of it each is taking. They are read together rather
// than one at a time, since what the example is about is the one track shared out between them
const usage = [
    { name: "Photos", progress: 33, variant: "accent" },
    { name: "Applications", progress: 23, variant: "danger" },
    { name: "Music", progress: 14, variant: "severe" },
] as const;

// What the examples that read off a list have to have in hand before they can be drawn. Each is
// written once and reached for by the example that needs it
const variantsSetup = `const variants = [
    "success",
    "accent",
    "attention",
    "severe",
    "danger",
    "done",
    "sponsors",
    "neutral",
];`;

const usageSetup = `const usage = [
    { name: "Photos", progress: 33, variant: "accent" },
    { name: "Applications", progress: 23, variant: "danger" },
    { name: "Music", progress: 14, variant: "severe" },
];`;

// The plainest bar there is: how far along the work has got, and what the work is. Nothing is said
// about the colour, so it is drawn in the one that means the work is going well, and nothing is
// said about the height, so the middle of the three is drawn.
//
// The column it stands in is the page's own furniture, as the card around it is, so the listing
// beneath is of the bar alone.
//
// The page and the component it is about are both called ProgressBar, so the component is brought
// in under a name saying which of the two it is. The listing beneath says ProgressBar, as an
// application importing it would
const defaultPreview = (
    <Stack className={classes.track}>
        <ProgressBarComponent progress={66} aria-label="Upload test.png" />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ProgressBar progress={66} aria-label="Upload test.png" />`;

// A bar that is actually going somewhere, which is the whole of what sets it apart from a meter.
// It starts as the page draws it and runs to the end, shimmering while there is still work in it
// and turning over to the colour that means finished once there is not.
//
// The state is what makes this a component of its own rather than an element the page holds ready
const AdvancingPreview = () => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        if (progress >= 100) {
            return;
        }

        const id = window.setTimeout(
            () => setProgress((current) => Math.min(current + 8, 100)),
            260,
        );

        return () => window.clearTimeout(id);
    }, [progress]);

    const done = progress >= 100;

    return (
        <Stack gap="normal" className={classes.track}>
            <ProgressBarComponent
                progress={progress}
                variant={done ? "done" : "success"}
                animated={!done}
                aria-label="Upload test.png"
            />
            <Stack direction="horizontal" gap="condensed" align="center" justify="space-between">
                <Text size="small" className={classes.muted}>
                    {done ? "Uploaded" : "Uploading test.png"}
                </Text>
                <Button size="small" onClick={() => setProgress(0)}>
                    Start again
                </Button>
            </Stack>
        </Stack>
    );
};

const advancingCode = `const [progress, setProgress] = React.useState(0);

React.useEffect(() => {
    if (progress >= 100) {
        return;
    }

    const id = window.setTimeout(
        () => setProgress((current) => Math.min(current + 8, 100)),
        260,
    );

    return () => window.clearTimeout(id);
}, [progress]);

const done = progress >= 100;

<Stack gap="normal" className="w-full max-w-[24rem]">
    <ProgressBar
        progress={progress}
        variant={done ? "done" : "success"}
        animated={!done}
        aria-label="Upload test.png"
    />
    <Stack direction="horizontal" gap="condensed" align="center" justify="space-between">
        <Text size="small">{done ? "Uploaded" : "Uploading test.png"}</Text>
        <Button size="small" onClick={() => setProgress(0)}>
            Start again
        </Button>
    </Stack>
</Stack>`;

// The three heights a bar is drawn at, which are the three a meter is drawn at, so the two read as
// the same weight of thing where they stand on a page together
const sizesPreview = (
    <Stack gap="normal" className={classes.track}>
        <ProgressBarComponent progress={66} size="small" aria-label="Small" />
        <ProgressBarComponent progress={66} aria-label="Medium" />
        <ProgressBarComponent progress={66} size="large" aria-label="Large" />
    </Stack>
);

// The column is part of what is being shown wherever an example holds more than one bar, since what
// is read is the run of them one under another. The width is written out as the classes it stands
// for rather than as the name the page holds it under, since what is copied out of here has only
// itself to reach for
const sizesCode = `<Stack gap="normal" className="w-full max-w-[24rem]">
    <ProgressBar progress={66} size="small" aria-label="Small" />
    <ProgressBar progress={66} aria-label="Medium" />
    <ProgressBar progress={66} size="large" aria-label="Large" />
</Stack>`;

// What the filled part of the track is painted. The eight are drawn together rather than one to an
// example, since a colour is read against the others rather than on its own, and each is named by
// the value that drew it
const variantsPreview = (
    <Stack gap="normal" className={classes.track}>
        {variants.map((variant) => (
            <Stack key={variant} gap="condensed">
                <Text size="small" className={classes.muted}>
                    {variant}
                </Text>
                <ProgressBarComponent progress={62} variant={variant} aria-label={variant} />
            </Stack>
        ))}
    </Stack>
);

const variantsCode = `<Stack gap="normal" className="w-full max-w-[24rem]">
    {variants.map((variant) => (
        <Stack key={variant} gap="condensed">
            <Text size="small">{variant}</Text>
            <ProgressBar progress={62} variant={variant} aria-label={variant} />
        </Stack>
    ))}
</Stack>`;

// The one track shared out between several things rather than filled by one. Each segment is named
// and coloured in its own right, and they are laid out in the order they were written
const segmentsPreview = (
    <Stack className={classes.track}>
        <ProgressBarComponent>
            {usage.map(({ name, progress, variant }) => (
                <ProgressBarComponent.Item
                    key={name}
                    progress={progress}
                    variant={variant}
                    aria-label={name}
                />
            ))}
        </ProgressBarComponent>
    </Stack>
);

const segmentsCode = `<ProgressBar>
    {usage.map(({ name, progress, variant }) => (
        <ProgressBar.Item
            key={name}
            progress={progress}
            variant={variant}
            aria-label={name}
        />
    ))}
</ProgressBar>`;

// A sweep run across the filled part, for work that is under way rather than stopped part of the
// way along. It says nothing the number does not, so it is there to say that something is still
// happening rather than to say how much has happened
const animatedPreview = (
    <Stack className={classes.track}>
        <ProgressBarComponent animated progress={50} aria-label="Upload test.png" />
    </Stack>
);

const animatedCode = `<ProgressBar animated progress={50} aria-label="Upload test.png" />`;

// A bar set in a line of words rather than given a line of its own, for where how far along
// something has got is read as part of a sentence about it
const inlinePreview = (
    <Text as="p">
        Uploading test.png{" "}
        <ProgressBarComponent
            inline
            progress={66}
            className={classes.inlineTrack}
            aria-label="Upload test.png"
        />{" "}
        66%
    </Text>
);

const inlineCode = `<Text as="p">
    Uploading test.png{" "}
    <ProgressBar inline progress={66} className="w-[6.25rem]" aria-label="Upload test.png" />{" "}
    66%
</Text>`;

// The bar as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then one actually going somewhere, then how it is drawn, then the one track shared out
// between several things, and last the two ways a bar is set apart from the run of them
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "How far along the work has got, as a share of a hundred. Nothing is said about the colour, so it is drawn in the one that means the work is going well; nothing is said about the height, so the middle of the three is drawn. The bar carries the figure on itself for a screen reader, so what is heard is the progress rather than whatever copy happens to stand beside it — which is why it has to be named.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Getting there",
        description:
            "A bar that is actually going somewhere, which is the whole of what sets it apart from a meter: it is expected to reach the end, and reaching it is the news. The sweep says that something is still happening and is taken off once nothing is, and the colour turns over to the one that means finished — so the bar says it has arrived in two ways at once, for a reader who is watching and a reader who has come back to it.",
        preview: <AdvancingPreview />,
        code: advancingCode,
    },
    {
        name: "Sizes",
        description:
            "The three heights the track is drawn at, which are the three a meter is drawn at, so the two read as the same weight of thing where they stand on a page together. Only the track changes; how far along the bar has got is the same in all three.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Variants",
        description:
            "What the filled part of the track is painted, rather than the colour it happens to come out, so the scheme underneath can be changed without every name going stale. The track itself is left as it was, since what it stands for — the whole of the work — does not change with how much of it is done.",
        setup: variantsSetup,
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Several things sharing the one track",
        description:
            "Segments written out by hand rather than one filled for you, for a track that is shared out between several things instead of filled by one: what is taking up a disk, how a budget has been spent. Each is named and coloured in its own right and they are laid out in the order they were written, so what is left over at the end is whatever none of them claimed. A bar handed segments is not also given a progress of its own — passing both throws rather than quietly drawing one of them.",
        setup: usageSetup,
        preview: segmentsPreview,
        code: segmentsCode,
    },
    {
        name: "Under way",
        description:
            "A sweep run across the filled part, for work that is still moving rather than stopped part of the way along. It says nothing the figure does not, so it is there to say that something is still happening rather than to say how much has happened, and it is left off for a reader who has asked their system for less motion.",
        preview: animatedPreview,
        code: animatedCode,
    },
    {
        name: "Set in a line",
        description:
            "A bar laid out inline rather than given a line of its own, for where how far along something has got is read as part of a sentence about it. It is only as wide as it was told to be, since the line it stands in is as long as the words are and there is nothing for the bar to fill.",
        preview: inlinePreview,
        code: inlineCode,
    },
];

// How tall the track is drawn. The values stand as themselves rather than as the name they are
// collected under, since one of them is what a caller actually hands over
const size = '"small" | "medium" | "large"';

// What the filled part of the track is painted
const variant =
    '"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them. The track and its segments are drawn as spans rather than boxes, so that a
// bar can be set in a line of words without the line being broken around it
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the bar and its segments take, under the one that takes it. How far along it has got
// comes first, since it is the whole of what a progress bar is, then how it is drawn, then what is
// done where the segments are written out by hand, and last what it is called
const groups: ComponentPropGroup[] = [
    {
        name: "ProgressBar",
        props: [
            {
                name: "progress",
                type: "number",
                default: "0",
                description:
                    "How far along the work has got, as a share of a hundred. It is handed to the stylesheet as the width of the filled part, so how far the bar runs is settled in the same place as the colour and the height. A bar that is given segments of its own is not given this as well",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the track is drawn. The three are the same three a meter is drawn at, so the two read as the same weight of thing where they stand on a page together",
            },
            {
                name: "variant",
                type: variant,
                default: '"success"',
                description:
                    "What the filled part of the track is painted, rather than the colour it happens to come out. It is passed to the segment the bar draws for itself, so a bar given segments of its own leaves this to each of them",
            },
            {
                name: "inline",
                type: "boolean",
                default: "false",
                description:
                    "Lays the track out along a line of words rather than as a block of its own. It has nothing to fill either way, so one set in a line is given a width to be drawn at",
            },
            {
                name: "animated",
                type: "boolean",
                default: "false",
                description:
                    "Sweeps a shimmer across the filled part, for work that is still moving rather than stopped part of the way along. It is left off for a reader who has asked their system for less motion, and is passed to the segment the bar draws for itself",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The segments the track is shared out between, written out by hand in place of the one the bar would draw for itself. Passing these and a progress both throws rather than quietly drawing one of them, and a bar given segments passes none of its own naming down: each of them is named in its own right",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the work is called, which a bar filled by the library has to be given: it carries the figure on itself for a screen reader, and a figure with nothing saying what it counts says nothing. It is passed down to the segment the bar draws, and is not passed down where the segments were written out by hand",
            },
            {
                name: "aria-valuenow",
                type: "number",
                description:
                    "What a screen reader is told the figure is, where it is not the progress rounded off. Left out, it is worked out from the progress, so the two cannot fall out of step by accident",
            },
            {
                name: "aria-valuetext",
                type: "string",
                description:
                    "The figure in words, for progress that is better heard as something other than a percentage — a count of files, a time remaining. It is passed down to the segment the bar draws for itself",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "ProgressBar.Item",
        props: [
            {
                name: "progress",
                type: "number",
                default: "0",
                description:
                    "How much of the track this segment takes. It is a share of the whole track rather than of what is left, so the segments in a track add up to how much of it is filled, and one given nothing at all is drawn empty rather than full",
            },
            {
                name: "variant",
                type: variant,
                default: '"success"',
                description:
                    "What this segment is painted. Each is named in its own right, since a track shared out between several things is read by telling them apart",
            },
            {
                name: "animated",
                type: "boolean",
                default: "false",
                description:
                    "Sweeps a shimmer across this segment, for one of several whose work is still moving while the rest have stopped",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "What this segment is called. A segment carries its own figure, so one standing in a track beside others has to say what its share is of",
            },
            {
                name: "aria-valuenow",
                type: "number",
                description:
                    "What a screen reader is told this segment's figure is, where it is not the progress rounded off",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the bar is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const ProgressBar = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ProgressBar
            </Heading>
            <Text as="p" size="large">
                How far through a piece of work something has got: a file uploading, a job running,
                a form being filled in a step at a time. It is not a meter, which is a reading
                within a range that is already known and is not going anywhere. A progress bar is
                going somewhere — it is expected to reach the end, and reaching it is the news — so
                the end of it is a place worth arriving at rather than just another value. It
                carries its figure on itself for a screen reader, which is why a bar the library
                fills has to be named: a figure with nothing saying what it counts says nothing.
            </Text>
            <Text as="p" size="large" className={classes.muted}>
                A track can also be shared out between several things rather than filled by one, by
                writing the segments out rather than handing over a single progress. That is the
                same component put to a second use: what is taking up a disk, how a budget has been
                spent. Each segment is named and coloured in its own right, and what is left over at
                the end is whatever none of them claimed.
            </Text>
        </Stack>
        <ComponentExamples component="ProgressBar" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ProgressBar;
