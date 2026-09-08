import * as React from "react";
import {
    Heading,
    NativeSelect,
    scrollToHeading,
    SkeletonText,
    Stack,
    TableOfContents as TableOfContentsComponent,
    Text,
    TreeView,
    useTableOfContents,
    useTableOfContentsContext,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";
import type { TableOfContentsItemData } from "@gamecrafters/base-ui/react";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The document is given a window of its own rather than being left to the page, so the
    // contents can be watched following a reader without every example having to be a page long.
    // It is part of what is being shown rather than the page's own furniture: the headings are
    // watched within whatever the document is scrolled in, so a document with a window of its own
    // is the whole reason the Content part exists
    panel: "h-[22rem] overflow-y-auto overscroll-contain pe-[var(--base-size-16)]",
};

// A heading of the made-up document the examples are read against: what the contents are drawn
// from, what it is called, and how much stands under it before the next one.
//
// What stands under the first heading is written long enough to carry the second one clear of the
// band a heading is read as arrived at within. An opening section shorter than that leaves both
// headings standing in the band before the reader has scrolled at all, and an example that opens
// with two lines already drawn as reached reads as the contents having lost count rather than as
// two headings genuinely being on screen together
type Section = TableOfContentsItemData & {
    label: string;
    lines: number;
};

// A panel that scrolls has to be reachable by the keyboard, and a made-up document holds nothing
// to tab to that would reach it on its own
const panelProps = {
    className: classes.panel,
    tabIndex: 0,
    "aria-label": "Documentation",
};

// The document itself. Nothing here is the component's: the headings carry the ids the lines point
// at, which is all the contents ask of a page they are drawn from.
//
// Every example draws one of these, so the page keeps it in one place rather than writing it out
// six times over. What a reader is handed is written out in full under each of them, since that is
// what they would write
const documentOf = (sections: Section[]) => (
    <Stack gap="spacious">
        {sections.map((section) => {
            const Tag = section.depth >= 3 ? "h3" : "h2";

            return (
                <Stack as="section" key={section.value} gap="condensed">
                    <Tag id={section.value}>{section.label}</Tag>
                    <SkeletonText lines={section.lines} />
                </Stack>
            );
        })}
    </Stack>
);

// The shape of the document, standing beside it: a line to every heading, and a bar drawn against
// the part of the list the reader is in
const navOf = (sections: Section[], placement?: "start" | "end") => (
    <TableOfContentsComponent.Nav placement={placement}>
        <TableOfContentsComponent.Title>On this page</TableOfContentsComponent.Title>
        <TableOfContentsComponent.List>
            <TableOfContentsComponent.Indicator />
            {sections.map((section) => (
                <TableOfContentsComponent.Item key={section.value} item={section}>
                    <TableOfContentsComponent.Link href={`#${section.value}`}>
                        {section.label}
                    </TableOfContentsComponent.Link>
                </TableOfContentsComponent.Item>
            ))}
        </TableOfContentsComponent.List>
    </TableOfContentsComponent.Nav>
);

