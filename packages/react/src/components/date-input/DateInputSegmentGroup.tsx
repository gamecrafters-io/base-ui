import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import {
    DateInputContext,
    DateInputSegmentGroupContext,
    getStateAttributes,
} from "./DateInputContext";
import DateInputSegment from "./DateInputSegment";
import type { DateInputSegmentGroupProps } from "./DateInput.types";

const classes = {
    root: "date-input-segment-group",
};

// The segments of one date, in the order the locale writes them. A single date has one of these
// and a range has two, each told which of the two dates it holds.
//
// The segments are drawn for the caller, since they are only ever the parts of a date in the
// order they come; a caller who would rather draw them themselves is handed the parts to draw
// and writes a segment for each
function DateInputSegmentGroup(
    props: DateInputSegmentGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, index = 0, children, ...rest } = props;
    const dateInput = React.useContext(DateInputContext);
    const { ids, describedBy, ariaLabel, ariaLabelledBy } = dateInput;

    const segments = dateInput.getSegments?.(index) ?? [];
    const isActive = Boolean(dateInput.focused) && dateInput.activeIndex === index;

    const content =
        typeof children === "function"
            ? children(segments)
            : (children ??
              segments.map((segment, position) => (
                  <DateInputSegment key={`${segment.type}-${position}`} segment={segment} />
              )));

    return (
        <DateInputSegmentGroupContext.Provider value={{ index }}>
            <div
                ref={ref}
                id={ids?.segmentGroup(index)}
                // The segments are read as one thing, named by the label over the field or by
                // whatever the input as a whole was named
                role="group"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : ids?.label)}
                aria-describedby={describedBy}
                className={classNames(classes.root, className)}
                data-component="DateInput.SegmentGroup"
                data-index={index}
                data-focused={isActive || undefined}
                {...getStateAttributes(dateInput)}
                {...rest}
            >
                {content}
            </div>
        </DateInputSegmentGroupContext.Provider>
    );
}

DateInputSegmentGroup.displayName = "DateInput.SegmentGroup";

export default fixedForwardRef(DateInputSegmentGroup);
