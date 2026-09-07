import * as React from "react";
import {
    Button,
    Code,
    Heading,
    Presence as PresenceComponent,
    Stack,
    Text,
    TextInput,
    usePresence,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The box the content is drawn in. A presence draws nothing of its own, so what is watched
    // here is drawn by the page: the box is given a height so that content arriving and leaving
    // moves nothing around it, and it fades and grows in as it arrives and fades and shrinks out
    // as it leaves. It animates by the state the presence writes onto it rather than by anything
    // it is told directly, which is the whole of how the two are joined.
    //
    // Leaving is what the animation is there for. The presence holds the content on the page
    // until the animation has run, so a reader watching the box go is watching the wait itself
    box: "flex h-[var(--base-size-128)] items-center justify-center rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] bg-[var(--background-color-muted)] motion-safe:data-[state=open]:animate-presence-in motion-safe:data-[state=closed]:animate-presence-out",
    // Two of the above set beside each other, where the difference between them is the point.
    // They share out the row and fall one under the other on a screen with no room for both
    column: "flex-1 basis-[12rem]",
    muted: "text-[var(--foreground-color-muted)]",
};

// What every example has to have in hand before it can be drawn: the box the content is drawn in.
// It is the same on every example on the page, so it is written once and reached for by each of
// them rather than run out along a line that would then have to be read across
const setup = `const box =
    "flex h-[var(--base-size-128)] items-center justify-center " +
    "rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] " +
    "bg-[var(--background-color-muted)] " +
    "motion-safe:data-[state=open]:animate-presence-in " +
    "motion-safe:data-[state=closed]:animate-presence-out";`;

// The plainest presence there is: content asked for and asked away again. What is asked for and
// what is drawn come apart at the moment it leaves — the line beside the button says at once that
// the content has gone, while the box is still on the page seeing its animation out — which is the
// whole of what the component is for.
//
// The page and the component it is about are both called Presence, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Presence, as an application
// importing it would
const DefaultPreview = () => {
    const [present, setPresent] = React.useState(false);

    return (
        <Stack gap="normal">
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={() => setPresent((current) => !current)}>
                    {present ? "Hide" : "Show"} the content
                </Button>
                <Text size="small" className={classes.muted}>
                    {present ? "Asked for" : "Asked away"}
                </Text>
            </Stack>
            <PresenceComponent className={classes.box} present={present}>
                <Text size="small">Content</Text>
            </PresenceComponent>
        </Stack>
    );
};

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `const [present, setPresent] = React.useState(false);

<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={() => setPresent((current) => !current)}>
            {present ? "Hide" : "Show"} the content
        </Button>
        <Text size="small">{present ? "Asked for" : "Asked away"}</Text>
    </Stack>
    <Presence className={box} present={present}>
        <Text size="small">Content</Text>
    </Presence>
</Stack>`;

// The two ways hidden content is left, set beside each other. Both boxes are asked away by the one
// press, and what has been typed into them is what says which of the two happened: the box that
// was only hidden still holds it, and the box that went off the page came back empty
const HeldPreview = () => {
    const [present, setPresent] = React.useState(true);

    return (
        <Stack gap="normal">
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={() => setPresent((current) => !current)}>
                    {present ? "Hide both" : "Show both"}
                </Button>
                <Text size="small" className={classes.muted}>
                    Type into each of them first
                </Text>
            </Stack>
            <Stack direction="horizontal" gap="normal" wrap="wrap">
                <Stack gap="condensed" className={classes.column}>
                    <Text size="small" className={classes.muted}>
                        Only hidden
                    </Text>
                    <PresenceComponent className={classes.box} present={present}>
                        <TextInput aria-label="Hidden and kept" placeholder="Type something" />
                    </PresenceComponent>
                </Stack>
                <Stack gap="condensed" className={classes.column}>
                    <Text size="small" className={classes.muted}>
                        Off the page
                    </Text>
                    <PresenceComponent className={classes.box} present={present} unmountOnExit>
                        <TextInput aria-label="Taken off the page" placeholder="Type something" />
                    </PresenceComponent>
                </Stack>
            </Stack>
        </Stack>
    );
};

