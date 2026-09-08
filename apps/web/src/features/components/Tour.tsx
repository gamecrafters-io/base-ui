import * as React from "react";
import {
    AddRegular,
    ArrowUploadRegular,
    DeleteRegular,
    EditRegular,
    MoreHorizontalRegular,
    SaveRegular,
    SparkleRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Button,
    Heading,
    ProgressBar,
    Stack,
    Text,
    TextInput,
    Tour as TourComponent,
    useTour,
    waitForElement,
    waitForElementValue,
    waitForEvent,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";
import type { TourStep } from "@gamecrafters/base-ui/react";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Somewhere for what a tour says about itself to be written down, set apart from the page it
    // is written on
    log: "w-[var(--overlay-width-small)] p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-[var(--background-color-muted)]",
};

// The parts a tour is drawn from, written once and reached for by every example. What each of them
// says comes from the tour rather than from anything written in, so the same surface serves every
// tour on the page and each step speaks for itself.
//
// The whole of it is written out in the first listing, since that is the shape a reader has to see
// once; the rest reach for it by name
const surface = (
    <>
        <TourComponent.Backdrop />
        <TourComponent.Spotlight />
        <TourComponent.Positioner>
            <TourComponent.Content>
                <TourComponent.Arrow />
                <TourComponent.CloseTrigger />
                <TourComponent.ProgressText />
                <TourComponent.Title />
                <TourComponent.Description />
                <TourComponent.Control>
                    <TourComponent.Actions>
                        {(actions) =>
                            actions.map((action) => (
                                <TourComponent.ActionTrigger
                                    key={action.label}
                                    action={action}
                                    variant={action.action === "next" ? "primary" : "default"}
                                />
                            ))
                        }
                    </TourComponent.Actions>
                </TourComponent.Control>
            </TourComponent.Content>
        </TourComponent.Positioner>
    </>
);

// The same, as it is written. It is what every listing but the first has in hand before it can be
// drawn
const surfaceSetup = `const surface = (
    <>
        <Tour.Backdrop />
        <Tour.Spotlight />
        <Tour.Positioner>
            <Tour.Content>
                <Tour.Arrow />
                <Tour.CloseTrigger />
                <Tour.ProgressText />
                <Tour.Title />
                <Tour.Description />
                <Tour.Control>
                    <Tour.Actions>
                        {(actions) =>
                            actions.map((action) => (
                                <Tour.ActionTrigger
                                    key={action.label}
                                    action={action}
                                    variant={action.action === "next" ? "primary" : "default"}
                                />
                            ))
                        }
                    </Tour.Actions>
                </Tour.Control>
            </Tour.Content>
        </Tour.Positioner>
    </>
);`;

// What opens a tour. A tour has nothing to open it of its own, since what starts one is the page's
// to decide: a button in a help menu, a first visit, a feature that has just been turned on
const StartButton = ({ onClick, children = "Take the tour" }: React.ComponentProps<"button">) => (
    <Button variant="primary" leadingVisual={SparkleRegular} onClick={onClick}>
        {children}
    </Button>
);

// A step names what it points at by asking for it rather than holding it, so the element is looked
// for when the step is reached rather than when the steps were written. Every example on the page
// keeps its own targets apart from the rest, since a step finds one by an id that has to be the one
// element carrying it
const target = (id: string) => () => document.querySelector<HTMLElement>(`#${id}`);

/* The plainest tour there is */

const defaultSteps: TourStep[] = [
    {
        id: "welcome",
        type: "dialog",
        title: "Welcome",
        description:
            "Here is a quick way round the things you will reach for most. It takes about a minute.",
        actions: [{ label: "Start", action: "next" }],
    },
    {
        id: "upload",
        title: "Upload your files",
        description: "Anything you drop here is kept with the rest of your work.",
        target: target("tour-upload"),
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "more",
        title: "Everything else",
        description: "The rest of what you can do here is behind this.",
        target: target("tour-more"),
        side: "outside-bottom",
        align: "end",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Finish", action: "dismiss" },
        ],
    },
];

// The tour draws nothing of its own: it holds where the reader has come to and hands it down, and
// the parts below draw the dim, the ring around what the step points at, and the surface that
// speaks.
//
// The steps are given as data rather than written out as elements, since a tour speaks about parts
// of the page that are nowhere near it in the tree and often not on it at all yet.
//
// The page and the component it is about are both called Tour, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Tour, as an application importing
// it would
const DefaultPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Stack direction="horizontal" gap="normal">
                <Button id="tour-upload" leadingVisual={ArrowUploadRegular}>
                    Upload
                </Button>
                <Button id="tour-save" leadingVisual={SaveRegular}>
                    Save
                </Button>
                <Button id="tour-more" leadingVisual={MoreHorizontalRegular}>
                    More
                </Button>
            </Stack>

            <TourComponent
                steps={defaultSteps}
                open={open}
                defaultStep="welcome"
                onOpenChange={setOpen}
            >
                {surface}
            </TourComponent>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. A step names what it points at by
// asking for it, so the element is looked for when the step is reached rather than now
const defaultSetup = `const steps = [
    {
        id: "welcome",
        type: "dialog",
        title: "Welcome",
        description: "Here is a quick way round the things you will reach for most.",
        actions: [{ label: "Start", action: "next" }],
    },
    {
        id: "upload",
        title: "Upload your files",
        description: "Anything you drop here is kept with the rest of your work.",
        target: () => document.querySelector("#tour-upload"),
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "more",
        title: "Everything else",
        description: "The rest of what you can do here is behind this.",
        target: () => document.querySelector("#tour-more"),
        side: "outside-bottom",
        align: "end",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Finish", action: "dismiss" },
        ],
    },
];

const [open, setOpen] = React.useState(false);`;

