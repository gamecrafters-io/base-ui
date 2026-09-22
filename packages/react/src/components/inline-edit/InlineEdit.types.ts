import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonSize, ButtonVariant, ButtonVisual } from "../button";
import type { TextInputSize } from "../text-input/TextInput.types";

// What turns the value as it is read into a field to edit it in. Arriving at the preview is what
// does it where the inline edit is told nothing; the rest wait for a press on the preview, or for
// two, or leave it to the edit trigger and to the hook alone
export type InlineEditActivationMode = "focus" | "click" | "dblclick" | "none";

// What keeps an edit: Enter, leaving the field, or either of the two. An edit ended any other way
// is thrown away, so where neither keeps it only the submit trigger does
export type InlineEditSubmitMode = "enter" | "blur" | "both" | "none";

// What stands in for a value not yet written. One string stands in the preview and the field
// alike; the two can be given one each, a prompt to press on the one and a hint of what to type
// in the other
export type InlineEditPlaceholder = string | { edit: string; preview: string };

// What the field is drawn as: a line of text, or a box of them for a value that runs over more
// than one line
export type InlineEditInputElement = "input" | "textarea";

// The ids the parts are named by. Each is worked out from the inline edit's own id where it is not
// given, so they are only worth giving where something outside the inline edit has to point at a
// part by name
export type InlineEditIds = {
    root?: string;
    label?: string;
    area?: string;
    input?: string;
    preview?: string;
    control?: string;
    editTrigger?: string;
    submitTrigger?: string;
    cancelTrigger?: string;
};

// What an inline edit is told and what it holds. The inline edit and the hook behind it are given
// this the same way, so one built by hand from the hook and one built from the parts are set up
// alike
export type UseInlineEditProps = {
    // The text the inline edit holds, where the caller keeps hold of it
    value?: string;
    // The text it starts out holding, where it keeps hold of that itself
    defaultValue?: string;
    // Whether the value is being edited, where the caller keeps hold of that. An edit is only asked
    // to start or to end through onEditChange, and starts or ends once the caller says it does
    edit?: boolean;
    // Whether it starts out being edited, where it keeps hold of that itself
    defaultEdit?: boolean;
    activationMode?: InlineEditActivationMode;
    submitMode?: InlineEditSubmitMode;
    // Selects what the field holds as an edit starts, so that what is typed replaces it
    selectOnFocus?: boolean;
    placeholder?: InlineEditPlaceholder;
    // The most characters the value can hold
    maxLength?: number;
    // Grows the field with what it holds rather than giving it a width of its own, so that the
    // value takes the same room being edited as it did being read
    autoResize?: boolean;
    // Stops the value being edited, and takes the preview out of the tab order. What it holds is
    // not submitted
    disabled?: boolean;
    // Leaves the value where it stands, to be read but not edited. What it holds is still submitted
    readOnly?: boolean;
    // Whether a value has to be given before the owning form can be submitted
    required?: boolean;
    // Marks the inline edit as holding a value that will not do
    invalid?: boolean;
    // The name the value is submitted under
    name?: string;
    // The form the inline edit belongs to, where it does not stand inside it
    form?: string;
    // Names the inline edit, and with it the parts, which are named from it. One is made where the
    // caller does not give one
    id?: string;
    ids?: InlineEditIds;
    // Takes focus once an edit ends, in place of the edit trigger or the preview
    returnFocusRef?: React.RefObject<HTMLElement | null>;
    // Called with the text the inline edit holds whenever it changes, a keystroke at a time
    onValueChange?: (value: string) => void;
    // Called with the text that was kept, as an edit is kept
    onValueCommit?: (value: string) => void;
    // Called with the text the value was taken back to, as an edit is thrown away
    onValueRevert?: (value: string) => void;
    // Called with whether the value is being edited, as an edit starts and as it ends
    onEditChange?: (edit: boolean) => void;
};

