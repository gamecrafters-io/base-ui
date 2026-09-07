import * as React from "react";
import {
    Heading,
    Radio,
    RadioGroup as RadioGroupComponent,
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

// What the set on this page is choosing between. It is written once and read out into a radio
// apiece, since a set of answers is come by as a list rather than typed out one control at a time
const choices = [
    { value: "daily", label: "Once a day" },
    { value: "weekly", label: "Once a week" },
    { value: "never", label: "Never" },
];

const choicesSetup = `const choices = [
    { value: "daily", label: "Once a day" },
    { value: "weekly", label: "Once a week" },
    { value: "never", label: "Never" },
];`;

// The radios the groups on this page are made of. A radio is named by words pointed at it rather
// than by text set down beside it, so each is a radio and a label together, and the two are held to
// the start rather than the middle because the radio stands against the first line of the words.
//
// Several groups stand on the one page, so the ids are told apart by what the group is showing. The
// listings beneath write the run out rather than calling this, since what a reader copies has only
// itself to reach for
const radios = (prefix: string, checked?: string) =>
    choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Radio id={`${prefix}-${value}`} value={value} defaultChecked={checked === value} />
            <Text as="label" htmlFor={`${prefix}-${value}`}>
                {label}
            </Text>
        </Stack>
    ));

