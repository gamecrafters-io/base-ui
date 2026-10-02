import * as React from "react";
import { LayerDialogContext } from "./LayerDialogContext";
import { useLayerDialog } from "./useLayerDialog";
import type { LayerDialogProps } from "./LayerDialog.types";

// A dialog laid out as a layered card, composed from parts that each have one place to go.
//
//     <LayerDialog>
//         <LayerDialog.Trigger>Open settings</LayerDialog.Trigger>
//         <LayerDialog.Content>
//             <LayerDialog.Title>Configure custom hostname</LayerDialog.Title>
//             <LayerDialog.Description>Route requests to your service.</LayerDialog.Description>
//             <LayerDialog.Body>...</LayerDialog.Body>
//             <LayerDialog.Actions>
//                 <LayerDialog.Action onClick={save}>Save hostname</LayerDialog.Action>
//             </LayerDialog.Actions>
//         </LayerDialog.Content>
//     </LayerDialog>
//
// The content takes exactly one title and one body, with a description and actions where they are
// wanted, and settles how the dialog is closed from what it was given: with no actions it is
// closed from an X beside the title, and with them from a button standing before the one action.
// There is no room for a caller to add a footer of their own, or a second action beside the first.
//
// Where the screen has room, the dialog stands in the middle of it with its actions on the layer
// behind the body. A narrow screen draws it as a sheet along the bottom instead, with the actions
// inside the body beneath what scrolls, and the sheet can be swiped back down out of the way.
//
// The root draws nothing of its own. What it holds is whether the dialog is open and what stands
// in the way of a reader closing it, and a wrapper around a trigger that is meant to sit inline
// would put an element in the flow that the caller never asked for
function LayerDialog(props: LayerDialogProps) {
    const { children, ...rest } = props;
    const context = useLayerDialog({ ...rest, alert: false });

    return <LayerDialogContext.Provider value={context}>{children}</LayerDialogContext.Provider>;
}

LayerDialog.displayName = "LayerDialog";

export default LayerDialog;