// Every example draws a document of its own, and a heading is found by an id that has to be the
// one element carrying it, so each of them keeps its headings apart from the rest
const defaultSections: Section[] = [
    { value: "default-introduction", depth: 2, label: "Introduction", lines: 8 },
    { value: "default-getting-started", depth: 2, label: "Getting started", lines: 6 },
    { value: "default-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "default-usage", depth: 2, label: "Usage", lines: 9 },
    { value: "default-conclusion", depth: 2, label: "Conclusion", lines: 6 },
];

const nestedSections: Section[] = [
    { value: "nested-importance", depth: 2, label: "Importance", lines: 8 },
    { value: "nested-integrations", depth: 2, label: "Integrations", lines: 7 },
    { value: "nested-free-blocks", depth: 3, label: "Free blocks", lines: 5 },
    { value: "nested-configuration", depth: 3, label: "Configuration", lines: 8 },
    { value: "nested-api-reference", depth: 2, label: "API reference", lines: 6 },
    { value: "nested-hooks", depth: 3, label: "Hooks", lines: 5 },
    { value: "nested-components", depth: 3, label: "Components", lines: 7 },
    { value: "nested-examples", depth: 2, label: "Examples", lines: 6 },
];

const placementSections: Section[] = [
    { value: "placement-overview", depth: 2, label: "Overview", lines: 8 },
    { value: "placement-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "placement-usage", depth: 2, label: "Usage", lines: 9 },
    { value: "placement-api-reference", depth: 2, label: "API reference", lines: 7 },
];

const controlledSections: Section[] = [
    { value: "controlled-introduction", depth: 2, label: "Introduction", lines: 8 },
    { value: "controlled-getting-started", depth: 2, label: "Getting started", lines: 6 },
    { value: "controlled-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "controlled-usage", depth: 2, label: "Usage", lines: 9 },
];

const hookSections: Section[] = [
    { value: "hook-introduction", depth: 2, label: "Introduction", lines: 8 },
    { value: "hook-getting-started", depth: 2, label: "Getting started", lines: 6 },
    { value: "hook-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "hook-usage", depth: 2, label: "Usage", lines: 9 },
];

// What the window the document is scrolled in comes to. It is written once and reached for by
// every example, since what changes between them is the shape of the contents rather than the
// room the document is read in
const panelSetup = `const panel = "h-[22rem] overflow-y-auto overscroll-contain pe-[var(--base-size-16)]";`;

const sectionsSetup = (sections: Section[]) =>
    `const sections = [\n${sections
        .map(
            (section) =>
                `    { value: "${section.value}", depth: ${section.depth}, label: "${section.label}", lines: ${section.lines} },`,
        )
        .join("\n")}\n];\n\n${panelSetup}`;

// The plainest contents there is: the document on one hand and the shape of it on the other, with
// the line the reader is under drawn as reached and a bar beside it saying how far the section
// runs.
//
// The headings are named to the contents rather than to the list, since which headings the
// document is made of belongs to the document rather than to any one line drawn from it — and the
// lines would otherwise each be watching the page and disagreeing about where the reader is.
//
// The page and the component it is about are both called TableOfContents, so the component is
// brought in under a name saying which of the two it is. The listing beneath says TableOfContents,
// as an application importing it would
const defaultPreview = (
    <TableOfContentsComponent items={defaultSections}>
        <TableOfContentsComponent.Content {...panelProps}>
            {documentOf(defaultSections)}
        </TableOfContentsComponent.Content>
        {navOf(defaultSections)}
    </TableOfContentsComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<TableOfContents items={sections}>
    <TableOfContents.Content className={panel} tabIndex={0} aria-label="Documentation">
        <Stack gap="spacious">
            {sections.map((section) => (
                <Stack as="section" key={section.value} gap="condensed">
                    <h2 id={section.value}>{section.label}</h2>
                    <SkeletonText lines={section.lines} />
                </Stack>
            ))}
        </Stack>
    </TableOfContents.Content>

    <TableOfContents.Nav>
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
            <TableOfContents.Indicator />
            {sections.map((section) => (
                <TableOfContents.Item key={section.value} item={section}>
                    <TableOfContents.Link href={\`#\${section.value}\`}>
                        {section.label}
                    </TableOfContents.Link>
                </TableOfContents.Item>
            ))}
        </TableOfContents.List>
    </TableOfContents.Nav>
</TableOfContents>`;

// Headings at more than one level, which is the shape most documents are. A heading standing under
// another is stepped in from it, so a glance down the list says which belong to which
const nestedPreview = (
    <TableOfContentsComponent items={nestedSections}>
        <TableOfContentsComponent.Content {...panelProps}>
            {documentOf(nestedSections)}
        </TableOfContentsComponent.Content>
        {navOf(nestedSections)}
    </TableOfContentsComponent>
);

const nestedCode = `<TableOfContents items={sections}>
    <TableOfContents.Content className={panel} tabIndex={0} aria-label="Documentation">
        <Stack gap="spacious">
            {sections.map((section) => {
                const Tag = section.depth >= 3 ? "h3" : "h2";

                return (
                    <Stack as="section" key={section.value} gap="condensed">
                        <Tag id={section.value}>{section.label}</Tag>
                        <SkeletonText lines={section.lines} />
                    </Stack>
                );
            })}
        </Stack>
    </TableOfContents.Content>

    <TableOfContents.Nav>
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
            <TableOfContents.Indicator />
            {sections.map((section) => (
                <TableOfContents.Item key={section.value} item={section}>
                    <TableOfContents.Link href={\`#\${section.value}\`}>
                        {section.label}
                    </TableOfContents.Link>
                </TableOfContents.Item>
            ))}
        </TableOfContents.List>
    </TableOfContents.Nav>
</TableOfContents>`;

// Which side the nav stands on, said rather than left to the order the parts were written in, so
// the same markup serves a page laid out either way
const placementPreview = (
    <TableOfContentsComponent items={placementSections}>
        <TableOfContentsComponent.Content {...panelProps}>
            {documentOf(placementSections)}
        </TableOfContentsComponent.Content>
        {navOf(placementSections, "start")}
    </TableOfContentsComponent>
);

const placementCode = `<TableOfContents items={sections}>
    <TableOfContents.Content className={panel} tabIndex={0} aria-label="Documentation">
        <Stack gap="spacious">
            {sections.map((section) => (
                <Stack as="section" key={section.value} gap="condensed">
                    <h2 id={section.value}>{section.label}</h2>
                    <SkeletonText lines={section.lines} />
                </Stack>
            ))}
        </Stack>
    </TableOfContents.Content>

    <TableOfContents.Nav placement="start">
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
            <TableOfContents.Indicator />
            {sections.map((section) => (
                <TableOfContents.Item key={section.value} item={section}>
                    <TableOfContents.Link href={\`#\${section.value}\`}>
                        {section.label}
                    </TableOfContents.Link>
                </TableOfContents.Item>
            ))}
        </TableOfContents.List>
    </TableOfContents.Nav>
</TableOfContents>`;

// Where the reader is, held by the caller. The contents stop working it out for themselves and say
// whatever they are told, which is what lets a control of the caller's own stand in for following
// the page.
//
// Picking a heading moves the page as well as saying where the reader is. Saying it alone would
// leave the list pointing at a section the reader had not been taken to, and the first turn of the
// wheel would put it back
const ControlledPreview = () => {
    const [activeIds, setActiveIds] = React.useState([controlledSections[0].value]);
    // The select stands outside the contents rather than among their parts, so it is handed the
    // panel the document is scrolled in instead of reading it from them
    const [panel, setPanel] = React.useState<HTMLElement | null>(null);

    const goTo = (value: string) => {
        setActiveIds([value]);
        scrollToHeading(value, { scrollElement: panel, behavior: "smooth" });
    };

    return (
        <Stack gap="condensed">
            <NativeSelect
                aria-label="Section"
                value={activeIds[0]}
                onChange={(event) => goTo(event.target.value)}
            >
                {controlledSections.map((section) => (
                    <NativeSelect.Option key={section.value} value={section.value}>
                        {section.label}
                    </NativeSelect.Option>
                ))}
            </NativeSelect>

            <TableOfContentsComponent
                items={controlledSections}
                activeIds={activeIds}
                // A short section leaves room for the next heading to stand within the band
                // alongside its own, and the contents report both. A select names one section, so
                // the first of a run is the one it keeps: that is the heading the reader is under,
                // and the rest are only the ones coming up behind it
                onActiveChange={(details) => setActiveIds(details.activeIds.slice(0, 1))}
            >
                <TableOfContentsComponent.Content
                    ref={(element: HTMLElement | null) => setPanel(element)}
                    {...panelProps}
                >
                    {documentOf(controlledSections)}
                </TableOfContentsComponent.Content>
                {navOf(controlledSections)}
            </TableOfContentsComponent>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. Where the reader is is the caller's
// here, and so is the panel the document is scrolled in, since the select stands outside the
// contents and cannot read either from them
const controlledSetup = `${sectionsSetup(controlledSections)}

const [activeIds, setActiveIds] = React.useState([sections[0].value]);

const [panel, setPanel] = React.useState(null);

const goTo = (value) => {
    setActiveIds([value]);
    scrollToHeading(value, { scrollElement: panel, behavior: "smooth" });
};`;

const controlledCode = `<Stack gap="condensed">
    <NativeSelect
        aria-label="Section"
        value={activeIds[0]}
        onChange={(event) => goTo(event.target.value)}
    >
        {sections.map((section) => (
            <NativeSelect.Option key={section.value} value={section.value}>
                {section.label}
            </NativeSelect.Option>
        ))}
    </NativeSelect>

    <TableOfContents
        items={sections}
        activeIds={activeIds}
        onActiveChange={(details) => setActiveIds(details.activeIds.slice(0, 1))}
    >
        <TableOfContents.Content
            ref={setPanel}
            className={panel}
            tabIndex={0}
            aria-label="Documentation"
        >
            <Stack gap="spacious">
                {sections.map((section) => (
                    <Stack as="section" key={section.value} gap="condensed">
                        <h2 id={section.value}>{section.label}</h2>
                        <SkeletonText lines={section.lines} />
                    </Stack>
                ))}
            </Stack>
        </TableOfContents.Content>

        <TableOfContents.Nav>
            <TableOfContents.Title>On this page</TableOfContents.Title>
            <TableOfContents.List>
                <TableOfContents.Indicator />
                {sections.map((section) => (
                    <TableOfContents.Item key={section.value} item={section}>
                        <TableOfContents.Link href={\`#\${section.value}\`}>
                            {section.label}
                        </TableOfContents.Link>
                    </TableOfContents.Item>
                ))}
            </TableOfContents.List>
        </TableOfContents.Nav>
    </TableOfContents>
</Stack>`;

// A nav of the caller's own, drawn from the hook rather than from the parts. The document is
// followed the same way either way, so a shape laid out by hand is no less a table of contents
// than one built out of the parts
const HookPreview = () => {
    // The article hands back what it came out as, so the headings are watched within it rather
    // than within the window it happens to be standing in
    const [article, setArticle] = React.useState<HTMLElement | null>(null);
    const contents = useTableOfContents({ items: hookSections, scrollElement: article });

    return (
        <Stack direction="horizontal" gap="spacious" align="start">
            <Stack
                as="article"
                ref={(element: HTMLElement | null) => setArticle(element)}
                tabIndex={0}
                aria-label="Documentation"
                className={`${classes.panel} flex-1 min-w-0`}
            >
                {documentOf(hookSections)}
            </Stack>

            <Stack as="nav" aria-label="On this page" gap="tight" className="w-[12rem] flex-none">
                {hookSections.map((section) => (
                    <Text
                        as="a"
                        key={section.value}
                        size="small"
                        href={`#${section.value}`}
                        aria-current={
                            contents.getItemState(section).active ? "location" : undefined
                        }
                        className="no-underline"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            contents.scrollTo(section.value);
                        }}
                    >
                        {section.label}
                    </Text>
                ))}
            </Stack>
        </Stack>
    );
};

const hookSetup = `${sectionsSetup(hookSections)}

const [article, setArticle] = React.useState(null);

const contents = useTableOfContents({ items: sections, scrollElement: article });`;

const hookCode = `<Stack direction="horizontal" gap="spacious" align="start">
    <Stack
        as="article"
        ref={setArticle}
        tabIndex={0}
        aria-label="Documentation"
        className={\`\${panel} flex-1 min-w-0\`}
    >
        <Stack gap="spacious">
            {sections.map((section) => (
                <Stack as="section" key={section.value} gap="condensed">
                    <h2 id={section.value}>{section.label}</h2>
                    <SkeletonText lines={section.lines} />
                </Stack>
            ))}
        </Stack>
    </Stack>

    <Stack as="nav" aria-label="On this page" gap="tight" className="w-[12rem] flex-none">
        {sections.map((section) => (
            <Text
                as="a"
                key={section.value}
                size="small"
                href={\`#\${section.value}\`}
                aria-current={contents.getItemState(section).active ? "location" : undefined}
                className="no-underline"
                onClick={(event) => {
                    event.preventDefault();
                    contents.scrollTo(section.value);
                }}
            >
                {section.label}
            </Text>
        ))}
    </Stack>
</Stack>`;

// The contents read as a tree, for a document whose sections hold sections of their own. The rows
// nest the way the headings do rather than being stepped in by hand, and the branch the reader is
// in opens as they arrive at it
type Branch = Section & { children: Section[] };

const treeSections: Branch[] = [
    {
        value: "tree-guides",
        depth: 2,
        label: "Guides",
        lines: 6,
        children: [
            { value: "tree-quick-start", depth: 3, label: "Quick start", lines: 4 },
            { value: "tree-manual-setup", depth: 3, label: "Manual setup", lines: 5 },
        ],
    },
    {
        value: "tree-concepts",
        depth: 2,
        label: "Concepts",
        lines: 5,
        children: [
            { value: "tree-props", depth: 3, label: "Props", lines: 5 },
            { value: "tree-events", depth: 3, label: "Events", lines: 4 },
        ],
    },
    {
        value: "tree-advanced",
        depth: 2,
        label: "Advanced",
        lines: 7,
        children: [
            { value: "tree-providers", depth: 3, label: "Providers", lines: 5 },
            { value: "tree-rendering", depth: 3, label: "Rendering", lines: 4 },
        ],
    },
];

// Read down the page rather than down the tree: a branch is followed by what stands under it,
// which is the order the document is written in and the order the headings are met in
const treeReadingOrder: Section[] = treeSections.flatMap((section) => [
    section,
    ...section.children,
]);

// Which branch a heading belongs to, so that arriving at one opens it
const branchHolding = (value: string | undefined) =>
    treeSections.find(
        (section) =>
            section.value === value || section.children.some((child) => child.value === value),
    )?.value;

// The tree stands among the parts, so it reads where the reader is and the way to a heading from
// the contents around it rather than being handed either again.
//
// A row goes to its heading when it is picked rather than carrying a link of its own: a tree
// answers the pointer and the keyboard itself, and a link standing inside a row would be a second
// thing to reach in a place that holds one
const SectionTree = ({
    expanded,
    onExpandedChange,
}: {
    expanded: string[];
    onExpandedChange: (expanded: string[]) => void;
}) => {
    const { ids, activeIds, scrollTo } = useTableOfContentsContext();

    // More than one heading can stand within the band at once, and a tree marks one row as the one
    // the reader is on, so the first of a run is the one it takes
    const reached = activeIds?.[0];

    const toggle = (value: string, isOpen: boolean) =>
        onExpandedChange(isOpen ? [...expanded, value] : expanded.filter((one) => one !== value));

    return (
        // Named by the title the nav is named by, rather than by a second copy of the same words
        <TreeView aria-labelledby={ids?.title}>
            {treeSections.map((section) => (
                <TreeView.Item
                    key={section.value}
                    id={section.value}
                    current={section.value === reached}
                    expanded={expanded.includes(section.value)}
                    onExpandedChange={(isOpen) => toggle(section.value, isOpen)}
                    onSelect={() => scrollTo?.(section.value)}
                >
                    {section.label}
                    <TreeView.SubTree>
                        {section.children.map((child) => (
                            <TreeView.Item
                                key={child.value}
                                id={child.value}
                                current={child.value === reached}
                                onSelect={() => scrollTo?.(child.value)}
                            >
                                {child.label}
                            </TreeView.Item>
                        ))}
                    </TreeView.SubTree>
                </TreeView.Item>
            ))}
        </TreeView>
    );
};

const TreePreview = () => {
    const [expanded, setExpanded] = React.useState([treeSections[0].value]);

    return (
        <TableOfContentsComponent
            items={treeReadingOrder}
            // The tree follows the reader down the page: the branch they arrive in opens, and the
            // one they have left closes behind them, so the shape of the tree says where they are
            // as much as the row drawn as current does
            onActiveChange={(details) => {
                const branch = branchHolding(details.activeIds[0]);

                setExpanded(branch ? [branch] : []);
            }}
        >
            <TableOfContentsComponent.Content {...panelProps}>
                {documentOf(treeReadingOrder)}
            </TableOfContentsComponent.Content>

            <TableOfContentsComponent.Nav>
                <TableOfContentsComponent.Title>On this page</TableOfContentsComponent.Title>
                <SectionTree expanded={expanded} onExpandedChange={setExpanded} />
            </TableOfContentsComponent.Nav>
        </TableOfContentsComponent>
    );
};

const treeSetup = `${panelSetup}

// The sections in the order the document is written in, which is the order the headings are met in
const readingOrder = sections.flatMap((section) => [section, ...section.children]);

const [expanded, setExpanded] = React.useState([sections[0].value]);`;

const treeCode = `<TableOfContents
    items={readingOrder}
    onActiveChange={(details) => {
        const branch = branchHolding(details.activeIds[0]);

        setExpanded(branch ? [branch] : []);
    }}
>
    <TableOfContents.Content className={panel} tabIndex={0} aria-label="Documentation">
        <Stack gap="spacious">
            {readingOrder.map((section) => {
                const Tag = section.depth >= 3 ? "h3" : "h2";

                return (
                    <Stack as="section" key={section.value} gap="condensed">
                        <Tag id={section.value}>{section.label}</Tag>
                        <SkeletonText lines={section.lines} />
                    </Stack>
                );
            })}
        </Stack>
    </TableOfContents.Content>

    <TableOfContents.Nav>
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <SectionTree expanded={expanded} onExpandedChange={setExpanded} />
    </TableOfContents.Nav>
</TableOfContents>`;

// The tree itself, which reads where the reader is and the way to a heading from the contents
// around it rather than being handed either again
const treeComponentCode = `const SectionTree = ({ expanded, onExpandedChange }) => {
    const { ids, activeIds, scrollTo } = useTableOfContentsContext();

    const reached = activeIds?.[0];

    const toggle = (value, isOpen) =>
        onExpandedChange(isOpen ? [...expanded, value] : expanded.filter((one) => one !== value));

    return (
        <TreeView aria-labelledby={ids?.title}>
            {sections.map((section) => (
                <TreeView.Item
                    key={section.value}
                    id={section.value}
                    current={section.value === reached}
                    expanded={expanded.includes(section.value)}
                    onExpandedChange={(isOpen) => toggle(section.value, isOpen)}
                    onSelect={() => scrollTo?.(section.value)}
                >
                    {section.label}
                    <TreeView.SubTree>
                        {section.children.map((child) => (
                            <TreeView.Item
                                key={child.value}
                                id={child.value}
                                current={child.value === reached}
                                onSelect={() => scrollTo?.(child.value)}
                            >
                                {child.label}
                            </TreeView.Item>
                        ))}
                    </TreeView.SubTree>
                </TreeView.Item>
            ))}
        </TreeView>
    );
};`;

// The contents as they are reached for, drawn and written out one above the other. The plainest one
// comes first, then the shape most documents actually have, then which side the list stands on,
// then who is holding where the reader is, and last the two ways of drawing the list yourself
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The document on one hand and the shape of it on the other. The headings are named to the contents rather than to the list, since which headings the document is made of belongs to the document rather than to any one line drawn from it — and the lines would otherwise each be watching the page and disagreeing about where the reader is. The document is watched rather than measured on every scroll, so a page of a hundred headings costs nothing between the times the reader passes one. The line the reader is under is drawn as reached rather than as picked, and the bar beside it says how far the section runs.",
        setup: sectionsSetup(defaultSections),
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Headings at more than one level",
        description:
            "Which is the shape most documents are. A heading standing under another is stepped in from it, so a glance down the list says which belong to which. How deep a heading sits is counted the way the tags are — 2 for an h2, 3 for an h3 — and an h2 is where the stepping starts from, since that is the shallowest a page ordinarily has under its title.",
        setup: sectionsSetup(nestedSections),
        preview: nestedPreview,
        code: nestedCode,
    },
    {
        name: "Which side the contents stand on",
        description:
            "Said rather than left to the order the parts were written in, so the same markup serves a page laid out either way. Where there is no room to stand beside the document at all, the contents are read before it rather than beside it and give up standing still: a bar across the top of a page already short of room is room spent on the way somewhere rather than on being there.",
        setup: sectionsSetup(placementSections),
        preview: placementPreview,
        code: placementCode,
    },
    {
        name: "Where the reader is, held by the caller",
        description:
            "The contents stop working it out for themselves and say whatever they are told, which is what lets a control of the caller's own stand in for following the page. Picking a heading has to move the page as well as say where the reader is: saying it alone would leave the list pointing at a section the reader had not been taken to, and the first turn of the wheel would put it back. More than one heading can stand within the band at once, so what comes back is a list; a select names one section, and the first of a run is the one it keeps.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "A nav of the caller's own",
        description:
            "Drawn from the hook rather than from the parts. The hook is everything the contents need to follow a reader down a document and nothing that draws them, so a shape laid out by hand follows the same document the parts do. The article hands back what it came out as, so the headings are watched within it rather than within the window it happens to be standing in.",
        setup: hookSetup,
        preview: <HookPreview />,
        code: hookCode,
    },
    {
        name: "The contents read as a tree",
        description:
            "For a document whose sections hold sections of their own. The rows nest the way the headings do rather than being stepped in by hand, and the branch the reader is in opens as they arrive at it — so the shape of the tree says where they are as much as the row drawn as current does. The tree stands among the parts, so it reads where the reader is and the way to a heading from the contents around it. A row goes to its heading when it is picked rather than carrying a link of its own, since a tree answers the pointer and the keyboard itself and a link inside a row would be a second thing to reach in a place that holds one.",
        setup: treeSetup,
        preview: <TreePreview />,
        code: `${treeComponentCode}\n\n${treeCode}`,
    },
];

// A heading of the document, named by the id it carries and by how deep it sits
const itemData = "{ value: string; depth: number }";

// How the page moves when a line is followed
const scrollBehavior = '"auto" | "instant" | "smooth"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What every part takes to be drawn as something else. The parts are polymorphic to a one, so it
// is the same prop saying the same thing under each of them
const polymorphic = (element: string) => ({
    name: "as",
    type: "React.ElementType",
    default: `"${element}"`,
    description: `The element or component the part is drawn as, in place of its default`,
});

// Every prop the contents take, and then the parts they are drawn from.
//
// What the contents are made of comes first, then who is holding where the reader is, then how
// closely the document is watched, and last how the page moves when a line is followed
const groups: ComponentPropGroup[] = [
    {
        name: "TableOfContents",
        props: [
            {
                name: "items",
                type: `${itemData}[]`,
                description:
                    "The headings the contents are drawn from, in the order the document puts them in. A heading is named by the id it carries in the document, which is also what the line points at, and by how deep it sits — counted the way the tags are, so 2 for an h2",
            },
            {
                name: "activeIds",
                type: "string[]",
                description:
                    "The headings held as being on screen, where the caller keeps hold of that. Contents held this way say whatever they are told rather than working it out, which is what lets a control of the caller's own stand in for following the page",
            },
            {
                name: "defaultActiveIds",
                type: "string[]",
                description:
                    "The headings on screen before the document has been watched, for contents that should not start blank",
            },
            {
                name: "onActiveChange",
                type: "(details: { activeIds: string[]; activeItems: TableOfContentsItemData[] }) => void",
                description:
                    "Called whenever the headings on screen change, with the ones that now are. More than one heading can be on screen at once, so it is a list rather than a single one, in the order the document puts them in",
            },
            {
                name: "rootMargin",
                type: "string",
                default: '"-20px 0% -40% 0%"',
                description:
                    "How much of the scrolled area counts as being read, written the way a margin for an IntersectionObserver is. The band is held near the top: a little off the top edge so a heading that has only just come in is not read as arrived at, and a long way off the bottom so a heading at the foot of the page is not read as arrived at until the reader has got to it",
            },
            {
                name: "threshold",
                type: "number | number[]",
                default: "0",
                description:
                    "How much of a heading has to be within that band before it counts. Nought means a single pixel of it is enough",
            },
            {
                name: "scrollElement",
                type: "HTMLElement | null",
                description:
                    "The element the document is scrolled in. Where the contents carry a Content part this is taken from it, and where the whole window scrolls there is none to take — a caller who says so by handing null is taken at their word",
            },
            {
                name: "scrollBehavior",
                type: scrollBehavior,
                default: '"smooth"',
                description:
                    "How the page moves when a line is followed, and how the list moves to keep up",
            },
            {
                name: "autoScroll",
                type: "boolean",
                default: "true",
                description:
                    "Keeps the line the reader is under in view as the document moves under them, for a list long enough to be scrolled in its own right. Only the first of a run is followed: the rest come up behind it of their own accord",
            },
            polymorphic("div"),
            styling,
        ],
    },
    {
        name: "TableOfContents.Content",
        props: [
            polymorphic("article"),
            styling,
            {
                name: "...element props",
                type: 'React.ComponentPropsWithoutRef<"article">',
                description:
                    "The document the contents are drawn from. It is a part rather than something the caller keeps aside, since what the document is scrolled in is what the headings have to be watched against: a heading is on screen when it is within the panel it is read in, not within the window that panel happens to stand in. It hands what it came out as back to the contents alongside whatever ref the caller asked for",
            },
        ],
    },
    {
        name: "TableOfContents.Nav",
        props: [
            {
                name: "placement",
                type: '"start" | "end"',
                description:
                    "Which side of the document the nav stands on. Left out, the parts are laid out in the order they are written",
            },
            polymorphic("nav"),
            styling,
            {
                name: "...element props",
                type: 'React.ComponentPropsWithoutRef<"nav">',
                description:
                    "A landmark rather than a plain box, since a reader working through the page by its regions is looking for the ways out of the section they are in and this is the whole of them. It is named by the title where there is one and left to be named by the caller where there is not, so it is never left pointing at a heading that was never drawn",
            },
        ],
    },
    {
        name: "TableOfContents.Title",
        props: [
            polymorphic("h2"),
            styling,
            {
                name: "...element props",
                type: 'React.ComponentPropsWithoutRef<"h2">',
                description:
                    "What names the list. A heading rather than a label, since it stands over the list the way any other heading stands over what follows it, and a reader working down the headings of the page meets it where they would expect to",
            },
        ],
    },
    {
        name: "TableOfContents.List",
        props: [
            polymorphic("ul"),
            styling,
            {
                name: "...element props",
                type: 'React.ComponentPropsWithoutRef<"ul">',
                description:
                    "The lines themselves, read down. A list rather than a run of links, so a reader is told how many headings the page has before they start down it. The rail the bar runs against is drawn by this rather than by a part of its own, since there is nothing on it to reach for",
            },
        ],
    },
    {
        name: "TableOfContents.Item",
        props: [
            {
                name: "item",
                type: itemData,
                required: true,
                description:
                    "The heading this line stands for. How deep it sits is written onto the line as well as stepping it in, so a page that would rather draw the levels some other way has the level to draw from",
            },
            polymorphic("li"),
            styling,
            {
                name: "...element props",
                type: 'React.ComponentPropsWithoutRef<"li">',
                description:
                    "Whether the reader is under this heading is said here as well as on the link, so a line carrying more than a link — a number, a rule, a progress ring — is drawn as reached without every one of those having to be told separately",
            },
        ],
    },
    {
        name: "TableOfContents.Link",
        props: [
            polymorphic("a"),
            styling,
            {
                name: "...element props",
                type: 'React.ComponentPropsWithoutRef<"a">',
                description:
                    "The way to a heading. It takes the heading it points at from the item around it rather than being handed it again, so the two cannot come apart. It is a link and goes on being one: it carries an href, it can be opened in a tab of its own, and a press asking for anything other than a jump down this page is left to the browser. Where the document is scrolled inside a panel the jump is made by hand and the heading written into the address bar afterwards, since the browser's own jump would drag the whole page about",
            },
        ],
    },
    {
        name: "TableOfContents.Indicator",
        props: [
            polymorphic("div"),
            styling,
            {
                name: "...element props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "What is drawn against the part of the list the reader is in. It is measured rather than told where to stand, so it covers a run of headings as readily as it covers one, and it is measured against the list rather than the window so scrolling the list does not drag it off the lines it is drawn against",
            },
        ],
    },
];

// What the hook answers with, and the two things it is reached for beside the parts. Neither is a
// component, so neither has a table of its own
const hookGroups: ComponentPropGroup[] = [
    {
        name: "useTableOfContents",
        props: [
            {
                name: "…",
                type: "UseTableOfContentsProps",
                description:
                    "Everything the contents themselves take but for what draws them: the headings, where the reader is, how closely the document is watched, and how the page moves when a heading is gone to",
            },
            {
                name: "activeIds",
                type: "string[]",
                description:
                    "The ids of the headings on screen, in the order the document puts them in",
            },
            {
                name: "activeItems",
                type: `${itemData}[]`,
                description: "The same headings, as the items they were given as",
            },
            {
                name: "setActiveIds",
                type: "(activeIds: string[]) => void",
                description:
                    "Says where the reader is, for a caller moving the page some other way than by the links",
            },
            {
                name: "scrollTo",
                type: "(value: string, details?: { behavior?: ScrollBehavior }) => boolean",
                description:
                    "Brings a heading to the top of whatever is scrolled. Answers whether there was a heading to go to, so a link that could not be followed is left to the browser",
            },
            {
                name: "getItemState",
                type: `(item: ${itemData}) => { active: boolean; first: boolean; last: boolean; depth: number }`,
                description:
                    "What a line stands as, for a list a caller is drawing themselves: whether the heading it stands for is on screen, whether it is the first or the last of the ones that are, and how deep it sits",
            },
        ],
    },
    {
        name: "useTableOfContentsContext",
        props: [
            {
                name: "…",
                type: "TableOfContentsContextValue",
                description:
                    "Everything the hook answers with, read from the contents a part is standing in rather than set up again. It is what lets a nav of the caller's own — a tree, a set of steps — stand among the parts and follow the same document without being handed anything",
            },
        ],
    },
    {
        name: "scrollToHeading",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description: "The id of the heading to go to",
            },
            {
                name: "options",
                type: "{ scrollElement?: HTMLElement | null; behavior?: ScrollBehavior }",
                description:
                    "Where the document is scrolled and how it should move. Without an element the browser's own way of getting there is used; with one the jump is worked out by hand, since scrolling the element into view would carry the window along with it. Whatever room the page asks to be left above a heading it has been scrolled to is left, so a heading does not come to rest under a bar standing over it",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the contents are is said on the page itself, beside the examples they are
// reached for in and the props they take.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const TableOfContents = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                TableOfContents
            </Heading>
            <Text as="p" size="large">
                A document laid out beside the shape of it: the headings it is made of, which of
                them the reader is under, and a line to each one. The headings are named to the
                contents rather than to the list, so every line is drawn from the one answer rather
                than each watching the page and disagreeing about where the reader is. The document
                is watched rather than measured on every scroll, so a page of a hundred headings
                costs nothing between the times a reader passes one. What the document is scrolled
                in is taken from the content where there is one, so a page whose window does the
                scrolling and a page scrolled inside a panel are written the same way. Everything
                that follows the reader is in a hook of its own, so a nav laid out by hand — a tree,
                a select, a set of steps — is no less a table of contents than one built out of the
                parts.
            </Text>
        </Stack>
        <ComponentExamples component="TableOfContents" examples={examples} />
        <ComponentProps groups={[...groups, ...hookGroups]} />
    </Stack>
);

export default TableOfContents;
