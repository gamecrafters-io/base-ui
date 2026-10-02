import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { DirectionProvider } from "../../providers/direction";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { TagInput, useTagInput, useTagInputContext } from ".";
import type { TagInputProps, UseTagInputReturn } from "./TagInput.types";

const TAGS = ["react", "solid", "vue"];

// The tags drawn from what the tag input holds, each an item given no children of its own
const items = (
    <TagInput.Context>
        {(tagInput) =>
            tagInput.value.map((value, index) => (
                <TagInput.Item key={index} index={index} value={value} />
            ))
        }
    </TagInput.Context>
);

const parts = (
    <>
        <TagInput.Label>Frameworks</TagInput.Label>
        <TagInput.Control>
            {items}
            <TagInput.Input placeholder="Add a framework" />
            <TagInput.ClearTrigger />
        </TagInput.Control>
        <TagInput.HiddenInput />
    </>
);

const renderTagInput = (props: Partial<TagInputProps> = {}, children = parts) =>
    render(
        <TagInput defaultValue={TAGS} {...props}>
            {children}
        </TagInput>,
    );

const root = () => document.querySelector('[data-component="TagInput"]') as HTMLElement;

const part = (name: string) =>
    document.querySelector(`[data-component="TagInput.${name}"]`) as HTMLElement;

const field = () => part("Input") as HTMLInputElement;

const hiddenInput = () => part("HiddenInput") as HTMLInputElement;

const preview = (value: string) =>
    document.querySelector(
        `[data-component="TagInput.ItemPreview"][data-value="${value}"]`,
    ) as HTMLElement;

const itemInput = (value: string) =>
    document
        .querySelector(`[data-component="TagInput.Item"][data-value="${value}"]`)
        ?.querySelector('[data-component="TagInput.ItemInput"]') as HTMLInputElement;

// The tags as they stand in the control, in the order they are drawn
const tags = () =>
    Array.from(document.querySelectorAll('[data-component="TagInput.Item"]')).map((item) =>
        item.getAttribute("data-value"),
    );

const highlighted = () =>
    document
        .querySelector('[data-component="TagInput.ItemPreview"][data-highlighted]')
        ?.getAttribute("data-value") ?? null;

const announcement = () => part("LiveRegion").textContent;

const button = (name: string) => screen.getByRole("button", { name });

const focus = (element: HTMLElement) => {
    act(() => element.focus());
};

const press = (element: HTMLElement, key: string, init: Partial<KeyboardEventInit> = {}) =>
    fireEvent.keyDown(element, { key, ...init });

const type = (text: string) => fireEvent.change(field(), { target: { value: text } });

// Types a tag and finishes it with Enter, the way a reader adds one
const addTag = (text: string) => {
    type(text);
    press(field(), "Enter");
};

// Puts the reader in the field and moves them back onto the last tag
const moveOntoTags = () => {
    focus(field());
    press(field(), "ArrowLeft");
};

