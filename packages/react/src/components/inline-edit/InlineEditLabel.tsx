import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditLabelProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-label",
    hidden: "sr-only",
};

// The name over the value. It points at the field, so it names the field while the value is being
// edited, and it is what the preview is named by while the value is being read.
//
// The field stands out of sight while the value is being read, so a press on the name then puts
// the reader on the preview instead, which starts an edit where arriving there is what starts one
function InlineEditLabel(
    props: InlineEditLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, visuallyHidden, onClick, ...rest } = props;
    const inlineEdit = React.useContext(InlineEditContext);

    const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it, and a field already being
        // edited is where the browser puts the reader anyway
        if (event.defaultPrevented || inlineEdit.editing) {
            return;
        }

        inlineEdit.focus?.();
    };

    return (
        <label
            ref={ref}
            id={inlineEdit.ids?.label}
            htmlFor={inlineEdit.ids?.input}
            className={classNames(classes.root, visuallyHidden && classes.hidden, className)}
            onClick={handleClick}
            data-component="InlineEdit.Label"
            {...getStateAttributes(inlineEdit)}
            {...rest}
        />
    );
}

InlineEditLabel.displayName = "InlineEdit.Label";

export default fixedForwardRef(InlineEditLabel);
