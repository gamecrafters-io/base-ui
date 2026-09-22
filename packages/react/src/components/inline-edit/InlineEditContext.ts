import { createContext, useContext } from "react";
import type { InlineEditContextValue } from "./InlineEdit.types";

export const InlineEditContext = createContext<InlineEditContextValue>({});

// What the inline edit around a part is holding, for a control of the caller's own standing among
// the parts: a hint that reads one way while the value is being read and another while it is being
// edited, say. A control standing on its own has no inline edit to read, and reaches for
// useInlineEdit
export const useInlineEditContext = () => useContext(InlineEditContext);

// What every part says about the inline edit it stands in, so a stylesheet can draw any of them
// from it. A state that does not apply is left off rather than answered "false", so a selector can
// ask whether it is there
export const getStateAttributes = ({
    editing,
    disabled,
    readOnly,
    required,
    invalid,
}: InlineEditContextValue) => ({
    "data-editing": editing || undefined,
    "data-disabled": disabled || undefined,
    "data-readonly": readOnly || undefined,
    "data-required": required || undefined,
    "data-invalid": invalid || undefined,
});
