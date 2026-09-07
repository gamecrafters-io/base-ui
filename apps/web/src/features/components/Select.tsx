import * as React from "react";
import {
    FormControl,
    Heading,
    Select as SelectComponent,
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
    // A field told to fill takes the width of whatever it stands in, so the page gives it a column
    // rather than the width of the card
    preview: "w-full max-w-[20rem]",
    muted: "text-[var(--foreground-color-muted)]",
};

// The three sizes a field is drawn at
const sizes = ["small", "medium", "large"] as const;

const sizesSetup = `const sizes = ["small", "medium", "large"];`;

// The options every field on this page is offering. They are written out in each listing rather
// than reached for from here, since what a reader copies has only itself to reach for
const choices = (
    <>
        <SelectComponent.Option value="one">Choice one</SelectComponent.Option>
        <SelectComponent.Option value="two">Choice two</SelectComponent.Option>
        <SelectComponent.Option value="three">Choice three</SelectComponent.Option>
    </>
);

// What every listing writes where the preview reaches for the options above
const choicesCode = `<Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two">Choice two</Select.Option>
        <Select.Option value="three">Choice three</Select.Option>`;

// The plainest field there is: the question above it, a line standing in for the choice until one
// is made, and the options it is answered from. The field is wired up by the FormControl around
// it, so the name above it points at the field without either being given an id by hand.
//
// The page and the component it is about are both called Select, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Select, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.preview}>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent placeholder="Pick a choice">{choices}</SelectComponent>
        </FormControl>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<FormControl>
    <FormControl.Label>Choice</FormControl.Label>
    <Select placeholder="Pick a choice">
        ${choicesCode}
    </Select>
</FormControl>`;

// A choice already made when the reader arrives, which the field keeps hold of itself
const defaultValuePreview = (
    <Stack className={classes.preview}>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent defaultValue="two">{choices}</SelectComponent>
        </FormControl>
    </Stack>
);

const defaultValueCode = `<FormControl>
    <FormControl.Label>Choice</FormControl.Label>
    <Select defaultValue="two">
        ${choicesCode}
    </Select>
</FormControl>`;

// The choice held by whoever is drawing the field rather than by the field, which is what anything
// else on the page having a say over it wants
const ControlledPreview = () => {
    const [value, setValue] = React.useState("one");

    return (
        <Stack gap="condensed" className={classes.preview}>
            <FormControl>
                <FormControl.Label>Choice</FormControl.Label>
                <SelectComponent value={value} onChange={setValue}>
                    {choices}
                </SelectComponent>
            </FormControl>
            <Text size="small" className={classes.muted}>
                Picked: {value}
            </Text>
        </Stack>
    );
};

const controlledSetup = `const [value, setValue] = React.useState("one");`;

const controlledCode = `<Stack gap="condensed">
    <FormControl>
        <FormControl.Label>Choice</FormControl.Label>
        <Select value={value} onChange={setValue}>
            ${choicesCode}
        </Select>
    </FormControl>
    <Text size="small">Picked: {value}</Text>
</Stack>`;

// Options gathered under names, for a list long enough that the run of them is hard to read
const groupsPreview = (
    <Stack className={classes.preview}>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent placeholder="Pick a choice">
                <SelectComponent.OptGroup label="Group one">
                    <SelectComponent.Option value="one">Choice one</SelectComponent.Option>
                    <SelectComponent.Option value="two">Choice two</SelectComponent.Option>
                </SelectComponent.OptGroup>
                <SelectComponent.OptGroup label="Group two">
                    <SelectComponent.Option value="three">Choice three</SelectComponent.Option>
                    <SelectComponent.Option value="four">Choice four</SelectComponent.Option>
                </SelectComponent.OptGroup>
            </SelectComponent>
        </FormControl>
    </Stack>
);

const groupsCode = `<FormControl>
    <FormControl.Label>Choice</FormControl.Label>
    <Select placeholder="Pick a choice">
        <Select.OptGroup label="Group one">
            <Select.Option value="one">Choice one</Select.Option>
            <Select.Option value="two">Choice two</Select.Option>
        </Select.OptGroup>
        <Select.OptGroup label="Group two">
            <Select.Option value="three">Choice three</Select.Option>
            <Select.Option value="four">Choice four</Select.Option>
        </Select.OptGroup>
    </Select>
