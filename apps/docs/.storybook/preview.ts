import type { Preview, Renderer } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import CssWorker from "monaco-editor/languages/features/css/css.worker?worker";
import HtmlWorker from "monaco-editor/languages/features/html/html.worker?worker";
import JsonWorker from "monaco-editor/languages/features/json/json.worker?worker";
import TsWorker from "monaco-editor/languages/features/typescript/ts.worker?worker";
import { configureCodeEditorWorkers } from "../../../packages/react/src/lib/code-editor";
import "../../../packages/react/src/styles/main.css";

// The code editor runs its language services on web workers, each a file of its own that only
// the bundler can place, so the Storybook says how each is started before any story shows an
// editor. Vite bundles a worker from an import ending in `?worker`, and Monaco asks for one by
// the language it is reading
configureCodeEditorWorkers({
    editor: () => new EditorWorker(),
    css: () => new CssWorker(),
    html: () => new HtmlWorker(),
    json: () => new JsonWorker(),
    typescript: () => new TsWorker(),
});

const preview: Preview = {
    // The design tokens in styles/themes are scoped to [data-theme], so stories only
    // resolve them once the attribute is set on the preview
    decorators: [
        withThemeByDataAttribute<Renderer>({
            themes: {
                light: "light",
                dark: "dark",
            },
            defaultTheme: "light",
            attributeName: "data-theme",
        }),
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        // The sidebar reads in the order the library is learnt in: what it is and how to install
        // it, then what it is drawn from, then what an application wraps itself in before any of
        // it will draw, then the components themselves, and last the hooks the components are
        // built out of — which are read once someone is composing something of their own rather
        // than reaching for a component. Overview is ordered the same way inside, from getting it
        // running to what it is. Anything not named here follows in the order Storybook would
        // have put it in on its own
        options: {
            storySort: {
                order: [
                    "Overview",
                    ["Installation", "Community", "Contributing", "About"],
                    "Primitives",
                    "Providers",
                    ["ThemeProvider", "DirectionProvider", "LocaleProvider"],
                    "Components",
                    "Hooks",
                ],
            },
        },
        a11y: {
            context: "body",
            config: {},
            options: {},
        },
        docs: {
            codePanel: true,
        },
    },
    initialGlobals: {
        a11y: {
            manual: false,
        },
    },
};

export default preview;
