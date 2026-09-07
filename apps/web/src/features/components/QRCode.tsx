import { GlobeRegular } from "@gamecrafters/base-ui-icons";
import { Heading, QRCode as QRCodeComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // Both colours come through custom properties, so a code can be repainted from a stylesheet
    // without the component having to be told about it
    brand: "[--qr-code-color:var(--background-color-accent-emphasis)]",
    muted: "text-[var(--foreground-color-muted)]",
};

// Every level of error correction, from a seventh of the code recoverable to a third. They are
// counted off a list rather than written out one by one, since what the example is about is the
// run of them read against one another
const levels = ["L", "M", "Q", "H"] as const;

// Every shape a module can be drawn as, for the wall that shows them side by side
const dotTypes = [
    "square",
    "rounded",
    "dots",
    "diamond",
    "classy",
    "classy-rounded",
    "extra-rounded",
    "vertical-line",
    "horizontal-line",
    "small-square",
    "tiny-square",
] as const;

// What the examples that read off a list have to have in hand before they can be drawn. Each is
// written once and reached for by the example that needs it
const levelsSetup = `const levels = ["L", "M", "Q", "H"];`;

const dotTypesSetup = `const dotTypes = [
    "square",
    "rounded",
    "dots",
    "diamond",
    "classy",
    "classy-rounded",
    "extra-rounded",
    "vertical-line",
    "horizontal-line",
    "small-square",
    "tiny-square",
];`;

// The plainest code there is: a link, and nothing said about how it is drawn. It comes out two
// hundred pixels across, dark on light, with the quiet zone the spec asks for around it.
//
// The page and the component it is about are both called QRCode, so the component is brought in
// under a name saying which of the two it is. The listing beneath says QRCode, as an application
// importing it would
const defaultPreview = <QRCodeComponent value="https://example.com" />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<QRCode value="https://example.com" />`;

// What a code can be given, which is any string a camera is meant to hand over: a link to follow,
// something to be read rather than followed, and the format a phone knows how to join a network
// from. The component encodes what it is given and nothing more, so what the string means is
// settled by whatever reads it
const valuesPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        <Stack gap="condensed" align="center">
            <QRCodeComponent value="https://example.com" size={120} />
            <Text size="small" className={classes.muted}>
                A link
            </Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <QRCodeComponent value="BASE-UI-2026-0042" size={120} />
            <Text size="small" className={classes.muted}>
                Words
            </Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <QRCodeComponent
                value="WIFI:T:WPA;S:Example Network;P:correct-horse-battery;;"
                size={120}
                label="Join the Example Network wifi"
            />
            <Text size="small" className={classes.muted}>
                A network to join
            </Text>
        </Stack>
    </Stack>
);

const valuesCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    <Stack gap="condensed" align="center">
        <QRCode value="https://example.com" size={120} />
        <Text size="small">A link</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <QRCode value="BASE-UI-2026-0042" size={120} />
        <Text size="small">Words</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <QRCode
            value="WIFI:T:WPA;S:Example Network;P:correct-horse-battery;;"
            size={120}
            label="Join the Example Network wifi"
        />
        <Text size="small">A network to join</Text>
    </Stack>
</Stack>`;

// How wide the code is drawn. It is drawn as vectors, so the size settles the room it takes rather
// than how finely it is drawn: the same modules are laid out larger or smaller
const sizesPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        <QRCodeComponent value="https://example.com" size={96} label="Ninety six pixels" />
        <QRCodeComponent value="https://example.com" label="Two hundred pixels" />
        <QRCodeComponent value="https://example.com" size={280} label="Two hundred and eighty" />
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    <QRCode value="https://example.com" size={96} label="Ninety six pixels" />
    <QRCode value="https://example.com" label="Two hundred pixels" />
    <QRCode value="https://example.com" size={280} label="Two hundred and eighty" />
