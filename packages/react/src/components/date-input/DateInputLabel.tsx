import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DateInputContext, getStateAttributes } from "./DateInputContext";
import type { DateInputLabelProps } from "./DateInput.types";

const classes = {
    root: "date-input-label",
};

// The name over the field. It names the segments as a group, by id rather than by pointing at a
// control, since there is no one control among them for it to point at, and a press on it puts
// the reader on the first of them the way a press on any field's name would
function DateInputLabel(
    props: DateInputLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onClick, ...rest } = props;
    const dateInput = React.useContext(DateInputContext);

    const handleClick = (event: React.MouseEvent<HTMLLabelElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (event.defaultPrevented || dateInput.disabled) {
            return;
        }

        dateInput.focus?.();
    };

    return (
        <label
            ref={ref}
            id={dateInput.ids?.label}
            className={classNames(classes.root, className)}
            onClick={handleClick}
            data-component="DateInput.Label"
            {...getStateAttributes(dateInput)}
            {...rest}
        />
    );
}

DateInputLabel.displayName = "DateInput.Label";

export default fixedForwardRef(DateInputLabel);
