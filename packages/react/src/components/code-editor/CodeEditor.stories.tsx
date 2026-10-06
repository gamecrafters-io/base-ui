import type { StoryFn, Meta } from "@storybook/react-vite";
import { CodeEditor } from ".";
import type { CodeEditorProps } from "./CodeEditor.types";

const classes = {
    // An editor is drawn to whatever room it is given, so the stories give it a column to stand
    // in rather than letting it run the width of the canvas
    frame: "w-[48rem] max-w-full",
};

const source = `import { useState } from "react";

export function Counter({ start = 0 }: { start?: number }) {
    const [count, setCount] = useState(start);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
`;

export default {
    title: "Components/CodeEditor",
    component: CodeEditor,
} as Meta<typeof CodeEditor>;

export const Default: StoryFn<typeof CodeEditor> = () => (
    <div className={classes.frame}>
        <CodeEditor language="typescript" defaultValue={source} aria-label="Counter.tsx" />
    </div>
);

export const Playground: StoryFn<CodeEditorProps> = (args) => (
    <div className={classes.frame}>
        <CodeEditor {...args} />
    </div>
);

Playground.args = {
    language: "typescript",
    defaultValue: source,
    height: 320,
    showLineNumbers: true,
    showMinimap: false,
    wrap: "nowrap",
    readOnly: false,
    tabSize: 4,
    placeholder: "",
};

Playground.argTypes = {
    language: {
        control: {
            type: "text",
        },
        description: "The language the text is read under, by the name Monaco knows it",
    },
    defaultValue: {
        control: {
            type: "text",
        },
        description: "The text the editor starts with",
    },
    width: {
        control: {
            type: "number",
            min: 160,
            max: 800,
            step: 16,
        },
        description: "How wide the editor stands, in pixels",
    },
    height: {
        control: {
            type: "number",
            min: 160,
            max: 800,
            step: 16,
        },
        description: "How tall the editor stands, in pixels",
    },
    showLineNumbers: {
        control: {
            type: "boolean",
        },
        description: "Numbers the lines in a gutter beside the text",
    },
    showMinimap: {
        control: {
            type: "boolean",
        },
        description: "Draws the whole text small down the right edge",
    },
    wrap: {
        control: {
            type: "radio",
        },
        options: ["wrap", "nowrap"],
        description: "Whether a line too long for the editor runs on to the next one",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Leaves the text to be read and copied but not changed",
    },
    tabSize: {
        control: {
            type: "number",
            min: 1,
            max: 8,
            step: 1,
        },
        description: "How many columns a tab stands for",
    },
    placeholder: {
        control: {
            type: "text",
        },
        description: "What is shown in the editor's place while nothing has been written in it",
    },
    value: {
        table: {
            disable: true,
        },
    },
    options: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};
