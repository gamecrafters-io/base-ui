import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getItemStateAttributes, TagInputContext, TagInputItemContext } from "./TagInputContext";
import type { TokenSize } from "../token/Token.types";
import type { TextInputSize } from "../text-input/TextInput.types";
import type { TagInputItemPreviewProps } from "./TagInput.types";

const classes = {
    root: "tag-input-item-preview",
    // The tag is drawn from the token's own classes, so it reads as every other token on the page
    // does, a step of the token scale smaller than the field it stands in
    token: "token token-default",
    size: {
        small: "token-small",
        medium: "token-medium",
        large: "token-large",
    } satisfies Record<TextInputSize & TokenSize, string>,
    interactive: "token-interactive token-default-interactive",
    static: "token-static",
    highlighted: "token-default-selected",
};

// The tag as it is read. A press on it moves the reader onto it, and two edit it where it stands,
// where it can be edited. It stands out of sight while it is being edited, and the field it is
// edited in takes its place
function TagInputItemPreview(
    props: TagInputItemPreviewProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onMouseDown, onDoubleClick, ...rest } = props;
    const tagInput = React.useContext(TagInputContext);
    const item = React.useContext(TagInputItemContext);

    if (!tagInput || !item) {
        return null;
    }

    const interactive = !tagInput.disabled && !tagInput.readOnly && !item.disabled;

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseDown?.(event);

        // A caller that has answered the press itself is left to it
        if (!event.defaultPrevented) {
            tagInput.handleItemPreviewMouseDown(event, item);
        }
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onDoubleClick?.(event);

        if (!event.defaultPrevented) {
            tagInput.handleItemPreviewDoubleClick(item);
        }
    };

    return (
        <div
            ref={ref}
            id={item.ids.preview}
            hidden={item.editing}
            className={classNames(
                classes.token,
                classes.size[tagInput.size ?? "medium"],
                interactive ? classes.interactive : classes.static,
                item.highlighted && classes.highlighted,
                classes.root,
                className,
            )}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            data-component="TagInput.ItemPreview"
            data-value={item.value}
            {...getItemStateAttributes(item)}
            {...rest}
        />
    );
}

TagInputItemPreview.displayName = "TagInput.ItemPreview";

export default fixedForwardRef(TagInputItemPreview);
