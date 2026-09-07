import {
    Heading,
    StateLabel as StateLabelComponent,
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
};

// The plainest label there is: the state of an issue that is open, which is the one a reader meets
// most often. The status settles both the colour and the mark before the words, so the only thing
// left to say is what the state is called.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the label alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a pill the width of the page.
//
// The page and the component it is about are both called StateLabel, so the component is brought in
// under a name saying which of the two it is. The listing beneath says StateLabel, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <StateLabelComponent status="issueOpened">Open</StateLabelComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<StateLabel status="issueOpened">Open</StateLabel>`;

// The states an issue passes through. They are drawn together rather than one to an example, since
// a state is read against the others it could have been rather than on its own
const issuesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabelComponent status="issueOpened">Open</StateLabelComponent>
        <StateLabelComponent status="issueClosed">Closed</StateLabelComponent>
        <StateLabelComponent status="issueClosedNotPlanned">Closed</StateLabelComponent>
        <StateLabelComponent status="issueDraft">Draft</StateLabelComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the run of them read beside one another, so it is written out with them
const issuesCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <StateLabel status="issueOpened">Open</StateLabel>
    <StateLabel status="issueClosed">Closed</StateLabel>
    <StateLabel status="issueClosedNotPlanned">Closed</StateLabel>
    <StateLabel status="issueDraft">Draft</StateLabel>
</Stack>`;

// The states a pull request passes through, which are the issue's states with a merge on the end
// and a queue before it
const pullsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabelComponent status="pullOpened">Open</StateLabelComponent>
        <StateLabelComponent status="pullClosed">Closed</StateLabelComponent>
        <StateLabelComponent status="pullMerged">Merged</StateLabelComponent>
        <StateLabelComponent status="pullQueued">Queued</StateLabelComponent>
        <StateLabelComponent status="draft">Draft</StateLabelComponent>
    </Stack>
);

const pullsCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <StateLabel status="pullOpened">Open</StateLabel>
    <StateLabel status="pullClosed">Closed</StateLabel>
    <StateLabel status="pullMerged">Merged</StateLabel>
    <StateLabel status="pullQueued">Queued</StateLabel>
    <StateLabel status="draft">Draft</StateLabel>
</Stack>`;

// The states a security alert passes through, each drawn with a shield of its own
const alertsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabelComponent status="alertOpened">Open</StateLabelComponent>
        <StateLabelComponent status="alertFixed">Fixed</StateLabelComponent>
        <StateLabelComponent status="alertDismissed">Dismissed</StateLabelComponent>
        <StateLabelComponent status="alertClosed">Closed</StateLabelComponent>
    </Stack>
);

const alertsCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <StateLabel status="alertOpened">Open</StateLabel>
    <StateLabel status="alertFixed">Fixed</StateLabel>
    <StateLabel status="alertDismissed">Dismissed</StateLabel>
    <StateLabel status="alertClosed">Closed</StateLabel>
</Stack>`;

// The states that belong to no kind of thing in particular, for whatever a page has that is open,
// closed, put away or out of reach. The first two carry no mark at all
const genericPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <StateLabelComponent status="open">Open</StateLabelComponent>
        <StateLabelComponent status="closed">Closed</StateLabelComponent>
        <StateLabelComponent status="archived">Archived</StateLabelComponent>
        <StateLabelComponent status="unavailable">Unavailable</StateLabelComponent>
    </Stack>
);

const genericCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <StateLabel status="open">Open</StateLabel>
    <StateLabel status="closed">Closed</StateLabel>
    <StateLabel status="archived">Archived</StateLabel>
    <StateLabel status="unavailable">Unavailable</StateLabel>
</Stack>`;

// The two sizes, lined up on their centres rather than at their feet, so what is read between them
// is the height and not where each of them was set down
const sizesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <StateLabelComponent status="pullMerged" size="small">
            Merged
        </StateLabelComponent>
        <StateLabelComponent status="pullMerged" size="medium">
            Merged
        </StateLabelComponent>
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <StateLabel status="pullMerged" size="small">Merged</StateLabel>
    <StateLabel status="pullMerged" size="medium">Merged</StateLabel>
