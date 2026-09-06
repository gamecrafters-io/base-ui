import * as React from "react";
import {
    BranchRegular,
    PersonRegular,
    SearchRegular,
    TagRegular,
} from "@gamecrafters/base-ui-icons";
import {
    ActionList,
    Avatar,
    CounterLabel,
    EmptyState,
    FilteredActionList as FilteredActionListComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import type { FilteredActionListItemInput } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The list scrolls within whatever holds it rather than growing to hold its items, so the
    // examples give it a box with a size of its own. Without one there would be nothing for it to
    // scroll within, and nothing around it to tell the panel from the page
    container:
        "w-[20rem] h-[20rem] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default",
};

// The people every example but three is drawn from. They are the ones the library's own stories
// use, and several of them begin the same way, which is what a list being narrowed is worth
// reading against
const people = [
    "Monalisa Octocat",
    "Hubot",
    "Mona Lisa",
    "Octocat",
    "Ada Lovelace",
    "Grace Hopper",
    "Alan Turing",
    "Katherine Johnson",
    "Margaret Hamilton",
    "Barbara Liskov",
];

const peopleItems: FilteredActionListItemInput[] = people.map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
}));

// What each item says about itself beyond its name: a line under it, and a word after it
const branchItems: FilteredActionListItemInput[] = [
    { id: "main", text: "main", description: "default", trailingVisual: "3 days ago" },
    { id: "next", text: "next", description: "ahead by 4 commits" },
    { id: "fix-overflow", text: "fix-overflow", description: "behind by 1 commit" },
    { id: "release-2-1", text: "release-2.1", description: "protected" },
].map((item) => ({ ...item, leadingVisual: BranchRegular }));

// The items a grouped list is collected from, each saying which group it belongs to
const labelItems: FilteredActionListItemInput[] = [
    { id: "bug", text: "bug", groupId: "type" },
    { id: "enhancement", text: "enhancement", groupId: "type" },
    { id: "documentation", text: "documentation", groupId: "type" },
    { id: "good-first-issue", text: "good first issue", groupId: "effort" },
    { id: "help-wanted", text: "help wanted", groupId: "effort" },
].map((item) => ({ ...item, leadingVisual: TagRegular }));

// More items than are worth drawing, which is what virtualising is for. They are built once here
// rather than as the example renders, since a thousand of them is a thousand of them every time
const manyItems: FilteredActionListItemInput[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    text: `Item ${index + 1}`,
    leadingVisual: TagRegular,
}));

// What is said in place of a list the filter has left with nothing. It is written once and handed
// over twice: to what is drawn, and to what a screen reader is told
const emptyMessage = {
    title: "No people found",
    description: "Try a different name",
};

// The picture the renderer of the caller's own draws
const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

// The filtering itself is the caller's, so every example does it the same way
const matching = (items: FilteredActionListItemInput[], filter: string) =>
    items.filter((item) => item.text?.toLowerCase().includes(filter.toLowerCase()));

// What the examples have to have in hand before they can be drawn, written a piece to the thing it
// settles so that an example takes only the ones it actually reaches for
const containerSetup = `const container = "w-[20rem] h-[20rem] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default";`;

const peopleSetup = `const people = [
    "Monalisa Octocat",
    "Hubot",
    "Mona Lisa",
    "Octocat",
    "Ada Lovelace",
    "Grace Hopper",
    "Alan Turing",
    "Katherine Johnson",
    "Margaret Hamilton",
    "Barbara Liskov",
];

const peopleItems = people.map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
}));`;

const matchingSetup = `// The filtering itself is the caller's, so the list is handed what is left of the items
const matching = (items, filter) =>
    items.filter((item) => item.text?.toLowerCase().includes(filter.toLowerCase()));`;

const filterSetup = `const [filter, setFilter] = React.useState("");`;

// What a list built the way they usually are has to have in hand: the box it is drawn in, the items
// it shows, how they are narrowed, and the text they are narrowed by
const peopleFilterSetup = `${containerSetup}

${peopleSetup}

${matchingSetup}

${filterSetup}`;

