import * as React from "react";
import { loadMonaco } from "./loader";
import type { IDisposable } from "monaco-editor";
import type { Monaco } from "./types";

type MonacoEditorState<TEditor> = {
    monaco: Monaco;
    editor: TEditor;
};

// What either editor does, whatever it shows: it waits for Monaco, is built once against the
// element it draws into, and is taken down with the component that put it there, followed by
// whatever it was built on, so that nothing is pulled out from under it. The builder is read off
// a reference when Monaco arrives rather than closed over, since the props may have moved on
// since the render that first asked for it. A component taken down while Monaco is still on its
// way builds nothing when it lands
export const useMonacoEditor = <TEditor extends IDisposable>(
    create: (monaco: Monaco, container: HTMLDivElement) => TEditor,
    release?: () => void,
) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [state, setState] = React.useState<MonacoEditorState<TEditor>>();
    const createRef = React.useRef(create);
    const releaseRef = React.useRef(release);

    React.useEffect(() => {
        createRef.current = create;
        releaseRef.current = release;
    }, [create, release]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let editor: TEditor | undefined;
        let unmounted = false;

        loadMonaco().then((monaco) => {
            if (unmounted) return;

            editor = createRef.current(monaco, container);
            setState({ monaco, editor });
        });

        return () => {
            unmounted = true;
            editor?.dispose();
            releaseRef.current?.();
            setState(undefined);
        };
    }, []);

    return { containerRef, monaco: state?.monaco, editor: state?.editor };
};
