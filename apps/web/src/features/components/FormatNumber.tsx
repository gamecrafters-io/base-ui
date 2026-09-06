import {
    FormatNumber as FormatNumberComponent,
    Heading,
    LocaleProvider,
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
};

// The locales the same figure is written under. They are ones that differ in what a reader would
// notice: where the grouping falls, which mark separates the decimals, and which way the line runs
const locales = ["en-US", "de-DE", "fr-FR", "ja-JP", "ar-EG"];

// What the examples have to have in hand before they can be drawn
const localesSetup = `const locales = ["en-US", "de-DE", "fr-FR", "ja-JP", "ar-EG"];`;

// The plainest reading there is: the figure, and nothing said about how to write it. It is grouped
// and separated the way the locale it is read under groups and separates.
//
// The page and the component it is about are both called FormatNumber, so the component is brought
// in under a name saying which of the two it is. The listing beneath says FormatNumber, as an
// application importing it would
const defaultPreview = <FormatNumberComponent value={1234.5} />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<FormatNumber value={1234.5} />`;

// A figure written as money. Which sign is drawn and how many places follow it are the currency's
// and the locale's rather than the caller's, so a currency with no minor unit is written without
// the places a caller would otherwise have had to know to leave off
const currencyPreview = (
    <Stack gap="condensed">
        <Text>
            USD:{" "}
            <FormatNumberComponent value={1234.5} format={{ style: "currency", currency: "USD" }} />
        </Text>
        <Text>
            EUR:{" "}
            <FormatNumberComponent value={1234.5} format={{ style: "currency", currency: "EUR" }} />
        </Text>
        <Text>
            JPY:{" "}
            <FormatNumberComponent value={1234.5} format={{ style: "currency", currency: "JPY" }} />
        </Text>
    </Stack>
);

const currencyCode = `<Stack gap="condensed">
    <Text>
        USD: <FormatNumber value={1234.5} format={{ style: "currency", currency: "USD" }} />
    </Text>
    <Text>
        EUR: <FormatNumber value={1234.5} format={{ style: "currency", currency: "EUR" }} />
    </Text>
    <Text>
        JPY: <FormatNumber value={1234.5} format={{ style: "currency", currency: "JPY" }} />
    </Text>
</Stack>`;

// A figure written as a share. What is handed over is the share itself rather than the number of
// hundredths, so a quarter is 0.25 and not 25, and the sign is placed by the locale like any other
const percentPreview = (
    <Stack gap="condensed">
        <Text>
            default: <FormatNumberComponent value={0.256} format={{ style: "percent" }} />
        </Text>
        <Text>
            one place:{" "}
            <FormatNumberComponent
                value={0.256}
                format={{ style: "percent", minimumFractionDigits: 1 }}
            />
        </Text>
    </Stack>
);

const percentCode = `<Stack gap="condensed">
    <Text>
        default: <FormatNumber value={0.256} format={{ style: "percent" }} />
    </Text>
    <Text>
        one place:{" "}
        <FormatNumber value={0.256} format={{ style: "percent", minimumFractionDigits: 1 }} />
    </Text>
</Stack>`;

// A figure written with a unit beside it. The unit is named and placed by the locale along with the
// number, and how far it is spelled out is settled apart from which unit it is
const unitPreview = (
    <Stack gap="condensed">
        <Text>
            short:{" "}
            <FormatNumberComponent
                value={72}
                format={{ style: "unit", unit: "kilometer-per-hour" }}
            />
        </Text>
        <Text>
            long:{" "}
            <FormatNumberComponent
                value={72}
                format={{ style: "unit", unit: "kilometer-per-hour", unitDisplay: "long" }}
            />
        </Text>
        <Text>
            celsius:{" "}
            <FormatNumberComponent value={21} format={{ style: "unit", unit: "celsius" }} />
        </Text>
    </Stack>
);

const unitCode = `<Stack gap="condensed">
    <Text>
        short: <FormatNumber value={72} format={{ style: "unit", unit: "kilometer-per-hour" }} />
    </Text>
    <Text>
        long:{" "}
        <FormatNumber
            value={72}
            format={{ style: "unit", unit: "kilometer-per-hour", unitDisplay: "long" }}
        />
    </Text>
    <Text>
        celsius: <FormatNumber value={21} format={{ style: "unit", unit: "celsius" }} />
    </Text>
