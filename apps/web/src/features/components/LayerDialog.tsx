import * as React from "react";
import {
    ActionList,
    Button,
    FormControl,
    Heading,
    LayerDialog as LayerDialogComponent,
    Stack,
    Strong,
    Text,
    TextInput,
} from "@gamecrafters/base-ui/react";
import type { LayerDialogSize, LayerDialogVerticalAlign } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentProp, ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // An entry in a list long enough to run the dialog up against the height the screen leaves it
    entry: "px-[var(--base-size-12)] py-[var(--base-size-8)] border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
};

const sizes: LayerDialogSize[] = ["small", "medium", "large", "xlarge"];

// The dialog written out in full: a trigger, then the content with its title, a line saying what it
// is for, a body and the one action it is there to do. The action is the caller's to answer, so the
// dialog is held by the example and closed once the action has been taken.
//
// The page and the component it is about are both called LayerDialog, so the component is brought
// in under a name saying which of the two it is. The listing beneath says LayerDialog, as an
// application importing it would
const DefaultPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [hostname, setHostname] = React.useState("api.example.com");

    return (
        <Stack align="start">
            <LayerDialogComponent open={open} onOpenChange={setOpen}>
                <LayerDialogComponent.Trigger>Open settings</LayerDialogComponent.Trigger>
                <LayerDialogComponent.Content>
                    <LayerDialogComponent.Title>
                        Configure custom hostname
                    </LayerDialogComponent.Title>
                    <LayerDialogComponent.Description>
                        Route requests for this hostname to your service.
                    </LayerDialogComponent.Description>
                    <LayerDialogComponent.Body>
                        <FormControl>
                            <FormControl.Label>Hostname</FormControl.Label>
                            <TextInput
                                block
                                value={hostname}
                                onChange={(event) => setHostname(event.target.value)}
                            />
                        </FormControl>
                    </LayerDialogComponent.Body>
                    <LayerDialogComponent.Actions>
                        <LayerDialogComponent.Action
                            disabled={!hostname}
                            onClick={() => setOpen(false)}
                        >
                            Save hostname
                        </LayerDialogComponent.Action>
                    </LayerDialogComponent.Actions>
                </LayerDialogComponent.Content>
            </LayerDialogComponent>
        </Stack>
    );
};

// What the dialog and the field it holds are held in, which is what closes the dialog once the
// action has been taken
const defaultSetup = `const [open, setOpen] = React.useState(false);
const [hostname, setHostname] = React.useState("api.example.com");`;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<LayerDialog open={open} onOpenChange={setOpen}>
    <LayerDialog.Trigger>Open settings</LayerDialog.Trigger>
    <LayerDialog.Content>
        <LayerDialog.Title>Configure custom hostname</LayerDialog.Title>
        <LayerDialog.Description>
            Route requests for this hostname to your service.
        </LayerDialog.Description>
        <LayerDialog.Body>
            <FormControl>
                <FormControl.Label>Hostname</FormControl.Label>
                <TextInput
                    block
                    value={hostname}
                    onChange={(event) => setHostname(event.target.value)}
                />
            </FormControl>
        </LayerDialog.Body>
        <LayerDialog.Actions>
            <LayerDialog.Action disabled={!hostname} onClick={() => setOpen(false)}>
                Save hostname
            </LayerDialog.Action>
        </LayerDialog.Actions>
    </LayerDialog.Content>