export type UseInlineEditReturn = {
    // Whether the value is being edited
    editing: boolean;
    // Whether the value holds nothing but space, so that the preview stands something in for it
    empty: boolean;
    value: string;
    // What the preview shows: the value, or what stands in for it while there is none
    valueText: string;
    // What stands in the field while it is empty
    placeholder?: string;
    activationMode: InlineEditActivationMode;
    autoResize: boolean;
    maxLength?: number;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    invalid: boolean;
    name?: string;
    form?: string;
    // The ids every part is named by, settled once here so that the label can point at the field
    // and the preview can be named by the label without either having been told the other's name
    ids: Required<InlineEditIds>;
    // What describes the inline edit to a screen reader: the caption and the validation message of
    // the field it stands in, where it stands in one
    describedBy?: string;
    // Changes the value, whether or not it is being edited
    setValue: (value: string) => void;
    clearValue: () => void;
    // Starts an edit
    edit: () => void;
    // Ends the edit, keeping what was typed
    submit: () => void;
    // Ends the edit, taking the value back to where it stood as the edit started
    cancel: () => void;
    // Puts the reader on the inline edit: in the field while the value is being edited, and on the
    // preview while it is being read
    focus: () => void;
    // What the parts are drawn from and answer with. A control of the caller's own has no call to
    // reach for any of these
    rootRef: React.RefObject<HTMLDivElement | null>;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleInputKeyDown: (
        event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    handlePreviewFocus: () => void;
    handlePreviewClick: () => void;
    handlePreviewDoubleClick: () => void;
    handlePreviewKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
};

// The preview and the field are sized the one way, from the control scale, so that the one stands
// exactly where the other stood as an edit starts and ends
type InlineEditFieldProps = {
    size?: TextInputSize;
    // Fills the width of its container, the value taking whatever room the triggers leave
    block?: boolean;
    // Recesses the field against the page, for use on a raised surface
    contrast?: boolean;
    className?: string;
};

// `defaultValue` means something else on a plain div, so the div's own version is dropped in
// favour of the inline edit's
export type InlineEditProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    keyof UseInlineEditProps
> &
    UseInlineEditProps &
    InlineEditFieldProps;

// The same inline edit, handed the state a hook of the caller's own is holding rather than working
// it out from props of its own
export type InlineEditRootProviderProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "defaultValue"
> &
    InlineEditFieldProps & {
        value: UseInlineEditReturn;
    };

export type InlineEditLabelProps = React.ComponentPropsWithoutRef<"label"> & {
    // Keeps the name in the accessibility tree while taking it off the screen, for a value that
    // says well enough on the page what it is, a title say
    visuallyHidden?: boolean;
    className?: string;
};

export type InlineEditAreaProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// What the field holds is the inline edit's to say, so what would set it on the element is left
// off
export type InlineEditInputProps<As extends InlineEditInputElement = "input"> = Omit<
    PolymorphicProps<
        As,
        "input",
        {
            className?: string;
        }
    >,
    "value" | "defaultValue"
>;

// The preview writes out the value itself. A caller who would rather show something else, the
// value set out with a unit after it say, puts that in as children and the value goes on being
// what is edited
export type InlineEditPreviewProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        className?: string;
    }
>;

export type InlineEditControlProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// A trigger given nothing to say is drawn as an icon button, which carries no words of its own,
// so `label` is what names it. One given children takes its name from those, the way any other
// button does, and carries the icon before them
type InlineEditTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "type" | "aria-label" | "aria-labelledby"
> & {
    variant?: ButtonVariant;
    // Follows the inline edit where it is not given, so the trigger stands as tall as the field
    // beside it
    size?: ButtonSize;
    // What the trigger carries. `null` leaves a trigger that has words to them alone
    icon?: ButtonVisual;
    // What an icon-only trigger is called
    label?: string;
    className?: string;
};

export type InlineEditEditTriggerProps = InlineEditTriggerProps;

export type InlineEditSubmitTriggerProps = InlineEditTriggerProps;

export type InlineEditCancelTriggerProps = InlineEditTriggerProps;

// What the parts read off the inline edit around them
export type InlineEditContextValue = Partial<UseInlineEditReturn> &
    Omit<InlineEditFieldProps, "className">;
