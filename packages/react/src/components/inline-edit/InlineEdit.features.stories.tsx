import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { Stack } from "../stack";
import { Text } from "../text";
import { InlineEdit, useInlineEdit, useInlineEditContext } from ".";
import type { TextInputSize } from "../text-input";
import type { InlineEditActivationMode, InlineEditSubmitMode } from "./InlineEdit.types";

const classes = {
    row: "flex flex-wrap items-start gap-[var(--base-size-24)]",
    container: "w-[var(--overlay-width-small)]",
};

const title = "Quarterly report";

const sizes: TextInputSize[] = ["small", "medium", "large"];

const activationModes: { mode: InlineEditActivationMode; label: string }[] = [
    { mode: "focus", label: "On arrival" },
    { mode: "click", label: "On a press" },
    { mode: "dblclick", label: "On a double press" },
    { mode: "none", label: "From the trigger alone" },
];

const submitModes: { mode: InlineEditSubmitMode; label: string }[] = [
    { mode: "both", label: "Enter or leaving" },
    { mode: "enter", label: "Enter alone" },
    { mode: "blur", label: "Leaving alone" },
    { mode: "none", label: "The trigger alone" },
];

export default {
    title: "Components/InlineEdit/Features",
    parameters: {
        layout: "centered",
    },
};

// The value, the field it is edited in and the triggers beside them, which every inline edit
// below is drawn from unless it says otherwise
const Parts = ({ label }: { label: string }) => (
    <>
        <InlineEdit.Label>{label}</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
            <InlineEdit.SubmitTrigger />
            <InlineEdit.CancelTrigger />
        </InlineEdit.Control>
    </>
);

// A Value And A Way In, which is the parts written out with the edit trigger beside the value.
// Enter keeps an edit and Escape throws it away
export const Basic: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit defaultValue={title}>
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
        </InlineEdit.Control>
    </InlineEdit>
);

// With Every Trigger, each standing only while it has something to do: the edit trigger while the
// value is being read, and the submit and cancel triggers while it is being edited
export const Controls: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit defaultValue={title}>
        <Parts label="Title" />
    </InlineEdit>
);

// With Words On The Triggers, which name them without an icon having to stand in for the name
export const LabelledTriggers: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit defaultValue={title}>
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger>Rename</InlineEdit.EditTrigger>
            <InlineEdit.SubmitTrigger>Save</InlineEdit.SubmitTrigger>
            <InlineEdit.CancelTrigger>Cancel</InlineEdit.CancelTrigger>
        </InlineEdit.Control>
    </InlineEdit>
);

// Where The Caller Keeps Hold Of The Value, so that it follows the page as well as the reader, and
// what was last kept can be shown beside it
export const Controlled: StoryFn<typeof InlineEdit> = () => {
    const [value, setValue] = React.useState(title);
    const [kept, setKept] = React.useState(title);

    return (
        <Stack gap="condensed" align="start">
            <InlineEdit value={value} onValueChange={setValue} onValueCommit={setKept}>
                <Parts label="Title" />
            </InlineEdit>
            <Text size="small">Last kept as {kept}</Text>
            <Button size="small" onClick={() => setValue("Annual report")}>
                Rename to Annual report
            </Button>
        </Stack>
    );
};

// Where The Caller Keeps Hold Of The Edit, so that the page knows whether the value is being read
// or edited. An edit is only asked to start or end, and does once the caller says so
export const ControlledEdit: StoryFn<typeof InlineEdit> = () => {
    const [editing, setEditing] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            <InlineEdit defaultValue={title} edit={editing} onEditChange={setEditing}>
                <Parts label="Title" />
            </InlineEdit>
            <Text size="small">{editing ? "Being edited" : "Being read"}</Text>
        </Stack>
    );
};

// Opened In Other Ways, where arriving at the preview is not what starts an edit: a press on it,
// two presses, or the edit trigger alone. Enter or Space on the preview starts one either way
export const ActivationModes: StoryFn<typeof InlineEdit> = () => (
    <div className={classes.row}>
        {activationModes.map(({ mode, label }) => (
            <InlineEdit key={mode} activationMode={mode} defaultValue={title}>
                <Parts label={label} />
            </InlineEdit>
        ))}
    </div>
);

// Kept In Other Ways, where Enter and leaving the field do not both keep an edit. Whatever does not
// keep an edit throws it away, and the submit trigger keeps it whatever the mode
export const SubmitModes: StoryFn<typeof InlineEdit> = () => (
    <div className={classes.row}>
        {submitModes.map(({ mode, label }) => (
            <InlineEdit key={mode} submitMode={mode} defaultValue={title}>
                <Parts label={label} />
            </InlineEdit>
        ))}
    </div>
);

// A Value Not Yet Written, with a prompt standing in the preview and a hint of what to type
// standing in the field
export const Placeholder: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit placeholder={{ preview: "Add a title", edit: "Name the report" }}>
        <Parts label="Title" />
    </InlineEdit>
);

