import * as React from "react";
import { MentionRegular } from "@gamecrafters/base-ui-icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection, $isRangeSelection } from "lexical";
import {
    Heading,
    IconButton,
    RichTextEditor as RichTextEditorComponent,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample, ComponentExternalPackage } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";
import type { EditorState } from "lexical";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // An editor fills whatever holds it, and across the whole of the card it would run the width
    // of the page. It is given a column instead
    box: "w-[var(--overlay-width-medium)]",
};

// The one name on this page that is neither the library's nor Lexical's own writing helpers. A
// control of the caller's own reaches the editor through the context Lexical puts it in, and the
// hook that reads it is that package's rather than the library's, so which of the two a listing
// means is said outright rather than left to be told apart by the look of it
const lexicalReact: ComponentExternalPackage = {
    name: "@lexical/react/LexicalComposerContext",
    exports: ["useLexicalComposerContext"],
};

// A page of writing to open an editor on, as the JSON a state was written out as. It is what
// comes back from JSON.stringify on the state the editor reports, so an editor opened on this is
// an editor opened on what was last saved — which is what a caller storing writing has in hand.
//
// It runs to one long line because that is what a saved state is: a run of nodes rather than
// markup, read back in by Lexical rather than by anything on the page
const savedNotes =
    '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Release notes","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This release is mostly housekeeping. ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Nothing here changes an API.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Faster first paint","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fewer bytes shipped","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"A quieter console","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The best release is the one nobody notices.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"quote","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

// What the examples opening on a page of writing have in hand before they can be drawn. It is
// written once and reached for by each of them, since what changes between them is what the editor
// is told rather than what it opens on
const savedSetup = `// What was last saved, which is what JSON.stringify writes a reported state out as
const savedNotes = '{"root":{"children":[ ... ],"type":"root","version":1}}';`;

