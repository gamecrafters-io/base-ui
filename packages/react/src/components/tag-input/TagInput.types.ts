import type * as React from "react";
import type { ButtonVisual } from "../button";
import type { TextInputSize } from "../text-input/TextInput.types";

// Why a tag was turned away: the list was already as long as it is allowed to grow, or the caller's
// validation refused it
export type TagInputInvalidReason = "rangeOverflow" | "invalidTag";

// What becomes of whatever is still in the field as the reader leaves the tag input: it is taken
// in as a tag, or thrown away. Left out, it stays in the field for the reader to come back to
export type TagInputBlurBehavior = "add" | "clear";

// The words the tag input writes for itself: the names of the buttons it draws, and what it says
// to a screen reader as tags come and go. Each is in English unless it is given here
export type TagInputTranslations = {
    clearTriggerLabel?: string;
    deleteTagTriggerLabel?: (value: string) => string;
    tagAdded?: (value: string) => string;
    tagsPasted?: (values: string[]) => string;
    tagEdited?: (value: string) => string;
    tagUpdated?: (value: string) => string;
    tagDeleted?: (value: string) => string;
    tagSelected?: (value: string) => string;
    noTagsSelected?: string;
};

// The ids the parts are named by. Each is worked out from the tag input's own id where it is not
// given, so they are only worth giving where something outside the tag input has to point at a
// part by name
export type TagInputIds = {
    root?: string;
    label?: string;
    control?: string;
    input?: string;
    hiddenInput?: string;
    clearTrigger?: string;
};

// The ids an item's parts are named by, worked out from the tag input's own id and from where the
// item stands in the list
export type TagInputItemIds = {
    item: string;
    preview: string;
    input: string;
    deleteTrigger: string;
};

// What a tag input is told and what it holds. The tag input and the hook behind it are given this
// the same way, so one built by hand from the hook and one built from the parts are set up alike
export type UseTagInputProps = {
    // The tags the tag input holds, where the caller keeps hold of them
    value?: string[];
    // The tags it starts out holding, where it keeps hold of them itself
    defaultValue?: string[];
    // What is being typed for the next tag, where the caller keeps hold of it
    inputValue?: string;
    defaultInputValue?: string;
    // What ends a tag as it is typed, and what pasted text is split into tags at. A pattern can
    // stand for more than one: a comma or a space, say
    delimiter?: string | RegExp;
    // The most tags the list can hold
    max?: number;
    // Lets the list grow past `max`, and marks it as invalid while it has
    allowOverflow?: boolean;
    // The most characters a tag can hold
    maxLength?: number;
    // Takes in a tag that is already there as a second one
    allowDuplicates?: boolean;
    // Splits pasted text into tags at the delimiter, rather than leaving it in the field
    addOnPaste?: boolean;
    blurBehavior?: TagInputBlurBehavior;
    // Whether a tag can be edited where it stands, by a double press or by Enter once it is
    // highlighted
    editable?: boolean;
    // Tidies a tag before it is taken in, trimming the space from either end of it unless told
    // otherwise. A tag that comes to nothing is not taken in at all
    sanitizeValue?: (value: string) => string;
    // Whether a tag can be taken in, given the tag and the tags already there. One that is turned
    // away stays in the field to be put right
    validate?: (inputValue: string, value: string[]) => boolean;
    // What stands in the field while there are no tags
    placeholder?: string;
    // Puts the reader in the field as the tag input is first drawn
    autoFocus?: boolean;
    // Stops the tags being added, edited or taken out, and takes the field out of the tab order.
    // What it holds is not submitted
    disabled?: boolean;
    // Leaves the tags where they stand, to be read but not changed. What it holds is still
    // submitted
    readOnly?: boolean;
    // Whether at least one tag has to be given before the owning form can be submitted
    required?: boolean;
    // Marks the tag input as holding tags that will not do
    invalid?: boolean;
    // The name the tags are submitted under, written out as one value with a comma between each
    name?: string;
    // The form the tag input belongs to, where it does not stand inside it
    form?: string;
    // Names the tag input, and with it the parts, which are named from it. One is made where the
    // caller does not give one
    id?: string;
    ids?: TagInputIds;
    translations?: TagInputTranslations;
    // Called with the tags the tag input holds whenever they change
    onValueChange?: (value: string[]) => void;
    // Called with what is being typed for the next tag, a keystroke at a time
    onInputValueChange?: (inputValue: string) => void;
    // Called with the tag the reader has moved onto, or with nothing as they move off the tags
    onHighlightChange?: (highlightedValue: string | null) => void;
    // Called with why a tag was turned away, and as the list grows past `max`
    onValueInvalid?: (reason: TagInputInvalidReason) => void;
};

// Which tag an item stands for: its place in the list, and what it says
export type TagInputItemOptions = {
    index: number;
    value: string;
    // Leaves the tag where it stands, however the rest of the tag input is set
    disabled?: boolean;
};

// What an item's parts read off it
export type TagInputItemState = {
    index: number;
    value: string;
    ids: TagInputItemIds;
    // Whether the tag is being edited where it stands
    editing: boolean;
    // Whether the reader has moved onto the tag, from the keyboard or by pressing it
    highlighted: boolean;
    disabled: boolean;
};

