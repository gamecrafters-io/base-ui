import * as React from "react";
import {
    Button,
    FormControl,
    Heading,
    InlineEdit as InlineEditComponent,
    Stack,
    Text,
    useInlineEdit,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentProp, ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A value told to fill whatever holds it would run the whole width of the card, so it is given
    // a column about the width one of these is actually read at
    field: "w-[20rem]",
};

// What the examples that are given a width have to have in hand before they can be drawn. The
// width is written once and reached for by each of them, since what changes between the examples
// is the inline edit rather than the room it stands in
const fieldSetup = `const field = "w-[20rem]";`;

// The inline edit written out in full: the name over the value, the value and the field it is
// edited in, and every trigger beside them. Each trigger stands only while it has something to
// do, so the edit trigger is all that is drawn beside the value until it is reached for, and the
// submit and cancel triggers take its place while it is being edited.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the inline edit alone. The card lays what it is handed out in
// a column, and a column draws what it holds the whole way across unless it is told otherwise,
// which would leave the triggers standing at the far end of the card from the value.
//
// The page and the component it is about are both called InlineEdit, so the component is brought
// in under a name saying which of the two it is. The listing beneath says InlineEdit, as an
// application importing it would
const defaultPreview = (
    <Stack align="start">
        <InlineEditComponent defaultValue="Quarterly report">
            <InlineEditComponent.Label>Title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
                <InlineEditComponent.SubmitTrigger />
                <InlineEditComponent.CancelTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<InlineEdit defaultValue="Quarterly report">
    <InlineEdit.Label>Title</InlineEdit.Label>
    <InlineEdit.Area>
        <InlineEdit.Input />
        <InlineEdit.Preview />
    </InlineEdit.Area>
    <InlineEdit.Control>
        <InlineEdit.EditTrigger />
        <InlineEdit.SubmitTrigger />
        <InlineEdit.CancelTrigger />
    </InlineEdit.Control>
</InlineEdit>`;

// Three values opened three other ways: a press on them, two presses, and nothing on the value at
// all, which leaves the edit trigger as the one way in. The first two are drawn without triggers,
// since what is being shown is the value itself answering
const activationPreview = (
    <Stack gap="normal" align="start">
        <InlineEditComponent activationMode="click" defaultValue="Quarterly report">
            <InlineEditComponent.Label>On a press</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
        </InlineEditComponent>
        <InlineEditComponent activationMode="dblclick" defaultValue="Quarterly report">
            <InlineEditComponent.Label>On a double press</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
        </InlineEditComponent>
        <InlineEditComponent activationMode="none" defaultValue="Quarterly report">
            <InlineEditComponent.Label>From the trigger alone</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const activationCode = `<Stack gap="normal" align="start">
    <InlineEdit activationMode="click" defaultValue="Quarterly report">
        <InlineEdit.Label>On a press</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
    </InlineEdit>
    <InlineEdit activationMode="dblclick" defaultValue="Quarterly report">
        <InlineEdit.Label>On a double press</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
    </InlineEdit>
    <InlineEdit activationMode="none" defaultValue="Quarterly report">
        <InlineEdit.Label>From the trigger alone</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
        </InlineEdit.Control>
    </InlineEdit>
</Stack>`;

// Three edits kept three other ways: on Enter alone, on leaving the field alone, and on neither,
// which leaves the submit trigger as the one way of keeping it. Whatever does not keep an edit
// throws it away, so the last carries a cancel trigger beside the submit trigger as well
const submitPreview = (
    <Stack gap="normal" align="start">
        <InlineEditComponent submitMode="enter" defaultValue="Quarterly report">
            <InlineEditComponent.Label>Kept on Enter alone</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
        </InlineEditComponent>
        <InlineEditComponent submitMode="blur" defaultValue="Quarterly report">
            <InlineEditComponent.Label>Kept on leaving alone</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
        </InlineEditComponent>
        <InlineEditComponent submitMode="none" defaultValue="Quarterly report">
            <InlineEditComponent.Label>Kept by the trigger alone</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.SubmitTrigger />
                <InlineEditComponent.CancelTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const submitCode = `<Stack gap="normal" align="start">
    <InlineEdit submitMode="enter" defaultValue="Quarterly report">
        <InlineEdit.Label>Kept on Enter alone</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
    </InlineEdit>
    <InlineEdit submitMode="blur" defaultValue="Quarterly report">
        <InlineEdit.Label>Kept on leaving alone</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
    </InlineEdit>
    <InlineEdit submitMode="none" defaultValue="Quarterly report">
        <InlineEdit.Label>Kept by the trigger alone</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.SubmitTrigger />
            <InlineEdit.CancelTrigger />
        </InlineEdit.Control>
    </InlineEdit>
</Stack>`;

// A value not yet written, with a prompt standing in the preview and a hint of what to type
// standing in the field once it is reached for
const placeholderPreview = (
    <Stack align="start">
        <InlineEditComponent placeholder={{ preview: "Add a title", edit: "Name the report" }}>
            <InlineEditComponent.Label>Title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
                <InlineEditComponent.SubmitTrigger />
                <InlineEditComponent.CancelTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const placeholderCode = `<InlineEdit placeholder={{ preview: "Add a title", edit: "Name the report" }}>
    <InlineEdit.Label>Title</InlineEdit.Label>
    <InlineEdit.Area>
        <InlineEdit.Input />
        <InlineEdit.Preview />
    </InlineEdit.Area>
    <InlineEdit.Control>
        <InlineEdit.EditTrigger />
        <InlineEdit.SubmitTrigger />
        <InlineEdit.CancelTrigger />
    </InlineEdit.Control>
</InlineEdit>`;

// A value that runs over more than one line, edited in a box of lines. It is opened with two
// presses, so a press made while reading a long value does not start an edit by accident, and a
// line under it says how the edit is kept, since Enter starts a new line in a box of lines
const textareaPreview = (
    <InlineEditComponent
        activationMode="dblclick"
        defaultValue="Revenue grew in every region, and costs held steady through the quarter."
        className={classes.field}
    >
        <InlineEditComponent.Label>Summary</InlineEditComponent.Label>
        <InlineEditComponent.Area>
            <InlineEditComponent.Input as="textarea" rows={3} />
            <InlineEditComponent.Preview />
        </InlineEditComponent.Area>
        <InlineEditComponent.Control>
            <InlineEditComponent.EditTrigger />
            <InlineEditComponent.SubmitTrigger />
            <InlineEditComponent.CancelTrigger />
        </InlineEditComponent.Control>
        <Text size="small">Press Command or Control and Enter to save</Text>
    </InlineEditComponent>
);

const textareaCode = `<InlineEdit
    activationMode="dblclick"
    defaultValue="Revenue grew in every region, and costs held steady through the quarter."
    className={field}
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
</InlineEdit>`;

// A field that takes the width of what it holds rather than a width of its own, so the value takes
// the same room being edited as it did being read, and the triggers beside it move only as far as
// the value does
const autoResizePreview = (
    <Stack align="start">
        <InlineEditComponent autoResize defaultValue="Quarterly report">
            <InlineEditComponent.Label>Title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
                <InlineEditComponent.SubmitTrigger />
                <InlineEditComponent.CancelTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const autoResizeCode = `<InlineEdit autoResize defaultValue="Quarterly report">
    <InlineEdit.Label>Title</InlineEdit.Label>
    <InlineEdit.Area>
        <InlineEdit.Input />
        <InlineEdit.Preview />
    </InlineEdit.Area>
    <InlineEdit.Control>
        <InlineEdit.EditTrigger />
        <InlineEdit.SubmitTrigger />
        <InlineEdit.CancelTrigger />
    </InlineEdit.Control>
</InlineEdit>`;

// The three sizes a field comes in. Each carries its edit trigger alone, which is enough to show
// the triggers being drawn to the height of the value they stand beside
const sizesPreview = (
    <Stack gap="normal" align="start">
        <InlineEditComponent size="small" defaultValue="Quarterly report">
            <InlineEditComponent.Label>Small</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
        <InlineEditComponent defaultValue="Quarterly report">
            <InlineEditComponent.Label>Medium</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
        <InlineEditComponent size="large" defaultValue="Quarterly report">
            <InlineEditComponent.Label>Large</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const sizesCode = `<Stack gap="normal" align="start">
    <InlineEdit size="small" defaultValue="Quarterly report">
        <InlineEdit.Label>Small</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
        </InlineEdit.Control>
    </InlineEdit>
    <InlineEdit defaultValue="Quarterly report">
        <InlineEdit.Label>Medium</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
        </InlineEdit.Control>
    </InlineEdit>
    <InlineEdit size="large" defaultValue="Quarterly report">
        <InlineEdit.Label>Large</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.EditTrigger />
        </InlineEdit.Control>
    </InlineEdit>
</Stack>`;

// An inline edit filling whatever holds it, which here is a column of the width one is read at.
// The column is part of what is being shown rather than the page's own furniture, since what the
// example is about is the room the inline edit takes, so it is written out with it
const blockPreview = (
    <div className={classes.field}>
        <InlineEditComponent block defaultValue="Quarterly report">
            <InlineEditComponent.Label>Title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
                <InlineEditComponent.SubmitTrigger />
                <InlineEditComponent.CancelTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </div>
);

const blockCode = `<div className={field}>
    <InlineEdit block defaultValue="Quarterly report">
        <InlineEdit.Label>Title</InlineEdit.Label>
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
</div>`;

// Triggers given words to carry, which name them without an icon having to stand in for the name.
// Each is drawn as an ordinary button once there is something in it, with its icon before the
// words
const labelledTriggersPreview = (
    <Stack align="start">
        <InlineEditComponent defaultValue="Quarterly report">
            <InlineEditComponent.Label>Title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger>Rename</InlineEditComponent.EditTrigger>
                <InlineEditComponent.SubmitTrigger>Save</InlineEditComponent.SubmitTrigger>
                <InlineEditComponent.CancelTrigger>Cancel</InlineEditComponent.CancelTrigger>
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const labelledTriggersCode = `<InlineEdit defaultValue="Quarterly report">
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
</InlineEdit>`;

// A value that says well enough on the page what it is, drawn at the largest size the way a title
// would be, with its name kept for a screen reader alone. The edit trigger is named outright, since
// "Edit" beside a value nobody named on the page says nothing about what would be edited
const hiddenLabelPreview = (
    <Stack align="start">
        <InlineEditComponent size="large" defaultValue="Quarterly report">
            <InlineEditComponent.Label visuallyHidden>Report title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger label="Rename the report" />
                <InlineEditComponent.SubmitTrigger />
                <InlineEditComponent.CancelTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const hiddenLabelCode = `<InlineEdit size="large" defaultValue="Quarterly report">
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
</InlineEdit>`;

// A value left where it stands. It carries its edit trigger all the same, since what is worth
// seeing is that there is nothing for it to start
const readOnlyPreview = (
    <Stack align="start">
        <InlineEditComponent readOnly defaultValue="Quarterly report">
            <InlineEditComponent.Label>Title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const readOnlyCode = `<InlineEdit readOnly defaultValue="Quarterly report">
    <InlineEdit.Label>Title</InlineEdit.Label>
    <InlineEdit.Area>
        <InlineEdit.Input />
        <InlineEdit.Preview />
    </InlineEdit.Area>
    <InlineEdit.Control>
        <InlineEdit.EditTrigger />
    </InlineEdit.Control>
</InlineEdit>`;

// A value that cannot be edited just now. It goes on showing what it holds, and the name, the value
// and the trigger are all drawn in the colour kept for what cannot be used
const disabledPreview = (
    <Stack align="start">
        <InlineEditComponent disabled defaultValue="Quarterly report">
            <InlineEditComponent.Label>Title</InlineEditComponent.Label>
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
    </Stack>
);

const disabledCode = `<InlineEdit disabled defaultValue="Quarterly report">
    <InlineEdit.Label>Title</InlineEdit.Label>
    <InlineEdit.Area>
        <InlineEdit.Input />
        <InlineEdit.Preview />
    </InlineEdit.Area>
    <InlineEdit.Control>
        <InlineEdit.EditTrigger />
    </InlineEdit.Control>
</InlineEdit>`;

// The value held by whoever is drawing the inline edit rather than by the inline edit. It is a
// component of its own rather than an element the page holds ready, since the value has to be kept
// somewhere for it to be handed back down.
//
// What the caller does with it is the reason for holding it at all, so it is put to use beside the
// inline edit rather than only stored: what was last kept is said under it, apart from every
// keystroke on the way there, and the button renames the value from outside
const ControlledPreview = () => {
    const [value, setValue] = React.useState("Quarterly report");
    const [kept, setKept] = React.useState("Quarterly report");

    return (
        <Stack gap="condensed" align="start">
            <InlineEditComponent value={value} onValueChange={setValue} onValueCommit={setKept}>
                <InlineEditComponent.Label>Title</InlineEditComponent.Label>
                <InlineEditComponent.Area>
                    <InlineEditComponent.Input />
                    <InlineEditComponent.Preview />
                </InlineEditComponent.Area>
                <InlineEditComponent.Control>
                    <InlineEditComponent.EditTrigger />
                    <InlineEditComponent.SubmitTrigger />
                    <InlineEditComponent.CancelTrigger />
                </InlineEditComponent.Control>
            </InlineEditComponent>
            <Text size="small">Last kept as {kept}</Text>
            <Button onClick={() => setValue("Annual report")}>Rename to Annual report</Button>
        </Stack>
    );
};

// The inline edit is told what it holds rather than keeping it, so the value is the caller's and
// is got ready here, along with what was last kept
const controlledSetup = `const [value, setValue] = React.useState("Quarterly report");
const [kept, setKept] = React.useState("Quarterly report");`;

const controlledCode = `<Stack gap="condensed" align="start">
    <InlineEdit value={value} onValueChange={setValue} onValueCommit={setKept}>
        <InlineEdit.Label>Title</InlineEdit.Label>
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
    <Text size="small">Last kept as {kept}</Text>
    <Button onClick={() => setValue("Annual report")}>Rename to Annual report</Button>
</Stack>`;

// The inline edit drawn from a hook the caller is holding, so that an edit can be started from
// somewhere else on the page as well as from the inline edit itself, and whatever else is drawn
// can read whether one is open. It is a component of its own, since the hook has to be called
// somewhere for what it hands back to be drawn from
const HookPreview = () => {
    const title = useInlineEdit({ defaultValue: "Quarterly report" });

    return (
        <Stack gap="condensed" align="start">
            <InlineEditComponent.RootProvider value={title}>
                <InlineEditComponent.Label>Title</InlineEditComponent.Label>
                <InlineEditComponent.Area>
                    <InlineEditComponent.Input />
                    <InlineEditComponent.Preview />
                </InlineEditComponent.Area>
                <InlineEditComponent.Control>
                    <InlineEditComponent.SubmitTrigger />
                    <InlineEditComponent.CancelTrigger />
                </InlineEditComponent.Control>
            </InlineEditComponent.RootProvider>
            <Text size="small">{title.editing ? "Being edited" : "Being read"}</Text>
            <Button disabled={title.editing} onClick={title.edit}>
                Rename
            </Button>
        </Stack>
    );
};

// What the hook hands back is what the parts are drawn from, so it is called here rather than
// inside the inline edit
const hookSetup = `const title = useInlineEdit({ defaultValue: "Quarterly report" });`;

const hookCode = `<Stack gap="condensed" align="start">
    <InlineEdit.RootProvider value={title}>
        <InlineEdit.Label>Title</InlineEdit.Label>
        <InlineEdit.Area>
            <InlineEdit.Input />
            <InlineEdit.Preview />
        </InlineEdit.Area>
        <InlineEdit.Control>
            <InlineEdit.SubmitTrigger />
            <InlineEdit.CancelTrigger />
        </InlineEdit.Control>
    </InlineEdit.RootProvider>
    <Text size="small">{title.editing ? "Being edited" : "Being read"}</Text>
    <Button disabled={title.editing} onClick={title.edit}>
        Rename
    </Button>
</Stack>`;

// The inline edit standing in a field, which names the value by its label, describes it by the
// caption and the validation message beneath it, and says for it that it is required. The inline
// edit is marked invalid itself, since the field says nothing about that: what the message says is
// for the reader, and what the value draws is for the same reader looking at the value
const formControlPreview = (
    <FormControl required>
        <FormControl.Label>Title</FormControl.Label>
        <InlineEditComponent invalid placeholder="Add a title">
            <InlineEditComponent.Area>
                <InlineEditComponent.Input />
                <InlineEditComponent.Preview />
            </InlineEditComponent.Area>
            <InlineEditComponent.Control>
                <InlineEditComponent.EditTrigger />
                <InlineEditComponent.SubmitTrigger />
                <InlineEditComponent.CancelTrigger />
            </InlineEditComponent.Control>
        </InlineEditComponent>
        <FormControl.Validation variant="error">Give the report a title</FormControl.Validation>
        <FormControl.Caption>Shown on the cover of the report</FormControl.Caption>
    </FormControl>
);

const formControlCode = `<FormControl required>
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
</FormControl>`;

// The inline edit as it is reached for, drawn and written out one above the other. The plainest
// one comes first, then how an edit is started and kept, then how the value and the field are
// drawn, then how the triggers and the name are said, then the states it can be left in, and last
// who is holding the value and what the inline edit stands in
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The inline edit written out in full: the name over the value, the value and the field it is edited in, and every trigger beside them. The value is read as text until it is reached for, and is then swapped for a field holding it. Enter keeps what was typed and Escape throws it away, and leaving the field keeps it too. Each trigger stands only while it has something to do, so all three are written out at once and the right ones are there at the right time.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Opened in other ways",
        description:
            "Arriving at the value is what opens it unless the inline edit is told otherwise: a press on it, two presses, or nothing on the value at all, which leaves the edit trigger as the one way in. Whichever way the pointer opens a value, a reader on the keyboard opens it with Enter or Space, since the value is a button to them either way; one that nothing on it opens is read as text instead, and left out of the tab order.",
        preview: activationPreview,
        code: activationCode,
    },
    {
        name: "Kept in other ways",
        description:
            "Enter and leaving the field both keep an edit unless the inline edit is told otherwise. Told to keep it on Enter alone, leaving the field throws the edit away; told to keep it on leaving alone, Enter is left to the page; and told to keep it on neither, only the submit trigger keeps it. Escape and the cancel trigger throw an edit away whatever the inline edit is told.",
        preview: submitPreview,
        code: submitCode,
    },
    {
        name: "A value not yet written",
        description:
            "What stands in for a value nobody has written, set back from a value so the two are told apart. One string stands in the preview and the field alike; given one each, the preview can ask to be pressed and the field can hint at what to type.",
        preview: placeholderPreview,
        code: placeholderCode,
    },
    {
        name: "A box of lines",
        description:
            "A value that runs over more than one line, edited in a textarea and read with its lines as they were typed. Enter starts a new line there rather than keeping the edit, so the edit is kept with Command or Control held instead. This one opens on two presses, so a press made while reading a long value does not start an edit by accident.",
        setup: fieldSetup,
        preview: textareaPreview,
        code: textareaCode,
    },
    {
        name: "Grown with the value",
        description:
            "A field that takes the width of what it holds rather than a width of its own, so the value takes the same room being edited as it did being read, and grows as it is typed into. The value stands out of sight behind the field while it is edited, and is what measures the room for both.",
        preview: autoResizePreview,
        code: autoResizeCode,
    },
    {
        name: "Sizes",
        description:
            "The three a field comes in. The value is drawn exactly as tall as the field at each of them, with the text standing where the field's will, and the triggers are drawn to match, so the one taking the other's place moves nothing on the page.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Filling whatever holds it",
        description:
            "An inline edit that takes the width of whatever holds it, for a form laid out in a column. The value takes whatever room the triggers beside it leave, and the field that takes its place is given the same room.",
        setup: fieldSetup,
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Words on the triggers",
        description:
            "Triggers given words to carry, which name them without an icon having to stand in for the name. Each is drawn as an ordinary button once there is something in it, with its icon standing before the words, and as an icon button named by its label when there is not.",
        preview: labelledTriggersPreview,
        code: labelledTriggersCode,
    },
    {
        name: "Without a name on the page",
        description:
            "A value that says well enough on the page what it is, a title say, with its name kept for a screen reader alone. The name still names the field and the value, so a reader who cannot see the page is told what they would be editing. The edit trigger is named outright, since a button called only Edit beside a value nobody named on the page says nothing about what it edits.",
        preview: hiddenLabelPreview,
        code: hiddenLabelCode,
    },
    {
        name: "Read only",
        description:
            "A value left where it stands, to be read but not edited. It is read as text rather than as a way into an edit, the edit trigger has nothing to start, and what it holds is still submitted with the form it stands in.",
        preview: readOnlyPreview,
        code: readOnlyCode,
    },
    {
        name: "Disabled",
        description:
            "A value that cannot be edited just now. It is still read as a button, one that cannot be pressed, and it is taken out of the tab order along with the edit trigger the way a disabled button is. What it holds is not submitted.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Where the caller keeps the value",
        description:
            "The value held by whoever is drawing the inline edit rather than by the inline edit, so that it follows the page as well as the reader. Every keystroke is reported as it is typed, and what was kept is reported apart from that as the edit ends, which is what a caller saving the value is waiting for. An edit thrown away hands the caller back the value it started from.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Started from somewhere else",
        description:
            "The inline edit drawn from the state the useInlineEdit hook hands back, through the root provider, so that an edit can be started, kept or thrown away from anywhere on the page as well as from the inline edit itself, and whatever else is drawn can read whether one is open. Here the edit is started by a button of the page's own in place of the edit trigger.",
        setup: hookSetup,
        preview: <HookPreview />,
        code: hookCode,
    },
    {
        name: "In a form control",
        description:
            "The inline edit standing in a field. The field inside it takes the field's id, so the field's own name points at it and names the value as well, and it is described by the caption and the validation message and is disabled or required as the field says, unless it was told otherwise itself.",
        preview: formControlPreview,
        code: formControlCode,
    },
];

// What opens the value as it is read, and what keeps an edit once it is open
const activationMode = '"focus" | "click" | "dblclick" | "none"';

const submitMode = '"both" | "enter" | "blur" | "none"';

// The three sizes a field comes in, which the value and the triggers are drawn to as well
const size = '"small" | "medium" | "large"';

// How much weight a trigger carries against the page. It is the button's own, since a trigger is a
// button underneath
const variant = '"default" | "primary" | "danger" | "invisible" | "link"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What each of the three triggers takes. They are the one button told three different things, so
// what they take is written once and each is handed the name, the mark and the weight that set it
// apart from the other two
const trigger = (label: string, icon: string, weight: string): ComponentProp[] => [
    {
        name: "label",
        type: "string",
        default: `"${label}"`,
        description:
            "What an icon-only trigger is called. A trigger given words takes its name from those, the way any other button does, and there is nothing left for this to do",
    },
    {
        name: "icon",
        type: "React.ElementType | React.ReactElement | null",
        default: icon,
        description:
            "The mark the trigger carries: on its own where it has no words, and before them where it has. Null leaves a trigger that has words to carry them alone",
    },
    {
        name: "variant",
        type: variant,
        default: `"${weight}"`,
        description: "How much weight the trigger carries against the page",
    },
    {
        name: "size",
        type: size,
        description:
            "How tall the trigger is drawn. It follows the inline edit it stands in unless it is told a size of its own, so it stands as tall as the value beside it",
    },
    styling,
];

// Every prop the inline edit and its parts take, under the part that takes it.
//
// The inline edit comes first, since the value, the edit and everything about how the two are
// drawn are settled there and the parts read them. Within it, what it holds and what it says as
// that changes come first, then whether it is being edited, then how an edit is started and kept,
// then how it is drawn, the states it can be left in, what is submitted, and last how it is named.
// The parts follow in the order they are written in, which is the order they are read in
const groups: ComponentPropGroup[] = [
    {
        name: "InlineEdit",
        props: [
            {
                name: "value",
                type: "string",
                description:
                    "The text the inline edit holds, where the caller keeps hold of it. It is told what it holds and reports every keystroke, and does not move on its own",
            },
            {
                name: "defaultValue",
                type: "string",
                default: '""',
                description:
                    "The text it starts out holding, where the inline edit keeps hold of it itself",
            },
            {
                name: "onValueChange",
                type: "(value: string) => void",
                description:
                    "Called with the text the inline edit holds whenever it changes: a keystroke at a time, and again as an edit that is thrown away takes the value back",
            },
            {
                name: "onValueCommit",
                type: "(value: string) => void",
                description:
                    "Called with the text that was kept, as an edit is kept. It is what a caller saving the value waits for, rather than every keystroke on the way there",
            },
            {
                name: "onValueRevert",
                type: "(value: string) => void",
                description:
                    "Called with the text the value was taken back to, as an edit is thrown away",
            },
            {
                name: "edit",
                type: "boolean",
                description:
                    "Whether the value is being edited, where the caller keeps hold of that. An edit is then only asked to start or to end, through onEditChange, and starts or ends once the caller says it does; one the caller ends without having been asked to is thrown away",
            },
            {
                name: "defaultEdit",
                type: "boolean",
                default: "false",
                description:
                    "Whether it starts out being edited, where the inline edit keeps hold of that itself. An edit that starts out open puts the reader in the field",
            },
            {
                name: "onEditChange",
                type: "(edit: boolean) => void",
                description:
                    "Called with whether the value is being edited, as an edit starts and as it ends",
            },
            {
                name: "activationMode",
                type: activationMode,
                default: '"focus"',
                description:
                    "What opens the value as it is read: arriving at it, a press on it, two presses, or nothing on it at all, which leaves the edit trigger and the hook as the ways in. Enter or Space on the value open it whichever of the first three it is",
            },
            {
                name: "submitMode",
                type: submitMode,
                default: '"both"',
                description:
                    "What keeps an edit: Enter, leaving the field, either of the two, or neither, in which case only the submit trigger does. Leaving the field throws away an edit it does not keep",
            },
            {
                name: "selectOnFocus",
                type: "boolean",
                default: "true",
                description:
                    "Selects what the field holds as an edit starts, so that what is typed replaces it",
            },
            {
                name: "placeholder",
                type: "string | { edit: string; preview: string }",
                description:
                    "What stands in for a value not yet written. One string stands in the value and the field alike; given one each, the two can say different things",
            },
            {
                name: "maxLength",
                type: "number",
                description:
                    "The most characters the value can hold. The field takes no character past it, and a value set from outside is cut to it",
            },
            {
                name: "autoResize",
                type: "boolean",
                default: "false",
                description:
                    "Grows the field with what it holds rather than giving it a width of its own, so that the value takes the same room being edited as it did being read",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the value and the field are drawn and what face they are set in. The two are drawn to the one height, and the triggers follow it unless they are told a size of their own",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever holds it, the value taking whatever room the triggers leave",
            },
            {
                name: "contrast",
                type: "boolean",
                default: "false",
                description:
                    "Recesses the field against what it stands on rather than raising it off, for a surface that is already raised",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the value being edited, and takes the value and the edit trigger out of the tab order. What it holds is not submitted. An inline edit standing in a disabled FormControl is disabled with it",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the value where it stands, read as text rather than as a way into an edit. What it holds is still submitted",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires a value before the owning form can be submitted. An inline edit standing in a required FormControl is required with it",
            },
            {
                name: "invalid",
                type: "boolean",
                default: "false",
                description:
                    "Marks the value as one that will not do, which is said to a screen reader and drawn on the value and the field alike",
            },
            {
                name: "name",
                type: "string",
                description:
                    "The name the value is submitted under. The field stays on the page out of sight while the value is read, so the value is submitted whether or not it is being edited",
            },
            {
                name: "form",
                type: "string",
                description:
                    "The id of the form the inline edit belongs to, where it does not stand inside it",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Names the inline edit, and with it the parts, which are named from it. One is made where the caller does not give one. An inline edit standing in a FormControl hands the field's id to its field instead, so the field's own name points at it",
            },
            {
                name: "ids",
                type: "InlineEditIds",
                description:
                    "A name for any one part in place of the one worked out for it, for something outside the inline edit that has to point at the part by name",
            },
            {
                name: "returnFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus once an edit ends, in place of the edit trigger or, where there is none, the value. A reader who ended the edit by going somewhere else is left where they went",
            },
            styling,
        ],
    },
    {
        name: "InlineEdit.RootProvider",
        props: [
            {
                name: "value",
                type: "UseInlineEditReturn",
                required: true,
                description:
                    "What useInlineEdit returned, which the parts are then drawn from. It takes the place of the props the inline edit would otherwise work the state out from, for a value that has to be edited, kept or thrown away from somewhere else on the page as well",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description: "How tall the value and the field are drawn",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description: "Fills the width of whatever holds it",
            },
            {
                name: "contrast",
                type: "boolean",
                default: "false",
                description: "Recesses the field against what it stands on",
            },
            styling,
        ],
    },
    {
        name: "InlineEdit.Label",
        props: [
            {
                name: "visuallyHidden",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the name in the accessibility tree while taking it off the screen, for a value that says well enough on the page what it is. It goes on naming the field and the value",
            },
            styling,
        ],
    },
    {
        name: "InlineEdit.Area",
        props: [styling],
    },
    {
        name: "InlineEdit.Input",
        props: [
            {
                name: "as",
                type: '"input" | "textarea"',
                default: '"input"',
                description:
                    "Draws the field as a box of lines, for a value that runs over more than one line. Enter starts a new line there, so the edit is kept with Command or Control held",
            },
            styling,
            {
                name: "...input props",
                type: 'React.ComponentPropsWithoutRef<"input">',
                description:
                    "It is the browser's own input underneath, drawn from the text input's classes, so it takes what one takes: type, autoComplete, rows where it is a box of lines, and the rest. What it holds is the inline edit's to say, so value and defaultValue are not taken",
            },
        ],
    },
    {
        name: "InlineEdit.Preview",
        props: [
            {
                name: "as",
                type: "React.ElementType",
                default: '"span"',
                description:
                    "The element or component the value is drawn as, in place of its default",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What is shown in place of the value, the value set out with a unit after it say. The value goes on being what is edited",
            },
            styling,
        ],
    },
    {
        name: "InlineEdit.Control",
        props: [styling],
    },
    {
        name: "InlineEdit.EditTrigger",
        props: trigger("Edit", "EditRegular", "invisible"),
    },
    {
        name: "InlineEdit.SubmitTrigger",
        props: trigger("Save", "CheckmarkRegular", "primary"),
    },
    {
        name: "InlineEdit.CancelTrigger",
        props: trigger("Cancel", "DismissRegular", "default"),
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the inline edit is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const InlineEdit = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                InlineEdit
            </Heading>
            <Text as="p" size="large">
                A value read where it stands and edited in the same place. It is shown as text until
                the reader reaches for it, then swapped for a field holding it, and swapped back
                once the edit is kept or thrown away: Enter keeps it, Escape throws it away, and
                leaving the field keeps it too unless it is told otherwise. The value and the field
                take the one place and are drawn to the one height, so the swap moves nothing else
                on the page. The field stays on the page out of sight while the value is read, so a
                value given a name is submitted with its form either way. A caller who wants to
                start or end an edit from somewhere else works from the same state through the
                useInlineEdit hook.
            </Text>
        </Stack>
        <ComponentExamples component="InlineEdit" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default InlineEdit;
