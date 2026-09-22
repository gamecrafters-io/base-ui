import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { FormControl } from "../form-control";
import { InlineEdit, useInlineEdit, useInlineEditContext } from ".";
import type { InlineEditProps } from "./InlineEdit.types";

const VALUE = "Quarterly report";

const parts = (
    <>
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
            <InlineEdit.SubmitTrigger />
            <InlineEdit.CancelTrigger />
        </InlineEdit.Control>
    </>
);

// The value and the field alone, for an inline edit that is only ever opened from the preview
const fieldParts = (
    <>
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
    </>
);

const renderInlineEdit = (props: Partial<InlineEditProps> = {}, children = parts) =>
    render(
        <InlineEdit defaultValue={VALUE} {...props}>
            {children}
        </InlineEdit>,
    );

const root = () => document.querySelector('[data-component="InlineEdit"]') as HTMLElement;

const part = (name: string) =>
    document.querySelector(`[data-component="InlineEdit.${name}"]`) as HTMLElement;

const field = () => part("Input") as HTMLInputElement;

const preview = () => part("Preview");

const trigger = (name: string) => screen.getByRole("button", { name });

const focus = (element: HTMLElement) => {
    act(() => element.focus());
};

const press = (element: HTMLElement, key: string, init: Partial<KeyboardEvent> = {}) =>
    fireEvent.keyDown(element, { key, ...init });

const type = (text: string) => fireEvent.change(field(), { target: { value: text } });

// Opens the edit the way a reader arriving at the preview does
const startEditing = () => focus(preview());

