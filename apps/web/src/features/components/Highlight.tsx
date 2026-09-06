import { Heading, Highlight as HighlightComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Running text needs a column narrow enough to wrap within, since what those examples are about
    // is a run picked out of a line rather than a phrase standing on its own
    column: "w-[20rem]",
};

// What a search over a list of repositories has turned up, and what was typed to turn it up. They
// are the ones the library's own stories search over, so what is read here and what is read there
// are the same names
const typed = "act";

const results = [
    "actions/checkout",
    "primer/react",
    "github/interaction-tracking",
    "reactjs/react-transaction",
];

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const columnSetup = `const column = "w-[20rem]";`;

const resultsSetup = `const typed = "act";

const results = [
    "actions/checkout",
    "primer/react",
    "github/interaction-tracking",
    "reactjs/react-transaction",
];`;

// The plainest highlight there is: a term, and the text it is looked for in. The run the term stood
// for is picked out and everything either side of it is left exactly as it was written.
//
// The page and the component it is about are both called Highlight, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Highlight, as an application
// importing it would
const defaultPreview = <HighlightComponent match="request">Pull request</HighlightComponent>;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Highlight match="request">Pull request</Highlight>`;

// More than one term picked out at once, which is what a search on several words wants: each word
// is looked for on its own rather than the phrase being looked for whole
const severalTermsPreview = (
    <HighlightComponent match={["pull", "request"]}>Pull request</HighlightComponent>
);

const severalTermsCode = `<Highlight match={["pull", "request"]}>Pull request</Highlight>`;

// Every run a term stood for rather than the first of them. A reader looking at a result wants to
// see everywhere it was found, since one of the runs may be the one they were after
const everyOccurrencePreview = <HighlightComponent match="re">Rebase and retry</HighlightComponent>;

const everyOccurrenceCode = `<Highlight match="re">Rebase and retry</Highlight>`;

// Whether the letters have to match in case as well. A search is read as case insensitive unless it
// says otherwise, since a reader typing a term rarely types the case it was written in. The case
// the text was written in is kept either way: it is the text that is drawn, not the term
const casePreview = (
    <Stack gap="condensed">
        <Text>
            as it comes: <HighlightComponent match="pull">Pull request</HighlightComponent>
        </Text>
        <Text>
            case sensitive:{" "}
            <HighlightComponent match="pull" caseSensitive>
                Pull request
            </HighlightComponent>
        </Text>
    </Stack>
);

const caseCode = `<Stack gap="condensed">
    <Text>
        as it comes: <Highlight match="pull">Pull request</Highlight>
    </Text>
    <Text>
        case sensitive:{" "}
        <Highlight match="pull" caseSensitive>
            Pull request
        </Highlight>
    </Text>
</Stack>`;

// A term that is nowhere in the text. Nothing is drawn to say so: the text comes back whole and
// unmarked, exactly as it was written, so a list of results reads as a list rather than as a run of
// things that failed to match
const noMatchPreview = <HighlightComponent match="issue">Pull request</HighlightComponent>;

const noMatchCode = `<Highlight match="issue">Pull request</Highlight>`;

// What two terms falling in the same place come to. The longer of them is taken, so a term standing
// inside another still leaves the longer picked out whole rather than cut in two; and two runs that
// meet are drawn as one, since the seam between them would say nothing a reader could see
const overlappingPreview = (
    <Stack gap="condensed">
        <Text>
            one inside another:{" "}
            <HighlightComponent match={["re", "render"]}>renderer</HighlightComponent>
        </Text>
        <Text>
            two that meet:{" "}
            <HighlightComponent match={["pull", "request"]}>pullrequest</HighlightComponent>
        </Text>
    </Stack>
);

const overlappingCode = `<Stack gap="condensed">
    <Text>
        one inside another: <Highlight match={["re", "render"]}>renderer</Highlight>
    </Text>
    <Text>
        two that meet: <Highlight match={["pull", "request"]}>pullrequest</Highlight>
    </Text>
