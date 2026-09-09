import * as React from "react";
import dayjs from "dayjs";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { LocaleProvider } from "../../providers/locale";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { FormControl } from "../form-control";
import { Stack } from "../stack";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { DateInput, useDateInput, useDateInputContext } from ".";
import type { CalendarRange } from "../calendar";
import type { TextInputSize } from "../text-input";
import type { DateInputGranularity } from "./DateInput.types";

const classes = {
    row: "flex flex-wrap items-end gap-[var(--base-size-16)]",
    form: "flex flex-col gap-[var(--base-size-16)] w-[var(--overlay-width-small)]",
    year: "font-semibold",
};

const today = dayjs();

const sizes: TextInputSize[] = ["small", "medium", "large"];

const granularities: DateInputGranularity[] = ["hour", "minute", "second"];

// How far a stretch of time has been typed, written out so that both ends can be read as they
// are taken
const describeRange = ({ from, to }: CalendarRange) => {
    if (!from) {
        return "Nothing typed yet";
    }

    if (!to) {
        return `${from.toDateString()} — type the day it runs to`;
    }

    return `${from.toDateString()} to ${to.toDateString()}`;
};

export default {
    title: "Components/DateInput/Features",
    parameters: {
        layout: "centered",
    },
};

// The parts of one date, which every input below is drawn from unless it says otherwise
const Field = ({ label, children }: React.PropsWithChildren<{ label: string }>) => (
    <>
        <DateInput.Label>{label}</DateInput.Label>
        <DateInput.Control>
            <DateInput.SegmentGroup />
            {children}
        </DateInput.Control>
        <DateInput.HiddenInput />
    </>
);

// A Date In Full, which is the parts written out
export const Basic: StoryFn<typeof DateInput> = () => (
    <DateInput>
        <DateInput.Label>Starts on</DateInput.Label>
        <DateInput.Control>
            <DateInput.SegmentGroup />
        </DateInput.Control>
        <DateInput.HiddenInput />
    </DateInput>
);

// A Date To Start From, which the input keeps for itself
export const DefaultValue: StoryFn<typeof DateInput> = () => (
    <DateInput defaultValue={today}>
        <Field label="Starts on" />
    </DateInput>
);

// A Date The Caller Is Holding, so that anything else on the page can move it too
export const Controlled: StoryFn<typeof DateInput> = () => {
    const [value, setValue] = React.useState<Date | null>(null);

    return (
        <Stack gap="normal" align="start">
            <DateInput value={value} onChange={setValue}>
                <Field label="Starts on" />
            </DateInput>
            <div className={classes.row}>
                <Button onClick={() => setValue(today.toDate())}>Today</Button>
                <Button onClick={() => setValue(today.add(7, "day").toDate())}>Next week</Button>
                <Button onClick={() => setValue(null)}>Clear</Button>
            </div>
            <Text>{value ? value.toDateString() : "Nothing typed yet"}</Text>
        </Stack>
    );
};

// A Stretch Of Time, typed as two dates side by side. Either end can be typed on its own, and
// running off the end of one lands on the start of the other
export const Range: StoryFn<typeof DateInput> = () => {
    const [range, setRange] = React.useState<CalendarRange>({ from: null, to: null });

    return (
        <Stack gap="normal" align="start">
            <DateInput mode="range" value={range} onChange={setRange}>
                <DateInput.Label>Runs from</DateInput.Label>
                <DateInput.Control>
                    <DateInput.SegmentGroup index={0} />
                    <span aria-hidden="true">–</span>
                    <DateInput.SegmentGroup index={1} />
                </DateInput.Control>
                <DateInput.HiddenInput index={0} />
                <DateInput.HiddenInput index={1} />
            </DateInput>
            <Text>{describeRange(range)}</Text>
        </Stack>
    );
};

// Down To The Second, or to the hour or the minute, which add the time after the date
export const Granularity: StoryFn<typeof DateInput> = () => (
    <div className={classes.row}>
        {granularities.map((granularity) => (
            <DateInput key={granularity} granularity={granularity}>
                <Field label={`To the ${granularity}`} />
            </DateInput>
        ))}
    </div>
);

// Counted To Twelve Or To Twenty-Four, whichever way the locale would not have done on its own
export const HourCycle: StoryFn<typeof DateInput> = () => (
    <div className={classes.row}>
        <DateInput granularity="minute" hourCycle={12} defaultValue={today}>
            <Field label="Twelve hours" />
        </DateInput>
        <DateInput granularity="minute" hourCycle={24} defaultValue={today}>
            <Field label="Twenty-four hours" />
        </DateInput>
    </div>
);

// Leading Zeros, which write the month, the day and the hour with two figures
export const LeadingZeros: StoryFn<typeof DateInput> = () => (
    <DateInput leadingZeros defaultValue={today.month(5).date(5)}>
        <Field label="Starts on" />
    </DateInput>
);

// Laid Out The Way The Reader Reads, which follows the locale the input stands in: the order the
// parts come in, what stands between them, and what the placeholders are spelled as
export const Localized: StoryFn<typeof DateInput> = () => (
    <div className={classes.row}>
        {["en-US", "en-GB", "de-DE", "ja-JP"].map((locale) => (
            <LocaleProvider key={locale} locale={locale}>
                <DateInput granularity="minute">
                    <Field label={locale} />
                </DateInput>
            </LocaleProvider>
        ))}
    </div>
);

