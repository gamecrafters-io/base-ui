import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { LayerDialogContext } from "./LayerDialogContext";
import type { LayerDialogTriggerProps } from "./LayerDialog.types";

// What opens the dialog. It says that it opens one and whether that is open, so a reader is told
// what pressing it did without having to go looking.
//
// Pressing it again closes the dialog, which is only within reach of a modeless one: a modal
// dialog stands over the trigger until it has been closed some other way. Closing it so is the
// reader's own doing, and is turned away while dismissal is disabled
function LayerDialogTrigger<As extends React.ElementType = "button">(
    props: LayerDialogTriggerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { onClick, ...rest } = props as LayerDialogTriggerProps<"button">;
    const { open, setOpen, dismiss, popupId } = React.useContext(LayerDialogContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (event.defaultPrevented) {
            return;
        }

        if (open) {
            dismiss("trigger-press");
        } else {
            setOpen(true, "trigger-press");
        }
    };

    return (
        <Button
            ref={ref}
            onClick={handleClick}
            aria-haspopup="dialog"
            aria-expanded={open}
            // The dialog is only on the page while it is open, so the trigger says nothing about it
            // otherwise rather than naming something that is not in the document
            aria-controls={open ? popupId : undefined}
            data-component="LayerDialog.Trigger"
            data-open={open ? "" : undefined}
            {...rest}
        />
    );
}

LayerDialogTrigger.displayName = "LayerDialog.Trigger";

export default fixedForwardRef(LayerDialogTrigger);
