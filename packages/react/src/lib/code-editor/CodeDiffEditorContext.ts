import { createContext } from "react";
import type { CodeDiffEditorInstance } from "./types";

// A diff editor arrives the way an editor does, after Monaco has been fetched and after the
// children that read it have rendered, so the context starts out empty and they wait for it
export const CodeDiffEditorContext = createContext<CodeDiffEditorInstance | undefined>(undefined);