// The plainest editor there is: the buttons over the writing area, and nothing written in it yet.
// The parts are named by the caller rather than drawn by the editor, so a toolbar can sit under
// the writing as readily as over it and a caller with buttons of their own has somewhere to put
// them.
//
// The editor is named outright, since a box of writing says nothing on its own about what is being
// written in it.
//
// The column around it is the page's own furniture: an editor fills whatever holds it, and across
// the whole of the card it would run the width of the page. The listing beneath is of the editor
// alone.
//
// The page and the component it is about are both called RichTextEditor, so the component is
// brought in under a name saying which of the two it is. The listing beneath says RichTextEditor,
// as an application importing it would
const defaultPreview = (
    <Stack className={classes.box}>
        <RichTextEditorComponent
            aria-label="Description"
            placeholder="Write a description"
            minHeight={160}
        >
            <RichTextEditorComponent.Toolbar />
            <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<RichTextEditor aria-label="Description" placeholder="Write a description" minHeight={160}>
    <RichTextEditor.Toolbar />
    <RichTextEditor.Content />
</RichTextEditor>`;

// An editor opened on a page of writing. Lexical reads the starting state once, when the editor is
// built, so nothing said here can be taken back later: what the editor holds from then on is its
// own
const seededPreview = (
    <Stack className={classes.box}>
        <RichTextEditorComponent
            aria-label="Release notes"
            defaultValue={savedNotes}
            minHeight={220}
        >
            <RichTextEditorComponent.Toolbar />
            <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
    </Stack>
);

const seededCode = `<RichTextEditor aria-label="Release notes" defaultValue={savedNotes} minHeight={220}>
    <RichTextEditor.Toolbar />
    <RichTextEditor.Content />
</RichTextEditor>`;

// Only some of the runs of controls, for a field where a heading or a quote would be more than the
// writing calls for. What is taken away is the buttons alone: the keystrokes go on being answered,
// since every editor understands the same ones whatever its toolbar shows
const controlsPreview = (
    <Stack className={classes.box}>
        <RichTextEditorComponent aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
            <RichTextEditorComponent.Toolbar controls={["inline", "list", "link"]} />
            <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
    </Stack>
);

const controlsCode = `<RichTextEditor aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
    <RichTextEditor.Toolbar controls={["inline", "list", "link"]} />
    <RichTextEditor.Content />
</RichTextEditor>`;

// The toolbar written under the writing rather than over it, which is what naming the parts is for
const toolbarBelowPreview = (
    <Stack className={classes.box}>
        <RichTextEditorComponent aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
            <RichTextEditorComponent.Content />
            <RichTextEditorComponent.Toolbar controls={["inline", "link"]} />
        </RichTextEditorComponent>
    </Stack>
);

const toolbarBelowCode = `<RichTextEditor aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
    <RichTextEditor.Content />
    <RichTextEditor.Toolbar controls={["inline", "link"]} />
</RichTextEditor>`;

// The writing area held between two heights: it opens at the first and grows with what is written
// until it reaches the second, and what is written past that is scrolled through rather than
// pushing the page down
const heightPreview = (
    <Stack className={classes.box}>
        <RichTextEditorComponent
            aria-label="Release notes"
            defaultValue={savedNotes}
            minHeight={120}
            maxHeight={200}
        >
            <RichTextEditorComponent.Toolbar />
            <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
    </Stack>
);

const heightCode = `<RichTextEditor
    aria-label="Release notes"
    defaultValue={savedNotes}
    minHeight={120}
    maxHeight={200}
>
    <RichTextEditor.Toolbar />
    <RichTextEditor.Content />
</RichTextEditor>`;

// What was written left to be read and copied but not changed. The toolbar is kept here so its
// controls can be seen to be out of use, though an editor that will never be written in is better
// off without one
const readOnlyPreview = (
    <Stack className={classes.box}>
        <RichTextEditorComponent readOnly aria-label="Release notes" defaultValue={savedNotes}>
            <RichTextEditorComponent.Toolbar />
            <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
    </Stack>
);

const readOnlyCode = `<RichTextEditor readOnly aria-label="Release notes" defaultValue={savedNotes}>
    <RichTextEditor.Toolbar />
    <RichTextEditor.Content />
</RichTextEditor>`;

// The editor named and described by words already on the page. Both are pointed at by id, and both
// land on the writing area rather than on the box around it, since that is the part that takes the
// focus and is read out when it does
const captionPreview = (
    <Stack gap="condensed" className={classes.box}>
        <Stack gap="tight">
            <Text id="notes-label" weight="semibold">
                Release notes
            </Text>
            <Text id="notes-caption" size="small">
                Markdown is not read here; use the toolbar above the field
            </Text>
        </Stack>
        <RichTextEditorComponent
            aria-labelledby="notes-label"
            aria-describedby="notes-caption"
            placeholder="Write the notes"
            minHeight={140}
        >
            <RichTextEditorComponent.Toolbar />
            <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
    </Stack>
);

const captionCode = `<Stack gap="condensed">
    <Stack gap="tight">
        <Text id="notes-label" weight="semibold">
            Release notes
        </Text>
        <Text id="notes-caption" size="small">
            Markdown is not read here; use the toolbar above the field
        </Text>
    </Stack>
    <RichTextEditor
        aria-labelledby="notes-label"
        aria-describedby="notes-caption"
        placeholder="Write the notes"
        minHeight={140}
    >
        <RichTextEditor.Toolbar />
        <RichTextEditor.Content />
    </RichTextEditor>
</Stack>`;

// Reading what has been written, which comes back as the state the editor moved to rather than as
// markup. What is made of it — stored as JSON, counted, sent somewhere — is the caller's.
//
// The state is read within a read of the editor's own, since what is written is Lexical's to hand
// out rather than something standing on the page to be measured
const WordCountPreview = () => {
    const [words, setWords] = React.useState(0);

    const countWords = (editorState: EditorState) => {
        editorState.read(() => {
            const written = $getRoot().getTextContent().trim();

            setWords(written === "" ? 0 : written.split(/\s+/).length);
        });
    };

    return (
        <Stack gap="condensed" className={classes.box}>
            <RichTextEditorComponent
                aria-label="Description"
                placeholder="Write a description"
                minHeight={140}
                onChange={countWords}
            >
                <RichTextEditorComponent.Toolbar controls={["inline", "list"]} />
                <RichTextEditorComponent.Content />
            </RichTextEditorComponent>
            <Text size="small">
                {words} {words === 1 ? "word" : "words"}
            </Text>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. What is written is the editor's, so
// the count is worked out from the state it reports rather than kept alongside it
const wordCountSetup = `const [words, setWords] = React.useState(0);

const countWords = (editorState) => {
    editorState.read(() => {
        const written = $getRoot().getTextContent().trim();

        setWords(written === "" ? 0 : written.split(/\\s+/).length);
    });
};`;

const wordCountCode = `<Stack gap="condensed">
    <RichTextEditor
        aria-label="Description"
        placeholder="Write a description"
        minHeight={140}
        onChange={countWords}
    >
        <RichTextEditor.Toolbar controls={["inline", "list"]} />
        <RichTextEditor.Content />
    </RichTextEditor>
    <Text size="small">
        {words} {words === 1 ? "word" : "words"}
    </Text>
</Stack>`;

// A control of the caller's own. It reaches the editor the same way the toolbar's own controls do,
// through the context Lexical puts it in, so nothing has to be threaded down to it
const MentionButton = () => {
    const [editor] = useLexicalComposerContext();

    return (
        <IconButton
            icon={MentionRegular}
            size="small"
            variant="invisible"
            aria-label="Mention someone"
            onClick={() =>
                editor.update(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        selection.insertText("@");
                    }
                })
            }
        />
    );
};

const mentionPreview = (
    <Stack className={classes.box}>
        <RichTextEditorComponent aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
            <RichTextEditorComponent.Toolbar controls={["inline"]}>
                <MentionButton />
            </RichTextEditorComponent.Toolbar>
            <RichTextEditorComponent.Content />
        </RichTextEditorComponent>
    </Stack>
);

// The button itself, which is what the example is really about: it is written outside the editor
// and finds it through the context Lexical put it in
const mentionSetup = `const MentionButton = () => {
    const [editor] = useLexicalComposerContext();

    return (
        <IconButton
            icon={MentionRegular}
            size="small"
            variant="invisible"
            aria-label="Mention someone"
            onClick={() =>
                editor.update(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        selection.insertText("@");
                    }
                })
            }
        />
    );
};`;

const mentionCode = `<RichTextEditor aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
    <RichTextEditor.Toolbar controls={["inline"]}>
        <MentionButton />
    </RichTextEditor.Toolbar>
    <RichTextEditor.Content />