const defaultCode = `<Stack gap="spacious" align="start">
    <Button variant="primary" leadingVisual={SparkleRegular} onClick={() => setOpen(true)}>
        Take the tour
    </Button>

    <Stack direction="horizontal" gap="normal">
        <Button id="tour-upload" leadingVisual={ArrowUploadRegular}>Upload</Button>
        <Button id="tour-save" leadingVisual={SaveRegular}>Save</Button>
        <Button id="tour-more" leadingVisual={MoreHorizontalRegular}>More</Button>
    </Stack>

    <Tour steps={steps} open={open} defaultStep="welcome" onOpenChange={setOpen}>
        <Tour.Backdrop />
        <Tour.Spotlight />
        <Tour.Positioner>
            <Tour.Content>
                <Tour.Arrow />
                <Tour.CloseTrigger />
                <Tour.ProgressText />
                <Tour.Title />
                <Tour.Description />
                <Tour.Control>
                    <Tour.Actions>
                        {(actions) =>
                            actions.map((action) => (
                                <Tour.ActionTrigger
                                    key={action.label}
                                    action={action}
                                    variant={action.action === "next" ? "primary" : "default"}
                                />
                            ))
                        }
                    </Tour.Actions>
                </Tour.Control>
            </Tour.Content>
        </Tour.Positioner>
    </Tour>
</Stack>`;

/* The three kinds of step */

const typeSteps: TourStep[] = [
    {
        id: "types-dialog",
        type: "dialog",
        title: "A step with nothing to point at",
        description: "This one stands in the middle of the screen, the way a dialog would.",
        actions: [{ label: "Next", action: "next" }],
    },
    {
        id: "types-tooltip",
        title: "A step standing against something",
        description: "This one is measured against the button below and points at it.",
        target: target("types-target"),
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "types-floating",
        type: "floating",
        placement: "bottom-end",
        title: "A step keeping to a corner",
        description: "This one stays where it is, whatever the reader scrolls to.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Done", action: "dismiss" },
        ],
    },
];

const TypesPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Button id="types-target" leadingVisual={SaveRegular}>
                Something to point at
            </Button>

            <TourComponent
                steps={typeSteps}
                open={open}
                defaultStep="types-dialog"
                onOpenChange={setOpen}
            >
                {surface}
            </TourComponent>
        </Stack>
    );
};

const typesSetup = `${surfaceSetup}

const steps = [
    {
        id: "types-dialog",
        type: "dialog",
        title: "A step with nothing to point at",
        description: "This one stands in the middle of the screen, the way a dialog would.",
        actions: [{ label: "Next", action: "next" }],
    },
    {
        id: "types-tooltip",
        title: "A step standing against something",
        description: "This one is measured against the button below and points at it.",
        target: () => document.querySelector("#types-target"),
        actions: [
            { label: "Back", action: "prev" },
            { label: "Next", action: "next" },
        ],
    },
    {
        id: "types-floating",
        type: "floating",
        placement: "bottom-end",
        title: "A step keeping to a corner",
        description: "This one stays where it is, whatever the reader scrolls to.",
        actions: [
            { label: "Back", action: "prev" },
            { label: "Done", action: "dismiss" },
        ],
    },
];

const [open, setOpen] = React.useState(false);`;

const typesCode = `<Stack gap="spacious" align="start">
    <Button variant="primary" leadingVisual={SparkleRegular} onClick={() => setOpen(true)}>
        Take the tour
    </Button>

    <Button id="types-target" leadingVisual={SaveRegular}>Something to point at</Button>

    <Tour steps={steps} open={open} defaultStep="types-dialog" onOpenChange={setOpen}>
        {surface}
    </Tour>
</Stack>`;

/* Stepping through with the keyboard */

const keyboardSteps: TourStep[] = [0, 1, 2].map((index) => ({
    id: `key-step-${index}`,
    title: `Step ${index + 1}`,
    description: "Press the right arrow to go on, or the left to go back.",
    target: target(`key-${index}`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 2 ? "Done" : "Next", action: index === 2 ? "dismiss" : "next" },
    ],
}));

const KeyboardPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Stack direction="horizontal" gap="normal">
                {[0, 1, 2].map((index) => (
                    <Button key={index} id={`key-${index}`}>
                        Step {index + 1}
                    </Button>
                ))}
            </Stack>

            <TourComponent
                steps={keyboardSteps}
                open={open}
                defaultStep="key-step-0"
                onOpenChange={setOpen}
                keyboardNavigation
            >
                {surface}
            </TourComponent>
        </Stack>
    );
};

const keyboardSetup = `${surfaceSetup}

const steps = [0, 1, 2].map((index) => ({
    id: \`key-step-\${index}\`,
    title: \`Step \${index + 1}\`,
    description: "Press the right arrow to go on, or the left to go back.",
    target: () => document.querySelector(\`#key-\${index}\`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 2 ? "Done" : "Next", action: index === 2 ? "dismiss" : "next" },
    ],
}));

const [open, setOpen] = React.useState(false);`;

