import * as React from "react";
import {
    CalendarLtrRegular,
    CheckmarkRegular,
    DismissCircleRegular,
    SearchRegular,
} from "@gamecrafters/base-ui-icons";
import {
    FormControl,
    Heading,
    Stack,
    Text,
    TextInput as TextInputComponent,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A field told to fill what holds it has to be given something to fill, and across the whole of
    // the card it would run the width of the page. It is given a column instead
    preview: "w-[20rem]",
};

// The plainest field there is: nothing said with a prop, so it comes to the width the browser draws
// an input at and the medium of the three sizes.
//
// The words above it are a label pointed at the field rather than text set down over it, so the
// words answer the pointer as the field does and are read out with it.
//
// The stack is part of what is being shown rather than the page's own furniture, since a field
// standing without the words saying what it is for is not a field anybody could fill in. It is set
// against the start of the column, since the field is drawn to its own width and a stack left to
// itself would pull it out to the width of the card.
//
// The page and the component it is about are both called TextInput, so the component is brought in
// under a name saying which of the two it is. The listing beneath says TextInput, as an application
// importing it would
const defaultPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-name">
            Name
        </Text>
        <TextInputComponent id="default-name" placeholder="Ada Lovelace" />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="default-name">
        Name
    </Text>
    <TextInput id="default-name" placeholder="Ada Lovelace" />
</Stack>`;

// The three sizes a field comes in. They are drawn together rather than one to an example, since a
// size is read against the others rather than on its own, and each is named for the value it was
// given so what is read off the label is what drew it
const sizesPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="small-name">
                small
            </Text>
            <TextInputComponent id="small-name" size="small" placeholder="Ada Lovelace" />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="medium-name">
                medium
            </Text>
            <TextInputComponent id="medium-name" placeholder="Ada Lovelace" />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="large-name">
                large
            </Text>
            <TextInputComponent id="large-name" size="large" placeholder="Ada Lovelace" />
        </Stack>
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="small-name">
            small
        </Text>
        <TextInput id="small-name" size="small" placeholder="Ada Lovelace" />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="medium-name">
            medium
        </Text>
        <TextInput id="medium-name" placeholder="Ada Lovelace" />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="large-name">
            large
        </Text>
        <TextInput id="large-name" size="large" placeholder="Ada Lovelace" />
    </Stack>
</Stack>`;

// The field drawn to the width of whatever holds it rather than to the width the browser draws an
// input at. It is what a field standing in a form or in a column of its own is given, where one
// drawn to its own measure would be read as narrower than everything it stands under.
//
// The column it is given to fill is the page's own furniture: across the whole of the card the
// field would run the width of the page, which shows nothing a wide field does not. The stack is
// left to stretch rather than set against the start, since a field asked to fill what holds it has
// first to be let
const blockPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <Text as="label" htmlFor="block-name">
            Name
        </Text>
        <TextInputComponent id="block-name" block />
    </Stack>
);

const blockCode = `<Stack gap="condensed">
    <Text as="label" htmlFor="block-name">
        Name
    </Text>
    <TextInput id="block-name" block />
</Stack>`;

// The field recessed against what it stands on rather than raised off it. It is for a surface that
// is already raised, where a field drawn in the page's own colour would be lost in the card around
// it
const contrastPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="contrast-name">
            Name
        </Text>
        <TextInputComponent id="contrast-name" contrast />
    </Stack>
);

const contrastCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="contrast-name">
        Name
    </Text>
    <TextInput id="contrast-name" contrast />
</Stack>`;

// The field set in the monospaced stack, for something read a character at a time rather than as
// words: a token, a key, a hash. The value is one of those, since a field set in the face and left
// empty shows nothing the default does not
const monospacePreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="monospace-token">
            Token
        </Text>
        <TextInputComponent id="monospace-token" monospace defaultValue="a1b2c3d4e5f6" />
    </Stack>
);

const monospaceCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="monospace-token">
        Token
    </Text>
    <TextInput id="monospace-token" monospace defaultValue="a1b2c3d4e5f6" />
</Stack>`;

