import * as React from "react";
import { CodeDiffEditorContext } from "./CodeDiffEditorContext";
import { setModelValue } from "./model";
import { useEditorOptions } from "./useEditorOptions";
import { useMonacoEditor } from "./useMonacoEditor";
import { useOwnedModels } from "./useOwnedModels";
import type { CodeDiffEditorProps, CodeEditorModel, Monaco } from "./types";

// Two texts side by side, with what changed between them marked: the original on the left, read
// and not written in unless it is said to be, and the modified on the right, which is where the
// edits land and what `onChange` reports. Each side has a model of its own, made from the text
// and the language it was given or found standing under its path, and a text passed to either
// side afterwards is written in where it differs, the way an editor's value is.
//
// The paths are read once, when the editor is built: a diff is of two texts rather than of
// whichever two files are open, so an editor comparing others is built afresh
function CodeDiffEditor({
    children,
    className,
    style,
    width,
    height,
    loading,
    original,
    modified,
    language,
    originalLanguage,
    modifiedLanguage,
    originalPath,
    modifiedPath,
    keepModels,
    theme,
    readOnly,
    originalEditable,
    onChange,
    onMount,
    ...options
}: CodeDiffEditorProps) {
    const onChangeRef = React.useRef(onChange);
    const onMountRef = React.useRef(onMount);

    React.useEffect(() => {
        onChangeRef.current = onChange;
        onMountRef.current = onMount;
    }, [onChange, onMount]);

    const initial = {
        original,
        modified,
        language,
        originalLanguage,
        modifiedLanguage,
        originalPath,
        modifiedPath,
        theme,
        readOnly,
        originalEditable,
        options,
    };
    const initialRef = React.useRef(initial);

    React.useEffect(() => {
        initialRef.current = initial;
    });

    const writingRef = React.useRef(false);

    const { open, release } = useOwnedModels(keepModels);

    const create = React.useCallback(
        (monaco: Monaco, container: HTMLDivElement) => {
            const first = initialRef.current;

            const editor = monaco.editor.createDiffEditor(container, {
                automaticLayout: true,
                ...first.options,
                theme: first.theme,
                readOnly: first.readOnly,
                originalEditable: first.originalEditable,
            });

            editor.setModel({
                original: open(
                    monaco,
                    first.original ?? "",
                    first.originalLanguage ?? first.language,
                    first.originalPath,
                ),
                modified: open(
                    monaco,
                    first.modified ?? "",
                    first.modifiedLanguage ?? first.language,
                    first.modifiedPath,
                ),
            });

            onMountRef.current?.(editor, monaco);

            return editor;
        },
        [open],
    );

    const { containerRef, monaco, editor } = useMonacoEditor(create, release);

    // Only the modified side is reported: it is the one being written in, and what a caller
    // keeping the modified text wants back
    React.useEffect(() => {
        if (!editor) return;

        const modifiedEditor = editor.getModifiedEditor();

        const listener = modifiedEditor.onDidChangeModelContent((event) => {
            if (writingRef.current) return;
            onChangeRef.current?.(modifiedEditor.getValue(), event);
        });

        return () => listener.dispose();
    }, [editor]);

    React.useEffect(() => {
        const model = editor?.getModel()?.original;
        if (!model || original === undefined) return;

        setModelValue(model, original);
    }, [editor, original]);

    React.useEffect(() => {
        const model = editor?.getModel()?.modified;
        if (!model || modified === undefined) return;

        writingRef.current = true;
        setModelValue(model, modified);
        writingRef.current = false;
    }, [editor, modified]);

    React.useEffect(() => {
        const models = editor?.getModel();
        if (!monaco || !models) return;

        const sides: [CodeEditorModel, string | undefined][] = [
            [models.original, originalLanguage ?? language],
            [models.modified, modifiedLanguage ?? language],
        ];

        for (const [model, sideLanguage] of sides) {
            if (sideLanguage !== undefined && model.getLanguageId() !== sideLanguage) {
                monaco.editor.setModelLanguage(model, sideLanguage);
            }
        }
    }, [monaco, editor, language, originalLanguage, modifiedLanguage]);

    React.useEffect(() => {
        if (!monaco || theme === undefined) return;
        monaco.editor.setTheme(theme);
    }, [monaco, theme]);

    React.useEffect(() => {
        editor?.updateOptions({
            readOnly: readOnly ?? false,
            originalEditable: originalEditable ?? false,
        });
    }, [editor, readOnly, originalEditable]);

    useEditorOptions(editor, options);

    return (
        <CodeDiffEditorContext.Provider value={editor}>
            <div
                className={className}
                style={{
                    position: "relative",
                    width: width ?? "100%",
                    height: height ?? "100%",
                    ...style,
                }}
                data-component="CodeDiffEditor"
            >
                <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
                {!editor && loading}
                {children}
            </div>
        </CodeDiffEditorContext.Provider>
    );
}

CodeDiffEditor.displayName = "CodeDiffEditor";

export { CodeDiffEditor };
