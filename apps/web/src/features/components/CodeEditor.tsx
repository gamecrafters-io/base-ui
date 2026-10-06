import * as React from "react";
import {
    Button,
    CodeDiffEditor,
    CodeEditor as CodeEditorComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import type { CodeEditorMarker } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // An editor is drawn to whatever room it is given, so the page gives it a column to stand in
    // rather than letting it run the width of the card
    frame: "w-[40rem] max-w-full",
    muted: "text-[var(--foreground-color-muted)]",
};

// The texts the examples are shown holding. Each is written once and read out into the editors
// and the listings beneath them, since a text is come by as a file rather than typed out twice
const source = `import { useState } from "react";

export function Counter({ start = 0 }: { start?: number }) {
    const [count, setCount] = useState(start);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
`;

const json = `{
    "name": "@gamecrafters/base-ui",
    "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0"
    }
}
`;

const css = `.code-editor {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
`;

const longLines = `const themes = ["github-light", "github-dark", "min-light", "min-dark", "nord", "vitesse-light", "vitesse-dark"];
const languages = ["typescript", "javascript", "json", "css", "html", "markdown", "python", "rust", "go"];
`;

// A text with a problem in it for the language service to find: a number handed to a function
// that asked for a string
const faulty = `function greet(name: string) {
    return \`Hello, \${name}\`;
}

greet(42);
`;

const before = `{
    "name": "@gamecrafters/base-ui",
    "version": "0.0.42",
    "dependencies": {
        "ol": "^10.10.0"
    }
}
`;

const after = `{
    "name": "@gamecrafters/base-ui",
    "version": "0.0.43",
    "dependencies": {
        "monaco-editor": "^0.57.0",
        "ol": "^10.10.0"
    }
}
`;

// A handful of files for one editor to be moved between
const files = [
    { path: "src/Counter.tsx", language: "typescript", value: source },
    { path: "package.json", language: "json", value: json },
    { path: "src/styles/code-editor.css", language: "css", value: css },
];

// What the examples that read off the texts have to have in hand before they can be drawn. The
// texts are long, so the listings name them rather than carrying them
const sourceSetup = `const source = \`import { useState } from "react";

export function Counter({ start = 0 }: { start?: number }) {
    const [count, setCount] = useState(start);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`;`;

const filesSetup = `const files = [
    { path: "src/Counter.tsx", language: "typescript", value: source },
    { path: "package.json", language: "json", value: json },
    { path: "src/styles/code-editor.css", language: "css", value: css },
];`;

// The plainest editor there is: a text and the language it is read under. Given no height it
// stands as tall as a function is read at, and given no width it is as wide as whatever it was
// put in.
//
// The page and the component it is about are both called CodeEditor, so the component is brought
// in under a name saying which of the two it is. The listing beneath says CodeEditor, as an
// application importing it would
const defaultPreview = (
    <div className={classes.frame}>
        <CodeEditorComponent language="typescript" defaultValue={source} aria-label="Counter.tsx" />
    </div>
);

const defaultCode = `<CodeEditor language="typescript" defaultValue={source} aria-label="Counter.tsx" />`;

// Languages, each named the way Monaco knows it
const languagesPreview = (
    <Stack gap="normal" className={classes.frame}>
        <CodeEditorComponent
            language="json"
            defaultValue={json}
            height={160}
            aria-label="package.json"
        />
        <CodeEditorComponent
            language="css"
            defaultValue={css}
            height={160}
            aria-label="code-editor.css"
        />
    </Stack>
);

const languagesCode = `<Stack gap="normal">
    <CodeEditor language="json" defaultValue={json} height={160} aria-label="package.json" />
    <CodeEditor language="css" defaultValue={css} height={160} aria-label="code-editor.css" />