</LayerDialog>`;

// A dialog read rather than answered, so it is given no actions and is closed from the X beside its
// title. It holds more than it has room for, so that the description folding away as the body is
// scrolled can be seen rather than described
const informationalPreview = (
    <Stack align="start">
        <LayerDialogComponent>
            <LayerDialogComponent.Trigger>Open keyboard shortcuts</LayerDialogComponent.Trigger>
            <LayerDialogComponent.Content>
                <LayerDialogComponent.Title>Keyboard shortcuts</LayerDialogComponent.Title>
                <LayerDialogComponent.Description>
                    Browse the shortcuts there are without changing a setting.
                </LayerDialogComponent.Description>
                <LayerDialogComponent.Body>
                    <Stack gap="condensed">
                        {Array.from({ length: 16 }, (_, index) => (
                            <Text key={index} className={classes.entry}>
                                Shortcut {index + 1}
                            </Text>
                        ))}
                    </Stack>
                </LayerDialogComponent.Body>
            </LayerDialogComponent.Content>
        </LayerDialogComponent>
    </Stack>
);

const entrySetup = `const entry = "px-[var(--base-size-12)] py-[var(--base-size-8)] border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]";`;

const informationalCode = `<LayerDialog>
    <LayerDialog.Trigger>Open keyboard shortcuts</LayerDialog.Trigger>
    <LayerDialog.Content>
        <LayerDialog.Title>Keyboard shortcuts</LayerDialog.Title>
        <LayerDialog.Description>
            Browse the shortcuts there are without changing a setting.
        </LayerDialog.Description>
        <LayerDialog.Body>
            <Stack gap="condensed">
                {Array.from({ length: 16 }, (_, index) => (
                    <Text key={index} className={entry}>
                        Shortcut {index + 1}
                    </Text>
                ))}
            </Stack>
        </LayerDialog.Body>
    </LayerDialog.Content>
</LayerDialog>`;

// A form standing in the body with the button that submits it standing in the actions, tied to it
// by the form's id, so the browser still checks the fields and sends the form itself
const NativeFormPreview = () => {
    const [open, setOpen] = React.useState(false);
    const formId = React.useId();

    return (
        <Stack align="start">
            <LayerDialogComponent open={open} onOpenChange={setOpen}>
                <LayerDialogComponent.Trigger>Create deployment</LayerDialogComponent.Trigger>
                <LayerDialogComponent.Content>
                    <LayerDialogComponent.Title>Create deployment</LayerDialogComponent.Title>
                    <LayerDialogComponent.Body>
                        <form
                            id={formId}
                            onSubmit={(event) => {
                                event.preventDefault();
                                setOpen(false);
                            }}
                        >
                            <FormControl required>
                                <FormControl.Label>Service name</FormControl.Label>
                                <TextInput block name="service" placeholder="production-api" />
                            </FormControl>
                        </form>
                    </LayerDialogComponent.Body>
                    <LayerDialogComponent.Actions dismissLabel="Cancel">
                        <LayerDialogComponent.Action type="submit" form={formId}>
                            Create deployment
                        </LayerDialogComponent.Action>
                    </LayerDialogComponent.Actions>
                </LayerDialogComponent.Content>
            </LayerDialogComponent>
        </Stack>
    );
};

const nativeFormSetup = `const [open, setOpen] = React.useState(false);
const formId = React.useId();`;

const nativeFormCode = `<LayerDialog open={open} onOpenChange={setOpen}>
    <LayerDialog.Trigger>Create deployment</LayerDialog.Trigger>
    <LayerDialog.Content>
        <LayerDialog.Title>Create deployment</LayerDialog.Title>
        <LayerDialog.Body>
            <form
                id={formId}
                onSubmit={(event) => {
                    event.preventDefault();
                    setOpen(false);
                }}
            >
                <FormControl required>
                    <FormControl.Label>Service name</FormControl.Label>
                    <TextInput block name="service" placeholder="production-api" />
                </FormControl>
            </form>
        </LayerDialog.Body>
        <LayerDialog.Actions dismissLabel="Cancel">
            <LayerDialog.Action type="submit" form={formId}>
                Create deployment
            </LayerDialog.Action>
        </LayerDialog.Actions>
    </LayerDialog.Content>
