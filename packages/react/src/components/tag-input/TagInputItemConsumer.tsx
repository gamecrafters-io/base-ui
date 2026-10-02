import * as React from "react";
import { TagInputItemContext } from "./TagInputContext";
import type { TagInputItemConsumerProps } from "./TagInput.types";

// The tag an item stands for, handed to the caller to draw from: a tag drawn one way while it is
// read and another while it is edited, say
function TagInputItemConsumer({ children }: TagInputItemConsumerProps) {
    const item = React.useContext(TagInputItemContext);

    return item ? <>{children(item)}</> : null;
}

TagInputItemConsumer.displayName = "TagInput.ItemContext";

export default TagInputItemConsumer;