// The plainest list there is: a field, and under it the items it has left. The filtering is the
// caller's, so what the list is handed is already narrowed and the field only says what to narrow
// by.
//
// The box around it is part of what is being shown rather than the page's own furniture. The list
// scrolls within whatever holds it rather than growing, so standing on the card alone it would have
// nothing to scroll within.
//
// The page and the component it is about are both called FilteredActionList, so the component is
// brought in under a name saying which of the two it is. The listing beneath says
// FilteredActionList, as an application importing it would
const DefaultPreview = () => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(peopleItems, filter)}
        />
    );
};

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<FilteredActionList
    className={container}
    placeholderText="Filter people"
    filterValue={filter}
    onFilterChange={setFilter}
    items={matching(peopleItems, filter)}
/>`;

// What an item can say beyond its name: a mark before it, a line under it, and a word after it. The
// list draws its items from what it is told about them rather than from elements it is handed, so
// all of it is written in the items rather than around them
const DescriptionsPreview = () => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter branches"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(branchItems, filter)}
        />
    );
};

const branchesSetup = `${containerSetup}

const branchItems = [
    { id: "main", text: "main", description: "default", trailingVisual: "3 days ago" },
    { id: "next", text: "next", description: "ahead by 4 commits" },
    { id: "fix-overflow", text: "fix-overflow", description: "behind by 1 commit" },
    { id: "release-2-1", text: "release-2.1", description: "protected" },
].map((item) => ({ ...item, leadingVisual: BranchRegular }));

${matchingSetup}

${filterSetup}`;

const descriptionsCode = `<FilteredActionList
    className={container}
    placeholderText="Filter branches"
    filterValue={filter}
    onFilterChange={setFilter}
    items={matching(branchItems, filter)}
/>`;

// Items that are picked rather than gone to. Which of them are picked is the caller's to keep, as
// the filtering is: the list is told which they are and calls back as one is pressed, and does not
// hold the answer itself
const SelectionPreview = () => {
    const [filter, setFilter] = React.useState("");
    const [selected, setSelected] = React.useState<string[]>(["Hubot"]);

    const toggle = (name: string) =>
        setSelected((current) =>
            current.includes(name) ? current.filter((entry) => entry !== name) : [...current, name],
        );

    const items: FilteredActionListItemInput[] = people.map((name, index) => ({
        id: index,
        text: name,
        leadingVisual: PersonRegular,
        selected: selected.includes(name),
        onAction: () => toggle(name),
    }));

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter people"
            selectionVariant="multiple"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(items, filter)}
        />
    );
};

const selectionSetup = `${containerSetup}

${peopleSetup}

${matchingSetup}

${filterSetup}

const [selected, setSelected] = React.useState(["Hubot"]);

const toggle = (name) =>
    setSelected((current) =>
        current.includes(name) ? current.filter((entry) => entry !== name) : [...current, name],
    );

const items = people.map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
    selected: selected.includes(name),
    onAction: () => toggle(name),
}));`;

const selectionCode = `<FilteredActionList
    className={container}
    placeholderText="Filter people"
    selectionVariant="multiple"
    filterValue={filter}
    onFilterChange={setFilter}
    items={matching(items, filter)}
/>`;

// A box above the list that picks every item the filter has left at once. It is drawn only where
// there is something to call as it changes, so a list that is only being read is left without one.
// What it is called and whether it is part checked follow from the items themselves, so nothing has
// to be said about it beyond what to do
const SelectAllPreview = () => {
    const [filter, setFilter] = React.useState("");
    const [selected, setSelected] = React.useState<string[]>([]);

    const visible = people.filter((name) => name.toLowerCase().includes(filter.toLowerCase()));

    const items: FilteredActionListItemInput[] = visible.map((name, index) => ({
        id: index,
        text: name,
        leadingVisual: PersonRegular,
        selected: selected.includes(name),
        onAction: () =>
            setSelected((current) =>
                current.includes(name)
                    ? current.filter((entry) => entry !== name)
                    : [...current, name],
            ),
    }));

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter people"
            selectionVariant="multiple"
            filterValue={filter}
            onFilterChange={setFilter}
            items={items}
            onSelectAllChange={(checked) => setSelected(checked ? visible : [])}
        />
    );
};

const selectAllSetup = `${containerSetup}

