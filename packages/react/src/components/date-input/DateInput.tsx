import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import DateInputRootProvider from "./DateInputRootProvider";
import { useDateInput } from "./useDateInput";
import type { DateInputElementProps, DateInputProps, UseDateInputProps } from "./DateInput.types";

// A date typed a part at a time: the month, the day and the year each in a segment of its own,
// laid out in the order the locale writes them and with the separators it writes between them.
//
//     <DateInput>
//         <DateInput.Label>Starts on</DateInput.Label>
//         <DateInput.Control>
//             <DateInput.SegmentGroup />
//         </DateInput.Control>
//         <DateInput.HiddenInput />
//     </DateInput>
//
// Each segment is typed into on its own and moved through with the arrow keys, so a date can only
// ever be one the parts add up to: there is no half-typed field to read back as something it was
// not, and nothing to parse. The date is handed back the moment the last part of it is typed.
//
// A range is the same again twice over, a group of segments to each end of it, and a date-time
// adds the hour, the minute and the second after the date as far down as it is asked for
function DateInput(
    props: DateInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        mode,
        value,
        defaultValue,
        onChange,
        locale,
        granularity,
        hourCycle,
        leadingZeros,
        placeholderValue,
        min,
        max,
        isDateUnavailable,
        format,
        segmentLabels,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        onFocusChange,
        ...rest
    } = props as DateInputElementProps;

    const api = useDateInput({
        mode,
        value,
        defaultValue,
        onChange,
        locale,
        granularity,
        hourCycle,
        leadingZeros,
        placeholderValue,
        min,
        max,
        isDateUnavailable,
        format,
        segmentLabels,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        onFocusChange,
    } as UseDateInputProps);

    return <DateInputRootProvider ref={ref} value={api} {...rest} />;
}

DateInput.displayName = "DateInput";

export default fixedForwardRef(DateInput);
