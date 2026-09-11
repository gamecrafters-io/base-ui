import {
    BranchRegular,
    ChevronDownRegular,
    DataTrendingRegular,
    EditRegular,
    FlowRegular,
    MergeRegular,
    MoreHorizontalRegular,
    PanelLeftExpandRegular,
    SettingsRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Breadcrumbs,
    Button,
    Heading,
    Hidden,
    IconButton,
    Label,
    Link,
    PageHeader as PageHeaderComponent,
    Stack,
    StateLabel,
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
    // A line about the page is read after the title rather than alongside it, so it is set in the
    // quieter of the two text colours
    muted: "text-[var(--foreground-color-muted)]",
    // Whoever the line is about is named in it, and stands out from the rest of what it says
    strong: "font-[var(--base-text-weight-semibold)]",
    // The links between the views of a page are written as a list, since that is what they are,
    // and drawn as a row, so the marks and the room a list is given are taken back off
    navigation: "flex gap-[var(--base-size-8)] m-0 p-0 list-none",
};

// What an example has to have in hand before it can be drawn, written out for the examples that
// reach for it. A line about the page takes the quieter colour and the weight the name inside it
// stands out by; the navigation takes the row its links are drawn in
const descriptionSetup = `const muted = "text-[var(--foreground-color-muted)]";
const strong = "font-[var(--base-text-weight-semibold)]";`;

const navigationSetup = `const navigation = "flex gap-[var(--base-size-8)] m-0 p-0 list-none";`;

// The header at its plainest: a title area with the title standing in it. Nothing is said with a
// prop, so the title is drawn at the size a static page title takes and written as a second-level
// heading, and nothing is drawn beneath the header.
//
// The library's own stories give every header the banner role and a name. The ones on this page
// are left as plain boxes, since the page already has a banner of its own in the row across the
// top, and a dozen more would leave a screen reader with no way to tell which of them heads it.
//
// The page and the component it is about are both called PageHeader, so the component is brought
// in under a name saying which of the two it is. The listing beneath says PageHeader, as an
// application importing it would
const defaultPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.Title>Branches</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
    </PageHeaderComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.Title>Branches</PageHeader.Title>
    </PageHeader.TitleArea>
</PageHeader>`;

// The three sizes the title is drawn at, largest first. The size is asked for by the title area
// but read by the whole header, so each of these is a header of its own rather than three titles
// standing in the one
const sizesPreview = (
    <Stack gap="spacious">
        <PageHeaderComponent>
            <PageHeaderComponent.TitleArea variant="large">
                <PageHeaderComponent.Title>Document the page header</PageHeaderComponent.Title>
            </PageHeaderComponent.TitleArea>
        </PageHeaderComponent>
        <PageHeaderComponent>
            <PageHeaderComponent.TitleArea variant="medium">
                <PageHeaderComponent.Title>Branches</PageHeaderComponent.Title>
            </PageHeaderComponent.TitleArea>
        </PageHeaderComponent>
        <PageHeaderComponent>
            <PageHeaderComponent.TitleArea variant="subtitle">
                <PageHeaderComponent.Title>Protected branches</PageHeaderComponent.Title>
            </PageHeaderComponent.TitleArea>
        </PageHeaderComponent>
    </Stack>
);

const sizesCode = `<Stack gap="spacious">
    <PageHeader>
        <PageHeader.TitleArea variant="large">
            <PageHeader.Title>Document the page header</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
    <PageHeader>
        <PageHeader.TitleArea variant="medium">
            <PageHeader.Title>Branches</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
    <PageHeader>
        <PageHeader.TitleArea variant="subtitle">
            <PageHeader.Title>Protected branches</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