</FormControl>`;

// Options that cannot be picked: one on its own, and a whole group at once
const disabledOptionsPreview = (
    <Stack className={classes.preview}>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent placeholder="Pick a choice">
                <SelectComponent.Option value="one">Choice one</SelectComponent.Option>
                <SelectComponent.Option value="two" disabled>
                    Choice two
                </SelectComponent.Option>
                <SelectComponent.OptGroup label="Not this year" disabled>
                    <SelectComponent.Option value="three">Choice three</SelectComponent.Option>
                    <SelectComponent.Option value="four">Choice four</SelectComponent.Option>
                </SelectComponent.OptGroup>
            </SelectComponent>
        </FormControl>
    </Stack>
);

const disabledOptionsCode = `<FormControl>
    <FormControl.Label>Choice</FormControl.Label>
    <Select placeholder="Pick a choice">
        <Select.Option value="one">Choice one</Select.Option>
        <Select.Option value="two" disabled>
            Choice two
        </Select.Option>
        <Select.OptGroup label="Not this year" disabled>
            <Select.Option value="three">Choice three</Select.Option>
            <Select.Option value="four">Choice four</Select.Option>
        </Select.OptGroup>
    </Select>
</FormControl>`;

// The three sizes, read one above the other since what is being compared is the weight of one
// against the next
const sizesPreview = (
    <Stack gap="normal" className={classes.preview}>
        {sizes.map((size) => (
            <FormControl key={size}>
                <FormControl.Label>{size}</FormControl.Label>
                <SelectComponent size={size} placeholder="Pick a choice">
                    {choices}
                </SelectComponent>
            </FormControl>
        ))}
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    {sizes.map((size) => (
        <FormControl key={size}>
            <FormControl.Label>{size}</FormControl.Label>
            <Select size={size} placeholder="Pick a choice">
                ${choicesCode}
            </Select>
        </FormControl>
    ))}
</Stack>`;

// A field filling whatever it stands in, rather than being drawn to the width of what it holds
const blockPreview = (
    <Stack className={classes.preview}>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent block placeholder="Pick a choice">
                {choices}
            </SelectComponent>
        </FormControl>
    </Stack>
);

const blockCode = `<FormControl>
    <FormControl.Label>Choice</FormControl.Label>
    <Select block placeholder="Pick a choice">
        ${choicesCode}
    </Select>
</FormControl>`;

// What the answer is worth, drawn on the border of the field and said under it. The field takes it
// from the message rather than being told twice
const validationPreview = (
    <Stack gap="spacious" className={classes.preview}>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent placeholder="Pick a choice">{choices}</SelectComponent>
            <FormControl.Validation variant="error">Pick one to carry on</FormControl.Validation>
        </FormControl>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent defaultValue="one">{choices}</SelectComponent>
            <FormControl.Validation variant="success">That works</FormControl.Validation>
        </FormControl>
    </Stack>
);

const validationCode = `<Stack gap="spacious">
    <FormControl>
        <FormControl.Label>Choice</FormControl.Label>
        <Select placeholder="Pick a choice">
            ${choicesCode}
        </Select>
        <FormControl.Validation variant="error">Pick one to carry on</FormControl.Validation>
    </FormControl>
    <FormControl>
        <FormControl.Label>Choice</FormControl.Label>
        <Select defaultValue="one">
            ${choicesCode}
        </Select>
        <FormControl.Validation variant="success">That works</FormControl.Validation>
    </FormControl>
</Stack>`;

// A field that cannot be answered at all
const disabledPreview = (
    <Stack className={classes.preview}>
        <FormControl disabled>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent placeholder="Pick a choice">{choices}</SelectComponent>
        </FormControl>
    </Stack>
);

