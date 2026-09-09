import type * as React from "react";
import type {
    CalendarDateInput,
    CalendarDateMatcher,
    CalendarMode,
    CalendarRange,
    CalendarRangeInput,
} from "../calendar/Calendar.types";
import type { TextInputSize } from "../text-input/TextInput.types";

// The smallest part of the date that is typed. A date on its own is what the input takes where it
// is told nothing; the rest add the time after it, down to the hour, the minute or the second
export type DateInputGranularity = "day" | "hour" | "minute" | "second";

// Whether the hour is counted to twelve and followed by AM or PM, or to twenty-four. Left out, it
// is whichever the locale reads the time in
export type DateInputHourCycle = 12 | 24;

// The parts of a date the reader types into, one at a time
export type DateInputEditableSegmentType =
    "year" | "month" | "day" | "hour" | "minute" | "second" | "dayPeriod";

// The same, and the separators the locale writes between them, which are drawn rather than typed
export type DateInputSegmentType = DateInputEditableSegmentType | "literal";

// One part of the date as it is drawn: what is written in it, the figure behind that where one has
// been typed, and the ends the figure is held between
export type DateInputSegmentDetails = {
    type: DateInputSegmentType;
    // What is written in the segment, being the figure or the placeholder standing in for it
    text: string;
    value?: number;
    minValue?: number;
    maxValue?: number;
    // What stands in the segment until something is typed, "mm" or "yyyy" say, spelled the way
    // the locale spells it
    placeholder: string;
    placeholderShown: boolean;
    // Whether the text is the run of figures typed into the part so far, rather than the value
    // the part is holding. It is true of the one part part-way through being typed into, and
    // tells it from a part merely arrived at, whose next figure starts it over rather than
    // following what is already there
    entered: boolean;
    // Whether those figures filled the part up and left the reader standing on it, as the last
    // part of a date does since there is nowhere to be moved on to. Such a part takes nothing
    // more where it stands, so there is no figure on its way to it
    filled: boolean;
    // A separator is drawn rather than typed into, and so is nothing the reader can reach
    editable: boolean;
};

// The ids the parts are named by. Each is worked out from the input's own id where it is not
// given, so they are only worth giving where something outside the input has to point at a part
// by name. A range holds two groups of segments and two hidden inputs, so those are named by
// where they stand
export type DateInputIds = {
    root?: string;
    label?: string;
    control?: string;
    segmentGroup?: (index: number) => string;
    hiddenInput?: (index: number) => string;
};

// What a screen reader hears each part of the date called, for a page read in another language
export type DateInputSegmentLabels = Partial<Record<DateInputEditableSegmentType, string>>;

// An input that takes one date, which is what it does where it is told nothing
export type DateInputPropsForOneDay = {
    mode?: "single";
    // The date that has been typed. `null` is an input with nothing in it
    value?: CalendarDateInput | null;
    defaultValue?: CalendarDateInput | null;
    // Called with the date once every part of it has been typed, or with nothing where the whole
    // of it has been taken out again
    onChange?: (date: Date | null) => void;
};

// An input that takes a stretch of time, typed as two dates side by side. Either end can be typed
// on its own, so the range handed back can have only one end to it
export type DateInputPropsForARange = {
    mode: "range";
    value?: CalendarRangeInput | null;
    defaultValue?: CalendarRangeInput | null;
    onChange?: (range: CalendarRange) => void;
};

// What is typed, and what is handed back, both follow from the mode
export type DateInputSelectionConfig = DateInputPropsForOneDay | DateInputPropsForARange;

// What the input is told about the date it takes and the field it stands in. The input and the
// hook behind it are given this the same way, so an input built by hand from the hook and one
// built from the parts are set up alike
type DateInputStoreProps = {
    // Which locale the parts are laid out in and the placeholders are spelled in, as a BCP 47 tag.
    // Left out, it follows the LocaleProvider above the input
    locale?: string;
    granularity?: DateInputGranularity;
    hourCycle?: DateInputHourCycle;
    // Whether the month, the day and the hour are always written with two figures
    leadingZeros?: boolean;
    // The date the placeholders stand in for, which is what a part is set to on the first press of
    // an arrow key and what any part that has not been typed is read as. Today where it is left
    // out
    placeholderValue?: CalendarDateInput;
    // The earliest and the latest date that can be typed. A date outside them is brought back to
    // whichever end it ran past once the reader leaves the input
    min?: CalendarDateInput;
    max?: CalendarDateInput;
    // Rules a date out for a reason the input has no way of knowing. A date that has been typed
    // and matches marks the input invalid rather than being refused
    isDateUnavailable?: CalendarDateMatcher;
    // How the date is written out for the form, in Day.js tokens. Left out, it is written the way
    // a native date or date-time input submits it
    format?: string;
    segmentLabels?: DateInputSegmentLabels;
    // Stops the input being typed into, and takes the parts out of the tab order. What it holds is
    // not submitted
    disabled?: boolean;
    // Leaves the date where it stands while keeping the parts in the tab order, so it can still be
    // reached and read
    readOnly?: boolean;
    required?: boolean;
    // Marks the input as holding a date that will not do
    invalid?: boolean;
    // The name the date is submitted under. A range is submitted as two, named by where they stand
    name?: string;
    // The form the input belongs to, where it does not stand inside it
    form?: string;
    // Names the input, and with it the parts, which are named from it. One is made where the
    // caller does not give one
    id?: string;
    ids?: DateInputIds;
    // Called as the reader arrives in the input and again as they leave it
    onFocusChange?: (focused: boolean) => void;
};