// What the field says about what it holds. The two are drawn together since what tells them apart
// is the colour each is drawn in, which is read against the other rather than on its own
const validationPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="error-name">
                Name
            </Text>
            <TextInputComponent id="error-name" validationStatus="error" defaultValue="mona lisa" />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="success-name">
                Name
            </Text>
            <TextInputComponent
                id="success-name"
                validationStatus="success"
                defaultValue="monalisa"
            />
        </Stack>
    </Stack>
);

const validationCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="error-name">
            Name
        </Text>
        <TextInput id="error-name" validationStatus="error" defaultValue="mona lisa" />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="success-name">
            Name
        </Text>
        <TextInput id="success-name" validationStatus="success" defaultValue="monalisa" />
    </Stack>
</Stack>`;

// A field that cannot be written in. It goes on showing what it holds, since words that cannot be
// changed are still worth reading
const disabledPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="disabled-name">
            Name
        </Text>
        <TextInputComponent id="disabled-name" disabled defaultValue="You cannot change this" />
    </Stack>
);

const disabledCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="disabled-name">
        Name
    </Text>
    <TextInput id="disabled-name" disabled defaultValue="You cannot change this" />
</Stack>`;

// What stands inside the field either side of the typing area. Each end is shown given a component
// to draw and given plain text, since those are the two things a visual is handed over as and what
// is worth seeing is that the field sets them the same way, and the last of them takes both ends at
// once.
//
// None of them is read out where it stands: a visual is pointed at from the field as a description
// instead, so a mark that carries no words of its own is passed over rather than read as one
const visualsPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="visual-search">
                Search
            </Text>
            <TextInputComponent id="visual-search" leadingVisual={SearchRegular} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="visual-amount">
                Amount
            </Text>
            <TextInputComponent id="visual-amount" leadingVisual="$" placeholder="0.00" />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="visual-duration">
                Duration
            </Text>
            <TextInputComponent id="visual-duration" trailingVisual="minutes" placeholder="20" />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="visual-when">
                When
            </Text>
            <TextInputComponent
                id="visual-when"
                leadingVisual={CalendarLtrRegular}
                trailingVisual={CheckmarkRegular}
            />
        </Stack>
    </Stack>
);

const visualsCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="visual-search">
            Search
        </Text>
        <TextInput id="visual-search" leadingVisual={SearchRegular} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="visual-amount">
            Amount
        </Text>
        <TextInput id="visual-amount" leadingVisual="$" placeholder="0.00" />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="visual-duration">
            Duration
        </Text>
        <TextInput id="visual-duration" trailingVisual="minutes" placeholder="20" />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="visual-when">
            When
        </Text>
        <TextInput
            id="visual-when"
            leadingVisual={CalendarLtrRegular}
            trailingVisual={CheckmarkRegular}
        />
    </Stack>
</Stack>`;

// The one part of the field that can be pressed, standing at the very end of it. It clears what has
// been typed, which is the thing an action inside a field is most often for, and it is only there
// while there is something to clear: a button that would do nothing is not drawn rather than drawn
// and refused.
//
// The state is the caller's, since the action has to be able to empty the field and the field has
// to be able to say whether the action belongs there at all, which makes this a component of its
// own rather than an element the page holds ready
const ActionPreview = () => {
    const [value, setValue] = React.useState("Ada Lovelace");

    return (
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="action-name">
                Name
            </Text>
            <TextInputComponent
                id="action-name"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                trailingAction={
                    value ? (
                        <TextInputComponent.Action
                            icon={DismissCircleRegular}
                            aria-label="Clear the field"
                            onClick={() => setValue("")}
                        />
                    ) : null
                }
            />
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. The field is told what it holds
// rather than keeping it, so the state is the caller's and is got ready here
const actionSetup = `const [value, setValue] = React.useState("Ada Lovelace");`;

const actionCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="action-name">
        Name
    </Text>
    <TextInput
        id="action-name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        trailingAction={
            value ? (
                <TextInput.Action
                    icon={DismissCircleRegular}
                    aria-label="Clear the field"
                    onClick={() => setValue("")}
                />
            ) : null
        }
    />
</Stack>`;