</Stack>`;

// How a figure too long to be worth writing out in full is shortened. The three are drawn against
// the same number, since what each of them is for is read against the others
const notationPreview = (
    <Stack gap="condensed">
        <Text>
            standard: <FormatNumberComponent value={1234567} />
        </Text>
        <Text>
            compact: <FormatNumberComponent value={1234567} format={{ notation: "compact" }} />
        </Text>
        <Text>
            scientific:{" "}
            <FormatNumberComponent value={1234567} format={{ notation: "scientific" }} />
        </Text>
    </Stack>
);

const notationCode = `<Stack gap="condensed">
    <Text>
        standard: <FormatNumber value={1234567} />
    </Text>
    <Text>
        compact: <FormatNumber value={1234567} format={{ notation: "compact" }} />
    </Text>
    <Text>
        scientific: <FormatNumber value={1234567} format={{ notation: "scientific" }} />
    </Text>
</Stack>`;

// How many places follow the decimal separator. The two are read against each other, since one
// cuts a reading back and the other pads it out: a figure held to a column of prices wants both
const fractionDigitsPreview = (
    <Stack gap="condensed">
        <Text>
            at most two places:{" "}
            <FormatNumberComponent value={3.14159} format={{ maximumFractionDigits: 2 }} />
        </Text>
        <Text>
            at least two places:{" "}
            <FormatNumberComponent value={3} format={{ minimumFractionDigits: 2 }} />
        </Text>
    </Stack>
);

const fractionDigitsCode = `<Stack gap="condensed">
    <Text>
        at most two places: <FormatNumber value={3.14159} format={{ maximumFractionDigits: 2 }} />
    </Text>
    <Text>
        at least two places: <FormatNumber value={3} format={{ minimumFractionDigits: 2 }} />
    </Text>
</Stack>`;

// The same figure written the way each reader reads it. What changes between these is where the
// grouping falls, which mark stands between the whole and the part, and which way the line runs
const localePreview = (
    <Stack gap="condensed">
        {locales.map((locale) => (
            <LocaleProvider key={locale} locale={locale}>
                <Text>
                    {locale}: <FormatNumberComponent value={1234567.891} />
                </Text>
            </LocaleProvider>
        ))}
    </Stack>
);

const localeCode = `<Stack gap="condensed">
    {locales.map((locale) => (
        <LocaleProvider key={locale} locale={locale}>
            <Text>
                {locale}: <FormatNumber value={1234567.891} />
            </Text>
        </LocaleProvider>
    ))}
</Stack>`;

// One reading written in a locale other than the one it is being read under, which is what a figure
// that belongs to somewhere rather than to the reader wants: a price quoted in the market it is
// sold in, standing in a page written for whoever happens to be reading it
const ownLocalePreview = (
    <LocaleProvider locale="de-DE">
        <Stack gap="condensed">
            <Text>
                Read under de-DE: <FormatNumberComponent value={1234.5} />
            </Text>
            <Text>
                Written in en-US: <FormatNumberComponent locale="en-US" value={1234.5} />
            </Text>
        </Stack>
    </LocaleProvider>
);

const ownLocaleCode = `<LocaleProvider locale="de-DE">
    <Stack gap="condensed">
        <Text>
            Read under de-DE: <FormatNumber value={1234.5} />
        </Text>
        <Text>
            Written in en-US: <FormatNumber locale="en-US" value={1234.5} />
        </Text>
    </Stack>