// What a tag input announces, and how many times it has announced anything, so that the same
// words said twice over are heard twice
export type TagInputAnnouncement = {
    message: string;
    count: number;
};

export type UseTagInputReturn = {
    value: string[];
    // The tags written out as the one value they are submitted as
    valueAsString: string;
    inputValue: string;
    count: number;
    empty: boolean;
    // Whether the list holds as many tags as it is allowed to
    atMax: boolean;
    // Whether the reader is in the tag input: in the field, on a tag, or editing one
    focused: boolean;
    highlightedIndex: number | null;
    editingIndex: number | null;
    // What the tag being edited holds so far
    editedValue: string;
    placeholder?: string;
    maxLength?: number;
    editable: boolean;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    invalid: boolean;
    name?: string;
    form?: string;
    // The ids every part is named by, settled once here so that the label can point at the field
    // without having been told its name
    ids: Required<TagInputIds>;
    // What describes the field to a screen reader: the caption and the validation message of the
    // field it stands in, where it stands in one
    describedBy?: string;
    translations: Required<TagInputTranslations>;
    announcement: TagInputAnnouncement;
    // Changes the tags, whether or not the reader is in the tag input
    setValue: (value: string[]) => void;
    // Takes out the tag at the place given, or every tag and whatever is being typed where no place
    // is given
    clearValue: (index?: number) => void;
    // Takes in a tag, the way one typed and kept would be
    addValue: (value: string) => void;
    setValueAtIndex: (index: number, value: string) => void;
    setInputValue: (value: string) => void;
    clearInputValue: () => void;
    // Puts the reader in the field
    focus: () => void;
    getItemState: (options: TagInputItemOptions) => TagInputItemState;
    // What the parts are drawn from and answer with. A control of the caller's own has no call to
    // reach for any of these
    rootRef: React.RefObject<HTMLDivElement | null>;
    handleRootFocus: () => void;
    handleControlMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleInputPaste: () => void;
    handleItemPreviewMouseDown: (
        event: React.MouseEvent<HTMLElement>,
        options: TagInputItemOptions,
    ) => void;
    handleItemPreviewDoubleClick: (options: TagInputItemOptions) => void;
    handleItemInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleItemInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleItemInputBlur: () => void;
    handleItemDelete: (options: TagInputItemOptions) => void;
    handleClear: () => void;
};

// The control is sized and drawn the way a text input is, so a tag input stands in a form the way
// every other field does
type TagInputFieldProps = {
    size?: TextInputSize;
    // Fills the width of its container
    block?: boolean;
    // Recesses the control against the page, for use on a raised surface
    contrast?: boolean;
    className?: string;
};

// `defaultValue` and the rest mean something else on a plain div, so the div's own versions are
// dropped in favour of the tag input's
export type TagInputProps = Omit<React.ComponentPropsWithoutRef<"div">, keyof UseTagInputProps> &
    UseTagInputProps &
    TagInputFieldProps;

// The same tag input, handed the state a hook of the caller's own is holding rather than working it
// out from props of its own
export type TagInputRootProviderProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "defaultValue"
> &
    TagInputFieldProps & {
        value: UseTagInputReturn;
    };

export type TagInputLabelProps = React.ComponentPropsWithoutRef<"label"> & {
    // Keeps the name in the accessibility tree while taking it off the screen
    visuallyHidden?: boolean;
    className?: string;
};

export type TagInputControlProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// What the field holds is the tag input's to say, so what would set it on the element is left off
export type TagInputInputProps = Omit<
    React.ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "size"
> & {
    className?: string;
};

// The button draws an icon and is named by `label`, since there is nothing else on it to name it
export type TagInputClearTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "aria-label" | "aria-labelledby"
> & {
    icon?: ButtonVisual;
    // What the button is called. Left out, it is the clear trigger's translation
    label?: string;
    className?: string;
};

// An item given no children draws the parts every tag is drawn from: its text and the button that
// takes it out, and the field it is edited in
export type TagInputItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> &
    TagInputItemOptions & {
        children?: React.ReactNode;
        className?: string;
    };

export type TagInputItemPreviewProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// The text writes out the tag itself, unless it is given something else to show in its place
export type TagInputItemTextProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type TagInputItemInputProps = Omit<
    React.ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "size"
> & {
    className?: string;
};

// The button is named by `label`, since a cross on its own says nothing of which tag it takes out
export type TagInputItemDeleteTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "aria-label" | "aria-labelledby"
> & {
    // What the button is called. Left out, it is the delete trigger's translation of the tag
    label?: string;
    className?: string;
};

export type TagInputHiddenInputProps = Omit<
    React.ComponentPropsWithoutRef<"input">,
    "value" | "defaultValue" | "type"
>;

// The tag input as it stands, handed to whatever draws the items, which is what a list of tags
// the tag input keeps hold of itself is drawn from
export type TagInputConsumerProps = {
    children: (tagInput: UseTagInputReturn) => React.ReactNode;
};

export type TagInputItemConsumerProps = {
    children: (item: TagInputItemState) => React.ReactNode;
};

// What the parts read off the tag input around them
export type TagInputContextValue = UseTagInputReturn & Omit<TagInputFieldProps, "className">;
