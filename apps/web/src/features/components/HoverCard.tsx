import * as React from "react";
import {
    Button,
    Heading,
    HoverCard as HoverCardComponent,
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
    // The line under the name is read as an aside to it rather than as a second name, so it is set
    // in the colour the library sets secondary text in
    muted: "text-[var(--foreground-color-muted)]",
};

// Which edges a card can be asked to stand off. They are drawn one to a trigger rather than one to
// an example, since what each of them comes to is read against the others
const sides = ["outside-top", "outside-right", "outside-bottom", "outside-left"] as const;

// Where along that edge a card lines up
const alignments = ["start", "center", "end"] as const;

// What every card on this page has to say. It is written once and read out into each of them, since
// what the examples are about is the card rather than the words inside it
const profile = (
    <Stack gap="tight">
        <Text weight="semibold">Mona Lisa Octocat</Text>
        <Text size="small" className={classes.muted}>
            Engineer at GitHub. Works on the things that hold the rest of it up.
        </Text>
    </Stack>
);

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const mutedSetup = `const muted = "text-[var(--foreground-color-muted)]";`;

const profileSetup = `${mutedSetup}

const profile = (
    <Stack gap="tight">
        <Text weight="semibold">Mona Lisa Octocat</Text>
        <Text size="small" className={muted}>
            Engineer at GitHub. Works on the things that hold the rest of it up.
        </Text>
    </Stack>
);`;

const sidesSetup = `${profileSetup}

const sides = ["outside-top", "outside-right", "outside-bottom", "outside-left"];`;

const alignmentsSetup = `${profileSetup}

const alignments = ["start", "center", "end"];`;

// The plainest card there is: a name standing in a sentence, and what is known about whoever it
// belongs to. Nothing is said with a prop, so it opens below the name after half a second and
// stands for a third of one after the pointer leaves.
//
// The trigger is the name itself rather than a box drawn around it, so the card stands against the
// words rather than against a wrapper that would run wider than they do. It is a link because a
// card only ever opened by hovering would be shut to anyone who does not hover: what it says is a
// fuller telling of what is at the other end of the link.
//
// The page and the component it is about are both called HoverCard, so the component is brought in
// under a name saying which of the two it is. The listing beneath says HoverCard, as an application
// importing it would
const defaultPreview = (
    <Text>
        Reviewed by{" "}
        <HoverCardComponent>
            <HoverCardComponent.Trigger>
                <Link href="#monalisa" inline>
                    monalisa
                </Link>
            </HoverCardComponent.Trigger>
            <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
        </HoverCardComponent>{" "}
        two days ago.
    </Text>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Text>
    Reviewed by{" "}
    <HoverCard>
        <HoverCard.Trigger>
            <Link href="#monalisa" inline>
                monalisa
            </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>{profile}</HoverCard.Content>
    </HoverCard>{" "}
    two days ago.
</Text>`;

// Which edge of the trigger the card stands off. The four are drawn together rather than one to an
// example, since a side is read against the others rather than on its own, and each trigger is
// named for the side it was given.
//
// A side with no room left for the card is turned over to the opposite edge rather than run off the
// page, so what is asked for here is where the card goes when it fits
const sidesPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap">
        {sides.map((side) => (
            <HoverCardComponent key={side} side={side} openDelay={200}>
                <HoverCardComponent.Trigger>
                    <Link href="#monalisa" inline>
                        {side.replace("outside-", "")}
                    </Link>
                </HoverCardComponent.Trigger>
                <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
            </HoverCardComponent>
        ))}
    </Stack>
);

const sidesCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap">
    {sides.map((side) => (
        <HoverCard key={side} side={side} openDelay={200}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    {side.replace("outside-", "")}
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>{profile}</HoverCard.Content>
        </HoverCard>
    ))}
</Stack>`;

// Where along that edge the card lines up. It is read against the trigger rather than against the
// page, so a card lined up to the start begins where the trigger begins
const alignPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap">
        {alignments.map((align) => (
            <HoverCardComponent key={align} align={align} openDelay={200}>
                <HoverCardComponent.Trigger>
                    <Link href="#monalisa" inline>
                        {align}
                    </Link>
                </HoverCardComponent.Trigger>
                <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
            </HoverCardComponent>
        ))}
    </Stack>
);

const alignCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap">
    {alignments.map((align) => (
        <HoverCard key={align} align={align} openDelay={200}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    {align}
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>{profile}</HoverCard.Content>
        </HoverCard>
    ))}
</Stack>`;

// How long the pointer has to rest before the card opens, and how long the card is left standing
// once it leaves. The wait before is what keeps a pointer crossing the page from leaving a trail of
// cards behind it; the wait after is what gives the reader room to travel from the trigger onto the
// card without it closing on the way
const delaysPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap">
        <HoverCardComponent openDelay={0}>
            <HoverCardComponent.Trigger>
                <Link href="#monalisa" inline>
                    Opens at once
                </Link>
            </HoverCardComponent.Trigger>
            <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
        </HoverCardComponent>
        <HoverCardComponent openDelay={1000}>
            <HoverCardComponent.Trigger>
                <Link href="#monalisa" inline>
                    Opens after a second
                </Link>
            </HoverCardComponent.Trigger>
            <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
        </HoverCardComponent>
        <HoverCardComponent closeDelay={1500}>
            <HoverCardComponent.Trigger>
                <Link href="#monalisa" inline>
                    Stands a while once left
                </Link>
            </HoverCardComponent.Trigger>
            <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
        </HoverCardComponent>
    </Stack>
);

const delaysCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap">
    <HoverCard openDelay={0}>
        <HoverCard.Trigger>
            <Link href="#monalisa" inline>
                Opens at once
            </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>{profile}</HoverCard.Content>
    </HoverCard>
    <HoverCard openDelay={1000}>
        <HoverCard.Trigger>
            <Link href="#monalisa" inline>
                Opens after a second
            </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>{profile}</HoverCard.Content>
    </HoverCard>
    <HoverCard closeDelay={1500}>
        <HoverCard.Trigger>
            <Link href="#monalisa" inline>
                Stands a while once left
            </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>{profile}</HoverCard.Content>
    </HoverCard>
</Stack>`;

// Something the reader can reach inside the card, which is what sets a card apart from a tooltip.
// The pointer can travel off the trigger and onto the card, and the card waits there while it does
// rather than closing the moment the trigger is left
const interactivePreview = (
    <HoverCardComponent openDelay={200}>
        <HoverCardComponent.Trigger>
            <Link href="#monalisa" inline>
                monalisa
            </Link>
        </HoverCardComponent.Trigger>
        <HoverCardComponent.Content>
            <Stack gap="normal" align="start">
                {profile}
                <Button size="small">Follow</Button>
            </Stack>
        </HoverCardComponent.Content>
    </HoverCardComponent>
);

const interactiveCode = `<HoverCard openDelay={200}>
    <HoverCard.Trigger>
        <Link href="#monalisa" inline>
            monalisa
        </Link>
    </HoverCard.Trigger>
    <HoverCard.Content>
        <Stack gap="normal" align="start">
            {profile}
            <Button size="small">Follow</Button>
        </Stack>
    </HoverCard.Content>
</HoverCard>`;

// A card that will not open, for a trigger with nothing to say yet. The trigger is left exactly as
// it was written, so a name that has no card behind it still reads and behaves as a name
const disabledPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap">
        <HoverCardComponent openDelay={200}>
            <HoverCardComponent.Trigger>
                <Link href="#monalisa" inline>
                    Has a card
                </Link>
            </HoverCardComponent.Trigger>
            <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
        </HoverCardComponent>
        <HoverCardComponent openDelay={200} disabled>
            <HoverCardComponent.Trigger>
                <Link href="#monalisa" inline>
                    Has none
                </Link>
            </HoverCardComponent.Trigger>
            <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
        </HoverCardComponent>
    </Stack>
);

const disabledCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap">
    <HoverCard openDelay={200}>
        <HoverCard.Trigger>
            <Link href="#monalisa" inline>
                Has a card
            </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>{profile}</HoverCard.Content>
    </HoverCard>
    <HoverCard openDelay={200} disabled>
        <HoverCard.Trigger>
            <Link href="#monalisa" inline>
                Has none
            </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>{profile}</HoverCard.Content>
    </HoverCard>
</Stack>`;

// Whether the card is open kept by the page rather than by the card. Hovering the name still asks
// for it to open, and what the page does with the asking is its own: here it is simply agreed to,
// and the button says which way it stands
const ControlledPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="normal" align="start">
            <Button onClick={() => setOpen((current) => !current)}>
                {open ? "Close the card" : "Open the card"}
            </Button>
            <HoverCardComponent open={open} onOpenChange={setOpen} openDelay={200}>
                <HoverCardComponent.Trigger>
                    <Link href="#monalisa" inline>
                        monalisa
                    </Link>
                </HoverCardComponent.Trigger>
                <HoverCardComponent.Content>{profile}</HoverCardComponent.Content>
            </HoverCardComponent>
        </Stack>
    );
};

const controlledSetup = `${profileSetup}

const [open, setOpen] = React.useState(false);`;

const controlledCode = `<Stack gap="normal" align="start">
    <Button onClick={() => setOpen((current) => !current)}>
        {open ? "Close the card" : "Open the card"}
    </Button>
    <HoverCard open={open} onOpenChange={setOpen} openDelay={200}>
        <HoverCard.Trigger>
            <Link href="#monalisa" inline>
                monalisa
            </Link>
        </HoverCard.Trigger>
        <HoverCard.Content>{profile}</HoverCard.Content>
    </HoverCard>