${peopleSetup}

${filterSetup}

const [selected, setSelected] = React.useState([]);

const visible = people.filter((name) => name.toLowerCase().includes(filter.toLowerCase()));

const items = visible.map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
    selected: selected.includes(name),
    onAction: () =>
        setSelected((current) =>
            current.includes(name)
                ? current.filter((entry) => entry !== name)
                : [...current, name],
        ),
}));`;

const selectAllCode = `<FilteredActionList
    className={container}
    placeholderText="Filter people"
    selectionVariant="multiple"
    filterValue={filter}
    onFilterChange={setFilter}
    items={items}
    onSelectAllChange={(checked) => setSelected(checked ? visible : [])}
/>`;

// The items collected under headings of their own. The groups are named apart from the items and
// are drawn in the order they are named here, while each item says which of them it belongs to, so
// an empty group still stands where it was put.
//
// A grouped list is never virtualised, whatever it is told: the headings break the run of items a
// virtualiser measures against, and a list small enough to be grouped is small enough to draw whole
const GroupedPreview = () => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter labels"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(labelItems, filter)}
            groupMetadata={[
                { groupId: "type", header: { title: "Type" } },
                { groupId: "effort", header: { title: "Effort", variant: "filled" } },
            ]}
        />
    );
};

const groupedSetup = `${containerSetup}

const labelItems = [
    { id: "bug", text: "bug", groupId: "type" },
    { id: "enhancement", text: "enhancement", groupId: "type" },
    { id: "documentation", text: "documentation", groupId: "type" },
    { id: "good-first-issue", text: "good first issue", groupId: "effort" },
    { id: "help-wanted", text: "help wanted", groupId: "effort" },
].map((item) => ({ ...item, leadingVisual: TagRegular }));

${matchingSetup}

${filterSetup}`;

const groupedCode = `<FilteredActionList
    className={container}
    placeholderText="Filter labels"
    filterValue={filter}
    onFilterChange={setFilter}
    items={matching(labelItems, filter)}
    groupMetadata={[
        { groupId: "type", header: { title: "Type" } },
        { groupId: "effort", header: { title: "Effort", variant: "filled" } },
    ]}
/>`;

// Where the wait is shown, and what stands in place of the list while it lasts. The three are drawn
// together rather than one to an example, since what each of them is for is read against the
// others, and each is named by the value that drew it.
//
// The spinner and the skeleton stand in place of the list; the one in the field leaves the items
// the list is already showing where they are, which is what a list being narrowed again wants
const waitingPreview = (
    <Stack direction="horizontal" gap="normal" wrap="wrap">
        <Stack gap="condensed">
            <Text size="small">body-spinner</Text>
            <FilteredActionListComponent
                className={classes.container}
                placeholderText="Filter people"
                loading
                loadingType="body-spinner"
                onFilterChange={() => {}}
                items={[]}
            />
        </Stack>
        <Stack gap="condensed">
            <Text size="small">body-skeleton</Text>
            <FilteredActionListComponent
                className={classes.container}
                placeholderText="Filter people"
                loading
                loadingType="body-skeleton"
                onFilterChange={() => {}}
                items={[]}
            />
        </Stack>
        <Stack gap="condensed">
            <Text size="small">input</Text>
            <FilteredActionListComponent
                className={classes.container}
                placeholderText="Filter people"
                loading
                loadingType="input"
                onFilterChange={() => {}}
                items={peopleItems}
            />
        </Stack>
    </Stack>
);

const waitingSetup = `${containerSetup}

