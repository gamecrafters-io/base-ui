export { default as CodeEditor } from "./CodeEditor";
export { default as CodeDiffEditor } from "./CodeDiffEditor";
export { DEFAULT_CODE_EDITOR_OPTIONS, DEFAULT_CODE_EDITOR_TAB_SIZE } from "./CodeEditor";
export { CODE_EDITOR_THEME, readCodeEditorAppearance } from "./codeEditorAppearance";
export { useCodeEditorAppearance } from "./useCodeEditorAppearance";
export {
    configureCodeEditorWorkers,
    loadMonaco,
    resolveCodeEditorWorkerLabel,
    useCodeDiffEditor,
    useCodeEditor,
    useMonaco,
} from "../../lib/code-editor";
export type {
    CodeDiffEditorInstance,
    CodeDiffEditorOptions,
    CodeEditorChangeEvent,
    CodeEditorInstance,
    CodeEditorMarker,
    CodeEditorModel,
    CodeEditorOptions,
    CodeEditorTheme,
    CodeEditorThemeData,
    CodeEditorViewState,
    CodeEditorWorkerLabel,
    CodeEditorWorkers,
    Monaco,
} from "../../lib/code-editor";
export * from "./CodeEditor.types";
