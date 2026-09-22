import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditCancelTriggerProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-cancel-trigger",
};

// What throws an edit away, taking the value back to where it stood as the edit started, the way
// Escape does. It stands only while the value is being edited.
//
// Given nothing to say it is drawn as an icon button named by `label`, and given words it is drawn
// as an ordinary button with the icon standing before them
function InlineEditCancelTrigger(
    props: InlineEditCancelTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        icon = DismissRegular,
        label = "Cancel",
        variant = "default",
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

        inlineEdit.cancel?.();
    };

    const shared = {
        id: inlineEdit.ids?.cancelTrigger,
        variant,
        size: size ?? inlineEdit.size,
        hidden: !inlineEdit.editing,
        disabled: disabled ?? inlineEdit.disabled,
        onClick: handleClick,
        className: classNames(classes.root, className),
        "data-component": "InlineEdit.CancelTrigger",
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

    return <IconButton ref={ref} icon={icon ?? DismissRegular} aria-label={label} {...shared} />;
}

InlineEditCancelTrigger.displayName = "InlineEdit.CancelTrigger";

export default fixedForwardRef(InlineEditCancelTrigger);