</Stack>`;

// A size for each viewport range, for a title the reader wrote that comes down a size where there
// is less room for it. Wide is left unsaid, so the size the regular range asks for runs on through
// it
const responsiveSizePreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea variant={{ narrow: "medium", regular: "large" }}>
            <PageHeaderComponent.Title>Document the page header</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
    </PageHeaderComponent>
);

const responsiveSizeCode = `<PageHeader>
    <PageHeader.TitleArea variant={{ narrow: "medium", regular: "large" }}>
        <PageHeader.Title>Document the page header</PageHeader.Title>
    </PageHeader.TitleArea>
</PageHeader>`;

// Something either side of the title: a mark before it saying what kind of page this is, and a
// label after it saying what state the page is in. Both are kept on every viewport, and both stand
// as tall as the line the title is drawn on, so they sit level with it whatever size it takes
const visualsPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.LeadingVisual>
                <MergeRegular />
            </PageHeaderComponent.LeadingVisual>
            <PageHeaderComponent.Title>Merge queue</PageHeaderComponent.Title>
            <PageHeaderComponent.TrailingVisual>
                <Label>Beta</Label>
            </PageHeaderComponent.TrailingVisual>
        </PageHeaderComponent.TitleArea>
    </PageHeaderComponent>
);

const visualsCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.LeadingVisual>
            <MergeRegular />
        </PageHeader.LeadingVisual>
        <PageHeader.Title>Merge queue</PageHeader.Title>
        <PageHeader.TrailingVisual>
            <Label>Beta</Label>
        </PageHeader.TrailingVisual>
    </PageHeader.TitleArea>
</PageHeader>`;

// What can be done to the page, at the far end of the title row on every viewport. The actions are
// never squeezed narrower than they need to be, whatever the title beside them runs to
const actionsPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.Title>Roadmap</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.Actions>
            <IconButton aria-label="Workflows" icon={FlowRegular} />
            <IconButton aria-label="Insights" icon={DataTrendingRegular} />
            <Button variant="primary" trailingVisual={ChevronDownRegular}>
                Add item
            </Button>
            <IconButton aria-label="Settings" icon={SettingsRegular} />
        </PageHeaderComponent.Actions>
    </PageHeaderComponent>
);

const actionsCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.Title>Roadmap</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.Actions>
        <IconButton aria-label="Workflows" icon={FlowRegular} />
        <IconButton aria-label="Insights" icon={DataTrendingRegular} />
        <Button variant="primary" trailingVisual={ChevronDownRegular}>
            Add item
        </Button>
        <IconButton aria-label="Settings" icon={SettingsRegular} />
    </PageHeader.Actions>
</PageHeader>`;

// An action standing before the title, such as a way to open the pane beside it, and one standing
// right after it, such as a way to edit it. Both are only drawn from the regular range up unless
// they are told otherwise, since a narrow viewport has the parent link above the title for the way
// back instead.
//
// They are written after the title area and drawn either side of it, since where each region
// stands is settled by the header's grid rather than by the order it was written in
const sideActionsPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.Title>Design system</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.LeadingAction>
            <IconButton
                aria-label="Expand sidebar"
                icon={PanelLeftExpandRegular}
                variant="invisible"
            />
        </PageHeaderComponent.LeadingAction>
        <PageHeaderComponent.TrailingAction>
            <IconButton aria-label="Edit title" icon={EditRegular} variant="invisible" />
        </PageHeaderComponent.TrailingAction>
    </PageHeaderComponent>
);

const sideActionsCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.Title>Design system</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.LeadingAction>
        <IconButton aria-label="Expand sidebar" icon={PanelLeftExpandRegular} variant="invisible" />
    </PageHeader.LeadingAction>
    <PageHeader.TrailingAction>
        <IconButton aria-label="Edit title" icon={EditRegular} variant="invisible" />
    </PageHeader.TrailingAction>
</PageHeader>`;

