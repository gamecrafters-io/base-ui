import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DateInputContext, DateInputSegmentGroupContext } from "./DateInputContext";
import type { DateInputSegmentProps } from "./DateInput.types";

const classes = {
    root: "date-input-segment",
    literal: "date-input-segment-literal",
    placeholder: "date-input-segment-placeholder",
    readOnly: "date-input-segment-readonly",
    disabled: "date-input-segment-disabled",
};

// One part of the date, or a separator between two of them.
//
// A part is a spin button: it is named for what it holds, carries the figure and the ends the
// figure is held between, and is moved through with the arrow keys as readily as it is typed
// into. It is made editable so that a phone brings up its number keyboard for it, and for
// nothing else: what is typed is read off the events and drawn from the parts, and never written
// into the element itself.
//
// A separator is drawn and not read, since a reader who cannot see it is told the parts by name
function DateInputSegment(
    props: DateInputSegmentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        segment,
        onFocus,
        onPointerDown,
        onBlur,
        onKeyDown,
        onBeforeInput,
        onPaste,
        ...rest
    } = props;
    const dateInput = React.useContext(DateInputContext);
    const { index } = React.useContext(DateInputSegmentGroupContext);
    const { disabled = false, readOnly = false, invalid = false, segmentLabels } = dateInput;

    if (segment.type === "literal") {
        return (
            <span
                ref={ref}
                aria-hidden="true"
                className={classNames(classes.root, classes.literal, className)}
                data-component="DateInput.Segment"
                data-type="literal"
                {...rest}
            >
                {segment.text}
            </span>
        );
    }

    const editable = segment.editable && !disabled && !readOnly;
    const isReadOnly = readOnly || !segment.editable;

    const handleFocus = (event: React.FocusEvent<HTMLSpanElement>) => {
        onFocus?.(event);
        dateInput.handleSegmentFocus?.(index, event);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
        onPointerDown?.(event);
        dateInput.handleSegmentPointerDown?.();
    };

    const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
        onBlur?.(event);
        dateInput.handleSegmentBlur?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        onKeyDown?.(event);
        dateInput.handleSegmentKeyDown?.(index, event);
    };

    const handleBeforeInput = (event: React.InputEvent<HTMLSpanElement>) => {
        onBeforeInput?.(event);
        dateInput.handleSegmentInput?.(index, event);
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLSpanElement>) => {
        onPaste?.(event);
        dateInput.handleSegmentPaste?.(index, event);
    };

    return (
        <span
            ref={ref}
            role="spinbutton"
            // Every part is a tab stop of its own, since each is typed into on its own
            tabIndex={disabled ? undefined : 0}
            contentEditable={editable}
            suppressContentEditableWarning
            spellCheck={editable ? false : undefined}
            autoCorrect={editable ? "off" : undefined}
            inputMode={editable && segment.type !== "dayPeriod" ? "numeric" : undefined}
            enterKeyHint="next"
            aria-label={segmentLabels?.[segment.type]}
            aria-valuenow={segment.placeholderShown ? undefined : segment.value}
            aria-valuetext={segment.placeholderShown ? segment.placeholder : segment.text}
            aria-valuemin={segment.minValue}
            aria-valuemax={segment.maxValue}
            aria-invalid={invalid || undefined}
            aria-readonly={isReadOnly || undefined}
            aria-disabled={disabled || undefined}
            className={classNames(
                classes.root,
                segment.placeholderShown && classes.placeholder,
                isReadOnly && classes.readOnly,
                disabled && classes.disabled,
                className,
            )}
            onFocus={handleFocus}
            onPointerDown={handlePointerDown}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onBeforeInput={handleBeforeInput}
            onPaste={handlePaste}
            data-component="DateInput.Segment"
            data-type={segment.type}
            data-value={segment.value}
            data-placeholder-shown={segment.placeholderShown || undefined}
            data-entered={segment.entered || undefined}
            data-filled={segment.filled || undefined}
            data-editable={editable || undefined}
            data-readonly={isReadOnly || undefined}
            data-disabled={disabled || undefined}
            {...rest}
        >
            {segment.text}
        </span>
    );
}

DateInputSegment.displayName = "DateInput.Segment";

export default fixedForwardRef(DateInputSegment);