const keyboardCode = `<Stack gap="spacious" align="start">
    <Button variant="primary" leadingVisual={SparkleRegular} onClick={() => setOpen(true)}>
        Take the tour
    </Button>

    <Stack direction="horizontal" gap="normal">
        {[0, 1, 2].map((index) => (
            <Button key={index} id={\`key-\${index}\`}>Step {index + 1}</Button>
        ))}
    </Stack>

    <Tour
        steps={steps}
        open={open}
        defaultStep="key-step-0"
        onOpenChange={setOpen}
        keyboardNavigation
    >
        {surface}
    </Tour>
</Stack>`;

/* How far along it has come */

// A bar under the words saying how much of the tour is left. How far that is comes from the tour
// rather than being counted again here, which is what useTour is for
const Progress = () => {
    const tour = useTour();

    return <ProgressBar progress={tour.progressPercent} aria-label="How far along the tour is" />;
};

const progressSteps: TourStep[] = [0, 1, 2, 3].map((index) => ({
    id: `progress-step-${index}`,
    title: `Step ${index + 1}`,
    description: "The bar under this says how much of the tour is left.",
    target: target(`progress-${index}`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 3 ? "Done" : "Next", action: index === 3 ? "dismiss" : "next" },
    ],
}));

const ProgressPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Stack direction="horizontal" gap="normal">
                {[0, 1, 2, 3].map((index) => (
                    <Button key={index} id={`progress-${index}`}>
                        Step {index + 1}
                    </Button>
                ))}
            </Stack>

            <TourComponent
                steps={progressSteps}
                open={open}
                defaultStep="progress-step-0"
                onOpenChange={setOpen}
            >
                <TourComponent.Backdrop />
                <TourComponent.Spotlight />
                <TourComponent.Positioner>
                    <TourComponent.Content>
                        <TourComponent.Arrow />
                        <TourComponent.CloseTrigger />
                        <TourComponent.ProgressText />
                        <TourComponent.Title />
                        <TourComponent.Description />
                        <Progress />
                        <TourComponent.Control>
                            <TourComponent.Actions>
                                {(actions) =>
                                    actions.map((action) => (
                                        <TourComponent.ActionTrigger
                                            key={action.label}
                                            action={action}
                                            variant={
                                                action.action === "next" ? "primary" : "default"
                                            }
                                        />
                                    ))
                                }
                            </TourComponent.Actions>
                        </TourComponent.Control>
                    </TourComponent.Content>
                </TourComponent.Positioner>
            </TourComponent>
        </Stack>
    );
};

const progressSetup = `const Progress = () => {
    const tour = useTour();

    return <ProgressBar progress={tour.progressPercent} aria-label="How far along the tour is" />;
};

const steps = [0, 1, 2, 3].map((index) => ({
    id: \`progress-step-\${index}\`,
    title: \`Step \${index + 1}\`,
    description: "The bar under this says how much of the tour is left.",
    target: () => document.querySelector(\`#progress-\${index}\`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 3 ? "Done" : "Next", action: index === 3 ? "dismiss" : "next" },
    ],
}));

const [open, setOpen] = React.useState(false);`;

const progressCode = `<Tour steps={steps} open={open} defaultStep="progress-step-0" onOpenChange={setOpen}>
    <Tour.Backdrop />
    <Tour.Spotlight />
    <Tour.Positioner>
        <Tour.Content>
            <Tour.Arrow />
            <Tour.CloseTrigger />
            <Tour.ProgressText />
            <Tour.Title />
            <Tour.Description />
            <Progress />
            <Tour.Control>
                <Tour.Actions>
                    {(actions) =>
                        actions.map((action) => (
                            <Tour.ActionTrigger
                                key={action.label}
                                action={action}
                                variant={action.action === "next" ? "primary" : "default"}
                            />
                        ))
                    }
                </Tour.Actions>
            </Tour.Control>
        </Tour.Content>
    </Tour.Positioner>
</Tour>`;

/* Waiting for the reader */

const WaitingPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState<string[]>([]);

    const steps: TourStep[] = [
        {
            id: "wait-intro",
            type: "dialog",
            title: "One thing at a time",
            description: "Each of the next three steps waits until you have done what it asks.",
            actions: [{ label: "Begin", action: "next" }],
        },
        {
            id: "wait-press",
            title: "Press add",
            description: "The tour waits here until you do. Nothing is pressed for you.",
            target: target("wait-add"),
            effect({ next, target: element, show }) {
                show();

                const [pressed, stop] = waitForEvent(element, "click");
                pressed.then(() => next());

                return stop;
            },
        },
        {
            id: "wait-element",
            title: "There it is",
            description: "This step stayed back until the row below had been drawn.",
            target: () => document.querySelector<HTMLElement>("[data-latest]"),
            effect({ show }) {
                const [arrived, stop] = waitForElement(
                    () => document.querySelector<HTMLElement>("[data-latest]"),
                    { timeout: 5000 },
                );
                arrived.then(() => show());

                return stop;
            },
            actions: [{ label: "Next", action: "next" }],
        },
        {
            id: "wait-value",
            title: 'Type "hello"',
            description: "The tour waits here until the field says exactly that.",
            target: target("wait-field"),
            effect({ next, show }) {
                show();

                const [typed, stop] = waitForElementValue(
                    () => document.querySelector<HTMLInputElement>("#wait-field"),
                    "hello",
                );
                typed.then((element) => element && next());

                return stop;
            },
        },
        {
            id: "wait-done",
            type: "dialog",
            title: "That is all of it",
            description: "Nothing was done for you: the tour simply waited each time.",
            actions: [{ label: "Finish", action: "dismiss" }],
        },
    ];

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)}>Take the interactive tour</StartButton>

            <Button
                id="wait-add"
                leadingVisual={AddRegular}
                onClick={() => setItems((current) => [...current, `Item ${current.length + 1}`])}
            >
                Add an item
            </Button>

            <Stack gap="condensed" align="start">
                {items.map((item, index) => (
                    <Text
                        key={item}
                        size="small"
                        data-latest={index === items.length - 1 ? "" : undefined}
                    >
                        {item}
                    </Text>
                ))}
            </Stack>

            <TextInput id="wait-field" placeholder="e.g. hello" aria-label="Say hello" />

            <TourComponent
                steps={steps}
                open={open}
                defaultStep="wait-intro"
                onOpenChange={setOpen}
            >
                {surface}
            </TourComponent>
        </Stack>
    );
};