</Stack>`;

// What the runs are painted. The five are drawn together rather than one to an example, since a
// colour is read against the others rather than on its own. Each is named for the variant it was
// given, so what is read beside the run is the value that drew it
const variantsPreview = (
    <Stack gap="condensed">
        <Text>
            attention:{" "}
            <HighlightComponent match="request" variant="attention">
                Pull request
            </HighlightComponent>
        </Text>
        <Text>
            accent:{" "}
            <HighlightComponent match="request" variant="accent">
                Pull request
            </HighlightComponent>
        </Text>
        <Text>
            success:{" "}
            <HighlightComponent match="request" variant="success">
                Pull request
            </HighlightComponent>
        </Text>
        <Text>
            danger:{" "}
            <HighlightComponent match="request" variant="danger">
                Pull request
            </HighlightComponent>
        </Text>
        <Text>
            neutral:{" "}
            <HighlightComponent match="request" variant="neutral">
                Pull request
            </HighlightComponent>
        </Text>
    </Stack>
);

const variantsCode = `<Stack gap="condensed">
    <Text>
        attention: <Highlight match="request" variant="attention">Pull request</Highlight>
    </Text>
    <Text>
        accent: <Highlight match="request" variant="accent">Pull request</Highlight>
    </Text>
    <Text>
        success: <Highlight match="request" variant="success">Pull request</Highlight>
    </Text>
    <Text>
        danger: <Highlight match="request" variant="danger">Pull request</Highlight>
    </Text>
    <Text>
        neutral: <Highlight match="request" variant="neutral">Pull request</Highlight>
    </Text>
</Stack>`;

// Where the component is actually reached for: a list of what a search turned up, with what was
// typed picked out of each name. A result whose match falls somewhere unexpected is the one a
// reader most needs to see marked, which is why every run is picked out rather than the first
const searchResultsPreview = (
    <Stack gap="condensed" className={classes.column}>
        {results.map((result) => (
            <Text key={result} as="p">
                <HighlightComponent match={typed}>{result}</HighlightComponent>
            </Text>
        ))}
    </Stack>
);

const searchResultsCode = `<Stack gap="condensed" className={column}>
    {results.map((result) => (
        <Text key={result} as="p">
            <Highlight match={typed}>{result}</Highlight>
        </Text>
    ))}
</Stack>`;

// A run picked out of a line rather than a phrase standing on its own. The mark takes the size of
// whatever it is read in rather than setting one of its own against it, so the three lines below
// are marked the same way and each stays the size it was set at
const runningTextPreview = (
    <Stack gap="normal" className={classes.column}>
        <Text as="p" size="large">
            <HighlightComponent match="everyone">
                Deleting this repository takes it away from everyone who can reach it.
            </HighlightComponent>
        </Text>
        <Text as="p" size="medium">
            <HighlightComponent match="everyone">
                Deleting this repository takes it away from everyone who can reach it.
            </HighlightComponent>
        </Text>
        <Text as="p" size="small">
            <HighlightComponent match="everyone">
                Deleting this repository takes it away from everyone who can reach it.
            </HighlightComponent>
        </Text>
    </Stack>
);

const runningTextCode = `<Stack gap="normal" className={column}>
    <Text as="p" size="large">
        <Highlight match="everyone">
            Deleting this repository takes it away from everyone who can reach it.
        </Highlight>
    </Text>
    <Text as="p" size="medium">
        <Highlight match="everyone">
            Deleting this repository takes it away from everyone who can reach it.
        </Highlight>
    </Text>
    <Text as="p" size="small">
        <Highlight match="everyone">
            Deleting this repository takes it away from everyone who can reach it.
        </Highlight>
    </Text>
