import { Heading, Markdown as MarkdownComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // What the markdown is read across. The component takes whatever width it is put in, and a
    // line of prose run the width of a card is a line nobody finishes, so every example is given
    // the same measure the page holds itself to
    measure: "max-w-[46rem]",
};

// Everything the examples are drawn from, written as the markdown it is rather than as one line
// with its breaks escaped, since what a reader is looking at here is the writing itself
const releaseNotes = `# Release notes

This release is mostly housekeeping. **Nothing here changes an API**, and the
one thing that moved is written up below.

## What changed

- Faster first paint
- Fewer bytes shipped
- A quieter \`console\`

> The best release is the one nobody notices.

Read the [full changelog](https://example.com) for the rest.`;

const headings = `# Level one

## Level two

### Level three

#### Level four

##### Level five

###### Level six`;

const marks = `Words can be **bold**, *italic*, ~~struck through~~, ==picked out== or
written as \`code\`.`;

const lists = `- Faster first paint
- Fewer bytes shipped

1. Read it
2. Write it
3. Read it again

- [x] Shipped
- [ ] Written up`;

const listing = `Call it like this:

\`\`\`
const editor = createEditor();
editor.update(() => {});
\`\`\``;

const lines = `Roses are red
Violets are blue`;

const unread = `# Not a heading

Nor is this **bold**.`;

// The measure every example is read across, written out as the examples are handed it
const measureSetup = `const measure = "max-w-[46rem]";`;

// The markdown as a listing would hold it. A backtick inside it would close the template literal it
// is being set down in, so each one is marked as the character it is.
//
// It is worked out from the same string the example is drawn from rather than written out beside
// it: the two are the same words, and a page holding them twice would have them drift
const asSource = (markdown: string) => `const source = \`${markdown.replace(/`/g, "\\`")}\`;`;

// The same, for markdown holding a fence. A fence is three backticks, and a template literal
// holding one would have to mark every one of them, which leaves the listing harder to read than
// the writing it stands for. Written as a quoted string instead, a backtick is only a character
const asQuotedSource = (markdown: string) => `const source = ${JSON.stringify(markdown)};`;

// What an example has to have in hand: the measure it is read across, and the markdown itself
const setupFor = (markdown: string) => `${measureSetup}

${asSource(markdown)}`;

const listingSetup = `${measureSetup}

${asQuotedSource(listing)}`;