const waitingSetup = `${surfaceSetup}

const steps = [
    {
        id: "wait-intro",
        type: "dialog",
        title: "One thing at a time",
        description: "Each of the next three steps waits until you have done what it asks.",
        actions: [{ label: "Begin", action: "next" }],
    },
    {
        id: "wait-press",
        title: "Press add",
        description: "The tour waits here until you do. Nothing is pressed for you.",
        target: () => document.querySelector("#wait-add"),
        effect({ next, target, show }) {
            show();

            const [pressed, stop] = waitForEvent(target, "click");
            pressed.then(() => next());

            return stop;
        },
    },
    {
        id: "wait-element",
        title: "There it is",
        description: "This step stayed back until the row below had been drawn.",
        target: () => document.querySelector("[data-latest]"),
        effect({ show }) {
            const [arrived, stop] = waitForElement(
                () => document.querySelector("[data-latest]"),
                { timeout: 5000 },
            );
            arrived.then(() => show());

            return stop;
        },
        actions: [{ label: "Next", action: "next" }],
    },
    {
        id: "wait-value",
        title: 'Type "hello"',
        description: "The tour waits here until the field says exactly that.",
        target: () => document.querySelector("#wait-field"),
        effect({ next, show }) {
            show();

            const [typed, stop] = waitForElementValue(
                () => document.querySelector("#wait-field"),
                "hello",
            );
            typed.then((element) => element && next());

            return stop;
        },
    },
    {
        id: "wait-done",
        type: "dialog",
        title: "That is all of it",
        description: "Nothing was done for you: the tour simply waited each time.",
        actions: [{ label: "Finish", action: "dismiss" }],
    },
];`;

const waitingCode = `<Tour steps={steps} open={open} defaultStep="wait-intro" onOpenChange={setOpen}>
    {surface}
</Tour>`;

/* A step that has to look something up first */

const LoadedPreview = () => {
    const [open, setOpen] = React.useState(false);

    const steps: TourStep[] = [
        {
            id: "loaded",
            title: "Just a moment",
            description: "Reading your account…",
            target: target("loaded-target"),
            actions: [{ label: "Done", action: "dismiss" }],
            effect({ show, update }) {
                const waiting = window.setTimeout(() => {
                    update({
                        title: "Welcome back",
                        description: "You have three drafts waiting and one review to answer.",
                    });
                    show();
                }, 1200);

                return () => window.clearTimeout(waiting);
            },
        },
    ];

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Button id="loaded-target" leadingVisual={EditRegular}>
                Your account
            </Button>

            <TourComponent steps={steps} open={open} defaultStep="loaded" onOpenChange={setOpen}>
                {surface}
            </TourComponent>
        </Stack>
    );
};

const loadedSetup = `${surfaceSetup}

const steps = [
    {
        id: "loaded",
        title: "Just a moment",
        description: "Reading your account…",
        target: () => document.querySelector("#loaded-target"),
        actions: [{ label: "Done", action: "dismiss" }],
        effect({ show, update }) {
            const waiting = window.setTimeout(() => {
                update({
                    title: "Welcome back",
                    description: "You have three drafts waiting and one review to answer.",
                });
                show();
            }, 1200);

            return () => window.clearTimeout(waiting);
        },
    },
];`;

const loadedCode = `<Tour steps={steps} open={open} defaultStep="loaded" onOpenChange={setOpen}>
    {surface}
</Tour>`;

/* Controls of the caller's own */

// The buttons under the words, drawn from the tour rather than from the step. useTour is what
// reaches the tour standing around them, so a step's own actions are not the only way on
const Controls = () => {
    const tour = useTour();

    return (
        <Stack direction="horizontal" gap="condensed" align="center">
            <Button size="small" disabled={!tour.hasPrev} onClick={() => tour.prev()}>
                Back
            </Button>
            <Text size="small">{tour.progressText}</Text>
            <Button size="small" disabled={!tour.hasNext} onClick={() => tour.next()}>
                Next
            </Button>
            <Button size="small" variant="danger" onClick={() => tour.dismiss()}>
                Leave
            </Button>
        </Stack>
    );
};

const ownSteps: TourStep[] = [0, 1, 2].map((index) => ({
    id: `own-step-${index}`,
    title: `Step ${index + 1}`,
    description: "The buttons under this are the caller's rather than the step's.",
    target: target(`own-${index}`),
}));

const OwnControlsPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Stack direction="horizontal" gap="normal">
                {[0, 1, 2].map((index) => (
                    <Button key={index} id={`own-${index}`}>
                        Step {index + 1}
                    </Button>
                ))}
            </Stack>

            <TourComponent
                steps={ownSteps}
                open={open}
                defaultStep="own-step-0"
                onOpenChange={setOpen}
            >
                <TourComponent.Backdrop />
                <TourComponent.Spotlight />
                <TourComponent.Positioner>
                    <TourComponent.Content>
                        <TourComponent.Arrow />
                        <TourComponent.CloseTrigger />
                        <TourComponent.Title />
                        <TourComponent.Description />
                        <TourComponent.Control>
                            <Controls />
                        </TourComponent.Control>
                    </TourComponent.Content>
                </TourComponent.Positioner>
            </TourComponent>
        </Stack>
    );
};

