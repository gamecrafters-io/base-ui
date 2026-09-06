import {
    Heading,
    Label,
    LabelGroup as LabelGroupComponent,
    Stack,
    Text,
    Token,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Narrow enough that the row runs out of room. A row told to show as many as it has room for
    // says nothing about itself in a box it can never run out of, so it is given one it can
    bounded:
        "w-[var(--overlay-width-medium)] max-w-full rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] p-[var(--base-size-8)]",
};

// More labels than a row is likely to have room for. They are counted rather than named, since
// what the examples are about is how many of them fit rather than what any of them says
const names = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
];

const labels = names.map((name) => <Label key={name}>{name}</Label>);

// The same run, drawn as something a reader can reach rather than only read, so that what a row
// does with the ones it holds back can be told apart from what it does with the ones it shows
const tokens = names.map((name) => (
    <Token key={name} as="button" text={name} hideRemoveButton onClick={() => {}} />
));

// What the examples have to have in hand before they can be drawn. Each is written once and
// reached for by the examples that need it
const namesSetup = `const names = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
];`;

const labelsSetup = `${namesSetup}

const labels = names.map((name) => <Label key={name}>{name}</Label>);`;

const boundedSetup = `const bounded = "w-[var(--overlay-width-medium)] max-w-full rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] p-[var(--base-size-8)]";`;

const boundedLabelsSetup = `${boundedSetup}

${labelsSetup}`;

const tokensSetup = `${boundedSetup}

${namesSetup}

const tokens = names.map((name) => (
    <Token key={name} as="button" text={name} hideRemoveButton onClick={() => {}} />
));`;

// The plainest row there is: the labels, and nothing said with a prop. A row that has not been told
// to stop shows everything it holds and wraps onto as many lines as that takes, so nothing is held
// back and there is no count to press.
//
// The page and the component it is about are both called LabelGroup, so the component is brought in
// under a name saying which of the two it is. The listing beneath says LabelGroup, as an
// application importing it would
const defaultPreview = <LabelGroupComponent>{labels}</LabelGroupComponent>;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<LabelGroup>{labels}</LabelGroup>`;

// A fixed number, which is what settles whether the row holds anything back. What is left over is
// counted rather than lost, and the count is the button that shows it.
//
// What did not fit is left where it stands and taken out of sight rather than moved, so the room
// the rest were measured in does not change as labels come and go
const fixedPreview = <LabelGroupComponent visibleChildCount={5}>{labels}</LabelGroupComponent>;

const fixedCode = `<LabelGroup visibleChildCount={5}>{labels}</LabelGroup>`;

// Where the labels that did not fit are shown once they are asked for. The overlay leaves the row
// exactly as it was and shows the whole set on a surface over the page; shown in place, the row
// wraps to hold everything and the count becomes the button that puts them back.
//
// Shown in place, focus follows the labels: onto the first one that has just come into view, and
// back onto the count as they go
const overflowPreview = (
    <Stack gap="normal">
        <div className={classes.bounded}>
            <LabelGroupComponent visibleChildCount={5} overflowStyle="overlay">
                {labels}
            </LabelGroupComponent>
        </div>
        <div className={classes.bounded}>
            <LabelGroupComponent visibleChildCount={5} overflowStyle="inline">
                {labels}
            </LabelGroupComponent>
        </div>
    </Stack>
);

const overflowCode = `<Stack gap="normal">
    <div className={bounded}>
        <LabelGroup visibleChildCount={5} overflowStyle="overlay">
            {labels}
        </LabelGroup>
    </div>
    <div className={bounded}>
        <LabelGroup visibleChildCount={5} overflowStyle="inline">
            {labels}
        </LabelGroup>
    </div>
</Stack>`;

// A row holding things that can be acted on rather than only read. What has been held back is out
// of reach as well as out of sight, so the tab key never lands on something the reader cannot see
const tokensPreview = (
    <div className={classes.bounded}>
        <LabelGroupComponent visibleChildCount={5}>{tokens}</LabelGroupComponent>
    </div>
);

const tokensCode = `<div className={bounded}>
    <LabelGroup visibleChildCount={5}>{tokens}</LabelGroup>
