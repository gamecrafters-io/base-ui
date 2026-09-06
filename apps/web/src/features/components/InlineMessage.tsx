import { LockClosedRegular, RocketRegular } from "@gamecrafters/base-ui-icons";
import {
    Heading,
    InlineMessage as InlineMessageComponent,
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
    // Holds the message to a width a line of it has to break within, since what those examples are
    // about is where a second line begins
    narrow: "max-w-[30ch]",
};

// What the examples have to have in hand before they can be drawn
const narrowSetup = `const narrow = "max-w-[30ch]";`;

// The plainest message there is: what it has to say, and nothing said with a prop. It carries no
// variant, so it is only telling the reader something rather than saying how anything stands, and
// it is left in the ordinary text colour with a mark to match.
//
// The page and the component it is about are both called InlineMessage, so the component is brought
// in under a name saying which of the two it is. The listing beneath says InlineMessage, as an
// application importing it would
const defaultPreview = (
    <InlineMessageComponent>
        Only the owner of the repository can change this
    </InlineMessageComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<InlineMessage>Only the owner of the repository can change this</InlineMessage>`;

// What the message says of how something stands. The four are drawn together rather than one to an
// example, since what each of them says is read against the others, and each is named for the
// variant it was given.
//
// The colour and the mark say the same thing twice over, and neither is read out: it is the wording
// that carries the message, which is what keeps it legible to a reader who sees neither
const variantsPreview = (
    <Stack gap="normal">
        <InlineMessageComponent variant="critical">critical</InlineMessageComponent>
        <InlineMessageComponent variant="warning">warning</InlineMessageComponent>
        <InlineMessageComponent variant="success">success</InlineMessageComponent>
        <InlineMessageComponent variant="unavailable">unavailable</InlineMessageComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the four read one under another
const variantsCode = `<Stack gap="normal">
    <InlineMessage variant="critical">critical</InlineMessage>
    <InlineMessage variant="warning">warning</InlineMessage>
    <InlineMessage variant="success">success</InlineMessage>
    <InlineMessage variant="unavailable">unavailable</InlineMessage>
</Stack>`;

// How large the message is set. It is chosen to match the text it stands beside rather than to make
// the message louder or quieter, since what says how loud it is is the variant. The mark is sized
// with the words, so it stays the height of the line it stands against
const sizesPreview = (
    <Stack gap="normal">
        <InlineMessageComponent variant="success" size="small">
            small
        </InlineMessageComponent>
        <InlineMessageComponent variant="success" size="medium">
            medium
        </InlineMessageComponent>
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    <InlineMessage variant="success" size="small">
        small
    </InlineMessage>
    <InlineMessage variant="success" size="medium">
        medium
    </InlineMessage>
</Stack>`;

// A mark of the caller's own in place of the one the variant carries, for a message whose subject
// has a mark a reader already knows it by. It is given either as the component to draw or as
// something already built, and the colour still comes from the variant
const customVisualPreview = (
    <Stack gap="normal">
        <InlineMessageComponent variant="unavailable" leadingVisual={LockClosedRegular}>
            This repository is private
        </InlineMessageComponent>
        <InlineMessageComponent variant="success" leadingVisual={<RocketRegular />}>
            The deploy has finished
        </InlineMessageComponent>
    </Stack>
);

const customVisualCode = `<Stack gap="normal">
    <InlineMessage variant="unavailable" leadingVisual={LockClosedRegular}>
        This repository is private
    </InlineMessage>
    <InlineMessage variant="success" leadingVisual={<RocketRegular />}>
        The deploy has finished
    </InlineMessage>
</Stack>`;

// A message longer than the room it was given. The mark stands in a column of its own, so the
// second line begins where the first did rather than running back under the mark
const multilinePreview = (
    <div className={classes.narrow}>
        <InlineMessageComponent variant="success">
            An example inline message that runs on for long enough to take more than one line
        </InlineMessageComponent>
    </div>
);

const multilineCode = `<div className={narrow}>
    <InlineMessage variant="success">
        An example inline message that runs on for long enough to take more than one line
    </InlineMessage>
</div>`;

// Where a message of this kind is most often read: under the one thing it is about, saying what
// will come of changing it. It is set at the small size to match the line above it, since what says
// how much the message matters is the variant rather than how large it is
const besideAFieldPreview = (
    <Stack gap="condensed" className={classes.narrow}>
        <Text weight="semibold">Repository name</Text>
        <Text size="small">base-ui</Text>
        <InlineMessageComponent variant="warning" size="small">
            Renaming the repository takes every link to it with it
        </InlineMessageComponent>
    </Stack>
);

const besideAFieldCode = `<Stack gap="condensed" className={narrow}>
    <Text weight="semibold">Repository name</Text>
    <Text size="small">base-ui</Text>
    <InlineMessage variant="warning" size="small">
        Renaming the repository takes every link to it with it
    </InlineMessage>
</Stack>`;

// The message as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what it says of how something stands, then how large it is set, then what is
// put in place of its mark, and last where it is actually read
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "What the message has to say, with nothing said about how it stands. A message with no variant is only telling the reader something rather than reporting on anything, so it is left in the ordinary text colour with a mark to match.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "What the message says of how something stands. The colour and the mark say the same thing twice over and neither is read out, so it is the wording that carries the message, which is what keeps it legible to a reader who sees neither.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Sizes",
        description:
            "How large the message is set. It is chosen to match the text it stands beside rather than to make the message louder or quieter, since what says how much it matters is the variant. The mark is sized with the words, so it stays the height of the line it stands against.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "A mark of its own",
        description:
            "A mark in place of the one the variant carries, for a message whose subject has a mark a reader already knows it by. It is given either as the component to draw or as something already built, and the colour still comes from the variant.",
        preview: customVisualPreview,
        code: customVisualCode,
    },
    {
        name: "Running to more than one line",
        description:
            "A message longer than the room it was given. The mark stands in a column of its own, so the second line begins where the first did rather than running back under the mark, and the mark itself stays against the first line rather than the middle of the block.",
        setup: narrowSetup,
        preview: multilinePreview,
        code: multilineCode,
    },
    {
        name: "Beside a field",
        description:
            "Where a message of this kind is most often read: under the one thing it is about, saying what will come of changing it. This is what sets it apart from a banner, which stands over the page and speaks for the whole of it rather than for the thing beside it.",
        setup: narrowSetup,
        preview: besideAFieldPreview,
        code: besideAFieldCode,
    },
];

