import {
    FormatByte as FormatByteComponent,
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

// A run of sizes far enough apart that each is written under a prefix of its own, so what the
// component does as a size grows can be read down the column rather than described
const sizes = [500, 1500, 1.5e6, 1.5e9, 1.5e12];

// The locales the same size is written under. They are ones that differ in what a reader would
// notice: the mark between the whole and the part, where the unit stands, and which way the line
// runs
const locales = ["en-US", "de-DE", "fr-FR", "ja-JP", "ar-EG"];

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the examples that need it
const sizesSetup = `const sizes = [500, 1500, 1.5e6, 1.5e9, 1.5e12];`;

const localesSetup = `const locales = ["en-US", "de-DE", "fr-FR", "ja-JP", "ar-EG"];`;

// The plainest reading there is: the size, and nothing said about how to write it. It comes to the
// decimal system, counted in bytes, with the unit shortened and the reading held to three
// significant digits.
//
// The page and the component it is about are both called FormatByte, so the component is brought in
// under a name saying which of the two it is. The listing beneath says FormatByte, as an
// application importing it would
const defaultPreview = <FormatByteComponent value={1500} />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<FormatByte value={1500} />`;

// What the reading comes to as the size grows. The prefix is stepped up one at a time rather than
// worked out at once, so a size past the largest prefix there is a name for keeps that name instead
// of running off the end of them
const sizesPreview = (
    <Stack gap="condensed">
        {sizes.map((size) => (
            <FormatByteComponent key={size} value={size} />
        ))}
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read one under another
const sizesCode = `<Stack gap="condensed">
    {sizes.map((size) => (
        <FormatByte key={size} value={size} />
    ))}
</Stack>`;

// Whether a kilobyte is a thousand bytes or 1024 of them. The two are drawn together rather than
// one to an example, since what either of them says is said against the other: the same number of
// bytes written twice.
//
// Intl has no name for the binary units, so a size counted in 1024s is still read out as kB rather
// than as KiB. What the system settles is the arithmetic rather than the name
const unitSystemPreview = (
    <Stack gap="condensed">
        <Text>
            decimal: <FormatByteComponent value={1048576} format={{ unitSystem: "decimal" }} />
        </Text>
        <Text>
            binary: <FormatByteComponent value={1048576} format={{ unitSystem: "binary" }} />
        </Text>
    </Stack>
);

const unitSystemCode = `<Stack gap="condensed">
    <Text>
        decimal: <FormatByte value={1048576} format={{ unitSystem: "decimal" }} />
    </Text>
    <Text>
        binary: <FormatByte value={1048576} format={{ unitSystem: "binary" }} />
    </Text>
</Stack>`;

// A size measured the way a connection is rather than the way a file is. It is the unit the reading
// is written in rather than a conversion, so the number handed over is read as that many bits
const bitsPreview = (
    <Stack gap="condensed">
        <FormatByteComponent value={1500} format={{ unit: "bit" }} />
        <FormatByteComponent value={1.5e6} format={{ unit: "bit" }} />
    </Stack>
);

const bitsCode = `<Stack gap="condensed">
    <FormatByte value={1500} format={{ unit: "bit" }} />
    <FormatByte value={1.5e6} format={{ unit: "bit" }} />
</Stack>`;

// How far the unit itself is spelled out. The three are drawn together, since which of them a
// reading wants is settled by the room it is being read in rather than by the size
const unitDisplayPreview = (
    <Stack gap="condensed">
        <Text>
            short: <FormatByteComponent value={1500} format={{ unitDisplay: "short" }} />
        </Text>
        <Text>
            long: <FormatByteComponent value={1500} format={{ unitDisplay: "long" }} />
        </Text>
        <Text>
            narrow: <FormatByteComponent value={1500} format={{ unitDisplay: "narrow" }} />
        </Text>
    </Stack>
);

const unitDisplayCode = `<Stack gap="condensed">
    <Text>
        short: <FormatByte value={1500} format={{ unitDisplay: "short" }} />
    </Text>
    <Text>
        long: <FormatByte value={1500} format={{ unitDisplay: "long" }} />
    </Text>
    <Text>
        narrow: <FormatByte value={1500} format={{ unitDisplay: "narrow" }} />
    </Text>
</Stack>`;

// How many digits of the reading are worth writing. It is significant digits rather than decimal
// places, so the same number holds however far up the prefixes a size has been carried
const precisionPreview = (
    <Stack gap="condensed">
        <Text>
            1: <FormatByteComponent value={1234567} format={{ precision: 1 }} />
        </Text>
        <Text>
            3: <FormatByteComponent value={1234567} format={{ precision: 3 }} />
        </Text>
        <Text>
            5: <FormatByteComponent value={1234567} format={{ precision: 5 }} />
        </Text>
    </Stack>
);

const precisionCode = `<Stack gap="condensed">
    <Text>
        1: <FormatByte value={1234567} format={{ precision: 1 }} />
    </Text>
    <Text>
        3: <FormatByte value={1234567} format={{ precision: 3 }} />
    </Text>
    <Text>
        5: <FormatByte value={1234567} format={{ precision: 5 }} />
    </Text>
</Stack>`;

// The same size written the way each reader reads it. The unit is named and placed by the locale
// along with the number, so what changes between these is not only the mark between the whole and
// the part but where the unit stands and which way the line runs
const localePreview = (
    <Stack gap="condensed">
        {locales.map((locale) => (
            <LocaleProvider key={locale} locale={locale}>
                <Text>
                    {locale}: <FormatByteComponent value={1500} format={{ unitDisplay: "long" }} />
                </Text>
            </LocaleProvider>
        ))}
    </Stack>
);

const localeCode = `<Stack gap="condensed">
    {locales.map((locale) => (
        <LocaleProvider key={locale} locale={locale}>
            <Text>
                {locale}: <FormatByte value={1500} format={{ unitDisplay: "long" }} />
            </Text>
        </LocaleProvider>
    ))}
</Stack>`;

// The reading handed over already written rather than worked out here. It is what a size whose
// locale is only settled in the browser wants: the server writes what it can and the reading is
// swapped for the reader's own once there is one, without the markup around it changing
const childrenPreview = <FormatByteComponent value={1500}>1,5 kB</FormatByteComponent>;

const childrenCode = `<FormatByte value={1500}>1,5 kB</FormatByte>`;

// The reading as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what it comes to as the size grows, then each of the things the format settles,
// and last what is done where the reading is not to be worked out here at all
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "What the reading comes to as the size grows. The prefix is stepped up one at a time rather than worked out at once, so a size past the largest prefix there is a name for keeps that name instead of running off the end of them.",
        setup: sizesSetup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Unit system",
        description:
            "Whether a kilobyte is a thousand bytes or 1024 of them, written here as the same number of bytes twice. Intl has no name for the binary units, so a size counted in 1024s is still read out as kB rather than as KiB: what the system settles is the arithmetic rather than the name.",
        preview: unitSystemPreview,
        code: unitSystemCode,
    },
    {
        name: "Bits",
        description:
            "A size measured the way a connection is rather than the way a file is. It is the unit the reading is written in rather than a conversion, so the number handed over is read as that many bits.",
        preview: bitsPreview,
        code: bitsCode,
    },
    {
        name: "How far the unit is spelled out",
        description:
            "The unit shortened, written out, or cut back as far as it will go. Which of them a reading wants is settled by the room it is being read in rather than by the size, so a table of them takes the short one and a sentence about a single file can afford the long one.",
        preview: unitDisplayPreview,
        code: unitDisplayCode,
    },
    {
        name: "Precision",
        description:
            "How many digits of the reading are worth writing. It is significant digits rather than decimal places, so the same number holds however far up the prefixes a size has been carried.",
        preview: precisionPreview,
        code: precisionCode,
    },
    {
        name: "Under another locale",
        description:
            "The same size written the way each reader reads it. The unit is named and placed by the locale along with the number, so what changes between these is not only the mark between the whole and the part but where the unit stands and which way the line runs. A reading follows the provider it is read under unless it is handed a locale of its own.",
        setup: localesSetup,
        preview: localePreview,
        code: localeCode,
    },
    {
        name: "Handed the reading already written",
        description:
            "The reading written elsewhere rather than worked out here, which is what a size whose locale is only settled in the browser wants: the server writes what it can, and the reading is swapped for the reader's own once there is one, without the markup around it changing.",
        preview: childrenPreview,
        code: childrenCode,
    },
];

// Whether a kilobyte is a thousand bytes or 1024 of them
const unitSystem = '"decimal" | "binary"';

// Which unit the size is counted in
const unit = '"byte" | "bit"';

// How far the unit is spelled out
const unitDisplay = '"short" | "long" | "narrow"';

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

// Every prop the reading takes, and under it the shape the format is given as. It is drawn as the
// one element rather than as a component with parts hanging off it, so there are the two tables and
// no more.
//
// The size comes first, since it is the whole of what the reading is about, then how it is to be
// written, then what is done where it has been written already
const groups: ComponentPropGroup[] = [
    {
        name: "FormatByte",
        props: [
            {
                name: "value",
                type: "number",
                required: true,
                description:
                    "The size to write out, in bytes, however large it is. Nothing is written as 0 B rather than being carried up the prefixes, and a size that is not a number is written as nothing at all",
            },
            {
                name: "format",
                type: "FormatBytesOptions",
                description:
                    "The shape the reading is written in: which unit it is counted in, whether a kilobyte is a thousand bytes or 1024 of them, and how far the unit is spelled out",
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
                    "Stands in for the reading, so a size whose locale is only settled in the browser can be handed over already written out. The value is still required, since it is what the reading is of",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "FormatBytesOptions",
        props: [
            {
                name: "unitSystem",
                type: unitSystem,
                default: '"decimal"',
                options: ["decimal", "binary"],
                description:
                    "Whether a kilobyte is a thousand bytes or 1024 of them. Intl has no name for the binary units, so a size counted in 1024s is still read out as kB rather than as KiB: what this settles is the arithmetic rather than the name",
            },
            {
                name: "unit",
                type: unit,
                default: '"byte"',
                options: ["byte", "bit"],
                description:
                    "Which unit the size is counted in. It is the unit the reading is written in rather than a conversion, so the number handed over is read as that many of them",
            },
            {
                name: "unitDisplay",
                type: unitDisplay,
                default: '"short"',
                options: ["short", "long", "narrow"],
                description:
                    "How far the unit is spelled out, from kilobytes through kB to k. Which of them a reading wants is settled by the room it is being read in rather than by the size",
            },
            {
                name: "precision",
                type: "number",
                default: "3",
                description:
                    "How many digits of the reading are worth writing. It is significant digits rather than decimal places, so the same number holds however far up the prefixes a size has been carried",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the reading is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const FormatByte = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                FormatByte
            </Heading>
            <Text as="p" size="large">
                A size written the way it would be read aloud rather than as the count of bytes
                behind it, so that an upload of 1500 bytes reads as 1.5 kB. The number and the unit
                both come from Intl, so the unit is named and placed the way the locale names and
                places it rather than being appended in the order English happens to use. It follows
                the LocaleProvider it is read under unless it is handed a locale of its own, and it
                is drawn as a span, so a reading stands inside a sentence as readily as on a line of
                its own.
            </Text>
        </Stack>
        <ComponentExamples component="FormatByte" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default FormatByte;