// Read Right To Left, where the date turns around with the page and the time keeps its order
export const RightToLeft: StoryFn<typeof DateInput> = () => (
    <LocaleProvider locale="ar-EG">
        <DateInput granularity="minute" defaultValue={today}>
            <Field label="التاريخ" />
        </DateInput>
    </LocaleProvider>
);

// The Earliest And The Latest Date That Can Be Typed. A date outside them is brought back to
// whichever end it ran past once the reader leaves the input
export const MinMax: StoryFn<typeof DateInput> = () => (
    <DateInput min={today.startOf("year")} max={today.endOf("year")}>
        <Field label="This year" />
    </DateInput>
);

// A Date Ruled Out, for a reason the input has no way of knowing. A weekend is not refused, but
// marks the input invalid
export const UnavailableDates: StoryFn<typeof DateInput> = () => (
    <DateInput
        defaultValue={today}
        isDateUnavailable={(date) => date.getDay() === 0 || date.getDay() === 6}
    >
        <Field label="A weekday" />
    </DateInput>
);

// Sizes, which the field takes from the control scale
export const Sizes: StoryFn<typeof DateInput> = () => (
    <div className={classes.row}>
        {sizes.map((size) => (
            <DateInput key={size} size={size} defaultValue={today}>
                <Field label={size} />
            </DateInput>
        ))}
    </div>
);

// Filling Whatever Holds It, rather than standing at a width of its own
export const Block: StoryFn<typeof DateInput> = () => (
    <div className={classes.form}>
        <DateInput block>
            <Field label="Starts on" />
        </DateInput>
    </div>
);

// Saying How The Field Stands, in the same way as any other field
export const States: StoryFn<typeof DateInput> = () => (
    <div className={classes.row}>
        <DateInput invalid defaultValue={today}>
            <Field label="Invalid" />
        </DateInput>
        <DateInput readOnly defaultValue={today}>
            <Field label="Read only" />
        </DateInput>
        <DateInput disabled defaultValue={today}>
            <Field label="Disabled" />
        </DateInput>
    </div>
);

// A button standing in the field among the parts, reading the input around it to know whether
// there is anything to take out
const ClearAction = () => {
    const { value = [], clearValue } = useDateInputContext();

    return (
        <TextInput.Action
            icon={DismissRegular}
            aria-label="Clear the date"
            disabled={!value.some((date) => date !== null)}
            onClick={clearValue}
        />
    );
};

// With A Clear Button, which takes the date out again from inside the field
export const WithClearButton: StoryFn<typeof DateInput> = () => (
    <DateInput defaultValue={today}>
        <Field label="Starts on">
            <ClearAction />
        </Field>
    </DateInput>
);

// Root Provider, where the input is drawn from a hook the caller is holding, so it can be set and
// read from somewhere else on the page as well as from the input itself
export const RootProvider: StoryFn<typeof DateInput> = () => {
    const dateInput = useDateInput({ granularity: "minute" });

    return (
        <Stack gap="condensed" align="start">
            <DateInput.RootProvider value={dateInput}>
                <Field label="Meeting" />
            </DateInput.RootProvider>
            <Text size="small">{dateInput.valueAsString[0] || "Nothing typed yet"}</Text>
            <Button size="small" onClick={() => dateInput.setValue([new Date()])}>
                Now
            </Button>
        </Stack>
    );
};

// Drawing The Segments By Hand, for a caller who wants to set one part apart from the rest
export const CustomSegments: StoryFn<typeof DateInput> = () => (
    <DateInput>
        <DateInput.Label>Starts on</DateInput.Label>
        <DateInput.Control>
            <DateInput.SegmentGroup>
                {(segments) =>
                    segments.map((segment, index) => (
                        <DateInput.Segment
                            key={`${segment.type}-${index}`}
                            segment={segment}
                            className={segment.type === "year" ? classes.year : undefined}
                        />
                    ))
                }
            </DateInput.SegmentGroup>
        </DateInput.Control>
        <DateInput.HiddenInput />
    </DateInput>
);

// In A Form Control, which names the parts by its label and describes them by its caption and
// its validation message
export const InFormControl: StoryFn<typeof DateInput> = () => (
    <FormControl required>
        <FormControl.Label>Starts on</FormControl.Label>
        <DateInput invalid>
            <DateInput.Control>
                <DateInput.SegmentGroup />
            </DateInput.Control>
            <DateInput.HiddenInput />
        </DateInput>
        <FormControl.Validation variant="error">Pick a day this year</FormControl.Validation>
        <FormControl.Caption>The day the event starts</FormControl.Caption>
    </FormControl>
);

// With A Calendar, where the two hold the one date between them: typed into one, picked out of
// the other
export const WithACalendar: StoryFn<typeof DateInput> = () => {
    const [value, setValue] = React.useState<Date | null>(today.toDate());

    return (
        <Stack gap="normal" align="start">
            <DateInput value={value} onChange={setValue}>
                <Field label="Starts on" />
            </DateInput>
            <Calendar value={value} onChange={setValue} />
        </Stack>
    );
};

// In A Form, where the date is submitted under its name the way a native date input submits it
export const InAForm: StoryFn<typeof DateInput> = () => {
    const [submitted, setSubmitted] = React.useState("Not submitted");

    return (
        <Stack
            as="form"
            gap="condensed"
            align="start"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setSubmitted(
                    `Sent ${new FormData(event.currentTarget).get("starts-on") || "nothing"}`,
                );
            }}
        >
            <DateInput name="starts-on" defaultValue={today}>
                <Field label="Starts on" />
            </DateInput>
            <Button type="submit" size="small">
                Submit
            </Button>
            <Text size="small">{submitted}</Text>
        </Stack>
    );
};
