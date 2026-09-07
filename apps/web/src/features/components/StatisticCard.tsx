import { MoneyRegular, PeopleRegular, WarningRegular } from "@gamecrafters/base-ui-icons";
import {
    Heading,
    StatisticCard as StatisticCardComponent,
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
    // A card fills whatever it was put in, and the mark is held to the far end of it, so the page
    // gives the card a width to fill rather than running the words and the mark to either edge of
    // the card they are shown in
    preview: "w-full max-w-[20rem]",
    // A run of cards standing one above the other, where what is being read is the one card
    // against the next
    stack: "w-full max-w-[20rem] flex flex-col gap-[var(--base-size-8)]",
    // A set of headline figures shown side by side, which is what a set of them wants rather than
    // a chart with one bar to each
    row: "grid grid-cols-3 gap-[var(--base-size-16)]",
};

// The plainest card there is: what is being measured, what it now stands at, how far it has moved
// and over what. The parts are written out rather than handed over as props, so a card carrying
// less than this is the same card with a part left out.
//
// The width it is held to is the page's own, as the card around it is, so the listing beneath is of
// the card alone: standing in an application it fills whatever it was put in.
//
// The page and the component it is about are both called StatisticCard, so the component is brought
// in under a name saying which of the two it is. The listing beneath says StatisticCard, as an
// application importing it would
const defaultPreview = (
    <Stack className={classes.preview}>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Sessions</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>12.9K</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="increase">8.2%</StatisticCardComponent.Trend>
            <StatisticCardComponent.Description>
                vs the four weeks before
            </StatisticCardComponent.Description>
        </StatisticCardComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<StatisticCard>
    <StatisticCard.Label>Sessions</StatisticCard.Label>
    <StatisticCard.Value>12.9K</StatisticCard.Value>
    <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
    <StatisticCard.Description>vs the four weeks before</StatisticCard.Description>
</StatisticCard>`;

// The figure on its own, where there is nothing yet to compare it with. The line the figure and the
// move share is left out rather than left empty, so the card comes down to what it is holding
const withoutTrendPreview = (
    <Stack className={classes.preview}>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Repositories</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>128</StatisticCardComponent.Value>
            <StatisticCardComponent.Description>
                Counted this morning
            </StatisticCardComponent.Description>
        </StatisticCardComponent>
    </Stack>
);

const withoutTrendCode = `<StatisticCard>
    <StatisticCard.Label>Repositories</StatisticCard.Label>
    <StatisticCard.Value>128</StatisticCard.Value>
    <StatisticCard.Description>Counted this morning</StatisticCard.Description>
</StatisticCard>`;

// Which way the figure has moved, drawn with an arrow as well as a colour. The three are drawn
// together rather than one to an example, since what an arrow says is read against the others
const directionsPreview = (
    <Stack className={classes.stack}>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Sessions</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>12.9K</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="increase">8.2%</StatisticCardComponent.Trend>
        </StatisticCardComponent>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Signups</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>482</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="decrease">3.1%</StatisticCardComponent.Trend>
        </StatisticCardComponent>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Open issues</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>76</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="neutral">0%</StatisticCardComponent.Trend>
        </StatisticCardComponent>
    </Stack>
);

// The stack holding the three apart is part of what is being shown rather than the page's own
// furniture, since what the example is about is the one card read against the next. It is written
// out as the classes it stands for rather than as the name the page holds it under, since what is
// copied out of here has only itself to reach for
const directionsCode = `<Stack className="flex flex-col gap-[var(--base-size-8)]">
    <StatisticCard>
        <StatisticCard.Label>Sessions</StatisticCard.Label>
        <StatisticCard.Value>12.9K</StatisticCard.Value>
        <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
    </StatisticCard>
    <StatisticCard>
        <StatisticCard.Label>Signups</StatisticCard.Label>
        <StatisticCard.Value>482</StatisticCard.Value>
        <StatisticCard.Trend direction="decrease">3.1%</StatisticCard.Trend>
    </StatisticCard>
    <StatisticCard>
        <StatisticCard.Label>Open issues</StatisticCard.Label>
        <StatisticCard.Value>76</StatisticCard.Value>
        <StatisticCard.Trend direction="neutral">0%</StatisticCard.Trend>
    </StatisticCard>
</Stack>`;

// A figure that is better off falling, where the way the move points and what it means part
// company. The arrow still points the way the figure went; only the colour is turned around
const sentimentPreview = (
    <Stack className={classes.stack}>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Failed builds</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>34</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="increase" sentiment="negative">
                12.5%
            </StatisticCardComponent.Trend>
            <StatisticCardComponent.Description>
                vs the week before
            </StatisticCardComponent.Description>
        </StatisticCardComponent>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Median build time</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>4m 12s</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="decrease" sentiment="positive">
                18.0%
            </StatisticCardComponent.Trend>
            <StatisticCardComponent.Description>
                vs the week before
            </StatisticCardComponent.Description>
        </StatisticCardComponent>
    </Stack>
);

const sentimentCode = `<Stack className="flex flex-col gap-[var(--base-size-8)]">
    <StatisticCard>
        <StatisticCard.Label>Failed builds</StatisticCard.Label>
        <StatisticCard.Value>34</StatisticCard.Value>
        <StatisticCard.Trend direction="increase" sentiment="negative">
            12.5%
        </StatisticCard.Trend>
        <StatisticCard.Description>vs the week before</StatisticCard.Description>
    </StatisticCard>
    <StatisticCard>
        <StatisticCard.Label>Median build time</StatisticCard.Label>
        <StatisticCard.Value>4m 12s</StatisticCard.Value>
        <StatisticCard.Trend direction="decrease" sentiment="positive">
            18.0%
        </StatisticCard.Trend>
        <StatisticCard.Description>vs the week before</StatisticCard.Description>
    </StatisticCard>
</Stack>`;

// A mark closing the row rather than leading it, so a run of cards carries its marks down one edge
const trailingVisualPreview = (
    <Stack className={classes.preview}>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Sessions</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>12.9K</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="increase">8.2%</StatisticCardComponent.Trend>
            <StatisticCardComponent.Description>
                vs the four weeks before
            </StatisticCardComponent.Description>
            <StatisticCardComponent.TrailingVisual>
                <PeopleRegular />
            </StatisticCardComponent.TrailingVisual>
        </StatisticCardComponent>
    </Stack>
);

const trailingVisualCode = `<StatisticCard>
    <StatisticCard.Label>Sessions</StatisticCard.Label>
    <StatisticCard.Value>12.9K</StatisticCard.Value>
    <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
    <StatisticCard.Description>vs the four weeks before</StatisticCard.Description>
    <StatisticCard.TrailingVisual>
        <PeopleRegular />
    </StatisticCard.TrailingVisual>
</StatisticCard>`;

// A run of headline figures shown side by side, which is how a set of them is read: one against
// the next rather than each on its own
const rowPreview = (
    <div className={classes.row}>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Sessions</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>12.9K</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="increase">8.2%</StatisticCardComponent.Trend>
            <StatisticCardComponent.TrailingVisual>
                <PeopleRegular />
            </StatisticCardComponent.TrailingVisual>
        </StatisticCardComponent>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Revenue</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>$4.2M</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="increase">2.4%</StatisticCardComponent.Trend>
            <StatisticCardComponent.TrailingVisual>
                <MoneyRegular />
            </StatisticCardComponent.TrailingVisual>
        </StatisticCardComponent>
        <StatisticCardComponent>
            <StatisticCardComponent.Label>Failed builds</StatisticCardComponent.Label>
            <StatisticCardComponent.Value>34</StatisticCardComponent.Value>
            <StatisticCardComponent.Trend direction="increase" sentiment="negative">
                12.5%
            </StatisticCardComponent.Trend>
            <StatisticCardComponent.TrailingVisual>
                <WarningRegular />
            </StatisticCardComponent.TrailingVisual>
        </StatisticCardComponent>
    </div>
);

// The container is part of what is being shown rather than the page's own furniture, since laying
// the cards across is the whole of what the example is about
const rowCode = `<div className="grid grid-cols-3 gap-[var(--base-size-16)]">
    <StatisticCard>
        <StatisticCard.Label>Sessions</StatisticCard.Label>
        <StatisticCard.Value>12.9K</StatisticCard.Value>
        <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
        <StatisticCard.TrailingVisual>
            <PeopleRegular />
        </StatisticCard.TrailingVisual>
    </StatisticCard>
    <StatisticCard>
        <StatisticCard.Label>Revenue</StatisticCard.Label>
        <StatisticCard.Value>$4.2M</StatisticCard.Value>
        <StatisticCard.Trend direction="increase">2.4%</StatisticCard.Trend>
        <StatisticCard.TrailingVisual>
            <MoneyRegular />
        </StatisticCard.TrailingVisual>
    </StatisticCard>
    <StatisticCard>
        <StatisticCard.Label>Failed builds</StatisticCard.Label>
        <StatisticCard.Value>34</StatisticCard.Value>
        <StatisticCard.Trend direction="increase" sentiment="negative">
            12.5%
        </StatisticCard.Trend>
        <StatisticCard.TrailingVisual>
            <WarningRegular />
        </StatisticCard.TrailingVisual>
    </StatisticCard>
</div>`;

// The card as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what it can be left holding, then what the move it has made says, then what closes
// the row, and last a set of them read together
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "What is being measured, what it now stands at, how far it has moved and over what. The parts are written out rather than handed over as props, so a card carrying less than this is the same card with a part left out, and they fall where the card puts them however they were written. The whole is grouped under the line naming the figure, so a reader arriving at the number is told what it counts rather than being left with a number on its own.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "The figure on its own",
        description:
            "A card with no move to report, for a figure there is nothing yet to compare with — the first week of something, or a count that stands rather than runs. The line the figure and the move share is left out rather than left empty, so the card comes down to what it is holding.",
        preview: withoutTrendPreview,
        code: withoutTrendCode,
    },
    {
        name: "Which way the figure has moved",
        description:
            "The move drawn with an arrow as well as a colour, so it is still there to be read where the colour is not — printed, in high contrast, or by a reader who cannot tell the two apart. The arrow is a shape rather than a word, so which way it points is also said in words that only a screen reader hears.",
        preview: directionsPreview,
        code: directionsCode,
    },
    {
        name: "Where a rise is the bad news",
        description:
            "A figure that is better off falling — errors, failed builds, how long something takes — where the way a move points and what it means part company. The arrow still points the way the figure went, since that is what happened; only what the move is taken to mean is turned around, so a fall in the figures that are better off falling is still drawn as the good news.",
        preview: sentimentPreview,
        code: sentimentCode,
    },
    {
        name: "A mark closing the row",
        description:
            "A mark standing after the words rather than beside the figure. It is held at the end of the row, so a run of cards carries its marks down one edge rather than at the front of lines of different lengths, and what it holds is drawn at the size the card sets. An unlabelled mark stays out of the accessibility tree — the line naming the figure already says what the card is about.",
        preview: trailingVisualPreview,
        code: trailingVisualCode,
    },
    {
        name: "A row of headline figures",
        description:
            "A set of figures shown side by side, which is how a set of them is read: one against the next rather than each on its own. This is what a run of these cards is for, rather than a chart with one bar to each of them — a bar chart of unrelated figures compares things that have nothing to do with one another.",
        preview: rowPreview,
        code: rowCode,
    },
];

// Which way the figure has moved, drawn as the arrow beside it
const direction = '"increase" | "decrease" | "neutral"';

// What the move means, which is not always what way it points
const sentiment = '"positive" | "negative" | "neutral"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the card and its parts take, under the one that takes it. The card holds the parts and
// little else, so what is said about it is how it is named; the move is the one part with anything
// to be told, since it is the only one drawing something the words do not already say
const groups: ComponentPropGroup[] = [
    {
        name: "StatisticCard",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the card is called, for one carrying no line naming the figure. Where there is a label, the card is named after it and this is not wanted: two names for the one card is one more than a reader is helped by",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The element the card is named by, where something outside it already says what the figure counts — a heading over a run of cards, say. It wins over the line naming the figure",
            },
            styling,
        ],
    },
    {
        name: "StatisticCard.Label",
        props: [
            {
                name: "id",
                type: "string",
                description:
                    "Names this line for something else to point at. Left out, it takes the id the card is already pointing at, which is what groups the parts under it, so one given here is only worth it where something outside the card has to name the line as well",
            },
            styling,
        ],
    },
    {
        name: "StatisticCard.Value",
        props: [styling],
    },
    {
        name: "StatisticCard.Trend",
        props: [
            {
                name: "direction",
                type: direction,
                required: true,
                description:
                    "Which way the figure has moved, drawn as the arrow beside it and said in words that only a screen reader hears, since an arrow is a shape rather than a word",
            },
            {
                name: "sentiment",
                type: sentiment,
                description:
                    "What the move means, which is not always what way it points: more errors is a worse week rather than a better one. Left out, the move means what its direction means — a rise reads as the good news and a fall as the bad. It settles the colour alone, so the arrow still points the way the figure actually went",
            },
            styling,
        ],
    },
    {
        name: "StatisticCard.Description",
        props: [styling],
    },
    {
        name: "StatisticCard.TrailingVisual",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the mark, for one that says something the words do not. Left out, the mark is taken as decorative and stays out of the accessibility tree, which is what a mark standing beside a line that already names the figure should be",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the card is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const StatisticCard = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                StatisticCard
            </Heading>
            <Text as="p" size="large">
                One headline figure drawn as a card: what is being measured, what it now stands at,
                and which way it has moved. A run of them side by side is how a set of headline
                figures is shown — a chart with one bar to each would be comparing things that have
                nothing to do with one another.
            </Text>
            <Text as="p" size="large">
                The parts are written out rather than handed over as props, and each falls where the
                card puts it however it was written: the figure and the move it has made stand
                together on a line of their own, and the mark closes the row rather than leading it.
                They are grouped under the line naming the figure, so a reader arriving at the
                number is told what it counts rather than being left with a number on its own, and
                the move is drawn as an arrow as well as a colour so that it survives where colour
                does not.
            </Text>
        </Stack>
        <ComponentExamples component="StatisticCard" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default StatisticCard;
