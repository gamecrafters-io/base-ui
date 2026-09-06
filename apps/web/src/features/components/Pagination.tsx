import * as React from "react";
import { Link } from "react-router";
import {
    Heading,
    Pagination as PaginationComponent,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample, ComponentExternalPackage } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

// The one name on this page that is not the library's. A router's own link is what renderPage
// exists for, and the library exports a Link of its own, so which of the two a listing means is
// said outright rather than left to be told apart by the look of it
const reactRouter: ComponentExternalPackage = {
    name: "react-router",
    exports: ["Link"],
};

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // What names one of a set of runs shown together, since the difference between them is the
    // page each is standing on rather than anything the row says itself
    caption: "text-[var(--foreground-color-muted)]",
};

// Where the reader is standing in each of the three runs read together. The three are the only
// shapes the row comes to: cut at the end alone, cut at both, and cut at the start alone
const positions = [1, 8, 15];

// A run of pages the reader can actually work through: the row reports which page was picked and
// the page it stands on follows.
//
// Every page is an anchor, so a press would otherwise be followed as a link. The default address is
// the page number as a fragment, which would take the reader somewhere on this page, so the press
// is stopped and only the report is kept.
//
// The state is the caller's, which makes this a component of its own rather than an element the
// page holds ready.
//
// The page and the component it is about are both called Pagination, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Pagination, as an
// application importing it would
const DefaultPreview = () => {
    const [page, setPage] = React.useState(5);

    return (
        <PaginationComponent
            pageCount={15}
            currentPage={page}
            onPageChange={(event, next) => {
                event.preventDefault();
                setPage(next);
            }}
        />
    );
};

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `const [page, setPage] = React.useState(5);

<Pagination
    pageCount={15}
    currentPage={page}
    onPageChange={(event, next) => {
        event.preventDefault();
        setPage(next);
    }}
/>`;

// The same fifteen pages read from three places in the run. Each row is fixed where it stands, so
// what is being read is the shape the row comes to rather than anything a press would do
const ellipsisPreview = (
    <Stack gap="condensed">
        {positions.map((position) => (
            <Stack key={position} gap="none">
                <Text size="small" className={classes.caption}>
                    Standing on page {position}
                </Text>
                <PaginationComponent
                    pageCount={15}
                    currentPage={position}
                    onPageChange={(event) => event.preventDefault()}
                />
            </Stack>
        ))}
    </Stack>
);

const ellipsisCode = `<Stack gap="condensed">
    {[1, 8, 15].map((position) => (
        <Stack key={position} gap="none">
            <Text size="small">Standing on page {position}</Text>
            <Pagination
                pageCount={15}
                currentPage={position}
                onPageChange={(event) => event.preventDefault()}
            />
        </Stack>
    ))}
</Stack>`;

// How many pages stay pinned at each end however far into the run the reader has gone. The default
// is one, which is what puts a lone 1 and a lone 15 either side of the ellipses above
const marginPreview = (
    <PaginationComponent
        pageCount={30}
        currentPage={15}
        marginPageCount={3}
        onPageChange={(event) => event.preventDefault()}
    />
);

const marginCode = `<Pagination
    pageCount={30}
    currentPage={15}
    marginPageCount={3}
    onPageChange={(event) => event.preventDefault()}
/>`;

// How many pages sit either side of the one the reader is on. It is the window that travels with
// them, where the margin above is what stays put
const surroundingPreview = (
    <PaginationComponent
        pageCount={30}
        currentPage={15}
        surroundingPageCount={4}
        onPageChange={(event) => event.preventDefault()}
    />
);

const surroundingCode = `<Pagination
    pageCount={30}
    currentPage={15}
    surroundingPageCount={4}
    onPageChange={(event) => event.preventDefault()}
/>`;

// The two steps and nothing between them, for a run whose length says nothing worth showing. The
// numbers are not drawn at all rather than drawn and hidden, so there is nothing left for a screen
// reader to find either
const stepsOnlyPreview = (
    <PaginationComponent
        pageCount={15}
        currentPage={5}
        showPages={false}
        onPageChange={(event) => event.preventDefault()}
    />
);

const stepsOnlyCode = `<Pagination
    pageCount={15}
    currentPage={5}
    showPages={false}
    onPageChange={(event) => event.preventDefault()}
/>`;

// The numbers taken away on a narrow screen alone. Said this way they are drawn and then hidden
// where there is no room for them, rather than left out of the row altogether
const responsivePreview = (
    <PaginationComponent
        pageCount={15}
        currentPage={5}
        showPages={{ narrow: false }}
        onPageChange={(event) => event.preventDefault()}
    />
);

