import * as React from "react";
import { CodeEditorContext } from "./CodeEditorContext";
import { setModelValue } from "./model";
import { useEditorOptions } from "./useEditorOptions";
import { useMonacoEditor } from "./useMonacoEditor";
import { useOwnedModels } from "./useOwnedModels";
import type { CodeEditorProps, CodeEditorViewState, Monaco } from "./types";

// A code editor, and the ground everything attached to one stands on. Monaco draws into the
// element the component renders, fills it, and follows it as it is resized; whatever is attached
// to the editor is written as children, which reach it through `useCodeEditor` once it stands.
//
// What the editor holds is its own once it is built: Monaco keeps the text, the cursor and the
// undo stack. A `value` passed afterwards is written in only where it differs from what is there,
// so a caller echoing back what `onChange` gave them moves nothing, while a caller handing over
// new text sees it land as one edit the reader can undo. A `defaultValue` is read once.
//
// A `path` names the model rather than the editor. An editor moved from one path to another
// keeps each model standing, with its undo stack and where the reader left it, so a caller
// switching between files gets each back as it was. The models an editor made are taken down
// with it unless it is told to keep them; one it found already standing is left to whoever made
// it
function CodeEditor({
    children,
    className,
    style,
    width,
    height,
    loading,
    value,
    defaultValue,
    language,
    path,
    keepModels,
    theme,
    readOnly,
    onChange,
    onMount,
    onValidate,
    ...options
}: CodeEditorProps) {
    // The callbacks are read off references rather than closed over, so a caller passing a fresh
    // function on every render does not have the editor's listeners taken down and put back
    const onChangeRef = React.useRef(onChange);
    const onMountRef = React.useRef(onMount);
    const onValidateRef = React.useRef(onValidate);

    React.useEffect(() => {
        onChangeRef.current = onChange;
        onMountRef.current = onMount;
        onValidateRef.current = onValidate;
    }, [onChange, onMount, onValidate]);

    // What the editor is built with is read when Monaco arrives rather than when the component
    // first rendered, since the props may have moved on in between
    const initial = { value, defaultValue, language, path, theme, readOnly, options };
    const initialRef = React.useRef(initial);

    React.useEffect(() => {
        initialRef.current = initial;
    });

    // Writing a value in fires the same event typing does, and the caller who passed the value
    // has no need to hear it back
    const writingRef = React.useRef(false);

    // Where the reader was left on each model the editor has moved away from, by its URI
    const viewStatesRef = React.useRef<Map<string, CodeEditorViewState | null> | null>(null);

    if (!viewStatesRef.current) {
        viewStatesRef.current = new Map();
    }

    const viewStates = viewStatesRef.current;

    const { open, release } = useOwnedModels(keepModels);

    const create = React.useCallback(
        (monaco: Monaco, container: HTMLDivElement) => {
            const first = initialRef.current;
            const model = open(
                monaco,
                first.value ?? first.defaultValue ?? "",
                first.language,
                first.path,
            );

            const editor = monaco.editor.create(container, {
                // The editor follows the element it draws into as that is resized, unless told
                // otherwise
                automaticLayout: true,
                ...first.options,
                model,
                theme: first.theme,
                readOnly: first.readOnly,
            });

            onMountRef.current?.(editor, monaco);

            return editor;
        },
        [open],
    );

    const { containerRef, monaco, editor } = useMonacoEditor(create, release);

    // Edits are reported with the whole text, which is what a caller keeping the value wants
    // back. The listener follows the editor rather than the model, so it hears a model the editor
    // was moved to as readily as the one it was built with
    React.useEffect(() => {
        if (!editor) return;

        const listener = editor.onDidChangeModelContent((event) => {
            if (writingRef.current) return;
            onChangeRef.current?.(editor.getValue(), event);
        });

        return () => listener.dispose();
    }, [editor]);

    // Markers are Monaco's, laid by whichever language service read the text, and are reported
    // when the ones on this editor's text change rather than when any change anywhere
    React.useEffect(() => {
        if (!monaco || !editor) return;

        const listener = monaco.editor.onDidChangeMarkers((uris) => {
            const model = editor.getModel();
            if (!model) return;

            const resource = model.uri.toString();
            if (!uris.some((uri) => uri.toString() === resource)) return;

            onValidateRef.current?.(monaco.editor.getModelMarkers({ resource: model.uri }));
        });

        return () => listener.dispose();
    }, [monaco, editor]);

    // Moving to another path puts that path's model in front of the reader, where they left it,
    // and keeps where they were on the one being left so that coming back finds it the same
    React.useEffect(() => {
        if (!monaco || !editor || path === undefined) return;

        const current = editor.getModel();
        const uri = monaco.Uri.parse(path).toString();
        if (current?.uri.toString() === uri) return;

        if (current) {
            viewStates.set(current.uri.toString(), editor.saveViewState());
        }

        editor.setModel(open(monaco, value ?? defaultValue ?? "", language, path));
        editor.restoreViewState(viewStates.get(uri) ?? null);
        // The text and the language are only what a model made for the path starts with, so
        // this follows the path alone
    }, [monaco, editor, path]);

    React.useEffect(() => {
        const model = editor?.getModel();
        if (!model || value === undefined) return;

        writingRef.current = true;
        setModelValue(model, value);
        writingRef.current = false;
    }, [editor, value]);

    React.useEffect(() => {
        const model = editor?.getModel();
        if (!monaco || !model || language === undefined) return;

        if (model.getLanguageId() !== language) {
            monaco.editor.setModelLanguage(model, language);
        }
    }, [monaco, editor, language]);

    React.useEffect(() => {
        if (!monaco || theme === undefined) return;
        monaco.editor.setTheme(theme);
    }, [monaco, theme]);

    React.useEffect(() => {
        editor?.updateOptions({ readOnly: readOnly ?? false });
    }, [editor, readOnly]);

    useEditorOptions(editor, options);

    return (
        <CodeEditorContext.Provider value={editor}>
            <div
                className={className}
                style={{
                    position: "relative",
                    width: width ?? "100%",
                    height: height ?? "100%",
                    ...style,
                }}
                data-component="CodeEditor"
            >
                <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
                {!editor && loading}
                {children}
            </div>
        </CodeEditorContext.Provider>
    );
}

CodeEditor.displayName = "CodeEditor";

export { CodeEditor };
