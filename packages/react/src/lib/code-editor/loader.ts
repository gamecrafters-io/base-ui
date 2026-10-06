import type { Monaco } from "./types";

// Monaco is fetched the first time anything asks for it and never again. It is not imported with
// the library, for two reasons: the module reads the window as it loads, so a page rendered on a
// server before it reaches a browser would fall over on the import, and it weighs more than the
// rest of the library together, which a page that never shows an editor should not pay for.
// Every editor and every caller reaching for the namespace waits on the same promise, so Monaco
// is fetched once however many are waiting
let monacoPromise: Promise<Monaco> | undefined;

export const loadMonaco = (): Promise<Monaco> => {
    if (!monacoPromise) {
        monacoPromise = import("monaco-editor");
    }

    return monacoPromise;
};
