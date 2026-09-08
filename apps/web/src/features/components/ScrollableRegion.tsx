import {
    Heading,
    ScrollableRegion as ScrollableRegionComponent,
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
    // The region draws nothing of its own but the scrolling, so it is given bounds and an edge.
    // Without bounds there is nothing for the content to run past, and without an edge there is
    // nothing saying where the box begins and leaves off, which would leave the content reading as
    // the page's rather than as the box's. It is part of what the example is showing rather than
    // the page's own furniture, so it is written out with the listing
    region: "max-w-[20rem] max-h-[6rem] p-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default",
    // A line told not to wrap, so it runs past the width of the box rather than down it
    nowrap: "whitespace-nowrap",
};

// What every example has to have in hand before it can be drawn. The box is written once and
// reached for by each of them, since what changes between the examples is what is put in it rather
// than the bounds it is held to
const setup = `const region =
    "max-w-[20rem] max-h-[6rem] p-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default";`;

const nowrapSetup = `${setup}

const nowrap = "whitespace-nowrap";`;

// The plainest use there is: more lines than the box has room for, so it scrolls down. The name is
// given outright, since a box that has become a landmark has to be called something for a reader
// arriving at it to know what they have arrived in.
//
// The page and the component it is about are both called ScrollableRegion, so the component is
// brought in under a name saying which of the two it is. The listing beneath says ScrollableRegion,
// as an application importing it would
const defaultPreview = (
    <ScrollableRegionComponent aria-label="Release notes" className={classes.region}>
        <Text as="p">Autocomplete no longer reopens after a value is picked.</Text>
        <Text as="p">Dialog returns focus to whatever opened it.</Text>
        <Text as="p">Tooltip stays put while the pointer crosses it.</Text>
        <Text as="p">DataTable keeps its sort as the page is changed.</Text>
        <Text as="p">Token can be removed from the keyboard.</Text>
        <Text as="p">Banner reports itself once rather than on every render.</Text>
    </ScrollableRegionComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<ScrollableRegion aria-label="Release notes" className={region}>
    <Text as="p">Autocomplete no longer reopens after a value is picked.</Text>
    <Text as="p">Dialog returns focus to whatever opened it.</Text>
    <Text as="p">Tooltip stays put while the pointer crosses it.</Text>
    <Text as="p">DataTable keeps its sort as the page is changed.</Text>
    <Text as="p">Token can be removed from the keyboard.</Text>
    <Text as="p">Banner reports itself once rather than on every render.</Text>
</ScrollableRegion>`;

// A line that will not wrap, so what runs past the box runs past its width rather than its height.
// The region is told nothing about which way it scrolls — it answers whichever axis the content
// overflows on, and both at once where it overflows on both
const horizontalPreview = (
    <ScrollableRegionComponent aria-label="Command output" className={classes.region}>
        <Text as="p" className={classes.nowrap}>
            $ npm run build — built 142.31 kB of JavaScript and 18.04 kB of CSS in 1.62s
        </Text>
    </ScrollableRegionComponent>
);

const horizontalCode = `<ScrollableRegion aria-label="Command output" className={region}>
    <Text as="p" className={nowrap}>
        $ npm run build — built 142.31 kB of JavaScript and 18.04 kB of CSS in 1.62s
    </Text>
</ScrollableRegion>`;

// The same box holding less than it has room for. Nothing about it is a region: no role, no name
// read out, and no tab stop, so a reader moving by keyboard goes straight past it rather than
// landing in a box there is no moving within
const fitsPreview = (
    <ScrollableRegionComponent aria-label="Release notes" className={classes.region}>
        <Text as="p">Autocomplete no longer reopens after a value is picked.</Text>
    </ScrollableRegionComponent>
);

const fitsCode = `<ScrollableRegion aria-label="Release notes" className={region}>
    <Text as="p">Autocomplete no longer reopens after a value is picked.</Text>
</ScrollableRegion>`;

// The box named by the words already standing over it rather than by a name of its own. The
// heading is pointed at by id, since it stands outside the box rather than in it
const labelledByPreview = (
    <Stack gap="condensed" align="start">
        <Heading as="h4" id="release-notes-heading" size="small">
            Release notes
        </Heading>
        <ScrollableRegionComponent
            aria-labelledby="release-notes-heading"
            className={classes.region}
        >
            <Text as="p">Autocomplete no longer reopens after a value is picked.</Text>
            <Text as="p">Dialog returns focus to whatever opened it.</Text>
            <Text as="p">Tooltip stays put while the pointer crosses it.</Text>
            <Text as="p">DataTable keeps its sort as the page is changed.</Text>
            <Text as="p">Token can be removed from the keyboard.</Text>
            <Text as="p">Banner reports itself once rather than on every render.</Text>
        </ScrollableRegionComponent>
    </Stack>
);

const labelledByCode = `<Stack gap="condensed" align="start">
    <Heading as="h4" id="release-notes-heading" size="small">
        Release notes
    </Heading>
    <ScrollableRegion aria-labelledby="release-notes-heading" className={region}>
        <Text as="p">Autocomplete no longer reopens after a value is picked.</Text>
        <Text as="p">Dialog returns focus to whatever opened it.</Text>
        <Text as="p">Tooltip stays put while the pointer crosses it.</Text>
        <Text as="p">DataTable keeps its sort as the page is changed.</Text>
        <Text as="p">Token can be removed from the keyboard.</Text>
        <Text as="p">Banner reports itself once rather than on every render.</Text>
    </ScrollableRegion>
</Stack>`;

// The region drawn as the element the content was already going to be in, rather than as a box
// around it. Command output is preformatted text, which does not wrap and so runs past the width
// of whatever holds it; drawing the region as the pre itself leaves one box where there would
// otherwise be two, and the one that scrolls is the one the content is in
const asPreview = (
    <ScrollableRegionComponent as="pre" aria-label="Command output" className={classes.region}>
        $ npm run build — built 142.31 kB of JavaScript and 18.04 kB of CSS in 1.62s
    </ScrollableRegionComponent>
);

const asCode = `<ScrollableRegion as="pre" aria-label="Command output" className={region}>
    $ npm run build — built 142.31 kB of JavaScript and 18.04 kB of CSS in 1.62s
</ScrollableRegion>`;

// The region as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then the other axis it answers, then what it comes to where there is nothing to
// scroll, and last how it is named and what it is drawn as
const examples: ComponentExample[] = [
    {
        name: "Down the page",
        description:
            "More lines than the box has room for. The region draws nothing of its own beyond the scrolling, so the bounds are the caller's to set — a box left to grow never overflows, and a region that never overflows is only a box. Once it does overflow it becomes a landmark, takes a place in the tab order, and can be scrolled with the arrow keys from there.",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Across the page",
        description:
            "A line that will not wrap, so what runs past the box runs past its width rather than its height. The region is told nothing about which way it scrolls: it answers whichever axis the content overflows on, and both at once where it overflows on both.",
        setup: nowrapSetup,
        preview: horizontalPreview,
        code: horizontalCode,
    },
    {
        name: "Where there is nothing to scroll",
        description:
            "The same box holding less than it has room for. None of what the region adds is there: no role, no name read out, and no tab stop, so a reader moving by keyboard goes straight past it rather than landing in a box there is no moving within. Whether it overflows is watched rather than settled once, so a box that comes to overflow — as the window narrows, or as more is put in it — becomes a region at that moment without being drawn again.",
        setup,
        preview: fitsPreview,
        code: fitsCode,
    },
    {
        name: "Named from the page",
        description:
            "The box named by the words already standing over it, in place of a name of its own. Exactly one of the two has to be given: a landmark with no name is one a reader arrives in without being told what they have arrived in, and two names would leave it a matter of which the reader is read.",
        setup,
        preview: labelledByPreview,
        code: labelledByCode,
    },
    {
        name: "Drawn as something else",
        description:
            "The region drawn as the element the content was already going to be in, rather than as a box around it. Command output is preformatted text, which does not wrap and so runs past the width of whatever holds it; drawing the region as the pre itself leaves one box where there would otherwise be two, and the one that scrolls is the one the content is in.",
        setup,
        preview: asPreview,
        code: asCode,
    },
];

// Every prop the region takes. It has no parts of its own: what it draws is the box and whatever
// was put in it, and the region it becomes is the same box answering to more rather than anything
// drawn beside it.
//
// How it is named comes first, since that is the whole of what it has to be told, and what it is
// drawn as follows
const groups: ComponentPropGroup[] = [
    {
        name: "ScrollableRegion",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the box in words, where there are none on the page to point at. Exactly one of this and aria-labelledby has to be given, and the two are refused together. It is only read out once the content overflows, since only then is there a landmark for it to name",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the box by whatever on the page already says what it holds, in place of aria-label",
            },
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description:
                    "The element or component the box is drawn as, in place of its default. It is what lets the thing that scrolls be the thing the content was already in — a pre holding command output, a table holding rows too wide for the page — rather than a box drawn around it",
            },
            {
                name: "className",
                type: "string",
                description:
                    "Class name for custom styling. It is where the bounds are given: the region sets the scrolling and nothing else, so without a height or a width of the caller's own there is nothing for the content to run past",
            },
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "It is an ordinary element underneath, so it takes what one takes: children, id, style, onScroll, and the rest. Where it has been drawn as something else it takes that element's props instead. The role and the tab stop are the region's own and are added only once the content overflows",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the region is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const ScrollableRegion = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ScrollableRegion
            </Heading>
            <Text as="p" size="large">
                A box that scrolls, and that says so once there is something to scroll. What it
                draws is the scrolling and nothing else — the bounds are the caller&apos;s to set,
                since content with room to grow into never runs past anything. Once it does run
                past, the box becomes a named landmark and takes a place in the tab order, so a
                reader moving by keyboard can reach it and move within it with the arrow keys. Until
                then it is a plain box: no role, no name read out, and no tab stop, so nobody is
                sent into a region there is no moving within. Which of the two it is is watched
                rather than settled once, so a box that comes to overflow as the page is resized
                becomes reachable at that moment.
            </Text>
        </Stack>
        <ComponentExamples component="ScrollableRegion" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default ScrollableRegion;
