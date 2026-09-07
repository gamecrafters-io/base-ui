import * as React from "react";
import {
    Button,
    Heading,
    ProgressCircle as ProgressCircleComponent,
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
    // The thickness of the line comes through a custom property, so a ring can be thinned without
    // having to unpick the class it came with
    thinRing: "[--progress-circle-stroke-width:2]",
    muted: "text-[var(--foreground-color-muted)]",
};

// Every colour an arc can be painted, in the order they are drawn. They are counted off a list
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

// The three the ring is drawn at, read together so the line can be seen keeping its proportions as
// the circle grows
const sizes = ["small", "medium", "large"] as const;

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

const sizesSetup = `const sizes = ["small", "medium", "large"];`;

// The plainest ring there is: how far along the work has got, and what the work is. Nothing is said
// about the colour, so it is drawn in the one that means the work is going well, and nothing is
// said about the size, so the middle of the three is drawn.
//
// The page and the component it is about are both called ProgressCircle, so the component is
// brought in under a name saying which of the two it is. The listing beneath says ProgressCircle,
// as an application importing it would
const defaultPreview = <ProgressCircleComponent progress={66} aria-label="Upload test.png" />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ProgressCircle progress={66} aria-label="Upload test.png" />`;

// A ring that is actually going somewhere, which is the whole of what sets it apart from a meter.
// It starts as the page draws it and runs the whole way round, turning over to the colour that
// means finished once there is no work left in it.
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
        <Stack gap="normal" align="start">
            <ProgressCircleComponent
                progress={progress}
                size="large"
                variant={done ? "done" : "success"}
                aria-label="Upload test.png"
            >
                {progress}%
            </ProgressCircleComponent>
            <Stack direction="horizontal" gap="condensed" align="center">
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

<Stack gap="normal" align="start">
    <ProgressCircle
        progress={progress}
        size="large"
        variant={done ? "done" : "success"}
        aria-label="Upload test.png"
    >
        {progress}%
    </ProgressCircle>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Text size="small">{done ? "Uploaded" : "Uploading test.png"}</Text>
        <Button size="small" onClick={() => setProgress(0)}>
            Start again
        </Button>
    </Stack>
</Stack>`;

// The three diameters the ring is drawn at. The line is drawn in the SVG's own units and scaled
// with the box, so it keeps its proportions rather than thinning as the circle grows
const sizesPreview = (
    <Stack direction="horizontal" gap="normal" align="center">
        {sizes.map((size) => (
            <ProgressCircleComponent key={size} progress={66} size={size} aria-label={size} />
        ))}
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="normal" align="center">
    {sizes.map((size) => (
        <ProgressCircle key={size} progress={66} size={size} aria-label={size} />
    ))}
</Stack>`;

// What the filled part of the ring is painted. The eight are drawn together rather than one to an
// example, since a colour is read against the others rather than on its own, and each is named by
// the value that drew it
const variantsPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        {variants.map((variant) => (
            <Stack key={variant} gap="condensed" align="center">
                <ProgressCircleComponent progress={62} variant={variant} aria-label={variant} />
                <Text size="small" className={classes.muted}>
                    {variant}
                </Text>
            </Stack>
        ))}
    </Stack>
);

const variantsCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    {variants.map((variant) => (
        <Stack key={variant} gap="condensed" align="center">
            <ProgressCircle progress={62} variant={variant} aria-label={variant} />
            <Text size="small">{variant}</Text>
        </Stack>
    ))}
</Stack>`;

// Words laid in the middle of the ring, which is where a percentage is usually read. There is only
// room for them on the larger of the three, so the smaller ones are read as the ring alone
const labelPreview = (
    <ProgressCircleComponent progress={66} size="large" aria-label="Upload test.png">
        66%
    </ProgressCircleComponent>
);

const labelCode = `<ProgressCircle progress={66} size="large" aria-label="Upload test.png">
    66%
</ProgressCircle>`;

// A thinner line, for a reading that stands beside other content rather than carrying a panel of
// its own. The thickness is a custom property, so it is set on the ring the way a class is
const thinnerPreview = (
    <ProgressCircleComponent
        progress={66}
        size="large"
        className={classes.thinRing}
        aria-label="Upload test.png"
    >
        66%
    </ProgressCircleComponent>
);

const thinnerCode = `<ProgressCircle
    progress={66}
    size="large"
    className="[--progress-circle-stroke-width:2]"
    aria-label="Upload test.png"
>
    66%
</ProgressCircle>`;

// The ring as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then one actually going somewhere, then how it is drawn, then what is read in the middle
// of it, and last the one thing about the ring itself that is left to the stylesheet
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "How far along the work has got, as a share of a hundred, drawn as a ring rather than as a line. Nothing is said about the colour, so it is drawn in the one that means the work is going well; nothing is said about the size, so the middle of the three is drawn. The ring carries the figure on itself for a screen reader, so what is heard is the progress rather than whatever copy happens to stand beside it — which is why it has to be named.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Getting there",
        description:
            "A ring that is actually going somewhere, which is the whole of what sets it apart from a meter: it is expected to come the whole way round, and arriving is the news. The colour turns over to the one that means finished, so the ring says it has arrived to a reader who is watching and to one who has come back to it. A progress past either end of the track is brought back to the end it ran past, since a ring has no end to overrun the way a line does.",
        preview: <AdvancingPreview />,
        code: advancingCode,
    },
    {
        name: "Sizes",
        description:
            "The three diameters the ring is drawn at. The line is drawn in the SVG's own units and scaled with the box, so it keeps its proportions rather than thinning as the circle grows. Only the circle changes; how far round the arc has come is the same in all three.",
        setup: sizesSetup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Variants",
        description:
            "What the filled part of the ring is painted, rather than the colour it happens to come out, so the scheme underneath can be changed without every name going stale. The track behind it is left as it was, since what it stands for — the whole of the work — does not change with how much of it is done.",
        setup: variantsSetup,
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "A figure in the middle",
        description:
            "Words laid in the middle of the ring, which is where a percentage is usually read, and where a circle asks for no more room to hold one. A progressbar keeps its contents from a screen reader, so what is written there is for the eye and aria-valuenow is what is announced — the two are the same figure said twice rather than two figures. There is only room for words on the larger of the three sizes.",
        preview: labelPreview,
        code: labelCode,
    },
    {
        name: "A thinner ring",
        description:
            "How thick the line is drawn, which is the one thing about the ring itself that is left to the stylesheet: it comes through a custom property, so a ring can be thinned where it stands beside other content rather than carrying a panel of its own, without anything having to be unpicked to do it.",
        preview: thinnerPreview,
        code: thinnerCode,
    },
];

