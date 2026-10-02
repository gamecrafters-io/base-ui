import * as React from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useScrollLock } from "../../hooks/useScrollLock";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { LayerCard } from "../layer-card";
import { Portal, PortalContext } from "../portal";
import { LayerDialogContext } from "./LayerDialogContext";
import type { UsePresenceReturn } from "../presence";
import type {
    LayerDialogContentProps,
    LayerDialogSize,
    LayerDialogVerticalAlign,
} from "./LayerDialog.types";

const classes = {
    // The backdrop fades in and out alongside the dialog, taking the dialog's time to do it
    backdrop:
        "layer-dialog-backdrop motion-safe:data-[state=open]:animate-in motion-safe:data-[state=open]:fade-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out max-medium:duration-medium medium:duration-short",
    backdropModeless: "layer-dialog-backdrop-modeless",
    viewport: "layer-dialog-viewport",
    viewportModeless: "layer-dialog-viewport-modeless",
    verticalAlign: {
        top: "layer-dialog-viewport-align-top",
        center: "layer-dialog-viewport-align-center",
    } satisfies Record<LayerDialogVerticalAlign, string>,
    // A sheet rises out of the bottom of a narrow screen and drops back into it. A dialog with
    // room around it fades in a short way up and fades out the same way down
    root: "layer-dialog motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out ease-enter data-[state=closed]:ease-exit max-medium:duration-medium max-medium:motion-safe:data-[state=open]:slide-in-from-bottom max-medium:motion-safe:data-[state=closed]:slide-out-to-bottom medium:duration-short medium:motion-safe:data-[state=open]:fade-in medium:motion-safe:data-[state=open]:slide-in-from-bottom-2 medium:motion-safe:data-[state=closed]:fade-out medium:motion-safe:data-[state=closed]:slide-out-to-bottom-2",
    size: {
        small: "layer-dialog-size-small",
        medium: "layer-dialog-size-medium",
        large: "layer-dialog-size-large",
        xlarge: "layer-dialog-size-xlarge",
    } satisfies Record<LayerDialogSize, string>,
    card: "layer-dialog-card",
    handle: "layer-dialog-handle",
};

const PORTAL_SELECTOR = "[data-component='Portal']";

// What a press has to begin on to take hold of a sheet: the handle, or the frame the title stands
// in. What the body holds scrolls under the reader's finger, so it is left to do that
const SWIPE_AREA_SELECTOR = "[data-swipe-area]";

// What a press within the swipe area still belongs to rather than to the sheet: the X, say
const INTERACTIVE_SELECTOR = [
    "a[href]",
    "button",
    "input",
    "select",
    "textarea",
    "summary",
    "[contenteditable]:not([contenteditable='false'])",
].join(", ");

// How far down the sheet has to be pulled before letting go of it closes it, as a share of its
// height
const SWIPE_DISMISS_RATIO = 0.25;

// How fast a flick has to be moving as it is let go of, in pixels a millisecond, to close the sheet
// however short it was
const SWIPE_DISMISS_VELOCITY = 0.5;

// How far a flick has to have gone to be one, rather than a press that wavered
const SWIPE_MIN_DISTANCE = 8;

// How long a finger can rest before it is lifted and still be read as flicking, in milliseconds.
// One that stopped for longer was setting the sheet down, however fast it was moving beforehand
const SWIPE_FLICK_TIMEOUT = 100;

// Where a swipe began and where it was last seen. How fast it is moving is worked out from the
// last two places, so that a flick is read by how it ends rather than by how it began
type Swipe = {
    startY: number;
    // How tall the sheet was as it was taken hold of, which is what how far it has been pulled is
    // measured against
    height: number;
    lastY: number;
    lastTime: number;
    velocity: number;
};

// How far the sheet has been pulled, and how much of its height that comes to
type SwipeOffset = {
    offset: number;
    progress: number;
};

const NO_SWIPE: SwipeOffset = { offset: 0, progress: 0 };

