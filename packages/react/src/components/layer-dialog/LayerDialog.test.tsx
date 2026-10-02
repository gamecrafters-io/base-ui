import * as React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ActionList } from "../action-list";
import { Button } from "../button";
import { PortalContext, registerPortalRoot } from "../portal";
import { LayerDialog, useLayerDialogContext } from ".";
import type {
    LayerDialogContentProps,
    LayerDialogInstance,
    LayerDialogProps,
} from "./LayerDialog.types";

const originalResizeObserver = window.ResizeObserver;
const originalPointerEvent = window.PointerEvent;

type FixtureProps = LayerDialogProps & {
    alert?: boolean;
    description?: boolean;
    actions?: boolean;
    content?: Partial<LayerDialogContentProps>;
};

// A dialog opened from a trigger, with a title and a body, and whichever of the parts that can be
// left out a test asks for
const Fixture = ({ alert, description, actions, content, ...props }: FixtureProps) => {
    const Root = alert ? LayerDialog.Alert : LayerDialog;

    return (
        <Root {...props}>
            <LayerDialog.Trigger>Open settings</LayerDialog.Trigger>
            <LayerDialog.Content {...content}>
                <LayerDialog.Title>Configure hostname</LayerDialog.Title>
                {description ? (
                    <LayerDialog.Description>
                        Route requests to your service.
                    </LayerDialog.Description>
                ) : null}
                <LayerDialog.Body>The hostname requests are routed from.</LayerDialog.Body>
                {actions ? (
                    <LayerDialog.Actions>
                        <LayerDialog.Action>Save hostname</LayerDialog.Action>
                    </LayerDialog.Actions>
                ) : null}
            </LayerDialog.Content>
        </Root>
    );
};

const dialog = () => screen.getByRole("dialog");

const queryDialog = () => screen.queryByRole("dialog");

const button = (name: string) => screen.getByRole("button", { name });

const part = (name: string) =>
    document.querySelector<HTMLElement>(`[data-component='LayerDialog.${name}']`);

const scrollRegion = () =>
    part("Body")?.querySelector<HTMLElement>("[data-component='ScrollableRegion']") as HTMLElement;

// Presses the page around the dialog, from the press going down to the click it ends in
const pressOutside = () => {
    const viewport = part("Viewport") as HTMLElement;

    fireEvent.mouseDown(viewport);
    fireEvent.click(viewport);
};

// Takes hold of whatever is given and pulls it down by as far as it is told, over as long as it is
// told to take, then lets go. jsdom stamps an event with the time it was made, so the clock is held
// still at either end of the pull, and a pull taken slowly enough is not read as a flick
const swipe = (from: Element, distance: number, duration = 1000) => {
    const now = vi.spyOn(Date, "now").mockReturnValue(0);

    fireEvent.pointerDown(from, { clientX: 0, clientY: 0, button: 0 });
    now.mockReturnValue(duration);
    fireEvent.pointerMove(window, { clientX: 0, clientY: distance });
    fireEvent.pointerUp(window, { clientX: 0, clientY: distance });

    now.mockRestore();
};

// jsdom lays nothing out, so the sheet is given a height to measure how far it was pulled against
const giveHeight = (element: HTMLElement, height: number) => {
    Object.defineProperty(element, "offsetHeight", { configurable: true, value: height });
};

// The screen is narrow wherever there is no `matchMedia` to ask, as there is not in jsdom, so a
// test of the dialog a wider screen draws puts one in place that says the screen is wide
const widenScreen = () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    }));
};

