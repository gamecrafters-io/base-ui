import * as React from "react";
import {
    Button,
    Heading,
    Popover as PopoverComponent,
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
    // A caret is drawn past the edge of the surface it points from, so a popover wants room on
    // every side of it rather than standing against whatever it was put in
    room: "p-[var(--base-size-24)]",
    // The twelve read together, with room enough between them that a caret pointing outwards has
    // somewhere to point
    carets: "grid grid-cols-3 gap-[var(--base-size-64)] p-[var(--base-size-24)]",
    // The widths read beside one another, wrapping where the row runs out
    widths: "flex flex-wrap items-start gap-[var(--base-size-32)] p-[var(--base-size-24)]",
    // Something for a popover laid out against an ancestor to be laid out against
    anchor: "relative inline-block",
    // Where the caller puts it: under whatever it was opened from, and clear of it
    placed: "top-full left-0 mt-[var(--base-size-8)]",
};

// Every place the caret can stand. The first half of each name is the edge it stands on, the second
// is where along that edge, so top-left points up from over towards the left while left-top points
// left from up towards the top
const carets = [
    "top-left",
    "top",
    "top-right",
    "left-top",
    "left",
    "left-bottom",
    "right-top",
    "right",
    "right-bottom",
    "bottom-left",
    "bottom",
    "bottom-right",
] as const;

// The steps the surface can be measured on, and the one that is as wide as what it holds
const widths = ["xsmall", "small", "medium", "auto"] as const;

// What the examples reading off a list have to have in hand before they can be drawn
const caretsSetup = `const carets = [
    "top-left",
    "top",
    "top-right",
    "left-top",
    "left",
    "left-bottom",
    "right-top",
    "right",
    "right-bottom",
    "bottom-left",
    "bottom",
    "bottom-right",
];`;

const widthsSetup = `const widths = ["xsmall", "small", "medium", "auto"];`;

