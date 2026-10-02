import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getItemStateAttributes, TagInputItemContext } from "./TagInputContext";
import type { TagInputItemTextProps } from "./TagInput.types";

const classes = {
    // Cut short where the tag runs out of room, the way a token's text is
    token: "token-text",
    root: "tag-input-item-text",
};

// What the tag says. It writes the tag out itself, so it is only given children where something
// else is to be shown in its place: the tag set out with a count after it, say
function TagInputItemText(
    props: TagInputItemTextProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const item = React.useContext(TagInputItemContext);

    if (!item) {
        return null;
    }

    return (
        <span
            ref={ref}
            className={classNames(classes.token, classes.root, className)}
            data-component="TagInput.ItemText"
            {...getItemStateAttributes(item)}
            {...rest}
        >
            {children ?? item.value}
        </span>
    );
}

TagInputItemText.displayName = "TagInput.ItemText";

export default fixedForwardRef(TagInputItemText);