</Stack>`;

// The bare room around the code, counted in modules rather than in pixels, so it holds as the code
// is drawn larger or smaller
const marginPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        <Stack gap="condensed" align="center">
            <QRCodeComponent value="https://example.com" size={140} label="Four modules" />
            <Text size="small" className={classes.muted}>
                Four modules
            </Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <QRCodeComponent value="https://example.com" size={140} margin={1} label="One module" />
            <Text size="small" className={classes.muted}>
                One module
            </Text>
        </Stack>
    </Stack>
);

const marginCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    <Stack gap="condensed" align="center">
        <QRCode value="https://example.com" size={140} label="Four modules" />
        <Text size="small">Four modules</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <QRCode value="https://example.com" size={140} margin={1} label="One module" />
        <Text size="small">One module</Text>
    </Stack>
</Stack>`;

// How much of the code can be lost and still read. The four are drawn together, since what is
// being read is how many more modules each level takes to carry the same string
const levelsPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        {levels.map((level) => (
            <Stack key={level} gap="condensed" align="center">
                <QRCodeComponent
                    value="https://example.com"
                    ecLevel={level}
                    size={120}
                    label={`Error correction level ${level}`}
                />
                <Text size="small" className={classes.muted}>
                    {level}
                </Text>
            </Stack>
        ))}
    </Stack>
);

const levelsCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    {levels.map((level) => (
        <Stack key={level} gap="condensed" align="center">
            <QRCode
                value="https://example.com"
                ecLevel={level}
                size={120}
                label={\`Error correction level \${level}\`}
            />
            <Text size="small">{level}</Text>
        </Stack>
    ))}
</Stack>`;

// A version named rather than chosen, which is room to spare at the cost of finer modules. The
// same string is drawn at the smallest version it fits in beside the tenth
const versionPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        <Stack gap="condensed" align="center">
            <QRCodeComponent
                value="https://example.com"
                size={140}
                label="The smallest that fits"
            />
            <Text size="small" className={classes.muted}>
                Whichever fits
            </Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <QRCodeComponent
                value="https://example.com"
                size={140}
                version={10}
                label="Version ten"
            />
            <Text size="small" className={classes.muted}>
                Version 10
            </Text>
        </Stack>
    </Stack>
);

const versionCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    <Stack gap="condensed" align="center">
        <QRCode value="https://example.com" size={140} label="The smallest that fits" />
        <Text size="small">Whichever fits</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <QRCode value="https://example.com" size={140} version={10} label="Version ten" />
        <Text size="small">Version 10</Text>
    </Stack>
</Stack>`;

// Every shape a module can be drawn as, read side by side. The square is what a scanner was built
// to read, and each of the others trades a little of that away for the look of the thing
const dotTypesPreview = (
    <Stack direction="horizontal" gap="normal" wrap="wrap" align="center">
        {dotTypes.map((dotType) => (
            <Stack key={dotType} gap="condensed" align="center">
                <QRCodeComponent
                    value="https://example.com"
                    dotType={dotType}
                    size={104}
                    label={`Modules drawn as ${dotType}`}
                />
                <Text size="small" className={classes.muted}>
                    {dotType}
                </Text>
            </Stack>
        ))}
    </Stack>
);

const dotTypesCode = `<Stack direction="horizontal" gap="normal" wrap="wrap" align="center">
    {dotTypes.map((dotType) => (
        <Stack key={dotType} gap="condensed" align="center">
            <QRCode
                value="https://example.com"
                dotType={dotType}
                size={104}
                label={\`Modules drawn as \${dotType}\`}
            />
            <Text size="small">{dotType}</Text>
        </Stack>
    ))}
</Stack>`;

// Modules standing apart, where each fills less of its own cell than the whole of it
const dotSizePreview = <QRCodeComponent value="https://example.com" dotType="dots" dotSize={0.8} />;

const dotSizeCode = `<QRCode value="https://example.com" dotType="dots" dotSize={0.8} />`;

// The three squares a scanner finds the code by, drawn as shapes of their own rather than as the
// modules they are made of, and one of them picked out in a colour
const cornersPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        <QRCodeComponent
            value="https://example.com"
            dotType="rounded"
            size={160}
            corners={{
                topLeft: { outerShape: "extra-rounded", innerShape: "rounded" },
                topRight: { outerShape: "extra-rounded", innerShape: "rounded" },
                bottomLeft: { outerShape: "extra-rounded", innerShape: "rounded" },
            }}
            label="Rounded corners"
        />
        <QRCodeComponent
            value="https://example.com"
            dotType="rounded"
            size={160}
            corners={{
                topLeft: { outerShape: "dots", innerShape: "dots", outerColor: "#0969da" },
                topRight: { outerShape: "dots", innerShape: "dots" },
                bottomLeft: { outerShape: "dots", innerShape: "dots" },
            }}
            label="A corner picked out in a colour"
        />
    </Stack>
);

const cornersCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    <QRCode
        value="https://example.com"
        dotType="rounded"
        size={160}
        corners={{
            topLeft: { outerShape: "extra-rounded", innerShape: "rounded" },
            topRight: { outerShape: "extra-rounded", innerShape: "rounded" },
            bottomLeft: { outerShape: "extra-rounded", innerShape: "rounded" },
        }}
        label="Rounded corners"
    />
    <QRCode
        value="https://example.com"
        dotType="rounded"
        size={160}
        corners={{
            topLeft: { outerShape: "dots", innerShape: "dots", outerColor: "#0969da" },
            topRight: { outerShape: "dots", innerShape: "dots" },
            bottomLeft: { outerShape: "dots", innerShape: "dots" },
        }}
        label="A corner picked out in a colour"
    />
</Stack>`;

// A code painted by hand, and one painted from the stylesheet. Both colours come through custom
// properties, so either way nothing has to be unpicked to repaint a code
const colorsPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        <Stack gap="condensed" align="center">
            <QRCodeComponent
                value="https://example.com"
                size={160}
                color="#0969da"
                background="#eff6ff"
                label="Painted by hand"
            />
            <Text size="small" className={classes.muted}>
                Painted by hand
            </Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <QRCodeComponent
                value="https://example.com"
                size={160}
                className={classes.brand}
                label="Painted from the stylesheet"
            />
            <Text size="small" className={classes.muted}>
                Painted from the stylesheet
            </Text>
        </Stack>
    </Stack>
);

const colorsCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    <Stack gap="condensed" align="center">
        <QRCode
            value="https://example.com"
            size={160}
            color="#0969da"
            background="#eff6ff"
            label="Painted by hand"
        />
        <Text size="small">Painted by hand</Text>
    </Stack>
    <Stack gap="condensed" align="center">
        <QRCode
            value="https://example.com"
            size={160}
            className="[--qr-code-color:var(--background-color-accent-emphasis)]"
            label="Painted from the stylesheet"
        />
        <Text size="small">Painted from the stylesheet</Text>
    </Stack>
</Stack>`;

// A mark in the middle. The modules beneath it are left out and the code is raised to the most
// error correction it can carry, so what the logo covers is made up for by what is left
const logoPreview = (
    <QRCodeComponent
        value="https://example.com"
        dotType="rounded"
        logo={<GlobeRegular size={32} />}
        logoSize={0.25}
    />
);

const logoCode = `<QRCode
    value="https://example.com"
    dotType="rounded"
    logo={<GlobeRegular size={32} />}
    logoSize={0.25}
/>`;

// Where a code cannot be made, which is an empty value or data too long for the version it was
// pinned to. Either stands the fallback in place of the code rather than taking the page down
const fallbackPreview = (
    <Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
        <QRCodeComponent value="" fallback="Nothing to encode" />
        <QRCodeComponent
            value={"the quick brown fox jumps over the lazy dog ".repeat(4)}
            version={1}
            fallback="Too much data for this version"
        />
    </Stack>
);

const fallbackCode = `<Stack direction="horizontal" gap="spacious" wrap="wrap" align="center">
    <QRCode value="" fallback="Nothing to encode" />
    <QRCode
        value={"the quick brown fox jumps over the lazy dog ".repeat(4)}
        version={1}
        fallback="Too much data for this version"
    />
</Stack>`;

// The code as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what a code can be given, then how much room it takes, then what is traded for what
// inside it, then how far it can be brought towards a brand, and last what stands where a code
// could not be made
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A string handed over to a camera, drawn as vectors. Nothing is said about how it is drawn, so it comes out two hundred pixels across, dark on light, with the four modules of quiet zone the spec asks for around it. The picture itself is kept from a screen reader and the whole is named by the value, since a reader who cannot point a camera at a code is better told what it carries than what it looks like.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "What a code carries",
        description:
            "Any string a camera is meant to hand over: a link to follow, something to be read rather than followed, or the format a phone knows how to join a network from. The component encodes what it is given and nothing more, so what the string means is settled by whatever reads it — and a value that would tell a screen reader nothing useful is worth naming instead.",
        preview: valuesPreview,
        code: valuesCode,
    },
    {
        name: "Sizes",
        description:
            "How wide the code is drawn, in pixels. It is drawn as vectors, so this settles the room it takes rather than how finely it is drawn: the same modules are laid out larger or smaller. A code standing in a column narrower than it was drawn for is brought down to fit rather than running past the edge of it.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "The quiet zone",
        description:
            "The bare room around the code, counted in modules rather than in pixels, so it holds as the code is drawn larger or smaller. The spec asks for four, and a code given less leaves a scanner less to tell it from whatever surrounds it.",
        preview: marginPreview,
        code: marginCode,
    },
    {
        name: "Error correction",
        description:
            "How much of the code can be lost and still read: L a seventh, M a fifth, Q a quarter, H a third. The four are drawn from the same string, so what is being read here is how many more modules each level takes to carry it — redundancy is bought with size, and a code that will be scanned off a printed page or through a window is worth buying it for.",
        setup: levelsSetup,
        preview: levelsPreview,
        code: levelsCode,
    },
    {
        name: "A version named rather than chosen",
        description:
            "Which of the forty sizes the code is drawn at. Left out, the smallest one the data fits in is taken, which keeps the modules as large as they can be and so as easy to read as they can be. Naming a larger one buys room to spare at the cost of finer modules, and pinning a version the data will not fit in stands the fallback in instead.",
        preview: versionPreview,
        code: versionCode,
    },
    {
        name: "Module shapes",
        description:
            "What each dark module is drawn as. The square is what a scanner was built to read, and every other shape trades a little of that away for the look of the thing, so the further one strays from the square the more the code leans on the error correction behind it.",
        setup: dotTypesSetup,
        preview: dotTypesPreview,
        code: dotTypesCode,
    },
    {
        name: "Modules standing apart",
        description:
            "How much of its own cell a module fills, as a share of it. Anything under one leaves the modules standing apart, which is the look a scanner has the most trouble with: it is worth a higher error correction level, and worth testing with the cameras it will actually be read by.",
        preview: dotSizePreview,
        code: dotSizeCode,
    },
    {
        name: "Corners",
        description:
            "The three squares a scanner finds the code by, drawn as shapes of their own rather than as the modules they are made of, and picked out in a colour of their own. There are three rather than four: the fourth corner is left bare, and that is what tells a scanner which way up the code is. Where corners are asked for, the modules beneath them are left out, so the two are not laid one on top of the other.",
        preview: cornersPreview,
        code: cornersCode,
    },
    {
        name: "Colours",
        description:
            "What the modules and the quiet zone are painted, either handed over as a pair of colours or set from a stylesheet through the custom properties behind them. Both fall back to a fixed black on white rather than following the theme around them: a scanner reads a code as dark on light, and one that inverted with the theme would stop being read in half the places it was put. Whatever a code is repainted with has to keep that contrast.",
        preview: colorsPreview,
        code: colorsCode,
    },
    {
        name: "A mark in the middle",
        description:
            "Anything React can draw, laid over the middle of the code. The modules beneath it are left out and the code is raised to the most error correction it can carry unless a level was asked for by name, so what the logo covers is made up for by what is left. Past about a third of the code there is more missing than the error correction can make up for. A mark that would otherwise be read against the modules the code could not hide is worth standing on a plate of its own.",
        preview: logoPreview,
        code: logoCode,
    },
    {
        name: "Nothing to draw",
        description:
            "What stands where a code could not be made: an empty value, or data too long for the version and the level it was given. Either stands the fallback in place of the code rather than taking the page down with it, and the box claims no picture role, since there is no picture there to stand for.",
        preview: fallbackPreview,
        code: fallbackCode,
    },
];

// How much of the code can be lost and still read
const ecLevel = '"L" | "M" | "Q" | "H"';

// How the data is packed
const mode = '"numeric" | "alphanumeric" | "byte" | "kanji" | "auto"';

// What each dark module is drawn as. The values stand as themselves rather than as the name they
// are collected under, since one of them is what a caller actually hands over
const dotType =
    '"square" | "rounded" | "dots" | "diamond" | "classy" | "classy-rounded" | "extra-rounded" | "vertical-line" | "horizontal-line" | "small-square" | "tiny-square"';

// The three finder squares, each drawn and painted in its own right
const corners =
    "{ topLeft?: QRCodeCornerOptions; topRight?: QRCodeCornerOptions; bottomLeft?: QRCodeCornerOptions }";

// Every prop the code takes. What it carries comes first, since it is the whole of what a code is,
// then how much room it takes, then what is traded for what inside it, then how it is drawn, and
// last what it is called and what stands in where it cannot be drawn at all
const groups: ComponentPropGroup[] = [
    {
        name: "QRCode",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "What the code carries. It stands as the accessible name where no label is given, since a reader who cannot point a camera at the picture is better told what it holds. An empty value draws no code at all, standing the fallback in instead",
            },
            {
                name: "size",
                type: "number",
                default: "200",
                description:
                    "How wide the code is drawn, in pixels. It is drawn as vectors, so this settles the room it takes rather than how finely it is drawn, and a code in a narrower column is brought down to fit rather than running past the edge of it",
            },
            {
                name: "margin",
                type: "number",
                default: "4",
                description:
                    "The quiet zone around the code, counted in modules rather than pixels so it holds at any size. The spec asks for four, and less than that leaves a scanner nothing to tell the code from what surrounds it",
            },
            {
                name: "ecLevel",
                type: ecLevel,
                description:
                    "How much of the code can be lost and still read: L a seventh, M a fifth, Q a quarter, H a third. Left out, the encoder's own default stands, except on a code carrying a logo, which is raised to H to make up for the modules the logo covers",
            },
            {
                name: "version",
                type: "number",
                description:
                    "Which of the forty sizes the code is drawn at. Left out, the smallest one the data fits in is taken, which is what keeps the modules as large as they can be. Data too long for the version it is pinned to stands the fallback in rather than throwing",
            },
            {
                name: "mode",
                type: mode,
                description:
                    "How the data is packed. Digits and upper case letters pack tighter than bytes do, and the encoder picks the tightest the data allows unless it is told otherwise",
            },
            {
                name: "mask",
                type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 7",
                description:
                    "Which of the eight patterns the modules are laid under. The encoder weighs every one of them and keeps whichever reads most evenly, so this is only worth naming to hold a code to a shape that is already known",
            },
            {
                name: "dotType",
                type: dotType,
                default: '"square"',
                description:
                    "What each dark module is drawn as. The square is what a scanner was built to read, and every other shape trades a little of that away for the look of the thing",
            },
            {
                name: "dotSize",
                type: "number",
                default: "1",
                description:
                    "How much of its own cell a module fills, as a share of it. Anything under one leaves the modules standing apart, which is the look a scanner has the most trouble with",
            },
            {
                name: "corners",
                type: corners,
                description:
                    "The squares a scanner finds the code by, drawn as shapes of their own rather than as the modules they are made of. There are three rather than four: the fourth corner is left bare, and that is what tells a scanner which way up the code is",
            },
            {
                name: "color",
                type: "string",
                description:
                    "What the modules are painted. It comes through a custom property, so a stylesheet can say it instead. Left out, it falls back to a fixed black rather than the theme around it, since a scanner reads a code as dark on light",
            },
            {
                name: "background",
                type: "string",
                description:
                    "What the quiet zone is painted. Left out, it falls back to a fixed white for the same reason the modules fall back to black. A code set on the surface beneath it takes transparent, and then needs whatever it stands on to be light enough to read the modules against",
            },
            {
                name: "logo",
                type: "React.ReactNode",
                description:
                    "What sits in the middle of the code. It is laid over the modules rather than drawn into them, so it can be anything React can draw, and the modules beneath it are left out of the code",
            },
            {
                name: "logoSize",
                type: "number",
                default: "0.3",
                description:
                    "How much of the code the logo covers, as a share of it. Past about a third there is more missing than the error correction can make up for",
            },
            {
                name: "label",
                type: "string",
                description:
                    "What a screen reader is told the code is. The value stands in where this is left out, which is worth replacing wherever the value is an opaque string rather than something a reader would recognise",
            },
            {
                name: "fallback",
                type: "React.ReactNode",
                description:
                    "What is drawn in place of a code that cannot be made: an empty value, or data too long for the version and the level it was given. Left out, nothing is drawn there at all",
            },
            {
                name: "className",
                type: "string",
                description: "Class name for custom styling",
            },
        ],
    },
    {
        name: "QRCodeCornerOptions",
        props: [
            {
                name: "outerShape",
                type: '"square" | "rounded" | "dots" | "extra-rounded" | "classy"',
                description:
                    "The ring around the outside of a finder square. It is drawn as one path with the hole cut through it, rather than as a second shape painted back over it in the background colour",
            },
            {
                name: "innerShape",
                type: '"square" | "dots" | "rounded"',
                description: "The block standing in the middle of a finder square",
            },
            {
                name: "outerColor",
                type: "string",
                description:
                    "What the ring is painted, where it is to be picked out from the modules around it. Left out, it takes the colour the modules take",
            },
            {
                name: "innerColor",
                type: "string",
                description:
                    "What the block in the middle is painted. Left out, it takes the colour the modules take",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the code is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const QRCode = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                QRCode
            </Heading>
            <Text as="p" size="large">
                A code drawn as vectors from a string, for handing something over to a camera that
                would otherwise have to be typed out: a link, a ticket, a key to pair a device by.
                The picture is kept from a screen reader and the whole is named instead, since a
                reader who cannot point a camera at a code is better told what it carries than what
                it looks like — the value stands as that name unless a label says otherwise.
            </Text>
            <Text as="p" size="large" className={classes.muted}>
                How the modules, the corners and the middle are drawn is open all the way down, but
                every step away from a plain black square trades a little of what a scanner was
                built to read. The colours fall back to a fixed black on white rather than following
                the theme around them, since a code that inverted with the theme would stop being
                read in half the places it was put. Where a code cannot be made at all — an empty
                value, or more data than the version it was pinned to will hold — a fallback stands
                in its place rather than the render coming down.
            </Text>
        </Stack>
        <ComponentExamples component="QRCode" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default QRCode;
