import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditAreaProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-area",
};

// Where the value stands, whether it is being read or edited: the preview and the field take the
// one place between them, one of them out of sight at a time.
//
// Grown with the value, the two are laid over each other instead, and the preview, standing out of
// sight behind the field while it is typed into, is what measures the room for both
function InlineEditArea(
    props: InlineEditAreaProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const inlineEdit = React.useContext(InlineEditContext);

    return (
        <div
            ref={ref}
            id={inlineEdit.ids?.area}
            className={classNames(classes.root, className)}
            data-component="InlineEdit.Area"
            data-autoresize={inlineEdit.autoResize || undefined}
            data-placeholder-shown={inlineEdit.empty || undefined}
            {...getStateAttributes(inlineEdit)}
            {...rest}
        />
    );
}

InlineEditArea.displayName = "InlineEdit.Area";

export default fixedForwardRef(InlineEditArea);
