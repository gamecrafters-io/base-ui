import * as React from "react";
import { useId } from "../../hooks/useId";
import { viewportRanges } from "../../hooks/useResponsive";
import type {
    LayerDialogContextValue,
    LayerDialogInstance,
    LayerDialogOpenChangeGesture,
    LayerDialogProps,
} from "./LayerDialog.types";

// `matchMedia` is not there on the server, and not there in jsdom either, so every reach for it is
// guarded and the answer falls back to the narrow screen the dialog is drawn for first
const subscribeToViewport = (onStoreChange: () => void) => {
    const mediaQueryList = window?.matchMedia?.(viewportRanges.regular);
    mediaQueryList?.addEventListener("change", onStoreChange);

    return () => mediaQueryList?.removeEventListener("change", onStoreChange);
};

const getRegularViewport = () => !!window?.matchMedia?.(viewportRanges.regular)?.matches;

const getServerRegularViewport = () => false;

type UseLayerDialogProps = Omit<LayerDialogProps, "children"> & {
    // An alert asks for a decision that has to be made before anything else can happen
    alert: boolean;
};

// Everything a dialog holds and nothing that draws one: whether it is open, the ways of opening and
// closing it, and what stands in the way of a reader closing it. A dialog and an alert are both
// built on this, and differ only in what an alert refuses to be told.
//
// Every way a reader has of closing the dialog goes through `dismiss`, which is what disabling
// dismissal turns away. The caller closing it, through `open` or through the instance, goes around
// it, so that a dialog held open while its work is pending can still be closed once that work has
// finished
export const useLayerDialog = (props: UseLayerDialogProps): LayerDialogContextValue => {
    const {
        alert,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        dismissDisabled = false,
        modal = true,
        disablePointerDismissal = false,
        actionsRef,
    } = props;

    const uuid = useId();

    // Whether the screen has room to stand the dialog in the middle of it. Below that it is drawn
    // as a sheet along the bottom, which is laid out differently rather than only drawn smaller
    const regular = React.useSyncExternalStore(
        subscribeToViewport,
        getRegularViewport,
        getServerRegularViewport,
    );

    // A dialog the caller is holding the state of takes whether it is open from the prop; one that
    // is not keeps its own
    const isControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : selfOpen;

    const setOpen = (next: boolean, gesture: LayerDialogOpenChangeGesture) => {
        // Asking for what already stands is nothing to report
        if (next === open) {
            return;
        }

        if (!isControlled) {
            setSelfOpen(next);
        }

        onOpenChange?.(next, gesture);
    };

    const dismiss = (gesture: LayerDialogOpenChangeGesture) => {
        if (dismissDisabled) {
            return;
        }

        setOpen(false, gesture);
    };

    // The instance is handed out once, and closes the dialog as it stands through a ref, so a
    // caller holding on to it is never left closing a dialog as it stood some renders ago
    const latestSetOpen = React.useRef(setOpen);

    React.useEffect(() => {
        latestSetOpen.current = setOpen;
    });

    React.useImperativeHandle(
        actionsRef,
        (): LayerDialogInstance => ({
            close: () => latestSetOpen.current(false, "imperative"),
        }),
        [],
    );

    return {
        open,
        setOpen,
        dismiss,
        alert,
        // An alert holds the page whatever it is told, since nothing else is meant to happen until
        // it has been answered
        modal: alert || modal,
        dismissDisabled,
        // An alert is only ever answered from its own buttons or Escape, so a press that misses it
        // leaves it standing
        pointerDismissal: !alert && !dismissDisabled && !disablePointerDismissal,
        narrow: !regular,
        popupId: `${uuid}-popup`,
        titleId: `${uuid}-title`,
        descriptionId: `${uuid}-description`,
    };
};
