import * as React from "react";
import {
    ActionList,
    FormControl,
    Heading,
    SelectPanel as SelectPanelComponent,
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

// What the examples are picking from. A panel holds no items of its own — the list inside it is
// the caller's, and so is whatever the list was filtered down from — so the items are the page's
// rather than anything the component was told
const labels = ["bug", "documentation", "enhancement", "help wanted", "question"];

const assignees = ["monalisa", "hubot", "octocat"];

// The selection is the caller's as well: the panel says what was picked and the caller decides
// what that comes to, which is why every example that lets a pick be made holds one of these. It
// is the same handful of lines under each of them, so the page keeps them in one place rather than
// writing them out ten times over. What a reader is handed is the lines themselves, written above
// each listing, since that is what they would write
const useSelection = (initial: string[] = ["bug"]) => {
    const [selected, setSelected] = React.useState(initial);

    const toggle = (label: string) =>
        setSelected((current) =>
            current.includes(label)
                ? current.filter((value) => value !== label)
                : [...current, label],
        );

    return { selected, setSelected, toggle };
};

// What every example picking from the labels has to have in hand before it can be drawn
const setup = `const labels = ["bug", "documentation", "enhancement", "help wanted", "question"];

const [selected, setSelected] = React.useState(["bug"]);

const toggle = (label) =>
    setSelected((current) =>
        current.includes(label) ? current.filter((value) => value !== label) : [...current, label],
    );`;

// The same, and the text the list is filtered by. What the field reports is the caller's to act
// on, since the panel is handed a list rather than the whole of what the list came from
const searchSetup = `${setup}

const [query, setQuery] = React.useState("");

const found = labels.filter((label) => label.includes(query.toLowerCase()));`;

// One thing being picked rather than several, so the answer is the one it landed on rather than a
// list to be added to and taken from
const singleSetup = `const assignees = ["monalisa", "hubot", "octocat"];

const [assignee, setAssignee] = React.useState("monalisa");`;

// Whether the panel is open, for one the caller is holding that for
const controlledSetup = `${setup}

const [open, setOpen] = React.useState(false);`;

// The plainest panel there is: the button that opens it, the list inside it, and the bar at the
// foot that saves what was picked. Several labels can be held at once, which is what a panel does
// unless it is told otherwise.
//
// The list is the library's own rather than anything the panel declares. What it is read as is the
// panel's — the items become options of a listbox named by the title — so the same list is a menu
// somewhere else and a set of choices here without being written differently.
//
// The stack is the page's own furniture: the card lays what it is handed out down a column, and a
// column runs what stands in it out to its width, which would leave a button several times the
// width of the words on it. The listing beneath is of the panel alone.
//
// The page and the component it is about are both called SelectPanel, so the component is brought
// in under a name saying which of the two it is. The listing beneath says SelectPanel, as an
// application importing it would
const DefaultPreview = () => {
    const { selected, toggle } = useSelection();

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select labels">
                <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label}
                            selected={selected.includes(label)}
                            onSelect={() => toggle(label)}
                        >
                            {label}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<SelectPanel title="Select labels">
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <ActionList>
        {labels.map((label) => (
            <ActionList.Item
                key={label}
                selected={selected.includes(label)}
                onSelect={() => toggle(label)}
            >
                {label}
            </ActionList.Item>
        ))}
    </ActionList>
    <SelectPanel.Footer />
</SelectPanel>`;

// A field at the head of the panel for narrowing the list down. What is typed is reported rather
// than acted on: the panel is handed a list rather than the whole of what the list came from, so
// which items are left is the caller's to work out — against what is already in hand, or by asking
// for them again.
//
// Where nothing is left there is no list to show, so the panel says so in place of one
const SearchPreview = () => {
    const { selected, toggle } = useSelection();
    const [query, setQuery] = React.useState("");
    const found = labels.filter((label) => label.includes(query.toLowerCase()));

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select labels">
                <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                <SelectPanelComponent.Header>
                    <SelectPanelComponent.SearchInput
                        aria-label="Search labels"
                        onChange={setQuery}
                    />
                </SelectPanelComponent.Header>
                {found.length ? (
                    <ActionList>
                        {found.map((label) => (
                            <ActionList.Item
                                key={label}
                                selected={selected.includes(label)}
                                onSelect={() => toggle(label)}
                            >
                                {label}
                            </ActionList.Item>
                        ))}
                    </ActionList>
                ) : (
                    <SelectPanelComponent.Message variant="empty" title="No labels found">
                        Nothing here matches what you have typed
                    </SelectPanelComponent.Message>
                )}
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const searchCode = `<SelectPanel title="Select labels">
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <SelectPanel.Header>
        <SelectPanel.SearchInput aria-label="Search labels" onChange={setQuery} />
    </SelectPanel.Header>
    {found.length ? (
        <ActionList>
            {found.map((label) => (
                <ActionList.Item
                    key={label}
                    selected={selected.includes(label)}
                    onSelect={() => toggle(label)}
                >
                    {label}
                </ActionList.Item>
            ))}
        </ActionList>
    ) : (
        <SelectPanel.Message variant="empty" title="No labels found">
            Nothing here matches what you have typed
        </SelectPanel.Message>
    )}
    <SelectPanel.Footer />
</SelectPanel>`;

// One thing picked rather than several, so picking gives up whatever was held before it. The
// answer is the one it landed on rather than a list, which is what the caller holds it as
const SinglePreview = () => {
    const [assignee, setAssignee] = React.useState("monalisa");

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select an assignee" selectionVariant="single">
                <SelectPanelComponent.Button>Assign someone</SelectPanelComponent.Button>
                <ActionList>
                    {assignees.map((name) => (
                        <ActionList.Item
                            key={name}
                            selected={assignee === name}
                            onSelect={() => setAssignee(name)}
                        >
                            {name}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const singleCode = `<SelectPanel title="Select an assignee" selectionVariant="single">
    <SelectPanel.Button>Assign someone</SelectPanel.Button>
    <ActionList>
        {assignees.map((name) => (
            <ActionList.Item
                key={name}
                selected={assignee === name}
                onSelect={() => setAssignee(name)}
            >
                {name}
            </ActionList.Item>
        ))}
    </ActionList>
    <SelectPanel.Footer />
</SelectPanel>`;

// The first pick taken as the answer, which closes the panel with it. There is nothing left to
// save, so the panel is written without a footer: one would draw a bar with nothing in it
const InstantPreview = () => {
    const [assignee, setAssignee] = React.useState("monalisa");

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select an assignee" selectionVariant="instant">
                <SelectPanelComponent.Button>Assign someone</SelectPanelComponent.Button>
                <ActionList>
                    {assignees.map((name) => (
                        <ActionList.Item
                            key={name}
                            selected={assignee === name}
                            onSelect={() => setAssignee(name)}
                        >
                            {name}
                        </ActionList.Item>
                    ))}
                </ActionList>
            </SelectPanelComponent>
        </Stack>
    );
};

const instantCode = `<SelectPanel title="Select an assignee" selectionVariant="instant">
    <SelectPanel.Button>Assign someone</SelectPanel.Button>
    <ActionList>
        {assignees.map((name) => (
            <ActionList.Item
                key={name}
                selected={assignee === name}
                onSelect={() => setAssignee(name)}
            >
                {name}
            </ActionList.Item>
        ))}
    </ActionList>
</SelectPanel>`;

// A line under the title saying more about what is being picked. It describes the panel to a
// screen reader as well as standing under the title, so it is read out as the panel is arrived in
const DescriptionPreview = () => {
    const { selected, toggle } = useSelection();

    return (
        <Stack align="start">
            <SelectPanelComponent
                title="Select labels"
                description="Labels organise issues and pull requests"
            >
                <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label}
                            selected={selected.includes(label)}
                            onSelect={() => toggle(label)}
                        >
                            {label}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const descriptionCode = `<SelectPanel
    title="Select labels"
    description="Labels organise issues and pull requests"
>
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <ActionList>
        {labels.map((label) => (
            <ActionList.Item
                key={label}
                selected={selected.includes(label)}
                onSelect={() => toggle(label)}
            >
                {label}
            </ActionList.Item>
        ))}
    </ActionList>
    <SelectPanel.Footer />
</SelectPanel>`;

// A way to give up every pick at once, drawn in the header beside what closes the panel. It is
// only there where the caller says what clearing comes to: there is nothing for the panel to clear
// on its own, since the selection was never its to hold
const ClearPreview = () => {
    const { selected, setSelected, toggle } = useSelection();

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select labels" onClearSelection={() => setSelected([])}>
                <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label}
                            selected={selected.includes(label)}
                            onSelect={() => toggle(label)}
                        >
                            {label}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const clearCode = `<SelectPanel title="Select labels" onClearSelection={() => setSelected([])}>
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <ActionList>
        {labels.map((label) => (
            <ActionList.Item
                key={label}
                selected={selected.includes(label)}
                onSelect={() => toggle(label)}
            >
                {label}
            </ActionList.Item>
        ))}
    </ActionList>
    <SelectPanel.Footer />
</SelectPanel>`;

// The items collected under headings of their own. The grouping is the list's rather than the
// panel's, so it is written the way it would be in any other list
const GroupsPreview = () => {
    const { selected, toggle } = useSelection();

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select labels">
                <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                <ActionList>
                    <ActionList.Group>
                        <ActionList.GroupHeading>Type</ActionList.GroupHeading>
                        {labels.slice(0, 3).map((label) => (
                            <ActionList.Item
                                key={label}
                                selected={selected.includes(label)}
                                onSelect={() => toggle(label)}
                            >
                                {label}
                            </ActionList.Item>
                        ))}
                    </ActionList.Group>
                    <ActionList.Group>
                        <ActionList.GroupHeading>Status</ActionList.GroupHeading>
                        {labels.slice(3).map((label) => (
                            <ActionList.Item
                                key={label}
                                selected={selected.includes(label)}
                                onSelect={() => toggle(label)}
                            >
                                {label}
                            </ActionList.Item>
                        ))}
                    </ActionList.Group>
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const groupsCode = `<SelectPanel title="Select labels">
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <ActionList>
        <ActionList.Group>
            <ActionList.GroupHeading>Type</ActionList.GroupHeading>
            {labels.slice(0, 3).map((label) => (
                <ActionList.Item
                    key={label}
                    selected={selected.includes(label)}
                    onSelect={() => toggle(label)}
                >
                    {label}
                </ActionList.Item>
            ))}
        </ActionList.Group>
        <ActionList.Group>
            <ActionList.GroupHeading>Status</ActionList.GroupHeading>
            {labels.slice(3).map((label) => (
                <ActionList.Item
                    key={label}
                    selected={selected.includes(label)}
                    onSelect={() => toggle(label)}
                >
                    {label}
                </ActionList.Item>
            ))}
        </ActionList.Group>
    </ActionList>
    <SelectPanel.Footer />
</SelectPanel>`;

// What stands in place of the list while the items are being fetched. It is a live region, so the
// wait is read out to a reader whose focus has stayed in the field above it rather than being left
// to the spinner, which says nothing
const loadingPreview = (
    <Stack align="start">
        <SelectPanelComponent title="Select labels">
            <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
            <SelectPanelComponent.Header>
                <SelectPanelComponent.SearchInput aria-label="Search labels" />
            </SelectPanelComponent.Header>
            <SelectPanelComponent.Loading />
            <SelectPanelComponent.Footer />
        </SelectPanelComponent>
    </Stack>
);

const loadingCode = `<SelectPanel title="Select labels">
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <SelectPanel.Header>
        <SelectPanel.SearchInput aria-label="Search labels" />
    </SelectPanel.Header>
    <SelectPanel.Loading />
    <SelectPanel.Footer />
</SelectPanel>`;

// The two ways a panel says something about the list rather than showing it. A warning stands
// above the list, which is still there to be picked from; an error stands in place of it, since
// there is nothing to pick from at all. Both are read out as they arrive
const MessagesPreview = () => {
    const { selected, toggle } = useSelection();

    return (
        <Stack direction="horizontal" gap="normal" align="start">
            <SelectPanelComponent title="Select labels">
                <SelectPanelComponent.Button>Above the list</SelectPanelComponent.Button>
                <SelectPanelComponent.Message variant="warning">
                    Showing the first 5 labels of 214
                </SelectPanelComponent.Message>
                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label}
                            selected={selected.includes(label)}
                            onSelect={() => toggle(label)}
                        >
                            {label}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
            <SelectPanelComponent title="Select labels">
                <SelectPanelComponent.Button>In place of it</SelectPanelComponent.Button>
                <SelectPanelComponent.Message
                    variant="error"
                    size="full"
                    title="We couldn't load the labels"
                >
                    Check your connection and try again
                </SelectPanelComponent.Message>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const messagesCode = `<Stack direction="horizontal" gap="normal" align="start">
    <SelectPanel title="Select labels">
        <SelectPanel.Button>Above the list</SelectPanel.Button>
        <SelectPanel.Message variant="warning">
            Showing the first 5 labels of 214
        </SelectPanel.Message>
        <ActionList>
            {labels.map((label) => (
                <ActionList.Item
                    key={label}
                    selected={selected.includes(label)}
                    onSelect={() => toggle(label)}
                >
                    {label}
                </ActionList.Item>
            ))}
        </ActionList>
        <SelectPanel.Footer />
    </SelectPanel>
    <SelectPanel title="Select labels">
        <SelectPanel.Button>In place of it</SelectPanel.Button>
        <SelectPanel.Message variant="error" size="full" title="We couldn't load the labels">
            Check your connection and try again
        </SelectPanel.Message>
        <SelectPanel.Footer />
    </SelectPanel>
</Stack>`;

// The panel drawn over the middle of the page rather than against the button that opened it. It is
// for a panel that has more in it than a column beside a button has room for, and for a screen
// where what is being picked is the whole of what the reader is doing
const ModalPreview = () => {
    const { selected, toggle } = useSelection();

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select labels" variant="modal">
                <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label}
                            selected={selected.includes(label)}
                            onSelect={() => toggle(label)}
                        >
                            {label}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const modalCode = `<SelectPanel title="Select labels" variant="modal">
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <ActionList>
        {labels.map((label) => (
            <ActionList.Item
                key={label}
                selected={selected.includes(label)}
                onSelect={() => toggle(label)}
            >
                {label}
            </ActionList.Item>
        ))}
    </ActionList>
    <SelectPanel.Footer />
</SelectPanel>`;

// A second thing the footer can do, standing at the start of the bar beside saving and
// cancelling. What it is drawn as follows from the variant, since all three read as one action in
// the same place
const SecondaryActionPreview = () => {
    const { selected, toggle } = useSelection();

    return (
        <Stack align="start">
            <SelectPanelComponent title="Select labels">
                <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label}
                            selected={selected.includes(label)}
                            onSelect={() => toggle(label)}
                        >
                            {label}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer>
                    <SelectPanelComponent.SecondaryAction variant="link" href="#labels">
                        Edit labels
                    </SelectPanelComponent.SecondaryAction>
                </SelectPanelComponent.Footer>
            </SelectPanelComponent>
        </Stack>
    );
};

const secondaryActionCode = `<SelectPanel title="Select labels">
    <SelectPanel.Button>Assign label</SelectPanel.Button>
    <ActionList>
        {labels.map((label) => (
            <ActionList.Item
                key={label}
                selected={selected.includes(label)}
                onSelect={() => toggle(label)}
            >
                {label}
            </ActionList.Item>
        ))}
    </ActionList>
    <SelectPanel.Footer>
        <SelectPanel.SecondaryAction variant="link" href="#labels">
            Edit labels
        </SelectPanel.SecondaryAction>
    </SelectPanel.Footer>
</SelectPanel>`;

// Where the caller keeps hold of whether the panel is open. A panel held this way shows what it is
// told rather than what was pressed, so the button has to say what pressing it comes to, and being
// dismissed or saved has to be answered by closing it
const ControlledPreview = () => {
    const { selected, toggle } = useSelection();
    const [open, setOpen] = React.useState(false);

    return (
        <Stack align="start">
            <SelectPanelComponent
                title="Select labels"
                open={open}
                onCancel={() => setOpen(false)}
                onSubmit={() => setOpen(false)}
            >
                <SelectPanelComponent.Button onClick={() => setOpen(!open)}>
                    Assign label
                </SelectPanelComponent.Button>
                <ActionList>
                    {labels.map((label) => (
                        <ActionList.Item
                            key={label}
                            selected={selected.includes(label)}
                            onSelect={() => toggle(label)}
                        >
                            {label}
                        </ActionList.Item>
                    ))}
                </ActionList>
                <SelectPanelComponent.Footer />
            </SelectPanelComponent>
        </Stack>
    );
};

const controlledCode = `<SelectPanel
    title="Select labels"
    open={open}
    onCancel={() => setOpen(false)}
    onSubmit={() => setOpen(false)}
>
    <SelectPanel.Button onClick={() => setOpen(!open)}>Assign label</SelectPanel.Button>
    <ActionList>
        {labels.map((label) => (
            <ActionList.Item
                key={label}
                selected={selected.includes(label)}
                onSelect={() => toggle(label)}
            >
                {label}
            </ActionList.Item>
        ))}
    </ActionList>
    <SelectPanel.Footer />
</SelectPanel>`;

// The button named by the field around it rather than by the words on it alone. A button is not
// something a label can name, so the field hands it an id and points at it instead, and the button
// is read as what is written on it and then as what the field calls it
const FormControlPreview = () => {
    const { selected, toggle } = useSelection();

    return (
        <Stack align="start">
            <FormControl>
                <FormControl.Label>Labels</FormControl.Label>
                <SelectPanelComponent title="Select labels">
                    <SelectPanelComponent.Button>Assign label</SelectPanelComponent.Button>
                    <ActionList>
                        {labels.map((label) => (
                            <ActionList.Item
                                key={label}
                                selected={selected.includes(label)}
                                onSelect={() => toggle(label)}
                            >
                                {label}
                            </ActionList.Item>
                        ))}
                    </ActionList>
                    <SelectPanelComponent.Footer />
                </SelectPanelComponent>
                <FormControl.Caption>Labels organise issues and pull requests</FormControl.Caption>
            </FormControl>
        </Stack>
    );
};

const formControlCode = `<FormControl>
    <FormControl.Label>Labels</FormControl.Label>
    <SelectPanel title="Select labels">
        <SelectPanel.Button>Assign label</SelectPanel.Button>
        <ActionList>
            {labels.map((label) => (
                <ActionList.Item
                    key={label}
                    selected={selected.includes(label)}
                    onSelect={() => toggle(label)}
                >
                    {label}
                </ActionList.Item>
            ))}
        </ActionList>
        <SelectPanel.Footer />
    </SelectPanel>
    <FormControl.Caption>Labels organise issues and pull requests</FormControl.Caption>
</FormControl>`;

// The panel as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then how much can be picked, then what the panel says about itself and its list,
// then where it stands, and last who is holding it open and how the button is named
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The button that opens the panel, the list inside it, and the bar at the foot that saves what was picked. Several labels can be held at once, which is what a panel does unless it is told otherwise, so nothing is settled until Save is pressed and dismissing it gives the picks up. The list is an ordinary ActionList: the panel is what makes its items options of a listbox named by the title, so the same list is written the same way wherever it stands. The panel holds none of the selection itself — it says what was picked and the caller decides what that comes to.",
        setup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "A field to filter by",
        description:
            "Written into the header, which is what the header is otherwise there for. What is typed is reported rather than acted on: the panel is handed a list rather than the whole of what the list came from, so which items are left is the caller's to work out. The down arrow from the field moves onto the first item, so the list is reached without leaving the keyboard. Where nothing is left the panel says so in place of the list, since an empty list is what was asked for rather than something going wrong.",
        setup: searchSetup,
        preview: <SearchPreview />,
        code: searchCode,
    },
    {
        name: "One at a time",
        description:
            "Picking gives up whatever was held before it, so the answer is the one it landed on rather than a list to be added to and taken from. The bar at the foot stays, since the pick is still not settled until it is saved.",
        setup: singleSetup,
        preview: <SinglePreview />,
        code: singleCode,
    },
    {
        name: "Taking the first pick as the answer",
        description:
            "The panel closes on the pick and saves it on the way out. There is nothing left to save, so it is written without a footer — one would draw a bar with nothing in it. It is for a panel where picking is the whole of what the reader came to do, and where being able to change one's mind before saving buys nothing.",
        setup: singleSetup,
        preview: <InstantPreview />,
        code: instantCode,
    },
    {
        name: "A description under the title",
        description:
            "A line saying more about what is being picked. It describes the panel to a screen reader as well as standing under the title, so it is read out as the panel is arrived in rather than only seen.",
        setup,
        preview: <DescriptionPreview />,
        code: descriptionCode,
    },
    {
        name: "Giving up every pick at once",
        description:
            "A button in the header beside what closes the panel. It is only drawn where the caller says what clearing comes to: there is nothing for the panel to clear on its own, since the selection was never its to hold. It leaves the panel open, so what was cleared can be picked again without starting over.",
        setup,
        preview: <ClearPreview />,
        code: clearCode,
    },
    {
        name: "Groups",
        description:
            "The items collected under headings of their own. The grouping is the list's rather than the panel's, so it is written the way it would be in any other list, and a heading is a row that cannot be picked — the arrow keys move between the items and pass over it.",
        setup,
        preview: <GroupsPreview />,
        code: groupsCode,
    },
    {
        name: "While the items are being fetched",
        description:
            "What stands in place of the list until there is one. It is a live region, so the wait is read out to a reader whose focus has stayed in the field above it, rather than being left to the spinner, which says nothing on its own.",
        preview: loadingPreview,
        code: loadingCode,
    },
    {
        name: "Saying something about the list",
        description:
            "A warning stands above the list, which is still there to be picked from — what is showing is not the whole of it, but it is worth showing. An error stands in place of the list, since there is nothing to pick from at all, and carries a title of its own to say what went wrong. Both are read out as they arrive.",
        setup,
        preview: <MessagesPreview />,
        code: messagesCode,
    },
    {
        name: "Where the panel stands",
        description:
            "Drawn over the middle of the page rather than against the button that opened it. It is for a panel with more in it than a column beside a button has room for. Where it stands can also be given one viewport range at a time: a narrow screen has no room to stand a panel beside its anchor, so it is given the whole screen — which is what it falls back to unless it is told otherwise — or the foot of the screen instead.",
        setup,
        preview: <ModalPreview />,
        code: modalCode,
    },
    {
        name: "Something else in the footer",
        description:
            "A second thing the bar can do, standing at the start of it beside saving and cancelling. What it is drawn as follows from the variant — a link out to somewhere, a button, or a checkbox for something that holds while the panel is open — since all three read as one action in the same place.",
        setup,
        preview: <SecondaryActionPreview />,
        code: secondaryActionCode,
    },
    {
        name: "Where the caller keeps hold of it",
        description:
            "The panel shows what it is told rather than what was pressed. Holding it this way means the button has to say what pressing it comes to, and being dismissed or saved has to be answered by closing it — the panel reports both and leaves the closing to the caller, so a panel that should stay open on save can.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "On a form",
        description:
            "The button named by the field around it rather than by the words on it alone. A button is not something a label can name, so the field hands it an id and points at it instead; the button is read as what is written on it and then as what the field calls it, in that order. What the field says about being required is left off, since a button cannot be one.",
        setup,
        preview: <FormControlPreview />,
        code: formControlCode,
    },
];

// Where the panel stands. It is written as the library writes it, since what a caller is held to is
// one value or one value to a viewport range rather than either on its own, and a narrow range
// takes two more that only make sense where there is no room beside the anchor
const variant = "SelectPanelVariant | SelectPanelResponsiveVariant";

// Whether one item or several can be picked
const selectionVariant = '"single" | "multiple" | "instant"';

// A step of the panel width scale, or the width of whatever the panel holds
const width = '"small" | "medium" | "large" | "xlarge" | "auto"';

// How tall the panel is allowed to grow before the list within it starts to scroll
const maxHeight = '"small" | "medium" | "large" | "xlarge" | "fit-content"';

// Which edge of the anchor an anchored panel stands off
const side = '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"';

// Where along that edge it lines up
const align = '"start" | "center" | "end"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the panel takes, and then the parts it is written with.
//
// What the panel is called comes first, since that is what names it to a reader and ties the list
// inside it to something; then how much can be picked, then whether it is open and what it reports,
// then where it stands and how large it is drawn
const groups: ComponentPropGroup[] = [
    {
        name: "SelectPanel",
        props: [
            {
                name: "title",
                type: "string",
                required: true,
                description:
                    "What the panel is called. It names the panel to a screen reader as well as titling it, and the list inside it is read as a listbox named by the same words, so a reader arriving in either is told what they are picking from",
            },
            {
                name: "description",
                type: "string",
                description:
                    "A line under the title saying more about what is being picked. It describes the panel to a screen reader as well as standing under the title",
            },
            {
                name: "selectionVariant",
                type: selectionVariant,
                default: '"multiple"',
                description:
                    "Whether one item or several can be picked. Instant takes the first pick as the answer and closes the panel with it, so there is nothing left to save and the footer draws no actions of its own",
            },
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the panel is shown, where the caller keeps hold of that. A panel held this way shows what it is told rather than what was pressed, so being dismissed or saved has to be answered by closing it",
            },
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether it starts open, where the panel keeps hold of that itself",
            },
            {
                name: "onSubmit",
                type: "(event?: React.FormEvent<HTMLFormElement>) => void",
                description:
                    "Called when the selection is saved, which closes a panel keeping its own state. A panel that takes the first pick as its answer saves without a form event, so there is none to hand back",
            },
            {
                name: "onCancel",
                type: "() => void",
                description:
                    "Called when the panel is dismissed without the selection being saved — by the close button, by Escape, or by a press outside it",
            },
            {
                name: "onClearSelection",
                type: "() => void",
                description:
                    "Shows a button in the header that gives up every pick at once, and is called when it is pressed. Left out, there is no button: there is nothing for the panel to clear on its own, since the selection was never its to hold",
            },
            {
                name: "variant",
                type: variant,
                default: '{ regular: "anchored", narrow: "full-screen" }',
                description:
                    "Where the panel stands: anchored against whatever opened it, or modal over the middle of the page. It can be given one viewport range at a time, and a narrow range takes two more — full-screen and bottom-sheet — since a narrow screen has no room to stand a panel beside its anchor",
            },
            {
                name: "side",
                type: side,
                default: '"outside-bottom"',
                description:
                    "Which edge of the anchor an anchored panel stands off. It is where the panel is put rather than where it stays: a panel with no room on that side is placed where there is room",
            },
            {
                name: "align",
                type: align,
                default: '"start"',
                description: "Where along that edge it lines up",
            },
            {
                name: "anchorRef",
                type: "React.RefObject<HTMLButtonElement | null>",
                description:
                    "Stands in for the ref the panel would otherwise hold its anchor with, for a panel opened from something it was not given as a child",
            },
            {
                name: "width",
                type: width,
                default: '"medium"',
                description: "How wide the panel is drawn, or the width of whatever it holds",
            },
            {
                name: "maxHeight",
                type: maxHeight,
                default: '"large"',
                description:
                    "How tall the panel is allowed to grow before the list within it starts to scroll. The header and the footer keep their places as it does, so what closes and saves the panel is always in reach",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Ties the title and the description to the panel. One is made where the caller does not give one, so it is only worth giving where something outside the panel has to point at the same thing",
            },
            styling,
            {
                name: "...div props",
                type: 'Omit<React.ComponentPropsWithoutRef<"div">, "title" | "onSubmit">',
                description:
                    "The panel is a div underneath, so it takes what one takes. The two left out are the panel's own: a title on a div is a tooltip rather than a name, and the form inside the panel is what is submitted",
            },
        ],
    },
    {
        name: "SelectPanel.Button",
        props: [
            {
                name: "...button props",
                type: "ButtonProps",
                description:
                    "It is an ordinary button, so it takes what one takes: variant, size, leadingVisual, onClick, and the rest. It is taken out of the panel's children and drawn where the panel itself stands, and the panel wires it up as its anchor — so it says what it opens, whether that is open, and where the panel is measured against",
            },
        ],
    },
    {
        name: "SelectPanel.Header",
        props: [
            {
                name: "onBack",
                type: "() => void",
                description:
                    "Shows a button that goes back to wherever the panel was opened from, and is called when it is pressed. Left out, there is no button. It is for a panel reached from another one, where dismissing would take the reader further than they meant to go",
            },
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "A panel with no header of its own is given one, so there is always something to close it by. It is written out only to put something in it — the field the list is filtered by, or a way back",
            },
        ],
    },
    {
        name: "SelectPanel.SearchInput",
        props: [
            {
                name: "onChange",
                type: "(value: string, event: React.ChangeEvent<HTMLInputElement> | null) => void",
                description:
                    "Called as the text changes, and with an empty string when the field is cleared. There is no event to hand back in that second case, so the text comes first",
            },
            {
                name: "value",
                type: "string",
                description:
                    "What the field holds, where the caller keeps hold of that. Left out, the panel keeps the text for it",
            },
            styling,
            {
                name: "...text input props",
                type: 'Omit<TextInputProps, "onChange">',
                description:
                    "It is a text input underneath, so it takes what one takes. The mark that leads it, what it says while empty, the way to clear it and the width it fills are the panel's own. The down arrow from it moves onto the first item in the list, so the list is reached without leaving the keyboard",
            },
        ],
    },
    {
        name: "SelectPanel.Footer",
        props: [
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "The bar at the foot, where the selection is saved or given up. What saves and cancels is the footer's own; anything written inside it stands at the start of the bar. A panel that takes the first pick as its answer has nothing to save, so a footer with nothing of the caller's in it is not drawn at all",
            },
        ],
    },
    {
        name: "SelectPanel.SecondaryAction",
        props: [
            {
                name: "variant",
                type: '"button" | "link" | "checkbox"',
                required: true,
                description:
                    "What the action is drawn as. All three read as one action in the same place, so the variant settles the element and nothing else, and the rest of the props are whichever of Button, Link or Checkbox it comes to",
            },
        ],
    },
    {
        name: "SelectPanel.Loading",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                default: '"Fetching items..."',
                description:
                    "What is said while the items are being fetched. It is a live region, so this is what a reader is told rather than being left to the spinner beside it",
            },
            styling,
        ],
    },
    {
        name: "SelectPanel.Message",
        props: [
            {
                name: "variant",
                type: '"warning" | "error" | "empty"',
                required: true,
                description:
                    "What the message is about. A warning or an error is read out as it arrives; an empty list is what was asked for rather than something going wrong, so it is not announced",
            },
            {
                name: "size",
                type: '"inline" | "full"',
                default: '"inline", or "full" for an empty list',
                description:
                    "Whether the message stands above the list or in place of it. An empty list is only ever reported in full, since there is no list left for a line to stand above",
            },
            {
                name: "title",
                type: "string",
                description:
                    "What the message is headed with. Only a full message takes one, since an inline message is a single line of text, and a full one has to be given one",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the panel is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const SelectPanel = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                SelectPanel
            </Heading>
            <Text as="p" size="large">
                A panel for picking from a list of things, opened from a button and closed by saving
                what was picked or giving it up. It is for a list too long to stand on the page and
                too particular to be a menu: one that has to be filtered down, that says when it is
                still loading or came back short, and that holds several picks at once until they
                are saved together. The panel holds none of the selection itself — it says what was
                picked and the caller decides what that comes to — and the list inside it is an
                ordinary ActionList, which the panel reads as a listbox named by its own title.
                Where a narrow screen has no room to stand it beside its button it takes the whole
                screen instead.
            </Text>
        </Stack>
        <ComponentExamples component="SelectPanel" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default SelectPanel;
