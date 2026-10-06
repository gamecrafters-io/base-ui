/**
 * Code Editor library
 *
 * The Monaco editor, which is the editor VS Code is built on, drawn into a React element and told
 * what to hold through props: an editor for one text and a diff editor for two. Monaco is fetched
 * the first time an editor is shown rather than imported with the library, since it reads the
 * window as it loads and weighs more than the rest of the library together.
 *
 *     <CodeEditor language="typescript" defaultValue={source} onChange={setSource} height={400} />
 *
 * An editor fills whatever it is put in and follows it as it is resized, so it is given a height,
 * as a prop or by its parent. Its language services run on web workers that only the page's
 * bundler can place, which the page supplies through `configureCodeEditorWorkers`; without them
 * the editor still edits and colours every language, and Monaco says that it is doing the rest on
 * the main thread.
 */

export { CodeEditor } from "./CodeEditor";
export { CodeDiffEditor } from "./CodeDiffEditor";
export { CodeEditorContext } from "./CodeEditorContext";
export { CodeDiffEditorContext } from "./CodeDiffEditorContext";
export { useCodeEditor } from "./useCodeEditor";
export { useCodeDiffEditor } from "./useCodeDiffEditor";
export { useMonaco } from "./useMonaco";
export { loadMonaco } from "./loader";
export { configureCodeEditorWorkers, resolveCodeEditorWorkerLabel } from "./environment";
export { resolveModel, setModelValue } from "./model";

export type {
    CodeDiffEditorInstance,
    CodeDiffEditorOptions,
    CodeDiffEditorProps,
    CodeEditorChangeEvent,
    CodeEditorInstance,
    CodeEditorMarker,
    CodeEditorModel,
    CodeEditorOptions,
    CodeEditorProps,
    CodeEditorTheme,
    CodeEditorThemeData,
    CodeEditorViewState,
    CodeEditorWorkerLabel,
    CodeEditorWorkers,
    Monaco,
} from "./types";
