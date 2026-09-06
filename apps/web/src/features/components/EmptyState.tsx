import {
    DocumentRegular,
    FilterDismissRegular,
    FolderRegular,
    SearchRegular,
} from "@gamecrafters/base-ui-icons";
import {
    ActionList,
    Button,
    EmptyState as EmptyStateComponent,
    Heading,
    Link,
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
    // The message draws no frame of its own and comes to the middle of whatever holds it, so it is
    // given a box to stand in. Without one there is nothing saying where what came back empty
    // begins and leaves off, and the message would read as the page having nothing on it rather
    // than as one box on it having nothing in it
    box: "w-[var(--overlay-width-medium)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default",
    // A panel that holds a list, so the message can be read standing where the list would have been
    panel: "w-[var(--overlay-width-small)] overflow-hidden rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default",
    // What the panel is titled by. It is the caller's own rather than the library's, since what a
    // panel puts along its top is whatever that panel is for
    panelHeader:
        "p-[var(--base-size-8)] border-solid border-b-[length:var(--border-width-thin)] border-b-border-default [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]",
};

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const boxSetup = `const box = "w-[var(--overlay-width-medium)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default";`;

const panelSetup = `const panel = "w-[var(--overlay-width-small)] overflow-hidden rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default";

const panelHeader = "p-[var(--base-size-8)] border-solid border-b-[length:var(--border-width-thin)] border-b-border-default [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)]";`;

