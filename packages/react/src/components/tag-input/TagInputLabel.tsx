import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, TagInputContext } from "./TagInputContext";
import type { TagInputLabelProps } from "./TagInput.types";

const classes = {
    root: "tag-input-label",
    hidden: "sr-only",
};

// What the tag input is called. It names the field the tags are typed into, since the field is
// what a reader lands on and what holds the caret the whole time they move along the tags
function TagInputLabel(
    props: TagInputLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, visuallyHidden, ...rest } = props;
    const tagInput = React.useContext(TagInputContext);

    if (!tagInput) {
        return null;
    }

    return (
        <label
            ref={ref}
            id={tagInput.ids.label}
            htmlFor={tagInput.ids.input}
            className={classNames(classes.root, visuallyHidden && classes.hidden, className)}
            data-component="TagInput.Label"
            data-required={tagInput.required || undefined}
            {...getStateAttributes(tagInput)}
            {...rest}
        />
    );
}

TagInputLabel.displayName = "TagInput.Label";

export default fixedForwardRef(TagInputLabel);
