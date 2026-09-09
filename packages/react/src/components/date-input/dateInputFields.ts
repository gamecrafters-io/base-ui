import { parseDate } from "../calendar/calendarDates";
import type { Dayjs } from "dayjs";
import type {
    DateInputEditableSegmentType,
    DateInputSegmentDetails,
    DateInputSegmentType,
} from "./DateInput.types";

// How the hour is counted, the way Intl names it: to eleven or to twelve with AM and PM beside it,
// or to twenty-three or twenty-four without
export type DateInputHourCycleId = "h11" | "h12" | "h23" | "h24";

// A date part way through being typed. Each part is held on its own so that any of them can be
// empty, which is what a part that has not been typed yet is, and the whole is only read as a
// date once every part is there.
//
// The hour is held the way it is shown rather than the way it is counted: a "3" typed into a
// field that reads to twelve is a three until AM or PM says which, so the two are kept apart
// and put together again only when the date is read
export type DateInputFields = {
    year: number | null;
    month: number | null;
    day: number | null;
    hour: number | null;
    minute: number | null;
    second: number | null;
    // Nought for the morning and one for the afternoon
    dayPeriod: number | null;
};

// The ends a part is held between
export type DateInputFieldLimits = {
    minValue: number;
    maxValue: number;
};

export const createFields = (): DateInputFields => ({
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null,
    dayPeriod: null,
});

// The hour as it is shown under a cycle, and which half of the day it falls in where the cycle
// says so. Twelve stands for nought where the hours are counted to twelve, and the hours counted
// to twenty-four start at one rather than nought
export const toHourCycle = (
    hour: number,
    hourCycle: DateInputHourCycleId,
): [dayPeriod: number | null, hour: number] => {
    const dayPeriod = hour >= 12 ? 1 : 0;

    switch (hourCycle) {
        case "h11":
            return [dayPeriod, hour >= 12 ? hour - 12 : hour];
        case "h12":
            return [dayPeriod, hour === 0 ? 12 : hour > 12 ? hour - 12 : hour];
        case "h24":
            return [null, hour + 1];
        default:
            return [null, hour];
    }
};

// The same the other way round, from the hour as it is shown back to the hour of the day
export const fromHourCycle = (
    hour: number,
    dayPeriod: number,
    hourCycle: DateInputHourCycleId,
): number => {
    switch (hourCycle) {
        case "h11":
            return dayPeriod === 1 ? hour + 12 : hour;
        case "h12":
            return (hour === 12 ? 0 : hour) + (dayPeriod === 1 ? 12 : 0);
        case "h24":
            return hour - 1;
        default:
            return hour;
    }
};

export const getFieldLimits = (
    type: DateInputEditableSegmentType,
    hourCycle: DateInputHourCycleId,
): DateInputFieldLimits => {
    switch (type) {
        case "year":
            return { minValue: 1, maxValue: 9999 };
        case "month":
            return { minValue: 1, maxValue: 12 };
        // Up to the longest a month can be, so that the day can be typed before the month is
        case "day":
            return { minValue: 1, maxValue: 31 };
        case "hour":
            switch (hourCycle) {
                case "h11":
                    return { minValue: 0, maxValue: 11 };
                case "h12":
                    return { minValue: 1, maxValue: 12 };
                case "h24":
                    return { minValue: 1, maxValue: 24 };
                default:
                    return { minValue: 0, maxValue: 23 };
            }
        case "dayPeriod":
            return { minValue: 0, maxValue: 1 };
        default:
            return { minValue: 0, maxValue: 59 };
    }
};

// Every part of a date that has already been settled, read off it
export const fieldsFromDate = (date: Dayjs, hourCycle: DateInputHourCycleId): DateInputFields => {
    const [dayPeriod, hour] = toHourCycle(date.hour(), hourCycle);

    return {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
        hour,
        minute: date.minute(),
        second: date.second(),
        dayPeriod,
    };
};

// The parts read as a date, with whatever has not been typed taken from the base. It is built
// from the first of the month, so that a month with fewer days than the one before it does not
// roll the date over into the month after, and the day is held to the month it lands in
export const fieldsToDate = (
    fields: DateInputFields,
    base: Dayjs,
    hourCycle: DateInputHourCycleId,
): Dayjs => {
    let hour = fields.hour;

    if (hour !== null) {
        hour = fromHourCycle(hour, fields.dayPeriod ?? 0, hourCycle);
    } else if (hourCycle === "h12" || hourCycle === "h11") {
        hour = fields.dayPeriod === 1 ? 12 : 0;
    }

    const start = base
        .date(1)
        .year(fields.year ?? base.year())
        .month((fields.month ?? base.month() + 1) - 1);

    return start
        .date(Math.min(fields.day ?? base.date(), start.daysInMonth()))
        .hour(hour ?? base.hour())
        .minute(fields.minute ?? base.minute())
        .second(fields.second ?? base.second())
        .millisecond(base.millisecond());
};

