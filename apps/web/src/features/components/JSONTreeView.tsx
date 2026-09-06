import {
    Heading,
    JSONTreeView as JSONTreeViewComponent,
    Link,
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
    // The tree is given a column to stand in rather than the width of the page, since a value
    // nested a few levels down would otherwise be read right across it
    tree: "w-[var(--overlay-width-medium)] max-w-full",
};

// The value every example that is about how the tree is written is drawn from. It is written once
// and read out into each of them, since what those examples are about is the writing rather than
// the value
const person = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    active: true,
    tags: ["design", "research", "writing"],
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
    },
};

// One of every kind of value the tree knows how to name, including the ones a JSON file has no way
// of writing down
const everyKind = {
    string: "a line of text",
    number: 42,
    huge: BigInt("9007199254740993"),
    boolean: false,
    nothing: null,
    missing: undefined,
    named: Symbol("badge"),
    when: new Date("2026-08-28T09:00:00.000Z"),
    list: [1, 2, 3],
    empty: {},
};

// Functions are drawn as what they are rather than as what they do, and a regular expression is
// kept exactly as it was written, flags and all
const callables = {
    sum: function sum(a: number, b: number) {
        return a + b;
    },
    all: async (promises: Promise<unknown>[]) => await Promise.all(promises),
    countdown: function* countdown(from: number) {
        while (from > 0) {
            yield (from -= 1);
        }
    },
    slug: /^[a-z0-9-]+$/,
    anyCase: /^(?:[a-z0-9]+)foo.*?/i,
};

const repository = new Map<string, unknown>([
    ["name", "base-ui"],
    ["license", "MIT"],
    ["elements", new Set(["react", 123, false, null])],
    ["nested", new Map([["depth", 2]])],
]);

// A value nested deep enough that how far the tree opens can be read off it
const team = {
    team: { name: "Design", members: [{ name: "Ada" }, { name: "Grace" }] },
};

// A list longer than anyone would open all at once
const readings = { readings: Array.from({ length: 60 }, (_, index) => index * 3) };

// A list keeps its length behind a name an ordinary walk of it passes over, and anything else hung
// on it the same way
const hidden = [1, 2, 3];

Object.defineProperty(hidden, "takenAt", {
    value: "2026-08-28",
    enumerable: false,
});

// A value that holds itself, which the tree has to stop somewhere
const looping: Record<string, unknown> = { name: "root" };

looping.self = looping;
looping.child = { parent: looping };

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const treeSetup = `const tree = "w-[var(--overlay-width-medium)] max-w-full";`;

const personSetup = `${treeSetup}

const person = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    active: true,
    tags: ["design", "research", "writing"],
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
    },
};`;

const everyKindSetup = `${treeSetup}

const everyKind = {
    string: "a line of text",
    number: 42,
    huge: BigInt("9007199254740993"),
    boolean: false,
    nothing: null,
    missing: undefined,
    named: Symbol("badge"),
    when: new Date("2026-08-28T09:00:00.000Z"),
    list: [1, 2, 3],
    empty: {},
};`;

const callablesSetup = `${treeSetup}

const callables = {
    sum: function sum(a, b) {
        return a + b;
    },
    all: async (promises) => await Promise.all(promises),
    countdown: function* countdown(from) {
        while (from > 0) {
            yield (from -= 1);
        }
    },
    slug: /^[a-z0-9-]+$/,
    anyCase: /^(?:[a-z0-9]+)foo.*?/i,
};`;

const repositorySetup = `${treeSetup}

const repository = new Map([
    ["name", "base-ui"],
    ["license", "MIT"],
    ["elements", new Set(["react", 123, false, null])],
    ["nested", new Map([["depth", 2]])],
]);`;

const teamSetup = `${treeSetup}

const team = {
    team: { name: "Design", members: [{ name: "Ada" }, { name: "Grace" }] },
};`;

