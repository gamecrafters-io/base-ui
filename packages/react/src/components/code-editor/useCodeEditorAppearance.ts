import * as React from "react";
import { CODE_EDITOR_THEME, readCodeEditorAppearance } from "./codeEditorAppearance";
import type { Monaco } from "../../lib/code-editor";
import type { CodeEditorAppearance } from "./CodeEditor.types";

// What the stylesheet says the editor is drawn like, read off the element it stands in and
// handed to Monaco as its theme. It is read off the element rather than passed in, so it cannot
// be read until there is an element to read it from, and it is read again whenever the scheme
// changes: the tokens are scoped to `[data-theme]`, which is set on an element above the editor
// rather than on the editor itself, so what is watched is the document for that one attribute.
//
// What comes back is also what the editor is told about its font, since Monaco measures the text
// itself rather than leaving the lines to the page
export const useCodeEditorAppearance = (
    monaco: Monaco | undefined,
    rootRef: React.RefObject<HTMLElement | null>,
) => {
    const [appearance, setAppearance] = React.useState<CodeEditorAppearance>();

    React.useEffect(() => {
        const element = rootRef.current;
        if (!element) return;

        const read = () => setAppearance(readCodeEditorAppearance(element));

        read();

        if (typeof MutationObserver === "undefined") return;

        const observer = new MutationObserver(read);

        observer.observe(element.ownerDocument.documentElement, {
            attributeFilter: ["data-theme"],
            subtree: true,
        });

        return () => observer.disconnect();
    }, [rootRef]);

    // The theme is defined again rather than switched, since there is one to a page and it is
    // the colours under it that have changed. Monaco paints every editor standing on the page
    // with it as soon as it is set
    React.useEffect(() => {
        if (!monaco || !appearance) return;

        monaco.editor.defineTheme(CODE_EDITOR_THEME, {
            base: appearance.base,
            inherit: true,
            rules: appearance.rules,
            colors: appearance.colors,
        });
        monaco.editor.setTheme(CODE_EDITOR_THEME);
    }, [monaco, appearance]);

    return appearance;
};
