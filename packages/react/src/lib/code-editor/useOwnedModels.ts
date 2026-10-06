import * as React from "react";
import { resolveModel } from "./model";
import type { CodeEditorModel, Monaco } from "./types";

// The models an editor made, kept so that they can be taken down with it. A model found already
// standing under its path is not among them: it is left to whoever made it. Releasing them
// disposes of each, unless they are to be kept for an editor opened later on the same paths, in
// which case they are only let go of here
export const useOwnedModels = (keepModels: boolean | undefined) => {
    const modelsRef = React.useRef<Set<CodeEditorModel> | null>(null);
    const keepModelsRef = React.useRef(keepModels);

    if (!modelsRef.current) {
        modelsRef.current = new Set();
    }

    const models = modelsRef.current;

    React.useEffect(() => {
        keepModelsRef.current = keepModels;
    }, [keepModels]);

    // The model for the path, or a new one holding the text, remembered where it was made here
    const open = React.useCallback(
        (monaco: Monaco, value: string, language: string | undefined, path?: string) => {
            const { model, created } = resolveModel(monaco, value, language, path);

            if (created) {
                models.add(model);
            }

            return model;
        },
        [models],
    );

    const release = React.useCallback(() => {
        if (!keepModelsRef.current) {
            for (const model of models) {
                model.dispose();
            }
        }

        models.clear();
    }, [models]);

    return { open, release };
};
