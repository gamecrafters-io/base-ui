import { createContext, useContext } from "react";
import type { TagInputContextValue, TagInputItemState, UseTagInputReturn } from "./TagInput.types";

// Undefined outside a tag input, so a part standing on its own draws nothing rather than drawing a
// tag input that is not there
export const TagInputContext = createContext<TagInputContextValue | undefined>(undefined);

// What the tag input around a part is holding, for a control of the caller's own standing among the
// parts: a count of the tags beside the field, say. A control standing on its own has no tag input
// to read, and reaches for useTagInput
export const useTagInputContext = () => useContext(TagInputContext);

// The tag an item stands for, read by the parts it is drawn from
export const TagInputItemContext = createContext<TagInputItemState | undefined>(undefined);

export const useTagInputItemContext = () => useContext(TagInputItemContext);

// What every part says about the tag input it stands in, so a stylesheet can draw any of them from
// it. A state that does not apply is left off rather than answered "false", so a selector can ask
// whether it is there
export const getStateAttributes = ({
    focused,
    disabled,
    readOnly,
    invalid,
    empty,
}: Pick<UseTagInputReturn, "focused" | "disabled" | "readOnly" | "invalid" | "empty">) => ({
    "data-focus": focused || undefined,
    "data-disabled": disabled || undefined,
    "data-readonly": readOnly || undefined,
    "data-invalid": invalid || undefined,
    "data-empty": empty || undefined,
});

// What every part of an item says about the tag it stands for
export const getItemStateAttributes = ({
    highlighted,
    editing,
    disabled,
}: Pick<TagInputItemState, "highlighted" | "editing" | "disabled">) => ({
    "data-highlighted": highlighted || undefined,
    "data-editing": editing || undefined,
    "data-disabled": disabled || undefined,
});
