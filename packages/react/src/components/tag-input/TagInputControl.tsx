import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, TagInputContext } from "./TagInputContext";
import type { TextInputSize } from "../text-input/TextInput.types";
import type { TagInputControlProps } from "./TagInput.types";

const classes = {
    root: "tag-input-control",
    // The control is drawn from the text input's own classes, so it is sized and coloured the way
    // every other field on the page is, and carries the size the buttons inside a field are drawn
    // at
    field: "input",
    size: {
        small: "input-small",
        medium: "input-medium",
        large: "input-large",
    } satisfies Record<TextInputSize, string>,
    focus: "input-focus",
    contrast: "input-contrast",
    disabled: "input-disabled",
    invalid: "input-error",
    invalidFocus: "input-validation-focus",
};

// What the reader sees standing on the page: the tags, the field the next one is typed into after
// them, and whatever buttons are put at the end. It is the control that carries the border and the
// ring rather than the field inside it, so that the tags and the field read as the one thing, and
// the tags wrap onto further lines inside it rather than running off the end.
//
// A press on the control between and around what stands in it puts the reader in the field, the
// way a press anywhere on a field would
function TagInputControl(
    props: TagInputControlProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onMouseDown, ...rest } = props;
    const tagInput = React.useContext(TagInputContext);

    if (!tagInput) {
        return null;
    }

    const { size = "medium", contrast, disabled, invalid } = tagInput;

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseDown?.(event);

        // A caller that has answered the press itself is left to it
        if (!event.defaultPrevented) {
            tagInput.handleControlMouseDown(event);
        }
    };

    return (
        <div
            ref={ref}
            id={tagInput.ids.control}
            className={classNames(
                classes.field,
                classes.size[size],
                classes.focus,
                contrast && classes.contrast,
                disabled && classes.disabled,
                // The validation colours come last, so a control that is both disabled and
                // invalid still reads as invalid
                invalid && classes.invalid,
                invalid && classes.invalidFocus,
                classes.root,
                className,
            )}
            onMouseDown={handleMouseDown}
            data-component="TagInput.Control"
            data-size={size}
            {...getStateAttributes(tagInput)}
            {...rest}
        />
    );
}

TagInputControl.displayName = "TagInput.Control";

export default fixedForwardRef(TagInputControl);
