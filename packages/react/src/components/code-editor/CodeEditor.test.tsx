import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import {
    CODE_EDITOR_THEME,
    CodeDiffEditor,
    CodeEditor,
    DEFAULT_CODE_EDITOR_OPTIONS,
    readCodeEditorAppearance,
} from ".";

// Monaco is the editor's work rather than the component's, and it cannot be built in jsdom, which
// has no layout to measure text against and no workers to run its services on. What stands in
// for it here keeps the editors it is asked for and remembers what each was told, so what is
// tested is what the component asks of Monaco: the frame it draws, the options it settles and
// the theme it defines from the stylesheet. The stand-in is raised with the mock itself, since
// Vitest lifts the mock above everything the file declares
const { monaco, stage } = vi.hoisted(() => {
    type Uri = { toString(): string };
    type Listener<TEvent> = (event: TEvent) => void;
    type ContentEvent = { changes: unknown[] };

    const parseUri = (value: string): Uri => {
        const text = value.includes(":") ? value : `file:///${value.replace(/^\/+/, "")}`;

        return { toString: () => text };
    };

    const models = new Map<string, FakeModel>();
    const editors: FakeEditor[] = [];
    const diffEditors: FakeDiffEditor[] = [];
    const allEditors: FakeEditor[] = [];
    let anonymous = 0;

    class FakeModel {
        uri: Uri;
        value: string;
        language: string;
        options: Record<string, unknown> = {};
        disposed = false;

        constructor(uri: Uri, value: string, language?: string) {
            this.uri = uri;
            this.value = value;
            this.language = language ?? "plaintext";
        }

        getValue() {
            return this.value;
        }

        updateOptions(options: Record<string, unknown>) {
            Object.assign(this.options, options);
        }

        getLanguageId() {
            return this.language;
        }

        getFullModelRange() {
            return { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 };
        }

        pushStackElement() {}

        pushEditOperations(_before: unknown, operations: { text: string }[]) {
            for (const { text } of operations) {
                this.write(text);
            }

            return null;
        }

        write(text: string) {
            this.value = text;

            for (const editor of allEditors) {
                if (editor.model === this) editor.emit({ changes: [] });
            }
        }

        dispose() {
            this.disposed = true;
            models.delete(this.uri.toString());
        }
    }

    class FakeEditor {
        container: HTMLElement | undefined;
        model: FakeModel | null;
        options: Record<string, unknown>;
        updates: Record<string, unknown>[] = [];
        disposed = false;
        listeners = new Set<Listener<ContentEvent>>();

        constructor(
            container: HTMLElement | undefined,
            model: FakeModel | null,
            options: Record<string, unknown>,
        ) {
            this.container = container;
            this.model = model;
            this.options = { ...options };
            allEditors.push(this);
        }

        getModel() {
            return this.model;
        }

        setModel(model: FakeModel | null) {
            this.model = model;
        }

        getValue() {
            return this.model?.value ?? "";
        }

        updateOptions(options: Record<string, unknown>) {
            this.updates.push(options);
            Object.assign(this.options, options);
        }

        onDidChangeModelContent(listener: Listener<ContentEvent>) {
            this.listeners.add(listener);

            return { dispose: () => this.listeners.delete(listener) };
        }

        saveViewState() {
            return null;
        }

        restoreViewState() {}

        dispose() {
            this.disposed = true;
        }

        emit(event: ContentEvent) {
            for (const listener of this.listeners) {
                listener(event);
            }
        }

        type(text: string) {
            this.model?.write(text);
        }
    }

    class FakeDiffEditor {
        container: HTMLElement;
        options: Record<string, unknown>;
        updates: Record<string, unknown>[] = [];
        models: { original: FakeModel; modified: FakeModel } | null = null;
        original = new FakeEditor(undefined, null, {});
        modified = new FakeEditor(undefined, null, {});
        disposed = false;

        constructor(container: HTMLElement, options: Record<string, unknown>) {
            this.container = container;
            this.options = { ...options };
        }

        getModel() {
            return this.models;
        }

        setModel(models: { original: FakeModel; modified: FakeModel } | null) {
            this.models = models;
            this.original.setModel(models?.original ?? null);
            this.modified.setModel(models?.modified ?? null);
        }

        getOriginalEditor() {
            return this.original;
        }

        getModifiedEditor() {
            return this.modified;
        }

        updateOptions(options: Record<string, unknown>) {
            this.updates.push(options);
            Object.assign(this.options, options);
        }

        dispose() {
            this.disposed = true;
        }
    }

    const editor = {
        create: vi.fn(
            (container: HTMLElement, { model, ...options }: { model: FakeModel } & object) => {
                const instance = new FakeEditor(container, model, options);
                editors.push(instance);

                return instance;
            },
        ),
        createDiffEditor: vi.fn((container: HTMLElement, options: Record<string, unknown>) => {
            const instance = new FakeDiffEditor(container, options);
            diffEditors.push(instance);

            return instance;
        }),
        createModel: vi.fn((value: string, language?: string, uri?: Uri) => {
            const model = new FakeModel(
                uri ?? parseUri(`inmemory://model/${++anonymous}`),
                value,
                language,
            );
            models.set(model.uri.toString(), model);

            return model;
        }),
        getModel: vi.fn((uri: Uri) => models.get(uri.toString()) ?? null),
        setModelLanguage: vi.fn((model: FakeModel, language: string) => {
            model.language = language;
        }),
        setTheme: vi.fn(),
        defineTheme: vi.fn(),
        onDidChangeMarkers: vi.fn(() => ({ dispose: () => {} })),
        getModelMarkers: vi.fn(() => []),
    };

    const monaco = { editor, Uri: { parse: parseUri } };

    const stage = {
        lastEditor: () => editors[editors.length - 1],
        lastDiffEditor: () => diffEditors[diffEditors.length - 1],
        reset() {
            models.clear();
            editors.length = 0;
            diffEditors.length = 0;
            allEditors.length = 0;
            anonymous = 0;
        },
    };

    return { monaco, stage };
});