describe("InlineEdit", () => {
    it("tags the inline edit and its parts with data-component attributes", () => {
        renderInlineEdit();

        for (const name of [
            "InlineEdit",
            "InlineEdit.Label",
            "InlineEdit.Area",
            "InlineEdit.Input",
            "InlineEdit.Preview",
            "InlineEdit.Control",
            "InlineEdit.EditTrigger",
            "InlineEdit.SubmitTrigger",
            "InlineEdit.CancelTrigger",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("names its parts from an id of the caller's own", () => {
        renderInlineEdit({ id: "title" });

        expect(root()).toHaveAttribute("id", "title");
        expect(part("Label")).toHaveAttribute("id", "title-label");
        expect(part("Area")).toHaveAttribute("id", "title-area");
        expect(field()).toHaveAttribute("id", "title-input");
        expect(preview()).toHaveAttribute("id", "title-preview");
        expect(part("Control")).toHaveAttribute("id", "title-control");
        expect(part("EditTrigger")).toHaveAttribute("id", "title-edit-trigger");
        expect(part("SubmitTrigger")).toHaveAttribute("id", "title-submit-trigger");
        expect(part("CancelTrigger")).toHaveAttribute("id", "title-cancel-trigger");
    });

    it("takes a name for any one part in place of the one worked out for it", () => {
        renderInlineEdit({ ids: { input: "custom-input" } });

        expect(field()).toHaveAttribute("id", "custom-input");
        expect(part("Label")).toHaveAttribute("for", "custom-input");
    });

    describe("reading the value", () => {
        it("shows the value in the preview, with the field out of sight", () => {
            renderInlineEdit();

            expect(preview()).toHaveTextContent(VALUE);
            expect(preview()).toBeVisible();
            expect(field()).not.toBeVisible();
            expect(root()).not.toHaveAttribute("data-editing");
        });

        it("draws the preview as a button in the tab order", () => {
            renderInlineEdit();

            expect(preview()).toHaveAttribute("role", "button");
            expect(preview()).toHaveAttribute("tabindex", "0");
        });

        it("names the preview by the label and then by the value", () => {
            renderInlineEdit();
            expect(screen.getByRole("button", { name: `Title ${VALUE}` })).toBe(preview());
        });

        it("lets a name the caller gave the preview stand", () => {
            render(
                <InlineEdit defaultValue={VALUE}>
                    <InlineEdit.Area>
                        <InlineEdit.Input aria-label="Title" />
                        <InlineEdit.Preview aria-label="Edit the title" />
                    </InlineEdit.Area>
                </InlineEdit>,
            );

            expect(preview()).not.toHaveAttribute("aria-labelledby");
            expect(screen.getByRole("button", { name: "Edit the title" })).toBe(preview());
        });

        it("points the label at the field", () => {
            renderInlineEdit();
            expect(part("Label")).toHaveAttribute("for", field().id);
        });

        it("stands a placeholder in for a value not yet written", () => {
            renderInlineEdit({ defaultValue: "", placeholder: "Add a title" });

            expect(preview()).toHaveTextContent("Add a title");
            expect(preview()).toHaveAttribute("data-placeholder-shown", "true");
            expect(part("Area")).toHaveAttribute("data-placeholder-shown", "true");
            expect(field()).toHaveAttribute("placeholder", "Add a title");
        });

        it("gives the preview and the field placeholders of their own", () => {
            renderInlineEdit({
                defaultValue: "",
                placeholder: { preview: "Add a title", edit: "Name the report" },
            });

            expect(preview()).toHaveTextContent("Add a title");
            expect(field()).toHaveAttribute("placeholder", "Name the report");
        });

        it("takes a value of nothing but space for no value at all", () => {
            renderInlineEdit({ defaultValue: "   ", placeholder: "Add a title" });
            expect(preview()).toHaveTextContent("Add a title");
        });

        it("shows whatever it was given instead of the value", () => {
            render(
                <InlineEdit defaultValue={VALUE}>
                    <InlineEdit.Area>
                        <InlineEdit.Input />
                        <InlineEdit.Preview>{`${VALUE} (draft)`}</InlineEdit.Preview>
                    </InlineEdit.Area>
                </InlineEdit>,
            );

            expect(preview()).toHaveTextContent(`${VALUE} (draft)`);
        });

        it("draws the preview and the field as whatever they are told to", () => {
            render(
                <InlineEdit defaultValue={VALUE}>
                    <InlineEdit.Area>
                        <InlineEdit.Input as="textarea" />
                        <InlineEdit.Preview as="h2" />
                    </InlineEdit.Area>
                </InlineEdit>,
            );

            expect(field().tagName).toBe("TEXTAREA");
            expect(preview().tagName).toBe("H2");
        });
    });

    describe("starting an edit", () => {
        it("starts as the preview is arrived at, with the whole value selected", () => {
            renderInlineEdit();

            startEditing();

            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();
            expect(field()).toHaveValue(VALUE);
            expect(field().selectionStart).toBe(0);
            expect(field().selectionEnd).toBe(VALUE.length);
            expect(preview()).not.toBeVisible();
            expect(root()).toHaveAttribute("data-editing", "true");
        });

        it("says so on every part", () => {
            renderInlineEdit();

            startEditing();

            for (const name of ["Label", "Area", "Input", "Preview", "Control"]) {
                expect(part(name)).toHaveAttribute("data-editing", "true");
            }
        });

        it("leaves the value unselected where it is told to", () => {
            renderInlineEdit({ selectOnFocus: false });

            startEditing();

            expect(field()).toHaveFocus();
            expect(field().selectionStart).toBe(field().selectionEnd);
        });

        it("reports that the edit has started", () => {
            const onEditChange = vi.fn();
            renderInlineEdit({ onEditChange });

            startEditing();

            expect(onEditChange).toHaveBeenCalledWith(true);
        });

        it("starts from the edit trigger, which stands only while the value is being read", () => {
            renderInlineEdit();

            expect(part("SubmitTrigger")).not.toBeVisible();
            expect(part("CancelTrigger")).not.toBeVisible();

            fireEvent.click(trigger("Edit"));

            expect(field()).toHaveFocus();
            expect(part("EditTrigger")).not.toBeVisible();
            expect(trigger("Save")).toBeVisible();
            expect(trigger("Cancel")).toBeVisible();
        });

        it("starts on a press rather than on arrival where it is told to", () => {
            renderInlineEdit({ activationMode: "click" }, fieldParts);

            focus(preview());
            expect(field()).not.toBeVisible();

            fireEvent.click(preview());
            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();
        });

        it("starts on a second press rather than the first where it is told to", () => {
            renderInlineEdit({ activationMode: "dblclick" }, fieldParts);

            focus(preview());
            fireEvent.click(preview());
            expect(field()).not.toBeVisible();

            fireEvent.doubleClick(preview());
            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();
        });

        it("starts from Enter or Space on the preview, whichever way the pointer starts one", () => {
            for (const key of ["Enter", " "]) {
                const { unmount } = renderInlineEdit({ activationMode: "dblclick" }, fieldParts);

                expect(press(preview(), key)).toBe(false);
                expect(field()).toBeVisible();

                unmount();
            }
        });

        it("does not start from a key still held down", () => {
            renderInlineEdit({ activationMode: "click" }, fieldParts);

            press(preview(), "Enter", { repeat: true });

            expect(field()).not.toBeVisible();
        });

        it("starts from nothing on the preview where it is told to", () => {
            renderInlineEdit({ activationMode: "none" }, fieldParts);

            focus(preview());
            fireEvent.click(preview());
            fireEvent.doubleClick(preview());
            press(preview(), "Enter");

            expect(field()).not.toBeVisible();
        });

        it("reads the preview as text and leaves it out of the tab order where nothing on it starts an edit", () => {
            renderInlineEdit({ activationMode: "none" }, fieldParts);

            expect(preview()).not.toHaveAttribute("role");
            expect(preview()).not.toHaveAttribute("tabindex");
        });

        it("still starts from the edit trigger where nothing on the preview does", () => {
            renderInlineEdit({ activationMode: "none" });

            fireEvent.click(trigger("Edit"));

            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();
        });

        it("starts from a press on the label", () => {
            renderInlineEdit({}, fieldParts);

            fireEvent.click(part("Label"));

            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();
        });

        it("starts out being edited where it is told to", () => {
            renderInlineEdit({ defaultEdit: true });

            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();
        });
    });

    describe("keeping an edit", () => {
        it("keeps what was typed on Enter", () => {
            const onValueCommit = vi.fn();
            const onEditChange = vi.fn();
            renderInlineEdit({ onValueCommit, onEditChange });

            startEditing();
            type("Annual report");
            press(field(), "Enter");

            expect(preview()).toHaveTextContent("Annual report");
            expect(field()).not.toBeVisible();
            expect(onValueCommit).toHaveBeenCalledWith("Annual report");
            expect(onEditChange).toHaveBeenLastCalledWith(false);
        });

        it("reports every change as it is typed", () => {
            const onValueChange = vi.fn();
            renderInlineEdit({ onValueChange });

            startEditing();
            type("Annual");
            type("Annual report");

            expect(onValueChange).toHaveBeenNthCalledWith(1, "Annual");
            expect(onValueChange).toHaveBeenNthCalledWith(2, "Annual report");
        });

        it("keeps the form it stands in from being sent by the Enter that keeps the edit", () => {
            renderInlineEdit();

            startEditing();

            expect(press(field(), "Enter")).toBe(false);
        });

        it("leaves Enter to the page with Shift or Command held", () => {
            renderInlineEdit();

            startEditing();

            expect(press(field(), "Enter", { shiftKey: true })).toBe(true);
            expect(press(field(), "Enter", { metaKey: true })).toBe(true);
            expect(field()).toBeVisible();
        });

        it("leaves a key pressed while a character is being composed to the composition", () => {
            renderInlineEdit();

            startEditing();
            press(field(), "Enter", { isComposing: true });

            expect(field()).toBeVisible();
        });

        it("keeps what was typed from the submit trigger", () => {
            const onValueCommit = vi.fn();
            renderInlineEdit({ onValueCommit });

            startEditing();
            type("Annual report");
            fireEvent.click(trigger("Save"));

            expect(preview()).toHaveTextContent("Annual report");
            expect(onValueCommit).toHaveBeenCalledWith("Annual report");
        });

        it("keeps what was typed as the reader presses elsewhere", () => {
            const onValueCommit = vi.fn();
            renderInlineEdit({ onValueCommit });

            startEditing();
            type("Annual report");
            fireEvent.mouseDown(document.body);

            expect(field()).not.toBeVisible();
            expect(preview()).toHaveTextContent("Annual report");
            expect(onValueCommit).toHaveBeenCalledTimes(1);
        });

        it("keeps what was typed as focus moves elsewhere, and leaves it there", () => {
            render(
                <>
                    <InlineEdit defaultValue={VALUE}>{parts}</InlineEdit>
                    <button type="button">Elsewhere</button>
                </>,
            );
            const elsewhere = screen.getByRole("button", { name: "Elsewhere" });

            startEditing();
            type("Annual report");
            focus(elsewhere);

            expect(preview()).toHaveTextContent("Annual report");
            expect(elsewhere).toHaveFocus();
        });

        it("keeps an edit only once, however many ways the reader leaves it at once", () => {
            const onValueCommit = vi.fn();
            render(
                <>
                    <InlineEdit defaultValue={VALUE} onValueCommit={onValueCommit}>
                        {parts}
                    </InlineEdit>
                    <button type="button">Elsewhere</button>
                </>,
            );
            const elsewhere = screen.getByRole("button", { name: "Elsewhere" });

            startEditing();

            // The press and the focus it moves land together, before the inline edit has been
            // drawn again, the way they do in a browser
            act(() => {
                elsewhere.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
                elsewhere.focus();
            });

            expect(onValueCommit).toHaveBeenCalledTimes(1);
        });

        it("is not left by a press or a move of focus within it", () => {
            renderInlineEdit();

            startEditing();
            fireEvent.mouseDown(part("Label"));
            focus(trigger("Save"));

            expect(root()).toHaveAttribute("data-editing", "true");
        });

        it("is not left by a press of an auxiliary button", () => {
            renderInlineEdit();

            startEditing();
            fireEvent.mouseDown(document.body, { button: 2 });

            expect(field()).toBeVisible();
        });
    });

    describe("throwing an edit away", () => {
        it("takes the value back on Escape", () => {
            const onValueRevert = vi.fn();
            const onEditChange = vi.fn();
            renderInlineEdit({ onValueRevert, onEditChange });

            startEditing();
            type("Annual report");
            press(field(), "Escape");

            expect(preview()).toHaveTextContent(VALUE);
            expect(field()).not.toBeVisible();
            expect(onValueRevert).toHaveBeenCalledWith(VALUE);
            expect(onEditChange).toHaveBeenLastCalledWith(false);
        });

        it("keeps Escape from reaching whatever the inline edit stands in", () => {
            renderInlineEdit();

            startEditing();

            expect(press(field(), "Escape")).toBe(false);
        });

        it("takes the value back from the cancel trigger", () => {
            renderInlineEdit();

            startEditing();
            type("Annual report");
            fireEvent.click(trigger("Cancel"));

            expect(preview()).toHaveTextContent(VALUE);
            expect(field()).toHaveValue(VALUE);
        });

        it("takes a value that started out empty back to empty", () => {
            renderInlineEdit({ defaultValue: "", placeholder: "Add a title" });

            startEditing();
            type("Annual report");
            press(field(), "Escape");

            expect(preview()).toHaveTextContent("Add a title");
            expect(field()).toHaveValue("");
        });

        it("takes the value back to where it stood as this edit started, not the first", () => {
            renderInlineEdit();

            startEditing();
            type("Annual report");
            press(field(), "Enter");

            fireEvent.click(trigger("Edit"));
            type("Monthly report");
            press(field(), "Escape");

            expect(preview()).toHaveTextContent("Annual report");
        });
    });

    describe("submit modes", () => {
        it("keeps an edit on Enter and throws it away on leaving, where told to keep it on Enter alone", () => {
            renderInlineEdit({ submitMode: "enter" });

            startEditing();
            type("Annual report");
            fireEvent.mouseDown(document.body);
            expect(preview()).toHaveTextContent(VALUE);

            startEditing();
            type("Annual report");
            press(field(), "Enter");
            expect(preview()).toHaveTextContent("Annual report");
        });

        it("keeps an edit on leaving and not on Enter, where told to keep it on leaving alone", () => {
            renderInlineEdit({ submitMode: "blur" });

            startEditing();
            type("Annual report");

            expect(press(field(), "Enter")).toBe(true);
            expect(field()).toBeVisible();

            fireEvent.mouseDown(document.body);
            expect(preview()).toHaveTextContent("Annual report");
        });

        it("keeps an edit from the submit trigger alone, where told to keep it on neither", () => {
            renderInlineEdit({ submitMode: "none" });

            startEditing();
            type("Annual report");
            press(field(), "Enter");
            expect(field()).toBeVisible();

            fireEvent.mouseDown(document.body);
            expect(preview()).toHaveTextContent(VALUE);

            startEditing();
            type("Annual report");
            fireEvent.click(trigger("Save"));
            expect(preview()).toHaveTextContent("Annual report");
        });
    });

    describe("a box of lines", () => {
        const renderTextarea = (props: Partial<InlineEditProps> = {}) =>
            renderInlineEdit(
                props,
                <>
                    <InlineEdit.Label>Summary</InlineEdit.Label>
                    <InlineEdit.Area>
                        <InlineEdit.Input as="textarea" />
                        <InlineEdit.Preview />
                    </InlineEdit.Area>
                </>,
            );

        it("takes Enter for a new line", () => {
            renderTextarea();

            startEditing();

            expect(press(field(), "Enter")).toBe(true);
            expect(field()).toBeVisible();
        });

        it("keeps the edit with Control or Command held", () => {
            for (const modifier of [{ ctrlKey: true }, { metaKey: true }]) {
                const onValueCommit = vi.fn();
                const { unmount } = renderTextarea({ onValueCommit });

                startEditing();
                type("First line\nSecond line");
                press(field(), "Enter", modifier);

                expect(field()).not.toBeVisible();
                expect(onValueCommit).toHaveBeenCalledWith("First line\nSecond line");

                unmount();
            }
        });
    });

    describe("putting the reader back", () => {
        it("puts the reader back on the edit trigger as an edit ends", () => {
            renderInlineEdit();

            startEditing();
            press(field(), "Enter");

            expect(trigger("Edit")).toHaveFocus();
        });

        it("puts the reader back from the triggers as well", () => {
            renderInlineEdit();

            startEditing();
            focus(trigger("Cancel"));
            fireEvent.click(trigger("Cancel"));

            expect(trigger("Edit")).toHaveFocus();
        });

        it("puts the reader back on the preview where there is no edit trigger, without starting another edit", () => {
            renderInlineEdit({}, fieldParts);

            startEditing();
            press(field(), "Escape");

            expect(preview()).toHaveFocus();
            expect(field()).not.toBeVisible();
        });

        it("starts another edit from the preview the reader was put back on", () => {
            renderInlineEdit({}, fieldParts);

            startEditing();
            press(field(), "Enter");
            press(preview(), "Enter");

            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();
        });

        it("starts another edit from a press on the preview the reader was put back on", () => {
            renderInlineEdit({}, fieldParts);

            startEditing();
            press(field(), "Enter");
            fireEvent.click(preview());

            expect(field()).toBeVisible();
        });

        it("puts the reader on whatever the caller named instead", () => {
            const Returning = () => {
                const next = React.useRef<HTMLButtonElement>(null);

                return (
                    <>
                        <InlineEdit defaultValue={VALUE} returnFocusRef={next}>
                            {parts}
                        </InlineEdit>
                        <button ref={next} type="button">
                            Next
                        </button>
                    </>
                );
            };

            render(<Returning />);

            startEditing();
            press(field(), "Enter");

            expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
        });
    });

    describe("the value", () => {
        it("follows the caller where they are holding it", () => {
            const { rerender } = render(
                <InlineEdit value={VALUE} onValueChange={() => {}}>
                    {parts}
                </InlineEdit>,
            );

            rerender(
                <InlineEdit value="Annual report" onValueChange={() => {}}>
                    {parts}
                </InlineEdit>,
            );

            expect(preview()).toHaveTextContent("Annual report");
            expect(field()).toHaveValue("Annual report");
        });

        it("leaves a value the caller is holding as it was, and reports what was typed", () => {
            const onValueChange = vi.fn();
            render(
                <InlineEdit value={VALUE} onValueChange={onValueChange}>
                    {parts}
                </InlineEdit>,
            );

            startEditing();
            type("Annual report");

            expect(onValueChange).toHaveBeenCalledWith("Annual report");
            expect(field()).toHaveValue(VALUE);
        });

        it("hands a value the caller is holding back to them as an edit is thrown away", () => {
            const Held = () => {
                const [value, setValue] = React.useState(VALUE);

                return (
                    <InlineEdit value={value} onValueChange={setValue}>
                        {parts}
                    </InlineEdit>
                );
            };

            render(<Held />);

            startEditing();
            type("Annual report");
            expect(field()).toHaveValue("Annual report");

            press(field(), "Escape");
            expect(preview()).toHaveTextContent(VALUE);
        });

        it("holds the value to the most characters it can take", () => {
            const Capped = () => {
                const title = useInlineEdit({ maxLength: 9 });

                return (
                    <>
                        <InlineEdit.RootProvider value={title}>
                            {fieldParts}
                        </InlineEdit.RootProvider>
                        <button type="button" onClick={() => title.setValue(VALUE)}>
                            Fill
                        </button>
                    </>
                );
            };

            render(<Capped />);

            expect(field()).toHaveAttribute("maxlength", "9");

            fireEvent.click(screen.getByRole("button", { name: "Fill" }));

            expect(preview()).toHaveTextContent("Quarterly");
        });

        it("reports a change only where the value moved", () => {
            const onValueChange = vi.fn();
            renderInlineEdit({ onValueChange });

            startEditing();
            type(VALUE);

            expect(onValueChange).not.toHaveBeenCalled();
        });
    });

    describe("an edit the caller is holding", () => {
        const Held = (props: Partial<InlineEditProps>) => {
            const [editing, setEditing] = React.useState(false);

            return (
                <>
                    <InlineEdit
                        defaultValue={VALUE}
                        edit={editing}
                        onEditChange={setEditing}
                        {...props}
                    >
                        {parts}
                    </InlineEdit>
                    <button type="button" onClick={() => setEditing(false)}>
                        Close
                    </button>
                </>
            );
        };

        it("only asks to start, and does not start until the caller says it does", () => {
            const onEditChange = vi.fn();
            renderInlineEdit({ edit: false, onEditChange });

            startEditing();

            expect(onEditChange).toHaveBeenCalledWith(true);
            expect(field()).not.toBeVisible();
        });

        it("only asks to end, and does not end until the caller says it does", () => {
            const onEditChange = vi.fn();
            const onValueCommit = vi.fn();
            renderInlineEdit({ edit: true, onEditChange, onValueCommit });

            press(field(), "Enter");

            expect(onEditChange).toHaveBeenCalledWith(false);
            expect(onValueCommit).not.toHaveBeenCalled();
            expect(field()).toBeVisible();
        });

        it("starts and ends as the caller says, keeping what it was asked to keep", () => {
            const onValueCommit = vi.fn();
            render(<Held onValueCommit={onValueCommit} />);

            startEditing();
            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();

            type("Annual report");
            press(field(), "Enter");

            expect(field()).not.toBeVisible();
            expect(preview()).toHaveTextContent("Annual report");
            expect(onValueCommit).toHaveBeenCalledWith("Annual report");
            expect(trigger("Edit")).toHaveFocus();
        });

        it("throws away what it was asked to throw away", () => {
            const onValueRevert = vi.fn();
            render(<Held onValueRevert={onValueRevert} />);

            startEditing();
            type("Annual report");
            press(field(), "Escape");

            expect(preview()).toHaveTextContent(VALUE);
            expect(onValueRevert).toHaveBeenCalledWith(VALUE);
        });

        it("throws away an edit the caller ended without having been asked to", () => {
            const onValueRevert = vi.fn();
            render(<Held onValueRevert={onValueRevert} />);

            startEditing();
            type("Annual report");
            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            expect(field()).not.toBeVisible();
            expect(preview()).toHaveTextContent(VALUE);
            expect(onValueRevert).toHaveBeenCalledWith(VALUE);
        });
    });

    describe("disabled", () => {
        it("cannot be edited, and says so on every part", () => {
            const onEditChange = vi.fn();
            renderInlineEdit({ disabled: true, onEditChange });

            focus(preview());
            fireEvent.click(preview());
            press(preview(), "Enter");

            expect(field()).not.toBeVisible();
            expect(onEditChange).not.toHaveBeenCalled();
            expect(root()).toHaveAttribute("data-disabled", "true");
            for (const name of ["Label", "Area", "Input", "Preview", "Control"]) {
                expect(part(name)).toHaveAttribute("data-disabled", "true");
            }
        });

        it("reads the preview as a button that cannot be pressed, out of the tab order", () => {
            renderInlineEdit({ disabled: true });

            expect(preview()).toHaveAttribute("role", "button");
            expect(preview()).toHaveAttribute("aria-disabled", "true");
            expect(preview()).not.toHaveAttribute("tabindex");
        });

        it("disables the field and the edit trigger", () => {
            renderInlineEdit({ disabled: true });

            expect(field()).toBeDisabled();
            expect(trigger("Edit")).toBeDisabled();
        });
    });

    describe("read only", () => {
        it("shows the value as text that cannot be edited", () => {
            renderInlineEdit({ readOnly: true });

            fireEvent.click(preview());

            expect(preview()).not.toHaveAttribute("role");
            expect(preview()).not.toHaveAttribute("tabindex");
            expect(field()).not.toBeVisible();
            expect(root()).toHaveAttribute("data-readonly", "true");
        });

        it("leaves the edit trigger with nothing to start", () => {
            renderInlineEdit({ readOnly: true });
            expect(trigger("Edit")).toBeDisabled();
        });

        it("keeps the field read-only rather than disabled, so the value is still submitted", () => {
            renderInlineEdit({ readOnly: true });

            expect(field()).toHaveAttribute("readonly");
            expect(field()).not.toBeDisabled();
        });

        it("lets the reader out of an edit left open as it was made read-only", () => {
            const { rerender } = render(<InlineEdit defaultValue={VALUE}>{parts}</InlineEdit>);

            startEditing();
            type("Annual report");
            rerender(
                <InlineEdit defaultValue={VALUE} readOnly>
                    {parts}
                </InlineEdit>,
            );
            press(field(), "Escape");

            expect(field()).not.toBeVisible();
            expect(preview()).toHaveTextContent(VALUE);
        });
    });

    it("marks itself required", () => {
        renderInlineEdit({ required: true });

        expect(field()).toBeRequired();
        expect(root()).toHaveAttribute("data-required", "true");
    });

    it("marks itself invalid", () => {
        renderInlineEdit({ invalid: true });

        expect(field()).toHaveAttribute("aria-invalid", "true");
        expect(field()).toHaveClass("input-error");
        expect(preview()).toHaveAttribute("data-invalid", "true");
    });

    it("says nothing about the states it is not in", () => {
        renderInlineEdit();

        for (const state of [
            "data-editing",
            "data-disabled",
            "data-readonly",
            "data-required",
            "data-invalid",
            "data-placeholder-shown",
        ]) {
            expect(root()).not.toHaveAttribute(state);
            expect(preview()).not.toHaveAttribute(state);
        }
    });

    describe("in a form", () => {
        it("is submitted under its name whether or not it is being edited", () => {
            render(
                <form data-testid="form">
                    <InlineEdit name="title" defaultValue={VALUE}>
                        {parts}
                    </InlineEdit>
                </form>,
            );
            const form = screen.getByTestId("form") as HTMLFormElement;

            expect(new FormData(form).get("title")).toBe(VALUE);

            startEditing();
            type("Annual report");

            expect(new FormData(form).get("title")).toBe("Annual report");
        });

        it("carries its form to the field", () => {
            renderInlineEdit({ form: "report" });
            expect(field()).toHaveAttribute("form", "report");
        });
    });

    describe("in a form control", () => {
        it("is wired into the field around it", () => {
            render(
                <FormControl disabled required>
                    <FormControl.Label>Title</FormControl.Label>
                    <InlineEdit defaultValue={VALUE}>
                        <InlineEdit.Area>
                            <InlineEdit.Input />
                            <InlineEdit.Preview />
                        </InlineEdit.Area>
                    </InlineEdit>
                    <FormControl.Caption>Shown on the cover</FormControl.Caption>
                    <FormControl.Validation variant="error">Name the report</FormControl.Validation>
                </FormControl>,
            );

            const label = screen.getByText("Title").closest("label");
            expect(field()).toHaveAttribute("id", label?.getAttribute("for"));
            expect(field()).toBeDisabled();
            expect(field()).toBeRequired();
            expect(field()).toHaveAttribute(
                "aria-describedby",
                `${screen.getByText("Name the report").id} ${screen.getByText("Shown on the cover").id}`,
            );
        });

        it("names the preview by the field's own label", () => {
            render(
                <FormControl>
                    <FormControl.Label>Title</FormControl.Label>
                    <InlineEdit defaultValue={VALUE}>
                        <InlineEdit.Area>
                            <InlineEdit.Input />
                            <InlineEdit.Preview />
                        </InlineEdit.Area>
                    </InlineEdit>
                </FormControl>,
            );

            expect(screen.getByRole("button", { name: `Title ${VALUE}` })).toBe(preview());
        });

        it("lets what the inline edit says of itself stand", () => {
            render(
                <FormControl disabled>
                    <InlineEdit defaultValue={VALUE} disabled={false}>
                        {fieldParts}
                    </InlineEdit>
                </FormControl>,
            );

            expect(field()).not.toBeDisabled();
        });
    });

    describe("drawn from a hook", () => {
        const Held = () => {
            const title = useInlineEdit({ defaultValue: VALUE });

            return (
                <>
                    <InlineEdit.RootProvider value={title}>{parts}</InlineEdit.RootProvider>
                    <button type="button" onClick={title.edit}>
                        Rename
                    </button>
                    <button type="button" onClick={title.submit}>
                        Done
                    </button>
                    <button type="button" onClick={title.clearValue}>
                        Clear
                    </button>
                </>
            );
        };

        it("is started and ended from wherever the hook is read", () => {
            render(<Held />);

            fireEvent.click(screen.getByRole("button", { name: "Rename" }));
            expect(field()).toBeVisible();
            expect(field()).toHaveFocus();

            type("Annual report");
            fireEvent.click(screen.getByRole("button", { name: "Done" }));

            expect(field()).not.toBeVisible();
            expect(preview()).toHaveTextContent("Annual report");
        });

        it("has its value changed from wherever the hook is read", () => {
            render(<Held />);

            fireEvent.click(screen.getByRole("button", { name: "Clear" }));

            expect(field()).toHaveValue("");
            expect(preview()).toHaveAttribute("data-placeholder-shown", "true");
        });
    });

    it("hands its state to a control of the caller's own standing among the parts", () => {
        const Hint = () => {
            const { editing } = useInlineEditContext();

            return <span>{editing ? "Enter to keep" : "Press to edit"}</span>;
        };

        renderInlineEdit(
            {},
            <>
                {parts}
                <Hint />
            </>,
        );

        expect(screen.getByText("Press to edit")).toBeInTheDocument();

        startEditing();

        expect(screen.getByText("Enter to keep")).toBeInTheDocument();
    });

    describe("grown with the value", () => {
        it("keeps the field in its place behind the preview rather than off the page", () => {
            renderInlineEdit({ autoResize: true });

            expect(field()).not.toHaveAttribute("hidden");
            expect(field()).toHaveAttribute("size", "1");
            expect(field()).toHaveAttribute("data-autoresize", "true");
            expect(part("Area")).toHaveAttribute("data-autoresize", "true");
        });

        it("keeps the preview in its place while the field is typed into", () => {
            renderInlineEdit({ autoResize: true });

            startEditing();
            type("Annual report");

            expect(preview()).not.toHaveAttribute("hidden");
            expect(preview()).toHaveAttribute("data-editing", "true");
            expect(preview()).toHaveTextContent("Annual report");
        });
    });

    describe("the triggers", () => {
        it("gives each a type, so none of them sends the form it stands in", () => {
            renderInlineEdit();

            for (const name of ["EditTrigger", "SubmitTrigger", "CancelTrigger"]) {
                expect(part(name)).toHaveAttribute("type", "button");
            }
        });

        it("takes names of their own", () => {
            renderInlineEdit(
                {},
                <>
                    {fieldParts}
                    <InlineEdit.Control>
                        <InlineEdit.EditTrigger label="Rename" />
                        <InlineEdit.SubmitTrigger label="Keep the title" />
                        <InlineEdit.CancelTrigger label="Keep the old title" />
                    </InlineEdit.Control>
                </>,
            );

            fireEvent.click(trigger("Rename"));

            expect(trigger("Keep the title")).toBeInTheDocument();
            expect(trigger("Keep the old title")).toBeInTheDocument();
        });

        it("is named by its children where it was given any", () => {
            renderInlineEdit(
                {},
                <>
                    {fieldParts}
                    <InlineEdit.Control>
                        <InlineEdit.EditTrigger>Rename</InlineEdit.EditTrigger>
                    </InlineEdit.Control>
                </>,
            );

            expect(trigger("Rename")).toBe(part("EditTrigger"));
        });

        it("stands as tall as the field beside it", () => {
            renderInlineEdit({ size: "small" });

            expect(part("EditTrigger")).toHaveAttribute("data-size", "small");
            expect(field()).toHaveAttribute("data-size", "small");
            expect(preview()).toHaveAttribute("data-size", "small");
        });

        it("still calls a press handler of the caller's own", () => {
            const onClick = vi.fn();
            renderInlineEdit(
                {},
                <>
                    {fieldParts}
                    <InlineEdit.Control>
                        <InlineEdit.EditTrigger onClick={onClick} />
                    </InlineEdit.Control>
                </>,
            );

            fireEvent.click(trigger("Edit"));

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(field()).toBeVisible();
        });

        it("leaves the edit alone where the caller has answered the press", () => {
            renderInlineEdit(
                {},
                <>
                    {fieldParts}
                    <InlineEdit.Control>
                        <InlineEdit.EditTrigger onClick={(event) => event.preventDefault()} />
                    </InlineEdit.Control>
                </>,
            );

            fireEvent.click(trigger("Edit"));

            expect(field()).not.toBeVisible();
        });
    });

    it("takes the name off the screen while keeping it in the accessibility tree", () => {
        render(
            <InlineEdit defaultValue={VALUE}>
                <InlineEdit.Label visuallyHidden>Title</InlineEdit.Label>
                <InlineEdit.Area>
                    <InlineEdit.Input />
                    <InlineEdit.Preview />
                </InlineEdit.Area>
            </InlineEdit>,
        );

        expect(part("Label")).toHaveClass("sr-only");
        expect(screen.getByRole("button", { name: `Title ${VALUE}` })).toBe(preview());
    });

    it("forwards a ref to the root, the field and the preview", () => {
        const rootRef = React.createRef<HTMLDivElement>();
        const inputRef = React.createRef<HTMLInputElement>();
        const previewRef = React.createRef<HTMLSpanElement>();
        render(
            <InlineEdit ref={rootRef} defaultValue={VALUE}>
                <InlineEdit.Area>
                    <InlineEdit.Input ref={inputRef} />
                    <InlineEdit.Preview ref={previewRef} />
                </InlineEdit.Area>
            </InlineEdit>,
        );

        expect(rootRef.current).toBe(root());
        expect(inputRef.current).toBe(field());
        expect(previewRef.current).toBe(preview());
    });

    it("merges a custom className onto each part", () => {
        render(
            <InlineEdit className="root" defaultValue={VALUE}>
                <InlineEdit.Label className="label">Title</InlineEdit.Label>
                <InlineEdit.Area className="area">
                    <InlineEdit.Input className="field" />
                    <InlineEdit.Preview className="preview" />
                </InlineEdit.Area>
                <InlineEdit.Control className="control">
                    <InlineEdit.EditTrigger className="edit" />
                    <InlineEdit.SubmitTrigger className="submit" />
                    <InlineEdit.CancelTrigger className="cancel" />
                </InlineEdit.Control>
            </InlineEdit>,
        );

        expect(root()).toHaveClass("inline-edit", "root");
        expect(part("Label")).toHaveClass("inline-edit-label", "label");
        expect(part("Area")).toHaveClass("inline-edit-area", "area");
        expect(field()).toHaveClass("inline-edit-input", "input", "field");
        expect(preview()).toHaveClass("inline-edit-preview", "preview");
        expect(part("Control")).toHaveClass("inline-edit-control", "control");
        expect(part("EditTrigger")).toHaveClass("inline-edit-edit-trigger", "edit");
        expect(part("SubmitTrigger")).toHaveClass("inline-edit-submit-trigger", "submit");
        expect(part("CancelTrigger")).toHaveClass("inline-edit-cancel-trigger", "cancel");
    });
});
