import * as React from "react";
import {
    Heading,
    PageLayout as PageLayoutComponent,
    Placeholder,
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

// The whole of a page: the row across the top, the body of it with a pane beside it, and the row
// along the foot. Nothing is said with a prop, so the page runs to the widest container it has, the
// pane stands at the end, and no region is divided from the next.
//
// The content is drawn as a plain box rather than as the page's main region. A page has one of
// those and on this page it is the documentation around the examples; an application reaching for
// this would leave the default alone.
//
// The page and the component it is about are both called PageLayout, so the component is brought in
// under a name saying which of the two it is. The listing beneath says PageLayout, as an
// application importing it would
const defaultPreview = (
    <PageLayoutComponent>
        <PageLayoutComponent.Header>
            <Placeholder height="64px" label="Header" />
        </PageLayoutComponent.Header>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="240px" label="Content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Pane>
            <Placeholder height="160px" label="Pane" />
        </PageLayoutComponent.Pane>
        <PageLayoutComponent.Footer>
            <Placeholder height="64px" label="Footer" />
        </PageLayoutComponent.Footer>
    </PageLayoutComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<PageLayout>
    <PageLayout.Header>
        <Placeholder height="64px" label="Header" />
    </PageLayout.Header>
    <PageLayout.Content as="div">
        <Placeholder height="240px" label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane>
        <Placeholder height="160px" label="Pane" />
    </PageLayout.Pane>
    <PageLayout.Footer>
        <Placeholder height="64px" label="Footer" />
    </PageLayout.Footer>
</PageLayout>`;

// What sets one region apart from the next. A line is a hairline rule; a filled divider is a band
// of inset colour, which only reads well across the page rather than down it, so it is asked for
// on the narrow range where the pane has stacked under the content
const dividersPreview = (
    <PageLayoutComponent>
        <PageLayoutComponent.Header divider="line">
            <Placeholder height="64px" label="Header with a line" />
        </PageLayoutComponent.Header>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="240px" label="Content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Pane divider="line">
            <Placeholder height="160px" label="Pane with a line" />
        </PageLayoutComponent.Pane>
        <PageLayoutComponent.Footer divider={{ narrow: "filled", regular: "line" }}>
            <Placeholder height="64px" label="Footer, filled when narrow" />
        </PageLayoutComponent.Footer>
    </PageLayoutComponent>
);

const dividersCode = `<PageLayout>
    <PageLayout.Header divider="line">
        <Placeholder height="64px" label="Header with a line" />
    </PageLayout.Header>
    <PageLayout.Content as="div">
        <Placeholder height="240px" label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane divider="line">
        <Placeholder height="160px" label="Pane with a line" />
    </PageLayout.Pane>
    <PageLayout.Footer divider={{ narrow: "filled", regular: "line" }}>
        <Placeholder height="64px" label="Footer, filled when narrow" />
    </PageLayout.Footer>
</PageLayout>`;

// Which side of the content the pane stands on. It is written after the content either way: where
// each region stands is settled by the layout rather than by the order they were written in
const positionPreview = (
    <PageLayoutComponent>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="240px" label="Content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Pane position="start" divider="line">
            <Placeholder height="160px" label="Pane at the start" />
        </PageLayoutComponent.Pane>
    </PageLayoutComponent>
);

const positionCode = `<PageLayout>
    <PageLayout.Content as="div">
        <Placeholder height="240px" label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane position="start" divider="line">
        <Placeholder height="160px" label="Pane at the start" />
    </PageLayout.Pane>
</PageLayout>`;

// A pane the reader can drag or key wider and narrower. The line it is taken hold of is drawn
// whether or not a divider was asked for, since a pane that can be resized has to show the reader
// where to take hold
const resizablePreview = (
    <PageLayoutComponent>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="240px" label="Content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Pane resizable widthStorageKey="filesPaneWidth" aria-label="Files">
            <Placeholder height="160px" label="Drag the line beside this pane" />
        </PageLayoutComponent.Pane>
    </PageLayoutComponent>
);

const resizableCode = `<PageLayout>
    <PageLayout.Content as="div">
        <Placeholder height="240px" label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane resizable widthStorageKey="filesPaneWidth" aria-label="Files">
        <Placeholder height="160px" label="Drag the line beside this pane" />
    </PageLayout.Pane>
</PageLayout>`;

// Bounds of the caller's own in place of a step of the width scale. The pane opens at the middle
// one and is held between the other two, and a double press of the handle puts it back
const customWidthPreview = (
    <PageLayoutComponent>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="240px" label="Content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Pane
            resizable
            width={{ min: "200px", default: "280px", max: "480px" }}
            widthStorageKey="detailsPaneWidth"
            aria-label="Details"
        >
            <Placeholder height="160px" label="Between 200 and 480 pixels" />
        </PageLayoutComponent.Pane>
    </PageLayoutComponent>
);

const customWidthCode = `<PageLayout>
    <PageLayout.Content as="div">
        <Placeholder height="240px" label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane
        resizable
        width={{ min: "200px", default: "280px", max: "480px" }}
        widthStorageKey="detailsPaneWidth"
        aria-label="Details"
    >
        <Placeholder height="160px" label="Between 200 and 480 pixels" />
    </PageLayout.Pane>
</PageLayout>`;

// Where the caller keeps the width rather than the pane keeping it. Given both the width and
// something to call once a drag finishes, the pane stops writing the width down for itself and
// follows what it is handed.
//
// The state is the caller's, which makes this a component of its own rather than an element the
// page holds ready
const HeldWidthPreview = () => {
    const [paneWidth, setPaneWidth] = React.useState(320);

    return (
        <PageLayoutComponent>
            <PageLayoutComponent.Content as="div">
                <Stack gap="normal">
                    <Text as="p">The pane is {Math.round(paneWidth)} pixels wide.</Text>
                    <Placeholder height="200px" label="Content" />
                </Stack>
            </PageLayoutComponent.Content>
            <PageLayoutComponent.Pane
                resizable
                currentWidth={paneWidth}
                onResizeEnd={setPaneWidth}
                aria-label="Files"
            >
                <Placeholder height="160px" label="Drag me" />
            </PageLayoutComponent.Pane>
        </PageLayoutComponent>
    );
};

const heldWidthCode = `const [paneWidth, setPaneWidth] = React.useState(320);

<PageLayout>
    <PageLayout.Content as="div">
        <Stack gap="normal">
            <Text as="p">The pane is {Math.round(paneWidth)} pixels wide.</Text>
            <Placeholder height="200px" label="Content" />
        </Stack>
    </PageLayout.Content>
    <PageLayout.Pane
        resizable
        currentWidth={paneWidth}
        onResizeEnd={setPaneWidth}
        aria-label="Files"
    >
        <Placeholder height="160px" label="Drag me" />
    </PageLayout.Pane>
</PageLayout>`;

// A pane that stays where it is while the content beside it scrolls past. How far down it comes to
// rest is the caller's to say, for a page with something standing over it
const stickyPreview = (
    <PageLayoutComponent>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="600px" label="A long run of content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Pane sticky divider="line">
            <Placeholder height="160px" label="Stays put" />
        </PageLayoutComponent.Pane>
    </PageLayoutComponent>
);

const stickyCode = `<PageLayout>
    <PageLayout.Content as="div">
        <Placeholder height="600px" label="A long run of content" />
    </PageLayout.Content>
    <PageLayout.Pane sticky divider="line">
        <Placeholder height="160px" label="Stays put" />
    </PageLayout.Pane>
</PageLayout>`;

// The one region that stands outside everything else the page holds. The header, the content, the
// pane and the footer are all held to the container width together; the sidebar is beside the lot
// of them rather than within it
const sidebarPreview = (
    <PageLayoutComponent>
        <PageLayoutComponent.Sidebar divider="line" aria-label="Navigation">
            <Placeholder height="320px" label="Sidebar" />
        </PageLayoutComponent.Sidebar>
        <PageLayoutComponent.Header divider="line">
            <Placeholder height="64px" label="Header" />
        </PageLayoutComponent.Header>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="180px" label="Content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Footer divider="line">
            <Placeholder height="64px" label="Footer" />
        </PageLayoutComponent.Footer>
    </PageLayoutComponent>
);

const sidebarCode = `<PageLayout>
    <PageLayout.Sidebar divider="line" aria-label="Navigation">
        <Placeholder height="320px" label="Sidebar" />
    </PageLayout.Sidebar>
    <PageLayout.Header divider="line">
        <Placeholder height="64px" label="Header" />
    </PageLayout.Header>
    <PageLayout.Content as="div">
        <Placeholder height="180px" label="Content" />
    </PageLayout.Content>
    <PageLayout.Footer divider="line">
        <Placeholder height="64px" label="Footer" />
    </PageLayout.Footer>
</PageLayout>`;

// The widest the page is allowed to run. It holds the whole of the page in from the edges of
// whatever it was put in, rather than any one region
const containerWidthPreview = (
    <PageLayoutComponent containerWidth="medium">
        <PageLayoutComponent.Header divider="line">
            <Placeholder height="64px" label="Header" />
        </PageLayoutComponent.Header>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="180px" label="Content, held to 768 pixels" />
        </PageLayoutComponent.Content>
    </PageLayoutComponent>
);

const containerWidthCode = `<PageLayout containerWidth="medium">
    <PageLayout.Header divider="line">
        <Placeholder height="64px" label="Header" />
    </PageLayout.Header>
    <PageLayout.Content as="div">
        <Placeholder height="180px" label="Content, held to 768 pixels" />
    </PageLayout.Content>
</PageLayout>`;

// How much room is left around the page and between its regions. It is named once here and handed
// down, so no region has to be told any of it
const spacingPreview = (
    <PageLayoutComponent padding="condensed" rowGap="condensed" columnGap="condensed">
        <PageLayoutComponent.Header divider="line">
            <Placeholder height="64px" label="Header" />
        </PageLayoutComponent.Header>
        <PageLayoutComponent.Content as="div">
            <Placeholder height="180px" label="Content" />
        </PageLayoutComponent.Content>
        <PageLayoutComponent.Pane divider="line">
            <Placeholder height="120px" label="Pane" />
        </PageLayoutComponent.Pane>
    </PageLayoutComponent>
);

const spacingCode = `<PageLayout padding="condensed" rowGap="condensed" columnGap="condensed">
    <PageLayout.Header divider="line">
        <Placeholder height="64px" label="Header" />
    </PageLayout.Header>
    <PageLayout.Content as="div">
        <Placeholder height="180px" label="Content" />
    </PageLayout.Content>
    <PageLayout.Pane divider="line">
        <Placeholder height="120px" label="Pane" />
    </PageLayout.Pane>
</PageLayout>`;

// The layout as it is reached for, drawn and written out one above the other. The whole page comes
// first, then what sets its regions apart and where they stand, then everything a pane can be told,
// and last the measurements the page itself is held to
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The whole of a page: the row across the top, the body of it with a pane beside it, and the row along the foot. Nothing is said with a prop, so the page runs to the widest container it has, the pane stands at the end, and no region is divided from the next. The content is drawn here as a plain box rather than as the page's main region, since a page has one of those and on this page it is the documentation around the examples — an application reaching for this would leave the default alone.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Dividers between the regions",
        description:
            "A line is a hairline rule and is what a divider usually is. A filled divider is a band of inset colour, which only reads well across the page rather than down it, so it is asked for on the narrow range alone, where the pane has stacked under the content and every divider runs across. A divider is one of the things that can be said per viewport range rather than outright.",
        preview: dividersPreview,
        code: dividersCode,
    },
    {
        name: "Where the pane stands",
        description:
            "Which side of the content the pane comes down. It is written after the content either way: where each region stands is settled by the layout rather than by the order the regions were written in, so moving a pane across is one prop rather than a rewrite. The side can be given per viewport range as well, for a pane that reads better above the content on a narrow screen than beside it.",
        preview: positionPreview,
        code: positionCode,
    },
    {
        name: "A resizable pane",
        description:
            "A pane the reader can drag wider and narrower, or move with the arrow keys once the handle has focus. The line it is taken hold of is drawn whether or not a divider was asked for, since a pane that can be resized has to show where to take hold. Left to itself the pane writes its width down and opens at it next time, under a name the caller gives — so two resizable panes in one application want two names between them.",
        preview: resizablePreview,
        code: resizableCode,
    },
    {
        name: "A pane of a custom width",
        description:
            "Bounds of the caller's own in place of a step of the width scale. The pane opens at the middle one and is held between the other two, and a double press of the handle puts it back to where it started. A named width is held to what the viewport leaves instead, so a pane in a row that does not wrap cannot push past the edge.",
        preview: customWidthPreview,
        code: customWidthCode,
    },
    {
        name: "A pane held at a width",
        description:
            "Where the caller keeps the width rather than the pane keeping it. Given both the width and something to call once a drag finishes, the pane stops writing the width down for itself and follows what it is handed, which is what a width kept somewhere other than this browser needs.",
        preview: <HeldWidthPreview />,
        code: heldWidthCode,
    },
    {
        name: "A sticky pane",
        description:
            "A pane that stays where it is while the content beside it scrolls past, for a list or a set of controls that should be within reach the whole way down. How far down it comes to rest can be said as well, for a page with something standing over it.",
        preview: stickyPreview,
        code: stickyCode,
    },
    {
        name: "A sidebar",
        description:
            "The one region that stands outside everything else the page holds. The header, the content, the pane and the footer are held to the container width together; the sidebar is beside the lot of them rather than within it, which is what makes it the shape for the navigation of a whole application rather than of one page.",
        preview: sidebarPreview,
        code: sidebarCode,
    },
    {
        name: "How wide the page runs",
        description:
            "The widest the page is allowed to be. It holds the whole of the page in from the edges of whatever it was put in rather than any one region, so the header, the content and the footer all end at the same place. A region can be held narrower still on its own, for a column of prose inside a page that is otherwise wide.",
        preview: containerWidthPreview,
        code: containerWidthCode,
    },
    {
        name: "How much room is left",
        description:
            "The room outside the page and between its regions, named once here and handed down, so no region has to be told any of it. The three are separate because a page often wants the same room down its sides as between its rows but not the same as between its columns.",
        preview: spacingPreview,
        code: spacingCode,
    },
];

// How much room is left around and between the regions of the page
const spacing = '"none" | "condensed" | "normal"';

// The widest a page, or a region within it, is allowed to run
const width = '"full" | "medium" | "large" | "xlarge"';

// Which side of the content a region stands on
const position = '"start" | "end"';

// What sets one region apart from the next. It is written as a plain value or as one per viewport
// range, since a filled divider only reads well across the page rather than down it
const divider = '"none" | "line" | ResponsiveValue<"none" | "line", PageLayoutDividerVariant>';

// A step of the width scale, or bounds of the caller's own
const paneWidth = '"small" | "medium" | "large" | { min, default, max }';

// Whether a region is drawn at all, said outright or one viewport range at a time
const hidden = {
    name: "hidden",
    type: "boolean | ResponsiveValue<boolean>",
    default: "false",
    description:
        "Whether the region is left out. It can be said one viewport range at a time, so a pane can be there on a wide screen and gone on a narrow one without the page being written twice",
};

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// The room a region keeps inside its own edges. Every region takes it and none of them keeps any by
// default, since what goes in a region is what settles how much room it wants
const padding = {
    name: "padding",
    type: spacing,
    default: '"none"',
    description: "The room the region keeps inside its own edges",
};

// Every prop the layout and its regions take, under the one that takes it. The page comes first,
// since what it says is handed down to the rest, then the regions in the order they are read down
// the page, and the two that can be resized last
const groups: ComponentPropGroup[] = [
    {
        name: "PageLayout",
        props: [
            {
                name: "containerWidth",
                type: width,
                default: '"xlarge"',
                description:
                    "The widest the page is allowed to run: full is whatever it was put in, and the three named steps are 768, 1012 and 1280 pixels. It holds the whole of the page rather than any one region, so every region ends at the same place",
            },
            {
                name: "padding",
                type: spacing,
                default: '"normal"',
                description:
                    "The room between the outer edges of the page and whatever it was put in",
            },
            {
                name: "rowGap",
                type: spacing,
                default: '"normal"',
                description: "The room between the regions stacked down the page",
            },
            {
                name: "columnGap",
                type: spacing,
                default: '"normal"',
                description: "The room between the regions standing beside one another",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The regions the page is built from. The header, the footer and the sidebar are lifted out and put where they belong, and the content and the pane are placed by which side the pane is on, so the order they are written in does not settle where they stand",
            },
            styling,
        ],
    },
    {
        name: "PageLayout.Header",
        props: [
            padding,
            {
                name: "divider",
                type: divider,
                default: '"none"',
                description:
                    "What sets the header apart from what follows it. A line is a hairline rule; a filled divider is a band of inset colour, which only reads well across the page and so is usually asked for on the narrow range alone",
            },
            hidden,
            styling,
        ],
    },
    {
        name: "PageLayout.Content",
        props: [
            {
                name: "as",
                type: "React.ElementType",
                default: '"main"',
                description:
                    "The element the region is drawn as. It is the page's main region by default, which is what a page wants and what a page may only have one of; anywhere a second one would be wrong — a layout drawn inside another page, as on this one — it is drawn as something else instead",
            },
            {
                name: "width",
                type: width,
                default: '"full"',
                description:
                    "The widest the content is allowed to run within the page, for a column of prose inside a page that is otherwise wide",
            },
            padding,
            hidden,
            styling,
        ],
    },
    {
        name: "PageLayout.Pane",
        props: [
            {
                name: "position",
                type: `${position} | ResponsiveValue<${position}>`,
                default: '"end"',
                description:
                    "Which side of the content the pane comes down. It can be said one viewport range at a time, for a pane that reads better above the content on a narrow screen than beside it",
            },
            {
                name: "width",
                type: paneWidth,
                default: '"medium"',
                description:
                    "A step of the width scale, or bounds of the caller's own written as three pixel measurements. Where the pane can be resized, the named step or the default is the width it opens at and the rest is what it moves between. A named width is held to what the viewport leaves, so a pane cannot push past the edge",
            },
            {
                name: "minWidth",
                type: "number",
                default: "256",
                description:
                    "The narrowest the pane may be, in pixels. It is only read for a named width, since bounds of the caller's own already say it",
            },
            {
                name: "resizable",
                type: "boolean",
                default: "false",
                description:
                    "Lets the reader drag the pane wider and narrower, or move it with the arrow keys once the handle has focus. The line to take hold of is drawn whether or not a divider was asked for",
            },
            {
                name: "widthStorageKey",
                type: "string",
                default: '"paneWidth"',
                description:
                    "The name a resizable pane writes its width down under, so it opens where it was left. It is only read where the caller is not keeping the width themselves, and two resizable panes in one application want two names between them",
            },
            {
                name: "currentWidth",
                type: "number",
                description:
                    "The width the pane is held at, for a caller keeping it themselves. Give it together with onResizeEnd, and leave it undefined until a stored width has been read",
            },
            {
                name: "onResizeEnd",
                type: "(width: number) => void",
                description:
                    "Called once a resize finishes, with the width in pixels. Given this, the pane stops writing the width down for itself",
            },
            {
                name: "sticky",
                type: "boolean",
                default: "false",
                description: "Keeps the pane where it is while the content beside it scrolls past",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the pane is called. It is only read once the pane holds more than it can show: a pane that scrolls becomes a region of its own and can be reached with the keyboard, and one that does not is left as part of the page around it rather than made a landmark with nothing to find in it",
            },
            {
                name: "offsetHeader",
                type: "string | number",
                default: "0",
                description:
                    "How far down the page a sticky pane comes to rest, below whatever stands over it",
            },
            padding,
            {
                name: "divider",
                type: divider,
                default: '"none"',
                description:
                    "What sets the pane apart from the content. It is drawn down the page where the pane stands beside the content and across it where the pane has stacked above or below, so the same word means the right thing at either width",
            },
            hidden,
            styling,
        ],
    },
    {
        name: "PageLayout.Sidebar",
        props: [
            {
                name: "position",
                type: position,
                default: '"start"',
                description: "Which side of the page the sidebar stands on",
            },
            {
                name: "width",
                type: paneWidth,
                default: '"medium"',
                description: "Read the same way as a pane's",
            },
            {
                name: "responsiveVariant",
                type: '"default" | "fullscreen"',
                default: '"default"',
                description:
                    "What the sidebar does on a narrow screen: keep its place in the row, or cover the viewport the way a dialog does",
            },
            {
                name: "resizable",
                type: "boolean",
                default: "false",
                description: "Lets the reader drag or key the sidebar wider and narrower",
            },
            {
                name: "widthStorageKey",
                type: "string",
                description:
                    "The name a resizable sidebar writes its width down under. Unlike a pane, a sidebar is given none by default, so it opens at its own width every time unless one is named",
            },
            {
                name: "divider",
                type: '"none" | "line"',
                default: '"none"',
                description:
                    "What sets the sidebar apart from the page beside it. It is drawn down the page, so there is no filled treatment to ask for",
            },
            padding,
            hidden,
            styling,
        ],
    },
    {
        name: "PageLayout.Footer",
        props: [
            padding,
            {
                name: "divider",
                type: divider,
                default: '"none"',
                description: "What sets the footer apart from what comes before it",
            },
            hidden,
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the layout is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const PageLayout = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                PageLayout
            </Heading>
            <Text as="p" size="large">
                Lays a page out as a header, a body of content with a pane beside it, and a footer,
                with an optional sidebar standing outside the lot. Where each region stands is
                settled by the layout rather than by the order they were written in: the header, the
                footer and the sidebar are lifted out of the children and put where they belong, and
                the content and the pane are placed by which side the pane is on. The widest the
                page may run and the room left around and between its regions are named once on the
                layout and handed down, so no region has to be told any of it. What a region does as
                the screen narrows is said the same way as everything else here — a plain value, or
                one per viewport range — so a pane can move across, change its divider or go
                altogether without the page being written twice.
            </Text>
        </Stack>
        <ComponentExamples component="PageLayout" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default PageLayout;
