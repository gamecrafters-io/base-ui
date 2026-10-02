import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getItemStateAttributes, TagInputContext, TagInputItemContext } from "./TagInputContext";
import TagInputItemDeleteTrigger from "./TagInputItemDeleteTrigger";
import TagInputItemInput from "./TagInputItemInput";
import TagInputItemPreview from "./TagInputItemPreview";
import TagInputItemText from "./TagInputItemText";
import type { TagInputItemProps } from "./TagInput.types";

const classes = {
    root: "tag-input-item",
};

// One tag, as it stands in the control. The tag is drawn by its preview while it is being read and
// by a field of its own while it is being edited, one of the two out of sight at a time.
//
// Given no children it draws the parts every tag is drawn from: the text and the button that takes
// the tag out, and the field it is edited in. Writing the parts out is only worth doing for a tag
// that has to be drawn some other way, with a visual before its text say
function TagInputItem(
    props: TagInputItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { index, value, disabled, children, className, ...rest } = props;
    const tagInput = React.useContext(TagInputContext);

    if (!tagInput) {
        return null;
    }

    const item = tagInput.getItemState({ index, value, disabled });

    return (
        <TagInputItemContext.Provider value={item}>
            <div
                ref={ref}
                id={item.ids.item}
                className={classNames(classes.root, className)}
                data-component="TagInput.Item"
                data-value={value}
                {...getItemStateAttributes(item)}
                {...rest}
            >
                {children ?? (
                    <>
                        <TagInputItemPreview>
                            <TagInputItemText />
                            <TagInputItemDeleteTrigger />
                        </TagInputItemPreview>
                        <TagInputItemInput />
                    </>
                )}
            </div>
        </TagInputItemContext.Provider>
    );
}

TagInputItem.displayName = "TagInput.Item";

export default fixedForwardRef(TagInputItem);
