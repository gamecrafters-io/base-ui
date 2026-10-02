import { createContext, useContext } from "react";
import type * as React from "react";
import type { LayerDialogContextValue } from "./LayerDialog.types";

// The default stands in for a dialog that is not there, so a part rendered on its own still reads
// rather than throwing. Nothing can be opened without a dialog to hold whether it is, so the
// setters are left as no-ops
export const LayerDialogContext = createContext<LayerDialogContextValue>({
    open: false,
    setOpen: () => undefined,
    dismiss: () => undefined,
    alert: false,
    modal: true,
    dismissDisabled: false,
    pointerDismissal: true,
    narrow: true,
    popupId: "",
    titleId: "",
    descriptionId: "",
});

// What the dialog around a part is holding, for a control of the caller's own standing in the
// body: a button that closes the dialog once the work it started has finished, say
export const useLayerDialogContext = () => useContext(LayerDialogContext);

// What the content hands the body to draw. The title, the description and the way of closing the
// dialog all stand on the surface the body is drawn on, but they are written beside the body
// rather than inside it, so the content collects them and the body draws them. They are kept out
// of the body's props, so a caller composes them as parts rather than handing them to the body
export type LayerDialogBodySlots = {
    title: React.ReactNode;
    description: React.ReactNode;
    actions: React.ReactNode;
    // A dialog with no actions is closed from an X beside its title instead
    showCloseButton: boolean;
    closeLabel: string;
};

export const LayerDialogBodySlotsContext = createContext<LayerDialogBodySlots>({
    title: null,
    description: null,
    actions: null,
    showCloseButton: false,
    closeLabel: "",
});
