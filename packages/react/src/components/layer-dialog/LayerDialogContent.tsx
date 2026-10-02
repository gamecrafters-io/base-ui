import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { usePresence } from "../presence";
import LayerDialogActions from "./LayerDialogActions";
import LayerDialogBody from "./LayerDialogBody";
import { LayerDialogBodySlotsContext, LayerDialogContext } from "./LayerDialogContext";
import LayerDialogDescription from "./LayerDialogDescription";
import LayerDialogPopup from "./LayerDialogPopup";
import LayerDialogTitle from "./LayerDialogTitle";
import type { LayerDialogBodySlots } from "./LayerDialogContext";
import type { LayerDialogContentProps } from "./LayerDialog.types";

// The parts the content is composed from, and nothing else
const slotTypes: unknown[] = [
    LayerDialogTitle,
    LayerDialogDescription,
    LayerDialogBody,
    LayerDialogActions,
];

// Every child of one part, and how many of them there were, so that a part given twice can be told
// apart from a part given once
const collectSlot = (children: React.ReactNode[], type: unknown) => {
    const matches = children.filter(
        (child): child is React.ReactElement => React.isValidElement(child) && child.type === type,
    );

    return { element: matches[0], count: matches.length };
};

// The dialog itself, drawn over the page while it is open and on its way off it as it closes.
//
// It is composed from exactly one title and one body, with a description and actions where they are
// wanted, each given directly rather than wrapped in anything of the caller's own. Anything else,
// or any part given twice, is a mistake worth stopping at rather than drawing: the dialog settles
// how it is closed from what it was given, and could not settle it from a composition it cannot
// read. An alert has to be given actions as well, since it is answered rather than read.
//
// It is as tall as what it holds, and no taller than the screen leaves room for. Past that, only
// the body scrolls, while the title above it and the actions below it stay where they are
function LayerDialogContent(
    props: LayerDialogContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, closeLabel = "Close", ...rest } = props;
    const { open, alert } = React.useContext(LayerDialogContext);

    // The dialog is only on the page while it is open and while it is on its way off it, so a
    // closed dialog leaves nothing behind it, and is drawn afresh the next time it opens
    const presence = usePresence({ present: open, lazyMount: true, unmountOnExit: true });

    const childArray = React.Children.toArray(children);
    const title = collectSlot(childArray, LayerDialogTitle);
    const description = collectSlot(childArray, LayerDialogDescription);
    const body = collectSlot(childArray, LayerDialogBody);
    const actions = collectSlot(childArray, LayerDialogActions);

    const hasStrayChildren = childArray.some(
        (child) => !React.isValidElement(child) || !slotTypes.includes(child.type),
    );

    if (
        hasStrayChildren ||
        title.count !== 1 ||
        body.count !== 1 ||
        description.count > 1 ||
        actions.count > 1 ||
        (alert && actions.count !== 1)
    ) {
        throw new Error(
            alert
                ? "LayerDialog.Alert requires exactly one direct LayerDialog.Title, LayerDialog.Body, and LayerDialog.Actions, with an optional direct LayerDialog.Description."
                : "LayerDialog.Content requires exactly one direct LayerDialog.Title and LayerDialog.Body, with an optional direct LayerDialog.Description and LayerDialog.Actions.",
        );
    }

    if (presence.unmounted) {
        return null;
    }

    const bodySlots: LayerDialogBodySlots = {
        title: title.element,
        description: description.element ?? null,
        actions: actions.element ?? null,
        showCloseButton: actions.count === 0,
        closeLabel,
    };

    return (
        <LayerDialogPopup ref={ref} presence={presence} actions={actions.element} {...rest}>
            <LayerDialogBodySlotsContext.Provider value={bodySlots}>
                {body.element}
            </LayerDialogBodySlotsContext.Provider>
        </LayerDialogPopup>
    );
}

LayerDialogContent.displayName = "LayerDialog.Content";

export default fixedForwardRef(LayerDialogContent);