const heldCode = `const [present, setPresent] = React.useState(true);

<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={() => setPresent((current) => !current)}>
            {present ? "Hide both" : "Show both"}
        </Button>
        <Text size="small">Type into each of them first</Text>
    </Stack>
    <Stack direction="horizontal" gap="normal" wrap="wrap">
        <Stack gap="condensed" className={column}>
            <Text size="small">Only hidden</Text>
            <Presence className={box} present={present}>
                <TextInput aria-label="Hidden and kept" placeholder="Type something" />
            </Presence>
        </Stack>
        <Stack gap="condensed" className={column}>
            <Text size="small">Off the page</Text>
            <Presence className={box} present={present} unmountOnExit>
                <TextInput aria-label="Taken off the page" placeholder="Type something" />
            </Presence>
        </Stack>
    </Stack>
</Stack>`;

// What the two-up has to have in hand on top of the box: the room each of the pair is given in the
// row they share
const heldSetup = `${setup}
const column = "flex-1 basis-[12rem]";`;

// Content kept off the page until it is first asked for. There is nothing to type into before the
// first press, since there is nothing there at all
const LazyPreview = () => {
    const [present, setPresent] = React.useState(false);

    return (
        <Stack gap="normal">
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={() => setPresent((current) => !current)}>
                    {present ? "Hide" : "Show"} the content
                </Button>
            </Stack>
            <PresenceComponent className={classes.box} present={present} lazyMount>
                <TextInput aria-label="Drawn once asked for" placeholder="Type something" />
            </PresenceComponent>
        </Stack>
    );
};

const lazyCode = `const [present, setPresent] = React.useState(false);

<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={() => setPresent((current) => !current)}>
            {present ? "Hide" : "Show"} the content
        </Button>
    </Stack>
    <Presence className={box} present={present} lazyMount>
        <TextInput aria-label="Drawn once asked for" placeholder="Type something" />
    </Presence>
</Stack>`;

// Content that is there from the start, drawn where it stands rather than animated into place.
// What happens after that is animated as it would be
const SkipPreview = () => {
    const [present, setPresent] = React.useState(true);

    return (
        <Stack gap="normal">
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={() => setPresent((current) => !current)}>
                    {present ? "Hide" : "Show"} the content
                </Button>
            </Stack>
            <PresenceComponent className={classes.box} present={present} skipAnimationOnMount>
                <Text size="small">Drawn in place to start with</Text>
            </PresenceComponent>
        </Stack>
    );
};

const skipCode = `const [present, setPresent] = React.useState(true);

<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={() => setPresent((current) => !current)}>
            {present ? "Hide" : "Show"} the content
        </Button>
    </Stack>
    <Presence className={box} present={present} skipAnimationOnMount>
        <Text size="small">Drawn in place to start with</Text>
    </Presence>
</Stack>`;

// Told when the content has finished arriving and when it has finished leaving, which is later
// than it was asked for either way. The line under the box is written by the callbacks rather than
// by the press, so what it says is the animation's word and not the reader's
const ReportedPreview = () => {
    const [present, setPresent] = React.useState(false);
    const [lastEvent, setLastEvent] = React.useState("Nothing has happened yet");

    return (
        <Stack gap="normal">
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={() => setPresent((current) => !current)}>
                    {present ? "Hide" : "Show"} the content
                </Button>
            </Stack>
            <PresenceComponent
                className={classes.box}
                present={present}
                onEnterComplete={() => setLastEvent("The content has arrived")}
                onExitComplete={() => setLastEvent("The content has left")}
            >
                <Text size="small">Content</Text>
            </PresenceComponent>
            <Text size="small" className={classes.muted}>
                {lastEvent}
            </Text>
        </Stack>
    );
};

const reportedCode = `const [present, setPresent] = React.useState(false);
const [lastEvent, setLastEvent] = React.useState("Nothing has happened yet");

<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={() => setPresent((current) => !current)}>
            {present ? "Hide" : "Show"} the content
        </Button>
    </Stack>
    <Presence
        className={box}
        present={present}
        onEnterComplete={() => setLastEvent("The content has arrived")}
        onExitComplete={() => setLastEvent("The content has left")}
    >
        <Text size="small">Content</Text>
    </Presence>
    <Text size="small">{lastEvent}</Text>
</Stack>`;

// The presence without the element, for a component that draws its own. The line beside the button
// is read off the hook rather than off the press, so it says "on the page" for as long as the box
// is still leaving and only turns once the animation has run out
const HookPreview = () => {
    const [present, setPresent] = React.useState(false);
    const presence = usePresence({ present, unmountOnExit: true });

    return (
        <Stack gap="normal">
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={() => setPresent((current) => !current)}>
                    {present ? "Hide" : "Show"} the content
                </Button>
                <Text size="small" className={classes.muted}>
                    {presence.unmounted ? "Off the page" : "On the page"}
                </Text>
            </Stack>
            {presence.unmounted ? null : (
                <div ref={presence.ref} className={classes.box} {...presence.getPresenceProps()}>
                    <Text size="small">Held by the hook</Text>
                </div>
            )}
        </Stack>
    );
};

