import { createContext } from "react";
import type { GlobeInstance } from "./types";

// A globe cannot be built until the canvas it draws into is there, which is one render later than
// the children that read it. The context therefore starts out empty rather than keeping those
// children from rendering, and everything reading it waits for the globe to arrive
export const GlobeContext = createContext<GlobeInstance | undefined>(undefined);