</Stack>`;

// A text shown to be read and copied rather than changed
const readOnlyPreview = (
    <div className={classes.frame}>
        <CodeEditorComponent
            language="typescript"
            defaultValue={source}
            readOnly
            aria-label="Counter.tsx"
        />
    </div>
);

const readOnlyCode = `<CodeEditor language="typescript" defaultValue={source} readOnly aria-label="Counter.tsx" />`;

// What is drawn beside the lines: a line too long for the editor run on to the next one, and the
// whole text drawn small down the right edge
const gutterPreview = (
    <Stack gap="normal" className={classes.frame}>
        <CodeEditorComponent
            language="typescript"
            defaultValue={longLines}
            wrap="wrap"
            height={160}
            aria-label="Wrapped"
        />
        <CodeEditorComponent
            language="typescript"
            defaultValue={source}
            showMinimap
            showLineNumbers={false}
            height={200}
            aria-label="With a minimap"
        />
    </Stack>
);

const gutterCode = `<Stack gap="normal">
    <CodeEditor language="typescript" defaultValue={longLines} wrap="wrap" height={160} />
    <CodeEditor
        language="typescript"
        defaultValue={source}
        showMinimap
        showLineNumbers={false}
        height={200}
    />
</Stack>`;

// The caller holds the text and the editor reports every edit back with the whole of it. A
// value echoed back unchanged moves nothing in the editor
const ControlledPreview = () => {
    const [value, setValue] = React.useState(source);

    return (
        <Stack gap="condensed" className={classes.frame}>
            <CodeEditorComponent
                language="typescript"
                value={value}
                onChange={setValue}
                aria-label="Counter.tsx"
            />
            <Stack direction="horizontal" gap="condensed" align="center">
                <Button size="small" onClick={() => setValue(source)}>
                    Reset
                </Button>
                <Text size="small" className={classes.muted}>
                    {value.length} characters, {value.split("\n").length} lines
                </Text>
            </Stack>
        </Stack>
    );
};

const controlledSetup = `${sourceSetup}

const [value, setValue] = React.useState(source);`;

const controlledCode = `<Stack gap="condensed">
    <CodeEditor language="typescript" value={value} onChange={setValue} aria-label="Counter.tsx" />
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button size="small" onClick={() => setValue(source)}>
            Reset
        </Button>
        <Text size="small">
            {value.length} characters, {value.split("\\n").length} lines
        </Text>
    </Stack>
</Stack>`;

// The problems the language service finds in the text, reported as they change
const ValidationPreview = () => {
    const [markers, setMarkers] = React.useState<CodeEditorMarker[]>([]);

    return (
        <Stack gap="condensed" className={classes.frame}>
            <CodeEditorComponent
                language="typescript"
                defaultValue={faulty}
                onValidate={setMarkers}
                height={200}
                aria-label="greet.ts"
            />
            {markers.length === 0 ? (
                <Text size="small" className={classes.muted}>
                    No problems found
                </Text>
            ) : (
                <Stack as="ul" gap="none">
                    {markers.map((marker) => (
                        <Text
                            as="li"
                            key={`${marker.startLineNumber}:${marker.startColumn}:${marker.message}`}
                            size="small"
                        >
                            Line {marker.startLineNumber}: {marker.message}
                        </Text>
                    ))}
                </Stack>
            )}
        </Stack>
    );
};

const validationSetup = `const [markers, setMarkers] = React.useState<CodeEditorMarker[]>([]);`;

const validationCode = `<Stack gap="condensed">
    <CodeEditor
        language="typescript"
        defaultValue={faulty}
        onValidate={setMarkers}
        height={200}
        aria-label="greet.ts"
    />
    {markers.length === 0 ? (
        <Text size="small">No problems found</Text>
    ) : (
        <Stack as="ul" gap="none">
            {markers.map((marker) => (
                <Text as="li" key={marker.message} size="small">
                    Line {marker.startLineNumber}: {marker.message}
                </Text>
            ))}
        </Stack>
    )}
