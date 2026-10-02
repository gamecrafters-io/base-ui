import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getItemStateAttributes, TagInputContext, TagInputItemContext } from "./TagInputContext";
import type { TokenSize } from "../token/Token.types";
import type { TextInputSize } from "../text-input/TextInput.types";
import type { TagInputItemDeleteTriggerProps } from "./TagInput.types";

const classes = {
    // Drawn from the token's own remove button, so a tag is taken out the way any token is
    token: "token-remove-button",
    size: {
        small: "token-remove-button-small",
        medium: "token-remove-button-medium",
        large: "token-remove-button-large",
    } satisfies Record<TextInputSize & TokenSize, string>,
    root: "tag-input-item-delete-trigger",
};

// The button that takes the tag out. It is never a stop of its own: a reader on the keyboard moves
// onto the tag from the field and takes it out with Backspace or Delete instead. It is named after
// the tag it takes out, since a cross on its own says nothing of which tag that is.
//
// A tag input that can only be read has nothing to take out, so the button stands down there
// rather than offering what it cannot do
function TagInputItemDeleteTrigger(
    props: TagInputItemDeleteTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, label, disabled, onClick, ...rest } = props;
    const tagInput = React.useContext(TagInputContext);
    const item = React.useContext(TagInputItemContext);

    if (!tagInput || !item) {
        return null;
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (!event.defaultPrevented) {
            tagInput.handleItemDelete(item);
        }
    };

    return (
        <button
            ref={ref}
            type="button"
            id={item.ids.deleteTrigger}
            tabIndex={-1}
            aria-label={label ?? tagInput.translations.deleteTagTriggerLabel(item.value)}
            hidden={tagInput.readOnly || undefined}
            disabled={disabled ?? (item.disabled || tagInput.readOnly)}
            onClick={handleClick}
            className={classNames(
                classes.token,
                classes.size[tagInput.size ?? "medium"],
                classes.root,
                className,
            )}
            data-component="TagInput.ItemDeleteTrigger"
            {...getItemStateAttributes(item)}
            {...rest}
        >
            {children ?? <DismissRegular />}
        </button>
    );
}

TagInputItemDeleteTrigger.displayName = "TagInput.ItemDeleteTrigger";

export default fixedForwardRef(TagInputItemDeleteTrigger);
