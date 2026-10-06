import type * as React from "react";
import type * as monaco from "monaco-editor";

// The whole of Monaco, as the module hands it over once it has been fetched: its editor and
// languages namespaces, its Uri, its key codes. It is handed to a caller alongside an editor
// rather than imported by them, since the editor is what fetched it
export type Monaco = typeof monaco;

export type CodeEditorInstance = monaco.editor.IStandaloneCodeEditor;

export type CodeDiffEditorInstance = monaco.editor.IStandaloneDiffEditor;

// The text an editor shows, with its language, its undo stack and the markers laid over it. A
// model stands apart from the editor showing it, which is what lets two editors show one text
// and one editor move between several
export type CodeEditorModel = monaco.editor.ITextModel;

export type CodeEditorOptions = monaco.editor.IStandaloneEditorConstructionOptions;

export type CodeDiffEditorOptions = monaco.editor.IStandaloneDiffEditorConstructionOptions;

export type CodeEditorChangeEvent = monaco.editor.IModelContentChangedEvent;

// A problem a language service found in the text, with where it stands and how grave it is
export type CodeEditorMarker = monaco.editor.IMarker;

// Where an editor was left: its scroll, its cursor and its selections, kept so that a model put
// back in front of a reader is as they left it
export type CodeEditorViewState = monaco.editor.ICodeEditorViewState;

export type CodeEditorThemeData = monaco.editor.IStandaloneThemeData;

// One of the themes Monaco ships with, or the name a theme was defined under
export type CodeEditorTheme = monaco.editor.BuiltinTheme | (string & Record<never, never>);

// The five workers Monaco runs its language services on. The editor's own answers for every
// language and for the diffing; the other four carry the rich services of the languages Monaco
// understands rather than merely colours, and each answers for its relations too: CSS for SCSS
// and LESS, HTML for Handlebars and Razor, TypeScript for JavaScript
export type CodeEditorWorkerLabel = "editor" | "json" | "css" | "html" | "typescript";

// How each worker is started, by the page that bundles it. A worker is a file of its own that
// only the page's bundler can place, which is why the editor asks rather than guessing
export type CodeEditorWorkers = Partial<Record<CodeEditorWorkerLabel, () => Worker>>;

// What the frame around either editor takes. Monaco fills the frame and follows it as it is
// resized, so the size is given to the frame rather than to Monaco
type CodeEditorFrameProps = {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    width?: number | string;
    height?: number | string;
    // What stands in the frame until Monaco has been fetched and the editor built
    loading?: React.ReactNode;
    // Themes are Monaco's rather than an editor's: setting one on any editor sets it on them all
    theme?: CodeEditorTheme;
    // Whether the models the editor made are left standing when it goes, so that an editor
    // opened again on the same paths finds what was written
    keepModels?: boolean;
};

// The text, its language and the model are settled through the props named here rather than
// through Monaco's own options, so that a change to any of them reaches an editor already
// standing
export type CodeEditorProps = Omit<
    CodeEditorOptions,
    "value" | "language" | "theme" | "model" | "readOnly"
> &
    CodeEditorFrameProps & {
        // The text the editor shows, written in whenever it differs from what is there; or the
        // text it starts with, read once and left to the editor from then on
        value?: string;
        defaultValue?: string;
        language?: string;
        // What the model is named, as a path or a URI. A path names a model rather than an
        // editor: two editors on one path write in the same text, and an editor moved between
        // paths keeps a model, with its undo stack and its view, for each
        path?: string;
        readOnly?: boolean;
        onChange?: (value: string, event: CodeEditorChangeEvent) => void;
        onMount?: (editor: CodeEditorInstance, monaco: Monaco) => void;
        // Called with every marker standing on the text whenever a language service changes them
        onValidate?: (markers: CodeEditorMarker[]) => void;
    };

export type CodeDiffEditorProps = Omit<
    CodeDiffEditorOptions,
    "theme" | "readOnly" | "originalEditable"
> &
    CodeEditorFrameProps & {
        original?: string;
        modified?: string;
        // The language of both sides, or of each where they differ
        language?: string;
        originalLanguage?: string;
        modifiedLanguage?: string;
        // What each side's model is named, read once when the editor is built
        originalPath?: string;
        modifiedPath?: string;
        // The modified side is written in unless the editor is read-only; the original is not
        // unless it is said to be
        readOnly?: boolean;
        originalEditable?: boolean;
        // Called as the modified side is written in
        onChange?: (value: string, event: CodeEditorChangeEvent) => void;
        onMount?: (editor: CodeDiffEditorInstance, monaco: Monaco) => void;
    };