</Stack>`;

// The label as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then the states each kind of thing passes through, then the ones belonging to no kind, and
// last how much room the pill takes
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The state of a thing, said in a word and drawn in the colour that state is read in. The status settles both the colour and the mark before the words, so what is left to say is only what the state is called — which is why the words are handed over rather than worked out: an application saying Open in its own language should not have to say it in English to be drawn correctly.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Issue states",
        description:
            "The states an issue passes through. Closed comes in two: one for work that was done and one for work that will not be, and they are drawn apart — a tick in the colour of something finished against a bar in the neutral one — since closing something and completing it are not the same news. The mark is named after the kind of thing the state belongs to, so a screen reader hears “Issue” beside the word rather than a shape.",
        preview: issuesPreview,
        code: issuesCode,
    },
    {
        name: "Pull request states",
        description:
            "The states a pull request passes through: the issue's, with a merge on the end and a queue before it. Merged is drawn in the same colour as a closed issue, since both are work that landed; closed is drawn apart from it, since a pull request that was closed is work that did not.",
        preview: pullsPreview,
        code: pullsCode,
    },
    {
        name: "Alert states",
        description:
            "The states a security alert passes through, each drawn with a shield of its own so the four are told apart by more than their colour. Fixed and dismissed are different endings — one where the problem went away and one where it was decided against — and are drawn as such.",
        preview: alertsPreview,
        code: alertsCode,
    },
    {
        name: "States that name no kind",
        description:
            "The states belonging to no kind of thing in particular, for whatever a page has that is open, closed, put away or out of reach. Open and closed carry no mark at all, since there is no kind of thing for one to stand for, and the word alone says what the state is.",
        preview: genericPreview,
        code: genericCode,
    },
    {
        name: "Sizes",
        description:
            "How much room the pill takes. The mark is drawn to match: the smaller one is scaled to whatever size the words are set at rather than to a step of its own, so a label set in a line of text keeps its mark in proportion to the line it stands in.",
        preview: sizesPreview,
        code: sizesCode,
    },
];

// Every state that can be reported. The ones belonging to no kind of thing come first, since they
// are what a page reaches for where it has no issues or pull requests to report on, and the four
// families follow in the order they are shown above
const status =
    '"open" | "closed" | "draft" | "archived" | "unavailable" | "issueOpened" | "issueClosed" | ' +
    '"issueClosedNotPlanned" | "issueDraft" | "pullOpened" | "pullClosed" | "pullMerged" | ' +
    '"pullQueued" | "alertOpened" | "alertClosed" | "alertFixed" | "alertDismissed"';

// How much room the pill takes
const size = '"small" | "medium"';

// Every prop the label takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// What state is being reported comes first, since it is the whole of what the label is for; how much
// room it takes follows, and what it is drawn as comes last
const groups: ComponentPropGroup[] = [
    {
        name: "StateLabel",
        props: [
            {
                name: "status",
                type: status,
                required: true,
                description:
                    "The state being reported, which settles both the colour the pill is filled with and the mark before the words. Several states share a colour on purpose — a merged pull request and a closed issue are both work that landed — so what tells them apart is the mark rather than the fill. The generic open and closed carry no mark, since there is no kind of thing for one to stand for",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How much room the pill takes. The mark is drawn to match: the smaller one is scaled to whatever size the words are set at rather than to a step of its own, so a label set in a line of text keeps its mark in proportion to the line",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What the state is called, which is handed over rather than worked out from the status: an application writing in its own language says the word it uses, and the status settles only how the pill is drawn",
            },
            {
                name: "className",
                type: "string",
                description: "Class name for custom styling",
            },
            {
                name: "as",
                type: "React.ElementType",
                default: '"span"',
                description:
                    "The element or component this is drawn as, in place of its default. A span is a word set beside something and is what a state label usually is; an anchor is one that leads to whatever it reports the state of",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the label is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const StateLabel = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                StateLabel
            </Heading>
            <Text as="p" size="large">
                A filled pill saying what state something is in: an issue that is open, a pull
                request that was merged, an alert that has been dismissed. Where Label leaves the
                ground where it was and Badge counts something, a state label reports the one thing
                a reader wants to know at the top of a page — so it is filled rather than outlined,
                and it carries the mark of whatever kind of thing it is reporting on.
            </Text>
            <Text as="p" size="large">
                The status settles the colour and the mark; the words are handed over, so an
                application writing in its own language says Open in the words it uses. Several
                states share a colour on purpose — a merged pull request and a closed issue are both
                work that landed — and what tells them apart is the mark, which is named after the
                kind of thing it belongs to rather than left as a shape.
            </Text>
        </Stack>
        <ComponentExamples component="StateLabel" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default StateLabel;
