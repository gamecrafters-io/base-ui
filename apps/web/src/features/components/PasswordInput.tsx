import * as React from "react";
import { LockClosedRegular } from "@gamecrafters/base-ui-icons";
import {
    Button,
    FormControl,
    Heading,
    PasswordInput as PasswordInputComponent,
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
    // A field would be read across the whole of the card, so it is given a column about the width
    // one of these is actually filled in at
    field: "w-[20rem]",
    // What the caller is holding, said under the fields it is held for
    muted: "text-[var(--foreground-color-muted)]",
};

// What every example has to have in hand before it can be drawn. The width is written once and
// reached for by each of them, since what changes between the examples is the field rather than the
// room it stands in
const setup = `const field = "w-[20rem]";`;

const mutedSetup = `${setup}

const muted = "text-[var(--foreground-color-muted)]";`;

// The plainest field there is: one held back, and the toggle beside it. It is named outright, since
// a field standing on its own has nothing else to say what it is for, and it is told what the
// browser should offer to fill it with.
//
// The page and the component it is about are both called PasswordInput, so the component is brought
// in under a name saying which of the two it is. The listing beneath says PasswordInput, as an
// application importing it would
const defaultPreview = (
    <PasswordInputComponent
        className={classes.field}
        aria-label="Password"
        autoComplete="current-password"
    />
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<PasswordInput
    className={field}
    aria-label="Password"
    autoComplete="current-password"
/>`;

// A field that starts out readable, for a screen where a reader has already asked to be able to
// read it. What holds a password back is the type of the field rather than anything drawn over it,
// so showing one is the same field asked for plain text instead
const visiblePreview = (
    <PasswordInputComponent
        className={classes.field}
        aria-label="Password"
        defaultValue="correct horse battery"
        defaultVisible
    />
);

const visibleCode = `<PasswordInput
    className={field}
    aria-label="Password"
    defaultValue="correct horse battery"
    defaultVisible
/>`;

// The three sizes a field comes in, which the toggle is sized to match
const sizesPreview = (
    <Stack gap="normal">
        <PasswordInputComponent
            className={classes.field}
            aria-label="Small"
            size="small"
            defaultValue="hunter2"
        />
        <PasswordInputComponent
            className={classes.field}
            aria-label="Medium"
            defaultValue="hunter2"
        />
        <PasswordInputComponent
            className={classes.field}
            aria-label="Large"
            size="large"
            defaultValue="hunter2"
        />
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    <PasswordInput className={field} aria-label="Small" size="small" defaultValue="hunter2" />
    <PasswordInput className={field} aria-label="Medium" defaultValue="hunter2" />
    <PasswordInput className={field} aria-label="Large" size="large" defaultValue="hunter2" />
</Stack>`;

// A mark standing inside the field before the typing area, which it carries the way any other field
// carries a visual. The toggle keeps the other end, so the two never collide
const visualPreview = (
    <PasswordInputComponent
        className={classes.field}
        aria-label="Password"
        leadingVisual={LockClosedRegular}
        autoComplete="current-password"
    />
);

const visualCode = `<PasswordInput
    className={field}
    aria-label="Password"
    leadingVisual={LockClosedRegular}
    autoComplete="current-password"
/>`;

// Nothing beside the field, for a screen where what is typed should not be shown at all. What is
// taken away is the way to show it; the field holds its contents back exactly as before
const withoutTogglePreview = (
    <PasswordInputComponent
        className={classes.field}
        aria-label="Password"
        autoComplete="current-password"
        hideToggle
    />
);

const withoutToggleCode = `<PasswordInput
    className={field}
    aria-label="Password"
    autoComplete="current-password"
    hideToggle
/>`;

// The colour of the answer, drawn on the field the way it is on any other
const validationPreview = (
    <Stack gap="normal">
        <PasswordInputComponent
            className={classes.field}
            aria-label="Too short"
            defaultValue="abc"
            validationStatus="error"
        />
        <PasswordInputComponent
            className={classes.field}
            aria-label="Long enough"
            defaultValue="correct horse battery"
            validationStatus="success"
        />
    </Stack>
);

const validationCode = `<Stack gap="normal">
    <PasswordInput
        className={field}
        aria-label="Too short"
        defaultValue="abc"
        validationStatus="error"
    />
    <PasswordInput
        className={field}
        aria-label="Long enough"
        defaultValue="correct horse battery"
        validationStatus="success"
    />
</Stack>`;

// A field that cannot be used. The toggle closes along with it, since a way to show what has been
// typed into a field nobody can type into does nothing
const disabledPreview = (
    <PasswordInputComponent
        className={classes.field}
        aria-label="Password"
        defaultValue="hunter2"
        disabled
    />
);

const disabledCode = `<PasswordInput
    className={field}
    aria-label="Password"
    defaultValue="hunter2"
    disabled
/>`;

// Named by the field around it rather than by a label of its own, and told what the browser should
// offer to fill it with.
//
// A form control finds the input it is to wire up by recognising it, and the list of what it
// recognises does not hold this one, so the label, the field and the caption are pointed at one
// another by hand. It is the same shape a form control uses for any control of the caller's own
const formControlPreview = (
    <Stack gap="normal">
        <FormControl className={classes.field}>
            <FormControl.Label htmlFor="current-password">Current password</FormControl.Label>
            <PasswordInputComponent
                id="current-password"
                name="current"
                autoComplete="current-password"
            />
        </FormControl>
        <FormControl className={classes.field}>
            <FormControl.Label htmlFor="new-password">New password</FormControl.Label>
            <PasswordInputComponent
                id="new-password"
                name="new"
                autoComplete="new-password"
                aria-describedby="new-password-caption"
            />
            <FormControl.Caption id="new-password-caption">
                At least twelve characters
            </FormControl.Caption>
        </FormControl>
    </Stack>
);

const formControlCode = `<Stack gap="normal">
    <FormControl className={field}>
        <FormControl.Label htmlFor="current-password">Current password</FormControl.Label>
        <PasswordInput id="current-password" name="current" autoComplete="current-password" />
    </FormControl>
    <FormControl className={field}>
        <FormControl.Label htmlFor="new-password">New password</FormControl.Label>
        <PasswordInput
            id="new-password"
            name="new"
            autoComplete="new-password"
            aria-describedby="new-password-caption"
        />
        <FormControl.Caption id="new-password-caption">
            At least twelve characters
        </FormControl.Caption>
    </FormControl>
</Stack>`;

// Where the caller keeps hold of whether the password is shown. Both fields are held by the one
// answer, so a reader who asks to see one is shown both rather than having to ask twice.
//
// The state is the caller's, which makes this a component of its own rather than an element the
// page holds ready
const ControlledPreview = () => {
    const [visible, setVisible] = React.useState(false);

    return (
        <Stack gap="normal">
            <PasswordInputComponent
                className={classes.field}
                aria-label="Password"
                defaultValue="hunter2"
                visible={visible}
                onVisibilityChange={setVisible}
            />
            <PasswordInputComponent
                className={classes.field}
                aria-label="Confirm password"
                defaultValue="hunter2"
                visible={visible}
                onVisibilityChange={setVisible}
            />
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button onClick={() => setVisible((current) => !current)}>
                    {visible ? "Hide both" : "Show both"}
                </Button>
                <Text size="small" className={classes.muted}>
                    {visible ? "Shown" : "Hidden"}
                </Text>
            </Stack>
        </Stack>
    );
};

const controlledCode = `const [visible, setVisible] = React.useState(false);

<Stack gap="normal">
    <PasswordInput
        className={field}
        aria-label="Password"
        defaultValue="hunter2"
        visible={visible}
        onVisibilityChange={setVisible}
    />
    <PasswordInput
        className={field}
        aria-label="Confirm password"
        defaultValue="hunter2"
        visible={visible}
        onVisibilityChange={setVisible}
    />
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button onClick={() => setVisible((current) => !current)}>
            {visible ? "Hide both" : "Show both"}
        </Button>
        <Text size="small" className={muted}>
            {visible ? "Shown" : "Hidden"}
        </Text>
    </Stack>
</Stack>`;

// The field as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what showing the password comes to, then how the field is drawn, and last how it is
// named and who is holding the answer
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "One field held back, and the toggle beside it. The toggle is named for what pressing it would do next rather than for where the field stands, so a reader hears “Show password” and then “Hide password” as they press it — and it is deliberately not also marked as pressed, since a button that says what it will do and reports what it has done says the same thing twice. A press on it stays on it, rather than being taken into the field the way a press anywhere else in one is.",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Showing what has been typed",
        description:
            "What holds a password back is the type of the field rather than anything drawn over it, so showing one is the same field asked for plain text instead. What has been typed is kept either way, and a field can be asked to start out readable for a screen where the reader has already said they want to read it.",
        setup,
        preview: visiblePreview,
        code: visibleCode,
    },
    {
        name: "Sizes",
        description:
            "The three a field comes in, which the toggle is sized to match, since it is drawn as the field's own trailing action rather than as a button standing beside it.",
        setup,
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "A mark leading it",
        description:
            "Which the field carries the way any other field carries a visual. It stands inside the border before the typing area, and the toggle keeps the other end, so the two never collide.",
        setup,
        preview: visualPreview,
        code: visualCode,
    },
    {
        name: "Without the toggle",
        description:
            "For a screen where what is typed should not be shown at all — a shared machine, a field filled in front of someone else. What is taken away is the way to show it; the field holds its contents back exactly as before, and the browser's own reveal is taken away either way so the end of the field never holds two of the same thing.",
        setup,
        preview: withoutTogglePreview,
        code: withoutToggleCode,
    },
    {
        name: "Validation statuses",
        description:
            "The colour of the answer, drawn on the field the way it is on any other. The field is marked as invalid for a screen reader as well as drawn in the colour, so the two never say different things.",
        setup,
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Turned off",
        description:
            "A field that cannot be used. The toggle closes along with it, since a way to show what has been typed into a field nobody can type into does nothing.",
        setup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "On a form",
        description:
            "Named by the field around it rather than by a label of its own, and told what the browser should offer to fill it with — the current password for one being confirmed, a new one for one being set, which is what keeps a password manager from offering the wrong thing. A form control finds the input it is to wire up by recognising it, and the list of what it recognises does not hold this one, so the label, the field and the caption are pointed at one another by hand; left to itself the label would point at an id the field never receives.",
        setup,
        preview: formControlPreview,
        code: formControlCode,
    },
    {
        name: "Where the caller keeps hold of it",
        description:
            "The field shows what it is told rather than what was pressed, and reports the press either way. Both fields here are held by the one answer, so a reader who asks to see one is shown both rather than having to ask twice, and anything else on the screen can move them together.",
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

// Every prop the field adds to the one it is built on. Whether the password is shown comes first,
// since that is the whole of what this field adds, and the toggle that shows it follows.
//
// Everything else a text input takes is left to be written up where a text input is, rather than
// said a second time here where the two would fall out of step
const groups: ComponentPropGroup[] = [
    {
        name: "PasswordInput",
        props: [
            {
                name: "visible",
                type: "boolean",
                description:
                    "Whether what has been typed is being shown, where the caller keeps hold of that. A field held this way shows what it is told rather than what was pressed, so several of them can be moved together",
            },
            {
                name: "defaultVisible",
                type: "boolean",
                default: "false",
                description:
                    "Whether it starts out shown, where the field keeps hold of that itself",
            },
            {
                name: "onVisibilityChange",
                type: "(visible: boolean) => void",
                description:
                    "Called with what the press asked for, whether or not the caller is holding the answer",
            },
            {
                name: "hideToggle",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the field with no way to show what has been typed. What is taken away is the toggle alone; the field holds its contents back exactly as before",
            },
            {
                name: "showLabel",
                type: "string",
                default: '"Show password"',
                description:
                    "What the toggle is called while the password is held back. It carries an icon rather than words, so it has to be named for a screen reader, and it is named for what pressing it would do next rather than for where the field stands",
            },
            {
                name: "hideLabel",
                type: "string",
                default: '"Hide password"',
                description: "What it is called while the password is shown, for the same reason",
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
const PasswordInput = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                PasswordInput
            </Heading>
            <Text as="p" size="large">
                A field for a password, with a toggle beside it for showing what has been typed. It
                is a text input underneath, so it is sized and coloured and validated the way every
                other field on the page is, and everything that shapes a text input shapes this one
                too. What it takes over are the type, since that is what holds the password back,
                and the trailing action, since the toggle stands there. Showing a password is the
                same field asked for plain text rather than anything drawn over it, so what has been
                typed is kept as the two are swapped. The browser's own reveal is taken away, so the
                end of the field never holds two of the same thing.
            </Text>
        </Stack>
        <ComponentExamples component="PasswordInput" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default PasswordInput;