</LayerDialog>`;

// Another way of doing the one thing, offered from a menu opened beside the action rather than
// standing as a button of its own, so the footer never grows a row of peers
const splitActionPreview = (
    <Stack align="start">
        <LayerDialogComponent>
            <LayerDialogComponent.Trigger>Edit deployment</LayerDialogComponent.Trigger>
            <LayerDialogComponent.Content>
                <LayerDialogComponent.Title>Save deployment</LayerDialogComponent.Title>
                <LayerDialogComponent.Description>
                    Deploy these changes now, or keep them as a draft.
                </LayerDialogComponent.Description>
                <LayerDialogComponent.Body>
                    <Text as="p">
                        Saving a draft is another way of doing what the action does, so it is
                        offered from the action&apos;s own menu.
                    </Text>
                </LayerDialogComponent.Body>
                <LayerDialogComponent.Actions>
                    <LayerDialogComponent.Action
                        menu={[<ActionList.Item key="draft">Save as draft</ActionList.Item>]}
                        menuLabel="Save options"
                    >
                        Save and deploy
                    </LayerDialogComponent.Action>
                </LayerDialogComponent.Actions>
            </LayerDialogComponent.Content>
        </LayerDialogComponent>
    </Stack>
);

const splitActionCode = `<LayerDialog>
    <LayerDialog.Trigger>Edit deployment</LayerDialog.Trigger>
    <LayerDialog.Content>
        <LayerDialog.Title>Save deployment</LayerDialog.Title>
        <LayerDialog.Description>
            Deploy these changes now, or keep them as a draft.
        </LayerDialog.Description>
        <LayerDialog.Body>
            <Text as="p">
                Saving a draft is another way of doing what the action does, so it is
                offered from the action&apos;s own menu.
            </Text>
        </LayerDialog.Body>
        <LayerDialog.Actions>
            <LayerDialog.Action
                menu={[<ActionList.Item key="draft">Save as draft</ActionList.Item>]}
                menuLabel="Save options"
            >
                Save and deploy
            </LayerDialog.Action>
        </LayerDialog.Actions>
    </LayerDialog.Content>
</LayerDialog>`;

// A decision that has to be made before anything else can happen. What was typed is cleared however
// the alert is closed, since that is said in onOpenChange rather than on any one button
const AlertPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [confirmation, setConfirmation] = React.useState("");

    const handleOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            setConfirmation("");
        }
    };

    return (
        <Stack align="start">
            <LayerDialogComponent.Alert open={open} onOpenChange={handleOpenChange}>
                <LayerDialogComponent.Trigger variant="danger">
                    Delete Worker
                </LayerDialogComponent.Trigger>
                <LayerDialogComponent.Content>
                    <LayerDialogComponent.Title>Delete Worker</LayerDialogComponent.Title>
                    <LayerDialogComponent.Description>
                        Deleting <Strong>example-worker</Strong> is permanent.
                    </LayerDialogComponent.Description>
                    <LayerDialogComponent.Body>
                        <FormControl>
                            <FormControl.Label>Type example-worker to confirm</FormControl.Label>
                            <TextInput
                                block
                                value={confirmation}
                                onChange={(event) => setConfirmation(event.target.value)}
                            />
                        </FormControl>
                    </LayerDialogComponent.Body>
                    <LayerDialogComponent.Actions>
                        <LayerDialogComponent.Action
                            variant="danger"
                            disabled={confirmation !== "example-worker"}
                            onClick={() => handleOpenChange(false)}
                        >
                            Delete Worker
                        </LayerDialogComponent.Action>
                    </LayerDialogComponent.Actions>
                </LayerDialogComponent.Content>
            </LayerDialogComponent.Alert>
        </Stack>
    );
};

const alertSetup = `const [open, setOpen] = React.useState(false);
const [confirmation, setConfirmation] = React.useState("");

const handleOpenChange = (next) => {
    setOpen(next);

    if (!next) {
        setConfirmation("");
    }
};`;

const alertCode = `<LayerDialog.Alert open={open} onOpenChange={handleOpenChange}>
    <LayerDialog.Trigger variant="danger">Delete Worker</LayerDialog.Trigger>
    <LayerDialog.Content>
        <LayerDialog.Title>Delete Worker</LayerDialog.Title>
        <LayerDialog.Description>
            Deleting <Strong>example-worker</Strong> is permanent.
        </LayerDialog.Description>
        <LayerDialog.Body>
            <FormControl>
                <FormControl.Label>Type example-worker to confirm</FormControl.Label>
                <TextInput
                    block
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                />
            </FormControl>
        </LayerDialog.Body>
        <LayerDialog.Actions>
            <LayerDialog.Action
                variant="danger"
                disabled={confirmation !== "example-worker"}
                onClick={() => handleOpenChange(false)}
            >
                Delete Worker
            </LayerDialog.Action>
        </LayerDialog.Actions>
    </LayerDialog.Content>
