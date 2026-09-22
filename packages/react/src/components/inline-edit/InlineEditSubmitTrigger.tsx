import * as React from "react";
import { CheckmarkRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditSubmitTriggerProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-submit-trigger",
};

// What keeps an edit, whatever the submit mode says of Enter and of leaving the field, and so the
// one way of keeping an edit where it says neither does. It stands only while the value is being
// edited.
//
// Given nothing to say it is drawn as an icon button named by `label`, and given words it is drawn
// as an ordinary button with the icon standing before them
function InlineEditSubmitTrigger(
    props: InlineEditSubmitTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        icon = CheckmarkRegular,
        label = "Save",
        variant = "primary",
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

        inlineEdit.submit?.();
    };

    const shared = {
        id: inlineEdit.ids?.submitTrigger,
        variant,
        size: size ?? inlineEdit.size,
        hidden: !inlineEdit.editing,
        disabled: disabled ?? inlineEdit.disabled,
        onClick: handleClick,
        className: classNames(classes.root, className),
        "data-component": "InlineEdit.SubmitTrigger",
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

    return <IconButton ref={ref} icon={icon ?? CheckmarkRegular} aria-label={label} {...shared} />;
}

InlineEditSubmitTrigger.displayName = "InlineEdit.SubmitTrigger";

export default fixedForwardRef(InlineEditSubmitTrigger);
