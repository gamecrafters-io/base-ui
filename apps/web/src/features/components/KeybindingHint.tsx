import {
    Button,
    Heading,
    KeybindingHint as KeybindingHintComponent,
    PlatformContext,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import type { Platform } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A ground dark enough to need the emphasis colours, since what that variant is for cannot be
    // read against the page's own background
    emphasis:
        "inline-flex p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-background-black",
    // The ground a primary button is painted, for the variant that stands on one
    primary:
        "inline-flex p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-[var(--button-primary-background-color-rest)]",
    // A sentence is read at a measure rather than across the whole card, since what that example is
    // about is a hint standing inside a line of prose
    sentence: "max-w-[24rem]",
};

// The platforms that name the same key differently. They are stood in for rather than detected, so
// that all three can be read from whichever one the page happens to be open on
const platforms: { platform: Platform; label: string }[] = [
    { platform: "apple", label: "apple" },
    { platform: "windows", label: "windows" },
    { platform: "other", label: "other" },
];

// What the examples have to have in hand before they can be drawn
const platformsSetup = `const platforms = [
    { platform: "apple", label: "apple" },
    { platform: "windows", label: "windows" },
    { platform: "other", label: "other" },
];`;

const emphasisSetup = `const emphasis = "inline-flex p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-background-black";

const primary = "inline-flex p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-[var(--button-primary-background-color-rest)]";`;

const sentenceSetup = `const sentence = "max-w-[24rem]";`;

// The plainest hint there is: the keys, and nothing said with a prop. It comes to the condensed
// form, which is the one drawn as the keys are printed on a keyboard.
//
// Mod is written rather than a key of its own, so the same binding is named Command on an Apple
// keyboard and Control everywhere else without being written twice.
//
// The page and the component it is about are both called KeybindingHint, so the component is
// brought in under a name saying which of the two it is. The listing beneath says KeybindingHint,
// as an application importing it would
const defaultPreview = <KeybindingHintComponent keys="Mod+Shift+K" />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<KeybindingHint keys="Mod+Shift+K" />`;

// The two forms the keys are drawn in. The condensed one is for a menu or a tooltip, where there is
// little room and the printed marks are recognised at a glance; the full one is for prose, where
// the keys are spoken of rather than shown and a plus sign stands between them.
//
// What is read out is the same either way: the drawn marks are kept out of the reading and the
// spoken name of each key is put in beside them, so a hint says the same thing to everyone at once
const formatsPreview = (
    <Stack gap="condensed">
        <Text>
            condensed: <KeybindingHintComponent keys="Mod+Shift+K" />
        </Text>
        <Text>
            full: <KeybindingHintComponent keys="Mod+Shift+K" format="full" />
        </Text>
    </Stack>
);

const formatsCode = `<Stack gap="condensed">
    <Text>
        condensed: <KeybindingHint keys="Mod+Shift+K" />
    </Text>
    <Text>
        full: <KeybindingHint keys="Mod+Shift+K" format="full" />
    </Text>
</Stack>`;

// Chords pressed one after the other rather than together. Keys joined with a plus are held down
// at once and drawn as the one box they are pressed as; chords parted by a space are separate
// boxes, and the word between them is put in for the reading rather than drawn
const sequencePreview = (
    <Stack gap="condensed">
        <Text>
            condensed: <KeybindingHintComponent keys="Mod+x y z" />
        </Text>
        <Text>
            full: <KeybindingHintComponent keys="Mod+x y z" format="full" />
        </Text>
    </Stack>
);

const sequenceCode = `<Stack gap="condensed">
    <Text>
        condensed: <KeybindingHint keys="Mod+x y z" />
    </Text>
    <Text>
        full: <KeybindingHint keys="Mod+x y z" format="full" />
    </Text>
</Stack>`;

// How large the keys are drawn. The smaller one is for a hint that has to sit inside something
// small itself, rather than for saying that the binding matters less
const sizesPreview = (
    <Stack gap="condensed">
        <Text>
            normal: <KeybindingHintComponent keys="Mod+Shift+K" />
        </Text>
        <Text>
            small: <KeybindingHintComponent keys="Mod+Shift+K" size="small" />
        </Text>
    </Stack>
);

const sizesCode = `<Stack gap="condensed">
    <Text>
        normal: <KeybindingHint keys="Mod+Shift+K" />
    </Text>
    <Text>
        small: <KeybindingHint keys="Mod+Shift+K" size="small" />
    </Text>