</Stack>`;

// One editor moved between several texts by their paths. Each keeps its own undo stack and where
// the reader was left in it, so switching back finds it as it was
const FilesPreview = () => {
    const [current, setCurrent] = React.useState(files[0]!);

    return (
        <Stack gap="condensed" className={classes.frame}>
            <Stack direction="horizontal" gap="condensed" wrap="wrap">
                {files.map((file) => (
                    <Button
                        key={file.path}
                        size="small"
                        variant={file.path === current.path ? "primary" : "default"}
                        onClick={() => setCurrent(file)}
                    >
                        {file.path}
                    </Button>
                ))}
            </Stack>
            <CodeEditorComponent
                path={current.path}
                language={current.language}
                defaultValue={current.value}
                aria-label={current.path}
            />
        </Stack>
    );
};

const filesPreviewSetup = `${filesSetup}

const [current, setCurrent] = React.useState(files[0]);`;

const filesCode = `<Stack gap="condensed">
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        {files.map((file) => (
            <Button
                key={file.path}
                size="small"
                variant={file.path === current.path ? "primary" : "default"}
                onClick={() => setCurrent(file)}
            >
                {file.path}
            </Button>
        ))}
    </Stack>
    <CodeEditor
        path={current.path}
        language={current.language}
        defaultValue={current.value}
        aria-label={current.path}
    />
</Stack>`;

// Two texts with what changed between them marked, side by side and then one above the other
const diffPreview = (
    <Stack gap="normal" className={classes.frame}>
        <CodeDiffEditor
            language="json"
            original={before}
            modified={after}
            aria-label="package.json"
        />
        <CodeDiffEditor
            language="json"
            original={before}
            modified={after}
            sideBySide={false}
            aria-label="package.json, inline"
        />
    </Stack>
);

const diffCode = `<Stack gap="normal">
    <CodeDiffEditor language="json" original={before} modified={after} aria-label="package.json" />
    <CodeDiffEditor
        language="json"
        original={before}
        modified={after}
        sideBySide={false}
        aria-label="package.json, inline"
    />
</Stack>`;

// How the editor stands: a number is read as pixels, and anything else is passed to CSS as it was
// written
const sizedPreview = (
    <Stack gap="normal" className={classes.frame}>
        <CodeEditorComponent language="css" defaultValue={css} height={120} aria-label="Short" />
        <CodeEditorComponent
            language="css"
            defaultValue={css}
            width="60%"
            height="10rem"
            aria-label="Narrow"
        />
    </Stack>
);

const sizedCode = `<Stack gap="normal">
    <CodeEditor language="css" defaultValue={css} height={120} aria-label="Short" />
    <CodeEditor language="css" defaultValue={css} width="60%" height="10rem" aria-label="Narrow" />
</Stack>`;

// Everything an editor is painted from is a custom property, so one can be repainted without
// unpicking the classes it came with
const repaintedPreview = (
    <div className={classes.frame}>
        <CodeEditorComponent
            language="typescript"
            defaultValue={source}
            aria-label="Counter.tsx"
            style={
                {
                    "--code-editor-base-theme": "vs-dark",
                    "--code-editor-background-color": "#1e1b2e",
                    "--code-editor-foreground-color": "#e0def4",
                    "--code-editor-gutter-background-color": "#1e1b2e",
                    "--code-editor-line-number-color": "#6e6a86",
                    "--code-editor-active-line-background-color": "#2a273f",
                    "--code-editor-syntax-keyword-color": "#c4a7e7",
                    "--code-editor-syntax-string-color": "#f6c177",
                    "--code-editor-syntax-constant-color": "#ebbcba",
                    "--code-editor-syntax-entity-color": "#9ccfd8",
                    "--code-editor-syntax-comment-color": "#6e6a86",
                } as React.CSSProperties
            }
        />
    </div>
);

const repaintedCode = `<CodeEditor
    language="typescript"
    defaultValue={source}
    aria-label="Counter.tsx"
    style={{
        "--code-editor-base-theme": "vs-dark",
        "--code-editor-background-color": "#1e1b2e",
        "--code-editor-foreground-color": "#e0def4",
        "--code-editor-gutter-background-color": "#1e1b2e",
        "--code-editor-line-number-color": "#6e6a86",
        "--code-editor-active-line-background-color": "#2a273f",
        "--code-editor-syntax-keyword-color": "#c4a7e7",
        "--code-editor-syntax-string-color": "#f6c177",
        "--code-editor-syntax-constant-color": "#ebbcba",
        "--code-editor-syntax-entity-color": "#9ccfd8",
        "--code-editor-syntax-comment-color": "#6e6a86",
    }}
