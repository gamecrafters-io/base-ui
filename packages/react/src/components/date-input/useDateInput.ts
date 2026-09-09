import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsRtl } from "../../providers/direction/useDirection";
import { useLocaleContext } from "../../providers/locale/useLocaleContext";
import { getToday, toOptionalDate, toSelection } from "../calendar/calendarDates";
import { FormControlContext } from "../form-control/FormControlContext";
import {
    clearField,
    constrainDate,
    createFields,
    cycleField,
    fieldsFromDate,
    fieldsToDate,
    isCleared,
    isComplete,
    isEditableType,
    isFocusableSegment,
    parsePastedDate,
    readTypedInput,
    setField,
    withHourCycle,
} from "./dateInputFields";
import {
    buildSegments,
    createSegmentFormatter,
    DEFAULT_FORMATS,
    DEFAULT_SEGMENT_LABELS,
    getDayPeriodNames,
    getPastedFormats,
    getPlaceholders,
    getSegmentTypes,
    PAGE_STEPS,
    resolveHourCycle,
} from "./dateInputSegments";
import type { Dayjs } from "dayjs";
import type {
    CalendarDateInput,
    CalendarRange,
    CalendarRangeInput,
} from "../calendar/Calendar.types";
import type { DateInputFields, DateInputHourCycleId } from "./dateInputFields";
import type {
    DateInputIds,
    DateInputSegmentDetails,
    UseDateInputElementProps,
    UseDateInputProps,
    UseDateInputReturn,
} from "./DateInput.types";

// The dates the input holds, one to a group of segments and null where a group holds nothing yet
type DateInputValues = (Dayjs | null)[];

// Where a segment stands: which group it is in, and where it comes in that group's run of parts
// and separators
type DateInputPosition = {
    group: number;
    segment: number;
};

// Two runs of dates written the one way, so that one can be told from another without walking
// them
const valueKeyOf = (values: DateInputValues) =>
    values.map((date) => (date === null ? "" : String(date.valueOf()))).join(",");

// Whichever shape the caller holds the dates in, they are read as one to a group here, and each
// is brought within the ends it was given
const readValues = (
    input: CalendarDateInput | CalendarRangeInput | null | undefined,
    isRange: boolean,
    min: Dayjs | null,
    max: Dayjs | null,
): DateInputValues => {
    const { from, to } = toSelection(input, isRange);

    return (isRange ? [from, to] : [from]).map((date) =>
        date === null ? null : constrainDate(date, min, max),
    );
};

// The parts of every group, read off the dates where there are any and left empty where there
// are not
const readDisplays = (
    values: DateInputValues,
    hourCycle: DateInputHourCycleId,
    count: number,
): DateInputFields[] =>
    Array.from({ length: count }, (_, index) => {
        const date = values[index];

        return date === null || date === undefined
            ? createFields()
            : fieldsFromDate(date, hourCycle);
    });

// What was typed into a segment by something other than a key press. Text from a phone's
// keyboard arrives on the native event beneath the synthetic one, or on the synthetic one alone
// where the browser sent nothing React could read it off
const readInputData = (event: React.InputEvent<HTMLElement>) => {
    const native = event.nativeEvent as Partial<InputEvent>;

    if (typeof native.data === "string") {
        return native.data;
    }

    const synthetic = event as unknown as { data?: unknown };

    return typeof synthetic.data === "string" ? synthetic.data : "";
};

const getPageStep = (segment: DateInputSegmentDetails) =>
    isEditableType(segment.type) ? (PAGE_STEPS[segment.type] ?? 1) : 1;

