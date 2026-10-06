import type { Environment } from "monaco-editor";
import type { CodeEditorWorkerLabel, CodeEditorWorkers } from "./types";

// Monaco looks for how to start its workers on the global, under this name, whichever module
// of it asks
type MonacoGlobal = typeof globalThis & {
    MonacoEnvironment?: Environment;
};

// Which worker Monaco means by each label it asks for one under. The CSS worker also reads SCSS
// and LESS, the HTML worker Handlebars and Razor, and the TypeScript worker JavaScript. Anything
// else, the editor's own services included, is answered with the editor worker
const WORKER_LABELS: Record<string, CodeEditorWorkerLabel> = {
    json: "json",
    css: "css",
    scss: "css",
    less: "css",
    html: "html",
    handlebars: "html",
    razor: "html",
    typescript: "typescript",
    javascript: "typescript",
};

export const resolveCodeEditorWorkerLabel = (label: string): CodeEditorWorkerLabel =>
    WORKER_LABELS[label] ?? "editor";

// Tells Monaco how to start its workers. Monaco runs its language services, and the diffing, on
// web workers, each a file of its own that only the page's bundler can place, so the page says
// how each is started and this is written where Monaco looks for it. With Vite, which bundles a
// worker from an import ending in `?worker`, that reads:
//
//     import EditorWorker from "monaco-editor/editor/editor.worker?worker";
//     import TsWorker from "monaco-editor/languages/features/typescript/ts.worker?worker";
//
//     configureCodeEditorWorkers({
//         editor: () => new EditorWorker(),
//         typescript: () => new TsWorker(),
//     });
//
// The other three stand beside the TypeScript one, as `json/json.worker`, `css/css.worker` and
// `html/html.worker`. Asking for a worker that was not given throws, which Monaco catches: it
// warns that it is running the editor's own services on the main thread instead, and the editor
// works on, more slowly on a long file and without the rich services of that language.
//
// Whatever else was written on the environment, such as a base URL or a trusted types policy,
// is left as it was
export const configureCodeEditorWorkers = (workers: CodeEditorWorkers) => {
    const monacoGlobal = globalThis as MonacoGlobal;
    const environment: Environment = monacoGlobal.MonacoEnvironment ?? {};

    environment.getWorker = (_workerId: string, label: string) => {
        const start = workers[resolveCodeEditorWorkerLabel(label)];

        if (!start) {
            throw new Error(`No worker is configured for the "${label}" code editor services`);
        }

        return start();
    };

    monacoGlobal.MonacoEnvironment = environment;
};