</LocaleProvider>`;

// The reading handed over already written rather than worked out here. It is what a figure whose
// locale is only settled in the browser wants: the server writes what it can and the reading is
// swapped for the reader's own once there is one, without the markup around it changing
const childrenPreview = <FormatNumberComponent value={1234.5}>1.234,5</FormatNumberComponent>;

const childrenCode = `<FormatNumber value={1234.5}>1.234,5</FormatNumber>`;

// The reading as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then each of the shapes a figure is written in, then what is done to the places it
// runs to, then whose locale it is written under, and last what is done where the reading is not to
// be worked out here at all
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Money",
        description:
            "A figure written as money. Which sign is drawn and how many places follow it are the currency's and the locale's rather than the caller's, so the yen below is written whole while the other two carry their minor units, without a caller having had to know which does which.",
        preview: currencyPreview,
        code: currencyCode,
    },
    {
        name: "Percent",
        description:
            "A figure written as a share. What is handed over is the share itself rather than the number of hundredths, so a quarter is 0.25 and not 25, and the sign is placed by the locale like any other.",
        preview: percentPreview,
        code: percentCode,
    },
    {
        name: "Units",
        description:
            "A figure written with a unit beside it. The unit is named and placed by the locale along with the number, and how far it is spelled out is settled apart from which unit it is, so the same unit is shortened for a table and written out in full for a sentence.",
        preview: unitPreview,
        code: unitCode,
    },
    {
        name: "Notation",
        description:
            "How a figure too long to be worth writing out in full is shortened. The compact one is for a figure being glanced at rather than read, and the scientific one for a reading whose size is what is being compared.",
        preview: notationPreview,
        code: notationCode,
    },
    {
        name: "Fraction digits",
        description:
            "How many places follow the decimal separator. One cuts a reading back and the other pads it out, and a column of figures that has to line up down the page wants both, since it is the padding that keeps the separators level.",
        preview: fractionDigitsPreview,
        code: fractionDigitsCode,
    },
    {
        name: "Under another locale",
        description:
            "The same figure written the way each reader reads it. What changes between these is where the grouping falls, which mark stands between the whole and the part, and which way the line runs. A reading follows the provider it is read under, so nothing has to be said at each of them.",
        setup: localesSetup,
        preview: localePreview,
        code: localeCode,
    },
    {
        name: "A locale of its own",
        description:
            "One reading written in a locale other than the one it is being read under, which is what a figure belonging to somewhere rather than to the reader wants: a price quoted in the market it is sold in, standing in a page written for whoever happens to be reading it.",
        preview: ownLocalePreview,
        code: ownLocaleCode,
    },
    {
        name: "Handed the reading already written",
        description:
            "The reading written elsewhere rather than worked out here, which is what a figure whose locale is only settled in the browser wants: the server writes what it can, and the reading is swapped for the reader's own once there is one, without the markup around it changing.",
        preview: childrenPreview,
        code: childrenCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the reading takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// The figure comes first, since it is the whole of what the reading is about, then how it is to be
// written, then whose locale it is written under, and last what is done where it has been written
// already.
//
// The shape is taken straight from Intl rather than being declared again here, so what is said of
// it is where it comes from and which of its keys are actually reached for
const groups: ComponentPropGroup[] = [
    {
        name: "FormatNumber",
        props: [
            {
                name: "value",
                type: "number",
                required: true,
                description:
                    "The number to write out. A figure written as a share is handed over as the share itself rather than as the number of hundredths, so a quarter is 0.25",
            },
            {
                name: "format",
                type: "Intl.NumberFormatOptions",
                description:
                    "The shape the reading is written in, taken straight from Intl.NumberFormat rather than declared again here: style for whether it is a plain figure, money, a share or a unit, currency and unit for which of those, unitDisplay for how far the unit is spelled out, notation for how a long figure is shortened, and minimumFractionDigits and maximumFractionDigits for the places after the separator. It is kept together under one prop rather than spread across several so that style stays the element's own",
            },
            {
                name: "locale",
                type: "string",
                description:
                    "The locale the reading is written under, for the odd one that has to be written in a locale other than the one it is being read under. Left out, it follows the LocaleProvider above it, and outside a provider it falls back to en-US",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Stands in for the reading, so a figure whose locale is only settled in the browser can be handed over already written out. The value is still required, since it is what the reading is of",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the reading is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const FormatNumber = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                FormatNumber
            </Heading>
            <Text as="p" size="large">
                A number written the way the reader reads it. Where the grouping falls, which mark
                separates the decimals and which side a currency sign or a unit sits on are the
                locale&apos;s to settle, so a figure written into the page from a source that knows
                none of that still reads properly. The shape it is written in is handed over whole
                as Intl.NumberFormat&apos;s own options rather than spread across props of its own,
                which is what keeps the word style naming the shape to Intl inside the format and
                leaves the element&apos;s own style attribute alone beside it. It follows the
                LocaleProvider it is read under unless it is handed a locale of its own, and it is
                drawn as a span, so a reading stands inside a sentence as readily as on a line of
                its own.
            </Text>
        </Stack>
        <ComponentExamples component="FormatNumber" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default FormatNumber;