const responsiveCode = `<Pagination
    pageCount={15}
    currentPage={5}
    showPages={{ narrow: false }}
    onPageChange={(event) => event.preventDefault()}
/>`;

// Where each page leads, worked out by the caller. Every page is an anchor whether or not the row
// is told what to report, so a run of pages is followable and shareable before any of it is wired
// up
const hrefPreview = (
    <PaginationComponent
        pageCount={15}
        currentPage={5}
        hrefBuilder={(page) => `/items?page=${page}`}
        onPageChange={(event) => event.preventDefault()}
    />
);

const hrefCode = `<Pagination
    pageCount={15}
    currentPage={5}
    hrefBuilder={(page) => \`/items?page=\${page}\`}
    onPageChange={(event) => event.preventDefault()}
/>`;

// Each page drawn by the caller rather than for them, which is what a router's own link needs: it
// is a component rather than an anchor, and it takes where it leads under a name of its own.
//
// What is handed over is everything the anchor would have been given, so the link carries the same
// label, the same mark of which page is current and the same class. A step that cannot be reached
// is handed over with nowhere to lead, so it is drawn as a plain mark rather than as a link to
// nothing
const RenderPagePreview = () => {
    const [page, setPage] = React.useState(5);

    return (
        <PaginationComponent
            pageCount={15}
            currentPage={page}
            hrefBuilder={(target) => `/items?page=${target}`}
            onPageChange={(event, next) => {
                event.preventDefault();
                setPage(next);
            }}
            renderPage={({ key, number, children, href, ...pageProps }) =>
                href ? (
                    <Link key={key} to={href} data-page={number} {...pageProps}>
                        {children}
                    </Link>
                ) : (
                    <span key={key} {...pageProps}>
                        {children}
                    </span>
                )
            }
        />
    );
};

const renderPageCode = `const [page, setPage] = React.useState(5);

<Pagination
    pageCount={15}
    currentPage={page}
    hrefBuilder={(target) => \`/items?page=\${target}\`}
    onPageChange={(event, next) => {
        event.preventDefault();
        setPage(next);
    }}
    renderPage={({ key, number, children, href, ...pageProps }) =>
        href ? (
            <Link key={key} to={href} data-page={number} {...pageProps}>
                {children}
            </Link>
        ) : (
            <span key={key} {...pageProps}>
                {children}
            </span>
        )
    }
/>`;

// The row as it is reached for, drawn and written out one above the other. A run the reader can
// work through comes first, then the shape the row comes to and what settles it, then what is left
// out where there is no room, and last where each page leads and what draws it
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A run of pages the reader can work through: the row reports which page was picked and the page it stands on follows. The row is a navigation landmark of its own, named so that it can be found and skipped past, and it centres itself in whatever it was put in. Every page is an anchor, so the press is stopped here — the default address is the page number as a fragment, which would otherwise take the reader somewhere on this page.",
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Where the run is cut",
        description:
            "The same fifteen pages read from three places in the run, which between them are every shape the row comes to: cut at the end alone, cut at both ends, and cut at the start alone. An ellipsis stands in for the pages it swallowed rather than leading anywhere, so it is a plain mark rather than a link. The page just before one is labelled as though the run continues, which makes a screen reader change tone rather than silently skip a stretch of numbers.",
        preview: ellipsisPreview,
        code: ellipsisCode,
    },
    {
        name: "How many stay pinned at each end",
        description:
            "However far into the run the reader has gone, this many pages stay put at either end of it, so the way back to the start and the way on to the last page are always one press. One is the default, which is what puts a lone first page and a lone last page either side of the ellipses above.",
        preview: marginPreview,
        code: marginCode,
    },
    {
        name: "How many sit either side",
        description:
            "The window that travels with the reader, where the margin is what stays put. Widening it shows more of where they are and fewer ellipses; between the two, the most pages that can ever be drawn at once is both margins, both windows, the current page and the two marks standing in for the rest.",
        preview: surroundingPreview,
        code: surroundingCode,
    },
    {
        name: "The two steps alone",
        description:
            "For a run whose length says nothing worth showing — a feed, a search, anything counted in more pages than a reader would pick one out of. The numbers are not drawn at all rather than drawn and hidden, so there is nothing left for a screen reader to find either, and the step that cannot be reached is taken out of the reading rather than left to be pressed at.",
        preview: stepsOnlyPreview,
        code: stepsOnlyCode,
    },
    {
        name: "The numbers taken away on a narrow screen",
        description:
            "Said one viewport range at a time, the numbers are drawn and then hidden where there is no room for them, rather than left out of the row altogether. Narrowing this window below 768 pixels leaves the two steps standing on their own.",
        preview: responsivePreview,
        code: responsiveCode,
    },
    {
        name: "Where each page leads",
        description:
            "Every page is an anchor whether or not the row was told what to report, so a run of pages can be followed, opened in another tab and shared before any of it is wired up. Left unsaid, each page leads to its own number as a fragment; given this, it leads wherever the application keeps that page.",
        preview: hrefPreview,
        code: hrefCode,
    },
    {
        name: "Each page drawn by the caller",
        description:
            "Which is what a router's own link needs, since it is a component rather than an anchor and takes where it leads under a name of its own. What is handed over is everything the anchor would have been given — the label, the address, the mark of which page is current, the class it is drawn with — so nothing has to be worked out a second time. A step that cannot be reached comes with nowhere to lead, so it is drawn as a plain mark rather than as a link to nothing; an ellipsis is never handed over at all, since it was never going to be one.",
        preview: <RenderPagePreview />,
        code: renderPageCode,
    },
];