const hookCode = `const [present, setPresent] = React.useState(false);
const presence = usePresence({ present, unmountOnExit: true });

<Stack gap="normal">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={() => setPresent((current) => !current)}>
            {present ? "Hide" : "Show"} the content
        </Button>
        <Text size="small">{presence.unmounted ? "Off the page" : "On the page"}</Text>
    </Stack>
    {presence.unmounted ? null : (
        <div ref={presence.ref} className={box} {...presence.getPresenceProps()}>
            <Text size="small">Held by the hook</Text>
        </div>
    )}
</Stack>`;

// The presence as it is reached for, drawn and written out one above the other. Whether the
// content is there comes first, since that is the whole of what a presence settles, then what
// becomes of it while it is not, then the two ways an animation can be left out, and last what a
// caller is told and what a component builds its own presence out of
const examples: ComponentExample[] = [
    {
        name: "There, or not",
        description:
            "Content asked for and asked away again. What is asked for and what is drawn come apart at the moment it leaves: the line beside the button says at once that the content has gone, while the box is still on the page seeing its animation out. Where the stylesheet animates the content out, the presence waits for that to run before the content is hidden; where it animates nothing, the content goes at once.",
        setup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Only hidden, or off the page",
        description:
            "What becomes of content that has left. By default it stays on the page hidden, which keeps whatever it was holding: type into the box on the left, hide it, and show it again, and what you typed is still there. Asked to unmount on exit it is taken off the page instead, and comes back as it was first drawn — which is what a screen that should not be paying for what is not on it wants, and what anything holding a running effect wants as well.",
        setup: heldSetup,
        preview: <HeldPreview />,
        code: heldCode,
    },
    {
        name: "Drawn only once it is asked for",
        description:
            "Content kept off the page until it is first present, rather than drawn hidden and waiting. Nothing is there to type into before the first press. It is the other half of unmounting on exit and is asked for separately, since the two answer different questions: this one is about what has never been shown, and that one about what has been shown and has gone.",
        setup,
        preview: <LazyPreview />,
        code: lazyCode,
    },
    {
        name: "Drawn in place to start with",
        description:
            "Content that is present from the first render has nothing to arrive from, so animating it in draws the page assembling itself in front of the reader. Asked to skip the animation on mount, the state an animation runs from is left off until the presence has changed once: the box is simply there, and everything after that is animated as it would be.",
        setup,
        preview: <SkipPreview />,
        code: skipCode,
    },
    {
        name: "Saying when it has arrived and left",
        description:
            "For a caller with something to do once the animation is over rather than once it was asked for: focus moved into what has just arrived, or a value cleared once what held it has gone. Content that was present from the start arrived from nothing, so nothing is reported for it. The callbacks are read through refs rather than watched, so passing a fresh function on every render does not restart the wait.",
        setup,
        preview: <ReportedPreview />,
        code: reportedCode,
    },
    {
        name: "The presence without the element",
        description:
            "The hook the component is built on, for a component that draws its own element or hands the presence down to parts that draw several. It answers with the ref the animation is watched through, the attributes the element carries, and whether the content is on the page at all. Note where it starts: content that has never been present has not left, so unmounting on exit does not take it off before it has first been shown — that is what lazy mounting is for.",
        setup,
        preview: <HookPreview />,
        code: hookCode,
    },
];

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

// What settles where the content stands. The component and the hook take the same set, so it is
// written once and reached for by both rather than said twice and left to fall out of step
const options = [
    {
        name: "present",
        type: "boolean",
        default: "false",
        description:
            "Whether the content is meant to be there. The content itself lags behind by the length of whatever animation it leaves with, which is the gap the whole component is about",
    },
    {
        name: "lazyMount",
        type: "boolean",
        default: "false",
        description:
            "Leaves the content off the page until it is first present, rather than drawing it hidden and waiting. It says nothing about what happens once the content has been shown and has gone",
    },
    {
        name: "unmountOnExit",
        type: "boolean",
        default: "false",
        description:
            "Takes the content off the page once it has left, rather than leaving it there hidden. Content that has never been present has not left, so this alone does not keep it off the page to begin with",
    },
    {
        name: "hideMode",
        type: '"display-none" | "activity"',
        options: ["display-none", "activity"],
        default: '"display-none"',
        description:
            "How content that is drawn but not present is kept out of sight. Taken off the page, its effects go on running, which is what anything meant to keep counting while it is hidden needs; handed to React's Activity it is held with its effects paused, which needs a React that has Activity to hand it to and falls back to the first where there is not one",
    },
    {
        name: "skipAnimationOnMount",
        type: "boolean",
        default: "false",
        description:
            "Leaves the state an animation runs from off the content until its presence has changed once, so content that starts out present is drawn in place rather than animated in",
    },
    {
        name: "onEnterComplete",
        type: "() => void",
        description:
            "Called once the content has finished animating in. Content that starts out present has nothing to animate in from, so it is not called for that",
    },
    {
        name: "onExitComplete",
        type: "() => void",
        description:
            "Called once the content has finished animating out, which is when it leaves the page. The element is also sent an exitcomplete event, for anything holding it that would rather listen than be called",
    },
];

