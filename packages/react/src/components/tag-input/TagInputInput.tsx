import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, TagInputContext } from "./TagInputContext";
import type { TagInputInputProps } from "./TagInput.types";

const classes = {
    root: "tag-input-input",
};

// The field the next tag is typed into. Enter or the delimiter finishes a tag, and moving back from
// the start of the field moves onto the tags, which the caret stays in the field the whole time the
// reader is on.
//
// It is named by the label over the tag input, and described by the caption and the validation
// message of the field it stands in, where it stands in one. A tag input that has to be given a tag
// asks the browser for one only while it has none, since a field holding tags has been answered
// whatever is still being typed into it
function TagInputInput(
    props: TagInputInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onChange, onKeyDown, onPaste, ...rest } = props;
    const tagInput = React.useContext(TagInputContext);

    if (!tagInput) {
        return null;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        tagInput.handleInputChange(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);
        tagInput.handleInputKeyDown(event);
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(event);

        if (!event.defaultPrevented) {
            tagInput.handleInputPaste();
        }
    };

    return (
        <input
            ref={ref}
            id={tagInput.ids.input}
            type="text"
            value={tagInput.inputValue}
            // What stands in for the tags only stands in while there are none
            placeholder={tagInput.empty ? tagInput.placeholder : undefined}
            maxLength={tagInput.maxLength}
            disabled={tagInput.disabled}
            readOnly={tagInput.readOnly}
            required={tagInput.required && tagInput.empty}
            aria-required={tagInput.required || undefined}
            aria-invalid={tagInput.invalid || undefined}
            aria-describedby={tagInput.describedBy}
            // What is typed is a tag rather than a word in a sentence, so the browser is kept from
            // finishing it, correcting it or starting it with a capital
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            enterKeyHint="done"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className={classNames(classes.root, className)}
            data-component="TagInput.Input"
            {...getStateAttributes(tagInput)}
            {...rest}
        />
    );
}

TagInputInput.displayName = "TagInput.Input";

export default fixedForwardRef(TagInputInput);
