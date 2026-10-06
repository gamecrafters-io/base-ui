import * as React from "react";

type Updatable<TOptions> = {
    updateOptions: (options: TOptions) => void;
};

// Whether the two sets of options agree, read key by key rather than by the objects they arrive
// in, which are fresh ones on every render
const sameOptions = (previous: object, next: object) => {
    const previousKeys = Object.keys(previous);
    const nextKeys = Object.keys(next);

    return (
        previousKeys.length === nextKeys.length &&
        previousKeys.every((key) =>
            Object.is(
                (previous as Record<string, unknown>)[key],
                (next as Record<string, unknown>)[key],
            ),
        )
    );
};

// Hands the editor whatever options it is given again whenever one of them changes. Monaco takes
// the lot and settles for itself which differ, so an option written as an object on every render
// costs it a comparison and nothing more. The editor was built with the first set, so the first
// round after it stands only remembers them
export const useEditorOptions = <TOptions extends object>(
    editor: Updatable<TOptions> | undefined,
    options: TOptions,
) => {
    const appliedRef = React.useRef<TOptions | undefined>(undefined);

    React.useEffect(() => {
        if (!editor) return;

        const applied = appliedRef.current;
        appliedRef.current = options;

        if (applied === undefined || sameOptions(applied, options)) return;

        editor.updateOptions(options);
    });
};
