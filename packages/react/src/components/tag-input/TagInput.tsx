import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import TagInputRootProvider from "./TagInputRootProvider";
import { useTagInput } from "./useTagInput";
import type { TagInputProps } from "./TagInput.types";

// A field that holds a list of short values, each standing in it as a tag of its own: the topics a
// repository is filed under, the people an issue is assigned to, the frameworks a project uses.
//
//     <TagInput defaultValue={["React", "Solid"]}>
//         <TagInput.Label>Frameworks</TagInput.Label>
//         <TagInput.Control>
//             <TagInput.Context>
//                 {(tagInput) =>
//                     tagInput.value.map((value, index) => (
//                         <TagInput.Item key={index} index={index} value={value} />
//                     ))
//                 }
//             </TagInput.Context>
//             <TagInput.Input placeholder="Add a framework" />
//             <TagInput.ClearTrigger />
//         </TagInput.Control>
//         <TagInput.HiddenInput />
//     </TagInput>
//
// A tag is typed into the field and finished with Enter or the delimiter, a comma unless it is told
// otherwise. The tags are reached from the keyboard by moving back from the start of the field, and
// taken out with Backspace or Delete, or with the button each of them carries. An item given no
// children draws the parts every tag is drawn from, so the items can be written out in full where
// one has to be drawn some other way.
//
// The tags are submitted with the form the tag input stands in through the hidden input, as one
// value with a comma between each
function TagInput(
    props: TagInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        value,
        defaultValue,
        inputValue,
        defaultInputValue,
        delimiter,
        max,
        allowOverflow,
        maxLength,
        allowDuplicates,
        addOnPaste,
        blurBehavior,
        editable,
        sanitizeValue,
        validate,
        placeholder,
        autoFocus,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        translations,
        onValueChange,
        onInputValueChange,
        onHighlightChange,
        onValueInvalid,
        ...rest
    } = props;

    const api = useTagInput({
        value,
        defaultValue,
        inputValue,
        defaultInputValue,
        delimiter,
        max,
        allowOverflow,
        maxLength,
        allowDuplicates,
        addOnPaste,
        blurBehavior,
        editable,
        sanitizeValue,
        validate,
        placeholder,
        autoFocus,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        translations,
        onValueChange,
        onInputValueChange,
        onHighlightChange,
        onValueInvalid,
    });

    return <TagInputRootProvider ref={ref} value={api} {...rest} />;
}

TagInput.displayName = "TagInput";

export default fixedForwardRef(TagInput);