// Where the spinner stands while the field is waiting. The three shown are the three that differ:
// left to itself it stands after the typing area, it takes the place of a leading visual where
// there is one, and it can be held to the trailing end so that the visual keeps its own place.
//
// Each is named for what it was given, so what is read off the label is what drew it
const loadingPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="loading-auto">
                auto
            </Text>
            <TextInputComponent id="loading-auto" loading />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="loading-visual">
                auto, with a mark leading it
            </Text>
            <TextInputComponent id="loading-visual" leadingVisual={SearchRegular} loading />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="loading-trailing">
                trailing, with a mark leading it
            </Text>
            <TextInputComponent
                id="loading-trailing"
                leadingVisual={SearchRegular}
                loading
                loaderPosition="trailing"
            />
        </Stack>
    </Stack>
);

const loadingCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="loading-auto">
            auto
        </Text>
        <TextInput id="loading-auto" loading />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="loading-visual">
            auto, with a mark leading it
        </Text>
        <TextInput id="loading-visual" leadingVisual={SearchRegular} loading />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="loading-trailing">
            trailing, with a mark leading it
        </Text>
        <TextInput
            id="loading-trailing"
            leadingVisual={SearchRegular}
            loading
            loaderPosition="trailing"
        />
    </Stack>
</Stack>`;

// How much room is left, counted down under the field. The second one is already past its limit,
// which is the state the counter is worth showing in: it turns and takes a mark, and the field
// marks itself invalid the way an error status would.
//
// The count is only ever shown, never read out where it stands. What a screen reader is told is the
// limit as the field is reached, and then the count again once the reader stops typing, so it is
// not read a character at a time as the words are being written
const limitPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="limit-username">
                Username
            </Text>
            <TextInputComponent id="limit-username" characterLimit={20} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="over-username">
                Username
            </Text>
            <TextInputComponent
                id="over-username"
                characterLimit={10}
                defaultValue="This is rather longer than the limit allows"
            />
        </Stack>
    </Stack>
);

const limitCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="limit-username">
            Username
        </Text>
        <TextInput id="limit-username" characterLimit={20} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="over-username">
            Username
        </Text>
        <TextInput
            id="over-username"
            characterLimit={10}
            defaultValue="This is rather longer than the limit allows"
        />
    </Stack>
</Stack>`;

// Named by the field around it rather than by a label of its own. The input is handed to the form
// control rather than named to it: the control finds the one it knows how to wire up and gives it
// its own id, so the name points at it and the caption is read out with it without any of that
// being written twice.
//
// The column is the page's own furniture, since the caption would otherwise run the width of the
// card
const formControlPreview = (
    <FormControl className={classes.preview}>
        <FormControl.Label>Username</FormControl.Label>
        <TextInputComponent />
        <FormControl.Caption>The name people will know you by</FormControl.Caption>
    </FormControl>
);

const formControlCode = `<FormControl>
    <FormControl.Label>Username</FormControl.Label>
    <TextInput />
    <FormControl.Caption>The name people will know you by</FormControl.Caption>
</FormControl>`;

