import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { LayerDialog } from ".";
import type {
    LayerDialogActionVariant,
    LayerDialogProps,
    LayerDialogSize,
    LayerDialogVerticalAlign,
} from "./LayerDialog.types";

// The controls are read one at a time, so what the content and its parts are given is named here
// beside the props of the root rather than being nested inside them
type PlaygroundArgs = Omit<
    LayerDialogProps,
    "open" | "defaultOpen" | "onOpenChange" | "actionsRef" | "children"
> & {
    alert: boolean;
    size: LayerDialogSize;
    verticalAlign: LayerDialogVerticalAlign;
    closeLabel: string;
    title: string;
    description: string;
    actions: boolean;
    dismissLabel: string;
    actionLabel: string;
    actionVariant: LayerDialogActionVariant;
};

const body = (
    <Text as="p">
        A layer dialog holds one task at a time. Its title stays in view while the body scrolls, and
        it is closed either from the X beside the title or from the button standing before its one
        action, never from a row of buttons of the caller&apos;s own.
    </Text>
);

export default {
    title: "Components/LayerDialog",
    component: LayerDialog,
} as Meta<typeof LayerDialog>;

export const Default: StoryFn<typeof LayerDialog> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <LayerDialog open={open} onOpenChange={setOpen}>
            <LayerDialog.Trigger>Open settings</LayerDialog.Trigger>
            <LayerDialog.Content>
                <LayerDialog.Title>Configure custom hostname</LayerDialog.Title>
                <LayerDialog.Description>
                    Route requests for this hostname to your service.
                </LayerDialog.Description>
                <LayerDialog.Body>{body}</LayerDialog.Body>
                <LayerDialog.Actions>
                    <LayerDialog.Action onClick={() => setOpen(false)}>
                        Save hostname
                    </LayerDialog.Action>
                </LayerDialog.Actions>
            </LayerDialog.Content>
        </LayerDialog>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaygroundArgs> = ({
    alert,
    size,
    verticalAlign,
    closeLabel,
    title,
    description,
    actions,
    dismissLabel,
    actionLabel,
    actionVariant,
    ...args
}) => {
    const Root = alert ? LayerDialog.Alert : LayerDialog;

    return (
        <Root {...args}>
            <LayerDialog.Trigger>Open the dialog</LayerDialog.Trigger>
            <LayerDialog.Content
                size={size}
                verticalAlign={verticalAlign}
                closeLabel={closeLabel || undefined}
            >
                <LayerDialog.Title>{title}</LayerDialog.Title>
                {description ? (
                    <LayerDialog.Description>{description}</LayerDialog.Description>
                ) : null}
                <LayerDialog.Body>{body}</LayerDialog.Body>
                {/* An alert is answered rather than read, so it is always given its actions */}
                {actions || alert ? (
                    <LayerDialog.Actions dismissLabel={dismissLabel || undefined}>
                        <LayerDialog.Action variant={actionVariant}>
                            {actionLabel}
                        </LayerDialog.Action>
                    </LayerDialog.Actions>
                ) : null}
            </LayerDialog.Content>
        </Root>
    );
};

Playground.args = {
    alert: false,
    modal: true,
    dismissDisabled: false,
    disablePointerDismissal: false,
    size: "medium",
    verticalAlign: "center",
    closeLabel: "",
    title: "Configure custom hostname",
    description: "Route requests for this hostname to your service.",
    actions: true,
    dismissLabel: "",
    actionLabel: "Save hostname",
    actionVariant: "primary",
};

Playground.argTypes = {
    alert: {
        control: {
            type: "boolean",
        },
        description: "Asks for a decision, and is only closed from its buttons or by Escape",
    },
    modal: {
        control: {
            type: "boolean",
        },
        description: "Holds the page still behind the dialog, and keeps focus within it",
    },
    dismissDisabled: {
        control: {
            type: "boolean",
        },
        description: "Turns away every way a reader has of closing the dialog",
    },
    disablePointerDismissal: {
        control: {
            type: "boolean",
        },
        description: "Leaves the dialog standing when the page around it is pressed",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large", "xlarge"],
        description: "How wide the dialog grows where the screen has room for it",
    },
    verticalAlign: {
        control: {
            type: "radio",
        },
        options: ["top", "center"],
        description: "Where the dialog stands down a screen with room to centre it",
    },
    closeLabel: {
        control: {
            type: "text",
        },
        description: "What the X that closes a dialog with no actions is called",
    },
    title: {
        control: {
            type: "text",
        },
        description: "Names the dialog to a screen reader as well as titling it",
    },
    description: {
        control: {
            type: "text",
        },
        description: "Describes the dialog to a screen reader, beneath the title",
    },
    actions: {
        control: {
            type: "boolean",
        },
        description: "Trades the X for a button that closes the dialog and one action",
    },
    dismissLabel: {
        control: {
            type: "text",
        },
        description: "What the button that closes the dialog says",
    },
    actionLabel: {
        control: {
            type: "text",
        },
        description: "What the one action says",
    },
    actionVariant: {
        control: {
            type: "radio",
        },
        options: ["primary", "danger"],
        description: "Whether the action is the thing to do, or a thing that cannot be undone",
    },
};

Playground.parameters = {
    layout: "centered",
};