const ownSetup = `const Controls = () => {
    const tour = useTour();

    return (
        <Stack direction="horizontal" gap="condensed" align="center">
            <Button size="small" disabled={!tour.hasPrev} onClick={() => tour.prev()}>
                Back
            </Button>
            <Text size="small">{tour.progressText}</Text>
            <Button size="small" disabled={!tour.hasNext} onClick={() => tour.next()}>
                Next
            </Button>
            <Button size="small" variant="danger" onClick={() => tour.dismiss()}>
                Leave
            </Button>
        </Stack>
    );
};

const steps = [0, 1, 2].map((index) => ({
    id: \`own-step-\${index}\`,
    title: \`Step \${index + 1}\`,
    description: "The buttons under this are the caller's rather than the step's.",
    target: () => document.querySelector(\`#own-\${index}\`),
}));

const [open, setOpen] = React.useState(false);`;

const ownCode = `<Tour steps={steps} open={open} defaultStep="own-step-0" onOpenChange={setOpen}>
    <Tour.Backdrop />
    <Tour.Spotlight />
    <Tour.Positioner>
        <Tour.Content>
            <Tour.Arrow />
            <Tour.CloseTrigger />
            <Tour.Title />
            <Tour.Description />
            <Tour.Control>
                <Controls />
            </Tour.Control>
        </Tour.Content>
    </Tour.Positioner>
</Tour>`;

/* What the tour says as it is read */

// The last step goes on rather than closing, since stepping past the last of them is what a tour
// being read to the end comes to — and that is the whole of what this example is about
const eventSteps: TourStep[] = [0, 1, 2].map((index) => ({
    id: `event-step-${index}`,
    title: `Step ${index + 1}`,
    description: "Watch the log below as you go.",
    target: target(`event-${index}`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 2 ? "Done" : "Next", action: "next" },
    ],
}));

const EventsPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [log, setLog] = React.useState<string[]>([]);

    const note = (entry: string) => setLog((current) => [...current, entry]);

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Stack direction="horizontal" gap="normal">
                {[0, 1, 2].map((index) => (
                    <Button key={index} id={`event-${index}`}>
                        Step {index + 1}
                    </Button>
                ))}
            </Stack>

            <Stack gap="tight" className={classes.log}>
                {log.length === 0 ? (
                    <Text size="small">Start the tour to see what it says</Text>
                ) : (
                    log.map((entry, index) => (
                        <Text key={index} size="small">
                            {entry}
                        </Text>
                    ))
                )}
            </Stack>

            <TourComponent
                steps={eventSteps}
                open={open}
                defaultStep="event-step-0"
                onOpenChange={setOpen}
                onStepChange={(details) => note(`Step: ${details.stepId ?? "none"}`)}
                onStatusChange={(details) => note(`Status: ${details.status}`)}
            >
                {surface}
            </TourComponent>
        </Stack>
    );
};

const eventsSetup = `${surfaceSetup}

const steps = [0, 1, 2].map((index) => ({
    id: \`event-step-\${index}\`,
    title: \`Step \${index + 1}\`,
    description: "Watch the log below as you go.",
    target: () => document.querySelector(\`#event-\${index}\`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 2 ? "Done" : "Next", action: "next" },
    ],
}));

const [open, setOpen] = React.useState(false);

const [log, setLog] = React.useState([]);

const note = (entry) => setLog((current) => [...current, entry]);`;

const eventsCode = `<Tour
    steps={steps}
    open={open}
    defaultStep="event-step-0"
    onOpenChange={setOpen}
    onStepChange={(details) => note(\`Step: \${details.stepId ?? "none"}\`)}
    onStatusChange={(details) => note(\`Status: \${details.status}\`)}
>
    {surface}
</Tour>`;

/* Without the dim behind it */

const plainSteps: TourStep[] = [0, 1].map((index) => ({
    id: `plain-step-${index}`,
    backdrop: false,
    title: `Step ${index + 1}`,
    description: "The page behind is left as it was, and only the ring says where to look.",
    target: target(`plain-${index}`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 1 ? "Done" : "Next", action: index === 1 ? "dismiss" : "next" },
    ],
}));

const PlainPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="spacious" align="start">
            <StartButton onClick={() => setOpen(true)} />

            <Stack direction="horizontal" gap="normal">
                {[0, 1].map((index) => (
                    <Button key={index} id={`plain-${index}`} leadingVisual={DeleteRegular}>
                        Step {index + 1}
                    </Button>
                ))}
            </Stack>

            <TourComponent
                steps={plainSteps}
                open={open}
                defaultStep="plain-step-0"
                onOpenChange={setOpen}
            >
                {surface}
            </TourComponent>
        </Stack>
    );
};

const plainSetup = `${surfaceSetup}

const steps = [0, 1].map((index) => ({
    id: \`plain-step-\${index}\`,
    backdrop: false,
    title: \`Step \${index + 1}\`,
    description: "The page behind is left as it was, and only the ring says where to look.",
    target: () => document.querySelector(\`#plain-\${index}\`),
    actions: [
        { label: "Back", action: "prev" },
        { label: index === 1 ? "Done" : "Next", action: index === 1 ? "dismiss" : "next" },
    ],
}));

const [open, setOpen] = React.useState(false);`;