// How wide the ring is drawn. The values stand as themselves rather than as the name they are
// collected under, since one of them is what a caller actually hands over
const size = '"small" | "medium" | "large"';

// What the filled part of the ring is painted
const variant =
    '"accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success"';

// What the ring takes to be styled from outside
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them. The ring is drawn as a span rather than a box, so that a reading can be set
// in a line of words without the line being broken around it
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the ring takes. How far round it has come first, since it is the whole of what a
// progress circle is, then how it is drawn, then what is read in the middle of it, and last what it
// is called
const groups: ComponentPropGroup[] = [
    {
        name: "ProgressCircle",
        props: [
            {
                name: "progress",
                type: "number",
                default: "0",
                description:
                    "How far along the work has got, as a share of a hundred. It is handed to the stylesheet as the length of the arc rather than turned into one here, so how far round the ring runs is settled in the same place as the colour and the size. A progress past either end of the track is brought back to the end it ran past before either the arc or the value is taken from it",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How wide the ring is drawn. The line keeps its proportions as the circle grows, since it is drawn in the SVG's own units and scaled with the box. Words in the middle want the larger of the three, which is the only one with room to hold them",
            },
            {
                name: "variant",
                type: variant,
                default: '"success"',
                description:
                    "What the filled part of the ring is painted, rather than the colour it happens to come out. The track behind it is left as it was, since what it stands for does not change with how much of the work is done",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Words laid in the middle of the ring, which is where a percentage is usually read. A progressbar keeps its contents from a screen reader, so what is written there is read by the eye alone and aria-valuenow is what is announced. A ring given nothing is drawn without a middle at all rather than with an empty one",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the work is called, which a ring has to be given: it carries the figure on itself for a screen reader, and a figure with nothing saying what it counts says nothing. Words in the middle do not stand in for it, since the ring keeps them from a screen reader",
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
                    "The figure in words, for progress that is better heard as something other than a percentage — a count of files, a time remaining",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the ring is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const ProgressCircle = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ProgressCircle
            </Heading>
            <Text as="p" size="large">
                The reading a progress bar gives, drawn as a ring: how far through a piece of work
                something has got, in the places a line has no room to run — the corner of a card, a
                cell in a table, the space an avatar would otherwise take. It is going somewhere, as
                a progress bar is, so coming the whole way round is the news rather than just
                another value. It carries its figure on itself for a screen reader, which is why one
                has to be named: a figure with nothing saying what it counts says nothing.
            </Text>
            <Text as="p" size="large" className={classes.muted}>
                Words can be laid in the middle of the ring, which is where a percentage is usually
                read and where a circle asks for no more room to hold one. What is written there is
                read by the eye alone — a progressbar keeps its contents from a screen reader — so
                it is the figure aria-valuenow already announces said a second way rather than a
                second figure.
            </Text>
        </Stack>
        <ComponentExamples component="ProgressCircle" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ProgressCircle;
