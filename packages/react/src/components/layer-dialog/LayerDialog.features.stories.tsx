import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { ActionList } from "../action-list";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { Stack } from "../stack";
import { Strong } from "../strong";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { LayerDialog } from ".";
import type { LayerDialogSize, LayerDialogVerticalAlign } from "./LayerDialog.types";

const classes = {
    row: "flex flex-wrap gap-[var(--base-size-8)]",
    entry: "px-[var(--base-size-12)] py-[var(--base-size-8)] border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
    muted: "text-foreground-muted",
};

const sizes: LayerDialogSize[] = ["small", "medium", "large", "xlarge"];

const shortcuts = [
    ["Open the command palette", "Ctrl K"],
    ["Search the page", "/"],
    ["Go to the dashboard", "G D"],
    ["Go to the settings", "G S"],
    ["Create a deployment", "C"],
    ["Show this list", "?"],
];

// Enough entries to run the dialog up against the height the screen leaves it
const entries = Array.from({ length: 40 }, (_, index) => `Entry ${index + 1}`);

export default {
    title: "Components/LayerDialog/Features",
    parameters: {
        layout: "centered",
    },
};

// Informational, where the dialog is read rather than answered, so it is closed from the X beside
// its title. Once the body is scrolled, the description folds away under the title to give what is
// being read its room, and unfolds again back at the top
export const Informational: StoryFn = () => (
    <LayerDialog>
        <LayerDialog.Trigger>Open keyboard shortcuts</LayerDialog.Trigger>
        <LayerDialog.Content>
            <LayerDialog.Title>Keyboard shortcuts</LayerDialog.Title>
            <LayerDialog.Description>
                Browse the shortcuts there are without changing a setting.
            </LayerDialog.Description>
            <LayerDialog.Body>
                <Stack gap="normal">
                    {[...shortcuts, ...shortcuts, ...shortcuts].map(([action, keys], index) => (
                        <Stack
                            key={index}
                            direction="horizontal"
                            justify="space-between"
                            className={classes.entry}
                        >
                            <Text>{action}</Text>
                            <Text className={classes.muted}>{keys}</Text>
                        </Stack>
                    ))}
                </Stack>
            </LayerDialog.Body>
        </LayerDialog.Content>
    </LayerDialog>
);

// A Standard Action, where the dialog is given actions: one thing to do, and a button standing
// before it that closes the dialog without doing it
export const StandardAction: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [hostname, setHostname] = React.useState("api.example.com");
    const [name, setName] = React.useState("Production API");

    return (
        <LayerDialog open={open} onOpenChange={setOpen}>
            <LayerDialog.Trigger>Open settings</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Configure custom hostname</LayerDialog.Title>
                <LayerDialog.Description>
                    Route requests for this hostname to your service.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <Stack gap="normal">
                        <FormControl>
                            <FormControl.Label>Hostname</FormControl.Label>
                            <TextInput
                                block
                                value={hostname}
                                onChange={(event) => setHostname(event.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Display name</FormControl.Label>
                            <TextInput
                                block
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </FormControl>
                    </Stack>
                </LayerDialog.Body>
                <LayerDialog.Actions>
                    <LayerDialog.Action
                        disabled={!hostname || !name}
                        onClick={() => setOpen(false)}
                    >
                        Save hostname
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog>
    );
};

// A Native Form, which stands in the body while the button that submits it stands in the actions.
// The two are tied together by the form's id, so the browser still checks the fields and sends the
// form the way it would anywhere else
export const NativeForm: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const formId = React.useId();

    return (
        <LayerDialog open={open} onOpenChange={setOpen}>
            <LayerDialog.Trigger>Create deployment</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Create deployment</LayerDialog.Title>
                <LayerDialog.Description>
                    The browser checks the form and submits it, as it would anywhere else.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <form
                        id={formId}
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                    >
                        <Stack gap="normal">
                            <FormControl required>
                                <FormControl.Label>Service name</FormControl.Label>
                                <TextInput block name="serviceName" placeholder="production-api" />
                            </FormControl>
                            <FormControl required>
                                <FormControl.Label>Compatibility date</FormControl.Label>
                                <TextInput block name="compatibilityDate" type="date" />
                            </FormControl>
                        </Stack>
                    </form>
                </LayerDialog.Body>
                <LayerDialog.Actions dismissLabel="Cancel">
                    <LayerDialog.Action type="submit" form={formId}>
                        Create deployment
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog>
    );
};

