import * as React from "react";
import {
    FormControl,
    Heading,
    PINInput as PINInputComponent,
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
    // What the caller is holding, said under the boxes it is held for
    muted: "text-[var(--foreground-color-muted)]",
};

// The lengths a code of this kind usually comes in. They are read together rather than one to an
// example, since what is being shown is the row growing rather than anything one of them says
const lengths = [4, 6, 8];

// What the example reading off a list has to have in hand before it can be drawn
const lengthsSetup = `const lengths = [4, 6, 8];`;

const mutedSetup = `const muted = "text-[var(--foreground-color-muted)]";`;

// The plainest row there is: six boxes for a code of digits, named so that the boxes are read as
// one thing rather than as six fields that happen to stand together.
//
// The page and the component it is about are both called PINInput, so the component is brought in
// under a name saying which of the two it is. The listing beneath says PINInput, as an application
// importing it would
const defaultPreview = <PINInputComponent aria-label="Verification code" />;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<PINInput aria-label="Verification code" />`;

// As many boxes as the code is long. Six is what a code sent by message usually comes in, so it is
// what the row falls back to
const lengthsPreview = (
    <Stack gap="normal">
        {lengths.map((length) => (
            <PINInputComponent key={length} aria-label={`${length} digits`} length={length} />
        ))}
    </Stack>
);

const lengthsCode = `<Stack gap="normal">
    {lengths.map((length) => (
        <PINInput key={length} aria-label={\`\${length} digits\`} length={length} />
    ))}
</Stack>`;

// The three sizes the boxes come in, which follow the sizes every other field comes in. A box holds
// one character, so it is drawn as wide as it is tall whichever of the three it is
const sizesPreview = (
    <Stack gap="normal">
        <PINInputComponent aria-label="Small" length={4} size="small" defaultValue="1234" />
        <PINInputComponent aria-label="Medium" length={4} defaultValue="1234" />
        <PINInputComponent aria-label="Large" length={4} size="large" defaultValue="1234" />
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    <PINInput aria-label="Small" length={4} size="small" defaultValue="1234" />
    <PINInput aria-label="Medium" length={4} defaultValue="1234" />
    <PINInput aria-label="Large" length={4} size="large" defaultValue="1234" />
</Stack>`;

// A code that is not only digits. What the boxes will take is what settles the keyboard a phone
// offers as well, so the two never disagree
const alphanumericPreview = (
    <PINInputComponent
        aria-label="Recovery code"
        length={6}
        type="alphanumeric"
        defaultValue="A1B2C3"
    />
);

const alphanumericCode = `<PINInput
    aria-label="Recovery code"
    length={6}
    type="alphanumeric"
    defaultValue="A1B2C3"
/>`;

// A code held back, for one that should not be read over a shoulder. Each box becomes a password
// field, so what holds it back is the kind of field rather than anything drawn over it
const maskedPreview = <PINInputComponent aria-label="PIN" length={4} mask defaultValue="1234" />;

const maskedCode = `<PINInput aria-label="PIN" length={4} mask defaultValue="1234" />`;

// The colour of the answer, drawn on every box together rather than on the one that was wrong,
// since a code is right or wrong as a whole
const validationPreview = (
    <Stack gap="normal">
        <PINInputComponent
            aria-label="Wrong code"
            length={4}
            defaultValue="1234"
            validationStatus="error"
        />
        <PINInputComponent
            aria-label="Right code"
            length={4}
            defaultValue="1234"
            validationStatus="success"
        />
    </Stack>
);

const validationCode = `<Stack gap="normal">
    <PINInput aria-label="Wrong code" length={4} defaultValue="1234" validationStatus="error" />
    <PINInput aria-label="Right code" length={4} defaultValue="1234" validationStatus="success" />
</Stack>`;

// Every box closed together, since a code half of which can be typed into is no code at all
const disabledPreview = (
    <PINInputComponent aria-label="Verification code" length={4} defaultValue="12" disabled />
);

const disabledCode = `<PINInput aria-label="Verification code" length={4} defaultValue="12" disabled />`;

// Named by the field around it rather than by a label of its own, and told what the browser should
// offer to fill it with.
//
// There is no one control for a label to point at here, so the name is drawn as a span and the row
// is pointed back at it. A form control finds the input it is to wire up by recognising it, and the
// list of what it recognises does not hold this one, so the three are tied together by hand
const formControlPreview = (
    <FormControl>
        <FormControl.Label as="span" id="verification-code-label">
            Verification code
        </FormControl.Label>
        <PINInputComponent
            length={6}
            autoComplete="one-time-code"
            aria-labelledby="verification-code-label"
            aria-describedby="verification-code-caption"
        />
        <FormControl.Caption id="verification-code-caption">
            The six digits we have just sent you
        </FormControl.Caption>
    </FormControl>
);

const formControlCode = `<FormControl>
    <FormControl.Label as="span" id="verification-code-label">
        Verification code
    </FormControl.Label>
    <PINInput
        length={6}
        autoComplete="one-time-code"
        aria-labelledby="verification-code-label"
        aria-describedby="verification-code-caption"
    />
    <FormControl.Caption id="verification-code-caption">
        The six digits we have just sent you
    </FormControl.Caption>
</FormControl>`;

// Where the caller keeps hold of the code. The row reports the whole of it as each character is
// taken, and says separately once every box has been filled, which is what a screen that checks a
// code the moment it is finished is waiting for.
//
// The state is the caller's, which makes this a component of its own rather than an element the
// page holds ready
const ControlledPreview = () => {
    const [code, setCode] = React.useState("");
    const [finished, setFinished] = React.useState<string | null>(null);

    return (
        <Stack gap="condensed">
            <PINInputComponent
                aria-label="Verification code"
                length={4}
                value={code}
                onChange={(next) => {
                    setCode(next);
                    setFinished(null);
                }}
                onComplete={setFinished}
            />
            <Text size="small" className={classes.muted}>
                {finished ? `Finished: ${finished}` : `So far: ${code || "nothing"}`}
            </Text>
        </Stack>
    );
};

const controlledCode = `const [code, setCode] = React.useState("");
const [finished, setFinished] = React.useState(null);

<Stack gap="condensed">
    <PINInput
        aria-label="Verification code"
        length={4}
        value={code}
        onChange={(next) => {
            setCode(next);
            setFinished(null);
        }}
        onComplete={setFinished}
    />
    <Text size="small" className={muted}>
        {finished ? \`Finished: \${finished}\` : \`So far: \${code || "nothing"}\`}
    </Text>
</Stack>`;

// The row as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then how long the code is and how the boxes are drawn, then what they will take, and last
// how the row is named and who is holding the code
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "Six boxes for a code of digits. The code is a string and the boxes are a view of it — box one shows its first character, box two its second — which is what keeps a code the caller is holding and the boxes on screen saying the same thing. Typing moves along as each character is taken; backspace empties the box it is on, or hands back to the one before it where there is nothing to empty; the arrow keys, Home and End move between them. Aiming past the end of what has been typed puts the reader where the next character would go, so a code can never be left with a hole in it.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "As many boxes as the code is long",
        description:
            "Six is what a code sent by message usually comes in, so it is what the row falls back to. A code longer than the boxes it was given is cut to fit rather than spilling past the end of them.",
        setup: lengthsSetup,
        preview: lengthsPreview,
        code: lengthsCode,
    },
    {
        name: "Sizes",
        description:
            "The three the boxes come in, which follow the sizes every other field comes in. A box holds one character, so it is drawn as wide as it is tall and what is in it stands in the middle rather than at the start a field of running text would begin at. Every digit is given the width of a zero, so the characters stand in the same place in each box.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Taking letters as well",
        description:
            "For a code that is not only digits — a recovery code, a licence key. What the boxes will take is what settles the keyboard a phone offers as well, so a numeric code asks for the number pad and this one does not. Anything the code will not take is dropped rather than shown and then complained about, since a box holding one character has no room to say what was wrong with it.",
        preview: alphanumericPreview,
        code: alphanumericCode,
    },
    {
        name: "Held back",
        description:
            "For a code that should not be read over a shoulder. Each box becomes a password field, so what holds it back is the kind of field rather than anything drawn over it, and everything else about the row is unchanged.",
        preview: maskedPreview,
        code: maskedCode,
    },
    {
        name: "Validation statuses",
        description:
            "Drawn on every box together rather than on the one that was wrong, since a code is right or wrong as a whole. Every box is marked as invalid for a screen reader as well as drawn in the colour.",
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Turned off",
        description:
            "Every box closed together, since a code half of which can be typed into is no code at all. A row that can only be read takes nothing either, whether it is typed, pasted or taken back out.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "On a form",
        description:
            "There is no one control for a label to point at here, so the name is drawn as a span and the row is pointed back at it — which is also why the boxes are grouped only once there is a name to group them under. A form control finds the input it is to wire up by recognising it, and the list of what it recognises does not hold this one, so the three are tied together by hand. The code the browser should offer is named too, and it is put on the first box alone, since that is where a code arriving by message lands before being spread across the rest.",
        preview: formControlPreview,
        code: formControlCode,
    },
    {
        name: "Where the caller keeps hold of it",
        description:
            "The row reports the whole code as each character is taken rather than reporting one box changing, and says separately once every box has been filled — which is what a screen that checks a code the moment it is finished is waiting for. A row held this way shows what it is told rather than what was typed.",
        setup: mutedSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// What the boxes will take
const type = '"numeric" | "alphanumeric"';

// How tall the boxes are drawn
const size = '"small" | "medium" | "large"';

// The colour the row is drawn in once it has been answered
const validationStatus = '"error" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the row takes. The boxes are drawn by the row rather than written out by the caller,
// so there is the one table.
//
// The code and how long it is come first, since between them they are the whole of what the row
// holds, then what it will take and how it is drawn, and last what it reports and what it is called
const groups: ComponentPropGroup[] = [
    {
        name: "PINInput",
        props: [
            {
                name: "length",
                type: "number",
                default: "6",
                description:
                    "How many boxes the code is typed into. Six is what a code sent by message usually comes in; a code longer than the boxes it was given is cut to fit",
            },
            {
                name: "value",
                type: "string",
                description:
                    "The code, where the caller keeps hold of it. Box one shows its first character, box two its second, and so on, so a row held this way shows what it is told rather than what was typed",
            },
            {
                name: "defaultValue",
                type: "string",
                default: '""',
                description: "The code the boxes start out holding, where they keep hold of it",
            },
            {
                name: "type",
                type: type,
                default: '"numeric"',
                description:
                    "What the boxes will take. A numeric code turns away anything that is not a digit and asks a phone for its number keyboard; an alphanumeric one takes letters as well. Anything turned away is dropped rather than shown and then complained about",
            },
            {
                name: "mask",
                type: "boolean",
                default: "false",
                description:
                    "Holds what has been typed back, the way a password field does, by drawing each box as one",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the boxes are drawn, following the sizes every other field comes in. A box is as wide as it is tall, since it holds one character",
            },
            {
                name: "onChange",
                type: "(value: string) => void",
                description:
                    "Called with the whole code as each character is taken, rather than with one box changing",
            },
            {
                name: "onComplete",
                type: "(value: string) => void",
                description:
                    "Called once every box has been filled, for a screen that checks a code the moment it is finished rather than waiting to be told to",
            },
            {
                name: "autoComplete",
                type: "string",
                description:
                    "What the browser should offer to fill the code in from — one-time-code for a code sent by message. It is put on the first box alone, which is where such a code lands before being spread across the rest",
            },
            {
                name: "autoFocus",
                type: "boolean",
                description:
                    "Puts the reader in the first box as the row arrives, for a screen that exists to take this code and nothing else",
            },
            {
                name: "boxLabel",
                type: "string",
                default: '"Digit"',
                description:
                    "What each box is called, which a screen reader hears with where the box stands in the code: “Digit 1 of 6” and so on. A code that is not digits wants another word",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "The colour the row is drawn in once it has been answered. It is drawn on every box together, since a code is right or wrong as a whole",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "Closes every box together",
            },
            {
                name: "readOnly",
                type: "boolean",
                description:
                    "Leaves the code as it is: nothing is taken, whether it is typed, pasted or taken back out",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "What the row is called. The boxes are only grouped once there is a name to group them under, since a group that says nothing but that it is one is worse than none",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The element that names the row, for one standing under a name already written out. There is no single control for a label to point at, so this is how a row on a form is named",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the row is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const PINInput = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                PINInput
            </Heading>
            <Text as="p" size="large">
                A code typed into a row of boxes, one character to each, for the codes that arrive
                by message or come off an authenticator. The code is a string and the boxes are a
                view of it: box one shows its first character, box two its second. That is what
                keeps a code the caller is holding and the boxes on screen saying the same thing,
                and it is why emptying a box in the middle closes the gap rather than leaving one —
                the same as taking a character out of the middle of a field of running text. A
                reader who aims past the end of what has been typed is put where the next character
                would go, so a code can never be left with a hole in it in the first place. A whole
                code pasted in, or filled in by the browser from a message, is spread across the
                boxes rather than turned away by the first one.
            </Text>
        </Stack>
        <ComponentExamples component="PINInput" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default PINInput;