// The plainest message there is: a mark, what is not there, and a line saying what to do about it.
// Nothing is said with a prop, so it comes to the middle of the scale.
//
// The box around it is part of what is being shown rather than the page's own furniture. The
// message draws no frame and centres itself in whatever it was put in, so standing on the card
// alone it would read as the card being empty rather than as a box within it having come back with
// nothing.
//
// The page and the component it is about are both called EmptyState, so the component is brought in
// under a name saying which of the two it is. The listing beneath says EmptyState, as an
// application importing it would
const defaultPreview = (
    <div className={classes.box}>
        <EmptyStateComponent
            icon={SearchRegular}
            title="No results found"
            description="Try a different search term"
        />
    </div>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<div className={box}>
    <EmptyState
        icon={SearchRegular}
        title="No results found"
        description="Try a different search term"
    />
</div>`;

// Which step of the scale the message is drawn at. The two are drawn together rather than one to an
// example, since a size is read against the other rather than on its own, and each is named by the
// value that drew it. They are laid one under another rather than across, since a message fills
// whatever holds it
const sizesPreview = (
    <Stack gap="condensed">
        <div className={classes.box}>
            <EmptyStateComponent
                size="small"
                icon={SearchRegular}
                title="small"
                description="Try a different search term"
            />
        </div>
        <div className={classes.box}>
            <EmptyStateComponent
                size="medium"
                icon={SearchRegular}
                title="medium"
                description="Try a different search term"
            />
        </div>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the two read one under the other, so it is written out with them
const sizesCode = `<Stack gap="condensed">
    <div className={box}>
        <EmptyState
            size="small"
            icon={SearchRegular}
            title="small"
            description="Try a different search term"
        />
    </div>
    <div className={box}>
        <EmptyState
            size="medium"
            icon={SearchRegular}
            title="medium"
            description="Try a different search term"
        />
    </div>
</Stack>`;

// The message without a mark over it, for one that has to keep to as little room as it can. Every
// part but the title is optional and is drawn only where it is given, so leaving the icon out is a
// matter of not writing it rather than of saying so with a prop
const withoutIconPreview = (
    <div className={classes.box}>
        <EmptyStateComponent title="No results found" description="Try a different search term" />
    </div>
);

const withoutIconCode = `<div className={box}>
    <EmptyState title="No results found" description="Try a different search term" />
</div>`;

// The title on its own, for somewhere there is nothing more worth saying. A line under it that only
// says the title again is a line a reader has to read to find that out
const titleOnlyPreview = (
    <div className={classes.box}>
        <EmptyStateComponent title="No results found" />
    </div>
);

const titleOnlyCode = `<div className={box}>
    <EmptyState title="No results found" />
</div>`;

// What can be done about it, standing at the foot of the message. They are handed over already
// built rather than named, so what stands there is whatever the caller would have put there
// anyway, and more than one of them lays out in a row that wraps
const withActionsPreview = (
    <div className={classes.box}>
        <EmptyStateComponent
            icon={FilterDismissRegular}
            title="No issues match these filters"
            description="Clear the filters you have set, or widen them"
            actions={
                <>
                    <Button variant="primary">Clear filters</Button>
                    <Button>Edit filters</Button>
                </>
            }
        />
    </div>
);

const withActionsCode = `<div className={box}>
    <EmptyState
        icon={FilterDismissRegular}
        title="No issues match these filters"
        description="Clear the filters you have set, or widen them"
        actions={
            <>
                <Button variant="primary">Clear filters</Button>
                <Button>Edit filters</Button>
            </>
        }
    />
</div>`;

// A message that points somewhere rather than acting. The line under the title is written rather
// than said, so anything that can be read in a sentence can stand in it
const withLinkPreview = (
    <div className={classes.box}>
        <EmptyStateComponent
            icon={DocumentRegular}
            title="No documents yet"
            description={
                <>
                    Read about <Link href="#documents">how documents work</Link> to get started
                </>
            }
        />
    </div>
);

const withLinkCode = `<div className={box}>
    <EmptyState
        icon={DocumentRegular}
        title="No documents yet"
        description={
            <>
                Read about <Link href="#documents">how documents work</Link> to get started
            </>
        }
    />
</div>`;

// What the message is there for: standing where the list would have been, inside the panel that
// still carries its own title. The panel holding a list is drawn beside it, so what the message is
// standing in place of can be seen rather than taken on trust. It is drawn at the small size, since
// what holds it is a panel rather than a page
const inPlaceOfAListPreview = (
    <Stack gap="normal">
        <div className={classes.panel}>
            <div className={classes.panelHeader}>Labels</div>
            <ActionList>
                <ActionList.Item>bug</ActionList.Item>
                <ActionList.Item>enhancement</ActionList.Item>
            </ActionList>
        </div>
        <div className={classes.panel}>
            <div className={classes.panelHeader}>Labels</div>
            <EmptyStateComponent
                size="small"
                icon={SearchRegular}
                title="No labels found"
                description="Try a different search term"
            />
        </div>
    </Stack>
);

const inPlaceOfAListCode = `<Stack gap="normal">
    <div className={panel}>
        <div className={panelHeader}>Labels</div>
        <ActionList>
            <ActionList.Item>bug</ActionList.Item>
            <ActionList.Item>enhancement</ActionList.Item>
        </ActionList>
    </div>
    <div className={panel}>
        <div className={panelHeader}>Labels</div>
        <EmptyState
            size="small"
            icon={SearchRegular}
            title="No labels found"
            description="Try a different search term"
        />
    </div>
</Stack>`;

// Something of the caller's own, standing between the message and the actions. It is where anything
// the three named parts have no place for goes, which keeps it inside the column the message is laid
// out in rather than under the whole of it
const withCustomContentPreview = (
    <div className={classes.box}>
        <EmptyStateComponent
            icon={FolderRegular}
            title="This folder is empty"
            actions={<Button variant="primary">Upload a file</Button>}
        >
            <Link href="#import">Import from somewhere else</Link>
        </EmptyStateComponent>
    </div>
);

const withCustomContentCode = `<div className={box}>
    <EmptyState
        icon={FolderRegular}
        title="This folder is empty"
        actions={<Button variant="primary">Upload a file</Button>}
    >
        <Link href="#import">Import from somewhere else</Link>
    </EmptyState>
</div>`;

// The message as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then the scale it is drawn on, then what is taken off it, then what is hung on it,
// and last where it actually stands
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: boxSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "Which step of the scale the message is drawn at: the type of the title and of the line under it, the mark over them, and the room around the lot. The small one is for a message standing inside a list or a menu, the medium one for a panel or a card.",
        setup: boxSetup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Without an icon",
        description:
            "The message without a mark over it, for one that has to keep to as little room as it can. Every part but the title is optional and is drawn only where it is given, so leaving the icon out is a matter of not writing it rather than of saying so with a prop.",
        setup: boxSetup,
        preview: withoutIconPreview,
        code: withoutIconCode,
    },
    {
        name: "Title only",
        description:
            "The title on its own, for somewhere there is nothing more worth saying. A line under it that only says the title again is a line a reader has to read to find that out.",
        setup: boxSetup,
        preview: titleOnlyPreview,
        code: titleOnlyCode,
    },
    {
        name: "With actions",
        description:
            "What can be done about it, standing at the foot of the message. They are handed over already built rather than named, so what stands there is whatever the caller would have put there anyway, and more than one of them lays out in a row that wraps.",
        setup: boxSetup,
        preview: withActionsPreview,
        code: withActionsCode,
    },
    {
        name: "With a link in the description",
        description:
            "A message that points somewhere rather than acting. The line under the title is written rather than said, so anything that can be read in a sentence can stand in it.",
        setup: boxSetup,
        preview: withLinkPreview,
        code: withLinkCode,
    },
    {
        name: "In place of a list",
        description:
            "What the message is there for: standing where the list would have been, inside the panel that still carries its own title. The panel holding a list is drawn above it, so what the message stands in place of can be seen rather than taken on trust.",
        setup: panelSetup,
        preview: inPlaceOfAListPreview,
        code: inPlaceOfAListCode,
    },
    {
        name: "With content of its own",
        description:
            "Something of the caller's own, standing between the message and the actions. It is where anything the three named parts have no place for goes, which keeps it inside the column the message is laid out in rather than under the whole of it.",
        setup: boxSetup,
        preview: withCustomContentPreview,
        code: withCustomContentCode,
    },
];

// Which step of the scale the message is drawn at. It stands as the values themselves rather than
// as the name they are collected under, since one of them is what a caller actually hands over
const size = '"small" | "medium"';

// What the mark over the title can be given as. Either is taken, so an icon that only has to be
// drawn is named and left to the message to size, and one that has anything said to it is built
// first and handed over already drawn
const visual = "React.ElementType | React.ReactNode";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the message takes. Its parts are drawn from what it is handed rather than written out
// by the caller, so there is the one table.
//
// What is not there comes first, since it is the whole of what the message says, then why it is not
// there, then the mark over the two of them, then the scale they are drawn at, and last what hangs
// off the foot
const groups: ComponentPropGroup[] = [
    {
        name: "EmptyState",
        props: [
            {
                name: "title",
                type: "React.ReactNode",
                required: true,
                description:
                    "Says what is not there. A box holding nothing and saying nothing is only an empty box, so it is the one part the message will not be drawn without",
            },
            {
                name: "description",
                type: "React.ReactNode",
                description:
                    "Says why it is not there, or what to do about it. It is written rather than said, so a sentence with a link in it can stand there; one that only says the title again is left out",
            },
            {
                name: "icon",
                type: visual,
                description:
                    "The mark standing over the title, given either as the component to draw or as something already built. It is sized and coloured by the message rather than by what it arrived as, and it says nothing the title has not, so it is kept out of the accessibility tree",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                options: ["small", "medium"],
                description:
                    "Which step of the scale the message is drawn at: the type of the title and of the line under it, the mark over them, and the room around the lot. The small one is for a message standing inside a list or a menu, the medium one for a panel or a card",
            },
            {
                name: "actions",
                type: "React.ReactNode",
                description:
                    "What can be done about it, standing at the foot of the message. More than one lays out in a row that wraps",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Anything else of the caller's own, standing between the message and the actions, for what the named parts have no place for",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the message is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const EmptyState = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                EmptyState
            </Heading>
            <Text as="p" size="large">
                What a box that came back with nothing shows in place of what it would have held: a
                mark, what is not there, a line saying why, and whatever can be done about it. It
                stands where a list emptied by a filter, a search that found nothing or a panel
                nobody has added to yet would otherwise leave a gap. It draws no frame of its own
                and comes to the middle of whatever holds it, so it is the panel or the cell around
                it that says where the emptiness begins and leaves off, and a whole page a reader
                has not started using is a Blankslate instead, which is drawn at that scale and
                carries a heading of its own. It is not announced of its own accord, since a reader
                who narrowed a list down to nothing was told what they asked; a list that empties
                without being asked is given a role that has the message read out.
            </Text>
        </Stack>
        <ComponentExamples component="EmptyState" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default EmptyState;
