import * as React from "react";
import { TagInputContext } from "./TagInputContext";
import type { TagInputConsumerProps } from "./TagInput.types";

// The tag input as it stands, handed to the caller to draw from. It is what the items of a tag
// input that keeps hold of its tags itself are drawn with, since the tags are only known inside it.
// It is named a consumer rather than a context, since the context is the object it reads
function TagInputConsumer({ children }: TagInputConsumerProps) {
    const tagInput = React.useContext(TagInputContext);

    return tagInput ? <>{children(tagInput)}</> : null;
}

TagInputConsumer.displayName = "TagInput.Context";

export default TagInputConsumer;