</LayerDialog.Alert>`;

// A dialog opened from the body of another, each over a backdrop of its own. Escape closes the one
// on top, and focus is handed back to the one beneath once it has
const nestedPreview = (
    <Stack align="start">
        <LayerDialogComponent>
            <LayerDialogComponent.Trigger>Edit deployment</LayerDialogComponent.Trigger>
            <LayerDialogComponent.Content>
                <LayerDialogComponent.Title>Edit deployment</LayerDialogComponent.Title>
                <LayerDialogComponent.Body>
                    <LayerDialogComponent.Alert>
                        <LayerDialogComponent.Trigger variant="danger">
                            Discard changes
                        </LayerDialogComponent.Trigger>
                        <LayerDialogComponent.Content size="small">
                            <LayerDialogComponent.Title>
                                Discard unsaved changes?
                            </LayerDialogComponent.Title>
                            <LayerDialogComponent.Body>
                                Your edits to the deployment will be lost.
                            </LayerDialogComponent.Body>
                            <LayerDialogComponent.Actions>
                                <LayerDialogComponent.Action variant="danger">
                                    Discard changes
                                </LayerDialogComponent.Action>
                            </LayerDialogComponent.Actions>
                        </LayerDialogComponent.Content>
                    </LayerDialogComponent.Alert>
                </LayerDialogComponent.Body>
                <LayerDialogComponent.Actions>
                    <LayerDialogComponent.Action>Save changes</LayerDialogComponent.Action>
                </LayerDialogComponent.Actions>
            </LayerDialogComponent.Content>
        </LayerDialogComponent>
    </Stack>
);

const nestedCode = `<LayerDialog>
    <LayerDialog.Trigger>Edit deployment</LayerDialog.Trigger>
    <LayerDialog.Content>
        <LayerDialog.Title>Edit deployment</LayerDialog.Title>
        <LayerDialog.Body>
            <LayerDialog.Alert>
                <LayerDialog.Trigger variant="danger">Discard changes</LayerDialog.Trigger>
                <LayerDialog.Content size="small">
                    <LayerDialog.Title>Discard unsaved changes?</LayerDialog.Title>
                    <LayerDialog.Body>Your edits to the deployment will be lost.</LayerDialog.Body>
                    <LayerDialog.Actions>
                        <LayerDialog.Action variant="danger">Discard changes</LayerDialog.Action>
                    </LayerDialog.Actions>
                </LayerDialog.Content>
            </LayerDialog.Alert>
        </LayerDialog.Body>
        <LayerDialog.Actions>
            <LayerDialog.Action>Save changes</LayerDialog.Action>
        </LayerDialog.Actions>
    </LayerDialog.Content>
</LayerDialog>`;

// A dialog the reader cannot close while the work it started is under way. The example closes it
// once the work has finished, which the caller can do whatever stands in the reader's way
const PendingPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [pending, setPending] = React.useState(false);

    const save = () => {
        setPending(true);

        window.setTimeout(() => {
            setPending(false);
            setOpen(false);
        }, 1500);
    };

    return (
        <Stack align="start">
            <LayerDialogComponent open={open} onOpenChange={setOpen} dismissDisabled={pending}>
                <LayerDialogComponent.Trigger>Save a setting</LayerDialogComponent.Trigger>
                <LayerDialogComponent.Content>
                    <LayerDialogComponent.Title>Save a setting</LayerDialogComponent.Title>
                    <LayerDialogComponent.Body>
                        While it saves, the dialog is not closed by Close, Escape, the page around
                        it or a swipe.
                    </LayerDialogComponent.Body>
                    <LayerDialogComponent.Actions>
                        <LayerDialogComponent.Action loading={pending} onClick={save}>
                            Save changes
                        </LayerDialogComponent.Action>
                    </LayerDialogComponent.Actions>
                </LayerDialogComponent.Content>
            </LayerDialogComponent>
        </Stack>
    );
};

const pendingSetup = `const [open, setOpen] = React.useState(false);
const [pending, setPending] = React.useState(false);