describe("LayerDialog", () => {
    // jsdom has no ResizeObserver, and the body watches its own size to say whether there is more
    // to be read past either end of it. It has no PointerEvent either, and the plain event it falls
    // back on carries none of the readings a swipe is measured by
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
        window.PointerEvent = window.MouseEvent as unknown as typeof window.PointerEvent;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
        window.PointerEvent = originalPointerEvent;
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("is put together from its parts", () => {
        expect(LayerDialog.Root).toBe(LayerDialog);

        for (const name of [
            "Alert",
            "Trigger",
            "Content",
            "Title",
            "Description",
            "Body",
            "Actions",
            "Action",
        ] as const) {
            expect(LayerDialog[name]).toBeDefined();
        }
    });

    it("draws nothing but its trigger while it is closed", () => {
        render(<Fixture />);

        expect(button("Open settings")).toBeInTheDocument();
        expect(queryDialog()).not.toBeInTheDocument();
        expect(part("Backdrop")).not.toBeInTheDocument();
    });

    it("opens from its trigger", () => {
        const onOpenChange = vi.fn();
        render(<Fixture onOpenChange={onOpenChange} />);

        fireEvent.click(button("Open settings"));

        expect(dialog()).toBeInTheDocument();
        expect(onOpenChange).toHaveBeenCalledWith(true, "trigger-press");
    });

    it("says that its trigger opens a dialog, and which one once it is open", () => {
        render(<Fixture />);

        const trigger = button("Open settings");

        expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
        expect(trigger).toHaveAttribute("aria-expanded", "false");
        expect(trigger).not.toHaveAttribute("aria-controls");

        fireEvent.click(trigger);

        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(trigger).toHaveAttribute("aria-controls", dialog().id);
    });

    it("leaves a press its trigger's caller has answered alone", () => {
        render(
            <LayerDialog>
                <LayerDialog.Trigger onClick={(event) => event.preventDefault()}>
                    Open settings
                </LayerDialog.Trigger>
                <LayerDialog.Content>
                    <LayerDialog.Title>Configure hostname</LayerDialog.Title>
                    <LayerDialog.Body>Body</LayerDialog.Body>
                </LayerDialog.Content>
            </LayerDialog>,
        );

        fireEvent.click(button("Open settings"));

        expect(queryDialog()).not.toBeInTheDocument();
    });

    it("draws its trigger as a button of the caller's choosing", () => {
        render(
            <LayerDialog>
                <LayerDialog.Trigger variant="danger">Delete Worker</LayerDialog.Trigger>
                <LayerDialog.Content>
                    <LayerDialog.Title>Delete Worker</LayerDialog.Title>
                    <LayerDialog.Body>Body</LayerDialog.Body>
                </LayerDialog.Content>
            </LayerDialog>,
        );

        expect(button("Delete Worker")).toHaveAttribute("data-variant", "danger");
        expect(button("Delete Worker")).toHaveAttribute("data-component", "LayerDialog.Trigger");
    });

    it("renders outside the tree it was written in", () => {
        const { container } = render(<Fixture defaultOpen />);

        expect(container).not.toContainElement(dialog());
        expect(document.body).toContainElement(dialog());
    });

    it("names itself from its title and describes itself from its description", () => {
        render(<Fixture defaultOpen description />);

        const title = screen.getByRole("heading", { name: "Configure hostname" });
        const description = screen.getByText("Route requests to your service.");

        expect(dialog()).toHaveAttribute("aria-labelledby", title.id);
        expect(dialog()).toHaveAttribute("aria-describedby", description.id);
        expect(dialog()).toHaveAccessibleName("Configure hostname");
        expect(dialog()).toHaveAccessibleDescription("Route requests to your service.");
    });

    it("describes itself from its body where it has no description", () => {
        render(<Fixture defaultOpen />);

        expect(part("BodyContent")).toHaveAttribute(
            "id",
            dialog().getAttribute("aria-describedby"),
        );
        expect(dialog()).toHaveAccessibleDescription("The hostname requests are routed from.");
    });

    it("draws the title and the description in the frame above what scrolls", () => {
        render(<Fixture defaultOpen description />);

        const header = part("Header");

        expect(header).toContainElement(
            screen.getByRole("heading", { name: "Configure hostname" }),
        );
        expect(header).toContainElement(screen.getByText("Route requests to your service."));
        expect(scrollRegion()).not.toContainElement(
            screen.getByText("Route requests to your service."),
        );
        expect(scrollRegion()).toContainElement(part("BodyContent"));
    });

    it("draws the body as the primary layer of a layered card", () => {
        render(<Fixture defaultOpen />);

        const body = part("Body") as HTMLElement;

        expect(body).toHaveClass("layer-card-primary", "layer-dialog-body");
        expect(body.parentElement).toHaveClass("layer-dialog-card");
    });

    it("tags each of its parts with a data-component attribute", () => {
        render(<Fixture defaultOpen description actions />);

        for (const name of [
            "Backdrop",
            "Viewport",
            "Content",
            "Title",
            "Description",
            "Body",
            "Header",
            "BodyContent",
            "Actions",
            "DismissButton",
            "Action",
        ]) {
            expect(part(name)).toBeInTheDocument();
        }
    });

    it("forwards refs to the elements its parts render", () => {
        const triggerRef = React.createRef<HTMLButtonElement>();
        const contentRef = React.createRef<HTMLDivElement>();
        const titleRef = React.createRef<HTMLHeadingElement>();
        const descriptionRef = React.createRef<HTMLParagraphElement>();
        const bodyRef = React.createRef<HTMLDivElement>();
        const actionsRef = React.createRef<HTMLDivElement>();
        const actionRef = React.createRef<HTMLButtonElement>();

        render(
            <LayerDialog defaultOpen>
                <LayerDialog.Trigger ref={triggerRef}>Open settings</LayerDialog.Trigger>
                <LayerDialog.Content ref={contentRef}>
                    <LayerDialog.Title ref={titleRef}>Configure hostname</LayerDialog.Title>
                    <LayerDialog.Description ref={descriptionRef}>
                        Route requests to your service.
                    </LayerDialog.Description>
                    <LayerDialog.Body ref={bodyRef}>Body</LayerDialog.Body>
                    <LayerDialog.Actions ref={actionsRef}>
                        <LayerDialog.Action ref={actionRef}>Save hostname</LayerDialog.Action>
                    </LayerDialog.Actions>
                </LayerDialog.Content>
            </LayerDialog>,
        );

        expect(triggerRef.current).toBe(button("Open settings"));
        expect(contentRef.current).toBe(dialog());
        expect(titleRef.current).toBe(part("Title"));
        expect(descriptionRef.current).toBe(part("Description"));
        expect(bodyRef.current).toBe(part("Body"));
        expect(actionsRef.current).toBe(part("Actions"));
        expect(actionRef.current).toBe(button("Save hostname"));
    });

    it("passes a class of the caller's own on to each part", () => {
        render(
            <LayerDialog defaultOpen>
                <LayerDialog.Content className="custom-content">
                    <LayerDialog.Title className="custom-title">
                        Configure hostname
                    </LayerDialog.Title>
                    <LayerDialog.Description className="custom-description">
                        Route requests to your service.
                    </LayerDialog.Description>
                    <LayerDialog.Body className="custom-body">Body</LayerDialog.Body>
                    <LayerDialog.Actions className="custom-actions">
                        <LayerDialog.Action className="custom-action">
                            Save hostname
                        </LayerDialog.Action>
                    </LayerDialog.Actions>
                </LayerDialog.Content>
            </LayerDialog>,
        );

        expect(dialog()).toHaveClass("layer-dialog", "custom-content");
        expect(part("Title")).toHaveClass("layer-dialog-title", "custom-title");
        expect(part("Description")).toHaveClass("layer-dialog-description", "custom-description");
        expect(part("Body")).toHaveClass("layer-dialog-body", "custom-body");
        expect(part("Actions")).toHaveClass("layer-dialog-actions", "custom-actions");
        expect(button("Save hostname")).toHaveClass("custom-action");
    });

    describe("composition", () => {
        it("requires a title and a body", () => {
            expect(() =>
                render(
                    <LayerDialog defaultOpen>
                        <LayerDialog.Content>
                            <LayerDialog.Title>Configure hostname</LayerDialog.Title>
                        </LayerDialog.Content>
                    </LayerDialog>,
                ),
            ).toThrow("LayerDialog.Content requires");
        });

        it("refuses a second description", () => {
            expect(() =>
                render(
                    <LayerDialog defaultOpen>
                        <LayerDialog.Content>
                            <LayerDialog.Title>Configure hostname</LayerDialog.Title>
                            <LayerDialog.Description>One</LayerDialog.Description>
                            <LayerDialog.Description>Two</LayerDialog.Description>
                            <LayerDialog.Body>Body</LayerDialog.Body>
                        </LayerDialog.Content>
                    </LayerDialog>,
                ),
            ).toThrow("LayerDialog.Content requires");
        });

        it("refuses anything that is not one of its parts", () => {
            expect(() =>
                render(
                    <LayerDialog defaultOpen>
                        <LayerDialog.Content>
                            <LayerDialog.Title>Configure hostname</LayerDialog.Title>
                            <LayerDialog.Body>Body</LayerDialog.Body>
                            <footer>A footer of the caller&apos;s own</footer>
                        </LayerDialog.Content>
                    </LayerDialog>,
                ),
            ).toThrow("LayerDialog.Content requires");
        });

        it("stops at a mistake while it is still closed, rather than once it is opened", () => {
            expect(() =>
                render(
                    <LayerDialog>
                        <LayerDialog.Content>
                            <LayerDialog.Body>Body</LayerDialog.Body>
                        </LayerDialog.Content>
                    </LayerDialog>,
                ),
            ).toThrow("LayerDialog.Content requires");
        });

        it("takes parts left out by a condition as not having been given", () => {
            const showDescription = false;

            render(
                <LayerDialog defaultOpen>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Configure hostname</LayerDialog.Title>
                        {showDescription ? (
                            <LayerDialog.Description>Route requests.</LayerDialog.Description>
                        ) : null}
                        <LayerDialog.Body>Body</LayerDialog.Body>
                    </LayerDialog.Content>
                </LayerDialog>,
            );

            expect(dialog()).toBeInTheDocument();
        });

        it("asks an alert for actions", () => {
            expect(() =>
                render(
                    <LayerDialog.Alert defaultOpen>
                        <LayerDialog.Content>
                            <LayerDialog.Title>Delete resource</LayerDialog.Title>
                            <LayerDialog.Body>This action cannot be undone.</LayerDialog.Body>
                        </LayerDialog.Content>
                    </LayerDialog.Alert>,
                ),
            ).toThrow("LayerDialog.Alert requires");
        });

        it("takes exactly one action", () => {
            expect(() =>
                render(
                    <LayerDialog defaultOpen>
                        <LayerDialog.Content>
                            <LayerDialog.Title>Save changes</LayerDialog.Title>
                            <LayerDialog.Body>Body</LayerDialog.Body>
                            <LayerDialog.Actions>
                                <LayerDialog.Action>Save and deploy</LayerDialog.Action>
                                <LayerDialog.Action>Save as draft</LayerDialog.Action>
                            </LayerDialog.Actions>
                        </LayerDialog.Content>
                    </LayerDialog>,
                ),
            ).toThrow("exactly one direct LayerDialog.Action");
        });

        it("refuses a control of the caller's own beside the action", () => {
            expect(() =>
                render(
                    <LayerDialog defaultOpen>
                        <LayerDialog.Content>
                            <LayerDialog.Title>Save changes</LayerDialog.Title>
                            <LayerDialog.Body>Body</LayerDialog.Body>
                            <LayerDialog.Actions>
                                <LayerDialog.Action>Save and deploy</LayerDialog.Action>
                                <button type="button">Save as draft</button>
                            </LayerDialog.Actions>
                        </LayerDialog.Content>
                    </LayerDialog>,
                ),
            ).toThrow("exactly one direct LayerDialog.Action");
        });
    });

    describe("closing", () => {
        it("closes from an X beside the title where it has no actions", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            expect(part("Header")).toContainElement(part("CloseButton"));

            fireEvent.click(button("Close"));

            expect(onOpenChange).toHaveBeenCalledTimes(1);
            expect(onOpenChange).toHaveBeenCalledWith(false, "close-button");
        });

        it("names its X as it is told", () => {
            render(<Fixture defaultOpen content={{ closeLabel: "Dismiss dialog" }} />);
            expect(part("CloseButton")).toHaveAccessibleName("Dismiss dialog");
        });

        it("trades the X for a button before the action where it has actions", () => {
            render(<Fixture defaultOpen actions />);

            expect(part("CloseButton")).not.toBeInTheDocument();
            expect(part("DismissButton")).toHaveTextContent("Close");
            expect(part("DismissButton")?.nextElementSibling).toBe(button("Save hostname"));
        });

        it("closes from the button before the action", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} actions />);

            fireEvent.click(part("DismissButton") as HTMLElement);

            expect(onOpenChange).toHaveBeenCalledWith(false, "dismiss-button");
        });

        it("says what the button before the action says as it is told", () => {
            render(
                <LayerDialog defaultOpen>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Edit profile</LayerDialog.Title>
                        <LayerDialog.Body>Body</LayerDialog.Body>
                        <LayerDialog.Actions dismissLabel="Keep editing">
                            <LayerDialog.Action>Save changes</LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog>,
            );

            expect(button("Keep editing")).toBe(part("DismissButton"));
        });

        it("leaves the action to the caller rather than closing on it", () => {
            const onClick = vi.fn();
            const onOpenChange = vi.fn();

            render(
                <LayerDialog open onOpenChange={onOpenChange}>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Save changes</LayerDialog.Title>
                        <LayerDialog.Body>Body</LayerDialog.Body>
                        <LayerDialog.Actions>
                            <LayerDialog.Action onClick={onClick}>Save</LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog>,
            );

            fireEvent.click(button("Save"));

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("closes on Escape", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            fireEvent.keyDown(document, { key: "Escape" });

            expect(onOpenChange).toHaveBeenCalledWith(false, "escape");
        });

        it("takes Escape, so a layer it was opened from keeps standing", () => {
            render(<Fixture open onOpenChange={() => {}} />);

            // fireEvent hands back false where the event was taken
            expect(fireEvent.keyDown(document, { key: "Escape" })).toBe(false);
        });

        it("closes when the page around it is pressed", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            pressOutside();

            expect(onOpenChange).toHaveBeenCalledWith(false, "click-outside");
        });

        it("stays open where a press only ended on the page around it", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            fireEvent.mouseDown(dialog());
            fireEvent.click(part("Viewport") as HTMLElement);

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("stays open when pressed inside", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            fireEvent.mouseDown(part("BodyContent") as HTMLElement);
            fireEvent.click(part("BodyContent") as HTMLElement);

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("stays open when the page around it is pressed, where it is told to", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} disablePointerDismissal />);

            pressOutside();

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("says it is on its way off the page as it closes, and leaves once it has", async () => {
            render(<Fixture defaultOpen />);

            fireEvent.click(button("Close"));

            expect(dialog()).toHaveAttribute("data-state", "closed");
            expect(part("Backdrop")).toHaveAttribute("data-state", "closed");

            await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
            expect(part("Backdrop")).not.toBeInTheDocument();
        });

        it("says it is open while it is", () => {
            render(<Fixture defaultOpen />);

            expect(dialog()).toHaveAttribute("data-state", "open");
            expect(part("Backdrop")).toHaveAttribute("data-state", "open");
        });

        it("can be opened again once it has closed", async () => {
            render(<Fixture defaultOpen />);

            fireEvent.click(button("Close"));
            await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());

            fireEvent.click(button("Open settings"));

            expect(dialog()).toHaveAttribute("data-state", "open");
        });

        it("is closed by the caller through its instance", async () => {
            const actionsRef = React.createRef<LayerDialogInstance>();
            const onOpenChange = vi.fn();

            render(<Fixture defaultOpen actionsRef={actionsRef} onOpenChange={onOpenChange} />);

            act(() => actionsRef.current?.close());

            expect(onOpenChange).toHaveBeenCalledWith(false, "imperative");
            await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
        });

        it("says nothing where it is asked to close while it is already closed", () => {
            const actionsRef = React.createRef<LayerDialogInstance>();
            const onOpenChange = vi.fn();

            render(<Fixture actionsRef={actionsRef} onOpenChange={onOpenChange} />);

            act(() => actionsRef.current?.close());

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("is closed from a control of the caller's own standing in the body", () => {
            const onOpenChange = vi.fn();

            const Finish = () => {
                const { setOpen } = useLayerDialogContext();

                return <Button onClick={() => setOpen(false, "imperative")}>Finish</Button>;
            };

            render(
                <LayerDialog open onOpenChange={onOpenChange}>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Import</LayerDialog.Title>
                        <LayerDialog.Body>
                            <Finish />
                        </LayerDialog.Body>
                    </LayerDialog.Content>
                </LayerDialog>,
            );

            fireEvent.click(button("Finish"));

            expect(onOpenChange).toHaveBeenCalledWith(false, "imperative");
        });

        it("follows open where the caller holds it", async () => {
            const { rerender } = render(<Fixture open />);
            expect(dialog()).toBeInTheDocument();

            rerender(<Fixture open={false} />);

            await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
        });

        it("leaves the caller holding it to say whether it closes", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            fireEvent.click(button("Close"));

            // The caller was told, and nothing closed until they said so
            expect(onOpenChange).toHaveBeenCalledWith(false, "close-button");
            expect(dialog()).toHaveAttribute("data-state", "open");
        });
    });

    describe("while dismissal is disabled", () => {
        it("turns away every way a reader has of closing it", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} dismissDisabled />);

            expect(button("Close")).toBeDisabled();

            fireEvent.click(button("Close"));
            fireEvent.keyDown(document, { key: "Escape" });
            pressOutside();

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("disables the button before the action", () => {
            render(<Fixture defaultOpen actions dismissDisabled />);
            expect(part("DismissButton")).toBeDisabled();
        });

        it("still takes Escape, so the layer it was opened from is not closed in its place", () => {
            render(<Fixture defaultOpen dismissDisabled />);
            expect(fireEvent.keyDown(document, { key: "Escape" })).toBe(false);
        });

        it("can still be closed by the caller", async () => {
            const actionsRef = React.createRef<LayerDialogInstance>();
            const onOpenChange = vi.fn();

            render(
                <Fixture
                    defaultOpen
                    dismissDisabled
                    actionsRef={actionsRef}
                    onOpenChange={onOpenChange}
                />,
            );

            fireEvent.keyDown(document, { key: "Escape" });
            expect(onOpenChange).not.toHaveBeenCalled();

            act(() => actionsRef.current?.close());

            expect(onOpenChange).toHaveBeenCalledWith(false, "imperative");
            await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());
        });
    });

    describe("alert", () => {
        const alertDialog = () => screen.getByRole("alertdialog");

        it("is named to a screen reader as an alert", () => {
            render(<Fixture alert defaultOpen actions />);

            expect(alertDialog()).toHaveAccessibleName("Configure hostname");
            expect(queryDialog()).not.toBeInTheDocument();
        });

        it("offers to cancel rather than to close", () => {
            render(<Fixture alert defaultOpen actions />);

            expect(button("Cancel")).toBe(part("DismissButton"));
            expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
        });

        it("says what it is told to in place of cancelling", () => {
            render(
                <LayerDialog.Alert defaultOpen>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Löschen</LayerDialog.Title>
                        <LayerDialog.Body>Unwiderruflich.</LayerDialog.Body>
                        <LayerDialog.Actions dismissLabel="Abbrechen">
                            <LayerDialog.Action variant="danger">Löschen</LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog.Alert>,
            );

            expect(button("Abbrechen")).toBe(part("DismissButton"));
        });

        it("is modal whatever it is told", () => {
            render(<Fixture alert defaultOpen actions modal={false} />);

            expect(alertDialog()).toHaveAttribute("aria-modal", "true");
            expect(document.body).toHaveAttribute("data-scroll-locked");
        });

        it("is not closed from the page around it", () => {
            const onOpenChange = vi.fn();
            render(<Fixture alert open onOpenChange={onOpenChange} actions />);

            pressOutside();

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("still closes on Escape", () => {
            const onOpenChange = vi.fn();
            render(<Fixture alert open onOpenChange={onOpenChange} actions />);

            fireEvent.keyDown(document, { key: "Escape" });

            expect(onOpenChange).toHaveBeenCalledWith(false, "escape");
        });

        it("is cancelled from the button before the action", () => {
            const onOpenChange = vi.fn();
            render(<Fixture alert open onOpenChange={onOpenChange} actions />);

            fireEvent.click(button("Cancel"));

            expect(onOpenChange).toHaveBeenCalledWith(false, "dismiss-button");
        });

        it("is described by its body, so the reader hears what it warns of", () => {
            render(<Fixture alert defaultOpen actions />);
            expect(alertDialog()).toHaveAccessibleDescription(
                "The hostname requests are routed from.",
            );
        });
    });

    describe("modal", () => {
        it("holds the page still while it is open", async () => {
            document.body.style.overflow = "scroll";

            render(<Fixture defaultOpen />);

            expect(document.body).toHaveAttribute("data-scroll-locked");
            expect(document.body).toHaveStyle("overflow: hidden");

            fireEvent.click(button("Close"));
            await waitFor(() => expect(queryDialog()).not.toBeInTheDocument());

            expect(document.body).not.toHaveAttribute("data-scroll-locked");
            expect(document.body).toHaveStyle("overflow: scroll");

            document.body.style.overflow = "";
        });

        it("says that it is modal", () => {
            render(<Fixture defaultOpen />);

            expect(dialog()).toHaveAttribute("aria-modal", "true");
            expect(dialog()).toHaveAttribute("data-modal", "true");
        });

        it("moves focus inside itself as it opens", () => {
            render(<Fixture />);

            fireEvent.click(button("Open settings"));

            expect(dialog()).toContainElement(document.activeElement as HTMLElement);
        });

        it("hands focus back to whatever opened it once it closes", () => {
            render(<Fixture />);

            button("Open settings").focus();
            fireEvent.click(button("Open settings"));
            fireEvent.click(button("Close"));

            expect(button("Open settings")).toHaveFocus();
        });

        it("opens on whatever it is told to", () => {
            const Focused = () => {
                const inputRef = React.useRef<HTMLInputElement>(null);

                return (
                    <LayerDialog defaultOpen>
                        <LayerDialog.Content initialFocusRef={inputRef}>
                            <LayerDialog.Title>Add a note</LayerDialog.Title>
                            <LayerDialog.Body>
                                <input ref={inputRef} aria-label="Note" />
                            </LayerDialog.Body>
                        </LayerDialog.Content>
                    </LayerDialog>
                );
            };

            render(<Focused />);

            expect(screen.getByLabelText("Note")).toHaveFocus();
        });

        it("hands focus to whatever it is told to once it closes", () => {
            const Returned = () => {
                const returnRef = React.useRef<HTMLButtonElement>(null);

                return (
                    <>
                        <Button ref={returnRef}>Somewhere else</Button>
                        <LayerDialog defaultOpen>
                            <LayerDialog.Content returnFocusRef={returnRef}>
                                <LayerDialog.Title>Configure hostname</LayerDialog.Title>
                                <LayerDialog.Body>Body</LayerDialog.Body>
                            </LayerDialog.Content>
                        </LayerDialog>
                    </>
                );
            };

            render(<Returned />);

            fireEvent.click(button("Close"));

            expect(button("Somewhere else")).toHaveFocus();
        });
    });

    describe("modeless", () => {
        it("leaves the page to be scrolled", () => {
            render(<Fixture defaultOpen modal={false} />);
            expect(document.body).not.toHaveAttribute("data-scroll-locked");
        });

        it("does not read as modal", () => {
            render(<Fixture defaultOpen modal={false} />);

            expect(dialog()).not.toHaveAttribute("aria-modal");
            expect(dialog()).toHaveAttribute("data-modal", "false");
        });

        it("dims nothing and catches nothing around itself", () => {
            render(<Fixture defaultOpen modal={false} />);

            expect(part("Backdrop")).toHaveClass("layer-dialog-backdrop-modeless");
            expect(part("Viewport")).toHaveClass("layer-dialog-viewport-modeless");
        });

        it("leaves focus where it was", () => {
            render(<Fixture modal={false} />);

            button("Open settings").focus();
            fireEvent.click(button("Open settings"));

            expect(button("Open settings")).toHaveFocus();
        });

        it("leaves Escape for whatever is behind it to answer as well", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open modal={false} onOpenChange={onOpenChange} />);

            // fireEvent hands back false where the event was taken
            expect(fireEvent.keyDown(document, { key: "Escape" })).toBe(true);
            expect(onOpenChange).toHaveBeenCalledWith(false, "escape");
        });

        it("closes from its trigger as well as opening from it", () => {
            const onOpenChange = vi.fn();
            render(<Fixture modal={false} onOpenChange={onOpenChange} />);

            fireEvent.click(button("Open settings"));
            fireEvent.click(button("Open settings"));

            expect(onOpenChange).toHaveBeenNthCalledWith(1, true, "trigger-press");
            expect(onOpenChange).toHaveBeenNthCalledWith(2, false, "trigger-press");
        });
    });

    describe("nested dialogs", () => {
        const Nested = ({
            onOuterOpenChange,
            onInnerOpenChange,
        }: {
            onOuterOpenChange?: LayerDialogProps["onOpenChange"];
            onInnerOpenChange?: LayerDialogProps["onOpenChange"];
        }) => (
            <LayerDialog defaultOpen onOpenChange={onOuterOpenChange}>
                <LayerDialog.Content>
                    <LayerDialog.Title>Edit deployment</LayerDialog.Title>
                    <LayerDialog.Body>
                        <LayerDialog.Alert onOpenChange={onInnerOpenChange}>
                            <LayerDialog.Trigger>Discard changes</LayerDialog.Trigger>
                            <LayerDialog.Content size="small">
                                <LayerDialog.Title>Discard unsaved changes?</LayerDialog.Title>
                                <LayerDialog.Body>Your edits will be lost.</LayerDialog.Body>
                                <LayerDialog.Actions>
                                    <LayerDialog.Action variant="danger">
                                        Discard
                                    </LayerDialog.Action>
                                </LayerDialog.Actions>
                            </LayerDialog.Content>
                        </LayerDialog.Alert>
                    </LayerDialog.Body>
                    <LayerDialog.Actions>
                        <LayerDialog.Action>Save changes</LayerDialog.Action>
                    </LayerDialog.Actions>
                </LayerDialog.Content>
            </LayerDialog>
        );

        it("keeps each dialog distinct, each over a backdrop of its own", () => {
            render(<Nested />);

            fireEvent.click(button("Discard changes"));

            expect(screen.getByRole("dialog")).toHaveAccessibleName("Edit deployment");
            expect(screen.getByRole("alertdialog")).toHaveAccessibleName(
                "Discard unsaved changes?",
            );
            expect(
                document.querySelectorAll("[data-component='LayerDialog.Backdrop']"),
            ).toHaveLength(2);
        });

        it("draws the dialog opened last over the one it was opened from", () => {
            render(<Nested />);

            fireEvent.click(button("Discard changes"));

            const outer = screen.getByRole("dialog");
            const inner = screen.getByRole("alertdialog");

            expect(
                outer.compareDocumentPosition(inner) & Node.DOCUMENT_POSITION_FOLLOWING,
            ).toBeTruthy();
        });

        it("closes only the innermost on Escape", () => {
            const onOuterOpenChange = vi.fn();
            const onInnerOpenChange = vi.fn();

            render(
                <Nested
                    onOuterOpenChange={onOuterOpenChange}
                    onInnerOpenChange={onInnerOpenChange}
                />,
            );

            fireEvent.click(button("Discard changes"));
            onInnerOpenChange.mockClear();

            fireEvent.keyDown(document, { key: "Escape" });

            expect(onInnerOpenChange).toHaveBeenCalledWith(false, "escape");
            expect(onOuterOpenChange).not.toHaveBeenCalled();
        });

        it("hands focus back to the dialog it was opened from", () => {
            render(<Nested />);

            button("Discard changes").focus();
            fireEvent.click(button("Discard changes"));
            fireEvent.click(button("Cancel"));

            expect(button("Discard changes")).toHaveFocus();
        });
    });

    describe("the action", () => {
        it("is drawn as the primary button", () => {
            render(<Fixture defaultOpen actions />);
            expect(button("Save hostname")).toHaveAttribute("data-variant", "primary");
        });

        it("is drawn as a dangerous one where it is told to", () => {
            render(
                <LayerDialog.Alert defaultOpen>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Delete resource</LayerDialog.Title>
                        <LayerDialog.Body>This cannot be undone.</LayerDialog.Body>
                        <LayerDialog.Actions>
                            <LayerDialog.Action variant="danger">Delete</LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog.Alert>,
            );

            expect(button("Delete")).toHaveAttribute("data-variant", "danger");
        });

        it("takes what a button does", () => {
            render(
                <LayerDialog defaultOpen>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Create deployment</LayerDialog.Title>
                        <LayerDialog.Body>
                            <form id="deployment" />
                        </LayerDialog.Body>
                        <LayerDialog.Actions>
                            <LayerDialog.Action type="submit" form="deployment" disabled>
                                Create deployment
                            </LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog>,
            );

            const action = button("Create deployment");

            expect(action).toHaveAttribute("type", "submit");
            expect(action).toHaveAttribute("form", "deployment");
            expect(action).toBeDisabled();
        });

        it("waits while it is loading", () => {
            render(
                <LayerDialog defaultOpen>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Save a setting</LayerDialog.Title>
                        <LayerDialog.Body>Body</LayerDialog.Body>
                        <LayerDialog.Actions>
                            <LayerDialog.Action loading>Save changes</LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog>,
            );

            expect(button("Save changes")).toHaveAttribute("data-loading", "true");
        });

        describe("with a menu", () => {
            const SplitAction = ({
                variant,
                onSelect,
                onOpenChange,
            }: {
                variant?: "primary" | "danger";
                onSelect?: () => void;
                onOpenChange?: LayerDialogProps["onOpenChange"];
            }) => (
                <LayerDialog open onOpenChange={onOpenChange}>
                    <LayerDialog.Content>
                        <LayerDialog.Title>Save changes</LayerDialog.Title>
                        <LayerDialog.Body>Review your changes before saving.</LayerDialog.Body>
                        <LayerDialog.Actions>
                            <LayerDialog.Action
                                variant={variant}
                                menu={[
                                    <ActionList.Item key="draft" onSelect={onSelect}>
                                        Save as draft
                                    </ActionList.Item>,
                                ]}
                                menuLabel="Save options"
                            >
                                Save and deploy
                            </LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog>
            );

            it("offers the related actions from a menu beside it", () => {
                render(<SplitAction />);

                const group = screen.getByRole("group", { name: "Save options" });

                expect(group).toContainElement(button("Save and deploy"));
                expect(group).toContainElement(button("Save options"));
                expect(screen.queryByRole("menu")).not.toBeInTheDocument();

                fireEvent.click(button("Save options"));

                expect(screen.getByRole("menuitem", { name: "Save as draft" })).toBeInTheDocument();
            });

            it("draws the button that opens the menu the way the action is drawn", () => {
                const { rerender } = render(<SplitAction />);

                expect(button("Save and deploy")).toHaveAttribute("data-variant", "primary");
                expect(button("Save options")).toHaveAttribute("data-variant", "primary");

                rerender(<SplitAction variant="danger" />);

                expect(button("Save and deploy")).toHaveAttribute("data-variant", "danger");
                expect(button("Save options")).toHaveAttribute("data-variant", "danger");
            });

            it("picks an item from the menu without closing the dialog", () => {
                const onSelect = vi.fn();
                const onOpenChange = vi.fn();
                render(<SplitAction onSelect={onSelect} onOpenChange={onOpenChange} />);

                fireEvent.click(button("Save options"));
                fireEvent.click(screen.getByRole("menuitem", { name: "Save as draft" }));

                expect(onSelect).toHaveBeenCalledTimes(1);
                expect(screen.queryByRole("menu")).not.toBeInTheDocument();
                expect(onOpenChange).not.toHaveBeenCalled();
            });

            it("closes the menu on Escape and leaves the dialog standing", () => {
                const onOpenChange = vi.fn();
                render(<SplitAction onOpenChange={onOpenChange} />);

                fireEvent.click(button("Save options"));

                const item = screen.getByRole("menuitem", { name: "Save as draft" });
                expect(item).toHaveFocus();

                fireEvent.keyDown(item, { key: "Escape" });

                expect(screen.queryByRole("menu")).not.toBeInTheDocument();
                expect(onOpenChange).not.toHaveBeenCalled();
                expect(dialog()).toBeInTheDocument();
            });

            it("leaves the dialog standing when a press outside the menu closes it", () => {
                const onOpenChange = vi.fn();
                render(<SplitAction onOpenChange={onOpenChange} />);

                fireEvent.click(button("Save options"));
                pressOutside();

                expect(screen.queryByRole("menu")).not.toBeInTheDocument();
                expect(onOpenChange).not.toHaveBeenCalled();
            });

            it("draws a lone action where the menu is empty", () => {
                render(
                    <LayerDialog defaultOpen>
                        <LayerDialog.Content>
                            <LayerDialog.Title>Save changes</LayerDialog.Title>
                            <LayerDialog.Body>Body</LayerDialog.Body>
                            <LayerDialog.Actions>
                                <LayerDialog.Action menu={[]}>Save and deploy</LayerDialog.Action>
                            </LayerDialog.Actions>
                        </LayerDialog.Content>
                    </LayerDialog>,
                );

                expect(screen.queryByRole("group")).not.toBeInTheDocument();
                expect(button("Save and deploy")).toBeInTheDocument();
            });
        });
    });

    describe("on a narrow screen", () => {
        it("is drawn as a sheet with a handle to pull it down by", () => {
            render(<Fixture defaultOpen />);

            expect(dialog()).toHaveAttribute("data-narrow");
            expect(part("Handle")).toHaveAttribute("aria-hidden", "true");
        });

        it("stands its actions in the body, beneath what scrolls", () => {
            render(<Fixture defaultOpen actions />);

            expect(part("Footer")).toContainElement(part("Actions"));
            expect(part("Body")).toContainElement(part("Footer"));
            expect(part("Actions")).not.toHaveClass("layer-dialog-actions-recessed");
        });

        it("draws the button before the action in full", () => {
            render(<Fixture defaultOpen actions />);
            expect(part("DismissButton")).toHaveAttribute("data-variant", "default");
        });

        it("gives an alert no handle, since it is not swiped away", () => {
            render(<Fixture alert defaultOpen actions />);
            expect(part("Handle")).not.toBeInTheDocument();
        });
    });

    describe("where the screen has room", () => {
        beforeEach(() => {
            widenScreen();
        });

        it("is drawn in the middle of the screen, with no handle", () => {
            render(<Fixture defaultOpen />);

            expect(dialog()).not.toHaveAttribute("data-narrow");
            expect(part("Handle")).not.toBeInTheDocument();
        });

        it("stands its actions on the layer behind the body", () => {
            render(<Fixture defaultOpen actions />);

            const actions = part("Actions") as HTMLElement;

            expect(part("Footer")).not.toBeInTheDocument();
            expect(part("Body")).not.toContainElement(actions);
            expect(actions.previousElementSibling).toBe(part("Body"));
            expect(actions).toHaveClass("layer-dialog-actions-recessed");
        });

        it("draws the button before the action quietly", () => {
            render(<Fixture defaultOpen actions />);
            expect(part("DismissButton")).toHaveAttribute("data-variant", "invisible");
        });

        it("is not swiped away", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            swipe(part("Header") as HTMLElement, 400);

            expect(dialog()).not.toHaveAttribute("data-swipeable");
            expect(onOpenChange).not.toHaveBeenCalled();
        });
    });

    describe("size and placement", () => {
        it("takes the medium step of the overlay scale, centred, by default", () => {
            render(<Fixture defaultOpen />);

            expect(dialog()).toHaveAttribute("data-size", "medium");
            expect(dialog()).toHaveClass("layer-dialog-size-medium");
            expect(dialog()).toHaveAttribute("data-vertical-align", "center");
            expect(part("Viewport")).toHaveClass("layer-dialog-viewport-align-center");
        });

        it("takes whichever step and placement it is given", () => {
            render(<Fixture defaultOpen content={{ size: "large", verticalAlign: "top" }} />);

            expect(dialog()).toHaveAttribute("data-size", "large");
            expect(dialog()).toHaveClass("layer-dialog-size-large");
            expect(part("Viewport")).toHaveClass("layer-dialog-viewport-align-top");
        });
    });

    describe("portals", () => {
        it("is drawn into the portal root it is told to", () => {
            const root = document.createElement("div");
            document.body.append(root);
            registerPortalRoot(root, "dialogs");

            render(<Fixture defaultOpen content={{ portalContainerName: "dialogs" }} />);

            expect(within(root).getByRole("dialog")).toBe(dialog());

            root.remove();
        });

        it("is drawn into the portal root a PortalContext above it names", () => {
            const root = document.createElement("div");
            document.body.append(root);
            registerPortalRoot(root, "scoped");

            render(
                <PortalContext.Provider value={{ portalContainerName: "scoped" }}>
                    <Fixture defaultOpen />
                </PortalContext.Provider>,
            );

            expect(within(root).getByRole("dialog")).toBe(dialog());

            root.remove();
        });

        it("draws what is opened from inside it into the same portal root", () => {
            const root = document.createElement("div");
            document.body.append(root);
            registerPortalRoot(root, "dialogs");

            render(
                <LayerDialog defaultOpen>
                    <LayerDialog.Content portalContainerName="dialogs">
                        <LayerDialog.Title>Save changes</LayerDialog.Title>
                        <LayerDialog.Body>Body</LayerDialog.Body>
                        <LayerDialog.Actions>
                            <LayerDialog.Action
                                menu={[
                                    <ActionList.Item key="draft">Save as draft</ActionList.Item>,
                                ]}
                                menuLabel="Save options"
                            >
                                Save and deploy
                            </LayerDialog.Action>
                        </LayerDialog.Actions>
                    </LayerDialog.Content>
                </LayerDialog>,
            );

            fireEvent.click(within(root).getByRole("button", { name: "Save options" }));

            expect(within(root).getByRole("menu")).toBeInTheDocument();

            root.remove();
        });
    });

    describe("the description", () => {
        // jsdom lays nothing out, so the readings the body scrolls by are given to it by hand
        const setGeometry = (
            element: HTMLElement,
            scrollTop: number,
            scrollHeight: number,
            clientHeight: number,
        ) => {
            for (const [key, value] of Object.entries({ scrollTop, scrollHeight, clientHeight })) {
                Object.defineProperty(element, key, { configurable: true, value });
            }
        };

        const frame = () => part("Description")?.parentElement?.parentElement as HTMLElement;

        it("folds away once the body is scrolled, where enough is left to scroll", () => {
            render(<Fixture defaultOpen description />);

            const scroll = scrollRegion();
            giveHeight(part("Description")?.parentElement as HTMLElement, 24);

            setGeometry(scroll, 40, 900, 300);
            fireEvent.scroll(scroll);

            expect(frame()).toHaveAttribute("data-condensed", "true");
            // It is still on the page while it is folded, so the dialog is still described by it
            expect(dialog()).toHaveAccessibleDescription("Route requests to your service.");
        });

        it("stays where it is where folding it would leave too little to scroll", () => {
            render(<Fixture defaultOpen description />);

            const scroll = scrollRegion();
            giveHeight(part("Description")?.parentElement as HTMLElement, 24);

            // Folding a description 24px tall would leave only 6px to scroll, which would pull
            // the body back under the threshold and unfold the description again, over and over
            setGeometry(scroll, 40, 330, 300);
            fireEvent.scroll(scroll);

            expect(frame()).not.toHaveAttribute("data-condensed");
        });

        it("stays folded on the way back up until the body is back at the top", () => {
            render(<Fixture defaultOpen description />);

            const scroll = scrollRegion();
            const clip = part("Description")?.parentElement as HTMLElement;
            giveHeight(clip, 24);

            setGeometry(scroll, 40, 900, 300);
            fireEvent.scroll(scroll);

            // Folded, the description measures nothing at all part of the way through folding
            giveHeight(clip, 0);
            setGeometry(scroll, 20, 900, 324);
            fireEvent.scroll(scroll);
            expect(frame()).toHaveAttribute("data-condensed", "true");

            setGeometry(scroll, 0, 900, 324);
            fireEvent.scroll(scroll);
            expect(frame()).not.toHaveAttribute("data-condensed");
        });

        it("fades the edges of the body by how far there is to scroll past each", () => {
            render(<Fixture defaultOpen />);

            const scroll = scrollRegion();

            setGeometry(scroll, 40, 900, 300);
            fireEvent.scroll(scroll);

            expect(scroll.style.getPropertyValue("--layer-dialog-scroll-start")).toBe("40px");
            expect(scroll.style.getPropertyValue("--layer-dialog-scroll-end")).toBe("560px");
        });
    });

    describe("swiping a sheet away", () => {
        it("follows the finger while the sheet is held", () => {
            render(<Fixture defaultOpen />);

            giveHeight(dialog(), 400);
            fireEvent.pointerDown(part("Header") as HTMLElement, { clientY: 0, button: 0 });
            fireEvent.pointerMove(window, { clientY: 120 });

            expect(dialog()).toHaveAttribute("data-swiping");
            expect(dialog().style.getPropertyValue("--layer-dialog-swipe-offset")).toBe("120px");
            // The page shows through the backdrop as the sheet is pulled away from it
            expect(part("Backdrop")).toHaveStyle("opacity: 0.7");

            fireEvent.pointerUp(window, { clientY: 120 });
        });

        it("closes once it has been pulled far enough down", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(part("Header") as HTMLElement, 200);

            expect(onOpenChange).toHaveBeenCalledWith(false, "swipe");
        });

        it("carries on from where it was let go of as it closes", () => {
            render(<Fixture defaultOpen />);

            giveHeight(dialog(), 400);
            swipe(part("Header") as HTMLElement, 200);

            expect(dialog()).toHaveAttribute("data-state", "closed");
            expect(dialog().style.getPropertyValue("--layer-dialog-swipe-offset")).toBe("200px");
        });

        it("settles back where it was not pulled far enough", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(part("Header") as HTMLElement, 40);

            expect(onOpenChange).not.toHaveBeenCalled();
            expect(dialog()).not.toHaveAttribute("data-swiping");
            expect(dialog().style.getPropertyValue("--layer-dialog-swipe-offset")).toBe("");
        });

        it("closes on a flick, however short it was", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(part("Header") as HTMLElement, 40, 20);

            expect(onOpenChange).toHaveBeenCalledWith(false, "swipe");
        });

        it("does not take a pull that stopped before it was let go of for a flick", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);

            const now = vi.spyOn(Date, "now").mockReturnValue(0);

            fireEvent.pointerDown(part("Header") as HTMLElement, { clientY: 0, button: 0 });
            now.mockReturnValue(20);
            fireEvent.pointerMove(window, { clientY: 40 });
            // Held still for a while before it is lifted
            now.mockReturnValue(500);
            fireEvent.pointerUp(window, { clientY: 40 });

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("does not take a press that wavered for a flick", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(part("Header") as HTMLElement, 4, 1);

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("settles back where the caller holding it keeps it open", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(part("Header") as HTMLElement, 200);

            expect(onOpenChange).toHaveBeenCalledWith(false, "swipe");
            expect(dialog().style.getPropertyValue("--layer-dialog-swipe-offset")).toBe("");
        });

        it("only follows the finger down", () => {
            render(<Fixture defaultOpen />);

            fireEvent.pointerDown(part("Header") as HTMLElement, { clientY: 100, button: 0 });
            fireEvent.pointerMove(window, { clientY: 20 });

            expect(dialog().style.getPropertyValue("--layer-dialog-swipe-offset")).toBe("");

            fireEvent.pointerUp(window, { clientY: 20 });
        });

        it("is taken hold of by its handle as well", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(part("Handle") as HTMLElement, 200);

            expect(onOpenChange).toHaveBeenCalledWith(false, "swipe");
        });

        it("leaves what the body holds to scroll rather than to swipe", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(part("BodyContent") as HTMLElement, 200);

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("leaves a press on the X to the X", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            swipe(button("Close"), 200);

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("is not swiped by any button but the main one", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} />);

            giveHeight(dialog(), 400);
            fireEvent.pointerDown(part("Header") as HTMLElement, { clientY: 0, button: 2 });
            fireEvent.pointerMove(window, { clientY: 200 });
            fireEvent.pointerUp(window, { clientY: 200 });

            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("lets go where the browser takes the gesture over", () => {
            render(<Fixture defaultOpen />);

            fireEvent.pointerDown(part("Header") as HTMLElement, { clientY: 0, button: 0 });
            fireEvent.pointerMove(window, { clientY: 80 });
            fireEvent.pointerCancel(window);

            expect(dialog()).not.toHaveAttribute("data-swiping");
            expect(dialog().style.getPropertyValue("--layer-dialog-swipe-offset")).toBe("");
        });

        it("is not swiped while dismissal is disabled", () => {
            const onOpenChange = vi.fn();
            render(<Fixture open onOpenChange={onOpenChange} dismissDisabled />);

            giveHeight(dialog(), 400);
            swipe(part("Header") as HTMLElement, 200);

            expect(dialog()).not.toHaveAttribute("data-swipeable");
            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it("is never swiped where it is an alert", () => {
            const onOpenChange = vi.fn();
            render(<Fixture alert open onOpenChange={onOpenChange} actions />);

            const alertDialog = screen.getByRole("alertdialog");
            giveHeight(alertDialog, 400);
            swipe(part("Header") as HTMLElement, 200);

            expect(alertDialog).not.toHaveAttribute("data-swipeable");
            expect(onOpenChange).not.toHaveBeenCalled();
        });
    });
});
