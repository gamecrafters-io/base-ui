import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditContextValue, InlineEditRootProviderProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit",
    block: "inline-edit-block",
};

// The inline edit drawn from state a hook of the caller's own is holding, for a value that has to
// be edited, kept or thrown away from somewhere else on the page as well. The inline edit itself
// is drawn through this, so the two are drawn alike.
//
// The root is what the reader is taken to be inside while they edit: a press or a move of focus
// anywhere within it, onto a trigger or the name over the value, is not leaving the edit
function InlineEditRootProvider(
    props: InlineEditRootProviderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, value: api, size = "medium", block, contrast, ...rest } = props;

    // The hook reads presses and focus against the root, so it is handed the element as well as
    // whoever asked for it
    const mergedRef = useMergedRefs(ref, api.rootRef);

    const context: InlineEditContextValue = {
        ...api,
        size,
        block,
        contrast,
    };

    return (
        <InlineEditContext.Provider value={context}>
            <div
                ref={mergedRef}
                id={api.ids.root}
                className={classNames(classes.root, block && classes.block, className)}
                data-component="InlineEdit"
                data-size={size}
                {...getStateAttributes(api)}
                {...rest}
            />
        </InlineEditContext.Provider>
    );
}

InlineEditRootProvider.displayName = "InlineEdit.RootProvider";

export default fixedForwardRef(InlineEditRootProvider);
