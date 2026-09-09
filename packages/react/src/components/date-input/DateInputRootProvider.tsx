import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DateInputContext, getStateAttributes } from "./DateInputContext";
import type { DateInputContextValue, DateInputRootProviderProps } from "./DateInput.types";

const classes = {
    root: "date-input",
    block: "date-input-block",
};

// The input drawn from state a hook of the caller's own is holding, for a date that has to be set
// or read from somewhere else on the page. The input itself is drawn through this, so the two are
// drawn alike.
//
// A name given to the input as a whole is not left on the root, which a screen reader reads as
// nothing in particular, but carried down to the groups of segments, which are what it reads
function DateInputRootProvider(
    props: DateInputRootProviderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        value: api,
        size = "medium",
        block,
        contrast,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    // The hook finds the segments again from the root, so it is handed the element as well as
    // whoever asked for it
    const mergedRef = useMergedRefs(ref, api.rootRef);

    const context: DateInputContextValue = {
        ...api,
        size,
        block,
        contrast,
        ariaLabel,
        ariaLabelledBy,
    };

    return (
        <DateInputContext.Provider value={context}>
            <div
                ref={mergedRef}
                id={api.ids.root}
                className={classNames(classes.root, block && classes.block, className)}
                data-component="DateInput"
                data-mode={api.mode}
                data-size={size}
                data-focused={api.focused || undefined}
                {...getStateAttributes(api)}
                {...rest}
            />
        </DateInputContext.Provider>
    );
}

DateInputRootProvider.displayName = "DateInput.RootProvider";

export default fixedForwardRef(DateInputRootProvider);