// A line about the page beneath the title, kept on every viewport. It is read as body text rather
// than at the size of the title above it, and lays out what it holds in a row, so a label saying
// what state the page is in can lead the line.
//
// The title is one the reader wrote, which is what the large size is for
const descriptionPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea variant="large">
            <PageHeaderComponent.Title>Document the page header</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.Description>
            <StateLabel status="pullOpened">Open</StateLabel>
            <Text className={classes.muted}>
                <Link href="#" className={classes.strong}>
                    monalisa
                </Link>{" "}
                wants to merge 3 commits into <Link href="#">main</Link> from{" "}
                <Link href="#">monalisa/page-header</Link>
            </Text>
        </PageHeaderComponent.Description>
    </PageHeaderComponent>
);

const descriptionCode = `<PageHeader>
    <PageHeader.TitleArea variant="large">
        <PageHeader.Title>Document the page header</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.Description>
        <StateLabel status="pullOpened">Open</StateLabel>
        <Text className={muted}>
            <Link href="#" className={strong}>
                monalisa
            </Link>{" "}
            wants to merge 3 commits into <Link href="#">main</Link> from{" "}
            <Link href="#">monalisa/page-header</Link>
        </Text>
    </PageHeader.Description>
</PageHeader>`;

// Links between the views of whatever the page is about, beneath everything else in the header and
// kept on every viewport. The link standing for the view being read says so
const navigationPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea variant="large">
            <PageHeaderComponent.Title>Document the page header</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.Navigation>
            <ul className={classes.navigation}>
                <li>
                    <Link href="#" aria-current="page">
                        Conversation
                    </Link>
                </li>
                <li>
                    <Link href="#">Commits</Link>
                </li>
                <li>
                    <Link href="#">Checks</Link>
                </li>
                <li>
                    <Link href="#">Files changed</Link>
                </li>
            </ul>
        </PageHeaderComponent.Navigation>
    </PageHeaderComponent>
);

const navigationCode = `<PageHeader>
    <PageHeader.TitleArea variant="large">
        <PageHeader.Title>Document the page header</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.Navigation>
        <ul className={navigation}>
            <li>
                <Link href="#" aria-current="page">
                    Conversation
                </Link>
            </li>
            <li>
                <Link href="#">Commits</Link>
            </li>
            <li>
                <Link href="#">Checks</Link>
            </li>
            <li>
                <Link href="#">Files changed</Link>
            </li>
        </ul>
    </PageHeader.Navigation>
</PageHeader>`;

// The navigation drawn as a nav element, so a reader moving by landmark arrives at it. A landmark
// has to be named, and the navigation's types will not take one that is not
const landmarkPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea variant="large">
            <PageHeaderComponent.Title>Document the page header</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.Navigation as="nav" aria-label="Pull request">
            <ul className={classes.navigation}>
                <li>
                    <Link href="#" aria-current="page">
                        Conversation
                    </Link>
                </li>
                <li>
                    <Link href="#">Commits</Link>
                </li>
            </ul>
        </PageHeaderComponent.Navigation>
    </PageHeaderComponent>
);

const landmarkCode = `<PageHeader>
    <PageHeader.TitleArea variant="large">
        <PageHeader.Title>Document the page header</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.Navigation as="nav" aria-label="Pull request">
        <ul className={navigation}>
            <li>
                <Link href="#" aria-current="page">
                    Conversation
                </Link>
            </li>
            <li>
                <Link href="#">Commits</Link>
            </li>
        </ul>
    </PageHeader.Navigation>
</PageHeader>`;

// Where in the site the reader is, said above the title: the way back up to the page this one
// belongs to, and what can be done from there at the far end of the row.
//
// The context area and every part inside it are only drawn on a narrow viewport unless they are
// told otherwise, so each of them is told to stand on every viewport here, where it can be seen at
// whatever width this page is read at. An application would leave them to their defaults
const parentLinkPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.Title>page-header</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.ContextArea hidden={false}>
            <PageHeaderComponent.ParentLink href="#" hidden={false}>
                components
            </PageHeaderComponent.ParentLink>
            <PageHeaderComponent.ContextAreaActions hidden={false}>
                <Button size="small" trailingAction={ChevronDownRegular}>
                    Add file
                </Button>
                <IconButton size="small" aria-label="More options" icon={MoreHorizontalRegular} />
            </PageHeaderComponent.ContextAreaActions>
        </PageHeaderComponent.ContextArea>
    </PageHeaderComponent>
);

const parentLinkCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.Title>page-header</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.ContextArea hidden={false}>
        <PageHeader.ParentLink href="#" hidden={false}>
            components
        </PageHeader.ParentLink>
        <PageHeader.ContextAreaActions hidden={false}>
            <Button size="small" trailingAction={ChevronDownRegular}>
                Add file
            </Button>
            <IconButton size="small" aria-label="More options" icon={MoreHorizontalRegular} />
        </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
</PageHeader>`;

// A trail of breadcrumbs above the title in place of the parent link, which is what the context bar
// is kept for. It is placed after the parent link and before the actions whatever order the three
// are written in, and it is told to stand on every viewport here for the same reason the context
// area around it is
const contextBarPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.Title>PageHeader.tsx</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.ContextArea hidden={false}>
            <PageHeaderComponent.ContextBar hidden={false}>
                <Breadcrumbs>
                    <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#">page-header</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#" selected>
                        PageHeader.tsx
                    </Breadcrumbs.Item>
                </Breadcrumbs>
            </PageHeaderComponent.ContextBar>
            <PageHeaderComponent.ContextAreaActions hidden={false}>
                <Button size="small" leadingVisual={BranchRegular}>
                    main
                </Button>
                <IconButton size="small" aria-label="More options" icon={MoreHorizontalRegular} />
            </PageHeaderComponent.ContextAreaActions>
        </PageHeaderComponent.ContextArea>
    </PageHeaderComponent>
);

const contextBarCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.Title>PageHeader.tsx</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.ContextArea hidden={false}>
        <PageHeader.ContextBar hidden={false}>
            <Breadcrumbs>
                <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">page-header</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#" selected>
                    PageHeader.tsx
                </Breadcrumbs.Item>
            </Breadcrumbs>
        </PageHeader.ContextBar>
        <PageHeader.ContextAreaActions hidden={false}>
            <Button size="small" leadingVisual={BranchRegular}>
                main
            </Button>
            <IconButton size="small" aria-label="More options" icon={MoreHorizontalRegular} />
        </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
</PageHeader>`;

// What an action says, cut down to a word where there is less room for it. The header takes a
// region away one viewport range at a time but says nothing about what stands inside one, so a
// label that changes with the width is two buttons, each hidden on the ranges the other is drawn on
const responsiveActionsPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.Title>Webhooks</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.Actions>
            <Hidden when="narrow">
                <Button variant="primary">New webhook</Button>
            </Hidden>
            <Hidden when={["regular", "wide"]}>
                <Button variant="primary">New</Button>
            </Hidden>
        </PageHeaderComponent.Actions>
    </PageHeaderComponent>
);

const responsiveActionsCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.Title>Webhooks</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.Actions>
        <Hidden when="narrow">
            <Button variant="primary">New webhook</Button>
        </Hidden>
        <Hidden when={["regular", "wide"]}>
            <Button variant="primary">New</Button>
        </Hidden>
    </PageHeader.Actions>