// A Split Action, where there is more than one way of doing the one thing. The others are offered
// from a menu opened beside the action, so the footer never grows a row of peers, and the button
// that opens the menu is drawn the way the action is
export const SplitAction: StoryFn = () => (
    <div className={classes.row}>
        <LayerDialog>
            <LayerDialog.Trigger>Edit deployment</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Save deployment</LayerDialog.Title>
                <LayerDialog.Description>
                    Deploy these changes now, or keep them as a draft.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <Text as="p">
                        Saving a draft is another way of doing what the action does, so it is
                        offered from the action&apos;s own menu rather than standing as a button of
                        its own.
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
        </LayerDialog>
        <LayerDialog.Alert>
            <LayerDialog.Trigger>Delete deployment</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Delete deployment</LayerDialog.Title>
                <LayerDialog.Description>
                    This removes the deployment for good, and cannot be undone.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <Text as="p">
                        A dangerous action draws the button that opens its menu as dangerously as it
                        draws itself, so the two still read as one control.
                    </Text>
                </LayerDialog.Body>
                <LayerDialog.Actions>
                    <LayerDialog.Action
                        variant="danger"
                        menu={[
                            <ActionList.Item key="revoke" variant="danger">
                                Delete and revoke tokens
                            </ActionList.Item>,
                        ]}
                        menuLabel="Delete options"
                    >
                        Delete deployment
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog.Alert>
    </div>
);

// Cancellation Wording, where the button that closes the dialog says something more particular
// than "Close". Whatever it says, it does the one thing
export const CancellationWording: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("Alex Morgan");
    const [email, setEmail] = React.useState("alex@example.com");

    return (
        <LayerDialog open={open} onOpenChange={setOpen}>
            <LayerDialog.Trigger>Edit profile</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Edit profile</LayerDialog.Title>
                <LayerDialog.Description>
                    Update what your teammates see of you. Nothing is saved until you say so.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <Stack gap="normal">
                        <FormControl>
                            <FormControl.Label>Display name</FormControl.Label>
                            <TextInput
                                block
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Email address</FormControl.Label>
                            <TextInput
                                block
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </FormControl>
                    </Stack>
                </LayerDialog.Body>
                <LayerDialog.Actions dismissLabel="Keep my old profile">
                    <LayerDialog.Action disabled={!name || !email} onClick={() => setOpen(false)}>
                        Save changes
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog>
    );
};

// A Destructive Alert, which asks for a decision before anything else can happen. It offers to
// cancel rather than to close, is never closed by a press that misses it, and is answered by an
// action drawn as a dangerous one. What was typed is cleared however the alert is closed, since
// that is said in onOpenChange rather than on any one button
export const DestructiveAlert: StoryFn = () => {
    const workerName = "example-worker";
    const [open, setOpen] = React.useState(false);
    const [confirmation, setConfirmation] = React.useState("");

    const handleOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            setConfirmation("");
        }
    };

    return (
        <LayerDialog.Alert open={open} onOpenChange={handleOpenChange}>
            <LayerDialog.Trigger variant="danger">Delete Worker</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Delete Worker</LayerDialog.Title>
                <LayerDialog.Description>
                    Deleting <Strong>{workerName}</Strong> is permanent.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <Stack gap="normal">
                        <Text as="p">
                            This deletes the Worker, its deployments and its configuration. The
                            queues and databases it uses stay where they are.
                        </Text>
                        <FormControl>
                            <FormControl.Label>Type {workerName} to confirm</FormControl.Label>
                            <TextInput
                                block
                                placeholder={workerName}
                                value={confirmation}
                                onChange={(event) => setConfirmation(event.target.value)}
                            />
                        </FormControl>
                    </Stack>
                </LayerDialog.Body>
                <LayerDialog.Actions>
                    <LayerDialog.Action
                        variant="danger"
                        disabled={confirmation !== workerName}
                        onClick={() => handleOpenChange(false)}
                    >
                        Delete Worker
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog.Alert>
    );
};