${peopleSetup}`;

// The stacks are part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read beside one another with their names above them
const waitingCode = `<Stack direction="horizontal" gap="normal" wrap="wrap">
    <Stack gap="condensed">
        <Text size="small">body-spinner</Text>
        <FilteredActionList
            className={container}
            placeholderText="Filter people"
            loading
            loadingType="body-spinner"
            onFilterChange={() => {}}
            items={[]}
        />
    </Stack>
    <Stack gap="condensed">
        <Text size="small">body-skeleton</Text>
        <FilteredActionList
            className={container}
            placeholderText="Filter people"
            loading
            loadingType="body-skeleton"
            onFilterChange={() => {}}
            items={[]}
        />
    </Stack>
    <Stack gap="condensed">
        <Text size="small">input</Text>
        <FilteredActionList
            className={container}
            placeholderText="Filter people"
            loading
            loadingType="input"
            onFilterChange={() => {}}
            items={peopleItems}
        />
    </Stack>
</Stack>`;

// What stands in place of a list the filter has left with nothing. It is drawn by the caller rather
// than by the list, since what is worth saying about an empty list depends on what was being looked
// for, and it is said again in words for a screen reader, which is reading the count rather than
// looking at what replaced it
const NothingToShowPreview = () => {
    const [filter, setFilter] = React.useState("octopus");

    const items = matching(peopleItems, filter);

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={items}
            messageText={emptyMessage}
            message={
                items.length === 0 ? (
                    <EmptyState
                        icon={SearchRegular}
                        title={emptyMessage.title}
                        description={emptyMessage.description}
                    />
                ) : undefined
            }
        />
    );
};

const nothingToShowSetup = `${containerSetup}

${peopleSetup}

${matchingSetup}

const emptyMessage = {
    title: "No people found",
    description: "Try a different name",
};

const [filter, setFilter] = React.useState("octopus");

const items = matching(peopleItems, filter);`;

const nothingToShowCode = `<FilteredActionList
    className={container}
    placeholderText="Filter people"
    filterValue={filter}
    onFilterChange={setFilter}
    items={items}
    messageText={emptyMessage}
    message={
        items.length === 0 ? (
            <EmptyState
                icon={SearchRegular}
                title={emptyMessage.title}
                description={emptyMessage.description}
            />
        ) : undefined
    }
/>`;

// Only the items in view drawn, which is what keeps a list of more than a hundred quick. Every one
// of the thousand is still passed in and still filtered against; what changes is how many of them
// reach the page, so it is a saving here rather than a way of fetching less.
//
// The arrow keys move by index across the whole of the list rather than between the items that
// happen to have been drawn, so a reader holding one down arrives at the end rather than at the
// edge of what is in the DOM
const VirtualizedPreview = () => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter 1,000 items"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(manyItems, filter)}
            virtualized
        />
    );
};

const virtualizedSetup = `${containerSetup}

const manyItems = Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    text: \`Item \${index + 1}\`,
    leadingVisual: TagRegular,
}));

${matchingSetup}

${filterSetup}`;

const virtualizedCode = `<FilteredActionList
    className={container}
    placeholderText="Filter 1,000 items"
    filterValue={filter}
    onFilterChange={setFilter}
    items={matching(manyItems, filter)}
    virtualized
/>`;

// Something already built standing after the name, in place of the mark the list would have drawn
// from a component it was handed. A trailing visual takes either, so a count, a shortcut or a word
// can stand there as readily as an icon
const TrailingVisualsPreview = () => {
    const [filter, setFilter] = React.useState("");

    const items: FilteredActionListItemInput[] = people.slice(0, 5).map((name, index) => ({
        id: index,
        text: name,
        leadingVisual: PersonRegular,
        trailingVisual: <CounterLabel>{(index + 1) * 3}</CounterLabel>,
    }));

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(items, filter)}
        />
    );
};

