import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import InlineEditRootProvider from "./InlineEditRootProvider";
import { useInlineEdit } from "./useInlineEdit";
import type { InlineEditProps } from "./InlineEdit.types";

// A value read where it stands and edited in the same place: shown as text until the reader
// reaches for it, then swapped for a field holding it, and swapped back once the edit is kept or
// thrown away.
//
//     <InlineEdit defaultValue="Quarterly report">
//         <InlineEdit.Label>Title</InlineEdit.Label>
//         <InlineEdit.Area>
//             <InlineEdit.Input />
//             <InlineEdit.Preview />
//         </InlineEdit.Area>
//         <InlineEdit.Control>
//             <InlineEdit.EditTrigger />
//             <InlineEdit.SubmitTrigger />
//             <InlineEdit.CancelTrigger />
//         </InlineEdit.Control>
//     </InlineEdit>
//
// The preview and the field take the one place and are sized the one way, so the swap moves
// nothing else on the page. Enter keeps an edit and Escape throws it away, and leaving the field
// keeps it too unless the inline edit is told otherwise. Each trigger stands only while it has
// something to do, so all three can be written out and the right ones are there at the right
// time.
//
// The field stays on the page out of sight while the value is being read, so a value given a name
// is submitted with the form it stands in whether or not it is being edited
function InlineEdit(
    props: InlineEditProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        value,
        defaultValue,
        edit,
        defaultEdit,
        activationMode,
        submitMode,
        selectOnFocus,
        placeholder,
        maxLength,
        autoResize,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        returnFocusRef,
        onValueChange,
        onValueCommit,
        onValueRevert,
        onEditChange,
        ...rest
    } = props;

    const api = useInlineEdit({
        value,
        defaultValue,
        edit,
        defaultEdit,
        activationMode,
        submitMode,
        selectOnFocus,
        placeholder,
        maxLength,
        autoResize,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        returnFocusRef,
        onValueChange,
        onValueCommit,
        onValueRevert,
        onEditChange,
    });

    return <InlineEditRootProvider ref={ref} value={api} {...rest} />;
}

InlineEdit.displayName = "InlineEdit";

export default fixedForwardRef(InlineEdit);
