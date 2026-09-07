import * as React from "react";
import {
    Button,
    Heading,
    Stack,
    Tabs as TabsComponent,
    Text,
    useTab,
    useTabList,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The tablist runs the width of whatever it is put in, so the page gives it a column to run
    // rather than the whole width of the card
    preview: "w-full max-w-[28rem]",
    // A tablist standing beside the panels takes a width of its own instead of running across
    sidebar: "w-[10rem] shrink-0",
    // The panels beside it take what is left, and are allowed to be narrower than what they hold
    panels: "min-w-0",
    muted: "text-[var(--foreground-color-muted)]",
};

// What the tabs on this page are showing. It is written once and read out into a tab and a panel
// apiece, since a set of sections is come by as a list rather than typed out one tab at a time
const sections = [
    {
        value: "overview",
        label: "Overview",
        body: "Everything that has happened on the repository over the last week.",
    },
    {
        value: "issues",
        label: "Issues",
        body: "Twelve issues are open, four of them raised since Friday.",
    },
    {
        value: "pull-requests",
        label: "Pull requests",
        body: "Three pull requests are waiting on a review from you.",
    },
];

// What the examples have to have in hand before they can be drawn. It is written once and reached
// for by each of them rather than run out along a line that would then have to be read across
const sectionsSetup = `const sections = [
    {
        value: "overview",
        label: "Overview",
        body: "Everything that has happened on the repository over the last week.",
    },
    {
        value: "issues",
        label: "Issues",
        body: "Twelve issues are open, four of them raised since Friday.",
    },
    {
        value: "pull-requests",
        label: "Pull requests",
        body: "Three pull requests are waiting on a review from you.",
    },
];`;