// The plainest popover there is: a surface, a caret pointing up from the middle of it, and nothing
// said about where it stands. It is opened outright, since whether a popover is open is the
// caller's to hold and there is nothing here holding it.
//
// The page and the component it is about are both called Popover, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Popover, as an application
// importing it would
const defaultPreview = (
    <div className={classes.room}>
        <PopoverComponent open relative>
            <PopoverComponent.Content>
                <Stack gap="condensed">
                    <Text weight="semibold">Popover heading</Text>
                    <Text as="p">
                        A message standing over the page, put where the caller already knows it
                        belongs.
                    </Text>
                </Stack>
            </PopoverComponent.Content>
        </PopoverComponent>
    </div>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Popover open relative>
    <Popover.Content>
        <Stack gap="condensed">
            <Text weight="semibold">Popover heading</Text>
            <Text as="p">
                A message standing over the page, put where the caller already knows it belongs.
            </Text>
        </Stack>
    </Popover.Content>
</Popover>`;

// Every place the caret can stand, read together. Named for an edge alone it stands halfway along
// it; named for a corner the surface gives up its centring and is pinned to that side, hanging a
// little past the popover so the caret stands over whatever it was opened from
const caretsPreview = (
    <div className={classes.carets}>
        {carets.map((caret) => (
            <PopoverComponent key={caret} open relative caret={caret}>
                <PopoverComponent.Content width="auto">
                    <Text size="small">{caret}</Text>
                </PopoverComponent.Content>
            </PopoverComponent>
        ))}
    </div>
);

const caretsCode = `<div className="grid grid-cols-3 gap-[var(--base-size-64)]">
    {carets.map((caret) => (
        <Popover key={caret} open relative caret={caret}>
            <Popover.Content width="auto">
                <Text size="small">{caret}</Text>
            </Popover.Content>
        </Popover>
    ))}
</div>`;

// A popover laid out against whatever ancestor is positioned, rather than standing in the flow.
// Where it ends up is settled by the class the caller puts on it: this one is hung under the
// control it was opened from and set clear of it
const anchoredPreview = (
    <div className={classes.room}>
        <div className={classes.anchor}>
            <Button>Opened from here</Button>
            <PopoverComponent open caret="top-left" className={classes.placed}>
                <PopoverComponent.Content>
                    <Stack gap="condensed">
                        <Text weight="semibold">Popover heading</Text>
                        <Text as="p">
                            Laid out against the box around the control rather than measured against
                            the control itself.
                        </Text>
                    </Stack>
                </PopoverComponent.Content>
            </PopoverComponent>
        </div>
    </div>
);

const anchoredCode = `<div className="relative inline-block">
    <Button>Opened from here</Button>
    <Popover open caret="top-left" className="top-full left-0 mt-[var(--base-size-8)]">
        <Popover.Content>
            <Stack gap="condensed">
                <Text weight="semibold">Popover heading</Text>
                <Text as="p">
                    Laid out against the box around the control rather than measured against
                    the control itself.
                </Text>
            </Stack>
        </Popover.Content>
    </Popover>
</div>`;

// How wide the surface stands. Auto is as wide as what it holds; the rest are steps of the overlay
// scale the other floating surfaces are measured on
const widthsPreview = (
    <div className={classes.widths}>
        {widths.map((width) => (
            <PopoverComponent key={width} open relative>
                <PopoverComponent.Content width={width}>
                    <Text size="small">{width}</Text>
                </PopoverComponent.Content>
            </PopoverComponent>
        ))}
    </div>
);

const widthsCode = `<div className="flex flex-wrap items-start gap-[var(--base-size-32)]">
    {widths.map((width) => (
        <Popover key={width} open relative>
            <Popover.Content width={width}>
                <Text size="small">{width}</Text>
            </Popover.Content>
        </Popover>
    ))}
</div>`;

// A surface held to a height, with what will not fit scrolled rather than run past it. The caret is
// drawn past the surface's edge, so anything that clips the content clips the caret off with it,
// which is why the surface overflows by default and only clips where it has been asked to
const scrollablePreview = (
    <div className={classes.room}>
        <PopoverComponent open relative>
            <PopoverComponent.Content height="small" overflow="auto">
                <Stack gap="condensed">
                    <Text weight="semibold">Popover heading</Text>
                    {Array.from({ length: 6 }, (_unused, index) => (
                        <Text key={index} as="p">
                            A paragraph of the message this popover carries, long enough that there
                            is more of it than the surface has room for.
                        </Text>
                    ))}
                </Stack>
            </PopoverComponent.Content>
        </PopoverComponent>
    </div>
);

const scrollableCode = `<Popover open relative>
    <Popover.Content height="small" overflow="auto">
        <Stack gap="condensed">
            <Text weight="semibold">Popover heading</Text>
            {Array.from({ length: 6 }, (_unused, index) => (
                <Text key={index} as="p">
                    A paragraph of the message this popover carries, long enough that there is
                    more of it than the surface has room for.
                </Text>
            ))}
        </Stack>
    </Popover.Content>
</Popover>`;

// Dismissed by a press anywhere else, which is what a surface standing over the page rather than in
// it needs. The control it was opened from is named as one to ignore, since it closes the popover
// itself and would otherwise be closing one this had already closed.
//
// The state is the caller's, which makes this a component of its own rather than an element the
// page holds ready
const ClickOutsidePreview = () => {
    const [open, setOpen] = React.useState(true);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className={classes.room}>
            <Stack align="start" gap="condensed">
                <Button ref={buttonRef} onClick={() => setOpen((current) => !current)}>
                    {open ? "Close the popover" : "Open the popover"}
                </Button>
                <PopoverComponent open={open} relative caret="top-left">
                    <PopoverComponent.Content
                        onClickOutside={() => setOpen(false)}
                        ignoreClickRefs={[buttonRef]}
                    >
                        <Stack gap="condensed">
                            <Text weight="semibold">Popover heading</Text>
                            <Text as="p">Press anywhere else on the page to dismiss this.</Text>
                        </Stack>
                    </PopoverComponent.Content>
                </PopoverComponent>
            </Stack>
        </div>
    );
};

const clickOutsideCode = `const [open, setOpen] = React.useState(true);
const buttonRef = React.useRef(null);

<Stack align="start" gap="condensed">
    <Button ref={buttonRef} onClick={() => setOpen((current) => !current)}>
        {open ? "Close the popover" : "Open the popover"}
    </Button>
    <Popover open={open} relative caret="top-left">
        <Popover.Content onClickOutside={() => setOpen(false)} ignoreClickRefs={[buttonRef]}>
            <Stack gap="condensed">
                <Text weight="semibold">Popover heading</Text>
                <Text as="p">Press anywhere else on the page to dismiss this.</Text>
            </Stack>
        </Popover.Content>
    </Popover>
</Stack>`;

// Dismissed by Escape, which is what a reader who never reached for the pointer has to hand. The
// press is taken as it is answered, so a layer this popover was opened over does not answer it too
const EscapePreview = () => {
    const [open, setOpen] = React.useState(true);

    return (
        <div className={classes.room}>
            <Stack align="start" gap="condensed">
                <Button onClick={() => setOpen((current) => !current)}>
                    {open ? "Close the popover" : "Open the popover"}
                </Button>
                <PopoverComponent open={open} relative caret="top-left">
                    <PopoverComponent.Content onEscape={() => setOpen(false)}>
                        <Stack gap="condensed">
                            <Text weight="semibold">Popover heading</Text>
                            <Text as="p">Press Escape to dismiss this.</Text>
                        </Stack>
                    </PopoverComponent.Content>
                </PopoverComponent>
            </Stack>
        </div>
    );
};

const escapeCode = `const [open, setOpen] = React.useState(true);

<Stack align="start" gap="condensed">
    <Button onClick={() => setOpen((current) => !current)}>
        {open ? "Close the popover" : "Open the popover"}
    </Button>
    <Popover open={open} relative caret="top-left">
        <Popover.Content onEscape={() => setOpen(false)}>
            <Stack gap="condensed">
                <Text weight="semibold">Popover heading</Text>
                <Text as="p">Press Escape to dismiss this.</Text>
            </Stack>
        </Popover.Content>
    </Popover>
</Stack>`;

// The popover as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then where the caret stands and where the popover itself does, then how large the
// surface is, and last the two ways it is dismissed
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A surface, a caret pointing up from the middle of it, and nothing said about where it stands. Whether a popover is open is the caller's to hold — what opens one is whatever it was opened from, and that is somewhere the popover cannot see — so it is opened outright here. While it is shut it is taken out of the page altogether rather than only hidden, so nothing inside it can still be tabbed to or read out.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Where the caret stands",
        description:
            "The first half of each name is the edge the caret stands on, the second is where along that edge, so top-left points up from over towards the left while left-top points left from up towards the top. Named for an edge alone it stands halfway along it; named for a corner the surface gives up its centring and is pinned to that side, hanging a little past the popover so the caret stands over whatever it was opened from rather than over the middle of the room it was given.",
        setup: caretsSetup,
        preview: caretsPreview,
        code: caretsCode,
    },
    {
        name: "Standing against what it was opened from",
        description:
            "Left to itself a popover is laid out against whichever ancestor is positioned, so where it ends up is settled by the caller placing that rather than by anything the popover works out. This is what sets it apart from the surfaces that place themselves — a tooltip, a hover card, an anchored overlay all measure an anchor and work out where there is room, while a popover is put where the caller already knows it belongs and does nothing else on its own.",
        preview: anchoredPreview,
        code: anchoredCode,
    },
    {
        name: "How wide the surface stands",
        description:
            "Auto is as wide as what it holds; the rest are steps of the overlay scale the other floating surfaces are measured on, so a popover and a menu standing on the same page are the same width without either being told a number.",
        setup: widthsSetup,
        preview: widthsPreview,
        code: widthsCode,
    },
    {
        name: "Held to a height",
        description:
            "With what will not fit scrolled rather than run past the surface. The caret is drawn past the surface's edge, so anything that clips the content clips the caret off with it — which is why the surface overflows by default and only clips where it has been asked to.",
        preview: scrollablePreview,
        code: scrollableCode,
    },
    {
        name: "Dismissed by a press outside",
        description:
            "Which is what a surface standing over the page rather than in it needs. Dismissing is reported rather than done: the press calls back and leaves the caller to close the popover, since the caller is the one holding whether it is open. The control it was opened from is named as one to ignore, since it closes the popover itself and would otherwise be closing one this had already closed. A press with the right button or the wheel is left alone, since it is not reaching for anything.",
        preview: <ClickOutsidePreview />,
        code: clickOutsideCode,
    },
    {
        name: "Dismissed by Escape",
        description:
            "Which is what a reader who never reached for the pointer has to hand. It is reported the same way, and the press is taken as it is answered, so a layer this popover was opened over does not answer it as well. Neither this nor a press outside says anything while the popover is shut, there being nothing on screen to dismiss.",
        preview: <EscapePreview />,
        code: escapeCode,
    },
];

// Which edge the caret stands on, and where along that edge. It stands as the values themselves
// rather than as the name they are collected under, since one of them is what a caller hands over
const caret =
    '"top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left-top" | "left-bottom" | "right-top" | "right-bottom"';

// A step of the overlay width scale, or the width of whatever the content holds
const width = '"xsmall" | "small" | "medium" | "large" | "xlarge" | "auto"';

// A step of the overlay height scale, the height of whatever the content holds, or as much of it as
// the content needs
const height = '"small" | "medium" | "large" | "xlarge" | "auto" | "fit-content"';

// What becomes of content taller or wider than the height and width it was given
const overflow = '"auto" | "hidden" | "scroll" | "visible"';

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

// Every prop the popover and its surface take, under the one that takes it. The room comes first,
// since it is what settles whether the popover is shown and where it stands, then the surface it
// holds and everything about how large it is and how it is dismissed
const groups: ComponentPropGroup[] = [
    {
        name: "Popover",
        props: [
            {
                name: "open",
                type: "boolean",
                default: "false",
                description:
                    "Whether the popover is shown. It is the caller's to hold, since what opens a popover is whatever it was opened from and that is somewhere the popover cannot see. While it is shut the popover is taken out of the page altogether rather than only hidden, so nothing inside it can still be tabbed to or read out",
            },
            {
                name: "caret",
                type: caret,
                default: '"top"',
                description:
                    "Which edge the caret stands on, and where along that edge. The two halves are read in that order: top-left is a caret on the top edge over towards the left, while left-top is one on the left edge up towards the top. It is handed down to the surface, since the caret is drawn there rather than on the room the surface stands in",
            },
            {
                name: "relative",
                type: "boolean",
                default: "false",
                description:
                    "Stands the popover in the flow, after whatever it was written after, rather than laying it out against the nearest positioned ancestor. Left out, where the popover ends up is the caller's to settle with a class of their own",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Popover.Content",
        props: [
            {
                name: "width",
                type: width,
                default: '"small"',
                description:
                    "How wide the surface stands: a step of the overlay scale the other floating surfaces are measured on, or as wide as what it holds",
            },
            {
                name: "height",
                type: height,
                default: '"fit-content"',
                description:
                    "How tall it stands, read the same way, with as much of the scale as the content needs by default",
            },
            {
                name: "overflow",
                type: overflow,
                default: '"visible"',
                description:
                    "What becomes of content taller or wider than the room it was given. The caret is drawn past the surface's edge, so anything that clips the content clips the caret off with it — which is why the surface overflows by default and only clips where it has been asked to",
            },
            {
                name: "onClickOutside",
                type: "(event: MouseEvent | TouchEvent) => void",
                description:
                    "Called where a press lands anywhere outside the content while the popover is open. Dismissing is reported rather than done, since the caller is the one holding whether the popover is open, and a press with the right button or the wheel is left alone",
            },
            {
                name: "onEscape",
                type: "(event: KeyboardEvent) => void",
                description:
                    "Called where Escape is pressed while the popover is open. The press is taken as it is answered, so a layer the popover was opened over does not answer it as well",
            },
            {
                name: "ignoreClickRefs",
                type: "React.RefObject<HTMLElement | null>[]",
                description:
                    "Elements a press on which is not counted as a press outside. The control the popover was opened from belongs here, since it closes the popover itself and would otherwise be closing one this had already closed",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the popover is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Popover = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Popover
            </Heading>
            <Text as="p" size="large">
                A surface standing over the page, with a caret pointing back at whatever it was
                opened from. Where it stands is the caller's to settle: laid out against whichever
                ancestor is positioned, or in the flow after whatever it was written after. That is
                what sets it apart from the surfaces that place themselves — a tooltip, a hover
                card, an anchored overlay all measure an anchor and work out where there is room,
                while a popover is put where the caller already knows it belongs and does nothing
                else on its own. It holds no state either: whether it is open comes from a prop, and
                Escape and a press outside are reported rather than acted on, since the caller is
                the one holding the answer.
            </Text>
        </Stack>
        <ComponentExamples component="Popover" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Popover;
