import { Heading, Meter as MeterComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A meter fills the room it is given, and its name is set to one end of that room with its
    // reading at the other, so the examples are held to a column rather than run the width of the
    // card, where the two would be read as belonging to different things
    meter: "w-full max-w-[24rem]",
};

// Every colour a meter can be painted, in the order they are drawn. They are counted off a list
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

// Which colour a reading has earned by where it stands. A meter is usually wanted for exactly this:
// the reading itself is the news, and the colour is what says whether it is good news
const quotaVariant = (used: number) => {
    if (used >= 90) {
        return "danger";
    }

    if (used >= 75) {
        return "attention";
    }

    return "success";
};

// How much of a quota each of the three has run through. They are read together rather than one at
// a time, since what the example is about is the colour changing hands as the reading climbs
const quotas = [48, 82, 95];

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

const quotaSetup = `const quotaVariant = (used: number) => {
    if (used >= 90) {
        return "danger";
    }

    if (used >= 75) {
        return "attention";
    }

    return "success";
};

const quotas = [48, 82, 95];`;

// The plainest meter there is: a reading, the name of what it measures, and the reading written out
// beside it. Nothing is said about the ends it is measured between, so it is read as a share of a
// hundred, and nothing is said about the groove, so one is drawn.
//
// The column it stands in is the page's own furniture, as the card around it is, so the listing
// beneath is of the meter alone.
//
// The page and the component it is about are both called Meter, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Meter, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.meter}>
        <MeterComponent value={72}>
            <MeterComponent.Label>Storage used</MeterComponent.Label>
            <MeterComponent.Value />
        </MeterComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Meter value={72}>
    <Meter.Label>Storage used</Meter.Label>
    <Meter.Value />
</Meter>`;

// Ends of its own, where the reading is a figure rather than a share of a hundred. What is written
// beside the name still says how far along it stands, since 340 says nothing until it is known what
// it was measured against
const rangePreview = (
    <Stack className={classes.meter}>
        <MeterComponent value={340} min={0} max={512}>
            <MeterComponent.Label>Memory in use</MeterComponent.Label>
            <MeterComponent.Value />
        </MeterComponent>
    </Stack>
);

const rangeCode = `<Meter value={340} min={0} max={512}>
    <Meter.Label>Memory in use</Meter.Label>
    <Meter.Value />
</Meter>`;

// The shape the reading is written in, named by the caller: a unit, a currency, however many
// places. Whatever is named, it is written under the conventions the runtime is set to, which are
// the reader's own
const formattedPreview = (
    <Stack gap="normal" className={classes.meter}>
        <MeterComponent value={340} min={0} max={512} format={{ style: "unit", unit: "gigabyte" }}>
            <MeterComponent.Label>Memory in use</MeterComponent.Label>
            <MeterComponent.Value />
        </MeterComponent>
        <MeterComponent
            value={1284}
            min={0}
            max={2000}
            variant="accent"
            format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
        >
            <MeterComponent.Label>Spent this month</MeterComponent.Label>
            <MeterComponent.Value />
        </MeterComponent>
    </Stack>
);

// The column is part of what is being shown wherever an example holds more than one meter, since
// what is read is the run of them one under another. The width is written out as the classes it
// stands for rather than as the name the page holds it under, since what is copied out of here has
// only itself to reach for
const formattedCode = `<Stack gap="normal" className="w-full max-w-[24rem]">
    <Meter value={340} min={0} max={512} format={{ style: "unit", unit: "gigabyte" }}>
        <Meter.Label>Memory in use</Meter.Label>
        <Meter.Value />
    </Meter>
    <Meter
        value={1284}
        min={0}
        max={2000}
        variant="accent"
        format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
    >
        <Meter.Label>Spent this month</Meter.Label>
        <Meter.Value />
    </Meter>