// The plainest group there is: the question, the name that ties the answers together, and the
// radios it is answered with. It is drawn as a fieldset with the name in its legend, so a reader
// being read to hears what the radios are a set of before they hear the radios.
//
// The page and the component it is about are both called RadioGroup, so the component is brought in
// under a name saying which of the two it is. The listing beneath says RadioGroup, as an application
// importing it would
const defaultPreview = (
    <RadioGroupComponent name="digest">
        <RadioGroupComponent.Label>Email me</RadioGroupComponent.Label>
        {radios("default")}
    </RadioGroupComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<RadioGroup name="digest">
    <RadioGroup.Label>Email me</RadioGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Radio id={\`default-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`default-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</RadioGroup>`;

// A line under the name, for what the question needs saying about it that the name alone does not.
// It is read out as part of what describes the group rather than left as words standing near it
const captionPreview = (
    <RadioGroupComponent name="caption-digest">
        <RadioGroupComponent.Label>Email me</RadioGroupComponent.Label>
        <RadioGroupComponent.Caption>Pick one</RadioGroupComponent.Caption>
        {radios("caption")}
    </RadioGroupComponent>
);

const captionCode = `<RadioGroup name="caption-digest">
    <RadioGroup.Label>Email me</RadioGroup.Label>
    <RadioGroup.Caption>Pick one</RadioGroup.Caption>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Radio id={\`caption-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`caption-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</RadioGroup>`;

// The name kept as what the group is called while taken off the screen, for a question whose words
// are already said by whatever the group stands under. It is a hidden name rather than no name,
// since a set of radios nothing names is one a reader is read the answers to without being told the
// question
const hiddenLabelPreview = (
    <RadioGroupComponent name="hidden-digest">
        <RadioGroupComponent.Label visuallyHidden>Email me</RadioGroupComponent.Label>
        {radios("hidden")}
    </RadioGroupComponent>
);

const hiddenLabelCode = `<RadioGroup name="hidden-digest">
    <RadioGroup.Label visuallyHidden>Email me</RadioGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Radio id={\`hidden-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`hidden-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</RadioGroup>`;

// A question that has to be answered. The name is marked with a star for a reader who is looking at
// it, and the legend carries the word itself for one who is being read to, so neither is left to
// take the requirement from the other
const requiredPreview = (
    <RadioGroupComponent name="required-digest" required>
        <RadioGroupComponent.Label>Email me</RadioGroupComponent.Label>
        {radios("required")}
    </RadioGroupComponent>
);

const requiredCode = `<RadioGroup name="required-digest" required>
    <RadioGroup.Label>Email me</RadioGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Radio id={\`required-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`required-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</RadioGroup>`;

// What the answer is worth, said under the radios rather than beside any one of them, since what is
// wrong is the answer to the question rather than any single radio. The two are drawn together
// rather than one to an example, since what a colour says is read against the other
const validationPreview = (
    <Stack gap="spacious">
        <RadioGroupComponent name="error-digest" required>
            <RadioGroupComponent.Label>Email me</RadioGroupComponent.Label>
            {radios("error")}
            <RadioGroupComponent.Validation variant="error">
                Pick one to carry on
            </RadioGroupComponent.Validation>
        </RadioGroupComponent>
        <RadioGroupComponent name="success-digest">
            <RadioGroupComponent.Label>Email me</RadioGroupComponent.Label>
            {radios("success", "weekly")}
            <RadioGroupComponent.Validation variant="success">
                That works
            </RadioGroupComponent.Validation>
        </RadioGroupComponent>
    </Stack>
);

// The stack holding the two apart is part of what is being shown rather than the page's own
// furniture, since what the example is about is the one group read against the other
const validationCode = `<Stack gap="spacious">
    <RadioGroup name="error-digest" required>
        <RadioGroup.Label>Email me</RadioGroup.Label>
        {choices.map(({ value, label }) => (
            <Stack key={value} direction="horizontal" gap="condensed" align="start">
                <Radio id={\`error-\${value}\`} value={value} />
                <Text as="label" htmlFor={\`error-\${value}\`}>
                    {label}
                </Text>
            </Stack>
        ))}
        <RadioGroup.Validation variant="error">Pick one to carry on</RadioGroup.Validation>
    </RadioGroup>
    <RadioGroup name="success-digest">
        <RadioGroup.Label>Email me</RadioGroup.Label>
        {choices.map(({ value, label }) => (
            <Stack key={value} direction="horizontal" gap="condensed" align="start">
                <Radio
                    id={\`success-\${value}\`}
                    value={value}
                    defaultChecked={value === "weekly"}
                />
                <Text as="label" htmlFor={\`success-\${value}\`}>
                    {label}
                </Text>
            </Stack>
        ))}
        <RadioGroup.Validation variant="success">That works</RadioGroup.Validation>
    </RadioGroup>
</Stack>`;

// A question that is not to be answered at all. The group speaks for every radio in it, so it is
// turned off once rather than radio by radio, and the name is quieted with them so the whole
// question reads as unavailable rather than only the answers
const disabledPreview = (
    <RadioGroupComponent name="disabled-digest" disabled>
        <RadioGroupComponent.Label>Email me</RadioGroupComponent.Label>
        {radios("disabled", "weekly")}
    </RadioGroupComponent>
);

const disabledCode = `<RadioGroup name="disabled-digest" disabled>
    <RadioGroup.Label>Email me</RadioGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Radio
                id={\`disabled-\${value}\`}
                value={value}
                defaultChecked={value === "weekly"}
            />
            <Text as="label" htmlFor={\`disabled-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</RadioGroup>`;

// What has been answered, reported as it changes. The group hands back the value of the radio that
// has just been picked, and keeps nothing of its own: a radio group is never cleared by clicking,
// so the answer is only ever the one the event carries.
//
// It is a component of its own rather than an element the page holds ready, since the answer has to
// be kept somewhere to be shown; one of the radios starts out picked, so what is read here says
// something before anything is pressed
const ReportedPreview = () => {
    const [selected, setSelected] = React.useState("weekly");

    return (
        <RadioGroupComponent name="reported-digest" onChange={setSelected}>
            <RadioGroupComponent.Label>Email me</RadioGroupComponent.Label>
            <RadioGroupComponent.Caption>Picked: {selected}</RadioGroupComponent.Caption>
            {radios("reported", "weekly")}
        </RadioGroupComponent>
    );
};

// What the example has to have in hand. The group says what has been answered rather than keeping
// it for the caller, so the answer is the caller's and is got ready here
const reportedSetup = `${choicesSetup}

const [selected, setSelected] = React.useState("weekly");`;

const reportedCode = `<RadioGroup name="reported-digest" onChange={setSelected}>
    <RadioGroup.Label>Email me</RadioGroup.Label>
    <RadioGroup.Caption>Picked: {selected}</RadioGroup.Caption>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Radio
                id={\`reported-\${value}\`}
                value={value}
                defaultChecked={value === "weekly"}
            />
            <Text as="label" htmlFor={\`reported-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</RadioGroup>`;

// The group as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what can be said about the question, then what the group is left in, and last who
// hears the answer
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The question, and the radios it is answered with. The name is what ties them together — it is what the browser groups on, so only one of them can be picked at a time — and it is handed to the group rather than to each radio, which is why it is the one thing a group cannot be drawn without.",
        setup: choicesSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A line under the name",
        description:
            "What the question needs saying about it that the name alone does not. It stands in the legend beside the name, so a reader being read to hears it as part of what the group is called rather than coming upon it after the radios.",
        setup: choicesSetup,
        preview: captionPreview,
        code: captionCode,
    },
    {
        name: "A name that is only read out",
        description:
            "The name kept as what the group is called while taken off the screen, for a question whose words are already said by whatever the group stands under. It is a hidden name rather than no name: a set of radios nothing names is one a reader is read the answers to without ever being told the question.",
        setup: choicesSetup,
        preview: hiddenLabelPreview,
        code: hiddenLabelCode,
    },
    {
        name: "Required",
        description:
            "A question that has to be answered. The name is marked with a star for a reader looking at it and the legend carries the word itself for one being read to, so neither is left to take the requirement from the other. The radios themselves are left unmarked: one of a set is never required on its own, since what has to be answered is the question rather than any one answer to it.",
        setup: choicesSetup,
        preview: requiredPreview,
        code: requiredCode,
    },
    {
        name: "Validation",
        description:
            "What the answer is worth, said under the radios rather than beside any one of them, since what is right or wrong is the answer to the question rather than any single radio. The message describes the group, so it is read out when a reader arrives at the radios rather than only when they reach the end of them, and it carries a mark as well as a colour.",
        setup: choicesSetup,
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Disabled",
        description:
            "A question that is not to be answered at all. The group speaks for every radio in it, so it is turned off once rather than radio by radio, and the name is quieted with them — the whole question reads as unavailable rather than only the answers to it. A radio that was picked before it was turned off keeps its answer.",
        setup: choicesSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "The answer, reported",
        description:
            "The value of the radio that has just been picked, handed back as it changes. The group keeps nothing of its own: a radio group cannot be cleared by clicking, so there is always an answer and it is only ever the one the event carries — which is why only the radio that has just been picked reports, the browser having cleared the one before it without a change event of its own.",
        setup: reportedSetup,
        preview: <ReportedPreview />,
        code: reportedCode,
    },
];

// What the message is saying about the answer, which settles its colour and the mark beside it
const validationVariant = '"error" | "success"';

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
    default: '"fieldset"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the group and its parts take, under the one that takes it. What ties the answers
// together comes first, since a group cannot be drawn without it, then what the group is left in,
// then who hears the answer, and after those the parts that name the question and say what the
// answer is worth
const groups: ComponentPropGroup[] = [
    {
        name: "RadioGroup",
        props: [
            {
                name: "name",
                type: "string",
                required: true,
                description:
                    "Ties the radios together, so the browser only lets one of them be picked. It is handed down to every radio in the group, so they take it rather than each being given one, and it is what the answer is submitted under. It is named on the group itself rather than beside the rest, so it stays required whatever the group is drawn as",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops every radio in the group being used, and quiets the name with them, so the whole question reads as unavailable rather than only the answers to it",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires the question to be answered. The name is marked with a star and the legend carries the word itself, so neither a reader looking at it nor one being read to is left to take the requirement from the other. It is not handed down to the radios: one of a set is never required on its own, since what has to be answered is the question rather than any one answer to it",
            },
            {
                name: "onChange",
                type: "(selected: string, event?: React.ChangeEvent<HTMLInputElement>) => void",
                description:
                    "Called with the value of the radio that has just been picked, and with the event that picked it. The group keeps no state of its own, since a radio group cannot be cleared by clicking and the answer is never more than the value the event carries; only the radio that has just been picked reports, the browser having cleared the one before it without a change event of its own",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the group by whatever on the page already says what it is, for a group given no label of its own. A group carrying a label is named by that instead",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "RadioGroup.Label",
        props: [
            {
                name: "visuallyHidden",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the name as what the group is called while taking it off the screen, for a question whose words are already said by whatever the group stands under",
            },
            styling,
        ],
    },
    {
        name: "RadioGroup.Caption",
        props: [styling],
    },
    {
        name: "RadioGroup.Validation",
        props: [
            {
                name: "variant",
                type: validationVariant,
                required: true,
                description:
                    "What the message is saying about the answer, which settles its colour and the mark that stands before it, so what it says is not left to the colour alone",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the group is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const RadioGroup = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                RadioGroup
            </Heading>
            <Text as="p" size="large">
                A set of radios named as one question, of which one is the answer. It is drawn as a
                fieldset with the name in its legend, so a reader being read to hears what the
                radios are a set of before they hear the radios, and one who arrives at a radio part
                way down can ask what it belongs to.
            </Text>
            <Text as="p" size="large">
                The group is given the name that ties the radios together and hands it down to every
                one of them, which is why it is the one thing a group cannot be drawn without: it is
                what the browser groups on, and radios without it are answers to no question in
                particular. The group keeps no state of its own — it reports the value of the radio
                that has just been picked, and since a radio group cannot be cleared by clicking,
                there is always an answer to report.
            </Text>
        </Stack>
        <ComponentExamples component="RadioGroup" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default RadioGroup;