// The field as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then how the field is drawn against the page, then what it says about what it holds, then
// what stands inside it, and last how it is named
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "The three a field comes in. The size settles the height of the field and the face it is set in, and everything the field holds is sized from it — a visual, the spinner, and the action at the end — so a small field never carries a control drawn for a large one.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Block",
        description:
            "Whether the field is drawn to the width the browser gives an input or to the width of whatever holds it. It is what a field standing in a form or in a column of its own is given, where one drawn to its own measure would be read as narrower than everything it stands under. The column around it here is the page's own, since across the whole of the card a block field shows nothing a wide one does not.",
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Contrast",
        description:
            "The field recessed against what it stands on rather than raised off it. It is for a surface that is already raised — a card, a dialog, a panel — where a field drawn in the page's own colour would be lost in what surrounds it.",
        preview: contrastPreview,
        code: contrastCode,
    },
    {
        name: "Monospace",
        description:
            "The field set in the monospaced stack, for something read a character at a time rather than as words: a token, a key, a hash. It changes only the face the field is set in, so a value that is read as words is left in the face the rest of the page is set in.",
        preview: monospacePreview,
        code: monospaceCode,
    },
    {
        name: "Validation status",
        description:
            "What the field says about what it holds. Error colours the border, carries that colour into the focus ring, and marks the control invalid, so it is said to a screen reader as well as shown; success only colours it, since there is nothing wrong to report. Neither carries the message itself, which is for the form around it to give.",
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Disabled",
        description:
            "A field that cannot be written in. It goes on showing what it holds, since words that cannot be changed are still worth reading. The field is taken out of the tab order and what it holds is not submitted, so it is for a field that is not available just now rather than one that is only to be read. A field that is both disabled and invalid still reads as invalid.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Visuals",
        description:
            "What stands inside the field, before the typing area or after it. Each is handed over either as the component to draw, so the field settles its size and colour, or as something already built — an element, or plain text such as a unit or a currency sign. A visual is pointed at from the field as a description rather than read out where it stands, so a mark carrying no words of its own is passed over instead of being read as one.",
        preview: visualsPreview,
        code: visualsCode,
    },
    {
        name: "A trailing action",
        description:
            "The one part of the field that can be pressed, standing at the very end of it. It carries an icon rather than words, so it is named for a screen reader, and it is sized by the field it stands in. Reaching for it does not light the whole field up: the focus ring follows the typing area alone, so the field never reads as being written in when it is the button that was reached. It is only drawn while there is something to clear, since a button that would do nothing is better not drawn than drawn and refused.",
        setup: actionSetup,
        preview: <ActionPreview />,
        code: actionCode,
    },
    {
        name: "While it waits",
        description:
            "Where the spinner stands. Left to itself it stands after the typing area, and takes the place of a leading visual where there is one, so the field never carries a mark and a spinner side by side; it can be held to either end instead. Room is kept for it as soon as the field is told it can wait at all, so nothing shifts as the wait starts and ends, and what a screen reader is told while it waits is given in words rather than left to the spinner.",
        preview: loadingPreview,
        code: loadingCode,
    },
    {
        name: "Character limit",
        description:
            "How much room is left, counted down under the field. The second one is already past its limit, which is the state the counter is worth showing in: it turns, takes a mark, and the field marks itself invalid the way an error status would. The limit is not enforced — the reader is told rather than stopped, so a word half typed is never cut off.",
        preview: limitPreview,
        code: limitCode,
    },
    {
        name: "On a form",
        description:
            "Named by the field around it rather than by a label of its own. The input is handed to the form control rather than named to it: the control recognises it, gives it an id of its own, and points the label and the caption at it, so none of that has to be written twice.",
        preview: formControlPreview,
        code: formControlCode,
    },
];

// A visual is handed over as the component to draw, or as something already built: an element, or
// plain text such as a unit or a currency sign
const visual = "React.ElementType | React.ReactNode";

// What the icon an action carries is handed over as. There is no plain text among them, as there is
// wherever a visual stands beside the typing area, since an action is only ever a mark
const icon = "React.ElementType | React.ReactElement";

// The three sizes a field comes in
const size = '"small" | "medium" | "large"';

// What the field says about what it holds
const validationStatus = '"error" | "success"';