// Whether a node stands in a layer opened over the dialog: a menu brought out from its action,
// say. Each layer is drawn into a portal of its own, and one opened later is drawn after this one,
// so a key pressed or a press begun within it is left to that layer to answer
const isInLayerAbove = (popup: HTMLElement | null, node: unknown) => {
    if (!popup || !(node instanceof Element)) {
        return false;
    }

    const ownPortal = popup.closest(PORTAL_SELECTOR);
    const nodePortal = node.closest(PORTAL_SELECTOR);

    if (!ownPortal || !nodePortal || nodePortal === ownPortal) {
        return false;
    }

    return Boolean(
        ownPortal.compareDocumentPosition(nodePortal) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
};

type LayerDialogPopupProps = Omit<LayerDialogContentProps, "children" | "closeLabel"> & {
    // Where the dialog stands on its way on to the page and off it again
    presence: UsePresenceReturn;
    // The actions, which stand on the layer behind the body where the screen has room
    actions?: React.ReactNode;
    // The body, which the dialog stands on its recessed layer
    children: React.ReactNode;
};

// The dialog as it is drawn: the backdrop, the layer the dialog is laid out in, and the dialog
// itself. It is only on the page while the dialog is open and while it is on its way off it, so
// that everything it does to the page — holding focus, holding the page still, answering Escape —
// is done for as long as it is there and in the order the dialogs were opened
function LayerDialogPopup(
    props: LayerDialogPopupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        presence,
        actions,
        children,
        size = "medium",
        verticalAlign = "center",
        portalContainerName: portalContainerNameProp,
        initialFocusRef,
        returnFocusRef,
        className,
    } = props;

    const {
        open,
        dismiss,
        alert,
        modal,
        dismissDisabled,
        pointerDismissal,
        narrow,
        popupId,
        titleId,
        descriptionId,
    } = React.useContext(LayerDialogContext);

    // Whatever is opened from inside the dialog is drawn into the portal root the dialog is, so a
    // dialog kept within a subtree of its own keeps its menus there with it
    const { portalContainerName: inheritedPortalContainerName } = React.useContext(PortalContext);
    const portalContainerName = portalContainerNameProp ?? inheritedPortalContainerName;
    const portalContext = React.useMemo(() => ({ portalContainerName }), [portalContainerName]);

    const popupRef = React.useRef<HTMLDivElement>(null);
    const presenceRef = useMergedRefs(presence.ref, popupRef);
    const mergedRef = useMergedRefs(ref, presenceRef);

    // Focus is handed back as the dialog starts to close rather than once it has gone, so it is
    // never left behind in a dialog that is on its way off the page
    useFocusTrap({
        containerRef: popupRef,
        initialFocusRef,
        returnFocusRef,
        disabled: !open || !modal,
    });

    useScrollLock(!modal);

    useOnEscapePress((event) => {
        if (!open || isInLayerAbove(popupRef.current, event.target)) {
            return;
        }

        // Taking the event keeps a layer this dialog was opened from standing. It is taken whether
        // or not the dialog can be closed just now, since the key was meant for this dialog either
        // way. A modeless dialog leaves it alone, since whatever is behind it is still being used
        if (modal) {
            event.preventDefault();
        }

        dismiss("escape");
    });

    // Whether the press now ending began on the page around the dialog as well, so that a
    // selection dragged out of the dialog and let go of outside it does not close it. A press
    // begun while a layer above the dialog holds focus is that layer's to answer
    const pressStartedOutside = React.useRef(false);

    const handleViewportMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        pressStartedOutside.current =
            event.target === event.currentTarget &&
            !isInLayerAbove(popupRef.current, document.activeElement);
    };

    const handleViewportClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const startedOutside = pressStartedOutside.current;

        pressStartedOutside.current = false;

        if (open && pointerDismissal && startedOutside && event.target === event.currentTarget) {
            dismiss("click-outside");
        }
    };

    /* Swiping a sheet away */

    const swipeRef = React.useRef<Swipe | null>(null);
    const [swiping, setSwiping] = React.useState(false);
    const [swipe, setSwipe] = React.useState(NO_SWIPE);

    // Only a sheet is swiped, and never one asking for a decision or one that cannot be closed by
    // the reader just now
    const swipeable = open && narrow && !alert && !dismissDisabled;

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const { target } = event;

        if (
            !swipeable ||
            event.button !== 0 ||
            !(target instanceof Element) ||
            !target.closest(SWIPE_AREA_SELECTOR) ||
            target.closest(INTERACTIVE_SELECTOR)
        ) {
            return;
        }

        // Stops the press being read as the start of a selection, which would drag the title's
        // words about rather than the sheet
        event.preventDefault();

        swipeRef.current = {
            startY: event.clientY,
            height: popupRef.current?.offsetHeight ?? 0,
            lastY: event.clientY,
            lastTime: event.timeStamp,
            velocity: 0,
        };

        setSwipe(NO_SWIPE);
        setSwiping(true);
    };

    // The swipe is followed on the window rather than on the sheet, so a finger that runs off the
    // sheet keeps hold of it
    React.useEffect(() => {
        if (!swiping) {
            return;
        }

        const handleMove = (event: PointerEvent) => {
            const active = swipeRef.current;

            if (!active) {
                return;
            }

            const elapsed = event.timeStamp - active.lastTime;

            if (elapsed > 0) {
                active.velocity = (event.clientY - active.lastY) / elapsed;
            }

            active.lastY = event.clientY;
            active.lastTime = event.timeStamp;

            // The sheet only follows the finger down, since there is nothing above it to be
            // pulled up into
            const offset = Math.max(0, event.clientY - active.startY);

            setSwipe({
                offset,
                progress: active.height ? Math.min(1, offset / active.height) : 0,
            });
        };

        const handleEnd = (event: PointerEvent) => {
            const active = swipeRef.current;

            swipeRef.current = null;
            setSwiping(false);

            if (!active) {
                return;
            }

            const offset = Math.max(0, event.clientY - active.startY);
            const flicked =
                event.timeStamp - active.lastTime <= SWIPE_FLICK_TIMEOUT &&
                active.velocity > SWIPE_DISMISS_VELOCITY &&
                offset > SWIPE_MIN_DISTANCE;

            if (offset > active.height * SWIPE_DISMISS_RATIO || flicked) {
                dismiss("swipe");
            }
        };

        const handleCancel = () => {
            swipeRef.current = null;
            setSwiping(false);
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleEnd);
        window.addEventListener("pointercancel", handleCancel);

        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleEnd);
            window.removeEventListener("pointercancel", handleCancel);
        };
        // Deliberately without a dependency list: the handlers read the dialog as it stands, so a
        // swipe let go of reads whether it can still close the dialog at that moment. Nothing is
        // listened for until a swipe is under way, so a render outside one costs the early return
    });

    // The sheet follows the finger for as long as it is held. Let go of, it settles back into place
    // while the dialog stays open, and is left where it was while the dialog closes, so that it
    // carries on from there on its way out rather than jumping back first
    const settled = open && !swiping;
    const swipeOffset = settled ? 0 : swipe.offset;
    const swipeProgress = settled ? 0 : swipe.progress;

    const presenceAttributes = presence.getPresenceProps();

    return (
        <PortalContext.Provider value={portalContext}>
            <Portal containerName={portalContainerName}>
                <div
                    className={classNames(classes.backdrop, !modal && classes.backdropModeless)}
                    // The page shows through the backdrop as the sheet is pulled away from it
                    style={swipeProgress ? { opacity: 1 - swipeProgress } : undefined}
                    data-component="LayerDialog.Backdrop"
                    data-state={presenceAttributes["data-state"]}
                />
                <div
                    className={classNames(
                        classes.viewport,
                        classes.verticalAlign[verticalAlign],
                        !modal && classes.viewportModeless,
                    )}
                    onMouseDown={handleViewportMouseDown}
                    onClick={handleViewportClick}
                    data-component="LayerDialog.Viewport"
                >
                    <div
                        ref={mergedRef}
                        id={popupId}
                        role={alert ? "alertdialog" : "dialog"}
                        aria-modal={modal || undefined}
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        // Focus has somewhere to land where nothing inside the dialog can take it,
                        // without adding a stop of its own to the page
                        tabIndex={-1}
                        className={classNames(classes.root, classes.size[size], className)}
                        style={
                            swipeOffset
                                ? ({
                                      "--layer-dialog-swipe-offset": `${swipeOffset}px`,
                                  } as React.CSSProperties)
                                : undefined
                        }
                        onPointerDown={handlePointerDown}
                        data-component="LayerDialog.Content"
                        data-size={size}
                        data-vertical-align={verticalAlign}
                        data-modal={modal}
                        data-alert={alert ? "" : undefined}
                        data-narrow={narrow ? "" : undefined}
                        data-swipeable={swipeable ? "" : undefined}
                        data-swiping={swiping ? "" : undefined}
                        {...presenceAttributes}
                    >
                        <LayerCard className={classes.card}>
                            {/* What a sheet is pulled down by. An alert is not swiped away, so it
                                is given nothing to take hold of */}
                            {narrow && !alert ? (
                                <div
                                    aria-hidden="true"
                                    className={classes.handle}
                                    data-component="LayerDialog.Handle"
                                    data-swipe-area=""
                                />
                            ) : null}
                            {children}
                            {narrow ? null : actions}
                        </LayerCard>
                    </div>
                </div>
            </Portal>
        </PortalContext.Provider>
    );
}

LayerDialogPopup.displayName = "LayerDialog.Popup";

export default fixedForwardRef(LayerDialogPopup);
