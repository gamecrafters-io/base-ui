import * as React from "react";

const PREFERS_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// `matchMedia` is not there on the server, and not there in jsdom either, so every reach for it
// is guarded and the answer falls back to a reader who has asked for nothing
const subscribe = (onStoreChange: () => void) => {
    const mediaQueryList = window?.matchMedia?.(PREFERS_REDUCED_MOTION_QUERY);
    mediaQueryList?.addEventListener("change", onStoreChange);

    return () => mediaQueryList?.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => !!window?.matchMedia?.(PREFERS_REDUCED_MOTION_QUERY)?.matches;

const getServerSnapshot = () => false;

// Whether the reader has asked for less movement. What the page draws for its own sake stops
// where they have; what they set going themselves is theirs to set going
export const useReducedMotion = () =>
    React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
