import InlineEditBase from "./InlineEdit";
import InlineEditArea from "./InlineEditArea";
import InlineEditCancelTrigger from "./InlineEditCancelTrigger";
import InlineEditControl from "./InlineEditControl";
import InlineEditEditTrigger from "./InlineEditEditTrigger";
import InlineEditInput from "./InlineEditInput";
import InlineEditLabel from "./InlineEditLabel";
import InlineEditPreview from "./InlineEditPreview";
import InlineEditRootProvider from "./InlineEditRootProvider";
import InlineEditSubmitTrigger from "./InlineEditSubmitTrigger";

export const InlineEdit = Object.assign(InlineEditBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and an inline edit written out in full is written the way it is read
    Root: InlineEditBase,
    RootProvider: InlineEditRootProvider,
    Label: InlineEditLabel,
    Area: InlineEditArea,
    Input: InlineEditInput,
    Preview: InlineEditPreview,
    Control: InlineEditControl,
    EditTrigger: InlineEditEditTrigger,
    SubmitTrigger: InlineEditSubmitTrigger,
    CancelTrigger: InlineEditCancelTrigger,
});

export {
    InlineEditRootProvider,
    InlineEditLabel,
    InlineEditArea,
    InlineEditInput,
    InlineEditPreview,
    InlineEditControl,
    InlineEditEditTrigger,
    InlineEditSubmitTrigger,
    InlineEditCancelTrigger,
};
export { InlineEditContext, useInlineEditContext } from "./InlineEditContext";
export { useInlineEdit } from "./useInlineEdit";
export * from "./InlineEdit.types";
