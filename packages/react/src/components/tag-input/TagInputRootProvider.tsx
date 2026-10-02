import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, TagInputContext } from "./TagInputContext";
import type { TagInputContextValue, TagInputRootProviderProps } from "./TagInput.types";

const classes = {
    root: "tag-input",
    block: "tag-input-block",
    liveRegion: "sr-only",
};

// The tag input drawn from state a hook of the caller's own is holding, for tags that have to be
// added or taken out from somewhere else on the page as well. The tag input itself is drawn through
// this, so the two are drawn alike.
//
// The root is what the reader is taken to be inside while they are in the tag input: a press or a
// move of focus anywhere within it, onto a tag or the name over the field, is not leaving it. It
// also carries what the tag input says to a screen reader as tags come and go, since nothing else
// on the page says so to a reader who cannot see the tags change
function TagInputRootProvider(
    props: TagInputRootProviderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        value: api,
        size = "medium",
        block,
        contrast,
        children,
        onFocus,
        ...rest
    } = props;

    // The hook reads presses and focus against the root, so it is handed the element as well as
    // whoever asked for it
    const mergedRef = useMergedRefs(ref, api.rootRef);

    const context: TagInputContextValue = {
        ...api,
        size,
        block,
        contrast,
    };

    const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
        onFocus?.(event);
        api.handleRootFocus();
    };

    return (
        <TagInputContext.Provider value={context}>
            <div
                ref={mergedRef}
                id={api.ids.root}
                className={classNames(classes.root, block && classes.block, className)}
                onFocus={handleFocus}
                data-component="TagInput"
                data-size={size}
                {...getStateAttributes(api)}
                {...rest}
            >
                {children}
                {/* Keyed by how many times it has spoken, so that the same words said twice over
                    are put on the page afresh and heard again */}
                <span
                    aria-live="assertive"
                    aria-atomic="true"
                    className={classes.liveRegion}
                    data-component="TagInput.LiveRegion"
                >
                    <span key={api.announcement.count}>{api.announcement.message}</span>
                </span>
            </div>
        </TagInputContext.Provider>
    );
}

TagInputRootProvider.displayName = "TagInput.RootProvider";

export default fixedForwardRef(TagInputRootProvider);
