import * as React from "react";
import {
    CheckmarkCircleRegular,
    DeleteRegular,
    DocumentRegular,
    EditRegular,
    ErrorCircleRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Checkbox,
    CounterLabel,
    Heading,
    Stack,
    Text,
    TreeView as TreeViewComponent,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { TreeViewSubTreeState } from "@gamecrafters/base-ui/react";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A tree runs the width of whatever it is put in, so the page gives it a column rather than
    // the width of the card: a row of a tree is read down a narrow column, not across a wide one
    tree: "w-full max-w-[20rem]",
    success: "text-[var(--foreground-color-success)]",
    danger: "text-[var(--foreground-color-danger)]",
};

// The plainest tree there is: files and folders, which is what one is most often standing in for.
// The folder is open from the start, so what a sub-tree looks like is there to be seen without
// anything being pressed.
//
// The page and the component it is about are both called TreeView, so the component is brought in
// under a name saying which of the two it is. The listing beneath says TreeView, as an application
// importing it would
const defaultPreview = (
    <TreeViewComponent aria-label="Files" className={classes.tree}>
        <TreeViewComponent.Item id="src" defaultExpanded>
            <TreeViewComponent.LeadingVisual label="Folder">
                <TreeViewComponent.DirectoryIcon />
            </TreeViewComponent.LeadingVisual>
            src
            <TreeViewComponent.SubTree>
                <TreeViewComponent.Item id="src/index.ts">
                    <TreeViewComponent.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeViewComponent.LeadingVisual>
                    index.ts
                </TreeViewComponent.Item>
                <TreeViewComponent.Item id="src/main.ts">
                    <TreeViewComponent.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeViewComponent.LeadingVisual>
                    main.ts
                </TreeViewComponent.Item>
            </TreeViewComponent.SubTree>
        </TreeViewComponent.Item>
        <TreeViewComponent.Item id="readme">
            <TreeViewComponent.LeadingVisual label="File">
                <DocumentRegular />
            </TreeViewComponent.LeadingVisual>
            README.md
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<TreeView aria-label="Files">
    <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual label="Folder">
            <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
            <TreeView.Item id="src/index.ts">
                <TreeView.LeadingVisual label="File">
                    <DocumentRegular />
                </TreeView.LeadingVisual>
                index.ts
            </TreeView.Item>
            <TreeView.Item id="src/main.ts">
                <TreeView.LeadingVisual label="File">
                    <DocumentRegular />
                </TreeView.LeadingVisual>
                main.ts
            </TreeView.Item>
        </TreeView.SubTree>
    </TreeView.Item>
    <TreeView.Item id="readme">
        <TreeView.LeadingVisual label="File">
            <DocumentRegular />
        </TreeView.LeadingVisual>
        README.md
    </TreeView.Item>
</TreeView>`;

// The row the reader is looking at, which the tree fills and marks in the margin. It is also where
// the tab lands, so a reader coming back to the tree arrives where they were
const currentPreview = (
    <TreeViewComponent aria-label="Files" className={classes.tree}>
        <TreeViewComponent.Item id="current-src" defaultExpanded>
            src
            <TreeViewComponent.SubTree>
                <TreeViewComponent.Item id="current-src/index.ts" current>
                    index.ts
                </TreeViewComponent.Item>
                <TreeViewComponent.Item id="current-src/main.ts">main.ts</TreeViewComponent.Item>
            </TreeViewComponent.SubTree>
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

const currentCode = `<TreeView aria-label="Files">
    <TreeView.Item id="src" defaultExpanded>
        src
        <TreeView.SubTree>
            <TreeView.Item id="src/index.ts" current>
                index.ts
            </TreeView.Item>
            <TreeView.Item id="src/main.ts">main.ts</TreeView.Item>
        </TreeView.SubTree>
    </TreeView.Item>
</TreeView>`;

// A row that does something of its own when it is picked. Where an item is given one, the chevron
// takes over opening the row, since pressing the row no longer does
const SelectPreview = () => {
    const [picked, setPicked] = React.useState("index.ts");

    return (
        <Stack gap="condensed" className={classes.tree}>
            <TreeViewComponent aria-label="Files">
                <TreeViewComponent.Item id="select-src" defaultExpanded>
                    src
                    <TreeViewComponent.SubTree>
                        <TreeViewComponent.Item
                            id="select-src/index.ts"
                            current={picked === "index.ts"}
                            onSelect={() => setPicked("index.ts")}
                        >
                            index.ts
                        </TreeViewComponent.Item>
                        <TreeViewComponent.Item
                            id="select-src/main.ts"
                            current={picked === "main.ts"}
                            onSelect={() => setPicked("main.ts")}
                        >
                            main.ts
                        </TreeViewComponent.Item>
                    </TreeViewComponent.SubTree>
                </TreeViewComponent.Item>
            </TreeViewComponent>
            <Text size="small">Open: {picked}</Text>
        </Stack>
    );
};

const selectSetup = `const [picked, setPicked] = React.useState("index.ts");`;

const selectCode = `<Stack gap="condensed">
    <TreeView aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
            src
            <TreeView.SubTree>
                <TreeView.Item
                    id="src/index.ts"
                    current={picked === "index.ts"}
                    onSelect={() => setPicked("index.ts")}
                >
                    index.ts
                </TreeView.Item>
                <TreeView.Item
                    id="src/main.ts"
                    current={picked === "main.ts"}
                    onSelect={() => setPicked("main.ts")}
                >
                    main.ts
                </TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
    </TreeView>
    <Text size="small">Open: {picked}</Text>
</Stack>`;

// Something said about the row beyond its name, standing at the end of it
const trailingPreview = (
    <TreeViewComponent aria-label="Checks" className={classes.tree}>
        <TreeViewComponent.Item id="build" defaultExpanded>
            Build
            <TreeViewComponent.TrailingVisual label="2 checks">
                <CounterLabel>2</CounterLabel>
            </TreeViewComponent.TrailingVisual>
            <TreeViewComponent.SubTree>
                <TreeViewComponent.Item id="build/lint">
                    Lint
                    <TreeViewComponent.TrailingVisual label="Passed">
                        <CheckmarkCircleRegular className={classes.success} />
                    </TreeViewComponent.TrailingVisual>
                </TreeViewComponent.Item>
                <TreeViewComponent.Item id="build/test">
                    Test
                    <TreeViewComponent.TrailingVisual label="Failed">
                        <ErrorCircleRegular className={classes.danger} />
                    </TreeViewComponent.TrailingVisual>
                </TreeViewComponent.Item>
            </TreeViewComponent.SubTree>
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

const trailingCode = `<TreeView aria-label="Checks">
    <TreeView.Item id="build" defaultExpanded>
        Build
        <TreeView.TrailingVisual label="2 checks">
            <CounterLabel>2</CounterLabel>
        </TreeView.TrailingVisual>
        <TreeView.SubTree>
            <TreeView.Item id="build/lint">
                Lint
                <TreeView.TrailingVisual label="Passed">
                    <CheckmarkCircleRegular className="text-[var(--foreground-color-success)]" />
                </TreeView.TrailingVisual>
            </TreeView.Item>
            <TreeView.Item id="build/test">
                Test
                <TreeView.TrailingVisual label="Failed">
                    <ErrorCircleRegular className="text-[var(--foreground-color-danger)]" />
                </TreeView.TrailingVisual>
            </TreeView.Item>
        </TreeView.SubTree>
    </TreeView.Item>
</TreeView>`;

// Something to do standing at the front of the row, before the chevron that opens it
const leadingActionPreview = (
    <TreeViewComponent aria-label="Files" className={classes.tree}>
        <TreeViewComponent.Item id="pick-src" defaultExpanded>
            <TreeViewComponent.LeadingAction label="Pick">
                <Checkbox aria-label="Pick src" />
            </TreeViewComponent.LeadingAction>
            src
            <TreeViewComponent.SubTree>
                <TreeViewComponent.Item id="pick-src/index.ts">
                    <TreeViewComponent.LeadingAction label="Pick">
                        <Checkbox aria-label="Pick index.ts" />
                    </TreeViewComponent.LeadingAction>
                    index.ts
                </TreeViewComponent.Item>
            </TreeViewComponent.SubTree>
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

const leadingActionCode = `<TreeView aria-label="Files">
    <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingAction label="Pick">
            <Checkbox aria-label="Pick src" />
        </TreeView.LeadingAction>
        src
        <TreeView.SubTree>
            <TreeView.Item id="src/index.ts">
                <TreeView.LeadingAction label="Pick">
                    <Checkbox aria-label="Pick index.ts" />
                </TreeView.LeadingAction>
                index.ts
            </TreeView.Item>
        </TreeView.SubTree>
    </TreeView.Item>
</TreeView>`;

// A sub-tree fetched when the row is first opened, which stands a spinner in place of what has not
// arrived. Opening the row is what sets it going, so nothing is fetched for a folder nobody opens
const AsyncPreview = () => {
    const [state, setState] = React.useState<TreeViewSubTreeState>("initial");

    React.useEffect(() => {
        if (state !== "loading") {
            return;
        }

        const timeout = window.setTimeout(() => setState("done"), 1500);

        return () => window.clearTimeout(timeout);
    }, [state]);

    return (
        <TreeViewComponent aria-label="Files" className={classes.tree}>
            <TreeViewComponent.Item
                id="async-src"
                onExpandedChange={(expanded) => {
                    if (expanded && state === "initial") {
                        setState("loading");
                    }
                }}
            >
                <TreeViewComponent.LeadingVisual label="Folder">
                    <TreeViewComponent.DirectoryIcon />
                </TreeViewComponent.LeadingVisual>
                src
                <TreeViewComponent.SubTree state={state}>
                    {state === "done" ? (
                        <>
                            <TreeViewComponent.Item id="async-src/index.ts">
                                index.ts
                            </TreeViewComponent.Item>
                            <TreeViewComponent.Item id="async-src/main.ts">
                                main.ts
                            </TreeViewComponent.Item>
                        </>
                    ) : null}
                </TreeViewComponent.SubTree>
            </TreeViewComponent.Item>
        </TreeViewComponent>
    );
};

const asyncSetup = `const [state, setState] = React.useState("initial");

React.useEffect(() => {
    if (state !== "loading") {
        return;
    }

    const timeout = window.setTimeout(() => setState("done"), 1500);

    return () => window.clearTimeout(timeout);
}, [state]);`;

const asyncCode = `<TreeView aria-label="Files">
    <TreeView.Item
        id="src"
        onExpandedChange={(expanded) => {
            if (expanded && state === "initial") {
                setState("loading");
            }
        }}
    >
        <TreeView.LeadingVisual label="Folder">
            <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree state={state}>
            {state === "done" ? (
                <>
                    <TreeView.Item id="src/index.ts">index.ts</TreeView.Item>
                    <TreeView.Item id="src/main.ts">main.ts</TreeView.Item>
                </>
            ) : null}
        </TreeView.SubTree>
    </TreeView.Item>
</TreeView>`;

// Rows standing in for what is coming, where roughly how many there will be is already known
const countPreview = (
    <TreeViewComponent aria-label="Files" className={classes.tree}>
        <TreeViewComponent.Item id="count-src" defaultExpanded>
            <TreeViewComponent.LeadingVisual label="Folder">
                <TreeViewComponent.DirectoryIcon />
            </TreeViewComponent.LeadingVisual>
            src
            <TreeViewComponent.SubTree state="loading" count={5} />
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

const countCode = `<TreeView aria-label="Files">
    <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual label="Folder">
            <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree state="loading" count={5} />
    </TreeView.Item>
</TreeView>`;

// A sub-tree that turned out to hold nothing, which says so rather than opening onto nothing at all
const emptyPreview = (
    <TreeViewComponent aria-label="Files" className={classes.tree}>
        <TreeViewComponent.Item id="empty-src" defaultExpanded>
            <TreeViewComponent.LeadingVisual label="Folder">
                <TreeViewComponent.DirectoryIcon />
            </TreeViewComponent.LeadingVisual>
            src
            <TreeViewComponent.SubTree state="done" />
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

const emptyCode = `<TreeView aria-label="Files">
    <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual label="Folder">
            <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree state="done" />
    </TreeView.Item>
</TreeView>`;

// A sub-tree that could not be fetched, which says so and offers to try again. The folder starts
// closed, so the message arrives when the reader asks for what is under it rather than on sight
const ErrorPreview = () => {
    const [state, setState] = React.useState<TreeViewSubTreeState>("initial");

    React.useEffect(() => {
        if (state !== "loading") {
            return;
        }

        const timeout = window.setTimeout(() => setState("done"), 1500);

        return () => window.clearTimeout(timeout);
    }, [state]);

    return (
        <TreeViewComponent aria-label="Files" className={classes.tree}>
            <TreeViewComponent.Item
                id="error-src"
                onExpandedChange={(expanded) => {
                    if (expanded && state === "initial") {
                        setState("error");
                    }
                }}
            >
                <TreeViewComponent.LeadingVisual label="Folder">
                    <TreeViewComponent.DirectoryIcon />
                </TreeViewComponent.LeadingVisual>
                src
                <TreeViewComponent.SubTree state={state}>
                    {state === "error" ? (
                        <TreeViewComponent.ErrorDialog
                            onRetry={() => setState("loading")}
                            onDismiss={() => setState("initial")}
                        >
                            Could not load the contents of this folder.
                        </TreeViewComponent.ErrorDialog>
                    ) : state === "done" ? (
                        <TreeViewComponent.Item id="error-src/index.ts">
                            index.ts
                        </TreeViewComponent.Item>
                    ) : null}
                </TreeViewComponent.SubTree>
            </TreeViewComponent.Item>
        </TreeViewComponent>
    );
};

const errorSetup = `const [state, setState] = React.useState("initial");`;

const errorCode = `<TreeView aria-label="Files">
    <TreeView.Item
        id="src"
        onExpandedChange={(expanded) => {
            if (expanded && state === "initial") {
                setState("error");
            }
        }}
    >
        <TreeView.LeadingVisual label="Folder">
            <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree state={state}>
            {state === "error" ? (
                <TreeView.ErrorDialog
                    onRetry={() => setState("loading")}
                    onDismiss={() => setState("initial")}
                >
                    Could not load the contents of this folder.
                </TreeView.ErrorDialog>
            ) : null}
        </TreeView.SubTree>
    </TreeView.Item>
</TreeView>`;

// Things an item can do beyond being picked, reached with the pointer or from the keyboard by the
// shortcut the row is read as offering
const actionsPreview = (
    <TreeViewComponent aria-label="Files" className={classes.tree}>
        <TreeViewComponent.Item
            id="actions-readme"
            aria-label="README.md"
            secondaryActions={[
                { label: "Rename", onClick: () => {}, icon: EditRegular },
                { label: "Delete", onClick: () => {}, icon: DeleteRegular },
            ]}
        >
            <TreeViewComponent.LeadingVisual label="File">
                <DocumentRegular />
            </TreeViewComponent.LeadingVisual>
            README.md
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

const actionsCode = `<TreeView aria-label="Files">
    <TreeView.Item
        id="readme"
        aria-label="README.md"
        secondaryActions={[
            { label: "Rename", onClick: () => {}, icon: EditRegular },
            { label: "Delete", onClick: () => {}, icon: DeleteRegular },
        ]}
    >
        <TreeView.LeadingVisual label="File">
            <DocumentRegular />
        </TreeView.LeadingVisual>
        README.md
    </TreeView.Item>
</TreeView>`;

// Every row against the same edge, for a tree standing in for a flat list
const flatPreview = (
    <TreeViewComponent aria-label="Files" flat className={classes.tree}>
        <TreeViewComponent.Item id="flat-readme">README.md</TreeViewComponent.Item>
        <TreeViewComponent.Item id="flat-license">LICENSE</TreeViewComponent.Item>
        <TreeViewComponent.Item id="flat-changelog">CHANGELOG.md</TreeViewComponent.Item>
    </TreeViewComponent>
);

const flatCode = `<TreeView aria-label="Files" flat>
    <TreeView.Item id="readme">README.md</TreeView.Item>
    <TreeView.Item id="license">LICENSE</TreeView.Item>
    <TreeView.Item id="changelog">CHANGELOG.md</TreeView.Item>
</TreeView>`;

// A name too long for the row, left to run onto another line rather than cut short
const truncationPreview = (
    <TreeViewComponent aria-label="Files" truncate={false} className={classes.tree}>
        <TreeViewComponent.Item id="long-src" defaultExpanded>
            src
            <TreeViewComponent.SubTree>
                <TreeViewComponent.Item id="long-src/name">
                    <TreeViewComponent.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeViewComponent.LeadingVisual>
                    a-very-long-file-name-that-will-not-fit-on-one-line.tsx
                </TreeViewComponent.Item>
            </TreeViewComponent.SubTree>
        </TreeViewComponent.Item>
    </TreeViewComponent>
);

const truncationCode = `<TreeView aria-label="Files" truncate={false}>
    <TreeView.Item id="src" defaultExpanded>
        src
        <TreeView.SubTree>
            <TreeView.Item id="src/name">
                <TreeView.LeadingVisual label="File">
                    <DocumentRegular />
                </TreeView.LeadingVisual>
                a-very-long-file-name-that-will-not-fit-on-one-line.tsx
            </TreeView.Item>
        </TreeView.SubTree>
    </TreeView.Item>
</TreeView>`;

// The tree as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what a row can carry and do, then what becomes of a sub-tree that has to be fetched,
// and last how the rows are laid out
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A list of things that hold more of themselves. Every row carries an id, which is what tells one from another and what holds its open state across the times it is drawn, and a sub-tree is only drawn while the row above it is open — so a tree of thousands of rows only ever holds the ones that can be seen. Moving through it is by arrow key rather than by tab, so the whole tree is one stop on the way through the page.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "The row the reader is on",
        description:
            "The row the tree is standing for right now, which is filled and marked in the margin. It is also where the tree's one tab stop goes when nothing has been focused yet, so a reader coming back to the tree arrives where they were rather than at the top. A row marked as the current one opens itself, so what it stands in is not left closed around it.",
        preview: currentPreview,
        code: currentCode,
    },
    {
        name: "Rows that are picked rather than opened",
        description:
            "What happens when a row is pressed. Without a handler the row opens and closes itself, which is what a folder wants; with one, pressing the row does that instead and the chevron takes over the opening. That is the difference between a tree read as an outline and one read as a set of places to go.",
        setup: selectSetup,
        preview: <SelectPreview />,
        code: selectCode,
    },
    {
        name: "Something said at the end of the row",
        description:
            "A count, a state, whatever the row is worth saying beyond its name. It is hidden from a screen reader and the label given beside it is read instead, since an icon says nothing on its own — and the label describes the row rather than replacing its name, so the name is still what the row is called.",
        preview: trailingPreview,
        code: trailingCode,
    },
    {
        name: "Something to do at the front of the row",
        description:
            "An action standing before everything else, ahead of the chevron that opens the row — a box for picking rows out, most often. It is drawn inside the row rather than beside it, so the two move together as the tree is scrolled.",
        preview: leadingActionPreview,
        code: leadingActionCode,
    },
    {
        name: "A sub-tree still being fetched",
        description:
            "A folder whose contents are fetched when it is first opened, so nothing is fetched for one nobody opens. A spinner stands in place of what has not arrived, and what happened is announced — a reader waiting on the placeholder is moved onto what arrived, since the row they were standing on is about to be taken off the page.",
        setup: asyncSetup,
        preview: <AsyncPreview />,
        code: asyncCode,
    },
    {
        name: "Rows standing in for what is coming",
        description:
            "Placeholder rows rather than a single spinner, for a sub-tree whose rough size is already known. They are drawn at a handful of widths in turn, so a block of them reads as names of different lengths rather than as one solid shape, and how many there are is said to a screen reader.",
        preview: countPreview,
        code: countCode,
    },
    {
        name: "A sub-tree that holds nothing",
        description:
            "A folder that turned out to be empty, which says so rather than opening onto nothing at all. The row standing in its place can never be opened, so it says nothing about being open — and the row above it stops claiming to hold anything once the fetching is done and nothing arrived.",
        preview: emptyPreview,
        code: emptyCode,
    },
    {
        name: "A sub-tree that could not be fetched",
        description:
            "A folder whose contents could not be got, which says so and offers to try again. The keys the tree moves by are held back while the message stands over it, so reading the message does not walk the tree underneath, and dismissing it closes the row, since there is nothing under it to show.",
        setup: errorSetup,
        preview: <ErrorPreview />,
        code: errorCode,
    },
    {
        name: "More an item can do",
        description:
            "Actions beyond picking the row: renaming it, deleting it, whatever else belongs to it. They are reached with the pointer, or from the keyboard by the shortcut the row is read as offering, since buttons standing on every row would put a tab stop on each of them. With only one action there is nothing to choose between, so it is simply done; with more, they are collected into a dialog.",
        preview: actionsPreview,
        code: actionsCode,
    },
    {
        name: "A flat tree",
        description:
            "Every row against the same edge, for a tree standing in for a list that has no depth to show. It is still a tree to move through — the arrow keys and the one tab stop are the same — so this is a way of drawing a list rather than a different thing.",
        preview: flatPreview,
        code: flatCode,
    },
    {
        name: "Names that run on",
        description:
            "A name too long for the row, left to run onto another line rather than cut short. Names are cut by default, since a tree is read down its rows rather than across them and a wrapped name breaks that run — but a tree whose names only differ at the end is one where every row would otherwise read the same.",
        preview: truncationPreview,
        code: truncationCode,
    },
];

// How far a sub-tree has got with fetching what it holds
const subTreeState = '"initial" | "loading" | "done" | "error"';

// A visual either draws the same thing throughout, or is handed whether the row is open
const visualChildren = "React.ReactNode | ((props: { isExpanded: boolean }) => React.ReactNode)";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What a visual says for a reader who cannot see it. It is the same prop on either end of the row,
// so it is named once
const visualLabel = {
    name: "label",
    type: "string",
    description:
        "What the visual stands for, read in place of the visual itself, since an icon says nothing on its own. It describes the row rather than naming it, so the row is still called by its own words",
};

// Every prop the tree and its parts take, under the one that takes it. The tree comes first, then
// the rows it is made of, then what stands under a row, and last the pieces a row is dressed with
const groups: ComponentPropGroup[] = [
    {
        name: "TreeView",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the tree is called. A tree is a landmark a reader moves through by arrow key, so it has to say what it is a tree of",
            },
            {
                name: "flat",
                type: "boolean",
                default: "false",
                description:
                    "Draws every row against the same edge, for a tree standing in for a list with no depth to show. It is still a tree to move through",
            },
            {
                name: "truncate",
                type: "boolean",
                default: "true",
                description:
                    "Cuts a name too long for the row rather than running it onto another line. A tree is read down its rows rather than across them, so a wrapped name breaks that run — but a set of names that only differ at the end is worth letting run on",
            },
            styling,
        ],
    },
    {
        name: "TreeView.Item",
        props: [
            {
                name: "id",
                type: "string",
                required: true,
                description:
                    "Tells one row from another, and holds its open state across the times it is drawn, so a sub-tree that is closed and opened again comes back as it was",
            },
            {
                name: "current",
                type: "boolean",
                default: "false",
                description:
                    "Whether this is the row the tree is standing for right now. It is filled and marked in the margin, opens itself, and takes the tree's one tab stop where nothing has been focused yet",
            },
            {
                name: "defaultExpanded",
                type: "boolean",
                description:
                    "Whether the row starts out open, where it keeps its own open state. A row that has been opened and closed before takes what it was left at instead",
            },
            {
                name: "expanded",
                type: "boolean | null",
                description:
                    "Holds the open state from outside. Null says the row can never be opened, which is what a row standing in for an empty sub-tree is: it says nothing about being open, since there is nothing there to open",
            },
            {
                name: "onExpandedChange",
                type: "(expanded: boolean) => void",
                description:
                    "Called when the row is opened or closed. It is where a sub-tree that has to be fetched is set going, so nothing is fetched for a row nobody opens",
            },
            {
                name: "onSelect",
                type: "(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void",
                description:
                    "Called when the row is picked, by press, by Enter or Space, or by the middle button. Without one, picking the row opens it instead — and where there is one, the chevron takes over the opening",
            },
            {
                name: "secondaryActions",
                type: "TreeViewSecondaryAction[]",
                description:
                    "Things the row can do beyond being picked. They are reached with the pointer or by the shortcut the row is read as offering, since a button on every row would put a tab stop on each of them",
            },
            {
                name: "containIntrinsicSize",
                type: "string",
                description:
                    "Lets the browser skip drawing the row while it is out of view, given what to stand in for its size until it comes back. It is worth reaching for on a tree long enough that drawing it costs something",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"li"',
                description:
                    "The element or component the row is drawn as. Anything other than a list item is wrapped in one, since a tree may only hold list items directly",
            },
        ],
    },
    {
        name: "TreeView.SubTree",
        props: [
            {
                name: "state",
                type: subTreeState,
                description:
                    "How far the sub-tree has got with fetching what it holds. Left unsaid, it is taken to hold everything it will ever hold; while it is loading a placeholder stands in what has not arrived, and once it is done what arrived is what it holds",
            },
            {
                name: "count",
                type: "number",
                description:
                    "How many rows to stand in for what is being fetched. Without one, a single spinner stands in for the whole of it",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the sub-tree is called. Left out, it takes the name of the row it stands under, which is nearly always what it should be called",
            },
        ],
    },
    {
        name: "TreeView.LeadingVisual",
        props: [
            {
                name: "children",
                type: visualChildren,
                description:
                    "What is drawn. A function is handed whether the row is open, so a folder can be drawn open or closed without the caller holding that state itself",
            },
            visualLabel,
        ],
    },
    {
        name: "TreeView.TrailingVisual",
        props: [
            {
                name: "children",
                type: visualChildren,
                description: "What is drawn at the end of the row",
            },
            visualLabel,
        ],
    },
    {
        name: "TreeView.LeadingAction",
        props: [
            {
                name: "children",
                type: visualChildren,
                description:
                    "What is drawn at the front of the row, ahead of the chevron that opens it",
            },
            visualLabel,
        ],
    },
    {
        name: "TreeView.ErrorDialog",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description: "What went wrong, said in the reader's own terms",
            },
            {
                name: "title",
                type: "string",
                default: '"Error"',
                description: "What the message is headed",
            },
            {
                name: "onRetry",
                type: "() => void",
                description:
                    "Called when the reader asks to try again. Focus goes back to the row the sub-tree belongs to, which is where they were before the message opened",
            },
            {
                name: "onDismiss",
                type: "() => void",
                description:
                    "Called when the reader gives up on it. The row is closed along with it, since there is nothing under it to show",
            },
        ],
    },
    {
        name: "TreeViewSecondaryAction",
        props: [
            {
                name: "label",
                type: "string",
                required: true,
                description: "What the action is called, which is what it is read and listed as",
            },
            {
                name: "onClick",
                type: "() => void",
                required: true,
                description: "What the action does",
            },
            {
                name: "icon",
                type: "ButtonVisual",
                required: true,
                description:
                    "What the action is drawn as on the row. It carries no text of its own there, so it always has a mark to be drawn as",
            },
            {
                name: "count",
                type: "number | string",
                description:
                    "Shown beside the label, for an action that stands for a number of things",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the tree is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const TreeView = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                TreeView
            </Heading>
            <Text as="p" size="large">
                A list of things that hold more of themselves: files under folders, checks under a
                build, pages under a section. A sub-tree is only drawn while the row above it is
                open, so a tree of thousands of rows only ever holds the ones that can be seen, and
                each row holds its open state under an id of its own — closed and opened again, it
                comes back as it was.
            </Text>
            <Text as="p" size="large">
                Moving through it is by arrow key rather than by tab: the whole tree is one stop on
                the way through the page, and the one tab stop follows the reader from row to row.
                Left and right open and close a row and then step out to its parent and in to its
                first child; Home and End reach either end; typing a few letters jumps to a name.
                Rows that arrive and empty out under a reader are announced, so the tree does not
                change underneath them in silence.
            </Text>
        </Stack>
        <ComponentExamples component="TreeView" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default TreeView;