// The plainest tabs there are: a row of them, and a panel apiece. What ties a tab to its panel is
// the value they share, so the two are written apart and found by each other rather than nested.
//
// Nothing is handed the selection to hold, so the tabs keep it themselves; one of them is named as
// the tab to start on, since a tablist with nothing selected has nothing for the keyboard to land
// on.
//
// The page and the component it is about are both called Tabs, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Tabs, as an application importing
// it would
const defaultPreview = (
    <Stack gap="normal" className={classes.preview}>
        <TabsComponent defaultValue="overview">
            <TabsComponent.List aria-label="Repository">
                {sections.map((section) => (
                    <TabsComponent.Tab key={section.value} value={section.value}>
                        {section.label}
                    </TabsComponent.Tab>
                ))}
            </TabsComponent.List>
            {sections.map((section) => (
                <TabsComponent.Panel key={section.value} value={section.value}>
                    <Text>{section.body}</Text>
                </TabsComponent.Panel>
            ))}
        </TabsComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Tabs defaultValue="overview">
    <Tabs.List aria-label="Repository">
        {sections.map((section) => (
            <Tabs.Tab key={section.value} value={section.value}>
                {section.label}
            </Tabs.Tab>
        ))}
    </Tabs.List>
    {sections.map((section) => (
        <Tabs.Panel key={section.value} value={section.value}>
            <Text>{section.body}</Text>
        </Tabs.Panel>
    ))}
</Tabs>`;

// The selection held by whoever is drawing the tabs rather than by the tabs, which is what anything
// else on the page having a say over it wants. The button beside them moves the selection from
// outside, which is the whole reason for holding it
const ControlledPreview = () => {
    const [value, setValue] = React.useState("overview");

    return (
        <Stack gap="normal" className={classes.preview}>
            <TabsComponent value={value} onChange={setValue}>
                <TabsComponent.List aria-label="Repository">
                    {sections.map((section) => (
                        <TabsComponent.Tab key={section.value} value={section.value}>
                            {section.label}
                        </TabsComponent.Tab>
                    ))}
                </TabsComponent.List>
                {sections.map((section) => (
                    <TabsComponent.Panel key={section.value} value={section.value}>
                        <Text>{section.body}</Text>
                    </TabsComponent.Panel>
                ))}
            </TabsComponent>
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button size="small" onClick={() => setValue("pull-requests")}>
                    Show pull requests
                </Button>
                <Text size="small" className={classes.muted}>
                    Showing: {value}
                </Text>
            </Stack>
        </Stack>
    );
};

const controlledSetup = `${sectionsSetup}

const [value, setValue] = React.useState("overview");`;

const controlledCode = `<Stack gap="normal">
    <Tabs value={value} onChange={setValue}>
        <Tabs.List aria-label="Repository">
            {sections.map((section) => (
                <Tabs.Tab key={section.value} value={section.value}>
                    {section.label}
                </Tabs.Tab>
            ))}
        </Tabs.List>
        {sections.map((section) => (
            <Tabs.Panel key={section.value} value={section.value}>
                <Text>{section.body}</Text>
            </Tabs.Panel>
        ))}
    </Tabs>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button size="small" onClick={() => setValue("pull-requests")}>
            Show pull requests
        </Button>
        <Text size="small">Showing: {value}</Text>
    </Stack>
</Stack>`;

// The tablist standing beside the panels rather than above them. Saying so is what turns the arrow
// keys onto the other axis, so it is told rather than left to the stylesheet to imply.
//
// Nothing of the Tabs itself is drawn, so the tablist and the panels are laid out by whatever they
// are put in rather than by the component
const verticalPreview = (
    <Stack direction="horizontal" gap="normal" className={classes.preview}>
        <TabsComponent defaultValue="overview">
            <TabsComponent.List
                aria-label="Repository"
                aria-orientation="vertical"
                className={classes.sidebar}
            >
                {sections.map((section) => (
                    <TabsComponent.Tab key={section.value} value={section.value}>
                        {section.label}
                    </TabsComponent.Tab>
                ))}
            </TabsComponent.List>
            <Stack gap="normal" className={classes.panels}>
                {sections.map((section) => (
                    <TabsComponent.Panel key={section.value} value={section.value}>
                        <Text>{section.body}</Text>
                    </TabsComponent.Panel>
                ))}
            </Stack>
        </TabsComponent>
    </Stack>
);

// The row the two stand in is part of what is being shown rather than the page's own furniture,
// since standing beside the panels is the whole of what the example is about. The widths are
// written out as the classes they stand for rather than as the names the page holds them under,
// since what is copied out of here has only itself to reach for
const verticalCode = `<Stack direction="horizontal" gap="normal">
    <Tabs defaultValue="overview">
        <Tabs.List
            aria-label="Repository"
            aria-orientation="vertical"
            className="w-[10rem] shrink-0"
        >
            {sections.map((section) => (
                <Tabs.Tab key={section.value} value={section.value}>
                    {section.label}
                </Tabs.Tab>
            ))}
        </Tabs.List>
        <Stack gap="normal" className="min-w-0">
            {sections.map((section) => (
                <Tabs.Panel key={section.value} value={section.value}>
                    <Text>{section.body}</Text>
                </Tabs.Panel>
            ))}
        </Stack>
    </Tabs>
</Stack>`;

// A tab that cannot be chosen. It is marked unavailable rather than taken out of reach, so it is
// still read out and still says what it is; the arrow keys pass over it rather than landing on it
const disabledPreview = (
    <Stack gap="normal" className={classes.preview}>
        <TabsComponent defaultValue="overview">
            <TabsComponent.List aria-label="Repository">
                <TabsComponent.Tab value="overview">Overview</TabsComponent.Tab>
                <TabsComponent.Tab value="issues" disabled>
                    Issues
                </TabsComponent.Tab>
                <TabsComponent.Tab value="pull-requests">Pull requests</TabsComponent.Tab>
            </TabsComponent.List>
            {sections.map((section) => (
                <TabsComponent.Panel key={section.value} value={section.value}>
                    <Text>{section.body}</Text>
                </TabsComponent.Panel>
            ))}
        </TabsComponent>
    </Stack>
);

const disabledCode = `<Tabs defaultValue="overview">
    <Tabs.List aria-label="Repository">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="issues" disabled>
            Issues
        </Tabs.Tab>
        <Tabs.Tab value="pull-requests">Pull requests</Tabs.Tab>
    </Tabs.List>
    {sections.map((section) => (
        <Tabs.Panel key={section.value} value={section.value}>
            <Text>{section.body}</Text>
        </Tabs.Panel>
    ))}
</Tabs>`;

// The tablist and the tabs built out of whatever suits, with the hooks handing them everything
// they need to answer the keyboard and be read out as tabs. What is left is only how they look,
// which is the caller's
const RepositoryTabList = (props: React.PropsWithChildren) => {
    const { tabListProps } = useTabList<HTMLDivElement>({
        "aria-label": "Repository",
        "aria-orientation": "vertical",
    });

    return (
        <Stack {...tabListProps} gap="condensed" className={classes.sidebar}>
            {props.children}
        </Stack>
    );
};

const RepositoryTab = (props: React.PropsWithChildren<{ value: string }>) => {
    const { selected, tabProps } = useTab<HTMLButtonElement>({ value: props.value });

    return (
        <Button
            {...tabProps}
            variant={selected ? "primary" : "invisible"}
            block
            alignContent="start"
        >
            {props.children}
        </Button>
    );
};

const customPreview = (
    <Stack direction="horizontal" gap="normal" className={classes.preview}>
        <TabsComponent defaultValue="overview">
            <RepositoryTabList>
                {sections.map((section) => (
                    <RepositoryTab key={section.value} value={section.value}>
                        {section.label}
                    </RepositoryTab>
                ))}
            </RepositoryTabList>
            <Stack gap="normal" className={classes.panels}>
                {sections.map((section) => (
                    <TabsComponent.Panel key={section.value} value={section.value}>
                        <Text>{section.body}</Text>
                    </TabsComponent.Panel>
                ))}
            </Stack>
        </TabsComponent>
    </Stack>
);

// What the example has to have in hand: the two pieces built on the hooks, which are the caller's
// own components rather than the library's
const customSetup = `const RepositoryTabList = (props) => {
    const { tabListProps } = useTabList({
        "aria-label": "Repository",
        "aria-orientation": "vertical",
    });

    return (
        <Stack {...tabListProps} gap="condensed" className="w-[10rem] shrink-0">
            {props.children}
        </Stack>
    );
};

const RepositoryTab = (props) => {
    const { selected, tabProps } = useTab({ value: props.value });

    return (
        <Button {...tabProps} variant={selected ? "primary" : "invisible"} block alignContent="start">
            {props.children}
        </Button>
    );
};`;

const customCode = `<Stack direction="horizontal" gap="normal">
    <Tabs defaultValue="overview">
        <RepositoryTabList>
            {sections.map((section) => (
                <RepositoryTab key={section.value} value={section.value}>
                    {section.label}
                </RepositoryTab>
            ))}
        </RepositoryTabList>
        <Stack gap="normal" className="min-w-0">
            {sections.map((section) => (
                <Tabs.Panel key={section.value} value={section.value}>
                    <Text>{section.body}</Text>
                </Tabs.Panel>
            ))}
        </Stack>
    </Tabs>
</Stack>`;

// The tabs as they are reached for, drawn and written out one above the other. The plainest ones
// come first, then who holds the selection, then how they are laid out, then a tab that cannot be
// chosen, and last what is left where only the behaviour is taken
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A row of tabs and a panel apiece. What ties a tab to its panel is the value they share, so the two are written apart and find each other rather than being nested — which is what lets the panels be laid out anywhere on the page. Nothing is handed the selection to hold, so the tabs keep it themselves, and one of them is named as the tab to start on: a tablist with nothing selected has nothing for the keyboard to land on. The tablist has to be named, in its own words or by something already on the page, which the types insist on.",
        setup: sectionsSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "The selection the caller holds",
        description:
            "The selection held by whoever is drawing the tabs rather than by the tabs themselves, which is what anything else on the page having a say over it wants — a button that jumps to a section, a route that says which one to open on. The tabs report the value that has just been chosen rather than an event to be read, so what comes back is the answer itself.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Standing beside the panels",
        description:
            "A tablist running down rather than across. Saying which way it runs is what turns the arrow keys onto the other axis, so it is told rather than left to the stylesheet to imply — a list that looks vertical but answers the left and right keys is worse than one that looks horizontal. The Tabs itself draws nothing, so where the tablist and the panels stand is settled by whatever they are put in.",
        setup: sectionsSetup,
        preview: verticalPreview,
        code: verticalCode,
    },
    {
        name: "A tab that cannot be chosen",
        description:
            "A tab marked unavailable rather than taken out of reach: it is still read out and still says what it is, and the arrow keys pass over it rather than landing on it. That is the difference between a section that does not apply yet and one that has been removed — a section that has been removed should not be in the tablist at all.",
        setup: sectionsSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Tabs built to suit",
        description:
            "Only the behaviour taken, and the rest built out of whatever suits — here the library's own buttons standing as the tabs. The hooks hand over everything a tablist and a tab need to answer the keyboard and be read out as tabs, and whether a tab is the selected one comes back alongside, since that is what a tab built out of something else has to draw itself from. The panels are the library's, since there is nothing about a panel worth rebuilding.",
        setup: customSetup,
        preview: customPreview,
        code: customCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Which way the tablist runs, and so which arrow keys move along it
const orientation = '"horizontal" | "vertical"';

// Every prop the tabs and their parts take, under the one that takes it, and after them the hooks
// a caller building their own is handed the behaviour through.
//
// The component holding the selection comes first, then the tablist, the tabs and the panels in the
// order they are written, and the hooks last, since they are only reached for once the components
// are not enough
const groups: ComponentPropGroup[] = [
    {
        name: "Tabs",
        props: [
            {
                name: "value",
                type: "string",
                description:
                    "Which tab is selected, where the caller keeps hold of the selection. Handing this over is what makes the tabs the caller's to move; leaving it out leaves them to move themselves",
            },
            {
                name: "defaultValue",
                type: "string",
                description:
                    "Which tab starts out selected, where the tabs keep hold of the selection themselves. One of this and value should always be given: a tablist with nothing selected has nothing for the keyboard to land on",
            },
            {
                name: "onChange",
                type: "(value: string) => void",
                description:
                    "Called with the value of the tab that has just been chosen. It reports the selection itself rather than an event to be read, and is called whether the tabs are holding the selection or the caller is",
            },
            {
                name: "id",
                type: "string",
                description:
                    "What the ids of the tabs and the panels are built from, so that a tab and the panel it belongs to can name each other. One is worked out where it is left out, which is what almost every caller wants",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The tablist, the tabs and the panels. Nothing of the Tabs itself is drawn, so how they are laid out is left to whatever they are put in — the panels do not have to stand under the tablist, or even beside it",
            },
        ],
    },
    {
        name: "Tabs.List",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the tablist is called. A tablist has to be named, in its own words or by something already on the page, which is why the types will not take one without either this or aria-labelledby",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The element the tablist is named by, where a heading on the page already says what the tabs are for",
            },
            {
                name: "aria-orientation",
                type: orientation,
                default: '"horizontal"',
                description:
                    "Which way the tablist runs, and so which arrow keys move along it: left and right across, up and down down. It says how the tabs are read as well as how they are drawn, so a tablist laid out down the page is worth telling",
            },
            styling,
        ],
    },
    {
        name: "Tabs.Tab",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "Names the tab among the tabs around it, and ties it to the panel carrying the same value. It is what the selection is reported as, so it is the answer rather than a label for it",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the tab being chosen. It is marked unavailable rather than taken out of reach, so it is still read out and still says what it is, and the arrow keys pass over it rather than landing on it",
            },
            styling,
        ],
    },
    {
        name: "Tabs.Panel",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "The value of the tab this panel belongs to. The panel that is not showing is hidden rather than taken off the page, and is named by its tab, so a reader arriving at it is told which tab it answers to",
            },
            styling,
        ],
    },
    {
        name: "useTabList",
        props: [
            {
                name: "aria-label",
                type: "string",
                description: "What the tablist is called, as it is on Tabs.List",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description: "The element the tablist is named by, as it is on Tabs.List",
            },
            {
                name: "aria-orientation",
                type: orientation,
                default: '"horizontal"',
                description: "Which way the tablist runs, and so which arrow keys move along it",
            },
            {
                name: "ref",
                type: "React.Ref<T | null>",
                description:
                    "Where the tablist ends up, for a caller who needs it. One is kept either way, since the arrow keys are answered by looking at the tabs the tablist holds",
            },
        ],
    },
    {
        name: "TabListHookResult",
        props: [
            {
                name: "tabListProps",
                type: "{ ref, role, aria-label, aria-labelledby, aria-orientation, onKeyDown }",
                description:
                    "Spread onto whatever is standing as the tablist. It carries the role, the name, which way the list runs, and the keys that move between the tabs",
            },
        ],
    },
    {
        name: "useTab",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description: "Names the tab and ties it to its panel, as it does on Tabs.Tab",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Stops the tab being chosen, as it does on Tabs.Tab",
            },
        ],
    },
    {
        name: "TabHookResult",
        props: [
            {
                name: "selected",
                type: "boolean",
                description:
                    "Whether this is the tab that is selected, which is what a tab built out of something else needs in order to draw itself",
            },
            {
                name: "tabProps",
                type: "{ id, role, aria-controls, aria-selected, aria-disabled, tabIndex, onKeyDown, onMouseDown, onFocus }",
                description:
                    "Spread onto whatever is standing as the tab. Only the selected tab stands in the tab sequence — the rest are reached with the arrow keys once the tablist has been — and landing on a tab chooses it, so arrowing along the tablist carries the panels with it",
            },
        ],
    },
    {
        name: "useTabPanel",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description: "The value of the tab this panel belongs to, as it is on Tabs.Panel",
            },
        ],
    },
    {
        name: "TabPanelHookResult",
        props: [
            {
                name: "tabPanelProps",
                type: "{ id, role, aria-labelledby, hidden, data-selected }",
                description:
                    "Spread onto whatever is standing as the panel. It carries the role, the tab that names it, whether it is hidden, and a mark for anything styling itself by which panel is showing",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the tabs are is said on the page itself, beside the examples they are
// reached for in and the props they take.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Tabs = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Tabs
            </Heading>
            <Text as="p" size="large">
                One set of sections, of which one is shown at a time: a row of tabs, and a panel
                apiece. What ties a tab to its panel is the value they share rather than where the
                two are written, so the panels can be laid out anywhere on the page — under the
                tablist, beside it, or somewhere else entirely.
            </Text>
            <Text as="p" size="large">
                Only the selected tab stands in the tab sequence; the rest are reached with the
                arrow keys once the tablist has been, which is how a tablist is meant to be moved
                through. Landing on a tab chooses it, so arrowing along carries the panels with it,
                and a disabled tab is passed over rather than landed on. Nothing of the Tabs itself
                is drawn — it only holds what is selected — and where the components are not the
                shape wanted, the hooks behind them hand the same behaviour to whatever is.
            </Text>
        </Stack>
        <ComponentExamples component="Tabs" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Tabs;