</Stack>`;

// What the hint is drawn on. Each is stood on the ground it was made for, since a set of key
// colours read against the wrong ground says nothing about whether they hold up against the right
// one
const variantsPreview = (
    <Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
        <KeybindingHintComponent keys="Mod+Shift+K" />
        <div className={classes.emphasis}>
            <KeybindingHintComponent keys="Mod+Shift+K" variant="onEmphasis" />
        </div>
        <div className={classes.primary}>
            <KeybindingHintComponent keys="Mod+Shift+K" variant="onPrimary" />
        </div>
    </Stack>
);

const variantsCode = `<Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
    <KeybindingHint keys="Mod+Shift+K" />
    <div className={emphasis}>
        <KeybindingHint keys="Mod+Shift+K" variant="onEmphasis" />
    </div>
    <div className={primary}>
        <KeybindingHint keys="Mod+Shift+K" variant="onPrimary" />
    </div>
</Stack>`;

// Where a hint is most often reached for: on the button the binding belongs to, saying how the
// button can be pressed without pressing it. The keys stand on the button itself, so on a primary
// one they take the colours that hold up against it
const inAButtonPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <Button trailingVisual={<KeybindingHintComponent keys="Mod+k" />}>Search</Button>
        <Button
            variant="primary"
            trailingVisual={<KeybindingHintComponent keys="Mod+Enter" variant="onPrimary" />}
        >
            Comment
        </Button>
    </Stack>
);

const inAButtonCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Button trailingVisual={<KeybindingHint keys="Mod+k" />}>Search</Button>
    <Button
        variant="primary"
        trailingVisual={<KeybindingHint keys="Mod+Enter" variant="onPrimary" />}
    >
        Comment
    </Button>
</Stack>`;

// A hint standing inside a line of prose, where the keys are read as part of the sentence rather
// than glanced at. It is the full form that belongs here, since a sentence is read rather than
// scanned and the printed marks would have to be worked out mid-line
const inProsePreview = (
    <Text as="p" className={classes.sentence}>
        Press <KeybindingHintComponent keys="Mod+Shift+P" format="full" /> to move between writing
        and previewing.
    </Text>
);

const inProseCode = `<Text as="p" className={sentence}>
    Press <KeybindingHint keys="Mod+Shift+P" format="full" /> to move between writing and
    previewing.
</Text>`;

// The same binding named for each platform that names its keys differently. The platform is worked
// out from the browser, so it is stood in for here to show all three at once; an application would
// leave it alone and let each reader be told the names their own keyboard carries
const platformsPreview = (
    <Stack gap="condensed">
        {platforms.map(({ platform, label }) => (
            <PlatformContext.Provider key={platform} value={platform}>
                <Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
                    <Text>{label}:</Text>
                    <KeybindingHintComponent keys="Meta+Alt+K" />
                    <KeybindingHintComponent keys="Meta+Alt+K" format="full" />
                </Stack>
            </PlatformContext.Provider>
        ))}
    </Stack>
);

const platformsCode = `<Stack gap="condensed">
    {platforms.map(({ platform, label }) => (
        <PlatformContext.Provider key={platform} value={platform}>
            <Stack direction="horizontal" gap="normal" align="center" wrap="wrap">
                <Text>{label}:</Text>
                <KeybindingHint keys="Meta+Alt+K" />
                <KeybindingHint keys="Meta+Alt+K" format="full" />
            </Stack>
        </PlatformContext.Provider>
    ))}
</Stack>`;

