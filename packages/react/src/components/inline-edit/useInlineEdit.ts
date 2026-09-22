import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { FormControlContext } from "../form-control/FormControlContext";
import type { InlineEditIds, UseInlineEditProps, UseInlineEditReturn } from "./InlineEdit.types";

// How an edit ends: whether what was typed is kept or thrown away, and whether the reader is put
// back on the inline edit afterwards. A reader who ended the edit by going somewhere else is left
// where they went
type InlineEditExit = {
    keep: boolean;
    restoreFocus: boolean;
};

// Where the reader is to be put once the inline edit has been drawn again: in the field as an edit
// starts, or back on the inline edit as one ends
type InlineEditFocusTarget = "input" | "return";

// Everything an inline edit needs and nothing that draws one: the value, whether it is being
// edited, and the ways of starting an edit and of ending one. The inline edit is built on this, so
// a caller who wants to start or end an edit from somewhere else on the page is working from the
// same state the parts are.
//
//     const title = useInlineEdit({ defaultValue: "Quarterly report" });
//
//     <InlineEdit.RootProvider value={title}>...</InlineEdit.RootProvider>
//     <Button onClick={title.edit}>Rename</Button>
//
// An edit starts from the value as it stands and ends one of two ways: by keeping what was typed,
// or by throwing it away and taking the value back to where it stood as the edit started. Enter
// and Escape say which as plainly as the triggers do; leaving the field does whichever the submit
// mode says.
//
// An inline edit standing in a FormControl is wired into it: the field takes the field's id, so
// the name over the field points at it, and it is disabled, required and described as the field
// says unless it was told otherwise itself
export const useInlineEdit = (props: UseInlineEditProps = {}): UseInlineEditReturn => {
    const {
        value,
        defaultValue,
        edit: editProp,
        defaultEdit,
        activationMode = "focus",
        submitMode = "both",
        selectOnFocus = true,
        placeholder,
        maxLength,
        autoResize = false,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        returnFocusRef,
        onValueChange,
        onValueCommit,
        onValueRevert,
        onEditChange,
    } = props;

    const field = React.useContext(FormControlContext);
    const uuid = useId(id);

    const rootRef = React.useRef<HTMLDivElement>(null);

    const isDisabled = Boolean(disabled ?? field.disabled);
    const isReadOnly = Boolean(readOnly);
    const isInteractive = !isDisabled && !isReadOnly;

    const submitOnEnter = submitMode === "enter" || submitMode === "both";
    const submitOnBlur = submitMode === "blur" || submitMode === "both";

    // The parts are named from the inline edit's own id, so that the label can point at the field
    // and the preview can be named by the label without either having been told the other's name.
    // Standing in a FormControl, the field takes the id the FormControl's own name points at, and
    // the preview is named by that name
    const resolvedIds: Required<InlineEditIds> = {
        root: ids?.root ?? uuid,
        label: ids?.label ?? field.labelId ?? `${uuid}-label`,
        area: ids?.area ?? `${uuid}-area`,
        input: ids?.input ?? field.id ?? `${uuid}-input`,
        preview: ids?.preview ?? `${uuid}-preview`,
        control: ids?.control ?? `${uuid}-control`,
        editTrigger: ids?.editTrigger ?? `${uuid}-edit-trigger`,
        submitTrigger: ids?.submitTrigger ?? `${uuid}-submit-trigger`,
        cancelTrigger: ids?.cancelTrigger ?? `${uuid}-cancel-trigger`,
    };

    /* What the inline edit holds */

    // An inline edit the caller is holding the value of takes it from the prop; one that is not
    // keeps its own
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue ?? "");
    const currentValue = isControlled ? value : selfValue;

    // Whether the value is being edited, held the same two ways
    const isEditControlled = editProp !== undefined;
    const [selfEditing, setSelfEditing] = React.useState(Boolean(defaultEdit));
    const editing = isEditControlled ? editProp : selfEditing;

    // What the value stood at as the edit started, which is what throwing the edit away takes it
    // back to
    const previousValue = React.useRef(currentValue);

    // Whether an edit is open, known the moment one starts or ends rather than once the inline
    // edit has been drawn again, so that the one edit is never ended twice by a reader who leaves
    // it two ways at once: pressing outside it on something that takes focus, say
    const isOpen = React.useRef(editing);

    // How an edit the caller is holding was asked to end, kept until the caller ends it
    const pendingExit = React.useRef<InlineEditExit | null>(null);

    // An edit that starts out open puts the reader in the field, the way one opened by hand does
    const pendingFocus = React.useRef<InlineEditFocusTarget | null>(editing ? "input" : null);

    // Set for the moment the reader is put back on the preview as an edit ends, so that arriving
    // there is not taken for arriving to start another
    const isRestoringFocus = React.useRef(false);

    /* Finding the parts on the page */

    const getElement = (elementId: string) => {
        const owner = rootRef.current?.ownerDocument ?? document;

        return owner.getElementById(elementId);
    };

    // Whether the reader is still on the inline edit, or on nothing at all, in which case they are
    // put back on it as an edit ends. One who has gone somewhere else is left there
    const isFocusWithin = () => {
        const owner = rootRef.current?.ownerDocument ?? document;
        const active = owner.activeElement;

        return (
            active === null || active === owner.body || Boolean(rootRef.current?.contains(active))
        );
    };

    const focusInput = () => {
        const input = getElement(resolvedIds.input);

        if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
            return;
        }

        input.focus({ preventScroll: true });

        if (selectOnFocus) {
            input.select();
        }
    };

    // Puts the reader back on the inline edit as an edit ends: on whatever the caller named, else
    // on the edit trigger that would start the next edit, else on the preview. The first of them
    // that takes focus is the one they are left on
    const returnFocus = () => {
        const owner = rootRef.current?.ownerDocument ?? document;
        const candidates = [
            returnFocusRef?.current,
            getElement(resolvedIds.editTrigger),
            getElement(resolvedIds.preview),
        ];

        for (const candidate of candidates) {
            if (!candidate) {
                continue;
            }

            isRestoringFocus.current = true;
            candidate.focus({ preventScroll: true });
            isRestoringFocus.current = false;

            if (owner.activeElement === candidate) {
                return;
            }
        }
    };

    // The field is only on the page once the inline edit has been drawn again, and the preview and
    // the triggers only back on it, so the reader is moved once that has happened
    React.useEffect(() => {
        const target = pendingFocus.current;

        if (target === null) {
            return;
        }

        pendingFocus.current = null;

        if (target === "input") {
            focusInput();
        } else {
            returnFocus();
        }
    });

    /* Changing the value */

    const setValue = (next: string) => {
        const capped = maxLength === undefined ? next : next.slice(0, maxLength);

        if (capped === currentValue) {
            return;
        }

        if (!isControlled) {
            setSelfValue(capped);
        }

        onValueChange?.(capped);
    };

    /* Starting and ending an edit */

    // What an edit does as it starts: the value is set aside to be gone back to, and the reader is
    // put in the field
    const startEdit = () => {
        previousValue.current = currentValue;
        pendingFocus.current = "input";
    };

    // What an edit does as it ends: what was typed becomes the value to go back to next time, or
    // the value is taken back to where it stood
    const finishEdit = ({ keep, restoreFocus }: InlineEditExit) => {
        if (keep) {
            previousValue.current = currentValue;
            onValueCommit?.(currentValue);
        } else {
            const previous = previousValue.current;

            setValue(previous);
            onValueRevert?.(previous);
        }

        if (restoreFocus) {
            pendingFocus.current = "return";
        }
    };

    // An edit the caller is holding is only asked for here, and starts once the caller says it
    // does
    const edit = () => {
        if (!isInteractive || isOpen.current) {
            return;
        }

        if (!isEditControlled) {
            isOpen.current = true;
            startEdit();
            setSelfEditing(true);
        }

        onEditChange?.(true);
    };

    // An edit the caller is holding is asked to end, and how it was asked to is kept until it does.
    // Ending is never refused, so an edit left open as the inline edit was disabled or made
    // read-only does not shut the reader inside a field they can no longer change
    const end = (exit: InlineEditExit) => {
        if (!isOpen.current) {
            return;
        }

        if (isEditControlled) {
            pendingExit.current = exit;
        } else {
            isOpen.current = false;
            setSelfEditing(false);
            finishEdit(exit);
        }

        onEditChange?.(false);
    };

    // An edit the caller is holding starts and ends when the caller says, so what it does as it
    // starts and as it ends is done as the prop moves rather than as it is asked for. It is done
    // before the page is painted, so a value taken back is never seen standing as it was typed
    const seenEditing = React.useRef(editing);

    useIsomorphicLayoutEffect(() => {
        if (seenEditing.current === editing) {
            return;
        }

        seenEditing.current = editing;

        if (!isEditControlled) {
            return;
        }

        isOpen.current = editing;

        if (editing) {
            startEdit();
            return;
        }

        // An edit the caller ended without having been asked to is thrown away, the way one the
        // reader leaves without keeping is
        finishEdit(pendingExit.current ?? { keep: false, restoreFocus: isFocusWithin() });
        pendingExit.current = null;
    }, [editing]);

    /* Leaving the inline edit */

    // The latest way of leaving is held aside for the listeners below, which are set up once for
    // as long as an edit is open rather than again on every render
    const leaveRef = React.useRef(() => {});

    React.useEffect(() => {
        leaveRef.current = () => end({ keep: submitOnBlur, restoreFocus: false });
    });

    // A press anywhere but the inline edit, or focus arriving anywhere but on it, is the reader
    // leaving the edit, which keeps what they typed or throws it away as the submit mode says. The
    // triggers stand inside the inline edit, so moving from the field to one of them is not
    // leaving it.
    //
    // A press is read off the mouse rather than off a finger's first touch: a finger laid on the
    // page to scroll it is not the reader leaving, and a tap sends a mouse press of its own
    React.useEffect(() => {
        if (!editing) {
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
    }, [editing]);

    /* What the parts answer with */

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setValue(event.currentTarget.value);
    };

    const handleInputKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        // A key pressed while a character is being composed belongs to the composition
        if (event.defaultPrevented || event.nativeEvent.isComposing) {
            return;
        }

        if (event.key === "Escape") {
            // Taking the event keeps a dialog the inline edit stands in from closing along with
            // the edit
            event.preventDefault();
            end({ keep: false, restoreFocus: true });
            return;
        }

        if (event.key !== "Enter" || !submitOnEnter) {
            return;
        }

        // A box of lines takes Enter for a new line, so its edit is kept with Command or Control
        // held instead. A line of text takes Enter alone, and leaves it to the page with Shift or
        // Command held
        if (event.currentTarget.localName === "textarea") {
            if (!event.metaKey && !event.ctrlKey) {
                return;
            }
        } else if (event.shiftKey || event.metaKey) {
            return;
        }

        // Taking the event keeps the form the inline edit stands in from being sent along with it
        event.preventDefault();
        end({ keep: true, restoreFocus: true });
    };

    // Arriving at the preview starts an edit where arriving is what starts one, unless the reader
    // was put there by an edit that has just ended
    const handlePreviewFocus = () => {
        if (activationMode === "focus" && !isRestoringFocus.current) {
            edit();
        }
    };

    // A press on a preview the reader is already standing on sends no arrival of its own, so a
    // preview opened by arriving at it is opened by a press as well
    const handlePreviewClick = () => {
        if (activationMode === "click" || activationMode === "focus") {
            edit();
        }
    };

    const handlePreviewDoubleClick = () => {
        if (activationMode === "dblclick") {
            edit();
        }
    };

    // The preview is a button to a reader on the keyboard, whichever way the pointer opens it, so
    // Enter and Space start an edit the way they would press any other. A key still held down from
    // the edit that has just ended is not a press of its own
    const handlePreviewKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (
            event.defaultPrevented ||
            event.repeat ||
            activationMode === "none" ||
            (event.key !== "Enter" && event.key !== " ")
        ) {
            return;
        }

        // Taking the event keeps Space from scrolling the page as well
        event.preventDefault();
        edit();
    };

    /* What the caller can do from outside */

    const focus = () => {
        getElement(editing ? resolvedIds.input : resolvedIds.preview)?.focus();
    };

    const placeholders =
        typeof placeholder === "string" ? { edit: placeholder, preview: placeholder } : placeholder;
    const isEmpty = currentValue.trim() === "";

    return {
        editing,
        empty: isEmpty,
        value: currentValue,
        valueText: isEmpty ? (placeholders?.preview ?? "") : currentValue,
        placeholder: placeholders?.edit,
        activationMode,
        autoResize,
        maxLength,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: Boolean(required ?? field.required),
        invalid: Boolean(invalid),
        name,
        form,
        ids: resolvedIds,
        describedBy:
            [field.validationMessageId, field.captionId].filter(Boolean).join(" ") || undefined,
        setValue,
        clearValue: () => setValue(""),
        edit,
        // Ended from outside, an edit puts the reader back on the inline edit only where they were
        // still on it
        submit: () => end({ keep: true, restoreFocus: isFocusWithin() }),
        cancel: () => end({ keep: false, restoreFocus: isFocusWithin() }),
        focus,
        rootRef,
        handleInputChange,
        handleInputKeyDown,
        handlePreviewFocus,
        handlePreviewClick,
        handlePreviewDoubleClick,
        handlePreviewKeyDown,
    };
};
