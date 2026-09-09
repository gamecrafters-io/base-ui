import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DateInputContext } from "./DateInputContext";
import type { DateInputHiddenInputProps } from "./DateInput.types";

const classes = {
    root: "date-input-hidden-input",
};

// What the form is handed. The segments are not inputs, so the date is written out into one that
// stands out of sight, the way a native date input writes it, and is submitted under the input's
// name. A range is submitted as two, each named by where it stands
function DateInputHiddenInput(
    props: DateInputHiddenInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, index = 0, name, ...rest } = props;
    const {
        ids,
        name: inputName,
        form,
        required,
        disabled,
        readOnly,
        valueAsString,
        mode,
    } = React.useContext(DateInputContext);

    const submitName = name ?? inputName;

    return (
        <input
            ref={ref}
            id={ids?.hiddenInput(index)}
            type="hidden"
            name={
                submitName === undefined
                    ? undefined
                    : mode === "range"
                      ? `${submitName}[${index}]`
                      : submitName
            }
            form={form}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            value={valueAsString?.[index] ?? ""}
            className={classNames(classes.root, className)}
            data-component="DateInput.HiddenInput"
            {...rest}
        />
    );
}

DateInputHiddenInput.displayName = "DateInput.HiddenInput";

export default fixedForwardRef(DateInputHiddenInput);
