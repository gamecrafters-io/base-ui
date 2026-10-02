import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { LayerDialogContext } from "./LayerDialogContext";
import type { LayerDialogTitleProps } from "./LayerDialog.types";

const classes = {
    root: "layer-dialog-title",
};

// The heading that names the dialog. It is written beside the body and drawn at the top of it, in
// the frame that stays put while the body scrolls under it
function LayerDialogTitle(
    props: LayerDialogTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const { titleId } = React.useContext(LayerDialogContext);

    return (
        <h2
            ref={ref}
            id={titleId}
            className={classNames(classes.root, className)}
            data-component="LayerDialog.Title"
            {...rest}
        />
    );
}

LayerDialogTitle.displayName = "LayerDialog.Title";

export default fixedForwardRef(LayerDialogTitle);