const plainCode = `<Tour steps={steps} open={open} defaultStep="plain-step-0" onOpenChange={setOpen}>
    {surface}
</Tour>`;

// The tour as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then the three shapes a step takes and the ways through it, then the steps that wait on
// the reader rather than on a press of their own, and last what the tour says about itself and how
// it is drawn
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A way through a feature, read one step at a time, where each step points at the part of the page it is speaking about. The steps are given as data rather than written out as elements, since a tour speaks about parts of the page that are nowhere near it in the tree and often not on it at all yet — so each step names what it points at by asking for it, and the element is looked for when the step is reached. The tour draws nothing of its own: it holds where the reader has come to and hands it down, and the parts below draw the dim, the ring and the surface that speaks. It has nothing to open it of its own, since what starts a tour is the page's to decide.",
        setup: defaultSetup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "The three kinds of step",
        description:
            "A tooltip stands against something on the page and points at it, a dialog stands in the middle of the screen with nothing to point at, and a floating step keeps to a corner wherever the reader has scrolled to. Left unsaid, a step that points at something is a tooltip and one that points at nothing is a dialog, so the kind only has to be given where it is neither. Which edge of the target a tooltip stands off is where it is put rather than where it stays: one with no room on that side is placed where there is room, and the caret is drawn from where it ended up rather than from what was asked for.",
        setup: typesSetup,
        preview: <TypesPreview />,
        code: typesCode,
    },
    {
        name: "Stepping through with the keyboard",
        description:
            "The arrow keys step through as well as the buttons, for a reader working through a long tour without reaching for the pointer each time. It is off unless it is asked for, since a tour standing over a page whose own arrow keys mean something would take them out of the reader's hands. Escape closes the tour whether or not this is on.",
        setup: keyboardSetup,
        preview: <KeyboardPreview />,
        code: keyboardCode,
    },
    {
        name: "How far along it has come",
        description:
            "A bar under the words saying how much of the tour is left, which is what makes one worth starting: a reader who can see there are two steps to go will read them, and one who cannot will not. How far along it is comes from the tour rather than being counted again, so anything written inside the surface can read it — the words the tour writes itself are the same count said in full.",
        setup: progressSetup,
        preview: <ProgressPreview />,
        code: progressCode,
    },
    {
        name: "Waiting for the reader",
        description:
            "Steps that ask the reader to do something rather than read something. A step carrying an effect stays back until the effect says to draw it, and what takes the tour on is the reader doing the thing rather than a button under the words — the first of these waits on a press, the second on a row arriving that was not on the page when the step was written, and the third on a field holding what it asked for. Each returns what it put up so the tour can take it down again when the step is left. Nothing here ever rejects: a wait that runs out of time settles with nothing instead.",
        setup: waitingSetup,
        preview: <WaitingPreview />,
        code: waitingCode,
    },
    {
        name: "A step that has to look something up first",
        description:
            "One that only knows what it has to say once something has come back. It stays back while it waits and writes what it found into itself before it speaks, so the reader is never shown a step saying it is still reading. What an effect is handed does not change as the tour moves, so it is run once when its step is reached rather than again each time anything underneath it changes.",
        setup: loadedSetup,
        preview: <LoadedPreview />,
        code: loadedCode,
    },
    {
        name: "Controls of the caller's own",
        description:
            "Drawn in place of the actions a step carries. The tour is reached through useTour rather than through anything handed down, so buttons written anywhere inside it can move it — and a step's own actions are not the only way on. An action can also carry something of the caller's own in place of one of the three ways through: it is handed the tour and left to take it wherever it likes, which is what a step that has to do something on the page before moving on needs.",
        setup: ownSetup,
        preview: <OwnControlsPreview />,
        code: ownCode,
    },
    {
        name: "What the tour says as it is read",
        description:
            "For a caller keeping their own count of who has seen what. The step it has moved to is reported with where that step stands among the rest, and where the tour stands as a whole is reported apart from it. The two ways it can end are worth telling apart: stepping on from the last step is a tour read through, and anything else is a tour left. The last button here goes on rather than closing, which is why reading it to the end reports completed — a Done that dismisses instead would report a tour that was left.",
        setup: eventsSetup,
        preview: <EventsPreview />,
        code: eventsCode,
    },
    {
        name: "Without the dim behind it",
        description:
            "For a tour that speaks about a page the reader is meant to go on using while they read. The page behind is left as it was and only the ring says where to look. It is said by the step rather than by the tour, so a tour can dim the page for the steps that are only read and leave it alone for the ones that are worked through.",
        setup: plainSetup,
        preview: <PlainPreview />,
        code: plainCode,
    },
];

// How a step is placed
const stepType = '"dialog" | "tooltip" | "floating"';

// Which corner of the screen a floating step keeps to
const floatingPlacement = '"top-start" | "top-end" | "bottom-start" | "bottom-end"';

// Which edge of the target the surface stands off
const side = '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"';

// Where along that edge it lines up
const align = '"start" | "center" | "end"';

// A button written under a step
const action = "{ label: string; action: TourActionKind | ((tour: TourApi) => void) }";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Which portal a part standing over the page is drawn into. It is the same prop saying the same
// thing under each of the three that are drawn there
const portal = {
    name: "portalContainerName",
    type: "string",
    description: "The portal it is drawn into, for a page that keeps more than one",
};

