import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useDirection } from "../../providers/direction/useDirection";
import { FormControlContext } from "../form-control/FormControlContext";
import type {
    TagInputAnnouncement,
    TagInputIds,
    TagInputItemIds,
    TagInputItemOptions,
    TagInputItemState,
    TagInputTranslations,
    UseTagInputProps,
    UseTagInputReturn,
} from "./TagInput.types";

// Stable, so that a tag input given no tags does not hand a fresh list down on every render
const NO_TAGS: string[] = [];

// What a tag is tidied with where the caller says nothing: the space either side of it is dropped,
// so "react " and "react" are the one tag
const trimTag = (value: string) => value.trim();

// Whether two lists hold the same tags in the same order, which is all that makes a change worth
// reporting
const isSameList = (one: string[], other: string[]) =>
    one.length === other.length && one.every((tag, index) => tag === other[index]);

// What was typed before the delimiter, where what is in the field ends with one, which is what says
// a tag has been finished. A pattern is read against the end of the text alone, and as a whole, so
// one standing for more than one character is not cut in two by the anchor. One that matches
// nothing at all finishes nothing, or every keystroke would finish a tag
const beforeDelimiter = (text: string, delimiter: string | RegExp | undefined) => {
    if (!delimiter) {
        return null;
    }

    if (typeof delimiter === "string") {
        return text.endsWith(delimiter) ? text.slice(0, text.length - delimiter.length) : null;
    }

    const flags = delimiter.flags.replace(/[gy]/g, "");
    const match = new RegExp(`(?:${delimiter.source})$`, flags).exec(text);

    return match && match[0] !== "" ? text.slice(0, match.index) : null;
};

// Whether the caret stands before everything in the field with nothing selected, which is where
// moving back along the field runs out and moves onto the tags instead
const isCaretAtStart = (input: HTMLInputElement) =>
    input.selectionStart === 0 && input.selectionEnd === 0;

const getDefaultTranslations = (editable: boolean): Required<TagInputTranslations> => ({
    clearTriggerLabel: "Clear all tags",
    deleteTagTriggerLabel: (value) => `Delete tag ${value}`,
    tagAdded: (value) => `Added tag ${value}`,
    tagsPasted: (values) => (values.length === 1 ? "Pasted 1 tag" : `Pasted ${values.length} tags`),
    tagEdited: (value) => `Editing tag ${value}. Press enter to save or escape to cancel.`,
    tagUpdated: (value) => `Tag updated to ${value}`,
    tagDeleted: (value) => `Tag ${value} deleted`,
    // Only a tag that can be edited is offered Enter as a way of editing it
    tagSelected: (value) =>
        editable
            ? `Tag ${value} selected. Press enter to edit, delete or backspace to remove.`
            : `Tag ${value} selected. Press delete or backspace to remove.`,
    noTagsSelected: "No tags selected",
});

// Which tag the reader is on, and what it said as they moved onto it, so that moving onto another
// tag standing at the same place, as the one there is taken out, still counts as a move
type TagInputHighlight = {
    index: number | null;
    value: string | null;
};

const NO_HIGHLIGHT: TagInputHighlight = { index: null, value: null };

// Where the reader is to be put once the tag input has been drawn again: in the field the tags are
// typed in, or in the one a tag is edited in, which is only on the page once it has
type TagInputFocusTarget = "input" | "item-input";

// How a tag typed into the field fared: there was nothing to take in, it was turned away and left
// in the field to be put right, or it was taken in, or found already there, and the field emptied
type TagInputSubmission = "empty" | "refused" | "taken";