const disabledCode = `<FormControl disabled>
    <FormControl.Label>Choice</FormControl.Label>
    <Select placeholder="Pick a choice">
        ${choicesCode}
    </Select>
</FormControl>`;

// The choice as it is submitted, which is through a field of its own rather than on the button
const namedPreview = (
    <Stack className={classes.preview}>
        <FormControl>
            <FormControl.Label>Choice</FormControl.Label>
            <SelectComponent name="choice" defaultValue="two" required>
                {choices}
            </SelectComponent>
            <FormControl.Caption>Submitted under the name “choice”</FormControl.Caption>
        </FormControl>
    </Stack>
);

const namedCode = `<FormControl>
    <FormControl.Label>Choice</FormControl.Label>
    <Select name="choice" defaultValue="two" required>
        ${choicesCode}
    </Select>
    <FormControl.Caption>Submitted under the name “choice”</FormControl.Caption>
</FormControl>`;

// The field as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then who holds the choice, then what the list is made of, then how the field is drawn, and
// last what it is worth and how it is submitted
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A choice made from a list that opens under the field. The line standing in for it until one is made is a placeholder rather than an option, so it cannot be picked and cannot be submitted. The field is drawn as a button that says what is picked, with the list opening from it — which is what lets an option be drawn as more than a line of text, where a native select would only ever hold words.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A choice made from the start",
        description:
            "The answer already given when the reader arrives, which the field keeps hold of itself. The field reads what it is showing off the options as they were written rather than waiting for one to report itself, so it says what is picked before the list has ever been opened.",
        preview: defaultValuePreview,
        code: defaultValueCode,
    },
    {
        name: "The choice the caller holds",
        description:
            "The answer held by whoever is drawing the field rather than by the field, which is what anything else on the page having a say over it wants. The field reports the value that has just been picked rather than an event to be read, so what comes back is the answer itself.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Options in groups",
        description:
            "Options gathered under names, for a list long enough that the run of them is hard to read. A group names the run standing under it and is passed over by the arrow keys, which move along the options themselves in the one order they were written.",
        preview: groupsPreview,
        code: groupsCode,
    },
    {
        name: "Options that cannot be picked",
        description:
            "An option turned off on its own, and a whole group turned off at once. Either is passed over by the arrow keys and by typing rather than being landed on and refused, and a group says it once rather than having it written onto every option under it.",
        preview: disabledOptionsPreview,
        code: disabledOptionsCode,
    },
    {
        name: "Sizes",
        description:
            "How tall the field stands. The list is drawn to the size of the field it was opened from as well as to its width, so the two read as the one control rather than as a surface of its own standing under a field.",
        setup: sizesSetup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Filling the width",
        description:
            "A field filling whatever it stands in rather than being drawn to the width of the longest thing it holds. A field standing as a row of a form nearly always wants this; one set among other things on a line does not.",
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Validation",
        description:
            "What the answer is worth, drawn on the border of the field and said under it. The field takes it from the message rather than being told twice, and an error is carried to a screen reader on the field itself rather than by the colour alone.",
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Disabled",
        description:
            "A question that is not to be answered at all. The field standing in a disabled FormControl is turned off along with it, so the whole question reads as unavailable rather than only the answers to it.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Submitted with a form",
        description:
            "What the choice is submitted under. The field is drawn as a button, which carries nothing a form would read, so what is picked is submitted through a hidden field of its own — which is why a field standing in a form has to be named. Required is carried to a screen reader, but the browser cannot enforce it on a button, so it is the caller's to check.",
        preview: namedPreview,
        code: namedCode,
    },
];

// How tall the field stands
const size = '"small" | "medium" | "large"';

// What the answer is worth, which draws the field's border in the colour of it
const validationStatus = '"error" | "success"';

// Which edge of the field the list stands off, and where along that edge it lines up
const side = '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"';

