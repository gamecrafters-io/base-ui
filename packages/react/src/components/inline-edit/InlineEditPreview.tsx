import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, InlineEditContext } from "./InlineEditContext";
import type { InlineEditPreviewProps } from "./InlineEdit.types";

const classes = {
    root: "inline-edit-preview",
};

// The value as it is read: the text itself, or what stands in for it while there is none. It
// stands out of sight while the value is being edited, and is set exactly as the field is, so the
// one takes the other's place without anything around them moving.
//
// Wherever something can start an edit from it, it is a button: a reader on the keyboard reaches
// it in the tab order and starts the edit with Enter or Space, whichever way the pointer starts
// one. It is named by the label over the inline edit and then by the value, so a reader is told
// what they would be editing and what it holds now. A preview nothing can start an edit from is
// only the value, and is read as text
function InlineEditPreview<As extends React.ElementType = "span">(
    props: InlineEditPreviewProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        children,
        onFocus,
        onClick,
        onDoubleClick,
        onKeyDown,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props as InlineEditPreviewProps<"span">;
    const inlineEdit = React.useContext(InlineEditContext);
    const {
        ids,
        valueText,
        empty,
        size = "medium",
        activationMode = "focus",
        editing = false,
        autoResize = false,
        disabled = false,
        readOnly = false,
        describedBy,
    } = inlineEdit;

    const isTrigger = activationMode !== "none" && !readOnly;

    const handleFocus = (event: React.FocusEvent<HTMLSpanElement>) => {
        onFocus?.(event);

        // A caller that has answered the arrival itself is left to it
        if (!event.defaultPrevented) {
            inlineEdit.handlePreviewFocus?.();
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
            inlineEdit.handlePreviewClick?.();
        }
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        onDoubleClick?.(event);

        if (!event.defaultPrevented) {
            inlineEdit.handlePreviewDoubleClick?.();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        onKeyDown?.(event);
        inlineEdit.handlePreviewKeyDown?.(event);
    };

    return (
        <Component
            ref={ref}
            id={ids?.preview}
            role={isTrigger ? "button" : undefined}
            // A disabled preview is still read as a button, one that cannot be pressed, and is
            // taken out of the tab order the way a disabled button is
            tabIndex={isTrigger && !disabled ? 0 : undefined}
            aria-disabled={isTrigger && disabled ? true : undefined}
            aria-label={ariaLabel}
            // A name the caller gave the preview stands in place of the one it is given here
            aria-labelledby={
                ariaLabelledBy ??
                (isTrigger && ariaLabel === undefined && ids
                    ? `${ids.label} ${ids.preview}`
                    : undefined)
            }
            aria-describedby={isTrigger ? describedBy : undefined}
            // A preview grown with the value stays in its place while the field is typed into, so
            // that it goes on measuring the room the value takes
            hidden={autoResize ? undefined : editing}
            className={classNames(classes.root, className)}
            onFocus={handleFocus}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onKeyDown={handleKeyDown}
            data-component="InlineEdit.Preview"
            data-size={size}
            data-activation-mode={activationMode}
            data-autoresize={autoResize || undefined}
            data-placeholder-shown={empty || undefined}
            {...getStateAttributes(inlineEdit)}
            {...rest}
        >
            {children ?? valueText}
        </Component>
    );
}

InlineEditPreview.displayName = "InlineEdit.Preview";

export default fixedForwardRef(InlineEditPreview);