// Everything a tag input needs and nothing that draws one: the tags, what is being typed for the
// next, which tag the reader is on and which is being edited, and the ways of changing them. The
// tag input is built on this, so a caller who wants to add or take out tags from somewhere else on
// the page is working from the same state the parts are.
//
//     const frameworks = useTagInput({ defaultValue: ["React"] });
//
//     <TagInput.RootProvider value={frameworks}>...</TagInput.RootProvider>
//     <Button onClick={() => frameworks.addValue("Solid")}>Add Solid</Button>
//
// A tag is typed into the field and finished with Enter or the delimiter. Moving back from the
// start of the field moves onto the tags, one at a time, with the caret held in the field the
// whole way: Backspace and Delete take the tag the reader is on out, and Enter edits it where it
// stands, which Enter keeps and Escape throws away.
//
// A tag input standing in a FormControl is wired into it: the field takes the field's id, so the
// name over the field points at it, and it is disabled, required and described as the field says
// unless it was told otherwise itself
export const useTagInput = (props: UseTagInputProps = {}): UseTagInputReturn => {
    const {
        value,
        defaultValue,
        inputValue,
        defaultInputValue,
        delimiter = ",",
        max = Infinity,
        allowOverflow = false,
        maxLength,
        allowDuplicates = false,
        addOnPaste = false,
        blurBehavior,
        editable = true,
        sanitizeValue = trimTag,
        validate,
        placeholder,
        autoFocus,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        translations,
        onValueChange,
        onInputValueChange,
        onHighlightChange,
        onValueInvalid,
    } = props;

    const field = React.useContext(FormControlContext);
    const direction = useDirection();
    const uuid = useId(id);

    const rootRef = React.useRef<HTMLDivElement>(null);

    const isDisabled = Boolean(disabled ?? field.disabled);
    const isReadOnly = Boolean(readOnly);
    const isInteractive = !isDisabled && !isReadOnly;

    // The parts are named from the tag input's own id, so that the label can point at the field
    // without having been told its name. Standing in a FormControl, the field takes the id the
    // FormControl's own name points at
    const resolvedIds: Required<TagInputIds> = {
        root: ids?.root ?? uuid,
        label: ids?.label ?? field.labelId ?? `${uuid}-label`,
        control: ids?.control ?? `${uuid}-control`,
        input: ids?.input ?? field.id ?? `${uuid}-input`,
        hiddenInput: ids?.hiddenInput ?? `${uuid}-hidden-input`,
        clearTrigger: ids?.clearTrigger ?? `${uuid}-clear-trigger`,
    };

    const getItemIds = (index: number): TagInputItemIds => {
        const item = `${resolvedIds.root}-item-${index}`;

        return {
            item,
            preview: `${item}-preview`,
            input: `${item}-input`,
            deleteTrigger: `${item}-delete-trigger`,
        };
    };

    // A translation the caller leaves out, or gives as nothing, falls back to the English one
    const resolvedTranslations = getDefaultTranslations(editable);

    for (const [key, translation] of Object.entries(translations ?? {})) {
        if (translation !== undefined) {
            Object.assign(resolvedTranslations, { [key]: translation });
        }
    }

    /* What the tag input holds */

    // A tag input the caller is holding the tags of takes them from the prop; one that is not keeps
    // its own
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue ?? NO_TAGS);
    const currentValue = isControlled ? value : selfValue;

    // The tags as they stand, kept beside the state so that two changes asked for in the one
    // breath, a tag taken out and the one beside it moved onto say, build on each other rather than
    // both on the render they were asked for from
    const valueRef = React.useRef(currentValue);

    useIsomorphicLayoutEffect(() => {
        valueRef.current = currentValue;
    });

    // What is being typed for the next tag, held the same two ways
    const isInputControlled = inputValue !== undefined;
    const [selfInputValue, setSelfInputValue] = React.useState(defaultInputValue ?? "");
    const currentInputValue = isInputControlled ? inputValue : selfInputValue;

    // What the tags and the field started out holding, which is what a form that is reset takes
    // them back to
    const initialValue = React.useRef(currentValue);
    const initialInputValue = React.useRef(currentInputValue);

    /* Where the reader is */

    const [focused, setFocused] = React.useState(false);

    // Whether the reader is in the tag input, known the moment they arrive or leave rather than
    // once it has been drawn again, so that leaving it two ways at once is only leaving it once
    const focusedRef = React.useRef(false);

    const [highlight, setHighlight] = React.useState(NO_HIGHLIGHT);
    const highlightRef = React.useRef(NO_HIGHLIGHT);

    const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
    const [editedValue, setEditedValue] = React.useState("");

    // Which tag is being edited, known the moment an edit starts or ends, so that an edit ended by
    // a key is not ended a second time by the blur that putting the reader back in the field sets
    // off
    const editingRef = React.useRef<number | null>(null);

    const pendingFocus = React.useRef<TagInputFocusTarget | null>(autoFocus ? "input" : null);

    // Set from a paste to the change it makes to the field, which is the one that carries the text
    const pastingRef = React.useRef(false);

    const [announcement, setAnnouncement] = React.useState<TagInputAnnouncement>({
        message: "",
        count: 0,
    });

    // A highlight the tags have run out from under, as they were changed from outside, is let go of
    const highlightedIndex =
        highlight.index !== null && highlight.index < currentValue.length ? highlight.index : null;

    /* Finding the parts on the page */

    const getElement = (elementId: string) => {
        const owner = rootRef.current?.ownerDocument ?? document;

        return owner.getElementById(elementId);
    };

    const focusInput = () => {
        const input = getElement(resolvedIds.input);

        if (input instanceof HTMLInputElement) {
            input.focus();
        }
    };

    // The field a tag is edited in is only on the page once the tag input has been drawn again, so
    // the reader is put there once that has happened, with what it holds selected so that typing
    // replaces it. Putting them in the field the tags are typed in waits the same way, for a tag
    // input that is focused as it is first drawn
    React.useEffect(() => {
        const target = pendingFocus.current;

        if (target === null) {
            return;
        }

        pendingFocus.current = null;

        if (target === "input") {
            focusInput();
            return;
        }

        const index = editingRef.current;
        const input = index === null ? null : getElement(getItemIds(index).input);

        if (input instanceof HTMLInputElement) {
            input.focus();
            input.select();
        }
    });

    /* What the tag input says */

    // What the tag input has just done, said to a screen reader. The tags change in front of a
    // sighted reader, but nothing on the page says so to one who cannot see them
    const announce = (message: string) => {
        setAnnouncement((previous) => ({ message, count: previous.count + 1 }));
    };

    // A tag taken out is said along with the one the reader is moved onto in its place, so that
    // both are heard rather than the second cutting the first off
    const announceDeletion = (removed: string | null, next: string | null) => {
        if (removed === null) {
            return;
        }

        const deleted = resolvedTranslations.tagDeleted(removed);

        announce(next === null ? deleted : `${deleted}. ${resolvedTranslations.tagSelected(next)}`);
    };

    /* Changing the tags */

    const commitValue = (next: string[]) => {
        const previous = valueRef.current;

        if (isSameList(next, previous)) {
            return;
        }

        valueRef.current = next;

        if (!isControlled) {
            setSelfValue(next);
        }

        onValueChange?.(next);

        // A list allowed to grow past its limit says so as it does, since that is where it stops
        // holding tags that will do
        if (next.length > max && previous.length <= max) {
            onValueInvalid?.("rangeOverflow");
        }
    };

    const commitInputValue = (next: string) => {
        if (next === currentInputValue) {
            return;
        }

        if (!isInputControlled) {
            setSelfInputValue(next);
        }

        onInputValueChange?.(next);
    };

    // Takes tags in, the one way whether they were typed, pasted or added from outside. A tag that
    // comes to nothing once it has been tidied is let go of, as is one already there unless
    // duplicates are allowed, since what was asked for is there already. A list at its limit, or a
    // tag the caller's validation turns away, is reported rather than taken in
    const addTags = (candidates: string[]) => {
        let next = valueRef.current;
        let refused = false;
        const added: string[] = [];

        for (const candidate of candidates) {
            const tag = sanitizeValue(candidate);

            if (tag === "" || (!allowDuplicates && next.includes(tag))) {
                continue;
            }

            // Nothing after the limit fits either, so the rest of a paste is let go of with it
            if (next.length >= max && !allowOverflow) {
                refused = true;
                onValueInvalid?.("rangeOverflow");
                break;
            }

            if (validate && !validate(tag, next)) {
                refused = true;
                onValueInvalid?.("invalidTag");
                continue;
            }

            next = [...next, tag];
            added.push(tag);
        }

        commitValue(next);

        return { added, refused };
    };

    // Takes what was typed in as a tag, and empties the field unless the tag was turned away, so
    // that a tag that will not do is left there to be put right
    const submitTag = (text: string): TagInputSubmission => {
        if (sanitizeValue(text) === "") {
            return "empty";
        }

        const { added, refused } = addTags([text]);

        if (refused) {
            return "refused";
        }

        commitInputValue("");

        if (added.length > 0) {
            announce(resolvedTranslations.tagAdded(added[0]));
        }

        return "taken";
    };

    // Splits pasted text into tags at the delimiter. The field is emptied whatever became of them,
    // since what was pasted has been read either way
    const pasteTags = (text: string) => {
        const { added } = addTags(delimiter ? text.split(delimiter) : [text]);

        commitInputValue("");

        if (added.length > 0) {
            announce(resolvedTranslations.tagsPasted(added));
        }
    };

    const deleteAt = (index: number) => {
        const list = valueRef.current;

        if (index < 0 || index >= list.length) {
            return null;
        }

        commitValue(list.filter((_, position) => position !== index));

        return list[index];
    };

    const clearAll = () => {
        if (editingRef.current !== null) {
            endEdit();
        }

        commitValue([]);
        commitInputValue("");
        highlightAt(null);
        announce(resolvedTranslations.noTagsSelected);
    };

    /* Moving along the tags */

    // Moves the reader onto the tag at the place given, or off the tags and back into the field. A
    // place the list does not reach is the field
    const highlightAt = (index: number | null, list = valueRef.current) => {
        const next: TagInputHighlight =
            index !== null && index >= 0 && index < list.length
                ? { index, value: list[index] }
                : NO_HIGHLIGHT;
        const previous = highlightRef.current;

        highlightRef.current = next;
        setHighlight(next);

        if (previous.index !== next.index || previous.value !== next.value) {
            onHighlightChange?.(next.value);
        }

        return next;
    };

    // Moves the reader onto a tag and says which it is, since the caret staying in the field is
    // all a screen reader would otherwise have to go on
    const selectTag = (index: number) => {
        const next = highlightAt(index);

        if (next.value !== null) {
            announce(resolvedTranslations.tagSelected(next.value));
        }
    };

    const markFocused = () => {
        if (focusedRef.current) {
            return;
        }

        focusedRef.current = true;
        setFocused(true);
    };

    /* Editing a tag where it stands */

    const startEdit = (index: number) => {
        const list = valueRef.current;

        if (!editable || !isInteractive || index < 0 || index >= list.length) {
            return;
        }

        editingRef.current = index;
        setEditingIndex(index);
        setEditedValue(list[index]);
        highlightAt(index);
        pendingFocus.current = "item-input";
        markFocused();
    };

    const endEdit = () => {
        editingRef.current = null;
        setEditingIndex(null);
        setEditedValue("");
    };

    // Keeps the edit. The reader is put back in the field and on the tag before the field the tag
    // was edited in is taken off the page, since a field taken away from under the reader would
    // drop them on the page instead
    const commitEdit = () => {
        const index = editingRef.current;

        if (index === null) {
            return;
        }

        const list = valueRef.current;
        const tag = sanitizeValue(editedValue);
        const others = list.filter((_, position) => position !== index);

        // A tag that will not do stays open to be put right, the way one typed into the field does
        if (tag !== "" && tag !== list[index] && validate && !validate(tag, others)) {
            onValueInvalid?.("invalidTag");
            return;
        }

        endEdit();
        focusInput();

        // A tag edited down to nothing is taken out, and the one that moves up into its place is
        // the one the reader is moved onto
        if (tag === "") {
            const removed = deleteAt(index);
            const next = highlightAt(index);

            announceDeletion(removed, next.value);
            return;
        }

        // A tag edited into one that is already there is left as it was
        const duplicate = !allowDuplicates && others.includes(tag);

        if (!duplicate && tag !== list[index]) {
            const next = [...list];

            next[index] = tag;
            commitValue(next);
            highlightAt(index);
            announce(
                `${resolvedTranslations.tagUpdated(tag)}. ${resolvedTranslations.tagSelected(tag)}`,
            );
            return;
        }

        selectTag(index);
    };

    // Throws the edit away, leaving the reader on the tag as it was
    const cancelEdit = () => {
        const index = editingRef.current;

        if (index === null) {
            return;
        }

        endEdit();
        focusInput();
        selectTag(index);
    };

    /* Leaving the tag input */

    // The latest way of leaving is held aside for the listeners below, which are set up once for as
    // long as the reader is in the tag input rather than again on every render
    const leaveRef = React.useRef(() => {});

    React.useEffect(() => {
        leaveRef.current = () => {
            if (!focusedRef.current) {
                return;
            }

            focusedRef.current = false;
            setFocused(false);
            highlightAt(null);

            // Only Enter keeps an edit, so one left some other way is thrown away
            if (editingRef.current !== null) {
                endEdit();
            }

            if (blurBehavior === "add") {
                submitTag(currentInputValue);
            } else if (blurBehavior === "clear") {
                commitInputValue("");
            }
        };
    });

    // A press anywhere but the tag input, or focus arriving anywhere but on it, is the reader
    // leaving it. The window losing focus is not, since the reader coming back to the window finds
    // the tag input as they left it.
    //
    // A press is read off the mouse rather than off a finger's first touch: a finger laid on the
    // page to scroll it is not the reader leaving, and a tap sends a mouse press of its own
    React.useEffect(() => {
        if (!focused) {
            return;
        }

        const owner = rootRef.current?.ownerDocument ?? document;

        const isOutside = (target: EventTarget | null) =>
            target instanceof Node && !rootRef.current?.contains(target);

        const handlePress = (event: MouseEvent) => {
            // An auxiliary button — the right one, or the wheel — is not reaching for anything,
            // so it is left alone
            if (event.button > 0 || !isOutside(event.target)) {
                return;
            }

            leaveRef.current();
        };

        const handleFocusIn = (event: FocusEvent) => {
            if (isOutside(event.target)) {
                leaveRef.current();
            }
        };

        owner.addEventListener("mousedown", handlePress);
        owner.addEventListener("focusin", handleFocusIn);

        return () => {
            owner.removeEventListener("mousedown", handlePress);
            owner.removeEventListener("focusin", handleFocusIn);
        };
    }, [focused]);

    /* Taking part in a form */

    // A form that is reset takes the tag input back to the tags it started with, the way it takes
    // every other field back. The form is found from the hidden input, which is what stands in it
    const resetRef = React.useRef(() => {});

    React.useEffect(() => {
        resetRef.current = () => {
            commitValue(initialValue.current);
            commitInputValue(initialInputValue.current);
            highlightAt(null);
        };
    });

    React.useEffect(() => {
        const hiddenInput = getElement(resolvedIds.hiddenInput);
        const owner = hiddenInput instanceof HTMLInputElement ? hiddenInput.form : null;

        if (!owner) {
            return;
        }

        const handleReset = () => resetRef.current();

        owner.addEventListener("reset", handleReset);

        return () => {
            owner.removeEventListener("reset", handleReset);
        };
    }, [resolvedIds.hiddenInput, form]);

    /* What the parts answer with */

    const handleRootFocus = () => {
        markFocused();
    };

    // A press on the control between and around what stands in it is reaching for the field. One on
    // a tag, a button or the field itself is that part's own
    const handleControlMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        if (event.button !== 0 || event.target !== event.currentTarget || isDisabled) {
            return;
        }

        // Taking the press keeps it from dropping the reader on the page, and they are put in the
        // field instead
        event.preventDefault();
        highlightAt(null);
        focusInput();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.currentTarget.value;
        const pasted = pastingRef.current;

        pastingRef.current = false;

        // Writing in the field puts the reader back in it, off whichever tag they were on
        if (highlightRef.current.index !== null) {
            highlightAt(null);
        }

        if (pasted && addOnPaste) {
            pasteTags(text);
            return;
        }

        // The delimiter finishes the tag rather than standing in it, so it is never left in the
        // field: what was typed before it is taken in, and a tag that is turned away is left there
        // without it. Pasted text keeps its delimiters, and is only split where it is asked to be
        const finished = pasted ? null : beforeDelimiter(text, delimiter);

        if (finished !== null) {
            if (submitTag(finished) !== "taken") {
                commitInputValue(finished);
            }

            return;
        }

        commitInputValue(text);
    };

    // The text arrives with the change that follows the paste, so the paste is only remembered for
    // as long as that takes
    const handleInputPaste = () => {
        pastingRef.current = true;

        setTimeout(() => {
            pastingRef.current = false;
        }, 0);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // A key pressed while a character is being composed belongs to the composition
        if (event.defaultPrevented || event.nativeEvent.isComposing || !isInteractive) {
            return;
        }

        const input = event.currentTarget;
        const list = valueRef.current;
        const current = highlightRef.current.index;

        // Back along the tags is towards the first of them, which is to the left of the field on a
        // page read from left to right and to the right of it on one read the other way
        const backKey = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
        const forwardKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";

        if (current === null) {
            if (event.key === "Enter") {
                // Taking the event keeps the form the tag input stands in from being sent by the
                // press that was finishing a tag. An empty field leaves Enter to the form
                if (submitTag(currentInputValue) !== "empty") {
                    event.preventDefault();
                }

                return;
            }

            // Moving back from the start of the field moves onto the last tag, and so does rubbing
            // out past the start of it, so that a second press takes the tag out
            if (
                (event.key === backKey || event.key === "Backspace") &&
                list.length > 0 &&
                isCaretAtStart(input)
            ) {
                selectTag(list.length - 1);
            }

            return;
        }

        // From here on the reader is on a tag. The caret has stayed in the field the whole time

        if (event.key === "Enter") {
            // Taking the event keeps the press that edits a tag from sending the form as well
            event.preventDefault();
            startEdit(current);
            return;
        }

        if (event.key === "Escape" || event.key === "ArrowDown") {
            // Taking Escape keeps a dialog the tag input stands in from closing along with the
            // highlight. Any other press of it is left alone
            if (event.key === "Escape") {
                event.preventDefault();
            }

            highlightAt(null);
            return;
        }

        if (event.key === forwardKey) {
            // Taking the event keeps the caret from moving along the field while the reader is
            // moving along the tags. Moving on from the last tag is moving back into the field
            event.preventDefault();

            if (current < list.length - 1) {
                selectTag(current + 1);
            } else {
                highlightAt(null);
            }

            return;
        }

        const backward = event.key === backKey || event.key === "Backspace";

        if (!backward && event.key !== "Delete") {
            return;
        }

        // A caret moved along the field since the reader moved onto the tags, by a press on it
        // say, means the key is meant for the field
        if (!isCaretAtStart(input)) {
            highlightAt(null);
            return;
        }

        if (event.key === backKey) {
            selectTag(Math.max(0, current - 1));
            return;
        }

        const removed = deleteAt(current);

        // Rubbing out moves back onto the tag before the one taken out, or onto the new first one
        // where the first was taken out. Deleting forward moves onto the one that moved up into its
        // place, and back into the field where there is none
        const next =
            event.key === "Backspace"
                ? highlightAt(Math.max(0, current - 1))
                : highlightAt(current);

        announceDeletion(removed, next.value);
    };

    // Pressing a tag moves the reader onto it. The press is taken, so the caret stays in the field,
    // which is where the reader moving along the tags is held. A press on the button that takes the
    // tag out is only kept from moving the caret, and left to the button
    const handleItemPreviewMouseDown = (
        event: React.MouseEvent<HTMLElement>,
        { index, disabled: itemDisabled }: TagInputItemOptions,
    ) => {
        if (event.button !== 0 || !isInteractive || itemDisabled) {
            return;
        }

        event.preventDefault();
        focusInput();

        if (event.target instanceof Element && event.target.closest("button")) {
            return;
        }

        selectTag(index);
    };

    const handleItemPreviewDoubleClick = ({
        index,
        disabled: itemDisabled,
    }: TagInputItemOptions) => {
        if (!itemDisabled) {
            startEdit(index);
        }
    };

    const handleItemInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedValue(event.currentTarget.value);
    };

    const handleItemInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.defaultPrevented || event.nativeEvent.isComposing) {
            return;
        }

        if (event.key === "Enter") {
            // Taking the event keeps the form the tag input stands in from being sent as well
            event.preventDefault();
            commitEdit();
        } else if (event.key === "Escape") {
            // Taking the event keeps a dialog the tag input stands in from closing along with the
            // edit
            event.preventDefault();
            cancelEdit();
        }
    };

    // Moving off the field a tag is edited in any way but Enter or Escape throws the edit away:
    // onto the field the tags are typed in, onto another tag, or off the tag input altogether
    const handleItemInputBlur = () => {
        if (editingRef.current !== null) {
            endEdit();
        }
    };

    const handleItemDelete = ({ index, disabled: itemDisabled }: TagInputItemOptions) => {
        if (!isInteractive || itemDisabled) {
            return;
        }

        const removed = deleteAt(index);

        highlightAt(null);
        focusInput();
        announceDeletion(removed, null);
    };

    const handleClear = () => {
        if (!isInteractive) {
            return;
        }

        clearAll();
        focusInput();
    };

    /* What the caller can do from outside */

    const setValueAtIndex = (index: number, next: string) => {
        const list = valueRef.current;
        const tag = sanitizeValue(next);

        if (index < 0 || index >= list.length || tag === "" || tag === list[index]) {
            return;
        }

        if (!allowDuplicates && list.some((item, position) => position !== index && item === tag)) {
            return;
        }

        const updated = [...list];

        updated[index] = tag;
        commitValue(updated);
        announce(resolvedTranslations.tagUpdated(tag));
    };

    const getItemState = ({
        index,
        value: tag,
        disabled: itemDisabled,
    }: TagInputItemOptions): TagInputItemState => ({
        index,
        value: tag,
        ids: getItemIds(index),
        editing: editingIndex === index,
        highlighted: highlightedIndex === index,
        disabled: isDisabled || Boolean(itemDisabled),
    });

    return {
        value: currentValue,
        valueAsString: currentValue.join(", "),
        inputValue: currentInputValue,
        count: currentValue.length,
        empty: currentValue.length === 0,
        atMax: currentValue.length >= max,
        focused,
        highlightedIndex,
        editingIndex,
        editedValue,
        placeholder,
        maxLength,
        editable,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: Boolean(required ?? field.required),
        // A list grown past its limit no longer holds tags that will do, whatever it was told
        invalid: Boolean(invalid) || currentValue.length > max,
        name,
        form,
        ids: resolvedIds,
        describedBy:
            [field.validationMessageId, field.captionId].filter(Boolean).join(" ") || undefined,
        translations: resolvedTranslations,
        announcement,
        setValue: commitValue,
        clearValue: (index) => {
            if (index === undefined) {
                clearAll();
                return;
            }

            const removed = deleteAt(index);

            highlightAt(null);
            announceDeletion(removed, null);
        },
        addValue: (next) => {
            const { added } = addTags([next]);

            if (added.length > 0) {
                announce(resolvedTranslations.tagAdded(added[0]));
            }
        },
        setValueAtIndex,
        setInputValue: commitInputValue,
        clearInputValue: () => commitInputValue(""),
        focus: focusInput,
        getItemState,
        rootRef,
        handleRootFocus,
        handleControlMouseDown,
        handleInputChange,
        handleInputKeyDown,
        handleInputPaste,
        handleItemPreviewMouseDown,
        handleItemPreviewDoubleClick,
        handleItemInputChange,
        handleItemInputKeyDown,
        handleItemInputBlur,
        handleItemDelete,
        handleClear,
    };
};