</PageHeader>`;

// A region taken away on the ranges it is not wanted on, which is how the regions only drawn at
// some widths are written in the first place. The mark before the title is drawn on a narrow
// viewport and left out from the regular range up, which runs on through wide
const hiddenRegionPreview = (
    <PageHeaderComponent>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.LeadingVisual hidden={{ regular: true }}>
                <MergeRegular />
            </PageHeaderComponent.LeadingVisual>
            <PageHeaderComponent.Title>Merge queue</PageHeaderComponent.Title>
            <PageHeaderComponent.TrailingVisual>
                <Label>Beta</Label>
            </PageHeaderComponent.TrailingVisual>
        </PageHeaderComponent.TitleArea>
    </PageHeaderComponent>
);

const hiddenRegionCode = `<PageHeader>
    <PageHeader.TitleArea>
        <PageHeader.LeadingVisual hidden={{ regular: true }}>
            <MergeRegular />
        </PageHeader.LeadingVisual>
        <PageHeader.Title>Merge queue</PageHeader.Title>
        <PageHeader.TrailingVisual>
            <Label>Beta</Label>
        </PageHeader.TrailingVisual>
    </PageHeader.TitleArea>
</PageHeader>`;

// A line beneath the header, setting it apart from the page under it
const borderPreview = (
    <PageHeaderComponent hasBorder>
        <PageHeaderComponent.TitleArea>
            <PageHeaderComponent.Title>Branches</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
    </PageHeaderComponent>
);

const borderCode = `<PageHeader hasBorder>
    <PageHeader.TitleArea>
        <PageHeader.Title>Branches</PageHeader.Title>
    </PageHeader.TitleArea>
</PageHeader>`;

// The same line, left off wherever a navigation region is showing, which is taken to draw a line of
// its own. The navigation here is taken away on a narrow viewport, so the line is drawn in its
// place there and nowhere else
const borderNavigationPreview = (
    <PageHeaderComponent hasBorder>
        <PageHeaderComponent.TitleArea variant="large">
            <PageHeaderComponent.Title>Document the page header</PageHeaderComponent.Title>
        </PageHeaderComponent.TitleArea>
        <PageHeaderComponent.Navigation hidden={{ narrow: true }}>
            <ul className={classes.navigation}>
                <li>
                    <Link href="#" aria-current="page">
                        Conversation
                    </Link>
                </li>
                <li>
                    <Link href="#">Commits</Link>
                </li>
            </ul>
        </PageHeaderComponent.Navigation>
    </PageHeaderComponent>
);

const borderNavigationCode = `<PageHeader hasBorder>
    <PageHeader.TitleArea variant="large">
        <PageHeader.Title>Document the page header</PageHeader.Title>
    </PageHeader.TitleArea>
    <PageHeader.Navigation hidden={{ narrow: true }}>
        <ul className={navigation}>
            <li>
                <Link href="#" aria-current="page">
                    Conversation
                </Link>
            </li>
            <li>
                <Link href="#">Commits</Link>
            </li>
        </ul>
    </PageHeader.Navigation>