// A Box Of Lines, for a value that runs over more than one line. Enter starts a new line, and the
// edit is kept with Command or Control held
export const Textarea: StoryFn<typeof InlineEdit> = () => (
    <div className={classes.container}>
        <InlineEdit
            block
            activationMode="dblclick"
            defaultValue={"Revenue grew in every region.\nCosts held steady."}
        >
            <InlineEdit.Label>Summary</InlineEdit.Label>
            <InlineEdit.Area>
                <InlineEdit.Input as="textarea" rows={3} />
                <InlineEdit.Preview />
            </InlineEdit.Area>
            <InlineEdit.Control>
                <InlineEdit.EditTrigger />
                <InlineEdit.SubmitTrigger />
                <InlineEdit.CancelTrigger />
            </InlineEdit.Control>
            <Text size="small">Press Command or Control and Enter to save</Text>
        </InlineEdit>
    </div>
);

// Grown With The Value, so that the field takes the same room being edited as the value did being
// read, and the triggers beside it move no further than the value does
export const AutoResize: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit autoResize defaultValue={title} placeholder="Add a title">
        <Parts label="Title" />
    </InlineEdit>
);

// Held To A Length, which the field will not take a character past
export const MaxLength: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit autoResize maxLength={20} defaultValue={title}>
        <Parts label="Title, up to 20 characters" />
    </InlineEdit>
);

// Sizes, which the preview, the field and the triggers take together from the control scale
export const Sizes: StoryFn<typeof InlineEdit> = () => (
    <div className={classes.row}>
        {sizes.map((size) => (
            <InlineEdit key={size} size={size} defaultValue={title}>
                <Parts label={size} />
            </InlineEdit>
        ))}
    </div>
);

// Filling Whatever Holds It, the value taking whatever room the triggers leave
export const Block: StoryFn<typeof InlineEdit> = () => (
    <div className={classes.container}>
        <InlineEdit block defaultValue={title}>
            <Parts label="Title" />
        </InlineEdit>
    </div>
);

// Saying How The Value Stands, in the same way as any other field
export const States: StoryFn<typeof InlineEdit> = () => (
    <div className={classes.row}>
        <InlineEdit invalid placeholder="Add a title">
            <Parts label="Invalid" />
        </InlineEdit>
        <InlineEdit readOnly defaultValue={title}>
            <Parts label="Read only" />
        </InlineEdit>
        <InlineEdit disabled defaultValue={title}>
            <Parts label="Disabled" />
        </InlineEdit>
    </div>
);

// A hint standing among the parts, reading the inline edit around it to say what the keys do
// while the value is being edited
const KeyHint = () => {
    const { editing } = useInlineEditContext();

    return (
        <Text size="small">
            {editing ? "Enter to save, Escape to cancel" : "Press the title to rename it"}
        </Text>
    );
};

// With A Hint Of Its Own, which reads the inline edit around it to say one thing while the value
// is being read and another while it is being edited
export const Context: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit defaultValue={title}>
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <KeyHint />
    </InlineEdit>
);

// Without A Name On The Page, for a value that says well enough what it is. The name is still
// there for a screen reader, and names the preview and the field alike
export const HiddenLabel: StoryFn<typeof InlineEdit> = () => (
    <InlineEdit size="large" defaultValue={title}>
        <InlineEdit.Label visuallyHidden>Report title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger label="Rename the report" />
            <InlineEdit.SubmitTrigger />
            <InlineEdit.CancelTrigger />
        </InlineEdit.Control>
    </InlineEdit>
);

// Root Provider, where the inline edit is drawn from a hook the caller is holding, so that an edit
// can be started from somewhere else on the page as well as from the inline edit itself
export const RootProvider: StoryFn<typeof InlineEdit> = () => {
    const report = useInlineEdit({ defaultValue: title });

    return (
        <Stack gap="condensed" align="start">
            <InlineEdit.RootProvider value={report}>
                <Parts label="Title" />
            </InlineEdit.RootProvider>
            <Text size="small">{report.editing ? "Being edited" : `Reads ${report.value}`}</Text>
            <Button size="small" disabled={report.editing} onClick={report.edit}>
                Rename
            </Button>
        </Stack>
    );
};

// In A Form Control, which names the value by its label and describes it by its caption and its
// validation message
export const InFormControl: StoryFn<typeof InlineEdit> = () => (
    <FormControl required>
        <FormControl.Label>Title</FormControl.Label>
        <InlineEdit invalid placeholder="Add a title">
            <InlineEdit.Area>
                <InlineEdit.Input />
                <InlineEdit.Preview />
            </InlineEdit.Area>
            <InlineEdit.Control>
                <InlineEdit.EditTrigger />
                <InlineEdit.SubmitTrigger />
                <InlineEdit.CancelTrigger />
            </InlineEdit.Control>
        </InlineEdit>
        <FormControl.Validation variant="error">Give the report a title</FormControl.Validation>
        <FormControl.Caption>Shown on the cover of the report</FormControl.Caption>
    </FormControl>
);

// In A Form, where the value is submitted under its name whether or not it is being edited
export const InAForm: StoryFn<typeof InlineEdit> = () => {
    const [submitted, setSubmitted] = React.useState("Not submitted");

    return (
        <Stack
            as="form"
            gap="condensed"
            align="start"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setSubmitted(`Sent ${new FormData(event.currentTarget).get("title") || "nothing"}`);
            }}
        >
            <InlineEdit name="title" defaultValue={title}>
                <Parts label="Title" />
            </InlineEdit>
            <Button type="submit" size="small">
                Submit
            </Button>
            <Text size="small">{submitted}</Text>
        </Stack>
    );
};
