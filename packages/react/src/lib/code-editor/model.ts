import type { CodeEditorModel, Monaco } from "./types";

// The model to show: the one already standing under the path, where there is one, or a new one
// holding the text it was given. A model given no path is the editor's alone, named by Monaco.
// Whether the model was made here is said alongside it, since what was made here is what is
// taken down here
export const resolveModel = (
    monaco: Monaco,
    value: string,
    language: string | undefined,
    path?: string,
) => {
    if (path === undefined) {
        return { model: monaco.editor.createModel(value, language), created: true };
    }

    const uri = monaco.Uri.parse(path);
    const existing = monaco.editor.getModel(uri);

    if (existing) {
        return { model: existing, created: false };
    }

    return { model: monaco.editor.createModel(value, language, uri), created: true };
};

// Writes the text over what the model holds, as one edit the reader can undo, and only where it
// differs: a caller echoing back what they were just given moves nothing. The whole text is
// replaced rather than set, since setting it would throw the undo stack away with it
export const setModelValue = (model: CodeEditorModel, value: string) => {
    if (model.getValue() === value) return false;

    model.pushStackElement();
    model.pushEditOperations(null, [{ range: model.getFullModelRange(), text: value }], () => null);
    model.pushStackElement();

    return true;
};