</div>`;

// A row drawn as something other than a list, for one standing somewhere a list would not be read
// as one. What it holds is wrapped in spans rather than list items, since only a list may hold one
const asDivPreview = (
    <LabelGroupComponent as="div" visibleChildCount={5}>
        {labels}
    </LabelGroupComponent>
);

const asDivCode = `<LabelGroup as="div" visibleChildCount={5}>
    {labels}
</LabelGroup>`;

// The row as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then how many it shows, then where the rest are shown, and last what is done where the row
// holds something other than plain labels or stands somewhere a list would not belong
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The labels, with nothing said about how many to show. A row that has not been told to stop shows everything it holds and wraps onto as many lines as that takes, so nothing is held back and there is no count to press.",
        setup: labelsSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A fixed number",
        description:
            "How many the row shows before it stops. What is left over is counted rather than lost, and the count is the button that shows it. What did not fit is left where it stands and taken out of sight rather than moved, so the room the rest were measured in does not change as labels come and go, and the row keeps to one line, since a row that wrapped would have room for everything and nothing left to hold back.",
        setup: labelsSetup,
        preview: fixedPreview,
        code: fixedCode,
    },
    {
        name: "Where the rest are shown",
        description:
            "The overlay leaves the row exactly as it was and shows the whole set on a surface over the page, which is what a row standing in a tight space wants. Shown in place, the row wraps to hold everything and the count becomes the button that puts them back; focus follows the labels there, onto the first one that has just come into view and back onto the count as they go.",
        setup: boundedLabelsSetup,
        preview: overflowPreview,
        code: overflowCode,
    },
    {
        name: "Things that can be acted on",
        description:
            "A row holding tokens rather than plain labels. What has been held back is out of reach as well as out of sight, so the tab key never lands on something the reader cannot see, and the count is what stands in for all of it until it is pressed.",
        setup: tokensSetup,
        preview: tokensPreview,
        code: tokensCode,
    },
    {
        name: "Drawn as something other than a list",
        description:
            "For a row standing somewhere a list would not be read as one. What it holds is wrapped in spans rather than list items, since only a list may hold one, and a label written inside is left exactly as it was.",
        setup: labelsSetup,
        preview: asDivPreview,
        code: asDivCode,
    },
];

// Where the labels that did not fit are shown once the reader asks for them
const overflowStyle = '"overlay" | "inline"';

// How many labels the row shows before it stops
const visibleChildCount = '"auto" | number';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the row takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// How many it shows comes first, since it is what settles whether the row holds anything back at
// all, and where the rest are shown follows from it
const groups: ComponentPropGroup[] = [
    {
        name: "LabelGroup",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The labels or tokens the row holds. Each is wrapped in an element of the row's own — a list item in a list, a span in anything else — so what is written here is left exactly as it was",
            },
            {
                name: "visibleChildCount",
                type: visibleChildCount,
                options: ["auto"],
                description:
                    "How many labels the row shows before it stops. Auto measures the row and shows as many as fit; a number shows that many and no more, and is the surer of the two where the row's width is not settled before it is drawn. Left out, the row shows everything it holds and wraps onto as many lines as that takes, and nothing is held back",
            },
            {
                name: "overflowStyle",
                type: overflowStyle,
                default: '"overlay"',
                options: ["overlay", "inline"],
                description:
                    "Where the labels that did not fit are shown once they are asked for. The overlay leaves the row as it was and shows the whole set on a surface over the page; inline lets the row wrap and shows them where they belong. It says nothing where the row was not told to stop, since there is then nothing being held back",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"ul"',
                description:
                    "What the row is drawn as. It is a list by default, since a row of labels is a set of things rather than a sentence and a reader who cannot see it is better served being told how many there are. Drawn as anything but a list, what it holds is wrapped in spans instead",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the row is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const LabelGroup = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                LabelGroup
            </Heading>
            <Text as="p" size="large">
                A row of labels or tokens on one thing. Where the row runs out of room — or is told
                to stop after a certain number — whatever is left over is counted rather than lost,
                and the count is a button that shows the rest. What is held back is taken out of
                reach as well as out of sight, so the tab key never lands on something the reader
                cannot see. It is drawn as a list, since a row of labels is a set of things rather
                than a sentence and a reader who cannot see it is better served being told how many
                there are. A row that has not been told to stop simply shows everything it holds and
                wraps onto as many lines as that takes.
            </Text>
        </Stack>
        <ComponentExamples component="LabelGroup" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default LabelGroup;
