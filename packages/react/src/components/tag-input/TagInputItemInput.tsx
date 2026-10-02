import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getItemStateAttributes, TagInputContext, TagInputItemContext } from "./TagInputContext";
import type { TagInputItemInputProps } from "./TagInput.types";

const classes = {
    root: "tag-input-item-input",
};

// The field a tag is edited in, standing where the tag stood while it is being edited and out of
// sight the rest of the time. Enter keeps the edit and Escape throws it away, and moving off it
// any other way throws it away as well. A tag edited down to nothing is taken out.
//
// It grows with what it holds, a character at a time, so the tags after it move along as it is
// typed into rather than jumping once the edit is kept
function TagInputItemInput(
    props: TagInputItemInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onChange, onKeyDown, onBlur, ...rest } = props;
    const tagInput = React.useContext(TagInputContext);
    const item = React.useContext(TagInputItemContext);

    if (!tagInput || !item) {
        return null;
    }

    const value = item.editing ? tagInput.editedValue : "";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        tagInput.handleItemInputChange(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
        tagInput.handleItemInputKeyDown(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);
        tagInput.handleItemInputBlur();
    };

    return (
        <input
            ref={ref}
            id={item.ids.input}
            type="text"
            // Reached by editing the tag rather than by tabbing to it
            tabIndex={-1}
            hidden={!item.editing}
            value={value}
            size={Math.max(1, value.length)}
            maxLength={tagInput.maxLength}
            disabled={item.disabled}
            aria-label={tagInput.translations.tagEdited(item.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            enterKeyHint="done"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={classNames(classes.root, className)}
            data-component="TagInput.ItemInput"
            {...getItemStateAttributes(item)}
            {...rest}
        />
    );
}

TagInputItemInput.displayName = "TagInput.ItemInput";

export default fixedForwardRef(TagInputItemInput);
