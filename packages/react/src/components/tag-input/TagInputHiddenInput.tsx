import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TagInputContext } from "./TagInputContext";
import type { TagInputHiddenInputProps } from "./TagInput.types";

// What the tags are submitted through, as one value with a comma between each, under the name the
// tag input was given. It stands in the form the tag input stands in, and is what a form that is
// reset is heard through.
//
// Whether a tag has to be given is asked by the field the tags are typed into rather than by this,
// since the browser has nowhere to show its question beside an input that is never drawn
function TagInputHiddenInput(
    props: TagInputHiddenInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const tagInput = React.useContext(TagInputContext);

    if (!tagInput) {
        return null;
    }

    return (
        <input
            ref={ref}
            id={tagInput.ids.hiddenInput}
            type="text"
            hidden
            readOnly
            name={tagInput.name}
            form={tagInput.form}
            disabled={tagInput.disabled}
            value={tagInput.valueAsString}
            data-component="TagInput.HiddenInput"
            {...props}
        />
    );
}

TagInputHiddenInput.displayName = "TagInput.HiddenInput";

export default fixedForwardRef(TagInputHiddenInput);
