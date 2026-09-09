import { createContext, useContext } from "react";
import type { DateInputContextValue, DateInputSegmentGroupContextValue } from "./DateInput.types";

export const DateInputContext = createContext<DateInputContextValue>({});

// What the input around a part is holding, for a control of the caller's own standing among the
// parts: a button that takes the date out again, say, or a reading of what has been typed so far.
// A control standing on its own has no input to read, and reaches for useDateInput
export const useDateInputContext = () => useContext(DateInputContext);

// Which of the two groups of a range a segment stands in. A segment standing outside a group is
// taken for one of the first
export const DateInputSegmentGroupContext = createContext<DateInputSegmentGroupContextValue>({
    index: 0,
});

export const useDateInputSegmentGroupContext = () => useContext(DateInputSegmentGroupContext);

// What every part says about the input it stands in, so a stylesheet can draw any of them from
// it. A state that does not apply is left off rather than answered "false", so a selector can ask
// whether it is there
export const getStateAttributes = ({
    disabled,
    readOnly,
    required,
    invalid,
}: DateInputContextValue) => ({
    "data-disabled": disabled || undefined,
    "data-readonly": readOnly || undefined,
    "data-required": required || undefined,
    "data-invalid": invalid || undefined,
});