vi.mock("monaco-editor", () => monaco);

const root = (component = "CodeEditor") =>
    document.querySelector<HTMLElement>(`[data-component='${component}']`)!;

// Monaco arrives a moment after the first render, once the stand-in's import has settled, and the
// editor built on it a moment after that, once its first options have been handed on
const renderEditor = async (ui: React.ReactElement) => {
    const result = render(ui);
    await waitFor(() => expect(stage.lastEditor()?.updates.length).toBeGreaterThan(0));

    return result;
};

const renderDiffEditor = async (ui: React.ReactElement) => {
    const result = render(ui);
    await waitFor(() => expect(stage.lastDiffEditor()?.updates.length).toBeGreaterThan(0));

    return result;
};

// The custom properties the stylesheet would have declared, written on the element itself, since
// no stylesheet is loaded here
const painted = (properties: Record<string, string>) => properties as React.CSSProperties;

beforeEach(() => {
    stage.reset();
    vi.clearAllMocks();
});

describe("CodeEditor", () => {
    it("renders a div carrying the class, the component and the language", async () => {
        await renderEditor(<CodeEditor language="json" className="custom" data-testid="editor" />);

        const element = screen.getByTestId("editor");
        expect(element.tagName).toBe("DIV");
        expect(element).toHaveClass("code-editor", "custom");
        expect(element).toHaveAttribute("data-component", "CodeEditor");
        expect(element).toHaveAttribute("data-language", "json");
    });

    it("forwards the ref to the frame", async () => {
        const ref = React.createRef<HTMLDivElement>();
        await renderEditor(<CodeEditor ref={ref} />);

        expect(ref.current).toBe(root());
    });

    it("sizes the frame through custom properties", async () => {
        await renderEditor(<CodeEditor width={480} height="50vh" />);

        expect(root()).toHaveStyle({ "--code-editor-width": "480px" });
        expect(root()).toHaveStyle({ "--code-editor-height": "50vh" });
    });

    it("leaves the size to the stylesheet where none is given", async () => {
        await renderEditor(<CodeEditor />);

        expect(root().getAttribute("style") ?? "").not.toContain("--code-editor-width");
        expect(root().getAttribute("style") ?? "").not.toContain("--code-editor-height");
    });

    it("names the field for Monaco and the frame for the page", async () => {
        await renderEditor(<CodeEditor />);

        expect(stage.lastEditor().options.ariaLabel).toBe("Code editor");
        expect(root()).toHaveAttribute("role", "group");
        expect(root()).toHaveAttribute("aria-label", "Code editor");
    });

    it("takes the name it is given", async () => {
        await renderEditor(<CodeEditor aria-label="Counter.tsx" />);

        expect(stage.lastEditor().options.ariaLabel).toBe("Counter.tsx");
        expect(root()).toHaveAttribute("aria-label", "Counter.tsx");
    });

    it("points the frame at an element naming it and leaves Monaco the field's own name", async () => {
        await renderEditor(<CodeEditor aria-labelledby="heading" />);

        expect(root()).toHaveAttribute("aria-labelledby", "heading");
        expect(root()).not.toHaveAttribute("aria-label");
        expect(stage.lastEditor().options.ariaLabel).toBe("Code editor");
    });

    it("builds the editor with numbered lines, no minimap, no wrapping and tabs of four", async () => {
        await renderEditor(<CodeEditor />);

        const { options } = stage.lastEditor();
        expect(options).toMatchObject({
            ...DEFAULT_CODE_EDITOR_OPTIONS,
            theme: CODE_EDITOR_THEME,
            lineNumbers: "on",
            minimap: { enabled: false },
            wordWrap: "off",
            tabSize: 4,
            readOnly: false,
        });
    });

    it("turns each of them the other way when told", async () => {
        await renderEditor(
            <CodeEditor showLineNumbers={false} showMinimap wrap="wrap" tabSize={2} readOnly />,
        );

        const { options } = stage.lastEditor();
        expect(options).toMatchObject({
            lineNumbers: "off",
            minimap: { enabled: true },
            wordWrap: "on",
            tabSize: 2,
            readOnly: true,
        });
        expect(root()).toHaveAttribute("data-read-only");
    });

    it("lays the caller's options over its own", async () => {
        await renderEditor(<CodeEditor options={{ scrollBeyondLastLine: true, fontSize: 18 }} />);

        expect(stage.lastEditor().options).toMatchObject({
            scrollBeyondLastLine: true,
            fontSize: 18,
        });
    });

    it("hands the text, the language and the placeholder on", async () => {
        await renderEditor(
            <CodeEditor defaultValue="let a = 1;" language="typescript" placeholder="Type here" />,
        );

        const editor = stage.lastEditor();
        expect(editor.model?.value).toBe("let a = 1;");
        expect(editor.model?.language).toBe("typescript");
        expect(editor.options.placeholder).toBe("Type here");
    });

    it("defines Monaco's theme from the custom properties on the frame and sets it", async () => {
        await renderEditor(
            <CodeEditor
                style={painted({
                    "--code-editor-base-theme": "vs-dark",
                    "--code-editor-background-color": "#0D1117",
                    "--code-editor-syntax-keyword-color": "#ff7b72",
                })}
            />,
        );

        await waitFor(() => expect(monaco.editor.defineTheme).toHaveBeenCalled());
        expect(monaco.editor.defineTheme).toHaveBeenLastCalledWith(
            CODE_EDITOR_THEME,
            expect.objectContaining({
                base: "vs-dark",
                inherit: true,
                colors: expect.objectContaining({ "editor.background": "#0d1117" }),
                rules: expect.arrayContaining([{ token: "keyword", foreground: "ff7b72" }]),
            }),
        );
        expect(monaco.editor.setTheme).toHaveBeenLastCalledWith(CODE_EDITOR_THEME);
        expect(stage.lastEditor().options.theme).toBe(CODE_EDITOR_THEME);
    });

    it("reads the theme again when the scheme changes", async () => {
        const { container } = await renderEditor(
            <div data-theme="light">
                <CodeEditor style={painted({ "--code-editor-base-theme": "vs" })} />
            </div>,
        );

        await waitFor(() =>
            expect(monaco.editor.defineTheme).toHaveBeenLastCalledWith(
                CODE_EDITOR_THEME,
                expect.objectContaining({ base: "vs" }),
            ),
        );

        act(() => {
            root().style.setProperty("--code-editor-base-theme", "vs-dark");
            container.firstElementChild?.setAttribute("data-theme", "dark");
        });

        await waitFor(() =>
            expect(monaco.editor.defineTheme).toHaveBeenLastCalledWith(
                CODE_EDITOR_THEME,
                expect.objectContaining({ base: "vs-dark" }),
            ),
        );
    });

    it("hands the font it is set in to Monaco", async () => {
        await renderEditor(
            <CodeEditor
                style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: "20px" }}
            />,
        );

        await waitFor(() =>
            expect(stage.lastEditor().options).toMatchObject({
                fontFamily: "monospace",
                fontSize: 13,
                lineHeight: 20,
            }),
        );
    });

    it("reports edits and writes a value in through the frame", async () => {
        const onChange = vi.fn();
        const { rerender } = await renderEditor(<CodeEditor value="one" onChange={onChange} />);

        act(() => stage.lastEditor().type("typed"));
        expect(onChange).toHaveBeenCalledWith("typed", expect.anything());

        rerender(<CodeEditor value="two" onChange={onChange} />);
        expect(stage.lastEditor().model?.value).toBe("two");
    });
});

