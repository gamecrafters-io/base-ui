import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DateInputContext, getStateAttributes } from "./DateInputContext";
import type { TextInputSize } from "../text-input/TextInput.types";
import type { DateInputControlProps } from "./DateInput.types";

const classes = {
    root: "date-input-control",
    // The field is drawn from the text input's own classes, so it is sized and coloured the way
    // every other field on the page is. The ring the text input takes on as it is typed into is
    // left off, so the field is drawn the one way whether or not a date is being typed
    field: "input",
    size: {
        small: "input-small",
        medium: "input-medium",
        large: "input-large",
    } satisfies Record<TextInputSize, string>,
    block: "input-block",
    contrast: "input-contrast",
    disabled: "input-disabled",
    invalid: "input-error",
};

// The field the segments stand in, which is what the input is seen as. It takes the look of a
// text input, and holds whatever else is put in it beside the segments: the two groups of a
// range with something between them, or a button at the end that takes the date out again.
//
// A press on the field that missed the segments puts the reader on the first of them, in the
// group the press landed in, so the room at either end is as much the field as the figures are
function DateInputControl(
    props: DateInputControlProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onClick, ...rest } = props;
    const dateInput = React.useContext(DateInputContext);
    const { size = "medium", block, contrast, disabled, invalid, focused } = dateInput;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(event);

        if (
            event.defaultPrevented ||
            !(event.target instanceof HTMLElement) ||
            event.target.closest('[role="spinbutton"]') !== null
        ) {
            return;
        }

        const group = event.target.closest("[data-component='DateInput.SegmentGroup']");

        dateInput.focus?.(Number(group?.getAttribute("data-index") ?? 0));
    };

    return (
        <div
            ref={ref}
            id={dateInput.ids?.control}
            className={classNames(
                classes.field,
                classes.size[size],
                block && classes.block,
                contrast && classes.contrast,
                disabled && classes.disabled,
                // The validation colour comes last, so a field that is both disabled and
                // invalid still reads as invalid
                invalid && classes.invalid,
                classes.root,
                className,
            )}
            onClick={handleClick}
            data-component="DateInput.Control"
            data-size={size}
            data-focused={focused || undefined}
            {...getStateAttributes(dateInput)}
            {...rest}
        />
    );
}

DateInputControl.displayName = "DateInput.Control";

export default fixedForwardRef(DateInputControl);