// Every prop the presence takes, and after it the hook it is built on, what that answers with, and
// the two pieces a component managing the presence of its own parts is assembled from
const groups: ComponentPropGroup[] = [
    {
        name: "Presence",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The content whose presence is being settled. It is drawn, hidden or taken off the page according to everything below, and the element it is drawn in carries the state a stylesheet animates by",
            },
            ...options,
            polymorphic,
            styling,
        ],
    },
    {
        name: "usePresence",
        props: options,
    },
    {
        name: "UsePresenceReturn",
        props: [
            {
                name: "ref",
                type: "(node: HTMLElement | null) => void",
                description:
                    "Given to the element the presence is about, so that its animations can be watched. The element is held on to once it has gone, so that what it is sent as it leaves has somewhere to go",
            },
            {
                name: "getPresenceProps",
                type: "() => PresenceAttributes",
                description:
                    "The attributes the element is drawn with: the state a stylesheet animates by, and whether the element is hidden. They are spread after whatever the caller passed, since whether the content is hidden is the presence's to say",
            },
            {
                name: "present",
                type: "boolean",
                description:
                    "Whether the content is on the page, which it still is while it is on its way off. It is not the same as the present that was asked for, and the gap between the two is the exit animation",
            },
            {
                name: "unmounted",
                type: "boolean",
                description:
                    "Whether the content is off the page altogether rather than on it hidden. A caller draws nothing at all while this is true",
            },
            {
                name: "hideMode",
                type: "PresenceHideMode",
                description:
                    "How hidden content is being kept out of sight, once what the React the page runs on can do has been taken into account. Asking for Activity where there is none to hand answers with display-none",
            },
            {
                name: "skip",
                type: "boolean",
                description:
                    "Whether the content is still as it was first drawn, so the animation it would start with is the one that runs on mounting. It is what skipping the animation on mount is decided by",
            },
        ],
    },
    {
        name: "PresenceContext",
        props: [
            {
                name: "value",
                type: "UsePresenceReturn",
                description:
                    "What the hook answered with, carried from the component managing the presence down to the parts that draw it, so a component built from parts can hold one presence for all of them. usePresenceContext reads it, and throws rather than carrying on where there is no provider above it: a part standing outside cannot know whether it is meant to be drawn",
            },
        ],
    },
    {
        name: "splitPresenceProps",
        props: [
            {
                name: "props",
                type: "T extends UsePresenceOptions",
                required: true,
                description:
                    "Everything the component was given. It answers with the presence options and the rest as a pair, so a component that manages the presence of what it holds can hand the first to the hook and pass the second on to whatever it draws",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the presence is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Presence = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Presence
            </Heading>
            <Text as="p" size="large">
                Something that is there, or not, and animates between the two. It is asked whether
                its content is present and answers by drawing it, hiding it, or taking it off the
                page — and where the stylesheet animates the content out, it holds the content on
                the page until that animation has run rather than pulling it out from under itself.
                Where it stands is written onto the element as <Code>data-state</Code>, which is
                what a stylesheet animates by, so nothing about the animation is settled here and
                anything drawn this way can be animated however it needs to be.
            </Text>
            <Text as="p" size="large" className={classes.muted}>
                A presence draws nothing of its own, so the animation the examples below run is this
                site&rsquo;s rather than the library&rsquo;s: two keyframes declared in its
                stylesheet, reached for as <Code>animate-presence-in</Code> and{" "}
                <Code>animate-presence-out</Code> against the state the presence writes. An
                application brings its own in the same way. Where a reader has asked their system
                for less motion none of them run, and content asked away leaves at once, since there
                is then no animation for the presence to wait on.
            </Text>
        </Stack>
        <ComponentExamples component="Presence" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Presence;