</Stack>`;

// The reading written by the caller rather than for them, for where what the eye should read is not
// what any shape would give it. What is handed over is the reading in words and the number it was
// written from, so either can be used
const customValuePreview = (
    <Stack className={classes.meter}>
        <MeterComponent value={340} min={0} max={512}>
            <MeterComponent.Label>Memory in use</MeterComponent.Label>
            <MeterComponent.Value>{({ value }) => `${value} of 512 MB`}</MeterComponent.Value>
        </MeterComponent>
    </Stack>
);

const customValueCode = `<Meter value={340} min={0} max={512}>
    <Meter.Label>Memory in use</Meter.Label>
    <Meter.Value>{({ value }) => \`\${value} of 512 MB\`}</Meter.Value>
</Meter>`;

// The three heights a meter is drawn at, which are the three a progress bar is drawn at, so the two
// read as the same weight of thing where they stand on a page together
const sizesPreview = (
    <Stack gap="normal" className={classes.meter}>
        <MeterComponent value={72} size="small">
            <MeterComponent.Label>Small</MeterComponent.Label>
            <MeterComponent.Value />
        </MeterComponent>
        <MeterComponent value={72}>
            <MeterComponent.Label>Medium</MeterComponent.Label>
            <MeterComponent.Value />
        </MeterComponent>
        <MeterComponent value={72} size="large">
            <MeterComponent.Label>Large</MeterComponent.Label>
            <MeterComponent.Value />
        </MeterComponent>
    </Stack>
);

const sizesCode = `<Stack gap="normal" className="w-full max-w-[24rem]">
    <Meter value={72} size="small">
        <Meter.Label>Small</Meter.Label>
        <Meter.Value />
    </Meter>
    <Meter value={72}>
        <Meter.Label>Medium</Meter.Label>
        <Meter.Value />
    </Meter>
    <Meter value={72} size="large">
        <Meter.Label>Large</Meter.Label>
        <Meter.Value />
    </Meter>
</Stack>`;

// What the filled part of the groove is painted. The eight are drawn together rather than one to an
// example, since a colour is read against the others rather than on its own, and each is named by
// the value that drew it
const variantsPreview = (
    <Stack gap="condensed" className={classes.meter}>
        {variants.map((variant) => (
            <MeterComponent key={variant} value={62} variant={variant}>
                <MeterComponent.Label>{variant}</MeterComponent.Label>
                <MeterComponent.Value />
            </MeterComponent>
        ))}
    </Stack>
);

const variantsCode = `<Stack gap="condensed" className="w-full max-w-[24rem]">
    {variants.map((variant) => (
        <Meter key={variant} value={62} variant={variant}>
            <Meter.Label>{variant}</Meter.Label>
            <Meter.Value />
        </Meter>
    ))}
</Stack>`;

// The colour worked out from the reading rather than named, which is what a meter is usually wanted
// for: the reading itself is the news, and the colour is what says whether it is good news
const quotaPreview = (
    <Stack gap="normal" className={classes.meter}>
        {quotas.map((used) => (
            <MeterComponent key={used} value={used} variant={quotaVariant(used)}>
                <MeterComponent.Label>Storage used</MeterComponent.Label>
                <MeterComponent.Value />
            </MeterComponent>
        ))}
    </Stack>
);

const quotaCode = `<Stack gap="normal" className="w-full max-w-[24rem]">
    {quotas.map((used) => (
        <Meter key={used} value={used} variant={quotaVariant(used)}>
            <Meter.Label>Storage used</Meter.Label>
            <Meter.Value />
        </Meter>
    ))}
</Stack>`;

// The groove on its own, for a reading that whatever stands around it already says enough about. It
// is named outright instead, since a meter with nothing naming it is a bar with a number on it and
// nothing to say what the number counts
const barePreview = (
    <Stack className={classes.meter}>
        <MeterComponent value={72} aria-label="Storage used" />
    </Stack>
);

const bareCode = `<Meter value={72} aria-label="Storage used" />`;

// The groove laid out by the caller rather than drawn for them, which is what putting anything
// after it takes. Whatever the meter was handed that is none of its own parts is kept, in the order
// it was written, and stands under the groove
const partsPreview = (
    <Stack className={classes.meter}>
        <MeterComponent value={72}>
            <MeterComponent.Label>Storage used</MeterComponent.Label>
            <MeterComponent.Value />
            <MeterComponent.Track>
                <MeterComponent.Indicator />
            </MeterComponent.Track>
            <Text size="small">36 GB of 50 GB</Text>
        </MeterComponent>
    </Stack>
);

const partsCode = `<Meter value={72}>
    <Meter.Label>Storage used</Meter.Label>
    <Meter.Value />
    <Meter.Track>
        <Meter.Indicator />
    </Meter.Track>
    <Text size="small">36 GB of 50 GB</Text>
</Meter>`;

// The meter as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what it is measured between and what the reading is written as, then how it is drawn,
// and last what is done where the parts are laid out by hand
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A reading, the name of what it measures, and the reading written out beside it. Nothing is said about the ends it is measured between, so it is read as a share of a hundred; nothing is said about the groove, so one is drawn. The name is set at the start of the line and the reading at the end, which is where a reader looks for each of them.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Measured between ends of its own",
        description:
            "A meter is a reading within a range that is already known, so both ends of that range are the caller's to name. What is written beside the name still says how far along the reading stands rather than the reading itself, since 340 says nothing until it is known what it was measured against. A reading past either end is brought back to the end it ran past.",
        preview: rangePreview,
        code: rangeCode,
    },
    {
        name: "Written as a figure",
        description:
            "The shape the reading is written in, named by the caller: a unit, a currency, however many places. Whatever is named, it is written under the conventions the runtime is set to, which are the reader's own rather than the page's. What a screen reader is told changes with it, since the two are written from the same shape.",
        preview: formattedPreview,
        code: formattedCode,
    },
    {
        name: "Written the caller's own way",
        description:
            "For where what the eye should read is not what any shape would give it. What is handed over is the reading in words and the number it was written from, so either can be used, or neither. Only what is written changes — the meter carries its own reading for a screen reader either way, so the two never fall out of step by accident.",
        preview: customValuePreview,
        code: customValueCode,
    },
    {
        name: "Sizes",
        description:
            "The three heights the groove is drawn at, which are the three a progress bar is drawn at, so the two read as the same weight of thing where they stand on a page together. Only the groove changes; the name and the reading are set at the same size throughout.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Variants",
        description:
            "What the filled part of the groove is painted, rather than the colour it happens to come out, so the scheme underneath can be changed without every name going stale. The groove itself is left as it was, since what it stands for — the whole distance between the two ends — does not change with the reading.",
        setup: variantsSetup,
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Coloured by where it stands",
        description:
            "Which is what a meter is usually wanted for: the reading itself is the news, and the colour is what says whether it is good news. The colour is worked out from the reading rather than named, so a quota that climbs past a threshold changes hands on its own.",
        setup: quotaSetup,
        preview: quotaPreview,
        code: quotaCode,
    },
    {
        name: "The groove on its own",
        description:
            "For a reading that whatever stands around it already says enough about — a figure on a card, a heading over a run of them. It is named outright instead, since a meter with nothing naming it is a bar with a number on it and nothing to say what the number counts.",
        preview: barePreview,
        code: bareCode,
    },
    {
        name: "Built from its parts",
        description:
            "The groove laid out by the caller rather than drawn for them, which is what putting anything after it takes. Whatever the meter was handed that is none of its own parts is kept, in the order it was written, and stands under the groove.",
        preview: partsPreview,
        code: partsCode,
    },
];