const readingsSetup = `${treeSetup}

const readings = { readings: Array.from({ length: 60 }, (_, index) => index * 3) };`;

const hiddenSetup = `${treeSetup}

const hidden = [1, 2, 3];

Object.defineProperty(hidden, "takenAt", {
    value: "2026-08-28",
    enumerable: false,
});`;

const loopingSetup = `${treeSetup}

const looping = { name: "root" };

looping.self = looping;
looping.child = { parent: looping };`;

// The plainest tree there is: the value, and nothing said with a prop. The rows one level down
// stand open, so what the value holds and what each of those holds are both drawn, and anything
// deeper than that is glimpsed rather than drawn.
//
// The tree is given a column to stand in, which is part of what is being shown: a value nested a
// few levels down and read across the whole width of a page is a value nobody can follow.
//
// The page and the component it is about are both called JSONTreeView, so the component is brought
// in under a name saying which of the two it is. The listing beneath says JSONTreeView, as an
// application importing it would
const defaultPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={person} />
    </div>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<div className={tree}>
    <JSONTreeView data={person} />
</div>`;

// Every kind of value the tree knows how to name. The names are the ones a reader would use rather
// than the ones the language gives, so a list is a list rather than an object and a date is a date
// rather than whatever it happens to be built out of
const everyKindPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={everyKind} />
    </div>
);

const everyKindCode = `<div className={tree}>
    <JSONTreeView data={everyKind} />
</div>`;

// Functions written as what they are rather than as what they do, since what they do is not
// something a tree has any way of showing, and regular expressions kept exactly as they were
// written
const callablesPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={callables} />
    </div>
);

const callablesCode = `<div className={tree}>
    <JSONTreeView data={callables} />
</div>`;

// A map and a set drawn under the names they were made by. A map's keys stand as the names of what
// it holds; a set has no names, so what it holds is counted through
const repositoryPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={repository} />
    </div>
);

const repositoryCode = `<div className={tree}>
    <JSONTreeView data={repository} />
</div>`;

// An error opened onto what is worth reading in it. An error keeps all of that behind names an
// ordinary walk of it passes over, so the tree asks for them by name rather than waiting to be
// walked past them
const errorPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={new Error("Could not reach the server")} />
    </div>
);

const errorCode = `<div className={tree}>
    <JSONTreeView data={new Error("Could not reach the server")} />
</div>`;

// How far down the tree stands open to begin with. Nought opens none of it, so every row is read as
// the glimpse of what it holds instead
const depthPreview = (
    <Stack gap="normal" className={classes.tree}>
        <JSONTreeViewComponent data={team} defaultExpandedDepth={0} aria-label="Closed" />
        <JSONTreeViewComponent data={team} defaultExpandedDepth={3} aria-label="Open" />
    </Stack>
);

const depthCode = `<Stack gap="normal" className={tree}>
    <JSONTreeView data={team} defaultExpandedDepth={0} aria-label="Closed" />
    <JSONTreeView data={team} defaultExpandedDepth={3} aria-label="Open" />
</Stack>`;

// How much of what it holds a closed row gives away. A list gives away the values alone, while
// anything else gives away the names along with them, since a row of bare values says little about
// an object while its names say a great deal
const previewPreview = (
    <Stack gap="normal" className={classes.tree}>
        <JSONTreeViewComponent
            data={person}
            defaultExpandedDepth={0}
            maxPreviewItems={2}
            aria-label="Two given away"
        />
        <JSONTreeViewComponent
            data={person}
            defaultExpandedDepth={0}
            maxPreviewItems={0}
            aria-label="None given away"
        />
    </Stack>
);

const previewCode = `<Stack gap="normal" className={tree}>
    <JSONTreeView
        data={person}
        defaultExpandedDepth={0}
        maxPreviewItems={2}
        aria-label="Two given away"
    />
    <JSONTreeView
        data={person}
        defaultExpandedDepth={0}
        maxPreviewItems={0}
        aria-label="None given away"
    />
