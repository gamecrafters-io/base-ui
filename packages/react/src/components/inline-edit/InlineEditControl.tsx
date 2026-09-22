import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditControlProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-control",
};

// Where the triggers stand, beside the value. Each trigger stands only while it has something to
// do, so this holds the edit trigger while the value is being read and the submit and cancel
// triggers while it is being edited, and all three can be written into it at once
function InlineEditControl(
    props: InlineEditControlProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const inlineEdit = React.useContext(InlineEditContext);

    return (
        <div
            ref={ref}
            id={inlineEdit.ids?.control}
            className={classNames(classes.root, className)}
            data-component="InlineEdit.Control"
            {...getStateAttributes(inlineEdit)}
            {...rest}
        />
    );
}

InlineEditControl.displayName = "InlineEdit.Control";

export default fixedForwardRef(InlineEditControl);
