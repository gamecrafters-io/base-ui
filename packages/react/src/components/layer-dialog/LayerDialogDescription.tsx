import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { LayerDialogContext } from "./LayerDialogContext";
import type { LayerDialogDescriptionProps } from "./LayerDialog.types";

const classes = {
    root: "layer-dialog-description",
};

// A line or two beneath the title saying what the dialog is for, which is what describes it to a
// screen reader. It is drawn in the frame the title stands in, and folds away under the title once
// the body has been scrolled, giving what is being read the room it took up
function LayerDialogDescription(
    props: LayerDialogDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const { descriptionId } = React.useContext(LayerDialogContext);

    return (
        <p
            ref={ref}
            id={descriptionId}
            className={classNames(classes.root, className)}
            data-component="LayerDialog.Description"
            {...rest}
        />
    );
}

LayerDialogDescription.displayName = "LayerDialog.Description";

export default fixedForwardRef(LayerDialogDescription);
