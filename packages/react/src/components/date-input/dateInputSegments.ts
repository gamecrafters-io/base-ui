import { createDateFormatter } from "../../utilities/i18n";
import { getFieldLimits, isEditableType } from "./dateInputFields";
import type { Dayjs } from "dayjs";
import type { DateInputFields, DateInputHourCycleId } from "./dateInputFields";
import type {
    DateInputEditableSegmentType,
    DateInputGranularity,
    DateInputHourCycle,
    DateInputSegmentDetails,
    DateInputSegmentType,
} from "./DateInput.types";

export const DEFAULT_SEGMENT_LABELS: Record<DateInputEditableSegmentType, string> = {
    year: "Year",
    month: "Month",
    day: "Day",
    hour: "Hour",
    minute: "Minute",
    second: "Second",
    dayPeriod: "AM/PM",
};

// How far a page moves each part: a working week of days, a quarter of an hour, and so on
export const PAGE_STEPS: Partial<Record<DateInputEditableSegmentType, number>> = {
    year: 5,
    month: 2,
    day: 7,
    hour: 2,
    minute: 15,
    second: 15,
};

// How the date is written out for the form where the caller has not said, which is the way a
// native date or date-time input submits it
export const DEFAULT_FORMATS: Record<DateInputGranularity, string> = {
    day: "YYYY-MM-DD",
    hour: "YYYY-MM-DDTHH:mm",
    minute: "YYYY-MM-DDTHH:mm",
    second: "YYYY-MM-DDTHH:mm:ss",
};

// The forms a pasted date is read against, whatever the input itself writes: the one it writes,
// and the ones a native input writes
export const getPastedFormats = (format: string) =>
    Array.from(new Set([format, ...Object.values(DEFAULT_FORMATS)]));

// The Unicode marks that hold the time the right way round in a page read right to left, where
// the hour and the minute would otherwise swap places around the colon between them
const LEFT_TO_RIGHT_ISOLATE = "\u2066";
const POP_DIRECTIONAL_ISOLATE = "\u2069";

const TIME_TYPES: DateInputSegmentType[] = ["hour", "minute", "second"];

// What the year, the month and the day are called in short, letter for letter, the way a form in
// each language writes them. Adapted from Zag.js, which took them from Melt UI (MIT)
type LocalePlaceholder = readonly [year: string, month: string, day: string];

const LOCALE_PLACEHOLDERS: Record<string, LocalePlaceholder> = {
    ach: ["mwaka", "dwe", "nino"],
    af: ["jjjj", "mm", "dd"],
    am: ["ዓዓዓዓ", "ሚሜ", "ቀቀ"],
    an: ["aaaa", "mm", "dd"],
    ar: ["سنة", "شهر", "يوم"],
    ast: ["aaaa", "mm", "dd"],
    az: ["iiii", "aa", "gg"],
    be: ["гггг", "мм", "дд"],
    bg: ["гггг", "мм", "дд"],
    bn: ["yyyy", "মিমি", "dd"],
    br: ["bbbb", "mm", "dd"],
    bs: ["gggg", "mm", "dd"],
    ca: ["aaaa", "mm", "dd"],
    cak: ["jjjj", "ii", "q'q'"],
    ckb: ["ساڵ", "مانگ", "ڕۆژ"],
    cs: ["rrrr", "mm", "dd"],
    cy: ["bbbb", "mm", "dd"],
    da: ["åååå", "mm", "dd"],
    de: ["jjjj", "mm", "tt"],
    dsb: ["llll", "mm", "źź"],
    el: ["εεεε", "μμ", "ηη"],
    en: ["yyyy", "mm", "dd"],
    eo: ["jjjj", "mm", "tt"],
    es: ["aaaa", "mm", "dd"],
    et: ["aaaa", "kk", "pp"],
    eu: ["uuuu", "hh", "ee"],
    fa: ["سال", "ماه", "روز"],
    ff: ["hhhh", "ll", "ññ"],
    fi: ["vvvv", "kk", "pp"],
    fr: ["aaaa", "mm", "jj"],
    fy: ["jjjj", "mm", "dd"],
    ga: ["bbbb", "mm", "ll"],
    gd: ["bbbb", "mm", "ll"],
    gl: ["aaaa", "mm", "dd"],
    he: ["שנה", "חודש", "יום"],
    hr: ["gggg", "mm", "dd"],
    hsb: ["llll", "mm", "dd"],
    hu: ["éééé", "hh", "nn"],
    ia: ["aaaa", "mm", "dd"],
    id: ["tttt", "bb", "hh"],
    it: ["aaaa", "mm", "gg"],
    ja: ["年", "月", "日"],
    ka: ["წწწწ", "თთ", "რრ"],
    kk: ["жжжж", "аа", "кк"],
    kn: ["ವವವವ", "ಮಿಮೀ", "ದಿದಿ"],
    ko: ["연도", "월", "일"],
    lb: ["jjjj", "mm", "dd"],
    lo: ["ປປປປ", "ດດ", "ວວ"],
    lt: ["mmmm", "mm", "dd"],
    lv: ["gggg", "mm", "dd"],
    meh: ["aaaa", "mm", "dd"],
    ml: ["വർഷം", "മാസം", "തീയതി"],
    ms: ["tttt", "mm", "hh"],
    nl: ["jjjj", "mm", "dd"],
    nn: ["åååå", "mm", "dd"],
    no: ["åååå", "mm", "dd"],
    oc: ["aaaa", "mm", "jj"],
    pl: ["rrrr", "mm", "dd"],
    pt: ["aaaa", "mm", "dd"],
    rm: ["oooo", "mm", "dd"],
    ro: ["aaaa", "ll", "zz"],
    ru: ["гггг", "мм", "дд"],
    sc: ["aaaa", "mm", "dd"],
    scn: ["aaaa", "mm", "jj"],
    sk: ["rrrr", "mm", "dd"],
    sl: ["llll", "mm", "dd"],
    sr: ["гггг", "мм", "дд"],
    sv: ["åååå", "mm", "dd"],
    szl: ["rrrr", "mm", "dd"],
    tg: ["сссс", "мм", "рр"],
    th: ["ปปปป", "ดด", "วว"],
    tr: ["yyyy", "aa", "gg"],
    uk: ["рррр", "мм", "дд"],
    "sr-Latn": ["gggg", "mm", "dd"],
    "zh-CN": ["年", "月", "日"],
    "zh-TW": ["年", "月", "日"],
};