// Where the spinner stands while the field waits
const loaderPosition = '"auto" | "leading" | "trailing"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the field takes, and then the action it is the only pressable part of.
//
// How the field is drawn against the page comes first, then what stands inside it, then what it
// says about what it holds, and last what it is underneath
const groups: ComponentPropGroup[] = [
    {
        name: "TextInput",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How tall the field is drawn and what face it is set in. Everything the field holds is sized from it, so a visual, the spinner and the action at the end are all drawn to match",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever holds it, in place of being drawn to the width the browser gives an input",
            },
            {
                name: "contrast",
                type: "boolean",
                default: "false",
                description:
                    "Recesses the field against what it stands on rather than raising it off. It is for a surface that is already raised, where a field drawn in the page's own colour would be lost in what surrounds it",
            },
            {
                name: "monospace",
                type: "boolean",
                default: "false",
                description:
                    "Sets what is typed in the monospaced stack, for a value read a character at a time rather than as words",
            },
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "Stands inside the field, before the typing area. It is handed over as the component to draw, so the field settles its size and colour, or as something already built — an element, or plain text such as a unit or a currency sign. It is pointed at from the field as a description rather than read out where it stands",
            },
            {
                name: "trailingVisual",
                type: visual,
                description: "The same, standing inside the field after the typing area",
            },
            {
                name: "trailingAction",
                type: "React.ReactNode",
                description:
                    "Stands inside the field at the very end, and is the only part of it that can be pressed. Built with TextInput.Action, which is sized by the field it stands in. With one in the field the focus ring follows the typing area alone, so reaching for the action does not light the whole field up",
            },
            {
                name: "loading",
                type: "boolean",
                description:
                    "Whether the field is waiting. Room for the spinner is kept as soon as this is given either way, so a field that is told it can wait does not shift as the wait starts and ends",
            },
            {
                name: "loaderPosition",
                type: loaderPosition,
                default: '"auto"',
                description:
                    "Where the spinner stands. Auto puts it after the typing area, unless there is a leading visual for it to take the place of; the other two hold it to one end whatever else the field carries",
            },
            {
                name: "loaderText",
                type: "string",
                default: '"Loading"',
                description:
                    "What a screen reader is told while the field is waiting. A spinner is drawn rather than said, so the wait is given in words as well and read out with the field",
            },
            {
                name: "characterLimit",
                type: "number",
                description:
                    "Shows a counter under the field, counting down to this and then up past it. Passing it is reported rather than prevented: the counter turns and the field marks itself invalid, but nothing is cut off. The count is shown rather than read out where it stands — a screen reader is told the limit as the field is reached, and the count again once the reader stops typing",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the field says about what it holds. Error colours the border, carries that colour into the focus ring and marks the control invalid, so it is said to a screen reader as well as shown; success only colours it. A limit that has been passed reports an error of its own, whatever this says",
            },
            {
                name: "type",
                type: "string",
                default: '"text"',
                description:
                    "What the browser draws and accepts in the typing area — a search, an email address, a date. A field the browser focuses segment by segment is left to it, so a click that landed on one of those segments stays where it was aimed",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires the field before the form can be submitted, and says so to a screen reader as well as to the form",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the field being written in and takes it out of the tab order, and what it holds is not submitted. It goes on showing what it holds",
            },
            {
                name: "className",
                type: "string",
                description:
                    "Class name for custom styling. It lands on the frame around the control rather than on the control itself, since the frame is what carries the border, the ground and the focus ring",
            },
            {
                name: "...input props",
                type: 'Omit<React.ComponentPropsWithoutRef<"input">, "size">',
                description:
                    "It is the browser's own input underneath, so it takes what one takes: value and defaultValue, onChange, placeholder, name, autoComplete, readOnly, and the rest. Size is the library's own here, since the attribute of that name counts characters rather than stepping through the control scale",
            },
        ],
    },
    {
        name: "TextInput.Action",
        props: [
            {
                name: "icon",
                type: icon,
                required: true,
                description:
                    "The mark drawn in place of a label. It is handed over as the icon itself rather than as an element built from it, so the action draws it at the size the field is drawn at",
            },
            {
                name: "aria-label",
                type: "string",
                required: true,
                description:
                    "What the action is called. It carries an icon rather than words, so it has to be named for a screen reader; aria-labelledby stands in place of it where the words it should be called by are already on the page",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the action being pressed and takes it out of the tab order. The field around it goes on being written in",
            },
            styling,
            {
                name: "...button props",
                type: 'React.ComponentPropsWithoutRef<"button">',
                description:
                    "It is a button underneath, so it takes what one takes: onClick, name, form, and the rest. It is given the type of one that submits nothing, so an action inside a field on a form clears it rather than sending it",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the field is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const TextInput = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                TextInput
            </Heading>
            <Text as="p" size="large">
                Somewhere to write a line. It is the browser&apos;s own input underneath, with a
                frame drawn around it: the frame carries the border, the ground and the focus ring,
                which lets the control itself go transparent and lets a mark, a spinner or a button
                stand within the border rather than beside it. The whole of the frame answers a
                click, so the padding either side of the typing area puts the reader where they were
                aiming. It is the field the rest of the library&apos;s fields are built on, so what
                is said here about sizes, colours and validation is true of them as well.
            </Text>
        </Stack>
        <ComponentExamples component="TextInput" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default TextInput;
