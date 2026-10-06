import type { Registry } from "../registry/registry.types";
import { fence, reply } from "./format";
import type { RegisterTool } from "./tools.types";

const DESCRIPTION =
    "What an application does once, before any Base UI component is written into it: the " +
    "package it installs, the stylesheet it imports, the providers it wraps itself in for " +
    "the design tokens to resolve under, and the workers the code editor runs on. Ask for " +
    "this first when working against the library for the first time in a codebase, since a " +
    "component drawn without them comes out unstyled.";

export const registerGetSetupGuide: RegisterTool = (server, registry) => {
    server.registerTool(
        "get_setup_guide",
        {
            title: "Get the Base UI setup guide",
            description: DESCRIPTION,
        },
        () => reply(guide(registry)),
    );
};

const guide = (registry: Registry): string => {
    const stylesheet = `${registry.package}/main.css`;

    const themed = [
        `import { ThemeProvider } from "${registry.import}";`,
        `import "${stylesheet}";`,
        "",
        "const App = ({ children }: { children: React.ReactNode }) => (",
        '    <ThemeProvider colorMode="auto">{children}</ThemeProvider>',
        ");",
    ].join("\n");

    // The one component that asks for a step of its own: Monaco runs its language services on
    // web workers, each a file the application's bundler has to place, so the application says
    // how each is started. The paths are the ones the monaco-editor package publishes them under
    const workers = [
        `import { configureCodeEditorWorkers } from "${registry.import}";`,
        'import EditorWorker from "monaco-editor/editor/editor.worker?worker";',
        'import CssWorker from "monaco-editor/languages/features/css/css.worker?worker";',
        'import HtmlWorker from "monaco-editor/languages/features/html/html.worker?worker";',
        'import JsonWorker from "monaco-editor/languages/features/json/json.worker?worker";',
        'import TsWorker from "monaco-editor/languages/features/typescript/ts.worker?worker";',
        "",
        "configureCodeEditorWorkers({",
        "    editor: () => new EditorWorker(),",
        "    css: () => new CssWorker(),",
        "    html: () => new HtmlWorker(),",
        "    json: () => new JsonWorker(),",
        "    typescript: () => new TsWorker(),",
        "});",
    ].join("\n");

    return [
        `# ${registry.package} ${registry.version}`,
        "An implementation of GameCrafters' Base UI Design System in React. Every component " +
            `is imported by name from \`${registry.import}\`, however deep inside the library ` +
            "it is written.",

        "## Installing",
        fence("sh", `npm install ${registry.package}`),
        "React and `react-dom` are peer dependencies, asked for as `^18` or `^19` rather " +
            "than carried, so the components are drawn by the copy of React the application " +
            "already has.",

        "## The stylesheet",
        "One stylesheet stands behind the whole library and is imported once, at the root of " +
            "the application. It carries the design tokens both schemes are drawn from, the " +
            "styles every component is drawn by, and the layers those are built on.",
        fence("tsx", `import "${stylesheet}";`),

        "## The theme",
        "The tokens are scoped to `[data-theme]`, so importing the stylesheet is not on its " +
            "own enough: they resolve only once something has set the attribute, which is " +
            "what `ThemeProvider` is for. A component drawn outside one comes out unstyled.",
        fence("tsx", themed),
        "`colorMode` takes `day`, `night` or `auto`, and `auto` follows the operating " +
            "system. A nested `ThemeProvider` only has to say what it changes, so a subtree " +
            "can hold a scheme of its own.",

        "## Reading direction",
        "A subtree that is read right to left is wrapped in a `DirectionProvider`, which " +
            "takes `ltr` or `rtl`.",
        fence("tsx", '<DirectionProvider direction="rtl">{children}</DirectionProvider>'),

        "## The code editor",
        "`CodeEditor` and `CodeDiffEditor` are the Monaco editor, which is fetched the first " +
            "time one is shown rather than loaded with the page. Its language services run on " +
            "web workers that only the application's bundler can place, so the application " +
            "says once, before any editor is shown, how each worker is started. Monaco comes " +
            "with the package; an application that imports its workers lists `monaco-editor` " +
            "among its own dependencies as well. With Vite, which bundles a worker from an " +
            "import ending in `?worker`:",
        fence("tsx", workers),
        "Without this the editor still edits and colours every language, and Monaco warns " +
            "that it is running the editor's own services on the main thread; TypeScript, " +
            "JavaScript, JSON, CSS and HTML lose their completions and problems.",

        "## Writing against the library",
        [
            "- `list_components` — what the library has, which is worth reading before " +
                "anything is built that it may already hold",
            "- `get_component` — every prop of one of them, with what it is for and the " +
                "values it takes",
            "- `get_component_examples` — the same component as it is already written, " +
                "which settles what nests inside what",
            "- `list_tokens` — the colours, sizes and durations to reach for in place of a " +
                "literal, so that anything written beside the library follows the scheme it " +
                "is already in",
        ].join("\n"),
    ].join("\n\n");
};