// The placeholders for a tag, matched on the whole tag first, then on the language and the
// script it is written in, and then on the language alone. A tag nothing is written for is
// spelled out in English
const getLocalePlaceholders = (locale: string): LocalePlaceholder => {
    const exact = LOCALE_PLACEHOLDERS[locale];

    if (exact) {
        return exact;
    }

    try {
        const { language, script } = new Intl.Locale(locale);
        const byScript = script ? LOCALE_PLACEHOLDERS[`${language}-${script}`] : undefined;

        return byScript ?? LOCALE_PLACEHOLDERS[language] ?? LOCALE_PLACEHOLDERS.en;
    } catch {
        return LOCALE_PLACEHOLDERS[locale.split("-")[0]] ?? LOCALE_PLACEHOLDERS.en;
    }
};

// What stands in each part until something is typed. The time is written as dashes, which every
// language reads the same way
export const getPlaceholders = (locale: string): Record<DateInputEditableSegmentType, string> => {
    const [year, month, day] = getLocalePlaceholders(locale);

    return {
        year,
        month,
        day,
        hour: "––",
        minute: "––",
        second: "––",
        dayPeriod: "AM/PM",
    };
};

export type SegmentFormatterOptions = {
    granularity: DateInputGranularity;
    leadingZeros: boolean;
    hourCycle?: DateInputHourCycle;
};

// What the formatter is asked for, which settles which parts the date is written in: the day, the
// month and the year always, and the time down to whatever the granularity asks
const getFormatterOptions = ({
    granularity,
    leadingZeros,
    hourCycle,
}: SegmentFormatterOptions): Intl.DateTimeFormatOptions => {
    const digits = leadingZeros ? "2-digit" : "numeric";
    const options: Intl.DateTimeFormatOptions = {
        day: digits,
        month: digits,
        year: "numeric",
        hourCycle: hourCycle === 12 ? "h12" : hourCycle === 24 ? "h23" : undefined,
    };

    if (granularity !== "day") {
        options.hour = digits;
    }

    if (granularity === "minute" || granularity === "second") {
        options.minute = "2-digit";
    }

    if (granularity === "second") {
        options.second = "2-digit";
    }

    return options;
};

// The formatter the parts are read off, which is what settles the order they come in and what is
// written between them. The same locale and options hand back the same formatter, so it can be
// held in a dependency list
export const createSegmentFormatter = (locale: string, options: SegmentFormatterOptions) =>
    createDateFormatter(locale, getFormatterOptions(options));