// The same parts held under another cycle, for an input whose cycle has changed under a date
// that is part way through being typed
export const withHourCycle = (
    fields: DateInputFields,
    from: DateInputHourCycleId,
    to: DateInputHourCycleId,
): DateInputFields => {
    if (from === to || fields.hour === null) {
        return fields;
    }

    const [dayPeriod, hour] = toHourCycle(
        fromHourCycle(fields.hour, fields.dayPeriod ?? 0, from),
        to,
    );

    return { ...fields, hour, dayPeriod };
};

export const isComplete = (fields: DateInputFields, types: DateInputEditableSegmentType[]) =>
    types.every((type) => fields[type] !== null);

export const isCleared = (fields: DateInputFields, types: DateInputEditableSegmentType[]) =>
    types.every((type) => fields[type] === null);

// Sets one part. An hour typed before AM or PM has been said is put in whichever half of the day
// the base falls in, so that the date can be read without waiting for it
export const setField = (
    fields: DateInputFields,
    type: DateInputEditableSegmentType,
    value: number,
    base: Dayjs,
    hourCycle: DateInputHourCycleId,
): DateInputFields => {
    const next = { ...fields, [type]: value };

    if (type === "hour" && next.dayPeriod === null) {
        next.dayPeriod = toHourCycle(base.hour(), hourCycle)[0];
    }

    return next;
};

export const clearField = (
    fields: DateInputFields,
    type: DateInputEditableSegmentType,
): DateInputFields => ({ ...fields, [type]: null });

// Moves a value by an amount between two ends, coming round to the other end where it runs past
// one. Rounded, it lands on a multiple of the amount, which is what a page at a time is: pressing
// up from seven minutes lands on fifteen rather than on twenty-two
export const cycleValue = (
    value: number,
    amount: number,
    min: number,
    max: number,
    round = false,
) => {
    if (!round) {
        const next = value + amount;

        if (next < min) {
            return max - (min - next - 1);
        }

        return next > max ? min + (next - max - 1) : next;
    }

    let next = value + Math.sign(amount);

    if (next < min) {
        next = max;
    }

    const step = Math.abs(amount);
    next = amount > 0 ? Math.ceil(next / step) * step : Math.floor(next / step) * step;

    return next > max ? min : next;
};

// What a part that has not been typed is read as, taken from the base
const readBaseField = (base: Dayjs, type: DateInputEditableSegmentType) => {
    switch (type) {
        case "year":
            return base.year();
        case "month":
            return base.month() + 1;
        case "day":
            return base.date();
        case "minute":
            return base.minute();
        default:
            return base.second();
    }
};

// Moves one part by an amount. A part that has not been typed yet lands on the base's own value
// first rather than a step past it, so the first press of an arrow key shows the reader where
// they are starting from
export const cycleField = (
    fields: DateInputFields,
    type: DateInputEditableSegmentType,
    amount: number,
    base: Dayjs,
    hourCycle: DateInputHourCycleId,
): DateInputFields => {
    if (fields[type] === null && type !== "dayPeriod") {
        if (type === "hour") {
            const [dayPeriod, hour] = toHourCycle(base.hour(), hourCycle);

            return { ...fields, hour, dayPeriod };
        }

        return { ...fields, [type]: readBaseField(base, type) };
    }

    switch (type) {
        case "year":
            return {
                ...fields,
                year: cycleValue(fields.year ?? base.year(), amount, 1, 9999, true),
            };
        case "month":
            return { ...fields, month: cycleValue(fields.month ?? 1, amount, 1, 12) };
        case "day":
            return { ...fields, day: cycleValue(fields.day ?? 1, amount, 1, 31) };
        case "hour": {
            const { minValue, maxValue } = getFieldLimits("hour", hourCycle);
            const next = {
                ...fields,
                hour: cycleValue(fields.hour ?? 0, amount, minValue, maxValue),
            };

            if (next.dayPeriod === null) {
                next.dayPeriod = toHourCycle(base.hour(), hourCycle)[0];
            }

            return next;
        }
        case "dayPeriod":
            return { ...fields, dayPeriod: cycleValue(fields.dayPeriod ?? 0, amount, 0, 1) };
        case "minute":
            return { ...fields, minute: cycleValue(fields.minute ?? 0, amount, 0, 59, true) };
        default:
            return { ...fields, second: cycleValue(fields.second ?? 0, amount, 0, 59, true) };
    }
};

