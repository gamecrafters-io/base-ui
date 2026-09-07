import { DismissRegular } from "@gamecrafters/base-ui-icons";
import {
    Button,
    Heading,
    IconButton,
    Link,
    Stack,
    Text,
    Tooltip as TooltipComponent,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Leaves room around the triggers for the tooltips to stand in, so one opening downwards does
    // not come out over the edge of the card
    room: "py-[var(--base-size-24)]",
};

// Every direction a tooltip can be sent, read round the compass rather than in the order they are
// declared, so the row is walked round the trigger
const directions = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;

// How long the pointer has to rest before the tooltip appears
const delays = ["short", "medium", "long"] as const;

const directionsSetup = `const directions = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];`;

const delaysSetup = `const delays = ["short", "medium", "long"];`;

// The plainest tooltip there is: a line saying more about a button that already says what it does.
// It is wrapped around the one thing it is about rather than pointed at it, so nothing has to be
// named for the two to find each other.
//
// The page and the component it is about are both called Tooltip, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Tooltip, as an application
// importing it would
const defaultPreview = (
    <Stack align="start" className={classes.room}>
        <TooltipComponent text="Everything on it goes with it" direction="n">
            <Button variant="danger">Delete repository</Button>
        </TooltipComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Tooltip text="Everything on it goes with it" direction="n">
    <Button variant="danger">Delete repository</Button>
</Tooltip>`;

// A button with no words of its own, which the tooltip names rather than describes
const labelPreview = (
    <Stack align="start" className={classes.room}>
        <TooltipComponent text="Close the panel" type="label" direction="n">
            <IconButton icon={DismissRegular} aria-label="Close the panel" variant="invisible" />
        </TooltipComponent>
    </Stack>
);

const labelCode = `<Tooltip text="Close the panel" type="label" direction="n">
    <IconButton icon={DismissRegular} aria-label="Close the panel" variant="invisible" />
</Tooltip>`;

// Every direction a tooltip can be sent, walked round the compass. Each turns round where there is
// no room on the side it was sent to
const directionsPreview = (
    <Stack direction="horizontal" gap="normal" wrap="wrap" className={classes.room}>
        {directions.map((direction) => (
            <TooltipComponent key={direction} text={`Standing ${direction}`} direction={direction}>
                <Button>{direction}</Button>
            </TooltipComponent>
        ))}
    </Stack>
);

const directionsCode = `<Stack direction="horizontal" gap="normal" wrap="wrap">
    {directions.map((direction) => (
        <Tooltip key={direction} text={\`Standing \${direction}\`} direction={direction}>
            <Button>{direction}</Button>
        </Tooltip>
    ))}
</Stack>`;

// How long the pointer has to rest on the trigger before the tooltip appears
const delayPreview = (
    <Stack direction="horizontal" gap="normal" wrap="wrap" className={classes.room}>
        {delays.map((delay) => (
            <TooltipComponent key={delay} text={`A ${delay} wait`} delay={delay} direction="n">
                <Button>{delay}</Button>
            </TooltipComponent>
        ))}
    </Stack>
);

const delayCode = `<Stack direction="horizontal" gap="normal" wrap="wrap">
    {delays.map((delay) => (
        <Tooltip key={delay} text={\`A \${delay} wait\`} delay={delay} direction="n">
            <Button>{delay}</Button>
        </Tooltip>
    ))}
</Stack>`;

// A tooltip on something that leads somewhere, which says where rather than what it is
const linkPreview = (
    <Stack align="start" className={classes.room}>
        <TooltipComponent text="Opens the search page" direction="n">
            <Link href="#tooltip-search">Search</Link>
        </TooltipComponent>
    </Stack>
);

const linkCode = `<Tooltip text="Opens the search page" direction="n">
    <Link href="/search">Search</Link>
</Tooltip>`;

// The tooltip as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then the other thing a tooltip can be for, then where it stands and how long it
// waits, and last what else it can be wrapped around
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A line saying more about something that already says what it is. The tooltip is wrapped around the one thing it is about rather than pointed at it, so nothing has to be named for the two to find each other, and it is added to whatever already describes the trigger rather than replacing it. It appears on hover after a moment's rest, and on focus only for a reader who arrived by keyboard.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Naming something that has no words",
        description:
            "A tooltip standing as the name of its trigger rather than as more about it, which is what a button drawn as an icon alone wants. Only one of the two is right for any trigger: a label replaces whatever the trigger would otherwise be called, so a trigger that already says what it is should be described rather than renamed — two names for one button is one more than a reader is helped by.",
        preview: labelPreview,
        code: labelCode,
    },
    {
        name: "Where it stands",
        description:
            "Which side of the trigger the tooltip is sent to, written as a compass point. It is a preference rather than an instruction: where there is no room on that side the tooltip turns round to the other, and it is drawn pointing wherever it actually ended up rather than where it was sent.",
        setup: directionsSetup,
        preview: directionsPreview,
        code: directionsCode,
    },
    {
        name: "How long the pointer has to rest",
        description:
            "How long a pointer has to stay on the trigger before the tooltip appears, so one crossing the page does not leave a trail of them behind it. Short is right for most things; the longer waits are for triggers a pointer passes over on its way somewhere else. A reader arriving by keyboard waits for none of it.",
        setup: delaysSetup,
        preview: delayPreview,
        code: delayCode,
    },
    {
        name: "On something that leads somewhere",
        description:
            "The trigger has to be something a reader can reach — a button, a link, a field, or anything given a button's role — since a tooltip only ever appears on hover or on focus. A trigger nothing can reach is a tooltip nobody can read, so the component throws rather than drawing one, which is a mistake worth stopping at rather than shipping.",
        preview: linkPreview,
        code: linkCode,
    },
];

// Where the tooltip stands in relation to what it describes, written as a compass point
const direction = '"nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w"';

// Whether the tooltip names the trigger or says more about it
const type = '"label" | "description"';

// How long the pointer has to rest before the tooltip appears
const delay = '"short" | "medium" | "long"';

// Every prop the tooltip takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// What the tooltip says comes first, since it is the whole of what a tooltip is, then what it is
// for, then where it stands and how long it waits, and last what it is wrapped around
const groups: ComponentPropGroup[] = [
    {
        name: "Tooltip",
        props: [
            {
                name: "text",
                type: "string",
                required: true,
                description:
                    "What the tooltip says. It is a string rather than anything React can draw, since a tooltip is read out as part of the trigger and markup inside one has no way of being heard",
            },
            {
                name: "type",
                type: type,
                default: '"description"',
                description:
                    "Whether the tooltip says more about the trigger or stands as its name. A description is added to whatever already describes the trigger; a label replaces what the trigger would otherwise be called, which is what a button drawn as an icon alone wants",
            },
            {
                name: "direction",
                type: direction,
                default: '"s"',
                description:
                    "Which side of the trigger the tooltip is sent to. It is a preference rather than an instruction: where there is no room on that side the tooltip turns round, and is drawn pointing wherever it ended up",
            },
            {
                name: "delay",
                type: delay,
                default: '"short"',
                description:
                    "How long the pointer has to rest on the trigger before the tooltip appears, so a pointer crossing the page does not leave a trail of them. A reader arriving by keyboard waits for none of it",
            },
            {
                name: "children",
                type: "React.ReactElement",
                required: true,
                description:
                    "The one thing the tooltip is about. It has to be something a reader can reach — a button, a link, a field, or anything given a button's role — since a tooltip only ever appears on hover or on focus; anything else throws rather than drawing a tooltip nobody can read",
            },
            {
                name: "className",
                type: "string",
                description: "Class name for custom styling",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the tooltip is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Tooltip = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Tooltip
            </Heading>
            <Text as="p" size="large">
                A line saying more about the one thing it is wrapped around: what a button will do,
                where a link goes, what an icon stands for. It is wrapped around its trigger rather
                than pointed at it, so nothing has to be named for the two to find each other, and
                the trigger has to be something a reader can reach — a tooltip only ever appears on
                hover or on focus, so one on a thing nobody can reach is one nobody can read.
            </Text>
            <Text as="p" size="large">
                It never takes focus and never holds anything a reader has to act on: what it says
                is read out through the trigger, either as more about it or as its name. It is drawn
                in the top layer, so it stands clear of whatever it is inside without anything
                having to be given room for it, and it can be sent away with Escape by a reader who
                would rather read what is underneath.
            </Text>
        </Stack>
        <ComponentExamples component="Tooltip" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Tooltip;
