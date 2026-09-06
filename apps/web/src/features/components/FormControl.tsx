import { GlobeRegular } from "@gamecrafters/base-ui-icons";
import {
    Checkbox,
    CheckboxGroup,
    FormControl as FormControlComponent,
    Heading,
    NativeSelect,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Textarea,
    TextInput,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A field lays its parts out down a column and fills whatever holds it, so across the whole of
    // the card it would run the width of the page. It is given a column instead
    preview: "w-[20rem]",
};

// What the examples have to have in hand before they can be drawn
const previewSetup = `const field = "w-[20rem]";`;

// The plainest field there is: the name above the input, the input itself, and the line beneath it
// saying more. Nothing is said with a prop, so it lays out down a column.
//
// The input is handed to the field rather than named to it. The field finds the one it knows how to
// wire up and gives it its own id, so the name points at it and the caption is read out with it
// without any of that being written twice.
//
// The page and the component it is about are both called FormControl, so the component is brought
// in under a name saying which of the two it is. The listing beneath says FormControl, as an
// application importing it would
const defaultPreview = (
    <FormControlComponent className={classes.preview}>
        <FormControlComponent.Label>Name</FormControlComponent.Label>
        <TextInput />
        <FormControlComponent.Caption>
            The name people will know you by
        </FormControlComponent.Caption>
    </FormControlComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<FormControl className={field}>
    <FormControl.Label>Name</FormControl.Label>
    <TextInput />
    <FormControl.Caption>The name people will know you by</FormControl.Caption>
</FormControl>`;

// The inputs the field knows how to wire up, each written the same way. It is the component itself
// that is recognised rather than a name it was given, so a field holds whichever of them it is
// handed and nothing has to say which it was.
//
// The checkbox at the foot reads across without being asked to, since a box has to stand beside the
// name it belongs to
const inputsPreview = (
    <Stack gap="normal" className={classes.preview}>
        <FormControlComponent>
            <FormControlComponent.Label>Text input</FormControlComponent.Label>
            <TextInput />
        </FormControlComponent>
        <FormControlComponent>
            <FormControlComponent.Label>Native select</FormControlComponent.Label>
            <NativeSelect>
                <NativeSelect.Option value="figma">Figma</NativeSelect.Option>
                <NativeSelect.Option value="css">Base CSS</NativeSelect.Option>
                <NativeSelect.Option value="react">Base React components</NativeSelect.Option>
            </NativeSelect>
        </FormControlComponent>
        <FormControlComponent>
            <FormControlComponent.Label>Textarea</FormControlComponent.Label>
            <Textarea />
        </FormControlComponent>
        <FormControlComponent>
            <FormControlComponent.Label>Checkbox</FormControlComponent.Label>
            <Checkbox />
        </FormControlComponent>
    </Stack>
);

const inputsCode = `<Stack gap="normal" className={field}>
    <FormControl>
        <FormControl.Label>Text input</FormControl.Label>
        <TextInput />
    </FormControl>
    <FormControl>
        <FormControl.Label>Native select</FormControl.Label>
        <NativeSelect>
            <NativeSelect.Option value="figma">Figma</NativeSelect.Option>
            <NativeSelect.Option value="css">Base CSS</NativeSelect.Option>
            <NativeSelect.Option value="react">Base React components</NativeSelect.Option>
        </NativeSelect>
    </FormControl>
    <FormControl>
        <FormControl.Label>Textarea</FormControl.Label>
        <Textarea />
    </FormControl>
    <FormControl>
        <FormControl.Label>Checkbox</FormControl.Label>
        <Checkbox />
    </FormControl>
</Stack>`;

// A box and the name beside it, which is what a choice is: the name belongs to the box rather than
// standing over it. Each field is one choice, and the group around them is what names the set and
// speaks for all of them at once
const choicePreview = (
    <Stack gap="spacious" className={classes.preview}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
            <FormControlComponent>
                <Checkbox value="issues" />
                <FormControlComponent.Label>Issues</FormControlComponent.Label>
            </FormControlComponent>
            <FormControlComponent>
                <Checkbox value="releases" />
                <FormControlComponent.Label>Releases</FormControlComponent.Label>
            </FormControlComponent>
        </CheckboxGroup>
        <RadioGroup name="visibility">
            <RadioGroup.Label>Visibility</RadioGroup.Label>
            <FormControlComponent>
                <Radio value="public" />
                <FormControlComponent.Label>Public</FormControlComponent.Label>
            </FormControlComponent>
            <FormControlComponent>
                <Radio value="private" />
                <FormControlComponent.Label>Private</FormControlComponent.Label>
            </FormControlComponent>
        </RadioGroup>
    </Stack>
);

const choiceCode = `<Stack gap="spacious" className={field}>
    <CheckboxGroup>
        <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
        <FormControl>
            <Checkbox value="issues" />
            <FormControl.Label>Issues</FormControl.Label>
        </FormControl>
        <FormControl>
            <Checkbox value="releases" />
            <FormControl.Label>Releases</FormControl.Label>
        </FormControl>
    </CheckboxGroup>
    <RadioGroup name="visibility">
        <RadioGroup.Label>Visibility</RadioGroup.Label>
        <FormControl>
            <Radio value="public" />
            <FormControl.Label>Public</FormControl.Label>
        </FormControl>
        <FormControl>
            <Radio value="private" />
            <FormControl.Label>Private</FormControl.Label>
        </FormControl>
    </RadioGroup>
</Stack>`;

// A field told to read across without a choice input asking for it, for a row of settings whose
// names are read down one column and whose controls stand in another
const horizontalPreview = (
    <FormControlComponent layout="horizontal" className={classes.preview}>
        <TextInput />
        <FormControlComponent.Label>Name</FormControlComponent.Label>
        <FormControlComponent.Caption>
            The name people will know you by
        </FormControlComponent.Caption>
    </FormControlComponent>
);

const horizontalCode = `<FormControl layout="horizontal" className={field}>
    <TextInput />
    <FormControl.Label>Name</FormControl.Label>
    <FormControl.Caption>The name people will know you by</FormControl.Caption>
</FormControl>`;

// A field that has to be answered before the form it stands in can be sent. The mark beside the
// name is a star unless it is worded otherwise, and it can be taken out of the accessibility tree
// where the form has already said what its marks mean, which is what the last of these does
const requiredPreview = (
    <Stack gap="normal" className={classes.preview}>
        <FormControlComponent required>
            <FormControlComponent.Label>Starred</FormControlComponent.Label>
            <TextInput />
        </FormControlComponent>
        <FormControlComponent required>
            <FormControlComponent.Label requiredText="(required)">
                Worded
            </FormControlComponent.Label>
            <TextInput />
        </FormControlComponent>
        <Text size="small">Required fields are marked with an asterisk (*)</Text>
        <FormControlComponent required>
            <FormControlComponent.Label requiredIndicator={false}>
                Said once above
            </FormControlComponent.Label>
            <TextInput />
        </FormControlComponent>
    </Stack>
);

const requiredCode = `<Stack gap="normal" className={field}>
    <FormControl required>
        <FormControl.Label>Starred</FormControl.Label>
        <TextInput />
    </FormControl>
    <FormControl required>
        <FormControl.Label requiredText="(required)">Worded</FormControl.Label>
        <TextInput />
    </FormControl>
    <Text size="small">Required fields are marked with an asterisk (*)</Text>
    <FormControl required>
        <FormControl.Label requiredIndicator={false}>Said once above</FormControl.Label>
        <TextInput />
    </FormControl>
</Stack>`;

// What the field says about the answer it has been given. The message is pointed at by the input as
// well as drawn beneath it, so it is read out with the field rather than only seen, and the input
// itself is drawn as invalid where the message says something has gone wrong
const validationPreview = (
    <Stack gap="normal" className={classes.preview}>
        <FormControlComponent>
            <FormControlComponent.Label>Handle</FormControlComponent.Label>
            <TextInput defaultValue="mona lisa" />
            <FormControlComponent.Validation variant="error">
                Handles cannot contain spaces
            </FormControlComponent.Validation>
        </FormControlComponent>
        <FormControlComponent>
            <FormControlComponent.Label>Handle</FormControlComponent.Label>
            <TextInput defaultValue="monalisa" />
            <FormControlComponent.Validation variant="success">
                That handle is free
            </FormControlComponent.Validation>
        </FormControlComponent>
    </Stack>
);

const validationCode = `<Stack gap="normal" className={field}>
    <FormControl>
        <FormControl.Label>Handle</FormControl.Label>
        <TextInput defaultValue="mona lisa" />
        <FormControl.Validation variant="error">
            Handles cannot contain spaces
        </FormControl.Validation>
    </FormControl>
    <FormControl>
        <FormControl.Label>Handle</FormControl.Label>
        <TextInput defaultValue="monalisa" />
        <FormControl.Validation variant="success">That handle is free</FormControl.Validation>
    </FormControl>
</Stack>`;

// The name taken off the screen while it still names the input. It is for a field whose purpose is
// already plain from what surrounds it — a search box under a magnifying glass — where a name drawn
// above it would say twice what is already said once
const hiddenLabelPreview = (
    <FormControlComponent className={classes.preview}>
        <FormControlComponent.Label visuallyHidden>Search</FormControlComponent.Label>
        <TextInput placeholder="Search" />
    </FormControlComponent>
);

const hiddenLabelCode = `<FormControl className={field}>
    <FormControl.Label visuallyHidden>Search</FormControl.Label>
    <TextInput placeholder="Search" />
</FormControl>`;

// The field taken out of use. It is said once on the field rather than on each of its parts: the
// input is handed it along with everything else, and the name and the caption are drawn as
// unavailable to match
const disabledPreview = (
    <Stack gap="normal" className={classes.preview}>
        <FormControlComponent disabled>
            <FormControlComponent.Label>Name</FormControlComponent.Label>
            <TextInput />
            <FormControlComponent.Caption>
                The name people will know you by
            </FormControlComponent.Caption>
        </FormControlComponent>
        <FormControlComponent disabled>
            <Checkbox />
            <FormControlComponent.Label>Watch this repository</FormControlComponent.Label>
        </FormControlComponent>
    </Stack>
);

const disabledCode = `<Stack gap="normal" className={field}>
    <FormControl disabled>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
        <FormControl.Caption>The name people will know you by</FormControl.Caption>
    </FormControl>
    <FormControl disabled>
        <Checkbox />
        <FormControl.Label>Watch this repository</FormControl.Label>
    </FormControl>
</Stack>`;

// A mark standing between the box and the name it belongs to, for a run of choices that are told
// apart at a glance as well as read
const leadingVisualPreview = (
    <FormControlComponent className={classes.preview}>
        <Checkbox />
        <FormControlComponent.LeadingVisual>
            <GlobeRegular />
        </FormControlComponent.LeadingVisual>
        <FormControlComponent.Label>Public</FormControlComponent.Label>
        <FormControlComponent.Caption>Anyone can see this repository</FormControlComponent.Caption>
    </FormControlComponent>
);

const leadingVisualCode = `<FormControl className={field}>
    <Checkbox />
    <FormControl.LeadingVisual>
        <GlobeRegular />
    </FormControl.LeadingVisual>
    <FormControl.Label>Public</FormControl.Label>
    <FormControl.Caption>Anyone can see this repository</FormControl.Caption>
</FormControl>`;

// A name for something that is not an input at all, drawn as a span so that it points at nothing.
// A label with nothing to point at is a label a reader is told to go to and finds nowhere to land
const labelAsSpanPreview = (
    <FormControlComponent className={classes.preview}>
        <FormControlComponent.Label as="span">Handle</FormControlComponent.Label>
        <Text>monalisa</Text>
    </FormControlComponent>
);

const labelAsSpanCode = `<FormControl className={field}>
    <FormControl.Label as="span">Handle</FormControl.Label>
    <Text>monalisa</Text>
</FormControl>`;

// An input the field has no way to recognise, wired up by hand. What the field would have handed it
// is written out instead: the name is pointed at it, and it is pointed at the caption. A control of
// the caller's own can reach for the same values with useFormControlForwardedProps rather than
// naming ids at both ends like this
const customInputPreview = (
    <FormControlComponent className={classes.preview}>
        <FormControlComponent.Label htmlFor="custom-handle">Handle</FormControlComponent.Label>
        <input id="custom-handle" type="text" aria-describedby="custom-handle-caption" />
        <FormControlComponent.Caption id="custom-handle-caption">
            With or without an @
        </FormControlComponent.Caption>
    </FormControlComponent>
);

const customInputCode = `<FormControl className={field}>
    <FormControl.Label htmlFor="custom-handle">Handle</FormControl.Label>
    <input id="custom-handle" type="text" aria-describedby="custom-handle-caption" />
    <FormControl.Caption id="custom-handle-caption">With or without an @</FormControl.Caption>
</FormControl>`;

// The field as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what can stand inside it, then which way its parts run, then what it says about the
// answer, and last what is done with a name or an input the field cannot wire up itself
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The name above the input, the input itself, and the line beneath it saying more. The input is handed to the field rather than named to it: the field finds the one it knows how to wire up and gives it its own id, so the name points at it and the caption is read out with it without any of that being written twice.",
        setup: previewSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "The inputs it wires up",
        description:
            "Four of the six the field knows how to wire up, each written the same way; a radio is the fifth and the library's own select the sixth. It is the component itself that is recognised rather than a name it was given, so a field holds whichever of them it is handed and nothing has to say which it was. The checkbox at the foot reads across without being asked to, since a box has to stand beside the name it belongs to.",
        setup: previewSetup,
        preview: inputsPreview,
        code: inputsCode,
    },
    {
        name: "Choices",
        description:
            "A box and the name beside it, which is what a choice is: the name belongs to the box rather than standing over it. Each field is one choice, and the group around them names the set and speaks for all of them at once, so a group that is disabled disables every field in it. A radio is never required on its own, since a group of them is required together.",
        setup: previewSetup,
        preview: choicePreview,
        code: choiceCode,
    },
    {
        name: "Reading across",
        description:
            "A field told to read across without a choice input asking for it, for a row of settings whose names are read down one column and whose controls stand in another. What is written inside it is laid out by the field rather than in the order it was written, so the input can be written first and still be drawn where it belongs.",
        setup: previewSetup,
        preview: horizontalPreview,
        code: horizontalCode,
    },
    {
        name: "Required",
        description:
            "A field that has to be answered before the form it stands in can be sent. The mark beside the name is a star unless it is worded otherwise, and it can be taken out of the accessibility tree where the form has already said what its marks mean, which is what the last of these does.",
        setup: previewSetup,
        preview: requiredPreview,
        code: requiredCode,
    },
    {
        name: "Validation",
        description:
            "What the field says about the answer it has been given. The message is pointed at by the input as well as drawn beneath it, so it is read out with the field rather than only seen, and the input is drawn as invalid where the message says something has gone wrong. The mark beside the wording is left out of the accessibility tree, since the colour and the icon say what the words already say.",
        setup: previewSetup,
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "A hidden name",
        description:
            "The name taken off the screen while it still names the input. It is for a field whose purpose is already plain from what surrounds it, where a name drawn above it would say twice what is already said once. It is hidden rather than left out, so the field is still named to a reader who cannot see what surrounds it.",
        setup: previewSetup,
        preview: hiddenLabelPreview,
        code: hiddenLabelCode,
    },
    {
        name: "Disabled",
        description:
            "The field taken out of use. It is said once on the field rather than on each of its parts: the input is handed it along with everything else, and the name and the caption are drawn as unavailable to match.",
        setup: previewSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "A leading visual",
        description:
            "A mark standing between the box and the name it belongs to, for a run of choices that are told apart at a glance as well as read. It is drawn beside a choice input, where there is a box for it to follow.",
        setup: previewSetup,
        preview: leadingVisualPreview,
        code: leadingVisualCode,
    },
    {
        name: "A name for something that is not an input",
        description:
            "A name drawn as a span, which points at nothing. A label with nothing to point at is a label a reader is told to go to and finds nowhere to land, so a name over a value being shown rather than asked for is written this way. A legend does the same for a set of fields inside a fieldset.",
        setup: previewSetup,
        preview: labelAsSpanPreview,
        code: labelAsSpanCode,
    },
    {
        name: "An input of the caller's own",
        description:
            "An input the field has no way to recognise, wired up by hand: what the field would have handed it is written out instead, so the name is pointed at it and it is pointed at the caption. A control of the caller's own can reach for the same values with useFormControlForwardedProps rather than naming ids at both ends like this, and whatever the caller sets stands over what the field would have given.",
        setup: previewSetup,
        preview: customInputPreview,
        code: customInputCode,
    },
];

// The direction the field's parts flow
const layout = '"vertical" | "horizontal"';

// What the name can be drawn as. It is the three that make sense over a field rather than any
// element at all, since two of them are chosen for having nothing to point at
const labelElement = '"label" | "legend" | "span"';

// What the field says about the answer it has been given
const validationStatus = '"error" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the field and its parts take, under the one that takes it. What the field says about
// itself comes first, then how it is laid out, then what ties it together.
//
// The field is drawn as a div and its parts as the elements they have to be, so only the name takes
// an element to be drawn as, and it takes three rather than any
const groups: ComponentPropGroup[] = [
    {
        name: "FormControl",
        props: [
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the field being used. It is handed to the input the field wired up, and the name and the caption are drawn as unavailable with it. A field standing in a disabled CheckboxGroup or RadioGroup is disabled along with the group",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires a value before the owning form can be submitted, and marks the name with it. A radio is never required on its own, since a group of them is required together and one of them is always the answer",
            },
            {
                name: "layout",
                type: layout,
                default: '"vertical"',
                options: ["vertical", "horizontal"],
                description:
                    "The direction the field's parts flow. A checkbox or a radio always reads across whatever this says, since the box has to stand beside the name it belongs to",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Ties the name, the caption and the validation message to the input. One is made where the caller does not give one, so nothing has to be named to have a field wired up",
            },
            styling,
        ],
    },
    {
        name: "FormControl.Label",
        props: [
            {
                name: "as",
                type: labelElement,
                default: '"label"',
                options: ["label", "legend", "span"],
                description:
                    "What the name is drawn as. A legend names the fieldset around it and a span names something that is not a form input at all, so neither is given anything to point at, while a label is pointed at the input the field wired up",
            },
            {
                name: "visuallyHidden",
                type: "boolean",
                default: "false",
                description:
                    "Takes the name off the screen while leaving it in the accessibility tree, for a field whose purpose is already plain from what surrounds it",
            },
            {
                name: "requiredText",
                type: "string",
                default: '"*"',
                description:
                    "What stands beside the name of a required field. Given without the field being required, it stands anyway, which is how a field is marked as optional among required ones",
            },
            {
                name: "requiredIndicator",
                type: "boolean",
                default: "true",
                description:
                    "Whether the mark beside the name is read out as well as shown. It is turned off where the field is already spoken for elsewhere, a note above the form saying what the marks mean",
            },
            {
                name: "htmlFor",
                type: "string",
                description:
                    "What the name points at, in place of the field's own id. It is what wires the name to an input the field has no way to recognise, and it is left off entirely where the name is drawn as a legend or a span",
            },
            styling,
        ],
    },
    {
        name: "FormControl.Caption",
        props: [
            {
                name: "id",
                type: "string",
                description:
                    "What the input points at to be described by the caption, in place of the one the field makes. It is given where the input is the caller's own and has to be pointed at the caption by hand",
            },
            styling,
        ],
    },
    {
        name: "FormControl.Validation",
        props: [
            {
                name: "variant",
                type: validationStatus,
                required: true,
                options: ["error", "success"],
                description:
                    "What the message is saying, which draws the mark beside it and colours the row. An error is handed to the input as well, so it is drawn as invalid rather than only described as it",
            },
            {
                name: "id",
                type: "string",
                description:
                    "What the input points at to be described by the message, in place of the one the field makes. It sits on the wording rather than the row, so what describes the input is the words and not the mark beside them",
            },
            styling,
        ],
    },
    {
        name: "FormControl.LeadingVisual",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the field is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const FormControl = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                FormControl
            </Heading>
            <Text as="p" size="large">
                What makes a control a field: the name above it, the line beneath saying more, and
                the message saying what is wrong with the answer. The input is handed to the field
                rather than named to it — a text input, a textarea, a select, a checkbox or a radio
                written inside one is found and given the field&apos;s id, its disabled and required
                state and the ids of whatever describes it, so none of that has to be written twice
                or kept in step by hand. A checkbox or a radio reads across whatever layout was
                asked for, since the box has to stand beside the name it belongs to. Anything the
                field has no way to recognise is left to stand where it was written and is wired up
                by the caller, or reaches for the same values itself through
                useFormControlForwardedProps.
            </Text>
        </Stack>
        <ComponentExamples component="FormControl" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default FormControl;
