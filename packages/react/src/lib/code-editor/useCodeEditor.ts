import { useContext } from "react";
import { CodeEditorContext } from "./CodeEditorContext";

// The editor the nearest `CodeEditor` above put within reach. It comes back undefined until that
// editor has been built, which is what anything attaching itself to an editor waits on
export const useCodeEditor = () => useContext(CodeEditorContext);