</Stack>`;

// The card as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then where it stands, then how long it waits, then what sets it apart from a tooltip, and
// last what is done where the page rather than the card settles whether it is open
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A name standing in a sentence, and what is known about whoever it belongs to. The trigger is the name itself rather than a box drawn around it, so the card stands against the words rather than against a wrapper that would run wider than they do. It is a link because a card only ever opened by hovering would be shut to anyone who does not hover: what the card says is a fuller telling of what is at the other end of it.",
        setup: profileSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Which side it stands on",
        description:
            "Which edge of the trigger the card stands off. A side with no room left for the card is turned over to the opposite edge rather than run off the page, so what is asked for here is where the card goes when it fits.",
        setup: sidesSetup,
        preview: sidesPreview,
        code: sidesCode,
    },
    {
        name: "Where it lines up",
        description:
            "Where along that edge the card lines up. It is read against the trigger rather than against the page, so a card lined up to the start begins where the trigger begins. The offsets say how far clear of the edge the card stands and how far along it is moved, for the odd card that has to be nudged off where these put it.",
        setup: alignmentsSetup,
        preview: alignPreview,
        code: alignCode,
    },
    {
        name: "How long it waits",
        description:
            "How long the pointer has to rest before the card opens, and how long the card is left standing once it leaves. The wait before is what keeps a pointer crossing the page from leaving a trail of cards behind it; the wait after is what gives the reader room to travel from the trigger onto the card without it closing on the way. A reader who arrives by keyboard is shown the card at once, since tabbing to a trigger is already a decision to stop on it.",
        setup: profileSetup,
        preview: delaysPreview,
        code: delaysCode,
    },
    {
        name: "Something to reach inside it",
        description:
            "What sets a card apart from a tooltip. A tooltip holds a line of text and closes the moment the pointer leaves; a card holds whatever it is given and waits, so the pointer can travel onto it and a link or a button inside it can be reached. Focus landing inside the card is not read as focus leaving the trigger, so pressing something in it does not close the card out from under the press.",
        setup: profileSetup,
        preview: interactivePreview,
        code: interactiveCode,
    },
    {
        name: "Turned off",
        description:
            "A card that will not open, for a trigger with nothing to say yet. The trigger is left exactly as it was written, so a name with no card behind it still reads and behaves as a name.",
        setup: profileSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Held open by the page",
        description:
            "Whether the card is open kept by the page rather than by the card. Hovering the name still asks for it to open and the card still reports what it was asked, but what comes of the asking is the page's to settle; here it is simply agreed to, and the button says which way it stands.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// Which edge of the trigger the card stands off
const side = '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"';

// Where along that edge the card lines up
const align = '"start" | "center" | "end"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the card and its parts take, under the one that takes it. Where the card stands comes
// first, then how long it waits, then whether it opens at all.
//
// The trigger draws nothing of its own and the content is laid out inside the surface rather than
// being it, so between them they take almost nothing: what the card is told, it is told at the root
const groups: ComponentPropGroup[] = [
    {
        name: "HoverCard",
        props: [
            {
                name: "side",
                type: side,
                default: '"outside-bottom"',
                options: ["outside-top", "outside-right", "outside-bottom", "outside-left"],
                description:
                    "Which edge of the trigger the card stands off. A side with no room left for the card is turned over to the opposite edge rather than run off the page",
            },
            {
                name: "align",
                type: align,
                default: '"start"',
                options: ["start", "center", "end"],
                description:
                    "Where along that edge the card lines up. It is read against the trigger rather than against the page, so a card lined up to the start begins where the trigger begins",
            },
            {
                name: "anchorOffset",
                type: "number",
                description: "How far clear of the trigger the card stands, in pixels",
            },
            {
                name: "alignmentOffset",
                type: "number",
                description:
                    "How far along the edge the card is moved from where the alignment put it, in pixels",
            },
            {
                name: "openDelay",
                type: "number",
                default: "500",
                description:
                    "How long the pointer has to rest on the trigger before the card opens, in milliseconds, so a pointer crossing the page does not leave a trail of cards behind it. A reader arriving by keyboard is shown the card at once, since tabbing to a trigger is already a decision to stop on it",
            },
            {
                name: "closeDelay",
                type: "number",
                default: "300",
                description:
                    "How long the card is left standing once the pointer has left, in milliseconds. This is what gives the reader room to travel from the trigger onto the card without it closing on the way",
            },
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the card is open, for a page keeping hold of that itself. Left out, the card opens and closes on its own",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description:
                    "Called whenever the card asks to open or close, whether the page is holding that or the card is",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the card opening at all, for a trigger with nothing to say yet. The trigger itself is left exactly as it was written",
            },
            {
                name: "portalContainerName",
                type: "string",
                description:
                    "Which registered portal the card is rendered into, for a page that keeps more than one. The card is drawn outside the page's own tree either way, so nothing it stands in can clip it or bury it",
            },
            styling,
        ],
    },
    {
        name: "HoverCard.Trigger",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The one element the card is about. Nothing is drawn around it: what is written here is what the card is measured against and what everything the card needs of a trigger is spread onto, so it has to be a single element that takes a ref. It should be something a reader can reach with the keyboard, since a card that only answered the pointer would be shut to anyone who does not use one",
            },
        ],
    },
    {
        name: "HoverCard.Content",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the card is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const HoverCard = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                HoverCard
            </Heading>
            <Text as="p" size="large">
                Says more about the thing it is wrapped around, on a surface the reader can move the
                pointer onto and read at their own pace. That is what sets it apart from a tooltip:
                a tooltip holds a line of text and closes the moment the pointer leaves, while a
                card holds whatever it is given and waits there, so a link or a button inside it can
                be reached. It waits before opening as well, so a pointer crossing the page does not
                leave a trail of cards behind it, though a reader who tabbed to the trigger is shown
                it at once. What it holds should be a fuller telling of something the reader can get
                at some other way too, since a surface that only ever opens on hover is closed to
                anyone who cannot hover — which is also why it never opens on a touch.
            </Text>
        </Stack>
        <ComponentExamples component="HoverCard" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default HoverCard;