// How tall the groove is drawn. The values stand as themselves rather than as the name they are
// collected under, since one of them is what a caller actually hands over
const size = '"small" | "medium" | "large"';

// What the filled part of the groove is painted
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
// library adds to them. The parts are drawn as spans rather than boxes, being pieces of a line
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the meter and its parts take, under the one that takes it. The reading comes first,
// since it is the whole of what a meter is, then the ends it is measured between and the shape it
// is written in, then how it is drawn and what it is called
const groups: ComponentPropGroup[] = [
    {
        name: "Meter",
        props: [
            {
                name: "value",
                type: "number",
                required: true,
                description:
                    "Where the reading stands. One past either end of the range is brought back to the end it ran past, and one that is no number at all is read as standing at the start rather than nowhere. It is handed to the stylesheet as a share of the distance between the ends, so how far the indicator runs is settled in the same place as the colour and the height",
            },
            {
                name: "min",
                type: "number",
                default: "0",
                description: "The end the range is measured from",
            },
            {
                name: "max",
                type: "number",
                default: "100",
                description:
                    "The end it is measured to. Ends that are the same leave no distance to stand in, so the reading is read as standing at the start of it",
            },
            {
                name: "format",
                type: "Intl.NumberFormatOptions",
                description:
                    "The shape the reading is written in: a currency, a unit, however many places. Left out, the reading is written as how far along it stands, since a bare number says nothing without the ends it was measured between. Either way it is written under the conventions the runtime is set to, which are the reader's own",
            },
            {
                name: "getAriaValueText",
                type: "(formattedValue: string, value: number) => string",
                description:
                    "What a screen reader is told the reading is, where the written one does not say it well enough on its own. It changes only what is heard; what the eye reads is left as it was",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the groove is drawn. The three are the same three a progress bar is drawn at, so the two read as the same weight of thing where they stand on a page together",
            },
            {
                name: "variant",
                type: variant,
                default: '"success"',
                description:
                    "What the filled part of the groove is painted, rather than the colour it happens to come out. The groove itself is left as it was, since what it stands for does not change with the reading",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The parts the meter is built from. The name and the reading are lifted into a line of their own, the groove is drawn where none was given, and whatever else was handed over is kept in the order it was written and stands under the groove",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the meter is called, for one carrying no line to be named after. Given this, the meter takes no name from the line inside it",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The element that names the meter, for one standing beside a figure that already says what it measures. Left out, the meter is named after its own Label where it carries one, and is named by nothing where it does not",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description: "The element or component this is drawn as, in place of its default",
            },
        ],
    },
    {
        name: "Meter.Label",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Names what is being measured, in the words a reader would use for it. It is the one part of the line with no length of its own, so it is what gives when the meter runs out of room, and it takes the name the meter is already pointing at unless it is given an id of its own",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Meter.Value",
        props: [
            {
                name: "children",
                type: "React.ReactNode | ((props: MeterValueRenderProps) => React.ReactNode)",
                description:
                    "The reading in words. Left out, it is written from the shape the meter was given; given a function, it is handed the reading in words and the number it was written from and the caller writes it themselves. Either way it is kept out of a screen reader's way, since the meter already carries its reading on itself",
            },
            styling,
        ],
    },
    {
        name: "Meter.Track",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The groove the reading is drawn in, which stands for the whole distance between the two ends and is drawn at its full length whatever the reading is. A meter given none is drawn one holding an indicator, so this is only worth writing out to put something after it",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Meter.Indicator",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "How much of the groove the reading fills. How far it runs is taken from the share the meter handed the stylesheet rather than measured out here, so one standing outside a meter is drawn empty rather than full",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the meter is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Meter = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Meter
            </Heading>
            <Text as="p" size="large">
                A reading within a range that is already known: how much of the disk is taken, how
                loud the room is, how far through its quota an account has run. It is not a progress
                bar, which says how far through a piece of work something has got and is expected to
                reach the end of it. A meter is not going anywhere: it stands where it stands, and
                either end of it is as ordinary a place to be as the middle. It reads as a meter
                rather than as a progress bar, and carries its reading on itself, so what a screen
                reader is told is never the copy the eye happens to be shown. A meter given no
                groove of its own is drawn one, since a reading with nothing to read it against is
                only a number.
            </Text>
        </Stack>
        <ComponentExamples component="Meter" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Meter;