</RichTextEditor>`;

// The editor as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what it can be opened on, then what the toolbar shows and where it stands, then
// how tall the writing area is let grow, and last how the editor is named, read back out and added
// to
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "The buttons over the writing area, and nothing written in it yet. The parts are named by the caller rather than drawn by the editor, which is what lets the toolbar stand under the writing as readily as over it. What each button says about itself is read back out of the writing the cursor sits in rather than kept by the toolbar, so it tells the truth however the writing was reached — by a button, by a keystroke, or by moving the cursor into something already written that way. The toolbar is one stop on the way round the page, so the arrow keys move between the buttons within it.",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "With writing already in it",
        description:
            "Laid in once, when the editor is built. Lexical reads the starting state at that moment and keeps it from there, so nothing said here can be taken back later: an editor told again on every render what it should hold would lose the cursor with every keystroke. What it holds from then on is its own, and onChange is how it is read back out. The $-prefixed helpers are Lexical's own, and are what a starting state is written with — a state saved as JSON can be handed over in its place.",
        setup: savedSetup,
        preview: seededPreview,
        code: seededCode,
    },
    {
        name: "Only some of the controls",
        description:
            "For a field where a heading or a quote would be more than the writing calls for. The runs are drawn in the order they are named, with a divider between one and the next. What is taken away is the buttons alone: the keystrokes go on being answered, since every editor understands the same ones whatever its toolbar shows.",
        preview: controlsPreview,
        code: controlsCode,
    },
    {
        name: "The toolbar underneath",
        description:
            "Which is what naming the parts is for. The editor draws neither of them itself, so where they stand is settled by the order they are written in rather than by a prop saying so.",
        preview: toolbarBelowPreview,
        code: toolbarBelowCode,
    },
    {
        name: "Held to a height",
        description:
            "The writing area opens at the first height and grows with what is written until it reaches the second; what is written past that is scrolled through rather than pushing the page down. The heights are set on the box the writing sits in rather than on the writing itself, so the toolbar keeps its place at the edge of the field while the writing moves under it.",
        setup: savedSetup,
        preview: heightPreview,
        code: heightCode,
    },
    {
        name: "A reading",
        description:
            "What was written left to be read and copied but not changed. It is the one state Lexical keeps, so there is no second greyed-out one beside it: the field is drawn back against the page and its controls go out of use together. The toolbar is kept here so that can be seen, though an editor that will never be written in is better off without one.",
        setup: savedSetup,
        preview: readOnlyPreview,
        code: readOnlyCode,
    },
    {
        name: "With a caption",
        description:
            "The editor named and described by words already on the page. Both land on the writing area rather than on the box around it, since that is the part that takes the focus and is read out when it does — so a field and its caption are written once and heard on the thing the reader is actually in.",
        preview: captionPreview,
        code: captionCode,
    },
    {
        name: "Reading what has been written",
        description:
            "Reported as the state the editor moved to rather than as markup. What is made of it — stored as JSON, counted, sent somewhere — is the caller's. The state is read within a read of the editor's own, since what is written is Lexical's to hand out rather than something standing on the page to be measured.",
        setup: wordCountSetup,
        preview: <WordCountPreview />,
        code: wordCountCode,
    },
    {
        name: "A control of the caller's own",
        description:
            "Drawn after the ones the toolbar comes with. It reaches the editor the same way the toolbar's own controls do, through the context Lexical puts it in, so nothing has to be threaded down to it — a button written anywhere inside the editor can give it any command Lexical understands.",
        setup: mentionSetup,
        preview: mentionPreview,
        code: mentionCode,
    },
];

// Which runs of controls the toolbar draws, with a divider between one run and the next
const control = '"history" | "inline" | "block" | "list" | "link"';

// What an editor can be opened on: the JSON a state was written out as, a state itself, or a
// function that lays the writing in
const initialValue = "InitialEditorStateType";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the editor takes, and then the two parts it is drawn from.
//
// What it opens on comes first, then how what is written is read back out, then what is shown in
// its place and whether it can be written in at all, and last how tall it stands
const groups: ComponentPropGroup[] = [
    {
        name: "RichTextEditor",
        props: [
            {
                name: "defaultValue",
                type: initialValue,
                description:
                    "What the editor holds to begin with: the JSON a state was written out as, a state itself, or a function that lays the writing in. Lexical reads it once, when the editor is built, so this is not an editor whose contents the caller holds — one told what to hold on every render would lose the cursor on every keystroke",
            },
            {
                name: "onChange",
                type: "(editorState: EditorState, editor: LexicalEditor) => void",
                description:
                    "Called with the state the editor has moved to, and with the editor it moved in. What is written comes back as a state rather than as markup, so what is made of it is the caller's",
            },
            {
                name: "placeholder",
                type: "string",
                description:
                    "What is shown in the editor's place while nothing has been written in it. The words shown and the words heard in their place are the same ones, so either both are given or neither is",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description:
                    "Leaves what is written to be read and copied but not changed. It is the one state Lexical keeps, so there is no second greyed-out one beside it, and the toolbar's controls go out of use with it",
            },
            {
                name: "minHeight",
                type: "number",
                description:
                    "How tall the writing area stands before it has been written in, in pixels",
            },
            {
                name: "maxHeight",
                type: "number",
                description:
                    "How tall it is let grow before what is written is scrolled through instead. Both heights are set on the box the writing sits in rather than on the writing itself, so the toolbar keeps its place at the edge of the field",
            },
            {
                name: "nodes",
                type: "readonly (Klass<LexicalNode> | LexicalNodeReplacement)[]",
                description:
                    "Kinds of writing beyond the ones the editor already knows, for a caller who has nodes and plugins of their own to add. They are added to what the editor comes with rather than standing in for it",
            },
            {
                name: "namespace",
                type: "string",
                description:
                    "Tells one editor's clipboard from another's. Only worth setting where two editors on a page are meant to pass nodes between them",
            },
            {
                name: "onError",
                type: "(error: Error, editor: LexicalEditor) => void",
                description:
                    "Called where Lexical could not carry out an update. The editor throws by default, since one that has quietly stopped working is worse than one that says so",
            },
            styling,
            {
                name: "...div props",
                type: 'Omit<React.ComponentPropsWithoutRef<"div">, "onChange">',
                description:
                    "The frame is a div underneath, so it takes what one takes — aria-label above all, since a box of writing says nothing on its own about what is being written in it. The name and whatever describes it are handed down to the writing area, which is the part that takes the focus. The change left out is the editor's own, since it reports a state rather than an event",
            },
        ],
    },
    {
        name: "RichTextEditor.Toolbar",
        props: [
            {
                name: "controls",
                type: `readonly (${control})[]`,
                default: '["history", "inline", "block", "list", "link"]',
                description:
                    "Which runs of controls are drawn, in the order they are named, with a divider between one run and the next. What is taken away is the buttons alone: the keystrokes go on being answered whatever the toolbar shows",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Controls of the caller's own, drawn after the ones the toolbar comes with. They reach the editor the same way its own controls do, through the context Lexical puts it in",
            },
            {
                name: "aria-label",
                type: "string",
                default: '"Formatting"',
                description:
                    "What a screen reader hears the toolbar called. It is one stop on the way round the page, so the arrow keys move between the buttons standing within it",
            },
            styling,
            {
                name: "...div props",
                type: 'React.ComponentPropsWithoutRef<"div">',
                description:
                    "It is a div underneath, so it takes what one takes. What each button says about itself is read back out of the writing the cursor sits in rather than kept here, so the toolbar tells the truth however the writing was reached",
            },
        ],
    },
    {
        name: "RichTextEditor.Content",
        props: [
            styling,
            {
                name: "...div props",
                type: 'Omit<React.ComponentPropsWithoutRef<"div">, "children" | "placeholder" | "aria-placeholder">',
                description:
                    "The surface the writing is done on. It is named and described by whatever named and described the editor around it, so a field and its caption are written once and read on the part that actually takes the focus. What is written belongs to the editor, so there is nothing for a caller to put inside it, and the placeholder is named on the editor rather than here",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the editor is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const RichTextEditor = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                RichTextEditor
            </Heading>
            <Text as="p" size="large">
                A field for writing prose in: headings, quotes, lists, links and the marks that can
                be laid over a run of words. Lexical holds what is written and answers for the
                typing, the undo stack and the clipboard; what the library adds is the frame around
                it, the buttons that give it its commands, and the stylesheet saying what the
                writing is drawn as. The parts are named by the caller rather than drawn by the
                editor, so a toolbar can sit under the writing as readily as over it and a caller
                with buttons of their own has somewhere to put them. What the editor holds is its
                own: the starting state is read once and kept from there, and onChange is how what
                has been written is read back out.
            </Text>
        </Stack>
        <ComponentExamples component="RichTextEditor" examples={examples} external={lexicalReact} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default RichTextEditor;