const trailingVisualsSetup = `${containerSetup}

${peopleSetup}

${matchingSetup}

${filterSetup}

const items = people.slice(0, 5).map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
    trailingVisual: <CounterLabel>{(index + 1) * 3}</CounterLabel>,
}));`;

const trailingVisualsCode = `<FilteredActionList
    className={container}
    placeholderText="Filter people"
    filterValue={filter}
    onFilterChange={setFilter}
    items={matching(items, filter)}
/>`;

// A renderer of the caller's own, which draws the items the list has no way to describe. It is
// handed the item it is drawing and returns the element in place of the list's own, so anything an
// action list can hold can stand in a row.
//
// The list still filters and counts the items it was given, since all of that is read off what
// describes them rather than off what they were drawn as
const CustomRenderingPreview = () => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionListComponent
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(peopleItems, filter)}
            renderItem={(item) => (
                <ActionList.Item key={item.id} role="option" onSelect={() => {}}>
                    <ActionList.LeadingVisual>
                        <Avatar>
                            <Avatar.Image src={source} alt={item.text} />
                        </Avatar>
                    </ActionList.LeadingVisual>
                    {item.text}
                    <ActionList.Description>@{item.text?.split(" ")[0]}</ActionList.Description>
                </ActionList.Item>
            )}
        />
    );
};

const customRenderingSetup = `${containerSetup}

${peopleSetup}

${matchingSetup}

${filterSetup}

const source = "https://avatars.githubusercontent.com/u/7143434?v=4";`;

const customRenderingCode = `<FilteredActionList
    className={container}
    placeholderText="Filter people"
    filterValue={filter}
    onFilterChange={setFilter}
    items={matching(peopleItems, filter)}
    renderItem={(item) => (
        <ActionList.Item key={item.id} role="option" onSelect={() => {}}>
            <ActionList.LeadingVisual>
                <Avatar>
                    <Avatar.Image src={source} alt={item.text} />
                </Avatar>
            </ActionList.LeadingVisual>
            {item.text}
            <ActionList.Description>@{item.text?.split(" ")[0]}</ActionList.Description>
        </ActionList.Item>
    )}
/>`;

// The list as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what an item can say about itself, then what is done with the items, then what stands
// in place of them, and last the two ways of taking the drawing out of the list's hands
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: peopleFilterSetup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Items that say more about themselves",
        description:
            "What an item can say beyond its name: a mark before it, a line under it, and a word after it. The list draws its items from what it is told about them rather than from elements it is handed, since it counts and announces them itself and can do neither with elements it has only been given to draw, so all of it is written in the items rather than around them.",
        setup: branchesSetup,
        preview: <DescriptionsPreview />,
        code: descriptionsCode,
    },
    {
        name: "Picking items",
        description:
            "Items that are picked rather than gone to. Which of them are picked is the caller's to keep, as the filtering is: the list is told which they are and calls back as one is pressed, and holds no answer of its own. What is picked stays picked as the filter narrows the list, since it is held outside the items the list can see.",
        setup: selectionSetup,
        preview: <SelectionPreview />,
        code: selectionCode,
    },
    {
        name: "Picking every item at once",
        description:
            "A box above the list that picks every item the filter has left. It is drawn only where there is something to call as it changes, so a list that is only being read is left without one. What it is called and whether it is part checked follow from the items themselves, so nothing has to be said about it beyond what to do.",
        setup: selectAllSetup,
        preview: <SelectAllPreview />,
        code: selectAllCode,
    },
    {
        name: "Groups",
        description:
            "The items collected under headings of their own. The groups are named apart from the items and are drawn in the order they are named, while each item says which of them it belongs to. A grouped list is never virtualised, whatever it is told: the headings break the run of items a virtualiser measures against, and a list small enough to be grouped is small enough to draw whole.",
        setup: groupedSetup,
        preview: <GroupedPreview />,
        code: groupedCode,
    },
    {
        name: "Waiting on the items",
        description:
            "Where the wait is shown, and what stands in place of the list while it lasts. The spinner is for a list that has nothing to show yet, the skeleton for one arriving for the first time rather than being narrowed again, and the one in the field leaves the items the list is already showing where they are. Nothing is announced while it waits, since there is as yet nothing to say.",
        setup: waitingSetup,
        preview: waitingPreview,
        code: waitingCode,
    },
    {
        name: "Nothing to show",
        description:
            "What stands in place of a list the filter has left with nothing. It is drawn by the caller rather than by the list, since what is worth saying about an empty list depends on what was being looked for, and it is said again in words because a screen reader is being told the count rather than shown what replaced it.",
        setup: nothingToShowSetup,
        preview: <NothingToShowPreview />,
        code: nothingToShowCode,
    },
    {
        name: "Only the items in view",
        description:
            "A thousand items, of which a handful are ever drawn. Every one of them is still passed in and still filtered against, so this is a saving in what reaches the page rather than a way of fetching less. The arrow keys move by index across the whole of the list rather than between the items that happen to have been drawn, so a reader holding one down arrives at the end rather than at the edge of what is in the DOM.",
        setup: virtualizedSetup,
        preview: <VirtualizedPreview />,
        code: virtualizedCode,
    },
    {
        name: "Trailing visuals",
        description:
            "Something already built standing after the name, in place of the mark the list would have drawn from a component it was handed. A trailing visual takes either, so a count, a shortcut or a word can stand there as readily as an icon.",
        setup: trailingVisualsSetup,
        preview: <TrailingVisualsPreview />,
        code: trailingVisualsCode,
    },
    {
        name: "A renderer of the caller's own",
        description:
            "What draws the items the list has no way to describe. It is handed the item and returns the element in place of the list's own, so anything an action list can hold can stand in a row. The list still filters, counts and announces the items it was given, since all of that is read off what describes them rather than off what they were drawn as.",
        setup: customRenderingSetup,
        preview: <CustomRenderingPreview />,
        code: customRenderingCode,
    },
];