const align = '"start" | "center" | "end"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the field and its parts take, under the one that takes it. What is picked comes
// first, since it is the whole of what a field is for, then how the field is drawn, then where the
// list stands, and after those the pieces the list is made of
const groups: ComponentPropGroup[] = [
    {
        name: "Select",
        props: [
            {
                name: "placeholder",
                type: "string",
                description:
                    "Stands in for the choice until one is made. It is not an option, so it cannot be picked and is never submitted — a field that has to be answered says so with required rather than by offering an empty row",
            },
            {
                name: "value",
                type: "string",
                description:
                    "What is picked, where the caller keeps hold of the choice. Handing this over is what makes the field the caller's to change; leaving it out leaves it to change itself",
            },
            {
                name: "defaultValue",
                type: "string",
                description:
                    "What is picked to begin with, where the field keeps hold of the choice itself",
            },
            {
                name: "onChange",
                type: "(value: string) => void",
                description:
                    "Called with the value that has just been picked. It reports the answer itself rather than an event to be read",
            },
            {
                name: "name",
                type: "string",
                description:
                    "The name the choice is submitted under. The field is drawn as a button, which carries nothing a form would read, so what is picked is submitted through a hidden field of its own",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Says a choice has to be made, which is carried to a screen reader. The browser cannot enforce it on a button, so whether it was answered is the caller's to check",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the field stands. The list is drawn to the size of the field it was opened from, so the two read as the one control",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever the field stands in, rather than being drawn to the width of the longest thing it holds",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the answer is worth, drawn on the border of the field. A field standing in a FormControl takes this from the validation message rather than being told twice",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the field being opened. One standing in a disabled FormControl is turned off along with it",
            },
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the list is showing, where the caller keeps hold of that. Left out, the field keeps its own",
            },
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description: "Whether the list starts showing, where the field keeps its own state",
            },
            {
                name: "onOpenChange",
                type: "(open: boolean) => void",
                description: "Called when the list is opened or closed",
            },
            {
                name: "side",
                type: side,
                default: '"outside-bottom"',
                description:
                    "Which edge of the field the list stands off. Where there is no room on that side the list is moved, and it arrives from whichever edge it ended up on",
            },
            {
                name: "align",
                type: align,
                default: '"start"',
                description: "Where along that edge the list lines up",
            },
            styling,
        ],
    },
    {
        name: "Select.Option",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "What the field is left holding once the option is picked, and what is submitted for it",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What the option is drawn as, which can be more than a line of text. Whatever it is drawn out of is read through for the words typing at the field is matched against, so what a reader sees is what they can type for",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the option being picked. It is passed over by the arrow keys and by typing rather than being landed on and refused",
            },
            styling,
        ],
    },
    {
        name: "Select.OptGroup",
        props: [
            {
                name: "label",
                type: "string",
                required: true,
                description:
                    "Names the run of options standing under it. The group itself is passed over by the arrow keys, which move along the options in the one order they were written",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Marks every option in the group as one that cannot be picked. It is said once by the group rather than written onto each option, so it reaches every option under it however deeply they were nested",
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
const Select = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Select
            </Heading>
            <Text as="p" size="large">
                One choice made from a list that opens under the field. It is drawn as a button
                saying what is picked, with the list built rather than handed to the browser, which
                is what lets an option be drawn as more than a line of text — a name beside a mark,
                a value beside a note. Where the options are plain words and nothing else, a
                NativeSelect is the lighter thing to reach for.
            </Text>
            <Text as="p" size="large" className={classes.muted}>
                The field reads what it is offering off the options as they were written rather than
                waiting for them to report themselves, so it can say what is picked before the list
                has ever been opened. The list opens on the arrow keys, Space or Enter, moves on the
                arrows, jumps to either end on Home and End, and finds an option by typing the first
                letters of what it reads as. Since a button carries nothing a form would read, a
                field standing in one is submitted through a hidden field of its own.
            </Text>
        </Stack>
        <ComponentExamples component="Select" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Select;
