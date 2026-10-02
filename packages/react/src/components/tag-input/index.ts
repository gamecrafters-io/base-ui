import TagInputBase from "./TagInput";
import TagInputClearTrigger from "./TagInputClearTrigger";
import TagInputConsumer from "./TagInputConsumer";
import TagInputControl from "./TagInputControl";
import TagInputHiddenInput from "./TagInputHiddenInput";
import TagInputInput from "./TagInputInput";
import TagInputItem from "./TagInputItem";
import TagInputItemConsumer from "./TagInputItemConsumer";
import TagInputItemDeleteTrigger from "./TagInputItemDeleteTrigger";
import TagInputItemInput from "./TagInputItemInput";
import TagInputItemPreview from "./TagInputItemPreview";
import TagInputItemText from "./TagInputItemText";
import TagInputLabel from "./TagInputLabel";
import TagInputRootProvider from "./TagInputRootProvider";

export const TagInput = Object.assign(TagInputBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a tag input written out in full is written the way it is read
    Root: TagInputBase,
    RootProvider: TagInputRootProvider,
    Context: TagInputConsumer,
    Label: TagInputLabel,
    Control: TagInputControl,
    Input: TagInputInput,
    ClearTrigger: TagInputClearTrigger,
    Item: TagInputItem,
    ItemContext: TagInputItemConsumer,
    ItemPreview: TagInputItemPreview,
    ItemText: TagInputItemText,
    ItemDeleteTrigger: TagInputItemDeleteTrigger,
    ItemInput: TagInputItemInput,
    HiddenInput: TagInputHiddenInput,
});

export {
    TagInputRootProvider,
    TagInputConsumer,
    TagInputLabel,
    TagInputControl,
    TagInputInput,
    TagInputClearTrigger,
    TagInputItem,
    TagInputItemConsumer,
    TagInputItemPreview,
    TagInputItemText,
    TagInputItemDeleteTrigger,
    TagInputItemInput,
    TagInputHiddenInput,
};
export {
    TagInputContext,
    TagInputItemContext,
    useTagInputContext,
    useTagInputItemContext,
} from "./TagInputContext";
export { useTagInput } from "./useTagInput";
export * from "./TagInput.types";
