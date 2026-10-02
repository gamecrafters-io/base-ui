import * as React from "react";
import { LayerDialogContext } from "./LayerDialogContext";
import { useLayerDialog } from "./useLayerDialog";
import type { LayerDialogAlertProps } from "./LayerDialog.types";

// A dialog that asks for a decision before anything else can happen: deleting something that
// cannot be brought back, say. It is written the way any other is, and differs in what it refuses.
//
// It is named to a screen reader as an alert, holds the page whether or not it is told to, and is
// never closed by a press that misses it or by a swipe, since a decision is not made by reaching
// past it. Escape still closes it, the way it closes any alert. It has to be given actions, which
// stand an automatic "Cancel" before the one action that answers it
function LayerDialogAlert(props: LayerDialogAlertProps) {
    const { children, ...rest } = props;
    const context = useLayerDialog({ ...rest, alert: true });

    return <LayerDialogContext.Provider value={context}>{children}</LayerDialogContext.Provider>;
}

LayerDialogAlert.displayName = "LayerDialog.Alert";

export default LayerDialogAlert;
