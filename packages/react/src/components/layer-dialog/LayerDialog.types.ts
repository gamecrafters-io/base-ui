import type * as React from "react";
import type { ButtonProps } from "../button";

// What opened or closed the dialog, so a caller can tell one way of doing it from another. Every
// gesture but the last is the reader's own, and closing by any of them is turned away while
// dismissal is disabled
export type LayerDialogOpenChangeGesture =
    | "trigger-press"
    | "close-button"
    | "dismiss-button"
    | "escape"
    | "click-outside"
    | "swipe"
    | "imperative";

// How wide the dialog grows where the screen has room to stand it in the middle, as a step of the
// overlay scale. A narrow screen gives the sheet the whole of its width whatever it is told
export type LayerDialogSize = "small" | "medium" | "large" | "xlarge";

// Where the dialog stands down a screen with room to centre it. A narrow screen always stands it
// along the bottom
export type LayerDialogVerticalAlign = "top" | "center";

// How the one action is drawn: as the thing to do, or as a thing that cannot be undone
export type LayerDialogActionVariant = "primary" | "danger";

// What the dialog can be asked to do from outside it, through the `actionsRef` prop
export type LayerDialogInstance = {
    // Closes the dialog, whatever would stand in the way of a reader closing it
    close: () => void;
};

export type LayerDialogProps = {
    // Whether the dialog is open, where the caller keeps hold of it
    open?: boolean;
    // Whether it starts out open, where the dialog keeps hold of that itself
    defaultOpen?: boolean;
    // Called with whether the dialog is open and with what opened or closed it. Whatever has to be
    // put straight once the dialog closes belongs here rather than on any one button, since this
    // hears of every way there is of closing it
    onOpenChange?: (open: boolean, gesture: LayerDialogOpenChangeGesture) => void;
    // Turns away every way a reader has of closing the dialog, for while work it started is still
    // pending. The caller can still close it, through `open` or through `actionsRef`
    dismissDisabled?: boolean;
    // A modeless dialog leaves the page behind it to be used: nothing is dimmed, focus is free to
    // move on and the page still scrolls. An alert is always modal
    modal?: boolean;
    // Leaves the dialog standing when the page around it is pressed. An alert is never closed that
    // way
    disablePointerDismissal?: boolean;
    // Exposes what the dialog can be asked to do from outside it
    actionsRef?: React.Ref<LayerDialogInstance | null>;
    children?: React.ReactNode;
};

// An alert takes what a dialog does, though it is always modal and is never closed from the page
// around it or by a swipe, whatever it is told
export type LayerDialogAlertProps = LayerDialogProps;

// The trigger is drawn as a button and takes everything one does
export type LayerDialogTriggerProps<As extends React.ElementType = "button"> = ButtonProps<As>;

export type LayerDialogContentProps = {
    // Exactly one Title and one Body, with a Description and Actions where they are wanted. An
    // alert has to be given Actions, since it asks for a decision rather than for a read
    children: React.ReactNode;
    size?: LayerDialogSize;
    verticalAlign?: LayerDialogVerticalAlign;
    // What the X that closes a dialog with no actions is called
    closeLabel?: string;
    // The portal root the dialog is drawn into, in place of the one a PortalContext above it names.
    // Whatever is opened from inside the dialog, a menu say, is drawn into the same one
    portalContainerName?: string;
    // Takes focus as the dialog opens, in place of the first thing inside it that can
    initialFocusRef?: React.RefObject<HTMLElement | null>;
    // Takes focus once the dialog closes, in place of whatever held it beforehand
    returnFocusRef?: React.RefObject<HTMLElement | null>;
    className?: string;
};

// The dialog is named after the title, so the id is the dialog's to give rather than the caller's
export type LayerDialogTitleProps = Omit<React.ComponentPropsWithoutRef<"h2">, "id"> & {
    className?: string;
};

// The dialog is described by this, so the id is the dialog's to give rather than the caller's
export type LayerDialogDescriptionProps = Omit<React.ComponentPropsWithoutRef<"p">, "id"> & {
    className?: string;
};

export type LayerDialogBodyProps = {
    children?: React.ReactNode;
    className?: string;
};

export type LayerDialogActionsProps = {
    // Exactly one Action. Anything that would stand beside it belongs in the action's menu
    children: React.ReactNode;
    // What the button that closes the dialog says. "Cancel" is only worth saying where there is
    // something to be cancelled, and is what an alert says where it is told nothing
    dismissLabel?: string;
    className?: string;
};

// The one action is drawn as a button and takes most of what one does. How large it is drawn is
// the footer's to say, and how loudly is `variant`'s rather than the button's own
export type LayerDialogActionProps = Omit<
    ButtonProps,
    "as" | "variant" | "size" | "block" | "children"
> & {
    children: React.ReactNode;
    variant?: LayerDialogActionVariant;
    // Actions related to this one, offered from a menu opened beside it: "Save as draft" next to
    // "Save and deploy", say. Each is an ActionList item
    menu?: React.ReactNode[];
    // Names the menu, and the button that opens it
    menuLabel?: string;
};

// What the parts read off the dialog around them
export type LayerDialogContextValue = {
    open: boolean;
    // Opens or closes the dialog as asked, whatever would stand in the way of a reader doing it
    setOpen: (open: boolean, gesture: LayerDialogOpenChangeGesture) => void;
    // Closes the dialog the way a reader does, which is turned away while dismissal is disabled
    dismiss: (gesture: LayerDialogOpenChangeGesture) => void;
    alert: boolean;
    modal: boolean;
    dismissDisabled: boolean;
    // Whether a press on the page around the dialog closes it
    pointerDismissal: boolean;
    // Whether the screen is too narrow to stand the dialog in the middle of it, so that it is drawn
    // as a sheet along the bottom instead
    narrow: boolean;
    popupId: string;
    titleId: string;
    descriptionId: string;
};