// The markdown one string, the prose it stands for on the page, and nothing between them. What is
// drawn is the writing itself rather than a frame around it: no border, no focus ring and nothing
// to write in.
//
// The page and the component it is about are both called Markdown, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Markdown, as an application
// importing it would
const defaultPreview = (
    <MarkdownComponent className={classes.measure}>{releaseNotes}</MarkdownComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so what stands here is the one line the markdown is handed over in
const defaultCode = `<Markdown className={measure}>{source}</Markdown>`;

// Every listing on the page is the same line, since what changes between the examples is the
// markdown above it rather than the way it is handed over
const sourceCode = defaultCode;

// The six levels markdown has. They run from a title down to the size of the prose itself, and by
// the fifth there is no size left to be larger by, so what sets the sixth apart is its colour
const headingsPreview = (
    <MarkdownComponent className={classes.measure}>{headings}</MarkdownComponent>
);

// The marks laid over a run of words rather than the blocks they stand in
const marksPreview = <MarkdownComponent className={classes.measure}>{marks}</MarkdownComponent>;

// The three kinds of list markdown has, one after another. A task carries its own mark rather than
// the list's, and says whether it is done without being something to tick
const listsPreview = <MarkdownComponent className={classes.measure}>{lists}</MarkdownComponent>;

// A fenced listing, drawn plainly as the preformatted run it is
const listingPreview = <MarkdownComponent className={classes.measure}>{listing}</MarkdownComponent>;

// The same two lines read both ways, so that what the prop does is read off the pair rather than
// taken on trust
const linesPreview = (
    <Stack gap="normal" className={classes.measure}>
        <Stack gap="condensed">
            <Text size="small" weight="semibold">
                Joined, the way markdown reads it
            </Text>
            <MarkdownComponent>{lines}</MarkdownComponent>
        </Stack>
        <Stack gap="condensed">
            <Text size="small" weight="semibold">
                Kept as written
            </Text>
            <MarkdownComponent preserveNewLines>{lines}</MarkdownComponent>
        </Stack>
    </Stack>
);

const linesCode = `<Stack gap="normal" className={measure}>
    <Stack gap="condensed">
        <Text size="small" weight="semibold">
            Joined, the way markdown reads it
        </Text>
        <Markdown>{source}</Markdown>
    </Stack>
    <Stack gap="condensed">
        <Text size="small" weight="semibold">
            Kept as written
        </Text>
        <Markdown preserveNewLines>{source}</Markdown>
    </Stack>
</Stack>`;

// Markdown handed no syntax to look for, which is the plainest case of being handed less than the
// component reads by default: nothing is read as syntax, and the writing stands as the characters
// it was typed with
const unreadPreview = (
    <MarkdownComponent className={classes.measure} transformers={[]}>
        {unread}
    </MarkdownComponent>
);

const unreadCode = `<Markdown className={measure} transformers={[]}>
    {source}
</Markdown>`;

// The component as it is reached for, drawn and written out one above the other. A whole piece of
// writing comes first, since that is what it is for, and the syntax it is made of follows one kind
// at a time; what can be said about the reading itself comes last
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A whole piece of writing, read into the prose it stands for. This is content on a page rather than a field on a form, so it carries no frame, no focus ring and nothing to write in: what is drawn is left as ordinary content for a reader to move through the way they would any other. It takes whatever width it is put in, so it is given a measure here rather than run the width of the card.",
        setup: setupFor(releaseNotes),
        preview: defaultPreview,
        code: sourceCode,
    },
    {
        name: "Headings",
        description:
            "At each of the six levels markdown has. They run from a title down to the size of the prose itself, and by the fifth there is no size left to be larger by — what sets the sixth apart from it is its colour. Every heading is given more room above it than an ordinary block, since what parts one section from the next is the space before its title rather than after it; the first keeps the ordinary spacing, having nothing above it to be parted from.",
        setup: setupFor(headings),
        preview: headingsPreview,
        code: sourceCode,
    },
    {
        name: "The marks laid over a run of words",
        description:
            "Bold, italic, struck through, picked out, and a name written in code. These are laid over the words rather than standing as blocks of their own, so several of them can fall on the same line and a run carrying one is still part of the sentence around it.",
        setup: setupFor(marks),
        preview: marksPreview,
        code: sourceCode,
    },
    {
        name: "Lists",
        description:
            "The three markdown has: bulleted, numbered, and the task list where each item says whether it is done. A task carries its own mark rather than the list's, and is left out of the tab order, since there is nothing here to tick — it says what was done rather than asking. Items sit closer together than the blocks around them, since a list is read as one thing rather than as a run of them.",
        setup: setupFor(lists),
        preview: listsPreview,
        code: sourceCode,
    },
    {
        name: "A fenced listing",
        description:
            "Drawn plainly, as the preformatted run it is: a ground of its own, a monospaced face, and the line breaks and indentation kept as they were written. A line too long for the room runs on rather than being cut off. A listing that is to be read under a grammar, with its runs coloured, is the CodeBlock component instead.",
        setup: listingSetup,
        preview: listingPreview,
        code: sourceCode,
    },
    {
        name: "Keeping every line break",
        description:
            "Two lines, read both ways. Left to itself, the pair is read as one paragraph with a break inside it; asked to keep every line break, each line is read as a paragraph of its own. Either way they stand one above the other — what changes is the block they belong to, and so the room between them, which is what writing laid out as it was meant to be read wants said.",
        setup: setupFor(lines),
        preview: linesPreview,
        code: linesCode,
    },
    {
        name: "Reading none of the syntax",
        description:
            "Which syntax is looked for is the caller's to settle, and handing over none of it is the plainest case: nothing is read as syntax, and the writing stands as the characters it was typed with. The same prop is what a caller reaches for to have syntax of their own read, or to have less of it read than the component reads by default.",
        setup: setupFor(unread),
        preview: unreadPreview,
        code: unreadCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the component takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// The markdown comes first, since it is the whole of what the component is for, and what can be
// said about how it is read follows
const groups: ComponentPropGroup[] = [
    {
        name: "Markdown",
        props: [
            {
                name: "children",
                type: "string",
                description:
                    "The markdown itself, as one string. It is read again whenever it changes, and reading it clears what was drawn before, so nothing of the last reading is left behind. Given nothing, nothing is drawn",
            },
            {
                name: "preserveNewLines",
                type: "boolean",
                default: "false",
                description:
                    "Reads every line break as the start of a paragraph of its own. Left out, lines written one under another are read as a single paragraph carrying a break inside it, so they still stand one above the other and only the room between them differs",
            },
            {
                name: "transformers",
                type: "Transformer[]",
                default: "MARKDOWN_TRANSFORMERS",
                description:
                    "Which syntax is looked for, and in what order. What is left out is read as the words it was written with rather than as syntax. It is only worth passing where a caller has syntax of their own to add, or wants less of it read than the component reads by default; the default is exported beside the component, and the groups a smaller set is put together from are @lexical/markdown's own",
            },
            {
                name: "namespace",
                type: "string",
                default: '"Markdown"',
                description:
                    "Tells one editor's clipboard from another's. There is nothing here to copy out as nodes, so it is only worth setting to tell two of these apart while debugging",
            },
            {
                name: "onError",
                type: "(error: Error, editor: LexicalEditor) => void",
                description:
                    "Called where Lexical could not read the markdown. It throws by default, since markdown that has quietly failed to be read looks the same as markdown that was empty, and a boundary above is better placed to say which of the two it was",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the component is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Markdown = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Markdown
            </Heading>
            <Text as="p" size="large">
                Markdown drawn as the prose it stands for. Lexical reads it into the same kinds of
                writing the rich text editor holds, and the same reconciler draws them, so what is
                written in an editor and what is read out of a file are drawn as one thing rather
                than two that have drifted apart. What is different is what it is for: this is
                content on a page rather than a field on a form, so it carries no frame, no focus
                ring and nothing to write in — only the prose, left as ordinary content for a reader
                to move through the way they would any other. A fenced listing is drawn plainly, as
                the preformatted run it is; one that is to be read under a grammar, with its runs
                coloured, is the CodeBlock component instead. What it reads by default, the kinds of
                writing it reads into and the classes it hangs on them are exported beside it, as
                MARKDOWN_TRANSFORMERS, MARKDOWN_NODES and markdownTheme.
            </Text>
        </Stack>
        <ComponentExamples component="Markdown" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Markdown;
