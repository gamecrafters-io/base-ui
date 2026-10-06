import { useContext } from "react";
import { CodeDiffEditorContext } from "./CodeDiffEditorContext";

// The diff editor the nearest `CodeDiffEditor` above put within reach, or undefined until it has
// been built
export const useCodeDiffEditor = () => useContext(CodeDiffEditorContext);