// Every prop the tour takes, then what a step is written as, then the parts the surface is drawn
// from.
//
// The steps come first, since they are the whole of what the tour is told, then where the reader
// has come to, then the ways out of it, and last how the ring around the target is drawn
const groups: ComponentPropGroup[] = [
    {
        name: "Tour",
        props: [
            {
                name: "steps",
                type: "TourStep[]",
                required: true,
                description:
                    "The steps in the order they are read. They are data rather than elements, since a tour speaks about parts of the page that are nowhere near it in the tree and often not on it at all yet",
            },
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the tour is open, where the caller keeps hold of that. A tour has nothing to open it of its own, since what starts one is the page's to decide",
            },
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether it starts open, where the tour keeps hold of that itself",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called as the tour is opened and closed",
            },
            {
                name: "step",
                type: "string | null",
                description:
                    "Which step is being read, by id, where the caller keeps hold of that. Left out, the tour keeps its own",
            },
            {
                name: "defaultStep",
                type: "string | null",
                default: "null",
                description: "Which step it opens on, where the tour keeps hold of that itself",
            },
            {
                name: "onStepChange",
                type: "(details: { stepId: string | null; stepIndex: number; count: number }) => void",
                description:
                    "Called as the tour moves, with the step it has moved to and where that step stands among the rest. The id is nothing and the index minus one where the tour has been closed",
            },
            {
                name: "onStatusChange",
                type: '(details: { status: "started" | "completed" | "dismissed" }) => void',
                description:
                    "Called as the tour as a whole moves on. Completed is stepping on from the last step, dismissed is being closed before that — by the close button, by Escape, by a press outside, or by an action taking that way out. Started is reported by the start on the tour's own api rather than by the tour being opened from outside, so a tour opened by its open prop begins without a word",
            },
            {
                name: "keyboardNavigation",
                type: "boolean",
                default: "false",
                description:
                    "Whether the arrow keys step through the tour. It is off unless it is asked for, since a tour standing over a page whose own arrow keys mean something would take them out of the reader's hands",
            },
            {
                name: "closeOnEscape",
                type: "boolean",
                default: "true",
                description: "Whether Escape closes the tour",
            },
            {
                name: "closeOnInteractOutside",
                type: "boolean",
                default: "true",
                description:
                    "Whether a press landing anywhere but the surface and what the step points at closes the tour. What the step points at is left out of that, since a step asking the reader to press something cannot close on their pressing it",
            },
            {
                name: "spotlightOffset",
                type: "number",
                default: "4",
                description:
                    "How far the ring stands clear of what the step points at, so the target is ringed rather than hemmed in",
            },
            {
                name: "spotlightRadius",
                type: "number",
                default: "8",
                description:
                    "How far the corners of that ring are rounded. It is a little more than a control's own, so the ring reads as drawn around the target rather than as part of it",
            },
            {
                name: "id",
                type: "string",
                description:
                    "The id the parts are named from. One is made where the caller does not give one, so two tours on the one page never lay claim to the same element",
            },
        ],
    },
    {
        name: "TourStep",
        props: [
            {
                name: "id",
                type: "string",
                required: true,
                description: "What the step is known as, which is what the tour is moved about by",
            },
            {
                name: "type",
                type: stepType,
                description:
                    "How the step is placed. Left out, one that points at something is a tooltip and one that points at nothing is a dialog",
            },
            {
                name: "title",
                type: "React.ReactNode",
                description: "What the step is called, which also names it to a screen reader",
            },
            {
                name: "description",
                type: "React.ReactNode",
                description: "What it says, which also describes it to a screen reader",
            },
            {
                name: "target",
                type: "() => HTMLElement | null",
                description:
                    "What the step points at. It is asked for rather than held, since the element it names may not be on the page until the step is reached, and it is asked again rather than remembered",
            },
            {
                name: "side",
                type: side,
                description:
                    "Which edge of that element the step stands off. It is where the surface is put rather than where it stays: one with no room on that side is placed where there is room",
            },
            {
                name: "align",
                type: align,
                description: "Where along that edge it lines up",
            },
            {
                name: "placement",
                type: floatingPlacement,
                description: "Which corner of the screen a floating step keeps to",
            },
            {
                name: "actions",
                type: `${action}[]`,
                description:
                    "The ways on from the step. An action naming one of the three ways through the tour is taken by the trigger; one carrying something of the caller's own is handed the tour and left to take it wherever it likes",
            },
            {
                name: "backdrop",
                type: "boolean",
                default: "true",
                description:
                    "Whether the page behind is dimmed while the step is being read. It is said by the step rather than by the tour, so a tour can dim the page for the steps that are only read and leave it alone for the ones that are worked through",
            },
            {
                name: "arrow",
                type: "boolean",
                description:
                    "Whether the surface is drawn with a caret pointing at what the step points at. Left out, a step standing against something points at it and one standing on its own does not",
            },
            {
                name: "effect",
                type: "(args: TourStepEffectArgs) => (() => void) | void",
                description:
                    "What the step does when it is reached. A step carrying one stays back until the effect calls show, which is what lets one wait for something to happen on the page before it speaks; it can also write a new title, description or set of actions into the step with update. What it returns is undone once the step has been left, being whatever it put up to wait on the page. It is run once when its step is reached rather than again as the tour changes underneath it",
            },
        ],
    },
    {
        name: "Tour.Backdrop",
        props: [
            portal,
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "The dim over the page while a step is being read. It is drawn only for the steps that ask for it",
            },
        ],
    },
    {
        name: "Tour.Spotlight",
        props: [
            portal,
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "The ring around what the step points at, cut out of the dim so the target is seen as it stands rather than through it. A step with nothing to point at draws none",
            },
        ],
    },
    {
        name: "Tour.Positioner",
        props: [
            {
                name: "side",
                type: side,
                description:
                    "Which edge of the target the surface stands off, for the steps that do not say for themselves",
            },
            {
                name: "align",
                type: align,
                description: "Where along that edge it lines up, for the same steps",
            },
            {
                name: "placement",
                type: floatingPlacement,
                description: "Which corner a floating step keeps to, for the same steps",
            },
            portal,
            styling,
        ],
    },
    {
        name: "Tour.Content",
        props: [
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "The surface the step is read from. It is what a press has to land outside of for the tour to close, and it is named and described by the title and the description written inside it",
            },
        ],
    },
    {
        name: "Tour.Arrow",
        props: [
            styling,
            {
                name: "...caret props",
                type: 'Omit<CaretProps, "location">',
                description:
                    "The caret pointing at what the step points at. Which way it points is worked out from where the surface ended up rather than from what the step asked for, so it is not the caller's to give",
            },
        ],
    },
    {
        name: "Tour.CloseTrigger",
        props: [
            {
                name: "icon",
                type: "React.ElementType | React.ReactElement",
                default: "DismissRegular",
                description: "The mark drawn in place of a label",
            },
            {
                name: "aria-label",
                type: "string",
                default: '"Close tour"',
                description:
                    "What the button is called. It carries a mark rather than words, so it has to be named, and every step carries one: a reader who has seen enough should not have to press through the rest to be let go",
            },
            styling,
        ],
    },
    {
        name: "Tour.ProgressText",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What is written in place of how far along the tour has come, which the part writes itself where nothing is given",
            },
            styling,
        ],
    },
    {
        name: "Tour.Actions",
        props: [
            {
                name: "children",
                type: "(actions: TourAction[]) => React.ReactNode",
                required: true,
                description:
                    "Handed the ways on from the step being read, to draw. They are given rather than drawn here because what a tour's buttons look like is the design system's to settle and how many of them there are is the step's, and only the caller knows both",
            },
        ],
    },
    {
        name: "Tour.ActionTrigger",
        props: [
            {
                name: "action",
                type: action,
                required: true,
                description:
                    "The way on this button takes. What it reads as is the action's own, so the same trigger is written for every step and each step names its buttons for itself",
            },
            {
                name: "variant",
                type: "ButtonVariant",
                default: '"default"',
                description: "How much weight the button carries, as any other button's does",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "What the button reads as, in place of the label the action carries",
            },
            styling,
        ],
    },
];