// How the formatter counts the hours, which is the locale's own where the caller has not said
export const resolveHourCycle = (formatter: Intl.DateTimeFormat): DateInputHourCycleId => {
    const { hourCycle } = formatter.resolvedOptions();

    return hourCycle === "h11" || hourCycle === "h12" || hourCycle === "h24" ? hourCycle : "h23";
};

// What the morning and the afternoon are called in the locale, read off the formatter rather
// than assumed to be AM and PM
export const getDayPeriodNames = (locale: string): [am: string, pm: string] => {
    const formatter = createDateFormatter(locale, { hour: "numeric", hour12: true });
    const morning = new Date(2000, 0, 1, 0);
    const afternoon = new Date(2000, 0, 1, 12);
    const nameOf = (date: Date) =>
        formatter.formatToParts(date).find((part) => part.type === "dayPeriod")?.value;

    return [nameOf(morning) ?? "AM", nameOf(afternoon) ?? "PM"];
};

// Which part of the date a piece of the formatter's output is. Node spells the half of the day
// in lower case, and a year written under another calendar comes back as a related year; anything
// that is not a part the reader types into is a separator
const readPartType = (type: string): DateInputSegmentType => {
    if (type === "dayperiod") {
        return "dayPeriod";
    }

    if (type === "relatedYear") {
        return "year";
    }

    return isEditableType(type as DateInputSegmentType)
        ? (type as DateInputSegmentType)
        : "literal";
};

// The parts the formatter writes a date in, in the order it writes them
export const getSegmentTypes = (formatter: Intl.DateTimeFormat): DateInputEditableSegmentType[] => {
    const types = new Set<DateInputEditableSegmentType>();

    for (const part of formatter.formatToParts(new Date())) {
        const type = readPartType(part.type);

        if (type !== "literal") {
            types.add(type);
        }
    }

    return Array.from(types);
};

export type BuildSegmentsOptions = {
    fields: DateInputFields;
    // The parts read as a date, which is what the formatter is handed to lay them out
    date: Dayjs;
    formatter: Intl.DateTimeFormat;
    placeholders: Record<DateInputEditableSegmentType, string>;
    granularity: DateInputGranularity;
    hourCycle: DateInputHourCycleId;
};

const literalSegment = (text: string): DateInputSegmentDetails => ({
    type: "literal",
    text,
    placeholder: "",
    placeholderShown: false,
    entered: false,
    filled: false,
    editable: false,
});

// Lays the date out as the locale writes it, a segment to a part and a separator between them.
// A part that has not been typed shows its placeholder, and the rest show the figure the
// formatter wrote for them
export const buildSegments = ({
    fields,
    date,
    formatter,
    placeholders,
    granularity,
    hourCycle,
}: BuildSegmentsOptions): DateInputSegmentDetails[] => {
    const segments: DateInputSegmentDetails[] = [];

    for (const part of formatter.formatToParts(date.toDate())) {
        const type = readPartType(part.type);

        if (type === "literal") {
            segments.push(literalSegment(part.value));
            continue;
        }

        const placeholderShown = fields[type] === null;
        // AM and PM are spelled by the formatter rather than by the placeholder, so the part
        // keeps its width whether or not it has been filled in
        const placeholder = type === "dayPeriod" ? part.value : placeholders[type];
        const { minValue, maxValue } = getFieldLimits(type, hourCycle);

        const segment: DateInputSegmentDetails = {
            type,
            text: placeholderShown ? placeholder : part.value,
            value: fields[type] ?? undefined,
            minValue,
            maxValue,
            placeholder,
            placeholderShown,
            // The parts are laid out from the date alone here; how the reader stands on one of
            // them is put back over the top of it by whoever is holding the typing
            entered: false,
            filled: false,
            editable: true,
        };

        // The time is held the right way round in a page read right to left, by isolating it
        // from the hour to the last part of it
        if (type === "hour") {
            segments.push(literalSegment(LEFT_TO_RIGHT_ISOLATE), segment);

            if (granularity === "hour") {
                segments.push(literalSegment(POP_DIRECTIONAL_ISOLATE));
            }
        } else if (TIME_TYPES.includes(type) && type === granularity) {
            segments.push(segment, literalSegment(POP_DIRECTIONAL_ISOLATE));
        } else {
            segments.push(segment);
        }
    }

    return segments;
};