// The hint as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then the two forms the keys are drawn in, then what is done to how they look, then where
// the hint actually stands, and last what the keys are called from one platform to the next
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The keys, with nothing said about how to draw them. It comes to the condensed form, which draws each key as it is printed on a keyboard. Mod is written rather than a key of its own, so the same binding is named Command on an Apple keyboard and Control everywhere else without being written twice.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Condensed and full",
        description:
            "The two forms the keys are drawn in. The condensed one is for a menu or a tooltip, where there is little room and the printed marks are recognised at a glance; the full one is for prose, where the keys are spoken of rather than shown and a plus sign stands between them. What is read out is the same either way: the drawn marks are kept out of the reading and the spoken name of each key is put in beside them.",
        preview: formatsPreview,
        code: formatsCode,
    },
    {
        name: "A sequence",
        description:
            "Chords pressed one after the other rather than together. Keys joined with a plus are held down at once and drawn as the one box they are pressed as; chords parted by a space are separate boxes, and the word between them is put in for the reading rather than drawn. Plus and Space are written by name where the keys themselves are meant.",
        preview: sequencePreview,
        code: sequenceCode,
    },
    {
        name: "Sizes",
        description:
            "How large the keys are drawn. The smaller one is for a hint that has to sit inside something small itself rather than for saying that the binding matters less.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "What it stands on",
        description:
            "The ground the hint is drawn against. Each is stood on the ground it was made for, since a set of key colours read against the wrong ground says nothing about whether they hold up against the right one.",
        setup: emphasisSetup,
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "In a button",
        description:
            "Where a hint is most often reached for: on the button the binding belongs to, saying how the button can be pressed without pressing it. The keys stand on the button itself, so on a primary one they take the colours that hold up against it.",
        preview: inAButtonPreview,
        code: inAButtonCode,
    },
    {
        name: "In prose",
        description:
            "A hint standing inside a line of prose, where the keys are read as part of the sentence rather than glanced at. It is the full form that belongs here, since a sentence is read rather than scanned and the printed marks would have to be worked out mid-line.",
        setup: sentenceSetup,
        preview: inProsePreview,
        code: inProseCode,
    },
    {
        name: "Named for the platform",
        description:
            "The same binding named for each platform that names its keys differently. Meta is the key that differs across all three — Command on an Apple keyboard, the Windows key on Windows, and nothing but Meta anywhere else, which keeps the name the key carries on its own. The platform is worked out from the browser, so it is stood in for here to show all three at once; an application would leave it alone and let each reader be told the names their own keyboard carries.",
        setup: platformsSetup,
        preview: platformsPreview,
        code: platformsCode,
    },
];

// Whether the keys are drawn as they are printed or written out as they are spoken of
const format = '"condensed" | "full"';

// What the hint is drawn on
const variant = '"normal" | "onEmphasis" | "onPrimary"';

// How large the keys are drawn
const size = '"normal" | "small"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the hint takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// The keys come first, since they are the whole of what the hint says, then the form they are drawn
// in, then what is done to how they look
const groups: ComponentPropGroup[] = [
    {
        name: "KeybindingHint",
        props: [
            {
                name: "keys",
                type: "string",
                required: true,
                description:
                    "The keys the binding is made of, named as KeyboardEvent.key names them: Control, Shift, ArrowUp, a. Keys joined with + are pressed together; keys parted by a space are pressed one after the other, so a b is a then b. Plus and Space are written by name where those keys themselves are meant, since both marks are already doing a job here. Mod stands for Command on Apple platforms and Control everywhere else",
            },
            {
                name: "format",
                type: format,
                default: '"condensed"',
                options: ["condensed", "full"],
                description:
                    "Whether the keys are drawn as they are printed on a keyboard or written out as they are spoken of. The condensed one is for a menu or a tooltip, where there is little room; the full one is for prose. What is read out is the same either way",
            },
            {
                name: "variant",
                type: variant,
                default: '"normal"',
                options: ["normal", "onEmphasis", "onPrimary"],
                description:
                    "What the hint is drawn on: the page's own ground, one of the emphasis colours, or a primary button",
            },
            {
                name: "size",
                type: size,
                default: '"normal"',
                options: ["normal", "small"],
                description:
                    "How large the keys are drawn. The smaller one is for a hint that has to sit inside something small itself",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the hint is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const KeybindingHint = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                KeybindingHint
            </Heading>
            <Text as="p" size="large">
                Says that a keybinding is there, and what it is. The keys are named as
                KeyboardEvent.key names them and drawn as they are printed on a keyboard, so a
                reader recognises them rather than working them out. What is drawn and what is read
                out are two different things: a mark like ⌘ is drawn for the eye and kept out of the
                reading, and the word for it is put in beside it, so one hint says the same thing to
                everyone at once. Writing Mod in place of a key names the binding Command on an
                Apple keyboard and Control everywhere else, which is worked out from the browser
                unless a PlatformContext above the hint says otherwise. Where only text will do — an
                aria-label, say — getAccessibleKeybindingHintString gives the spoken form on its
                own, though a hint that can be seen should nearly always be given alongside it.
            </Text>
        </Stack>
        <ComponentExamples component="KeybindingHint" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default KeybindingHint;