const save = () => {
    setPending(true);

    window.setTimeout(() => {
        setPending(false);
        setOpen(false);
    }, 1500);
};`;

const pendingCode = `<LayerDialog open={open} onOpenChange={setOpen} dismissDisabled={pending}>
    <LayerDialog.Trigger>Save a setting</LayerDialog.Trigger>
    <LayerDialog.Content>
        <LayerDialog.Title>Save a setting</LayerDialog.Title>
        <LayerDialog.Body>
            While it saves, the dialog is not closed by Close, Escape, the page around
            it or a swipe.
        </LayerDialog.Body>
        <LayerDialog.Actions>
            <LayerDialog.Action loading={pending} onClick={save}>
                Save changes
            </LayerDialog.Action>
        </LayerDialog.Actions>
    </LayerDialog.Content>
</LayerDialog>`;

// The four widths a dialog grows to where the screen has room for it. A narrow screen gives the
// sheet the whole of its width whatever the size
const SizesPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [size, setSize] = React.useState<LayerDialogSize>("medium");

    return (
        <Stack direction="horizontal" gap="condensed" wrap="wrap">
            {sizes.map((one) => (
                <Button
                    key={one}
                    onClick={() => {
                        setSize(one);
                        setOpen(true);
                    }}
                >
                    {one}
                </Button>
            ))}
            <LayerDialogComponent open={open} onOpenChange={setOpen}>
                <LayerDialogComponent.Content size={size}>
                    <LayerDialogComponent.Title>Review deployment</LayerDialogComponent.Title>
                    <LayerDialogComponent.Body>
                        Confirm the service and how it is routed before it is created.
                    </LayerDialogComponent.Body>
                    <LayerDialogComponent.Actions>
                        <LayerDialogComponent.Action onClick={() => setOpen(false)}>
                            Create deployment
                        </LayerDialogComponent.Action>
                    </LayerDialogComponent.Actions>
                </LayerDialogComponent.Content>
            </LayerDialogComponent>
        </Stack>
    );
};

const sizesSetup = `const sizes = ["small", "medium", "large", "xlarge"];

const [open, setOpen] = React.useState(false);
const [size, setSize] = React.useState("medium");`;

const sizesCode = `<Stack direction="horizontal" gap="condensed" wrap="wrap">
    {sizes.map((one) => (
        <Button
            key={one}
            onClick={() => {
                setSize(one);
                setOpen(true);
            }}
        >
            {one}
        </Button>
    ))}
    <LayerDialog open={open} onOpenChange={setOpen}>
        <LayerDialog.Content size={size}>
            <LayerDialog.Title>Review deployment</LayerDialog.Title>
            <LayerDialog.Body>
                Confirm the service and how it is routed before it is created.
            </LayerDialog.Body>
            <LayerDialog.Actions>
                <LayerDialog.Action onClick={() => setOpen(false)}>
                    Create deployment
                </LayerDialog.Action>
            </LayerDialog.Actions>
        </LayerDialog.Content>
    </LayerDialog>
</Stack>`;

// The same tall dialog stood in the middle of the screen and near the top of it. Either way it is
// capped by the room the screen leaves it, and only the body scrolls past that
const PlacementPreview = () => {
    const [open, setOpen] = React.useState(false);
    const [verticalAlign, setVerticalAlign] = React.useState<LayerDialogVerticalAlign>("center");

    const openAt = (align: LayerDialogVerticalAlign) => {
        setVerticalAlign(align);
        setOpen(true);
    };

    return (
        <Stack direction="horizontal" gap="condensed" wrap="wrap">
            <Button onClick={() => openAt("center")}>Centred</Button>
            <Button onClick={() => openAt("top")}>Near the top</Button>
            <LayerDialogComponent open={open} onOpenChange={setOpen}>
                <LayerDialogComponent.Content verticalAlign={verticalAlign}>
                    <LayerDialogComponent.Title>Audit log</LayerDialogComponent.Title>
                    <LayerDialogComponent.Description>
                        Only the body scrolls once the dialog has run out of room.
                    </LayerDialogComponent.Description>
                    <LayerDialogComponent.Body>
                        <Stack gap="condensed">
                            {Array.from({ length: 40 }, (_, index) => (
                                <Text key={index} className={classes.entry}>
                                    Entry {index + 1}
                                </Text>
                            ))}
                        </Stack>
                    </LayerDialogComponent.Body>
                    <LayerDialogComponent.Actions>
                        <LayerDialogComponent.Action onClick={() => setOpen(false)}>
                            Export log
                        </LayerDialogComponent.Action>
                    </LayerDialogComponent.Actions>
                </LayerDialogComponent.Content>
            </LayerDialogComponent>
        </Stack>
    );
};

const placementSetup = `${entrySetup}

