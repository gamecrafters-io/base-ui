import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import {
    CodeDiffEditor,
    CodeEditor,
    configureCodeEditorWorkers,
    loadMonaco,
    resolveCodeEditorWorkerLabel,
    setModelValue,
    useCodeDiffEditor,
    useCodeEditor,
    useMonaco,
} from ".";
import type { CodeDiffEditorInstance, CodeEditorInstance, CodeEditorModel, Monaco } from ".";

// Monaco is the editor's work rather than the component's, and it cannot be built in jsdom, which
// has no layout to measure text against and no workers to run its services on. What stands in
// for it here keeps the models and editors it is asked for and remembers what each was told, so
// what is tested is what the component asks of Monaco and when. The stand-in is raised with the
// mock itself, since Vitest lifts the mock above everything the file declares
const { monaco, stage } = vi.hoisted(() => {
    type Uri = { toString(): string };
    type Listener<TEvent> = (event: TEvent) => void;
    type ContentEvent = { changes: unknown[] };

    // A URI the way Monaco parses one: a bare path is given the file scheme, and two are the
    // same when they print the same
    const parseUri = (value: string): Uri => {
        const text = value.includes(":") ? value : `file:///${value.replace(/^\/+/, "")}`;

        return { toString: () => text };
    };

    const models = new Map<string, FakeModel>();
    const editors: FakeEditor[] = [];
    const diffEditors: FakeDiffEditor[] = [];
    const allEditors: FakeEditor[] = [];
    const markerListeners = new Set<Listener<readonly Uri[]>>();
    const markers = new Map<string, unknown[]>();
    let anonymous = 0;

    class FakeModel {
        uri: Uri;
        value: string;
        language: string;
        disposed = false;
        // Every text written over the model, and how many undo stops were pushed around them
        edits: string[] = [];
        stops = 0;

        constructor(uri: Uri, value: string, language?: string) {
            this.uri = uri;
            this.value = value;
            this.language = language ?? "plaintext";
        }

        getValue() {
            return this.value;
        }

        getLanguageId() {
            return this.language;
        }

        getFullModelRange() {
            return { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 };
        }

        pushStackElement() {
            this.stops += 1;
        }

        pushEditOperations(_before: unknown, operations: { text: string }[]) {
            for (const { text } of operations) {
                this.edits.push(text);
                this.write(text);
            }

            return null;
        }

        // What changing the text does, however it was changed: every editor showing the model
        // hears of it, the way it does in Monaco
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
        restored: unknown[] = [];
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
            return { model: this.model?.uri.toString() };
        }

        restoreViewState(state: unknown) {
            this.restored.push(state);
        }

        dispose() {
            this.disposed = true;
        }

        emit(event: ContentEvent) {
            for (const listener of this.listeners) {
                listener(event);
            }
        }

        // What typing into the editor does: the model changes and everyone showing it hears
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
        onDidChangeMarkers: vi.fn((listener: Listener<readonly Uri[]>) => {
            markerListeners.add(listener);

            return { dispose: () => markerListeners.delete(listener) };
        }),
        getModelMarkers: vi.fn(
            ({ resource }: { resource: Uri }) => markers.get(resource.toString()) ?? [],
        ),
    };

    const monaco = { editor, Uri: { parse: parseUri } };

    // What a test reaches for: the editors and models the stand-in has built, the means of
    // laying markers on a text, and a clean slate
    const stage = {
        lastEditor: () => editors[editors.length - 1],
        lastDiffEditor: () => diffEditors[diffEditors.length - 1],
        layMarkers(path: string, list: unknown[]) {
            const uri = parseUri(path);
            markers.set(uri.toString(), list);

            for (const listener of markerListeners) {
                listener([uri]);
            }
        },
        reset() {
            models.clear();
            editors.length = 0;
            diffEditors.length = 0;
            allEditors.length = 0;
            markerListeners.clear();
            markers.clear();
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

let captured: CodeEditorInstance | undefined;
let capturedDiff: CodeDiffEditorInstance | undefined;
let capturedMonaco: Monaco | undefined;

function CaptureEditor() {
    captured = useCodeEditor();

    return null;
}

function CaptureDiffEditor() {
    capturedDiff = useCodeDiffEditor();

    return null;
}

function CaptureMonaco() {
    capturedMonaco = useMonaco();

    return null;
}

const asWorker = (worker: object) => worker as unknown as Worker;

type MonacoGlobal = {
    MonacoEnvironment?: {
        baseUrl?: string;
        getWorker?: (workerId: string, label: string) => unknown;
    };
};

const environment = () => (globalThis as MonacoGlobal).MonacoEnvironment;

beforeEach(() => {
    stage.reset();
    vi.clearAllMocks();
    captured = undefined;
    capturedDiff = undefined;
    capturedMonaco = undefined;
});

afterEach(() => {
    (globalThis as MonacoGlobal).MonacoEnvironment = undefined;
});

describe("CodeEditor", () => {
    it("shows what it was given to load with until the editor stands", async () => {
        render(<CodeEditor loading={<span data-testid="loading">Loading</span>} />);
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        await waitFor(() => expect(screen.queryByTestId("loading")).not.toBeInTheDocument());
        expect(stage.lastEditor()).toBeDefined();
    });

    it("builds the editor against its own element with the text, language and options", async () => {
        await renderEditor(
            <CodeEditor
                defaultValue="let a = 1;"
                language="typescript"
                minimap={{ enabled: false }}
            />,
        );

        const editor = stage.lastEditor();
        expect(root().contains(editor.container!)).toBe(true);
        expect(editor.options).toMatchObject({
            automaticLayout: true,
            minimap: { enabled: false },
        });
        expect(editor.model?.value).toBe("let a = 1;");
        expect(editor.model?.language).toBe("typescript");
    });

    it("lets the automatic layout be turned off", async () => {
        await renderEditor(<CodeEditor automaticLayout={false} />);
        expect(stage.lastEditor().options.automaticLayout).toBe(false);
    });

    it("hands the editor and Monaco to onMount once it stands", async () => {
        const onMount = vi.fn();
        await renderEditor(<CodeEditor onMount={onMount} />);

        expect(onMount).toHaveBeenCalledTimes(1);
        const [editor, loaded] = onMount.mock.calls[0];
        expect(editor).toBe(stage.lastEditor());
        expect(loaded.editor).toBe(monaco.editor);
    });

    it("reports what is typed with the whole text", async () => {
        const onChange = vi.fn();
        await renderEditor(<CodeEditor defaultValue="" onChange={onChange} />);

        act(() => stage.lastEditor().type("typed"));
        expect(onChange).toHaveBeenCalledWith("typed", expect.objectContaining({ changes: [] }));
    });

    it("writes a new value in as one edit the reader can undo, and says nothing of it", async () => {
        const onChange = vi.fn();
        const { rerender } = await renderEditor(<CodeEditor value="one" onChange={onChange} />);
        const model = stage.lastEditor().model!;
        expect(model.edits).toEqual([]);

        rerender(<CodeEditor value="two" onChange={onChange} />);
        expect(model.value).toBe("two");
        expect(model.edits).toEqual(["two"]);
        expect(model.stops).toBe(2);
        expect(onChange).not.toHaveBeenCalled();
    });

    it("leaves a value that matches what is there alone", async () => {
        const { rerender } = await renderEditor(<CodeEditor value="same" />);
        const model = stage.lastEditor().model!;

        rerender(<CodeEditor value="same" />);
        expect(model.edits).toEqual([]);
        expect(model.stops).toBe(0);
    });

    it("changes the language of the text when told another", async () => {
        const { rerender } = await renderEditor(<CodeEditor language="typescript" />);
        const model = stage.lastEditor().model!;
        expect(monaco.editor.setModelLanguage).not.toHaveBeenCalled();

        rerender(<CodeEditor language="json" />);
        expect(monaco.editor.setModelLanguage).toHaveBeenCalledWith(model, "json");
        expect(model.language).toBe("json");
    });

    it("sets the theme on Monaco, which every editor shares", async () => {
        const { rerender } = await renderEditor(<CodeEditor theme="vs-dark" />);
        expect(stage.lastEditor().options.theme).toBe("vs-dark");
        expect(monaco.editor.setTheme).toHaveBeenCalledWith("vs-dark");

        rerender(<CodeEditor theme="hc-black" />);
        expect(monaco.editor.setTheme).toHaveBeenLastCalledWith("hc-black");
    });

    it("turns the editor read-only and back", async () => {
        const { rerender } = await renderEditor(<CodeEditor readOnly />);
        const editor = stage.lastEditor();
        expect(editor.options.readOnly).toBe(true);

        rerender(<CodeEditor />);
        expect(editor.options.readOnly).toBe(false);
    });

    it("hands changed options on and lets unchanged ones be", async () => {
        const { rerender } = await renderEditor(<CodeEditor lineNumbers="on" />);
        const editor = stage.lastEditor();
        const before = editor.updates.length;

        rerender(<CodeEditor lineNumbers="on" />);
        expect(editor.updates.length).toBe(before);

        rerender(<CodeEditor lineNumbers="off" />);
        expect(editor.updates.length).toBe(before + 1);
        expect(editor.updates[before]).toMatchObject({ lineNumbers: "off" });
    });

    it("shows the model already standing under a path rather than making another", async () => {
        const existing = monaco.editor.createModel("{}", "json", monaco.Uri.parse("data.json"));
        monaco.editor.createModel.mockClear();

        await renderEditor(<CodeEditor path="data.json" defaultValue="ignored" />);
        expect(stage.lastEditor().model).toBe(existing);
        expect(monaco.editor.createModel).not.toHaveBeenCalled();
    });

    it("moves between paths and puts the reader back where they left each", async () => {
        const { rerender } = await renderEditor(<CodeEditor path="one.ts" value="one" />);
        const editor = stage.lastEditor();
        const one = editor.model!;

        rerender(<CodeEditor path="two.ts" value="two" />);
        const two = editor.model!;
        expect(two).not.toBe(one);
        expect(two.uri.toString()).toBe("file:///two.ts");
        expect(two.value).toBe("two");
        expect(one.value).toBe("one");

        rerender(<CodeEditor path="one.ts" value="one" />);
        expect(editor.model).toBe(one);
        expect(editor.restored[editor.restored.length - 1]).toEqual({ model: "file:///one.ts" });
    });

    it("takes the models it made down with it and leaves one it found standing", async () => {
        const found = monaco.editor.createModel("{}", "json", monaco.Uri.parse("found.json"));
        const { rerender, unmount } = await renderEditor(<CodeEditor path="made.ts" />);
        const made = stage.lastEditor().model!;

        rerender(<CodeEditor path="found.json" />);
        unmount();

        expect(made.disposed).toBe(true);
        expect(found.disposed).toBe(false);
    });

    it("keeps the models it made where it is told to", async () => {
        const { unmount } = await renderEditor(<CodeEditor path="kept.ts" keepModels />);
        const kept = stage.lastEditor().model!;

        unmount();
        expect(kept.disposed).toBe(false);
    });

    it("reports the markers laid on its text and none laid elsewhere", async () => {
        const onValidate = vi.fn();
        await renderEditor(<CodeEditor path="checked.ts" onValidate={onValidate} />);

        const problems = [{ message: "Unexpected token" }];
        act(() => stage.layMarkers("checked.ts", problems));
        expect(onValidate).toHaveBeenCalledWith(problems);

        act(() => stage.layMarkers("other.ts", [{ message: "Elsewhere" }]));
        expect(onValidate).toHaveBeenCalledTimes(1);
    });

    it("puts the editor within reach of its children once it stands", async () => {
        render(
            <CodeEditor>
                <CaptureEditor />
            </CodeEditor>,
        );

        await waitFor(() => expect(captured).toBe(stage.lastEditor()));
    });

    it("takes the editor down with the component", async () => {
        const { unmount } = await renderEditor(<CodeEditor />);
        const editor = stage.lastEditor();

        unmount();
        expect(editor.disposed).toBe(true);
    });
});

describe("CodeDiffEditor", () => {
    it("builds both sides from the texts and language, with only the modified side open", async () => {
        await renderDiffEditor(
            <CodeDiffEditor original="a" modified="b" language="json" renderSideBySide={false} />,
        );

        const editor = stage.lastDiffEditor();
        expect(root("CodeDiffEditor").contains(editor.container)).toBe(true);
        expect(editor.options).toMatchObject({ automaticLayout: true, renderSideBySide: false });
        expect(editor.models?.original.value).toBe("a");
        expect(editor.models?.modified.value).toBe("b");
        expect(editor.models?.original.language).toBe("json");
        expect(editor.models?.modified.language).toBe("json");
        expect(editor.options.readOnly).toBe(false);
        expect(editor.options.originalEditable).toBe(false);
    });

    it("reports what is typed on the modified side", async () => {
        const onChange = vi.fn();
        await renderDiffEditor(<CodeDiffEditor original="a" modified="b" onChange={onChange} />);
        const editor = stage.lastDiffEditor();

        act(() => editor.modified.type("c"));
        expect(onChange).toHaveBeenCalledWith("c", expect.objectContaining({ changes: [] }));

        act(() => editor.original.type("z"));
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("writes new texts into either side where they differ", async () => {
        const onChange = vi.fn();
        const { rerender } = await renderDiffEditor(
            <CodeDiffEditor original="a" modified="b" onChange={onChange} />,
        );
        const { original, modified } = stage.lastDiffEditor().models!;

        rerender(<CodeDiffEditor original="a2" modified="b2" onChange={onChange} />);
        expect(original.value).toBe("a2");
        expect(modified.value).toBe("b2");
        expect(onChange).not.toHaveBeenCalled();
    });

    it("puts the diff editor within reach of its children", async () => {
        render(
            <CodeDiffEditor>
                <CaptureDiffEditor />
            </CodeDiffEditor>,
        );

        await waitFor(() => expect(capturedDiff).toBe(stage.lastDiffEditor()));
    });

    it("takes both models down with it", async () => {
        const { unmount } = await renderDiffEditor(<CodeDiffEditor original="a" modified="b" />);
        const editor = stage.lastDiffEditor();
        const { original, modified } = editor.models!;

        unmount();
        expect(editor.disposed).toBe(true);
        expect(original.disposed).toBe(true);
        expect(modified.disposed).toBe(true);
    });
});

describe("useMonaco", () => {
    it("hands Monaco over once it has been fetched", async () => {
        render(<CaptureMonaco />);
        await waitFor(() => expect(capturedMonaco?.editor).toBe(monaco.editor));
    });
});

describe("loadMonaco", () => {
    it("fetches Monaco once however often it is asked for", async () => {
        const first = await loadMonaco();
        expect(await loadMonaco()).toBe(first);
        expect(first.editor).toBe(monaco.editor);
    });
});

describe("setModelValue", () => {
    it("leaves a model already holding the text alone", () => {
        const fake = monaco.editor.createModel("same");
        expect(setModelValue(fake as unknown as CodeEditorModel, "same")).toBe(false);
        expect(fake.edits).toEqual([]);
    });

    it("writes the text over the model as one edit between two undo stops", () => {
        const fake = monaco.editor.createModel("before");
        expect(setModelValue(fake as unknown as CodeEditorModel, "after")).toBe(true);
        expect(fake.value).toBe("after");
        expect(fake.stops).toBe(2);
    });
});

describe("resolveCodeEditorWorkerLabel", () => {
    it("names the worker that answers for each language", () => {
        expect(resolveCodeEditorWorkerLabel("json")).toBe("json");
        expect(resolveCodeEditorWorkerLabel("scss")).toBe("css");
        expect(resolveCodeEditorWorkerLabel("less")).toBe("css");
        expect(resolveCodeEditorWorkerLabel("handlebars")).toBe("html");
        expect(resolveCodeEditorWorkerLabel("razor")).toBe("html");
        expect(resolveCodeEditorWorkerLabel("javascript")).toBe("typescript");
        expect(resolveCodeEditorWorkerLabel("editorWorkerService")).toBe("editor");
        expect(resolveCodeEditorWorkerLabel("python")).toBe("editor");
    });
});

describe("configureCodeEditorWorkers", () => {
    it("tells Monaco how to start the worker each language asks for", () => {
        const editorWorker = asWorker({});
        const cssWorker = asWorker({});
        configureCodeEditorWorkers({ editor: () => editorWorker, css: () => cssWorker });

        expect(environment()?.getWorker?.("id", "less")).toBe(cssWorker);
        expect(environment()?.getWorker?.("id", "editorWorkerService")).toBe(editorWorker);
    });

    it("throws for a worker it was not given, which Monaco takes as its cue to fall back", () => {
        configureCodeEditorWorkers({ editor: () => asWorker({}) });
        expect(() => environment()?.getWorker?.("id", "typescript")).toThrow(/typescript/);
    });

    it("leaves what else was written on the environment alone", () => {
        (globalThis as MonacoGlobal).MonacoEnvironment = { baseUrl: "/monaco/" };
        configureCodeEditorWorkers({ editor: () => asWorker({}) });

        expect(environment()?.baseUrl).toBe("/monaco/");
        expect(environment()?.getWorker).toBeDefined();
    });
});
