import {
    Heading,
    Link,
    RelativeTime as RelativeTimeComponent,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    muted: "text-[var(--foreground-color-muted)]",
};

// The spans the times on this page are set against now by. They are written out rather than
// reached for from somewhere, since what a reader copies has only itself to reach for
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

// A time far enough from now that it is written out as a date rather than read against it
const distant = new Date("2020-01-01T00:00:00Z");

// What the examples have to have in hand before they can be drawn. It is written once and reached
// for by each of them
const spansSetup = `const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const distant = new Date("2020-01-01T00:00:00Z");`;

// The plainest reading there is: a time near enough to now to be read against it, which comes out
// as the words a reader would use for it. It carries the whole date as a title, so the reading can
// be checked without leaving the page.
//
// The page and the component it is about are both called RelativeTime, so the component is brought
// in under a name saying which of the two it is. The listing beneath says RelativeTime, as an
// application importing it would
const defaultPreview = (
    <Stack align="start">
        <RelativeTimeComponent date={new Date(Date.now() - 3 * DAY)} />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<RelativeTime date={new Date(Date.now() - 3 * DAY)} />`;

// How the reading changes with how near the time is. They are drawn together rather than one to an
// example, since what is being read is the run of them: the same component saying seconds, minutes,
// days and days to come
const nearnessPreview = (
    <Stack gap="condensed">
        <RelativeTimeComponent date={new Date(Date.now() - 30 * 1000)} noTitle />
        <RelativeTimeComponent date={new Date(Date.now() - 5 * MINUTE)} noTitle />
        <RelativeTimeComponent date={new Date(Date.now() - 3 * DAY)} noTitle />
        <RelativeTimeComponent date={new Date(Date.now() + 2 * DAY)} noTitle />
        <RelativeTimeComponent date={distant} noTitle />
    </Stack>
);

const nearnessCode = `<Stack gap="condensed">
    <RelativeTime date={new Date(Date.now() - 30 * 1000)} noTitle />
    <RelativeTime date={new Date(Date.now() - 5 * MINUTE)} noTitle />
    <RelativeTime date={new Date(Date.now() - 3 * DAY)} noTitle />
    <RelativeTime date={new Date(Date.now() + 2 * DAY)} noTitle />
    <RelativeTime date={distant} noTitle />
</Stack>`;

// The terse reading, where the same times are cut down to fit beside other content
const microPreview = (
    <Stack gap="condensed">
        <RelativeTimeComponent format="micro" date={new Date(Date.now() - 30 * 1000)} noTitle />
        <RelativeTimeComponent format="micro" date={new Date(Date.now() - 5 * MINUTE)} noTitle />
        <RelativeTimeComponent format="micro" date={new Date(Date.now() - 3 * DAY)} noTitle />
    </Stack>
);

const microCode = `<Stack gap="condensed">
    <RelativeTime format="micro" date={new Date(Date.now() - 30 * 1000)} noTitle />
    <RelativeTime format="micro" date={new Date(Date.now() - 5 * MINUTE)} noTitle />
    <RelativeTime format="micro" date={new Date(Date.now() - 3 * DAY)} noTitle />
</Stack>`;

// The duration reading, which counts rather than rounds: how long there is until a time to come,
// and how long there has been since one gone by
const elapsedPreview = (
    <Stack gap="condensed">
        <RelativeTimeComponent format="elapsed" date={new Date("2038-01-19T03:14:08Z")} noTitle />
        <RelativeTimeComponent format="elapsed" date={distant} noTitle />
    </Stack>
);

const elapsedCode = `<Stack gap="condensed">
    <RelativeTime format="elapsed" date={new Date("2038-01-19T03:14:08Z")} noTitle />
    <RelativeTime format="elapsed" date={distant} noTitle />
</Stack>`;

// How far a duration is broken down. The same span is read three times over, each cut off at a
// smaller unit than the last
const precisionPreview = (
    <Stack gap="condensed">
        <RelativeTimeComponent format="elapsed" precision="day" date={distant} noTitle />
        <RelativeTimeComponent format="elapsed" precision="hour" date={distant} noTitle />
        <RelativeTimeComponent format="elapsed" precision="minute" date={distant} noTitle />
    </Stack>
);

const precisionCode = `<Stack gap="condensed">
    <RelativeTime format="elapsed" precision="day" date={distant} noTitle />
    <RelativeTime format="elapsed" precision="hour" date={distant} noTitle />
    <RelativeTime format="elapsed" precision="minute" date={distant} noTitle />
</Stack>`;

// How far from now a time still reads against it. The same time is inside one threshold and outside
// the other, so the two readings stand side by side
const thresholdPreview = (
    <Stack gap="condensed">
        <RelativeTimeComponent date={new Date(Date.now() - 3 * DAY)} threshold="P30D" noTitle />
        <RelativeTimeComponent date={new Date(Date.now() - 3 * DAY)} threshold="P1D" noTitle />
    </Stack>
);

const thresholdCode = `<Stack gap="condensed">
    <RelativeTime date={new Date(Date.now() - 3 * DAY)} threshold="P30D" noTitle />
    <RelativeTime date={new Date(Date.now() - 3 * DAY)} threshold="P1D" noTitle />
</Stack>`;

// A date written out as fully as it can be, with nothing standing before it
const longDatePreview = (
    <Stack align="start">
        <RelativeTimeComponent
            date={distant}
            weekday="long"
            day="2-digit"
            month="short"
            year="numeric"
            hour="numeric"
            minute="2-digit"
            timeZoneName="short"
            prefix=""
            noTitle
        />
    </Stack>
);

const longDateCode = `<RelativeTime
    date={distant}
    weekday="long"
    day="2-digit"
    month="short"
    year="numeric"
    hour="numeric"
    minute="2-digit"
    timeZoneName="short"
    prefix=""
    noTitle
/>`;

// Which way a time is allowed to read. The same time to come reads against now where either way
// will do, and is written out as a date where only the past will
const tensePreview = (
    <Stack gap="condensed">
        <RelativeTimeComponent date={new Date(Date.now() + 2 * DAY)} tense="auto" noTitle />
        <RelativeTimeComponent date={new Date(Date.now() + 2 * DAY)} tense="past" noTitle />
    </Stack>
);

const tenseCode = `<Stack gap="condensed">
    <RelativeTime date={new Date(Date.now() + 2 * DAY)} tense="auto" noTitle />
    <RelativeTime date={new Date(Date.now() + 2 * DAY)} tense="past" noTitle />
</Stack>`;

// A time given as a string rather than as a date, which is the form one arrives from a server in
const datetimePreview = (
    <Stack align="start">
        <RelativeTimeComponent datetime="2020-01-01T00:00:00Z" noTitle />
    </Stack>
);

const datetimeCode = `<RelativeTime datetime="2020-01-01T00:00:00Z" noTitle />`;

// Words of the caller's own, standing in for the reading the component would work out, with the
// time itself still carried on the element
const childrenPreview = (
    <Stack align="start">
        <Link href="#commit">
            Committed <RelativeTimeComponent date={new Date(Date.now() - 2 * DAY)} />
        </Link>
    </Stack>
);

const childrenCode = `<Link href="#commit">
    Committed <RelativeTime date={new Date(Date.now() - 2 * DAY)} />
</Link>`;

// The time as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then how the reading changes with how near the time is, then the readings that are asked
// for by name, then what settles which of them is used, and last how the time is handed over
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A time near enough to now to be read against it, which comes out as the words a reader would use for it. It is drawn as a time element carrying the moment itself, and as a title carrying the whole date, so the reading can be checked by resting on it — the words are for reading at a glance and the date underneath is what they stand for. It is worked out again only when the wording would really change, so a time far from now costs nothing to leave on the page.",
        setup: spansSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "How near the time is",
        description:
            "The same component saying seconds, minutes, days and days to come, and then giving up on reading against now altogether. A time is rounded to the largest unit it reaches, so a little over two hours reads as two hours rather than as a run of ever smaller units, and one further off than the threshold is written out as a date instead.",
        setup: spansSetup,
        preview: nearnessPreview,
        code: nearnessCode,
    },
    {
        name: "The terse form",
        description:
            "The same readings cut down to a number and a letter, for a time standing beside other content rather than in a sentence of its own — a row in a list, a column in a table. A span under a minute is rounded up to one rather than counted in seconds, since a count of seconds ticking beside a hundred rows is movement without news.",
        setup: spansSetup,
        preview: microPreview,
        code: microCode,
    },
    {
        name: "As a duration",
        description:
            "The whole span counted out in units side by side rather than rounded to one of them, which is what a countdown wants: how long there is until a time to come, and how long there has been since one gone by. It never gives up and reads as a date, however far off the time is, since a duration is what was asked for.",
        setup: spansSetup,
        preview: elapsedPreview,
        code: elapsedCode,
    },
    {
        name: "How far a duration is broken down",
        description:
            "The smallest unit a duration is cut off at. Anything smaller is left out rather than rounded into what is shown, and the unit on show is also what settles how often the reading is worked out again — a duration counted to the second is redrawn every second, and one counted to the day once a day.",
        setup: spansSetup,
        preview: precisionPreview,
        code: precisionCode,
    },
    {
        name: "How far from now a time reads against it",
        description:
            "The span within which a time is read against now, written as an ISO8601 duration — a month either side of it unless it is told otherwise. Past that, the time is written out as a date: the same moment reads as three days ago inside a month and as its date inside a day.",
        setup: spansSetup,
        preview: thresholdPreview,
        code: thresholdCode,
    },
    {
        name: "Written out in full",
        description:
            "How a date is spelled out once it is being written out rather than read against now, taken straight from Intl.DateTimeFormat. The day and the month are always there; the year only when it is not the one the reader is in, so a date from this year cannot be read as any other. The word standing before it is the caller's, and can be taken away.",
        setup: spansSetup,
        preview: longDatePreview,
        code: longDateCode,
    },
    {
        name: "Which way it may read",
        description:
            "Whether a time is allowed to read against now at all, and which side of now it may fall on. A time to come reads as in two days where either way will do, and is written out as a date where only the past will — which is what a page saying when something happened wants, so that a clock a few minutes fast does not have it happening tomorrow.",
        setup: spansSetup,
        preview: tensePreview,
        code: tenseCode,
    },
    {
        name: "Given as a string",
        description:
            "The same time handed over as an ISO8601 string, which is the form it arrives from a server in. A string that cannot be read as a date leaves the element empty rather than showing something wrong.",
        preview: datetimePreview,
        code: datetimeCode,
    },
    {
        name: "Set in a line of words",
        description:
            "A time read as part of a sentence about what happened, which is where most of them belong. Words of the caller's own can stand in for the reading altogether, for a time already written out on the server, and the moment itself is still carried on the element either way.",
        setup: spansSetup,
        preview: childrenPreview,
        code: childrenCode,
    },
];

// Whether the time reads in full, in the terse form, or as a duration
const format = '"auto" | "micro" | "elapsed"';

// Which way a relative time is allowed to read
const tense = '"auto" | "past" | "future"';

// The smallest unit an elapsed time is broken down into
const precision = '"year" | "month" | "day" | "hour" | "minute" | "second"';

// How a part of a date is spelled out, which is Intl.DateTimeFormat's own wording
const numeric = '"numeric" | "2-digit"';

// Every prop the time takes. The moment itself comes first, since it is what a time is, then which
// reading is used and what settles it, then how a date is spelled out once one is written, and last
// what the element carries.
//
// The parts of a date are kept in a table of their own: they are the time's own props, handed
// straight to Intl.DateTimeFormat, and only matter once the time is being written out as a date
const groups: ComponentPropGroup[] = [
    {
        name: "RelativeTime",
        props: [
            {
                name: "date",
                type: "Date",
                description:
                    "The time to show. A time that cannot be read leaves the element empty rather than showing something wrong",
            },
            {
                name: "datetime",
                type: "string",
                description:
                    "The same time as an ISO8601 string, which is the form one arrives from a server in. A date given alongside it wins",
            },
            {
                name: "format",
                type: format,
                default: '"auto"',
                description:
                    "Whether the time reads in the words a reader would use, cut down to a number and a letter, or counted out as a duration. A duration never gives up and reads as a date, however far off the time is",
            },
            {
                name: "tense",
                type: tense,
                default: '"auto"',
                description:
                    "Which side of now a time may fall on to be read against it. One that falls on the other side is written out as a date instead, which is what a page saying when something happened wants: a clock a few minutes fast should not have it happening tomorrow",
            },
            {
                name: "precision",
                type: precision,
                default: '"second"',
                description:
                    "The smallest unit a duration is broken down into. Anything smaller is left out rather than rounded into what is shown, and the unit on show is what settles how often the reading is worked out again",
            },
            {
                name: "threshold",
                type: "string",
                default: '"P30D"',
                description:
                    "How far from now a time still reads against it, as an ISO8601 duration. Past it, the time is written out as a date. Anything that cannot be read as a duration falls back to the month either side",
            },
            {
                name: "prefix",
                type: "string",
                default: '"on"',
                description:
                    "What stands before a date that has been written out. An empty string leaves the date on its own, which is what a time standing in a column rather than in a sentence wants",
            },
            {
                name: "noTitle",
                type: "boolean",
                default: "false",
                description:
                    "Drops the title the time carries by default. The title is the whole date the reading stands for, so it is worth keeping wherever the reading is the rounded one; a time already written out in full has nothing to add",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Words standing in for the reading the component would work out, for a time already written out on the server. The moment itself is still carried on the element either way",
            },
            {
                name: "className",
                type: "string",
                description: "Class name for custom styling",
            },
            {
                name: "as",
                type: "React.ElementType",
                default: '"time"',
                description:
                    "The element or component this is drawn as, in place of its default. A time element is what a moment belongs in, since it carries the moment itself alongside the words",
            },
        ],
    },
    {
        name: "RelativeTimeDateOptions",
        props: [
            {
                name: "weekday",
                type: '"short" | "long" | "narrow"',
                description: "How the weekday is spelled out. Left out, it is not written at all",
            },
            {
                name: "year",
                type: numeric,
                description:
                    "How the year is spelled out. Left out, it is written for a date from any year but the one the reader is in, so a date from this year cannot be read as any other",
            },
            {
                name: "month",
                type: '"numeric" | "2-digit" | "short" | "long" | "narrow"',
                default: '"short"',
                description: "How the month is spelled out",
            },
            {
                name: "day",
                type: numeric,
                default: '"numeric"',
                description: "How the day is spelled out",
            },
            {
                name: "hour",
                type: numeric,
                description: "How the hour is spelled out. Left out, no time of day is written",
            },
            {
                name: "minute",
                type: numeric,
                description: "How the minute is spelled out",
            },
            {
                name: "second",
                type: numeric,
                description: "How the second is spelled out",
            },
            {
                name: "timeZoneName",
                type: '"short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric"',
                description:
                    "How the time zone is spelled out, for a date whose reader may not be in the same one",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the time is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const RelativeTime = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                RelativeTime
            </Heading>
            <Text as="p" size="large">
                A moment written the way a reader thinks of it: three days ago while it is near
                enough for that to mean something, and a date once it is not. It is drawn as a time
                element carrying the moment itself, and as a title carrying the whole date, so the
                rounded words are for reading at a glance and what they stand for is a rest of the
                pointer away.
            </Text>
            <Text as="p" size="large" className={classes.muted}>
                It keeps itself up to date, and works the reading out again only when the wording
                would really change — a time counted in seconds every second, one counted in days
                once a day, and one already written out as a date never again. That is what makes a
                page of them cost little: a hundred times on a list are a hundred readings, not a
                hundred clocks.
            </Text>
        </Stack>
        <ComponentExamples component="RelativeTime" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default RelativeTime;
