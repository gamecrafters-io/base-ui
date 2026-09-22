import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { TextInputSize } from "../text-input/TextInput.types";
import type { InlineEditInputElement, InlineEditInputProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-input",
    // The field is drawn from the text input's own classes, so it is sized and coloured the way
    // every other field on the page is
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

// The field the value is edited in. It takes the preview's place while the value is being edited,
// and stands out of sight rather than off the page while it is being read, so that a value given a
// name is submitted with its form either way.
//
// Enter keeps what was typed and Escape throws it away. A box of lines, drawn with
// `as="textarea"`, takes Enter for a new line and keeps the edit with Command or Control held.
//
// It is named by the label over the inline edit, and described by the caption and the validation
// message of the field it stands in, where it stands in one. Whatever the caller sets on it
// stands, so it can still be wired up by hand where it has to be
function InlineEditInput<As extends InlineEditInputElement = "input">(
    props: InlineEditInputProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "input",
        className,
        onChange,
        onKeyDown,
        ...rest
    } = props as InlineEditInputProps<"input">;
    const inlineEdit = React.useContext(InlineEditContext);
    const {
        ids,
        value = "",
        placeholder,
        maxLength,
        name,
        form,
        size = "medium",
        contrast,
        editing = false,
        autoResize = false,
        disabled,
        readOnly,
        required,
        invalid,
        describedBy,
    } = inlineEdit;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        inlineEdit.handleInputChange?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
        inlineEdit.handleInputKeyDown?.(event);
    };

    return (
        <Component
            ref={ref}
            id={ids?.input}
            name={name}
            form={form}
            value={value}
            placeholder={placeholder}
            maxLength={maxLength}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            // A field grown with the value stands behind the preview while the value is being
            // read rather than out of the way of it, and is only as wide as a character until
            // the preview says how wide the value is
            hidden={autoResize ? undefined : !editing}
            size={autoResize && Component === "input" ? 1 : undefined}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={classNames(
                classes.field,
                classes.size[size],
                classes.focus,
                contrast && classes.contrast,
                disabled && classes.disabled,
                // The validation colours come last, so a field that is both disabled and invalid
                // still reads as invalid
                invalid && classes.invalid,
                invalid && classes.invalidFocus,
                classes.root,
                className,
            )}
            data-component="InlineEdit.Input"
            data-size={size}
            data-autoresize={autoResize || undefined}
            {...getStateAttributes(inlineEdit)}
            {...rest}
        />
    );
}

InlineEditInput.displayName = "InlineEdit.Input";

export default fixedForwardRef(InlineEditInput);