/>`;

// Where a heading already says what the editor holds, the frame is pointed at that heading rather
// than given a name of its own to fall out of step with
const namedPreview = (
    <Stack gap="condensed" className={classes.frame}>
        <Heading as="h2" size="small" id="code-editor-counter">
            Counter.tsx
        </Heading>
        <Text size="small" className={classes.muted}>
            A button that counts how often it has been pressed.
        </Text>
        <CodeEditorComponent
            language="typescript"
            defaultValue={source}
            aria-labelledby="code-editor-counter"
        />
    </Stack>
);

const namedCode = `<Stack gap="condensed">
    <Heading as="h2" size="small" id="code-editor-counter">
        Counter.tsx
    </Heading>
    <Text size="small">A button that counts how often it has been pressed.</Text>
    <CodeEditor language="typescript" defaultValue={source} aria-labelledby="code-editor-counter" />
</Stack>`;

// The editor as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then the languages it reads, then how it is written in and watched, then how it
// stands and what it is painted, and last what it is called
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "A text and the language it is read under. Monaco is fetched the first time an editor is shown rather than loaded with the page, so a page that never shows one never pays for it; until it arrives the frame stands empty in the editor's colours. Given no height the editor stands as tall as a function is read at, and given no width it is as wide as whatever it was put in.",
        setup: sourceSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Languages",
        description:
            "The language is named the way Monaco knows it: typescript, json, css, html, markdown and some eighty more. Every one of them is coloured from the design tokens rather than from a theme of Monaco's own, so an editor sits with the rest of the page in either scheme. TypeScript, JavaScript, JSON, CSS and HTML are also read by a language service, which is what the completions and the problems come from.",
        preview: languagesPreview,
        code: languagesCode,
    },
    {
        name: "Read only",
        description:
            "A text shown to be read and copied rather than changed. It keeps its colours and can still be searched and selected, since what it says is the whole of what it is for.",
        setup: sourceSetup,
        preview: readOnlyPreview,
        code: readOnlyCode,
    },
    {
        name: "Wrapping and the minimap",
        description:
            "What is drawn beside the lines. A line too long for the editor is left to be scrolled to unless the editor is told to wrap it, the lines are numbered unless it is told not to, and the whole text can be drawn small down the right edge as a map of where the reader is in it.",
        preview: gutterPreview,
        code: gutterCode,
    },
    {
        name: "Controlled",
        description:
            "The caller holds the text and the editor reports every edit back with the whole of it. A value passed back in is written into the editor only where it differs from what is already there, as one edit the reader can undo, so a caller echoing back what they were just given moves nothing — not the cursor, not the undo stack.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Validation",
        description:
            "The problems the language service finds in the text, reported whenever they change. The services run on web workers that only the page's bundler can place, which the page supplies once through configureCodeEditorWorkers; without them the editor still edits and colours every language, and nothing is reported here.",
        setup: validationSetup,
        preview: <ValidationPreview />,
        code: validationCode,
    },
    {
        name: "Files",
        description:
            "One editor moved between several texts by their paths. A path names the text rather than the editor, so an editor moved from one path to another keeps each text standing with its own undo stack and where the reader was left in it, and switching back finds it as it was. Two editors on one path write in the same text.",
        setup: filesPreviewSetup,
        preview: <FilesPreview />,
        code: filesCode,
    },
    {
        name: "Diff",
        description:
            "Two texts with what changed between them marked, in the colours the rest of the library marks a diff in: the original on the left, read and not written in unless it is said to be, and the modified on the right, which is where the edits land. A column too narrow to hold them side by side can have them one above the other, with the changes marked in place.",
        preview: diffPreview,
        code: diffCode,
    },
    {
        name: "How it stands",
        description:
            "A number is read as pixels, and anything else is passed to CSS as it was written, so an editor can be given a size in whatever units the page is laid out in. Only the height has to be settled: an editor is drawn to the room it is given and would be drawn to nothing at all were it left to find a height of its own.",
        preview: sizedPreview,
        code: sizedCode,
    },
    {
        name: "Repainted from the stylesheet",
        description:
            "Everything an editor is painted from is a custom property, so one can be repainted without unpicking the classes it came with. The stylesheet maps the design tokens onto them, and the component reads them off the frame and defines Monaco's theme from them — which is what lets an editor follow the theme around it without being told which one is standing. Monaco paints every editor on a page from one theme, so what is set on one is read for all of them.",
        setup: sourceSetup,
        preview: repaintedPreview,
        code: repaintedCode,
    },
    {
        name: "Named by what stands above it",
        description:
            "An editor is a field, so it carries a name to be found by. Where a heading already says what it holds, the frame is pointed at that heading rather than given a name of its own to fall out of step with; given neither, it is called Code editor, which is better than nothing but says little.",
        setup: sourceSetup,
        preview: namedPreview,
        code: namedCode,
    },
];

// What every part takes to be styled from outside
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What both editors take around the text, said once rather than written out under each
const frameProps = [
    {
        name: "width",
        type: "number | string",
        description:
            "How wide the editor stands. A number is read as pixels, and anything else is passed to CSS as it was written; left out, it is as wide as whatever it was put in",
    },
    {
        name: "height",
        type: "number | string",
        default: '"20rem"',
        description:
            "How tall the editor stands, on the same terms. It is the one measurement an editor cannot work out for itself",
    },
    {
        name: "showLineNumbers",
        type: "boolean",
        default: "true",
        description: "Numbers the lines in a gutter beside the text",
    },
    {
        name: "showMinimap",
        type: "boolean",
        default: "false",
        description:
            "Draws the whole text small down the right edge, as a map of where the reader is in it",
    },
    {
        name: "wrap",
        type: '"wrap" | "nowrap"',
        default: '"nowrap"',
        description:
            "Whether a line too long for the editor runs on to the next one or is left to be scrolled to",
        options: ["wrap", "nowrap"],
    },
    {
        name: "tabSize",
        type: "number",
        default: "4",
        description: "How many columns a tab stands for",
    },
    {
        name: "loading",
        type: "React.ReactNode",
        description: "What stands in the frame until Monaco has been fetched and the editor built",
    },
    {
        name: "keepModels",
        type: "boolean",
        default: "false",
        description:
            "Whether the texts the editor made are left standing when it goes, so that an editor opened again on the same paths finds what was written",
    },
    {
        name: "children",
        type: "React.ReactNode",
        description:
            "Anything attached to the editor, which reaches it through useCodeEditor once it stands",
    },
];

const groups: ComponentPropGroup[] = [
    {
        name: "CodeEditor",
        props: [
            {
                name: "value",
                type: "string",
                description:
                    "The text the editor shows, written in whenever it differs from what is there, as one edit the reader can undo",
            },
            {
                name: "defaultValue",
                type: "string",
                description:
                    "The text the editor starts with, read once and left to the editor from then on",
            },
            {
                name: "language",
                type: "string",
                description:
                    'The language the text is read under, by the name Monaco knows it: "typescript", "json", "css" and so on. Left out, the text is plain',
            },
            {
                name: "path",
                type: "string",
                description:
                    "What the text is named, as a path. A path names the text rather than the editor, so an editor moved between paths keeps each text, with its undo stack and where the reader was left in it",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description: "Leaves the text to be read and copied but not changed",
            },
            {
                name: "placeholder",
                type: "string",
                description:
                    "What is shown in the editor's place while nothing has been written in it",
            },
            {
                name: "options",
                type: "CodeEditorOptions",
                description:
                    "Anything further Monaco takes when an editor is built, laid over what the component settles for itself",
            },
            {
                name: "onChange",
                type: "(value: string, event: CodeEditorChangeEvent) => void",
                description: "Called as the text is written in, with the whole of it",
            },
            {
                name: "onMount",
                type: "(editor: CodeEditorInstance, monaco: Monaco) => void",
                description:
                    "Called once the editor stands, with the editor and with Monaco itself",
            },
            {
                name: "onValidate",
                type: "(markers: CodeEditorMarker[]) => void",
                description:
                    "Called with every problem a language service found in the text whenever they change",
            },
            ...frameProps,
            {
                name: "aria-label",
                type: "string",
                default: '"Code editor"',
                description:
                    "What the field is called. An editor holding one file is better named for that file, since the name is what the field is found by",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "The element the editor is named by, where a heading on the page already says what it holds",
            },
            styling,
        ],
    },
    {
        name: "CodeDiffEditor",
        props: [
            {
                name: "original",
                type: "string",
                description: "The text on the left, which the modified one is read against",
            },
            {
                name: "modified",
                type: "string",
                description:
                    "The text on the right, which is where the edits land and what onChange reports",
            },
            {
                name: "language",
                type: "string",
                description: "The language both texts are read under",
            },
            {
                name: "originalLanguage",
                type: "string",
                description: "The language of the original alone, where it differs",
            },
            {
                name: "modifiedLanguage",
                type: "string",
                description: "The language of the modified alone, where it differs",
            },
            {
                name: "originalPath",
                type: "string",
                description: "What the original is named, read once when the editor is built",
            },
            {
                name: "modifiedPath",
                type: "string",
                description: "What the modified is named, read once when the editor is built",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description: "Leaves the modified text to be read but not changed",
            },
            {
                name: "originalEditable",
                type: "boolean",
                default: "false",
                description: "Opens the original text to being written in as well",
            },
            {
                name: "sideBySide",
                type: "boolean",
                default: "true",
                description:
                    "Whether the two texts stand side by side, or one above the other with the changes marked in place",
            },
            {
                name: "options",
                type: "CodeDiffEditorOptions",
                description:
                    "Anything further Monaco takes when a diff editor is built, laid over what the component settles for itself",
            },
            {
                name: "onChange",
                type: "(value: string, event: CodeEditorChangeEvent) => void",
                description: "Called as the modified text is written in, with the whole of it",
            },
            {
                name: "onMount",
                type: "(editor: CodeDiffEditorInstance, monaco: Monaco) => void",
                description:
                    "Called once the editor stands, with the editor and with Monaco itself",
            },
            ...frameProps,
            {
                name: "aria-label",
                type: "string",
                default: '"Code diff editor"',
                description: "What the field is called",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description: "The element the editor is named by",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the editor is is said on the page itself, beside the examples it is
// reached for in and the props it takes
const CodeEditor = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                CodeEditor
            </Heading>
            <Text as="p" size="large">
                A code editor: the Monaco editor, which is the editor VS Code is built on, drawn in
                the design system&apos;s frame and painted from its tokens. What an editor is
                usually wanted for is one text in one language, so that is what the props settle,
                along with what is drawn beside the lines; everything else Monaco can be told goes
                in its options, laid over what the component settles for itself.
            </Text>
            <Text as="p" size="large">
                The colours and the font are read from the stylesheet rather than passed in, since
                Monaco is handed a theme and a theme is written in tokens. The stylesheet maps the
                design tokens onto custom properties on the frame, and the component reads them off
                it, defines Monaco&apos;s theme from them, and reads them again when the scheme
                changes — so an editor follows the theme around it without being told which one is
                standing. Monaco runs its language services on web workers that only the page&apos;s
                bundler can place, which a page supplies once through configureCodeEditorWorkers.
            </Text>
        </Stack>
        <ComponentExamples component="CodeEditor" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default CodeEditor;