</Stack>`;

// The highlight as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what can be looked for, then what happens where the terms fall awkwardly, then
// what the runs are painted, and last where the component is actually put to work
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Several terms",
        description:
            "More than one term picked out at once, which is what a search on several words wants: each word is looked for on its own rather than the phrase being looked for whole.",
        preview: severalTermsPreview,
        code: severalTermsCode,
    },
    {
        name: "Every occurrence",
        description:
            "Every run a term stood for rather than the first of them. A reader looking at a result wants to see everywhere it was found, since one of the runs may be the one they were after.",
        preview: everyOccurrencePreview,
        code: everyOccurrenceCode,
    },
    {
        name: "Case",
        description:
            "Whether the letters have to match in case as well. A search is read as case insensitive unless it says otherwise, since a reader typing a term rarely types the case it was written in. The case the text was written in is kept either way: it is the text that is drawn rather than the term that was searched for.",
        preview: casePreview,
        code: caseCode,
    },
    {
        name: "Nothing found",
        description:
            "A term that is nowhere in the text. Nothing is drawn to say so: the text comes back whole and unmarked, exactly as it was written, so a list of results reads as a list rather than as a run of things that failed to match. A term left out altogether, or an empty one, does the same.",
        preview: noMatchPreview,
        code: noMatchCode,
    },
    {
        name: "Terms that overlap or meet",
        description:
            "What two terms falling in the same place come to. The longer of them is taken, so a term standing inside another still leaves the longer picked out whole rather than cut in two; and two runs that meet are drawn as one, since the seam between them would say nothing a reader could see.",
        preview: overlappingPreview,
        code: overlappingCode,
    },
    {
        name: "Variants",
        description:
            "What the runs are painted, which is the mark's own palette rather than one of the highlight's. The attention colour is what a search result wants, since it is the one that reads as something found rather than as something said about what was found.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "In search results",
        description:
            "Where the component is actually reached for: a list of what a search turned up, with what was typed picked out of each name. A result whose match falls somewhere unexpected is the one a reader most needs to see marked, which is why every run is picked out rather than the first.",
        setup: `${columnSetup}\n\n${resultsSetup}`,
        preview: searchResultsPreview,
        code: searchResultsCode,
    },
    {
        name: "In running text",
        description:
            "A run picked out of a line rather than a phrase standing on its own. The mark takes the size of whatever it is read in rather than setting one of its own against it, so the three lines below are marked the same way and each stays the size it was set at.",
        setup: columnSetup,
        preview: runningTextPreview,
        code: runningTextCode,
    },
];

// What the runs are painted. It stands as the values themselves rather than as the name they are
// collected under, since one of them is what a caller actually hands over
const variant = '"attention" | "accent" | "success" | "danger" | "neutral"';

// What is looked for: one term, or several picked out at once
const match = "string | string[]";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the highlight takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// The text comes first, since it is what the terms are looked for in, then what is looked for, then
// how it is looked for, and last what the runs are painted
const groups: ComponentPropGroup[] = [
    {
        name: "Highlight",
        props: [
            {
                name: "children",
                type: "string",
                description:
                    "The text the terms are looked for in. It is given as text rather than as elements, since the runs have to be found within it and there is no way to look inside something already drawn",
            },
            {
                name: "match",
                type: match,
                description:
                    "The term or terms to pick out. Terms are looked for longest first, so one standing inside another still leaves the longer picked out whole. An empty term is passed over, and none at all leaves the text as it was written",
            },
            {
                name: "caseSensitive",
                type: "boolean",
                default: "false",
                description:
                    "Whether a term only stands where the letters match in case as well. The case the text was written in is kept either way, since it is the text that is drawn rather than the term that was searched for",
            },
            {
                name: "variant",
                type: variant,
                default: '"attention"',
                options: ["attention", "accent", "success", "danger", "neutral"],
                description:
                    "What the runs are painted. It is handed to the marks that draw them, so the palette is the mark's rather than one of the highlight's own",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the highlight is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Highlight = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Highlight
            </Heading>
            <Text as="p" size="large">
                Text with the runs a search stood for picked out of it, so that a reader can see
                what a result was found on. The text is handed over as text rather than as elements,
                since the runs have to be found within it, and everything between them is left
                exactly as it was written. The picking out is the Mark component&apos;s, so a run
                reads and is drawn as any other marked one and takes the size of the line it stands
                in. Terms are looked for longest first, so one standing inside another still leaves
                the longer picked out whole, and two runs that meet are drawn as one. The same
                splitting is exported on its own as splitHighlightChunks, for a caller who would
                rather draw the runs themselves.
            </Text>
        </Stack>
        <ComponentExamples component="Highlight" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Highlight;