const [open, setOpen] = React.useState(false);
const [verticalAlign, setVerticalAlign] = React.useState("center");

const openAt = (align) => {
    setVerticalAlign(align);
    setOpen(true);
};`;

const placementCode = `<Stack direction="horizontal" gap="condensed" wrap="wrap">
    <Button onClick={() => openAt("center")}>Centred</Button>
    <Button onClick={() => openAt("top")}>Near the top</Button>
    <LayerDialog open={open} onOpenChange={setOpen}>
        <LayerDialog.Content verticalAlign={verticalAlign}>
            <LayerDialog.Title>Audit log</LayerDialog.Title>
            <LayerDialog.Description>
                Only the body scrolls once the dialog has run out of room.
            </LayerDialog.Description>
            <LayerDialog.Body>
                <Stack gap="condensed">
                    {Array.from({ length: 40 }, (_, index) => (
                        <Text key={index} className={entry}>
                            Entry {index + 1}
                        </Text>
                    ))}
                </Stack>
            </LayerDialog.Body>
            <LayerDialog.Actions>
                <LayerDialog.Action onClick={() => setOpen(false)}>Export log</LayerDialog.Action>
            </LayerDialog.Actions>
        </LayerDialog.Content>
    </LayerDialog>
</Stack>`;

// A dialog that leaves the page behind it to be used, stood near the top so the page below it is
// within reach. Its trigger closes it as well as opening it
const modelessPreview = (
    <Stack align="start">
        <LayerDialogComponent modal={false}>
            <LayerDialogComponent.Trigger>Show activity</LayerDialogComponent.Trigger>
            <LayerDialogComponent.Content size="small" verticalAlign="top">
                <LayerDialogComponent.Title>Activity</LayerDialogComponent.Title>
                <LayerDialogComponent.Body>
                    The page behind the dialog is still there to be used.
                </LayerDialogComponent.Body>
            </LayerDialogComponent.Content>
        </LayerDialogComponent>
    </Stack>
);

const modelessCode = `<LayerDialog modal={false}>
    <LayerDialog.Trigger>Show activity</LayerDialog.Trigger>
    <LayerDialog.Content size="small" verticalAlign="top">
        <LayerDialog.Title>Activity</LayerDialog.Title>
        <LayerDialog.Body>The page behind the dialog is still there to be used.</LayerDialog.Body>
    </LayerDialog.Content>
