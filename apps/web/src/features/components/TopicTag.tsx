import { Heading, Stack, Text, TopicTag as TopicTagComponent } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A group is held to a column narrow enough for the tags in it to run out of room, since what
    // is being shown is what a group does when they do
    group: "w-full max-w-[20rem]",
};

// What the tags on this page are naming. They are written once and read out into a tag apiece,
// since topics are come by as a list rather than typed out one tag at a time
const topics = [
    "react",
    "nodejs",
    "javascript",
    "typescript",
    "design-systems",
    "accessibility",
    "documentation",
    "tooling",
];

// What the examples that read off the list have to have in hand before they can be drawn. It is
// written once and reached for by each of them
const topicsSetup = `const topics = [
    "react",
    "nodejs",
    "javascript",
    "typescript",
    "design-systems",
    "accessibility",
    "documentation",
    "tooling",
];`;

// The plainest tag there is: the topic it names, and where it leads. It is an anchor unless it is
// told to be something else, since a topic is nearly always somewhere to go.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the tag alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a pill the width of the page.
//
// The page and the component it is about are both called TopicTag, so the component is brought in
// under a name saying which of the two it is. The listing beneath says TopicTag, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <TopicTagComponent href="/topics/react">react</TopicTagComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<TopicTag href="/topics/react">react</TopicTag>`;

// Several of them together, which is how topics are nearly always met. The group runs them onto as
// many lines as they need, with more room between the lines than between the tags on one, so a run
// of them reads as lines of tags rather than as a block of words
const groupPreview = (
    <Stack className={classes.group}>
        <TopicTagComponent.Group>
            {topics.map((topic) => (
                <TopicTagComponent key={topic} href={`/topics/${topic}`}>
                    {topic}
                </TopicTagComponent>
            ))}
        </TopicTagComponent.Group>
    </Stack>
);

const groupCode = `<TopicTag.Group>
    {topics.map((topic) => (
        <TopicTag key={topic} href={\`/topics/\${topic}\`}>
            {topic}
        </TopicTag>
    ))}
</TopicTag.Group>`;

// The same run drawn as a list, for a set of topics that is being read as one thing rather than as
// tags that happen to stand together. The group is drawn as the list and each tag is put in an item
// of its own, and the list is named, since a list a reader is told the length of should say what it
// is a list of
const listPreview = (
    <Stack className={classes.group}>
        <TopicTagComponent.Group as="ul" aria-label="Topics">
            {topics.map((topic) => (
                <li key={topic}>
                    <TopicTagComponent href={`/topics/${topic}`}>{topic}</TopicTagComponent>
                </li>
            ))}
        </TopicTagComponent.Group>
    </Stack>
);

const listCode = `<TopicTag.Group as="ul" aria-label="Topics">
    {topics.map((topic) => (
        <li key={topic}>
            <TopicTag href={\`/topics/\${topic}\`}>{topic}</TopicTag>
        </li>
    ))}
</TopicTag.Group>`;

// The three things a tag is drawn as, read side by side. They are drawn the same and answer the
// pointer differently, which is the whole of what the choice settles
const elementsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <TopicTagComponent href="/topics/react">react</TopicTagComponent>
        <TopicTagComponent as="button">nodejs</TopicTagComponent>
        <TopicTagComponent as="span">typescript</TopicTagComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read beside one another, so it is written out with them
const elementsCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <TopicTag href="/topics/react">react</TopicTag>
    <TopicTag as="button">nodejs</TopicTag>
    <TopicTag as="span">typescript</TopicTag>
</Stack>`;

// The tag as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then the run of them a reader nearly always meets, then that run read as a list, and last
// what a tag can be drawn as
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A topic something is filed under, leading to everything else filed under the same one. It is drawn as an anchor unless it is told to be something else, since a topic is nearly always somewhere to go rather than something to read, and it is tinted in the accent colours and fills in under the pointer to say so.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A group of them",
        description:
            "Several tags together, which is how topics are nearly always met: one on its own is rare enough that the group is the shape to reach for. It runs them onto as many lines as they need, with more room between the lines than between the tags on one, so a run of them reads as lines of tags rather than as a block of words.",
        setup: topicsSetup,
        preview: groupPreview,
        code: groupCode,
    },
    {
        name: "A list of topics",
        description:
            "The same run drawn as a list, for a set of topics being read as one thing rather than as tags that happen to stand together. The group is drawn as the list and each tag is put in an item of its own, so a screen reader is told how many topics there are before it reads them — and the list is named, since one a reader is told the length of should say what it is a list of.",
        setup: topicsSetup,
        preview: listPreview,
        code: listCode,
    },
    {
        name: "What the tag is drawn as",
        description:
            "An anchor leads to the topic, a button applies or clears it where the tags are what a list is being narrowed by, and a span only shows it. All three are drawn the same; what changes is whether the tag answers the pointer — only the two that can actually be pressed take the pointer's cursor and hold their words back from being selected, so a tag that leads nowhere does not look as though it does.",
        preview: elementsPreview,
        code: elementsCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the tag and its group take, under the one that takes it. Neither carries much of its
// own: what a tag is is settled by what it is drawn as, and everything else on it belongs to that
// element rather than to the library
const groups: ComponentPropGroup[] = [
    {
        name: "TopicTag",
        props: [
            {
                name: "as",
                type: "React.ElementType",
                default: '"a"',
                description:
                    "The element or component this is drawn as, in place of its default. An anchor leads to the topic, a button applies or clears it, and a span only shows it. All three are drawn the same, but only an anchor and a button take the pointer's cursor and hold their words back from being selected, so a tag that leads nowhere does not look as though it does",
            },
            styling,
        ],
    },
    {
        name: "TopicTag.Group",
        props: [
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description:
                    "The element or component the group is drawn as. A list is worth reaching for where the topics are read as one thing, since a screen reader then says how many there are before it reads them — the tags go in items of their own, and the list is worth naming",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the tag is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const TopicTag = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                TopicTag
            </Heading>
            <Text as="p" size="large">
                A pill naming a topic something is filed under, leading to everything else filed
                under the same one. It is tinted in the accent colours and fills in under the
                pointer, since a topic is nearly always somewhere to go rather than something to
                read — which is why it is drawn as an anchor unless it is told to be something else.
                Where Label says what something is and Token stands for a thing that was picked, a
                topic tag is a way through to the rest of what shares it.
            </Text>
            <Text as="p" size="large">
                Topics are nearly always met several at a time, so the shape to reach for is
                TopicTag.Group, which runs them onto as many lines as they need with more room
                between the lines than between the tags on one. Drawn as a list it carries list
                semantics with it, which is worth doing wherever the set is read as one thing.
            </Text>
        </Stack>
        <ComponentExamples component="TopicTag" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default TopicTag;