// What the hook answers with and the three waits a step's effect is written from. None of them is a
// component, so none has a table of its own
const hookGroups: ComponentPropGroup[] = [
    {
        name: "useTour",
        props: [
            {
                name: "…",
                type: "TourApi",
                description:
                    "Everything that can be done to the tour standing around whatever is reading this: whether it is open, the step being read and where it stands, the ways on from there, and how far along it has come. It is what a caller drawing controls of their own reaches for, in place of the actions a step carries, and it is what an action carrying something of the caller's own is handed",
            },
        ],
    },
    {
        name: "waitForEvent",
        props: [
            {
                name: "target",
                type: "() => HTMLElement | null",
                description: "What to listen to, which is the step's own target where it has one",
            },
            {
                name: "event",
                type: "keyof HTMLElementEventMap",
                required: true,
                description: "What to wait for it to do",
            },
            {
                name: "options",
                type: "AddEventListenerOptions & { predicate?: (element: HTMLElement) => boolean }",
                description:
                    "What a listener takes, and a way of saying whether this was the happening that was being waited for, for an event that fires more often than the step cares about",
            },
        ],
    },
    {
        name: "waitForElement",
        props: [
            {
                name: "query",
                type: "() => HTMLElement | null",
                required: true,
                description:
                    "Asked again on every frame until it answers with something. Frames are used rather than watching the page for changes, since what a step waits for is not always a change to the page",
            },
            {
                name: "options",
                type: "{ timeout?: number }",
                default: "{ timeout: 10000 }",
                description:
                    "How long to go on waiting before giving up. A wait that runs out settles with nothing rather than rejecting, so a step written the short way cannot leave a rejection with nobody to answer it",
            },
        ],
    },
    {
        name: "waitForElementValue",
        props: [
            {
                name: "query",
                type: "() => HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null",
                required: true,
                description: "The field to watch",
            },
            {
                name: "value",
                type: "string",
                required: true,
                description: "What it has to hold before the wait is over",
            },
            {
                name: "options",
                type: "{ timeout?: number }",
                default: "{ timeout: 10000 }",
                description: "How long to go on waiting before giving up",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the tour is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Tour = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Tour
            </Heading>
            <Text as="p" size="large">
                A way through a feature, read one step at a time, where each step points at the part
                of the page it is speaking about. The steps are given as data rather than written
                out as elements, since a tour speaks about parts of the page that are nowhere near
                it in the tree and often not on it at all yet — so a step names what it points at by
                asking for it, and the element is looked for when the step is reached. The tour
                draws nothing of its own: it holds where the reader has come to and hands it down,
                and the parts below draw the dim, the ring around the target and the surface that
                speaks. A step can wait rather than speak, staying back until the reader has pressed
                what it pointed at or until what it is about has arrived on the page, which is what
                sets a tour apart from a run of tooltips.
            </Text>
        </Stack>
        <ComponentExamples component="Tour" examples={examples} />
        <ComponentProps groups={[...groups, ...hookGroups]} />
    </Stack>
);

export default Tour;