export type UseDateInputProps = DateInputStoreProps & DateInputSelectionConfig;

// The same props with the mode left open, for reading inside the hook. What `value` and
// `onChange` carry is settled by the mode, which the caller sees as one shape or the other and
// the hook tells apart itself
export type UseDateInputElementProps = DateInputStoreProps & {
    mode?: CalendarMode;
    value?: CalendarDateInput | CalendarRangeInput | null;
    defaultValue?: CalendarDateInput | CalendarRangeInput | null;
    onChange?: ((date: Date | null) => void) | ((range: CalendarRange) => void);
};

export type UseDateInputReturn = {
    mode: CalendarMode;
    locale: string;
    // What has been typed, a date to a group of segments and `null` where a group holds nothing
    // yet: one for a single date, two for a range
    value: (Date | null)[];
    // The same written out, the way the hidden input submits it
    valueAsString: string[];
    // The date the placeholders stand in for
    placeholderValue: Date;
    focused: boolean;
    // Which group of segments the reader is in, where the input holds two
    activeIndex: number;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    invalid: boolean;
    name?: string;
    form?: string;
    // The ids every part is named by, settled once here so that the label can name the segments
    // and the segments can be found again to put the reader on one of them
    ids: Required<DateInputIds>;
    // What describes the input to a screen reader: the caption and the validation message of the
    // field it stands in, where it stands in one
    describedBy?: string;
    segmentLabels: Record<DateInputEditableSegmentType, string>;
    // Puts the reader on the first segment of the group at the index, or of the first group
    focus: (index?: number) => void;
    // Sets the date, or the two dates of a range, from outside
    setValue: (value: (CalendarDateInput | null)[]) => void;
    clearValue: () => void;
    // The parts of the date in the group at the index, in the order the locale writes them
    getSegments: (index?: number) => DateInputSegmentDetails[];
    // What the parts are drawn from and answer with. A control of the caller's own has no call to
    // reach for any of these
    rootRef: React.RefObject<HTMLDivElement | null>;
    handleSegmentFocus: (index: number, event: React.FocusEvent<HTMLElement>) => void;
    handleSegmentPointerDown: () => void;
    handleSegmentBlur: (event: React.FocusEvent<HTMLElement>) => void;
    handleSegmentKeyDown: (index: number, event: React.KeyboardEvent<HTMLElement>) => void;
    handleSegmentInput: (index: number, event: React.InputEvent<HTMLElement>) => void;
    handleSegmentPaste: (index: number, event: React.ClipboardEvent<HTMLElement>) => void;
};

// The field the segments stand in takes the look of a text input, so it is sized and coloured the
// way every other field on the page is
type DateInputFieldProps = {
    size?: TextInputSize;
    block?: boolean;
    // Recesses the field against the page, for use on a raised surface
    contrast?: boolean;
    className?: string;
};

// `onChange` and `defaultValue` both mean something else on a plain div, so the div's own versions
// are dropped in favour of the input's
export type DateInputProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    keyof UseDateInputElementProps
> &
    UseDateInputProps &
    DateInputFieldProps;

// The same props with the mode left open, for reading inside the component
export type DateInputElementProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    keyof UseDateInputElementProps
> &
    UseDateInputElementProps &
    DateInputFieldProps;

// The same input, handed the state a hook of the caller's own is holding rather than working it
// out from props of its own
export type DateInputRootProviderProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue"
> &
    DateInputFieldProps & {
        value: UseDateInputReturn;
    };

export type DateInputLabelProps = React.ComponentPropsWithoutRef<"label"> & {
    className?: string;
};

export type DateInputControlProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// The segments are drawn for the caller unless they would rather draw them themselves, in which
// case they are handed the parts of the date to draw
export type DateInputSegmentGroupChildren =
    React.ReactNode | ((segments: DateInputSegmentDetails[]) => React.ReactNode);

export type DateInputSegmentGroupProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    // Which of the two dates of a range the group holds, counted from nought
    index?: number;
    children?: DateInputSegmentGroupChildren;
    className?: string;
};

// A segment writes its own text, so there is nothing for a caller to put inside it
export type DateInputSegmentProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
    segment: DateInputSegmentDetails;
    className?: string;
};

// What the input holds is the input's to say, so what would set it on the element is left off
export type DateInputHiddenInputProps = Omit<
    React.ComponentPropsWithoutRef<"input">,
    "type" | "value" | "defaultValue"
> & {
    // Which of the two dates of a range the input submits, counted from nought
    index?: number;
    // The name this one date is submitted under, in place of the one the input was given
    name?: string;
    className?: string;
};

// What the parts read off the input around them
export type DateInputContextValue = Partial<UseDateInputReturn> &
    Omit<DateInputFieldProps, "className"> & {
        // A name given to the input as a whole is carried down to the segments, which are what a
        // screen reader reads
        ariaLabel?: string;
        ariaLabelledBy?: string;
    };

// Which group of segments a segment stands in, for the segments the caller draws themselves
export type DateInputSegmentGroupContextValue = {
    index: number;
};