// Everything a date input needs and nothing that draws one: the parts of the date as they stand,
// what has been typed so far, and the ways of moving between the parts and through each of them.
// The input is built on this, so a caller who wants to set or read the date from somewhere else
// on the page is working from the same state the parts are.
//
//     const dateInput = useDateInput({ granularity: "minute" });
//
//     <DateInput.RootProvider value={dateInput}>...</DateInput.RootProvider>
//     <Button onClick={dateInput.clearValue}>Clear</Button>
//
// The date is only ever the one that has been typed in full. The parts are held on their own
// while it is being typed, and read as a date once every one of them is there, so a caller is
// never handed half a date as though it had been taken. What is typed into a part is gathered up
// until the part can hold no more, and the reader is moved on to the next.
//
// An input standing in a FormControl is wired into it: it takes the field's id, so the name over
// the field names the segments, and it is disabled, required and described as the field says
// unless it was told otherwise itself
export const useDateInput = (props: UseDateInputProps = {}): UseDateInputReturn => {
    const {
        mode = "single",
        value,
        defaultValue,
        onChange,
        locale: localeProp,
        granularity = "day",
        hourCycle,
        leadingZeros = false,
        placeholderValue,
        min,
        max,
        isDateUnavailable,
        format,
        segmentLabels: segmentLabelsProp,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        form,
        id,
        ids,
        onFocusChange,
    } = props as UseDateInputElementProps;

    const field = React.useContext(FormControlContext);
    const { locale: inheritedLocale } = useLocaleContext();
    const isRtl = useIsRtl();

    const locale = localeProp ?? inheritedLocale;
    const uuid = useId(id ?? field.id);

    const rootRef = React.useRef<HTMLDivElement>(null);
    // The segment the reader is to be put on once the input has been drawn again, since a part
    // moved to is found by where it stands rather than held
    const pendingFocus = React.useRef<DateInputPosition | null>(null);

    const isRange = mode === "range";
    const groupCount = isRange ? 2 : 1;
    const isDisabled = Boolean(disabled ?? field.disabled);
    const isReadOnly = Boolean(readOnly);

    const minDate = toOptionalDate(min);
    const maxDate = toOptionalDate(max);

    // The parts are named from the input's own id, so that the label can name the segments and
    // the segments can be found again without either having been told the other's name
    const resolvedIds: Required<DateInputIds> = {
        root: ids?.root ?? uuid,
        label: ids?.label ?? `${uuid}-label`,
        control: ids?.control ?? `${uuid}-control`,
        segmentGroup: (index) => ids?.segmentGroup?.(index) ?? `${uuid}-segment-group-${index}`,
        hiddenInput: (index) => ids?.hiddenInput?.(index) ?? `${uuid}-hidden-input-${index}`,
    };

    /* How the date is laid out */

    const formatter = createSegmentFormatter(locale, { granularity, leadingZeros, hourCycle });
    const hourCycleId = resolveHourCycle(formatter);
    const hour12 = formatter.resolvedOptions().hour12 === true;
    const segmentTypes = React.useMemo(() => getSegmentTypes(formatter), [formatter]);
    const placeholders = React.useMemo(() => getPlaceholders(locale), [locale]);
    const dayPeriodNames = React.useMemo(() => getDayPeriodNames(locale), [locale]);
    const segmentLabels = { ...DEFAULT_SEGMENT_LABELS, ...segmentLabelsProp };
    const writeFormat = format ?? DEFAULT_FORMATS[granularity];

    /* What has been typed */

    // An input the caller is holding the date of takes it from the prop; one that is not keeps
    // its own
    const isControlled = value !== undefined;
    const [selfValues, setSelfValues] = React.useState(() =>
        readValues(defaultValue, isRange, minDate, maxDate),
    );
    const values = isControlled ? readValues(value, isRange, minDate, maxDate) : selfValues;

    // The date the placeholders stand in for: the one the caller gave, else the date the input
    // started out holding, else the start of today. It is settled once, so that the parts an
    // empty date is read as do not move under the reader as they type
    const [mountPlaceholder] = React.useState(
        () => values.find((date) => date !== null) ?? getToday().startOf("day"),
    );
    const placeholder = constrainDate(
        toOptionalDate(placeholderValue) ?? mountPlaceholder,
        minDate,
        maxDate,
    );

    const [displays, setDisplays] = React.useState(() =>
        readDisplays(values, hourCycleId, groupCount),
    );

    // The parts follow the date whenever it changes under them, whether from outside or from the
    // input having read them as a date, and are put back under a new hour cycle without losing
    // what was typed. Both are settled while rendering rather than in an effect afterwards, so
    // the parts are never drawn a render behind the date
    const [seenHourCycle, setSeenHourCycle] = React.useState(hourCycleId);

    if (seenHourCycle !== hourCycleId) {
        setSeenHourCycle(hourCycleId);
        setDisplays(displays.map((fields) => withHourCycle(fields, seenHourCycle, hourCycleId)));
    }

    const valueKey = `${groupCount}|${valueKeyOf(values)}`;
    const [seenValueKey, setSeenValueKey] = React.useState(valueKey);

    if (seenValueKey !== valueKey) {
        setSeenValueKey(valueKey);
        setDisplays(readDisplays(values, hourCycleId, groupCount));
    }

    /* Where the reader is */

    const [active, setActive] = React.useState<DateInputPosition>({ group: 0, segment: -1 });
    const [focused, setFocused] = React.useState(false);
    // The figures typed into the part the reader is on, gathered up until the part is full
    const [enteredKeys, setEnteredKeys] = React.useState("");
    // Whether those figures filled the part up and left the reader standing on it, as the last
    // part of a date does since there is nowhere to be moved on to. What is typed next is let go
    // of rather than starting the part over, so that a date typed in full is not taken apart a
    // figure at a time by the keys pressed after it
    const [filled, setFilled] = React.useState(false);

    // What has been typed is put away again, whether because the reader has moved off the part,
    // because the part was changed some other way, or because there is nothing left to gather
    const clearTyping = () => {
        setEnteredKeys("");
        setFilled(false);
    };

    const allSegments = displays.map((fields, index) => {
        const committed = values[index];
        // A date that has been typed in full is laid out from the date itself, so whatever it
        // holds that is not shown, the seconds say, is kept rather than taken from the placeholder
        const base =
            committed !== null && committed !== undefined && isComplete(fields, segmentTypes)
                ? committed
                : placeholder;

        return buildSegments({
            fields,
            date: fieldsToDate(fields, base, hourCycleId),
            formatter,
            placeholders,
            granularity,
            hourCycle: hourCycleId,
        });
    });

    // The parts of a group as they are drawn, which while the reader is typing into one of them
    // shows what they have typed so far rather than what it has been read as. How the reader
    // stands on that part is marked as well, since a part part-way through being typed, a part
    // filled up by what was typed, and a part merely arrived at are each drawn their own way
    const getSegments = (index = 0) => {
        const segments = allSegments[index] ?? [];

        if (!focused || active.group !== index || (enteredKeys === "" && !filled)) {
            return segments;
        }

        return segments.map((segment, position) => {
            if (position !== active.segment) {
                return segment;
            }

            // A part filled up is read back as the figures it was taken for, since there is
            // nothing left being gathered for it to show instead
            return enteredKeys === ""
                ? { ...segment, filled: true }
                : { ...segment, text: enteredKeys, placeholderShown: false, entered: true };
        });
    };

    /* Finding the segments on the page */

    const getSegmentElements = (index: number) => {
        const owner = rootRef.current?.ownerDocument ?? document;
        const group = owner.getElementById(resolvedIds.segmentGroup(index));

        return group ? Array.from(group.querySelectorAll<HTMLElement>('[role="spinbutton"]')) : [];
    };

    // The element drawn for a segment, found by counting the segments the reader can reach ahead
    // of it, since the separators between them are drawn as nothing that can be reached
    const getSegmentElement = ({ group, segment }: DateInputPosition) => {
        const ahead = (allSegments[group] ?? []).slice(0, segment).filter(isFocusableSegment);

        return getSegmentElements(group)[ahead.length];
    };

    // The segment an element was drawn for, which is the same count the other way round
    const locateSegment = (group: number, element: HTMLElement): DateInputPosition | null => {
        const segments = allSegments[group] ?? [];
        let remaining = getSegmentElements(group).indexOf(element);

        if (remaining === -1) {
            return null;
        }

        for (let segment = 0; segment < segments.length; segment++) {
            if (!isFocusableSegment(segments[segment])) {
                continue;
            }

            if (remaining === 0) {
                return { group, segment };
            }

            remaining -= 1;
        }

        return null;
    };

    // The segment a press is for. The reader is moved on as a part fills up, and a press that
    // lands before the page has caught up with them is taken for the segment they were moved to
    // rather than the one they were on
    const resolvePosition = (group: number, element: HTMLElement): DateInputPosition | null => {
        const activeSegment = allSegments[active.group]?.[active.segment];

        if (focused && activeSegment !== undefined && isFocusableSegment(activeSegment)) {
            return active;
        }

        return locateSegment(group, element);
    };

    React.useEffect(() => {
        const target = pendingFocus.current;

        if (target === null) {
            return;
        }

        pendingFocus.current = null;
        getSegmentElement(target)?.focus({ preventScroll: true });
    });

    /* Moving between the parts */

    const findNext = ({ group, segment }: DateInputPosition): DateInputPosition | null => {
        const segments = allSegments[group] ?? [];

        for (let index = segment + 1; index < segments.length; index++) {
            if (isFocusableSegment(segments[index])) {
                return { group, segment: index };
            }
        }

        // Off the end of one date of a range, the reader lands on the start of the other
        const following = allSegments[group + 1];
        const first = following === undefined ? -1 : following.findIndex(isFocusableSegment);

        return first === -1 ? null : { group: group + 1, segment: first };
    };

    const findPrevious = ({ group, segment }: DateInputPosition): DateInputPosition | null => {
        const segments = allSegments[group] ?? [];

        for (let index = segment - 1; index >= 0; index--) {
            if (isFocusableSegment(segments[index])) {
                return { group, segment: index };
            }
        }

        const preceding = allSegments[group - 1];

        if (preceding === undefined) {
            return null;
        }

        for (let index = preceding.length - 1; index >= 0; index--) {
            if (isFocusableSegment(preceding[index])) {
                return { group: group - 1, segment: index };
            }
        }

        return null;
    };

    const moveTo = (position: DateInputPosition) => {
        setActive(position);
        clearTyping();
        pendingFocus.current = position;
    };

    /* Reading the parts as a date */

    const changeValues = (next: DateInputValues) => {
        if (valueKeyOf(next) === valueKeyOf(values)) {
            return;
        }

        if (!isControlled) {
            setSelfValues(next);
        }

        // Only the mode the input is in says which of the two shapes the caller is waiting for,
        // so the one handler is called as whichever it was given as
        if (isRange) {
            const handler = onChange as ((range: CalendarRange) => void) | undefined;

            handler?.({ from: next[0]?.toDate() ?? null, to: next[1]?.toDate() ?? null });

            return;
        }

        (onChange as ((date: Date | null) => void) | undefined)?.(next[0]?.toDate() ?? null);
    };

    const updateDisplay = (group: number, fields: DateInputFields) => {
        setDisplays((current) => current.map((held, index) => (index === group ? fields : held)));
    };

    const commitGroup = (group: number, fields: DateInputFields) => {
        const base = values[group] ?? placeholder;

        changeValues(
            values.map((held, index) =>
                index === group ? fieldsToDate(fields, base, hourCycleId) : held,
            ),
        );
    };

    const commitClear = (group: number) => {
        changeValues(values.map((held, index) => (index === group ? null : held)));
    };

    /* Typing into a part */

    const adjust = ({ group, segment }: DateInputPosition, amount: number) => {
        const { type } = allSegments[group][segment];

        if (!isEditableType(type)) {
            return;
        }

        const next = cycleField(displays[group], type, amount, placeholder, hourCycleId);

        updateDisplay(group, next);
        clearTyping();

        if (isComplete(next, segmentTypes)) {
            commitGroup(group, next);
        }
    };

    const setToLimit = ({ group, segment }: DateInputPosition, limit: "minValue" | "maxValue") => {
        const current = allSegments[group][segment];
        const bound = current[limit];

        if (!isEditableType(current.type) || bound === undefined) {
            return;
        }

        const next = setField(displays[group], current.type, bound, placeholder, hourCycleId);

        updateDisplay(group, next);
        clearTyping();

        if (isComplete(next, segmentTypes)) {
            commitGroup(group, next);
        }
    };

    const clearSegment = (position: DateInputPosition) => {
        const { group, segment } = position;
        const current = allSegments[group][segment];
        const { type } = current;

        if (!isEditableType(type)) {
            return;
        }

        // A part with nothing in it hands the reader back to the one before, the way a backspace
        // at the start of a word does
        if (enteredKeys === "" && current.placeholderShown) {
            const previous = findPrevious(position);

            if (previous !== null) {
                moveTo(previous);
            }

            return;
        }

        const clear = () => {
            const next = clearField(displays[group], type);

            updateDisplay(group, next);
            clearTyping();

            // Once every part has been taken out, so has the date
            if (isCleared(next, segmentTypes)) {
                commitClear(group);
            }
        };

        // The hour and the half of the day are taken out whole, since neither is a run of figures
        // that can be shortened by one
        if (type === "hour" || type === "dayPeriod") {
            clear();
            return;
        }

        const shortened = (enteredKeys === "" ? current.text : enteredKeys).slice(0, -1);

        if (shortened === "" || shortened === "0") {
            clear();
            return;
        }

        setEnteredKeys(shortened);
        // Shortening a part that had been filled up puts it back in play, so that what is typed
        // next follows what is left of it
        setFilled(false);
        updateDisplay(
            group,
            setField(displays[group], type, Number(shortened), placeholder, hourCycleId),
        );
    };

    const typeInto = (position: DateInputPosition, input: string) => {
        // A part already filled up under the reader takes nothing more, so the date stands as it
        // was typed. The reader has only to arrive at the part again, or to change it any other
        // way, for it to be typed into afresh
        if (filled) {
            return;
        }

        const { group, segment } = position;
        const result = readTypedInput({
            fields: displays[group],
            segment: allSegments[group][segment],
            input,
            enteredKeys,
            base: placeholder,
            hourCycle: hourCycleId,
            hour12,
            dayPeriodNames,
        });

        if (result === null) {
            return;
        }

        if (result.fields !== null) {
            updateDisplay(group, result.fields);
        }

        setEnteredKeys(result.enteredKeys);

        if (result.advance) {
            const next = findNext(position);

            if (next === null) {
                // Nowhere to move the reader on to, so the part is held as filled where it stands
                setFilled(true);
            } else {
                moveTo(next);
            }
        }

        // Read as a date the moment the last part is typed, unless the part is still being typed
        // into, in which case it waits for the reader to finish or to leave
        if (
            result.fields !== null &&
            result.enteredKeys === "" &&
            isComplete(result.fields, segmentTypes)
        ) {
            commitGroup(group, result.fields);
        }
    };

    // What happens as the reader leaves. A date that only has AM or PM still to say is taken as
    // the half of the day the placeholder falls in, rather than left unread for the one part; a
    // date typed in full but still being typed into is read; and everything is brought within
    // the ends it was given
    const confirm = () => {
        const withoutDayPeriod = segmentTypes.filter((type) => type !== "dayPeriod");
        const nextDisplays = [...displays];
        let nextValues = [...values];
        let filled = false;

        for (let index = 0; index < groupCount; index++) {
            const fields = displays[index];

            if (fields === undefined) {
                continue;
            }

            const base = values[index] ?? placeholder;

            if (
                segmentTypes.includes("dayPeriod") &&
                fields.dayPeriod === null &&
                isComplete(fields, withoutDayPeriod)
            ) {
                const period = placeholder.hour() >= 12 ? 1 : 0;
                const next = setField(fields, "dayPeriod", period, placeholder, hourCycleId);

                nextDisplays[index] = next;
                nextValues[index] = fieldsToDate(next, base, hourCycleId);
                filled = true;
            } else if (isComplete(fields, segmentTypes)) {
                nextValues[index] = fieldsToDate(fields, base, hourCycleId);
            }
        }

        if (minDate !== null || maxDate !== null) {
            nextValues = nextValues.map((date) =>
                date === null ? null : constrainDate(date, minDate, maxDate),
            );
        }

        if (filled) {
            setDisplays(nextDisplays);
        }

        changeValues(nextValues);
    };

    /* What the parts answer with */

    const handleSegmentFocus = (index: number, event: React.FocusEvent<HTMLElement>) => {
        const position = locateSegment(index, event.currentTarget);

        if (position === null) {
            return;
        }

        if (!focused) {
            setFocused(true);
            onFocusChange?.(true);
        } else if (active.group !== position.group || active.segment !== position.segment) {
            // Arriving at another part by hand drops what was being typed into the last one,
            // where arriving at the one the reader was moved to keeps it
            setEnteredKeys("");
        }

        setActive(position);
        // Arriving at a part is arriving at it afresh, so one that had been filled up is put back
        // in play whether the reader has come to it from another part or back to it from outside
        setFilled(false);

        // Chrome sends nothing typed into an editable element until a selection has been put
        // inside it
        event.currentTarget.ownerDocument.getSelection()?.collapse(event.currentTarget);
    };

    // A press on a part is the reader taking hold of it afresh, so one that had been filled up is
    // put back in play. Arriving at it says so already, but a press on the part the reader is
    // standing on sends no arrival of its own, and that is the part a filled one always is
    const handleSegmentPointerDown = () => {
        setFilled(false);
    };

    const handleSegmentBlur = (event: React.FocusEvent<HTMLElement>) => {
        const next = event.relatedTarget;

        // Moving between the parts, or to a control standing among them, is not leaving
        if (next instanceof Node && rootRef.current?.contains(next)) {
            return;
        }

        setFocused(false);
        clearTyping();
        confirm();
        onFocusChange?.(false);
    };

    const handleSegmentKeyDown = (index: number, event: React.KeyboardEvent<HTMLElement>) => {
        // A key pressed with a modifier belongs to the browser or the page, not to the input, and
        // one pressed while a character is being composed belongs to the composition
        if (
            event.defaultPrevented ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey ||
            event.nativeEvent.isComposing
        ) {
            return;
        }

        const position = resolvePosition(index, event.currentTarget);

        if (position === null) {
            return;
        }

        const current = allSegments[position.group][position.segment];
        // The arrow keys move the way the page is read, so "back" is always towards the start
        const [previousKey, nextKey] = isRtl
            ? ["ArrowRight", "ArrowLeft"]
            : ["ArrowLeft", "ArrowRight"];

        const take = () => {
            // Taking the event keeps the page from scrolling away underneath the input, and
            // keeps a zone the input stands in from moving the reader off it
            event.preventDefault();
            event.stopPropagation();
        };

        if (event.key === previousKey || event.key === nextKey) {
            const target = event.key === previousKey ? findPrevious(position) : findNext(position);

            if (target !== null) {
                moveTo(target);
            }

            take();
            return;
        }

        // A part that can only be read is still moved between, but nothing else
        if (isReadOnly || !current.editable) {
            return;
        }

        switch (event.key) {
            case "ArrowUp":
                adjust(position, 1);
                break;
            case "ArrowDown":
                adjust(position, -1);
                break;
            case "PageUp":
                adjust(position, getPageStep(current));
                break;
            case "PageDown":
                adjust(position, -getPageStep(current));
                break;
            case "Home":
                setToLimit(position, "minValue");
                break;
            case "End":
                setToLimit(position, "maxValue");
                break;
            case "Backspace":
            case "Delete":
                clearSegment(position);
                break;
            default:
                // A single character is something typed; anything longer is a key with a name,
                // which is left to the browser
                if (event.key.length !== 1) {
                    return;
                }

                typeInto(position, event.key);
        }

        take();
    };

    const handleSegmentInput = (index: number, event: React.InputEvent<HTMLElement>) => {
        // Nothing is ever written into the element itself: what was typed is read off the event
        // and drawn from the parts instead
        event.preventDefault();

        if (isReadOnly) {
            return;
        }

        const data = readInputData(event);
        const position = data === "" ? null : resolvePosition(index, event.currentTarget);

        if (position !== null && allSegments[position.group][position.segment].editable) {
            typeInto(position, data);
        }
    };

    const handleSegmentPaste = (index: number, event: React.ClipboardEvent<HTMLElement>) => {
        event.preventDefault();

        if (isReadOnly) {
            return;
        }

        const text = event.clipboardData.getData("text/plain").trim();
        const date = parsePastedDate(text, getPastedFormats(writeFormat));

        if (date === null) {
            return;
        }

        const group = resolvePosition(index, event.currentTarget)?.group ?? index;

        changeValues(
            values.map((held, position) =>
                position === group ? constrainDate(date, minDate, maxDate) : held,
            ),
        );
        clearTyping();
    };

    /* What the caller can do from outside */

    const focus = (index = 0) => {
        getSegmentElements(index)[0]?.focus();
    };

    const setValue = (next: (CalendarDateInput | null)[]) => {
        changeValues(
            Array.from({ length: groupCount }, (_, index) => {
                const date = toOptionalDate(next[index]);

                return date === null ? null : constrainDate(date, minDate, maxDate);
            }),
        );
    };

    const clearValue = () => {
        // The parts are emptied as well as the date, since a date that was only part typed has
        // nothing to be emptied by
        setDisplays(Array.from({ length: groupCount }, createFields));
        clearTyping();
        changeValues(values.map(() => null));
    };

    const isUnavailable = isDateUnavailable
        ? values.some((date) => date !== null && isDateUnavailable(date.toDate()))
        : false;

    return {
        mode,
        locale,
        value: values.map((date) => date?.toDate() ?? null),
        valueAsString: values.map((date) => (date === null ? "" : date.format(writeFormat))),
        placeholderValue: placeholder.toDate(),
        focused,
        activeIndex: active.group,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: Boolean(required ?? field.required),
        invalid: invalid ?? isUnavailable,
        name,
        form,
        ids: resolvedIds,
        describedBy:
            [field.validationMessageId, field.captionId].filter(Boolean).join(" ") || undefined,
        segmentLabels,
        focus,
        setValue,
        clearValue,
        getSegments,
        rootRef,
        handleSegmentFocus,
        handleSegmentPointerDown,
        handleSegmentBlur,
        handleSegmentKeyDown,
        handleSegmentInput,
        handleSegmentPaste,
    };
};
