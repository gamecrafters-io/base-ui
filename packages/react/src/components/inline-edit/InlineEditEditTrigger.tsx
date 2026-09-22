import * as React from "react";
import { EditRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditEditTriggerProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-edit-trigger",
};

// What starts an edit, for a reader who would rather press a button than the value itself, and
// the one way in where nothing on the preview starts an edit. It stands while the value is being
// read and is taken away while it is being edited, and it is where the reader is put back once an
// edit ends.
//
// Given nothing to say it is drawn as an icon button named by `label`, and given words it is drawn
// as an ordinary button with the icon standing before them
function InlineEditEditTrigger(
    props: InlineEditEditTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        icon = EditRegular,
        label = "Edit",
        variant = "invisible",
        size,
        disabled,
        onClick,
        ...rest
    } = props;
    const inlineEdit = React.useContext(InlineEditContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (event.defaultPrevented) {
            return;
        }

        inlineEdit.edit?.();
    };

    const shared = {
        id: inlineEdit.ids?.editTrigger,
        variant,
        size: size ?? inlineEdit.size,
        hidden: inlineEdit.editing,
        // A value that can only be read has no edit to start
        disabled: disabled ?? (inlineEdit.disabled || inlineEdit.readOnly),
        onClick: handleClick,
        className: classNames(classes.root, className),
        "data-component": "InlineEdit.EditTrigger",
        ...getStateAttributes(inlineEdit),
        ...rest,
    };

    if (React.Children.toArray(children).length > 0) {
        return (
            <Button ref={ref} leadingVisual={icon} {...shared}>
                {children}
            </Button>
        );
    }

    return <IconButton ref={ref} icon={icon ?? EditRegular} aria-label={label} {...shared} />;
}

InlineEditEditTrigger.displayName = "InlineEdit.EditTrigger";

export default fixedForwardRef(InlineEditEditTrigger);