</LayerDialog>`;

// The dialog as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then a dialog read rather than answered, then the ways the one action can be drawn
// and said, then the alert, then what the dialog does around the page, and last how it is laid out
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The dialog written out in full: a trigger, then the content with its title, a line saying what it is for, a body and the one action it is there to do. Given actions, it is closed from the button standing before the action, which says Close. On a narrow screen it is drawn as a sheet along the bottom with the actions beneath what scrolls, and the sheet can be swiped back down out of the way.",
        setup: defaultSetup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Read rather than answered",
        description:
            "A dialog given no actions is closed from the X beside its title instead. The title and the description stand in a frame that stays put while the body scrolls, the description folds away under the title once the body has been scrolled, and the edges of the body fade to say there is more past them.",
        setup: entrySetup,
        preview: informationalPreview,
        code: informationalCode,
    },
    {
        name: "A form of the browser's own",
        description:
            "The form stands in the body and the button that submits it in the actions, tied to it by the form's id, so the browser checks the fields and sends the form the way it would anywhere else.",
        setup: nativeFormSetup,
        preview: <NativeFormPreview />,
        code: nativeFormCode,
    },
    {
        name: "More than one way of doing it",
        description:
            "Related actions are offered from a menu opened beside the one action rather than standing as buttons of their own, so the footer never grows a row of peers. The button that opens the menu is drawn the way the action is, so the two read as halves of the one control.",
        preview: splitActionPreview,
        code: splitActionCode,
    },
    {
        name: "Asking for a decision",
        description:
            "An alert is named as one to a screen reader, holds the page whatever it is told, and is never closed by a press that misses it or by a swipe. It offers to cancel rather than to close, and Escape still cancels it. A dangerous action is drawn as one.",
        setup: alertSetup,
        preview: <AlertPreview />,
        code: alertCode,
    },
    {
        name: "Opened from another",
        description:
            "A dialog opened from the body of another stands over a backdrop of its own, so the one beneath stays where it was but plainly out of reach. Escape closes the one on top, and focus is handed back to the one beneath once it has.",
        preview: nestedPreview,
        code: nestedCode,
    },
    {
        name: "While work is pending",
        description:
            "dismissDisabled turns away every way a reader has of closing the dialog: the buttons that close it, Escape, a press around it and a swipe. The caller can still close it, through open or through actionsRef, which is what lets a dialog close itself once the work has finished.",
        setup: pendingSetup,
        preview: <PendingPreview />,
        code: pendingCode,
    },
    {
        name: "Sizes",
        description:
            "How wide the dialog grows where the screen has room for it, as a step of the overlay scale. A narrow screen gives the sheet the whole of its width whatever the size.",
        setup: sizesSetup,
        preview: <SizesPreview />,
        code: sizesCode,
    },
    {
        name: "Where it stands",
        description:
            "In the middle of the screen, or near the top of it for content that reads better from there. It is as tall as what it holds and no taller than the screen leaves it room for, placed either way, and only the body scrolls past that.",
        setup: placementSetup,
        preview: <PlacementPreview />,
        code: placementCode,
    },
    {
        name: "Left open beside the page",
        description:
            "A modeless dialog leaves the page behind it to be used: nothing is dimmed, the page still scrolls and focus is free to move on past it. Its trigger closes it again as well as opening it.",
        preview: modelessPreview,
        code: modelessCode,
    },
];

// What each part that draws an element takes to be styled from outside. It is the same prop saying
// the same thing wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the root and the alert take. They are the one dialog told different things, so what they
// take is written once and the alert says beside it what it refuses to be told
const root: ComponentProp[] = [
    {
        name: "open",
        type: "boolean",
        description: "Whether the dialog is open, where the caller keeps hold of it",
    },
    {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Whether it starts out open, where the dialog keeps hold of that itself",
    },
    {
        name: "onOpenChange",
        type: "(open: boolean, gesture: LayerDialogOpenChangeGesture) => void",
        description:
            "Called with whether the dialog is open and what opened or closed it: the trigger, the X, the button before the action, Escape, a press around the dialog, a swipe, or the caller. Whatever has to be put straight once the dialog closes belongs here rather than on any one button",
    },
    {
        name: "dismissDisabled",
        type: "boolean",
        default: "false",
        description:
            "Turns away every way a reader has of closing the dialog, for while work it started is still pending. The caller can still close it",
    },
    {
        name: "modal",
        type: "boolean",
        default: "true",
        description:
            "Holds the page still behind the dialog and keeps focus within it. A modeless dialog leaves the page to be used. An alert is always modal",
    },
    {
        name: "disablePointerDismissal",
        type: "boolean",
        default: "false",
        description:
            "Leaves the dialog standing when the page around it is pressed. An alert is never closed that way",
    },
    {
        name: "actionsRef",
        type: "React.Ref<LayerDialogInstance | null>",
        description:
            "Exposes what the dialog can be asked to do from outside it: close(), which closes it whatever stands in the way of a reader closing it",
    },
];

// Every prop the dialog and its parts take, under the part that takes it.
//
// The root comes first, since whether the dialog is open and what stands in the way of closing it
// are settled there and the parts read them. The parts follow in the order they are written in,
// which is the order they are read in
const groups: ComponentPropGroup[] = [
    {
        name: "LayerDialog",
        props: root,
    },
    {
        name: "LayerDialog.Alert",
        props: root.map((prop) =>
            prop.name === "modal" || prop.name === "disablePointerDismissal"
                ? {
                      ...prop,
                      description:
                          "Taken, but an alert is always modal and is never closed from the page around it",
                  }
                : prop,
        ),
    },
    {
        name: "LayerDialog.Trigger",
        props: [
            {
                name: "...button props",
                type: "ButtonProps",
                description:
                    "It is a Button underneath, so it takes what one takes: variant, size, a leading visual and the rest. Pressing it opens the dialog, and closes a modeless one again",
            },
        ],
    },
    {
        name: "LayerDialog.Content",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                required: true,
                description:
                    "Exactly one Title and one Body, with a Description and Actions where they are wanted, each given directly. An alert has to be given Actions. Anything else is stopped at rather than drawn",
            },
            {
                name: "size",
                type: '"small" | "medium" | "large" | "xlarge"',
                default: '"medium"',
                options: ["small", "medium", "large", "xlarge"],
                description:
                    "How wide the dialog grows where the screen has room for it, as a step of the overlay scale",
            },
            {
                name: "verticalAlign",
                type: '"top" | "center"',
                default: '"center"',
                options: ["top", "center"],
                description:
                    "Where the dialog stands down a screen with room to centre it. A narrow screen always stands it along the bottom",
            },
            {
                name: "closeLabel",
                type: "string",
                default: '"Close"',
                description: "What the X that closes a dialog with no actions is called",
            },
            {
                name: "portalContainerName",
                type: "string",
                description:
                    "The portal root the dialog is drawn into, in place of the one a PortalContext above it names. Whatever is opened from inside the dialog is drawn into the same one",
            },
            {
                name: "initialFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus as the dialog opens, in place of the first thing inside it that can",
            },
            {
                name: "returnFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus once the dialog closes, in place of whatever held it beforehand",
            },
            styling,
        ],
    },
    {
        name: "LayerDialog.Title",
        props: [styling],
    },
    {
        name: "LayerDialog.Description",
        props: [styling],
    },
    {
        name: "LayerDialog.Body",
        props: [styling],
    },
    {
        name: "LayerDialog.Actions",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                required: true,
                description:
                    "Exactly one Action. Anything that would stand beside it belongs in the action's menu",
            },
            {
                name: "dismissLabel",
                type: "string",
                default: '"Close", or "Cancel" in an alert',
                description:
                    "What the button that closes the dialog says. Whatever it says, it does the one thing",
            },
            styling,
        ],
    },
    {
        name: "LayerDialog.Action",
        props: [
            {
                name: "variant",
                type: '"primary" | "danger"',
                default: '"primary"',
                options: ["primary", "danger"],
                description:
                    "Whether the action is the thing to do, or a thing that cannot be undone",
            },
            {
                name: "menu",
                type: "React.ReactNode[]",
                description:
                    "Actions related to this one, offered from a menu opened beside it. Each is an ActionList item",
            },
            {
                name: "menuLabel",
                type: "string",
                default: '"More actions"',
                description: "Names the menu, and the button that opens it",
            },
            {
                name: "...button props",
                type: "ButtonProps",
                description:
                    "It is a Button underneath, so it takes what one takes: onClick, disabled, loading, type, form and the rest. How large it is drawn is the footer's to say",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the dialog is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const LayerDialog = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                LayerDialog
            </Heading>
            <Text as="p" size="large">
                A dialog laid out as a layered card, composed from parts that each have one place to
                go: a title, a body, and a description and actions where they are wanted. It settles
                how it is closed from what it was given, from an X beside the title or from a button
                standing before its one action, and leaves no room for a footer of the caller&apos;s
                own. Where the screen has room it stands in the middle of it; a narrow screen draws
                it as a sheet along the bottom that can be swiped back down out of the way.
            </Text>
        </Stack>
        <ComponentExamples component="LayerDialog" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default LayerDialog;
