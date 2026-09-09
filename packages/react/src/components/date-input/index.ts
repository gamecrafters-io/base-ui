import DateInputBase from "./DateInput";
import DateInputControl from "./DateInputControl";
import DateInputHiddenInput from "./DateInputHiddenInput";
import DateInputLabel from "./DateInputLabel";
import DateInputRootProvider from "./DateInputRootProvider";
import DateInputSegment from "./DateInputSegment";
import DateInputSegmentGroup from "./DateInputSegmentGroup";

export const DateInput = Object.assign(DateInputBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and an input written out in full is written the way it is read
    Root: DateInputBase,
    RootProvider: DateInputRootProvider,
    Label: DateInputLabel,
    Control: DateInputControl,
    SegmentGroup: DateInputSegmentGroup,
    Segment: DateInputSegment,
    HiddenInput: DateInputHiddenInput,
});

export {
    DateInputRootProvider,
    DateInputLabel,
    DateInputControl,
    DateInputSegmentGroup,
    DateInputSegment,
    DateInputHiddenInput,
};
export {
    DateInputContext,
    DateInputSegmentGroupContext,
    useDateInputContext,
    useDateInputSegmentGroupContext,
} from "./DateInputContext";
export { useDateInput } from "./useDateInput";
export * from "./DateInput.types";