// Where the wait is shown, and what stands in place of the list while it lasts
const loadingType = '"body-spinner" | "body-skeleton" | "input"';

// Whether one item or several can be picked
const selectionVariant = '"single" | "multiple"';

// Whether the secondary text stands beside the name or below it
const descriptionVariant = '"inline" | "block"';

// What an item is, where one of them is the one that cannot be taken back
const itemVariant = '"default" | "danger"';

// How much a group is set apart from what surrounds it
const groupVariant = '"subtle" | "filled"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the list takes, and under it the shapes it is handed rather than the parts it is
// built from. The field, the box above the list and the rows themselves are the list's own to
// draw, so what a caller writes is the one element and the objects passed to it.
//
// The items come first, since they are the whole of what a list shows, then how they are narrowed,
// then what is done with them, and last the refs a caller reaches past the list with
const groups: ComponentPropGroup[] = [
    {
        name: "FilteredActionList",
        props: [
            {
                name: "items",
                type: "FilteredActionListItemInput[]",
                required: true,
                description:
                    "The items to show, already narrowed. Filtering them is the caller's, so the list can be filtered against anything from an array in hand to a server, and what it is handed is what it draws",
            },
            {
                name: "onFilterChange",
                type: "(value: string, event: React.ChangeEvent<HTMLInputElement> | null) => void",
                required: true,
                description:
                    "Called as the text in the field changes, so the caller can narrow the items it passes back",
            },
            {
                name: "filterValue",
                type: "string",
                description:
                    "The text the field is to hold, for a caller keeping it themselves. Left out, the field keeps its own and the caller is only told what it comes to",
            },
            {
                name: "placeholderText",
                type: "string",
                description:
                    "What the field says before anything has been typed into it. It names the field as well, since a list drawn inside a panel has nothing standing over it to do so",
            },
            {
                name: "groupMetadata",
                type: "FilteredActionListGroup[]",
                description:
                    "Collects the items under headings of their own. The groups are drawn in the order they are given here and each item says which of them it belongs to. A grouped list is never virtualised, since the headings break the run of items a virtualiser measures against",
            },
            {
                name: "selectionVariant",
                type: selectionVariant,
                options: ["single", "multiple"],
                description:
                    "Whether one item or several can be picked. Left out, the items are gone to rather than picked, and nothing is drawn to say which of them is which",
            },
            {
                name: "showItemDividers",
                type: "boolean",
                default: "false",
                description: "Draws a line between the items",
            },
            {
                name: "onSelectAllChange",
                type: "(checked: boolean) => void",
                description:
                    "Shows a box above the list that picks every item the filter has left, and is called as it changes. Left out, there is no box. What it is called and whether it is part checked follow from the items themselves",
            },
            {
                name: "loading",
                type: "boolean",
                default: "false",
                description:
                    "Whether the list is still waiting for the items it is to show. Nothing is announced while it waits, since there is as yet nothing to say",
            },
            {
                name: "loadingType",
                type: loadingType,
                default: '"body-spinner"',
                options: ["body-spinner", "body-skeleton", "input"],
                description:
                    "Where the wait is shown. The two body kinds stand in place of the list; the one in the field leaves the items the list is already showing where they are, which is what a list being narrowed again wants. The skeleton draws as many rows as the box it stands in has room for",
            },
            {
                name: "message",
                type: "React.ReactNode",
                description:
                    "Stands in place of the list, for a list with nothing to show. It is given the room the list would have had rather than laid out against its own text, so anything measuring itself against what it has been given finds it",
            },
            {
                name: "messageText",
                type: "FilteredActionListMessageText",
                description:
                    "What a screen reader is told in place of the count where the filter has left nothing. It is said again in words because the reader is being told what the list holds rather than shown what replaced it",
            },
            {
                name: "renderItem",
                type: "FilteredActionListRenderItem",
                description:
                    "Draws every item that has no renderer of its own, in place of the list's own drawing. The list still filters, counts and announces the items, since all of that is read off what describes them",
            },
            {
                name: "announcementsEnabled",
                type: "boolean",
                default: "true",
                description:
                    "Whether what the list is left holding is announced as it is filtered. Focus never leaves the field while the items change underneath it, so nothing about the list would otherwise be read out. It is turned off for a caller announcing it some other way",
            },
            {
                name: "virtualized",
                type: "boolean",
                default: "false",
                description:
                    "Draws only the items in view, which is what keeps a list of more than a hundred quick. The caller still passes every item and the list draws the few that can be seen, so it is a saving in what reaches the page rather than in what is fetched. It has no effect on a grouped list",
            },
            {
                name: "textInputProps",
                type: 'Partial<Omit<TextInputProps, "value" | "onChange">>',
                description:
                    "What the field is given beyond what the list hands it. The text and what happens as it changes are the list's own, since typing in the field is what narrows the list",
            },
            {
                name: "actionListProps",
                type: "Partial<ActionListProps>",
                description: "What the list itself is given beyond what the component hands it",
            },
            {
                name: "inputRef",
                type: "React.RefObject<HTMLInputElement | null>",
                description:
                    "A ref of the caller's own on the field, for a panel that puts focus there as it opens",
            },
            {
                name: "scrollContainerRef",
                type: "React.Ref<HTMLDivElement | null>",
                description: "A ref of the caller's own on the box the list scrolls within",
            },
            {
                name: "onListContainerRefChanged",
                type: "(element: HTMLUListElement | null) => void",
                description:
                    "Called with the element the list is drawn as, as it arrives and as it goes",
            },
            {
                name: "onInputRefChanged",
                type: "(ref: React.RefObject<HTMLInputElement | null>) => void",
                description: "Called with the ref the field is held by, once it is held",
            },
            styling,
        ],
    },
    {
        name: "FilteredActionListItemInput",
        props: [
            {
                name: "id",
                type: "number | string",
                description:
                    "Tells one item from another, and is unique within the list. It is what the list draws each row again against, so an item that says nothing about itself falls back to where it stands, which moves under it as the filter narrows",
            },
            {
                name: "text",
                type: "string",
                description:
                    "What names the item, and what is drawn as its label. The filtering is the caller's, so this is what a filter of theirs is usually written against",
            },
            {
                name: "description",
                type: "string",
                description: "Secondary text, which says more about the item than its name does",
            },
            {
                name: "descriptionVariant",
                type: descriptionVariant,
                default: '"inline"',
                options: ["inline", "block"],
                description:
                    "Whether the secondary text stands beside the name or below it. Below it, every line of it begins in the same place down the list rather than after a name of its own length",
            },
            {
                name: "leadingVisual",
                type: "React.ElementType",
                description:
                    "The mark standing before the text, named rather than built, so that the row settles its size and its colour",
            },
            {
                name: "trailingVisual",
                type: "React.ElementType | React.ReactNode",
                description:
                    "What stands after the text, given either as the component to draw or as something already built, so a count, a shortcut or a word can stand there as readily as an icon",
            },
            {
                name: "variant",
                type: itemVariant,
                default: '"default"',
                options: ["default", "danger"],
                description: "What the item is, where one of them cannot be taken back",
            },
            {
                name: "selected",
                type: "boolean",
                description:
                    "Whether the item is picked. Which items are picked is the caller's to keep, so this is read rather than held: the list draws what it is told and calls back as an item is pressed",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Stops the item being picked or gone to",
            },
            {
                name: "groupId",
                type: "string",
                description:
                    "Which group the item belongs to, in a grouped list. It is kept off the element it is drawn as, since it says nothing about that element",
            },
            {
                name: "onAction",
                type: "(item: FilteredActionListItemProps, event: ActionListSelectEvent) => void",
                description:
                    "Called when the item is picked, by pointer or by key, with the whole item rather than its id. Enter pressed in the field takes the first item, which is what a reader who has narrowed the list down to it is reaching for",
            },
            {
                name: "renderItem",
                type: "FilteredActionListRenderItem",
                description:
                    "Draws this item in place of the list's own drawing, for one item that the list has no way to describe. It is read before the list's own renderer, so a list with one unusual row need not take over the drawing of all of them",
            },
            {
                name: "key",
                type: "React.Key",
                description:
                    "What tells the item from the others as the list is drawn again, where its id does not stand for one",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "Stands inside the item, before the text",
            },
            styling,
        ],
    },
    {
        name: "FilteredActionListGroup",
        props: [
            {
                name: "groupId",
                type: "string",
                required: true,
                description:
                    "What the items belonging to the group say they belong to. The groups are drawn in the order they are given rather than the order the items are, so an empty group still stands where it was put",
            },
            {
                name: "header",
                type: "{ title?: string; variant?: " + groupVariant + " }",
                description:
                    "What the group is called, and how much it is set apart from what surrounds it. A group with nothing said about it is headed by its id",
            },
        ],
    },
    {
        name: "FilteredActionListMessageText",
        props: [
            {
                name: "title",
                type: "string",
                required: true,
                description:
                    "What is not there, said the way the message standing in its place says it",
            },
            {
                name: "description",
                type: "string",
                required: true,
                description: "Why it is not there, or what to do about it",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the list is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const FilteredActionList = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                FilteredActionList
            </Heading>
            <Text as="p" size="large">
                A list of things to pick, with a field above it that narrows them down. The
                filtering itself is the caller&apos;s: the list is handed whatever is left rather
                than the whole of the items and a rule for matching them, so the same list can be
                narrowed against an array in hand or against a server. It is read as a listbox
                standing inside the field that filters it, so the down arrow moves into it and enter
                takes the first item, and because focus never leaves the field while the items
                change underneath it, what the list is left holding is announced rather than left to
                be seen. It scrolls within whatever holds it rather than growing to hold its items,
                and it can draw only the ones in view, which is what keeps a list of a thousand as
                quick as a list of ten.
            </Text>
        </Stack>
        <ComponentExamples component="FilteredActionList" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default FilteredActionList;