describe("TagInput", () => {
    it("tags the tag input and its parts with data-component attributes", () => {
        renderTagInput();

        for (const name of [
            "TagInput",
            "TagInput.Label",
            "TagInput.Control",
            "TagInput.Input",
            "TagInput.ClearTrigger",
            "TagInput.Item",
            "TagInput.ItemPreview",
            "TagInput.ItemText",
            "TagInput.ItemDeleteTrigger",
            "TagInput.ItemInput",
            "TagInput.HiddenInput",
            "TagInput.LiveRegion",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("names its parts from an id of the caller's own", () => {
        renderTagInput({ id: "frameworks" });

        expect(root()).toHaveAttribute("id", "frameworks");
        expect(part("Label")).toHaveAttribute("id", "frameworks-label");
        expect(part("Control")).toHaveAttribute("id", "frameworks-control");
        expect(field()).toHaveAttribute("id", "frameworks-input");
        expect(hiddenInput()).toHaveAttribute("id", "frameworks-hidden-input");
        expect(part("ClearTrigger")).toHaveAttribute("id", "frameworks-clear-trigger");
        expect(part("Item")).toHaveAttribute("id", "frameworks-item-0");
        expect(part("ItemPreview")).toHaveAttribute("id", "frameworks-item-0-preview");
        expect(part("ItemInput")).toHaveAttribute("id", "frameworks-item-0-input");
        expect(part("ItemDeleteTrigger")).toHaveAttribute("id", "frameworks-item-0-delete-trigger");
    });

    it("takes a name for any one part in place of the one worked out for it", () => {
        renderTagInput({ ids: { input: "custom-input" } });

        expect(field()).toHaveAttribute("id", "custom-input");
        expect(part("Label")).toHaveAttribute("for", "custom-input");
    });

    it("names the field after the label", () => {
        renderTagInput();
        expect(screen.getByRole("textbox", { name: "Frameworks" })).toBe(field());
    });

    it("draws nothing for a part standing outside a tag input", () => {
        const { container } = render(<TagInput.Input />);
        expect(container).toBeEmptyDOMElement();
    });

    it("forwards refs to the elements its parts render", () => {
        const rootRef = React.createRef<HTMLDivElement>();
        const inputRef = React.createRef<HTMLInputElement>();
        const itemRef = React.createRef<HTMLDivElement>();

        render(
            <TagInput ref={rootRef} defaultValue={["react"]}>
                <TagInput.Control>
                    <TagInput.Item ref={itemRef} index={0} value="react" />
                    <TagInput.Input ref={inputRef} aria-label="Frameworks" />
                </TagInput.Control>
            </TagInput>,
        );

        expect(rootRef.current).toBe(root());
        expect(inputRef.current).toBe(field());
        expect(itemRef.current).toBe(part("Item"));
    });

    describe("showing the tags", () => {
        it("draws a tag for each value, with its text and a button that takes it out", () => {
            renderTagInput();

            expect(tags()).toEqual(TAGS);
            expect(preview("solid")).toHaveTextContent("solid");
            expect(button("Delete tag solid")).toBeInTheDocument();
        });

        it("draws each tag as a token a step smaller than the field", () => {
            renderTagInput({ size: "small" });

            expect(preview("react")).toHaveClass("token", "token-default", "token-small");
            expect(part("Control")).toHaveClass("input", "input-small");
        });

        it("draws a tag from the parts it is given in place of its own", () => {
            render(
                <TagInput defaultValue={["react"]}>
                    <TagInput.Control>
                        <TagInput.Item index={0} value="react">
                            <TagInput.ItemPreview>
                                <TagInput.ItemText>React 19</TagInput.ItemText>
                            </TagInput.ItemPreview>
                        </TagInput.Item>
                        <TagInput.Input aria-label="Frameworks" />
                    </TagInput.Control>
                </TagInput>,
            );

            expect(preview("react")).toHaveTextContent("React 19");
            expect(part("ItemDeleteTrigger")).toBeNull();
        });

        it("stands its placeholder in the field only while there are no tags", () => {
            render(
                <TagInput defaultValue={[]} placeholder="Add a framework">
                    <TagInput.Control>
                        {items}
                        <TagInput.Input aria-label="Frameworks" />
                    </TagInput.Control>
                </TagInput>,
            );
            expect(field()).toHaveAttribute("placeholder", "Add a framework");

            addTag("react");
            expect(field()).not.toHaveAttribute("placeholder");
        });

        it("keeps a placeholder the field was given itself whatever it holds", () => {
            renderTagInput();
            expect(field()).toHaveAttribute("placeholder", "Add a framework");
        });

        it("says whether it holds anything", () => {
            renderTagInput({ defaultValue: [] });
            expect(root()).toHaveAttribute("data-empty");

            addTag("react");
            expect(root()).not.toHaveAttribute("data-empty");
        });

        it("submits the tags with its form, as one value with a comma between each", () => {
            render(
                <form aria-label="Project">
                    <TagInput defaultValue={TAGS} name="frameworks">
                        {parts}
                    </TagInput>
                </form>,
            );

            const form = screen.getByRole("form", { name: "Project" }) as HTMLFormElement;

            expect(hiddenInput()).toHaveValue("react, solid, vue");
            expect(new FormData(form).get("frameworks")).toBe("react, solid, vue");
        });
    });

    describe("adding a tag", () => {
        it("takes what was typed in as a tag on Enter, and empties the field", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            addTag("angular");

            expect(tags()).toEqual([...TAGS, "angular"]);
            expect(field()).toHaveValue("");
            expect(onValueChange).toHaveBeenCalledWith([...TAGS, "angular"]);
        });

        it("says that the tag was added", () => {
            renderTagInput();

            addTag("angular");

            expect(announcement()).toBe("Added tag angular");
        });

        it("takes Enter while there is a tag to finish, and leaves it to the form if not", () => {
            renderTagInput();

            // fireEvent hands back false where the event was taken
            expect(press(field(), "Enter")).toBe(true);

            type("angular");
            expect(press(field(), "Enter")).toBe(false);
        });

        it("finishes a tag with the delimiter, which is never left in the field", () => {
            renderTagInput();

            type("angular,");

            expect(tags()).toEqual([...TAGS, "angular"]);
            expect(field()).toHaveValue("");
        });

        it("leaves nothing behind for a delimiter typed into an empty field", () => {
            renderTagInput();

            type(",");

            expect(tags()).toEqual(TAGS);
            expect(field()).toHaveValue("");
        });

        it("finishes a tag with whichever delimiter it is told to", () => {
            renderTagInput({ delimiter: ";" });

            type("angular,");
            expect(tags()).toEqual(TAGS);

            type("angular;");
            expect(tags()).toEqual([...TAGS, "angular"]);
        });

        it("finishes a tag with anything a delimiter pattern matches", () => {
            renderTagInput({ delimiter: /[,;\s]/ });

            type("angular ");
            type("svelte;");

            expect(tags()).toEqual([...TAGS, "angular", "svelte"]);
        });

        it("trims the space either side of a tag", () => {
            renderTagInput();

            addTag("  angular  ");

            expect(tags()).toEqual([...TAGS, "angular"]);
        });

        it("tidies a tag however it is told to", () => {
            renderTagInput({ sanitizeValue: (value) => value.trim().toLowerCase() });

            addTag("Angular");

            expect(tags()).toEqual([...TAGS, "angular"]);
        });

        it("takes nothing but space for no tag at all", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            addTag("   ");

            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("lets a tag already there go, emptying the field", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            addTag("solid");

            expect(tags()).toEqual(TAGS);
            expect(field()).toHaveValue("");
            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("takes a tag already there as a second one where it is allowed to", () => {
            renderTagInput({ allowDuplicates: true });

            addTag("solid");

            expect(tags()).toEqual([...TAGS, "solid"]);
        });

        it("turns away a tag the validation refuses, and leaves it to be put right", () => {
            const onValueInvalid = vi.fn();
            const validate = vi.fn((inputValue: string) => inputValue.length >= 3);
            renderTagInput({ validate, onValueInvalid });

            addTag("ng");

            expect(validate).toHaveBeenCalledWith("ng", TAGS);
            expect(tags()).toEqual(TAGS);
            expect(field()).toHaveValue("ng");
            expect(onValueInvalid).toHaveBeenCalledWith("invalidTag");
        });

        it("turns away a tag once the list is as long as it can grow", () => {
            const onValueInvalid = vi.fn();
            renderTagInput({ max: 3, onValueInvalid });

            addTag("angular");

            expect(tags()).toEqual(TAGS);
            expect(field()).toHaveValue("angular");
            expect(onValueInvalid).toHaveBeenCalledWith("rangeOverflow");
        });

        it("grows past its limit where it is allowed to, and reads as invalid while it has", () => {
            const onValueInvalid = vi.fn();
            renderTagInput({ max: 3, allowOverflow: true, onValueInvalid });

            expect(root()).not.toHaveAttribute("data-invalid");

            addTag("angular");

            expect(tags()).toEqual([...TAGS, "angular"]);
            expect(onValueInvalid).toHaveBeenCalledTimes(1);
            expect(onValueInvalid).toHaveBeenCalledWith("rangeOverflow");
            expect(root()).toHaveAttribute("data-invalid");
            expect(field()).toHaveAttribute("aria-invalid", "true");
            expect(part("Control")).toHaveClass("input-error");
        });

        it("holds a tag to the most characters it is told to", () => {
            renderTagInput({ maxLength: 10 });
            expect(field()).toHaveAttribute("maxlength", "10");
        });

        it("leaves a key pressed while a character is being composed to the composition", () => {
            renderTagInput();

            type("angular");
            press(field(), "Enter", { isComposing: true });

            expect(tags()).toEqual(TAGS);
        });
    });

    describe("pasting", () => {
        const paste = (text: string) => {
            fireEvent.paste(field());
            type(text);
        };

        it("leaves pasted text in the field, delimiters and all", () => {
            renderTagInput();

            paste("angular, svelte,");

            expect(tags()).toEqual(TAGS);
            expect(field()).toHaveValue("angular, svelte,");
        });

        it("splits pasted text into tags at the delimiter where it is told to", () => {
            const onValueChange = vi.fn();
            renderTagInput({ addOnPaste: true, onValueChange });

            paste("angular, svelte,, qwik");

            expect(tags()).toEqual([...TAGS, "angular", "svelte", "qwik"]);
            expect(onValueChange).toHaveBeenCalledTimes(1);
            expect(field()).toHaveValue("");
            expect(announcement()).toBe("Pasted 3 tags");
        });

        it("takes in only as many pasted tags as the list has room for", () => {
            const onValueInvalid = vi.fn();
            renderTagInput({ addOnPaste: true, max: 4, onValueInvalid });

            paste("angular,svelte");

            expect(tags()).toEqual([...TAGS, "angular"]);
            expect(onValueInvalid).toHaveBeenCalledWith("rangeOverflow");
        });

        it("only splits the paste itself, and not what is typed after it", () => {
            renderTagInput({ addOnPaste: true });

            paste("angular");
            type("svelte, qwik");

            expect(tags()).toEqual([...TAGS, "angular"]);
            expect(field()).toHaveValue("svelte, qwik");
        });
    });

    describe("moving along the tags", () => {
        it("moves onto the last tag from the start of the field", () => {
            const onHighlightChange = vi.fn();
            renderTagInput({ onHighlightChange });

            moveOntoTags();

            expect(highlighted()).toBe("vue");
            expect(onHighlightChange).toHaveBeenCalledWith("vue");
            expect(field()).toHaveFocus();
        });

        it("says which tag the reader is on, and what can be done with it", () => {
            renderTagInput();

            moveOntoTags();

            expect(announcement()).toBe(
                "Tag vue selected. Press enter to edit, delete or backspace to remove.",
            );
        });

        it("leaves the caret to move along what was typed until it reaches the start", () => {
            renderTagInput();

            focus(field());
            type("ang");
            press(field(), "ArrowLeft");

            expect(highlighted()).toBeNull();
        });

        it("moves onto the last tag on rubbing out past the start of the field", () => {
            renderTagInput();

            focus(field());
            press(field(), "Backspace");

            expect(highlighted()).toBe("vue");
            expect(tags()).toEqual(TAGS);
        });

        it("moves back a tag at a time, and stops at the first", () => {
            renderTagInput();

            moveOntoTags();
            press(field(), "ArrowLeft");
            expect(highlighted()).toBe("solid");

            press(field(), "ArrowLeft");
            press(field(), "ArrowLeft");
            expect(highlighted()).toBe("react");
        });

        it("moves forward a tag at a time, and back into the field from the last", () => {
            renderTagInput();

            moveOntoTags();
            press(field(), "ArrowLeft");

            // fireEvent hands back false where the event was taken
            expect(press(field(), "ArrowRight")).toBe(false);
            expect(highlighted()).toBe("vue");

            press(field(), "ArrowRight");
            expect(highlighted()).toBeNull();
        });

        it("moves back into the field on Escape or ArrowDown", () => {
            renderTagInput();

            moveOntoTags();
            expect(press(field(), "Escape")).toBe(false);
            expect(highlighted()).toBeNull();

            moveOntoTags();
            press(field(), "ArrowDown");
            expect(highlighted()).toBeNull();
        });

        it("leaves Escape alone while the reader is in the field", () => {
            renderTagInput();

            focus(field());

            expect(press(field(), "Escape")).toBe(true);
        });

        it("moves back into the field as soon as something is typed", () => {
            const onHighlightChange = vi.fn();
            renderTagInput({ onHighlightChange });

            moveOntoTags();
            type("a");

            expect(highlighted()).toBeNull();
            expect(onHighlightChange).toHaveBeenLastCalledWith(null);
            expect(field()).toHaveValue("a");
        });

        it("moves the other way along the tags on a page read from right to left", () => {
            render(
                <DirectionProvider direction="rtl">
                    <TagInput defaultValue={TAGS}>{parts}</TagInput>
                </DirectionProvider>,
            );

            focus(field());
            press(field(), "ArrowLeft");
            expect(highlighted()).toBeNull();

            press(field(), "ArrowRight");
            expect(highlighted()).toBe("vue");

            press(field(), "ArrowRight");
            expect(highlighted()).toBe("solid");

            press(field(), "ArrowLeft");
            expect(highlighted()).toBe("vue");
        });

        it("moves onto a tag that is pressed, keeping the caret in the field", () => {
            renderTagInput();

            // fireEvent hands back false where the event was taken
            expect(fireEvent.mouseDown(preview("solid"))).toBe(false);
            expect(highlighted()).toBe("solid");
            expect(field()).toHaveFocus();
        });

        it("puts the reader in the field on a press between the tags", () => {
            renderTagInput();

            moveOntoTags();
            fireEvent.mouseDown(part("Control"));

            expect(highlighted()).toBeNull();
            expect(field()).toHaveFocus();
        });
    });

    describe("taking a tag out", () => {
        it("takes out the tag the reader is on with Backspace, moving onto the one before", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            moveOntoTags();
            press(field(), "Backspace");

            expect(tags()).toEqual(["react", "solid"]);
            expect(onValueChange).toHaveBeenCalledWith(["react", "solid"]);
            expect(highlighted()).toBe("solid");
            expect(announcement()).toBe(
                "Tag vue deleted. Tag solid selected. Press enter to edit, delete or backspace to remove.",
            );
        });

        it("moves onto the new first tag where the first is taken out", () => {
            renderTagInput();

            moveOntoTags();
            press(field(), "ArrowLeft");
            press(field(), "ArrowLeft");
            press(field(), "Backspace");

            expect(tags()).toEqual(["solid", "vue"]);
            expect(highlighted()).toBe("solid");
        });

        it("takes out the tag the reader is on with Delete, and moves onto the one after", () => {
            renderTagInput();

            moveOntoTags();
            press(field(), "ArrowLeft");
            press(field(), "Delete");

            expect(tags()).toEqual(["react", "vue"]);
            expect(highlighted()).toBe("vue");
        });

        it("moves back into the field where the last tag is taken out with Delete", () => {
            renderTagInput();

            moveOntoTags();
            press(field(), "Delete");

            expect(tags()).toEqual(["react", "solid"]);
            expect(highlighted()).toBeNull();
            expect(announcement()).toBe("Tag vue deleted");
        });

        it("takes a tag out with the button it carries, putting the reader in the field", () => {
            renderTagInput();

            fireEvent.mouseDown(button("Delete tag solid"));
            fireEvent.click(button("Delete tag solid"));

            expect(tags()).toEqual(["react", "vue"]);
            expect(highlighted()).toBeNull();
            expect(field()).toHaveFocus();
            expect(announcement()).toBe("Tag solid deleted");
        });

        it("keeps the button that takes a tag out out of the tab order", () => {
            renderTagInput();
            expect(button("Delete tag solid")).toHaveAttribute("tabindex", "-1");
        });

        it("clears every tag and whatever was typed with the clear trigger", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            type("ang");
            fireEvent.click(button("Clear all tags"));

            expect(tags()).toEqual([]);
            expect(field()).toHaveValue("");
            expect(onValueChange).toHaveBeenCalledWith([]);
            expect(field()).toHaveFocus();
            expect(announcement()).toBe("No tags selected");
        });

        it("stands the clear trigger down while there is nothing to clear", () => {
            renderTagInput({ defaultValue: [] });
            expect(part("ClearTrigger")).toBeNull();

            type("ang");
            expect(part("ClearTrigger")).toBeInTheDocument();
        });
    });

    describe("editing a tag", () => {
        const startEditing = (value: string) => {
            fireEvent.mouseDown(preview(value));
            press(field(), "Enter");
        };

        it("edits the tag the reader is on, in a field standing where it stood", () => {
            renderTagInput();

            startEditing("solid");

            expect(preview("solid")).not.toBeVisible();
            expect(itemInput("solid")).toBeVisible();
            expect(itemInput("solid")).toHaveValue("solid");
            expect(itemInput("solid")).toHaveFocus();
            expect(itemInput("solid").selectionStart).toBe(0);
            expect(itemInput("solid").selectionEnd).toBe("solid".length);
        });

        it("names the field a tag is edited in after the tag", () => {
            renderTagInput();

            startEditing("solid");

            expect(itemInput("solid")).toHaveAccessibleName(
                "Editing tag solid. Press enter to save or escape to cancel.",
            );
        });

        it("edits a tag on a double press", () => {
            renderTagInput();

            fireEvent.doubleClick(preview("vue"));

            expect(itemInput("vue")).toBeVisible();
        });

        it("keeps the edit on Enter, and leaves the reader on the tag", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            startEditing("solid");
            fireEvent.change(itemInput("solid"), { target: { value: "svelte" } });
            expect(press(itemInput("solid"), "Enter")).toBe(false);

            expect(tags()).toEqual(["react", "svelte", "vue"]);
            expect(onValueChange).toHaveBeenCalledWith(["react", "svelte", "vue"]);
            expect(highlighted()).toBe("svelte");
            expect(field()).toHaveFocus();
            expect(announcement()).toBe(
                "Tag updated to svelte. Tag svelte selected. Press enter to edit, delete or backspace to remove.",
            );
        });

        it("throws the edit away on Escape", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            startEditing("solid");
            fireEvent.change(itemInput("solid"), { target: { value: "svelte" } });

            // fireEvent hands back false where the event was taken, which keeps a dialog the tag
            // input stands in from closing as well
            expect(press(itemInput("solid"), "Escape")).toBe(false);

            expect(tags()).toEqual(TAGS);
            expect(onValueChange).not.toHaveBeenCalled();
            expect(highlighted()).toBe("solid");
            expect(field()).toHaveFocus();
        });

        it("takes out a tag edited down to nothing", () => {
            renderTagInput();

            startEditing("solid");
            fireEvent.change(itemInput("solid"), { target: { value: "  " } });
            press(itemInput("solid"), "Enter");

            expect(tags()).toEqual(["react", "vue"]);
            expect(highlighted()).toBe("vue");
        });

        it("leaves a tag edited into one already there as it was", () => {
            const onValueChange = vi.fn();
            renderTagInput({ onValueChange });

            startEditing("solid");
            fireEvent.change(itemInput("solid"), { target: { value: "vue" } });
            press(itemInput("solid"), "Enter");

            expect(tags()).toEqual(TAGS);
            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("keeps an edit the caller's validation refuses open to be put right", () => {
            const onValueInvalid = vi.fn();
            renderTagInput({ validate: (inputValue) => inputValue.length >= 3, onValueInvalid });

            startEditing("solid");
            fireEvent.change(itemInput("solid"), { target: { value: "ng" } });
            press(itemInput("solid"), "Enter");

            expect(onValueInvalid).toHaveBeenCalledWith("invalidTag");
            expect(tags()).toEqual(TAGS);
            expect(itemInput("solid")).toBeVisible();
            expect(itemInput("solid")).toHaveFocus();
        });

        it("throws the edit away where the reader moves off it some other way", () => {
            render(
                <>
                    <TagInput defaultValue={TAGS}>{parts}</TagInput>
                    <Button>Somewhere else</Button>
                </>,
            );

            startEditing("solid");
            fireEvent.change(itemInput("solid"), { target: { value: "svelte" } });
            focus(button("Somewhere else"));

            expect(tags()).toEqual(TAGS);
            expect(itemInput("solid")).not.toBeVisible();
            expect(preview("solid")).toBeVisible();
        });

        it("is not edited where tags cannot be", () => {
            renderTagInput({ editable: false });

            startEditing("solid");
            fireEvent.doubleClick(preview("vue"));

            expect(itemInput("solid")).not.toBeVisible();
            expect(itemInput("vue")).not.toBeVisible();
        });

        it("does not offer Enter to a reader on a tag that cannot be edited", () => {
            renderTagInput({ editable: false });

            moveOntoTags();

            expect(announcement()).toBe("Tag vue selected. Press delete or backspace to remove.");
        });
    });

    describe("leaving", () => {
        it("says the reader is in it while they are", () => {
            renderTagInput();

            focus(field());
            expect(root()).toHaveAttribute("data-focus");

            fireEvent.mouseDown(document.body);
            expect(root()).not.toHaveAttribute("data-focus");
        });

        it("moves the reader off the tags as they leave", () => {
            renderTagInput();

            moveOntoTags();
            fireEvent.mouseDown(document.body);

            expect(highlighted()).toBeNull();
        });

        it("leaves what was typed in the field by default", () => {
            renderTagInput();

            focus(field());
            type("ang");
            fireEvent.mouseDown(document.body);

            expect(tags()).toEqual(TAGS);
            expect(field()).toHaveValue("ang");
        });

        it("takes what was typed in as a tag where it is told to", () => {
            render(
                <>
                    <TagInput defaultValue={TAGS} blurBehavior="add">
                        {parts}
                    </TagInput>
                    <Button>Somewhere else</Button>
                </>,
            );

            focus(field());
            type("angular");
            focus(button("Somewhere else"));

            expect(tags()).toEqual([...TAGS, "angular"]);
            expect(field()).toHaveValue("");
        });

        it("empties the field where it is told to", () => {
            renderTagInput({ blurBehavior: "clear" });

            focus(field());
            type("ang");
            fireEvent.mouseDown(document.body);

            expect(field()).toHaveValue("");
        });

        it("is not left by a press on one of its own parts", () => {
            renderTagInput({ blurBehavior: "add" });

            focus(field());
            type("ang");
            fireEvent.mouseDown(part("Label"));

            expect(tags()).toEqual(TAGS);
            expect(root()).toHaveAttribute("data-focus");
        });
    });

    describe("when it cannot be changed", () => {
        it("stops the tags being added or taken out while it is disabled", () => {
            const onValueChange = vi.fn();
            renderTagInput({ disabled: true, onValueChange });

            expect(field()).toBeDisabled();
            expect(button("Delete tag solid")).toBeDisabled();
            expect(button("Clear all tags")).toBeDisabled();
            expect(root()).toHaveAttribute("data-disabled");
            expect(part("Control")).toHaveClass("input-disabled");

            press(field(), "Backspace");
            fireEvent.mouseDown(preview("solid"));
            fireEvent.doubleClick(preview("solid"));

            expect(highlighted()).toBeNull();
            expect(itemInput("solid")).not.toBeVisible();
            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("submits nothing while it is disabled", () => {
            renderTagInput({ disabled: true, name: "frameworks" });
            expect(hiddenInput()).toBeDisabled();
        });

        it("leaves the tags to be read but not changed while it is read-only", () => {
            const onValueChange = vi.fn();
            renderTagInput({ readOnly: true, onValueChange, name: "frameworks" });

            expect(field()).toHaveAttribute("readonly");
            expect(field()).not.toBeDisabled();
            expect(hiddenInput()).not.toBeDisabled();
            expect(root()).toHaveAttribute("data-readonly");

            // Nothing can be taken out, so nothing offers to take anything out
            expect(part("ItemDeleteTrigger")).not.toBeVisible();
            expect(part("ClearTrigger")).toBeNull();

            focus(field());
            press(field(), "Backspace");
            press(field(), "Backspace");

            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("leaves a tag that is disabled on its own where it stands", () => {
            render(
                <TagInput defaultValue={TAGS}>
                    <TagInput.Control>
                        <TagInput.Context>
                            {(tagInput) =>
                                tagInput.value.map((value, index) => (
                                    <TagInput.Item
                                        key={index}
                                        index={index}
                                        value={value}
                                        disabled={value === "solid"}
                                    />
                                ))
                            }
                        </TagInput.Context>
                        <TagInput.Input aria-label="Frameworks" />
                    </TagInput.Control>
                </TagInput>,
            );

            expect(button("Delete tag solid")).toBeDisabled();
            expect(button("Delete tag vue")).not.toBeDisabled();
            expect(preview("solid")).toHaveAttribute("data-disabled");

            fireEvent.mouseDown(preview("solid"));
            expect(highlighted()).toBeNull();
        });
    });

    describe("required", () => {
        it("asks for a tag only while it has none", () => {
            renderTagInput({ required: true, defaultValue: [] });

            expect(field()).toHaveAttribute("required");

            addTag("react");

            // Still named as required, though the browser no longer has anything to ask for
            expect(field()).not.toHaveAttribute("required");
            expect(field()).toHaveAttribute("aria-required", "true");
        });
    });

    describe("where the caller keeps hold of it", () => {
        it("follows the tags it is given, reporting changes rather than making them", () => {
            const onValueChange = vi.fn();
            const { rerender } = render(
                <TagInput value={TAGS} onValueChange={onValueChange}>
                    {parts}
                </TagInput>,
            );

            addTag("angular");

            expect(onValueChange).toHaveBeenCalledWith([...TAGS, "angular"]);
            expect(tags()).toEqual(TAGS);

            rerender(
                <TagInput value={["qwik"]} onValueChange={onValueChange}>
                    {parts}
                </TagInput>,
            );

            expect(tags()).toEqual(["qwik"]);
        });

        it("follows what is being typed where the caller holds that", () => {
            const onInputValueChange = vi.fn();
            render(
                <TagInput
                    defaultValue={TAGS}
                    inputValue="ang"
                    onInputValueChange={onInputValueChange}
                >
                    {parts}
                </TagInput>,
            );

            expect(field()).toHaveValue("ang");

            type("angu");

            expect(onInputValueChange).toHaveBeenCalledWith("angu");
            expect(field()).toHaveValue("ang");
        });
    });

    describe("in a form", () => {
        it("goes back to the tags it started with when the form is reset", () => {
            render(
                <form aria-label="Project">
                    <TagInput defaultValue={TAGS} name="frameworks">
                        {parts}
                    </TagInput>
                </form>,
            );

            addTag("angular");
            type("sve");

            act(() => {
                (screen.getByRole("form", { name: "Project" }) as HTMLFormElement).reset();
            });

            expect(tags()).toEqual(TAGS);
            expect(field()).toHaveValue("");
        });

        it("is wired into the form control around it", () => {
            render(
                <FormControl disabled required>
                    <FormControl.Label>Frameworks</FormControl.Label>
                    <TagInput defaultValue={TAGS}>
                        <TagInput.Control>
                            {items}
                            <TagInput.Input />
                        </TagInput.Control>
                    </TagInput>
                    <FormControl.Caption>The ones the project uses</FormControl.Caption>
                    <FormControl.Validation variant="error">Pick one</FormControl.Validation>
                </FormControl>,
            );

            const label = screen.getByText("Frameworks").closest("label");

            expect(field()).toHaveAttribute("id", label?.getAttribute("for"));
            expect(field()).toBeDisabled();
            expect(field()).toHaveAttribute("aria-required", "true");
            expect(field()).toHaveAttribute(
                "aria-describedby",
                `${screen.getByText("Pick one").id} ${screen.getByText("The ones the project uses").id}`,
            );
        });
    });

    describe("from outside", () => {
        // A tag input built from the hook, with buttons beside it reaching into the same state
        const Harness = ({ onReady }: { onReady: (tagInput: UseTagInputReturn) => void }) => {
            const tagInput = useTagInput({ defaultValue: TAGS });

            onReady(tagInput);

            return <TagInput.RootProvider value={tagInput}>{parts}</TagInput.RootProvider>;
        };

        const renderHarness = () => {
            let api = {} as UseTagInputReturn;

            render(<Harness onReady={(tagInput) => (api = tagInput)} />);

            return () => api;
        };

        it("is drawn from a hook of the caller's own", () => {
            renderHarness();
            expect(tags()).toEqual(TAGS);
        });

        it("takes tags in and out as it is asked to", () => {
            const api = renderHarness();

            act(() => api().addValue("angular"));
            expect(tags()).toEqual([...TAGS, "angular"]);

            act(() => api().clearValue(0));
            expect(tags()).toEqual(["solid", "vue", "angular"]);

            act(() => api().setValueAtIndex(0, "svelte"));
            expect(tags()).toEqual(["svelte", "vue", "angular"]);

            act(() => api().setValue(["qwik"]));
            expect(tags()).toEqual(["qwik"]);

            act(() => api().clearValue());
            expect(tags()).toEqual([]);
        });

        it("builds two changes asked for at once on each other", () => {
            const api = renderHarness();

            act(() => {
                api().addValue("angular");
                api().addValue("svelte");
            });

            expect(tags()).toEqual([...TAGS, "angular", "svelte"]);
        });

        it("sets and empties the field, and puts the reader in it", () => {
            const api = renderHarness();

            act(() => api().setInputValue("ang"));
            expect(field()).toHaveValue("ang");

            act(() => api().clearInputValue());
            expect(field()).toHaveValue("");

            act(() => api().focus());
            expect(field()).toHaveFocus();
        });

        it("hands what it holds to a part reading the context", () => {
            const Count = () => {
                const tagInput = useTagInputContext();

                return <span data-testid="count">{tagInput?.count}</span>;
            };

            render(
                <TagInput defaultValue={TAGS}>
                    {parts}
                    <Count />
                </TagInput>,
            );

            expect(screen.getByTestId("count")).toHaveTextContent("3");
        });

        it("hands each item what it stands for", () => {
            render(
                <TagInput defaultValue={["react"]}>
                    <TagInput.Control>
                        <TagInput.Item index={0} value="react">
                            <TagInput.ItemContext>
                                {(item) => (
                                    <span data-testid="item">
                                        {item.value} at {item.index}
                                    </span>
                                )}
                            </TagInput.ItemContext>
                        </TagInput.Item>
                        <TagInput.Input aria-label="Frameworks" />
                    </TagInput.Control>
                </TagInput>,
            );

            expect(screen.getByTestId("item")).toHaveTextContent("react at 0");
        });
    });

    it("puts the reader in the field as it is first drawn where it is told to", () => {
        renderTagInput({ autoFocus: true });
        expect(field()).toHaveFocus();
    });

    it("says what it is told to in place of its own words", () => {
        renderTagInput({
            translations: {
                clearTriggerLabel: "Alle Tags löschen",
                deleteTagTriggerLabel: (value) => `Tag ${value} löschen`,
                tagAdded: (value) => `Tag ${value} hinzugefügt`,
            },
        });

        expect(button("Alle Tags löschen")).toBe(part("ClearTrigger"));
        expect(button("Tag solid löschen")).toBeInTheDocument();

        addTag("angular");

        expect(announcement()).toBe("Tag angular hinzugefügt");
    });

    it("names its buttons as the parts are told to", () => {
        render(
            <TagInput defaultValue={["react"]}>
                <TagInput.Control>
                    <TagInput.Item index={0} value="react">
                        <TagInput.ItemPreview>
                            <TagInput.ItemText />
                            <TagInput.ItemDeleteTrigger label="Remove React" />
                        </TagInput.ItemPreview>
                    </TagInput.Item>
                    <TagInput.Input aria-label="Frameworks" />
                    <TagInput.ClearTrigger label="Remove everything" />
                </TagInput.Control>
            </TagInput>,
        );

        expect(button("Remove React")).toBeInTheDocument();
        expect(button("Remove everything")).toBeInTheDocument();
    });

    it("says the same thing twice over where the same thing happens twice", () => {
        renderTagInput();

        moveOntoTags();
        const first = part("LiveRegion").firstElementChild;

        press(field(), "ArrowRight");
        moveOntoTags();

        expect(announcement()).toBe(
            "Tag vue selected. Press enter to edit, delete or backspace to remove.",
        );
        expect(part("LiveRegion").firstElementChild).not.toBe(first);
    });
});