// Nested, where a dialog is opened from the body of another. Each is drawn over a backdrop of its
// own, so the one beneath stands where it was but plainly out of reach, and focus is handed back to
// it once the one above has closed
export const Nested: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [discarding, setDiscarding] = React.useState(false);

    const discard = () => {
        setDiscarding(false);
        setOpen(false);
    };

    return (
        <LayerDialog open={open} onOpenChange={setOpen}>
            <LayerDialog.Trigger>Edit deployment</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Edit deployment</LayerDialog.Title>
                <LayerDialog.Description>
                    Review the deployment settings before saving.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <Stack gap="normal" align="start">
                        <Text as="p">
                            Opening a second dialog from this body keeps this one beneath it, and
                            hands focus back here once the second has closed.
                        </Text>
                        <LayerDialog.Alert open={discarding} onOpenChange={setDiscarding}>
                            <LayerDialog.Trigger variant="danger">
                                Discard changes
                            </LayerDialog.Trigger>
                            <LayerDialog.Content size="small">
                                <LayerDialog.Title>Discard unsaved changes?</LayerDialog.Title>
                                <LayerDialog.Description>
                                    Your edits to the deployment will be lost.
                                </LayerDialog.Description>
                                <LayerDialog.Body>
                                    <Text as="p">
                                        Discarding closes both dialogs, and leaves the deployment as
                                        it was.
                                    </Text>
                                </LayerDialog.Body>
                                <LayerDialog.Actions>
                                    <LayerDialog.Action variant="danger" onClick={discard}>
                                        Discard changes
                                    </LayerDialog.Action>
                                </LayerDialog.Actions>
                            </LayerDialog.Content>
                        </LayerDialog.Alert>
                    </Stack>
                </LayerDialog.Body>
                <LayerDialog.Actions>
                    <LayerDialog.Action onClick={() => setOpen(false)}>
                        Save changes
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog>
    );
};

// Pending Work, where the dialog cannot be closed by the reader while what it started is still
// under way. The caller can still close it, which is what happens once the work has finished
export const PendingWork: StoryFn = () => {
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
        <LayerDialog open={open} onOpenChange={setOpen} dismissDisabled={pending}>
            <LayerDialog.Trigger>Save a setting</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Save a setting</LayerDialog.Title>
                <LayerDialog.Description>
                    While it saves, the dialog is not closed by Close, Escape, the page around it or
                    a swipe.
                </LayerDialog.Description>
                <LayerDialog.Body>
                    <Text as="p">
                        The action says that it is waiting, and the dialog closes itself once the
                        save has finished.
                    </Text>
                </LayerDialog.Body>
                <LayerDialog.Actions>
                    <LayerDialog.Action loading={pending} onClick={save}>
                        Save changes
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog>
    );
};

// Cleaning Up, which is done in onOpenChange rather than on any one button, so that it is done
// however the dialog was closed: the X, Escape, the page around it or a swipe
export const Cleanup: StoryFn = () => {
    const [cleanups, setCleanups] = React.useState(0);

    return (
        <LayerDialog
            onOpenChange={(open) => {
                if (!open) {
                    setCleanups((count) => count + 1);
                }
            }}
        >
            <LayerDialog.Trigger>Open draft</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Draft settings</LayerDialog.Title>
                <LayerDialog.Body>
                    <Text as="p">
                        The draft has been cleaned up {cleanups} {cleanups === 1 ? "time" : "times"}
                        .
                    </Text>
                </LayerDialog.Body>
            </LayerDialog.Content>
        </LayerDialog>
    );
};

