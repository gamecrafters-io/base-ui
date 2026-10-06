import { createContext } from "react";
import type { CodeEditorInstance } from "./types";

// An editor cannot be built until Monaco has been fetched and the element it draws into is there,
// which is later than the children that attach themselves to it. The context therefore starts
// out empty rather than keeping those children from rendering, and everything reading it waits
// for the editor to arrive
export const CodeEditorContext = createContext<CodeEditorInstance | undefined>(undefined);
