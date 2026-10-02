import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { LayerCard } from "../layer-card";
import { ScrollableRegion } from "../scrollable-region";
import { LayerDialogBodySlotsContext, LayerDialogContext } from "./LayerDialogContext";
import type { LayerDialogBodyProps } from "./LayerDialog.types";

const classes = {
    root: "layer-dialog-body",
    header: "layer-dialog-header",
    heading: "layer-dialog-heading",
    descriptionFrame: "layer-dialog-description-frame",
    descriptionClip: "layer-dialog-description-clip",
    closeButton: "layer-dialog-close-button",
    scroll: "layer-dialog-scroll",
    content: "layer-dialog-content",
    footer: "layer-dialog-body-footer",
};

// How far the body has to be scrolled before the description folds away under the title
const SCROLL_THRESHOLD = 8;

// How much the body has to be left to scroll once the description has folded away (see
// handleScroll)
const CONDENSE_MIN_OVERFLOW = 16;

// How far the body has been scrolled from either end, which is what the fade at each edge is drawn
// from. It is written straight onto the element rather than held as state, so that scrolling draws
// nothing again but the fade
const updateScrollEdges = (element: HTMLElement) => {
    const start = element.scrollTop;
    const end = element.scrollHeight - element.clientHeight - element.scrollTop;

    element.style.setProperty("--layer-dialog-scroll-start", `${Math.max(0, start)}px`);
    element.style.setProperty("--layer-dialog-scroll-end", `${Math.max(0, end)}px`);
};

// The surface the dialog is read on: the primary layer, standing on the recessed one the dialog is
// drawn as. The title and the description are written beside it but drawn at the top of it, in a
// frame that stays put while what is beneath it scrolls, and the edges of what scrolls fade to say
// that there is more past them.
//
// Without a description of its own, what the body holds is what describes the dialog, so that a
// screen reader still reads out what an alert is warning of
function LayerDialogBody(
    props: LayerDialogBodyProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, className } = props;
    const { titleId, descriptionId, narrow, dismissDisabled, dismiss } =
        React.useContext(LayerDialogContext);
    const { title, description, actions, showCloseButton, closeLabel } = React.useContext(
        LayerDialogBodySlotsContext,
    );

    const [condensed, setCondensed] = React.useState(false);
    const descriptionClipRef = React.useRef<HTMLDivElement>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // What there is to scroll changes with what the body holds and with the room it is given, as
    // well as with scrolling, so the fades are drawn again whenever either is resized
    React.useEffect(() => {
        const scroll = scrollRef.current;

        if (!scroll) {
            return;
        }

        updateScrollEdges(scroll);

        const observer = new ResizeObserver(() => updateScrollEdges(scroll));

        observer.observe(scroll);

        if (contentRef.current) {
            observer.observe(contentRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

        updateScrollEdges(event.currentTarget);

        if (scrollTop <= SCROLL_THRESHOLD) {
            setCondensed(false);
            return;
        }

        if (condensed) {
            return;
        }

        // Folding the description away hands its height to the body, which shortens how far the
        // body can scroll. Where what it holds only just runs past the end, that would pull the
        // body back under the threshold and unfold the description again, over and over, so it is
        // only folded where enough is left to scroll once it has gone. A scroll is only reported
        // once the page has been laid out, so the height is there to be read for nothing
        const descriptionHeight = descriptionClipRef.current?.offsetHeight ?? 0;
        const overflowAfterCollapse = scrollHeight - clientHeight - descriptionHeight;

        if (overflowAfterCollapse > CONDENSE_MIN_OVERFLOW) {
            setCondensed(true);
        }
    };

    return (
        <LayerCard.Primary
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="LayerDialog.Body"
        >
            {/* The frame is somewhere to take hold of a sheet and swipe it away, as the handle
                above it is */}
            <div className={classes.header} data-component="LayerDialog.Header" data-swipe-area="">
                <div className={classes.heading}>
                    {title}
                    {description ? (
                        // A row of a grid folds to nothing where a height of its own could not,
                        // since the description's height is whatever its words come to. It stays
                        // on the page while it is folded, so the dialog is still described by it
                        <div
                            className={classes.descriptionFrame}
                            data-condensed={condensed || undefined}
                        >
                            <div ref={descriptionClipRef} className={classes.descriptionClip}>
                                {description}
                            </div>
                        </div>
                    ) : null}
                </div>
                {showCloseButton ? (
                    <IconButton
                        icon={DismissRegular}
                        aria-label={closeLabel}
                        variant="invisible"
                        size="small"
                        disabled={dismissDisabled}
                        onClick={() => dismiss("close-button")}
                        className={classes.closeButton}
                        data-component="LayerDialog.CloseButton"
                    />
                ) : null}
            </div>
            <ScrollableRegion
                ref={scrollRef}
                aria-labelledby={titleId}
                className={classes.scroll}
                onScroll={handleScroll}
            >
                <div
                    ref={contentRef}
                    id={description ? undefined : descriptionId}
                    className={classes.content}
                    data-component="LayerDialog.BodyContent"
                >
                    {children}
                </div>
            </ScrollableRegion>
            {/* A sheet keeps its actions in the body, beneath what scrolls, so they stay within
                reach of a thumb however far the body has been scrolled */}
            {narrow && actions ? (
                <div className={classes.footer} data-component="LayerDialog.Footer">
                    {actions}
                </div>
            ) : null}
        </LayerCard.Primary>
    );
}

LayerDialogBody.displayName = "LayerDialog.Body";

export default fixedForwardRef(LayerDialogBody);