describe("readCodeEditorAppearance", () => {
    const paint = (properties: Record<string, string>) => {
        const element = document.createElement("div");

        for (const [property, value] of Object.entries(properties)) {
            element.style.setProperty(property, value);
        }

        document.body.append(element);

        return element;
    };

    it("falls back to Monaco's light theme with nothing laid over it", () => {
        const appearance = readCodeEditorAppearance(paint({}));

        expect(appearance.base).toBe("vs");
        expect(appearance.colors).toEqual({});
        expect(appearance.rules).toEqual([]);
    });

    it("writes a short colour out long and leaves one it cannot read out", () => {
        const appearance = readCodeEditorAppearance(
            paint({
                "--code-editor-cursor-color": "#abc",
                "--code-editor-background-color": "rgb(1, 2, 3)",
                "--code-editor-syntax-comment-color": "#6E7781FF",
            }),
        );

        expect(appearance.colors["editorCursor.foreground"]).toBe("#aabbcc");
        expect(appearance.colors["editor.background"]).toBeUndefined();
        expect(appearance.rules).toEqual([{ token: "comment", foreground: "6e7781" }]);
    });

    it("falls back to Monaco's light theme where the base is not one it knows", () => {
        const appearance = readCodeEditorAppearance(
            paint({ "--code-editor-base-theme": "solarized" }),
        );

        expect(appearance.base).toBe("vs");
    });

    it("colours a tag and a JSON key apart from the rest", () => {
        const appearance = readCodeEditorAppearance(
            paint({
                "--code-editor-syntax-tag-color": "#116329",
                "--code-editor-syntax-string-color": "#0a3069",
            }),
        );

        expect(appearance.rules).toEqual(
            expect.arrayContaining([
                { token: "tag", foreground: "116329" },
                { token: "string.key.json", foreground: "116329" },
                { token: "string", foreground: "0a3069" },
            ]),
        );
    });
});