</Stack>`;

// The value written the way a JSON file writes it, with the names in quotes and a long string cut.
// The cut falls inside the quotes rather than taking one of them off, so a shortened string still
// reads as a string rather than as one somebody forgot to close
const quotedPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent
            data={person}
            quotesOnKeys
            collapseStringsAfterLength={12}
            defaultExpandedDepth={2}
        />
    </div>
);

const quotedCode = `<div className={tree}>
    <JSONTreeView
        data={person}
        quotesOnKeys
        collapseStringsAfterLength={12}
        defaultExpandedDepth={2}
    />
</div>`;

// A list too long to open all at once, broken into runs named for the stretch they cover so that it
// is read a run at a time rather than a thousand rows arriving together
const groupedPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={readings} groupArraysAfterLength={20} />
    </div>
);

const groupedCode = `<div className={tree}>
    <JSONTreeView data={readings} groupArraysAfterLength={20} />
</div>`;

// The names an ordinary walk of a value passes over, which is where a list keeps its length and
// where anything hung on one out of sight is kept. They are marked as having been hidden, so what
// was asked for can be told from what was there to begin with
const nonEnumerablePreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={{ hidden }} defaultExpandedDepth={2} showNonEnumerable />
    </div>
);

const nonEnumerableCode = `<div className={tree}>
    <JSONTreeView data={{ hidden }} defaultExpandedDepth={2} showNonEnumerable />
</div>`;

// A value that holds itself. The tree has to stop somewhere, so a value it has already walked into
// is named as the loop it is rather than opened again
const loopingPreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent data={looping} defaultExpandedDepth={2} />
    </div>
);

const loopingCode = `<div className={tree}>
    <JSONTreeView data={looping} defaultExpandedDepth={2} />