// Brings a date back within the earliest and the latest it may be, a part at a time: the year
// first, then the month and then the day, and each only as far as it has to go. The time is left
// as it was, since the ends are days rather than moments
export const constrainDate = (date: Dayjs, min: Dayjs | null, max: Dayjs | null): Dayjs => {
    const dateOnly = date.startOf("day");
    const minOnly = min?.startOf("day") ?? null;
    const maxOnly = max?.startOf("day") ?? null;

    let result = dateOnly;

    if (minOnly !== null && result.isBefore(minOnly)) {
        if (result.year() < minOnly.year()) {
            result = result.year(minOnly.year());
        }

        if (result.isBefore(minOnly) && result.month() < minOnly.month()) {
            result = result.month(minOnly.month());
        }

        if (result.isBefore(minOnly) && result.date() < minOnly.date()) {
            result = result.date(minOnly.date());
        }
    }

    if (maxOnly !== null && result.isAfter(maxOnly)) {
        if (result.year() > maxOnly.year()) {
            result = result.year(maxOnly.year());
        }

        if (result.isAfter(maxOnly) && result.month() > maxOnly.month()) {
            result = result.month(maxOnly.month());
        }

        if (result.isAfter(maxOnly) && result.date() > maxOnly.date()) {
            result = result.date(maxOnly.date());
        }
    }

    if (result.isSame(dateOnly)) {
        return date;
    }

    return result
        .hour(date.hour())
        .minute(date.minute())
        .second(date.second())
        .millisecond(date.millisecond());
};

export type TypedInputOptions = {
    fields: DateInputFields;
    segment: DateInputSegmentDetails;
    // What was just typed, and what had been typed into the same part before it
    input: string;
    enteredKeys: string;
    base: Dayjs;
    hourCycle: DateInputHourCycleId;
    // Whether the hours are shown with AM or PM beside them
    hour12: boolean;
    // What the morning and the afternoon are called in the locale
    dayPeriodNames: [am: string, pm: string];
};

export type TypedInputResult = {
    // The parts as they now stand, or nothing where what was typed could not be taken
    fields: DateInputFields | null;
    // What has been typed into the part so far, and is still being added to
    enteredKeys: string;
    // Whether the part is full, so that the reader is moved on to the next
    advance: boolean;
};

// Takes what was typed into a part. Figures are gathered up one at a time until the part can hold
// no more of them: a "1" typed into the month waits for a second figure, since it could be
// January or any month from October, but a "3" is March and nothing else, so the reader is moved
// straight on. A letter typed into the AM or PM part is read against what the locale calls them
export const readTypedInput = ({
    fields,
    segment,
    input,
    enteredKeys,
    base,
    hourCycle,
    hour12,
    dayPeriodNames,
}: TypedInputOptions): TypedInputResult | null => {
    const type = segment.type;

    if (type === "literal") {
        return null;
    }

    if (type === "dayPeriod") {
        const [am, pm] = dayPeriodNames;
        const isTyped = (name: string) => name.toLowerCase().startsWith(input.toLowerCase());
        const period = isTyped(am) ? 0 : isTyped(pm) ? 1 : null;

        if (period === null) {
            return null;
        }

        return {
            fields: setField(fields, "dayPeriod", period, base, hourCycle),
            enteredKeys: "",
            advance: true,
        };
    }

    if (Number.isNaN(Number.parseInt(input, 10))) {
        return null;
    }

    const typed = enteredKeys + input;
    let numberValue = Number.parseInt(typed, 10);
    let segmentValue = numberValue;
    let allowsZero = segment.minValue === 0;

    if (type === "hour" && hour12) {
        // The hours counted to twelve have no nought, and a figure that would take the hour past
        // the end starts the part over rather than being turned away
        if (hourCycle === "h11") {
            if (numberValue > 11) {
                segmentValue = Number.parseInt(input, 10);
            }
        } else if (hourCycle === "h12") {
            allowsZero = false;

            if (numberValue > 12) {
                segmentValue = Number.parseInt(input, 10);
            }
        }

        if (segment.value !== undefined && segment.value >= 12 && numberValue > 1) {
            numberValue += 12;
        }
    } else if (segment.maxValue !== undefined && numberValue > segment.maxValue) {
        segmentValue = Number.parseInt(input, 10);
    }

    if (Number.isNaN(numberValue)) {
        return null;
    }

    const shouldSet = segmentValue !== 0 || allowsZero;
    const next = shouldSet ? setField(fields, type, segmentValue, base, hourCycle) : null;

    // The part is full once another figure could not fit after what has been typed, or once
    // there are as many figures as the largest value the part can hold
    const isFull =
        segment.maxValue !== undefined &&
        (Number(`${numberValue}0`) > segment.maxValue ||
            typed.length >= String(segment.maxValue).length);

    return { fields: next, enteredKeys: isFull ? "" : typed, advance: isFull && shouldSet };
};

// Reads a date that arrived whole, pasted in. Only a date written the way the input writes one
// out is taken, so that what is pasted is what was copied from another input like it
export const parsePastedDate = (text: string, formats: string[]): Dayjs | null => {
    for (const format of formats) {
        const date = parseDate(text, format);

        if (date !== null) {
            return date;
        }
    }

    return null;
};

// Whether a part is one the reader can reach, which a separator is not
export const isFocusableSegment = (segment: DateInputSegmentDetails) => segment.type !== "literal";

export const isEditableType = (type: DateInputSegmentType): type is DateInputEditableSegmentType =>
    type !== "literal";
