import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import LayerDialogAction from "./LayerDialogAction";
import { LayerDialogContext } from "./LayerDialogContext";
import type { LayerDialogActionsProps } from "./LayerDialog.types";

const classes = {
    root: "layer-dialog-actions",
    // Where there is room, the actions stand on the layer behind the body rather than in it
    recessed: "layer-dialog-actions-recessed",
};

// The footer: a button that closes the dialog, standing before the one action it is there for.
//
// The button that closes it is drawn here rather than written by the caller, so every dialog is
// closed the same way and says so in the same place. It says "Close", or "Cancel" in an alert,
// unless it is told otherwise, and whatever it says it does the one thing. It is quiet where the
// footer stands on the layer behind the body, and drawn as a button in full on a narrow screen,
// where it stands in the body beneath what scrolls
function LayerDialogActions(
    props: LayerDialogActionsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, dismissLabel, className } = props;
    const { alert, narrow, dismissDisabled, dismiss } = React.useContext(LayerDialogContext);

    const childArray = React.Children.toArray(children);
    const actions = childArray.filter(
        (child) => React.isValidElement(child) && child.type === LayerDialogAction,
    );

    // A second action, or a control of the caller's own, would turn the footer into the row of
    // peers it is there to avoid, so it is stopped at rather than drawn
    if (actions.length !== 1 || childArray.length !== actions.length) {
        throw new Error("LayerDialog.Actions requires exactly one direct LayerDialog.Action.");
    }

    return (
        <div
            ref={ref}
            className={classNames(classes.root, !narrow && classes.recessed, className)}
            data-component="LayerDialog.Actions"
        >
            <Button
                variant={narrow ? "default" : "invisible"}
                disabled={dismissDisabled}
                onClick={() => dismiss("dismiss-button")}
                data-component="LayerDialog.DismissButton"
            >
                {dismissLabel ?? (alert ? "Cancel" : "Close")}
            </Button>
            {actions[0]}
        </div>
    );
}

LayerDialogActions.displayName = "LayerDialog.Actions";

export default fixedForwardRef(LayerDialogActions);