// Sizes, which say how wide the dialog grows where the screen has room for it. A narrow screen
// gives the sheet the whole of its width whatever the size
export const Sizes: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [size, setSize] = React.useState<LayerDialogSize>("medium");

    return (
        <>
            <div className={classes.row}>
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
            </div>
            <LayerDialog open={open} onOpenChange={setOpen}>
                <LayerDialog.Content size={size}>
                    <LayerDialog.Title>Review deployment configuration</LayerDialog.Title>
                    <LayerDialog.Description>
                        Confirm the service and how it is routed before the deployment is created.
                    </LayerDialog.Description>
                    <LayerDialog.Body>
                        <Stack gap="normal">
                            <FormControl>
                                <FormControl.Label>Service name</FormControl.Label>
                                <TextInput block defaultValue="production-api" />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label>Hostname</FormControl.Label>
                                <TextInput block defaultValue="api.example.com" />
                            </FormControl>
                        </Stack>
                    </LayerDialog.Body>
                    <LayerDialog.Actions>
                        <LayerDialog.Action onClick={() => setOpen(false)}>
                            Create deployment
                        </LayerDialog.Action>
                    </LayerDialog.Actions>
                </LayerDialog.Content>
            </LayerDialog>
        </>
    );
};

// Top Aligned, for a dialog whose content reads better from near the top of the screen. A narrow
// screen still draws it as a sheet along the bottom
export const TopAligned: StoryFn = () => (
    <LayerDialog>
        <LayerDialog.Trigger>Open a top-aligned dialog</LayerDialog.Trigger>
        <LayerDialog.Content verticalAlign="top">
            <LayerDialog.Title>Top-aligned dialog</LayerDialog.Title>
            <LayerDialog.Body>
                <Text as="p">A narrow screen still draws this as a sheet along the bottom.</Text>
            </LayerDialog.Body>
        </LayerDialog.Content>
    </LayerDialog>
);

// The Height It Is Capped At, which is whatever room the screen leaves it however it is placed.
// Past that, only the body scrolls, while the title and the actions stay where they are
export const MaximumHeight: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [verticalAlign, setVerticalAlign] = React.useState<LayerDialogVerticalAlign>("center");

    const openAt = (align: LayerDialogVerticalAlign) => {
        setVerticalAlign(align);
        setOpen(true);
    };

    return (
        <>
            <div className={classes.row}>
                <Button onClick={() => openAt("center")}>Centred, tall content</Button>
                <Button onClick={() => openAt("top")}>Top aligned, tall content</Button>
            </div>
            <LayerDialog open={open} onOpenChange={setOpen}>
                <LayerDialog.Content verticalAlign={verticalAlign}>
                    <LayerDialog.Title>Audit log</LayerDialog.Title>
                    <LayerDialog.Description>
                        The dialog grows with what it holds until it reaches the height the screen
                        leaves it, and then only the body scrolls.
                    </LayerDialog.Description>
                    <LayerDialog.Body>
                        <Stack gap="condensed">
                            {entries.map((entry) => (
                                <Text key={entry} className={classes.entry}>
                                    {entry}
                                </Text>
                            ))}
                        </Stack>
                    </LayerDialog.Body>
                    <LayerDialog.Actions>
                        <LayerDialog.Action onClick={() => setOpen(false)}>
                            Export log
                        </LayerDialog.Action>
                    </LayerDialog.Actions>
                </LayerDialog.Content>
            </LayerDialog>
        </>
    );
};

// Modeless, which leaves the page behind the dialog to be read, scrolled and used while the dialog
// stands open over it. Its trigger closes it again as well as opening it
export const Modeless: StoryFn = () => (
    <LayerDialog modal={false}>
        <LayerDialog.Trigger>Show activity</LayerDialog.Trigger>
        <LayerDialog.Content verticalAlign="top" size="small">
            <LayerDialog.Title>Activity</LayerDialog.Title>
            <LayerDialog.Description>Everything that has happened today.</LayerDialog.Description>
            <LayerDialog.Body>
                <Text as="p">The page behind the dialog is still there to be used.</Text>
            </LayerDialog.Body>
        </LayerDialog.Content>
    </LayerDialog>
);