// What the message says of how something stands. It stands as the values themselves rather than as
// the name they are collected under, since one of them is what a caller actually hands over
const variant = '"critical" | "warning" | "success" | "unavailable"';

// How large the message is set
const size = '"small" | "medium"';

// What the mark can be given as. Either is taken, so a mark that only has to be drawn is named and
// left to the message to size, and one that has anything said to it is built first and handed over
const visual = "React.ElementType | React.ReactNode";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the message takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// What it says of how something stands comes first, since it is what the message is for, then how
// large it is set, and last what is put in place of the mark
const groups: ComponentPropGroup[] = [
    {
        name: "InlineMessage",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What the message says. It is the wording that carries it, since neither the colour nor the mark beside it is read out, and both are held together in a column of their own so that a message made of more than one thing still keeps clear of the mark",
            },
            {
                name: "variant",
                type: variant,
                options: ["critical", "warning", "success", "unavailable"],
                description:
                    "What the message says of how something stands, which settles the colour it is read in and the mark beside it. Left out, the message is only telling the reader something rather than reporting on anything, and it stays in the ordinary text colour",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                options: ["small", "medium"],
                description:
                    "How large the message is set. It is chosen to match the text it stands beside rather than to say how much the message matters, which is the variant's to say. The mark is sized with the words",
            },
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "A mark standing in place of the one the variant carries, given either as the component to draw or as something already built. The mark the message draws itself is decoration, since the wording says everything the colour and the mark say",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the message is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const InlineMessage = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                InlineMessage
            </Heading>
            <Text as="p" size="large">
                A line of text saying how one thing stands, standing beside that thing rather than
                over the page as a banner does: what will come of renaming this repository, why this
                branch cannot be merged, that the deploy has finished. It is the wording that
                carries the message — the colour it is read in and the mark beside it only say again
                what the words already say, and neither is read out, so a reader who sees neither is
                told the same thing. The mark stands in a column of its own, so a message running to
                a second line begins that line where the first began rather than running back
                underneath it.
            </Text>
        </Stack>
        <ComponentExamples component="InlineMessage" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default InlineMessage;
