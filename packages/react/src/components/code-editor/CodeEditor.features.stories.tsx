import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Heading } from "../heading";
import { Stack } from "../stack";
import { Text } from "../text";
import { CodeDiffEditor, CodeEditor } from ".";
import type { CodeEditorMarker } from ".";

const classes = {
    // An editor fills its container, so the stories give it one to fill
    container: "max-w-[48rem]",
    muted: "text-[var(--foreground-color-muted)]",
};

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

const html = `<article class="card">
    <h2>Base UI</h2>
    <p>A design system for the web.</p>
</article>
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

// A handful of files for an editor to be moved between. Each keeps its own text, its own undo
// stack and where the reader was left in it
const files = [
    { path: "src/Counter.tsx", language: "typescript", value: source },
    { path: "package.json", language: "json", value: json },
    { path: "src/styles/code-editor.css", language: "css", value: css },
];

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/CodeEditor/Features",
    decorators: [withContainer],
};

// Languages, each named the way Monaco knows it, with the colours coming from the design tokens
// rather than from a theme of Monaco's own
export const Languages: StoryFn<typeof CodeEditor> = () => (
    <Stack gap="normal">
        <CodeEditor language="json" defaultValue={json} height={160} aria-label="package.json" />
        <CodeEditor language="css" defaultValue={css} height={160} aria-label="code-editor.css" />
        <CodeEditor language="html" defaultValue={html} height={160} aria-label="card.html" />
    </Stack>
);

// Read Only, for a text that is shown to be read and copied rather than changed
export const ReadOnly: StoryFn<typeof CodeEditor> = () => (
    <CodeEditor language="typescript" defaultValue={source} readOnly aria-label="Counter.tsx" />
);

// Wrapping, where a line too long for the editor runs on to the next one rather than being left
// to be scrolled to
export const Wrapping: StoryFn<typeof CodeEditor> = () => (
    <CodeEditor language="typescript" defaultValue={longLines} wrap="wrap" height={200} />
);

// Minimap, the whole text drawn small down the right edge as a map of where the reader is in it
export const Minimap: StoryFn<typeof CodeEditor> = () => (
    <CodeEditor language="typescript" defaultValue={source} showMinimap aria-label="Counter.tsx" />
);

// Controlled, where the caller holds the text and the editor reports every edit back with the
// whole of it. A value echoed back unchanged moves nothing in the editor
export const Controlled: StoryFn<typeof CodeEditor> = () => {
    const [value, setValue] = React.useState(source);

    return (
        <Stack gap="condensed">
            <CodeEditor
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

// Validation, where the problems the language service finds in the text are reported as they
// change. TypeScript's service runs on a worker the page supplies; without one, nothing is
// reported
export const Validation: StoryFn<typeof CodeEditor> = () => {
    const [markers, setMarkers] = React.useState<CodeEditorMarker[]>([]);

    return (
        <Stack gap="condensed">
            <CodeEditor
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

// Placeholder, shown in the editor's place while nothing has been written in it
export const Placeholder: StoryFn<typeof CodeEditor> = () => (
    <CodeEditor language="markdown" placeholder="Write your notes here…" height={160} />
);

// Files, where one editor is moved between several texts by their paths. Each keeps its own undo
// stack and where the reader was left in it, so switching back finds it as it was
export const Files: StoryFn<typeof CodeEditor> = () => {
    const [current, setCurrent] = React.useState(files[0]!);

    return (
        <Stack gap="condensed">
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
        </Stack>
    );
};

// Diff, two texts side by side with what changed between them marked in the colours the rest of
// the library marks a diff in
export const Diff: StoryFn<typeof CodeDiffEditor> = () => (
    <CodeDiffEditor language="json" original={before} modified={after} aria-label="package.json" />
);

// Inline Diff, the two texts one above the other with the changes marked in place, for a column
// too narrow to hold them side by side
export const InlineDiff: StoryFn<typeof CodeDiffEditor> = () => (
    <CodeDiffEditor
        language="json"
        original={before}
        modified={after}
        sideBySide={false}
        aria-label="package.json"
    />
);

// Sized, where a number is read as pixels and anything else is passed to CSS as it was written
export const Sized: StoryFn<typeof CodeEditor> = () => (
    <Stack gap="normal">
        <CodeEditor language="css" defaultValue={css} height={120} aria-label="Short" />
        <CodeEditor
            language="css"
            defaultValue={css}
            width="60%"
            height="10rem"
            aria-label="Narrow"
        />
    </Stack>
);

// Repainted, where everything an editor is painted from is a custom property, so one can be
// repainted without unpicking the classes it came with. Monaco paints every editor on the page
// from one theme, so what is set on one editor is read for all of them
export const Repainted: StoryFn<typeof CodeEditor> = () => (
    <CodeEditor
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
                "--code-editor-syntax-variable-color": "#e0def4",
                "--code-editor-syntax-comment-color": "#6e6a86",
            } as React.CSSProperties
        }
    />
);

// Named, where a heading already says what the editor holds, so the frame is pointed at that
// heading rather than given a name of its own to fall out of step with
export const Named: StoryFn<typeof CodeEditor> = () => (
    <Stack gap="condensed">
        <Heading as="h2" size="small" id="code-editor-counter">
            Counter.tsx
        </Heading>
        <Text size="small" className={classes.muted}>
            A button that counts how often it has been pressed.
        </Text>
        <CodeEditor
            language="typescript"
            defaultValue={source}
            aria-labelledby="code-editor-counter"
        />
    </Stack>
);