</PageHeader>`;

// The header as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then how large the title is drawn, then what stands in the title row beside it, then
// what stands around the row, then what changes with the width the header is read at, and last the
// line beneath it
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The header at its plainest: a title area with the title standing in it. Nothing is said with a prop, so the title is drawn at the size a static page title takes and written as a second-level heading, and nothing is drawn beneath the header. The library's own stories give every header the banner role and a name; the ones on this page are left as plain boxes, since the page already has a banner of its own in the row across the top and a dozen more would leave a screen reader with no way to tell which of them heads it.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "How large the title is drawn",
        description:
            "Medium is the size a static page title takes, and what the title area is drawn at when nothing is said. Large is for a title the reader wrote themselves, such as that of an issue or a pull request, and subtitle is the medium size at a normal weight, for a header standing under another title on the page, as one half of a split layout does. The size is asked for by the title area but read by the whole header, so each of these is a header of its own rather than three titles standing in the one.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "A size for each viewport range",
        description:
            "The size said one viewport range at a time, for a title the reader wrote that comes down a size where there is less room for it. Narrow runs up to 768 pixels, regular from there, and wide from 1400; wide is left unsaid here, so the size the regular range asks for runs on through it.",
        preview: responsiveSizePreview,
        code: responsiveSizeCode,
    },
    {
        name: "Visuals either side of the title",
        description:
            "A mark before the title saying what kind of page this is, and a label after it saying what state the page is in. Both are kept on every viewport, and both stand as tall as the line the title is drawn on, so they sit level with it whatever size it takes. They are written inside the title area, which places the three by an order of its own rather than by the order they were written in.",
        preview: visualsPreview,
        code: visualsCode,
    },
    {
        name: "The actions of the page",
        description:
            "What can be done to the page, standing at the far end of the title row on every viewport. The actions are never squeezed narrower than they need to be, whatever the title beside them runs to, and they stand as tall as the line the title is drawn on.",
        preview: actionsPreview,
        code: actionsCode,
    },
    {
        name: "Actions before and after the title",
        description:
            "An action standing before the title, such as a way to open the pane beside it, and one standing right after it, such as a way to edit it. Both are only drawn from the regular range up unless they are told otherwise, since a narrow viewport has the parent link above the title for the way back instead, so on a narrow screen neither is drawn here. They are written after the title area and drawn either side of it, since where each region stands is settled by the header's grid rather than by the order it was written in.",
        preview: sideActionsPreview,
        code: sideActionsCode,
    },
    {
        name: "A line about the page",
        description:
            "A line beneath the title, kept on every viewport. It is read as body text rather than at the size of the title above it, and lays out what it holds in a row, so a label saying what state the page is in can lead the line. The title here is one the reader wrote, which is what the large size is for.",
        setup: descriptionSetup,
        preview: descriptionPreview,
        code: descriptionCode,
    },
    {
        name: "The page's own navigation",
        description:
            "Links between the views of whatever the page is about, beneath everything else in the header and kept on every viewport. It is read as body text rather than at the size of the title, and it is drawn as a plain box unless it is asked to be a landmark.",
        setup: navigationSetup,
        preview: navigationPreview,
        code: navigationCode,
    },
    {
        name: "A navigation landmark",
        description:
            "The navigation drawn as a nav element, so a reader moving by landmark can arrive at it. A landmark has to be named, in its own words or by the id of something already on the page, and the navigation's types will not take one that is not; the plain box it is by default is no landmark and takes no name.",
        setup: navigationSetup,
        preview: landmarkPreview,
        code: landmarkCode,
    },
    {
        name: "The way back up",
        description:
            "Where in the site the reader is, said above the title: the way back up to the page this one belongs to, and what can be done from there at the far end of the row. The context area and every part inside it are only drawn on a narrow viewport unless they are told otherwise, since that is where there is no room for a trail of breadcrumbs, so each of them is told to stand on every viewport here to be seen at whatever width this page is read at. An application would leave them to their defaults.",
        preview: parentLinkPreview,
        code: parentLinkCode,
    },
    {
        name: "A trail above the title",
        description:
            "A trail of breadcrumbs above the title in place of the parent link, which is what the context bar is kept for. The parent link, the bar and the actions are placed in that order whatever order they are written in, and a caller can move one by setting the custom property it is placed by, such as --page-header-context-area-order-context-bar, rather than by rewriting the header. The bar is told to stand on every viewport here for the same reason the context area around it is.",
        preview: contextBarPreview,
        code: contextBarCode,
    },
    {
        name: "An action that changes with the viewport",
        description:
            "What an action says, cut down to a word where there is less room for it. The header takes a region away one viewport range at a time but says nothing about what stands inside one, so a label that changes with the width is two buttons, each hidden on the ranges the other is drawn on.",
        preview: responsiveActionsPreview,
        code: responsiveActionsCode,
    },
    {
        name: "A region taken away on some viewports",
        description:
            "Any region can be taken away outright or only on the ranges it is not wanted on, which is how the regions only drawn at some widths are written in the first place. The mark before the title here is drawn on a narrow viewport and left out from the regular range up, which runs on through wide.",
        preview: hiddenRegionPreview,
        code: hiddenRegionCode,
    },
    {
        name: "A line beneath the header",
        description:
            "A thin rule under the header, with a little room left above it, setting the header apart from the page beneath it.",
        preview: borderPreview,
        code: borderCode,
    },
    {
        name: "A line that gives way to the navigation",
        description:
            "The same line, left off wherever a navigation region is showing, which is taken to draw a line of its own. Whether the navigation is showing is worked out one viewport range at a time, so the navigation here, taken away on a narrow viewport, has the line drawn in its place there and nowhere else.",
        setup: navigationSetup,
        preview: borderNavigationPreview,
        code: borderNavigationCode,
    },
];

// Which viewport ranges a region is drawn on, said outright or one range at a time
const hiddenType = "boolean | ResponsiveValue<boolean>";

// How large the title is drawn
const titleVariant = '"subtitle" | "medium" | "large"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Whether a region is drawn at all. Most regions are drawn on every viewport until they are told
// otherwise, so this is the prop as most of them take it
const hidden = {
    name: "hidden",
    type: hiddenType,
    default: "false",
    description:
        "Whether the region is left out. It can be said one viewport range at a time, so a region can be there on a wide screen and gone on a narrow one without the header being written twice",
};

// The same prop, for the context area and the parts inside it, which are only drawn on a narrow
// viewport until they are told otherwise
const hiddenUnlessNarrow = {
    name: "hidden",
    type: hiddenType,
    default: "{ narrow: false, regular: true, wide: true }",
    description:
        "Whether the part is left out. The context area and every part inside it are only drawn on a narrow viewport by default, each by a default of its own, so a context area drawn everywhere wants each part inside it told the same",
};

// And for the actions either side of the title, which are only drawn from the regular range up
// until they are told otherwise
const hiddenWhenNarrow = {
    name: "hidden",
    type: hiddenType,
    default: "{ narrow: true, regular: false, wide: false }",
    description:
        "Whether the action is left out. It is only drawn from the regular range up by default, since a narrow viewport has the parent link above the title for the way back instead",
};

// Every prop the header and its regions take, under the part that takes it. The header comes first,
// then the regions in the order they are drawn down it: the context area and its parts above the
// title, the title row and what stands in it, and the description and the navigation beneath.
//
// Every region is a box that can be taken away one viewport range at a time, so most of them take
// nothing but that and a class name; what a region is for is said by where it stands
const groups: ComponentPropGroup[] = [
    {
        name: "PageHeader",
        props: [
            {
                name: "hasBorder",
                type: "boolean",
                default: "false",
                description:
                    "Draws a line beneath the header. It is left off wherever a navigation region is showing, which is taken to draw a line of its own, and that is worked out one viewport range at a time, so a navigation taken away on a narrow screen has the line drawn in its place there",
            },
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description:
                    "The element or component the header is drawn as, in place of the box it is by default. The regions are placed by the header's own grid, so how they are laid out does not change with it",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The regions the header is built from. The size the title area asks for and whether a navigation is showing are read off them to lay the header out, so they are written directly inside it, or inside a fragment standing there, rather than further down inside a component of the caller's own",
            },
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "Anything else the element it is drawn as takes, such as the banner role and a name for a header that is to be reached as a landmark",
            },
        ],
    },
    {
        name: "PageHeader.ContextArea",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The parent link, the context bar and the actions at the far end, placed in that order whatever order they are written in. Each is placed by a custom property of its own — --page-header-context-area-order-parent-link, --page-header-context-area-order-context-bar and --page-header-context-area-order-context-area-actions — so a caller can move one without rewriting the area",
            },
            hiddenUnlessNarrow,
            styling,
        ],
    },
    {
        name: "PageHeader.ParentLink",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The name of the page the link leads back to. The arrow pointing back is drawn before it by the link itself, which is drawn in the quieter colour a muted link takes",
            },
            {
                name: "as",
                type: "React.ElementType",
                default: '"a"',
                description:
                    "The element or component the link is drawn as, in place of the anchor it is by default. It is what a link built on a router's own link is given, so that following it redraws the page rather than asking the server for another one",
            },
            hiddenUnlessNarrow,
            styling,
        ],
    },
    {
        name: "PageHeader.ContextBar",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Whatever stands above the title in place of the parent link, such as a trail of breadcrumbs of the caller's own",
            },
            hiddenUnlessNarrow,
            styling,
        ],
    },
    {
        name: "PageHeader.ContextAreaActions",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The actions standing at the far end of the context area. They take whatever room the rest of the area leaves, which is what carries them to the end of it",
            },
            hiddenUnlessNarrow,
            styling,
        ],
    },
    {
        name: "PageHeader.TitleArea",
        props: [
            {
                name: "variant",
                type: `${titleVariant} | ResponsiveValue<${titleVariant}>`,
                default: '"medium"',
                description:
                    "How large the title is drawn. Medium is the size a static page title takes, large is for a title the reader wrote, such as an issue or a pull request, and subtitle is the medium size at a normal weight, for a header standing under another title on the page. It is read by the whole header, so the visuals and the actions stand as tall as the line the title is drawn on, and a caller's own --page-header-font-size, --page-header-font-weight and --page-header-line-height win over it",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The title and the visuals either side of it, placed with the leading visual first and the trailing visual last whatever order they are written in",
            },
            hidden,
            styling,
        ],
    },
    {
        name: "PageHeader.LeadingAction",
        props: [hiddenWhenNarrow, styling],
    },
    {
        name: "PageHeader.Breadcrumbs",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "A trail of breadcrumbs standing in the title row before the title, read as body text rather than at the size of the title",
            },
            hidden,
            styling,
        ],
    },
    {
        name: "PageHeader.LeadingVisual",
        props: [hidden, styling],
    },
    {
        name: "PageHeader.Title",
        props: [
            {
                name: "as",
                type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"',
                default: '"h2"',
                description:
                    "The heading level the title is written as. It is drawn at the size the title area asks for whichever level it is, so the level is chosen by where the header stands in the outline of the page rather than by how large it should look",
            },
            hidden,
            styling,
        ],
    },
    {
        name: "PageHeader.TrailingVisual",
        props: [hidden, styling],
    },
    {
        name: "PageHeader.TrailingAction",
        props: [hiddenWhenNarrow, styling],
    },
    {
        name: "PageHeader.Actions",
        props: [hidden, styling],
    },
    {
        name: "PageHeader.Description",
        props: [hidden, styling],
    },
    {
        name: "PageHeader.Navigation",
        props: [
            {
                name: "as",
                type: '"div" | "nav"',
                default: '"div"',
                description:
                    "The element the navigation is drawn as. A nav is a landmark and has to be named with aria-label or aria-labelledby, and the types will not take one that is not; the box it is by default is no landmark and takes neither",
            },
            {
                name: "aria-label",
                type: "string",
                description: "What the landmark is called, where the navigation is drawn as a nav",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The id of something already on the page that names the landmark, in place of a name of its own",
            },
            hidden,
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the header is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const PageHeader = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                PageHeader
            </Heading>
            <Text as="p" size="large">
                The region at the top of a page that names it: the title, what stands either side of
                it, and the context, the description and the navigation around it. Every region is
                placed by the header's own grid rather than by the order it was written in, so the
                title area can be written first and read first even where something is drawn above
                it or ahead of it. The size the title area asks for is read by the whole header, so
                the visuals and the actions beside the title are drawn to the line it stands on.
                What is shown changes with the width the header is read at: the context area, with
                the way back up or a trail of breadcrumbs, is only drawn above the title on a narrow
                viewport, the actions either side of the title only on a wider one, and any region
                can be taken away outright or one viewport range at a time.
            </Text>
        </Stack>
        <ComponentExamples component="PageHeader" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default PageHeader;
