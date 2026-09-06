import * as React from "react";
import {
    FormControl,
    Heading,
    NumberInput as NumberInputComponent,
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
    // A field asks for about twenty characters of room and would be read across the whole of the
    // card, so it is given a column the width one of these is actually filled in at
    field: "w-[16rem]",
    // What the caller is holding, said under the field it is held for
    muted: "text-[var(--foreground-color-muted)]",
};

// What every example has to have in hand before it can be drawn. The width is written once and
// reached for by each of them, since what changes between the examples is the field rather than
// the room it stands in
const setup = `const field = "w-[16rem]";`;

const mutedSetup = `${setup}

const muted = "text-[var(--foreground-color-muted)]";`;

// The plainest field there is: one number, a floor under it, and the stepper beside it. It is
// named outright, since a field standing on its own has nothing else to say what it is for.
//
// The page and the component it is about are both called NumberInput, so the component is brought
// in under a name saying which of the two it is. The listing beneath says NumberInput, as an
// application importing it would
const defaultPreview = (
    <NumberInputComponent
        className={classes.field}
        aria-label="Quantity"
        defaultValue={1}
        min={0}
    />
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<NumberInput className={field} aria-label="Quantity" defaultValue={1} min={0} />`;

// The two ends the value is held between, read as three fields: one sitting on the floor, one
// between the two, and one at the ceiling. An end the value cannot pass is drawn as closed rather
// than left to be found by pressing at it
const rangePreview = (
    <Stack gap="normal">
        <NumberInputComponent
            className={classes.field}
            aria-label="At the floor"
            defaultValue={0}
            min={0}
            max={10}
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="In between"
            defaultValue={5}
            min={0}
            max={10}
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="At the ceiling"
            defaultValue={10}
            min={0}
            max={10}
        />
    </Stack>
);

const rangeCode = `<Stack gap="normal">
    <NumberInput className={field} aria-label="At the floor" defaultValue={0} min={0} max={10} />
    <NumberInput className={field} aria-label="In between" defaultValue={5} min={0} max={10} />
    <NumberInput className={field} aria-label="At the ceiling" defaultValue={10} min={0} max={10} />
</Stack>`;

// How far one press moves the value. The arrow keys move by the same amount, since the step is
// handed to the field itself rather than kept for the stepper alone
const stepPreview = (
    <Stack gap="normal">
        <NumberInputComponent
            className={classes.field}
            aria-label="In fives"
            defaultValue={0}
            step={5}
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="In tenths"
            defaultValue={0.5}
            step={0.1}
            min={0}
            max={1}
        />
    </Stack>
);

const stepCode = `<Stack gap="normal">
    <NumberInput className={field} aria-label="In fives" defaultValue={0} step={5} />
    <NumberInput
        className={field}
        aria-label="In tenths"
        defaultValue={0.5}
        step={0.1}
        min={0}
        max={1}
    />
</Stack>`;

// The three sizes a field comes in, which the stepper is sized to match
const sizesPreview = (
    <Stack gap="normal">
        <NumberInputComponent
            className={classes.field}
            aria-label="Small"
            size="small"
            defaultValue={1}
            min={0}
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="Medium"
            defaultValue={1}
            min={0}
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="Large"
            size="large"
            defaultValue={1}
            min={0}
        />
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    <NumberInput className={field} aria-label="Small" size="small" defaultValue={1} min={0} />
    <NumberInput className={field} aria-label="Medium" defaultValue={1} min={0} />
    <NumberInput className={field} aria-label="Large" size="large" defaultValue={1} min={0} />
</Stack>`;

// A unit or a currency standing inside the field, which it carries the way any other field carries
// a visual. It is drawn within the border rather than beside it, so the pair reads as one control
const visualsPreview = (
    <Stack gap="normal">
        <NumberInputComponent
            className={classes.field}
            aria-label="Price"
            leadingVisual="$"
            defaultValue={20}
            min={0}
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="Weight"
            trailingVisual="kg"
            defaultValue={5}
            min={0}
        />
    </Stack>
);

const visualsCode = `<Stack gap="normal">
    <NumberInput
        className={field}
        aria-label="Price"
        leadingVisual="$"
        defaultValue={20}
        min={0}
    />
    <NumberInput
        className={field}
        aria-label="Weight"
        trailingVisual="kg"
        defaultValue={5}
        min={0}
    />
</Stack>`;

// Nothing beside the field, for one whose range is too wide to be worth stepping through. The
// arrow keys still move it, so nothing is taken away by hiding the stepper but the pair of arrows
const withoutStepperPreview = (
    <NumberInputComponent
        className={classes.field}
        aria-label="Year"
        defaultValue={2026}
        min={1900}
        max={2100}
        hideStepper
    />
);

const withoutStepperCode = `<NumberInput
    className={field}
    aria-label="Year"
    defaultValue={2026}
    min={1900}
    max={2100}
    hideStepper
/>`;

// The colour of the answer, drawn on the field the way it is on any other. The first holds more
// than its ceiling allows, which is what a field is drawn in error for
const validationPreview = (
    <Stack gap="normal">
        <NumberInputComponent
            className={classes.field}
            aria-label="Too many"
            defaultValue={11}
            max={10}
            validationStatus="error"
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="Just right"
            defaultValue={5}
            max={10}
            validationStatus="success"
        />
    </Stack>
);

const validationCode = `<Stack gap="normal">
    <NumberInput
        className={field}
        aria-label="Too many"
        defaultValue={11}
        max={10}
        validationStatus="error"
    />
    <NumberInput
        className={field}
        aria-label="Just right"
        defaultValue={5}
        max={10}
        validationStatus="success"
    />
</Stack>`;

// A field that cannot be moved, either way of saying so. The stepper closes along with the field,
// since a pair of arrows that does nothing is worse than no arrows at all
const fixedPreview = (
    <Stack gap="normal">
        <NumberInputComponent
            className={classes.field}
            aria-label="Turned off"
            defaultValue={3}
            disabled
        />
        <NumberInputComponent
            className={classes.field}
            aria-label="Read only"
            defaultValue={3}
            readOnly
        />
    </Stack>
);

const fixedCode = `<Stack gap="normal">
    <NumberInput className={field} aria-label="Turned off" defaultValue={3} disabled />
    <NumberInput className={field} aria-label="Read only" defaultValue={3} readOnly />
</Stack>`;

// Named by the field around it rather than by a label of its own, which is how one of these is
// labelled on a form.
//
// A form control finds the input it is to wire up by recognising it, and the list of what it
// recognises does not hold this one, so the three are pointed at one another by hand. It is the
// same shape a form control uses for any control of the caller's own. Left to itself, the label
// would point at an id the field never receives, and the field would be named by nothing at all
const formControlPreview = (
    <FormControl className={classes.field}>
        <FormControl.Label htmlFor="quantity">Quantity</FormControl.Label>
        <NumberInputComponent
            id="quantity"
            aria-describedby="quantity-caption"
            defaultValue={1}
            min={1}
            max={99}
        />
        <FormControl.Caption id="quantity-caption">Up to ninety-nine at a time</FormControl.Caption>
    </FormControl>
);

const formControlCode = `<FormControl className={field}>
    <FormControl.Label htmlFor="quantity">Quantity</FormControl.Label>
    <NumberInput
        id="quantity"
        aria-describedby="quantity-caption"
        defaultValue={1}
        min={1}
        max={99}
    />
    <FormControl.Caption id="quantity-caption">Up to ninety-nine at a time</FormControl.Caption>
</FormControl>`;

// Where the caller keeps hold of the number. The field shows what it was handed and reports where
// it would go, so a field the caller is holding never moves until they say so.
//
// The state is the caller's, which makes this a component of its own rather than an element the
// page holds ready
const ControlledPreview = () => {
    const [quantity, setQuantity] = React.useState<number | null>(1);

    return (
        <Stack gap="condensed">
            <NumberInputComponent
                className={classes.field}
                aria-label="Quantity"
                value={quantity}
                onChange={setQuantity}
                min={0}
                max={10}
            />
            <Text size="small" className={classes.muted}>
                Holding: {quantity === null ? "nothing" : quantity}
            </Text>
        </Stack>
    );
};

const controlledCode = `const [quantity, setQuantity] = React.useState(1);

<Stack gap="condensed">
    <NumberInput
        className={field}
        aria-label="Quantity"
        value={quantity}
        onChange={setQuantity}
        min={0}
        max={10}
    />
    <Text size="small" className={muted}>
        Holding: {quantity === null ? "nothing" : quantity}
    </Text>
</Stack>`;

// The field as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then the arithmetic it does, then how it is drawn, and last how it is named and who is
// holding the number
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "One number, a floor under it, and the stepper beside it. Neither half of the stepper is a tab stop: the field steps by the same amount on the arrow keys, so a reader on the keyboard can already do this without them, and two more stops in every number field on a form is a poor trade for nothing gained. Pressing one leaves the reader on the field rather than on the arrow they pressed, since that is what they were aiming at.",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Held between two ends",
        description:
            "The stepper stops at either end rather than running past it, and an end the value cannot pass is drawn as closed rather than left to be found by pressing at it. A step that would overshoot lands on the end instead. A field with nothing in it has reached neither end yet, since the first press lands on the floor rather than a step past it.",
        setup,
        preview: rangePreview,
        code: rangeCode,
    },
    {
        name: "Stepping by something other than one",
        description:
            "How far one press moves the value. The step is handed to the field itself rather than kept for the stepper alone, so the arrow keys move by the same amount. A run of tenths is rounded back to the places the step and the value were written to, so it does not drift into a tail of digits nobody asked for.",
        setup,
        preview: stepPreview,
        code: stepCode,
    },
    {
        name: "Sizes",
        description:
            "The three a field comes in, which the stepper is sized to match. Each half of it is half the height an action would be, so the two together stand as tall as one and the field is no deeper for carrying them.",
        setup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "A unit beside it",
        description:
            "A currency sign or a unit, which the field carries the way any other field carries a visual. It stands inside the border rather than beside it, so the pair reads as one control and the number is read against the unit without either being labelled twice.",
        setup,
        preview: visualsPreview,
        code: visualsCode,
    },
    {
        name: "Without the stepper",
        description:
            "For a field whose range is too wide to be worth stepping through — a year, a page count, an amount typed rather than nudged. The ends and the step are still handed to the field, so the arrow keys move it exactly as before; what is taken away is the pair of arrows and nothing else.",
        setup,
        preview: withoutStepperPreview,
        code: withoutStepperCode,
    },
    {
        name: "Validation statuses",
        description:
            "The colour of the answer, drawn on the field the way it is on any other. The first holds more than its ceiling allows, which is what a field is drawn in error for: a value typed past an end is left where it was typed rather than pulled back, since correcting what someone has written under them is worse than showing them it is wrong.",
        setup,
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Turned off",
        description:
            "A field that cannot be moved, either way of saying so. The stepper closes along with the field in both, since a pair of arrows that does nothing is worse than no arrows at all.",
        setup,
        preview: fixedPreview,
        code: fixedCode,
    },
    {
        name: "Named by a form control",
        description:
            "Which is how one of these is labelled on a form, and why the fields above are named outright instead: a field standing on its own has nothing else to say what it is for. A form control finds the input it is to wire up by recognising it, and the list of what it recognises does not hold this one, so the label, the field and the caption are pointed at one another by hand — the same shape a form control uses for any control of the caller's own. Left to itself the label would point at an id the field never receives, and the field would be named by nothing at all.",
        setup,
        preview: formControlPreview,
        code: formControlCode,
    },
    {
        name: "Where the caller keeps hold of it",
        description:
            "The field shows the number it was handed and reports where it would step to, without moving there itself, so a field the caller is holding never changes until they say so. An emptied field reports nothing at all rather than zero, since a field left blank is not a field holding none.",
        setup: mutedSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the field adds to the one it is built on. What it holds comes first, since that is the
// whole of what a number field is, then the arithmetic it does with it, and last the stepper.
//
// Everything else a text input takes is left to be written up where a text input is, rather than
// said a second time here where the two would fall out of step
const groups: ComponentPropGroup[] = [
    {
        name: "NumberInput",
        props: [
            {
                name: "value",
                type: "number | null",
                description:
                    "What the field holds, where the caller keeps hold of it. Null is a field left empty. A field held this way shows what it was handed and reports where it would step to without moving there itself, so it never changes until the caller says so",
            },
            {
                name: "defaultValue",
                type: "number",
                description:
                    "What the field starts out holding, where it keeps hold of that itself",
            },
            {
                name: "min",
                type: "number",
                description:
                    "The lowest number the stepper will move to. A step that would overshoot lands here instead, and the way down is drawn as closed once the value has arrived. It is handed to the field as well, so the arrow keys stop in the same place",
            },
            {
                name: "max",
                type: "number",
                description:
                    "The highest, read the same way. Neither end pulls back a number that was typed past it: correcting what someone has written under them is worse than drawing the field as wrong",
            },
            {
                name: "step",
                type: "number",
                default: "1",
                description:
                    "How far one press of the stepper, or one press of an arrow key, moves the value. A run of steps written to a decimal place is rounded back to it, so a run of tenths does not drift into a tail of digits nobody asked for",
            },
            {
                name: "onChange",
                type: "(value: number | null, event?: React.ChangeEvent<HTMLInputElement>) => void",
                description:
                    "Called with the number the field now holds, or null where it has been emptied. There is no event to hand over where the stepper moved the value rather than the reader typing it, which is also how the two can be told apart",
            },
            {
                name: "hideStepper",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the field to typing and to the arrow keys, with no stepper drawn beside it. For a range too wide to be worth stepping through",
            },
            {
                name: "incrementLabel",
                type: "string",
                default: '"Increase"',
                description:
                    "What the upper half of the stepper is called. It carries an arrow rather than words, so it has to be named for a screen reader",
            },
            {
                name: "decrementLabel",
                type: "string",
                default: '"Decrease"',
                description: "What the lower half is called, for the same reason",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the field is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const NumberInput = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                NumberInput
            </Heading>
            <Text as="p" size="large">
                A field for one number, with a stepper beside it for moving that number a step at a
                time. It is a text input underneath, so it is sized and coloured and validated the
                way every other field on the page is, and everything that shapes a text input shapes
                this one too. What it takes over are the parts that only mean something for a number
                — what the field holds, how far a step moves it, the ends it is held between — along
                with the trailing action, since the stepper stands there. What it adds is the
                arithmetic: a stepper that stops at either end rather than running past it, and a
                step the arrow keys follow as readily as the arrows do.
            </Text>
        </Stack>
        <ComponentExamples component="NumberInput" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default NumberInput;