</div>`;

// A value drawn some other way than the tree would draw it, for one worth more than the text of it.
// The renderer is handed each piece of the written-out value along with the row it belongs to, and
// giving nothing back leaves the piece drawn the way it would have been
const renderValuePreview = (
    <div className={classes.tree}>
        <JSONTreeViewComponent
            data={person}
            renderValue={(token) => {
                if (token.type !== "string") {
                    return undefined;
                }

                const text = token.text.replace(/^"(.*)"$/, "$1");

                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? (
                    <Link href={`mailto:${text}`}>{token.text}</Link>
                ) : undefined;
            }}
        />
    </div>
);

const renderValueCode = `<div className={tree}>
    <JSONTreeView
        data={person}
        renderValue={(token) => {
            if (token.type !== "string") {
                return undefined;
            }

            const text = token.text.replace(/^"(.*)"$/, "$1");

            return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(text) ? (
                <Link href={\`mailto:\${text}\`}>{token.text}</Link>
            ) : undefined;
        }}
    />
</div>`;

// The tree as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what it can be handed, then how far it opens and how much it gives away, then how it
// is written, and last what is done where a value is worth more than the text of it
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The value, with nothing said about how to draw it. The rows one level down stand open, so what the value holds and what each of those holds are both drawn, and anything deeper is glimpsed rather than drawn. Only the open rows are drawn at all, so a value read right through is still only as large on the page as it has been opened.",
        setup: personSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Every kind of value",
        description:
            "One of each kind the tree knows how to name. The names are the ones a reader would use rather than the ones the language gives, so a list is a list rather than an object and a date is a date rather than whatever it happens to be built out of. Something built to hold values that turned out to hold none is a leaf drawn as a pair of empty brackets, since there is nothing there to open.",
        setup: everyKindSetup,
        preview: everyKindPreview,
        code: everyKindCode,
    },
    {
        name: "Functions and regular expressions",
        description:
            "Functions drawn as what they are rather than as what they do, since what they do is not something a tree has any way of showing; an async function and a generator are marked as what they are. A regular expression is kept exactly as it was written, flags and all.",
        setup: callablesSetup,
        preview: callablesPreview,
        code: callablesCode,
    },
    {
        name: "Maps and sets",
        description:
            "Drawn under the names they were made by, and counted the way each of them is counted: a map's keys stand as the names of what it holds, while a set has no names and so what it holds is counted through.",
        setup: repositorySetup,
        preview: repositoryPreview,
        code: repositoryCode,
    },
    {
        name: "An error",
        description:
            "An error opened onto what is worth reading in it. An error keeps all of that behind names an ordinary walk of it passes over, so the tree asks for them by name rather than waiting to be walked past them.",
        setup: treeSetup,
        preview: errorPreview,
        code: errorCode,
    },
    {
        name: "How far down it opens",
        description:
            "How many levels stand open to begin with, counting from one. Nought opens none of them, so every row is read as the glimpse of what it holds instead, which is what a value being scanned rather than studied wants.",
        setup: teamSetup,
        preview: depthPreview,
        code: depthCode,
    },
    {
        name: "What a closed row gives away",
        description:
            "How many of the things it holds a closed row gives away before it says only that there are more. A list gives away the values alone, while anything else gives away the names along with them, since a row of bare values says little about an object while its names say a great deal. Nought gives none of them away and leaves the row as a pair of brackets with nothing between.",
        setup: personSetup,
        preview: previewPreview,
        code: previewCode,
    },
    {
        name: "Written the way a JSON file writes it",
        description:
            "The names in quotes and a long string cut short. The cut falls inside the quotes rather than taking one of them off, so a shortened string still reads as a string rather than as one somebody forgot to close.",
        setup: personSetup,
        preview: quotedPreview,
        code: quotedCode,
    },
    {
        name: "A list too long to open all at once",
        description:
            "A long list broken into runs named for the stretch they cover, so that it is read a run at a time rather than a thousand rows arriving together. The rows keep the places they came from, so a value opened out of a run is still the one that stood at that index.",
        setup: readingsSetup,
        preview: groupedPreview,
        code: groupedCode,
    },
    {
        name: "The names an ordinary walk passes over",
        description:
            "Where a list keeps its length, and where anything hung on a value out of sight is kept. They are marked as having been hidden, so what had to be asked for can be told from what was there to be walked past.",
        setup: hiddenSetup,
        preview: nonEnumerablePreview,
        code: nonEnumerableCode,
    },
    {
        name: "A value that holds itself",
        description:
            "The tree has to stop somewhere, so a value it has already walked into is named as the loop it is rather than opened again. The same value standing in two places that are not a loop is read in both of them.",
        setup: loopingSetup,
        preview: loopingPreview,
        code: loopingCode,
    },
    {
        name: "Drawing a value some other way",
        description:
            "For a value worth more than the text of it. The renderer is handed each piece of the written-out value along with the row it belongs to, and giving nothing back leaves the piece drawn the way it would have been, so only the pieces worth taking over have to be answered.",
        setup: personSetup,
        preview: renderValuePreview,
        code: renderValueCode,
    },
];

// What a value turns out to be once it has been looked at. It is long enough that it stands as the
// name it is collected under rather than as the values themselves, which is the other way about
// from a prop that takes one of a handful
const nodeType = "JSONNodeType";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the tree takes, and under it the pieces a value is written out of, since those are
// what a caller drawing a value themselves is handed.
//
// The value comes first, since it is the whole of what the tree is about, then how far it opens,
// then how much of a closed row is given away, then how it is written
const groups: ComponentPropGroup[] = [
    {
        name: "JSONTreeView",
        props: [
            {
                name: "data",
                type: "unknown",
                required: true,
                description:
                    "The value to draw. Anything at all: JSON, but also the maps, sets, dates, symbols, functions, errors and regular expressions a JSON file has no way of writing down. The value is opened out, so the tree begins inside it rather than at a row standing for the whole",
            },
            {
                name: "defaultExpandedDepth",
                type: "number",
                default: "1",
                description:
                    "How many levels down stand open to begin with, counting from one. Nought opens none of them. Only the open rows are drawn, so a value read right through is still only as large on the page as it has been opened",
            },
            {
                name: "maxPreviewItems",
                type: "number",
                default: "5",
                description:
                    "How many of the things it holds a closed row gives away before it says only that there are more. A list gives away the values alone, while anything else gives away the names along with them. Nought gives none of them away",
            },
            {
                name: "collapseStringsAfterLength",
                type: "number",
                default: "0",
                description:
                    "How long a string is allowed to run before it is cut. The cut falls inside the quotes rather than taking one of them off, so a shortened string still reads as a string. Nought lets it run",
            },
            {
                name: "quotesOnKeys",
                type: "boolean",
                default: "false",
                description: "Draws quotes around the names, the way a JSON file writes them",
            },
            {
                name: "groupArraysAfterLength",
                type: "number",
                default: "0",
                description:
                    "Breaks a long list into runs of this many, named for the stretch they cover, so that it is opened a run at a time rather than all at once. The rows keep the places they came from. Nought leaves the list whole",
            },
            {
                name: "showNonEnumerable",
                type: "boolean",
                default: "false",
                description:
                    "Shows the names an ordinary walk of a value passes over, which is where a list keeps its length and where anything hung on a value out of sight is kept. They are marked as having been hidden. An error is opened onto its own regardless, since there would otherwise be nothing worth reading in it",
            },
            {
                name: "renderValue",
                type: "JSONTreeViewRenderValue",
                description:
                    "Draws a value some other way than the tree would. It is handed each piece of the written-out value along with the row it belongs to; given nothing back, the tree draws the piece the way it would have",
            },
            {
                name: "aria-label",
                type: "string",
                default: '"JSON data"',
                description:
                    "What the tree is called. A tree with no name of its own is one a reader arrives at with no idea what they have arrived at, so it is named whether or not the caller says",
            },
            {
                name: "truncate",
                type: "boolean",
                default: "false",
                description:
                    "Cuts a row too long to fit rather than running it onto another line. It is the tree's own prop, as everything else about moving through the rows is",
            },
            {
                name: "flat",
                type: "boolean",
                default: "false",
                description:
                    "Draws every row at the same depth, for a tree standing in for a flat list. It is the tree's own prop, and a value drawn without its depths is rarely what a JSON tree is for",
            },
            styling,
        ],
    },
    {
        name: "JSONToken",
        props: [
            {
                name: "text",
                type: "string",
                required: true,
                description:
                    "The piece as it would have been drawn, quotes and all, so a renderer that takes one over can put it back exactly as it stood",
            },
            {
                name: "type",
                type: nodeType,
                description:
                    "What sort of value the piece is, where the piece is the value itself rather than the writing around it",
            },
            {
                name: "kind",
                type: '"bracket" | "constructor" | "separator" | "more"',
                options: ["bracket", "constructor", "separator", "more"],
                description:
                    "What the piece is doing in the line, where it is the writing around the value rather than the value itself: the brackets, the name a thing was made by, the commas between, and the note saying there are more",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the tree is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const JSONTreeView = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                JSONTreeView
            </Heading>
            <Text as="p" size="large">
                A value drawn as the tree it already is: objects and lists that open onto what they
                hold, and everything else drawn as what it is. It takes anything at all rather than
                only JSON, so the maps, sets, dates, symbols, functions, errors and regular
                expressions a JSON file has no way of writing down are each named as what a reader
                would call them. Only the open rows are drawn, so a value read right through is
                still only as large on the page as it has been opened, and a closed row gives a
                glimpse of what it holds rather than nothing at all. The tree itself is the TreeView
                component, since moving through it, opening it and what a screen reader makes of it
                are a tree&apos;s business rather than a JSON viewer&apos;s.
            </Text>
        </Stack>
        <ComponentExamples component="JSONTreeView" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default JSONTreeView;