// Whether the page numbers are drawn, outright or one viewport range at a time
const showPages = "boolean | ResponsiveValue<boolean>";

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
// The run and where the reader stands in it come first, since neither can be left out, then what is
// reported and where each page leads, and last what shapes the row and what draws it
const groups: ComponentPropGroup[] = [
    {
        name: "Pagination",
        props: [
            {
                name: "pageCount",
                type: "number",
                required: true,
                description:
                    "How many pages there are in the run. Given none at all, both steps are drawn closed rather than the row being left empty",
            },
            {
                name: "currentPage",
                type: "number",
                required: true,
                description:
                    "The page the reader is standing on, counted from one. It is what the window of surrounding pages travels with, and it is marked as the current page for a screen reader rather than only filled in",
            },
            {
                name: "onPageChange",
                type: "(event: React.MouseEvent, page: number) => void",
                description:
                    "Called with the page that was picked. Every page is an anchor, so a caller keeping the run in state rather than in the address bar stops the press here as well as reading the number off it",
            },
            {
                name: "hrefBuilder",
                type: "(page: number) => string",
                default: "(page) => `#${page}`",
                description:
                    "Where each page leads. Left unsaid, each leads to its own number as a fragment, which is enough for the row to be followable before any of it is wired up but is rarely what an application wants",
            },
            {
                name: "marginPageCount",
                type: "number",
                default: "1",
                description:
                    "How many pages stay pinned at each end of the run however far into it the reader has gone, so the way back to the start is always one press",
            },
            {
                name: "surroundingPageCount",
                type: "number",
                default: "2",
                description:
                    "How many pages sit either side of the current one. This is the window that travels with the reader, where the margin is what stays put; the two together settle how long a run has to be before anything is collapsed into an ellipsis",
            },
            {
                name: "showPages",
                type: showPages,
                default: "true",
                description:
                    "Whether the page numbers are drawn between the two steps. Said outright, they are not built at all, so there is nothing left for a screen reader to find; said one viewport range at a time, they are built and then hidden where there is no room for them",
            },
            {
                name: "renderPage",
                type: "(props: PaginationPageProps) => React.ReactNode",
                description:
                    "Draws each page in place of the anchor the row would have drawn, for a router's own link. It is handed the label, the address, the mark of which page is current and the class, so nothing has to be worked out again. An ellipsis is never handed over, since it leads nowhere",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"nav"',
                description:
                    "The element the row is drawn as. It is a navigation landmark by default, which is what a run of pages is; a page carrying several rows that are not each worth finding on their own may want otherwise",
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
const Pagination = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Pagination
            </Heading>
            <Text as="p" size="large">
                A run of pages, with the way back and the way on at either end of it. How much of
                the run is drawn is worked out from where the reader is standing: a few pages stay
                pinned at each end, a window of them travels with the reader, and whatever is left
                between collapses into a mark standing in for it. Every page is an anchor, so the
                run can be followed, opened in another tab and shared before any of it is wired up,
                and a caller keeping the run in state rather than in the address bar stops the press
                and reads the number off it instead. The row is a navigation landmark, named so it
                can be found and skipped past, and the step that cannot be reached is taken out of
                the reading rather than left to be pressed at.
            </Text>
        </Stack>
        <ComponentExamples component="Pagination" examples={examples} external={reactRouter} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Pagination;
