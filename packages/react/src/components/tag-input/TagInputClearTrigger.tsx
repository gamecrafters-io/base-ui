import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { TagInputContext } from "./TagInputContext";
import type { TagInputClearTriggerProps } from "./TagInput.types";

const classes = {
    // Drawn as a button standing inside a field, so it is sized by the field it stands in
    action: "input-action-button",
    root: "tag-input-clear-trigger",
};

// The button that takes every tag out and empties the field. There is nothing to clear from a tag
// input holding neither, nor from one that can only be read, so it stands down rather than sitting
// there doing nothing when pressed
function TagInputClearTrigger(
    props: TagInputClearTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        icon = DismissRegular,
        label,
        disabled,
        onClick,
        onMouseDown,
        ...rest
    } = props;
    const tagInput = React.useContext(TagInputContext);

    if (!tagInput || tagInput.readOnly || (tagInput.empty && tagInput.inputValue === "")) {
        return null;
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        onMouseDown?.(event);

        // Taking the press keeps the caret in the field, so that clearing it leaves the reader
        // where they were rather than somewhere else on the page
        if (!event.defaultPrevented) {
            event.preventDefault();
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (!event.defaultPrevented) {
            tagInput.handleClear();
        }
    };

    return (
        <IconButton
            ref={ref}
            id={tagInput.ids.clearTrigger}
            icon={icon ?? DismissRegular}
            variant="invisible"
            size="small"
            // A button standing inside a field is never a stop of its own: the field is what is
            // tabbed to, and the tags are taken out from it one at a time
            tabIndex={-1}
            aria-label={label ?? tagInput.translations.clearTriggerLabel}
            disabled={disabled ?? tagInput.disabled}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            className={classNames(classes.action, classes.root, className)}
            data-component="TagInput.ClearTrigger"
            {...rest}
        />
    );
}

TagInputClearTrigger.displayName = "TagInput.ClearTrigger";

export default fixedForwardRef(TagInputClearTrigger);