describe("CodeDiffEditor", () => {
    it("sizes the tabs of both texts, which a diff editor has no setting of its own for", async () => {
        const { rerender } = await renderDiffEditor(<CodeDiffEditor original="a" modified="b" />);
        const { original, modified } = stage.lastDiffEditor().models!;
        expect(original.options.tabSize).toBe(4);
        expect(modified.options.tabSize).toBe(4);

        rerender(<CodeDiffEditor original="a" modified="b" tabSize={2} />);
        expect(original.options.tabSize).toBe(2);
        expect(modified.options.tabSize).toBe(2);
    });

    it("renders the frame as a diff editor", async () => {
        await renderDiffEditor(<CodeDiffEditor language="json" original="a" modified="b" />);

        expect(root("CodeDiffEditor")).toHaveClass("code-editor", "code-editor-diff");
        expect(root("CodeDiffEditor")).toHaveAttribute("aria-label", "Code diff editor");
        expect(root("CodeDiffEditor")).toHaveAttribute("data-language", "json");
    });

    it("builds the two texts side by side unless told otherwise", async () => {
        const { rerender } = await renderDiffEditor(
            <CodeDiffEditor language="json" original="a" modified="b" />,
        );

        const editor = stage.lastDiffEditor();
        expect(editor.options).toMatchObject({
            ...DEFAULT_CODE_EDITOR_OPTIONS,
            theme: CODE_EDITOR_THEME,
            renderSideBySide: true,
            lineNumbers: "on",
            readOnly: false,
            originalEditable: false,
        });
        expect(editor.models?.original.value).toBe("a");
        expect(editor.models?.modified.value).toBe("b");
        expect(editor.models?.original.language).toBe("json");

        rerender(<CodeDiffEditor language="json" original="a" modified="b" sideBySide={false} />);
        expect(editor.options.renderSideBySide).toBe(false);
    });

    it("paints the diff from the same theme", async () => {
        await renderDiffEditor(
            <CodeDiffEditor
                original="a"
                modified="b"
                style={painted({ "--code-editor-removed-line-background-color": "#ffebe9" })}
            />,
        );

        await waitFor(() =>
            expect(monaco.editor.defineTheme).toHaveBeenLastCalledWith(
                CODE_EDITOR_THEME,
                expect.objectContaining({
                    colors: expect.objectContaining({
                        "diffEditor.removedLineBackground": "#ffebe9",
                    }),
                }),
            ),
        );
    });
});
